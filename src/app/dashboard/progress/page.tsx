import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
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
import { getDashboardRecommendation } from "@/features/dashboard/dashboard-recommendations";
import { getDashboardReadModel } from "@/features/dashboard/dashboard-read-model";
import { getI18n } from "@/i18n/server";
import { getRequiredUser } from "@/lib/auth/auth-user";
import { formatPercent } from "@/lib/utils";
import Link from "next/link";

export default async function DashboardProgressPage() {
  const user = await getRequiredUser("/dashboard/progress");
  const { locale, messages } = await getI18n();
  const progress = messages.dashboard.progress;
  const readModel = await getDashboardReadModel(user.id, locale);
  const recommendation = await getDashboardRecommendation(user.id, locale);
  const skillRadar = readModel.progress.skillBreakdown;
  const weeklyMomentumData = readModel.progress.weeklyMomentum.map((item) => ({
    day: messages.common.days[item.dayKey],
    score: item.score,
  }));
  const masteryData = [
    {
      band: messages.dashboard.masteryLabels.new,
      value: readModel.progress.masteryDistribution.new,
    },
    {
      band: messages.dashboard.masteryLabels.learning,
      value: readModel.progress.masteryDistribution.learning,
    },
    {
      band: messages.dashboard.masteryLabels.reviewing,
      value: readModel.progress.masteryDistribution.reviewing,
    },
    {
      band: messages.dashboard.masteryLabels.mastered,
      value: readModel.progress.masteryDistribution.mastered,
    },
  ];

  return (
    <div className="grid gap-6">
      {!readModel.hasAttempts ? (
        <Card className="border-dashed border-slate-300 bg-slate-50/80">
          <CardContent className="space-y-4 pt-6 text-sm leading-6 text-slate-600">
            <div className="font-medium text-slate-950">{progress.emptyTitle}</div>
            <p className="mt-2">{progress.emptyDescription}</p>
            {recommendation.kind === "module" ? (
              <Link
                href={`/dashboard/modules/${recommendation.moduleSlug}`}
                className={buttonVariants({ variant: "primary", size: "md" })}
              >
                {progress.emptyModuleAction}
              </Link>
            ) : recommendation.kind === "review" ? (
              <Link
                href="/dashboard/review"
                className={buttonVariants({ variant: "secondary", size: "md" })}
              >
                {progress.emptyReviewAction}
              </Link>
            ) : null}
          </CardContent>
        </Card>
      ) : null}

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{progress.masteryMapTitle}</CardTitle>
            <CardDescription>{progress.masteryMapDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <SkillRadarChart data={skillRadar} />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{progress.distributionTitle}</CardTitle>
            <CardDescription>{progress.distributionDescription}</CardDescription>
          </CardHeader>
          <CardContent>
            <MasteryBreakdownChart data={masteryData} />
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
            <WeeklyMomentumChart data={weeklyMomentumData} />
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
