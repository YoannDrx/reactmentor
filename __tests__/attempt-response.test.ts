import { QuestionFormat } from "@prisma/client";
import { describe, expect, it } from "vitest";
import {
  buildAttemptResponse,
  createInitialAttemptResponseDraft,
  createOptionSelectionAttemptResponse,
  evaluateAttemptResponse,
  evaluateOptionSelectionAttempt,
  getSelectedLineNumbersFromAttemptResponse,
  getSelectedOptionIdsFromAttemptResponse,
  isClosedQuestionFormat,
  parseAttemptResponseData,
  supportsLiveQuestionFormat,
  supportsAutomaticAttemptScoring,
  toggleBugHuntAttemptResponseLineNumber,
  toggleClosedChoiceAttemptResponseOption,
} from "@/features/sessions/attempt-response";

describe("attempt-response helpers", () => {
  it("normalizes option-selection responses for deterministic storage", () => {
    const response = createOptionSelectionAttemptResponse([
      "option_3",
      "option_1",
      "option_3",
    ]);

    expect(response).toEqual({
      kind: "option_selection",
      selectedOptionIds: ["option_1", "option_3"],
    });
  });

  it("evaluates closed responses using exact option-set equality", () => {
    expect(
      evaluateOptionSelectionAttempt({
        selectedOptionIds: ["option_2", "option_1"],
        correctOptionIds: ["option_1", "option_2"],
      }),
    ).toEqual({ isCorrect: true });

    expect(
      evaluateOptionSelectionAttempt({
        selectedOptionIds: ["option_1"],
        correctOptionIds: ["option_1", "option_2"],
      }),
    ).toEqual({ isCorrect: false });
  });

  it("identifies the currently supported closed question formats", () => {
    expect(isClosedQuestionFormat(QuestionFormat.SINGLE_CHOICE)).toBe(true);
    expect(isClosedQuestionFormat(QuestionFormat.MULTIPLE_CHOICE)).toBe(true);
    expect(isClosedQuestionFormat(QuestionFormat.CODE_OUTPUT)).toBe(false);
    expect(isClosedQuestionFormat(QuestionFormat.BUG_HUNT)).toBe(false);
    expect(isClosedQuestionFormat(QuestionFormat.OPEN_ENDED)).toBe(false);
    expect(supportsLiveQuestionFormat(QuestionFormat.OPEN_ENDED)).toBe(true);
    expect(supportsLiveQuestionFormat(QuestionFormat.CODE_OUTPUT)).toBe(true);
    expect(supportsLiveQuestionFormat(QuestionFormat.BUG_HUNT)).toBe(true);
  });

  it("builds generic response payloads for both closed and open formats", () => {
    expect(
      buildAttemptResponse({
        questionFormat: QuestionFormat.MULTIPLE_CHOICE,
        selectedOptionIds: ["option_2", "option_1", "option_2"],
      }),
    ).toEqual({
      kind: "option_selection",
      selectedOptionIds: ["option_1", "option_2"],
    });

    expect(
      buildAttemptResponse({
        questionFormat: QuestionFormat.OPEN_ENDED,
        responseText: "  Explain the tradeoff clearly.  ",
      }),
    ).toEqual({
      kind: "text_response",
      text: "Explain the tradeoff clearly.",
    });
  });

  it("evaluates generic responses only for auto-scorable formats", () => {
    const closedResponse = buildAttemptResponse({
      questionFormat: QuestionFormat.SINGLE_CHOICE,
      selectedOptionIds: ["option_2"],
    });

    expect(closedResponse).not.toBeNull();
    expect(
      evaluateAttemptResponse({
        questionFormat: QuestionFormat.SINGLE_CHOICE,
        options: [
          { id: "option_1", isCorrect: false },
          { id: "option_2", isCorrect: true },
        ],
        response: closedResponse!,
      }),
    ).toEqual({
      selectedOptionIds: ["option_2"],
      isCorrect: true,
    });

    const openResponse = buildAttemptResponse({
      questionFormat: QuestionFormat.CODE_OUTPUT,
      responseCode: "console.log(value)",
      responseLanguage: "ts",
    });

    expect(openResponse).not.toBeNull();
    expect(supportsAutomaticAttemptScoring(QuestionFormat.CODE_OUTPUT)).toBe(false);
    expect(
      evaluateAttemptResponse({
        questionFormat: QuestionFormat.CODE_OUTPUT,
        options: [],
        response: openResponse!,
      }),
    ).toBeNull();
  });

  it("keeps response draft behavior ready for renderer-based players", () => {
    const initialDraft = createInitialAttemptResponseDraft(
      QuestionFormat.MULTIPLE_CHOICE,
    );
    const nextDraft = toggleClosedChoiceAttemptResponseOption({
      response: initialDraft,
      questionFormat: QuestionFormat.MULTIPLE_CHOICE,
      optionId: "option_3",
    });

    expect(getSelectedOptionIdsFromAttemptResponse(nextDraft)).toEqual([
      "option_3",
    ]);
  });

  it("supports bug-hunt line selection and response parsing", () => {
    const initialDraft = createInitialAttemptResponseDraft(QuestionFormat.BUG_HUNT);
    const nextDraft = toggleBugHuntAttemptResponseLineNumber({
      response: initialDraft,
      lineNumber: 4,
    });

    expect(getSelectedLineNumbersFromAttemptResponse(nextDraft)).toEqual([4]);
    expect(
      parseAttemptResponseData({
        kind: "bug_hunt_response",
        summary: "Cleanup is returned from the inner async function.",
        selectedLineNumbers: [5, 4, 5],
      }),
    ).toEqual({
      kind: "bug_hunt_response",
      summary: "Cleanup is returned from the inner async function.",
      selectedLineNumbers: [4, 5],
    });
  });
});
