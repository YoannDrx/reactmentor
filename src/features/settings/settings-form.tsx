"use client";

import { QuestionLevel, Track } from "@prisma/client";
import { useActionState, useEffect, useMemo, useState } from "react";
import { useFormStatus } from "react-dom";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { initialSettingsActionState } from "./settings.state";
import {
  updateSettingsAction,
} from "./settings.action";
import type { FocusMode, UserPreferenceSnapshot } from "./user-preferences";

const weeklyGoalPresets = [20, 30, 45] as const;

type FocusModeMessage = {
  label: string;
  description: string;
};

export type SettingsFormMessages = {
  introBadge: string;
  introTitle: string;
  introDescription: string;
  targetRoleLabel: string;
  targetRoleHint: string;
  targetRolePlaceholder: string;
  targetLevelTitle: string;
  targetLevelDescription: string;
  preferredTracksTitle: string;
  preferredTracksDescription: string;
  weeklyGoalTitle: string;
  weeklyGoalDescription: string;
  weeklyGoalLabel: string;
  weeklyGoalHint: string;
  weeklyGoalPresetsLabel: string;
  focusModeTitle: string;
  focusModeDescription: string;
  lifecycleEmailsTitle: string;
  lifecycleEmailsDescription: string;
  lifecycleEmailsLabel: string;
  lifecycleEmailsHint: string;
  summaryTitle: string;
  summaryDescription: string;
  summaryTargetLabel: string;
  summaryWeeklyGoalLabel: string;
  summaryFocusModeLabel: string;
  summaryTracksLabel: string;
  summaryEmailsLabel: string;
  summaryEmailsEnabled: string;
  summaryEmailsDisabled: string;
  summaryEmptyTargetRole: string;
  summaryConfigured: string;
  summaryNotConfigured: string;
  weeklyGoalUnit: string;
  actions: {
    save: string;
    saving: string;
  };
  errors: {
    targetRoleRequired: string;
    targetRoleTooLong: string;
    weeklyGoalTooSmall: string;
    weeklyGoalTooBig: string;
    preferredTracksRequired: string;
    invalidSelection: string;
    unauthorized: string;
    unknown: string;
  };
  toasts: {
    saved: string;
  };
  focusModes: Record<FocusMode, FocusModeMessage>;
};

type SettingsFormProps = {
  preference: UserPreferenceSnapshot;
  messages: SettingsFormMessages;
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

  if (fieldName === "targetRole" && code === "required") {
    return messages.errors.targetRoleRequired;
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

function SaveButton({
  idleLabel,
  pendingLabel,
}: {
  idleLabel: string;
  pendingLabel: string;
}) {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full sm:w-auto" disabled={pending}>
      {pending ? pendingLabel : idleLabel}
    </Button>
  );
}

export function SettingsForm({
  preference,
  messages,
  trackLabels,
  levelLabels,
}: SettingsFormProps) {
  const [state, formAction] = useActionState(
    updateSettingsAction,
    initialSettingsActionState,
  );
  const [targetRole, setTargetRole] = useState(preference.targetRole);
  const [targetLevel, setTargetLevel] = useState<QuestionLevel>(
    preference.targetLevel,
  );
  const [weeklyGoal, setWeeklyGoal] = useState(String(preference.weeklyGoal));
  const [focusMode, setFocusMode] = useState<FocusMode>(preference.focusMode);
  const [preferredTracks, setPreferredTracks] = useState<Track[]>(
    preference.preferredTracks,
  );
  const [lifecycleEmailsEnabled, setLifecycleEmailsEnabled] = useState(
    preference.lifecycleEmailsEnabled,
  );

  useEffect(() => {
    if (state.status === "success") {
      toast.success(messages.toasts.saved);
    }

    if (state.formError === "unauthorized") {
      toast.error(messages.errors.unauthorized);
    }

    if (state.formError === "unknown") {
      toast.error(messages.errors.unknown);
    }
  }, [messages.errors.unauthorized, messages.errors.unknown, messages.toasts.saved, state.formError, state.status]);

  const fieldErrors = state.fieldErrors;
  const summaryTarget =
    targetRole.trim() || messages.summaryEmptyTargetRole;
  const summaryTracks = useMemo(
    () => preferredTracks.map((track) => trackLabels[track]).join(" · "),
    [preferredTracks, trackLabels],
  );
  const isConfigured = targetRole.trim().length > 0;

  return (
    <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
      <div className="space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-white/80 p-6 shadow-[0_30px_80px_-48px_rgba(15,23,42,0.25)]">
          <Badge className="border-slate-200 bg-slate-100 text-slate-700">
            {messages.introBadge}
          </Badge>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-tight text-slate-950">
            {messages.introTitle}
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-600">
            {messages.introDescription}
          </p>
        </div>

        <form action={formAction} className="grid gap-6">
          <section className="rounded-[28px] border border-slate-200 bg-white/85 p-6">
            <div className="space-y-2">
              <label
                htmlFor="targetRole"
                className="text-sm font-medium text-slate-950"
              >
                {messages.targetRoleLabel}
              </label>
              <p className="text-sm leading-6 text-slate-600">
                {messages.targetRoleHint}
              </p>
            </div>
            <Input
              id="targetRole"
              name="targetRole"
              value={targetRole}
              onChange={(event) => setTargetRole(event.target.value)}
              placeholder={messages.targetRolePlaceholder}
              className="mt-4"
            />
            {resolveFieldError("targetRole", messages, fieldErrors) ? (
              <p className="mt-2 text-sm text-rose-600">
                {resolveFieldError("targetRole", messages, fieldErrors)}
              </p>
            ) : null}
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white/85 p-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-950">
                {messages.targetLevelTitle}
              </h3>
              <p className="text-sm leading-6 text-slate-600">
                {messages.targetLevelDescription}
              </p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-3">
              {Object.entries(levelLabels).map(([value, label]) => (
                <label
                  key={value}
                  className="cursor-pointer"
                >
                  <input
                    type="radio"
                    name="targetLevel"
                    value={value}
                    checked={targetLevel === value}
                    onChange={() => setTargetLevel(value as QuestionLevel)}
                    className="peer sr-only"
                  />
                  <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 transition-all peer-checked:border-cyan-300 peer-checked:bg-cyan-50 peer-checked:shadow-[0_18px_50px_-34px_rgba(14,165,233,0.7)]">
                    <div className="font-medium text-slate-950">{label}</div>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white/85 p-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-950">
                {messages.preferredTracksTitle}
              </h3>
              <p className="text-sm leading-6 text-slate-600">
                {messages.preferredTracksDescription}
              </p>
            </div>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {Object.entries(trackLabels).map(([track, label]) => {
                const typedTrack = track as Track;
                const isChecked = preferredTracks.includes(typedTrack);

                return (
                  <label
                    key={typedTrack}
                    className="cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      name="preferredTracks"
                      value={typedTrack}
                      checked={isChecked}
                      onChange={(event) => {
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
            {resolveFieldError("preferredTracks", messages, fieldErrors) ? (
              <p className="mt-2 text-sm text-rose-600">
                {resolveFieldError("preferredTracks", messages, fieldErrors)}
              </p>
            ) : null}
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white/85 p-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-950">
                {messages.weeklyGoalTitle}
              </h3>
              <p className="text-sm leading-6 text-slate-600">
                {messages.weeklyGoalDescription}
              </p>
            </div>
            <div className="mt-4">
              <label
                htmlFor="weeklyGoal"
                className="text-sm font-medium text-slate-950"
              >
                {messages.weeklyGoalLabel}
              </label>
              <Input
                id="weeklyGoal"
                name="weeklyGoal"
                type="number"
                min={5}
                max={150}
                value={weeklyGoal}
                onChange={(event) => setWeeklyGoal(event.target.value)}
                className="mt-3 max-w-48"
              />
              <p className="mt-2 text-sm text-slate-500">{messages.weeklyGoalHint}</p>
              <div className="mt-4 flex flex-wrap items-center gap-2">
                <span className="text-xs uppercase tracking-[0.22em] text-slate-400">
                  {messages.weeklyGoalPresetsLabel}
                </span>
                {weeklyGoalPresets.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => setWeeklyGoal(String(preset))}
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
            </div>
            {resolveFieldError("weeklyGoal", messages, fieldErrors) ? (
              <p className="mt-2 text-sm text-rose-600">
                {resolveFieldError("weeklyGoal", messages, fieldErrors)}
              </p>
            ) : null}
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white/85 p-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-950">
                {messages.focusModeTitle}
              </h3>
              <p className="text-sm leading-6 text-slate-600">
                {messages.focusModeDescription}
              </p>
            </div>
            <div className="mt-4 grid gap-3">
              {Object.entries(messages.focusModes).map(([value, option]) => (
                <label
                  key={value}
                  className="cursor-pointer"
                >
                  <input
                    type="radio"
                    name="focusMode"
                    value={value}
                    checked={focusMode === value}
                    onChange={() => setFocusMode(value as FocusMode)}
                    className="peer sr-only"
                  />
                  <div className="rounded-[24px] border border-slate-200 bg-slate-50/70 p-4 transition-all peer-checked:border-cyan-300 peer-checked:bg-cyan-50 peer-checked:shadow-[0_18px_50px_-34px_rgba(14,165,233,0.7)]">
                    <div className="font-medium text-slate-950">{option.label}</div>
                    <p className="mt-2 text-sm leading-6 text-slate-600">
                      {option.description}
                    </p>
                  </div>
                </label>
              ))}
            </div>
          </section>

          <section className="rounded-[28px] border border-slate-200 bg-white/85 p-6">
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-slate-950">
                {messages.lifecycleEmailsTitle}
              </h3>
              <p className="text-sm leading-6 text-slate-600">
                {messages.lifecycleEmailsDescription}
              </p>
            </div>
            <label className="mt-4 flex items-start gap-3 rounded-[24px] border border-slate-200 bg-slate-50/70 p-4">
              <input
                type="checkbox"
                name="lifecycleEmailsEnabled"
                checked={lifecycleEmailsEnabled}
                onChange={(event) =>
                  setLifecycleEmailsEnabled(event.target.checked)
                }
                className="mt-1 h-4 w-4 rounded border-slate-300 text-slate-950"
              />
              <span className="grid gap-1">
                <span className="font-medium text-slate-950">
                  {messages.lifecycleEmailsLabel}
                </span>
                <span className="text-sm leading-6 text-slate-600">
                  {messages.lifecycleEmailsHint}
                </span>
              </span>
            </label>
          </section>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-sm leading-6 text-slate-500">
              {isConfigured
                ? messages.summaryConfigured
                : messages.summaryNotConfigured}
            </div>
            <SaveButton
              idleLabel={messages.actions.save}
              pendingLabel={messages.actions.saving}
            />
          </div>
        </form>
      </div>

      <aside className="space-y-6">
        <div className="rounded-[28px] border border-slate-200 bg-slate-950 p-6 text-white shadow-[0_35px_90px_-50px_rgba(15,23,42,0.75)]">
          <h3 className="font-display text-2xl font-semibold">
            {messages.summaryTitle}
          </h3>
          <p className="mt-3 text-sm leading-6 text-slate-300">
            {messages.summaryDescription}
          </p>
          <div className="mt-6 space-y-4">
            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                {messages.summaryTargetLabel}
              </div>
              <div className="mt-2 text-base font-medium text-white">
                {summaryTarget}
              </div>
              <div className="mt-2 text-sm text-slate-300">
                {levelLabels[targetLevel]}
              </div>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                {messages.summaryWeeklyGoalLabel}
              </div>
              <div className="mt-2 text-base font-medium text-white">
                {weeklyGoal} {messages.weeklyGoalUnit}
              </div>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                {messages.summaryFocusModeLabel}
              </div>
              <div className="mt-2 text-base font-medium text-white">
                {messages.focusModes[focusMode].label}
              </div>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                {messages.summaryTracksLabel}
              </div>
              <div className="mt-2 text-base font-medium text-white">
                {summaryTracks}
              </div>
            </div>

            <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
              <div className="text-xs uppercase tracking-[0.22em] text-slate-400">
                {messages.summaryEmailsLabel}
              </div>
              <div className="mt-2 text-base font-medium text-white">
                {lifecycleEmailsEnabled
                  ? messages.summaryEmailsEnabled
                  : messages.summaryEmailsDisabled}
              </div>
            </div>
          </div>
        </div>
      </aside>
    </div>
  );
}
