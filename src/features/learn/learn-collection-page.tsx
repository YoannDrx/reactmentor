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
import { QuestionPreviewCard } from "@/features/learn/question-preview-card";
import { createTrainingSessionAction } from "@/features/sessions/session.action";
import { getI18n } from "@/i18n/server";
import { getLocalizedQuestionCollectionBySlug } from "@/lib/content-repository";
import {
  getLearnLibraryHref,
  getLearnQuestionHref,
  type LearnSurfaceMode,
} from "./learn-paths";
import { LearnSurface } from "./learn-surface";
import { LearnWorkspaceAccessCard } from "./learn-workspace-access-card";

export async function LearnCollectionPage(props: {
  slug: string;
  mode: LearnSurfaceMode;
}) {
  const { locale, messages } = await getI18n();
  const common = messages.common;
  const learn = messages.learn;
  const gating = messages.learn.gating;
  const collection = await getLocalizedQuestionCollectionBySlug(
    props.slug,
    locale,
  );

  if (!collection) {
    notFound();
  }

  const questionIds = collection.questions
    .slice(0, 6)
    .map((question) => question.id);
  const callbackUrl = `${getLearnLibraryHref(props.mode)}/collections/${collection.slug}`;
  const previewQuestions = collection.questions.slice(0, 4);

  return (
    <LearnSurface
      mode={props.mode}
      header={{
        libraryLabel: learn.index.badge,
        signInLabel: common.actions.logIn,
        createWorkspaceLabel: common.actions.createWorkspace,
        brandTagline: common.brandTagline,
      }}
    >
      <div>
        <Link
          href={getLearnLibraryHref(props.mode)}
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

        {props.mode === "dashboard" ? (
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
                <input type="hidden" name="callbackUrl" value={callbackUrl} />
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
        ) : (
          <LearnWorkspaceAccessCard
            callbackUrl={callbackUrl}
            title={gating.workspaceTitle}
            description={gating.workspaceDescription}
            highlights={gating.highlights}
            signInLabel={common.actions.logIn}
            createWorkspaceLabel={common.actions.createWorkspace}
          />
        )}
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
          {props.mode === "dashboard" ? (
            collection.questions.map((question) => (
              <QuestionPreviewCard
                key={question.id}
                locale={locale}
                question={question}
                callbackUrl={callbackUrl}
                readLessonLabel={learn.collection.openQuestion}
                focusedPracticeLabel={learn.collection.focusedPractice}
                skillLabel={learn.question.skillLabel}
                moduleLabel={learn.question.moduleLabel}
                levelLabels={common.levels}
                formatLabels={learn.formatLabels}
                estimatedReadMinutesLabel={learn.question.estimatedReadMinutesLabel}
                questionHrefBase={`${getLearnLibraryHref(props.mode)}/questions`}
              />
            ))
          ) : (
            <>
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-slate-950">
                  {gating.collectionPreviewTitle}
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-slate-600">
                  {gating.collectionPreviewDescription}
                </p>
              </div>
              <div className="grid gap-4 xl:grid-cols-2">
                {previewQuestions.map((question) => (
                  <Link
                    key={question.id}
                    href={getLearnQuestionHref(props.mode, question.slug)}
                    className="rounded-[24px] border border-slate-200 bg-white p-5 transition hover:border-slate-300"
                  >
                    <div className="flex flex-wrap gap-2 text-xs uppercase tracking-[0.18em] text-slate-500">
                      <span>{learn.formatLabels[question.format]}</span>
                      <span>•</span>
                      <span>
                        {
                          common.levels[
                            question.level.toLowerCase() as keyof typeof common.levels
                          ]
                        }
                      </span>
                      <span>•</span>
                      <span>D{question.difficulty}</span>
                    </div>
                    <div className="mt-3 font-medium text-slate-950">
                      {question.prompt}
                    </div>
                    <p className="mt-2 text-sm leading-7 text-slate-600">
                      {question.shortAnswer ?? question.tlDr ?? question.explanation}
                    </p>
                    <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span>{question.primarySkill.title}</span>
                      <span className="text-slate-300">•</span>
                      <span>{question.module.title}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </>
          )}
        </section>
      )}
    </LearnSurface>
  );
}
