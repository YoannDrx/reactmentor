function clampSkillScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getDifficultyWeight(difficulty: number) {
  return Math.max(1, Math.min(5, Math.round(difficulty)));
}

function differenceInDays(left: Date, right: Date) {
  return Math.floor((left.getTime() - right.getTime()) / (1000 * 60 * 60 * 24));
}

function getStalenessPenalty(ageInDays: number) {
  if (ageInDays <= 7) {
    return 0;
  }

  if (ageInDays <= 14) {
    return 4;
  }

  if (ageInDays <= 21) {
    return 8;
  }

  if (ageInDays <= 30) {
    return 12;
  }

  return 18;
}

function getFreshnessCap(ageInDays: number) {
  if (ageInDays <= 7) {
    return 100;
  }

  if (ageInDays <= 14) {
    return 94;
  }

  if (ageInDays <= 21) {
    return 88;
  }

  if (ageInDays <= 30) {
    return 82;
  }

  return 74;
}

function getConfidenceScore(params: {
  coverageCount: number;
  uniqueQuestionCount: number;
  uniqueDifficultyCount: number;
  recentAttemptCount: number;
  recentFailureCount: number;
  lastAttemptAgeInDays: number;
}) {
  const coverageConfidence = Math.min(24, params.coverageCount * 6);
  const breadthConfidence = Math.min(40, params.uniqueQuestionCount * 10);
  const difficultyConfidence =
    params.uniqueDifficultyCount >= 4
      ? 18
      : params.uniqueDifficultyCount === 3
        ? 14
        : params.uniqueDifficultyCount === 2
          ? 8
          : params.uniqueDifficultyCount === 1
            ? 4
            : 0;
  const recentActivityConfidence =
    params.recentAttemptCount >= 4
      ? 8
      : params.recentAttemptCount === 3
        ? 6
        : params.recentAttemptCount === 2
          ? 4
          : params.recentAttemptCount === 1
            ? 2
            : 0;
  const freshnessBonus =
    params.lastAttemptAgeInDays <= 2
      ? 12
      : params.lastAttemptAgeInDays <= 7
        ? 8
        : params.lastAttemptAgeInDays <= 14
          ? 4
          : 0;
  const stalenessPenalty =
    params.lastAttemptAgeInDays <= 7
      ? 0
      : params.lastAttemptAgeInDays <= 14
        ? 4
        : params.lastAttemptAgeInDays <= 21
          ? 10
          : params.lastAttemptAgeInDays <= 30
            ? 16
            : 22;
  const recentFailurePenalty = Math.min(14, params.recentFailureCount * 4);

  return clampSkillScore(
    coverageConfidence +
      breadthConfidence +
      difficultyConfidence +
      recentActivityConfidence +
      freshnessBonus -
      stalenessPenalty -
      recentFailurePenalty,
  );
}

export type SkillAttemptSignal = {
  questionId?: string;
  isCorrect: boolean;
  createdAt: Date;
  difficulty: number;
};

export function computeSkillProgressSnapshot(
  attempts: SkillAttemptSignal[],
  now: Date = new Date(),
) {
  if (attempts.length === 0) {
    return {
      masteryScore: 0,
      correctRate: 0,
      coverageCount: 0,
      uniqueQuestionCount: 0,
      uniqueDifficultyCount: 0,
      recentFailureCount: 0,
      confidenceScore: 0,
      lastAttemptAt: null,
      masteryCap: 0,
    };
  }

  const sortedAttempts = [...attempts].sort(
    (left, right) => right.createdAt.getTime() - left.createdAt.getTime(),
  );
  const totalWeight = sortedAttempts.reduce(
    (sum, attempt) => sum + getDifficultyWeight(attempt.difficulty),
    0,
  );
  const earnedWeight = sortedAttempts.reduce(
    (sum, attempt) =>
      sum + (attempt.isCorrect ? getDifficultyWeight(attempt.difficulty) : 0),
    0,
  );
  const weightedCorrectRate = totalWeight > 0 ? earnedWeight / totalWeight : 0;
  const uniqueQuestionCount = new Set(
    sortedAttempts.map((attempt, index) => attempt.questionId ?? `attempt-${index}`),
  ).size;
  const uniqueDifficultyCount = new Set(
    sortedAttempts.map((attempt) => getDifficultyWeight(attempt.difficulty)),
  ).size;
  const lastAttemptAt = sortedAttempts[0]?.createdAt ?? null;
  const lastAttemptAgeInDays = lastAttemptAt
    ? Math.max(0, differenceInDays(now, lastAttemptAt))
    : 0;
  const recentAttemptCount = sortedAttempts.filter(
    (attempt) => Math.max(0, differenceInDays(now, attempt.createdAt)) <= 14,
  ).length;
  const recentFailureCount = sortedAttempts.filter((attempt) => {
    if (attempt.isCorrect) {
      return false;
    }

    return Math.max(0, differenceInDays(now, attempt.createdAt)) <= 14;
  }).length;

  const recentFailurePenalty = sortedAttempts.reduce((sum, attempt) => {
    if (attempt.isCorrect) {
      return sum;
    }

    const ageInDays = Math.max(0, differenceInDays(now, attempt.createdAt));

    if (ageInDays > 7) {
      return sum;
    }

    const freshnessMultiplier = ageInDays <= 1 ? 1.4 : ageInDays <= 3 ? 1.1 : 0.8;

    return (
      sum +
      getDifficultyWeight(attempt.difficulty) * 2.5 * freshnessMultiplier
    );
  }, 0);

  let recentCorrectStreak = 0;

  for (const attempt of sortedAttempts) {
    if (!attempt.isCorrect) {
      break;
    }

    recentCorrectStreak += 1;
  }

  const streakBonus = Math.min(6, recentCorrectStreak * 2);
  const coverageBonus =
    uniqueQuestionCount >= 4 ? 6 : uniqueQuestionCount === 3 ? 4 : uniqueQuestionCount === 2 ? 2 : 0;
  const difficultyCoverageBonus =
    uniqueDifficultyCount >= 3
      ? 4
      : uniqueDifficultyCount === 2
        ? 2
        : 0;
  const baseMasteryCap = Math.min(
    100,
    (uniqueQuestionCount >= 4
      ? 100
      : uniqueQuestionCount === 3
        ? 92
        : uniqueQuestionCount === 2
          ? 84
          : 72) +
      (uniqueDifficultyCount >= 3 ? 6 : uniqueDifficultyCount === 2 ? 2 : 0),
  );
  const masteryCap = Math.min(baseMasteryCap, getFreshnessCap(lastAttemptAgeInDays));
  const confidenceScore = getConfidenceScore({
    coverageCount: sortedAttempts.length,
    uniqueQuestionCount,
    uniqueDifficultyCount,
    recentAttemptCount,
    recentFailureCount,
    lastAttemptAgeInDays,
  });

  return {
    masteryScore: Math.min(
      masteryCap,
      clampSkillScore(
        weightedCorrectRate * 100 -
          recentFailurePenalty +
          streakBonus +
          coverageBonus +
          difficultyCoverageBonus -
          getStalenessPenalty(lastAttemptAgeInDays),
      ),
    ),
    correctRate: Number(weightedCorrectRate.toFixed(4)),
    coverageCount: sortedAttempts.length,
    uniqueQuestionCount,
    uniqueDifficultyCount,
    recentFailureCount,
    confidenceScore,
    lastAttemptAt,
    masteryCap,
  };
}
