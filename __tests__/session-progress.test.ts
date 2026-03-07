import { MasteryState } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { computeQuestionProgressUpdate } from "@/features/sessions/session-progress";

describe("session-progress helpers", () => {
  it("promotes correct answers through the mastery states", () => {
    const now = new Date("2026-03-07T10:00:00.000Z");

    const learningState = computeQuestionProgressUpdate(null, true, now);
    const reviewingState = computeQuestionProgressUpdate(
      {
        ease: learningState.ease,
        intervalDays: learningState.intervalDays,
        streakCorrect: learningState.streakCorrect,
      },
      true,
      now,
    );
    const masteredState = computeQuestionProgressUpdate(
      {
        ease: reviewingState.ease,
        intervalDays: reviewingState.intervalDays,
        streakCorrect: reviewingState.streakCorrect,
      },
      true,
      now,
    );

    expect(learningState.masteryState).toBe(MasteryState.LEARNING);
    expect(reviewingState.masteryState).toBe(MasteryState.REVIEWING);
    expect(masteredState.masteryState).toBe(MasteryState.MASTERED);
    expect(masteredState.intervalDays).toBeGreaterThan(reviewingState.intervalDays);
  });

  it("resets unstable knowledge after an incorrect answer", () => {
    const now = new Date("2026-03-07T10:00:00.000Z");

    const nextState = computeQuestionProgressUpdate(
      {
        ease: 2.6,
        intervalDays: 7,
        streakCorrect: 3,
      },
      false,
      now,
    );

    expect(nextState.masteryState).toBe(MasteryState.LEARNING);
    expect(nextState.intervalDays).toBe(1);
    expect(nextState.streakCorrect).toBe(0);
    expect(nextState.ease).toBeLessThan(2.6);
  });
});
