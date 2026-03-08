import { ContentStatus, PlaylistKind, SessionMode } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  playlistFindManyMock,
  playlistFindFirstMock,
  localizeQuestionSummaryMock,
  localizeSkillMock,
  localizeModuleMock,
} = vi.hoisted(() => ({
  playlistFindManyMock: vi.fn(),
  playlistFindFirstMock: vi.fn(),
  localizeQuestionSummaryMock: vi.fn((question) => ({
    id: question.id,
    slug: question.slug,
    prompt: question.prompt,
    format: question.format,
    difficulty: question.difficulty,
    estimatedTimeSec: question.estimatedTimeSec ?? null,
  })),
  localizeSkillMock: vi.fn((skill) => ({
    title: skill.title,
    slug: skill.slug,
  })),
  localizeModuleMock: vi.fn((module) => ({
    title: module.title,
    slug: module.slug,
  })),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    playlist: {
      findMany: playlistFindManyMock,
      findFirst: playlistFindFirstMock,
    },
  },
}));

vi.mock("@/lib/content-repository", () => ({
  localizeQuestionSummary: localizeQuestionSummaryMock,
  localizeSkill: localizeSkillMock,
  localizeModule: localizeModuleMock,
}));

import {
  getSavedPlaylistDetail,
  getSavedPlaylistsReadModel,
} from "@/features/playlists/saved-playlist-read-model";

function createQuestionFixture(params: {
  id: string;
  slug: string;
  prompt: string;
  skillTitle: string;
  skillSlug: string;
  moduleTitle: string;
  moduleSlug: string;
  status?: ContentStatus;
  difficulty?: number;
  estimatedTimeSec?: number | null;
}) {
  return {
    id: params.id,
    slug: params.slug,
    prompt: params.prompt,
    format: "OPEN_ENDED",
    difficulty: params.difficulty ?? 3,
    estimatedTimeSec: params.estimatedTimeSec ?? 300,
    status: params.status ?? ContentStatus.PUBLISHED,
    primarySkill: {
      id: `${params.id}_skill`,
      slug: params.skillSlug,
      title: params.skillTitle,
      status: ContentStatus.PUBLISHED,
      translations: [],
    },
    module: {
      id: `${params.id}_module`,
      slug: params.moduleSlug,
      title: params.moduleTitle,
      status: ContentStatus.PUBLISHED,
      translations: [],
    },
    translations: [],
  };
}

describe("saved playlist read models", () => {
  beforeEach(() => {
    playlistFindManyMock.mockReset();
    playlistFindFirstMock.mockReset();
    localizeQuestionSummaryMock.mockClear();
    localizeSkillMock.mockClear();
    localizeModuleMock.mockClear();
  });

  it("maps saved playlists into launch-ready summaries", async () => {
    playlistFindManyMock.mockResolvedValue([
      {
        id: "playlist_1",
        name: "Mock fallout recovery",
        description: "Saved for next week",
        kind: PlaylistKind.GENERATED,
        mode: SessionMode.PRACTICE,
        sourceKey: "mockRecovery",
        updatedAt: new Date("2026-03-07T10:00:00.000Z"),
        items: [
          {
            order: 1,
            question: createQuestionFixture({
              id: "question_1",
              slug: "question-1",
              prompt: "Explain why stale closures break this effect.",
              skillTitle: "Effects",
              skillSlug: "effects",
              moduleTitle: "React Rendering Systems",
              moduleSlug: "react-rendering-systems",
            }),
          },
          {
            order: 2,
            question: createQuestionFixture({
              id: "question_2",
              slug: "question-2",
              prompt: "Diagnose the memoization bug.",
              skillTitle: "Identity",
              skillSlug: "identity",
              moduleTitle: "React Rendering Systems",
              moduleSlug: "react-rendering-systems",
              difficulty: 4,
            }),
          },
        ],
      },
      {
        id: "playlist_2",
        name: "Manual empty",
        description: null,
        kind: PlaylistKind.MANUAL,
        mode: SessionMode.PRACTICE,
        sourceKey: null,
        updatedAt: new Date("2026-03-07T11:00:00.000Z"),
        items: [
          {
            order: 1,
            question: createQuestionFixture({
              id: "question_archived",
              slug: "question-archived",
              prompt: "Archived prompt",
              skillTitle: "Effects",
              skillSlug: "effects",
              moduleTitle: "React Rendering Systems",
              moduleSlug: "react-rendering-systems",
              status: ContentStatus.ARCHIVED,
            }),
          },
        ],
      },
    ]);

    const readModel = await getSavedPlaylistsReadModel({
      userId: "user_1",
      locale: "en",
    });

    expect(readModel).toEqual({
      count: 2,
      items: [
        {
          id: "playlist_1",
          name: "Mock fallout recovery",
          description: "Saved for next week",
          kind: PlaylistKind.GENERATED,
          mode: SessionMode.PRACTICE,
          sourceKey: "mockRecovery",
          questionIds: ["question_1", "question_2"],
          questionCount: 2,
          focusSkills: ["Effects", "Identity"],
          moduleSlug: "react-rendering-systems",
          updatedAt: new Date("2026-03-07T10:00:00.000Z"),
        },
        {
          id: "playlist_2",
          name: "Manual empty",
          description: null,
          kind: PlaylistKind.MANUAL,
          mode: SessionMode.PRACTICE,
          sourceKey: null,
          questionIds: [],
          questionCount: 0,
          focusSkills: [],
          moduleSlug: null,
          updatedAt: new Date("2026-03-07T11:00:00.000Z"),
        },
      ],
    });
  });

  it("returns a localized detail view with ordered questions", async () => {
    playlistFindFirstMock.mockResolvedValue({
      id: "playlist_1",
      name: "Mock fallout recovery",
      description: "Saved for next week",
      kind: PlaylistKind.MANUAL,
      mode: SessionMode.PRACTICE,
      sourceKey: "mockRecovery",
      updatedAt: new Date("2026-03-07T10:00:00.000Z"),
      items: [
        {
          order: 1,
          question: createQuestionFixture({
            id: "question_1",
            slug: "question-1",
            prompt: "Explain why stale closures break this effect.",
            skillTitle: "Effects",
            skillSlug: "effects",
            moduleTitle: "React Rendering Systems",
            moduleSlug: "react-rendering-systems",
          }),
        },
        {
          order: 2,
          question: createQuestionFixture({
            id: "question_2",
            slug: "question-2",
            prompt: "Diagnose the memoization bug.",
            skillTitle: "Identity",
            skillSlug: "identity",
            moduleTitle: "React Rendering Systems",
            moduleSlug: "react-rendering-systems",
            difficulty: 4,
            estimatedTimeSec: 420,
          }),
        },
      ],
    });

    const detail = await getSavedPlaylistDetail({
      playlistId: "playlist_1",
      userId: "user_1",
      locale: "fr",
    });

    expect(detail).toEqual({
      id: "playlist_1",
      name: "Mock fallout recovery",
      description: "Saved for next week",
      kind: PlaylistKind.MANUAL,
      mode: SessionMode.PRACTICE,
      sourceKey: "mockRecovery",
      questionIds: ["question_1", "question_2"],
      questionCount: 2,
      focusSkills: ["Effects", "Identity"],
      moduleSlug: "react-rendering-systems",
      updatedAt: new Date("2026-03-07T10:00:00.000Z"),
      questions: [
        {
          id: "question_1",
          slug: "question-1",
          prompt: "Explain why stale closures break this effect.",
          format: "OPEN_ENDED",
          difficulty: 3,
          estimatedTimeSec: 300,
          skill: "Effects",
          module: "React Rendering Systems",
          moduleSlug: "react-rendering-systems",
        },
        {
          id: "question_2",
          slug: "question-2",
          prompt: "Diagnose the memoization bug.",
          format: "OPEN_ENDED",
          difficulty: 4,
          estimatedTimeSec: 420,
          skill: "Identity",
          module: "React Rendering Systems",
          moduleSlug: "react-rendering-systems",
        },
      ],
      stats: {
        manualQuestionCount: 2,
        moduleCount: 1,
      },
    });
  });
});
