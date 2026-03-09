-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ProductAnalyticsEventName" ADD VALUE 'LESSON_VIEWED';
ALTER TYPE "ProductAnalyticsEventName" ADD VALUE 'LESSON_CHECKPOINT_COMPLETED';
ALTER TYPE "ProductAnalyticsEventName" ADD VALUE 'LESSON_REVIEW_QUEUED';

-- AlterTable
ALTER TABLE "question_progress" ADD COLUMN     "lastLessonCheckpointAt" TIMESTAMP(3),
ADD COLUMN     "lastLessonCheckpointPassed" BOOLEAN,
ADD COLUMN     "lastLessonViewedAt" TIMESTAMP(3),
ADD COLUMN     "lessonCheckpointAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lessonCheckpointPassCount" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lessonViews" INTEGER NOT NULL DEFAULT 0;
