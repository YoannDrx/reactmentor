import { QuestionLevel } from "@prisma/client";
import { redirect } from "next/navigation";
import { LogoLockup } from "@/components/brand/logo";
import { LanguageToggle } from "@/features/i18n/language-toggle";
import { OnboardingWizard } from "@/features/onboarding/onboarding-wizard";
import { getUserPreferences } from "@/features/settings/user-preferences";
import { getI18n } from "@/i18n/server";
import { getRequiredUser } from "@/lib/auth/auth-user";

export default async function OnboardingPage() {
  const user = await getRequiredUser("/onboarding");
  const { messages } = await getI18n();
  const preference = await getUserPreferences(user.id);

  if (preference.isConfigured) {
    redirect("/dashboard");
  }

  const levelLabels: Record<QuestionLevel, string> = {
    [QuestionLevel.JUNIOR]: messages.common.levels.junior,
    [QuestionLevel.MID]: messages.common.levels.mid,
    [QuestionLevel.SENIOR]: messages.common.levels.senior,
  };

  return (
    <div className="relative min-h-screen bg-[radial-gradient(circle_at_top_left,rgba(14,165,233,0.16),transparent_28%),linear-gradient(180deg,#fbf7f0_0%,#f3ece3_38%,#eee2d5_100%)]">
      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6 lg:right-8 lg:top-8">
        <LanguageToggle />
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mb-8">
          <LogoLockup tagline={messages.common.brandTagline} />
        </div>

        <OnboardingWizard
          preference={preference}
          messages={messages.onboarding}
          settingsMessages={messages.dashboard.settings}
          trackLabels={messages.dashboard.trackLabels}
          levelLabels={levelLabels}
        />
      </div>
    </div>
  );
}
