import { describe, expect, it } from "vitest";
import type { Prisma } from "@prisma/client";
import {
  PASSING_ATTEMPT_REVIEW_SCORE_PERCENT,
  buildAttemptReview,
  getAttemptScorePercent,
  isPassingAttemptReview,
  parseAttemptReviewData,
  toAttemptReviewData,
} from "@/features/sessions/attempt-review";

describe("attempt-review helpers", () => {
  it("builds a structured rubric review and computes its score percent", () => {
    const review = buildAttemptReview({
      format: "BUG_HUNT",
      summary: "The diagnosis is mostly there but the fix remains too vague.",
      criteriaVerdicts: [
        { criterion: "rootCause", verdict: "solid" },
        { criterion: "evidence", verdict: "solid" },
        { criterion: "repair", verdict: "partial" },
      ],
    });

    expect(review).toEqual({
      kind: "rubric_review",
      summary: "The diagnosis is mostly there but the fix remains too vague.",
      criteria: [
        { criterion: "rootCause", verdict: "solid" },
        { criterion: "evidence", verdict: "solid" },
        { criterion: "repair", verdict: "partial" },
      ],
      scorePercent: 83,
    });
    expect(review && isPassingAttemptReview(review)).toBe(true);
  });

  it("supports quick preset reviews and parses stored JSON review data", () => {
    const review = buildAttemptReview({
      format: "OPEN_ENDED",
      presetVerdict: "missing",
      criteriaVerdicts: [],
    });

    expect(review).not.toBeNull();
    expect(review?.scorePercent).toBe(0);
    expect(review && isPassingAttemptReview(review)).toBe(false);
    expect(PASSING_ATTEMPT_REVIEW_SCORE_PERCENT).toBe(70);

    const parsed = parseAttemptReviewData(
      (review ? toAttemptReviewData(review) : null) as Prisma.JsonValue | null,
    );

    expect(parsed).toEqual(review);
  });

  it("prefers stored rubric scores over binary correctness when deriving attempt scores", () => {
    expect(
      getAttemptScorePercent({
        isCorrect: false,
        reviewData: {
          kind: "rubric_review",
          criteria: [
            { criterion: "accuracy", verdict: "solid" },
            { criterion: "mechanism", verdict: "partial" },
            { criterion: "tradeoffs", verdict: "partial" },
          ],
          summary: null,
          scorePercent: 67,
        },
      }),
    ).toBe(67);

    expect(
      getAttemptScorePercent({
        isCorrect: true,
        reviewData: null,
      }),
    ).toBe(100);
  });
});
