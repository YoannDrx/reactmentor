import { describe, expect, it } from "vitest";
import { computeSkillProgressSnapshot } from "@/features/sessions/skill-progress";

describe("computeSkillProgressSnapshot", () => {
  it("returns a zeroed snapshot when no attempt exists yet", () => {
    expect(computeSkillProgressSnapshot([], new Date("2026-03-07T12:00:00.000Z"))).toEqual({
      masteryScore: 0,
      correctRate: 0,
      coverageCount: 0,
      recentAttemptCount: 0,
      uniqueQuestionCount: 0,
      uniqueDifficultyCount: 0,
      recentFailureCount: 0,
      confidenceScore: 0,
      lastAttemptAt: null,
      masteryCap: 0,
      signalDetails: null,
    });
  });

  it("weights harder correct answers more than easier incorrect ones", () => {
    const snapshot = computeSkillProgressSnapshot(
      [
        {
          questionId: "q-hard",
          isCorrect: true,
          difficulty: 5,
          createdAt: new Date("2026-03-07T11:00:00.000Z"),
        },
        {
          questionId: "q-easy",
          isCorrect: false,
          difficulty: 1,
          createdAt: new Date("2026-03-06T11:00:00.000Z"),
        },
      ],
      new Date("2026-03-07T12:00:00.000Z"),
    );

    expect(snapshot.correctRate).toBeCloseTo(0.8333, 4);
    expect(snapshot.masteryScore).toBeGreaterThan(70);
    expect(snapshot.coverageCount).toBe(2);
    expect(snapshot.recentAttemptCount).toBe(2);
    expect(snapshot.uniqueQuestionCount).toBe(2);
    expect(snapshot.uniqueDifficultyCount).toBe(2);
    expect(snapshot.confidenceScore).toBeGreaterThanOrEqual(40);
    expect(snapshot.lastAttemptAt).toEqual(new Date("2026-03-07T11:00:00.000Z"));
    expect(snapshot.signalDetails).toMatchObject({
      weightedAccuracyScore: 83,
      masteryCap: 86,
    });
  });

  it("penalizes recent failures more than older ones", () => {
    const baseline = computeSkillProgressSnapshot(
      [
        {
          questionId: "q-stable",
          isCorrect: true,
          difficulty: 3,
          createdAt: new Date("2026-03-07T11:00:00.000Z"),
        },
        {
          questionId: "q-old-failure",
          isCorrect: false,
          difficulty: 3,
          createdAt: new Date("2026-02-20T11:00:00.000Z"),
        },
      ],
      new Date("2026-03-07T12:00:00.000Z"),
    );
    const penalized = computeSkillProgressSnapshot(
      [
        {
          questionId: "q-stable",
          isCorrect: true,
          difficulty: 3,
          createdAt: new Date("2026-03-07T11:00:00.000Z"),
        },
        {
          questionId: "q-recent-failure",
          isCorrect: false,
          difficulty: 3,
          createdAt: new Date("2026-03-06T11:00:00.000Z"),
        },
      ],
      new Date("2026-03-07T12:00:00.000Z"),
    );

    expect(penalized.correctRate).toBe(baseline.correctRate);
    expect(penalized.masteryScore).toBeLessThan(baseline.masteryScore);
    expect(penalized.recentFailureCount).toBe(1);
  });

  it("caps sparse high-accuracy signals below broader skill coverage", () => {
    const sparse = computeSkillProgressSnapshot(
      [
        {
          questionId: "q-1",
          isCorrect: true,
          difficulty: 5,
          createdAt: new Date("2026-03-07T11:00:00.000Z"),
        },
      ],
      new Date("2026-03-07T12:00:00.000Z"),
    );
    const broad = computeSkillProgressSnapshot(
      [
        {
          questionId: "q-1",
          isCorrect: true,
          difficulty: 2,
          createdAt: new Date("2026-03-07T11:00:00.000Z"),
        },
        {
          questionId: "q-2",
          isCorrect: true,
          difficulty: 3,
          createdAt: new Date("2026-03-06T11:00:00.000Z"),
        },
        {
          questionId: "q-3",
          isCorrect: true,
          difficulty: 4,
          createdAt: new Date("2026-03-05T11:00:00.000Z"),
        },
        {
          questionId: "q-4",
          isCorrect: true,
          difficulty: 5,
          createdAt: new Date("2026-03-04T11:00:00.000Z"),
        },
      ],
      new Date("2026-03-07T12:00:00.000Z"),
    );

    expect(sparse.masteryScore).toBeLessThan(broad.masteryScore);
    expect(sparse.masteryCap).toBeLessThan(broad.masteryCap);
    expect(sparse.confidenceScore).toBeLessThan(broad.confidenceScore);
    expect(sparse.masteryScore).toBeLessThanOrEqual(72);
    expect(broad.masteryScore).toBe(100);
  });

  it("downgrades stale signals even when past accuracy was high", () => {
    const recent = computeSkillProgressSnapshot(
      [
        {
          questionId: "q-1",
          isCorrect: true,
          difficulty: 4,
          createdAt: new Date("2026-03-06T11:00:00.000Z"),
        },
        {
          questionId: "q-2",
          isCorrect: true,
          difficulty: 3,
          createdAt: new Date("2026-03-05T11:00:00.000Z"),
        },
        {
          questionId: "q-3",
          isCorrect: true,
          difficulty: 2,
          createdAt: new Date("2026-03-04T11:00:00.000Z"),
        },
      ],
      new Date("2026-03-07T12:00:00.000Z"),
    );
    const stale = computeSkillProgressSnapshot(
      [
        {
          questionId: "q-1",
          isCorrect: true,
          difficulty: 4,
          createdAt: new Date("2026-01-04T11:00:00.000Z"),
        },
        {
          questionId: "q-2",
          isCorrect: true,
          difficulty: 3,
          createdAt: new Date("2026-01-03T11:00:00.000Z"),
        },
        {
          questionId: "q-3",
          isCorrect: true,
          difficulty: 2,
          createdAt: new Date("2026-01-02T11:00:00.000Z"),
        },
      ],
      new Date("2026-03-07T12:00:00.000Z"),
    );

    expect(stale.masteryScore).toBeLessThan(recent.masteryScore);
    expect(stale.masteryCap).toBeLessThan(recent.masteryCap);
    expect(stale.confidenceScore).toBeLessThan(recent.confidenceScore);
    expect(stale.signalDetails?.stalenessPenalty).toBeGreaterThan(
      recent.signalDetails?.stalenessPenalty ?? 0,
    );
    expect(stale.signalDetails?.freshnessCap).toBeLessThan(
      recent.signalDetails?.freshnessCap ?? 100,
    );
  });
});
