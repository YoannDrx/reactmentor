import { redirect } from "next/navigation";
import { LearnQuestionPage as LearnQuestionPageContent } from "@/features/learn/learn-question-page";
import { getUser } from "@/lib/auth/auth-user";

export default async function LearnQuestionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getUser();

  if (user) {
    redirect(`/dashboard/learn/questions/${slug}`);
  }

  return <LearnQuestionPageContent slug={slug} mode="public" userId={null} />;
}
