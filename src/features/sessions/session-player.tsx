"use client";

import {
  startTransition,
  useActionState,
  useEffect,
  useMemo,
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
import { cn } from "@/lib/utils";
import {
  finishTrainingSessionAction,
  recordTrainingSessionAttemptAction,
} from "./session.action";
import { initialRecordAttemptActionState } from "./session-attempt.state";

type SessionPlayerMessages = {
  progressLabel: string;
  submitAnswer: string;
  retryAnswer: string;
  submitting: string;
  nextQuestion: string;
  finishSession: string;
  loadingNextQuestion: string;
  loadingSessionResult: string;
  selectionRequired: string;
  correctState: string;
  incorrectState: string;
  keyboardHint: string;
  explanationTitle: string;
  takeawaysTitle: string;
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
  question: {
    id: string;
    prompt: string;
    explanation: string;
    takeaways: string[];
    options: Array<{
      id: string;
      label: string;
      explanation: string;
      isCorrect: boolean;
    }>;
  };
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
  const [selectedOptionId, setSelectedOptionId] = useState<string | null>(null);
  const [submitCount, setSubmitCount] = useState(0);
  const [isAdvancing, setIsAdvancing] = useState(false);
  const [nowMs, setNowMs] = useState(() => Date.now());
  const [isTimingOut, startTimingOutTransition] = useTransition();
  const hasTriggeredTimeoutRef = useRef(false);
  const correctOptionIds = useMemo(
    () =>
      question.options
        .filter((option) => option.isCorrect)
        .map((option) => option.id),
    [question.options],
  );
  const showFeedback = state.status === "success";
  const isAwaitingResponse = submitCount > 0 && state.status === "idle";
  const canRetrySave =
    state.formError !== "unauthorized" &&
    state.formError !== "invalid" &&
    state.formError !== "expired";
  const isCorrectSelection =
    showFeedback &&
    !!selectedOptionId &&
    correctOptionIds.length === 1 &&
    correctOptionIds[0] === selectedOptionId;
  const optionCount = question.options.length;
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
        if (/^[1-9]$/.test(event.key)) {
          const option = question.options[Number(event.key) - 1];

          if (option) {
            event.preventDefault();
            setSelectedOptionId(option.id);
          }
        }

        if (event.key === "Enter" && selectedOptionId) {
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
    question.options,
    router,
    selectedOptionId,
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
          if (!selectedOptionId) {
            event.preventDefault();
            toast.error(messages.selectionRequired);
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
        {selectedOptionId ? (
          <input type="hidden" name="selectedOptionIds" value={selectedOptionId} />
        ) : null}

        <div className="grid gap-3">
          {question.options.map((option, index) => {
            const isSelected = selectedOptionId === option.id;
            const isCorrect = option.isCorrect;

            return (
              <button
                key={option.id}
                type="button"
                onClick={() => {
                  if (!showFeedback && !isInteractionLocked) {
                    setSelectedOptionId(option.id);
                  }
                }}
                disabled={showFeedback || isInteractionLocked}
                className={cn(
                  "rounded-[24px] border px-5 py-4 text-left transition-all",
                  !showFeedback && isSelected
                    ? "border-cyan-300 bg-cyan-50 shadow-[0_18px_50px_-34px_rgba(14,165,233,0.7)]"
                    : "border-slate-200 bg-white hover:border-slate-300",
                  showFeedback && isCorrect && "border-emerald-300 bg-emerald-50",
                  showFeedback &&
                    isSelected &&
                    !isCorrect &&
                    "border-rose-300 bg-rose-50",
                  isInteractionLocked && "cursor-wait opacity-80",
                )}
              >
                <div className="flex items-start gap-4">
                  <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-medium text-slate-700">
                    {index + 1}
                  </div>
                  <div className="min-w-0">
                    <div className="font-medium text-slate-950">{option.label}</div>
                    {showFeedback ? (
                      <p className="mt-2 text-sm leading-6 text-slate-600">
                        {option.explanation}
                      </p>
                    ) : null}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

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
              {messages.keyboardHint.replace("{count}", String(optionCount))}
            </div>
            {state.status === "error" && !canRetrySave ? (
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
                    : "border-rose-200 bg-rose-50 text-rose-700"
                }
              >
                {isCorrectSelection ? messages.correctState : messages.incorrectState}
              </Badge>
            </div>
            <div className="text-sm font-medium uppercase tracking-[0.22em] text-slate-400">
              {messages.explanationTitle}
            </div>
            <p className="mt-3 text-sm leading-7 text-slate-700">
              {question.explanation}
            </p>
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
