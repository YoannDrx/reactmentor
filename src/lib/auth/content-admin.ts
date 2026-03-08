import { redirect } from "next/navigation";
import { getUser } from "@/lib/auth/auth-user";

const contentAdminRoles = new Set(["admin", "editor"]);

export function isContentAdminRole(role?: string | null) {
  const normalizedRole = role?.trim().toLowerCase() ?? "";
  return contentAdminRoles.has(normalizedRole);
}

export function isContentAdminUser(
  user: { role?: string | null } | null | undefined,
) {
  return isContentAdminRole(user?.role);
}

export async function requireContentAdmin(callbackUrl = "/dashboard/admin") {
  const user = await getUser();

  if (!user) {
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }

  if (!isContentAdminUser(user)) {
    redirect("/dashboard");
  }

  return user;
}

export const getRequiredContentAdminUser = requireContentAdmin;
