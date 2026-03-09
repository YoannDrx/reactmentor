import { BillingPlan, BillingStatus } from "@prisma/client";
import type Stripe from "stripe";
import {
  ensureUserEntitlementRecord,
  getBillingPlanDefaults,
} from "@/features/billing/user-entitlements";
import {
  premiumBillingPlanOrder,
  stripePremiumPlanCatalog,
  type PremiumBillingPlan,
} from "@/features/billing/stripe-plan-catalog";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { getServerUrl } from "@/lib/server-url";
import { getStripeServerClient } from "@/lib/stripe";

const stripePlanConfig: Record<
  PremiumBillingPlan,
  {
    priceId: string | null;
  }
> = {
  [BillingPlan.MENTOR_PRO]: {
    priceId:
      env[stripePremiumPlanCatalog[BillingPlan.MENTOR_PRO].envKey] ?? null,
  },
  [BillingPlan.HIRING_SPRINT]: {
    priceId:
      env[stripePremiumPlanCatalog[BillingPlan.HIRING_SPRINT].envKey] ?? null,
  },
};

function getStripeSuccessUrl() {
  const url = new URL("/dashboard/settings", getServerUrl());
  url.searchParams.set("billing", "success");
  url.searchParams.set("session_id", "{CHECKOUT_SESSION_ID}");
  return url.toString();
}

function getStripeCancelUrl() {
  const url = new URL("/dashboard/settings", getServerUrl());
  url.searchParams.set("billing", "canceled");
  return url.toString();
}

function getStripePortalReturnUrl() {
  const url = new URL("/dashboard/settings", getServerUrl());
  url.searchParams.set("billing", "portal-return");
  return url.toString();
}

function getStripeCustomerId(customer: Stripe.Subscription["customer"]) {
  if (!customer) {
    return null;
  }

  return typeof customer === "string" ? customer : customer.id;
}

function getStripeSubscriptionPriceId(subscription: Stripe.Subscription) {
  return subscription.items.data[0]?.price?.id ?? null;
}

function getStripeSubscriptionPeriodRange(subscription: Stripe.Subscription) {
  const periodStarts = subscription.items.data
    .map((item) => item.current_period_start)
    .filter((value): value is number => typeof value === "number");
  const periodEnds = subscription.items.data
    .map((item) => item.current_period_end)
    .filter((value): value is number => typeof value === "number");

  return {
    currentPeriodStartsAt:
      periodStarts.length > 0
        ? new Date(Math.min(...periodStarts) * 1000)
        : null,
    currentPeriodEndsAt:
      periodEnds.length > 0 ? new Date(Math.max(...periodEnds) * 1000) : null,
  };
}

export function parsePremiumBillingPlan(value: string | null | undefined) {
  return premiumBillingPlanOrder.find((plan) => plan === value) ?? null;
}

export function isStripeServerConfigured() {
  return Boolean(env.STRIPE_SECRET_KEY);
}

export function canStartStripeCheckoutForPlan(plan: PremiumBillingPlan) {
  return Boolean(env.STRIPE_SECRET_KEY && stripePlanConfig[plan].priceId);
}

export function isStripeCheckoutConfigured() {
  return premiumBillingPlanOrder.some((plan) =>
    canStartStripeCheckoutForPlan(plan),
  );
}

export function isStripeWebhookConfigured() {
  return Boolean(env.STRIPE_SECRET_KEY && env.STRIPE_WEBHOOK_SECRET);
}

export function getStripeConfiguredPlanCatalog() {
  return premiumBillingPlanOrder.map((plan) => ({
    plan,
    checkoutEnabled: canStartStripeCheckoutForPlan(plan),
    priceId: stripePlanConfig[plan].priceId,
  }));
}

export function resolveBillingPlanFromStripePriceId(
  priceId: string | null | undefined,
) {
  if (!priceId) {
    return null;
  }

  return (
    premiumBillingPlanOrder.find(
      (plan) => stripePlanConfig[plan].priceId === priceId,
    ) ?? null
  );
}

export function mapStripeSubscriptionStatus(
  status: Stripe.Subscription.Status,
) {
  switch (status) {
    case "active":
      return BillingStatus.ACTIVE;
    case "trialing":
      return BillingStatus.TRIALING;
    case "past_due":
    case "unpaid":
    case "paused":
      return BillingStatus.PAST_DUE;
    case "canceled":
      return BillingStatus.CANCELED;
    case "incomplete":
    case "incomplete_expired":
      return BillingStatus.EXPIRED;
    default:
      return BillingStatus.EXPIRED;
  }
}

export function buildEntitlementUpdateFromStripeSubscription(
  subscription: Stripe.Subscription,
) {
  const subscriptionStatus = mapStripeSubscriptionStatus(subscription.status);
  const subscriptionPeriodRange =
    getStripeSubscriptionPeriodRange(subscription);
  const pricePlan =
    resolveBillingPlanFromStripePriceId(
      getStripeSubscriptionPriceId(subscription),
    ) ?? parsePremiumBillingPlan(subscription.metadata.targetPlan);

  if (!pricePlan) {
    throw new Error(
      `Unable to resolve React Mentor plan from subscription ${subscription.id}.`,
    );
  }

  const shouldDowngradeToStarter =
    subscriptionStatus === BillingStatus.CANCELED ||
    subscriptionStatus === BillingStatus.EXPIRED;
  const effectivePlan = shouldDowngradeToStarter
    ? BillingPlan.STARTER
    : pricePlan;
  const planDefaults = getBillingPlanDefaults(effectivePlan);

  return {
    plan: effectivePlan,
    billingStatus: subscriptionStatus,
    moduleAccessLimit: planDefaults.moduleAccessLimit,
    monthlyMockLimit: planDefaults.monthlyMockLimit,
    analysisDepth: planDefaults.analysisDepth,
    playlistsEnabled: planDefaults.playlistsEnabled,
    sprintModeEnabled: planDefaults.sprintModeEnabled,
    currentPeriodStartsAt: shouldDowngradeToStarter
      ? null
      : subscriptionPeriodRange.currentPeriodStartsAt,
    currentPeriodEndsAt: shouldDowngradeToStarter
      ? null
      : subscriptionPeriodRange.currentPeriodEndsAt,
    billingCustomerId: getStripeCustomerId(subscription.customer),
    billingSubscriptionId: shouldDowngradeToStarter ? null : subscription.id,
  };
}

async function resolveSyncUserId(params: {
  subscription: Stripe.Subscription;
  explicitUserId?: string | null;
}) {
  const customerId = getStripeCustomerId(params.subscription.customer);

  if (params.explicitUserId) {
    return params.explicitUserId;
  }

  const metadataUserId =
    typeof params.subscription.metadata.userId === "string" &&
    params.subscription.metadata.userId.length > 0
      ? params.subscription.metadata.userId
      : null;

  if (metadataUserId) {
    return metadataUserId;
  }

  if (customerId) {
    const byCustomer = await prisma.userEntitlement.findUnique({
      where: {
        billingCustomerId: customerId,
      },
      select: {
        userId: true,
      },
    });

    if (byCustomer) {
      return byCustomer.userId;
    }
  }

  const bySubscription = await prisma.userEntitlement.findUnique({
    where: {
      billingSubscriptionId: params.subscription.id,
    },
    select: {
      userId: true,
    },
  });

  return bySubscription?.userId ?? null;
}

export async function getOrCreateStripeCustomerForUser(params: {
  user: {
    id: string;
    email: string;
    name: string;
  };
}) {
  const entitlement = await ensureUserEntitlementRecord(params.user.id);

  if (entitlement.billingCustomerId) {
    return entitlement.billingCustomerId;
  }

  const stripe = getStripeServerClient();
  const customer = await stripe.customers.create({
    email: params.user.email,
    name: params.user.name,
    metadata: {
      userId: params.user.id,
    },
  });

  await prisma.userEntitlement.update({
    where: {
      userId: params.user.id,
    },
    data: {
      billingCustomerId: customer.id,
    },
  });

  return customer.id;
}

export async function createStripeCheckoutSession(params: {
  user: {
    id: string;
    email: string;
    name: string;
  };
  plan: PremiumBillingPlan;
}) {
  const priceId = stripePlanConfig[params.plan].priceId;

  if (!priceId) {
    throw new Error(`Stripe price id missing for plan ${params.plan}.`);
  }

  const stripe = getStripeServerClient();
  const customerId = await getOrCreateStripeCustomerForUser({
    user: params.user,
  });
  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: customerId,
    client_reference_id: params.user.id,
    allow_promotion_codes: true,
    billing_address_collection: "auto",
    line_items: [
      {
        price: priceId,
        quantity: 1,
      },
    ],
    success_url: getStripeSuccessUrl(),
    cancel_url: getStripeCancelUrl(),
    metadata: {
      userId: params.user.id,
      targetPlan: params.plan,
    },
    subscription_data: {
      metadata: {
        userId: params.user.id,
        targetPlan: params.plan,
      },
    },
  });

  if (!session.url) {
    throw new Error("Stripe checkout session did not return a redirect URL.");
  }

  return session.url;
}

export async function createStripeBillingPortalSession(params: {
  userId: string;
}) {
  const entitlement = await ensureUserEntitlementRecord(params.userId);

  if (!entitlement.billingCustomerId) {
    return null;
  }

  const stripe = getStripeServerClient();
  const session = await stripe.billingPortal.sessions.create({
    customer: entitlement.billingCustomerId,
    return_url: getStripePortalReturnUrl(),
  });

  return session.url;
}

export async function syncUserEntitlementFromStripeSubscription(params: {
  subscription: Stripe.Subscription;
  userId?: string | null;
}) {
  const userId = await resolveSyncUserId({
    subscription: params.subscription,
    explicitUserId: params.userId,
  });

  if (!userId) {
    return null;
  }

  const updateData = buildEntitlementUpdateFromStripeSubscription(
    params.subscription,
  );

  return prisma.userEntitlement.upsert({
    where: {
      userId,
    },
    update: updateData,
    create: {
      userId,
      ...updateData,
    },
  });
}

export async function syncUserEntitlementFromCheckoutSession(params: {
  checkoutSessionId: string;
  userId?: string | null;
}) {
  const stripe = getStripeServerClient();
  const checkoutSession = await stripe.checkout.sessions.retrieve(
    params.checkoutSessionId,
    {
      expand: ["subscription"],
    },
  );

  if (
    checkoutSession.mode !== "subscription" ||
    !checkoutSession.subscription
  ) {
    return null;
  }

  const subscription =
    typeof checkoutSession.subscription === "string"
      ? await stripe.subscriptions.retrieve(checkoutSession.subscription)
      : checkoutSession.subscription;
  const explicitUserId =
    params.userId ??
    (typeof checkoutSession.metadata?.userId === "string"
      ? checkoutSession.metadata.userId
      : null);

  return syncUserEntitlementFromStripeSubscription({
    subscription,
    userId: explicitUserId,
  });
}
