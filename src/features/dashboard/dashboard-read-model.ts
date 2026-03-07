import { MasteryState, Prisma, SessionMode } from "@prisma/client";
import type { Locale } from "@/i18n/config";
import {
  localizeQuestion,
  localizeSkill,
} from "@/lib/content-repository";
import { prisma } from "@/lib/prisma";
import { parseTrainingSessionConfig } from "@/features/sessions/session-contract";

const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

type DayKey = (typeof dayKeys)[number];

type ReviewUrgency = "critical" | "high" | "normal";
type ReviewReason = "overdue" | "failedRecently" | "scheduled";

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
  masteryState: MasteryState,
  nextReviewAt: Date | null,
  now: Date,
): ReviewReason {
  if (!nextReviewAt) {
    return "scheduled";
  }

  if (differenceInWholeDays(now, nextReviewAt) >= 1) {
    return "overdue";
  }

  if (masteryState === MasteryState.LEARNING || masteryState === MasteryState.NEW) {
    return "failedRecently";
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
      score: session.score ?? 0,
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
      orderBy: {
        masteryScore: "desc",
      },
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
          },
        },
      },
      orderBy: {
        nextReviewAt: "asc",
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

  const skillBreakdownSource =
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

  const reviewItems = dueProgressRows.map((progressRow) => {
    const localizedQuestion = localizeQuestion(progressRow.question, locale);
    const localizedSkill = localizeSkill(progressRow.question.primarySkill, locale);

    return {
      questionId: progressRow.questionId,
      questionSlug: progressRow.question.slug,
      title: localizedQuestion.prompt,
      skill: localizedSkill.title,
      urgency: getReviewUrgency(progressRow.nextReviewAt, now),
      reason: getReviewReason(progressRow.masteryState, progressRow.nextReviewAt, now),
      nextReviewAt: progressRow.nextReviewAt,
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
      skillReadiness: skillBreakdownSource,
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
  const sessions = await getMockInterviewHistory(userId);

  const scores = sessions.map((session) => session.score);
  const latestScore = sessions[0]?.score ?? null;
  const previousScores = sessions.slice(1).map((session) => session.score);
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
  };
}
