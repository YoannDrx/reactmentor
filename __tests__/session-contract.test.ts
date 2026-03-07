import { QuestionLevel, SessionMode, Track } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { resolveTrainingSessionInput } from "@/features/sessions/session-contract";

describe("session-contract helpers", () => {
  it("applies template defaults for mock presets", () => {
    const resolved = resolveTrainingSessionInput({
      userId: "user_1",
      mode: SessionMode.PRACTICE,
      locale: "fr",
      templateKey: "react_mid_30",
    });

    expect(resolved.mode).toBe(SessionMode.MOCK_INTERVIEW);
    expect(resolved.level).toBe(QuestionLevel.MID);
    expect(resolved.tracks).toEqual([Track.REACT]);
    expect(resolved.questionCount).toBe(10);
    expect(resolved.durationMinutes).toBe(30);
  });

  it("keeps explicit overrides when provided", () => {
    const resolved = resolveTrainingSessionInput({
      userId: "user_1",
      mode: SessionMode.PRACTICE,
      locale: "en",
      templateKey: "frontend_senior_defense",
      questionCount: 4,
      tracks: [Track.TYPESCRIPT],
      level: QuestionLevel.MID,
    });

    expect(resolved.mode).toBe(SessionMode.MOCK_INTERVIEW);
    expect(resolved.level).toBe(QuestionLevel.MID);
    expect(resolved.tracks).toEqual([Track.TYPESCRIPT]);
    expect(resolved.questionCount).toBe(4);
    expect(resolved.durationMinutes).toBe(45);
  });
});
