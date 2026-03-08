import {
  BillingPlan,
  ContentLocale,
  OperationalEventLevel,
  ProductAnalyticsEventName,
  SessionMode,
} from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  productAnalyticsEventCreateMock,
  productAnalyticsEventFindFirstMock,
  operationalEventCreateMock,
} = vi.hoisted(() => ({
  productAnalyticsEventCreateMock: vi.fn(),
  productAnalyticsEventFindFirstMock: vi.fn(),
  operationalEventCreateMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    productAnalyticsEvent: {
      create: productAnalyticsEventCreateMock,
      findFirst: productAnalyticsEventFindFirstMock,
    },
    operationalEvent: {
      create: operationalEventCreateMock,
    },
  },
}));

import {
  captureOperationalEvent,
  captureProductAnalyticsEvent,
  ensureAccountCreatedAnalyticsEvent,
  toContentLocale,
} from "@/features/telemetry/telemetry";

describe("telemetry", () => {
  beforeEach(() => {
    productAnalyticsEventCreateMock.mockReset();
    productAnalyticsEventFindFirstMock.mockReset();
    operationalEventCreateMock.mockReset();
  });

  it("persists product analytics events with optional dimensions", async () => {
    productAnalyticsEventCreateMock.mockResolvedValue({
      id: "analytics_1",
    });

    await captureProductAnalyticsEvent({
      userId: "user_1",
      name: ProductAnalyticsEventName.SESSION_STARTED,
      source: "session.action.create",
      sessionMode: SessionMode.PRACTICE,
      billingPlan: BillingPlan.MENTOR_PRO,
      locale: ContentLocale.FR,
      trainingSessionId: "session_1",
      questionId: "question_1",
      moduleSlug: "react-rendering-systems",
      metadata: {
        questionCount: 6,
      },
    });

    expect(productAnalyticsEventCreateMock).toHaveBeenCalledWith({
      data: {
        userId: "user_1",
        name: ProductAnalyticsEventName.SESSION_STARTED,
        source: "session.action.create",
        sessionMode: SessionMode.PRACTICE,
        billingPlan: BillingPlan.MENTOR_PRO,
        locale: ContentLocale.FR,
        trainingSessionId: "session_1",
        questionId: "question_1",
        moduleSlug: "react-rendering-systems",
        metadata: {
          questionCount: 6,
        },
        occurredAt: undefined,
      },
    });
  });

  it("deduplicates the account created event per user", async () => {
    productAnalyticsEventFindFirstMock.mockResolvedValue({
      id: "analytics_existing",
    });

    const result = await ensureAccountCreatedAnalyticsEvent({
      userId: "user_2",
      source: "auth.signup.email",
      locale: ContentLocale.EN,
    });

    expect(productAnalyticsEventFindFirstMock).toHaveBeenCalledWith({
      where: {
        userId: "user_2",
        name: ProductAnalyticsEventName.ACCOUNT_CREATED,
      },
      select: {
        id: true,
      },
    });
    expect(productAnalyticsEventCreateMock).not.toHaveBeenCalled();
    expect(result).toEqual({
      id: "analytics_existing",
    });
  });

  it("persists operational events and keeps locale conversion stable", async () => {
    operationalEventCreateMock.mockResolvedValue({
      id: "ops_1",
    });

    await captureOperationalEvent({
      userId: "user_3",
      source: "billing.webhook",
      eventType: "checkout.session.completed",
      level: OperationalEventLevel.INFO,
      status: "processed",
      message: null,
      metadata: {
        stripeEventId: "evt_123",
      },
    });

    expect(operationalEventCreateMock).toHaveBeenCalledWith({
      data: {
        userId: "user_3",
        source: "billing.webhook",
        eventType: "checkout.session.completed",
        level: OperationalEventLevel.INFO,
        status: "processed",
        message: null,
        metadata: {
          stripeEventId: "evt_123",
        },
        occurredAt: undefined,
      },
    });
    expect(toContentLocale("fr")).toBe(ContentLocale.FR);
    expect(toContentLocale("en")).toBe(ContentLocale.EN);
    expect(toContentLocale("de")).toBeNull();
  });
});
