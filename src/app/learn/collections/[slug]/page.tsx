import { ArrowLeft, Layers3, PlayCircle } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { LearnHeader } from "@/features/learn/learn-header";
import { QuestionPreviewCard } from "@/features/learn/question-preview-card";
import { createTrainingSessionAction } from "@/features/sessions/session.action";
import { getI18n } from "@/i18n/server";
import { getLocalizedQuestionCollectionBySlug } from "@/lib/content-repository";

export default async function LearnCollectionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { locale, messages } = await getI18n();
  const common = messages.common;
  const learn = messages.learn;
  const collection = await getLocalizedQuestionCollectionBySlug(slug, locale);

  if (!collection) {
    notFound();
  }

  const questionIds = collection.questions
    .slice(0, 6)
    .map((question) => question.id);

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6efe6_0%,#ffffff_22%,#eef7fb_100%)]">
      <LearnHeader
        libraryLabel={learn.index.badge}
        signInLabel={common.actions.logIn}
        createWorkspaceLabel={common.actions.createWorkspace}
        brandTagline={common.brandTagline}
      />

      <main className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:px-8">
        <div>
          <Link
            href="/learn"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-slate-950"
          >
            <ArrowLeft className="size-4" />
            {learn.collection.backToLibrary}
          </Link>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <Card className="border-slate-200 bg-white">
            <CardHeader className="space-y-4">
              <div className="inline-flex w-fit rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
                {collection.counts.questions}{" "}
                {learn.collection.questionCountLabel.toLowerCase()}
              </div>
              <div className="space-y-3">
                <CardTitle className="text-4xl text-slate-950">
                  {collection.title}
                </CardTitle>
                <CardDescription className="text-base leading-8">
                  {collection.description}
                </CardDescription>
              </div>
            </CardHeader>
            <CardContent>
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5 text-sm leading-7 text-slate-600">
                {collection.summary ?? collection.description}
              </div>
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-slate-950 text-white">
            <CardHeader className="space-y-3">
              <div className="flex items-center gap-2 text-sm font-medium text-cyan-200">
                <Layers3 className="size-4" />
                {learn.collection.startCollectionPractice}
              </div>
              <CardTitle className="text-white">
                {learn.collection.practiceCardTitle}
              </CardTitle>
              <CardDescription className="text-slate-300">
                {learn.collection.practiceCardDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <form action={createTrainingSessionAction}>
                <input type="hidden" name="mode" value="PRACTICE" />
                <input type="hidden" name="locale" value={locale} />
                <input
                  type="hidden"
                  name="questionCount"
                  value={Math.min(6, Math.max(1, questionIds.length))}
                />
                {questionIds.map((questionId) => (
                  <input
                    key={questionId}
                    type="hidden"
                    name="questionIds"
                    value={questionId}
                  />
                ))}
                <Button
                  type="submit"
                  className="w-full"
                  disabled={questionIds.length === 0}
                >
                  <PlayCircle className="size-4" />
                  {learn.collection.startCollectionPractice}
                </Button>
              </form>
            </CardContent>
          </Card>
        </section>

        {collection.questions.length === 0 ? (
          <Card className="border-dashed border-slate-300 bg-white">
            <CardContent className="pt-6 text-sm leading-7 text-slate-600">
              <div className="font-medium text-slate-950">
                {learn.collection.emptyTitle}
              </div>
              <p className="mt-2">{learn.collection.emptyDescription}</p>
            </CardContent>
          </Card>
        ) : (
          <section className="grid gap-6">
            {collection.questions.map((question) => (
              <QuestionPreviewCard
                key={question.id}
                locale={locale}
                question={question}
                readLessonLabel={learn.collection.openQuestion}
                focusedPracticeLabel={learn.collection.focusedPractice}
                skillLabel={learn.question.skillLabel}
                moduleLabel={learn.question.moduleLabel}
                levelLabels={common.levels}
                formatLabels={learn.formatLabels}
                estimatedReadMinutesLabel={
                  learn.question.estimatedReadMinutesLabel
                }
              />
            ))}
          </section>
        )}
      </main>
    </div>
  );
}
