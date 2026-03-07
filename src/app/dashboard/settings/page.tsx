import { QuestionLevel } from "@prisma/client";
import { SettingsForm } from "@/features/settings/settings-form";
import { getUserPreferences } from "@/features/settings/user-preferences";
import { getI18n } from "@/i18n/server";
import { getRequiredUser } from "@/lib/auth/auth-user";

export default async function DashboardSettingsPage() {
  const user = await getRequiredUser("/dashboard/settings");
  const { messages } = await getI18n();
  const preference = await getUserPreferences(user.id);

  const levelLabels: Record<QuestionLevel, string> = {
    [QuestionLevel.JUNIOR]: messages.common.levels.junior,
    [QuestionLevel.MID]: messages.common.levels.mid,
    [QuestionLevel.SENIOR]: messages.common.levels.senior,
  };

  return (
    <SettingsForm
      preference={preference}
      messages={messages.dashboard.settings}
      trackLabels={messages.dashboard.trackLabels}
      levelLabels={levelLabels}
    />
  );
}
