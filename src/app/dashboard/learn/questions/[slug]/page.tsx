import { LearnQuestionPage } from "@/features/learn/learn-question-page";
import { getRequiredUser } from "@/lib/auth/auth-user";

export default async function DashboardLearnQuestionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getRequiredUser(`/dashboard/learn/questions/${slug}`);

  return <LearnQuestionPage slug={slug} mode="dashboard" userId={user.id} />;
}
