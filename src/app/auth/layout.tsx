import { LogoLockup } from "@/components/brand/logo";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { getLocalizedModules } from "@/features/dashboard/dashboard-view-model";
import { LanguageToggle } from "@/features/i18n/language-toggle";
import { getI18n } from "@/i18n/server";
import { Sparkles } from "lucide-react";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { messages } = await getI18n();
  const previewModules = getLocalizedModules(messages).slice(0, 3);
  const auth = messages.auth;

  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.15),transparent_32%),linear-gradient(180deg,#fbf7f0_0%,#f3ece3_40%,#eee2d5_100%)]">
      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6 lg:right-8 lg:top-8">
        <LanguageToggle />
      </div>
      <div className="mx-auto grid min-h-screen max-w-7xl gap-8 px-4 py-6 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-8">
        <Card className="hidden overflow-hidden bg-slate-950 text-white lg:flex">
          <CardContent className="relative flex flex-1 flex-col justify-between p-8">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(34,211,238,0.16),transparent_24%),radial-gradient(circle_at_80%_20%,rgba(255,107,74,0.16),transparent_18%)]" />
            <div className="relative space-y-6">
              <LogoLockup
                theme="dark"
                tagline={messages.common.brandTagline}
              />
              <div className="space-y-3">
                <Badge className="w-fit border-white/15 bg-white/8 text-slate-200">
                  <Sparkles className="size-3.5 text-cyan-300" />
                  {auth.layout.badge}
                </Badge>
                <h1 className="font-display text-5xl font-semibold leading-tight tracking-tight text-white">
                  {auth.layout.title}
                </h1>
                <p className="max-w-lg text-lg leading-8 text-slate-300">
                  {auth.layout.description}
                </p>
              </div>
            </div>

            <div className="relative space-y-4">
              {previewModules.map((module) => (
                <div
                  key={module.id}
                  className="rounded-[24px] border border-white/10 bg-white/5 p-4"
                >
                  <div className="mb-2 flex items-center justify-between gap-3">
                    <div className="font-medium text-white">{module.title}</div>
                    <Badge className="border-white/10 bg-white/10 text-cyan-100">
                      {module.completion}%
                    </Badge>
                  </div>
                  <div className="text-sm leading-6 text-slate-300">
                    {module.summary}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="flex items-center justify-center py-8 lg:py-12">
          <div className="w-full max-w-xl space-y-6">{children}</div>
        </div>
      </div>
    </div>
  );
}
