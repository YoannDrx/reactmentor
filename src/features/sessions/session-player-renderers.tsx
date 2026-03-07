"use client";

import type { QuestionFormat } from "@prisma/client";
import { Input } from "@/components/ui/input";
import type { QuestionContextData } from "@/lib/question-context";
import { cn } from "@/lib/utils";
import {
  getSelectedOptionIdsFromAttemptResponse,
  getSelectedLineNumbersFromAttemptResponse,
  isClosedQuestionFormat,
  toggleBugHuntAttemptResponseLineNumber,
  toggleClosedChoiceAttemptResponseOption,
  type AttemptResponseDraft,
} from "./attempt-response";

export type SessionPlayerQuestion = {
  id: string;
  format: QuestionFormat;
  prompt: string;
  explanation: string;
  takeaways: string[];
  contextData: QuestionContextData | null;
  options: Array<{
    id: string;
    label: string;
    explanation: string;
    isCorrect: boolean;
  }>;
};

type SessionQuestionRendererProps = {
  question: SessionPlayerQuestion;
  responseDraft: AttemptResponseDraft;
  onChangeResponseDraft: (nextResponse: AttemptResponseDraft) => void;
  showFeedback: boolean;
  isInteractionLocked: boolean;
  messages: {
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
  };
};

function ClosedChoiceQuestionRenderer({
  question,
  responseDraft,
  onChangeResponseDraft,
  showFeedback,
  isInteractionLocked,
}: SessionQuestionRendererProps) {
  const selectedOptionIds = getSelectedOptionIdsFromAttemptResponse(responseDraft);

  return (
    <>
      {selectedOptionIds.map((selectedOptionId) => (
        <input
          key={selectedOptionId}
          type="hidden"
          name="selectedOptionIds"
          value={selectedOptionId}
        />
      ))}

      <div className="grid gap-3">
        {question.options.map((option, index) => {
          const isSelected = selectedOptionIds.includes(option.id);
          const isCorrect = option.isCorrect;

          return (
            <button
              key={option.id}
              type="button"
              onClick={() => {
                if (!showFeedback && !isInteractionLocked) {
                  onChangeResponseDraft(
                    toggleClosedChoiceAttemptResponseOption({
                      response: responseDraft,
                      questionFormat: question.format,
                      optionId: option.id,
                    }),
                  );
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
    </>
  );
}

function OpenEndedQuestionRenderer({
  responseDraft,
  onChangeResponseDraft,
  showFeedback,
  isInteractionLocked,
  messages,
}: SessionQuestionRendererProps) {
  if (responseDraft.kind !== "text_response") {
    return null;
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white/90 p-6">
      <label
        htmlFor="responseText"
        className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
      >
        {messages.openResponseLabel}
      </label>
      <textarea
        id="responseText"
        name="responseText"
        value={responseDraft.text}
        onChange={(event) => {
          onChangeResponseDraft({
            kind: "text_response",
            text: event.target.value,
          });
        }}
        disabled={showFeedback || isInteractionLocked}
        rows={8}
        placeholder={messages.openResponsePlaceholder}
        className="mt-4 min-h-48 w-full rounded-[24px] border border-slate-200 bg-white px-5 py-4 text-sm leading-7 text-slate-950 outline-hidden transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
      />
    </div>
  );
}

function CodeOutputQuestionRenderer({
  responseDraft,
  onChangeResponseDraft,
  showFeedback,
  isInteractionLocked,
  messages,
}: SessionQuestionRendererProps) {
  if (responseDraft.kind !== "code_response") {
    return null;
  }

  return (
    <div className="rounded-[28px] border border-slate-200 bg-white/90 p-6">
      <div className="grid gap-4 md:grid-cols-[0.32fr_1fr]">
        <div>
          <label
            htmlFor="responseLanguage"
            className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
          >
            {messages.codeLanguageLabel}
          </label>
          <Input
            id="responseLanguage"
            name="responseLanguage"
            value={responseDraft.language ?? ""}
            onChange={(event) => {
              onChangeResponseDraft({
                kind: "code_response",
                code: responseDraft.code,
                language: event.target.value || null,
              });
            }}
            disabled={showFeedback || isInteractionLocked}
            placeholder={messages.codeLanguagePlaceholder}
            className="mt-3"
          />
        </div>
        <div>
          <label
            htmlFor="responseCode"
            className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
          >
            {messages.codeResponseLabel}
          </label>
          <textarea
            id="responseCode"
            name="responseCode"
            value={responseDraft.code}
            onChange={(event) => {
              onChangeResponseDraft({
                kind: "code_response",
                code: event.target.value,
                language: responseDraft.language,
              });
            }}
            disabled={showFeedback || isInteractionLocked}
            rows={12}
            placeholder={messages.codeResponsePlaceholder}
            spellCheck={false}
            className="mt-3 min-h-64 w-full rounded-[24px] border border-slate-200 bg-slate-950 px-5 py-4 font-mono text-sm leading-7 text-slate-50 outline-hidden transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:bg-slate-900"
          />
        </div>
      </div>
    </div>
  );
}

function BugHuntQuestionRenderer({
  question,
  responseDraft,
  onChangeResponseDraft,
  showFeedback,
  isInteractionLocked,
  messages,
}: SessionQuestionRendererProps) {
  if (responseDraft.kind !== "bug_hunt_response") {
    return null;
  }

  const contextData = question.contextData;

  if (!contextData || contextData.kind !== "bug_hunt") {
    return null;
  }

  const selectedLineNumbers = getSelectedLineNumbersFromAttemptResponse(responseDraft);
  const codeLines = contextData.code.split("\n");

  return (
    <div className="grid gap-6">
      <div className="rounded-[28px] border border-slate-200 bg-white/90 p-6">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
          <div className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500">
            {messages.bugHuntSnippetLabel}
          </div>
          <div className="text-sm text-slate-500">
            {messages.bugHuntSelectedLinesLabel}: {selectedLineNumbers.length}
          </div>
        </div>
        {contextData.snippetTitle ? (
          <div className="mb-4 text-sm font-medium text-slate-700">
            {contextData.snippetTitle}
          </div>
        ) : null}
        {selectedLineNumbers.map((lineNumber) => (
          <input
            key={lineNumber}
            type="hidden"
            name="selectedLineNumbers"
            value={lineNumber}
          />
        ))}
        <div className="overflow-hidden rounded-[24px] border border-slate-900 bg-slate-950">
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3 text-xs uppercase tracking-[0.18em] text-slate-400">
            <span>{contextData.language ?? "code"}</span>
            <span className="rounded-full bg-white/5 px-2 py-1 text-[10px]">
              {messages.bugHuntSelectedLinesLabel}: {selectedLineNumbers.length}
            </span>
          </div>
          <div className="divide-y divide-white/5">
            {codeLines.map((codeLine, index) => {
              const lineNumber = index + 1;
              const isSelected = selectedLineNumbers.includes(lineNumber);

              return (
                <button
                  key={lineNumber}
                  type="button"
                  disabled={showFeedback || isInteractionLocked}
                  onClick={() => {
                    if (!showFeedback && !isInteractionLocked) {
                      onChangeResponseDraft(
                        toggleBugHuntAttemptResponseLineNumber({
                          response: responseDraft,
                          lineNumber,
                        }),
                      );
                    }
                  }}
                  className={cn(
                    "grid w-full grid-cols-[auto_1fr] gap-4 px-4 py-2 text-left transition-all",
                    isSelected
                      ? "bg-rose-500/15"
                      : "bg-transparent hover:bg-white/5",
                    isInteractionLocked && "cursor-wait opacity-80",
                  )}
                >
                  <span className="font-mono text-xs text-slate-500">{lineNumber}</span>
                  <span className="overflow-x-auto font-mono text-sm leading-6 text-slate-100">
                    {codeLine.length > 0 ? codeLine : " "}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-200 bg-white/90 p-6">
        <label
          htmlFor="responseSummary"
          className="text-sm font-medium uppercase tracking-[0.18em] text-slate-500"
        >
          {messages.bugHuntSummaryLabel}
        </label>
        <textarea
          id="responseSummary"
          name="responseSummary"
          value={responseDraft.summary}
          onChange={(event) => {
            onChangeResponseDraft({
              kind: "bug_hunt_response",
              summary: event.target.value,
              selectedLineNumbers: responseDraft.selectedLineNumbers,
            });
          }}
          disabled={showFeedback || isInteractionLocked}
          rows={7}
          placeholder={messages.bugHuntSummaryPlaceholder}
          className="mt-4 min-h-44 w-full rounded-[24px] border border-slate-200 bg-white px-5 py-4 text-sm leading-7 text-slate-950 outline-hidden transition placeholder:text-slate-400 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-500/10 disabled:cursor-not-allowed disabled:bg-slate-50"
        />
      </div>
    </div>
  );
}

export function SessionQuestionRenderer(
  props: SessionQuestionRendererProps,
) {
  if (isClosedQuestionFormat(props.question.format)) {
    return <ClosedChoiceQuestionRenderer {...props} />;
  }

  if (props.question.format === "OPEN_ENDED") {
    return <OpenEndedQuestionRenderer {...props} />;
  }

  if (props.question.format === "CODE_OUTPUT") {
    return <CodeOutputQuestionRenderer {...props} />;
  }

  if (props.question.format === "BUG_HUNT") {
    return <BugHuntQuestionRenderer {...props} />;
  }

  return null;
}
