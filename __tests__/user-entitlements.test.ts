import {
  AnalysisDepth,
  BillingPlan,
  BillingStatus,
} from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  userEntitlementFindUniqueMock,
  userEntitlementCreateMock,
  trainingSessionCountMock,
  learningModuleFindManyMock,
  questionFindManyMock,
} = vi.hoisted(() => ({
  userEntitlementFindUniqueMock: vi.fn(),
  userEntitlementCreateMock: vi.fn(),
  trainingSessionCountMock: vi.fn(),
  learningModuleFindManyMock: vi.fn(),
  questionFindManyMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    userEntitlement: {
      findUnique: userEntitlementFindUniqueMock,
      create: userEntitlementCreateMock,
    },
    trainingSession: {
      count: trainingSessionCountMock,
    },
    learningModule: {
      findMany: learningModuleFindManyMock,
    },
    question: {
      findMany: questionFindManyMock,
    },
  },
}));

import {
  canAccessModuleSlug,
  canAccessQuestionIds,
  getUserEntitlementSnapshot,
} from "@/features/billing/user-entitlements";

describe("user entitlements", () => {
  beforeEach(() => {
    userEntitlementFindUniqueMock.mockReset();
    userEntitlementCreateMock.mockReset();
    trainingSessionCountMock.mockReset();
    learningModuleFindManyMock.mockReset();
    questionFindManyMock.mockReset();
  });

  it("creates a default starter entitlement and computes remaining mocks", async () => {
    userEntitlementFindUniqueMock.mockResolvedValueOnce(null);
    userEntitlementCreateMock.mockResolvedValue({
      id: "entitlement_1",
      userId: "user_starter",
      plan: BillingPlan.STARTER,
      billingStatus: BillingStatus.FREE,
      moduleAccessLimit: 2,
      monthlyMockLimit: 1,
      analysisDepth: AnalysisDepth.CORE,
      playlistsEnabled: false,
      sprintModeEnabled: false,
      currentPeriodStartsAt: null,
      currentPeriodEndsAt: null,
      billingCustomerId: null,
      billingSubscriptionId: null,
      createdAt: new Date("2026-03-08T10:00:00.000Z"),
      updatedAt: new Date("2026-03-08T10:00:00.000Z"),
    });
    trainingSessionCountMock.mockResolvedValue(0);

    const snapshot = await getUserEntitlementSnapshot("user_starter");

    expect(userEntitlementCreateMock).toHaveBeenCalledWith({
      data: {
        userId: "user_starter",
        plan: BillingPlan.STARTER,
        billingStatus: BillingStatus.FREE,
        moduleAccessLimit: 2,
        monthlyMockLimit: 1,
        analysisDepth: AnalysisDepth.CORE,
        playlistsEnabled: false,
        sprintModeEnabled: false,
      },
    });
    expect(snapshot).toEqual(
      expect.objectContaining({
        plan: BillingPlan.STARTER,
        billingStatus: BillingStatus.FREE,
        moduleAccessLimit: 2,
        monthlyMockLimit: 1,
        canStartMockInterview: true,
        canUsePlaylists: false,
        mocksUsedThisPeriod: 0,
        mocksRemainingThisPeriod: 1,
        hasAdvancedAnalytics: false,
      }),
    );
  });

  it("marks the mock quota as exhausted once the starter limit is reached", async () => {
    userEntitlementFindUniqueMock.mockResolvedValue({
      id: "entitlement_3",
      userId: "user_quota_exhausted",
      plan: BillingPlan.STARTER,
      billingStatus: BillingStatus.FREE,
      moduleAccessLimit: 2,
      monthlyMockLimit: 1,
      analysisDepth: AnalysisDepth.CORE,
      playlistsEnabled: false,
      sprintModeEnabled: false,
      currentPeriodStartsAt: null,
      currentPeriodEndsAt: null,
      billingCustomerId: null,
      billingSubscriptionId: null,
      createdAt: new Date("2026-03-08T10:00:00.000Z"),
      updatedAt: new Date("2026-03-08T10:00:00.000Z"),
    });
    trainingSessionCountMock.mockResolvedValue(1);

    const snapshot = await getUserEntitlementSnapshot("user_quota_exhausted");

    expect(snapshot.canStartMockInterview).toBe(false);
    expect(snapshot.mocksUsedThisPeriod).toBe(1);
    expect(snapshot.mocksRemainingThisPeriod).toBe(0);
  });

  it("allows only the first published modules for starter access", async () => {
    userEntitlementFindUniqueMock.mockResolvedValue({
      id: "entitlement_4",
      userId: "user_module_access",
      plan: BillingPlan.STARTER,
      billingStatus: BillingStatus.FREE,
      moduleAccessLimit: 2,
      monthlyMockLimit: 1,
      analysisDepth: AnalysisDepth.CORE,
      playlistsEnabled: false,
      sprintModeEnabled: false,
      currentPeriodStartsAt: null,
      currentPeriodEndsAt: null,
      billingCustomerId: null,
      billingSubscriptionId: null,
      createdAt: new Date("2026-03-08T10:00:00.000Z"),
      updatedAt: new Date("2026-03-08T10:00:00.000Z"),
    });
    trainingSessionCountMock.mockResolvedValue(0);
    learningModuleFindManyMock.mockResolvedValue([
      {
        slug: "react-rendering-systems",
      },
      {
        slug: "effects-without-superstition",
      },
    ]);

    await expect(
      canAccessModuleSlug({
        userId: "user_module_access",
        moduleSlug: "react-rendering-systems",
      }),
    ).resolves.toBe(true);
    await expect(
      canAccessModuleSlug({
        userId: "user_module_access",
        moduleSlug: "typescript-for-components",
      }),
    ).resolves.toBe(false);
  });

  it("blocks question access when one question belongs to a locked module", async () => {
    userEntitlementFindUniqueMock.mockResolvedValue({
      id: "entitlement_5",
      userId: "user_locked",
      plan: BillingPlan.STARTER,
      billingStatus: BillingStatus.FREE,
      moduleAccessLimit: 2,
      monthlyMockLimit: 1,
      analysisDepth: AnalysisDepth.CORE,
      playlistsEnabled: false,
      sprintModeEnabled: false,
      currentPeriodStartsAt: null,
      currentPeriodEndsAt: null,
      billingCustomerId: null,
      billingSubscriptionId: null,
      createdAt: new Date("2026-03-08T10:00:00.000Z"),
      updatedAt: new Date("2026-03-08T10:00:00.000Z"),
    });
    trainingSessionCountMock.mockResolvedValue(0);
    learningModuleFindManyMock.mockResolvedValue([
      {
        slug: "react-rendering-systems",
      },
      {
        slug: "effects-without-superstition",
      },
    ]);
    questionFindManyMock.mockResolvedValue([
      {
        id: "question_1",
        module: {
          slug: "react-rendering-systems",
        },
      },
      {
        id: "question_2",
        module: {
          slug: "typescript-for-components",
        },
      },
    ]);

    await expect(
      canAccessQuestionIds({
        userId: "user_locked",
        questionIds: ["question_1", "question_2"],
      }),
    ).resolves.toBe(false);
  });
});
