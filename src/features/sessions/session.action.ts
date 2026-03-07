"use server";

import { Prisma, SessionMode } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getUser } from "@/lib/auth/auth-user";
import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { createTrainingSession } from "./session-builder";
import {
  buildAttemptResponse,
  evaluateAttemptResponse,
  supportsAutomaticAttemptScoring,
  supportsLiveQuestionFormat,
  toAttemptResponseData,
} from "./attempt-response";
import {
  attemptReviewVerdicts,
  buildAttemptReview,
  getAttemptScorePercent,
  isPassingAttemptReview,
  toAttemptReviewData,
} from "./attempt-review";
import type { RecordAttemptActionState } from "./session-attempt.state";
import { computeQuestionProgressUpdate } from "./session-progress";
import { computeSkillProgressSnapshot } from "./skill-progress";
import { mockTemplateKeys, parseTrainingSessionConfig } from "./session-contract";
import { getSessionRubricCriteria } from "./session-rubric";

const localeSchema = z.enum(["fr", "en"]);

const createSessionSchema = z.object({
  mode: z.nativeEnum(SessionMode),
  locale: localeSchema,
  questionCount: z.coerce.number().int().min(1).max(20).optional(),
  moduleSlug: z.string().trim().optional(),
  templateKey: z.enum(mockTemplateKeys).optional(),
});

const recordAttemptSchema = z.object({
  sessionId: z.string().trim().min(1),
  questionId: z.string().trim().min(1),
  selectedOptionIds: z.array(z.string().trim().min(1)).default([]),
  responseText: z.string().optional(),
  responseCode: z.string().optional(),
  responseLanguage: z.string().optional(),
  responseSummary: z.string().optional(),
  selectedLineNumbers: z
    .array(z.coerce.number().int().min(1))
    .default([]),
  timeSpentMs: z.coerce.number().int().min(0).max(7_200_000).optional(),
});

const reviewPendingAttemptSchema = z.object({
  attemptId: z.string().trim().min(1),
  reviewSummary: z.string().trim().max(1000).optional(),
  presetVerdict: z.enum(attemptReviewVerdicts).optional(),
});

function calculateTrainingSessionScore(
  attempts: Array<{
    isCorrect: boolean | null;
    reviewData: Prisma.JsonValue | null;
  }>,
) {
  const scoredAttempts = attempts.flatMap((attempt) => {
    const scorePercent = getAttemptScorePercent({
      isCorrect: attempt.isCorrect,
      reviewData: attempt.reviewData,
    });

    return scorePercent === null ? [] : [scorePercent];
  });

  return scoredAttempts.length > 0
    ? Math.round(
        scoredAttempts.reduce((sum, scorePercent) => sum + scorePercent, 0) /
          scoredAttempts.length,
      )
    : null;
}

async function refreshTrainingSessionScore(
  tx: Prisma.TransactionClient,
  params: {
    sessionId: string;
    userId: string;
  },
) {
  const session = await tx.trainingSession.findFirst({
    where: {
      id: params.sessionId,
      userId: params.userId,
    },
    include: {
      attempts: {
        where: {
          userId: params.userId,
        },
        select: {
          isCorrect: true,
          reviewData: true,
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  return tx.trainingSession.update({
    where: {
      id: params.sessionId,
    },
    data: {
      score: calculateTrainingSessionScore(session.attempts),
    },
  });
}

async function refreshQuestionAndSkillProgress(
  tx: Prisma.TransactionClient,
  params: {
    userId: string;
    questionId: string;
    primarySkillId: string;
    isCorrect: boolean;
    now: Date;
  },
) {
  const previousProgress = await tx.questionProgress.findUnique({
    where: {
      userId_questionId: {
        userId: params.userId,
        questionId: params.questionId,
      },
    },
  });

  const nextProgress = computeQuestionProgressUpdate(
    previousProgress,
    params.isCorrect,
    params.now,
  );

  await tx.questionProgress.upsert({
    where: {
      userId_questionId: {
        userId: params.userId,
        questionId: params.questionId,
      },
    },
    update: nextProgress,
    create: {
      userId: params.userId,
      questionId: params.questionId,
      ...nextProgress,
    },
  });

  const skillAttempts = await tx.attempt.findMany({
    where: {
      userId: params.userId,
      isCorrect: {
        not: null,
      },
      question: {
        primarySkillId: params.primarySkillId,
      },
    },
    select: {
      questionId: true,
      isCorrect: true,
      createdAt: true,
      question: {
        select: {
          difficulty: true,
        },
      },
    },
  });

  const skillProgressSnapshot = computeSkillProgressSnapshot(
    skillAttempts.map((attempt) => ({
      questionId: attempt.questionId,
      isCorrect: attempt.isCorrect === true,
      createdAt: attempt.createdAt,
      difficulty: attempt.question.difficulty,
    })),
    params.now,
  );

  await tx.skillProgress.upsert({
    where: {
      userId_skillId: {
        userId: params.userId,
        skillId: params.primarySkillId,
      },
    },
    update: {
      masteryScore: skillProgressSnapshot.masteryScore,
      correctRate: skillProgressSnapshot.correctRate,
      coverageCount: skillProgressSnapshot.coverageCount,
      uniqueQuestionCount: skillProgressSnapshot.uniqueQuestionCount,
      uniqueDifficultyCount: skillProgressSnapshot.uniqueDifficultyCount,
      recentFailureCount: skillProgressSnapshot.recentFailureCount,
      confidenceScore: skillProgressSnapshot.confidenceScore,
      lastAttemptAt: skillProgressSnapshot.lastAttemptAt,
    },
    create: {
      userId: params.userId,
      skillId: params.primarySkillId,
      masteryScore: skillProgressSnapshot.masteryScore,
      correctRate: skillProgressSnapshot.correctRate,
      coverageCount: skillProgressSnapshot.coverageCount,
      uniqueQuestionCount: skillProgressSnapshot.uniqueQuestionCount,
      uniqueDifficultyCount: skillProgressSnapshot.uniqueDifficultyCount,
      recentFailureCount: skillProgressSnapshot.recentFailureCount,
      confidenceScore: skillProgressSnapshot.confidenceScore,
      lastAttemptAt: skillProgressSnapshot.lastAttemptAt,
    },
  });
}

async function finalizeTrainingSession(params: {
  sessionId: string;
  userId: string;
  endedAt: Date;
}) {
  return prisma.$transaction(async (tx) => {
    const session = await tx.trainingSession.findFirst({
      where: {
        id: params.sessionId,
        userId: params.userId,
      },
      include: {
        _count: {
          select: {
            items: true,
          },
        },
        attempts: {
          where: {
            userId: params.userId,
          },
          select: {
            isCorrect: true,
            reviewData: true,
          },
        },
      },
    });

    if (!session || session.endedAt) {
      return null;
    }
    return tx.trainingSession.update({
      where: {
        id: params.sessionId,
      },
      data: {
        endedAt: params.endedAt,
        score: calculateTrainingSessionScore(session.attempts),
      },
    });
  });
}

export async function finishTrainingSessionAction(sessionId: string) {
  const user = await getUser();

  if (!user) {
    return { status: "unauthorized" as const };
  }

  const result = await finalizeTrainingSession({
    sessionId,
    userId: user.id,
    endedAt: new Date(),
  });

  revalidatePath(`/dashboard/session/${sessionId}`);
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/progress");
  revalidatePath("/dashboard/review");
  revalidatePath("/dashboard/mock-interviews");

  return {
    status: result ? ("completed" as const) : ("noop" as const),
  };
}

export async function createTrainingSessionAction(formData: FormData) {
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin?callbackUrl=%2Fdashboard");
  }

  const parsed = createSessionSchema.safeParse({
    mode: String(formData.get("mode") ?? ""),
    locale: String(formData.get("locale") ?? ""),
    questionCount: formData.get("questionCount") ?? undefined,
    moduleSlug: String(formData.get("moduleSlug") ?? "") || undefined,
    templateKey: String(formData.get("templateKey") ?? "") || undefined,
  });

  if (!parsed.success) {
    redirect("/dashboard");
  }

  const session = await createTrainingSession({
    userId: user.id,
    mode: parsed.data.mode,
    locale: parsed.data.locale as Locale,
    questionCount: parsed.data.questionCount,
    moduleSlug: parsed.data.moduleSlug,
    templateKey: parsed.data.templateKey,
  });

  redirect(`/dashboard/session/${session.id}`);
}

export async function recordTrainingSessionAttemptAction(
  _previousState: RecordAttemptActionState,
  formData: FormData,
): Promise<RecordAttemptActionState> {
  const user = await getUser();

  if (!user) {
    return {
      status: "error",
      feedbackStatus: null,
      formError: "unauthorized",
    };
  }

  const parsed = recordAttemptSchema.safeParse({
    sessionId: String(formData.get("sessionId") ?? ""),
    questionId: String(formData.get("questionId") ?? ""),
    selectedOptionIds: formData.getAll("selectedOptionIds").map(String),
    responseText: String(formData.get("responseText") ?? "") || undefined,
    responseCode: String(formData.get("responseCode") ?? "") || undefined,
    responseLanguage: String(formData.get("responseLanguage") ?? "") || undefined,
    responseSummary: String(formData.get("responseSummary") ?? "") || undefined,
    selectedLineNumbers: formData.getAll("selectedLineNumbers").map(Number),
    timeSpentMs: formData.get("timeSpentMs") ?? undefined,
  });

  if (!parsed.success) {
    return {
      status: "error",
      feedbackStatus: null,
      formError: "invalid",
    };
  }

  const selectedOptionIds = Array.from(new Set(parsed.data.selectedOptionIds));

  try {
    const session = await prisma.trainingSession.findFirst({
      where: {
        id: parsed.data.sessionId,
        userId: user.id,
      },
      select: {
        id: true,
        mode: true,
        startedAt: true,
        endedAt: true,
        config: true,
        items: {
          orderBy: {
            order: "asc",
          },
          select: {
            questionId: true,
          },
        },
        attempts: {
          where: {
            userId: user.id,
          },
          select: {
            questionId: true,
            isCorrect: true,
            reviewData: true,
          },
        },
      },
    });

    const question = await prisma.question.findUnique({
      where: {
        id: parsed.data.questionId,
      },
      select: {
        id: true,
        format: true,
        primarySkillId: true,
        options: {
          select: {
            id: true,
            isCorrect: true,
          },
        },
      },
    });

    if (!session || !question) {
      return {
        status: "error",
        feedbackStatus: null,
        formError: "invalid",
      };
    }

    if (
      session.endedAt ||
      !session.items.some((item) => item.questionId === parsed.data.questionId)
    ) {
      return {
        status: "error",
        feedbackStatus: null,
        formError: "invalid",
      };
    }

    const now = new Date();
    const sessionConfig = parseTrainingSessionConfig(session.config);
    const sessionDeadlineAt =
      session.mode === SessionMode.MOCK_INTERVIEW &&
      sessionConfig?.durationMinutes &&
      sessionConfig.durationMinutes > 0
        ? new Date(
            session.startedAt.getTime() +
              sessionConfig.durationMinutes * 60 * 1000,
          )
        : null;

    if (sessionDeadlineAt && sessionDeadlineAt <= now) {
      await finalizeTrainingSession({
        sessionId: parsed.data.sessionId,
        userId: user.id,
        endedAt: now,
      });

      revalidatePath(`/dashboard/session/${parsed.data.sessionId}`);
      revalidatePath("/dashboard");
      revalidatePath("/dashboard/progress");
      revalidatePath("/dashboard/review");
      revalidatePath("/dashboard/mock-interviews");

      return {
        status: "error",
        feedbackStatus: null,
        formError: "expired",
      };
    }

    if (!supportsLiveQuestionFormat(question.format)) {
      return {
        status: "error",
        feedbackStatus: null,
        formError: "unsupported",
      };
    }

    const response = buildAttemptResponse({
      questionFormat: question.format,
      selectedOptionIds,
      responseText: parsed.data.responseText,
      responseCode: parsed.data.responseCode,
      responseLanguage: parsed.data.responseLanguage,
      responseSummary: parsed.data.responseSummary,
      selectedLineNumbers: parsed.data.selectedLineNumbers,
    });

    if (!response) {
      return {
        status: "error",
        feedbackStatus: null,
        formError: "invalid",
      };
    }

    const evaluation = supportsAutomaticAttemptScoring(question.format)
      ? evaluateAttemptResponse({
          questionFormat: question.format,
          options: question.options,
          response,
        })
      : null;

    if (supportsAutomaticAttemptScoring(question.format) && !evaluation) {
      return {
        status: "error",
        feedbackStatus: null,
        formError: "unsupported",
      };
    }

    const selectedOptionIdsForAttempt =
      response.kind === "option_selection" ? response.selectedOptionIds : [];
    const isCorrect = evaluation?.isCorrect ?? null;
    const feedbackStatus =
      isCorrect === true
        ? "correct"
        : isCorrect === false
          ? "incorrect"
          : "pending_review";

    await prisma.$transaction(async (tx) => {
      const existingAttempt = await tx.attempt.findFirst({
        where: {
          userId: user.id,
          sessionId: parsed.data.sessionId,
          questionId: parsed.data.questionId,
        },
      });

      if (!existingAttempt) {
        await tx.attempt.create({
          data: {
            userId: user.id,
            questionId: parsed.data.questionId,
            sessionId: parsed.data.sessionId,
            selectedOptionIds: selectedOptionIdsForAttempt,
            responseData: toAttemptResponseData(response),
            isCorrect,
            timeSpentMs: parsed.data.timeSpentMs,
            mode: session.mode,
          },
        });
      }

      if (!existingAttempt && isCorrect !== null) {
        await refreshQuestionAndSkillProgress(tx, {
          userId: user.id,
          questionId: parsed.data.questionId,
          primarySkillId: question.primarySkillId,
          isCorrect,
          now,
        });
      }

      const answeredQuestionIds = new Set([
        ...session.attempts.map((attempt) => attempt.questionId),
        parsed.data.questionId,
      ]);
      const correctAnswers = session.attempts.filter(
        (attempt) => attempt.isCorrect === true,
      ).length;
      const gradedAnswers = session.attempts.filter(
        (attempt) =>
          getAttemptScorePercent({
            isCorrect: attempt.isCorrect,
            reviewData: attempt.reviewData,
          }) !== null,
      ).length;
      const nextCorrectAnswers = existingAttempt
        ? correctAnswers
        : correctAnswers + (isCorrect === true ? 1 : 0);
      const nextGradedAnswers = existingAttempt
        ? gradedAnswers
        : gradedAnswers + (isCorrect !== null ? 1 : 0);

      if (answeredQuestionIds.size >= session.items.length) {
        await tx.trainingSession.update({
          where: {
            id: parsed.data.sessionId,
          },
          data: {
            endedAt: now,
            score:
              nextGradedAnswers > 0
                ? Math.round((nextCorrectAnswers / nextGradedAnswers) * 100)
                : null,
          },
        });
      }
    });

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/progress");
    revalidatePath("/dashboard/review");
    revalidatePath("/dashboard/mock-interviews");

    return {
      status: "success",
      feedbackStatus,
      formError: null,
    };
  } catch {
    return {
      status: "error",
      feedbackStatus: null,
      formError: "unknown",
    };
  }
}

export async function reviewPendingAttemptAction(formData: FormData) {
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin?callbackUrl=%2Fdashboard%2Freview");
  }

  const parsed = reviewPendingAttemptSchema.safeParse({
    attemptId: String(formData.get("attemptId") ?? ""),
    reviewSummary: String(formData.get("reviewSummary") ?? "") || undefined,
    presetVerdict: String(formData.get("presetVerdict") ?? "") || undefined,
  });

  if (!parsed.success) {
    return;
  }

  const now = new Date();

  const reviewedAttempt = await prisma.$transaction(async (tx) => {
    const attempt = await tx.attempt.findFirst({
      where: {
        id: parsed.data.attemptId,
        userId: user.id,
        isCorrect: null,
      },
      select: {
        id: true,
        questionId: true,
        sessionId: true,
        question: {
          select: {
            primarySkillId: true,
            format: true,
          },
        },
      },
    });

    if (!attempt || supportsAutomaticAttemptScoring(attempt.question.format)) {
      return null;
    }

    const review = buildAttemptReview({
      format: attempt.question.format,
      summary: parsed.data.reviewSummary,
      presetVerdict: parsed.data.presetVerdict,
      criteriaVerdicts: getSessionRubricCriteria(attempt.question.format).map(
        (criterion) => ({
          criterion,
          verdict: String(formData.get(`criterion_${criterion}`) ?? ""),
        }),
      ),
    });

    if (!review) {
      return null;
    }

    const isCorrect = isPassingAttemptReview(review);

    await tx.attempt.update({
      where: {
        id: attempt.id,
      },
      data: {
        isCorrect,
        reviewData: toAttemptReviewData(review),
        reviewedAt: now,
      },
    });

    await refreshQuestionAndSkillProgress(tx, {
      userId: user.id,
      questionId: attempt.questionId,
      primarySkillId: attempt.question.primarySkillId,
      isCorrect,
      now,
    });

    if (attempt.sessionId) {
      await refreshTrainingSessionScore(tx, {
        sessionId: attempt.sessionId,
        userId: user.id,
      });
    }

    return {
      sessionId: attempt.sessionId,
    };
  });

  revalidatePath("/dashboard");
  revalidatePath("/dashboard/progress");
  revalidatePath("/dashboard/review");
  revalidatePath("/dashboard/session");

  if (reviewedAttempt?.sessionId) {
    revalidatePath(`/dashboard/session/${reviewedAttempt.sessionId}`);
  }
}
