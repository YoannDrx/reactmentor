import type { MockTemplateKey, TrainingSessionConfig } from "./session-contract";

export type SessionTimingSnapshot = {
  durationMinutes: number;
  deadlineAt: Date;
  elapsedSeconds: number;
  remainingSeconds: number;
  percentRemaining: number;
  isExpired: boolean;
};

export type MockPressureState = "controlled" | "tight" | "overrun";

export function getSessionTimingSnapshot(
  config: Pick<TrainingSessionConfig, "durationMinutes"> | null,
  startedAt: Date,
  now: Date,
  endedAt?: Date | null,
): SessionTimingSnapshot | null {
  if (!config?.durationMinutes || config.durationMinutes <= 0) {
    return null;
  }

  const durationSeconds = config.durationMinutes * 60;
  const deadlineAt = new Date(startedAt.getTime() + durationSeconds * 1000);
  const referenceTime = endedAt ?? now;
  const rawElapsedSeconds = Math.floor(
    (referenceTime.getTime() - startedAt.getTime()) / 1000,
  );
  const elapsedSeconds = Math.max(0, rawElapsedSeconds);
  const remainingSeconds = Math.max(
    0,
    Math.ceil((deadlineAt.getTime() - referenceTime.getTime()) / 1000),
  );
  const percentRemaining =
    durationSeconds > 0
      ? Math.max(
          0,
          Math.min(100, Math.round((remainingSeconds / durationSeconds) * 100)),
        )
      : 0;

  return {
    durationMinutes: config.durationMinutes,
    deadlineAt,
    elapsedSeconds,
    remainingSeconds,
    percentRemaining,
    isExpired: remainingSeconds <= 0,
  };
}

export function getMockPressureState(input: {
  score: number;
  answeredCount: number;
  totalQuestions: number;
  timeSpentMinutes: number;
  timeBudgetMinutes: number;
}): MockPressureState {
  const completionRatio =
    input.totalQuestions > 0 ? input.answeredCount / input.totalQuestions : 0;

  if (
    input.score >= 80 &&
    completionRatio >= 1 &&
    input.timeSpentMinutes <= input.timeBudgetMinutes * 0.85
  ) {
    return "controlled";
  }

  if (
    input.score >= 60 &&
    completionRatio >= 0.7 &&
    input.timeSpentMinutes <= input.timeBudgetMinutes
  ) {
    return "tight";
  }

  return "overrun";
}

export function getMockTemplateTitle(
  templateKey: MockTemplateKey | null | undefined,
  titles: Partial<Record<MockTemplateKey, string>>,
  fallbackTitle: string,
) {
  if (!templateKey) {
    return fallbackTitle;
  }

  return titles[templateKey] ?? fallbackTitle;
}
