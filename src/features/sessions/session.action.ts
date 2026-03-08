"use server";

import * as Sentry from "@sentry/nextjs";
import {
  OperationalEventLevel,
  Prisma,
  ProductAnalyticsEventName,
  SessionMode,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getUser } from "@/lib/auth/auth-user";
import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import {
  canAccessModuleSlug,
  canAccessQuestionIds,
  getUserEntitlementSnapshot,
} from "@/features/billing/user-entitlements";
import {
  captureOperationalEvent,
  captureProductAnalyticsEvent,
  getErrorMessage,
  getErrorMetadata,
  toContentLocale,
} from "@/features/telemetry/telemetry";
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
  isPassingAttemptReview,
  toAttemptReviewData,
} from "./attempt-review";
import type { RecordAttemptActionState } from "./session-attempt.state";
import { computeQuestionProgressUpdate } from "./session-progress";
import { computeSkillProgressSnapshot } from "./skill-progress";
import {
  mockTemplateKeys,
  parseTrainingSessionConfig,
} from "./session-contract";
import { calculateTrainingSessionScore } from "./session-score";
import { getSessionRubricCriteria } from "./session-rubric";

const localeSchema = z.enum(["fr", "en"]);

const createSessionSchema = z.object({
  mode: z.nativeEnum(SessionMode),
  locale: localeSchema,
  questionCount: z.coerce.number().int().min(1).max(20).optional(),
  moduleSlug: z.string().trim().optional(),
  templateKey: z.enum(mockTemplateKeys).optional(),
  questionIds: z.array(z.string().trim().min(1)).default([]),
});

const recordAttemptSchema = z.object({
  sessionId: z.string().trim().min(1),
  questionId: z.string().trim().min(1),
  selectedOptionIds: z.array(z.string().trim().min(1)).default([]),
  responseText: z.string().optional(),
  responseCode: z.string().optional(),
  responseLanguage: z.string().optional(),
  responseSummary: z.string().optional(),
  selectedLineNumbers: z.array(z.coerce.number().int().min(1)).default([]),
  timeSpentMs: z.coerce.number().int().min(0).max(7_200_000).optional(),
});

const reviewPendingAttemptSchema = z.object({
  attemptId: z.string().trim().min(1),
  reviewSummary: z.string().trim().max(1000).optional(),
  presetVerdict: z.enum(attemptReviewVerdicts).optional(),
});

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
          question: {
            select: {
              format: true,
              difficulty: true,
            },
          },
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
      score: calculateTrainingSessionScore({
        attempts: session.attempts,
        mode: session.mode,
        config: parseTrainingSessionConfig(session.config),
      }),
    },
  });
}

async function captureSessionCompletionTelemetry(params: {
  userId: string;
  sessionId: string;
  mode: SessionMode;
  score: number | null;
  source: string;
  completionType: "manual_finish" | "auto_completion";
}) {
  await captureProductAnalyticsEvent({
    userId: params.userId,
    name:
      params.mode === SessionMode.MOCK_INTERVIEW
        ? ProductAnalyticsEventName.MOCK_COMPLETED
        : ProductAnalyticsEventName.SESSION_COMPLETED,
    source: params.source,
    sessionMode: params.mode,
    trainingSessionId: params.sessionId,
    metadata: {
      score: params.score,
      completionType: params.completionType,
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
  const signalDetails = skillProgressSnapshot.signalDetails as Prisma.InputJsonValue;

  await tx.skillProgress.upsert({
    where: {
      userId_skillId: {
        userId: params.userId,
        skillId: params.primarySkillId,
      },
    },
    update: {
      masteryScore: skillProgressSnapshot.masteryScore,
      masteryCap: skillProgressSnapshot.masteryCap,
      correctRate: skillProgressSnapshot.correctRate,
      coverageCount: skillProgressSnapshot.coverageCount,
      recentAttemptCount: skillProgressSnapshot.recentAttemptCount,
      uniqueQuestionCount: skillProgressSnapshot.uniqueQuestionCount,
      uniqueDifficultyCount: skillProgressSnapshot.uniqueDifficultyCount,
      recentFailureCount: skillProgressSnapshot.recentFailureCount,
      confidenceScore: skillProgressSnapshot.confidenceScore,
      signalDetails,
      lastAttemptAt: skillProgressSnapshot.lastAttemptAt,
    },
    create: {
      userId: params.userId,
      skillId: params.primarySkillId,
      masteryScore: skillProgressSnapshot.masteryScore,
      masteryCap: skillProgressSnapshot.masteryCap,
      correctRate: skillProgressSnapshot.correctRate,
      coverageCount: skillProgressSnapshot.coverageCount,
      recentAttemptCount: skillProgressSnapshot.recentAttemptCount,
      uniqueQuestionCount: skillProgressSnapshot.uniqueQuestionCount,
      uniqueDifficultyCount: skillProgressSnapshot.uniqueDifficultyCount,
      recentFailureCount: skillProgressSnapshot.recentFailureCount,
      confidenceScore: skillProgressSnapshot.confidenceScore,
      signalDetails,
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
            question: {
              select: {
                format: true,
                difficulty: true,
              },
            },
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
        score: calculateTrainingSessionScore({
          attempts: session.attempts,
          mode: session.mode,
          config: parseTrainingSessionConfig(session.config),
        }),
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

  if (result) {
    await captureSessionCompletionTelemetry({
      userId: user.id,
      sessionId: result.id,
      mode: result.mode,
      score: result.score ?? null,
      source: "session.action.finish",
      completionType: "manual_finish",
    });
  }

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
    questionIds: formData.getAll("questionIds").map(String),
  });

  if (!parsed.success) {
    redirect("/dashboard");
  }

  const entitlement = await getUserEntitlementSnapshot(user.id);

  if (
    parsed.data.mode === SessionMode.MOCK_INTERVIEW &&
    !entitlement.canStartMockInterview
  ) {
    redirect("/dashboard/mock-interviews");
  }

  if (
    parsed.data.mode !== SessionMode.REVIEW &&
    parsed.data.moduleSlug &&
    !(await canAccessModuleSlug({
      userId: user.id,
      moduleSlug: parsed.data.moduleSlug,
    }))
  ) {
    redirect("/dashboard/modules");
  }

  if (
    parsed.data.mode !== SessionMode.REVIEW &&
    parsed.data.questionIds.length > 0 &&
    !(await canAccessQuestionIds({
      userId: user.id,
      questionIds: parsed.data.questionIds,
    }))
  ) {
    redirect("/dashboard");
  }

  const session = await createTrainingSession({
    userId: user.id,
    mode: parsed.data.mode,
    locale: parsed.data.locale as Locale,
    questionCount: parsed.data.questionCount,
    moduleSlug: parsed.data.moduleSlug,
    templateKey: parsed.data.templateKey,
    questionIds: parsed.data.questionIds,
  });

  await captureProductAnalyticsEvent({
    userId: user.id,
    name:
      parsed.data.mode === SessionMode.REVIEW
        ? ProductAnalyticsEventName.REVIEW_LAUNCHED
        : ProductAnalyticsEventName.SESSION_STARTED,
    source: "session.action.create",
    sessionMode: session.mode,
    locale: toContentLocale(parsed.data.locale),
    trainingSessionId: session.id,
    moduleSlug: parsed.data.moduleSlug ?? null,
    metadata: {
      questionCount: session.questionCount,
      templateKey: parsed.data.templateKey ?? null,
      selectedQuestionCount: parsed.data.questionIds.length,
      resumed: session.resumed,
    },
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
    responseLanguage:
      String(formData.get("responseLanguage") ?? "") || undefined,
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
            question: {
              select: {
                format: true,
                difficulty: true,
              },
            },
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
        difficulty: true,
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

    const transactionResult = await prisma.$transaction(async (tx) => {
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
      const nextAttempts = existingAttempt
        ? session.attempts
        : [
            ...session.attempts,
            {
              questionId: parsed.data.questionId,
              isCorrect,
              reviewData: null,
              question: {
                format: question.format,
                difficulty: question.difficulty,
              },
            },
          ];

      if (answeredQuestionIds.size >= session.items.length) {
        const completedSession = await tx.trainingSession.update({
          where: {
            id: parsed.data.sessionId,
          },
          data: {
            endedAt: now,
            score: calculateTrainingSessionScore({
              attempts: nextAttempts,
              mode: session.mode,
              config: sessionConfig,
            }),
          },
        });

        return {
          createdAttempt: !existingAttempt,
          completedSession: {
            id: completedSession.id,
            mode: completedSession.mode,
            score: completedSession.score ?? null,
          },
        };
      }

      return {
        createdAttempt: !existingAttempt,
        completedSession: null,
      };
    });

    if (transactionResult.createdAttempt) {
      await captureProductAnalyticsEvent({
        userId: user.id,
        name: ProductAnalyticsEventName.QUESTION_ANSWERED,
        source: "session.action.record_attempt",
        sessionMode: session.mode,
        trainingSessionId: parsed.data.sessionId,
        questionId: parsed.data.questionId,
        metadata: {
          feedbackStatus,
          automaticScoring: evaluation !== null,
          timeSpentMs: parsed.data.timeSpentMs ?? null,
        },
      });
    }

    if (transactionResult.completedSession) {
      await captureSessionCompletionTelemetry({
        userId: user.id,
        sessionId: transactionResult.completedSession.id,
        mode: transactionResult.completedSession.mode,
        score: transactionResult.completedSession.score,
        source: "session.action.record_attempt",
        completionType: "auto_completion",
      });
    }

    revalidatePath("/dashboard");
    revalidatePath("/dashboard/progress");
    revalidatePath("/dashboard/review");
    revalidatePath("/dashboard/mock-interviews");

    return {
      status: "success",
      feedbackStatus,
      formError: null,
    };
  } catch (error) {
    Sentry.captureException(error);
    await captureOperationalEvent({
      userId: user.id,
      source: "session.action",
      eventType: "record_attempt_failed",
      level: OperationalEventLevel.ERROR,
      status: "failed",
      message: getErrorMessage(error),
      metadata: {
        error: getErrorMetadata(error) ?? null,
        sessionId: parsed.data.sessionId,
        questionId: parsed.data.questionId,
      },
    });

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
