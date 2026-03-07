import { QuestionLevel, Track } from "@prisma/client";
import { cache } from "react";
import { prisma } from "@/lib/prisma";

export const focusModeValues = [
  "balanced",
  "deep_dive",
  "interview_cram",
] as const;

export type FocusMode = (typeof focusModeValues)[number];

const validTrackSet = new Set<Track>([
  Track.REACT,
  Track.REACT_NATIVE,
  Track.TYPESCRIPT,
  Track.FRONTEND_SYSTEMS,
]);

const validFocusModeSet = new Set<FocusMode>(focusModeValues);

export type UserPreferenceSnapshot = {
  id: string;
  userId: string;
  targetRole: string;
  targetLevel: QuestionLevel;
  weeklyGoal: number;
  preferredTracks: Track[];
  focusMode: FocusMode;
  isConfigured: boolean;
  createdAt: Date;
  updatedAt: Date;
};

function clampWeeklyGoal(value: number | null | undefined) {
  if (!value || Number.isNaN(value)) {
    return 30;
  }

  return Math.min(150, Math.max(5, Math.round(value)));
}

export function normalizeFocusMode(value: string | null | undefined): FocusMode {
  if (!value) {
    return "balanced";
  }

  const normalizedValue = value.trim().toLowerCase();

  if (normalizedValue === "deepdive") {
    return "deep_dive";
  }

  if (normalizedValue === "interviewcram") {
    return "interview_cram";
  }

  return validFocusModeSet.has(normalizedValue as FocusMode)
    ? (normalizedValue as FocusMode)
    : "balanced";
}

export function normalizePreferredTracks(tracks: Track[] | null | undefined) {
  const sanitizedTracks = Array.from(
    new Set((tracks ?? []).filter((track) => validTrackSet.has(track))),
  );

  return sanitizedTracks.length > 0
    ? sanitizedTracks
    : [Track.REACT, Track.TYPESCRIPT];
}

function mapPreferenceSnapshot(preference: {
  id: string;
  userId: string;
  targetRole: string | null;
  targetLevel: QuestionLevel | null;
  weeklyGoal: number;
  preferredTracks: Track[];
  focusMode: string;
  createdAt: Date;
  updatedAt: Date;
}) {
  const targetRole = preference.targetRole?.trim() ?? "";
  const targetLevel = preference.targetLevel ?? QuestionLevel.MID;
  const preferredTracks = normalizePreferredTracks(preference.preferredTracks);
  const focusMode = normalizeFocusMode(preference.focusMode);

  return {
    id: preference.id,
    userId: preference.userId,
    targetRole,
    targetLevel,
    weeklyGoal: clampWeeklyGoal(preference.weeklyGoal),
    preferredTracks,
    focusMode,
    isConfigured: targetRole.length > 0,
    createdAt: preference.createdAt,
    updatedAt: preference.updatedAt,
  } satisfies UserPreferenceSnapshot;
}

async function ensureUserPreferenceRecord(userId: string) {
  const existingPreference = await prisma.userPreference.findUnique({
    where: { userId },
  });

  if (existingPreference) {
    return existingPreference;
  }

  try {
    return await prisma.userPreference.create({
      data: {
        userId,
        targetLevel: QuestionLevel.MID,
        weeklyGoal: 30,
        preferredTracks: [Track.REACT, Track.TYPESCRIPT],
        focusMode: "balanced",
      },
    });
  } catch (error) {
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      const concurrentPreference = await prisma.userPreference.findUnique({
        where: { userId },
      });

      if (concurrentPreference) {
        return concurrentPreference;
      }
    }

    throw error;
  }
}

export const getUserPreferences = cache(async (userId: string) => {
  const preference = await ensureUserPreferenceRecord(userId);

  return mapPreferenceSnapshot(preference);
});

export async function updateUserPreferences(
  userId: string,
  input: {
    targetRole: string;
    targetLevel: QuestionLevel;
    weeklyGoal: number;
    preferredTracks: Track[];
    focusMode: FocusMode;
  },
) {
  await ensureUserPreferenceRecord(userId);

  const preference = await prisma.userPreference.update({
    where: { userId },
    data: {
      targetRole: input.targetRole.trim() || null,
      targetLevel: input.targetLevel,
      weeklyGoal: clampWeeklyGoal(input.weeklyGoal),
      preferredTracks: normalizePreferredTracks(input.preferredTracks),
      focusMode: normalizeFocusMode(input.focusMode),
    },
  });

  return mapPreferenceSnapshot(preference);
}
