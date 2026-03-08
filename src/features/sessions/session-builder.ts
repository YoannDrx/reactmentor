import {
  ContentStatus,
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

function getPlayableFormats(mode: SessionMode) {
  if (mode === SessionMode.REVIEW) {
    return [QuestionFormat.SINGLE_CHOICE, QuestionFormat.MULTIPLE_CHOICE];
  }

  return [
    QuestionFormat.SINGLE_CHOICE,
    QuestionFormat.MULTIPLE_CHOICE,
    QuestionFormat.OPEN_ENDED,
    QuestionFormat.CODE_OUTPUT,
    QuestionFormat.BUG_HUNT,
  ];
}

function buildQuestionWhere(input: {
  mode: SessionMode;
  moduleSlug?: string;
  tracks?: Track[];
  level?: QuestionLevel;
  questionIds?: string[];
}) {
  const where: Prisma.QuestionWhereInput = {
    status: ContentStatus.PUBLISHED,
    format: {
      in: getPlayableFormats(input.mode),
    },
    module: {
      status: ContentStatus.PUBLISHED,
    },
    primarySkill: {
      status: ContentStatus.PUBLISHED,
    },
  };

  if (input.questionIds && input.questionIds.length > 0) {
    where.id = {
      in: input.questionIds,
    };
  }

  if (input.level) {
    where.level = input.level;
  }

  if (input.moduleSlug || (input.tracks && input.tracks.length > 0)) {
    where.module = {
      status: ContentStatus.PUBLISHED,
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
  questionIds?: string[];
  now: Date;
}) {
  return {
    userId: input.userId,
    ...(input.questionIds && input.questionIds.length > 0
      ? {
          questionId: {
            in: input.questionIds,
          },
        }
      : {}),
    nextReviewAt: {
      lte: input.now,
    },
    question: buildQuestionWhere({
      mode: SessionMode.REVIEW,
      moduleSlug: input.moduleSlug,
      tracks: input.tracks,
      level: input.level,
      questionIds: input.questionIds,
    }),
  } satisfies Prisma.QuestionProgressWhereInput;
}

function areQuestionIdListsEqual(
  left: string[] | undefined,
  right: string[] | undefined,
) {
  const leftIds = left ?? [];
  const rightIds = right ?? [];

  if (leftIds.length !== rightIds.length) {
    return false;
  }

  return leftIds.every((questionId, index) => questionId === rightIds[index]);
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
  const lastAttemptAt =
    progress?.lastAttemptAt ?? candidate.attempts[0]?.createdAt ?? null;
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
  reviewCount: number;
  lapseCount: number;
  lastOutcomeCorrect: boolean | null;
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

  if (candidate.lastOutcomeCorrect === false) {
    score += 18;
  }

  score += Math.min(24, candidate.lapseCount * 8);

  if (candidate.reviewCount <= 2) {
    score += 10;
  }

  score += candidate.difficulty * 2;

  return score;
}

function selectMockQuestionIds(params: {
  candidates: Array<{
    id: string;
    format: QuestionFormat;
    difficulty: number;
    score: number;
  }>;
  questionCount: number;
  templateKey?: MockTemplateKey;
}) {
  const sortedCandidates = [...params.candidates].sort((left, right) => {
    if (right.score !== left.score) {
      return right.score - left.score;
    }

    if (right.difficulty !== left.difficulty) {
      return right.difficulty - left.difficulty;
    }

    return left.id.localeCompare(right.id);
  });
  const selectedIds: string[] = [];
  const selectedSet = new Set<string>();
  const template = params.templateKey
    ? mockTemplateDefinitions[params.templateKey]
    : null;

  if (template) {
    for (const target of template.formatTargets) {
      if (selectedIds.length >= params.questionCount) {
        break;
      }

      const matchingCandidates = sortedCandidates.filter(
        (candidate) =>
          !selectedSet.has(candidate.id) &&
          target.formats.includes(candidate.format),
      );

      for (const candidate of matchingCandidates.slice(0, target.targetCount)) {
        if (
          selectedIds.length >= params.questionCount ||
          selectedSet.has(candidate.id)
        ) {
          break;
        }

        selectedIds.push(candidate.id);
        selectedSet.add(candidate.id);
      }
    }
  }

  for (const candidate of sortedCandidates) {
    if (selectedIds.length >= params.questionCount) {
      break;
    }

    if (selectedSet.has(candidate.id)) {
      continue;
    }

    selectedIds.push(candidate.id);
    selectedSet.add(candidate.id);
  }

  return selectedIds;
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
  mode?: SessionMode;
  moduleSlug?: string;
  tracks?: Track[];
  level?: QuestionLevel;
  questionIds?: string[];
}) {
  return prisma.question.count({
    where: buildQuestionWhere({
      mode: input.mode ?? SessionMode.PRACTICE,
      moduleSlug: input.moduleSlug,
      tracks: input.tracks,
      level: input.level,
      questionIds: input.questionIds,
    }),
  });
}

export async function getMockTemplateAvailabilities() {
  const entries = await Promise.all(
    Object.entries(mockTemplateDefinitions).map(async ([key, template]) => {
      const count = await countQuestionsForSessionInput({
        mode: SessionMode.MOCK_INTERVIEW,
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
  const source = resolvedInput.templateKey
    ? "mock_template"
    : resolvedInput.questionIds && resolvedInput.questionIds.length > 0
      ? "playlist"
      : "module";
  const questionOrder = new Map(
    (resolvedInput.questionIds ?? []).map((questionId, index) => [
      questionId,
      index,
    ]),
  );
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

    if (
      !areQuestionIdListsEqual(config.questionIds, resolvedInput.questionIds)
    ) {
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
        questionIds: resolvedInput.questionIds,
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
    mode: resolvedInput.mode,
    moduleSlug: resolvedInput.moduleSlug,
    tracks: resolvedInput.tracks,
    level: resolvedInput.level,
    questionIds: resolvedInput.questionIds,
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
              questionIds: resolvedInput.questionIds,
              now,
            }),
            select: {
              questionId: true,
              masteryState: true,
              nextReviewAt: true,
              lastAttemptAt: true,
              reviewCount: true,
              lapseCount: true,
              lastOutcomeCorrect: true,
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
              reviewCount: candidate.reviewCount,
              lapseCount: candidate.lapseCount,
              lastOutcomeCorrect: candidate.lastOutcomeCorrect,
              now,
            }),
          }))
          .sort((left, right) => {
            if (questionOrder.size > 0) {
              return (
                (questionOrder.get(left.id) ?? Number.MAX_SAFE_INTEGER) -
                (questionOrder.get(right.id) ?? Number.MAX_SAFE_INTEGER)
              );
            }

            if (right.score !== left.score) {
              return right.score - left.score;
            }

            return right.difficulty - left.difficulty;
          })
          .slice(0, questionCount)
          .map((candidate) => candidate.id)
      : [];

  const scoredQuestionCandidates =
    resolvedInput.mode === SessionMode.REVIEW
      ? []
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
            format: candidate.format,
            difficulty: candidate.difficulty,
            score: scoreCandidate({
              difficulty: candidate.difficulty,
              progress: candidate.progress,
              attempts: candidate.attempts,
              mode: resolvedInput.mode,
            }),
          }))
          .sort((left, right) => {
            if (questionOrder.size > 0) {
              return (
                (questionOrder.get(left.id) ?? Number.MAX_SAFE_INTEGER) -
                (questionOrder.get(right.id) ?? Number.MAX_SAFE_INTEGER)
              );
            }

            if (right.score !== left.score) {
              return right.score - left.score;
            }

            if (resolvedInput.mode === SessionMode.MOCK_INTERVIEW) {
              return right.difficulty - left.difficulty;
            }

            return left.difficulty - right.difficulty;
          });

  const selectedPracticeOrMockIds =
    questionOrder.size > 0
      ? scoredQuestionCandidates
          .slice(0, questionCount)
          .map((candidate) => candidate.id)
      : resolvedInput.mode === SessionMode.MOCK_INTERVIEW
        ? selectMockQuestionIds({
            candidates: scoredQuestionCandidates,
            questionCount,
            templateKey: resolvedInput.templateKey,
          })
        : scoredQuestionCandidates
            .slice(0, questionCount)
            .map((candidate) => candidate.id);

  const finalSelectedQuestionIds =
    resolvedInput.mode === SessionMode.REVIEW
      ? selectedQuestionIds
      : selectedPracticeOrMockIds;

  if (finalSelectedQuestionIds.length === 0) {
    throw new Error("No questions are available for this session.");
  }

  const config: TrainingSessionConfig = {
    source,
    locale: resolvedInput.locale,
    questionCount: finalSelectedQuestionIds.length,
    durationMinutes: resolvedInput.durationMinutes ?? null,
    moduleSlug: resolvedInput.moduleSlug ?? null,
    tracks: resolvedInput.tracks,
    level: resolvedInput.level ?? null,
    templateKey: resolvedInput.templateKey ?? null,
    questionIds: resolvedInput.questionIds,
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
      data: finalSelectedQuestionIds.map((questionId, index) => ({
        sessionId: createdSession.id,
        questionId,
        order: index + 1,
      })),
    });

    return createdSession;
  });

  return {
    id: session.id,
    questionCount: finalSelectedQuestionIds.length,
    mode: session.mode,
    config,
    resumed: false,
  };
}
