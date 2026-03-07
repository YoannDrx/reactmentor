import { QuestionLevel, Track } from "@prisma/client";
import { describe, expect, it } from "vitest";
import { computeDashboardRecommendation } from "@/features/dashboard/dashboard-recommendations";

function createModuleCandidate(input: {
  slug: string;
  title: string;
  track: Track;
  level?: QuestionLevel;
  order?: number;
  progressPercent?: number;
  attemptedQuestions?: number;
  masteredQuestions?: number;
  skills?: string[];
}) {
  return {
    id: `${input.slug}_id`,
    slug: input.slug,
    title: input.title,
    track: input.track,
    level: input.level ?? QuestionLevel.MID,
    order: input.order ?? 1,
    counts: {
      questions: 12,
      skills: 4,
    },
    skills: (input.skills ?? ["Rendering", "State", "Hooks"]).map((title, index) => ({
      id: `${input.slug}_skill_${index}`,
      title,
    })),
    userProgress: {
      attemptedQuestions: input.attemptedQuestions ?? 0,
      masteredQuestions: input.masteredQuestions ?? 0,
      progressPercent: input.progressPercent ?? 0,
    },
  };
}

describe("computeDashboardRecommendation", () => {
  it("prioritizes review when cards are due", () => {
    const recommendation = computeDashboardRecommendation({
      dueCount: 6,
      preference: {
        preferredTracks: [Track.REACT, Track.TYPESCRIPT],
        targetLevel: QuestionLevel.MID,
        focusMode: "balanced",
      },
      modules: [
        createModuleCandidate({
          slug: "react-rendering-systems",
          title: "React Rendering Systems",
          track: Track.REACT,
        }),
      ],
    });

    expect(recommendation).toEqual({
      kind: "review",
      dueCount: 6,
      questionCount: 6,
    });
  });

  it("recommends an untouched module on the preferred track for a first run", () => {
    const recommendation = computeDashboardRecommendation({
      dueCount: 0,
      preference: {
        preferredTracks: [Track.REACT, Track.TYPESCRIPT],
        targetLevel: QuestionLevel.MID,
        focusMode: "balanced",
      },
      modules: [
        createModuleCandidate({
          slug: "typescript-for-components",
          title: "TypeScript for Components",
          track: Track.TYPESCRIPT,
          order: 2,
          progressPercent: 10,
          attemptedQuestions: 1,
        }),
        createModuleCandidate({
          slug: "react-rendering-systems",
          title: "React Rendering Systems",
          track: Track.REACT,
          order: 1,
        }),
      ],
    });

    expect(recommendation).toMatchObject({
      kind: "module",
      reason: "start",
      moduleSlug: "react-rendering-systems",
      track: Track.REACT,
      progressPercent: 0,
    });
  });

  it("biases toward in-progress modules when focus mode is deep dive", () => {
    const recommendation = computeDashboardRecommendation({
      dueCount: 0,
      preference: {
        preferredTracks: [Track.REACT],
        targetLevel: QuestionLevel.SENIOR,
        focusMode: "deep_dive",
      },
      modules: [
        createModuleCandidate({
          slug: "effects-without-superstition",
          title: "Effects Without Superstition",
          track: Track.REACT,
          level: QuestionLevel.SENIOR,
          order: 2,
          progressPercent: 38,
          attemptedQuestions: 4,
          masteredQuestions: 1,
          skills: ["Effects", "Cleanup", "Refs"],
        }),
        createModuleCandidate({
          slug: "react-rendering-systems",
          title: "React Rendering Systems",
          track: Track.REACT,
          level: QuestionLevel.MID,
          order: 1,
          progressPercent: 0,
          attemptedQuestions: 0,
        }),
      ],
    });

    expect(recommendation).toMatchObject({
      kind: "module",
      reason: "grow",
      moduleSlug: "effects-without-superstition",
      focusSkills: ["Effects", "Cleanup", "Refs"],
    });
  });
});
