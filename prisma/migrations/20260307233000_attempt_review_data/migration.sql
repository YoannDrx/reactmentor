-- AlterTable
ALTER TABLE "attempt"
ADD COLUMN "reviewData" JSONB,
ADD COLUMN "reviewedAt" TIMESTAMP(3);
