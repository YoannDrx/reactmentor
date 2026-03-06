import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  MasteryBreakdownChart,
  SkillRadarChart,
  WeeklyMomentumChart,
} from "@/features/dashboard/dashboard-charts";
import { getLocalizedSkillRadar } from "@/features/dashboard/dashboard-view-model";
import { getI18n } from "@/i18n/server";
import { formatPercent } from "@/lib/utils";

export default async function DashboardProgressPage() {
  const { messages } = await getI18n();
  const progress = messages.dashboard.progress;
  const skillRadar = getLocalizedSkillRadar(messages);

  return (
    <div className="grid gap-6">
      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{progress.masteryMapTitle}</CardTitle>
            <CardDescription>{progress.masteryMapDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <SkillRadarChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{progress.distributionTitle}</CardTitle>
            <CardDescription>{progress.distributionDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <MasteryBreakdownChart />
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>{progress.signalTitle}</CardTitle>
            <CardDescription>{progress.signalDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <WeeklyMomentumChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{progress.skillBySkillTitle}</CardTitle>
            <CardDescription>{progress.skillBySkillDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {skillRadar.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between gap-4 rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3"
              >
                <div>
                  <div className="font-medium text-slate-950">{item.skill}</div>
                  <div className="text-sm text-slate-500">
                    {item.score >= 75
                      ? progress.notes.stable
                      : item.score >= 60
                        ? progress.notes.medium
                        : progress.notes.fragile}
                  </div>
                </div>
                <Badge
                  className={
                    item.score >= 75
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : item.score >= 60
                        ? "border-cyan-200 bg-cyan-50 text-cyan-700"
                        : "border-orange-200 bg-orange-50 text-orange-700"
                  }
                >
                  {formatPercent(item.score)}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
