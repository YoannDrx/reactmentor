import { SessionMode } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  getBookmarkReadModelMock,
  getNoteReadModelMock,
  getDashboardReadModelMock,
  getMockInterviewReadModelMock,
} = vi.hoisted(() => ({
  getBookmarkReadModelMock: vi.fn(),
  getNoteReadModelMock: vi.fn(),
  getDashboardReadModelMock: vi.fn(),
  getMockInterviewReadModelMock: vi.fn(),
}));

vi.mock("@/features/bookmarks/bookmark-read-model", () => ({
  getBookmarkReadModel: getBookmarkReadModelMock,
}));

vi.mock("@/features/notes/note-read-model", () => ({
  getNoteReadModel: getNoteReadModelMock,
}));

vi.mock("@/features/dashboard/dashboard-read-model", () => ({
  getDashboardReadModel: getDashboardReadModelMock,
  getMockInterviewReadModel: getMockInterviewReadModelMock,
}));

import { getPlaylistReadModel } from "@/features/playlists/playlist-read-model";

describe("getPlaylistReadModel", () => {
  beforeEach(() => {
    getBookmarkReadModelMock.mockReset();
    getNoteReadModelMock.mockReset();
    getDashboardReadModelMock.mockReset();
    getMockInterviewReadModelMock.mockReset();
  });

  it("builds generated playlists from learn follow-up, review recovery, mock fallout, bookmarks and notes", async () => {
    getBookmarkReadModelMock.mockResolvedValue({
      count: 2,
      items: [
        {
          questionId: "bookmark_1",
          skill: "Effects",
          moduleSlug: "react-rendering-systems",
        },
        {
          questionId: "bookmark_2",
          skill: "Identity",
          moduleSlug: "react-rendering-systems",
        },
      ],
    });
    getNoteReadModelMock.mockResolvedValue({
      count: 1,
      items: [
        {
          questionId: "note_1",
          skill: "Type Narrowing",
          moduleSlug: "typescript-control-flow",
        },
      ],
    });
    getDashboardReadModelMock.mockResolvedValue({
      review: {
        dueCount: 3,
      },
      progress: {
        learn: {
          followUpCount: 3,
          followUpQuestionIds: ["lesson_1", "lesson_2"],
          items: [
            {
              questionId: "lesson_1",
              skill: "Effects",
              moduleSlug: "react-rendering-systems",
            },
            {
              questionId: "lesson_2",
              skill: "Identity",
              moduleSlug: "react-rendering-systems",
            },
          ],
        },
        recoveryPlans: [
          {
            skill: "Effects",
            moduleSlug: "react-rendering-systems",
            recoveryQuestionIds: ["review_1", "review_2"],
          },
          {
            skill: "Identity",
            moduleSlug: "react-rendering-systems",
            recoveryQuestionIds: ["review_2", "review_3"],
          },
        ],
      },
    });
    getMockInterviewReadModelMock.mockResolvedValue({
      recoveryQuestions: [
        {
          questionId: "mock_1",
          skill: "Effects",
          moduleSlug: "react-rendering-systems",
        },
        {
          questionId: "mock_2",
          skill: "Type Narrowing",
          moduleSlug: "typescript-control-flow",
        },
      ],
    });
    const readModel = await getPlaylistReadModel({
      userId: "user_1",
      locale: "en",
    });

    expect(readModel.items).toEqual([
      {
        id: "lessonFollowUp",
        type: "lessonFollowUp",
        mode: SessionMode.PRACTICE,
        questionIds: ["lesson_1", "lesson_2"],
        questionCount: 2,
        focusSkills: ["Effects", "Identity"],
        moduleSlug: "react-rendering-systems",
        signalCount: 3,
      },
      {
        id: "recoveryReview",
        type: "recoveryReview",
        mode: SessionMode.REVIEW,
        questionIds: ["review_1", "review_2", "review_3"],
        questionCount: 3,
        focusSkills: ["Effects", "Identity"],
        moduleSlug: "react-rendering-systems",
        signalCount: 3,
      },
      {
        id: "mockRecovery",
        type: "mockRecovery",
        mode: SessionMode.PRACTICE,
        questionIds: ["mock_1", "mock_2"],
        questionCount: 2,
        focusSkills: ["Effects", "Type Narrowing"],
        moduleSlug: "react-rendering-systems",
        signalCount: 2,
      },
      {
        id: "bookmarks",
        type: "bookmarks",
        mode: SessionMode.PRACTICE,
        questionIds: ["bookmark_1", "bookmark_2"],
        questionCount: 2,
        focusSkills: ["Effects", "Identity"],
        moduleSlug: "react-rendering-systems",
        signalCount: 2,
      },
      {
        id: "notes",
        type: "notes",
        mode: SessionMode.PRACTICE,
        questionIds: ["note_1"],
        questionCount: 1,
        focusSkills: ["Type Narrowing"],
        moduleSlug: "typescript-control-flow",
        signalCount: 1,
      },
    ]);
  });
});
