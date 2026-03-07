"use server";

import { SessionMode } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getUser } from "@/lib/auth/auth-user";
import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { createTrainingSession } from "./session-builder";
import type { RecordAttemptActionState } from "./session-attempt.state";
import { computeQuestionProgressUpdate } from "./session-progress";
import { computeSkillProgressSnapshot } from "./skill-progress";
import { mockTemplateKeys, parseTrainingSessionConfig } from "./session-contract";

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
  selectedOptionIds: z.array(z.string().trim().min(1)).min(1),
});

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
          },
        },
      },
    });

    if (!session || session.endedAt) {
      return null;
    }

    const totalQuestions = session._count.items;
    const correctAnswers = session.attempts.filter((attempt) => attempt.isCorrect).length;
    const score =
      totalQuestions > 0
        ? Math.round((correctAnswers / totalQuestions) * 100)
        : 0;

    return tx.trainingSession.update({
      where: {
        id: params.sessionId,
      },
      data: {
        endedAt: params.endedAt,
        score,
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
      formError: "unauthorized",
    };
  }

  const parsed = recordAttemptSchema.safeParse({
    sessionId: String(formData.get("sessionId") ?? ""),
    questionId: String(formData.get("questionId") ?? ""),
    selectedOptionIds: formData.getAll("selectedOptionIds").map(String),
  });

  if (!parsed.success) {
    return {
      status: "error",
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
        formError: "invalid",
      };
    }

    if (
      session.endedAt ||
      !session.items.some((item) => item.questionId === parsed.data.questionId)
    ) {
      return {
        status: "error",
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
        formError: "expired",
      };
    }

    const correctOptionIds = question.options
      .filter((option) => option.isCorrect)
      .map((option) => option.id)
      .sort();
    const normalizedSelectedOptionIds = [...selectedOptionIds].sort();
    const isCorrect =
      correctOptionIds.length === normalizedSelectedOptionIds.length &&
      correctOptionIds.every((optionId, index) => optionId === normalizedSelectedOptionIds[index]);

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
            selectedOptionIds,
            isCorrect,
            mode: session.mode,
          },
        });
      }

      const previousProgress = await tx.questionProgress.findUnique({
        where: {
          userId_questionId: {
            userId: user.id,
            questionId: parsed.data.questionId,
          },
        },
      });

      const nextProgress = computeQuestionProgressUpdate(
        previousProgress,
        isCorrect,
        now,
      );

      await tx.questionProgress.upsert({
        where: {
          userId_questionId: {
            userId: user.id,
            questionId: parsed.data.questionId,
          },
        },
        update: nextProgress,
        create: {
          userId: user.id,
          questionId: parsed.data.questionId,
          ...nextProgress,
        },
      });

      const skillAttempts = await tx.attempt.findMany({
        where: {
          userId: user.id,
          question: {
            primarySkillId: question.primarySkillId,
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
          isCorrect: attempt.isCorrect,
          createdAt: attempt.createdAt,
          difficulty: attempt.question.difficulty,
        })),
        now,
      );

      await tx.skillProgress.upsert({
        where: {
          userId_skillId: {
            userId: user.id,
            skillId: question.primarySkillId,
          },
        },
        update: {
          masteryScore: skillProgressSnapshot.masteryScore,
          correctRate: skillProgressSnapshot.correctRate,
        },
        create: {
          userId: user.id,
          skillId: question.primarySkillId,
          masteryScore: skillProgressSnapshot.masteryScore,
          correctRate: skillProgressSnapshot.correctRate,
        },
      });

      const answeredQuestionIds = new Set([
        ...session.attempts.map((attempt) => attempt.questionId),
        parsed.data.questionId,
      ]);
      const correctAnswers = session.attempts.filter((attempt) => attempt.isCorrect).length;
      const nextCorrectAnswers = existingAttempt
        ? correctAnswers
        : correctAnswers + (isCorrect ? 1 : 0);

      if (answeredQuestionIds.size >= session.items.length) {
        await tx.trainingSession.update({
          where: {
            id: parsed.data.sessionId,
          },
          data: {
            endedAt: now,
            score: Math.round((nextCorrectAnswers / session.items.length) * 100),
          },
        });
      }
    });

    revalidatePath(`/dashboard/session/${parsed.data.sessionId}`);
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/progress");
    revalidatePath("/dashboard/review");
    revalidatePath("/dashboard/mock-interviews");

    return {
      status: "success",
      formError: null,
    };
  } catch {
    return {
      status: "error",
      formError: "unknown",
    };
  }
}
