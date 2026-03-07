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
  getLocalizedMockTemplates,
} from "@/features/dashboard/dashboard-view-model";
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
  const templates = getLocalizedMockTemplates(messages);
  const templateTitles = Object.fromEntries(
    mockTemplateKeys.map((key, index) => [key, templates[index]?.title ?? key]),
  );
  const mockReadModel = await getMockInterviewReadModel(user.id);
  const recentSessions = mockReadModel.sessions;
  const templateAvailabilities = await getMockTemplateAvailabilities();
  const completedAtFormatter = new Intl.DateTimeFormat(locale, {
    dateStyle: "medium",
    timeStyle: "short",
  });

  const getTemplateTitle = (templateKey: string | null | undefined) => {
    if (!templateKey) {
      return mockInterviews.fallbackSessionTitle;
    }

    return templateTitles[templateKey as keyof typeof templateTitles] ?? templateKey;
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
                  <input type="hidden" name="templateKey" value={templateKey} />
                  <Button
                    type="submit"
                    className="w-full"
                    disabled={availableQuestions === 0}
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
              <CardDescription>{mockInterviews.overviewDescription}</CardDescription>
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
                              {t("dashboard.mockInterviews.recentSessionDuration", {
                                count: template.durationBudgetMinutes,
                              })}
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

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{mockInterviews.historyTitle}</CardTitle>
            <CardDescription>{mockInterviews.historyDescription}</CardDescription>
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
                      <div className="font-medium text-slate-950">{sessionTitle}</div>
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
