"use server";

import { ProductAnalyticsEventName } from "@prisma/client";
import { redirect } from "next/navigation";
import { captureProductAnalyticsEvent } from "@/features/telemetry/telemetry";
import { getUser } from "@/lib/auth/auth-user";
import { revalidateBillingEntitlementPaths } from "./billing-revalidation";
import {
  canStartStripeCheckoutForPlan,
  createStripeBillingPortalSession,
  createStripeCheckoutSession,
  isStripeServerConfigured,
  parsePremiumBillingPlan,
} from "./stripe-billing";

export async function startBillingCheckoutAction(formData: FormData) {
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin?callbackUrl=%2Fdashboard%2Fsettings");
  }

  const plan = parsePremiumBillingPlan(String(formData.get("plan") ?? ""));

  if (!plan) {
    redirect("/dashboard/settings?billing=invalid-plan");
  }

  if (!canStartStripeCheckoutForPlan(plan)) {
    redirect("/dashboard/settings?billing=not-configured");
  }

  await captureProductAnalyticsEvent({
    userId: user.id,
    name: ProductAnalyticsEventName.UPGRADE_CLICKED,
    source: "billing.action.checkout",
    billingPlan: plan,
  });

  const checkoutUrl = await createStripeCheckoutSession({
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
    },
    plan,
  });

  revalidateBillingEntitlementPaths();
  redirect(checkoutUrl);
}

export async function openBillingPortalAction() {
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin?callbackUrl=%2Fdashboard%2Fsettings");
  }

  if (!isStripeServerConfigured()) {
    redirect("/dashboard/settings?billing=not-configured");
  }

  const portalUrl = await createStripeBillingPortalSession({
    userId: user.id,
  });

  if (!portalUrl) {
    redirect("/dashboard/settings?billing=portal-unavailable");
  }

  revalidateBillingEntitlementPaths();
  redirect(portalUrl);
}
