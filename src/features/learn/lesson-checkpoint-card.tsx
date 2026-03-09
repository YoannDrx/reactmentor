"use client";

import { CheckCircle2, Circle, Loader2, RotateCcw, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { Button } from "@/components/ui/button";
import { completeLessonCheckpointAction } from "./learn.action";
import {
  evaluateLessonCheckpoint,
  type LessonCheckpointDefinition,
  type LessonCheckpointResult,
} from "./lesson-checkpoint";

type LessonCheckpointCardMessages = {
  title: string;
  description: string;
  singleChoiceHint: string;
  multipleChoiceHint: string;
  validateAction: string;
  resetAction: string;
  selectionRequired: string;
  passedTitle: string;
  passedDescription: string;
  failedTitle: string;
  failedDescription: string;
  correctAnswerLabel: string;
};

type LessonCheckpointCardProps = {
  checkpoint: LessonCheckpointDefinition;
  questionId: string;
  locale: "fr" | "en";
  callbackUrl: string;
  canTrackProgress: boolean;
  messages: LessonCheckpointCardMessages;
};

export function LessonCheckpointCard({
  checkpoint,
  questionId,
  locale,
  callbackUrl,
  canTrackProgress,
  messages,
}: LessonCheckpointCardProps) {
  const router = useRouter();
  const [selectedOptionIds, setSelectedOptionIds] = useState<string[]>([]);
  const [result, setResult] = useState<LessonCheckpointResult | null>(null);
  const [selectionError, setSelectionError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const isMultipleChoice = checkpoint.format === "MULTIPLE_CHOICE";

  function toggleOption(optionId: string) {
    setSelectionError(null);
    setResult(null);

    if (isMultipleChoice) {
      setSelectedOptionIds((current) =>
        current.includes(optionId)
          ? current.filter((currentOptionId) => currentOptionId !== optionId)
          : [...current, optionId],
      );
      return;
    }

    setSelectedOptionIds((current) =>
      current.includes(optionId) ? [] : [optionId],
    );
  }

  function resetCheckpoint() {
    setSelectedOptionIds([]);
    setResult(null);
    setSelectionError(null);
  }

  function submitCheckpoint() {
    if (selectedOptionIds.length === 0) {
      setSelectionError(messages.selectionRequired);
      return;
    }

    const nextResult = evaluateLessonCheckpoint(checkpoint, selectedOptionIds);
    setSelectionError(null);
    setResult(nextResult);

    if (!canTrackProgress) {
      return;
    }

    startTransition(async () => {
      const formData = new FormData();
      formData.set("questionId", questionId);
      formData.set("locale", locale);
      formData.set("passed", String(nextResult.passed));
      formData.set("pathToRevalidate", callbackUrl);
      formData.set("callbackUrl", callbackUrl);

      await completeLessonCheckpointAction(formData);
      router.refresh();
    });
  }

  return (
    <div className="rounded-[24px] border border-white/10 bg-white/5 p-5">
      <div className="space-y-2">
        <div className="text-base font-medium text-white">{messages.title}</div>
        <p className="text-sm leading-6 text-slate-300">
          {messages.description}
        </p>
        <p className="text-xs uppercase tracking-[0.18em] text-slate-400">
          {isMultipleChoice
            ? messages.multipleChoiceHint
            : messages.singleChoiceHint}
        </p>
      </div>

      <div className="mt-4 grid gap-3">
        {checkpoint.options.map((option) => {
          const isSelected = selectedOptionIds.includes(option.id);
          const isCorrect = result?.correctOptionIds.includes(option.id) ?? false;
          const isIncorrectSelection =
            result !== null && isSelected && !isCorrect;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => toggleOption(option.id)}
              className={`rounded-[22px] border px-4 py-3 text-left transition ${
                isCorrect
                  ? "border-emerald-300 bg-emerald-50/15 text-white"
                  : isIncorrectSelection
                    ? "border-rose-300 bg-rose-50/10 text-white"
                    : isSelected
                      ? "border-cyan-300 bg-cyan-50/10 text-white"
                      : "border-white/10 bg-white/5 text-slate-200 hover:border-white/20 hover:bg-white/10"
              }`}
            >
              <div className="flex items-start gap-3">
                {isSelected || isCorrect ? (
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-cyan-300" />
                ) : (
                  <Circle className="mt-0.5 size-4 shrink-0 text-slate-500" />
                )}
                <div className="min-w-0">
                  <div className="text-sm font-medium leading-6">
                    {option.label}
                  </div>
                  {result && (isCorrect || isIncorrectSelection) && option.explanation ? (
                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      {option.explanation}
                    </p>
                  ) : null}
                </div>
              </div>
            </button>
          );
        })}
      </div>

      {selectionError ? (
        <p className="mt-3 text-sm text-amber-200">{selectionError}</p>
      ) : null}

      {result ? (
        <div
          className={`mt-4 rounded-[22px] border px-4 py-3 text-sm leading-6 ${
            result.passed
              ? "border-emerald-300/40 bg-emerald-50/10 text-emerald-100"
              : "border-rose-300/40 bg-rose-50/10 text-rose-100"
          }`}
        >
          <div className="flex items-center gap-2 font-medium">
            {result.passed ? (
              <CheckCircle2 className="size-4" />
            ) : (
              <XCircle className="size-4" />
            )}
            {result.passed ? messages.passedTitle : messages.failedTitle}
          </div>
          <p className="mt-2">
            {result.passed
              ? messages.passedDescription
              : messages.failedDescription}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] opacity-80">
            {messages.correctAnswerLabel}:{" "}
            {result.correctOptions.map((option) => option.label).join(", ")}
          </p>
        </div>
      ) : null}

      <div className="mt-4 flex flex-wrap gap-3">
        <Button type="button" onClick={submitCheckpoint} disabled={isPending}>
          {isPending ? (
            <Loader2 className="size-4 animate-spin" />
          ) : (
            <CheckCircle2 className="size-4" />
          )}
          {messages.validateAction}
        </Button>
        <Button
          type="button"
          variant="secondary"
          onClick={resetCheckpoint}
          disabled={isPending && canTrackProgress}
        >
          <RotateCcw className="size-4" />
          {messages.resetAction}
        </Button>
      </div>
    </div>
  );
}
