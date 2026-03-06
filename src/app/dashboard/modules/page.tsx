import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getLocalizedModules } from "@/features/dashboard/dashboard-view-model";
import { getI18n } from "@/i18n/server";
import { Sparkles } from "lucide-react";

export default async function DashboardModulesPage() {
  const { messages, t } = await getI18n();
  const modules = getLocalizedModules(messages);
  const modulesContent = messages.dashboard.modules;
  const common = messages.common;

  return (
    <div className="grid gap-6">
      <section className="grid gap-4 lg:grid-cols-3">
        {modulesContent.metrics.map((metric) => (
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
        {modules.map((module) => (
          <Card key={module.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-4">
                <div>
                  <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                    {module.track}
                  </div>
                  <CardTitle>{module.title}</CardTitle>
                </div>
                <Badge className="border-slate-200 bg-slate-100 text-slate-700">
                  {common.levels[module.level as keyof typeof common.levels]}
                </Badge>
              </div>
              <CardDescription>{module.summary}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm text-slate-600">
                  <span>{modulesContent.completionLabel}</span>
                  <span>{module.completion}%</span>
                </div>
                <Progress value={module.completion} />
              </div>

              <div className="flex flex-wrap gap-2">
                {module.focus.map((focus) => (
                  <Badge
                    key={focus}
                    className="border-white bg-slate-50 text-slate-700"
                  >
                    {focus}
                  </Badge>
                ))}
              </div>

              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600">
                {t("dashboard.modules.questionsSummary", {
                  count: module.questions,
                })}
              </div>
            </CardContent>
          </Card>
        ))}
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
