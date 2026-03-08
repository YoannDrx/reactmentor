import {
  AnalysisDepth,
  BillingPlan,
  BillingStatus,
  ContentStatus,
  SessionMode,
} from "@prisma/client";
import { prisma } from "@/lib/prisma";

const planDefaults = {
  [BillingPlan.STARTER]: {
    moduleAccessLimit: 2,
    monthlyMockLimit: 1,
    analysisDepth: AnalysisDepth.CORE,
    playlistsEnabled: false,
    sprintModeEnabled: false,
  },
  [BillingPlan.MENTOR_PRO]: {
    moduleAccessLimit: null,
    monthlyMockLimit: null,
    analysisDepth: AnalysisDepth.ADVANCED,
    playlistsEnabled: true,
    sprintModeEnabled: false,
  },
  [BillingPlan.HIRING_SPRINT]: {
    moduleAccessLimit: null,
    monthlyMockLimit: null,
    analysisDepth: AnalysisDepth.ADVANCED,
    playlistsEnabled: true,
    sprintModeEnabled: true,
  },
} as const;

export type UserEntitlementSnapshot = {
  id: string;
  userId: string;
  plan: BillingPlan;
  billingStatus: BillingStatus;
  analysisDepth: AnalysisDepth;
  playlistsEnabled: boolean;
  sprintModeEnabled: boolean;
  moduleAccessLimit: number | null;
  monthlyMockLimit: number | null;
  currentPeriodStartsAt: Date | null;
  currentPeriodEndsAt: Date | null;
  billingCustomerId: string | null;
  billingSubscriptionId: string | null;
  mocksUsedThisPeriod: number;
  mocksRemainingThisPeriod: number | null;
  canStartMockInterview: boolean;
  canUsePlaylists: boolean;
  hasAdvancedAnalytics: boolean;
  hasUnlimitedModules: boolean;
  hasUnlimitedMocks: boolean;
  createdAt: Date;
  updatedAt: Date;
};

export function getDefaultEntitlementInput(
  plan: BillingPlan = BillingPlan.STARTER,
) {
  const defaults = planDefaults[plan];

  return {
    plan,
    billingStatus:
      plan === BillingPlan.STARTER ? BillingStatus.FREE : BillingStatus.ACTIVE,
    moduleAccessLimit: defaults.moduleAccessLimit,
    monthlyMockLimit: defaults.monthlyMockLimit,
    analysisDepth: defaults.analysisDepth,
    playlistsEnabled: defaults.playlistsEnabled,
    sprintModeEnabled: defaults.sprintModeEnabled,
  };
}

function startOfCurrentMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function endOfCurrentMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 1);
}

function getEntitlementWindow(
  entitlement: {
    currentPeriodStartsAt: Date | null;
    currentPeriodEndsAt: Date | null;
  },
  now: Date,
) {
  return {
    start: entitlement.currentPeriodStartsAt ?? startOfCurrentMonth(now),
    end: entitlement.currentPeriodEndsAt ?? endOfCurrentMonth(now),
  };
}

function mapEntitlementSnapshot(
  entitlement: {
    id: string;
    userId: string;
    plan: BillingPlan;
    billingStatus: BillingStatus;
    moduleAccessLimit: number | null;
    monthlyMockLimit: number | null;
    analysisDepth: AnalysisDepth;
    playlistsEnabled: boolean;
    sprintModeEnabled: boolean;
    currentPeriodStartsAt: Date | null;
    currentPeriodEndsAt: Date | null;
    billingCustomerId: string | null;
    billingSubscriptionId: string | null;
    createdAt: Date;
    updatedAt: Date;
  },
  mocksUsedThisPeriod: number,
) {
  const mocksRemainingThisPeriod =
    entitlement.monthlyMockLimit === null
      ? null
      : Math.max(0, entitlement.monthlyMockLimit - mocksUsedThisPeriod);
  const canStartMockInterview =
    entitlement.monthlyMockLimit === null
      ? true
      : (mocksRemainingThisPeriod ?? 0) > 0;

  return {
    ...entitlement,
    mocksUsedThisPeriod,
    mocksRemainingThisPeriod,
    canStartMockInterview,
    canUsePlaylists: entitlement.playlistsEnabled,
    hasAdvancedAnalytics: entitlement.analysisDepth === AnalysisDepth.ADVANCED,
    hasUnlimitedModules: entitlement.moduleAccessLimit === null,
    hasUnlimitedMocks: entitlement.monthlyMockLimit === null,
  } satisfies UserEntitlementSnapshot;
}

export async function ensureUserEntitlementRecord(userId: string) {
  const existingEntitlement = await prisma.userEntitlement.findUnique({
    where: {
      userId,
    },
  });

  if (existingEntitlement) {
    return existingEntitlement;
  }

  try {
    return await prisma.userEntitlement.create({
      data: {
        userId,
        ...getDefaultEntitlementInput(),
      },
    });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      const concurrentEntitlement = await prisma.userEntitlement.findUnique({
        where: {
          userId,
        },
      });

      if (concurrentEntitlement) {
        return concurrentEntitlement;
      }
    }

    throw error;
  }
}

export async function getUserEntitlementSnapshot(userId: string) {
  const now = new Date();
  const entitlement = await ensureUserEntitlementRecord(userId);
  const window = getEntitlementWindow(entitlement, now);
  const mocksUsedThisPeriod = await prisma.trainingSession.count({
    where: {
      userId,
      mode: SessionMode.MOCK_INTERVIEW,
      startedAt: {
        gte: window.start,
        lt: window.end,
      },
    },
  });

  return mapEntitlementSnapshot(entitlement, mocksUsedThisPeriod);
}

export async function getAccessibleModuleSlugs(params: {
  userId: string;
}) {
  const entitlement = await getUserEntitlementSnapshot(params.userId);

  if (entitlement.moduleAccessLimit === null) {
    return null;
  }

  const modules = await prisma.learningModule.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
    },
    orderBy: {
      order: "asc",
    },
    select: {
      slug: true,
    },
    take: entitlement.moduleAccessLimit,
  });

  return modules.map((module) => module.slug);
}

export async function canAccessModuleSlug(params: {
  userId: string;
  moduleSlug: string;
}) {
  const accessibleModuleSlugs = await getAccessibleModuleSlugs({
    userId: params.userId,
  });

  return accessibleModuleSlugs === null
    ? true
    : accessibleModuleSlugs.includes(params.moduleSlug);
}

export async function canAccessQuestionIds(params: {
  userId: string;
  questionIds: string[];
}) {
  const accessibleModuleSlugs = await getAccessibleModuleSlugs({
    userId: params.userId,
  });

  if (accessibleModuleSlugs === null || params.questionIds.length === 0) {
    return true;
  }

  const questions = await prisma.question.findMany({
    where: {
      id: {
        in: params.questionIds,
      },
    },
    select: {
      id: true,
      module: {
        select: {
          slug: true,
        },
      },
    },
  });

  return (
    questions.length === params.questionIds.length &&
    questions.every((question) => accessibleModuleSlugs.includes(question.module.slug))
  );
}

export function getBillingPlanDefaults(plan: BillingPlan) {
  return planDefaults[plan];
}

export { AnalysisDepth, BillingPlan, BillingStatus };
