import { QuestionFormat, SessionMode } from "@prisma/client";
import type { Prisma } from "@prisma/client";
import type { TrainingSessionConfig } from "./session-contract";
import {
  getAttemptReviewCriterionWeight,
  getAttemptReviewVerdictScore,
  getAttemptScorePercent,
  parseAttemptReviewData,
} from "./attempt-review";
import type { SessionRubricCriterion } from "./session-rubric";

type ScoredAttempt = {
  isCorrect: boolean | null;
  reviewData: Prisma.JsonValue | null;
  question?: {
    format: QuestionFormat;
    difficulty: number;
  } | null;
};

function getFormatWeight(format: QuestionFormat) {
  if (format === QuestionFormat.BUG_HUNT) {
    return 1.35;
  }

  if (format === QuestionFormat.CODE_OUTPUT) {
    return 1.25;
  }

  if (format === QuestionFormat.OPEN_ENDED) {
    return 1.2;
  }

  if (format === QuestionFormat.MULTIPLE_CHOICE) {
    return 1.05;
  }

  return 1;
}

function getTemplateWeight(
  templateKey: TrainingSessionConfig["templateKey"],
  format: QuestionFormat,
) {
  if (templateKey === "frontend_senior_defense") {
    if (format === QuestionFormat.BUG_HUNT) {
      return 1.25;
    }

    if (
      format === QuestionFormat.OPEN_ENDED ||
      format === QuestionFormat.CODE_OUTPUT
    ) {
      return 1.18;
    }

    return 0.9;
  }

  if (templateKey === "react_native_sprint") {
    if (
      format === QuestionFormat.BUG_HUNT ||
      format === QuestionFormat.CODE_OUTPUT ||
      format === QuestionFormat.OPEN_ENDED
    ) {
      return 1.12;
    }

    return 1;
  }

  if (templateKey === "react_mid_30") {
    if (format === QuestionFormat.OPEN_ENDED) {
      return 1.08;
    }

    if (format === QuestionFormat.CODE_OUTPUT) {
      return 1.05;
    }
  }

  return 1;
}

function getTemplateCriterionWeight(
  templateKey: TrainingSessionConfig["templateKey"],
  criterion: SessionRubricCriterion,
) {
  if (templateKey === "frontend_senior_defense") {
    if (criterion === "tradeoffs") {
      return 1.35;
    }

    if (
      criterion === "rootCause" ||
      criterion === "evidence" ||
      criterion === "repair"
    ) {
      return 1.2;
    }

    if (criterion === "clarity") {
      return 1.1;
    }
  }

  if (templateKey === "react_native_sprint") {
    if (criterion === "mechanism" || criterion === "clarity") {
      return 1.15;
    }

    if (criterion === "repair") {
      return 1.1;
    }
  }

  if (templateKey === "react_mid_30") {
    if (criterion === "accuracy") {
      return 1.1;
    }

    if (criterion === "mechanism" || criterion === "clarity") {
      return 1.05;
    }
  }

  return 1;
}

function getMockAttemptScorePercent(params: {
  reviewData: Prisma.JsonValue | null;
  isCorrect: boolean | null;
  question?: {
    format: QuestionFormat;
  } | null;
  config?: TrainingSessionConfig | null;
}) {
  const review = parseAttemptReviewData(params.reviewData);
  const question = params.question;

  if (review && question) {
    const totalWeight = review.criteria.reduce(
      (sum, criterion) =>
        sum +
        getAttemptReviewCriterionWeight(question.format, criterion.criterion) *
          getTemplateCriterionWeight(
            params.config?.templateKey,
            criterion.criterion,
          ),
      0,
    );

    if (totalWeight > 0) {
      return Math.round(
        review.criteria.reduce(
          (sum, criterion) =>
            sum +
            getAttemptReviewVerdictScore(criterion.verdict) *
              getAttemptReviewCriterionWeight(
                question.format,
                criterion.criterion,
              ) *
              getTemplateCriterionWeight(
                params.config?.templateKey,
                criterion.criterion,
              ),
          0,
        ) / totalWeight,
      );
    }
  }

  return getAttemptScorePercent({
    isCorrect: params.isCorrect,
    reviewData: params.reviewData,
  });
}

function getMockAttemptWeight(
  attempt: NonNullable<ScoredAttempt["question"]>,
  config: TrainingSessionConfig | null,
) {
  return (
    Math.max(1, Math.min(5, attempt.difficulty)) *
    getFormatWeight(attempt.format) *
    getTemplateWeight(config?.templateKey, attempt.format)
  );
}

export function calculateTrainingSessionScore(params: {
  attempts: ScoredAttempt[];
  mode: SessionMode;
  config?: TrainingSessionConfig | null;
}) {
  const scoredAttempts = params.attempts.flatMap((attempt) => {
    const scorePercent =
      params.mode === SessionMode.MOCK_INTERVIEW
        ? getMockAttemptScorePercent({
            isCorrect: attempt.isCorrect,
            reviewData: attempt.reviewData,
            question: attempt.question,
            config: params.config ?? null,
          })
        : getAttemptScorePercent({
            isCorrect: attempt.isCorrect,
            reviewData: attempt.reviewData,
          });

    if (scorePercent === null) {
      return [];
    }

    const weight =
      params.mode === SessionMode.MOCK_INTERVIEW && attempt.question
        ? getMockAttemptWeight(attempt.question, params.config ?? null)
        : 1;

    return [{ scorePercent, weight }];
  });

  if (scoredAttempts.length === 0) {
    return null;
  }

  const totalWeight = scoredAttempts.reduce(
    (sum, attempt) => sum + attempt.weight,
    0,
  );

  if (totalWeight <= 0) {
    return null;
  }

  return Math.round(
    scoredAttempts.reduce(
      (sum, attempt) => sum + attempt.scorePercent * attempt.weight,
      0,
    ) / totalWeight,
  );
}
