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
} from "@/features/dashboard/dashboard-view-model";
import { getI18n } from "@/i18n/server";
import { Clock3, MessagesSquare } from "lucide-react";

export default async function DashboardMockInterviewsPage() {
  const { messages } = await getI18n();
  const mockInterviews = messages.dashboard.mockInterviews;
  const templates = getLocalizedMockTemplates(messages);
  const recentSessions = getLocalizedRecentSessions(messages);

  return (
    <div className="grid gap-6">
      <section className="grid gap-6 xl:grid-cols-3">
        {templates.map((template) => (
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
            </CardContent>
          </Card>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card>
          <CardHeader>
            <CardTitle>{mockInterviews.historyTitle}</CardTitle>
            <CardDescription>{mockInterviews.historyDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentSessions.map((session) => (
              <div
                key={session.id}
                className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4"
              >
                <div className="mb-2 flex items-center justify-between gap-3">
                  <div className="font-medium text-slate-950">{session.title}</div>
                  <Badge className="border-emerald-200 bg-emerald-50 text-emerald-700">
                    {session.score}%
                  </Badge>
                </div>
                <div className="mb-2 text-sm text-slate-500">{session.duration}</div>
                <p className="text-sm leading-6 text-slate-600">
                  {session.summary}
                </p>
              </div>
            ))}
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
