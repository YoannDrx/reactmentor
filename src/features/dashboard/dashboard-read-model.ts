import { MasteryState, Prisma, SessionMode } from "@prisma/client";
import type { Locale } from "@/i18n/config";
import {
  localizeModule,
  localizeQuestion,
  localizeSkill,
} from "@/lib/content-repository";
import { prisma } from "@/lib/prisma";
import { parseTrainingSessionConfig } from "@/features/sessions/session-contract";
import { parseAttemptResponseData } from "@/features/sessions/attempt-response";
import {
  buildSessionRubric,
  type SessionRubricCriterion,
} from "@/features/sessions/session-rubric";
import { parseAttemptReviewData } from "@/features/sessions/attempt-review";

const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

type DayKey = (typeof dayKeys)[number];

type ReviewUrgency = "critical" | "high" | "normal";
type ReviewReason =
  | "overdue"
  | "failedRecently"
  | "weakSkill"
  | "mockFallout"
  | "scheduled";

type SessionHistoryRow = {
  id: string;
  mode: SessionMode;
  score: number | null;
  startedAt: Date;
  endedAt: Date | null;
  config: Prisma.JsonValue | null;
  _count: {
    attempts: number;
  };
};

function getDayKey(date: Date): DayKey {
  return dayKeys[date.getDay()];
}

function startOfDay(date: Date) {
  const nextDate = new Date(date);
  nextDate.setHours(0, 0, 0, 0);
  return nextDate;
}

function differenceInWholeDays(left: Date, right: Date) {
  return Math.floor((left.getTime() - right.getTime()) / (1000 * 60 * 60 * 24));
}

function buildLastSevenDays() {
  const today = startOfDay(new Date());

  return Array.from({ length: 7 }, (_, index) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (6 - index));

    return {
      date,
      key: getDayKey(date),
      iso: date.toISOString().slice(0, 10),
    };
  });
}

function getReviewUrgency(nextReviewAt: Date | null, now: Date): ReviewUrgency {
  if (!nextReviewAt) {
    return "normal";
  }

  const overdueDays = differenceInWholeDays(now, nextReviewAt);

  if (overdueDays >= 3) {
    return "critical";
  }

  if (overdueDays >= 0) {
    return "high";
  }

  return "normal";
}

function getReviewReason(
  params: {
    masteryState: MasteryState;
    nextReviewAt: Date | null;
    lastOutcomeCorrect: boolean | null;
    latestAttempt:
      | {
          mode: SessionMode;
          isCorrect: boolean | null;
        }
      | null
      | undefined;
    skillSignal:
      | {
          masteryScore: number;
          confidenceScore: number;
        }
      | null
      | undefined;
    now: Date;
  },
): ReviewReason {
  if (!params.nextReviewAt) {
    return "scheduled";
  }

  if (differenceInWholeDays(params.now, params.nextReviewAt) >= 1) {
    return "overdue";
  }

  if (
    params.latestAttempt?.mode === SessionMode.MOCK_INTERVIEW &&
    params.latestAttempt.isCorrect === false
  ) {
    return "mockFallout";
  }

  if (
    params.lastOutcomeCorrect === false ||
    params.masteryState === MasteryState.LEARNING ||
    params.masteryState === MasteryState.NEW
  ) {
    return "failedRecently";
  }

  if (
    params.skillSignal &&
    (params.skillSignal.masteryScore < 60 || params.skillSignal.confidenceScore < 45)
  ) {
    return "weakSkill";
  }

  return "scheduled";
}

function mapSessionHistoryRows(rows: SessionHistoryRow[]) {
  return rows.map((session) => {
    const config = parseTrainingSessionConfig(session.config);
    const durationMinutes =
      session.endedAt && session.startedAt
        ? Math.max(
            1,
            Math.round(
              (session.endedAt.getTime() - session.startedAt.getTime()) /
                (1000 * 60),
            ),
          )
        : 0;

    return {
      id: session.id,
      mode: session.mode,
      score: session.score,
      durationMinutes,
      answersCount: session._count.attempts,
      endedAt: session.endedAt,
      config: session.config,
      templateKey: config?.templateKey ?? null,
      durationBudgetMinutes: config?.durationMinutes ?? null,
    };
  });
}

function roundAverage(values: number[]) {
  if (values.length === 0) {
    return 0;
  }

  return Math.round(values.reduce((total, value) => total + value, 0) / values.length);
}

function getTrendDirection(delta: number | null) {
  if (delta === null) {
    return "steady" as const;
  }

  if (delta >= 5) {
    return "up" as const;
  }

  if (delta <= -5) {
    return "down" as const;
  }

  return "steady" as const;
}

function buildPendingAttemptPreview(responseData: Prisma.JsonValue | null) {
  const response = parseAttemptResponseData(responseData);

  if (!response) {
    return null;
  }

  if (response.kind === "text_response") {
    return {
      kind: "text_response" as const,
      content: response.text,
      language: null,
      selectedLineNumbers: [],
    };
  }

  if (response.kind === "code_response") {
    return {
      kind: "code_response" as const,
      content: response.code,
      language: response.language,
      selectedLineNumbers: [],
    };
  }

  if (response.kind === "bug_hunt_response") {
    return {
      kind: "bug_hunt_response" as const,
      content: response.summary,
      language: null,
      selectedLineNumbers: response.selectedLineNumbers,
    };
  }

  return null;
}

export async function getDashboardReadModel(userId: string, locale: Locale) {
  const now = new Date();
  const lastSevenDays = buildLastSevenDays();
  const firstDay = lastSevenDays[0]?.date ?? startOfDay(now);

  const [
    totalQuestions,
    attemptsCount,
    masteredCount,
    dueCount,
    completedMocksCount,
    readinessAggregate,
    masteryProgressRows,
    recentAttempts,
    skillProgress,
    fallbackSkills,
    dueProgressRows,
    pendingReviewAttempts,
    recentSessions,
  ] = await prisma.$transaction([
    prisma.question.count(),
    prisma.attempt.count({
      where: { userId },
    }),
    prisma.questionProgress.count({
      where: {
        userId,
        masteryState: MasteryState.MASTERED,
      },
    }),
    prisma.questionProgress.count({
      where: {
        userId,
        nextReviewAt: {
          lte: now,
        },
      },
    }),
    prisma.trainingSession.count({
      where: {
        userId,
        mode: SessionMode.MOCK_INTERVIEW,
        endedAt: {
          not: null,
        },
      },
    }),
    prisma.skillProgress.aggregate({
      where: { userId },
      _avg: {
        masteryScore: true,
      },
    }),
    prisma.questionProgress.findMany({
      where: { userId },
      select: {
        masteryState: true,
      },
    }),
    prisma.attempt.findMany({
      where: {
        userId,
        createdAt: {
          gte: firstDay,
        },
      },
      select: {
        createdAt: true,
        isCorrect: true,
      },
    }),
    prisma.skillProgress.findMany({
      where: { userId },
      include: {
        skill: {
          include: {
            translations: true,
          },
        },
      },
      orderBy: [
        {
          masteryScore: "desc",
        },
        {
          confidenceScore: "desc",
        },
        {
          lastAttemptAt: "desc",
        },
      ],
      take: 6,
    }),
    prisma.skill.findMany({
      include: {
        translations: true,
      },
      orderBy: {
        slug: "asc",
      },
      take: 6,
    }),
    prisma.questionProgress.findMany({
      where: {
        userId,
        nextReviewAt: {
          lte: now,
        },
      },
      include: {
        question: {
          include: {
            translations: true,
            primarySkill: {
              include: {
                translations: true,
                progress: {
                  where: {
                    userId,
                  },
                  select: {
                    masteryScore: true,
                    confidenceScore: true,
                  },
                  take: 1,
                },
              },
            },
            attempts: {
              where: {
                userId,
              },
              orderBy: {
                createdAt: "desc",
              },
              select: {
                mode: true,
                isCorrect: true,
                createdAt: true,
              },
              take: 1,
            },
            bookmarks: {
              where: {
                userId,
              },
              select: {
                id: true,
              },
              take: 1,
            },
            options: {
              include: {
                translations: true,
              },
              orderBy: {
                order: "asc",
              },
            },
          },
        },
      },
      orderBy: {
        nextReviewAt: "asc",
      },
      take: 6,
    }),
    prisma.attempt.findMany({
      where: {
        userId,
        isCorrect: null,
      },
      include: {
        question: {
          include: {
            translations: true,
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
            options: {
              include: {
                translations: true,
              },
              orderBy: {
                order: "asc",
              },
            },
            bookmarks: {
              where: {
                userId,
              },
              select: {
                id: true,
              },
              take: 1,
            },
            notes: {
              where: {
                userId,
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
      orderBy: {
        createdAt: "asc",
      },
      take: 6,
    }),
    prisma.trainingSession.findMany({
      where: {
        userId,
        endedAt: {
          not: null,
        },
      },
      orderBy: {
        endedAt: "desc",
      },
      take: 3,
      include: {
        _count: {
          select: {
            attempts: true,
          },
        },
      },
    }),
  ]);

  const attemptMap = new Map<string, { correct: number; total: number }>();

  for (const day of lastSevenDays) {
    attemptMap.set(day.iso, { correct: 0, total: 0 });
  }

  for (const attempt of recentAttempts) {
    const dayIso = startOfDay(attempt.createdAt).toISOString().slice(0, 10);
    const entry = attemptMap.get(dayIso);

    if (!entry) {
      continue;
    }

    entry.total += 1;
    entry.correct += attempt.isCorrect ? 1 : 0;
  }

  const weeklyMomentum = lastSevenDays.map((day) => {
    const bucket = attemptMap.get(day.iso);
    const score =
      bucket && bucket.total > 0
        ? Math.round((bucket.correct / bucket.total) * 100)
        : 0;

    return {
      dayKey: day.key,
      score,
    };
  });

  const masteryMap = {
    new: 0,
    learning: 0,
    reviewing: 0,
    mastered: 0,
  };

  for (const progressRow of masteryProgressRows) {
    if (progressRow.masteryState === MasteryState.NEW) {
      masteryMap.new += 1;
    }

    if (progressRow.masteryState === MasteryState.LEARNING) {
      masteryMap.learning += 1;
    }

    if (progressRow.masteryState === MasteryState.REVIEWING) {
      masteryMap.reviewing += 1;
    }

    if (progressRow.masteryState === MasteryState.MASTERED) {
      masteryMap.mastered += 1;
    }
  }

  const skillReadinessSource =
    skillProgress.length > 0
      ? skillProgress.map((item) => ({
          id: item.skillId,
          skill: localizeSkill(item.skill, locale).title,
          score: item.masteryScore,
        }))
      : fallbackSkills.map((skill) => ({
          id: skill.id,
          skill: localizeSkill(skill, locale).title,
          score: 0,
        }));
  const skillBreakdownSource =
    skillProgress.length > 0
      ? skillProgress.map((item) => ({
          id: item.skillId,
          skill: localizeSkill(item.skill, locale).title,
          score: item.masteryScore,
          correctRate: item.correctRate,
          coverageCount: item.coverageCount,
          uniqueQuestionCount: item.uniqueQuestionCount,
          uniqueDifficultyCount: item.uniqueDifficultyCount,
          recentFailureCount: item.recentFailureCount,
          confidenceScore: item.confidenceScore,
          lastAttemptAt: item.lastAttemptAt,
        }))
      : fallbackSkills.map((skill) => ({
          id: skill.id,
          skill: localizeSkill(skill, locale).title,
          score: 0,
          correctRate: 0,
          coverageCount: 0,
          uniqueQuestionCount: 0,
          uniqueDifficultyCount: 0,
          recentFailureCount: 0,
          confidenceScore: 0,
          lastAttemptAt: null,
        }));

  const reviewItems = dueProgressRows.map((progressRow) => {
    const localizedQuestion = localizeQuestion(progressRow.question, locale);
    const localizedSkill = localizeSkill(progressRow.question.primarySkill, locale);
    const latestAttempt = progressRow.question.attempts[0] ?? null;
    const skillSignal = progressRow.question.primarySkill.progress[0] ?? null;

    return {
      questionId: progressRow.questionId,
      questionSlug: progressRow.question.slug,
      title: localizedQuestion.prompt,
      skill: localizedSkill.title,
      urgency: getReviewUrgency(progressRow.nextReviewAt, now),
      reason: getReviewReason({
        masteryState: progressRow.masteryState,
        nextReviewAt: progressRow.nextReviewAt,
        lastOutcomeCorrect: progressRow.lastOutcomeCorrect,
        latestAttempt,
        skillSignal,
        now,
      }),
      nextReviewAt: progressRow.nextReviewAt,
      isBookmarked: progressRow.question.bookmarks.length > 0,
    };
  });

  const pendingReviewItems = pendingReviewAttempts.map((attempt) => {
    const localizedQuestion = localizeQuestion(attempt.question, locale);
    const localizedSkill = localizeSkill(attempt.question.primarySkill, locale);
    const localizedModule = localizeModule(attempt.question.module, locale);
    const takeaways = Array.isArray(localizedQuestion.takeaways)
      ? localizedQuestion.takeaways.filter(
          (takeaway): takeaway is string => typeof takeaway === "string",
        )
      : [];
    const verbalizePoints = Array.isArray(localizedQuestion.verbalizePoints)
      ? localizedQuestion.verbalizePoints.filter(
          (point): point is string => typeof point === "string",
        )
      : [];
    const rubric = buildSessionRubric({
      format: attempt.question.format,
      verbalizePoints,
      takeaways,
    });

    return {
      attemptId: attempt.id,
      sessionId: attempt.sessionId,
      questionId: attempt.questionId,
      prompt: localizedQuestion.prompt,
      skill: localizedSkill.title,
      module: localizedModule.title,
      format: attempt.question.format,
      createdAt: attempt.createdAt,
      responsePreview: buildPendingAttemptPreview(attempt.responseData),
      reviewSummary: parseAttemptReviewData(attempt.reviewData)?.summary ?? null,
      explanation: localizedQuestion.explanation,
      takeaways,
      verbalizePoints,
      rubricCriteria: rubric.criteria,
      rubricFocusPoints: rubric.focusPoints,
      contextData: localizedQuestion.contextData,
      isBookmarked: attempt.question.bookmarks.length > 0,
      noteBody: attempt.question.notes[0]?.body ?? null,
      noteUpdatedAt: attempt.question.notes[0]?.updatedAt ?? null,
    };
  });

  const recentSessionItems = mapSessionHistoryRows(recentSessions);

  return {
    hasAttempts: attemptsCount > 0,
    overview: {
      stats: {
        readiness: Math.round(readinessAggregate._avg.masteryScore ?? 0),
        masteredQuestions: masteredCount,
        dueToday: dueCount,
        completedMocks: completedMocksCount,
        totalQuestions,
      },
      weeklyMomentum,
      skillReadiness: skillReadinessSource,
      dueItems: reviewItems.slice(0, 3),
      recentSessions: recentSessionItems,
    },
    progress: {
      masteryDistribution: masteryMap,
      weeklyMomentum,
      skillBreakdown: skillBreakdownSource,
    },
    review: {
      dueCount,
      urgentCount: reviewItems.filter((item) => item.urgency !== "normal").length,
      items: reviewItems,
      pendingCount: pendingReviewItems.length,
      pendingItems: pendingReviewItems,
    },
  };
}

export async function getMockInterviewHistory(userId: string) {
  const sessions = await prisma.trainingSession.findMany({
    where: {
      userId,
      mode: SessionMode.MOCK_INTERVIEW,
      endedAt: {
        not: null,
      },
    },
    orderBy: {
      endedAt: "desc",
    },
    take: 6,
    include: {
      _count: {
        select: {
          attempts: true,
        },
      },
    },
  });

  return mapSessionHistoryRows(sessions);
}

export async function getMockInterviewReadModel(userId: string) {
  const [sessions, reviewedAttempts] = await Promise.all([
    getMockInterviewHistory(userId),
    prisma.attempt.findMany({
      where: {
        userId,
        reviewedAt: {
          not: null,
        },
        session: {
          mode: SessionMode.MOCK_INTERVIEW,
          endedAt: {
            not: null,
          },
        },
      },
      select: {
        reviewData: true,
      },
      take: 100,
    }),
  ]);

  const scores = sessions
    .map((session) => session.score)
    .filter((score): score is number => score !== null);
  const latestScore = sessions[0]?.score ?? null;
  const previousScores = sessions
    .slice(1)
    .map((session) => session.score)
    .filter((score): score is number => score !== null);
  const previousAverage =
    previousScores.length > 0 ? roundAverage(previousScores) : null;
  const latestDelta =
    latestScore !== null && previousAverage !== null ? latestScore - previousAverage : null;

  const templateGroups = new Map<
    string,
    {
      templateKey: string;
      sessionsCount: number;
      scores: number[];
      durations: number[];
      latestScore: number;
      durationBudgetMinutes: number | null;
    }
  >();

  for (const session of sessions) {
    if (session.score === null) {
      continue;
    }

    const templateKey = session.templateKey ?? "custom";
    const current = templateGroups.get(templateKey) ?? {
      templateKey,
      sessionsCount: 0,
      scores: [],
      durations: [],
      latestScore: session.score,
      durationBudgetMinutes: session.durationBudgetMinutes,
    };

    current.sessionsCount += 1;
    current.scores.push(session.score);
    current.durations.push(session.durationMinutes);
    if (current.sessionsCount === 1) {
      current.latestScore = session.score;
      current.durationBudgetMinutes = session.durationBudgetMinutes;
    }

    templateGroups.set(templateKey, current);
  }

  const templateBreakdown = [...templateGroups.values()]
    .map((group) => ({
      templateKey: group.templateKey,
      sessionsCount: group.sessionsCount,
      averageScore: roundAverage(group.scores),
      latestScore: group.latestScore,
      averageDurationMinutes: roundAverage(group.durations),
      durationBudgetMinutes: group.durationBudgetMinutes,
    }))
    .sort((left, right) => {
      if (right.averageScore !== left.averageScore) {
        return right.averageScore - left.averageScore;
      }

      if (right.sessionsCount !== left.sessionsCount) {
        return right.sessionsCount - left.sessionsCount;
      }

      return left.templateKey.localeCompare(right.templateKey);
    });

  const strongestTemplate = templateBreakdown[0] ?? null;
  const weakestTemplate = templateBreakdown.at(-1) ?? null;
  const criterionMap = new Map<
    SessionRubricCriterion,
    {
      criterion: SessionRubricCriterion;
      totalScore: number;
      reviewCount: number;
      missingCount: number;
      partialCount: number;
    }
  >();

  for (const attempt of reviewedAttempts) {
    const review = parseAttemptReviewData(attempt.reviewData);

    if (!review) {
      continue;
    }

    for (const criterion of review.criteria) {
      const current = criterionMap.get(criterion.criterion) ?? {
        criterion: criterion.criterion,
        totalScore: 0,
        reviewCount: 0,
        missingCount: 0,
        partialCount: 0,
      };

      current.reviewCount += 1;
      current.totalScore +=
        criterion.verdict === "solid"
          ? 100
          : criterion.verdict === "partial"
            ? 50
            : 0;

      if (criterion.verdict === "missing") {
        current.missingCount += 1;
      }

      if (criterion.verdict === "partial") {
        current.partialCount += 1;
      }

      criterionMap.set(criterion.criterion, current);
    }
  }

  const criterionBreakdown = [...criterionMap.values()]
    .map((criterion) => ({
      criterion: criterion.criterion,
      averageScore:
        criterion.reviewCount > 0
          ? Math.round(criterion.totalScore / criterion.reviewCount)
          : 0,
      reviewCount: criterion.reviewCount,
      missingCount: criterion.missingCount,
      partialCount: criterion.partialCount,
    }))
    .sort((left, right) => {
      if (left.averageScore !== right.averageScore) {
        return left.averageScore - right.averageScore;
      }

      if (right.missingCount !== left.missingCount) {
        return right.missingCount - left.missingCount;
      }

      return right.reviewCount - left.reviewCount;
    });

  return {
    sessions,
    summary: {
      completedCount: sessions.length,
      averageScore: roundAverage(scores),
      bestScore: scores.length > 0 ? Math.max(...scores) : 0,
      latestScore,
      latestDelta,
      latestTrend: getTrendDirection(latestDelta),
      strongestTemplate,
      weakestTemplate,
    },
    templateBreakdown,
    criterionBreakdown,
  };
}
