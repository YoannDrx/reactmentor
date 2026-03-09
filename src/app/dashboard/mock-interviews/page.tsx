import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUserEntitlementSnapshot } from "@/features/billing/user-entitlements";
import { getMockInterviewReadModel } from "@/features/dashboard/dashboard-read-model";
import { createTrainingSessionAction } from "@/features/sessions/session.action";
import { getMockTemplateAvailabilities } from "@/features/sessions/session-builder";
import {
  mockTemplateKeys,
  parseTrainingSessionConfig,
} from "@/features/sessions/session-contract";
import { getI18n } from "@/i18n/server";
import { getRequiredUser } from "@/lib/auth/auth-user";
import { Clock3, MessagesSquare } from "lucide-react";
import Link from "next/link";

export default async function DashboardMockInterviewsPage() {
  const user = await getRequiredUser("/dashboard/mock-interviews");
  const { locale, messages, t } = await getI18n();
  const mockInterviews = messages.dashboard.mockInterviews;
  const entitlements = messages.dashboard.entitlements;
  const rubricCriteriaLabels = messages.dashboard.session.rubricCriteriaLabels;
  const templates = messages.dashboard.mockTemplates;
  const templateTitles = Object.fromEntries(
    mockTemplateKeys.map((key, index) => [key, templates[index]?.title ?? key]),
  );
  const [mockReadModel, templateAvailabilities, entitlement] =
    await Promise.all([
      getMockInterviewReadModel(user.id, locale),
      getMockTemplateAvailabilities(),
      getUserEntitlementSnapshot(user.id),
    ]);
  const recentSessions = mockReadModel.sessions;
  const completedAtFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });
  const resetFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
  });
  const nextResetDate =
    entitlement.currentPeriodEndsAt ??
    new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
  const recommendedTemplate = mockReadModel.recommendedTemplate;
  const recommendedTemplateAvailability = recommendedTemplate
    ? templateAvailabilities[recommendedTemplate.templateKey]
    : 0;
  const canLaunchMocks = entitlement.canStartMockInterview;
  const mockQuotaValue = entitlement.hasUnlimitedMocks
    ? entitlements.mockQuotaValues.unlimited
    : canLaunchMocks
      ? t("dashboard.entitlements.mockQuotaValues.available", {
          count: entitlement.mocksRemainingThisPeriod ?? 0,
        })
      : entitlements.mockQuotaValues.exhausted;
  const mockQuotaHint = entitlement.hasUnlimitedMocks
    ? entitlements.mockQuotaValues.unlimited
    : canLaunchMocks
      ? t("dashboard.entitlements.gates.mockInterviews.available", {
          count: entitlement.mocksRemainingThisPeriod ?? 0,
        })
      : entitlements.gates.mockInterviews.exhausted;
  const recoveryReviewQuestionIds = mockReadModel.recoveryQuestions
    .filter((question) => question.status === "due")
    .map((question) => question.questionId);

  const getTemplateTitle = (templateKey: string | null | undefined) => {
    if (!templateKey) {
      return mockInterviews.fallbackSessionTitle;
    }

    return (
      templateTitles[templateKey as keyof typeof templateTitles] ?? templateKey
    );
  };

  const latestMomentumDescription =
    mockReadModel.summary.latestDelta === null
      ? mockInterviews.noTrendYet
      : t(
          `dashboard.mockInterviews.momentumDescriptions.${mockReadModel.summary.latestTrend}`,
          {
            count: Math.abs(mockReadModel.summary.latestDelta),
          },
        );

  return (
    <div className="grid gap-6">
      <Card
        className={
          canLaunchMocks
            ? "border-cyan-200 bg-cyan-50/60"
            : "border-amber-200 bg-amber-50/80"
        }
      >
        <CardHeader className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <div className="space-y-3">
            <Badge
              className={
                canLaunchMocks
                  ? "w-fit border-cyan-200 bg-cyan-100 text-cyan-800"
                  : "w-fit border-amber-200 bg-amber-100 text-amber-800"
              }
            >
              {entitlements.gates.mockInterviews.badge}
            </Badge>
            <div className="space-y-2">
              <CardTitle>{entitlements.gates.mockInterviews.title}</CardTitle>
              <CardDescription
                className={
                  canLaunchMocks ? "text-cyan-950/80" : "text-amber-950/80"
                }
              >
                {entitlements.gates.mockInterviews.description}
              </CardDescription>
            </div>
          </div>
          <Badge className="w-fit border-slate-200 bg-white text-slate-700">
            {entitlements.planLabels[entitlement.plan]}
          </Badge>
        </CardHeader>
        <CardContent className="grid gap-4 lg:grid-cols-[1fr_1fr_1fr_auto] lg:items-center">
          <div className="rounded-[22px] border border-white/70 bg-white/80 px-4 py-3">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
              {entitlements.mockQuotaLabel}
            </div>
            <div className="mt-2 font-semibold text-slate-950">
              {mockQuotaValue}
            </div>
          </div>
          <div className="rounded-[22px] border border-white/70 bg-white/80 px-4 py-3">
            <div className="text-xs uppercase tracking-[0.18em] text-slate-500">
              {entitlements.nextResetLabel}
            </div>
            <div className="mt-2 font-semibold text-slate-950">
              {resetFormatter.format(nextResetDate)}
            </div>
          </div>
          <div className="rounded-[22px] border border-white/70 bg-white/80 px-4 py-3 text-sm leading-6 text-slate-700">
            {mockQuotaHint}
          </div>
          <Link
            href="/dashboard/settings"
            className={buttonVariants({ variant: "secondary", size: "md" })}
          >
            {entitlements.gates.mockInterviews.action}
          </Link>
        </CardContent>
      </Card>

      <section className="grid gap-6 xl:grid-cols-3">
        {templates.map((template, index) => {
          const templateKey = mockTemplateKeys[index];
          const availableQuestions = templateKey
            ? templateAvailabilities[templateKey]
            : 0;

          return (
            <Card key={template.title} className="h-full">
              <CardHeader>
                <Badge className="w-fit border-slate-200 bg-slate-100 text-slate-700">
                  {mockInterviews.timedMode}
                </Badge>
                <CardTitle>{template.title}</CardTitle>
                <CardDescription>{template.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600">
                  {template.composition}
                </div>
                <div className="grid gap-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2 rounded-[18px] bg-white px-3 py-2">
                    <Clock3 className="size-4 text-cyan-600" />
                    {mockInterviews.templateBadges.pace}
                  </div>
                  <div className="flex items-center gap-2 rounded-[18px] bg-white px-3 py-2">
                    <MessagesSquare className="size-4 text-cyan-600" />
                    {mockInterviews.templateBadges.defense}
                  </div>
                </div>
                {templateKey ? (
                  <form action={createTrainingSessionAction} className="pt-2">
                    <input type="hidden" name="mode" value="MOCK_INTERVIEW" />
                    <input type="hidden" name="locale" value={locale} />
                    <input
                      type="hidden"
                      name="templateKey"
                      value={templateKey}
                    />
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={!canLaunchMocks || availableQuestions === 0}
                    >
                      {mockInterviews.launchTemplate}
                    </Button>
                  </form>
                ) : null}
                {availableQuestions === 0 ? (
                  <p className="text-sm leading-6 text-slate-500">
                    {mockInterviews.templateUnavailable}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          );
        })}
      </section>

      {recentSessions.length > 0 ? (
        <section className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
          <Card>
            <CardHeader>
              <CardTitle>{mockInterviews.overviewTitle}</CardTitle>
              <CardDescription>
                {mockInterviews.overviewDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  {mockInterviews.completedMocksLabel}
                </div>
                <div className="mt-2 text-2xl font-semibold text-slate-950">
                  {mockReadModel.summary.completedCount}
                </div>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  {mockInterviews.averageScoreLabel}
                </div>
                <div className="mt-2 text-2xl font-semibold text-slate-950">
                  {mockReadModel.summary.averageScore}%
                </div>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  {mockInterviews.bestScoreLabel}
                </div>
                <div className="mt-2 text-2xl font-semibold text-slate-950">
                  {mockReadModel.summary.bestScore}%
                </div>
              </div>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  {mockInterviews.latestMomentumLabel}
                </div>
                <div className="mt-2 text-lg font-semibold text-slate-950">
                  {
                    mockInterviews.momentumStates[
                      mockReadModel.summary.latestTrend
                    ]
                  }
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {latestMomentumDescription}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{mockInterviews.templateSignalsTitle}</CardTitle>
              <CardDescription>
                {mockInterviews.templateSignalsDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                {mockReadModel.summary.strongestTemplate ? (
                  <div className="rounded-[24px] border border-emerald-200 bg-emerald-50/70 p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-emerald-700">
                      {mockInterviews.strongestTemplateLabel}
                    </div>
                    <div className="mt-2 font-semibold text-slate-950">
                      {getTemplateTitle(
                        mockReadModel.summary.strongestTemplate.templateKey,
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {mockReadModel.summary.strongestTemplate.averageScore}%
                    </p>
                  </div>
                ) : null}
                {mockReadModel.summary.weakestTemplate ? (
                  <div className="rounded-[24px] border border-amber-200 bg-amber-50/70 p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-amber-700">
                      {mockInterviews.needsWorkTemplateLabel}
                    </div>
                    <div className="mt-2 font-semibold text-slate-950">
                      {getTemplateTitle(
                        mockReadModel.summary.weakestTemplate.templateKey,
                      )}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {mockReadModel.summary.weakestTemplate.averageScore}%
                    </p>
                  </div>
                ) : null}
              </div>

              <div className="space-y-3">
                {mockReadModel.templateBreakdown.map((template) => (
                  <div
                    key={template.templateKey}
                    className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4"
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div className="font-medium text-slate-950">
                        {getTemplateTitle(template.templateKey)}
                      </div>
                      <Badge className="border-slate-200 bg-white text-slate-700">
                        {template.averageScore}%
                      </Badge>
                    </div>
                    <div className="mt-2 text-sm text-slate-500">
                      {t("dashboard.mockInterviews.templateSessionsSummary", {
                        count: template.sessionsCount,
                      })}
                    </div>
                    <div className="mt-3 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
                      <div>
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          {mockInterviews.averageScoreLabel}
                        </div>
                        <div className="mt-1 font-medium text-slate-950">
                          {template.averageScore}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          {mockInterviews.latestScoreLabel}
                        </div>
                        <div className="mt-1 font-medium text-slate-950">
                          {template.latestScore}%
                        </div>
                      </div>
                      <div>
                        <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                          {mockInterviews.averagePaceLabel}
                        </div>
                        <div className="mt-1 font-medium text-slate-950">
                          {t("dashboard.mockInterviews.recentSessionDuration", {
                            count: template.averageDurationMinutes,
                          })}
                          {template.durationBudgetMinutes ? (
                            <span className="text-slate-500">
                              {" "}
                              /{" "}
                              {t(
                                "dashboard.mockInterviews.recentSessionDuration",
                                {
                                  count: template.durationBudgetMinutes,
                                },
                              )}
                            </span>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>
      ) : null}

      {mockReadModel.criterionBreakdown.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>{mockInterviews.criterionSignalsTitle}</CardTitle>
            <CardDescription>
              {mockInterviews.criterionSignalsDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {mockReadModel.criterionBreakdown.map((criterion) => (
              <div
                key={criterion.criterion}
                className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div className="font-medium text-slate-950">
                    {rubricCriteriaLabels[criterion.criterion]}
                  </div>
                  <Badge
                    className={
                      criterion.averageScore >= 80
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : criterion.averageScore >= 60
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-rose-200 bg-rose-50 text-rose-700"
                    }
                  >
                    {criterion.averageScore}%
                  </Badge>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between gap-3">
                    <span>{mockInterviews.criterionReviewCountLabel}</span>
                    <span className="font-medium text-slate-950">
                      {criterion.reviewCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>{mockInterviews.criterionMissingLabel}</span>
                    <span className="font-medium text-slate-950">
                      {criterion.missingCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>{mockInterviews.criterionPartialLabel}</span>
                    <span className="font-medium text-slate-950">
                      {criterion.partialCount}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {recommendedTemplate ? (
        <Card className="border-slate-950 bg-slate-950 text-white">
          <CardHeader className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <CardTitle className="text-white">
                {mockInterviews.recommendedTemplateTitle}
              </CardTitle>
              <CardDescription className="text-slate-300">
                {mockInterviews.recommendedTemplateDescription}
              </CardDescription>
            </div>
            <Badge className="border-white/10 bg-white/10 text-white">
              {getTemplateTitle(recommendedTemplate.templateKey)}
            </Badge>
          </CardHeader>
          <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="max-w-3xl text-sm leading-6 text-slate-300">
              {
                mockInterviews.recommendedTemplateReasons[
                  recommendedTemplate.reason
                ]
              }
            </p>
            <form action={createTrainingSessionAction}>
              <input type="hidden" name="mode" value="MOCK_INTERVIEW" />
              <input type="hidden" name="locale" value={locale} />
              <input
                type="hidden"
                name="templateKey"
                value={recommendedTemplate.templateKey}
              />
              <Button
                type="submit"
                disabled={!canLaunchMocks || recommendedTemplateAvailability === 0}
              >
                {mockInterviews.launchRecommendedTemplate}
              </Button>
            </form>
          </CardContent>
        </Card>
      ) : null}

      {mockReadModel.weaknessHighlights.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>{mockInterviews.weaknessTitle}</CardTitle>
            <CardDescription>
              {mockInterviews.weaknessDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 xl:grid-cols-3">
            {mockReadModel.weaknessHighlights.map((weakness) => (
              <div
                key={weakness.skillSlug}
                className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {weakness.module}
                    </div>
                    <div className="mt-2 font-medium text-slate-950">
                      {weakness.skill}
                    </div>
                  </div>
                  <Badge
                    className={
                      weakness.averageScore >= 80
                        ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                        : weakness.averageScore >= 60
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-rose-200 bg-rose-50 text-rose-700"
                    }
                  >
                    {weakness.averageScore}%
                  </Badge>
                </div>
                <div className="mt-4 grid gap-3 text-sm text-slate-600">
                  <div className="flex items-center justify-between gap-3">
                    <span>{mockInterviews.weaknessAverageLabel}</span>
                    <span className="font-medium text-slate-950">
                      {weakness.averageScore}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>{mockInterviews.weaknessDueLabel}</span>
                    <span className="font-medium text-slate-950">
                      {weakness.dueCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>{mockInterviews.weaknessBookmarksLabel}</span>
                    <span className="font-medium text-slate-950">
                      {weakness.bookmarkedCount}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span>{mockInterviews.weaknessNotesLabel}</span>
                    <span className="font-medium text-slate-950">
                      {weakness.noteCount}
                    </span>
                  </div>
                </div>
                {weakness.dominantCriterion ? (
                  <div className="mt-4 rounded-[18px] border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
                    <span className="font-medium text-slate-950">
                      {mockInterviews.weaknessCriterionLabel}
                    </span>{" "}
                    {rubricCriteriaLabels[weakness.dominantCriterion]}
                  </div>
                ) : null}
                {weakness.prompts.length > 0 ? (
                  <div className="mt-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {mockInterviews.weaknessPromptLabel}
                    </div>
                    <div className="mt-3 space-y-2">
                      {weakness.prompts.map((prompt) => (
                        <div
                          key={`${weakness.skillSlug}-${prompt}`}
                          className="rounded-[18px] border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-700"
                        >
                          {prompt}
                        </div>
                      ))}
                    </div>
                  </div>
                ) : null}
                <div className="mt-4">
                  <Link
                    href={`/dashboard/modules/${weakness.moduleSlug}`}
                    className="text-sm font-medium text-cyan-700 transition hover:text-cyan-800"
                  >
                    {mockInterviews.openWeaknessModuleAction}
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      {mockReadModel.recoveryQuestions.length > 0 ? (
        <Card>
          <CardHeader className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
            <div>
              <CardTitle>{mockInterviews.recoveryTitle}</CardTitle>
              <CardDescription>
                {mockInterviews.recoveryDescription}
              </CardDescription>
            </div>
            <form action={createTrainingSessionAction}>
              <input type="hidden" name="mode" value="REVIEW" />
              <input type="hidden" name="locale" value={locale} />
              <input
                type="hidden"
                name="questionCount"
                value={String(recoveryReviewQuestionIds.length)}
              />
              {recoveryReviewQuestionIds.map((questionId) => (
                <input
                  key={`mock-recovery-${questionId}`}
                  type="hidden"
                  name="questionIds"
                  value={questionId}
                />
              ))}
              <Button
                type="submit"
                variant="secondary"
                disabled={recoveryReviewQuestionIds.length === 0}
              >
                {mockInterviews.launchRecoveryReviewAction}
              </Button>
            </form>
          </CardHeader>
          <CardContent className="grid gap-4 xl:grid-cols-2">
            {mockReadModel.recoveryQuestions.map((question) => (
              <div
                key={question.questionId}
                className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {question.module}
                    </div>
                    <div className="mt-2 font-medium text-slate-950">
                      {question.prompt}
                    </div>
                    <div className="mt-2 text-sm text-slate-500">
                      {question.skill}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge
                      className={
                        question.status === "due"
                          ? "border-amber-200 bg-amber-50 text-amber-700"
                          : "border-slate-200 bg-white text-slate-700"
                      }
                    >
                      {mockInterviews.recoveryStatusLabels[question.status]}
                    </Badge>
                    {question.dominantCriterion ? (
                      <Badge className="border-slate-200 bg-white text-slate-700">
                        {rubricCriteriaLabels[question.dominantCriterion]}
                      </Badge>
                    ) : null}
                    {question.isBookmarked ? (
                      <Badge className="border-cyan-200 bg-cyan-50 text-cyan-700">
                        {mockInterviews.weaknessBookmarksLabel}
                      </Badge>
                    ) : null}
                    {question.noteBody ? (
                      <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                        {mockInterviews.weaknessNotesLabel}
                      </Badge>
                    ) : null}
                  </div>
                </div>
                {question.noteBody ? (
                  <div className="mt-4 rounded-[18px] border border-slate-200 bg-white px-3 py-2 text-sm leading-6 text-slate-600">
                    {question.noteBody}
                  </div>
                ) : null}
                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={`/dashboard/learn/questions/${question.questionSlug}`}
                    className={buttonVariants({ variant: "secondary", size: "sm" })}
                  >
                    {mockInterviews.openLessonAction}
                  </Link>
                  <Link
                    href={`/dashboard/modules/${question.moduleSlug}`}
                    className="inline-flex h-10 items-center rounded-full border border-transparent px-4 text-sm font-medium text-cyan-700 transition hover:text-cyan-800"
                  >
                    {mockInterviews.openWeaknessModuleAction}
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{mockInterviews.historyTitle}</CardTitle>
            <CardDescription>
              {mockInterviews.historyDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSessions.length > 0 ? (
              recentSessions.map((session) => {
                const config = parseTrainingSessionConfig(session.config);
                const sessionTitle = config?.templateKey
                  ? getTemplateTitle(config.templateKey)
                  : mockInterviews.fallbackSessionTitle;

                return (
                  <div
                    key={session.id}
                    className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="font-medium text-slate-950">
                        {sessionTitle}
                      </div>
                      <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                        {session.score}%
                      </Badge>
                    </div>
                    <div className="mb-2 text-xs uppercase tracking-[0.22em] text-slate-400">
                      {mockInterviews.completedAtLabel}
                    </div>
                    <div className="mb-2 text-sm text-slate-500">
                      {completedAtFormatter.format(
                        session.endedAt ?? new Date(),
                      )}
                    </div>
                    <div className="mb-2 text-sm text-slate-500">
                      {t("dashboard.mockInterviews.recentSessionDuration", {
                        count: session.durationMinutes,
                      })}
                    </div>
                    <p className="text-sm leading-6 text-slate-600">
                      {t("dashboard.mockInterviews.recentSessionSummary", {
                        count: session.answersCount,
                      })}
                    </p>
                    <div className="mt-3">
                      <Link
                        href={`/dashboard/session/${session.id}`}
                        className="text-sm font-medium text-cyan-700 transition hover:text-cyan-800"
                      >
                        {mockInterviews.openReport}
                      </Link>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600">
                <div className="font-medium text-slate-950">
                  {mockInterviews.historyEmptyTitle}
                </div>
                <p className="mt-2">{mockInterviews.historyEmptyDescription}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-950 text-white">
          <CardHeader>
            <CardTitle className="text-white">
              {mockInterviews.philosophyTitle}
            </CardTitle>
            <CardDescription className="text-slate-300">
              {mockInterviews.philosophyDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mockInterviews.philosophyItems.map((item) => (
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
