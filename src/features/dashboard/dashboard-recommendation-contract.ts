import { Track } from "@prisma/client";

export type ModuleRecommendationReason = "start" | "grow" | "reinforce";

export type DashboardRecommendation =
  | {
      kind: "review";
      dueCount: number;
      questionCount: number;
    }
  | {
      kind: "module";
      reason: ModuleRecommendationReason;
      moduleSlug: string;
      moduleTitle: string;
      track: Track;
      progressPercent: number;
      attemptedQuestions: number;
      masteredQuestions: number;
      focusSkills: string[];
    }
  | {
      kind: "none";
    };
