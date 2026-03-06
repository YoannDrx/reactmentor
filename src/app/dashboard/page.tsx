import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getLocalizedMockTemplates,
  getLocalizedRecentSessions,
  getLocalizedReviewQueue,
} from "@/features/dashboard/dashboard-view-model";
import {
  SkillRadarChart,
  WeeklyMomentumChart,
} from "@/features/dashboard/dashboard-charts";
import { getI18n } from "@/i18n/server";
import { Target } from "lucide-react";

export default async function DashboardOverviewPage() {
  const { messages } = await getI18n();
  const overview = messages.dashboard.overview;
  const reviewQueue = getLocalizedReviewQueue(messages);
  const recentSessions = getLocalizedRecentSessions(messages);
  const mockTemplates = getLocalizedMockTemplates(messages).slice(0, 2);

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 xl:grid-cols-4">
        {overview.stats.map((stat) => (
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
            <CardDescription>{overview.weeklyMomentumDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <WeeklyMomentumChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{overview.skillReadinessTitle}</CardTitle>
            <CardDescription>{overview.skillReadinessDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <SkillRadarChart />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{overview.dueTitle}</CardTitle>
            <CardDescription>{overview.dueDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviewQueue.map((item) => (
              <div
                key={item.title}
                className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4"
              >
                <div className="mb-3 flex items-center justify-between gap-3">
                  <Badge className="border-orange-200 bg-orange-50 text-orange-700">
                    {item.urgency}
                  </Badge>
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    {item.skill}
                  </div>
                </div>
                <div className="font-medium text-slate-950">{item.title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {item.reason}
                </p>
              </div>
            ))}
          </CardContent>
        </Card>

        <div className="grid gap-6">
          <Card>
            <CardHeader>
              <CardTitle>{overview.recentTitle}</CardTitle>
              <CardDescription>{overview.recentDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recentSessions.map((session) => (
                <div
                  key={session.id}
                  className="flex items-start justify-between gap-4 rounded-[24px] border border-slate-200 bg-white p-4"
                >
                  <div>
                    <div className="font-medium text-slate-950">{session.title}</div>
                    <div className="mt-1 text-sm text-slate-500">
                      {session.duration}
                    </div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {session.summary}
                    </p>
                  </div>
                  <div className="rounded-full bg-emerald-50 px-3 py-1 text-sm font-medium text-emerald-700">
                    {session.score}%
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{overview.nextMockTitle}</CardTitle>
              <CardDescription>{overview.nextMockDescription}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {mockTemplates.map((template) => (
                <div
                  key={template.title}
                  className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4"
                >
                  <div className="mb-2 flex items-center gap-2">
                    <Target className="size-4 text-cyan-600" />
                    <div className="font-medium text-slate-950">
                      {template.title}
                    </div>
                  </div>
                  <p className="text-sm leading-6 text-slate-600">
                    {template.description}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
