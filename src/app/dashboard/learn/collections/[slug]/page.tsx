import { LearnCollectionPage } from "@/features/learn/learn-collection-page";

export default async function DashboardLearnCollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  return <LearnCollectionPage slug={slug} mode="dashboard" />;
}
