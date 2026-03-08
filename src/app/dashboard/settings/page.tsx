import { BillingPlan, QuestionLevel } from "@prisma/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  openBillingPortalAction,
  startBillingCheckoutAction,
} from "@/features/billing/billing.action";
import {
  getStripeConfiguredPlanCatalog,
  isStripeServerConfigured,
  syncUserEntitlementFromCheckoutSession,
} from "@/features/billing/stripe-billing";
import { getUserEntitlementSnapshot } from "@/features/billing/user-entitlements";
import { SettingsForm } from "@/features/settings/settings-form";
import { getUserPreferences } from "@/features/settings/user-preferences";
import { getI18n } from "@/i18n/server";
import { getRequiredUser } from "@/lib/auth/auth-user";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function getSingleSearchParamValue(
  value: string | string[] | undefined,
) {
  return Array.isArray(value) ? value[0] : value;
}

export default async function DashboardSettingsPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const user = await getRequiredUser("/dashboard/settings");
  const resolvedSearchParams = await searchParams;
  const billingNoticeKey = getSingleSearchParamValue(
    resolvedSearchParams.billing,
  );
  const checkoutSessionId = getSingleSearchParamValue(
    resolvedSearchParams.session_id,
  );

  if (
    billingNoticeKey === "success" &&
    checkoutSessionId &&
    isStripeServerConfigured()
  ) {
    try {
      await syncUserEntitlementFromCheckoutSession({
        checkoutSessionId,
        userId: user.id,
      });
    } catch {
      // Let the page render and keep the Stripe sync eventual via webhook.
    }
  }

  const { locale, messages, t } = await getI18n();
  const [preference, entitlement] = await Promise.all([
    getUserPreferences(user.id),
    getUserEntitlementSnapshot(user.id),
  ]);
  const entitlements = messages.dashboard.entitlements;
  const landingPricing = messages.landing.pricing;
  const stripePlanCatalog = getStripeConfiguredPlanCatalog();
  const pricingPlans = [
    {
      plan: BillingPlan.STARTER,
      ...landingPricing.plans[0],
      checkoutEnabled: false,
    },
    {
      plan: BillingPlan.MENTOR_PRO,
      ...landingPricing.plans[1],
      checkoutEnabled: stripePlanCatalog[0]?.checkoutEnabled ?? false,
    },
    {
      plan: BillingPlan.HIRING_SPRINT,
      ...landingPricing.plans[2],
      checkoutEnabled: stripePlanCatalog[1]?.checkoutEnabled ?? false,
    },
  ];
  const nextResetFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  });
  const nextResetDate =
    entitlement.currentPeriodEndsAt ??
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
  const moduleAccessValue = entitlement.hasUnlimitedModules
    ? entitlements.moduleAccessValues.unlimited
    : t("dashboard.entitlements.moduleAccessValues.limited", {
        count: entitlement.moduleAccessLimit ?? 0,
      });
  const mockQuotaValue = entitlement.hasUnlimitedMocks
    ? entitlements.mockQuotaValues.unlimited
    : entitlement.canStartMockInterview
      ? t("dashboard.entitlements.mockQuotaValues.available", {
          count: entitlement.mocksRemainingThisPeriod ?? 0,
        })
      : entitlements.mockQuotaValues.exhausted;
  const featureAvailability = [
    {
      label: entitlements.featureNames.playlists,
      enabled: entitlement.canUsePlaylists,
    },
    {
      label: entitlements.featureNames.advancedAnalytics,
      enabled: entitlement.hasAdvancedAnalytics,
    },
    {
      label: entitlements.featureNames.sprintMode,
      enabled: entitlement.sprintModeEnabled,
    },
  ];
  const billingNoticeMessage = (() => {
    switch (billingNoticeKey) {
      case "success":
        return entitlements.notices.success;
      case "canceled":
        return entitlements.notices.canceled;
      case "portal-return":
        return entitlements.notices.portalReturn;
      case "not-configured":
        return entitlements.notices.notConfigured;
      case "invalid-plan":
        return entitlements.notices.invalidPlan;
      case "portal-unavailable":
        return entitlements.notices.portalUnavailable;
      default:
        return null;
    }
  })();
  const billingNoticeTone =
    billingNoticeKey === "success" || billingNoticeKey === "portal-return"
      ? "cyan"
      : "amber";
  const hasBillingPortal = Boolean(
    entitlement.billingCustomerId && isStripeServerConfigured(),
  );

  const levelLabels: Record<QuestionLevel, string> = {
    [QuestionLevel.JUNIOR]: messages.common.levels.junior,
    [QuestionLevel.MID]: messages.common.levels.mid,
    [QuestionLevel.SENIOR]: messages.common.levels.senior,
  };

  return (
    <div className="grid gap-6">
      <SettingsForm
        preference={preference}
        messages={messages.dashboard.settings}
        trackLabels={messages.dashboard.trackLabels}
        levelLabels={levelLabels}
      />

      <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <Card>
          <CardHeader>
            <Badge className="w-fit border-slate-200 bg-slate-100 text-slate-700">
              {entitlements.summaryBadge}
            </Badge>
            <CardTitle>{entitlements.summaryTitle}</CardTitle>
            <CardDescription>{entitlements.summaryDescription}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                {entitlements.currentPlanLabel}
              </div>
              <div className="mt-2 font-semibold text-slate-950">
                {entitlements.planLabels[entitlement.plan]}
              </div>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                {entitlements.billingStatusLabel}
              </div>
              <div className="mt-2 font-semibold text-slate-950">
                {entitlements.statusLabels[entitlement.billingStatus]}
              </div>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                {entitlements.moduleAccessLabel}
              </div>
              <div className="mt-2 font-semibold text-slate-950">
                {moduleAccessValue}
              </div>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                {entitlements.mockQuotaLabel}
              </div>
              <div className="mt-2 font-semibold text-slate-950">
                {mockQuotaValue}
              </div>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                {entitlements.analyticsDepthLabel}
              </div>
              <div className="mt-2 font-semibold text-slate-950">
                {
                  entitlements.analysisDepthLabels[
                    entitlement.analysisDepth
                  ]
                }
              </div>
            </div>
            <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                {entitlements.nextResetLabel}
              </div>
              <div className="mt-2 font-semibold text-slate-950">
                {nextResetFormatter.format(nextResetDate)}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-950 text-white">
          <CardHeader>
            <CardTitle className="text-white">
              {entitlements.featureAvailabilityTitle}
            </CardTitle>
            <CardDescription className="text-slate-300">
              {entitlements.featureAvailabilityDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {featureAvailability.map((feature) => (
              <div
                key={feature.label}
                className="flex items-center justify-between gap-4 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3"
              >
                <span className="text-sm text-slate-200">{feature.label}</span>
                <Badge
                  className={
                    feature.enabled
                      ? "border-emerald-200/30 bg-emerald-400/15 text-emerald-100"
                      : "border-white/10 bg-white/10 text-slate-300"
                  }
                >
                  {feature.enabled
                    ? entitlements.featureStates.enabled
                    : entitlements.featureStates.locked}
                </Badge>
              </div>
            ))}
            <div className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-300">
              {entitlements.currentPlanLabel}:{" "}
              <span className="font-medium text-white">
                {entitlements.planLabels[entitlement.plan]}
              </span>
              {" · "}
              {entitlements.statusLabels[entitlement.billingStatus]}
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <CardTitle>{entitlements.managementTitle}</CardTitle>
            <CardDescription>{entitlements.managementDescription}</CardDescription>
          </div>
          {hasBillingPortal ? (
            <form action={openBillingPortalAction}>
              <Button type="submit" variant="secondary">
                {entitlements.openPortalAction}
              </Button>
            </form>
          ) : null}
        </CardHeader>
        <CardContent className="space-y-6">
          {billingNoticeMessage ? (
            <div
              className={
                billingNoticeTone === "cyan"
                  ? "rounded-[24px] border border-cyan-200 bg-cyan-50/80 p-4 text-sm leading-6 text-cyan-950"
                  : "rounded-[24px] border border-amber-200 bg-amber-50/80 p-4 text-sm leading-6 text-amber-950"
              }
            >
              {billingNoticeMessage}
            </div>
          ) : null}

          <div className="grid gap-6 xl:grid-cols-3">
            {pricingPlans.map((plan) => {
              const isCurrentPlan = entitlement.plan === plan.plan;
              const canCheckout =
                plan.plan !== BillingPlan.STARTER && plan.checkoutEnabled;

              return (
                <Card
                  key={plan.plan}
                  className={
                    isCurrentPlan
                      ? "border-slate-950 bg-slate-950 text-white"
                      : undefined
                  }
                >
                  <CardHeader>
                    <div className="flex items-center justify-between gap-3">
                      <CardTitle className={isCurrentPlan ? "text-white" : undefined}>
                        {plan.title}
                      </CardTitle>
                      {isCurrentPlan ? (
                        <Badge className="border-white/10 bg-white/10 text-white">
                          {entitlements.currentPlanBadge}
                        </Badge>
                      ) : null}
                    </div>
                    <CardDescription
                      className={isCurrentPlan ? "text-slate-300" : undefined}
                    >
                      {plan.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div
                      className={
                        isCurrentPlan
                          ? "text-3xl font-semibold text-white"
                          : "text-3xl font-semibold text-slate-950"
                      }
                    >
                      {plan.price}
                      {plan.plan === BillingPlan.STARTER ? null : (
                        <span
                          className={
                            isCurrentPlan
                              ? "text-sm font-normal text-slate-300"
                              : "text-sm font-normal text-slate-500"
                          }
                        >
                          {landingPricing.monthlySuffix}
                        </span>
                      )}
                    </div>

                    <div className="space-y-3">
                      {plan.features.map((feature) => (
                        <div
                          key={`${plan.plan}-${feature}`}
                          className={
                            isCurrentPlan
                              ? "rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                              : "rounded-[22px] border border-slate-200 bg-slate-50/70 px-4 py-3 text-sm text-slate-700"
                          }
                        >
                          {feature}
                        </div>
                      ))}
                    </div>

                    {isCurrentPlan ? (
                      plan.plan !== BillingPlan.STARTER && hasBillingPortal ? (
                        <form action={openBillingPortalAction}>
                          <Button type="submit" variant="secondary" className="w-full">
                            {entitlements.openPortalAction}
                          </Button>
                        </form>
                      ) : (
                        <Button type="button" disabled className="w-full">
                          {entitlements.currentPlanAction}
                        </Button>
                      )
                    ) : canCheckout ? (
                      <form action={startBillingCheckoutAction}>
                        <input type="hidden" name="plan" value={plan.plan} />
                        <Button type="submit" className="w-full">
                          {t("landing.pricing.choosePlan", {
                            plan: entitlements.planLabels[plan.plan],
                          })}
                        </Button>
                      </form>
                    ) : (
                      <Button type="button" disabled className="w-full">
                        {entitlements.checkoutUnavailable}
                      </Button>
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
