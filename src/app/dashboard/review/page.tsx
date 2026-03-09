import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getDashboardReadModel } from "@/features/dashboard/dashboard-read-model";
import { BookmarkToggleForm } from "@/features/bookmarks/bookmark-toggle-form";
import { NoteEditorForm } from "@/features/notes/note-editor-form";
import {
  createTrainingSessionAction,
  reviewPendingAttemptAction,
} from "@/features/sessions/session.action";
import { getI18n } from "@/i18n/server";
import { getRequiredUser } from "@/lib/auth/auth-user";
import { BrainCircuit, CircleAlert, Repeat } from "lucide-react";
import Link from "next/link";

export default async function DashboardReviewPage() {
  const user = await getRequiredUser("/dashboard/review");
  const { locale, messages } = await getI18n();
  const review = messages.dashboard.review;
  const bookmarks = messages.dashboard.bookmarks;
  const notes = messages.dashboard.notes;
  const readModel = await getDashboardReadModel(user.id, locale);
  const reviewQueue = readModel.review.items;
  const pendingReviewItems = readModel.review.pendingItems;
  const reviewQuestionCount = Math.min(
    10,
    Math.max(1, readModel.review.dueCount),
  );
  const howItWorks = [
    {
      icon: CircleAlert,
      label: review.howItems[0],
    },
    {
      icon: BrainCircuit,
      label: review.howItems[1],
    },
    {
      icon: Repeat,
      label: review.howItems[2],
    },
  ];

  return (
    <div className="grid gap-6">
      <Card className="bg-slate-950 text-white">
        <CardHeader className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-start">
          <div>
            <CardTitle className="text-white">{review.launchTitle}</CardTitle>
            <CardDescription className="text-slate-300">
              {review.launchDescription}
            </CardDescription>
          </div>
          <div className="grid gap-3 sm:grid-cols-3 lg:min-w-[24rem]">
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                {review.dueNowLabel}
              </div>
              <div className="mt-2 text-2xl font-semibold text-white">
                {readModel.review.dueCount}
              </div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                {review.nextSessionSizeLabel}
              </div>
              <div className="mt-2 text-2xl font-semibold text-cyan-200">
                {readModel.review.dueCount > 0 ? reviewQuestionCount : 0}
              </div>
            </div>
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                {review.pendingCountLabel}
              </div>
              <div className="mt-2 text-2xl font-semibold text-white">
                {readModel.review.pendingCount}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="text-sm leading-6 text-slate-300">
            {readModel.review.dueCount > 0
              ? review.queueDescription
              : review.launchUnavailable}
          </div>
          <form action={createTrainingSessionAction}>
            <input type="hidden" name="mode" value="REVIEW" />
            <input type="hidden" name="locale" value={locale} />
            <input
              type="hidden"
              name="questionCount"
              value={String(reviewQuestionCount)}
            />
            <Button type="submit" disabled={readModel.review.dueCount === 0}>
              {review.launchAction}
            </Button>
          </form>
        </CardContent>
      </Card>

      {readModel.progress.recoveryPlans.length > 0 ? (
        <Card>
          <CardHeader>
            <CardTitle>{review.shortcutTitle}</CardTitle>
            <CardDescription>{review.shortcutDescription}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4 xl:grid-cols-3">
            {readModel.progress.recoveryPlans.slice(0, 3).map((plan) => (
              <div
                key={plan.skillId}
                className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="font-medium text-slate-950">{plan.skill}</div>
                  <Badge className="border-slate-200 bg-white text-slate-700">
                    {plan.score}%
                  </Badge>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {plan.dueCount > 0 ? (
                    <Badge className="border-amber-200 bg-amber-50 text-amber-700">
                      {review.dueNowLabel}: {plan.dueCount}
                    </Badge>
                  ) : null}
                  {plan.pendingCount > 0 ? (
                    <Badge className="border-cyan-200 bg-cyan-50 text-cyan-700">
                      {review.pendingCountLabel}: {plan.pendingCount}
                    </Badge>
                  ) : null}
                </div>
                <p className="mt-3 text-sm leading-6 text-slate-600">
                  {plan.reason === "dueNow"
                    ? review.shortcutReasons.dueNow.replace(
                        "{count}",
                        String(plan.dueCount),
                      )
                    : plan.reason === "pendingReview"
                      ? review.shortcutReasons.pendingReview.replace(
                          "{count}",
                          String(plan.pendingCount),
                        )
                      : review.shortcutReasons.weakSignal}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  {plan.recoveryQuestionIds.length > 0 ? (
                    <form action={createTrainingSessionAction}>
                      <input type="hidden" name="mode" value="REVIEW" />
                      <input type="hidden" name="locale" value={locale} />
                      <input
                        type="hidden"
                        name="questionCount"
                        value={String(plan.recoveryQuestionIds.length)}
                      />
                      {plan.recoveryQuestionIds.map((questionId) => (
                        <input
                          key={`${plan.skillId}-${questionId}`}
                          type="hidden"
                          name="questionIds"
                          value={questionId}
                        />
                      ))}
                      <Button type="submit" size="sm">
                        {review.shortcutActions.startRecoveryReview}
                      </Button>
                    </form>
                  ) : null}
                  {plan.pendingCount > 0 ? (
                    <Link
                      href="#pending-manual-reviews"
                      className="inline-flex h-10 items-center rounded-2xl border border-slate-200 bg-white px-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:text-slate-950"
                    >
                      {review.shortcutActions.openPendingReview}
                    </Link>
                  ) : null}
                  {plan.moduleSlug ? (
                    <Link
                      href={`/dashboard/modules/${plan.moduleSlug}`}
                      className="inline-flex h-10 items-center rounded-2xl border border-transparent px-4 text-sm font-medium text-cyan-700 transition hover:text-cyan-800"
                    >
                      {review.shortcutActions.openModule}
                    </Link>
                  ) : null}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      ) : null}

      <Card id="pending-manual-reviews">
        <CardHeader>
          <CardTitle>{review.pendingTitle}</CardTitle>
          <CardDescription>{review.pendingDescription}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {pendingReviewItems.length > 0 ? (
            pendingReviewItems.map((item) => (
              <div
                key={item.attemptId}
                className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-5"
              >
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                      {item.module}
                    </div>
                    <div className="mt-2 font-medium text-slate-950">
                      {item.prompt}
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className="border-cyan-200 bg-cyan-50 text-cyan-700">
                      {item.responsePreview
                        ? review.responseLabels[item.responsePreview.kind]
                        : review.pendingCountLabel}
                    </Badge>
                    <BookmarkToggleForm
                      questionId={item.questionId}
                      isBookmarked={item.isBookmarked}
                      pathToRevalidate="/dashboard/review"
                      saveLabel={bookmarks.saveAction}
                      removeLabel={bookmarks.removeAction}
                      variant="secondary"
                    />
                  </div>
                </div>

                <div className="mb-4 text-sm text-slate-500">{item.skill}</div>

                {item.contextData?.kind === "bug_hunt" ? (
                  <div className="mb-4 overflow-hidden rounded-[22px] border border-slate-900 bg-slate-950">
                    <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-slate-400">
                      <span>{item.contextData.language ?? "code"}</span>
                      <span>{review.selectedLinesLabel}</span>
                    </div>
                    <div className="divide-y divide-white/5">
                      {item.contextData.code
                        .split("\n")
                        .map((codeLine, index) => {
                          const lineNumber = index + 1;
                          const isSelected =
                            item.responsePreview?.kind ===
                              "bug_hunt_response" &&
                            item.responsePreview.selectedLineNumbers.includes(
                              lineNumber,
                            );

                          return (
                            <div
                              key={lineNumber}
                              className={`grid grid-cols-[auto_1fr] gap-4 px-4 py-2 ${
                                isSelected ? "bg-rose-500/15" : ""
                              }`}
                            >
                              <span className="font-mono text-xs text-slate-500">
                                {lineNumber}
                              </span>
                              <span className="overflow-x-auto font-mono text-sm leading-6 text-slate-100">
                                {codeLine.length > 0 ? codeLine : " "}
                              </span>
                            </div>
                          );
                        })}
                    </div>
                  </div>
                ) : null}

                <div className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
                  <div className="rounded-[22px] border border-slate-200 bg-white p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {review.yourAnswerLabel}
                    </div>
                    {item.responsePreview ? (
                      item.responsePreview.kind === "code_response" ? (
                        <pre className="mt-3 overflow-x-auto rounded-[18px] bg-slate-950 px-4 py-3 text-sm leading-6 text-slate-100">
                          <code>{item.responsePreview.content}</code>
                        </pre>
                      ) : (
                        <p className="mt-3 whitespace-pre-wrap text-sm leading-7 text-slate-700">
                          {item.responsePreview.content}
                        </p>
                      )
                    ) : (
                      <p className="mt-3 text-sm leading-7 text-slate-500">
                        {review.emptyPendingDescription}
                      </p>
                    )}
                  </div>

                  <div className="rounded-[22px] border border-slate-200 bg-white p-4">
                    <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                      {review.referenceLabel}
                    </div>
                    <p className="mt-3 text-sm leading-7 text-slate-700">
                      {item.explanation}
                    </p>
                    {item.takeaways.length > 0 ? (
                      <div className="mt-4 space-y-2">
                        {item.takeaways.map((takeaway) => (
                          <div
                            key={takeaway}
                            className="rounded-[18px] border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
                          >
                            {takeaway}
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="mt-4 rounded-[22px] border border-slate-200 bg-white p-4">
                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {review.rubricTitle}
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {item.rubricCriteria.map((criterion) => (
                      <Badge
                        key={`${item.attemptId}-${criterion}`}
                        className="border-slate-200 bg-slate-100 text-slate-700"
                      >
                        {review.rubricCriteriaLabels[criterion]}
                      </Badge>
                    ))}
                  </div>
                  {item.rubricFocusPoints.length > 0 ? (
                    <div className="mt-4">
                      <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                        {review.rubricFocusTitle}
                      </div>
                      <div className="mt-3 space-y-2">
                        {item.rubricFocusPoints.map((point) => (
                          <div
                            key={point}
                            className="rounded-[18px] border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-600"
                          >
                            {point}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : null}
                </div>

                <div className="mt-4">
                  <NoteEditorForm
                    questionId={item.questionId}
                    body={item.noteBody}
                    updatedAt={item.noteUpdatedAt}
                    pathToRevalidate="/dashboard/review"
                    title={notes.editorTitle}
                    placeholder={notes.editorPlaceholder}
                    saveLabel={notes.saveAction}
                    clearLabel={notes.clearAction}
                    updatedAtLabel={notes.updatedAtLabel}
                    locale={locale}
                  />
                </div>

                <div className="mt-4 flex flex-wrap gap-3">
                  <Link
                    href={`/dashboard/learn/questions/${item.questionSlug}`}
                    className={buttonVariants({ variant: "secondary", size: "sm" })}
                  >
                    {review.openLessonAction}
                  </Link>
                  <Link
                    href={`/dashboard/modules/${item.moduleSlug}`}
                    className="inline-flex h-10 items-center rounded-full border border-transparent px-4 text-sm font-medium text-cyan-700 transition hover:text-cyan-800"
                  >
                    {bookmarks.openModuleAction}
                  </Link>
                </div>

                <form
                  action={reviewPendingAttemptAction}
                  className="mt-4 rounded-[22px] border border-slate-200 bg-white p-4"
                >
                  <input
                    type="hidden"
                    name="attemptId"
                    value={item.attemptId}
                  />

                  <div className="text-xs uppercase tracking-[0.18em] text-slate-400">
                    {review.rubricVerdictsTitle}
                  </div>

                  <div className="mt-4 grid gap-4 md:grid-cols-3">
                    {item.rubricCriteria.map((criterion) => (
                      <label
                        key={`${item.attemptId}-${criterion}-field`}
                        className="grid gap-2"
                      >
                        <span className="text-sm font-medium text-slate-700">
                          {review.rubricCriteriaLabels[criterion]}
                        </span>
                        <select
                          name={`criterion_${criterion}`}
                          defaultValue="partial"
                          className="h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-950 outline-hidden transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10"
                        >
                          <option value="solid">
                            {review.rubricVerdictLabels.solid}
                          </option>
                          <option value="partial">
                            {review.rubricVerdictLabels.partial}
                          </option>
                          <option value="missing">
                            {review.rubricVerdictLabels.missing}
                          </option>
                        </select>
                      </label>
                    ))}
                  </div>

                  <div className="mt-4 grid gap-2">
                    <label
                      htmlFor={`reviewSummary-${item.attemptId}`}
                      className="text-sm font-medium text-slate-700"
                    >
                      {review.reviewSummaryLabel}
                    </label>
                    <textarea
                      id={`reviewSummary-${item.attemptId}`}
                      name="reviewSummary"
                      rows={4}
                      placeholder={review.reviewSummaryPlaceholder}
                      className="min-h-28 rounded-[20px] border border-slate-200 bg-white px-4 py-3 text-sm leading-7 text-slate-950 outline-hidden transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10"
                    />
                  </div>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Button type="submit">{review.saveRubricAction}</Button>
                    <Button
                      type="submit"
                      name="presetVerdict"
                      value="solid"
                      variant="secondary"
                    >
                      {review.markCorrectAction}
                    </Button>
                    <Button
                      type="submit"
                      name="presetVerdict"
                      value="missing"
                      variant="secondary"
                    >
                      {review.markIncorrectAction}
                    </Button>
                  </div>
                </form>
              </div>
            ))
          ) : (
            <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600">
              <div className="font-medium text-slate-950">
                {review.emptyPendingTitle}
              </div>
              <p className="mt-2">{review.emptyPendingDescription}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <section className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card>
          <CardHeader>
            <CardTitle>{review.queueTitle}</CardTitle>
            <CardDescription>{review.queueDescription}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {reviewQueue.length > 0 ? (
              reviewQueue.map((item) => (
                <div
                  key={item.questionId}
                  className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4"
                >
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <Badge className="border-orange-200 bg-orange-50 text-orange-700">
                        {review.urgencyLabels[item.urgency]}
                      </Badge>
                      <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                        {item.skill}
                      </div>
                    </div>
                    <BookmarkToggleForm
                      questionId={item.questionId}
                      isBookmarked={item.isBookmarked}
                      pathToRevalidate="/dashboard/review"
                      saveLabel={bookmarks.saveAction}
                      removeLabel={bookmarks.removeAction}
                      variant="secondary"
                    />
                  </div>
                  <div className="font-medium text-slate-950">{item.title}</div>
                  <div className="mt-2 text-sm text-slate-500">{item.module}</div>
                  {item.hasLessonSignal ? (
                    <div className="mt-3 flex flex-wrap gap-2">
                      <Badge className="border-cyan-200 bg-cyan-50 text-cyan-700">
                        {review.lessonSignalBadge}
                      </Badge>
                      {!item.hasPracticeAttempts ? (
                        <Badge className="border-slate-200 bg-white text-slate-700">
                          {review.lessonNoPracticeBadge}
                        </Badge>
                      ) : null}
                      {item.reason === "checkpointFailed" ? (
                        <Badge className="border-rose-200 bg-rose-50 text-rose-700">
                          {review.lessonCheckpointFailedBadge}
                        </Badge>
                      ) : null}
                    </div>
                  ) : null}
                  {item.hasLessonSignal ? (
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-slate-500">
                      <span>
                        {review.lessonViewsLabel}: {item.lessonViews}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span>
                        {review.checkpointAttemptsLabel}:{" "}
                        {item.checkpointAttempts}
                      </span>
                    </div>
                  ) : null}
                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    {review.reasonLabels[item.reason]}
                  </p>
                  <div className="mt-4">
                    <Link
                      href={`/dashboard/learn/questions/${item.questionSlug}`}
                      className={buttonVariants({ variant: "secondary", size: "sm" })}
                    >
                      {review.openLessonAction}
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="rounded-[24px] border border-slate-200 bg-slate-50/80 p-4 text-sm leading-6 text-slate-600">
                <div className="font-medium text-slate-950">
                  {review.emptyTitle}
                </div>
                <p className="mt-2">{review.emptyDescription}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="bg-slate-950 text-white">
          <CardHeader>
            <CardTitle className="text-white">{review.howTitle}</CardTitle>
            <CardDescription className="text-slate-300">
              {review.howDescription}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {howItWorks.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-3 rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
              >
                <item.icon className="size-4 text-cyan-300" />
                {item.label}
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
