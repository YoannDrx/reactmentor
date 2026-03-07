import {
  MasteryState,
  Prisma,
  QuestionFormat,
  QuestionLevel,
  SessionMode,
  Track,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  CreateTrainingSessionInput,
  MockTemplateKey,
  TrainingSessionConfig,
} from "./session-contract";
import {
  mockTemplateDefinitions,
  parseTrainingSessionConfig,
  resolveTrainingSessionInput,
} from "./session-contract";

function buildQuestionWhere(input: {
  moduleSlug?: string;
  tracks?: Track[];
  level?: QuestionLevel;
}) {
  const where: Prisma.QuestionWhereInput = {
    status: "published",
    format: QuestionFormat.SINGLE_CHOICE,
  };

  if (input.level) {
    where.level = input.level;
  }

  if (input.moduleSlug || (input.tracks && input.tracks.length > 0)) {
    where.module = {
      ...(input.moduleSlug ? { slug: input.moduleSlug } : {}),
      ...(input.tracks && input.tracks.length > 0
        ? {
            track: {
              in: input.tracks,
            },
          }
        : {}),
    };
  }

  return where;
}

function buildReviewProgressWhere(input: {
  userId: string;
  moduleSlug?: string;
  tracks?: Track[];
  level?: QuestionLevel;
  now: Date;
}) {
  return {
    userId: input.userId,
    nextReviewAt: {
      lte: input.now,
    },
    question: buildQuestionWhere({
      moduleSlug: input.moduleSlug,
      tracks: input.tracks,
      level: input.level,
    }),
  } satisfies Prisma.QuestionProgressWhereInput;
}

function scoreCandidate(candidate: {
  difficulty: number;
  progress: Array<{
    masteryState: MasteryState;
    lastAttemptAt: Date | null;
  }>;
  attempts: Array<{
    createdAt: Date;
  }>;
  mode: SessionMode;
}) {
  const progress = candidate.progress[0] ?? null;
  const lastAttemptAt = progress?.lastAttemptAt ?? candidate.attempts[0]?.createdAt ?? null;
  let score = 0;

  if (!progress) {
    score += 120;
  } else if (progress.masteryState === MasteryState.NEW) {
    score += 105;
  } else if (progress.masteryState === MasteryState.LEARNING) {
    score += 92;
  } else if (progress.masteryState === MasteryState.REVIEWING) {
    score += 74;
  } else {
    score += 48;
  }

  if (!lastAttemptAt) {
    score += 24;
  } else {
    const daysSinceLastAttempt = Math.floor(
      (Date.now() - lastAttemptAt.getTime()) / (1000 * 60 * 60 * 24),
    );
    score += Math.min(20, Math.max(0, daysSinceLastAttempt));
  }

  if (candidate.mode === SessionMode.MOCK_INTERVIEW) {
    score += candidate.difficulty * 3;
  } else {
    score += Math.max(0, 5 - candidate.difficulty);
  }

  return score;
}

function scoreReviewCandidate(candidate: {
  difficulty: number;
  masteryState: MasteryState;
  nextReviewAt: Date | null;
  lastAttemptAt: Date | null;
  now: Date;
}) {
  let score = 0;

  if (candidate.masteryState === MasteryState.NEW) {
    score += 110;
  } else if (candidate.masteryState === MasteryState.LEARNING) {
    score += 96;
  } else if (candidate.masteryState === MasteryState.REVIEWING) {
    score += 82;
  } else {
    score += 60;
  }

  if (candidate.nextReviewAt) {
    const overdueDays = Math.max(
      0,
      differenceInCalendarDays(candidate.now, candidate.nextReviewAt),
    );
    score += Math.min(48, overdueDays * 12);
  }

  if (candidate.lastAttemptAt) {
    const daysSinceLastAttempt = Math.max(
      0,
      differenceInCalendarDays(candidate.now, candidate.lastAttemptAt),
    );
    score += Math.min(18, daysSinceLastAttempt);
  } else {
    score += 18;
  }

  score += candidate.difficulty * 2;

  return score;
}

function differenceInCalendarDays(left: Date, right: Date) {
  const leftDate = new Date(left);
  leftDate.setHours(0, 0, 0, 0);
  const rightDate = new Date(right);
  rightDate.setHours(0, 0, 0, 0);

  return Math.floor(
    (leftDate.getTime() - rightDate.getTime()) / (1000 * 60 * 60 * 24),
  );
}

export async function countQuestionsForSessionInput(input: {
  moduleSlug?: string;
  tracks?: Track[];
  level?: QuestionLevel;
}) {
  return prisma.question.count({
    where: buildQuestionWhere(input),
  });
}

export async function getMockTemplateAvailabilities() {
  const entries = await Promise.all(
    Object.entries(mockTemplateDefinitions).map(async ([key, template]) => {
      const count = await countQuestionsForSessionInput({
        tracks: template.tracks,
        level: template.level,
      });

      return [key, count] as const;
    }),
  );

  return Object.fromEntries(entries) as Record<MockTemplateKey, number>;
}

export async function createTrainingSession(input: CreateTrainingSessionInput) {
  const resolvedInput = resolveTrainingSessionInput(input);
  const questionCount = Math.max(1, resolvedInput.questionCount);
  const source = resolvedInput.templateKey ? "mock_template" : "module";
  const activeSessions = await prisma.trainingSession.findMany({
    where: {
      userId: resolvedInput.userId,
      mode: resolvedInput.mode,
      endedAt: null,
    },
    orderBy: {
      startedAt: "desc",
    },
    take: 10,
  });
  const activeSessionMatch = activeSessions.find((session) => {
    const config = parseTrainingSessionConfig(session.config);

    if (!config || config.source !== source) {
      return false;
    }

    if ((config.moduleSlug ?? null) !== (resolvedInput.moduleSlug ?? null)) {
      return false;
    }

    if ((config.templateKey ?? null) !== (resolvedInput.templateKey ?? null)) {
      return false;
    }

    if ((config.level ?? null) !== (resolvedInput.level ?? null)) {
      return false;
    }

    return true;
  });

  if (activeSessionMatch) {
    const resumedConfig =
      parseTrainingSessionConfig(activeSessionMatch.config) ??
      ({
        source,
        locale: resolvedInput.locale,
        questionCount,
        moduleSlug: resolvedInput.moduleSlug ?? null,
        tracks: resolvedInput.tracks,
        level: resolvedInput.level ?? null,
        templateKey: resolvedInput.templateKey ?? null,
      } satisfies TrainingSessionConfig);

    return {
      id: activeSessionMatch.id,
      questionCount: resumedConfig.questionCount,
      mode: activeSessionMatch.mode,
      config: resumedConfig,
      resumed: true,
    };
  }

  const where = buildQuestionWhere({
    moduleSlug: resolvedInput.moduleSlug,
    tracks: resolvedInput.tracks,
    level: resolvedInput.level,
  });
  const now = new Date();

  const selectedQuestionIds =
    resolvedInput.mode === SessionMode.REVIEW
      ? (
          await prisma.questionProgress.findMany({
            where: buildReviewProgressWhere({
              userId: resolvedInput.userId,
              moduleSlug: resolvedInput.moduleSlug,
              tracks: resolvedInput.tracks,
              level: resolvedInput.level,
              now,
            }),
            select: {
              questionId: true,
              masteryState: true,
              nextReviewAt: true,
              lastAttemptAt: true,
              question: {
                select: {
                  difficulty: true,
                },
              },
            },
          })
        )
          .map((candidate) => ({
            id: candidate.questionId,
            difficulty: candidate.question.difficulty,
            score: scoreReviewCandidate({
              difficulty: candidate.question.difficulty,
              masteryState: candidate.masteryState,
              nextReviewAt: candidate.nextReviewAt,
              lastAttemptAt: candidate.lastAttemptAt,
              now,
            }),
          }))
          .sort((left, right) => {
            if (right.score !== left.score) {
              return right.score - left.score;
            }

            return right.difficulty - left.difficulty;
          })
          .slice(0, questionCount)
          .map((candidate) => candidate.id)
      : (
          await prisma.question.findMany({
            where,
            include: {
              progress: {
                where: {
                  userId: resolvedInput.userId,
                },
                select: {
                  masteryState: true,
                  lastAttemptAt: true,
                },
                take: 1,
              },
              attempts: {
                where: {
                  userId: resolvedInput.userId,
                },
                select: {
                  createdAt: true,
                },
                orderBy: {
                  createdAt: "desc",
                },
                take: 1,
              },
            },
          })
        )
          .map((candidate) => ({
            id: candidate.id,
            difficulty: candidate.difficulty,
            score: scoreCandidate({
              difficulty: candidate.difficulty,
              progress: candidate.progress,
              attempts: candidate.attempts,
              mode: resolvedInput.mode,
            }),
          }))
          .sort((left, right) => {
            if (right.score !== left.score) {
              return right.score - left.score;
            }

            if (resolvedInput.mode === SessionMode.MOCK_INTERVIEW) {
              return right.difficulty - left.difficulty;
            }

            return left.difficulty - right.difficulty;
          })
          .slice(0, questionCount)
          .map((candidate) => candidate.id);

  if (selectedQuestionIds.length === 0) {
    throw new Error("No questions are available for this session.");
  }

  const config: TrainingSessionConfig = {
    source: resolvedInput.templateKey ? "mock_template" : "module",
    locale: resolvedInput.locale,
    questionCount: selectedQuestionIds.length,
    durationMinutes: resolvedInput.durationMinutes ?? null,
    moduleSlug: resolvedInput.moduleSlug ?? null,
    tracks: resolvedInput.tracks,
    level: resolvedInput.level ?? null,
    templateKey: resolvedInput.templateKey ?? null,
  };

  const session = await prisma.$transaction(async (tx) => {
    const createdSession = await tx.trainingSession.create({
      data: {
        userId: resolvedInput.userId,
        mode: resolvedInput.mode,
        config: config as Prisma.InputJsonValue,
      },
    });

    await tx.trainingSessionItem.createMany({
      data: selectedQuestionIds.map((questionId, index) => ({
        sessionId: createdSession.id,
        questionId,
        order: index + 1,
      })),
    });

    return createdSession;
  });

  return {
    id: session.id,
    questionCount: selectedQuestionIds.length,
    mode: session.mode,
    config,
    resumed: false,
  };
}
