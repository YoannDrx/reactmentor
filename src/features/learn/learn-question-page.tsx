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
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants, Button } from "@/components/ui/button";
import {
  buildLessonCheckpointDefinition,
} from "@/features/learn/lesson-checkpoint";
import { LessonCheckpointCard } from "@/features/learn/lesson-checkpoint-card";
import { getLessonReadModel } from "@/features/learn/lesson-read-model";
import {
  addLessonToReviewAction,
  completeLessonCheckpointAction,
  markLessonViewedAction,
} from "@/features/learn/learn.action";
import {
  getLearnCollectionHref,
  getLearnLibraryHref,
  getLearnQuestionHref,
  type LearnSurfaceMode,
} from "@/features/learn/learn-paths";
import { LearnSurface } from "@/features/learn/learn-surface";
import { LearnWorkspaceAccessCard } from "@/features/learn/learn-workspace-access-card";
import { QuestionPreviewCard } from "@/features/learn/question-preview-card";
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

export async function LearnQuestionPage(props: {
  slug: string;
  mode: LearnSurfaceMode;
  userId: string | null;
}) {
  const { locale, messages } = await getI18n();
  const common = messages.common;
  const learn = messages.learn;
  const gating = learn.gating;
  const question = await getLocalizedQuestionBySlug(props.slug, locale);

  if (!question) {
    notFound();
  }

  const levelLabel =
    common.levels[question.level.toLowerCase() as keyof typeof common.levels];
  const callbackUrl = getLearnQuestionHref(props.mode, question.slug);
  const isPublicPreview = props.mode === "public";
  const lessonProgress = props.userId
    ? await getLessonReadModel(props.userId, question.id)
    : null;
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
  const interactiveCheckpoint = buildLessonCheckpointDefinition({
    format: question.format,
    options: question.options.map((option) => ({
      id: option.id,
      label: option.label,
      explanation: option.explanation,
      isCorrect: option.isCorrect,
    })),
  });
  const learningStateBadges = lessonProgress
    ? [
        lessonProgress.hasViewedLesson
          ? learn.question.learningStateLabels.viewed
          : null,
        lessonProgress.isCheckpointReady
          ? learn.question.learningStateLabels.checkpointReady
          : null,
        lessonProgress.isDueForReview
          ? learn.question.learningStateLabels.reviewDue
          : null,
      ].filter((value): value is string => value !== null)
    : [];

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

        {isPublicPreview ? (
          <div className="grid gap-4">
            <Card className="border-slate-200 bg-white">
              <CardContent className="grid gap-3 pt-6">
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700">
                  <div className="mb-1 flex items-center gap-2 font-medium text-slate-950">
                    <Sparkles className="size-4 text-cyan-600" />
                    {learn.question.skillLabel}
                  </div>
                  {question.primarySkill.title}
                </div>
                <div className="rounded-[22px] border border-slate-200 bg-slate-50/80 px-4 py-3 text-sm text-slate-700">
                  <div className="mb-1 flex items-center gap-2 font-medium text-slate-950">
                    <Layers3 className="size-4 text-cyan-600" />
                    {learn.question.moduleLabel}
                  </div>
                  {question.module.title}
                </div>
              </CardContent>
            </Card>

            <LearnWorkspaceAccessCard
              callbackUrl={callbackUrl}
              title={gating.questionPreviewTitle}
              description={gating.questionPreviewDescription}
              highlights={gating.highlights}
              signInLabel={common.actions.logIn}
              createWorkspaceLabel={common.actions.createWorkspace}
            />
          </div>
        ) : (
          <Card className="border-slate-200 bg-slate-950 text-white">
            <CardHeader className="space-y-4">
              <CardTitle className="text-white">
                {learn.question.learningLoopTitle}
              </CardTitle>
              <CardDescription className="text-slate-300">
                {learn.question.learningLoopDescription}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-5">
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

              {props.userId ? (
                <>
                  {learningStateBadges.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {learningStateBadges.map((label) => (
                        <Badge
                          key={label}
                          className="border-white/10 bg-white/10 text-white"
                        >
                          {label}
                        </Badge>
                      ))}
                    </div>
                  ) : (
                    <div className="rounded-[22px] border border-dashed border-white/15 bg-white/5 px-4 py-3 text-sm text-slate-300">
                      {learn.question.learningStateEmpty}
                    </div>
                  )}

                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                        {learn.question.lessonViewsLabel}
                      </div>
                      <div className="mt-2 text-2xl font-semibold text-white">
                        {lessonProgress?.lessonViews ?? 0}
                      </div>
                    </div>
                    <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                        {learn.question.checkpointAttemptsLabel}
                      </div>
                      <div className="mt-2 text-2xl font-semibold text-white">
                        {lessonProgress?.checkpointAttempts ?? 0}
                      </div>
                    </div>
                    <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                        {learn.question.checkpointPassCountLabel}
                      </div>
                      <div className="mt-2 text-2xl font-semibold text-white">
                        {lessonProgress?.checkpointPassCount ?? 0}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <LearnWorkspaceAccessCard
                  callbackUrl={callbackUrl}
                  title={learn.question.signInToTrackTitle}
                  description={learn.question.signInToTrackDescription}
                  highlights={gating.highlights}
                  signInLabel={common.actions.logIn}
                  createWorkspaceLabel={common.actions.createWorkspace}
                />
              )}

              <div className="grid gap-3 sm:grid-cols-2">
                <form action={markLessonViewedAction}>
                  <input type="hidden" name="questionId" value={question.id} />
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="pathToRevalidate" value={callbackUrl} />
                  <input type="hidden" name="callbackUrl" value={callbackUrl} />
                  <Button type="submit" className="w-full" variant="secondary">
                    {learn.question.markLessonViewedAction}
                  </Button>
                </form>

                <form action={addLessonToReviewAction}>
                  <input type="hidden" name="questionId" value={question.id} />
                  <input type="hidden" name="locale" value={locale} />
                  <input type="hidden" name="pathToRevalidate" value={callbackUrl} />
                  <input type="hidden" name="callbackUrl" value={callbackUrl} />
                  <Button type="submit" className="w-full" variant="secondary">
                    {learn.question.addToReviewAction}
                  </Button>
                </form>
              </div>

              {interactiveCheckpoint ? (
                <LessonCheckpointCard
                  checkpoint={interactiveCheckpoint}
                  questionId={question.id}
                  locale={locale}
                  callbackUrl={callbackUrl}
                  canTrackProgress={Boolean(props.userId)}
                  messages={learn.question.checkpointCard}
                />
              ) : (
                <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                  <div className="text-base font-medium text-white">
                    {learn.question.manualCheckpointTitle}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-300">
                    {learn.question.manualCheckpointDescription}
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-2">
                    <form action={completeLessonCheckpointAction}>
                      <input type="hidden" name="questionId" value={question.id} />
                      <input type="hidden" name="locale" value={locale} />
                      <input type="hidden" name="passed" value="true" />
                      <input
                        type="hidden"
                        name="pathToRevalidate"
                        value={callbackUrl}
                      />
                      <input type="hidden" name="callbackUrl" value={callbackUrl} />
                      <Button type="submit" className="w-full">
                        {learn.question.checkpointReadyAction}
                      </Button>
                    </form>

                    <form action={completeLessonCheckpointAction}>
                      <input type="hidden" name="questionId" value={question.id} />
                      <input type="hidden" name="locale" value={locale} />
                      <input type="hidden" name="passed" value="false" />
                      <input
                        type="hidden"
                        name="pathToRevalidate"
                        value={callbackUrl}
                      />
                      <input type="hidden" name="callbackUrl" value={callbackUrl} />
                      <Button
                        type="submit"
                        className="w-full"
                        variant="secondary"
                      >
                        {learn.question.checkpointReviewAction}
                      </Button>
                    </form>
                  </div>
                </div>
              )}

              <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
                <div className="mb-2 text-base font-medium text-white">
                  {learn.question.focusedPracticeTitle}
                </div>
                <p className="text-sm leading-6 text-slate-300">
                  {learn.question.focusedPracticeDescription}
                </p>
                <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                  <form action={createTrainingSessionAction} className="sm:flex-1">
                    <input type="hidden" name="mode" value="PRACTICE" />
                    <input type="hidden" name="locale" value={locale} />
                    <input type="hidden" name="questionCount" value="1" />
                    <input type="hidden" name="questionIds" value={question.id} />
                    <input type="hidden" name="callbackUrl" value={callbackUrl} />
                    <Button type="submit" className="w-full">
                      <Clock3 className="size-4" />
                      {learn.question.focusedPracticeAction}
                    </Button>
                  </form>

                  <Link
                    href={`/dashboard/modules/${question.module.slug}`}
                    className={buttonVariants({
                      variant: "secondary",
                      size: "md",
                    })}
                  >
                    {learn.question.openModuleAction}
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
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

      {isPublicPreview ? null : (
        <>
          <Card className="border-slate-200 bg-white">
            <CardHeader>
              <CardTitle>{learn.question.lessonTitle}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-sm leading-8 text-slate-700">
              {lessonParagraphs.length > 0 ? (
                lessonParagraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)
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
                    href={getLearnQuestionHref(
                      props.mode,
                      primaryCollectionJourney.previousQuestion.slug,
                    )}
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
                  href={getLearnCollectionHref(
                    props.mode,
                    primaryCollectionJourney.collection.slug,
                  )}
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
                    href={getLearnQuestionHref(
                      props.mode,
                      primaryCollectionJourney.nextQuestion.slug,
                    )}
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

          {question.relatedQuestions.length > 0 ? (
            <section className="grid gap-6">
              <div className="space-y-2">
                <h2 className="text-2xl font-semibold text-slate-950">
                  {learn.question.relatedQuestionsTitle}
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-slate-600">
                  {learn.question.relatedQuestionsDescription}
                </p>
              </div>

              <div className="grid gap-6 xl:grid-cols-2">
                {question.relatedQuestions.map((relatedQuestion) => (
                  <QuestionPreviewCard
                    key={relatedQuestion.id}
                    locale={locale}
                    question={relatedQuestion}
                    callbackUrl={callbackUrl}
                    readLessonLabel={learn.question.openRelatedLessonAction}
                    focusedPracticeLabel={learn.question.startRelatedPracticeAction}
                    skillLabel={learn.question.skillLabel}
                    moduleLabel={learn.question.moduleLabel}
                    levelLabels={common.levels}
                    formatLabels={learn.formatLabels}
                    estimatedReadMinutesLabel={
                      learn.question.estimatedReadMinutesLabel
                    }
                    questionHrefBase={`${getLearnLibraryHref(props.mode)}/questions`}
                  />
                ))}
              </div>
            </section>
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
                    href={getLearnCollectionHref(props.mode, collection.slug)}
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
        </>
      )}
    </LearnSurface>
  );
}
