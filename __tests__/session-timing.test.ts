import { describe, expect, it } from "vitest";
import {
  getMockPressureState,
  getMockTemplateTitle,
  getSessionTimingSnapshot,
} from "@/features/sessions/session-timing";

describe("session-timing helpers", () => {
  it("returns a countdown snapshot for timed sessions", () => {
    const snapshot = getSessionTimingSnapshot(
      {
        durationMinutes: 30,
      },
      new Date("2026-03-07T10:00:00.000Z"),
      new Date("2026-03-07T10:12:20.000Z"),
    );

    expect(snapshot).toMatchObject({
      durationMinutes: 30,
      elapsedSeconds: 740,
      remainingSeconds: 1060,
      isExpired: false,
    });
  });

  it("marks the timer as expired when the budget is consumed", () => {
    const snapshot = getSessionTimingSnapshot(
      {
        durationMinutes: 20,
      },
      new Date("2026-03-07T10:00:00.000Z"),
      new Date("2026-03-07T10:20:05.000Z"),
    );

    expect(snapshot?.remainingSeconds).toBe(0);
    expect(snapshot?.isExpired).toBe(true);
  });

  it("classifies pressure states from score, completion and time usage", () => {
    expect(
      getMockPressureState({
        score: 86,
        answeredCount: 10,
        totalQuestions: 10,
        timeSpentMinutes: 24,
        timeBudgetMinutes: 30,
      }),
    ).toBe("controlled");

    expect(
      getMockPressureState({
        score: 68,
        answeredCount: 7,
        totalQuestions: 10,
        timeSpentMinutes: 29,
        timeBudgetMinutes: 30,
      }),
    ).toBe("tight");

    expect(
      getMockPressureState({
        score: 92,
        answeredCount: 10,
        totalQuestions: 10,
        timeSpentMinutes: 24,
        timeBudgetMinutes: 30,
        pendingEvaluationCount: 3,
      }),
    ).toBe("tight");

    expect(
      getMockPressureState({
        score: 44,
        answeredCount: 5,
        totalQuestions: 10,
        timeSpentMinutes: 32,
        timeBudgetMinutes: 30,
      }),
    ).toBe("overrun");
  });

  it("falls back to the mode label when a template title is missing", () => {
    expect(
      getMockTemplateTitle(
        "react_mid_30",
        {
          react_mid_30: "React Mid · 30 minutes",
        },
        "Mock interview",
      ),
    ).toBe("React Mid · 30 minutes");

    expect(getMockTemplateTitle(null, {}, "Mock interview")).toBe("Mock interview");
  });
});
