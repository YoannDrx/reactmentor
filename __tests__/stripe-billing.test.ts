import { BillingPlan, BillingStatus } from "@prisma/client";
import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/env", () => ({
  env: {
    STRIPE_SECRET_KEY: "sk_test_123",
    STRIPE_WEBHOOK_SECRET: "whsec_test_123",
    STRIPE_PRICE_MENTOR_PRO: "price_mentor_pro",
    STRIPE_PRICE_HIRING_SPRINT: "price_hiring_sprint",
  },
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    userEntitlement: {
      findUnique: vi.fn(),
      update: vi.fn(),
      upsert: vi.fn(),
    },
  },
}));

import {
  buildEntitlementUpdateFromStripeSubscription,
  mapStripeSubscriptionStatus,
  resolveBillingPlanFromStripePriceId,
} from "@/features/billing/stripe-billing";

describe("stripe billing mapping", () => {
  it("maps configured Stripe prices back to the expected plan", () => {
    expect(resolveBillingPlanFromStripePriceId("price_mentor_pro")).toBe(
      BillingPlan.MENTOR_PRO,
    );
    expect(resolveBillingPlanFromStripePriceId("price_hiring_sprint")).toBe(
      BillingPlan.HIRING_SPRINT,
    );
    expect(resolveBillingPlanFromStripePriceId("price_unknown")).toBeNull();
  });

  it("maps an active premium subscription to premium entitlements", () => {
    const update = buildEntitlementUpdateFromStripeSubscription({
      id: "sub_active",
      status: "active",
      customer: "cus_active",
      items: {
        data: [
          {
            current_period_start: 1_709_251_200,
            current_period_end: 1_711_670_400,
            price: {
              id: "price_mentor_pro",
            },
          },
        ],
      },
      metadata: {
        userId: "user_1",
        targetPlan: BillingPlan.MENTOR_PRO,
      },
    } as never);

    expect(update).toEqual(
      expect.objectContaining({
        plan: BillingPlan.MENTOR_PRO,
        billingStatus: BillingStatus.ACTIVE,
        moduleAccessLimit: null,
        monthlyMockLimit: null,
        playlistsEnabled: true,
        sprintModeEnabled: false,
        billingCustomerId: "cus_active",
        billingSubscriptionId: "sub_active",
        currentPeriodStartsAt: new Date(1_709_251_200 * 1000),
        currentPeriodEndsAt: new Date(1_711_670_400 * 1000),
      }),
    );
  });

  it("downgrades canceled subscriptions back to starter access", () => {
    const update = buildEntitlementUpdateFromStripeSubscription({
      id: "sub_canceled",
      status: "canceled",
      customer: "cus_canceled",
      items: {
        data: [
          {
            current_period_start: 1_709_251_200,
            current_period_end: 1_711_670_400,
            price: {
              id: "price_hiring_sprint",
            },
          },
        ],
      },
      metadata: {
        userId: "user_2",
        targetPlan: BillingPlan.HIRING_SPRINT,
      },
    } as never);

    expect(update).toEqual(
      expect.objectContaining({
        plan: BillingPlan.STARTER,
        billingStatus: BillingStatus.CANCELED,
        moduleAccessLimit: 2,
        monthlyMockLimit: 1,
        playlistsEnabled: false,
        sprintModeEnabled: false,
        billingCustomerId: "cus_canceled",
        billingSubscriptionId: null,
        currentPeriodStartsAt: null,
        currentPeriodEndsAt: null,
      }),
    );
  });

  it("maps Stripe past due style statuses to the product status", () => {
    expect(mapStripeSubscriptionStatus("past_due")).toBe(
      BillingStatus.PAST_DUE,
    );
    expect(mapStripeSubscriptionStatus("unpaid")).toBe(BillingStatus.PAST_DUE);
    expect(mapStripeSubscriptionStatus("incomplete")).toBe(
      BillingStatus.EXPIRED,
    );
  });
});
