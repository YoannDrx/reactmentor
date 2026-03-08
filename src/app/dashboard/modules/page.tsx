import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";
import {
  getAccessibleModuleSlugs,
  getUserEntitlementSnapshot,
} from "@/features/billing/user-entitlements";
import { getDashboardRecommendation } from "@/features/dashboard/dashboard-recommendations";
import { Progress } from "@/components/ui/progress";
import { getI18n } from "@/i18n/server";
import { getRequiredUser } from "@/lib/auth/auth-user";
import { getLocalizedModuleCatalogWithProgress } from "@/lib/content-repository";
import { Lock, Sparkles } from "lucide-react";
import Link from "next/link";
import type { Route } from "next";

export default async function DashboardModulesPage() {
  const user = await getRequiredUser("/dashboard/modules");
  const { locale, messages, t } = await getI18n();
  const [modules, recommendation, entitlement, accessibleModuleSlugs] =
    await Promise.all([
      getLocalizedModuleCatalogWithProgress(user.id, locale),
      getDashboardRecommendation(user.id, locale),
      getUserEntitlementSnapshot(user.id),
      getAccessibleModuleSlugs({ userId: user.id }),
    ]);
  const modulesContent = messages.dashboard.modules;
  const entitlements = messages.dashboard.entitlements;
  const common = messages.common;
  const trackLabels = messages.dashboard.trackLabels;
  const recommendedModuleSlug =
    recommendation.kind === "module" ? recommendation.moduleSlug : null;
  const accessibleModuleSlugSet =
    accessibleModuleSlugs === null ? null : new Set(accessibleModuleSlugs);
  const lockedModulesCount =
    accessibleModuleSlugSet === null
      ? 0
      : modules.filter(
          (learningModule) => !accessibleModuleSlugSet.has(learningModule.slug),
        ).length;
  const activeTracksCount = new Set(
    modules.map((learningModule) => learningModule.track),
  ).size;
  const totalQuestionsCount = modules.reduce(
    (sum, learningModule) => sum + learningModule.counts.questions,
    0,
  );
  const totalSkillsCount = modules.reduce(
    (sum, learningModule) => sum + learningModule.counts.skills,
    0,
  );

  return (
    <div className="grid gap-6">
      {recommendation.kind !== "none" ? (
        <Card className="overflow-hidden border-slate-950 bg-slate-950 text-white">
          <CardHeader className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
            <div className="space-y-3">
              <Badge className="w-fit border-white/10 bg-white/10 text-white">
                {modulesContent.recommendedTitle}
              </Badge>
              <div className="space-y-2">
                <CardTitle className="text-white">
                  {recommendation.kind === "review"
                    ? modulesContent.recommendedReviewTitle
                    : t("dashboard.recommendation.moduleTitle", {
                        module: recommendation.moduleTitle,
                      })}
                </CardTitle>
                <CardDescription className="max-w-2xl text-slate-300">
                  {recommendation.kind === "review"
                    ? t("dashboard.recommendation.reviewDescription", {
                        count: recommendation.dueCount,
                      })
                    : t(
                        `dashboard.recommendation.moduleDescriptions.${recommendation.reason}`,
                      )}
                </CardDescription>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[18rem]">
              {recommendation.kind === "review" ? (
                <>
                  <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      {modulesContent.recommendedDueLabel}
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-white">
                      {recommendation.dueCount}
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      {modulesContent.recommendedSessionSizeLabel}
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-cyan-200">
                      {recommendation.questionCount}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      {modulesContent.recommendedTrackLabel}
                    </div>
                    <div className="mt-2 text-base font-semibold text-white">
                      {trackLabels[recommendation.track]}
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      {modulesContent.recommendedProgressLabel}
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-cyan-200">
                      {recommendation.progressPercent}%
                    </div>
                  </div>
                </>
              )}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap gap-2">
              {recommendation.kind === "module"
                ? recommendation.focusSkills.map((skill) => (
                    <Badge
                      key={skill}
                      className="border-white/10 bg-white/5 text-slate-200"
                    >
                      {skill}
                    </Badge>
                  ))
                : null}
            </div>

            {recommendation.kind === "review" ? (
              <Link
                href="/dashboard/review"
                className={buttonVariants({ variant: "primary", size: "md" })}
              >
                {modulesContent.recommendedReviewAction}
              </Link>
            ) : (
              <Link
                href={`/dashboard/modules/${recommendation.moduleSlug}` as Route}
                className={buttonVariants({ variant: "primary", size: "md" })}
              >
                {modulesContent.recommendedModuleAction}
              </Link>
            )}
          </CardContent>
        </Card>
      ) : null}

      {!entitlement.hasUnlimitedModules && lockedModulesCount > 0 ? (
        <Card className="border-amber-200 bg-amber-50/80">
          <CardHeader className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
            <div className="space-y-3">
              <Badge className="w-fit border-amber-200 bg-amber-100 text-amber-800">
                {entitlements.gates.modules.badge}
              </Badge>
              <div className="space-y-2">
                <CardTitle>{entitlements.gates.modules.title}</CardTitle>
                <CardDescription className="max-w-2xl text-amber-950/80">
                  {t("dashboard.entitlements.gates.modules.description", {
                    count: entitlement.moduleAccessLimit ?? 0,
                  })}
                </CardDescription>
              </div>
            </div>
            <div className="rounded-[22px] border border-amber-200 bg-white/80 px-4 py-3 text-sm text-amber-950">
              {t("dashboard.entitlements.gates.modules.limitHint", {
                locked: lockedModulesCount,
              })}
            </div>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-sm text-amber-950/80">
              <Lock className="size-4" />
              {entitlements.gates.modules.cardHint}
            </div>
            <Link
              href="/dashboard/settings"
              className={buttonVariants({ variant: "secondary", size: "md" })}
            >
              {entitlements.gates.modules.action}
            </Link>
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          {
            label: modulesContent.stats.activeTracksLabel,
            value: String(activeTracksCount),
            detail: modulesContent.stats.activeTracksDetail,
          },
          {
            label: modulesContent.stats.questionCountLabel,
            value: String(totalQuestionsCount),
            detail: modulesContent.stats.questionCountDetail,
          },
          {
            label: modulesContent.stats.skillCountLabel,
            value: String(totalSkillsCount),
            detail: modulesContent.stats.skillCountDetail,
          },
        ].map((metric) => (
          <Card key={metric.label}>
            <CardContent className="space-y-2 pt-6">
              <div className="text-sm text-slate-500">{metric.label}</div>
              <div className="font-display text-3xl font-semibold text-slate-950">
                {metric.value}
              </div>
              <p className="text-sm text-slate-600">{metric.detail}</p>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-2">
        {modules.map((learningModule) => {
          const isLocked =
            accessibleModuleSlugSet !== null &&
            !accessibleModuleSlugSet.has(learningModule.slug);

          return (
            <Card
              key={learningModule.id}
              className={
                isLocked ? "border-amber-200 bg-amber-50/30" : undefined
              }
            >
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                      {trackLabels[learningModule.track]}
                    </div>
                    <div className="mt-2 flex flex-wrap items-center gap-2">
                      <CardTitle>{learningModule.title}</CardTitle>
                      {isLocked ? (
                        <Badge className="border-amber-200 bg-amber-50 text-amber-700">
                          {entitlements.gates.modules.cardBadge}
                        </Badge>
                      ) : null}
                      {learningModule.slug === recommendedModuleSlug ? (
                        <Badge className="border-cyan-200 bg-cyan-50 text-cyan-700">
                          {modulesContent.recommendedBadge}
                        </Badge>
                      ) : null}
                    </div>
                  </div>
                  <Badge className="border-slate-200 bg-slate-100 text-slate-700">
                    {
                      common.levels[
                        learningModule.level as keyof typeof common.levels
                      ]
                    }
                  </Badge>
                </div>
                <CardDescription>{learningModule.summary}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm text-slate-600">
                    <span>{modulesContent.completionLabel}</span>
                    <span>{learningModule.userProgress.progressPercent}%</span>
                  </div>
                  <Progress value={learningModule.userProgress.progressPercent} />
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge className="border-slate-200 bg-white text-slate-700">
                    {t("dashboard.modules.attemptedSummary", {
                      count: learningModule.userProgress.attemptedQuestions,
                    })}
                  </Badge>
                  <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                    {t("dashboard.modules.masteredSummary", {
                      count: learningModule.userProgress.masteredQuestions,
                    })}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-2">
                  {learningModule.skills.slice(0, 4).map((skill) => (
                    <Badge
                      key={skill.id}
                      className="border-white bg-slate-50 text-slate-700"
                    >
                      {skill.title}
                    </Badge>
                  ))}
                </div>

                <div
                  className={
                    isLocked
                      ? "rounded-[24px] border border-amber-200 bg-white/90 p-4 text-sm leading-6 text-amber-950/80"
                      : "rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600"
                  }
                >
                  {isLocked
                    ? entitlements.gates.modules.cardHint
                    : t("dashboard.modules.questionsSummary", {
                        count: learningModule.counts.questions,
                      })}
                </div>

                <Link
                  href={`/dashboard/modules/${learningModule.slug}` as Route}
                  className="inline-flex text-sm font-medium text-slate-950 underline"
                >
                  {modulesContent.openModule}
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>{modulesContent.architectureTitle}</CardTitle>
            <CardDescription>{modulesContent.architectureDescription}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-3 md:grid-cols-2">
            {modulesContent.architectureItems.map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-slate-200 bg-white px-4 py-3 text-sm leading-6 text-slate-600"
              >
                {item}
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="bg-slate-950 text-white">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-cyan-300" />
              <CardTitle className="text-white">
                {modulesContent.nextBuildOutTitle}
              </CardTitle>
            </div>
            <CardDescription className="text-slate-300">
              {modulesContent.nextBuildOutDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {modulesContent.nextBuildOutItems.map((item) => (
              <div
                key={item}
                className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
              >
                {item}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
