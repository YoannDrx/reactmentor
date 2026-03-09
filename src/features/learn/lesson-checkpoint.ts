import type { QuestionFormat } from "@prisma/client";

type SupportedLessonCheckpointFormat = Extract<
  QuestionFormat,
  "SINGLE_CHOICE" | "MULTIPLE_CHOICE"
>;

export type LessonCheckpointOption = {
  id: string;
  label: string;
  explanation: string | null;
  isCorrect: boolean;
};

export type LessonCheckpointDefinition = {
  format: SupportedLessonCheckpointFormat;
  options: LessonCheckpointOption[];
};

export type LessonCheckpointResult = {
  passed: boolean;
  selectedOptionIds: string[];
  correctOptionIds: string[];
  correctOptions: LessonCheckpointOption[];
};

function uniqueOptionIds(optionIds: string[]) {
  return Array.from(new Set(optionIds.filter((optionId) => optionId.length > 0)));
}

export function buildLessonCheckpointDefinition(params: {
  format: QuestionFormat;
  options: LessonCheckpointOption[];
}): LessonCheckpointDefinition | null {
  if (
    params.format !== "SINGLE_CHOICE" &&
    params.format !== "MULTIPLE_CHOICE"
  ) {
    return null;
  }

  if (params.options.length === 0) {
    return null;
  }

  return {
    format: params.format,
    options: params.options,
  };
}

export function evaluateLessonCheckpoint(
  definition: LessonCheckpointDefinition,
  selectedOptionIds: string[],
): LessonCheckpointResult {
  const uniqueSelectedOptionIds = uniqueOptionIds(selectedOptionIds);
  const correctOptions = definition.options.filter((option) => option.isCorrect);
  const correctOptionIds = correctOptions.map((option) => option.id);
  const passed =
    uniqueSelectedOptionIds.length === correctOptionIds.length &&
    uniqueSelectedOptionIds.every((optionId) => correctOptionIds.includes(optionId));

  return {
    passed,
    selectedOptionIds: uniqueSelectedOptionIds,
    correctOptionIds,
    correctOptions,
  };
}
