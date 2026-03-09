import { BillingPlan } from "@prisma/client";
import { getBillingPlanSettingsHref } from "@/features/billing/billing-plan-navigation";
import { LandingPage } from "@/features/landing/landing-page";
import { getUser } from "@/lib/auth/auth-user";

function getLandingPricingHref(plan: BillingPlan, isAuthenticated: boolean) {
  if (plan === BillingPlan.STARTER) {
    return isAuthenticated ? "/dashboard" : "/auth/signup";
  }

  const settingsHref = getBillingPlanSettingsHref(plan);

  if (isAuthenticated) {
    return settingsHref;
  }

  return `/auth/signup?callbackUrl=${encodeURIComponent(settingsHref)}`;
}

export default async function HomePage() {
  const user = await getUser();
  const isAuthenticated = Boolean(user);

  return (
    <LandingPage
      isAuthenticated={isAuthenticated}
      pricingPlanHrefs={{
        [BillingPlan.STARTER]: getLandingPricingHref(
          BillingPlan.STARTER,
          isAuthenticated,
        ),
        [BillingPlan.MENTOR_PRO]: getLandingPricingHref(
          BillingPlan.MENTOR_PRO,
          isAuthenticated,
        ),
        [BillingPlan.HIRING_SPRINT]: getLandingPricingHref(
          BillingPlan.HIRING_SPRINT,
          isAuthenticated,
        ),
      }}
    />
  );
}
