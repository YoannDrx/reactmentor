import {
  MasteryState,
  Prisma,
  QuestionFormat,
  SessionMode,
  Track,
} from "@prisma/client";
import type { Locale } from "@/i18n/config";
import {
  localizeModule,
  localizeQuestion,
  localizeQuestionSummary,
  localizeSkill,
} from "@/lib/content-repository";
import { prisma } from "@/lib/prisma";
import {
  mockTemplateKeys,
  parseTrainingSessionConfig,
  type MockTemplateKey,
} from "@/features/sessions/session-contract";
import { parseAttemptResponseData } from "@/features/sessions/attempt-response";
import {
  buildSessionRubric,
  type SessionRubricCriterion,
} from "@/features/sessions/session-rubric";
import { parseAttemptReviewData } from "@/features/sessions/attempt-review";
import type { SkillProgressSignalDetails } from "@/features/sessions/skill-progress";

const dayKeys = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"] as const;

type DayKey = (typeof dayKeys)[number];

type ReviewUrgency = "critical" | "high" | "normal";
type ReviewReason =
  | "overdue"
  | "failedRecently"
  | "weakSkill"
  | "mockFallout"
  | "lessonQueued"
  | "checkpointFailed"
  | "scheduled";
type LessonFollowUpReason =
  | "reviewDue"
  | "needsCheckpoint"
  | "checkpointFailed"
  | "needsPractice";

type RecoveryPlanReason = "dueNow" | "pendingReview" | "weakSignal";
type MockRecommendationReason =
  | "repeatWeakest"
  | "trackRecovery"
  | "defenseRecovery"
  | "coreRecovery";

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

function isDueForReview(nextReviewAt: Date | null, now: Date) {
  return nextReviewAt ? nextReviewAt <= now : false;
}

function getReviewReason(params: {
  masteryState: MasteryState;
  nextReviewAt: Date | null;
  lastOutcomeCorrect: boolean | null;
  reviewCount: number;
  lessonViews: number;
  lessonCheckpointAttempts: number;
  lastLessonCheckpointPassed: boolean | null;
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
}): ReviewReason {
  if (!params.nextReviewAt) {
    return "scheduled";
  }

  if (params.reviewCount === 0 && params.lessonViews > 0) {
    if (
      params.lessonCheckpointAttempts > 0 &&
      params.lastLessonCheckpointPassed === false
    ) {
      return "checkpointFailed";
    }

    return "lessonQueued";
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
    (params.skillSignal.masteryScore < 60 ||
      params.skillSignal.confidenceScore < 45)
  ) {
    return "weakSkill";
  }

  return "scheduled";
}

function shouldQueueLessonFollowUp(params: {
  lessonViews: number;
  lessonCheckpointAttempts: number;
  lastLessonCheckpointPassed: boolean | null;
  reviewCount: number;
  nextReviewAt: Date | null;
  now: Date;
}) {
  if (params.lessonViews <= 0) {
    return false;
  }

  if (isDueForReview(params.nextReviewAt, params.now)) {
    return true;
  }

  if (params.lessonCheckpointAttempts === 0) {
    return true;
  }

  if (params.lastLessonCheckpointPassed !== true) {
    return true;
  }

  return params.reviewCount === 0;
}

function getLessonFollowUpReason(params: {
  lessonCheckpointAttempts: number;
  lastLessonCheckpointPassed: boolean | null;
  reviewCount: number;
  nextReviewAt: Date | null;
  now: Date;
}): LessonFollowUpReason {
  if (isDueForReview(params.nextReviewAt, params.now)) {
    return "reviewDue";
  }

  if (params.lessonCheckpointAttempts === 0) {
    return "needsCheckpoint";
  }

  if (params.lastLessonCheckpointPassed === false) {
    return "checkpointFailed";
  }

  return params.reviewCount === 0 ? "needsPractice" : "reviewDue";
}

function getLessonFollowUpPriority(reason: LessonFollowUpReason) {
  if (reason === "reviewDue") {
    return 0;
  }

  if (reason === "needsCheckpoint") {
    return 1;
  }

  if (reason === "checkpointFailed") {
    return 2;
  }

  return 3;
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

  return Math.round(
    values.reduce((total, value) => total + value, 0) / values.length,
  );
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

function isObjectLike(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function readNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

function parseSkillProgressSignalDetails(
  value: Prisma.JsonValue | null | undefined,
): SkillProgressSignalDetails | null {
  if (!isObjectLike(value)) {
    return null;
  }

  const confidence = isObjectLike(value.confidence) ? value.confidence : null;

  if (!confidence) {
    return null;
  }

  const weightedAccuracyScore = readNumber(value.weightedAccuracyScore);
  const rawMasteryScore = readNumber(value.rawMasteryScore);
  const adjustedMasteryScore = readNumber(value.adjustedMasteryScore);
  const boostScore = readNumber(value.boostScore);
  const penaltyScore = readNumber(value.penaltyScore);
  const recentFailurePenalty = readNumber(value.recentFailurePenalty);
  const streakBonus = readNumber(value.streakBonus);
  const coverageBonus = readNumber(value.coverageBonus);
  const difficultyCoverageBonus = readNumber(value.difficultyCoverageBonus);
  const stalenessPenalty = readNumber(value.stalenessPenalty);
  const baseMasteryCap = readNumber(value.baseMasteryCap);
  const freshnessCap = readNumber(value.freshnessCap);
  const masteryCap = readNumber(value.masteryCap);
  const lastAttemptAgeInDays = readNumber(value.lastAttemptAgeInDays);
  const confidenceScore = readNumber(confidence.score);
  const coverageConfidence = readNumber(confidence.coverageConfidence);
  const breadthConfidence = readNumber(confidence.breadthConfidence);
  const difficultyConfidence = readNumber(confidence.difficultyConfidence);
  const recentActivityConfidence = readNumber(confidence.recentActivityConfidence);
  const freshnessBonus = readNumber(confidence.freshnessBonus);
  const confidenceStalenessPenalty = readNumber(confidence.stalenessPenalty);
  const confidenceRecentFailurePenalty = readNumber(
    confidence.recentFailurePenalty,
  );

  if (
    weightedAccuracyScore === null ||
    rawMasteryScore === null ||
    adjustedMasteryScore === null ||
    boostScore === null ||
    penaltyScore === null ||
    recentFailurePenalty === null ||
    streakBonus === null ||
    coverageBonus === null ||
    difficultyCoverageBonus === null ||
    stalenessPenalty === null ||
    baseMasteryCap === null ||
    freshnessCap === null ||
    masteryCap === null ||
    lastAttemptAgeInDays === null ||
    confidenceScore === null ||
    coverageConfidence === null ||
    breadthConfidence === null ||
    difficultyConfidence === null ||
    recentActivityConfidence === null ||
    freshnessBonus === null ||
    confidenceStalenessPenalty === null ||
    confidenceRecentFailurePenalty === null
  ) {
    return null;
  }

  return {
    weightedAccuracyScore,
    rawMasteryScore,
    adjustedMasteryScore,
    boostScore,
    penaltyScore,
    recentFailurePenalty,
    streakBonus,
    coverageBonus,
    difficultyCoverageBonus,
    stalenessPenalty,
    baseMasteryCap,
    freshnessCap,
    masteryCap,
    lastAttemptAgeInDays,
    confidence: {
      score: confidenceScore,
      coverageConfidence,
      breadthConfidence,
      difficultyConfidence,
      recentActivityConfidence,
      freshnessBonus,
      stalenessPenalty: confidenceStalenessPenalty,
      recentFailurePenalty: confidenceRecentFailurePenalty,
    },
  };
}

function isWeakSkillSignal(skill: {
  score: number;
  confidenceScore: number;
  recentFailureCount: number;
}) {
  return (
    skill.score < 68 ||
    skill.confidenceScore < 50 ||
    skill.recentFailureCount > 0
  );
}

function getDominantCriterion(
  counts: Map<SessionRubricCriterion, number>,
): SessionRubricCriterion | null {
  return (
    [...counts.entries()].sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }

      return left[0].localeCompare(right[0]);
    })[0]?.[0] ?? null
  );
}

function getFocusFormats(counts: Map<QuestionFormat, number>) {
  return [...counts.entries()]
    .sort((left, right) => {
      if (right[1] !== left[1]) {
        return right[1] - left[1];
      }

      return left[0].localeCompare(right[0]);
    })
    .map(([format]) => format)
    .slice(0, 2);
}

function getMockRecommendation(params: {
  weakestTemplate: {
    templateKey: string;
    averageScore: number;
  } | null;
  weaknessHighlights: Array<{
    track: Track;
    dominantCriterion: SessionRubricCriterion | null;
    focusFormats: QuestionFormat[];
  }>;
}) {
  if (
    params.weakestTemplate &&
    params.weakestTemplate.averageScore < 80 &&
    mockTemplateKeys.includes(
      params.weakestTemplate.templateKey as MockTemplateKey,
    )
  ) {
    return {
      templateKey: params.weakestTemplate.templateKey as MockTemplateKey,
      reason: "repeatWeakest" as MockRecommendationReason,
    };
  }

  const primaryWeakness = params.weaknessHighlights[0] ?? null;
  const defenseFormats: QuestionFormat[] = [
    QuestionFormat.BUG_HUNT,
    QuestionFormat.CODE_OUTPUT,
    QuestionFormat.OPEN_ENDED,
  ];

  if (!primaryWeakness) {
    return null;
  }

  if (primaryWeakness.track === Track.REACT_NATIVE) {
    return {
      templateKey: "react_native_sprint" as MockTemplateKey,
      reason: "trackRecovery" as MockRecommendationReason,
    };
  }

  if (
    primaryWeakness.dominantCriterion === "rootCause" ||
    primaryWeakness.dominantCriterion === "evidence" ||
    primaryWeakness.dominantCriterion === "repair" ||
    primaryWeakness.focusFormats.some((format) =>
      defenseFormats.includes(format),
    )
  ) {
    return {
      templateKey: "frontend_senior_defense" as MockTemplateKey,
      reason: "defenseRecovery" as MockRecommendationReason,
    };
  }

  return {
    templateKey: "react_mid_30" as MockTemplateKey,
    reason: "coreRecovery" as MockRecommendationReason,
  };
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
    lessonSignalRows,
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
            module: {
              include: {
                translations: true,
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
    prisma.questionProgress.findMany({
      where: {
        userId,
        lessonViews: {
          gt: 0,
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
            module: {
              include: {
                translations: true,
              },
            },
          },
        },
      },
      orderBy: [
        {
          lastLessonViewedAt: "desc",
        },
        {
          nextReviewAt: "asc",
        },
      ],
      take: 12,
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
          skillSlug: item.skill.slug,
          skill: localizeSkill(item.skill, locale).title,
          score: item.masteryScore,
          masteryCap: item.masteryCap,
          correctRate: item.correctRate,
          coverageCount: item.coverageCount,
          recentAttemptCount: item.recentAttemptCount,
          uniqueQuestionCount: item.uniqueQuestionCount,
          uniqueDifficultyCount: item.uniqueDifficultyCount,
          recentFailureCount: item.recentFailureCount,
          confidenceScore: item.confidenceScore,
          signalDetails: parseSkillProgressSignalDetails(item.signalDetails),
          lastAttemptAt: item.lastAttemptAt,
        }))
      : fallbackSkills.map((skill) => ({
          id: skill.id,
          skillSlug: skill.slug,
          skill: localizeSkill(skill, locale).title,
          score: 0,
          masteryCap: 0,
          correctRate: 0,
          coverageCount: 0,
          recentAttemptCount: 0,
          uniqueQuestionCount: 0,
          uniqueDifficultyCount: 0,
          recentFailureCount: 0,
          confidenceScore: 0,
          signalDetails: null,
          lastAttemptAt: null,
        }));
  const lessonSignalSource = lessonSignalRows.map((progressRow) => {
    const localizedQuestion = localizeQuestionSummary(progressRow.question, locale);
    const localizedSkill = localizeSkill(
      progressRow.question.primarySkill,
      locale,
    );
    const localizedModule = localizeModule(progressRow.question.module, locale);
    const hasPracticeAttempts = progressRow.reviewCount > 0;
    const isFollowUp = shouldQueueLessonFollowUp({
      lessonViews: progressRow.lessonViews,
      lessonCheckpointAttempts: progressRow.lessonCheckpointAttempts,
      lastLessonCheckpointPassed: progressRow.lastLessonCheckpointPassed,
      reviewCount: progressRow.reviewCount,
      nextReviewAt: progressRow.nextReviewAt,
      now,
    });

    return {
      questionId: progressRow.questionId,
      questionSlug: progressRow.question.slug,
      title: localizedQuestion.prompt,
      skill: localizedSkill.title,
      module: localizedModule.title,
      moduleSlug: progressRow.question.module.slug,
      lessonViews: progressRow.lessonViews,
      lastLessonViewedAt: progressRow.lastLessonViewedAt,
      checkpointAttempts: progressRow.lessonCheckpointAttempts,
      lastLessonCheckpointPassed: progressRow.lastLessonCheckpointPassed,
      hasPracticeAttempts,
      nextReviewAt: progressRow.nextReviewAt,
      reason: isFollowUp
        ? getLessonFollowUpReason({
            lessonCheckpointAttempts: progressRow.lessonCheckpointAttempts,
            lastLessonCheckpointPassed: progressRow.lastLessonCheckpointPassed,
            reviewCount: progressRow.reviewCount,
            nextReviewAt: progressRow.nextReviewAt,
            now,
          })
        : null,
    };
  });
  const lessonFollowUpItems = lessonSignalSource
    .filter(
      (
        item,
      ): item is typeof item & {
        reason: LessonFollowUpReason;
      } => item.reason !== null,
    )
    .sort((left, right) => {
      const leftPriority = getLessonFollowUpPriority(left.reason);
      const rightPriority = getLessonFollowUpPriority(right.reason);

      if (leftPriority !== rightPriority) {
        return leftPriority - rightPriority;
      }

      const leftViewedAt = left.lastLessonViewedAt?.getTime() ?? 0;
      const rightViewedAt = right.lastLessonViewedAt?.getTime() ?? 0;

      if (rightViewedAt !== leftViewedAt) {
        return rightViewedAt - leftViewedAt;
      }

      return left.title.localeCompare(right.title);
    });
  const lessonViewedCount = lessonSignalSource.length;
  const lessonCheckpointReadyCount = lessonSignalSource.filter(
    (item) => item.lastLessonCheckpointPassed === true,
  ).length;
  const lessonCheckpointFailedCount = lessonSignalSource.filter(
    (item) => item.lastLessonCheckpointPassed === false,
  ).length;
  const lessonReadWithoutPracticeCount = lessonSignalSource.filter(
    (item) => !item.hasPracticeAttempts,
  ).length;
  const lessonReviewQueuedCount = lessonSignalSource.filter((item) =>
    isDueForReview(item.nextReviewAt, now),
  ).length;

  const reviewItems = dueProgressRows.map((progressRow) => {
    const localizedQuestion = localizeQuestion(progressRow.question, locale);
    const localizedSkill = localizeSkill(
      progressRow.question.primarySkill,
      locale,
    );
    const localizedModule = localizeModule(progressRow.question.module, locale);
    const latestAttempt = progressRow.question.attempts[0] ?? null;
    const skillSignal = progressRow.question.primarySkill.progress[0] ?? null;

    return {
      questionId: progressRow.questionId,
      questionSlug: progressRow.question.slug,
      title: localizedQuestion.prompt,
      skill: localizedSkill.title,
      module: localizedModule.title,
      moduleSlug: progressRow.question.module.slug,
      urgency: getReviewUrgency(progressRow.nextReviewAt, now),
      reason: getReviewReason({
        masteryState: progressRow.masteryState,
        nextReviewAt: progressRow.nextReviewAt,
        lastOutcomeCorrect: progressRow.lastOutcomeCorrect,
        reviewCount: progressRow.reviewCount,
        lessonViews: progressRow.lessonViews,
        lessonCheckpointAttempts: progressRow.lessonCheckpointAttempts,
        lastLessonCheckpointPassed: progressRow.lastLessonCheckpointPassed,
        latestAttempt,
        skillSignal,
        now,
      }),
      nextReviewAt: progressRow.nextReviewAt,
      isBookmarked: progressRow.question.bookmarks.length > 0,
      hasLessonSignal: progressRow.lessonViews > 0,
      lessonViews: progressRow.lessonViews,
      checkpointAttempts: progressRow.lessonCheckpointAttempts,
      lastLessonCheckpointPassed: progressRow.lastLessonCheckpointPassed,
      hasPracticeAttempts: progressRow.reviewCount > 0,
    };
  });

  const dueBySkillId = new Map<
    string,
    {
      moduleSlug: string;
      moduleTitle: string;
      questionIds: string[];
      questions: Array<{
        questionId: string;
        questionSlug: string;
        prompt: string;
      }>;
      dueCount: number;
    }
  >();

  for (const progressRow of dueProgressRows) {
    const localizedQuestion = localizeQuestion(progressRow.question, locale);
    const current = dueBySkillId.get(progressRow.question.primarySkillId) ?? {
      moduleSlug: progressRow.question.module.slug,
      moduleTitle: localizeModule(progressRow.question.module, locale).title,
      questionIds: [],
      questions: [],
      dueCount: 0,
    };

    current.dueCount += 1;
    current.questionIds.push(progressRow.questionId);
    current.questions.push({
      questionId: progressRow.questionId,
      questionSlug: progressRow.question.slug,
      prompt: localizedQuestion.prompt,
    });
    dueBySkillId.set(progressRow.question.primarySkillId, current);
  }

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
      questionSlug: attempt.question.slug,
      prompt: localizedQuestion.prompt,
      skill: localizedSkill.title,
      module: localizedModule.title,
      moduleSlug: attempt.question.module.slug,
      format: attempt.question.format,
      createdAt: attempt.createdAt,
      responsePreview: buildPendingAttemptPreview(attempt.responseData),
      reviewSummary:
        parseAttemptReviewData(attempt.reviewData)?.summary ?? null,
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

  const pendingBySkillId = new Map<
    string,
    {
      pendingCount: number;
    }
  >();

  for (const attempt of pendingReviewAttempts) {
    const current = pendingBySkillId.get(attempt.question.primarySkillId) ?? {
      pendingCount: 0,
    };

    current.pendingCount += 1;
    pendingBySkillId.set(attempt.question.primarySkillId, current);
  }

  const recoveryPlans = skillBreakdownSource
    .map((skill) => {
      const dueSignal = dueBySkillId.get(skill.id) ?? null;
      const pendingSignal = pendingBySkillId.get(skill.id) ?? null;
      const weakSignal = isWeakSkillSignal(skill);

      if (!dueSignal && !pendingSignal && !weakSignal) {
        return null;
      }

      const reason: RecoveryPlanReason = dueSignal
        ? "dueNow"
        : pendingSignal
          ? "pendingReview"
          : "weakSignal";

      return {
        skillId: skill.id,
        skillSlug: skill.skillSlug,
        skill: skill.skill,
        score: skill.score,
        confidenceScore: skill.confidenceScore,
        recentFailureCount: skill.recentFailureCount,
        coverageCount: skill.coverageCount,
        dueCount: dueSignal?.dueCount ?? 0,
        pendingCount: pendingSignal?.pendingCount ?? 0,
        moduleSlug: dueSignal?.moduleSlug ?? null,
        moduleTitle: dueSignal?.moduleTitle ?? null,
        recoveryQuestionIds: dueSignal?.questionIds.slice(0, 6) ?? [],
        recoveryQuestions: dueSignal?.questions.slice(0, 3) ?? [],
        reason,
      };
    })
    .flatMap((plan) => (plan ? [plan] : []))
    .sort((left, right) => {
      if (right.dueCount !== left.dueCount) {
        return right.dueCount - left.dueCount;
      }

      if (right.pendingCount !== left.pendingCount) {
        return right.pendingCount - left.pendingCount;
      }

      if (left.score !== right.score) {
        return left.score - right.score;
      }

      if (left.confidenceScore !== right.confidenceScore) {
        return left.confidenceScore - right.confidenceScore;
      }

      if (right.recentFailureCount !== left.recentFailureCount) {
        return right.recentFailureCount - left.recentFailureCount;
      }

      return left.skill.localeCompare(right.skill);
    })
    .slice(0, 4);

  const recentSessionItems = mapSessionHistoryRows(recentSessions);

  return {
    hasAttempts: attemptsCount > 0,
    hasLearningActivity: attemptsCount > 0 || lessonViewedCount > 0,
    overview: {
      stats: {
        readiness: Math.round(readinessAggregate._avg.masteryScore ?? 0),
        masteredQuestions: masteredCount,
        dueToday: dueCount,
        completedMocks: completedMocksCount,
        totalQuestions,
      },
      learn: {
        viewedCount: lessonViewedCount,
        checkpointReadyCount: lessonCheckpointReadyCount,
        readWithoutPracticeCount: lessonReadWithoutPracticeCount,
        lessonReviewQueuedCount,
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
      recoveryPlans,
      learn: {
        viewedCount: lessonViewedCount,
        checkpointReadyCount: lessonCheckpointReadyCount,
        checkpointFailedCount: lessonCheckpointFailedCount,
        readWithoutPracticeCount: lessonReadWithoutPracticeCount,
        followUpCount: lessonFollowUpItems.length,
        followUpQuestionIds: lessonFollowUpItems
          .map((item) => item.questionId)
          .slice(0, 8),
        items: lessonFollowUpItems.slice(0, 4),
      },
    },
    review: {
      dueCount,
      urgentCount: reviewItems.filter((item) => item.urgency !== "normal")
        .length,
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

export async function getMockInterviewReadModel(
  userId: string,
  locale: Locale,
) {
  const now = new Date();
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
        questionId: true,
        isCorrect: true,
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
            progress: {
              where: {
                userId,
              },
              select: {
                nextReviewAt: true,
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
    latestScore !== null && previousAverage !== null
      ? latestScore - previousAverage
      : null;

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

  const weaknessMap = new Map<
    string,
    {
      skill: string;
      skillSlug: string;
      module: string;
      moduleSlug: string;
      track: Track;
      reviewedCount: number;
      totalScore: number;
      dueCount: number;
      bookmarkedCount: number;
      noteCount: number;
      questionIds: string[];
      prompts: string[];
      criterionCounts: Map<SessionRubricCriterion, number>;
      formatCounts: Map<QuestionFormat, number>;
    }
  >();
  const recoveryQuestionMap = new Map<
    string,
    {
      questionId: string;
      questionSlug: string;
      prompt: string;
      skill: string;
      module: string;
      moduleSlug: string;
      format: QuestionFormat;
      isBookmarked: boolean;
      noteBody: string | null;
      noteUpdatedAt: Date | null;
      dominantCriterion: SessionRubricCriterion | null;
      averageScore: number;
      status: "due" | "saved";
      priority: number;
    }
  >();

  for (const attempt of reviewedAttempts) {
    const review = parseAttemptReviewData(attempt.reviewData);

    if (!review) {
      continue;
    }

    const localizedQuestion = localizeQuestion(attempt.question, locale);
    const localizedSkill = localizeSkill(attempt.question.primarySkill, locale);
    const localizedModule = localizeModule(attempt.question.module, locale);
    const criterionCounts = new Map<SessionRubricCriterion, number>();

    for (const criterion of review.criteria) {
      if (criterion.verdict === "solid") {
        continue;
      }

      criterionCounts.set(
        criterion.criterion,
        (criterionCounts.get(criterion.criterion) ?? 0) +
          (criterion.verdict === "missing" ? 2 : 1),
      );
    }

    const dominantCriterion = getDominantCriterion(criterionCounts);
    const isDue = attempt.question.progress[0]?.nextReviewAt
      ? attempt.question.progress[0]!.nextReviewAt! <= now
      : false;
    const note = attempt.question.notes[0] ?? null;
    const bookmarkCount = attempt.question.bookmarks.length > 0 ? 1 : 0;
    const noteCount = note ? 1 : 0;
    const weaknessKey = attempt.question.primarySkillId;
    const current = weaknessMap.get(weaknessKey) ?? {
      skill: localizedSkill.title,
      skillSlug: attempt.question.primarySkill.slug,
      module: localizedModule.title,
      moduleSlug: attempt.question.module.slug,
      track: attempt.question.module.track,
      reviewedCount: 0,
      totalScore: 0,
      dueCount: 0,
      bookmarkedCount: 0,
      noteCount: 0,
      questionIds: [],
      prompts: [],
      criterionCounts: new Map<SessionRubricCriterion, number>(),
      formatCounts: new Map<QuestionFormat, number>(),
    };

    current.reviewedCount += 1;
    current.totalScore += review.scorePercent;
    current.dueCount += isDue ? 1 : 0;
    current.bookmarkedCount += bookmarkCount;
    current.noteCount += noteCount;

    if (!current.questionIds.includes(attempt.questionId)) {
      current.questionIds.push(attempt.questionId);
    }

    if (!current.prompts.includes(localizedQuestion.prompt)) {
      current.prompts.push(localizedQuestion.prompt);
    }

    current.formatCounts.set(
      attempt.question.format,
      (current.formatCounts.get(attempt.question.format) ?? 0) + 1,
    );

    for (const [criterion, count] of criterionCounts.entries()) {
      current.criterionCounts.set(
        criterion,
        (current.criterionCounts.get(criterion) ?? 0) + count,
      );
    }

    weaknessMap.set(weaknessKey, current);

    if (dominantCriterion || review.scorePercent < 100 || isDue) {
      const priority =
        (isDue ? 100 : 0) +
        (review.scorePercent <= 50 ? 25 : review.scorePercent < 80 ? 10 : 0) +
        noteCount * 8 +
        bookmarkCount * 6;

      recoveryQuestionMap.set(attempt.questionId, {
        questionId: attempt.questionId,
        questionSlug: attempt.question.slug,
        prompt: localizedQuestion.prompt,
        skill: localizedSkill.title,
        module: localizedModule.title,
        moduleSlug: attempt.question.module.slug,
        format: attempt.question.format,
        isBookmarked: bookmarkCount > 0,
        noteBody: note?.body ?? null,
        noteUpdatedAt: note?.updatedAt ?? null,
        dominantCriterion,
        averageScore: review.scorePercent,
        status: isDue ? "due" : "saved",
        priority,
      });
    }
  }

  const weaknessHighlights = [...weaknessMap.values()]
    .map((weakness) => ({
      skill: weakness.skill,
      skillSlug: weakness.skillSlug,
      module: weakness.module,
      moduleSlug: weakness.moduleSlug,
      track: weakness.track,
      reviewedCount: weakness.reviewedCount,
      averageScore: Math.round(weakness.totalScore / weakness.reviewedCount),
      dueCount: weakness.dueCount,
      bookmarkedCount: weakness.bookmarkedCount,
      noteCount: weakness.noteCount,
      dominantCriterion: getDominantCriterion(weakness.criterionCounts),
      focusFormats: getFocusFormats(weakness.formatCounts),
      questionIds: weakness.questionIds.slice(0, 6),
      prompts: weakness.prompts.slice(0, 2),
    }))
    .sort((left, right) => {
      if (right.dueCount !== left.dueCount) {
        return right.dueCount - left.dueCount;
      }

      if (left.averageScore !== right.averageScore) {
        return left.averageScore - right.averageScore;
      }

      if (right.reviewedCount !== left.reviewedCount) {
        return right.reviewedCount - left.reviewedCount;
      }

      return left.skill.localeCompare(right.skill);
    })
    .slice(0, 3);

  const recoveryQuestions = [...recoveryQuestionMap.values()]
    .sort((left, right) => {
      if (right.priority !== left.priority) {
        return right.priority - left.priority;
      }

      if (left.averageScore !== right.averageScore) {
        return left.averageScore - right.averageScore;
      }

      return left.prompt.localeCompare(right.prompt);
    })
    .slice(0, 6);

  const recommendedTemplate = getMockRecommendation({
    weakestTemplate,
    weaknessHighlights,
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
    weaknessHighlights,
    recoveryQuestions,
    recommendedTemplate,
  };
}
