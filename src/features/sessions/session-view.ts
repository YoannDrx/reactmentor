import { SessionMode, type Prisma } from "@prisma/client";
import type { Locale } from "@/i18n/config";
import {
  localizeModule,
  localizeQuestion,
  localizeSkill,
} from "@/lib/content-repository";
import { prisma } from "@/lib/prisma";
import {
  getMockPressureState,
  getSessionTimingSnapshot,
} from "./session-timing";
import { getAttemptScorePercent } from "./attempt-review";
import { parseTrainingSessionConfig } from "./session-contract";
import { computeMockSessionReport } from "./session-mock-report";
import { calculateTrainingSessionScore } from "./session-score";

type SessionWithItems = Prisma.TrainingSessionGetPayload<{
  include: {
    items: {
      orderBy: {
        order: "asc";
      };
      include: {
        question: {
          include: {
            translations: true;
            options: {
              include: {
                translations: true;
              };
              orderBy: {
                order: "asc";
              };
            };
            primarySkill: {
              include: {
                translations: true;
              };
            };
            module: {
              include: {
                translations: true;
              };
            };
            bookmarks: {
              where: {
                userId: string;
              };
              select: {
                id: true;
              };
              take: 1;
            };
            notes: {
              where: {
                userId: string;
              };
              select: {
                body: true;
                updatedAt: true;
              };
              orderBy: {
                updatedAt: "desc";
              };
              take: 1;
            };
          };
        };
      };
    };
    attempts: {
      where: {
        userId: string;
      };
      orderBy: {
        createdAt: "asc";
      };
    };
  };
}>;

export async function getTrainingSessionView(params: {
  sessionId: string;
  userId: string;
  locale: Locale;
}) {
  const session = await prisma.trainingSession.findFirst({
    where: {
      id: params.sessionId,
      userId: params.userId,
    },
    include: {
      items: {
        orderBy: {
          order: "asc",
        },
        include: {
          question: {
            include: {
              translations: true,
              options: {
                include: {
                  translations: true,
                },
                orderBy: {
                  order: "asc",
                },
              },
              primarySkill: {
                include: {
                  translations: true,
                },
              },
              module: {
                include: {
                  translations: true,
                },
              },
              bookmarks: {
                where: {
                  userId: params.userId,
                },
                select: {
                  id: true,
                },
                take: 1,
              },
              notes: {
                where: {
                  userId: params.userId,
                },
                select: {
                  body: true,
                  updatedAt: true,
                },
                orderBy: {
                  updatedAt: "desc",
                },
                take: 1,
              },
            },
          },
        },
      },
      attempts: {
        where: {
          userId: params.userId,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  if (!session) {
    return null;
  }

  return mapTrainingSessionView(session, params.locale);
}

function mapTrainingSessionView(session: SessionWithItems, locale: Locale) {
  const now = new Date();
  const sessionConfig = parseTrainingSessionConfig(session.config);
  const answeredQuestionIds = new Set(
    session.attempts.map((attempt) => attempt.questionId),
  );
  const currentItem = session.endedAt
    ? null
    : session.items.find((item) => !answeredQuestionIds.has(item.questionId)) ??
      null;
  const correctAnswers = session.attempts.filter(
    (attempt) => attempt.isCorrect === true,
  ).length;
  const gradedAnswerCount = session.attempts.filter(
    (attempt) =>
      getAttemptScorePercent({
        isCorrect: attempt.isCorrect,
        reviewData: attempt.reviewData,
      }) !== null,
  ).length;
  const totalQuestions = session.items.length;
  const answeredCount = answeredQuestionIds.size;
  const pendingEvaluationCount = answeredCount - gradedAnswerCount;
  const timing = getSessionTimingSnapshot(
    sessionConfig,
    session.startedAt,
    now,
    session.endedAt,
  );
  const timeSpentMinutes = Math.max(
    1,
    Math.round(
      ((session.endedAt ?? now).getTime() - session.startedAt.getTime()) /
        (1000 * 60),
    ),
  );
  const localizedItems = session.items.map((item) => ({
    order: item.order,
    question: localizeQuestion(item.question, locale),
    skill: localizeSkill(item.question.primarySkill, locale),
    module: localizeModule(item.question.module, locale),
    isBookmarked: item.question.bookmarks.length > 0,
    noteBody: item.question.notes[0]?.body ?? null,
    noteUpdatedAt: item.question.notes[0]?.updatedAt ?? null,
  }));
  const attemptMap = new Map(
    session.attempts.map((attempt) => [attempt.questionId, attempt]),
  );
  const questionMetaById = new Map(
    session.items.map((item) => [
      item.question.id,
      {
        format: item.question.format,
        difficulty: item.question.difficulty,
      },
    ]),
  );
  const calculatedScore = calculateTrainingSessionScore({
    attempts: session.attempts.map((attempt) => ({
      isCorrect: attempt.isCorrect,
      reviewData: attempt.reviewData,
      question:
        questionMetaById.get(attempt.questionId) ?? {
          format: "SINGLE_CHOICE",
          difficulty: 1,
        },
    })),
    mode: session.mode,
    config: sessionConfig,
  });
  const currentQuestion = currentItem
    ? {
        order: currentItem.order,
        question: localizeQuestion(currentItem.question, locale),
        skill: localizeSkill(currentItem.question.primarySkill, locale),
        module: localizeModule(currentItem.question.module, locale),
        isBookmarked: currentItem.question.bookmarks.length > 0,
        noteBody: currentItem.question.notes[0]?.body ?? null,
        noteUpdatedAt: currentItem.question.notes[0]?.updatedAt ?? null,
      }
    : null;

  return {
    id: session.id,
    mode: session.mode as SessionMode,
    endedAt: session.endedAt,
    startedAt: session.startedAt,
    score: session.score ?? calculatedScore,
    totalQuestions,
    answeredCount,
    correctAnswers,
    gradedAnswerCount,
    pendingEvaluationCount,
    config: sessionConfig,
    timing: timing
      ? {
          durationMinutes: timing.durationMinutes,
          deadlineAtMs: timing.deadlineAt.getTime(),
          elapsedSeconds: timing.elapsedSeconds,
          remainingSeconds: timing.remainingSeconds,
          percentRemaining: timing.percentRemaining,
          isExpired: timing.isExpired,
        }
      : null,
    mockReport:
      session.mode === SessionMode.MOCK_INTERVIEW && timing
        ? {
            templateKey: sessionConfig?.templateKey ?? null,
            timeSpentMinutes,
            timeBudgetMinutes: timing.durationMinutes,
            pressureState: getMockPressureState({
              score: (session.score ?? calculatedScore) ?? 0,
              answeredCount,
              totalQuestions,
              timeSpentMinutes,
              timeBudgetMinutes: timing.durationMinutes,
              pendingEvaluationCount,
            }),
            ...computeMockSessionReport({
              questions: localizedItems.map((item) => ({
                questionId: item.question.id,
                prompt: item.question.prompt,
                skill: item.skill.title,
                format: item.question.format,
                isBookmarked: item.isBookmarked,
                noteBody: item.noteBody,
                noteUpdatedAt: item.noteUpdatedAt,
                attempted: attemptMap.has(item.question.id),
                isCorrect: attemptMap.get(item.question.id)?.isCorrect ?? null,
                scorePercent: getAttemptScorePercent({
                  isCorrect: attemptMap.get(item.question.id)?.isCorrect ?? null,
                  reviewData: attemptMap.get(item.question.id)?.reviewData ?? null,
                }),
                verbalizePoints: Array.isArray(item.question.verbalizePoints)
                  ? item.question.verbalizePoints.filter(
                      (point): point is string => typeof point === "string",
                    )
                  : [],
                takeaways: Array.isArray(item.question.takeaways)
                  ? item.question.takeaways.filter(
                      (point): point is string => typeof point === "string",
                    )
                  : [],
              })),
            }),
          }
        : null,
    currentQuestion,
    progressPercent:
      totalQuestions > 0
        ? Math.round((answeredCount / totalQuestions) * 100)
        : 0,
  };
}
