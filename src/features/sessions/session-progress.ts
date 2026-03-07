import { MasteryState } from "@prisma/client";

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
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

function clampEase(value: number) {
  return Math.max(1.3, Math.min(3.2, Number(value.toFixed(2))));
}

function getRetrievalMultiplier(overdueDays: number) {
  if (overdueDays >= 7) {
    return 1.35;
  }

  if (overdueDays >= 3) {
    return 1.18;
  }

  if (overdueDays >= 0) {
    return 1.05;
  }

  if (overdueDays <= -3) {
    return 0.8;
  }

  return 0.9;
}

export function computeQuestionProgressUpdate(
  previousProgress:
    | {
        ease: number;
        intervalDays: number;
        streakCorrect: number;
        reviewCount?: number;
        lapseCount?: number;
        lastOutcomeCorrect?: boolean | null;
        masteryState?: MasteryState;
        nextReviewAt?: Date | null;
        lastAttemptAt?: Date | null;
      }
    | null
    | undefined,
  isCorrect: boolean,
  now: Date,
) {
  const ease = previousProgress?.ease ?? 2.3;
  const intervalDays = previousProgress?.intervalDays ?? 1;
  const streakCorrect = previousProgress?.streakCorrect ?? 0;
  const reviewCount = previousProgress?.reviewCount ?? 0;
  const lapseCount = previousProgress?.lapseCount ?? 0;
  const masteryState = previousProgress?.masteryState ?? MasteryState.NEW;
  const overdueDays = previousProgress?.nextReviewAt
    ? differenceInCalendarDays(now, previousProgress.nextReviewAt)
    : 0;

  if (!isCorrect) {
    const wasStable =
      masteryState === MasteryState.MASTERED || intervalDays >= 6;
    const easePenalty =
      masteryState === MasteryState.MASTERED
        ? 0.32
        : masteryState === MasteryState.REVIEWING
          ? 0.26
          : 0.18;
    const nextIntervalDays = wasStable ? 2 : 1;

    return {
      ease: clampEase(ease - easePenalty),
      intervalDays: nextIntervalDays,
      streakCorrect: 0,
      reviewCount: reviewCount + 1,
      lapseCount: lapseCount + 1,
      lastOutcomeCorrect: false,
      masteryState: wasStable ? MasteryState.REVIEWING : MasteryState.LEARNING,
      lastAttemptAt: now,
      nextReviewAt: addDays(now, nextIntervalDays),
    };
  }

  const nextStreak = streakCorrect + 1;
  const retrievalMultiplier = getRetrievalMultiplier(overdueDays);
  let nextIntervalDays = 1;

  if (reviewCount === 0) {
    nextIntervalDays = 1;
  } else if (nextStreak === 1) {
    nextIntervalDays = Math.max(2, Math.round(Math.max(1, intervalDays) * 1.35));
  } else if (nextStreak === 2) {
    nextIntervalDays = Math.max(
      3,
      Math.round(Math.max(1, intervalDays) * Math.max(1.8, ease - 0.25)),
    );
  } else {
    nextIntervalDays = Math.max(
      6,
      Math.round(
        Math.max(1, intervalDays) *
          Math.max(2.1, ease) *
          retrievalMultiplier,
      ),
    );
  }

  nextIntervalDays = Math.min(45, nextIntervalDays);
  const nextEase = clampEase(
    ease +
      (overdueDays >= 3 ? 0.12 : overdueDays >= 0 ? 0.08 : 0.04) +
      (previousProgress?.lastOutcomeCorrect === false ? 0.03 : 0),
  );
  const nextMasteryState =
    nextStreak >= 3 && nextIntervalDays >= 6
      ? MasteryState.MASTERED
      : nextStreak >= 2 ||
          masteryState === MasteryState.REVIEWING ||
          masteryState === MasteryState.MASTERED
        ? MasteryState.REVIEWING
        : MasteryState.LEARNING;

  return {
    ease: nextEase,
    intervalDays: nextIntervalDays,
    streakCorrect: nextStreak,
    reviewCount: reviewCount + 1,
    lapseCount,
    lastOutcomeCorrect: true,
    masteryState: nextMasteryState,
    lastAttemptAt: now,
    nextReviewAt: addDays(now, nextIntervalDays),
  };
}
