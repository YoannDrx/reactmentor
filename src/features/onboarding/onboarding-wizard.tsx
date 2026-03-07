"use client";

import { QuestionLevel, Track } from "@prisma/client";
import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import type { SettingsFormMessages } from "@/features/settings/settings-form";
import { initialSettingsActionState } from "@/features/settings/settings.state";
import type { FocusMode, UserPreferenceSnapshot } from "@/features/settings/user-preferences";
import { completeOnboardingAction } from "./onboarding.action";

const weeklyGoalPresets = [20, 30, 45] as const;
const stepOrder = ["goal", "tracks", "cadence"] as const;

type StepKey = (typeof stepOrder)[number];

type OnboardingMessages = {
  badge: string;
  title: string;
  description: string;
  steps: Record<StepKey, string>;
  stepDescriptions: Record<StepKey, string>;
  panelTitle: string;
  panelDescription: string;
  panelItems: readonly string[];
  actions: {
    back: string;
    next: string;
    finish: string;
    finishing: string;
  };
};

type OnboardingWizardProps = {
  preference: UserPreferenceSnapshot;
  messages: OnboardingMessages;
  settingsMessages: SettingsFormMessages;
  trackLabels: Record<Track, string>;
  levelLabels: Record<QuestionLevel, string>;
};

function resolveFieldError(
  fieldName: keyof typeof initialSettingsActionState.fieldErrors,
  messages: SettingsFormMessages,
  fieldErrors: typeof initialSettingsActionState.fieldErrors,
) {
  const code = fieldErrors[fieldName];

  if (!code) {
    return null;
  }

  if (fieldName === "targetRole" && code === "tooLong") {
    return messages.errors.targetRoleTooLong;
  }

  if (fieldName === "weeklyGoal" && code === "tooSmall") {
    return messages.errors.weeklyGoalTooSmall;
  }

  if (fieldName === "weeklyGoal" && code === "tooBig") {
    return messages.errors.weeklyGoalTooBig;
  }

  if (fieldName === "preferredTracks" && code === "required") {
    return messages.errors.preferredTracksRequired;
  }

  return messages.errors.invalidSelection;
}

function FinishButton({
  idleLabel,
  pendingLabel,
}: {
  idleLabel: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending}>
      {pending ? pendingLabel : idleLabel}
    </Button>
  );
}

export function OnboardingWizard({
  preference,
  messages,
  settingsMessages,
  trackLabels,
  levelLabels,
}: OnboardingWizardProps) {
  const [state, formAction] = useActionState(
    completeOnboardingAction,
    initialSettingsActionState,
  );
  const [step, setStep] = useState(0);
  const [targetRole, setTargetRole] = useState(preference.targetRole);
  const [targetLevel, setTargetLevel] = useState<QuestionLevel>(
    preference.targetLevel,
  );
  const [weeklyGoal, setWeeklyGoal] = useState(String(preference.weeklyGoal));
  const [focusMode, setFocusMode] = useState<FocusMode>(preference.focusMode);
  const [preferredTracks, setPreferredTracks] = useState<Track[]>(
    preference.preferredTracks,
  );
  const [stepError, setStepError] = useState<string | null>(null);

  useEffect(() => {
    if (state.formError === "unauthorized") {
      toast.error(settingsMessages.errors.unauthorized);
    }

    if (state.formError === "unknown") {
      toast.error(settingsMessages.errors.unknown);
    }
  }, [
    settingsMessages.errors.unauthorized,
    settingsMessages.errors.unknown,
    state.formError,
  ]);

  const currentStep = stepOrder[step] ?? "goal";
  const summaryTracks = useMemo(
    () => preferredTracks.map((track) => trackLabels[track]).join(" · "),
    [preferredTracks, trackLabels],
  );
  const serverTargetRoleError = resolveFieldError(
    "targetRole",
    settingsMessages,
    state.fieldErrors,
  );
  const serverPreferredTracksError = resolveFieldError(
    "preferredTracks",
    settingsMessages,
    state.fieldErrors,
  );
  const serverWeeklyGoalError = resolveFieldError(
    "weeklyGoal",
    settingsMessages,
    state.fieldErrors,
  );

  return (
    <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
      <div className="space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white/85 p-6 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.25)]">
          <Badge className="border-slate-200 bg-slate-100 text-slate-700">
            {messages.badge}
          </Badge>
          <h1 className="mt-4 font-display text-4xl font-semibold tracking-tight text-slate-950">
            {messages.title}
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            {messages.description}
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {stepOrder.map((stepKey, index) => {
            const isActive = index === step;
            const isCompleted = index < step;

            return (
              <button
                  key={stepKey}
                  type="button"
                  onClick={() => {
                    setStepError(null);
                    setStep(index);
                  }}
                className={cn(
                  "rounded-[24px] border px-4 py-4 text-left transition-all",
                  isActive
                    ? "border-cyan-300 bg-cyan-50 shadow-[0_18px_50px_-34px_rgba(14,165,233,0.7)]"
                    : "border-slate-200 bg-white/75",
                )}
              >
                <div className="mb-3 flex items-center gap-2">
                  <span
                    className={cn(
                      "flex size-8 items-center justify-center rounded-full text-sm font-medium",
                      isActive || isCompleted
                        ? "bg-slate-950 text-white"
                        : "bg-slate-100 text-slate-500",
                    )}
                  >
                    {index + 1}
                  </span>
                  <span className="font-medium text-slate-950">
                    {messages.steps[stepKey]}
                  </span>
                </div>
                <p className="text-sm leading-6 text-slate-600">
                  {messages.stepDescriptions[stepKey]}
                </p>
              </button>
            );
          })}
        </div>

        <form action={formAction} className="rounded-[28px] border border-slate-200 bg-white/90 p-6">
          <section className={cn(currentStep !== "goal" && "hidden")}>
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-slate-950">
                {messages.steps.goal}
              </h2>
              <p className="text-sm leading-6 text-slate-600">
                {messages.stepDescriptions.goal}
              </p>
            </div>
            <div className="mt-6 space-y-5">
              <div>
                <label
                  htmlFor="targetRole"
                  className="text-sm font-medium text-slate-950"
                >
                  {settingsMessages.targetRoleLabel}
                </label>
                <Input
                  id="targetRole"
                  name="targetRole"
                  value={targetRole}
                  onChange={(event) => {
                    setStepError(null);
                    setTargetRole(event.target.value);
                  }}
                  placeholder={settingsMessages.targetRolePlaceholder}
                  className="mt-3"
                />
                <p className="mt-2 text-sm text-slate-500">
                  {settingsMessages.targetRoleHint}
                </p>
                {serverTargetRoleError || (step === 0 && stepError) ? (
                  <p className="mt-2 text-sm text-rose-600">
                    {serverTargetRoleError ?? stepError}
                  </p>
                ) : null}
              </div>

              <div>
                <div className="text-sm font-medium text-slate-950">
                  {settingsMessages.targetLevelTitle}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {settingsMessages.targetLevelDescription}
                </p>
                <div className="mt-4 grid gap-3 sm:grid-cols-3">
                  {Object.entries(levelLabels).map(([value, label]) => (
                    <label key={value} className="cursor-pointer">
                      <input
                        type="radio"
                        name="targetLevel"
                        value={value}
                        checked={targetLevel === value}
                        onChange={() => {
                          setStepError(null);
                          setTargetLevel(value as QuestionLevel);
                        }}
                        className="peer sr-only"
                      />
                      <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 transition-all peer-checked:border-cyan-300 peer-checked:bg-cyan-50 peer-checked:shadow-[0_18px_50px_-34px_rgba(14,165,233,0.7)]">
                        <div className="font-medium text-slate-950">{label}</div>
                      </div>
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section className={cn(currentStep !== "tracks" && "hidden")}>
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-slate-950">
                {messages.steps.tracks}
              </h2>
              <p className="text-sm leading-6 text-slate-600">
                {messages.stepDescriptions.tracks}
              </p>
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {Object.entries(trackLabels).map(([track, label]) => {
                const typedTrack = track as Track;
                const isChecked = preferredTracks.includes(typedTrack);

                return (
                  <label key={typedTrack} className="cursor-pointer">
                    <input
                      type="checkbox"
                      name="preferredTracks"
                      value={typedTrack}
                      checked={isChecked}
                      onChange={(event) => {
                        setStepError(null);
                        setPreferredTracks((currentTracks) => {
                          if (event.target.checked) {
                            return Array.from(
                              new Set([...currentTracks, typedTrack]),
                            );
                          }

                          if (currentTracks.length === 1) {
                            return currentTracks;
                          }

                          return currentTracks.filter((item) => item !== typedTrack);
                        });
                      }}
                      className="peer sr-only"
                    />
                    <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 transition-all peer-checked:border-cyan-300 peer-checked:bg-cyan-50 peer-checked:shadow-[0_18px_50px_-34px_rgba(14,165,233,0.7)]">
                      <div className="font-medium text-slate-950">{label}</div>
                    </div>
                  </label>
                );
              })}
            </div>
            {serverPreferredTracksError || (step === 1 && stepError) ? (
              <p className="mt-3 text-sm text-rose-600">
                {serverPreferredTracksError ?? stepError}
              </p>
            ) : null}
          </section>

          <section className={cn(currentStep !== "cadence" && "hidden")}>
            <div className="space-y-2">
              <h2 className="text-sm font-medium text-slate-950">
                {messages.steps.cadence}
              </h2>
              <p className="text-sm leading-6 text-slate-600">
                {messages.stepDescriptions.cadence}
              </p>
            </div>

            <div className="mt-6 space-y-6">
              <div>
                <label
                  htmlFor="weeklyGoal"
                  className="text-sm font-medium text-slate-950"
                >
                  {settingsMessages.weeklyGoalLabel}
                </label>
                <Input
                  id="weeklyGoal"
                  name="weeklyGoal"
                  type="number"
                  min={5}
                  max={150}
                  value={weeklyGoal}
                  onChange={(event) => {
                    setStepError(null);
                    setWeeklyGoal(event.target.value);
                  }}
                  className="mt-3 max-w-48"
                />
                <p className="mt-2 text-sm text-slate-500">
                  {settingsMessages.weeklyGoalHint}
                </p>
                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <span className="text-xs uppercase tracking-[0.22em] text-slate-400">
                    {settingsMessages.weeklyGoalPresetsLabel}
                  </span>
                  {weeklyGoalPresets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => {
                        setStepError(null);
                        setWeeklyGoal(String(preset));
                      }}
                      className={cn(
                        "rounded-full border px-3 py-1.5 text-sm transition-colors",
                        weeklyGoal === String(preset)
                          ? "border-cyan-300 bg-cyan-50 text-cyan-700"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300",
                      )}
                    >
                      {preset}
                    </button>
                  ))}
                </div>
                {serverWeeklyGoalError ? (
                  <p className="mt-2 text-sm text-rose-600">
                    {serverWeeklyGoalError}
                  </p>
                ) : null}
              </div>

              <div>
                <div className="text-sm font-medium text-slate-950">
                  {settingsMessages.focusModeTitle}
                </div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  {settingsMessages.focusModeDescription}
                </p>
                <div className="mt-4 grid gap-3">
                  {Object.entries(settingsMessages.focusModes).map(
                    ([value, option]) => (
                      <label key={value} className="cursor-pointer">
                        <input
                          type="radio"
                          name="focusMode"
                          value={value}
                          checked={focusMode === value}
                          onChange={() => {
                            setStepError(null);
                            setFocusMode(value as FocusMode);
                          }}
                          className="peer sr-only"
                        />
                        <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 transition-all peer-checked:border-cyan-300 peer-checked:bg-cyan-50 peer-checked:shadow-[0_18px_50px_-34px_rgba(14,165,233,0.7)]">
                          <div className="font-medium text-slate-950">
                            {option.label}
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {option.description}
                          </p>
                        </div>
                      </label>
                    ),
                  )}
                </div>
              </div>
            </div>
          </section>

          <div className="mt-8 flex items-center justify-between gap-3">
            <Button
              type="button"
              variant="secondary"
              onClick={() => {
                setStepError(null);
                setStep((currentStepIndex) => Math.max(0, currentStepIndex - 1));
              }}
              disabled={step === 0}
            >
              {messages.actions.back}
            </Button>

            {step < stepOrder.length - 1 ? (
              <Button
                type="button"
                onClick={() =>
                  {
                    if (step === 0) {
                      const trimmedTargetRole = targetRole.trim();

                      if (!trimmedTargetRole) {
                        setStepError(settingsMessages.errors.targetRoleRequired);
                        return;
                      }

                      if (trimmedTargetRole.length > 120) {
                        setStepError(settingsMessages.errors.targetRoleTooLong);
                        return;
                      }
                    }

                    if (step === 1 && preferredTracks.length === 0) {
                      setStepError(settingsMessages.errors.preferredTracksRequired);
                      return;
                    }

                    setStepError(null);
                    setStep((currentStepIndex) =>
                      Math.min(stepOrder.length - 1, currentStepIndex + 1),
                    );
                  }
                }
              >
                {messages.actions.next}
              </Button>
            ) : (
              <FinishButton
                idleLabel={messages.actions.finish}
                pendingLabel={messages.actions.finishing}
              />
            )}
          </div>
        </form>
      </div>

      <aside className="rounded-[32px] border border-slate-900/5 bg-slate-950 p-6 text-white shadow-[0_40px_100px_-55px_rgba(15,23,42,0.78)]">
        <h2 className="font-display text-3xl font-semibold tracking-tight">
          {messages.panelTitle}
        </h2>
        <p className="mt-3 text-sm leading-7 text-slate-300">
          {messages.panelDescription}
        </p>

        <div className="mt-6 space-y-3">
          {messages.panelItems.map((item) => (
            <div
              key={item}
              className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200"
            >
              {item}
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-[24px] border border-white/10 bg-white/5 p-5">
          <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
            {settingsMessages.summaryTargetLabel}
          </div>
          <div className="mt-2 text-lg font-medium text-white">
            {targetRole.trim() || settingsMessages.summaryEmptyTargetRole}
          </div>
          <div className="mt-2 text-sm text-slate-300">
            {levelLabels[targetLevel]}
          </div>

          <div className="mt-5 text-xs uppercase tracking-[0.22em] text-slate-400">
            {settingsMessages.summaryTracksLabel}
          </div>
          <div className="mt-2 text-sm text-slate-200">{summaryTracks}</div>

          <div className="mt-5 text-xs uppercase tracking-[0.22em] text-slate-400">
            {settingsMessages.summaryWeeklyGoalLabel}
          </div>
          <div className="mt-2 text-sm text-slate-200">
            {weeklyGoal} {settingsMessages.weeklyGoalUnit}
          </div>
        </div>
      </aside>
    </div>
  );
}
