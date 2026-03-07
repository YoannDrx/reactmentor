import { Track } from "@prisma/client";
import { describe, expect, it } from "vitest";
import {
  normalizeFocusMode,
  normalizePreferredTracks,
} from "@/features/settings/user-preferences";

describe("user-preferences helpers", () => {
  it("normalizes supported focus mode variants", () => {
    expect(normalizeFocusMode("balanced")).toBe("balanced");
    expect(normalizeFocusMode("deepDive")).toBe("deep_dive");
    expect(normalizeFocusMode("interviewCram")).toBe("interview_cram");
    expect(normalizeFocusMode("invalid-mode")).toBe("balanced");
  });

  it("deduplicates preferred tracks and falls back to defaults", () => {
    expect(
      normalizePreferredTracks([
        Track.REACT,
        Track.REACT,
        Track.TYPESCRIPT,
      ]),
    ).toEqual([Track.REACT, Track.TYPESCRIPT]);

    expect(normalizePreferredTracks([])).toEqual([
      Track.REACT,
      Track.TYPESCRIPT,
    ]);
  });
});
