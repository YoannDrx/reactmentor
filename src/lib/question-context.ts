type BugHuntQuestionContextData = {
  kind: "bug_hunt";
  code: string;
  language: string | null;
  snippetTitle: string | null;
  suggestedLineNumbers: number[];
};

export type QuestionContextData = BugHuntQuestionContextData;

function normalizeLineNumbers(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return Array.from(
    new Set(
      value
        .map((item) => (typeof item === "number" ? item : Number(item)))
        .filter((lineNumber) => Number.isInteger(lineNumber) && lineNumber > 0),
    ),
  ).sort((left, right) => left - right);
}

export function parseQuestionContextData(
  value: unknown,
): QuestionContextData | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const context = value as Record<string, unknown>;

  if (context.kind !== "bug_hunt") {
    return null;
  }

  const code = typeof context.code === "string" ? context.code.trim() : "";

  if (code.length === 0) {
    return null;
  }

  return {
    kind: "bug_hunt",
    code,
    language:
      typeof context.language === "string" && context.language.trim().length > 0
        ? context.language.trim()
        : null,
    snippetTitle:
      typeof context.snippetTitle === "string" &&
      context.snippetTitle.trim().length > 0
        ? context.snippetTitle.trim()
        : null,
    suggestedLineNumbers: normalizeLineNumbers(context.suggestedLineNumbers),
  };
}
