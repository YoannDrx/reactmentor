CREATE TYPE "PlaylistKind" AS ENUM ('MANUAL', 'GENERATED');

ALTER TABLE "question"
  ADD COLUMN "estimatedTimeSec" INTEGER,
  ADD COLUMN "sourceType" TEXT,
  ADD COLUMN "version" INTEGER NOT NULL DEFAULT 1;

ALTER TABLE "skill_progress"
  ADD COLUMN "masteryCap" INTEGER NOT NULL DEFAULT 0,
  ADD COLUMN "recentAttemptCount" INTEGER NOT NULL DEFAULT 0;

CREATE TABLE "playlist" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "description" TEXT,
  "kind" "PlaylistKind" NOT NULL DEFAULT 'MANUAL',
  "mode" "SessionMode" NOT NULL DEFAULT 'PRACTICE',
  "sourceKey" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,

  CONSTRAINT "playlist_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "playlist_item" (
  "id" TEXT NOT NULL,
  "playlistId" TEXT NOT NULL,
  "questionId" TEXT NOT NULL,
  "order" INTEGER NOT NULL DEFAULT 0,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT "playlist_item_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "playlist_item_playlistId_questionId_key" ON "playlist_item"("playlistId", "questionId");
CREATE INDEX "playlist_userId_updatedAt_idx" ON "playlist"("userId", "updatedAt");
CREATE INDEX "playlist_item_playlistId_order_idx" ON "playlist_item"("playlistId", "order");

ALTER TABLE "playlist"
  ADD CONSTRAINT "playlist_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "playlist_item"
  ADD CONSTRAINT "playlist_item_playlistId_fkey"
  FOREIGN KEY ("playlistId") REFERENCES "playlist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "playlist_item"
  ADD CONSTRAINT "playlist_item_questionId_fkey"
  FOREIGN KEY ("questionId") REFERENCES "question"("id") ON DELETE CASCADE ON UPDATE CASCADE;
