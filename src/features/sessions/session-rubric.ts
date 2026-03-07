import type { QuestionFormat } from "@prisma/client";

export type SessionRubricCriterion =
  | "accuracy"
  | "mechanism"
  | "tradeoffs"
  | "clarity"
  | "rootCause"
  | "evidence"
  | "repair";

const sessionRubricCriteria = [
  "accuracy",
  "mechanism",
  "tradeoffs",
  "clarity",
  "rootCause",
  "evidence",
  "repair",
] as const;

export type SessionRubric = {
  criteria: SessionRubricCriterion[];
  focusPoints: string[];
};

export function isSessionRubricCriterion(
  value: string,
): value is SessionRubricCriterion {
  return sessionRubricCriteria.includes(value as SessionRubricCriterion);
}

function uniqueStrings(values: string[]) {
  return Array.from(
    new Set(values.map((value) => value.trim()).filter((value) => value.length > 0)),
  );
}

export function getSessionRubricCriteria(
  format: QuestionFormat,
): SessionRubricCriterion[] {
  if (format === "CODE_OUTPUT") {
    return ["accuracy", "clarity", "mechanism"];
  }

  if (format === "BUG_HUNT") {
    return ["rootCause", "evidence", "repair"];
  }

  return ["accuracy", "mechanism", "tradeoffs"];
}

export function buildSessionRubric(input: {
  format: QuestionFormat;
  verbalizePoints?: string[];
  takeaways?: string[];
}): SessionRubric {
  return {
    criteria: getSessionRubricCriteria(input.format),
    focusPoints: uniqueStrings([
      ...(input.verbalizePoints ?? []),
      ...(input.takeaways ?? []),
    ]).slice(0, 4),
  };
}
