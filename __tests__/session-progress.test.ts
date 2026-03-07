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
        reviewCount: learningState.reviewCount,
        lapseCount: learningState.lapseCount,
        lastOutcomeCorrect: learningState.lastOutcomeCorrect,
        masteryState: learningState.masteryState,
        nextReviewAt: learningState.nextReviewAt,
      },
      true,
      new Date("2026-03-08T10:00:00.000Z"),
    );
    const masteredState = computeQuestionProgressUpdate(
      {
        ease: reviewingState.ease,
        intervalDays: reviewingState.intervalDays,
        streakCorrect: reviewingState.streakCorrect,
        reviewCount: reviewingState.reviewCount,
        lapseCount: reviewingState.lapseCount,
        lastOutcomeCorrect: reviewingState.lastOutcomeCorrect,
        masteryState: reviewingState.masteryState,
        nextReviewAt: reviewingState.nextReviewAt,
      },
      true,
      new Date("2026-03-11T10:00:00.000Z"),
    );

    expect(learningState.masteryState).toBe(MasteryState.LEARNING);
    expect(learningState.reviewCount).toBe(1);
    expect(reviewingState.masteryState).toBe(MasteryState.REVIEWING);
    expect(reviewingState.intervalDays).toBeGreaterThan(learningState.intervalDays);
    expect(masteredState.masteryState).toBe(MasteryState.MASTERED);
    expect(masteredState.intervalDays).toBeGreaterThan(reviewingState.intervalDays);
  });

  it("downgrades a previously stable card to reviewing after an incorrect answer", () => {
    const now = new Date("2026-03-07T10:00:00.000Z");

    const nextState = computeQuestionProgressUpdate(
      {
        ease: 2.6,
        intervalDays: 7,
        streakCorrect: 3,
        reviewCount: 4,
        lapseCount: 0,
        lastOutcomeCorrect: true,
        masteryState: MasteryState.MASTERED,
        nextReviewAt: new Date("2026-03-07T09:00:00.000Z"),
      },
      false,
      now,
    );

    expect(nextState.masteryState).toBe(MasteryState.REVIEWING);
    expect(nextState.intervalDays).toBe(2);
    expect(nextState.streakCorrect).toBe(0);
    expect(nextState.lapseCount).toBe(1);
    expect(nextState.lastOutcomeCorrect).toBe(false);
    expect(nextState.ease).toBeLessThan(2.6);
  });

  it("keeps a fragile card in learning after repeated failures, then recovers step by step", () => {
    const failureState = computeQuestionProgressUpdate(
      {
        ease: 2.1,
        intervalDays: 2,
        streakCorrect: 1,
        reviewCount: 2,
        lapseCount: 1,
        lastOutcomeCorrect: true,
        masteryState: MasteryState.LEARNING,
        nextReviewAt: new Date("2026-03-07T09:00:00.000Z"),
      },
      false,
      new Date("2026-03-07T10:00:00.000Z"),
    );

    const recoveryState = computeQuestionProgressUpdate(
      failureState,
      true,
      new Date("2026-03-08T10:00:00.000Z"),
    );

    expect(failureState.masteryState).toBe(MasteryState.LEARNING);
    expect(failureState.intervalDays).toBe(1);
    expect(recoveryState.masteryState).toBe(MasteryState.LEARNING);
    expect(recoveryState.intervalDays).toBeGreaterThanOrEqual(2);
    expect(recoveryState.lastOutcomeCorrect).toBe(true);
  });

  it("rewards a correct answer that survived several overdue days", () => {
    const onTime = computeQuestionProgressUpdate(
      {
        ease: 2.45,
        intervalDays: 3,
        streakCorrect: 2,
        reviewCount: 2,
        lapseCount: 0,
        lastOutcomeCorrect: true,
        masteryState: MasteryState.REVIEWING,
        nextReviewAt: new Date("2026-03-07T10:00:00.000Z"),
      },
      true,
      new Date("2026-03-07T10:00:00.000Z"),
    );

    const overdue = computeQuestionProgressUpdate(
      {
        ease: 2.45,
        intervalDays: 3,
        streakCorrect: 2,
        reviewCount: 2,
        lapseCount: 0,
        lastOutcomeCorrect: true,
        masteryState: MasteryState.REVIEWING,
        nextReviewAt: new Date("2026-03-02T10:00:00.000Z"),
      },
      true,
      new Date("2026-03-07T10:00:00.000Z"),
    );

    expect(overdue.masteryState).toBe(MasteryState.MASTERED);
    expect(overdue.intervalDays).toBeGreaterThan(onTime.intervalDays);
    expect(overdue.ease).toBeGreaterThan(onTime.ease);
  });
});
