import {
  BillingPlan,
  ContentStatus,
  OperationalEventLevel,
  ProductAnalyticsEventName,
  QuestionFormat,
  QuestionLevel,
  Track,
  TranslationStatus,
} from "@prisma/client";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  createAdminModuleAction,
  createAdminPitfallTagAction,
  createAdminQuestionAction,
  createAdminSkillAction,
  importAdminContentAction,
  updateAdminModuleAction,
  updateAdminPitfallTagAction,
  updateAdminQuestionAction,
  updateAdminSkillAction,
  updateContentStatusAction,
} from "@/features/admin/admin-content.action";
import { getAdminContentReadModel } from "@/features/admin/admin-content-read-model";
import { getAdminTelemetryReadModel } from "@/features/telemetry/admin-telemetry-read-model";
import { getI18n } from "@/i18n/server";
import { requireContentAdmin } from "@/lib/auth/content-admin";

const contentStatuses = [
  ContentStatus.DRAFT,
  ContentStatus.IN_REVIEW,
  ContentStatus.PUBLISHED,
  ContentStatus.ARCHIVED,
] as const;

const translationStatuses = [
  TranslationStatus.MISSING,
  TranslationStatus.IN_PROGRESS,
  TranslationStatus.REVIEW,
  TranslationStatus.READY,
] as const;

function parseContentStatusFilter(value?: string) {
  if (!value) {
    return null;
  }

  return Object.values(ContentStatus).includes(value as ContentStatus)
    ? (value as ContentStatus)
    : null;
}

function parseQuestionFormatFilter(value?: string) {
  if (!value) {
    return null;
  }

  return Object.values(QuestionFormat).includes(value as QuestionFormat)
    ? (value as QuestionFormat)
    : null;
}

function StatusSelect({
  name,
  defaultValue,
  labels,
}: {
  name: string;
  defaultValue: ContentStatus;
  labels: Record<ContentStatus, string>;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
    >
      {contentStatuses.map((status) => (
        <option key={status} value={status}>
          {labels[status]}
        </option>
      ))}
    </select>
  );
}

function TranslationStatusSelect({
  name,
  defaultValue,
  labels,
}: {
  name: string;
  defaultValue: TranslationStatus;
  labels: Record<TranslationStatus, string>;
}) {
  return (
    <select
      name={name}
      defaultValue={defaultValue}
      className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
    >
      {translationStatuses.map((status) => (
        <option key={status} value={status}>
          {labels[status]}
        </option>
      ))}
    </select>
  );
}

function PitfallTagFieldset({
  legend,
  hint,
  emptyHint,
  pitfallTags,
  selectedSlugs = [],
}: {
  legend: string;
  hint: string;
  emptyHint: string;
  pitfallTags: Array<{
    slug: string;
    title: string;
    description: string;
  }>;
  selectedSlugs?: string[];
}) {
  if (pitfallTags.length === 0) {
    return <div className="text-sm text-slate-500">{emptyHint}</div>;
  }

  return (
    <fieldset className="grid gap-3 rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
      <legend className="px-1 text-sm font-medium text-slate-950">{legend}</legend>
      <div className="text-sm leading-6 text-slate-600">{hint}</div>
      <div className="grid gap-3">
        {pitfallTags.map((pitfallTag) => {
          const isChecked = selectedSlugs.includes(pitfallTag.slug);

          return (
            <label
              key={pitfallTag.slug}
              className="grid gap-1 rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700"
            >
              <span className="flex items-center gap-3">
                <input
                  type="checkbox"
                  name="pitfallTagSlugs"
                  value={pitfallTag.slug}
                  defaultChecked={isChecked}
                  className="h-4 w-4 rounded border-slate-300 text-slate-950"
                />
                <span className="font-medium text-slate-950">{pitfallTag.title}</span>
                <span className="text-xs uppercase tracking-[0.18em] text-slate-400">
                  {pitfallTag.slug}
                </span>
              </span>
              <span className="text-sm leading-6 text-slate-500">
                {pitfallTag.description}
              </span>
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export default async function DashboardAdminPage({
  searchParams,
}: {
  searchParams: Promise<{
    questionStatus?: string;
    questionFormat?: string;
  }>;
}) {
  await requireContentAdmin("/dashboard/admin");
  const resolvedSearchParams = await searchParams;
  const { locale, messages } = await getI18n();
  const admin = messages.dashboard.admin;
  const learn = messages.learn;
  const [readModel, telemetryReadModel] = await Promise.all([
    getAdminContentReadModel(locale, {
      questionStatus: parseContentStatusFilter(
        resolvedSearchParams.questionStatus,
      ),
      questionFormat: parseQuestionFormatFilter(
        resolvedSearchParams.questionFormat,
      ),
    }),
    getAdminTelemetryReadModel(),
  ]);
  const updatedAtFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  });
  const dateTimeFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const levelLabels: Record<QuestionLevel, string> = {
    [QuestionLevel.JUNIOR]: messages.common.levels.junior,
    [QuestionLevel.MID]: messages.common.levels.mid,
    [QuestionLevel.SENIOR]: messages.common.levels.senior,
  };
  const trackLabels: Record<Track, string> = {
    [Track.REACT]: messages.dashboard.trackLabels.REACT,
    [Track.REACT_NATIVE]: messages.dashboard.trackLabels.REACT_NATIVE,
    [Track.TYPESCRIPT]: messages.dashboard.trackLabels.TYPESCRIPT,
    [Track.FRONTEND_SYSTEMS]: messages.dashboard.trackLabels.FRONTEND_SYSTEMS,
  };
  const billingPlanLabels: Record<BillingPlan, string> =
    messages.dashboard.entitlements.planLabels;
  const sessionModeLabels = messages.dashboard.playlists.modeLabels;
  const analyticsEventLabels: Record<ProductAnalyticsEventName, string> =
    admin.telemetry.eventLabels;
  const operationalLevelLabels: Record<OperationalEventLevel, string> =
    admin.telemetry.levelLabels;

  return (
    <div className="grid gap-6">
      <Card className="bg-slate-950 text-white">
        <CardHeader>
          <CardTitle className="text-white">{admin.title}</CardTitle>
          <CardDescription className="text-slate-300">
            {admin.description}
          </CardDescription>
          <div className="pt-3">
            <div className="flex flex-wrap gap-3">
              <Link
                href="/api/admin/content-export"
                className={buttonVariants({ variant: "secondary", size: "sm" })}
              >
                {admin.exportAction}
              </Link>
            </div>
            <details className="mt-4 rounded-[20px] border border-slate-800 bg-slate-900/60 p-4">
              <summary className="cursor-pointer text-sm font-medium text-slate-100">
                {admin.importTitle}
              </summary>
              <form
                action={importAdminContentAction}
                className="mt-4 grid gap-4"
                encType="multipart/form-data"
              >
                <div className="text-sm leading-6 text-slate-300">
                  {admin.importDescription}
                </div>
                <input
                  name="payloadFile"
                  type="file"
                  accept="application/json"
                  className="block w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
                />
                <textarea
                  name="payloadJson"
                  placeholder={admin.importPayloadPlaceholder}
                  rows={8}
                  className="w-full rounded-[24px] border border-slate-700 bg-slate-950 px-4 py-3 text-sm text-slate-100"
                />
                <Button type="submit" variant="secondary" className="w-fit">
                  {admin.importAction}
                </Button>
              </form>
            </details>
          </div>
        </CardHeader>
      </Card>

      <section className="grid gap-4 xl:grid-cols-6">
        <Card>
          <CardHeader>
            <CardTitle>{admin.stats.modulesLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-950">
              {readModel.stats.modules.total}
            </div>
            <div className="mt-2 text-sm text-slate-600">
              {admin.statusLabels.PUBLISHED}: {readModel.stats.modules.published}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{admin.stats.skillsLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-950">
              {readModel.stats.skills.total}
            </div>
            <div className="mt-2 text-sm text-slate-600">
              {admin.statusLabels.PUBLISHED}: {readModel.stats.skills.published}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{admin.stats.questionsLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-950">
              {readModel.stats.questions.total}
            </div>
            <div className="mt-2 text-sm text-slate-600">
              {admin.statusLabels.PUBLISHED}: {readModel.stats.questions.published}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{admin.stats.publishableLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-emerald-700">
              {readModel.stats.questions.publishable}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{admin.stats.translationGapLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-amber-700">
              {readModel.stats.questions.translationGaps}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>{admin.stats.pitfallTagsLabel}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-semibold text-slate-950">
              {readModel.pitfallTags.length}
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>{admin.telemetry.title}</CardTitle>
          <CardDescription>{admin.telemetry.description}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 xl:grid-cols-[1.35fr_1fr]">
          <div className="grid gap-6">
            <div className="grid gap-4 md:grid-cols-4">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                <div className="text-sm font-medium text-slate-950">
                  {admin.telemetry.totalEventsLabel}
                </div>
                <div className="mt-2 text-3xl font-semibold text-slate-950">
                  {telemetryReadModel.analytics.totalEvents}
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  {admin.telemetry.analyticsWindowLabel.replace(
                    "{count}",
                    String(telemetryReadModel.analytics.windowDays),
                  )}
                </div>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                <div className="text-sm font-medium text-slate-950">
                  {admin.telemetry.activeUsersLabel}
                </div>
                <div className="mt-2 text-3xl font-semibold text-slate-950">
                  {telemetryReadModel.analytics.activeUsers}
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  {admin.telemetry.onboardingCompletedLabel}:{" "}
                  {
                    telemetryReadModel.analytics.counts[
                      ProductAnalyticsEventName.ONBOARDING_COMPLETED
                    ]
                  }
                </div>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                <div className="text-sm font-medium text-slate-950">
                  {admin.telemetry.mockCompletedLabel}
                </div>
                <div className="mt-2 text-3xl font-semibold text-slate-950">
                  {
                    telemetryReadModel.analytics.counts[
                      ProductAnalyticsEventName.MOCK_COMPLETED
                    ]
                  }
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  {admin.telemetry.questionAnsweredLabel}:{" "}
                  {
                    telemetryReadModel.analytics.counts[
                      ProductAnalyticsEventName.QUESTION_ANSWERED
                    ]
                  }
                </div>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                <div className="text-sm font-medium text-slate-950">
                  {admin.telemetry.subscriptionStartedLabel}
                </div>
                <div className="mt-2 text-3xl font-semibold text-emerald-700">
                  {
                    telemetryReadModel.analytics.counts[
                      ProductAnalyticsEventName.SUBSCRIPTION_STARTED
                    ]
                  }
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  {admin.telemetry.checkoutCompletedLabel}:{" "}
                  {
                    telemetryReadModel.analytics.counts[
                      ProductAnalyticsEventName.CHECKOUT_COMPLETED
                    ]
                  }
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="text-sm font-medium text-slate-950">
                    {admin.telemetry.funnelTitle}
                  </div>
                  <div className="text-sm text-slate-600">
                    {admin.telemetry.funnelDescription}
                  </div>
                </div>
              </div>
              <div className="mt-4 grid gap-3 md:grid-cols-5">
                {telemetryReadModel.analytics.funnel.map((step) => (
                  <div
                    key={step.key}
                    className="rounded-[22px] border border-slate-200 bg-slate-50/70 p-4"
                  >
                    <div className="text-sm font-medium text-slate-950">
                      {admin.telemetry.funnelStepLabels[step.key]}
                    </div>
                    <div className="mt-2 text-3xl font-semibold text-slate-950">
                      {step.users}
                    </div>
                    <div className="mt-2 text-sm text-slate-600">
                      {admin.telemetry.conversionLabel}:{" "}
                      {step.conversionFromPrevious === null
                        ? admin.telemetry.notAvailableLabel
                        : `${step.conversionFromPrevious}%`}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5">
              <div className="text-sm font-medium text-slate-950">
                {admin.telemetry.recentProductEventsTitle}
              </div>
              <div className="mt-4 grid gap-3">
                {telemetryReadModel.analytics.recentEvents.length > 0 ? (
                  telemetryReadModel.analytics.recentEvents.map((event) => (
                    <div
                      key={event.id}
                      className="flex flex-wrap items-start justify-between gap-3 rounded-[22px] border border-slate-200 bg-slate-50/70 px-4 py-3"
                    >
                      <div className="grid gap-1">
                        <div className="font-medium text-slate-950">
                          {analyticsEventLabels[event.name]}
                        </div>
                        <div className="flex flex-wrap gap-2 text-sm text-slate-600">
                          {event.source ? <span>{event.source}</span> : null}
                          {event.sessionMode ? (
                            <span>{sessionModeLabels[event.sessionMode]}</span>
                          ) : null}
                          {event.billingPlan ? (
                            <span>{billingPlanLabels[event.billingPlan]}</span>
                          ) : null}
                          {event.moduleSlug ? <span>{event.moduleSlug}</span> : null}
                        </div>
                      </div>
                      <div className="text-sm text-slate-500">
                        {dateTimeFormatter.format(event.occurredAt)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[22px] border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                    {admin.telemetry.emptyProductEvents}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="grid gap-6">
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-2">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                <div className="text-sm font-medium text-slate-950">
                  {admin.telemetry.errorCountLabel}
                </div>
                <div className="mt-2 text-3xl font-semibold text-red-700">
                  {telemetryReadModel.operational.errorCount}
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  {admin.telemetry.operationalWindowLabel.replace(
                    "{count}",
                    String(telemetryReadModel.operational.windowDays),
                  )}
                </div>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                <div className="text-sm font-medium text-slate-950">
                  {admin.telemetry.warningCountLabel}
                </div>
                <div className="mt-2 text-3xl font-semibold text-amber-700">
                  {telemetryReadModel.operational.warningCount}
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  {admin.telemetry.infoCountLabel}:{" "}
                  {telemetryReadModel.operational.infoCount}
                </div>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                <div className="text-sm font-medium text-slate-950">
                  {admin.telemetry.billingWebhookLabel}
                </div>
                <div className="mt-2 text-3xl font-semibold text-slate-950">
                  {telemetryReadModel.operational.billingWebhookEvents}
                </div>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                <div className="text-sm font-medium text-slate-950">
                  {admin.telemetry.contentImportLabel}
                </div>
                <div className="mt-2 text-3xl font-semibold text-slate-950">
                  {telemetryReadModel.operational.contentImportEvents}
                </div>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                <div className="text-sm font-medium text-slate-950">
                  {admin.telemetry.lifecycleEmailsLabel}
                </div>
                <div className="mt-2 text-3xl font-semibold text-slate-950">
                  {telemetryReadModel.operational.emailLifecycleEvents}
                </div>
                <div className="mt-2 text-sm text-slate-600">
                  {admin.telemetry.lifecycleEmailFailuresLabel}:{" "}
                  {telemetryReadModel.operational.emailLifecycleFailures}
                </div>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                <div className="text-sm font-medium text-slate-950">
                  {admin.telemetry.reviewReminderJobsLabel}
                </div>
                <div className="mt-2 text-3xl font-semibold text-slate-950">
                  {telemetryReadModel.operational.reviewReminderJobEvents}
                </div>
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5">
              <div className="text-sm font-medium text-slate-950">
                {admin.telemetry.recentOperationalEventsTitle}
              </div>
              <div className="mt-4 grid gap-3">
                {telemetryReadModel.operational.recentEvents.length > 0 ? (
                  telemetryReadModel.operational.recentEvents.map((event) => (
                    <div
                      key={event.id}
                      className="rounded-[22px] border border-slate-200 bg-slate-50/70 px-4 py-3"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="grid gap-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge className="border-slate-200 bg-white text-slate-700">
                              {operationalLevelLabels[event.level]}
                            </Badge>
                            <span className="font-medium text-slate-950">
                              {event.source}
                            </span>
                          </div>
                          <div className="text-sm text-slate-600">
                            {event.eventType}
                            {event.status ? ` · ${event.status}` : ""}
                          </div>
                          {event.message ? (
                            <div className="text-sm text-slate-500">
                              {event.message}
                            </div>
                          ) : null}
                        </div>
                        <div className="text-sm text-slate-500">
                          {dateTimeFormatter.format(event.occurredAt)}
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[22px] border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                    {admin.telemetry.emptyOperationalEvents}
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-slate-200 bg-white p-5">
              <div className="text-sm font-medium text-slate-950">
                {admin.telemetry.topSourcesTitle}
              </div>
              <div className="mt-4 grid gap-3">
                {telemetryReadModel.operational.sourceRows.length > 0 ? (
                  telemetryReadModel.operational.sourceRows.map((sourceRow) => (
                    <div
                      key={sourceRow.source}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-[22px] border border-slate-200 bg-slate-50/70 px-4 py-3"
                    >
                      <div className="grid gap-1">
                        <div className="font-medium text-slate-950">
                          {sourceRow.source}
                        </div>
                        <div className="text-sm text-slate-600">
                          {admin.telemetry.errorCountLabel}: {sourceRow.errors} ·{" "}
                          {admin.telemetry.warningCountLabel}: {sourceRow.warnings}
                        </div>
                      </div>
                      <div className="text-sm text-slate-500">
                        {admin.totalLabel}: {sourceRow.total} ·{" "}
                        {updatedAtFormatter.format(sourceRow.lastEventAt)}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="rounded-[22px] border border-dashed border-slate-200 px-4 py-6 text-sm text-slate-500">
                    {admin.telemetry.emptySources}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{admin.qualityTitle}</CardTitle>
          <CardDescription>{admin.qualityDescription}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 xl:grid-cols-4">
          <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
            <div className="text-sm font-medium text-slate-950">
              {admin.qualityTranslationGapsLabel}
            </div>
            <div className="mt-2 text-3xl font-semibold text-amber-700">
              {readModel.quality.translationGapQuestions}
            </div>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
            <div className="text-sm font-medium text-slate-950">
              {admin.qualityUntaggedQuestionsLabel}
            </div>
            <div className="mt-2 text-3xl font-semibold text-slate-950">
              {readModel.quality.untaggedQuestions}
            </div>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
            <div className="text-sm font-medium text-slate-950">
              {admin.qualityThinModulesLabel}
            </div>
            <div className="mt-2 text-3xl font-semibold text-slate-950">
              {readModel.quality.thinModules.length}
            </div>
            <div className="mt-3 grid gap-2 text-sm text-slate-600">
              {readModel.quality.thinModules.length > 0 ? (
                readModel.quality.thinModules.slice(0, 4).map((module) => (
                  <div key={module.id}>
                    {module.title} · {admin.stats.skillsLabel}: {module.skillCount} ·{" "}
                    {admin.stats.questionsLabel}: {module.questionCount}
                  </div>
                ))
              ) : (
                <div>{admin.qualityNoThinModules}</div>
              )}
            </div>
          </div>
          <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
            <div className="text-sm font-medium text-slate-950">
              {admin.qualityCoverageLabel}
            </div>
            <div className="mt-3 grid gap-2 text-sm text-slate-600">
              {readModel.quality.coverageByTrack.map((coverage) => (
                <div key={coverage.track}>
                  {trackLabels[coverage.track]} · {admin.stats.modulesLabel}:{" "}
                  {coverage.modules} · {admin.stats.questionsLabel}: {coverage.questions}
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-2">
              {readModel.quality.coverageByFormat.map((coverage) => (
                <Badge
                  key={coverage.format}
                  className="border-slate-200 bg-white text-slate-700"
                >
                  {learn.formatLabels[coverage.format]}: {coverage.count}
                </Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      <section className="grid gap-6 xl:grid-cols-4">
        <Card>
          <CardHeader>
            <CardTitle>{admin.createModuleTitle}</CardTitle>
            <CardDescription>{admin.createModuleDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createAdminModuleAction} className="grid gap-4">
              <input
                name="slug"
                placeholder={admin.slugLabel}
                className="flex h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <select
                  name="track"
                  defaultValue={Track.REACT}
                  className="flex h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                >
                  {Object.entries(trackLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
                <select
                  name="level"
                  defaultValue={QuestionLevel.MID}
                  className="flex h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                >
                  {Object.entries(levelLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
                <input
                  name="order"
                  type="number"
                  min={0}
                  max={999}
                  defaultValue={0}
                  placeholder={admin.orderLabel}
                  className="flex h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                />
                <StatusSelect
                  name="status"
                  defaultValue={ContentStatus.DRAFT}
                  labels={admin.statusLabels}
                />
              </div>
              <input
                name="titleFr"
                placeholder={admin.titleFrLabel}
                className="flex h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                required
              />
              <textarea
                name="descriptionFr"
                placeholder={admin.descriptionFrLabel}
                rows={3}
                className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
                required
              />
              <textarea
                name="summaryFr"
                placeholder={admin.summaryFrLabel}
                rows={2}
                className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
              />
              <input
                name="titleEn"
                placeholder={admin.titleEnLabel}
                className="flex h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                required
              />
              <textarea
                name="descriptionEn"
                placeholder={admin.descriptionEnLabel}
                rows={3}
                className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
                required
              />
              <textarea
                name="summaryEn"
                placeholder={admin.summaryEnLabel}
                rows={2}
                className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
              />
              <Button type="submit">{admin.createModuleAction}</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{admin.createSkillTitle}</CardTitle>
            <CardDescription>{admin.createSkillDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createAdminSkillAction} className="grid gap-4">
              <select
                name="moduleId"
                className="flex h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                required
              >
                <option value="">{admin.moduleLabel}</option>
                {readModel.moduleOptions.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.title}
                  </option>
                ))}
              </select>
              <input
                name="slug"
                placeholder={admin.slugLabel}
                className="flex h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                required
              />
              <StatusSelect
                name="status"
                defaultValue={ContentStatus.DRAFT}
                labels={admin.statusLabels}
              />
              <input
                name="titleFr"
                placeholder={admin.titleFrLabel}
                className="flex h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                required
              />
              <textarea
                name="descriptionFr"
                placeholder={admin.descriptionFrLabel}
                rows={3}
                className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
                required
              />
              <input
                name="titleEn"
                placeholder={admin.titleEnLabel}
                className="flex h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                required
              />
              <textarea
                name="descriptionEn"
                placeholder={admin.descriptionEnLabel}
                rows={3}
                className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
                required
              />
              <Button type="submit">{admin.createSkillAction}</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{admin.createQuestionTitle}</CardTitle>
            <CardDescription>{admin.createQuestionDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createAdminQuestionAction} className="grid gap-4">
              <select
                name="moduleId"
                className="flex h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                required
              >
                <option value="">{admin.moduleLabel}</option>
                {readModel.moduleOptions.map((module) => (
                  <option key={module.id} value={module.id}>
                    {module.title}
                  </option>
                ))}
              </select>
              <select
                name="primarySkillId"
                className="flex h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                required
              >
                <option value="">{admin.skillLabel}</option>
                {readModel.skillOptions.map((skill) => (
                  <option key={skill.id} value={skill.id}>
                    {skill.moduleTitle} · {skill.title}
                  </option>
                ))}
              </select>
              <input
                name="slug"
                placeholder={admin.slugLabel}
                className="flex h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                required
              />
              <div className="grid gap-4 sm:grid-cols-2">
                <select
                  name="format"
                  defaultValue={readModel.editableQuestionFormats[0]}
                  className="flex h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                >
                  {readModel.editableQuestionFormats.map((format) => (
                    <option key={format} value={format}>
                      {learn.formatLabels[format]}
                    </option>
                  ))}
                </select>
                <select
                  name="level"
                  defaultValue={QuestionLevel.MID}
                  className="flex h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                >
                  {Object.entries(levelLabels).map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-3">
                <input
                  name="difficulty"
                  type="number"
                  min={1}
                  max={5}
                  defaultValue={3}
                  placeholder={admin.difficultyLabel}
                  className="flex h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                />
                <input
                  name="estimatedTimeSec"
                  type="number"
                  min={0}
                  max={7200}
                  placeholder={admin.estimatedTimeSecLabel}
                  className="flex h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                />
                <StatusSelect
                  name="status"
                  defaultValue={ContentStatus.DRAFT}
                  labels={admin.statusLabels}
                />
              </div>
              <input
                name="sourceType"
                placeholder={admin.sourceTypeLabel}
                className="flex h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
              />
              <PitfallTagFieldset
                legend={admin.pitfallTagSelectionLabel}
                hint={admin.pitfallTagSelectionHint}
                emptyHint={admin.noPitfallTagsHint}
                pitfallTags={readModel.pitfallTagOptions}
              />
              <textarea
                name="promptFr"
                placeholder={admin.promptFrLabel}
                rows={3}
                className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
                required
              />
              <textarea
                name="explanationFr"
                placeholder={admin.explanationFrLabel}
                rows={4}
                className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
                required
              />
              <textarea
                name="takeawaysFr"
                placeholder={admin.takeawaysFrLabel}
                rows={3}
                className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
                required
              />
              <textarea
                name="promptEn"
                placeholder={admin.promptEnLabel}
                rows={3}
                className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
                required
              />
              <textarea
                name="explanationEn"
                placeholder={admin.explanationEnLabel}
                rows={4}
                className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
                required
              />
              <textarea
                name="takeawaysEn"
                placeholder={admin.takeawaysEnLabel}
                rows={3}
                className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
                required
              />
              <input
                name="correctOptionIndexes"
                placeholder={admin.correctOptionIndexesLabel}
                className="flex h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
              />
              <textarea
                name="optionLabelsFr"
                placeholder={admin.optionLabelsFrLabel}
                rows={4}
                className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
              />
              <textarea
                name="optionExplanationsFr"
                placeholder={admin.optionExplanationsFrLabel}
                rows={4}
                className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
              />
              <textarea
                name="optionLabelsEn"
                placeholder={admin.optionLabelsEnLabel}
                rows={4}
                className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
              />
              <textarea
                name="optionExplanationsEn"
                placeholder={admin.optionExplanationsEnLabel}
                rows={4}
                className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
              />
              <p className="text-sm leading-6 text-slate-600">
                {admin.takeawaysHint} {admin.optionEditorHint}{" "}
                {admin.correctOptionIndexesHint} {admin.formatScopeHint}
              </p>
              <Button type="submit">{admin.createQuestionAction}</Button>
            </form>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{admin.createPitfallTagTitle}</CardTitle>
            <CardDescription>{admin.createPitfallTagDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <form action={createAdminPitfallTagAction} className="grid gap-4">
              <input
                name="slug"
                placeholder={admin.slugLabel}
                className="flex h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                required
              />
              <input
                name="title"
                placeholder={admin.pitfallTagTitleLabel}
                className="flex h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                required
              />
              <textarea
                name="description"
                placeholder={admin.pitfallTagDescriptionLabel}
                rows={4}
                className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
                required
              />
              <Button type="submit">{admin.createPitfallTagAction}</Button>
            </form>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>{admin.inventoryTitle}</CardTitle>
          <CardDescription>{admin.inventoryDescription}</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 xl:grid-cols-3">
          <div className="space-y-4">
            <div className="text-sm font-medium text-slate-950">
              {admin.modulesListTitle}
            </div>
            {readModel.modules.length > 0 ? (
              readModel.modules.map((module) => (
                <div
                  key={module.id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4"
                >
                  <div className="space-y-3">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {module.slug}
                    </div>
                    <div className="font-medium text-slate-950">{module.title}</div>
                    <div className="text-sm text-slate-600">
                      {trackLabels[module.track]} · {levelLabels[module.level]}
                    </div>
                    <div className="text-sm text-slate-600">
                      {admin.stats.skillsLabel}: {module.skillCount} ·{" "}
                      {admin.stats.questionsLabel}: {module.questionCount}
                    </div>
                    <div className="text-sm text-slate-500">
                      {updatedAtFormatter.format(module.updatedAt)}
                    </div>
                    <form action={updateContentStatusAction} className="flex flex-wrap gap-3">
                      <input type="hidden" name="entity" value="module" />
                      <input type="hidden" name="id" value={module.id} />
                      <StatusSelect
                        name="status"
                        defaultValue={module.status}
                        labels={admin.statusLabels}
                      />
                      <Button type="submit" variant="secondary">
                        {admin.updateStatusAction}
                      </Button>
                    </form>
                    <Link
                      href={`/dashboard/modules/${module.slug}`}
                      className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                      {admin.openAction}
                    </Link>
                    <details className="rounded-[20px] border border-slate-200 bg-white/90 p-4">
                      <summary className="cursor-pointer text-sm font-medium text-slate-700">
                        {admin.editAction}
                      </summary>
                      <form action={updateAdminModuleAction} className="mt-4 grid gap-4">
                        <input type="hidden" name="id" value={module.id} />
                        <input
                          name="slug"
                          defaultValue={module.slug}
                          placeholder={admin.slugLabel}
                          className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                          required
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                          <select
                            name="track"
                            defaultValue={module.track}
                            className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                          >
                            {Object.entries(trackLabels).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                          <select
                            name="level"
                            defaultValue={module.level}
                            className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                          >
                            {Object.entries(levelLabels).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <input
                            name="order"
                            type="number"
                            min={0}
                            max={999}
                            defaultValue={module.order}
                            className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                          />
                          <StatusSelect
                            name="status"
                            defaultValue={module.status}
                            labels={admin.statusLabels}
                          />
                        </div>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <TranslationStatusSelect
                            name="translationStatusFr"
                            defaultValue={module.translationStatus.fr}
                            labels={admin.translationStatusLabels}
                          />
                          <TranslationStatusSelect
                            name="translationStatusEn"
                            defaultValue={module.translationStatus.en}
                            labels={admin.translationStatusLabels}
                          />
                        </div>
                        <input
                          name="titleFr"
                          defaultValue={module.titleFr}
                          placeholder={admin.titleFrLabel}
                          className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                          required
                        />
                        <textarea
                          name="descriptionFr"
                          defaultValue={module.descriptionFr}
                          placeholder={admin.descriptionFrLabel}
                          rows={3}
                          className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
                          required
                        />
                        <textarea
                          name="summaryFr"
                          defaultValue={module.summaryFr}
                          placeholder={admin.summaryFrLabel}
                          rows={2}
                          className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
                        />
                        <input
                          name="titleEn"
                          defaultValue={module.titleEn}
                          placeholder={admin.titleEnLabel}
                          className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                          required
                        />
                        <textarea
                          name="descriptionEn"
                          defaultValue={module.descriptionEn}
                          placeholder={admin.descriptionEnLabel}
                          rows={3}
                          className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
                          required
                        />
                        <textarea
                          name="summaryEn"
                          defaultValue={module.summaryEn}
                          placeholder={admin.summaryEnLabel}
                          rows={2}
                          className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
                        />
                        <Button type="submit" size="sm">
                          {admin.saveChangesAction}
                        </Button>
                      </form>
                    </details>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-600">{admin.emptyInventory}</div>
            )}
          </div>

          <div className="space-y-4">
            <div className="text-sm font-medium text-slate-950">
              {admin.skillsListTitle}
            </div>
            {readModel.skills.length > 0 ? (
              readModel.skills.map((skill) => (
                <div
                  key={skill.id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4"
                >
                  <div className="space-y-3">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {skill.slug}
                    </div>
                    <div className="font-medium text-slate-950">{skill.title}</div>
                    <div className="text-sm text-slate-600">
                      {admin.moduleLabel}: {skill.moduleTitle}
                    </div>
                    <div className="text-sm text-slate-600">
                      {admin.stats.questionsLabel}: {skill.questionCount}
                    </div>
                    <div className="text-sm text-slate-500">
                      {updatedAtFormatter.format(skill.updatedAt)}
                    </div>
                    <form action={updateContentStatusAction} className="flex flex-wrap gap-3">
                      <input type="hidden" name="entity" value="skill" />
                      <input type="hidden" name="id" value={skill.id} />
                      <StatusSelect
                        name="status"
                        defaultValue={skill.status}
                        labels={admin.statusLabels}
                      />
                      <Button type="submit" variant="secondary">
                        {admin.updateStatusAction}
                      </Button>
                    </form>
                    <details className="rounded-[20px] border border-slate-200 bg-white/90 p-4">
                      <summary className="cursor-pointer text-sm font-medium text-slate-700">
                        {admin.editAction}
                      </summary>
                      <form action={updateAdminSkillAction} className="mt-4 grid gap-4">
                        <input type="hidden" name="id" value={skill.id} />
                        <select
                          name="moduleId"
                          defaultValue={skill.moduleId}
                          className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                          required
                        >
                          {readModel.moduleOptions.map((module) => (
                            <option key={module.id} value={module.id}>
                              {module.title}
                            </option>
                          ))}
                        </select>
                        <input
                          name="slug"
                          defaultValue={skill.slug}
                          placeholder={admin.slugLabel}
                          className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                          required
                        />
                        <StatusSelect
                          name="status"
                          defaultValue={skill.status}
                          labels={admin.statusLabels}
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                          <TranslationStatusSelect
                            name="translationStatusFr"
                            defaultValue={skill.translationStatus.fr}
                            labels={admin.translationStatusLabels}
                          />
                          <TranslationStatusSelect
                            name="translationStatusEn"
                            defaultValue={skill.translationStatus.en}
                            labels={admin.translationStatusLabels}
                          />
                        </div>
                        <input
                          name="titleFr"
                          defaultValue={skill.titleFr}
                          placeholder={admin.titleFrLabel}
                          className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                          required
                        />
                        <textarea
                          name="descriptionFr"
                          defaultValue={skill.descriptionFr}
                          placeholder={admin.descriptionFrLabel}
                          rows={3}
                          className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
                          required
                        />
                        <input
                          name="titleEn"
                          defaultValue={skill.titleEn}
                          placeholder={admin.titleEnLabel}
                          className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                          required
                        />
                        <textarea
                          name="descriptionEn"
                          defaultValue={skill.descriptionEn}
                          placeholder={admin.descriptionEnLabel}
                          rows={3}
                          className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
                          required
                        />
                        <Button type="submit" size="sm">
                          {admin.saveChangesAction}
                        </Button>
                      </form>
                    </details>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-600">{admin.emptyInventory}</div>
            )}
          </div>

          <div className="space-y-4">
            <div className="text-sm font-medium text-slate-950">
              {admin.questionsListTitle}
            </div>
            <form method="get" className="grid gap-3 rounded-[20px] border border-slate-200 bg-white/80 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                {admin.filtersTitle}
              </div>
              <select
                name="questionStatus"
                defaultValue={readModel.activeFilters.questionStatus ?? ""}
                className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
              >
                <option value="">{admin.allStatusesOption}</option>
                {contentStatuses.map((status) => (
                  <option key={status} value={status}>
                    {admin.statusLabels[status]}
                  </option>
                ))}
              </select>
              <select
                name="questionFormat"
                defaultValue={readModel.activeFilters.questionFormat ?? ""}
                className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
              >
                <option value="">{admin.allFormatsOption}</option>
                {readModel.editableQuestionFormats.map((format) => (
                  <option key={format} value={format}>
                    {learn.formatLabels[format]}
                  </option>
                ))}
              </select>
              <div className="flex flex-wrap gap-3">
                <Button type="submit" size="sm">
                  {admin.applyFiltersAction}
                </Button>
                <Link
                  href="/dashboard/admin"
                  className={buttonVariants({ variant: "secondary", size: "sm" })}
                >
                  {admin.clearFiltersAction}
                </Link>
              </div>
            </form>
            {readModel.questions.length > 0 ? (
              readModel.questions.map((question) => (
                <div
                  key={question.id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4"
                >
                  <div className="space-y-3">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {question.slug}
                    </div>
                    <div className="font-medium text-slate-950">
                      {question.prompt}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 text-sm text-slate-600">
                      <Badge className="border-slate-200 bg-white text-slate-700">
                        {question.skillTitle}
                      </Badge>
                      <span>{question.moduleTitle}</span>
                      <span>·</span>
                      <span>{learn.formatLabels[question.format]}</span>
                      <span>·</span>
                      <span>
                        {admin.difficultyLabel}: {question.difficulty}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Badge className="border-slate-200 bg-white text-slate-700">
                        FR: {admin.translationStatusLabels[question.translationStatus.fr]}
                      </Badge>
                      <Badge className="border-slate-200 bg-white text-slate-700">
                        EN: {admin.translationStatusLabels[question.translationStatus.en]}
                      </Badge>
                      <Badge className="border-slate-200 bg-white text-slate-700">
                        {admin.optionsCountLabel}: {question.optionsCount}
                      </Badge>
                      <Badge className="border-slate-200 bg-white text-slate-700">
                        {admin.attemptsCountLabel}: {question.attemptsCount}
                      </Badge>
                      {question.pitfallTagTitles.map((pitfallTagTitle, index) => (
                        <Badge
                          key={`${question.id}-pitfall-${question.pitfallTagSlugs[index]}`}
                          className="border-slate-200 bg-white text-slate-700"
                        >
                          {pitfallTagTitle}
                        </Badge>
                      ))}
                      <Badge
                        className={
                          question.checklist.isPublishable
                            ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                            : "border-amber-200 bg-amber-50 text-amber-700"
                        }
                      >
                        {question.checklist.isPublishable
                          ? admin.publishableState
                          : admin.blockedState}
                      </Badge>
                    </div>
                    {question.checklist.issues.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {question.checklist.issues.map((issue) => (
                          <Badge
                            key={`${question.id}-${issue}`}
                            className="border-amber-200 bg-amber-50 text-amber-700"
                          >
                            {admin.issueLabels[issue]}
                          </Badge>
                        ))}
                      </div>
                    ) : null}
                    <form action={updateContentStatusAction} className="flex flex-wrap gap-3">
                      <input type="hidden" name="entity" value="question" />
                      <input type="hidden" name="id" value={question.id} />
                      <StatusSelect
                        name="status"
                        defaultValue={question.status}
                        labels={admin.statusLabels}
                      />
                      <Button type="submit" variant="secondary">
                        {admin.updateStatusAction}
                      </Button>
                    </form>
                    <Link
                      href={`/learn/questions/${question.slug}`}
                      className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                      {admin.openAction}
                    </Link>
                    <details className="rounded-[20px] border border-slate-200 bg-white/90 p-4">
                      <summary className="cursor-pointer text-sm font-medium text-slate-700">
                        {admin.editAction}
                      </summary>
                      <form action={updateAdminQuestionAction} className="mt-4 grid gap-4">
                        <input type="hidden" name="id" value={question.id} />
                        {!question.canEditOptions &&
                        (question.format === QuestionFormat.SINGLE_CHOICE ||
                          question.format === QuestionFormat.MULTIPLE_CHOICE) ? (
                          <input type="hidden" name="format" value={question.format} />
                        ) : null}
                        <select
                          name="moduleId"
                          defaultValue={question.moduleId}
                          className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                          required
                        >
                          {readModel.moduleOptions.map((module) => (
                            <option key={module.id} value={module.id}>
                              {module.title}
                            </option>
                          ))}
                        </select>
                        <select
                          name="primarySkillId"
                          defaultValue={question.primarySkillId}
                          className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                          required
                        >
                          {readModel.skillOptions.map((skill) => (
                            <option key={skill.id} value={skill.id}>
                              {skill.moduleTitle} · {skill.title}
                            </option>
                          ))}
                        </select>
                        <input
                          name="slug"
                          defaultValue={question.slug}
                          placeholder={admin.slugLabel}
                          className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                          required
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                          <select
                            name="format"
                            defaultValue={question.format}
                            disabled={
                              !question.canEditOptions &&
                              (question.format === QuestionFormat.SINGLE_CHOICE ||
                                question.format === QuestionFormat.MULTIPLE_CHOICE)
                            }
                            className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                          >
                            {readModel.editableQuestionFormats.map((format) => (
                              <option key={format} value={format}>
                                {learn.formatLabels[format]}
                              </option>
                            ))}
                          </select>
                          <select
                            name="level"
                            defaultValue={question.level}
                            className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                          >
                            {Object.entries(levelLabels).map(([value, label]) => (
                              <option key={value} value={value}>
                                {label}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="grid gap-4 sm:grid-cols-3">
                          <input
                            name="difficulty"
                            type="number"
                            min={1}
                            max={5}
                            defaultValue={question.difficulty}
                            className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                          />
                          <input
                            name="estimatedTimeSec"
                            type="number"
                            min={0}
                            max={7200}
                            defaultValue={question.estimatedTimeSec ?? ""}
                            placeholder={admin.estimatedTimeSecLabel}
                            className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                          />
                          <StatusSelect
                            name="status"
                            defaultValue={question.status}
                            labels={admin.statusLabels}
                          />
                        </div>
                        <input
                          name="sourceType"
                          defaultValue={question.sourceType ?? ""}
                          placeholder={admin.sourceTypeLabel}
                          className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                        />
                        <PitfallTagFieldset
                          legend={admin.pitfallTagSelectionLabel}
                          hint={admin.pitfallTagSelectionHint}
                          emptyHint={admin.noPitfallTagsHint}
                          pitfallTags={readModel.pitfallTagOptions}
                          selectedSlugs={question.pitfallTagSlugs}
                        />
                        <div className="grid gap-4 sm:grid-cols-2">
                          <TranslationStatusSelect
                            name="translationStatusFr"
                            defaultValue={question.translationStatus.fr}
                            labels={admin.translationStatusLabels}
                          />
                          <TranslationStatusSelect
                            name="translationStatusEn"
                            defaultValue={question.translationStatus.en}
                            labels={admin.translationStatusLabels}
                          />
                        </div>
                        <textarea
                          name="promptFr"
                          defaultValue={question.promptFr}
                          placeholder={admin.promptFrLabel}
                          rows={3}
                          className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
                          required
                        />
                        <textarea
                          name="explanationFr"
                          defaultValue={question.explanationFr}
                          placeholder={admin.explanationFrLabel}
                          rows={4}
                          className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
                          required
                        />
                        <textarea
                          name="takeawaysFr"
                          defaultValue={question.takeawaysFr}
                          placeholder={admin.takeawaysFrLabel}
                          rows={3}
                          className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
                          required
                        />
                        <textarea
                          name="promptEn"
                          defaultValue={question.promptEn}
                          placeholder={admin.promptEnLabel}
                          rows={3}
                          className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
                          required
                        />
                        <textarea
                          name="explanationEn"
                          defaultValue={question.explanationEn}
                          placeholder={admin.explanationEnLabel}
                          rows={4}
                          className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
                          required
                        />
                        <textarea
                          name="takeawaysEn"
                          defaultValue={question.takeawaysEn}
                          placeholder={admin.takeawaysEnLabel}
                          rows={3}
                          className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
                          required
                        />
                        <input
                          name="correctOptionIndexes"
                          defaultValue={question.correctOptionIndexes}
                          placeholder={admin.correctOptionIndexesLabel}
                          disabled={
                            !question.canEditOptions &&
                            (question.format === QuestionFormat.SINGLE_CHOICE ||
                              question.format === QuestionFormat.MULTIPLE_CHOICE)
                          }
                          className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-50"
                        />
                        <textarea
                          name="optionLabelsFr"
                          defaultValue={question.optionLabelsFr}
                          placeholder={admin.optionLabelsFrLabel}
                          rows={4}
                          disabled={
                            !question.canEditOptions &&
                            (question.format === QuestionFormat.SINGLE_CHOICE ||
                              question.format === QuestionFormat.MULTIPLE_CHOICE)
                          }
                          className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-50"
                        />
                        <textarea
                          name="optionExplanationsFr"
                          defaultValue={question.optionExplanationsFr}
                          placeholder={admin.optionExplanationsFrLabel}
                          rows={4}
                          disabled={
                            !question.canEditOptions &&
                            (question.format === QuestionFormat.SINGLE_CHOICE ||
                              question.format === QuestionFormat.MULTIPLE_CHOICE)
                          }
                          className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-50"
                        />
                        <textarea
                          name="optionLabelsEn"
                          defaultValue={question.optionLabelsEn}
                          placeholder={admin.optionLabelsEnLabel}
                          rows={4}
                          disabled={
                            !question.canEditOptions &&
                            (question.format === QuestionFormat.SINGLE_CHOICE ||
                              question.format === QuestionFormat.MULTIPLE_CHOICE)
                          }
                          className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-50"
                        />
                        <textarea
                          name="optionExplanationsEn"
                          defaultValue={question.optionExplanationsEn}
                          placeholder={admin.optionExplanationsEnLabel}
                          rows={4}
                          disabled={
                            !question.canEditOptions &&
                            (question.format === QuestionFormat.SINGLE_CHOICE ||
                              question.format === QuestionFormat.MULTIPLE_CHOICE)
                          }
                          className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950 disabled:cursor-not-allowed disabled:bg-slate-50"
                        />
                        {!question.canEditOptions &&
                        (question.format === QuestionFormat.SINGLE_CHOICE ||
                          question.format === QuestionFormat.MULTIPLE_CHOICE) ? (
                          <div className="text-sm leading-6 text-amber-700">
                            {admin.optionsLockedHint}
                          </div>
                        ) : null}
                        <Button type="submit" size="sm">
                          {admin.saveChangesAction}
                        </Button>
                      </form>
                    </details>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-600">{admin.emptyInventory}</div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{admin.pitfallTagsListTitle}</CardTitle>
          <CardDescription>{admin.pitfallTagsListDescription}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 xl:grid-cols-2">
            {readModel.pitfallTags.length > 0 ? (
              readModel.pitfallTags.map((pitfallTag) => (
                <div
                  key={pitfallTag.id}
                  className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4"
                >
                  <div className="space-y-3">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {pitfallTag.slug}
                    </div>
                    <div className="font-medium text-slate-950">{pitfallTag.title}</div>
                    <div className="text-sm leading-6 text-slate-600">
                      {pitfallTag.description}
                    </div>
                    <div className="text-sm text-slate-600">
                      {admin.questionLinksCountLabel}: {pitfallTag.questionCount}
                    </div>
                    <div className="text-sm text-slate-500">
                      {updatedAtFormatter.format(pitfallTag.updatedAt)}
                    </div>
                    <details className="rounded-[20px] border border-slate-200 bg-white/90 p-4">
                      <summary className="cursor-pointer text-sm font-medium text-slate-700">
                        {admin.editAction}
                      </summary>
                      <form action={updateAdminPitfallTagAction} className="mt-4 grid gap-4">
                        <input type="hidden" name="id" value={pitfallTag.id} />
                        <input
                          name="slug"
                          defaultValue={pitfallTag.slug}
                          placeholder={admin.slugLabel}
                          className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                          required
                        />
                        <input
                          name="title"
                          defaultValue={pitfallTag.title}
                          placeholder={admin.pitfallTagTitleLabel}
                          className="flex h-11 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950"
                          required
                        />
                        <textarea
                          name="description"
                          defaultValue={pitfallTag.description}
                          placeholder={admin.pitfallTagDescriptionLabel}
                          rows={4}
                          className="w-full rounded-[24px] border border-slate-200 bg-white px-4 py-3 text-sm text-slate-950"
                          required
                        />
                        <Button type="submit" size="sm">
                          {admin.saveChangesAction}
                        </Button>
                      </form>
                    </details>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-sm text-slate-600">{admin.noPitfallTagsHint}</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
