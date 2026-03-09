import { MasteryState } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { bookmarkFindManyMock } = vi.hoisted(() => ({
  bookmarkFindManyMock: vi.fn(() => Promise.resolve([])),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    bookmark: {
      findMany: bookmarkFindManyMock,
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

import { getBookmarkReadModel } from "@/features/bookmarks/bookmark-read-model";

describe("getBookmarkReadModel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-07T12:00:00.000Z"));
    bookmarkFindManyMock.mockReset();
    bookmarkFindManyMock.mockResolvedValue([]);
  });

  it("builds bookmark statuses from review timing and pending attempts", async () => {
    bookmarkFindManyMock.mockResolvedValue([
      {
        id: "bookmark_pending",
        questionId: "question_pending",
        createdAt: new Date("2026-03-07T09:00:00.000Z"),
        question: {
          slug: "cleanup-boundary",
          prompt: "Explain why a cleanup must come from useEffect itself.",
          format: "OPEN_ENDED",
          primarySkill: {
            title: "Effects",
          },
          module: {
            title: "React Rendering",
            slug: "react-rendering",
          },
          notes: [],
          progress: [
            {
              nextReviewAt: new Date("2026-03-08T12:00:00.000Z"),
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
        },
      },
      {
        id: "bookmark_due",
        questionId: "question_due",
        createdAt: new Date("2026-03-06T09:00:00.000Z"),
        question: {
          slug: "unstable-references",
          prompt: "Why can unstable references retrigger memoized work?",
          format: "SINGLE_CHOICE",
          primarySkill: {
            title: "Identity",
          },
          module: {
            title: "React Rendering",
            slug: "react-rendering",
          },
          notes: [],
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
        },
      },
      {
        id: "bookmark_stable",
        questionId: "question_stable",
        createdAt: new Date("2026-03-05T09:00:00.000Z"),
        question: {
          slug: "key-and-state-reset",
          prompt: "When does a key actually reset component state?",
          format: "MULTIPLE_CHOICE",
          primarySkill: {
            title: "Reconciliation",
          },
          module: {
            title: "React Rendering",
            slug: "react-rendering",
          },
          notes: [],
          progress: [
            {
              nextReviewAt: new Date("2026-03-10T08:00:00.000Z"),
              masteryState: MasteryState.MASTERED,
              lessonViews: 1,
              lessonCheckpointAttempts: 1,
              lastLessonCheckpointPassed: true,
            },
          ],
          attempts: [
            {
              isCorrect: true,
            },
          ],
        },
      },
    ] as never);

    const readModel = await getBookmarkReadModel({
      userId: "user_1",
      locale: "en",
    });

    expect(readModel.count).toBe(3);
    expect(readModel.pendingCount).toBe(1);
    expect(readModel.dueCount).toBe(1);
    expect(readModel.items).toEqual([
      expect.objectContaining({
        bookmarkId: "bookmark_pending",
        questionId: "question_pending",
        questionSlug: "cleanup-boundary",
        moduleSlug: "react-rendering",
        status: "pendingReview",
        isPendingReview: true,
        isDue: false,
        learningSignal: "lessonViewed",
      }),
      expect.objectContaining({
        bookmarkId: "bookmark_due",
        questionId: "question_due",
        questionSlug: "unstable-references",
        moduleSlug: "react-rendering",
        status: "due",
        isPendingReview: false,
        isDue: true,
        learningSignal: "reviewDue",
      }),
      expect.objectContaining({
        bookmarkId: "bookmark_stable",
        questionId: "question_stable",
        questionSlug: "key-and-state-reset",
        moduleSlug: "react-rendering",
        status: "stable",
        isPendingReview: false,
        isDue: false,
        learningSignal: "checkpointReady",
      }),
    ]);
  });
});
