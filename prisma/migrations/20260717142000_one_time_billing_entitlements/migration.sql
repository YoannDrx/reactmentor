-- Additive rollout for one-time Hiring Sprint purchases.
ALTER TABLE "user_entitlement"
ADD COLUMN "subscriptionPlan" "BillingPlan",
ADD COLUMN "subscriptionStatus" "BillingStatus",
ADD COLUMN "subscriptionStartsAt" TIMESTAMP(3),
ADD COLUMN "subscriptionEndsAt" TIMESTAMP(3),
ADD COLUMN "oneTimePlan" "BillingPlan",
ADD COLUMN "oneTimeAccessStartsAt" TIMESTAMP(3),
ADD COLUMN "oneTimeAccessEndsAt" TIMESTAMP(3);

-- Preserve the currently effective subscription layer for existing rows.
UPDATE "user_entitlement"
SET
  "subscriptionPlan" = "plan",
  "subscriptionStatus" = "billingStatus",
  "subscriptionStartsAt" = "currentPeriodStartsAt",
  "subscriptionEndsAt" = "currentPeriodEndsAt"
WHERE "billingSubscriptionId" IS NOT NULL
  AND "plan" <> 'STARTER';

CREATE TABLE "billing_purchase" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "plan" "BillingPlan" NOT NULL,
  "checkoutSessionId" TEXT NOT NULL,
  "paymentIntentId" TEXT NOT NULL,
  "amount" INTEGER NOT NULL,
  "currency" TEXT NOT NULL,
  "accessDays" INTEGER NOT NULL,
  "paidAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "billing_purchase_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "billing_purchase_checkoutSessionId_key"
ON "billing_purchase"("checkoutSessionId");

CREATE UNIQUE INDEX "billing_purchase_paymentIntentId_key"
ON "billing_purchase"("paymentIntentId");

CREATE INDEX "billing_purchase_userId_paidAt_idx"
ON "billing_purchase"("userId", "paidAt");

ALTER TABLE "billing_purchase"
ADD CONSTRAINT "billing_purchase_userId_fkey"
FOREIGN KEY ("userId") REFERENCES "user"("id")
ON DELETE CASCADE ON UPDATE CASCADE;
