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
          isCorrect: false,
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
          isCorrect: true,
          verbalizePoints: ["Explain cleanup timing."],
          takeaways: ["Cleanup runs before the next effect."],
        },
        {
          questionId: "q3",
          prompt: "Question three",
          skill: "Rendering",
          isCorrect: null,
          verbalizePoints: ["Explain remount versus rerender."],
          takeaways: ["Keys carry identity."],
        },
      ],
    });

    expect(report.skillBreakdown).toEqual([
      {
        skill: "Rendering",
        questionCount: 1,
        correctCount: 0,
        accuracyPercent: 0,
      },
      {
        skill: "Effects",
        questionCount: 2,
        correctCount: 1,
        accuracyPercent: 50,
      },
    ]);

    expect(report.riskItems).toEqual([
      {
        questionId: "q1",
        prompt: "Question one",
        skill: "Effects",
        status: "incorrect",
        verbalizePoints: [
          "Explain dependency identity.",
          "Link the answer to synchronization.",
        ],
      },
      {
        questionId: "q3",
        prompt: "Question three",
        skill: "Rendering",
        status: "unanswered",
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
});
