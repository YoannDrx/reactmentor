import type { Prisma, QuestionFormat } from "@prisma/client";
import {
  getSessionRubricCriteria,
  isSessionRubricCriterion,
  type SessionRubricCriterion,
} from "./session-rubric";

export const attemptReviewVerdicts = ["solid", "partial", "missing"] as const;

export type AttemptReviewVerdict = (typeof attemptReviewVerdicts)[number];

export const PASSING_ATTEMPT_REVIEW_SCORE_PERCENT = 70;

export type AttemptReviewData = {
  kind: "rubric_review";
  criteria: Array<{
    criterion: SessionRubricCriterion;
    verdict: AttemptReviewVerdict;
  }>;
  summary: string | null;
  scorePercent: number;
};

function isObjectLike(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isAttemptReviewVerdict(value: string): value is AttemptReviewVerdict {
  return attemptReviewVerdicts.includes(value as AttemptReviewVerdict);
}

function normalizeSummary(summary: string | null | undefined) {
  const normalizedSummary = summary?.trim() ?? "";
  return normalizedSummary.length > 0 ? normalizedSummary : null;
}

function getReviewVerdictScore(verdict: AttemptReviewVerdict) {
  if (verdict === "solid") {
    return 100;
  }

  if (verdict === "partial") {
    return 50;
  }

  return 0;
}

export function buildAttemptReview(params: {
  format: QuestionFormat;
  criteriaVerdicts: Array<{
    criterion: string;
    verdict: string;
  }>;
  summary?: string | null;
  presetVerdict?: string | null;
}): AttemptReviewData | null {
  const expectedCriteria = getSessionRubricCriteria(params.format);
  const presetVerdict =
    params.presetVerdict && isAttemptReviewVerdict(params.presetVerdict)
      ? params.presetVerdict
      : null;

  const normalizedCriteria = expectedCriteria.map((criterion) => {
    const verdict = presetVerdict
      ? presetVerdict
      : params.criteriaVerdicts.find((entry) => entry.criterion === criterion)?.verdict ??
        "";

    if (!isAttemptReviewVerdict(verdict)) {
      return null;
    }

    return {
      criterion,
      verdict,
    };
  });

  if (normalizedCriteria.some((criterion) => criterion === null)) {
    return null;
  }

  const criteria = normalizedCriteria as AttemptReviewData["criteria"];
  const totalScore = criteria.reduce(
    (sum, criterion) => sum + getReviewVerdictScore(criterion.verdict),
    0,
  );

  return {
    kind: "rubric_review",
    criteria,
    summary: normalizeSummary(params.summary),
    scorePercent:
      criteria.length > 0 ? Math.round(totalScore / criteria.length) : 0,
  };
}

export function parseAttemptReviewData(
  value: Prisma.JsonValue | null | undefined,
): AttemptReviewData | null {
  if (!isObjectLike(value) || value.kind !== "rubric_review") {
    return null;
  }

  const criteriaValue = Array.isArray(value.criteria) ? value.criteria : null;

  if (!criteriaValue || criteriaValue.length === 0) {
    return null;
  }

  const criteria = criteriaValue.flatMap((criterionValue) => {
    if (!isObjectLike(criterionValue)) {
      return [];
    }

    const criterion =
      typeof criterionValue.criterion === "string"
        ? criterionValue.criterion
        : null;
    const verdict =
      typeof criterionValue.verdict === "string" ? criterionValue.verdict : null;

    if (
      !criterion ||
      !isSessionRubricCriterion(criterion) ||
      !verdict ||
      !isAttemptReviewVerdict(verdict)
    ) {
      return [];
    }

    return [
      {
        criterion,
        verdict,
      },
    ];
  });

  if (criteria.length !== criteriaValue.length) {
    return null;
  }

  const scorePercent =
    typeof value.scorePercent === "number" && Number.isFinite(value.scorePercent)
      ? Math.round(value.scorePercent)
      : Math.round(
          criteria.reduce(
            (sum, criterion) => sum + getReviewVerdictScore(criterion.verdict),
            0,
          ) / criteria.length,
        );

  return {
    kind: "rubric_review",
    criteria,
    summary: typeof value.summary === "string" ? normalizeSummary(value.summary) : null,
    scorePercent: Math.max(0, Math.min(100, scorePercent)),
  };
}

export function toAttemptReviewData(
  review: AttemptReviewData,
): Prisma.InputJsonValue {
  return {
    kind: review.kind,
    criteria: review.criteria,
    summary: review.summary,
    scorePercent: review.scorePercent,
  } satisfies Prisma.InputJsonValue;
}

export function isPassingAttemptReview(review: AttemptReviewData) {
  return review.scorePercent >= PASSING_ATTEMPT_REVIEW_SCORE_PERCENT;
}

export function getAttemptScorePercent(params: {
  isCorrect: boolean | null;
  reviewData?: Prisma.JsonValue | null;
}) {
  const review = parseAttemptReviewData(params.reviewData);

  if (review) {
    return review.scorePercent;
  }

  if (params.isCorrect === true) {
    return 100;
  }

  if (params.isCorrect === false) {
    return 0;
  }

  return null;
}
