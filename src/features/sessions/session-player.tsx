"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useRef,
  useState,
  useTransition,
} from "react";
import { useFormStatus } from "react-dom";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  createInitialAttemptResponseDraft,
  isAttemptResponseDraftSubmittable,
  isClosedQuestionFormat,
  supportsLiveQuestionFormat,
  toggleClosedChoiceAttemptResponseOption,
  type AttemptResponseDraft,
} from "./attempt-response";
import {
  finishTrainingSessionAction,
  recordTrainingSessionAttemptAction,
} from "./session.action";
import { initialRecordAttemptActionState } from "./session-attempt.state";
import {
  SessionQuestionRenderer,
  type SessionPlayerQuestion,
} from "./session-player-renderers";

type SessionPlayerMessages = {
  progressLabel: string;
  answerModeLabelSingle: string;
  answerModeLabelMultiple: string;
  answerModeLabelOpen: string;
  openAnswerHint: string;
  bugHuntHint: string;
  submitAnswer: string;
  retryAnswer: string;
  submitting: string;
  nextQuestion: string;
  finishSession: string;
  loadingNextQuestion: string;
  loadingSessionResult: string;
  selectionRequired: string;
  responseRequired: string;
  correctState: string;
  incorrectState: string;
  pendingReviewState: string;
  pendingReviewHint: string;
  keyboardHintSingle: string;
  keyboardHintMultiple: string;
  explanationTitle: string;
  takeawaysTitle: string;
  openResponseLabel: string;
  openResponsePlaceholder: string;
  codeResponseLabel: string;
  codeResponsePlaceholder: string;
  codeLanguageLabel: string;
  codeLanguagePlaceholder: string;
  bugHuntSnippetLabel: string;
  bugHuntSummaryLabel: string;
  bugHuntSummaryPlaceholder: string;
  bugHuntSelectedLinesLabel: string;
  recoveryTitle: string;
  recoveryHint: string;
  timerLabel: string;
  timeRemainingLabel: string;
  timeBudgetLabel: string;
  timerExpiredToast: string;
  timedModeBadge: string;
  backToDashboard: string;
  errors: {
    unauthorized: string;
    invalid: string;
    unsupported: string;
    expired: string;
    unknown: string;
  };
};

type SessionPlayerProps = {
  sessionId: string;
  modeLabel: string;
  currentIndex: number;
  totalQuestions: number;
  progressPercent: number;
  skillLabel: string;
  moduleLabel: string;
  question: SessionPlayerQuestion;
  timing: null | {
    durationMinutes: number;
    deadlineAtMs: number;
    remainingSeconds: number;
    percentRemaining: number;
    isExpired: boolean;
  };
  messages: SessionPlayerMessages;
};

function formatCountdown(totalSeconds: number) {
  const safeSeconds = Math.max(0, totalSeconds);
  const minutes = Math.floor(safeSeconds / 60);
  const seconds = safeSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function SubmitButton({
  idleLabel,
  pendingLabel,
  disabled,
}: {
  idleLabel: string;
  pendingLabel: string;
  disabled?: boolean;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending || disabled}>
      {pending ? pendingLabel : idleLabel}
    </Button>
  );
}

export function SessionPlayer({
  sessionId,
  modeLabel,
  currentIndex,
  totalQuestions,
  progressPercent,
  skillLabel,
  moduleLabel,
  question,
  timing,
  messages,
}: SessionPlayerProps) {
  const router = useRouter();
  const [state, formAction] = useActionState(
    recordTrainingSessionAttemptAction,
    initialRecordAttemptActionState,
  );
  const [responseDraft, setResponseDraft] = useState<AttemptResponseDraft>(() =>
    createInitialAttemptResponseDraft(question.format),
  );
  const [submitCount, setSubmitCount] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [isTimingOut, startTimingOutTransition] = useTransition();
  const hasTriggeredTimeoutRef = useRef(false);
  const isSupportedQuestion = supportsLiveQuestionFormat(question.format);
  const isClosedQuestion = isClosedQuestionFormat(question.format);
  const isMultipleChoice = question.format === "MULTIPLE_CHOICE";
  const showFeedback = state.status === "success";
  const isAwaitingResponse = submitCount > 0 && state.status === "idle";
  const canRetrySave =
    state.formError !== "unauthorized" &&
    state.formError !== "invalid" &&
    state.formError !== "unsupported" &&
    state.formError !== "expired";
  const optionCount = question.options.length;
  const hasResponse = isAttemptResponseDraftSubmittable(responseDraft);
  const keyboardHint = isClosedQuestion
    ? isMultipleChoice
      ? messages.keyboardHintMultiple
      : messages.keyboardHintSingle
    : question.format === "BUG_HUNT"
      ? messages.bugHuntHint
    : isSupportedQuestion
      ? messages.openAnswerHint
      : null;
  const answerModeLabel = isClosedQuestion
    ? isMultipleChoice
      ? messages.answerModeLabelMultiple
      : messages.answerModeLabelSingle
    : messages.answerModeLabelOpen;
  const feedbackStatus = showFeedback ? state.feedbackStatus : null;
  const isCorrectSelection = feedbackStatus === "correct";
  const isPendingReview = feedbackStatus === "pending_review";
  const remainingSeconds = timing
    ? Math.max(0, Math.ceil((timing.deadlineAtMs - nowMs) / 1000))
    : null;
  const timerPercent = timing
    ? Math.max(
        0,
        Math.min(
          100,
          Math.round(
            ((remainingSeconds ?? 0) / Math.max(1, timing.durationMinutes * 60)) * 100,
          ),
        ),
      )
    : 0;
  const hasTimeExpired = timing ? (remainingSeconds ?? 0) <= 0 : false;
  const isInteractionLocked =
    isAwaitingResponse || isAdvancing || isTimingOut || hasTimeExpired;

  useEffect(() => {
    if (state.formError === "unauthorized") {
      toast.error(messages.errors.unauthorized);
    }

    if (state.formError === "invalid") {
      toast.error(messages.errors.invalid);
    }

    if (state.formError === "unsupported") {
      toast.error(messages.errors.unsupported);
    }

    if (state.formError === "expired") {
      toast.error(messages.errors.expired);
      router.refresh();
    }

    if (state.formError === "unknown") {
      toast.error(messages.errors.unknown);
    }
  }, [
    messages.errors.expired,
    messages.errors.invalid,
    messages.errors.unsupported,
    messages.errors.unauthorized,
    messages.errors.unknown,
    router,
    state.formError,
  ]);

  useEffect(() => {
    if (!timing) {
      return;
    }

    hasTriggeredTimeoutRef.current = false;

    const intervalId = window.setInterval(() => {
      setNowMs(Date.now());
    }, 1000);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [question.id, sessionId, timing]);

  useEffect(() => {
    if (!timing || !hasTimeExpired || hasTriggeredTimeoutRef.current) {
      return;
    }

    hasTriggeredTimeoutRef.current = true;
    toast.error(messages.timerExpiredToast);
    startTimingOutTransition(() => {
      void finishTrainingSessionAction(sessionId).then(() => {
        router.refresh();
      });
    });
  }, [
    hasTimeExpired,
    messages.timerExpiredToast,
    router,
    sessionId,
    startTimingOutTransition,
    timing,
  ]);

  useEffect(() => {
    const handleKeyboardShortcuts = (event: KeyboardEvent) => {
      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.isContentEditable)
      ) {
        return;
      }

      if (isInteractionLocked) {
        return;
      }

      if (!showFeedback) {
        if (!isClosedQuestion) {
          return;
        }

        if (/^[1-9]$/.test(event.key)) {
          const option = question.options[Number(event.key) - 1];

          if (option) {
            event.preventDefault();
            setResponseDraft((currentResponse) =>
              toggleClosedChoiceAttemptResponseOption({
                response: currentResponse,
                questionFormat: question.format,
                optionId: option.id,
              }),
            );
          }
        }

        if (event.key === "Enter" && hasResponse) {
          event.preventDefault();
          const formElement = document.getElementById(
            `session-form-${sessionId}`,
          ) as HTMLFormElement | null;
          formElement?.requestSubmit();
        }

        return;
      }

      if (event.key === "Enter" && state.status === "success") {
        event.preventDefault();
        setIsAdvancing(true);
        startTransition(() => {
          router.refresh();
        });
      }
    };

    window.addEventListener("keydown", handleKeyboardShortcuts);

    return () => {
      window.removeEventListener("keydown", handleKeyboardShortcuts);
    };
  }, [
    isInteractionLocked,
    hasResponse,
    isClosedQuestion,
    question.options,
    question.format,
    router,
    sessionId,
    showFeedback,
    state.status,
  ]);

  return (
    <div className="grid gap-6">
      <div className="rounded-[28px] border border-slate-200 bg-white/90 p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
              {modeLabel}
            </div>
            <div className="mt-2 font-display text-3xl font-semibold tracking-tight text-slate-950">
              {question.prompt}
            </div>
          </div>
          <Badge className="border-slate-200 bg-slate-100 text-slate-700">
            {messages.progressLabel}
          </Badge>
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-[1fr_auto_auto] sm:items-center">
          <Progress value={progressPercent} />
          <div className="text-sm text-slate-500">{skillLabel}</div>
          <div className="text-sm text-slate-500">{moduleLabel}</div>
        </div>

        <div className="mt-4 text-sm text-slate-500">{answerModeLabel}</div>

        {timing ? (
          <div className="mt-5 rounded-[24px] border border-cyan-200 bg-cyan-50/70 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
              <div>
                <div className="text-xs uppercase tracking-[0.22em] text-cyan-700">
                  {messages.timerLabel}
                </div>
                <div className="mt-1 flex items-center gap-2 text-sm text-slate-700">
                  <Badge className="border-cyan-200 bg-white/80 text-cyan-700">
                    {messages.timedModeBadge}
                  </Badge>
                  {messages.timeBudgetLabel}: {timing.durationMinutes} min
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs uppercase tracking-[0.22em] text-slate-500">
                  {messages.timeRemainingLabel}
                </div>
                <div className="mt-1 font-display text-2xl font-semibold text-slate-950">
                  {formatCountdown(remainingSeconds ?? timing.remainingSeconds)}
                </div>
              </div>
            </div>
            <Progress value={timerPercent} />
          </div>
        ) : null}
      </div>

      <form
        id={`session-form-${sessionId}`}
        action={formAction}
        onSubmit={(event) => {
          if (!isSupportedQuestion) {
            event.preventDefault();
            toast.error(messages.errors.unsupported);
            return;
          }

          if (!hasResponse) {
            event.preventDefault();
            toast.error(
              isClosedQuestion
                ? messages.selectionRequired
                : messages.responseRequired,
            );
            return;
          }

          if (hasTimeExpired || isTimingOut) {
            event.preventDefault();
            if (!hasTriggeredTimeoutRef.current) {
              hasTriggeredTimeoutRef.current = true;
              toast.error(messages.timerExpiredToast);
              startTimingOutTransition(() => {
                void finishTrainingSessionAction(sessionId).then(() => {
                  router.refresh();
                });
              });
            }
            return;
          }

          setSubmitCount((currentCount) => currentCount + 1);
        }}
        className="grid gap-6"
      >
        <input type="hidden" name="sessionId" value={sessionId} />
        <input type="hidden" name="questionId" value={question.id} />

        <SessionQuestionRenderer
          question={question}
          responseDraft={responseDraft}
          onChangeResponseDraft={setResponseDraft}
          showFeedback={showFeedback}
          isInteractionLocked={isInteractionLocked}
          messages={{
            openResponseLabel: messages.openResponseLabel,
            openResponsePlaceholder: messages.openResponsePlaceholder,
            codeResponseLabel: messages.codeResponseLabel,
            codeResponsePlaceholder: messages.codeResponsePlaceholder,
            codeLanguageLabel: messages.codeLanguageLabel,
            codeLanguagePlaceholder: messages.codeLanguagePlaceholder,
            bugHuntSnippetLabel: messages.bugHuntSnippetLabel,
            bugHuntSummaryLabel: messages.bugHuntSummaryLabel,
            bugHuntSummaryPlaceholder: messages.bugHuntSummaryPlaceholder,
            bugHuntSelectedLinesLabel: messages.bugHuntSelectedLinesLabel,
          }}
        />

        {!isSupportedQuestion ? (
          <div
            role="alert"
            className="rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm leading-6 text-amber-950"
          >
            {messages.errors.unsupported}
          </div>
        ) : null}

        {state.status === "error" ? (
          <div
            role="alert"
            className="rounded-[24px] border border-amber-200 bg-amber-50 px-5 py-4 text-sm text-amber-950"
          >
            <div className="font-medium">{messages.recoveryTitle}</div>
            <p className="mt-2 leading-6">
              {state.formError === "unauthorized"
                ? messages.errors.unauthorized
                : state.formError === "invalid"
                  ? messages.errors.invalid
                  : state.formError === "unsupported"
                    ? messages.errors.unsupported
                  : state.formError === "expired"
                    ? messages.errors.expired
                    : messages.errors.unknown}
            </p>
            {canRetrySave ? (
              <p className="mt-2 leading-6 text-amber-800">
                {messages.recoveryHint}
              </p>
            ) : null}
          </div>
        ) : null}

        {!showFeedback ? (
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm text-slate-500">
              {keyboardHint
                ? isClosedQuestion
                  ? keyboardHint.replace("{count}", String(optionCount))
                  : keyboardHint
                : messages.errors.unsupported}
            </div>
            {!isSupportedQuestion ? (
              <Link href="/dashboard">
                <Button variant="secondary">{messages.backToDashboard}</Button>
              </Link>
            ) : state.status === "error" && !canRetrySave ? (
              <Link href="/dashboard">
                <Button variant="secondary">{messages.backToDashboard}</Button>
              </Link>
            ) : (
              <SubmitButton
                idleLabel={
                  state.status === "error"
                    ? messages.retryAnswer
                    : messages.submitAnswer
                }
                pendingLabel={messages.submitting}
                disabled={isInteractionLocked}
              />
            )}
          </div>
        ) : null}
      </form>

      {showFeedback ? (
        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white/90 p-6">
            <div className="mb-4 flex items-center gap-3">
              <Badge
                className={
                  isCorrectSelection
                    ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                    : isPendingReview
                      ? "border-cyan-200 bg-cyan-50 text-cyan-700"
                      : "border-rose-200 bg-rose-50 text-rose-700"
                }
              >
                {isCorrectSelection
                  ? messages.correctState
                  : isPendingReview
                    ? messages.pendingReviewState
                    : messages.incorrectState}
              </Badge>
            </div>
            <div className="text-sm font-medium uppercase tracking-[0.22em] text-slate-400">
              {messages.explanationTitle}
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              {question.explanation}
            </p>
            {isPendingReview ? (
              <p className="mt-3 text-sm leading-7 text-cyan-700">
                {messages.pendingReviewHint}
              </p>
            ) : null}
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white">
            <div className="text-sm font-medium uppercase tracking-[0.22em] text-slate-400">
              {messages.takeawaysTitle}
            </div>
            <div className="mt-4 space-y-3">
              {question.takeaways.map((takeaway) => (
                <div
                  key={takeaway}
                  className="rounded-[20px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
                >
                  {takeaway}
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {showFeedback ? (
        <div className="flex justify-end">
          <Button
            disabled={isAdvancing}
            onClick={() =>
              startTransition(() => {
                setIsAdvancing(true);
                router.refresh();
              })
            }
          >
            {isAdvancing
              ? currentIndex >= totalQuestions
                ? messages.loadingSessionResult
                : messages.loadingNextQuestion
              : currentIndex >= totalQuestions
                ? messages.finishSession
                : messages.nextQuestion}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
