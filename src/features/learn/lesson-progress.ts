import { MasteryState, type QuestionProgress } from "@prisma/client";

type LessonProgressSource = Pick<
  QuestionProgress,
  | "lessonViews"
  | "lastLessonViewedAt"
  | "lessonCheckpointAttempts"
  | "lessonCheckpointPassCount"
  | "lastLessonCheckpointAt"
  | "lastLessonCheckpointPassed"
  | "nextReviewAt"
  | "masteryState"
>;

export type LessonProgressSnapshot = {
  lessonViews: number;
  hasViewedLesson: boolean;
  checkpointAttempts: number;
  checkpointPassCount: number;
  hasCompletedCheckpoint: boolean;
  isCheckpointReady: boolean;
  isDueForReview: boolean;
  lastLessonViewedAt: Date | null;
  lastLessonCheckpointAt: Date | null;
};

function getCurrentMasteryState(
  previousProgress: LessonProgressSource | null,
): MasteryState {
  return previousProgress?.masteryState ?? MasteryState.NEW;
}

export function buildLessonViewProgressPatch(
  previousProgress: LessonProgressSource | null,
  now: Date,
) {
  return {
    lessonViews: (previousProgress?.lessonViews ?? 0) + 1,
    lastLessonViewedAt: now,
  };
}

export function buildLessonCheckpointProgressPatch(
  previousProgress: LessonProgressSource | null,
  params: {
    passed: boolean;
    now: Date;
  },
) {
  const currentMasteryState = getCurrentMasteryState(previousProgress);

  return {
    lessonCheckpointAttempts:
      (previousProgress?.lessonCheckpointAttempts ?? 0) + 1,
    lessonCheckpointPassCount:
      (previousProgress?.lessonCheckpointPassCount ?? 0) +
      (params.passed ? 1 : 0),
    lastLessonCheckpointAt: params.now,
    lastLessonCheckpointPassed: params.passed,
    ...(params.passed
      ? {}
      : {
          nextReviewAt:
            previousProgress?.nextReviewAt &&
            previousProgress.nextReviewAt <= params.now
              ? previousProgress.nextReviewAt
              : params.now,
          masteryState:
            currentMasteryState === MasteryState.MASTERED
              ? MasteryState.REVIEWING
              : MasteryState.LEARNING,
        }),
  };
}

export function buildLessonReviewQueuePatch(
  previousProgress: LessonProgressSource | null,
  now: Date,
) {
  const currentMasteryState = getCurrentMasteryState(previousProgress);

  return {
    nextReviewAt:
      previousProgress?.nextReviewAt && previousProgress.nextReviewAt <= now
        ? previousProgress.nextReviewAt
        : now,
    masteryState:
      currentMasteryState === MasteryState.MASTERED
        ? MasteryState.REVIEWING
        : MasteryState.LEARNING,
  };
}

export function getLessonProgressSnapshot(
  previousProgress: LessonProgressSource | null,
  now = new Date(),
): LessonProgressSnapshot {
  const lessonViews = previousProgress?.lessonViews ?? 0;
  const checkpointAttempts = previousProgress?.lessonCheckpointAttempts ?? 0;
  const checkpointPassCount = previousProgress?.lessonCheckpointPassCount ?? 0;

  return {
    lessonViews,
    hasViewedLesson: lessonViews > 0,
    checkpointAttempts,
    checkpointPassCount,
    hasCompletedCheckpoint: checkpointAttempts > 0,
    isCheckpointReady: previousProgress?.lastLessonCheckpointPassed === true,
    isDueForReview:
      previousProgress?.nextReviewAt ? previousProgress.nextReviewAt <= now : false,
    lastLessonViewedAt: previousProgress?.lastLessonViewedAt ?? null,
    lastLessonCheckpointAt: previousProgress?.lastLessonCheckpointAt ?? null,
  };
}
