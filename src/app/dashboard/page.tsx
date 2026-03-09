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
  SkillRadarChart,
  WeeklyMomentumChart,
} from "@/features/dashboard/dashboard-charts";
import {
  getDashboardReadModel,
  getMockInterviewReadModel,
} from "@/features/dashboard/dashboard-read-model";
import { getDashboardRecommendation } from "@/features/dashboard/dashboard-recommendations";
import { getMockTemplateAvailabilities } from "@/features/sessions/session-builder";
import { createTrainingSessionAction } from "@/features/sessions/session.action";
import { mockTemplateKeys } from "@/features/sessions/session-contract";
import { getI18n } from "@/i18n/server";
import { getRequiredUser } from "@/lib/auth/auth-user";
import { Target } from "lucide-react";
import Link from "next/link";

export default async function DashboardOverviewPage() {
  const user = await getRequiredUser("/dashboard");
  const { locale, messages, t } = await getI18n();
  const overview = messages.dashboard.overview;
  const localizedMockTemplates = messages.dashboard.mockTemplates;
  const mockTemplateMap = Object.fromEntries(
    mockTemplateKeys.map((key, index) => [key, localizedMockTemplates[index]]),
  );
  const readModel = await getDashboardReadModel(user.id, locale);
  const mockReadModel = await getMockInterviewReadModel(user.id, locale);
  const recommendation = await getDashboardRecommendation(user.id, locale);
  const templateAvailabilities = await getMockTemplateAvailabilities();
  const reviewQueue = readModel.overview.dueItems;
  const recentSessions = readModel.overview.recentSessions;
  const learnOverview = readModel.overview.learn;
  const learnFollowUpItems = readModel.progress.learn.items;
  const reviewQuestionCount = Math.min(
    10,
    Math.max(1, readModel.overview.stats.dueToday),
  );
  const weeklyMomentumData = readModel.overview.weeklyMomentum.map((item) => ({
    day: messages.common.days[item.dayKey],
    score: item.score,
  }));
  const skillReadinessData = readModel.overview.skillReadiness.map((item) => ({
    skill: item.skill,
    score: item.score,
  }));
  const prioritizedMockKeys = [
    ...(mockReadModel.recommendedTemplate
      ? [mockReadModel.recommendedTemplate.templateKey]
      : []),
    ...mockTemplateKeys.filter(
      (key) => key !== mockReadModel.recommendedTemplate?.templateKey,
    ),
  ].slice(0, 2);
  const statCards = [
    {
      label: overview.stats[0]?.label ?? "",
      value: `${readModel.overview.stats.readiness}/100`,
      change: overview.statChanges.readiness,
    },
    {
      label: overview.stats[1]?.label ?? "",
      value: String(readModel.overview.stats.masteredQuestions),
      change: t("dashboard.overview.statChanges.mastered", {
        count: readModel.overview.stats.masteredQuestions,
        total: readModel.overview.stats.totalQuestions,
      }),
    },
    {
      label: overview.stats[2]?.label ?? "",
      value: String(readModel.overview.stats.dueToday),
      change:
        readModel.overview.stats.dueToday > 0
          ? overview.statChanges.dueActive
          : overview.statChanges.dueClear,
    },
    {
      label: overview.stats[3]?.label ?? "",
      value: String(readModel.overview.stats.completedMocks),
      change:
        readModel.overview.stats.completedMocks > 0
          ? t("dashboard.overview.statChanges.mocks", {
              count: readModel.overview.stats.completedMocks,
            })
          : overview.statChanges.noMocks,
    },
  ];
  const learnStatCards = [
    {
      label: overview.learnTrackedLabel,
      value: learnOverview.viewedCount,
      tone: "text-slate-950",
    },
    {
      label: overview.learnCheckpointReadyLabel,
      value: learnOverview.checkpointReadyCount,
      tone: "text-emerald-700",
    },
    {
      label: overview.learnNeedsPracticeLabel,
      value: learnOverview.readWithoutPracticeCount,
      tone: "text-cyan-700",
    },
    {
      label: overview.learnReviewQueuedLabel,
      value: learnOverview.lessonReviewQueuedCount,
      tone: "text-amber-700",
    },
  ];
  const showLearnLoop =
    learnOverview.viewedCount > 0 || learnFollowUpItems.length > 0;

  return (
    <div className="grid gap-6">
      {recommendation.kind !== "none" ? (
        <Card className="overflow-hidden border-slate-950 bg-slate-950 text-white">
          <CardHeader className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
            <div className="space-y-3">
              <Badge className="w-fit border-white/10 bg-white/10 text-white">
                {overview.recommendedTitle}
              </Badge>
              <div className="space-y-2">
                <CardTitle className="text-white">
                  {recommendation.kind === "review"
                    ? overview.recommendedReviewTitle
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
                      {overview.recommendedDueLabel}
                    </div>
                    <div className="mt-2 text-2xl font-semibold text-white">
                      {recommendation.dueCount}
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      {overview.recommendedSessionSizeLabel}
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
                      {overview.recommendedTrackLabel}
                    </div>
                    <div className="mt-2 text-base font-semibold text-white">
                      {messages.dashboard.trackLabels[recommendation.track]}
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      {overview.recommendedProgressLabel}
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
              <div className="flex flex-wrap gap-3">
                <form action={createTrainingSessionAction}>
                  <input type="hidden" name="mode" value="REVIEW" />
                  <input type="hidden" name="locale" value={locale} />
                  <input
                    type="hidden"
                    name="questionCount"
                    value={String(recommendation.questionCount)}
                  />
                  <Button type="submit">{overview.startReviewAction}</Button>
                </form>
                <Link
                  href="/dashboard/learn"
                  className={buttonVariants({ variant: "secondary", size: "md" })}
                >
                  {overview.openLearnLibraryAction}
                </Link>
              </div>
            ) : (
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/dashboard/modules/${recommendation.moduleSlug}`}
                  className={buttonVariants({ variant: "primary", size: "md" })}
                >
                  {overview.recommendedModuleAction}
                </Link>
                <Link
                  href="/dashboard/learn"
                  className={buttonVariants({ variant: "secondary", size: "md" })}
                >
                  {overview.openLearnLibraryAction}
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-4 xl:grid-cols-4">
        {statCards.map((stat) => (
          <Card key={stat.label}>
            <CardContent className="space-y-3 pt-6">
              <div className="text-sm text-slate-500">{stat.label}</div>
              <div className="font-display text-4xl font-semibold text-slate-950">
                {stat.value}
              </div>
              <Badge className="w-fit border-slate-200 bg-slate-100 text-slate-700">
                {stat.change}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <Card>
          <CardHeader>
            <CardTitle>{overview.weeklyMomentumTitle}</CardTitle>
            <CardDescription>
              {overview.weeklyMomentumDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <WeeklyMomentumChart data={weeklyMomentumData} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{overview.skillReadinessTitle}</CardTitle>
            <CardDescription>
              {overview.skillReadinessDescription}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SkillRadarChart data={skillReadinessData} />
          </CardContent>
        </Card>
      </section>

      {showLearnLoop ? (
        <section className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <CardTitle>{overview.learnLoopTitle}</CardTitle>
                  <CardDescription>
                    {overview.learnLoopDescription}
                  </CardDescription>
                </div>
                <Link href="/dashboard/progress">
                  <Button variant="secondary">
                    {overview.openProgressAction}
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              {learnStatCards.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4"
                >
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {stat.label}
                  </div>
                  <div className={`mt-2 text-2xl font-semibold ${stat.tone}`}>
                    {stat.value}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{overview.learnQueueTitle}</CardTitle>
              <CardDescription>{overview.learnQueueDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {learnFollowUpItems.length > 0 ? (
                learnFollowUpItems.map((item) => (
                  <div
                    key={item.questionId}
                    className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4"
                  >
                    <div>
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        {item.module}
                      </div>
                      <div className="mt-2 font-medium text-slate-950">
                        {item.title}
                      </div>
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {overview.learnReasonLabels[item.reason]}
                    </p>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span>{item.skill}</span>
                      <span className="text-slate-300">•</span>
                      <span>
                        {overview.lessonViewsLabel}: {item.lessonViews}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>
                        {overview.checkpointAttemptsLabel}:{" "}
                        {item.checkpointAttempts}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3">
                      <Link
                        href={`/dashboard/learn/questions/${item.questionSlug}`}
                        className={buttonVariants({ variant: "secondary", size: "sm" })}
                      >
                        {overview.openLessonAction}
                      </Link>
                      <form action={createTrainingSessionAction}>
                        <input type="hidden" name="mode" value="PRACTICE" />
                        <input type="hidden" name="locale" value={locale} />
                        <input type="hidden" name="questionCount" value="1" />
                        <input
                          type="hidden"
                          name="questionIds"
                          value={item.questionId}
                        />
                        <Button type="submit" size="sm" variant="ghost">
                          {overview.startFocusedPracticeAction}
                        </Button>
                      </form>
                    </div>
                  </div>
                ))
              ) : (
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600">
                  <div className="font-medium text-slate-950">
                    {overview.learnQueueEmptyTitle}
                  </div>
                  <p className="mt-2">{overview.learnQueueEmptyDescription}</p>
                </div>
              )}
            </CardContent>
          </Card>
        </section>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <CardTitle>{overview.dueTitle}</CardTitle>
                <CardDescription>{overview.dueDescription}</CardDescription>
              </div>
              {readModel.overview.stats.dueToday > 0 ? (
                <form action={createTrainingSessionAction}>
                  <input type="hidden" name="mode" value="REVIEW" />
                  <input type="hidden" name="locale" value={locale} />
                  <input
                    type="hidden"
                    name="questionCount"
                    value={String(reviewQuestionCount)}
                  />
                  <Button type="submit">{overview.startReviewAction}</Button>
                </form>
              ) : (
                <Link href="/dashboard/review">
                  <Button variant="secondary">
                    {overview.openReviewAction}
                  </Button>
                </Link>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviewQueue.length > 0 ? (
              reviewQueue.map((item) => (
                <div
                  key={item.questionId}
                  className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4"
                >
                  <div className="mb-3 flex items-center justify-between gap-3">
                    <Badge className="border-orange-200 bg-orange-50 text-orange-700">
                      {overview.urgencyLabels[item.urgency]}
                    </Badge>
                    <div className="flex flex-col items-end gap-1 text-right">
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                        {item.skill}
                      </div>
                      <div className="text-xs text-slate-400">{item.module}</div>
                    </div>
                  </div>
                  <div className="font-medium text-slate-950">{item.title}</div>
                  {item.hasLessonSignal || !item.hasPracticeAttempts ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {item.hasLessonSignal ? (
                        <Badge className="border-cyan-200 bg-cyan-50 text-cyan-700">
                          {overview.learnSignalBadge}
                        </Badge>
                      ) : null}
                      {!item.hasPracticeAttempts ? (
                        <Badge className="border-slate-200 bg-white text-slate-700">
                          {overview.learnNoPracticeBadge}
                        </Badge>
                      ) : null}
                      {item.reason === "checkpointFailed" ? (
                        <Badge className="border-rose-200 bg-rose-50 text-rose-700">
                          {overview.checkpointFailedBadge}
                        </Badge>
                      ) : null}
                    </div>
                  ) : null}
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {overview.reasonLabels[item.reason]}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href={`/dashboard/learn/questions/${item.questionSlug}`}
                      className={buttonVariants({ variant: "secondary", size: "sm" })}
                    >
                      {overview.openLessonAction}
                    </Link>
                    <Link
                      href={`/dashboard/modules/${item.moduleSlug}`}
                      className={buttonVariants({ variant: "ghost", size: "sm" })}
                    >
                      {overview.openModuleAction}
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600">
                <div className="font-medium text-slate-950">
                  {overview.emptyDueTitle}
                </div>
                <p className="mt-2">{overview.emptyDueDescription}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{overview.recentTitle}</CardTitle>
              <CardDescription>{overview.recentDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentSessions.length > 0 ? (
                recentSessions.map((session) => (
                  <div
                    key={session.id}
                    className="flex items-start justify-between gap-4 rounded-[24px] border border-slate-200 bg-white p-4"
                  >
                    <div>
                      <div className="font-medium text-slate-950">
                        {overview.sessionModes[session.mode]}
                      </div>
                      <div className="mt-1 text-sm text-slate-500">
                        {t("dashboard.overview.recentSessionDuration", {
                          count: session.durationMinutes,
                        })}
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {t("dashboard.overview.recentSessionSummary", {
                          count: session.answersCount,
                          mode: overview.sessionModes[session.mode],
                        })}
                      </p>
                    </div>
                    {session.score === null ? (
                      <div className="rounded-full bg-cyan-50 px-3 py-1 text-sm font-medium text-cyan-700">
                        {messages.dashboard.session.scorePendingLabel}
                      </div>
                    ) : (
                      <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                        {session.score}%
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600">
                  <div className="font-medium text-slate-950">
                    {overview.emptyRecentTitle}
                  </div>
                  <p className="mt-2">{overview.emptyRecentDescription}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{overview.nextMockTitle}</CardTitle>
              <CardDescription>{overview.nextMockDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {prioritizedMockKeys.map((templateKey) => {
                const template = mockTemplateMap[templateKey];
                const availableQuestions = templateKey
                  ? templateAvailabilities[templateKey]
                  : 0;
                const isRecommended =
                  mockReadModel.recommendedTemplate?.templateKey ===
                  templateKey;

                if (!template) {
                  return null;
                }

                return (
                  <div
                    key={templateKey}
                    className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4"
                  >
                    <div className="mb-2 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <Target className="size-4 text-cyan-600" />
                        <div className="font-medium text-slate-950">
                          {template.title}
                        </div>
                      </div>
                      {isRecommended ? (
                        <Badge className="border-cyan-200 bg-cyan-50 text-cyan-700">
                          {
                            messages.dashboard.mockInterviews
                              .recommendedTemplateTitle
                          }
                        </Badge>
                      ) : null}
                    </div>
                    <p className="text-sm leading-6 text-slate-600">
                      {template.description}
                    </p>
                    {isRecommended && mockReadModel.recommendedTemplate ? (
                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        {
                          messages.dashboard.mockInterviews
                            .recommendedTemplateReasons[
                            mockReadModel.recommendedTemplate.reason
                          ]
                        }
                      </p>
                    ) : null}
                    {templateKey ? (
                      <form
                        action={createTrainingSessionAction}
                        className="mt-4"
                      >
                        <input
                          type="hidden"
                          name="mode"
                          value="MOCK_INTERVIEW"
                        />
                        <input type="hidden" name="locale" value={locale} />
                        <input
                          type="hidden"
                          name="templateKey"
                          value={templateKey}
                        />
                        <Button
                          type="submit"
                          disabled={availableQuestions === 0}
                        >
                          {overview.launchMockAction}
                        </Button>
                      </form>
                    ) : null}
                    {availableQuestions === 0 ? (
                      <p className="mt-3 text-sm leading-6 text-slate-500">
                        {overview.mockUnavailable}
                      </p>
                    ) : null}
                  </div>
                );
              })}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
