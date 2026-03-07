import { describe, expect, it } from "vitest";
import { buildSessionRubric } from "@/features/sessions/session-rubric";

describe("buildSessionRubric", () => {
  it("maps code questions to implementation-oriented criteria", () => {
    expect(
      buildSessionRubric({
        format: "CODE_OUTPUT",
        verbalizePoints: ["Explain why the callback stays stable."],
        takeaways: ["Show the dependency list explicitly."],
      }),
    ).toEqual({
      criteria: ["accuracy", "clarity", "mechanism"],
      focusPoints: [
        "Explain why the callback stays stable.",
        "Show the dependency list explicitly.",
      ],
    });
  });

  it("maps bug hunts to diagnosis-oriented criteria and deduplicates focus points", () => {
    expect(
      buildSessionRubric({
        format: "BUG_HUNT",
        verbalizePoints: ["Return the cleanup from useEffect itself."],
        takeaways: [
          "Return the cleanup from useEffect itself.",
          "Point to the lines that leak the timer.",
        ],
      }),
    ).toEqual({
      criteria: ["rootCause", "evidence", "repair"],
      focusPoints: [
        "Return the cleanup from useEffect itself.",
        "Point to the lines that leak the timer.",
      ],
    });
  });
});
