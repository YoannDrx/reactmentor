import type { Locale } from "@/i18n/config";
import { getDashboardRecommendation } from "@/features/dashboard/dashboard-recommendations";
import { Track } from "@prisma/client";
import { getUserPreferences } from "@/features/settings/user-preferences";
import { prisma } from "@/lib/prisma";

export async function getDashboardShellSnapshot(userId: string, locale: Locale) {
  const now = new Date();
  const [preferences, dueReviews, readinessAggregate, recommendation] = await Promise.all([
    getUserPreferences(userId),
    prisma.questionProgress.count({
      where: {
        userId,
        nextReviewAt: {
          lte: now,
        },
      },
    }),
    prisma.skillProgress.aggregate({
      where: { userId },
      _avg: {
        masteryScore: true,
      },
    }),
    getDashboardRecommendation(userId, locale),
  ]);

  return {
    dueReviews,
    readiness: Math.round(readinessAggregate._avg.masteryScore ?? 0),
    targetRole: preferences.targetRole,
    targetLevel: preferences.targetLevel,
    primaryTrack: preferences.preferredTracks[0] ?? Track.REACT,
    recommendation,
  };
}
