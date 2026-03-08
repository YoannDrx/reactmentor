-- AlterTable
ALTER TABLE "question_translation" ADD COLUMN     "commonMistakes" JSONB,
ADD COLUMN     "estimatedReadMinutes" INTEGER,
ADD COLUMN     "exampleCode" TEXT,
ADD COLUMN     "exampleExplanation" TEXT,
ADD COLUMN     "exampleLanguage" TEXT,
ADD COLUMN     "exampleTitle" TEXT,
ADD COLUMN     "lessonBody" TEXT,
ADD COLUMN     "shortAnswer" TEXT,
ADD COLUMN     "tlDr" TEXT;

-- CreateTable
CREATE TABLE "question_collection" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "summary" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "status" "ContentStatus" NOT NULL DEFAULT 'PUBLISHED',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_collection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_collection_translation" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "locale" "ContentLocale" NOT NULL,
    "status" "TranslationStatus" NOT NULL DEFAULT 'READY',
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "summary" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "question_collection_translation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "question_collection_item" (
    "id" TEXT NOT NULL,
    "collectionId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "question_collection_item_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "question_collection_slug_key" ON "question_collection"("slug");

-- CreateIndex
CREATE INDEX "question_collection_status_idx" ON "question_collection"("status");

-- CreateIndex
CREATE UNIQUE INDEX "question_collection_translation_collectionId_locale_key" ON "question_collection_translation"("collectionId", "locale");

-- CreateIndex
CREATE INDEX "question_collection_item_collectionId_order_idx" ON "question_collection_item"("collectionId", "order");

-- CreateIndex
CREATE UNIQUE INDEX "question_collection_item_collectionId_questionId_key" ON "question_collection_item"("collectionId", "questionId");

-- AddForeignKey
ALTER TABLE "question_collection_translation" ADD CONSTRAINT "question_collection_translation_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "question_collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_collection_item" ADD CONSTRAINT "question_collection_item_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "question_collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "question_collection_item" ADD CONSTRAINT "question_collection_item_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
