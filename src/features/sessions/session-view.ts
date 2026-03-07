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
import { parseTrainingSessionConfig } from "./session-contract";
import { computeMockSessionReport } from "./session-mock-report";

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
  const answeredQuestionIds = new Set(session.attempts.map((attempt) => attempt.questionId));
  const currentItem = session.endedAt
    ? null
    : session.items.find((item) => !answeredQuestionIds.has(item.questionId)) ?? null;
  const correctAnswers = session.attempts.filter((attempt) => attempt.isCorrect).length;
  const totalQuestions = session.items.length;
  const answeredCount = answeredQuestionIds.size;
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
  }));
  const attemptMap = new Map(
    session.attempts.map((attempt) => [attempt.questionId, attempt]),
  );
  const currentQuestion = currentItem
    ? {
        order: currentItem.order,
        question: localizeQuestion(currentItem.question, locale),
        skill: localizeSkill(currentItem.question.primarySkill, locale),
        module: localizeModule(currentItem.question.module, locale),
      }
    : null;

  return {
    id: session.id,
    mode: session.mode as SessionMode,
    endedAt: session.endedAt,
    startedAt: session.startedAt,
    score:
      session.score ??
      (totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0),
    totalQuestions,
    answeredCount,
    correctAnswers,
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
              score:
                session.score ??
                (totalQuestions > 0
                  ? Math.round((correctAnswers / totalQuestions) * 100)
                  : 0),
              answeredCount,
              totalQuestions,
              timeSpentMinutes,
              timeBudgetMinutes: timing.durationMinutes,
            }),
            ...computeMockSessionReport({
              questions: localizedItems.map((item) => ({
                questionId: item.question.id,
                prompt: item.question.prompt,
                skill: item.skill.title,
                isCorrect: attemptMap.get(item.question.id)?.isCorrect ?? null,
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
      totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0,
  };
}
