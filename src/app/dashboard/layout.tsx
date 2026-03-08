import { isContentAdminRole } from "@/lib/auth/content-admin";
import { DashboardShell } from "@/features/dashboard/dashboard-shell";
import { getDashboardShellSnapshot } from "@/features/dashboard/dashboard-shell-data";
import { getUserPreferences } from "@/features/settings/user-preferences";
import { getI18n } from "@/i18n/server";
import { getRequiredUser } from "@/lib/auth/auth-user";
import { redirect } from "next/navigation";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getRequiredUser("/dashboard");
  const { locale } = await getI18n();
  const preferences = await getUserPreferences(user.id);

  if (!preferences.isConfigured) {
    redirect("/onboarding");
  }

  const sidebarSnapshot = await getDashboardShellSnapshot(user.id, locale);

  return (
    <DashboardShell
      user={{
        name: user.name,
        email: user.email,
        isContentAdmin: isContentAdminRole(user.role),
      }}
      sidebarSnapshot={sidebarSnapshot}
    >
      {children}
    </DashboardShell>
  );
}
