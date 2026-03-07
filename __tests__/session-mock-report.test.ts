import { describe, expect, it } from "vitest";
import { computeMockSessionReport } from "@/features/sessions/session-mock-report";

describe("computeMockSessionReport", () => {
  it("builds a skill breakdown and prioritizes incorrect answers over unanswered ones", () => {
    const report = computeMockSessionReport({
      questions: [
        {
          questionId: "q1",
          prompt: "Question one",
          skill: "Effects",
          format: "SINGLE_CHOICE",
          isBookmarked: false,
          noteBody: null,
          noteUpdatedAt: null,
          attempted: true,
          isCorrect: false,
          scorePercent: 0,
          verbalizePoints: [
            "Explain dependency identity.",
            "Link the answer to synchronization.",
          ],
          takeaways: ["Dependencies are compared by reference."],
        },
        {
          questionId: "q2",
          prompt: "Question two",
          skill: "Effects",
          format: "CODE_OUTPUT",
          isBookmarked: false,
          noteBody: null,
          noteUpdatedAt: null,
          attempted: true,
          isCorrect: true,
          scorePercent: 100,
          verbalizePoints: ["Explain cleanup timing."],
          takeaways: ["Cleanup runs before the next effect."],
        },
        {
          questionId: "q3",
          prompt: "Question three",
          skill: "Rendering",
          format: "OPEN_ENDED",
          isBookmarked: true,
          noteBody: "Explain remount versus rerender with identity first.",
          noteUpdatedAt: new Date("2026-03-07T09:00:00.000Z"),
          attempted: true,
          isCorrect: null,
          scorePercent: null,
          verbalizePoints: ["Explain remount versus rerender."],
          takeaways: ["Keys carry identity."],
        },
      ],
    });

    expect(report.skillBreakdown).toEqual([
      {
        skill: "Rendering",
        questionCount: 1,
        gradedCount: 0,
        pendingCount: 1,
        correctCount: 0,
        accuracyPercent: 0,
      },
      {
        skill: "Effects",
        questionCount: 2,
        gradedCount: 2,
        pendingCount: 0,
        correctCount: 1,
        accuracyPercent: 50,
      },
    ]);

    expect(report.riskItems).toEqual([
      {
        questionId: "q1",
        prompt: "Question one",
        skill: "Effects",
        format: "SINGLE_CHOICE",
        isBookmarked: false,
        noteBody: null,
        noteUpdatedAt: null,
        status: "incorrect",
        rubricCriteria: ["accuracy", "mechanism", "tradeoffs"],
        focusPoints: [
          "Explain dependency identity.",
          "Link the answer to synchronization.",
          "Dependencies are compared by reference.",
        ],
        verbalizePoints: [
          "Explain dependency identity.",
          "Link the answer to synchronization.",
        ],
      },
      {
        questionId: "q3",
        prompt: "Question three",
        skill: "Rendering",
        format: "OPEN_ENDED",
        isBookmarked: true,
        noteBody: "Explain remount versus rerender with identity first.",
        noteUpdatedAt: new Date("2026-03-07T09:00:00.000Z"),
        status: "pending_review",
        rubricCriteria: ["accuracy", "mechanism", "tradeoffs"],
        focusPoints: [
          "Explain remount versus rerender.",
          "Keys carry identity.",
        ],
        verbalizePoints: ["Explain remount versus rerender."],
      },
    ]);

    expect(report.verbalizePoints).toEqual([
      "Explain dependency identity.",
      "Link the answer to synchronization.",
      "Explain remount versus rerender.",
      "Explain cleanup timing.",
      "Dependencies are compared by reference.",
      "Cleanup runs before the next effect.",
    ]);
  });

  it("averages graded score percents so partially reviewed open answers affect the mock score", () => {
    const report = computeMockSessionReport({
      questions: [
        {
          questionId: "q1",
          prompt: "Question one",
          skill: "Effects",
          format: "CODE_OUTPUT",
          isBookmarked: false,
          noteBody: "Keep the dependency list explicit.",
          noteUpdatedAt: new Date("2026-03-07T08:00:00.000Z"),
          attempted: true,
          isCorrect: false,
          scorePercent: 50,
          verbalizePoints: ["Explain the missing dependency."],
          takeaways: ["Keep the dependency list explicit."],
        },
        {
          questionId: "q2",
          prompt: "Question two",
          skill: "Effects",
          format: "SINGLE_CHOICE",
          isBookmarked: false,
          noteBody: null,
          noteUpdatedAt: null,
          attempted: true,
          isCorrect: true,
          scorePercent: 100,
          verbalizePoints: [],
          takeaways: [],
        },
      ],
    });

    expect(report.skillBreakdown).toEqual([
      {
        skill: "Effects",
        questionCount: 2,
        gradedCount: 2,
        pendingCount: 0,
        correctCount: 1,
        accuracyPercent: 75,
      },
    ]);
  });
});
