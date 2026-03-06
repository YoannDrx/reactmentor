import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getI18n } from "@/i18n/server";

export default async function DashboardSettingsPage() {
  const { messages } = await getI18n();
  const settings = messages.dashboard.settings;

  return (
    <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
      <Card>
        <CardHeader>
          <CardTitle>{settings.targetTitle}</CardTitle>
          <CardDescription>{settings.targetDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {settings.targetItems.map((item) => (
            <div
              key={item.label}
              className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3"
            >
              <div className="text-sm text-slate-500">{item.label}</div>
              <div className="mt-1 font-medium text-slate-950">{item.value}</div>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{settings.postureTitle}</CardTitle>
          <CardDescription>{settings.postureDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {settings.postureItems.map((item) => (
            <Badge
              key={item}
              className="mr-2 border-slate-200 bg-slate-100 text-slate-700"
            >
              {item}
            </Badge>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
