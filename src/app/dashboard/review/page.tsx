import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getLocalizedReviewQueue } from "@/features/dashboard/dashboard-view-model";
import { getI18n } from "@/i18n/server";
import { BrainCircuit, CircleAlert, Repeat } from "lucide-react";

export default async function DashboardReviewPage() {
  const { messages } = await getI18n();
  const review = messages.dashboard.review;
  const reviewQueue = getLocalizedReviewQueue(messages);
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
      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>{review.queueTitle}</CardTitle>
            <CardDescription>{review.queueDescription}</CardDescription>
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
