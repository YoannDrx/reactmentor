import { QuestionLevel, Track } from "@prisma/client";
import { cache } from "react";
import type { Locale } from "@/i18n/config";
import { getLocalizedModuleCatalogWithProgress } from "@/lib/content-repository";
import { prisma } from "@/lib/prisma";
import type {
  FocusMode,
  UserPreferenceSnapshot,
} from "@/features/settings/user-preferences";
import { getUserPreferences } from "@/features/settings/user-preferences";
import type {
  DashboardRecommendation,
  ModuleRecommendationReason,
} from "./dashboard-recommendation-contract";

type ModuleRecommendationCandidate = {
  id: string;
  slug: string;
  title: string;
  track: Track;
  level: QuestionLevel;
  order: number;
  counts: {
    questions: number;
    skills: number;
  };
  skills: Array<{
    id: string;
    title: string;
  }>;
  userProgress: {
    attemptedQuestions: number;
    masteredQuestions: number;
    progressPercent: number;
  };
};

function getLevelRank(level: QuestionLevel) {
  if (level === QuestionLevel.JUNIOR) {
    return 1;
  }

  if (level === QuestionLevel.MID) {
    return 2;
  }

  return 3;
}

function getTrackPriority(track: Track, preferredTracks: Track[]) {
  const preferredIndex = preferredTracks.indexOf(track);

  if (preferredIndex === -1) {
    return 18;
  }

  return Math.max(42, 120 - preferredIndex * 28);
}

function getLevelPriority(
  moduleLevel: QuestionLevel,
  targetLevel: QuestionLevel,
) {
  const distance = Math.abs(getLevelRank(moduleLevel) - getLevelRank(targetLevel));

  if (distance === 0) {
    return 30;
  }

  if (distance === 1) {
    return 16;
  }

  return 6;
}

function getProgressPriority(input: {
  focusMode: FocusMode;
  attemptedQuestions: number;
  progressPercent: number;
}) {
  if (input.attemptedQuestions === 0) {
    if (input.focusMode === "deep_dive") {
      return 12;
    }

    return 34;
  }

  if (input.focusMode === "deep_dive") {
    if (input.progressPercent < 80) {
      return 32;
    }

    return 14;
  }

  if (input.focusMode === "interview_cram") {
    if (input.progressPercent >= 15 && input.progressPercent < 75) {
      return 28;
    }

    return 12;
  }

  if (input.progressPercent < 45) {
    return 24;
  }

  if (input.progressPercent < 85) {
    return 14;
  }

  return 6;
}

function getRecommendationReason(module: ModuleRecommendationCandidate) {
  if (module.userProgress.attemptedQuestions === 0) {
    return "start";
  }

  if (module.userProgress.progressPercent < 55) {
    return "grow";
  }

  return "reinforce";
}

function scoreModuleRecommendation(
  module: ModuleRecommendationCandidate,
  preference: Pick<
    UserPreferenceSnapshot,
    "preferredTracks" | "targetLevel" | "focusMode"
  >,
) {
  let score = 0;

  score += getTrackPriority(module.track, preference.preferredTracks);
  score += getLevelPriority(module.level, preference.targetLevel);
  score += getProgressPriority({
    focusMode: preference.focusMode,
    attemptedQuestions: module.userProgress.attemptedQuestions,
    progressPercent: module.userProgress.progressPercent,
  });
  score += Math.max(0, 100 - module.userProgress.progressPercent) / 4;
  score += Math.min(module.counts.questions, 12);

  return score;
}

export function computeDashboardRecommendation(input: {
  dueCount: number;
  preference: Pick<
    UserPreferenceSnapshot,
    "preferredTracks" | "targetLevel" | "focusMode"
  >;
  modules: ModuleRecommendationCandidate[];
}): DashboardRecommendation {
  if (input.dueCount > 0) {
    return {
      kind: "review",
      dueCount: input.dueCount,
      questionCount: Math.min(10, Math.max(1, input.dueCount)),
    };
  }

  const bestModule = [...input.modules]
    .map((module) => ({
      module,
      score: scoreModuleRecommendation(module, input.preference),
      reason: getRecommendationReason(module),
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      if (left.module.order !== right.module.order) {
        return left.module.order - right.module.order;
      }

      return left.module.title.localeCompare(right.module.title);
    })[0];

  if (!bestModule) {
    return {
      kind: "none",
    };
  }

  return {
    kind: "module",
    reason: bestModule.reason as ModuleRecommendationReason,
    moduleSlug: bestModule.module.slug,
    moduleTitle: bestModule.module.title,
    track: bestModule.module.track,
    progressPercent: bestModule.module.userProgress.progressPercent,
    attemptedQuestions: bestModule.module.userProgress.attemptedQuestions,
    masteredQuestions: bestModule.module.userProgress.masteredQuestions,
    focusSkills: bestModule.module.skills.slice(0, 3).map((skill) => skill.title),
  };
}

export const getDashboardRecommendation = cache(
  async (userId: string, locale: Locale) => {
    const [preference, modules, dueCount] = await Promise.all([
      getUserPreferences(userId),
      getLocalizedModuleCatalogWithProgress(userId, locale),
      prisma.questionProgress.count({
        where: {
          userId,
          nextReviewAt: {
            lte: new Date(),
          },
        },
      }),
    ]);

    return computeDashboardRecommendation({
      dueCount,
      preference,
      modules,
    });
  },
);
