import { MasteryState } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { noteFindManyMock } = vi.hoisted(() => ({
  noteFindManyMock: vi.fn(() => Promise.resolve([])),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    note: {
      findMany: noteFindManyMock,
    },
  },
}));

vi.mock("@/lib/content-repository", () => ({
  localizeQuestion: (question: { prompt: string }) => ({
    prompt: question.prompt,
  }),
  localizeSkill: (skill: { title: string }) => ({
    title: skill.title,
  }),
  localizeModule: (module: { title: string }) => ({
    title: module.title,
  }),
}));

import { getNoteReadModel } from "@/features/notes/note-read-model";

describe("getNoteReadModel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-07T12:00:00.000Z"));
    noteFindManyMock.mockReset();
    noteFindManyMock.mockResolvedValue([]);
  });

  it("builds note statuses and bookmark signals from personalized question data", async () => {
    noteFindManyMock.mockResolvedValue([
      {
        id: "note_pending",
        questionId: "question_pending",
        body: "Name the cleanup boundary explicitly.",
        updatedAt: new Date("2026-03-07T09:30:00.000Z"),
        question: {
          slug: "async-cleanup-wrapper",
          prompt: "Why does an async wrapper hide the effect cleanup?",
          primarySkill: {
            title: "Effects",
          },
          module: {
            title: "React Rendering",
            slug: "react-rendering",
          },
          options: [],
          progress: [
            {
              nextReviewAt: new Date("2026-03-08T08:00:00.000Z"),
              masteryState: MasteryState.REVIEWING,
              lessonViews: 1,
              lessonCheckpointAttempts: 0,
              lastLessonCheckpointPassed: null,
            },
          ],
          attempts: [
            {
              isCorrect: null,
            },
          ],
          bookmarks: [{ id: "bookmark_pending" }],
        },
      },
      {
        id: "note_due",
        questionId: "question_due",
        body: "Anchor the answer in identity and references.",
        updatedAt: new Date("2026-03-06T09:30:00.000Z"),
        question: {
          slug: "unstable-references",
          prompt: "Why can unstable references retrigger memoized work?",
          primarySkill: {
            title: "Identity",
          },
          module: {
            title: "React Rendering",
            slug: "react-rendering",
          },
          options: [],
          progress: [
            {
              nextReviewAt: new Date("2026-03-07T08:00:00.000Z"),
              masteryState: MasteryState.LEARNING,
              lessonViews: 2,
              lessonCheckpointAttempts: 1,
              lastLessonCheckpointPassed: false,
            },
          ],
          attempts: [
            {
              isCorrect: false,
            },
          ],
          bookmarks: [],
        },
      },
    ] as never);

    const readModel = await getNoteReadModel({
      userId: "user_1",
      locale: "en",
    });

    expect(readModel.count).toBe(2);
    expect(readModel.pendingCount).toBe(1);
    expect(readModel.dueCount).toBe(1);
    expect(readModel.bookmarkedCount).toBe(1);
    expect(readModel.items).toEqual([
      expect.objectContaining({
        noteId: "note_pending",
        questionId: "question_pending",
        questionSlug: "async-cleanup-wrapper",
        body: "Name the cleanup boundary explicitly.",
        status: "pendingReview",
        isBookmarked: true,
        learningSignal: "lessonViewed",
      }),
      expect.objectContaining({
        noteId: "note_due",
        questionId: "question_due",
        questionSlug: "unstable-references",
        body: "Anchor the answer in identity and references.",
        status: "due",
        isBookmarked: false,
        learningSignal: "reviewDue",
      }),
    ]);
  });
});
