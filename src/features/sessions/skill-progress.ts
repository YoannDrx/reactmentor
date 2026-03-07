function clampSkillScore(value: number) {
  return Math.max(0, Math.min(100, Math.round(value)));
}

function getDifficultyWeight(difficulty: number) {
  return Math.max(1, Math.min(5, Math.round(difficulty)));
}

function differenceInDays(left: Date, right: Date) {
  return Math.floor((left.getTime() - right.getTime()) / (1000 * 60 * 60 * 24));
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
      uniqueQuestionCount: 0,
      uniqueDifficultyCount: 0,
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
  const masteryCap = Math.min(
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

  return {
    masteryScore: Math.min(
      masteryCap,
      clampSkillScore(
        weightedCorrectRate * 100 -
          recentFailurePenalty +
          streakBonus +
          coverageBonus +
          difficultyCoverageBonus,
      ),
    ),
    correctRate: Number(weightedCorrectRate.toFixed(4)),
    uniqueQuestionCount,
    uniqueDifficultyCount,
    masteryCap,
  };
}
