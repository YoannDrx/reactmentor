import {
  BillingPlan,
  ContentLocale,
  OperationalEventLevel,
  Prisma,
  ProductAnalyticsEventName,
  SessionMode,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

export type ProductAnalyticsEventInput = {
  userId?: string | null;
  name: ProductAnalyticsEventName;
  source?: string | null;
  sessionMode?: SessionMode | null;
  billingPlan?: BillingPlan | null;
  locale?: ContentLocale | null;
  trainingSessionId?: string | null;
  questionId?: string | null;
  moduleSlug?: string | null;
  metadata?: Prisma.InputJsonValue;
  occurredAt?: Date;
};

export type OperationalEventInput = {
  userId?: string | null;
  source: string;
  eventType: string;
  level?: OperationalEventLevel;
  status?: string | null;
  message?: string | null;
  metadata?: Prisma.InputJsonValue;
  occurredAt?: Date;
};

export function toContentLocale(
  value: string | null | undefined,
): ContentLocale | null {
  if (value === "fr") {
    return ContentLocale.FR;
  }

  if (value === "en") {
    return ContentLocale.EN;
  }

  return null;
}

export function getErrorMessage(
  error: unknown,
  fallback = "Unknown error.",
): string {
  return error instanceof Error ? error.message : fallback;
}

export function getErrorMetadata(
  error: unknown,
): Prisma.InputJsonValue | undefined {
  if (!(error instanceof Error)) {
    return undefined;
  }

  return {
    name: error.name,
    message: error.message,
    stack:
      typeof error.stack === "string"
        ? error.stack.split("\n").slice(0, 8).join("\n")
        : null,
  } satisfies Prisma.InputJsonValue;
}

export async function captureProductAnalyticsEvent(
  input: ProductAnalyticsEventInput,
) {
  try {
    await prisma.productAnalyticsEvent.create({
      data: {
        userId: input.userId ?? null,
        name: input.name,
        source: input.source ?? null,
        sessionMode: input.sessionMode ?? null,
        billingPlan: input.billingPlan ?? null,
        locale: input.locale ?? null,
        trainingSessionId: input.trainingSessionId ?? null,
        questionId: input.questionId ?? null,
        moduleSlug: input.moduleSlug ?? null,
        metadata: input.metadata,
        occurredAt: input.occurredAt,
      },
    });
  } catch (error) {
    console.error("[telemetry] failed to persist product analytics event", error);
  }
}

export async function ensureProductAnalyticsEvent(
  input: ProductAnalyticsEventInput & {
    userId: string;
  },
) {
  try {
    const existingEvent = await prisma.productAnalyticsEvent.findFirst({
      where: {
        userId: input.userId,
        name: input.name,
      },
      select: {
        id: true,
      },
    });

    if (existingEvent) {
      return existingEvent;
    }

    return await prisma.productAnalyticsEvent.create({
      data: {
        userId: input.userId,
        name: input.name,
        source: input.source ?? null,
        sessionMode: input.sessionMode ?? null,
        billingPlan: input.billingPlan ?? null,
        locale: input.locale ?? null,
        trainingSessionId: input.trainingSessionId ?? null,
        questionId: input.questionId ?? null,
        moduleSlug: input.moduleSlug ?? null,
        metadata: input.metadata,
        occurredAt: input.occurredAt,
      },
      select: {
        id: true,
      },
    });
  } catch (error) {
    console.error("[telemetry] failed to ensure product analytics event", error);
    return null;
  }
}

export async function ensureAccountCreatedAnalyticsEvent(params: {
  userId: string;
  source?: string | null;
  locale?: ContentLocale | null;
}) {
  return ensureProductAnalyticsEvent({
    userId: params.userId,
    name: ProductAnalyticsEventName.ACCOUNT_CREATED,
    source: params.source ?? "auth.signup",
    locale: params.locale ?? null,
  });
}

export async function captureOperationalEvent(input: OperationalEventInput) {
  try {
    await prisma.operationalEvent.create({
      data: {
        userId: input.userId ?? null,
        source: input.source,
        eventType: input.eventType,
        level: input.level ?? OperationalEventLevel.INFO,
        status: input.status ?? null,
        message: input.message ?? null,
        metadata: input.metadata,
        occurredAt: input.occurredAt,
      },
    });
  } catch (error) {
    console.error("[telemetry] failed to persist operational event", error);
  }
}
