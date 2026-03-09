import { BillingPlan } from "@prisma/client";

export function getBillingPlanAnchor(plan: BillingPlan) {
  switch (plan) {
    case BillingPlan.STARTER:
      return "plan-starter";
    case BillingPlan.MENTOR_PRO:
      return "plan-mentor-pro";
    case BillingPlan.HIRING_SPRINT:
      return "plan-hiring-sprint";
    default:
      return "plan-starter";
  }
}

export function getBillingPlanSettingsHref(plan: BillingPlan) {
  return `/dashboard/settings#${getBillingPlanAnchor(plan)}`;
}
