ALTER TABLE "question_progress"
  ADD COLUMN "reviewCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "lapseCount" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "lastOutcomeCorrect" BOOLEAN;
