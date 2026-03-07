import { describe, expect, it } from "vitest";
import { computeSkillProgressSnapshot } from "@/features/sessions/skill-progress";

describe("computeSkillProgressSnapshot", () => {
  it("returns a zeroed snapshot when no attempt exists yet", () => {
    expect(computeSkillProgressSnapshot([], new Date("2026-03-07T12:00:00.000Z"))).toEqual({
      masteryScore: 0,
      correctRate: 0,
      uniqueQuestionCount: 0,
      uniqueDifficultyCount: 0,
      masteryCap: 0,
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
    expect(snapshot.uniqueQuestionCount).toBe(2);
    expect(snapshot.uniqueDifficultyCount).toBe(2);
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
    expect(sparse.masteryScore).toBeLessThanOrEqual(72);
    expect(broad.masteryScore).toBe(100);
  });
});
