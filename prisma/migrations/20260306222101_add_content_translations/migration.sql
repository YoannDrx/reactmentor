-- CreateEnum
CREATE TYPE "ContentLocale" AS ENUM ('FR', 'EN');

-- CreateEnum
CREATE TYPE "TranslationStatus" AS ENUM ('MISSING', 'IN_PROGRESS', 'REVIEW', 'READY');

-- AlterTable
ALTER TABLE "skill" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'published';

-- CreateTable
CREATE TABLE "learning_module_translation" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "locale" "ContentLocale" NOT NULL,
    "status" "TranslationStatus" NOT NULL DEFAULT 'READY',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "learning_module_translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "skill_translation" (
    "id" TEXT NOT NULL,
    "skillId" TEXT NOT NULL,
    "locale" "ContentLocale" NOT NULL,
    "status" "TranslationStatus" NOT NULL DEFAULT 'READY',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "skill_translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_translation" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "locale" "ContentLocale" NOT NULL,
    "status" "TranslationStatus" NOT NULL DEFAULT 'READY',
    "prompt" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "takeaways" JSONB,
    "interviewSignal" TEXT,
    "verbalizePoints" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_option_translation" (
    "id" TEXT NOT NULL,
    "optionId" TEXT NOT NULL,
    "locale" "ContentLocale" NOT NULL,
    "status" "TranslationStatus" NOT NULL DEFAULT 'READY',
    "label" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_option_translation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "learning_module_translation_moduleId_locale_key" ON "learning_module_translation"("moduleId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "skill_translation_skillId_locale_key" ON "skill_translation"("skillId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "question_translation_questionId_locale_key" ON "question_translation"("questionId", "locale");

-- CreateIndex
CREATE UNIQUE INDEX "question_option_translation_optionId_locale_key" ON "question_option_translation"("optionId", "locale");

-- AddForeignKey
ALTER TABLE "learning_module_translation" ADD CONSTRAINT "learning_module_translation_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "learning_module"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "skill_translation" ADD CONSTRAINT "skill_translation_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skill"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_translation" ADD CONSTRAINT "question_translation_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_option_translation" ADD CONSTRAINT "question_option_translation_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "question_option"("id") ON DELETE CASCADE ON UPDATE CASCADE;
