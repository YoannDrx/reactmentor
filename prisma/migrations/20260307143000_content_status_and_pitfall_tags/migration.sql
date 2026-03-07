-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'IN_REVIEW', 'PUBLISHED', 'ARCHIVED');

-- AlterTable
ALTER TABLE "learning_module"
    ALTER COLUMN "status" DROP DEFAULT,
    ALTER COLUMN "status" TYPE "ContentStatus" USING (
        CASE
            WHEN "status" = 'draft' THEN 'DRAFT'::"ContentStatus"
            WHEN "status" = 'in_review' THEN 'IN_REVIEW'::"ContentStatus"
            WHEN "status" = 'archived' THEN 'ARCHIVED'::"ContentStatus"
            ELSE 'PUBLISHED'::"ContentStatus"
        END
    ),
    ALTER COLUMN "status" SET DEFAULT 'PUBLISHED';

-- AlterTable
ALTER TABLE "skill"
    ALTER COLUMN "status" DROP DEFAULT,
    ALTER COLUMN "status" TYPE "ContentStatus" USING (
        CASE
            WHEN "status" = 'draft' THEN 'DRAFT'::"ContentStatus"
            WHEN "status" = 'in_review' THEN 'IN_REVIEW'::"ContentStatus"
            WHEN "status" = 'archived' THEN 'ARCHIVED'::"ContentStatus"
            ELSE 'PUBLISHED'::"ContentStatus"
        END
    ),
    ALTER COLUMN "status" SET DEFAULT 'PUBLISHED';

-- AlterTable
ALTER TABLE "question"
    ALTER COLUMN "status" DROP DEFAULT,
    ALTER COLUMN "status" TYPE "ContentStatus" USING (
        CASE
            WHEN "status" = 'draft' THEN 'DRAFT'::"ContentStatus"
            WHEN "status" = 'in_review' THEN 'IN_REVIEW'::"ContentStatus"
            WHEN "status" = 'archived' THEN 'ARCHIVED'::"ContentStatus"
            ELSE 'PUBLISHED'::"ContentStatus"
        END
    ),
    ALTER COLUMN "status" SET DEFAULT 'PUBLISHED';

-- CreateTable
CREATE TABLE "pitfall_tag" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pitfall_tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_pitfall_tag" (
    "questionId" TEXT NOT NULL,
    "pitfallTagId" TEXT NOT NULL,

    CONSTRAINT "question_pitfall_tag_pkey" PRIMARY KEY ("questionId","pitfallTagId")
);

-- CreateIndex
CREATE INDEX "learning_module_status_idx" ON "learning_module"("status");

-- CreateIndex
CREATE INDEX "skill_status_idx" ON "skill"("status");

-- CreateIndex
CREATE INDEX "question_status_idx" ON "question"("status");

-- CreateIndex
CREATE UNIQUE INDEX "pitfall_tag_slug_key" ON "pitfall_tag"("slug");

-- AddForeignKey
ALTER TABLE "question_pitfall_tag" ADD CONSTRAINT "question_pitfall_tag_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_pitfall_tag" ADD CONSTRAINT "question_pitfall_tag_pitfallTagId_fkey" FOREIGN KEY ("pitfallTagId") REFERENCES "pitfall_tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
