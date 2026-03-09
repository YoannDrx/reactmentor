import { BillingPlan } from "@prisma/client";
import { describe, expect, it } from "vitest";
import {
  getBillingPlanAnchor,
  getBillingPlanSettingsHref,
} from "@/features/billing/billing-plan-navigation";

describe("billing plan navigation", () => {
  it("returns stable anchors for each billing plan", () => {
    expect(getBillingPlanAnchor(BillingPlan.STARTER)).toBe("plan-starter");
    expect(getBillingPlanAnchor(BillingPlan.MENTOR_PRO)).toBe(
      "plan-mentor-pro",
    );
    expect(getBillingPlanAnchor(BillingPlan.HIRING_SPRINT)).toBe(
      "plan-hiring-sprint",
    );
  });

  it("builds settings hrefs that target the matching pricing card", () => {
    expect(getBillingPlanSettingsHref(BillingPlan.STARTER)).toBe(
      "/dashboard/settings#plan-starter",
    );
    expect(getBillingPlanSettingsHref(BillingPlan.MENTOR_PRO)).toBe(
      "/dashboard/settings#plan-mentor-pro",
    );
    expect(getBillingPlanSettingsHref(BillingPlan.HIRING_SPRINT)).toBe(
      "/dashboard/settings#plan-hiring-sprint",
    );
  });
});
