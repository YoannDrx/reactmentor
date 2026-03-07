import { QuestionLevel, SessionMode, Track } from "@prisma/client";
import type { Locale } from "@/i18n/config";

export const mockTemplateKeys = [
  "react_mid_30",
  "frontend_senior_defense",
  "react_native_sprint",
] as const;

export type MockTemplateKey = (typeof mockTemplateKeys)[number];

export type SessionSource = "module" | "mock_template";

export type TrainingSessionConfig = {
  source: SessionSource;
  locale: Locale;
  questionCount: number;
  durationMinutes?: number | null;
  moduleSlug?: string | null;
  tracks?: Track[];
  level?: QuestionLevel | null;
  templateKey?: MockTemplateKey | null;
};

export function parseTrainingSessionConfig(
  value: unknown,
): TrainingSessionConfig | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const config = value as Record<string, unknown>;
  const source =
    config.source === "module" || config.source === "mock_template"
      ? config.source
      : null;
  const locale = config.locale === "fr" || config.locale === "en" ? config.locale : null;
  const questionCount =
    typeof config.questionCount === "number" && Number.isFinite(config.questionCount)
      ? config.questionCount
      : null;

  if (!source || !locale || !questionCount) {
    return null;
  }

  return {
    source,
    locale,
    questionCount,
    durationMinutes:
      typeof config.durationMinutes === "number" &&
      Number.isFinite(config.durationMinutes)
        ? config.durationMinutes
        : undefined,
    moduleSlug:
      typeof config.moduleSlug === "string" ? config.moduleSlug : undefined,
    tracks: Array.isArray(config.tracks)
      ? config.tracks.filter((track): track is Track =>
          Object.values(Track).includes(track as Track),
        )
      : undefined,
    level:
      typeof config.level === "string" &&
      Object.values(QuestionLevel).includes(config.level as QuestionLevel)
        ? (config.level as QuestionLevel)
        : undefined,
    templateKey:
      typeof config.templateKey === "string" &&
      mockTemplateKeys.includes(config.templateKey as MockTemplateKey)
        ? (config.templateKey as MockTemplateKey)
        : undefined,
  };
}

export type CreateTrainingSessionInput = {
  userId: string;
  mode: SessionMode;
  locale: Locale;
  questionCount?: number;
  moduleSlug?: string;
  tracks?: Track[];
  level?: QuestionLevel;
  templateKey?: MockTemplateKey;
};

export const mockTemplateDefinitions: Record<
  MockTemplateKey,
  {
    mode: SessionMode;
    tracks: Track[];
    level: QuestionLevel;
    questionCount: number;
    durationMinutes: number;
  }
> = {
  react_mid_30: {
    mode: SessionMode.MOCK_INTERVIEW,
    tracks: [Track.REACT],
    level: QuestionLevel.MID,
    questionCount: 10,
    durationMinutes: 30,
  },
  frontend_senior_defense: {
    mode: SessionMode.MOCK_INTERVIEW,
    tracks: [Track.REACT, Track.TYPESCRIPT, Track.FRONTEND_SYSTEMS],
    level: QuestionLevel.SENIOR,
    questionCount: 6,
    durationMinutes: 45,
  },
  react_native_sprint: {
    mode: SessionMode.MOCK_INTERVIEW,
    tracks: [Track.REACT_NATIVE],
    level: QuestionLevel.MID,
    questionCount: 8,
    durationMinutes: 20,
  },
};

export function resolveTrainingSessionInput(
  input: CreateTrainingSessionInput,
) {
  if (!input.templateKey) {
    return {
      ...input,
      mode: input.mode,
      questionCount: input.questionCount ?? 8,
      durationMinutes: undefined,
      tracks: input.tracks,
      level: input.level,
    };
  }

  const template = mockTemplateDefinitions[input.templateKey];

  return {
    ...input,
    mode: template.mode,
    questionCount: input.questionCount ?? template.questionCount,
    durationMinutes: template.durationMinutes,
    tracks: input.tracks ?? template.tracks,
    level: input.level ?? template.level,
  };
}
