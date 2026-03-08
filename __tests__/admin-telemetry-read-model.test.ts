import {
  BillingPlan,
  OperationalEventLevel,
  ProductAnalyticsEventName,
  SessionMode,
} from "@prisma/client";
import { describe, expect, it } from "vitest";
import { buildAdminTelemetryReadModel } from "@/features/telemetry/admin-telemetry-read-model";

describe("buildAdminTelemetryReadModel", () => {
  it("builds funnel metrics, product counts and operational source summaries", () => {
    const readModel = buildAdminTelemetryReadModel({
      now: new Date("2026-03-08T12:00:00.000Z"),
      analyticsRows: [
        {
          id: "analytics_signup_1",
          userId: "user_1",
          name: ProductAnalyticsEventName.ACCOUNT_CREATED,
          source: "auth.signup.email",
          sessionMode: null,
          billingPlan: null,
          moduleSlug: null,
          questionId: null,
          occurredAt: new Date("2026-03-07T10:00:00.000Z"),
        },
        {
          id: "analytics_signup_2",
          userId: "user_2",
          name: ProductAnalyticsEventName.ACCOUNT_CREATED,
          source: "auth.signup.email",
          sessionMode: null,
          billingPlan: null,
          moduleSlug: null,
          questionId: null,
          occurredAt: new Date("2026-03-07T11:00:00.000Z"),
        },
        {
          id: "analytics_onboarding_1",
          userId: "user_1",
          name: ProductAnalyticsEventName.ONBOARDING_COMPLETED,
          source: "onboarding.action",
          sessionMode: null,
          billingPlan: null,
          moduleSlug: null,
          questionId: null,
          occurredAt: new Date("2026-03-07T12:00:00.000Z"),
        },
        {
          id: "analytics_practice_1",
          userId: "user_1",
          name: ProductAnalyticsEventName.SESSION_STARTED,
          source: "session.action.create",
          sessionMode: SessionMode.PRACTICE,
          billingPlan: null,
          moduleSlug: "react-rendering-systems",
          questionId: null,
          occurredAt: new Date("2026-03-07T13:00:00.000Z"),
        },
        {
          id: "analytics_practice_2",
          userId: "user_1",
          name: ProductAnalyticsEventName.SESSION_STARTED,
          source: "session.action.create",
          sessionMode: SessionMode.PRACTICE,
          billingPlan: null,
          moduleSlug: "react-rendering-systems",
          questionId: null,
          occurredAt: new Date("2026-03-07T14:00:00.000Z"),
        },
        {
          id: "analytics_mock_1",
          userId: "user_1",
          name: ProductAnalyticsEventName.MOCK_COMPLETED,
          source: "session.action.finish",
          sessionMode: SessionMode.MOCK_INTERVIEW,
          billingPlan: BillingPlan.HIRING_SPRINT,
          moduleSlug: null,
          questionId: null,
          occurredAt: new Date("2026-03-07T15:00:00.000Z"),
        },
        {
          id: "analytics_checkout_1",
          userId: "user_1",
          name: ProductAnalyticsEventName.CHECKOUT_COMPLETED,
          source: "billing.webhook",
          sessionMode: null,
          billingPlan: BillingPlan.MENTOR_PRO,
          moduleSlug: null,
          questionId: null,
          occurredAt: new Date("2026-03-07T16:00:00.000Z"),
        },
        {
          id: "analytics_subscription_1",
          userId: "user_1",
          name: ProductAnalyticsEventName.SUBSCRIPTION_STARTED,
          source: "billing.webhook",
          sessionMode: null,
          billingPlan: BillingPlan.MENTOR_PRO,
          moduleSlug: null,
          questionId: null,
          occurredAt: new Date("2026-03-07T16:05:00.000Z"),
        },
      ],
      operationalRows: [
        {
          id: "ops_1",
          userId: "user_1",
          source: "billing.webhook",
          eventType: "checkout.session.completed",
          level: OperationalEventLevel.INFO,
          status: "processed",
          message: null,
          occurredAt: new Date("2026-03-07T16:06:00.000Z"),
        },
        {
          id: "ops_2",
          userId: "user_1",
          source: "billing.webhook",
          eventType: "customer.subscription.created",
          level: OperationalEventLevel.ERROR,
          status: "failed",
          message: "Webhook timeout",
          occurredAt: new Date("2026-03-07T16:07:00.000Z"),
        },
        {
          id: "ops_3",
          userId: "user_admin",
          source: "content.import",
          eventType: "admin_content_import",
          level: OperationalEventLevel.WARN,
          status: "failed",
          message: "Missing FR translation",
          occurredAt: new Date("2026-03-07T16:08:00.000Z"),
        },
      ],
    });

    expect(readModel.analytics.totalEvents).toBe(8);
    expect(readModel.analytics.activeUsers).toBe(2);
    expect(readModel.analytics.counts.ACCOUNT_CREATED).toBe(2);
    expect(readModel.analytics.counts.SUBSCRIPTION_STARTED).toBe(1);
    expect(readModel.analytics.funnel).toEqual([
      {
        key: "signup",
        users: 2,
        conversionFromPrevious: null,
      },
      {
        key: "onboarding",
        users: 1,
        conversionFromPrevious: 50,
      },
      {
        key: "firstPractice",
        users: 1,
        conversionFromPrevious: 100,
      },
      {
        key: "repeatPractice",
        users: 1,
        conversionFromPrevious: 100,
      },
      {
        key: "firstMock",
        users: 1,
        conversionFromPrevious: 100,
      },
    ]);
    expect(readModel.analytics.recentEvents[0]).toEqual(
      expect.objectContaining({
        id: "analytics_subscription_1",
      }),
    );

    expect(readModel.operational.totalEvents).toBe(3);
    expect(readModel.operational.infoCount).toBe(1);
    expect(readModel.operational.warningCount).toBe(1);
    expect(readModel.operational.errorCount).toBe(1);
    expect(readModel.operational.billingWebhookEvents).toBe(2);
    expect(readModel.operational.contentImportEvents).toBe(1);
    expect(readModel.operational.sourceRows[0]).toEqual(
      expect.objectContaining({
        source: "billing.webhook",
        total: 2,
        errors: 1,
        warnings: 0,
      }),
    );
    expect(readModel.operational.recentEvents[0]).toEqual(
      expect.objectContaining({
        id: "ops_3",
      }),
    );
  });
});
