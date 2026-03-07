import { type Prisma, QuestionFormat } from "@prisma/client";

export type OptionSelectionAttemptResponse = {
  kind: "option_selection";
  selectedOptionIds: string[];
};

export type TextAttemptResponse = {
  kind: "text_response";
  text: string;
};

export type CodeAttemptResponse = {
  kind: "code_response";
  code: string;
  language: string | null;
};

export type BugHuntAttemptResponse = {
  kind: "bug_hunt_response";
  summary: string;
  selectedLineNumbers: number[];
};

export type AttemptResponseData =
  | OptionSelectionAttemptResponse
  | TextAttemptResponse
  | CodeAttemptResponse
  | BugHuntAttemptResponse;

export type AttemptResponseDraft = AttemptResponseData;

export function isClosedQuestionFormat(format: QuestionFormat) {
  return (
    format === QuestionFormat.SINGLE_CHOICE ||
    format === QuestionFormat.MULTIPLE_CHOICE
  );
}

export function isTextResponseQuestionFormat(format: QuestionFormat) {
  return (
    format === QuestionFormat.OPEN_ENDED ||
    format === QuestionFormat.CODE_OUTPUT ||
    format === QuestionFormat.BUG_HUNT
  );
}

export function supportsLiveQuestionFormat(format: QuestionFormat) {
  return (
    isClosedQuestionFormat(format) ||
    format === QuestionFormat.OPEN_ENDED ||
    format === QuestionFormat.CODE_OUTPUT ||
    format === QuestionFormat.BUG_HUNT
  );
}

export function createOptionSelectionAttemptResponse(
  selectedOptionIds: string[],
): OptionSelectionAttemptResponse {
  return {
    kind: "option_selection",
    selectedOptionIds: Array.from(new Set(selectedOptionIds)).sort(),
  };
}

export function createTextAttemptResponse(text: string): TextAttemptResponse {
  return {
    kind: "text_response",
    text: text.trim(),
  };
}

export function createCodeAttemptResponse(params: {
  code: string;
  language?: string | null;
}): CodeAttemptResponse {
  return {
    kind: "code_response",
    code: params.code.trim(),
    language: params.language?.trim() || null,
  };
}

export function createBugHuntAttemptResponse(params: {
  summary: string;
  selectedLineNumbers?: number[];
}): BugHuntAttemptResponse {
  const selectedLineNumbers = Array.from(
    new Set((params.selectedLineNumbers ?? []).filter((line) => Number.isInteger(line))),
  ).sort((left, right) => left - right);

  return {
    kind: "bug_hunt_response",
    summary: params.summary.trim(),
    selectedLineNumbers,
  };
}

export function createInitialAttemptResponseDraft(
  format: QuestionFormat,
): AttemptResponseDraft {
  if (isClosedQuestionFormat(format)) {
    return createOptionSelectionAttemptResponse([]);
  }

  if (format === QuestionFormat.CODE_OUTPUT) {
    return createCodeAttemptResponse({
      code: "",
      language: null,
    });
  }

  if (format === QuestionFormat.BUG_HUNT) {
    return createBugHuntAttemptResponse({
      summary: "",
      selectedLineNumbers: [],
    });
  }

  return createTextAttemptResponse("");
}

export function isAttemptResponseDraftSubmittable(
  response: AttemptResponseDraft,
) {
  if (response.kind === "option_selection") {
    return response.selectedOptionIds.length > 0;
  }

  if (response.kind === "code_response") {
    return response.code.trim().length > 0;
  }

  if (response.kind === "bug_hunt_response") {
    return response.summary.trim().length > 0;
  }

  return response.text.trim().length > 0;
}

export function getSelectedOptionIdsFromAttemptResponse(
  response: AttemptResponseDraft | null | undefined,
) {
  return response?.kind === "option_selection" ? response.selectedOptionIds : [];
}

export function getSelectedLineNumbersFromAttemptResponse(
  response: AttemptResponseDraft | null | undefined,
) {
  return response?.kind === "bug_hunt_response" ? response.selectedLineNumbers : [];
}

export function toggleClosedChoiceAttemptResponseOption(params: {
  response: AttemptResponseDraft;
  questionFormat: QuestionFormat;
  optionId: string;
}) {
  if (params.response.kind !== "option_selection") {
    return params.response;
  }

  const currentIds = params.response.selectedOptionIds;

  if (params.questionFormat === QuestionFormat.MULTIPLE_CHOICE) {
    return createOptionSelectionAttemptResponse(
      currentIds.includes(params.optionId)
        ? currentIds.filter((currentId) => currentId !== params.optionId)
        : [...currentIds, params.optionId],
    );
  }

  return createOptionSelectionAttemptResponse(
    currentIds[0] === params.optionId ? [] : [params.optionId],
  );
}

export function toggleBugHuntAttemptResponseLineNumber(params: {
  response: AttemptResponseDraft;
  lineNumber: number;
}) {
  if (
    params.response.kind !== "bug_hunt_response" ||
    !Number.isInteger(params.lineNumber) ||
    params.lineNumber <= 0
  ) {
    return params.response;
  }

  const currentLineNumbers = params.response.selectedLineNumbers;

  return createBugHuntAttemptResponse({
    summary: params.response.summary,
    selectedLineNumbers: currentLineNumbers.includes(params.lineNumber)
      ? currentLineNumbers.filter((lineNumber) => lineNumber !== params.lineNumber)
      : [...currentLineNumbers, params.lineNumber],
  });
}

export function buildAttemptResponse(params: {
  questionFormat: QuestionFormat;
  selectedOptionIds?: string[];
  responseText?: string | null;
  responseCode?: string | null;
  responseLanguage?: string | null;
  responseSummary?: string | null;
  selectedLineNumbers?: number[];
}) {
  if (isClosedQuestionFormat(params.questionFormat)) {
    const response = createOptionSelectionAttemptResponse(params.selectedOptionIds ?? []);

    return response.selectedOptionIds.length > 0 ? response : null;
  }

  if (params.questionFormat === QuestionFormat.CODE_OUTPUT) {
    const response = createCodeAttemptResponse({
      code: params.responseCode ?? "",
      language: params.responseLanguage,
    });

    return response.code.length > 0 ? response : null;
  }

  if (params.questionFormat === QuestionFormat.BUG_HUNT) {
    const response = createBugHuntAttemptResponse({
      summary: params.responseSummary ?? "",
      selectedLineNumbers: params.selectedLineNumbers,
    });

    return response.summary.length > 0 ? response : null;
  }

  if (isTextResponseQuestionFormat(params.questionFormat)) {
    const response = createTextAttemptResponse(params.responseText ?? "");

    return response.text.length > 0 ? response : null;
  }

  return null;
}

export function evaluateOptionSelectionAttempt(params: {
  selectedOptionIds: string[];
  correctOptionIds: string[];
}) {
  const normalizedCorrectOptionIds = [...params.correctOptionIds].sort();
  const normalizedSelectedOptionIds = [...params.selectedOptionIds].sort();

  return {
    isCorrect:
      normalizedCorrectOptionIds.length === normalizedSelectedOptionIds.length &&
      normalizedCorrectOptionIds.every(
        (optionId, index) => optionId === normalizedSelectedOptionIds[index],
      ),
  };
}

export function supportsAutomaticAttemptScoring(format: QuestionFormat) {
  return isClosedQuestionFormat(format);
}

export function requiresManualAttemptReview(format: QuestionFormat) {
  return supportsLiveQuestionFormat(format) && !supportsAutomaticAttemptScoring(format);
}

export function evaluateAttemptResponse(params: {
  questionFormat: QuestionFormat;
  options: Array<{
    id: string;
    isCorrect: boolean;
  }>;
  response: AttemptResponseData;
}) {
  if (
    !isClosedQuestionFormat(params.questionFormat) ||
    params.response.kind !== "option_selection"
  ) {
    return null;
  }

  const correctOptionIds = params.options
    .filter((option) => option.isCorrect)
    .map((option) => option.id);
  const evaluation = evaluateOptionSelectionAttempt({
    selectedOptionIds: params.response.selectedOptionIds,
    correctOptionIds,
  });

  return {
    selectedOptionIds: params.response.selectedOptionIds,
    isCorrect: evaluation.isCorrect,
  };
}

export function toAttemptResponseData(
  response: AttemptResponseData,
): Prisma.InputJsonValue {
  return response as Prisma.InputJsonValue;
}

export function parseAttemptResponseData(value: unknown): AttemptResponseData | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const response = value as Record<string, unknown>;

  if (response.kind === "option_selection") {
    return createOptionSelectionAttemptResponse(
      Array.isArray(response.selectedOptionIds)
        ? response.selectedOptionIds
            .filter((optionId): optionId is string => typeof optionId === "string")
        : [],
    );
  }

  if (response.kind === "text_response") {
    return createTextAttemptResponse(
      typeof response.text === "string" ? response.text : "",
    );
  }

  if (response.kind === "code_response") {
    return createCodeAttemptResponse({
      code: typeof response.code === "string" ? response.code : "",
      language:
        typeof response.language === "string" ? response.language : null,
    });
  }

  if (response.kind === "bug_hunt_response") {
    return createBugHuntAttemptResponse({
      summary: typeof response.summary === "string" ? response.summary : "",
      selectedLineNumbers: Array.isArray(response.selectedLineNumbers)
        ? response.selectedLineNumbers
            .map((lineNumber) =>
              typeof lineNumber === "number" ? lineNumber : Number(lineNumber),
            )
        : [],
    });
  }

  return null;
}
