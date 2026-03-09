import { redirect } from "next/navigation";
import { LearnLibraryPage } from "@/features/learn/learn-library-page";
import { getUser } from "@/lib/auth/auth-user";

export default async function LearnPage() {
  const user = await getUser();

  if (user) {
    redirect("/dashboard/learn");
  }

  return <LearnLibraryPage mode="public" />;
}
