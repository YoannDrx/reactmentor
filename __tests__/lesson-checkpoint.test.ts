import { describe, expect, it } from "vitest";
import {
  buildLessonCheckpointDefinition,
  evaluateLessonCheckpoint,
} from "@/features/learn/lesson-checkpoint";

describe("lesson checkpoint helpers", () => {
  it("builds an interactive checkpoint only for supported choice formats", () => {
    expect(
      buildLessonCheckpointDefinition({
        format: "OPEN_ENDED",
        options: [],
      }),
    ).toBeNull();

    expect(
      buildLessonCheckpointDefinition({
        format: "SINGLE_CHOICE",
        options: [
          {
            id: "option_1",
            label: "Explain the mechanism",
            explanation: "This is the right framing.",
            isCorrect: true,
          },
        ],
      }),
    ).toEqual({
      format: "SINGLE_CHOICE",
      options: [
        {
          id: "option_1",
          label: "Explain the mechanism",
          explanation: "This is the right framing.",
          isCorrect: true,
        },
      ],
    });
  });

  it("passes a single-choice checkpoint only when the selected option matches the correct one", () => {
    const checkpoint = buildLessonCheckpointDefinition({
      format: "SINGLE_CHOICE",
      options: [
        {
          id: "option_wrong",
          label: "Name the API first",
          explanation: null,
          isCorrect: false,
        },
        {
          id: "option_right",
          label: "Explain the mental model first",
          explanation: "This is the correct answer.",
          isCorrect: true,
        },
      ],
    });

    if (!checkpoint) {
      throw new Error("checkpoint should exist");
    }

    expect(
      evaluateLessonCheckpoint(checkpoint, ["option_right"]),
    ).toMatchObject({
      passed: true,
      selectedOptionIds: ["option_right"],
      correctOptionIds: ["option_right"],
    });

    expect(
      evaluateLessonCheckpoint(checkpoint, ["option_wrong"]),
    ).toMatchObject({
      passed: false,
      selectedOptionIds: ["option_wrong"],
      correctOptionIds: ["option_right"],
    });
  });

  it("requires the exact full set for multiple-choice checkpoints", () => {
    const checkpoint = buildLessonCheckpointDefinition({
      format: "MULTIPLE_CHOICE",
      options: [
        {
          id: "option_1",
          label: "Dependency values should be stable",
          explanation: null,
          isCorrect: true,
        },
        {
          id: "option_2",
          label: "Effects should model synchronization",
          explanation: null,
          isCorrect: true,
        },
        {
          id: "option_3",
          label: "Keys always force rerenders",
          explanation: null,
          isCorrect: false,
        },
      ],
    });

    if (!checkpoint) {
      throw new Error("checkpoint should exist");
    }

    expect(
      evaluateLessonCheckpoint(checkpoint, [
        "option_1",
        "option_2",
        "option_1",
      ]),
    ).toMatchObject({
      passed: true,
      selectedOptionIds: ["option_1", "option_2"],
      correctOptionIds: ["option_1", "option_2"],
    });

    expect(
      evaluateLessonCheckpoint(checkpoint, ["option_1"]),
    ).toMatchObject({
      passed: false,
      correctOptionIds: ["option_1", "option_2"],
    });
  });
});
