import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardReadModel } from "@/features/dashboard/dashboard-read-model";
import { createTrainingSessionAction } from "@/features/sessions/session.action";
import { getI18n } from "@/i18n/server";
import { getRequiredUser } from "@/lib/auth/auth-user";
import { BrainCircuit, CircleAlert, Repeat } from "lucide-react";

export default async function DashboardReviewPage() {
  const user = await getRequiredUser("/dashboard/review");
  const { locale, messages } = await getI18n();
  const review = messages.dashboard.review;
  const readModel = await getDashboardReadModel(user.id, locale);
  const reviewQueue = readModel.review.items;
  const reviewQuestionCount = Math.min(10, Math.max(1, readModel.review.dueCount));
  const howItWorks = [
    {
      icon: CircleAlert,
      label: review.howItems[0],
    },
    {
      icon: BrainCircuit,
      label: review.howItems[1],
    },
    {
      icon: Repeat,
      label: review.howItems[2],
    },
  ];

  return (
    <div className="grid gap-6">
      <Card className="bg-slate-950 text-white">
        <CardHeader className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <CardTitle className="text-white">{review.launchTitle}</CardTitle>
            <CardDescription className="text-slate-300">
              {review.launchDescription}
            </CardDescription>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:min-w-[16rem]">
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                {review.dueNowLabel}
              </div>
              <div className="mt-2 text-2xl font-semibold text-white">
                {readModel.review.dueCount}
              </div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                {review.nextSessionSizeLabel}
              </div>
              <div className="mt-2 text-2xl font-semibold text-cyan-200">
                {readModel.review.dueCount > 0 ? reviewQuestionCount : 0}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm leading-6 text-slate-300">
            {readModel.review.dueCount > 0
              ? review.queueDescription
              : review.launchUnavailable}
          </div>
          <form action={createTrainingSessionAction}>
            <input type="hidden" name="mode" value="REVIEW" />
            <input type="hidden" name="locale" value={locale} />
            <input
              type="hidden"
              name="questionCount"
              value={String(reviewQuestionCount)}
            />
            <Button type="submit" disabled={readModel.review.dueCount === 0}>
              {review.launchAction}
            </Button>
          </form>
        </CardContent>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>{review.queueTitle}</CardTitle>
            <CardDescription>{review.queueDescription}</CardDescription>
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
                      {review.urgencyLabels[item.urgency]}
                    </Badge>
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      {item.skill}
                    </div>
                  </div>
                  <div className="font-medium text-slate-950">{item.title}</div>
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {review.reasonLabels[item.reason]}
                  </p>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600">
                <div className="font-medium text-slate-950">{review.emptyTitle}</div>
                <p className="mt-2">{review.emptyDescription}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-950 text-white">
          <CardHeader>
            <CardTitle className="text-white">{review.howTitle}</CardTitle>
            <CardDescription className="text-slate-300">
              {review.howDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {howItWorks.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
              >
                <item.icon className="size-4 text-cyan-300" />
                {item.label}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
