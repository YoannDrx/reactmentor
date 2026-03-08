-- CreateEnum
CREATE TYPE "ProductAnalyticsEventName" AS ENUM ('ACCOUNT_CREATED', 'ONBOARDING_COMPLETED', 'SESSION_STARTED', 'SESSION_COMPLETED', 'REVIEW_LAUNCHED', 'QUESTION_ANSWERED', 'BOOKMARK_CREATED', 'NOTE_CREATED', 'UPGRADE_CLICKED', 'CHECKOUT_COMPLETED', 'SUBSCRIPTION_STARTED', 'MOCK_COMPLETED');

-- CreateEnum
CREATE TYPE "OperationalEventLevel" AS ENUM ('INFO', 'WARN', 'ERROR');

-- CreateTable
CREATE TABLE "product_analytics_event" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "name" "ProductAnalyticsEventName" NOT NULL,
    "source" TEXT,
    "sessionMode" "SessionMode",
    "billingPlan" "BillingPlan",
    "locale" "ContentLocale",
    "trainingSessionId" TEXT,
    "questionId" TEXT,
    "moduleSlug" TEXT,
    "metadata" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "product_analytics_event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "operational_event" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "source" TEXT NOT NULL,
    "eventType" TEXT NOT NULL,
    "level" "OperationalEventLevel" NOT NULL DEFAULT 'INFO',
    "status" TEXT,
    "message" TEXT,
    "metadata" JSONB,
    "occurredAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "operational_event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "product_analytics_event_name_occurredAt_idx" ON "product_analytics_event"("name", "occurredAt");

-- CreateIndex
CREATE INDEX "product_analytics_event_userId_occurredAt_idx" ON "product_analytics_event"("userId", "occurredAt");

-- CreateIndex
CREATE INDEX "product_analytics_event_sessionMode_occurredAt_idx" ON "product_analytics_event"("sessionMode", "occurredAt");

-- CreateIndex
CREATE INDEX "product_analytics_event_billingPlan_occurredAt_idx" ON "product_analytics_event"("billingPlan", "occurredAt");

-- CreateIndex
CREATE INDEX "operational_event_source_occurredAt_idx" ON "operational_event"("source", "occurredAt");

-- CreateIndex
CREATE INDEX "operational_event_level_occurredAt_idx" ON "operational_event"("level", "occurredAt");

-- CreateIndex
CREATE INDEX "operational_event_status_occurredAt_idx" ON "operational_event"("status", "occurredAt");

-- AddForeignKey
ALTER TABLE "product_analytics_event" ADD CONSTRAINT "product_analytics_event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "operational_event" ADD CONSTRAINT "operational_event_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;
