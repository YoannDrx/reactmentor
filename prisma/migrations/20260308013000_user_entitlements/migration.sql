-- CreateEnum
CREATE TYPE "BillingPlan" AS ENUM ('STARTER', 'MENTOR_PRO', 'HIRING_SPRINT');

-- CreateEnum
CREATE TYPE "BillingStatus" AS ENUM ('FREE', 'ACTIVE', 'TRIALING', 'PAST_DUE', 'CANCELED', 'EXPIRED');

-- CreateEnum
CREATE TYPE "AnalysisDepth" AS ENUM ('CORE', 'ADVANCED');

-- CreateTable
CREATE TABLE "user_entitlement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "plan" "BillingPlan" NOT NULL DEFAULT 'STARTER',
    "billingStatus" "BillingStatus" NOT NULL DEFAULT 'FREE',
    "moduleAccessLimit" INTEGER DEFAULT 2,
    "monthlyMockLimit" INTEGER DEFAULT 1,
    "analysisDepth" "AnalysisDepth" NOT NULL DEFAULT 'CORE',
    "playlistsEnabled" BOOLEAN NOT NULL DEFAULT false,
    "sprintModeEnabled" BOOLEAN NOT NULL DEFAULT false,
    "currentPeriodStartsAt" TIMESTAMP(3),
    "currentPeriodEndsAt" TIMESTAMP(3),
    "billingCustomerId" TEXT,
    "billingSubscriptionId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_entitlement_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_entitlement_userId_key" ON "user_entitlement"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_entitlement_billingCustomerId_key" ON "user_entitlement"("billingCustomerId");

-- CreateIndex
CREATE UNIQUE INDEX "user_entitlement_billingSubscriptionId_key" ON "user_entitlement"("billingSubscriptionId");

-- AddForeignKey
ALTER TABLE "user_entitlement" ADD CONSTRAINT "user_entitlement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
