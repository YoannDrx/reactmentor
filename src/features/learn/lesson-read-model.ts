import { cache } from "react";
import { prisma } from "@/lib/prisma";
import { getLessonProgressSnapshot } from "./lesson-progress";

export const getLessonReadModel = cache(
  async (userId: string, questionId: string) => {
    const progress = await prisma.questionProgress.findUnique({
      where: {
        userId_questionId: {
          userId,
          questionId,
        },
      },
      select: {
        lessonViews: true,
        lastLessonViewedAt: true,
        lessonCheckpointAttempts: true,
        lessonCheckpointPassCount: true,
        lastLessonCheckpointAt: true,
        lastLessonCheckpointPassed: true,
        nextReviewAt: true,
        masteryState: true,
      },
    });

    return getLessonProgressSnapshot(progress);
  },
);
