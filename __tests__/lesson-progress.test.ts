import { MasteryState } from "@prisma/client";
import { describe, expect, it } from "vitest";
import {
  buildLessonCheckpointProgressPatch,
  buildLessonReviewQueuePatch,
  buildLessonViewProgressPatch,
  getLessonProgressSnapshot,
} from "@/features/learn/lesson-progress";

describe("lesson-progress helpers", () => {
  it("increments lesson views and records the latest read timestamp", () => {
    const now = new Date("2026-03-08T10:00:00.000Z");

    expect(
      buildLessonViewProgressPatch(
        {
          lessonViews: 2,
          lastLessonViewedAt: new Date("2026-03-07T10:00:00.000Z"),
          lessonCheckpointAttempts: 0,
          lessonCheckpointPassCount: 0,
          lastLessonCheckpointAt: null,
          lastLessonCheckpointPassed: null,
          nextReviewAt: null,
          masteryState: MasteryState.NEW,
        },
        now,
      ),
    ).toEqual({
      lessonViews: 3,
      lastLessonViewedAt: now,
    });
  });

  it("records a successful checkpoint without forcing a review queue", () => {
    const now = new Date("2026-03-08T10:00:00.000Z");

    expect(
      buildLessonCheckpointProgressPatch(
        {
          lessonViews: 1,
          lastLessonViewedAt: new Date("2026-03-08T09:00:00.000Z"),
          lessonCheckpointAttempts: 1,
          lessonCheckpointPassCount: 0,
          lastLessonCheckpointAt: null,
          lastLessonCheckpointPassed: null,
          nextReviewAt: null,
          masteryState: MasteryState.LEARNING,
        },
        {
          passed: true,
          now,
        },
      ),
    ).toEqual({
      lessonCheckpointAttempts: 2,
      lessonCheckpointPassCount: 1,
      lastLessonCheckpointAt: now,
      lastLessonCheckpointPassed: true,
    });
  });

  it("queues a failed checkpoint for review and downgrades mastered progress", () => {
    const now = new Date("2026-03-08T10:00:00.000Z");

    expect(
      buildLessonCheckpointProgressPatch(
        {
          lessonViews: 3,
          lastLessonViewedAt: new Date("2026-03-08T09:00:00.000Z"),
          lessonCheckpointAttempts: 2,
          lessonCheckpointPassCount: 2,
          lastLessonCheckpointAt: new Date("2026-03-08T09:30:00.000Z"),
          lastLessonCheckpointPassed: true,
          nextReviewAt: null,
          masteryState: MasteryState.MASTERED,
        },
        {
          passed: false,
          now,
        },
      ),
    ).toEqual({
      lessonCheckpointAttempts: 3,
      lessonCheckpointPassCount: 2,
      lastLessonCheckpointAt: now,
      lastLessonCheckpointPassed: false,
      nextReviewAt: now,
      masteryState: MasteryState.REVIEWING,
    });
  });

  it("preserves an earlier due date when a lesson is queued again for review", () => {
    const dueAt = new Date("2026-03-08T08:00:00.000Z");
    const now = new Date("2026-03-08T10:00:00.000Z");

    expect(
      buildLessonReviewQueuePatch(
        {
          lessonViews: 1,
          lastLessonViewedAt: new Date("2026-03-08T07:00:00.000Z"),
          lessonCheckpointAttempts: 1,
          lessonCheckpointPassCount: 0,
          lastLessonCheckpointAt: new Date("2026-03-08T07:30:00.000Z"),
          lastLessonCheckpointPassed: false,
          nextReviewAt: dueAt,
          masteryState: MasteryState.LEARNING,
        },
        now,
      ),
    ).toEqual({
      nextReviewAt: dueAt,
      masteryState: MasteryState.LEARNING,
    });
  });

  it("builds a lesson snapshot from persisted question progress", () => {
    const now = new Date("2026-03-08T10:00:00.000Z");

    expect(
      getLessonProgressSnapshot(
        {
          lessonViews: 2,
          lastLessonViewedAt: new Date("2026-03-08T09:00:00.000Z"),
          lessonCheckpointAttempts: 3,
          lessonCheckpointPassCount: 1,
          lastLessonCheckpointAt: new Date("2026-03-08T09:30:00.000Z"),
          lastLessonCheckpointPassed: true,
          nextReviewAt: new Date("2026-03-08T08:30:00.000Z"),
          masteryState: MasteryState.REVIEWING,
        },
        now,
      ),
    ).toMatchObject({
      lessonViews: 2,
      hasViewedLesson: true,
      checkpointAttempts: 3,
      checkpointPassCount: 1,
      hasCompletedCheckpoint: true,
      isCheckpointReady: true,
      isDueForReview: true,
    });
  });
});
