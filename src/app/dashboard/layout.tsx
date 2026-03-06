import { DashboardShell } from "@/features/dashboard/dashboard-shell";
import { getRequiredUser } from "@/lib/auth/auth-user";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getRequiredUser("/dashboard");

  return (
    <DashboardShell
      user={{
        name: user.name,
        email: user.email,
      }}
    >
      {children}
    </DashboardShell>
  );
}
