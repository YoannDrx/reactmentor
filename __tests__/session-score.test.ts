import { SessionMode, type Prisma } from "@prisma/client";
import { describe, expect, it } from "vitest";
import {
  buildAttemptReview,
  toAttemptReviewData,
} from "@/features/sessions/attempt-review";
import { calculateTrainingSessionScore } from "@/features/sessions/session-score";

describe("calculateTrainingSessionScore", () => {
  it("re-weights mock rubric scores when the template emphasizes a weaker criterion", () => {
    const review = buildAttemptReview({
      format: "OPEN_ENDED",
      criteriaVerdicts: [
        { criterion: "accuracy", verdict: "solid" },
        { criterion: "mechanism", verdict: "solid" },
        { criterion: "tradeoffs", verdict: "missing" },
      ],
    });

    expect(review?.scorePercent).toBe(80);

    const attempt = {
      isCorrect: false,
      reviewData: review ? (toAttemptReviewData(review) as Prisma.JsonValue) : null,
      question: {
        format: "OPEN_ENDED" as const,
        difficulty: 4,
      },
    };

    expect(
      calculateTrainingSessionScore({
        mode: SessionMode.PRACTICE,
        attempts: [attempt],
      }),
    ).toBe(80);

    expect(
      calculateTrainingSessionScore({
        mode: SessionMode.MOCK_INTERVIEW,
        config: {
          source: "mock_template",
          locale: "en",
          questionCount: 1,
          templateKey: "frontend_senior_defense",
        },
        attempts: [attempt],
      }),
    ).toBe(75);
  });

  it("keeps harder defense questions heavier than easy closed questions in mock sessions", () => {
    expect(
      calculateTrainingSessionScore({
        mode: SessionMode.MOCK_INTERVIEW,
        config: {
          source: "mock_template",
          locale: "en",
          questionCount: 2,
          templateKey: "frontend_senior_defense",
        },
        attempts: [
          {
            isCorrect: true,
            reviewData: null,
            question: {
              format: "BUG_HUNT",
              difficulty: 5,
            },
          },
          {
            isCorrect: false,
            reviewData: null,
            question: {
              format: "SINGLE_CHOICE",
              difficulty: 1,
            },
          },
        ],
      }),
    ).toBe(90);
  });
});
