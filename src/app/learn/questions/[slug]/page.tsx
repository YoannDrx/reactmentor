import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Code2,
  CornerDownRight,
  Layers3,
  Sparkles,
} from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants, Button } from "@/components/ui/button";
import { LearnHeader } from "@/features/learn/learn-header";
import { createTrainingSessionAction } from "@/features/sessions/session.action";
import { getI18n } from "@/i18n/server";
import { getLocalizedQuestionBySlug } from "@/lib/content-repository";

function splitParagraphs(text: string | null) {
  if (!text) {
    return [];
  }

  return text
    .split(/\n\s*\n/)
    .map((paragraph) => paragraph.trim())
    .filter((paragraph) => paragraph.length > 0);
}

function formatReadTime(template: string, count: number) {
  return template.replace("{count}", String(count));
}

function formatCollectionProgress(
  template: string,
  current: number,
  total: number,
) {
  return template
    .replace("{current}", String(current))
    .replace("{total}", String(total));
}

export default async function LearnQuestionPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const { locale, messages } = await getI18n();
  const common = messages.common;
  const learn = messages.learn;
  const question = await getLocalizedQuestionBySlug(slug, locale);

  if (!question) {
    notFound();
  }

  const levelLabel =
    common.levels[question.level.toLowerCase() as keyof typeof common.levels];
  const readTimeLabel = question.estimatedReadMinutes
    ? formatReadTime(
        learn.question.estimatedReadMinutesLabel,
        question.estimatedReadMinutes,
      )
    : null;
  const lessonParagraphs = splitParagraphs(question.lessonBody);
  const primaryCollectionJourney = question.primaryCollectionJourney;
  const collectionProgressLabel = primaryCollectionJourney
    ? formatCollectionProgress(
        learn.question.collectionProgressLabel,
        primaryCollectionJourney.position,
        primaryCollectionJourney.total,
      )
    : null;

  return (
    <div className="min-h-screen bg-[linear-gradient(180deg,#f6efe6_0%,#ffffff_20%,#eef7fb_100%)]">
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
            <CornerDownRight className="size-4" />
            {learn.question.backToLibrary}
          </Link>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <Card className="border-slate-200 bg-white">
            <CardHeader className="space-y-4">
              <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.22em] text-slate-500">
                <span>{learn.formatLabels[question.format]}</span>
                <span>•</span>
                <span>{levelLabel}</span>
                <span>•</span>
                <span>D{question.difficulty}</span>
                {readTimeLabel ? (
                  <>
                    <span>•</span>
                    <span>{readTimeLabel}</span>
                  </>
                ) : null}
              </div>
              <CardTitle className="text-4xl text-slate-950">
                {question.prompt}
              </CardTitle>
              <CardDescription className="text-base leading-8">
                {question.shortAnswer ?? question.tlDr ?? question.explanation}
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="border-slate-200 bg-slate-950 text-white">
            <CardHeader className="space-y-4">
              <CardTitle className="text-white">
                {learn.question.focusedPracticeTitle}
              </CardTitle>
              <CardDescription className="text-slate-300">
                {learn.question.focusedPracticeDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-3">
                <div className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  <div className="mb-1 flex items-center gap-2 font-medium text-white">
                    <Sparkles className="size-4 text-cyan-300" />
                    {learn.question.skillLabel}
                  </div>
                  {question.primarySkill.title}
                </div>
                <div className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                  <div className="mb-1 flex items-center gap-2 font-medium text-white">
                    <Layers3 className="size-4 text-cyan-300" />
                    {learn.question.moduleLabel}
                  </div>
                  {question.module.title}
                </div>
              </div>

              <form action={createTrainingSessionAction}>
                <input type="hidden" name="mode" value="PRACTICE" />
                <input type="hidden" name="locale" value={locale} />
                <input type="hidden" name="questionCount" value="1" />
                <input type="hidden" name="questionIds" value={question.id} />
                <Button type="submit" className="w-full">
                  <Clock3 className="size-4" />
                  {learn.question.focusedPracticeAction}
                </Button>
              </form>

              <Link
                href={`/dashboard/modules/${question.module.slug}`}
                className={buttonVariants({ variant: "secondary", size: "md" })}
              >
                {learn.question.openModuleAction}
              </Link>
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 lg:grid-cols-2">
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle>{learn.question.tlDrTitle}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-slate-700">
              {question.tlDr ?? question.explanation}
            </CardContent>
          </Card>

          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle>{learn.question.shortAnswerTitle}</CardTitle>
            </CardHeader>
            <CardContent className="text-sm leading-7 text-slate-700">
              {question.shortAnswer ?? question.explanation}
            </CardContent>
          </Card>
        </section>

        <Card className="border-slate-200 bg-white">
          <CardHeader>
            <CardTitle>{learn.question.lessonTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm leading-8 text-slate-700">
            {lessonParagraphs.length > 0 ? (
              lessonParagraphs.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))
            ) : (
              <p>{question.explanation}</p>
            )}
          </CardContent>
        </Card>

        {question.contextData?.kind === "bug_hunt" ? (
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle>{learn.question.bugHuntSnippetTitle}</CardTitle>
              <CardDescription>
                {question.contextData.snippetTitle ??
                  learn.question.bugHuntSnippetTitle}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <pre className="overflow-x-auto rounded-[24px] border border-slate-200 bg-slate-950 p-5 text-sm leading-7 text-slate-100">
                <code>{question.contextData.code}</code>
              </pre>
            </CardContent>
          </Card>
        ) : null}

        {question.exampleCode ? (
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <div className="flex items-center gap-2 text-sm font-medium text-cyan-700">
                <Code2 className="size-4" />
                {question.exampleTitle ?? learn.question.exampleTitleFallback}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <pre className="overflow-x-auto rounded-[24px] border border-slate-200 bg-slate-950 p-5 text-sm leading-7 text-slate-100">
                <code>{question.exampleCode}</code>
              </pre>
              {question.exampleExplanation ? (
                <p className="text-sm leading-7 text-slate-700">
                  {question.exampleExplanation}
                </p>
              ) : null}
            </CardContent>
          </Card>
        ) : null}

        {question.options.length > 0 ? (
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle>{learn.question.optionBreakdownTitle}</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4">
              {question.options.map((option) => (
                <div
                  key={option.id}
                  className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4"
                >
                  <div className="flex items-center gap-2 font-medium text-slate-950">
                    <CheckCircle2
                      className={
                        option.isCorrect
                          ? "size-4 text-emerald-600"
                          : "size-4 text-slate-400"
                      }
                    />
                    {option.label}
                  </div>
                  <p className="mt-2 text-sm leading-7 text-slate-600">
                    {option.explanation}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        ) : null}

        <section className="grid gap-6 lg:grid-cols-3">
          {question.commonMistakes.length > 0 ? (
            <Card className="border-slate-200 bg-white lg:col-span-1">
              <CardHeader>
                <CardTitle>{learn.question.commonMistakesTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.commonMistakes.map((mistake) => (
                  <div
                    key={mistake}
                    className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm leading-7 text-slate-700"
                  >
                    {mistake}
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {question.takeaways.length > 0 ? (
            <Card className="border-slate-200 bg-white lg:col-span-1">
              <CardHeader>
                <CardTitle>{learn.question.takeawaysTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.takeaways.map((takeaway) => (
                  <div
                    key={takeaway}
                    className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm leading-7 text-slate-700"
                  >
                    {takeaway}
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}

          {question.verbalizePoints.length > 0 ? (
            <Card className="border-slate-200 bg-white lg:col-span-1">
              <CardHeader>
                <CardTitle>{learn.question.verbalizePointsTitle}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {question.verbalizePoints.map((point) => (
                  <div
                    key={point}
                    className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm leading-7 text-slate-700"
                  >
                    {point}
                  </div>
                ))}
              </CardContent>
            </Card>
          ) : null}
        </section>

        {primaryCollectionJourney ? (
          <Card className="border-slate-200 bg-white">
            <CardHeader className="space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle>{learn.question.continueCollectionTitle}</CardTitle>
                {collectionProgressLabel ? (
                  <div className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-sm font-medium text-slate-700">
                    {collectionProgressLabel}
                  </div>
                ) : null}
              </div>
              <CardDescription>
                {primaryCollectionJourney.collection.title}
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4 lg:grid-cols-3">
              {primaryCollectionJourney.previousQuestion ? (
                <Link
                  href={`/learn/questions/${primaryCollectionJourney.previousQuestion.slug}`}
                  className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white"
                >
                  <div className="mb-2 flex items-center gap-2 font-medium text-slate-950">
                    <ArrowLeft className="size-4" />
                    {learn.question.previousQuestionAction}
                  </div>
                  <p className="leading-7">
                    {primaryCollectionJourney.previousQuestion.prompt}
                  </p>
                </Link>
              ) : (
                <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50/60 p-4 text-sm leading-7 text-slate-500">
                  {learn.question.startOfCollectionLabel}
                </div>
              )}

              <Link
                href={`/learn/collections/${primaryCollectionJourney.collection.slug}`}
                className="rounded-[22px] border border-slate-200 bg-slate-950 p-4 text-sm text-white transition hover:bg-slate-900"
              >
                <div className="mb-2 font-medium">
                  {learn.question.openCollectionAction}
                </div>
                <p className="leading-7 text-slate-300">
                  {primaryCollectionJourney.collection.summary ??
                    primaryCollectionJourney.collection.description}
                </p>
              </Link>

              {primaryCollectionJourney.nextQuestion ? (
                <Link
                  href={`/learn/questions/${primaryCollectionJourney.nextQuestion.slug}`}
                  className="rounded-[22px] border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-white"
                >
                  <div className="mb-2 flex items-center gap-2 font-medium text-slate-950">
                    <ArrowRight className="size-4" />
                    {learn.question.nextQuestionAction}
                  </div>
                  <p className="leading-7">
                    {primaryCollectionJourney.nextQuestion.prompt}
                  </p>
                </Link>
              ) : (
                <div className="rounded-[22px] border border-dashed border-slate-200 bg-slate-50/60 p-4 text-sm leading-7 text-slate-500">
                  {learn.question.endOfCollectionLabel}
                </div>
              )}
            </CardContent>
          </Card>
        ) : null}

        {question.collections.length > 0 ? (
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle>{learn.question.relatedCollectionsTitle}</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-3">
              {question.collections.map((collection) => (
                <Link
                  key={collection.id}
                  href={`/learn/collections/${collection.slug}`}
                  className={buttonVariants({
                    variant: "secondary",
                    size: "md",
                  })}
                >
                  {collection.title}
                </Link>
              ))}
            </CardContent>
          </Card>
        ) : null}
      </main>
    </div>
  );
}
