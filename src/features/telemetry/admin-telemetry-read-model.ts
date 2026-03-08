import {
  BillingPlan,
  OperationalEventLevel,
  ProductAnalyticsEventName,
  SessionMode,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

const ANALYTICS_WINDOW_DAYS = 30;
const OPERATIONAL_WINDOW_DAYS = 14;
const RECENT_EVENT_LIMIT = 8;
const SOURCE_LIMIT = 6;

export type TelemetryFunnelStepKey =
  | "signup"
  | "onboarding"
  | "firstPractice"
  | "repeatPractice"
  | "firstMock";

type ProductAnalyticsEventRow = {
  id: string;
  userId: string | null;
  name: ProductAnalyticsEventName;
  source: string | null;
  sessionMode: SessionMode | null;
  billingPlan: BillingPlan | null;
  moduleSlug: string | null;
  questionId: string | null;
  occurredAt: Date;
};

type OperationalEventRow = {
  id: string;
  userId: string | null;
  source: string;
  eventType: string;
  level: OperationalEventLevel;
  status: string | null;
  message: string | null;
  occurredAt: Date;
};

const productAnalyticsEventNames = Object.values(ProductAnalyticsEventName);

function subtractDays(now: Date, days: number) {
  return new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
}

function sortByOccurredAtDesc<T extends { occurredAt: Date }>(rows: T[]) {
  return [...rows].sort(
    (left, right) => right.occurredAt.getTime() - left.occurredAt.getTime(),
  );
}

function countDistinctUsers<T extends { userId: string | null }>(rows: T[]) {
  return new Set(
    rows
      .map((row) => row.userId)
      .filter((userId): userId is string => typeof userId === "string"),
  ).size;
}

function countDistinctUsersMatching<T extends { userId: string | null }>(
  rows: T[],
  predicate: (row: T) => boolean,
) {
  return countDistinctUsers(rows.filter(predicate));
}

function buildAnalyticsCounts(rows: ProductAnalyticsEventRow[]) {
  const counts = Object.fromEntries(
    productAnalyticsEventNames.map((name) => [name, 0]),
  ) as Record<ProductAnalyticsEventName, number>;

  for (const row of rows) {
    counts[row.name] += 1;
  }

  return counts;
}

function calculateConversionRate(current: number, previous: number) {
  if (previous === 0) {
    return null;
  }

  return Math.round((current / previous) * 100);
}

function countPracticeStartsByUser(rows: ProductAnalyticsEventRow[]) {
  const counts = new Map<string, number>();

  for (const row of rows) {
    if (
      row.userId &&
      row.name === ProductAnalyticsEventName.SESSION_STARTED &&
      row.sessionMode === SessionMode.PRACTICE
    ) {
      counts.set(row.userId, (counts.get(row.userId) ?? 0) + 1);
    }
  }

  return counts;
}

function buildOperationalSourceRows(rows: OperationalEventRow[]) {
  const sourceMap = new Map<
    string,
    {
      source: string;
      total: number;
      errors: number;
      warnings: number;
      lastEventAt: Date;
    }
  >();

  for (const row of rows) {
    const current =
      sourceMap.get(row.source) ??
      ({
        source: row.source,
        total: 0,
        errors: 0,
        warnings: 0,
        lastEventAt: row.occurredAt,
      } as const);

    sourceMap.set(row.source, {
      source: row.source,
      total: current.total + 1,
      errors:
        current.errors + (row.level === OperationalEventLevel.ERROR ? 1 : 0),
      warnings:
        current.warnings + (row.level === OperationalEventLevel.WARN ? 1 : 0),
      lastEventAt:
        current.lastEventAt > row.occurredAt ? current.lastEventAt : row.occurredAt,
    });
  }

  return [...sourceMap.values()]
    .sort((left, right) => {
      if (right.errors !== left.errors) {
        return right.errors - left.errors;
      }

      if (right.warnings !== left.warnings) {
        return right.warnings - left.warnings;
      }

      return right.lastEventAt.getTime() - left.lastEventAt.getTime();
    })
    .slice(0, SOURCE_LIMIT);
}

export function buildAdminTelemetryReadModel(params: {
  analyticsRows: ProductAnalyticsEventRow[];
  operationalRows: OperationalEventRow[];
  now?: Date;
}) {
  const now = params.now ?? new Date();
  const analyticsRows = sortByOccurredAtDesc(params.analyticsRows);
  const operationalRows = sortByOccurredAtDesc(params.operationalRows);
  const analyticsCounts = buildAnalyticsCounts(analyticsRows);
  const practiceStartCountsByUser = countPracticeStartsByUser(analyticsRows);
  const repeatPracticeUsers = [...practiceStartCountsByUser.values()].filter(
    (count) => count >= 2,
  ).length;
  const signupUsers = countDistinctUsersMatching(
    analyticsRows,
    (row) => row.name === ProductAnalyticsEventName.ACCOUNT_CREATED,
  );
  const onboardingUsers = countDistinctUsersMatching(
    analyticsRows,
    (row) => row.name === ProductAnalyticsEventName.ONBOARDING_COMPLETED,
  );
  const firstPracticeUsers = countDistinctUsersMatching(
    analyticsRows,
    (row) =>
      row.name === ProductAnalyticsEventName.SESSION_STARTED &&
      row.sessionMode === SessionMode.PRACTICE,
  );
  const firstMockUsers = countDistinctUsersMatching(
    analyticsRows,
    (row) =>
      (row.name === ProductAnalyticsEventName.SESSION_STARTED &&
        row.sessionMode === SessionMode.MOCK_INTERVIEW) ||
      row.name === ProductAnalyticsEventName.MOCK_COMPLETED,
  );

  return {
    generatedAt: now,
    analytics: {
      windowDays: ANALYTICS_WINDOW_DAYS,
      totalEvents: analyticsRows.length,
      activeUsers: countDistinctUsers(analyticsRows),
      counts: analyticsCounts,
      funnel: [
        {
          key: "signup" as TelemetryFunnelStepKey,
          users: signupUsers,
          conversionFromPrevious: null,
        },
        {
          key: "onboarding" as TelemetryFunnelStepKey,
          users: onboardingUsers,
          conversionFromPrevious: calculateConversionRate(
            onboardingUsers,
            signupUsers,
          ),
        },
        {
          key: "firstPractice" as TelemetryFunnelStepKey,
          users: firstPracticeUsers,
          conversionFromPrevious: calculateConversionRate(
            firstPracticeUsers,
            onboardingUsers,
          ),
        },
        {
          key: "repeatPractice" as TelemetryFunnelStepKey,
          users: repeatPracticeUsers,
          conversionFromPrevious: calculateConversionRate(
            repeatPracticeUsers,
            firstPracticeUsers,
          ),
        },
        {
          key: "firstMock" as TelemetryFunnelStepKey,
          users: firstMockUsers,
          conversionFromPrevious: calculateConversionRate(
            firstMockUsers,
            firstPracticeUsers,
          ),
        },
      ],
      recentEvents: analyticsRows.slice(0, RECENT_EVENT_LIMIT),
    },
    operational: {
      windowDays: OPERATIONAL_WINDOW_DAYS,
      totalEvents: operationalRows.length,
      infoCount: operationalRows.filter(
        (row) => row.level === OperationalEventLevel.INFO,
      ).length,
      warningCount: operationalRows.filter(
        (row) => row.level === OperationalEventLevel.WARN,
      ).length,
      errorCount: operationalRows.filter(
        (row) => row.level === OperationalEventLevel.ERROR,
      ).length,
      billingWebhookEvents: operationalRows.filter(
        (row) => row.source === "billing.webhook",
      ).length,
      contentImportEvents: operationalRows.filter(
        (row) => row.source === "content.import",
      ).length,
      sourceRows: buildOperationalSourceRows(operationalRows),
      recentEvents: operationalRows.slice(0, RECENT_EVENT_LIMIT),
    },
  };
}

export async function getAdminTelemetryReadModel() {
  const now = new Date();
  const analyticsWindowStart = subtractDays(now, ANALYTICS_WINDOW_DAYS);
  const operationalWindowStart = subtractDays(now, OPERATIONAL_WINDOW_DAYS);
  const [analyticsRows, operationalRows] = await Promise.all([
    prisma.productAnalyticsEvent.findMany({
      where: {
        occurredAt: {
          gte: analyticsWindowStart,
        },
      },
      orderBy: {
        occurredAt: "desc",
      },
      select: {
        id: true,
        userId: true,
        name: true,
        source: true,
        sessionMode: true,
        billingPlan: true,
        moduleSlug: true,
        questionId: true,
        occurredAt: true,
      },
    }),
    prisma.operationalEvent.findMany({
      where: {
        occurredAt: {
          gte: operationalWindowStart,
        },
      },
      orderBy: {
        occurredAt: "desc",
      },
      select: {
        id: true,
        userId: true,
        source: true,
        eventType: true,
        level: true,
        status: true,
        message: true,
        occurredAt: true,
      },
    }),
  ]);

  return buildAdminTelemetryReadModel({
    analyticsRows,
    operationalRows,
    now,
  });
}
