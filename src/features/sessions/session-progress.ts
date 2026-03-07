import { MasteryState } from "@prisma/client";

function addDays(date: Date, days: number) {
  const nextDate = new Date(date);
  nextDate.setDate(nextDate.getDate() + days);
  return nextDate;
}

export function computeQuestionProgressUpdate(
  previousProgress:
    | {
        ease: number;
        intervalDays: number;
        streakCorrect: number;
      }
    | null
    | undefined,
  isCorrect: boolean,
  now: Date,
) {
  const ease = previousProgress?.ease ?? 2.3;
  const intervalDays = previousProgress?.intervalDays ?? 1;
  const streakCorrect = previousProgress?.streakCorrect ?? 0;

  if (!isCorrect) {
    return {
      ease: Math.max(1.3, Number((ease - 0.2).toFixed(2))),
      intervalDays: 1,
      streakCorrect: 0,
      masteryState: MasteryState.LEARNING,
      lastAttemptAt: now,
      nextReviewAt: addDays(now, 1),
    };
  }

  const nextStreak = streakCorrect + 1;
  const nextIntervalDays = Math.min(30, Math.max(1, intervalDays * 2));

  return {
    ease: Math.min(3.2, Number((ease + 0.1).toFixed(2))),
    intervalDays: nextIntervalDays,
    streakCorrect: nextStreak,
    masteryState:
      nextStreak >= 3
        ? MasteryState.MASTERED
        : nextStreak >= 2
          ? MasteryState.REVIEWING
          : MasteryState.LEARNING,
    lastAttemptAt: now,
    nextReviewAt: addDays(now, nextIntervalDays),
  };
}
