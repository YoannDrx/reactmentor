import { redirect } from "next/navigation";
import { LearnCollectionPage as LearnCollectionPageContent } from "@/features/learn/learn-collection-page";
import { getUser } from "@/lib/auth/auth-user";

export default async function LearnCollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const user = await getUser();

  if (user) {
    redirect(`/dashboard/learn/collections/${slug}`);
  }

  return <LearnCollectionPageContent slug={slug} mode="public" />;
}
