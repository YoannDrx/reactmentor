import { ContentStatus } from "@prisma/client";
import { cache } from "react";
import type { Locale } from "@/i18n/config";
import {
  localizeModule,
  localizeQuestionSummary,
  localizeSkill,
} from "@/lib/content-repository";
import { prisma } from "@/lib/prisma";

export type LessonWorkspaceStatus =
  | "reviewDue"
  | "unverified"
  | "checkpointReady"
  | "studied";

function getLessonWorkspaceStatus(params: {
  lessonViews: number;
  checkpointAttempts: number;
  lastLessonCheckpointPassed: boolean | null;
  nextReviewAt: Date | null;
  lastAttemptAt: Date | null;
  now: Date;
}): LessonWorkspaceStatus {
  const hasLessonTracking =
    params.lessonViews > 0 ||
    params.checkpointAttempts > 0 ||
    (!params.lastAttemptAt && params.nextReviewAt !== null);
  const isReviewDue = params.nextReviewAt ? params.nextReviewAt <= params.now : false;

  if (hasLessonTracking && isReviewDue) {
    return "reviewDue";
  }

  if (params.lessonViews > 0 && params.checkpointAttempts === 0) {
    return "unverified";
  }

  if (params.lastLessonCheckpointPassed === true) {
    return "checkpointReady";
  }

  return "studied";
}

function getStatusRank(status: LessonWorkspaceStatus) {
  if (status === "reviewDue") {
    return 0;
  }

  if (status === "unverified") {
    return 1;
  }

  if (status === "studied") {
    return 2;
  }

  return 3;
}

export const getLessonWorkspaceReadModel = cache(
  async (userId: string, locale: Locale) => {
    const now = new Date();
    const progressRows = await prisma.questionProgress.findMany({
      where: {
        userId,
        question: {
          status: ContentStatus.PUBLISHED,
          module: {
            status: ContentStatus.PUBLISHED,
          },
          primarySkill: {
            status: ContentStatus.PUBLISHED,
          },
        },
        OR: [
          {
            lessonViews: {
              gt: 0,
            },
          },
          {
            lessonCheckpointAttempts: {
              gt: 0,
            },
          },
          {
            lastAttemptAt: null,
            nextReviewAt: {
              not: null,
            },
          },
        ],
      },
      include: {
        question: {
          include: {
            translations: true,
            primarySkill: {
              include: {
                translations: true,
              },
            },
            module: {
              include: {
                translations: true,
              },
            },
          },
        },
      },
      take: 24,
    });

    const items = progressRows
      .map((progressRow) => {
        const localizedQuestion = localizeQuestionSummary(
          progressRow.question,
          locale,
        );
        const localizedSkill = localizeSkill(
          progressRow.question.primarySkill,
          locale,
        );
        const localizedModule = localizeModule(progressRow.question.module, locale);
        const status = getLessonWorkspaceStatus({
          lessonViews: progressRow.lessonViews,
          checkpointAttempts: progressRow.lessonCheckpointAttempts,
          lastLessonCheckpointPassed:
            progressRow.lastLessonCheckpointPassed ?? null,
          nextReviewAt: progressRow.nextReviewAt,
          lastAttemptAt: progressRow.lastAttemptAt,
          now,
        });

        return {
          questionId: progressRow.questionId,
          questionSlug: progressRow.question.slug,
          prompt: localizedQuestion.prompt,
          format: progressRow.question.format,
          skill: localizedSkill.title,
          module: localizedModule.title,
          moduleSlug: progressRow.question.module.slug,
          lessonViews: progressRow.lessonViews,
          checkpointAttempts: progressRow.lessonCheckpointAttempts,
          checkpointPassCount: progressRow.lessonCheckpointPassCount,
          lastLessonViewedAt: progressRow.lastLessonViewedAt,
          lastLessonCheckpointAt: progressRow.lastLessonCheckpointAt,
          lastAttemptAt: progressRow.lastAttemptAt,
          nextReviewAt: progressRow.nextReviewAt,
          hasAttemptSignal: progressRow.lastAttemptAt !== null,
          status,
        };
      })
      .sort((left, right) => {
        const statusRankDelta =
          getStatusRank(left.status) - getStatusRank(right.status);

        if (statusRankDelta !== 0) {
          return statusRankDelta;
        }

        const leftActivity =
          left.nextReviewAt?.getTime() ??
          left.lastLessonCheckpointAt?.getTime() ??
          left.lastLessonViewedAt?.getTime() ??
          0;
        const rightActivity =
          right.nextReviewAt?.getTime() ??
          right.lastLessonCheckpointAt?.getTime() ??
          right.lastLessonViewedAt?.getTime() ??
          0;

        if (rightActivity !== leftActivity) {
          return rightActivity - leftActivity;
        }

        return left.prompt.localeCompare(right.prompt);
      });

    return {
      count: items.length,
      trackedCount: items.length,
      viewedCount: items.filter((item) => item.lessonViews > 0).length,
      checkpointReadyCount: items.filter(
        (item) => item.status === "checkpointReady",
      ).length,
      reviewDueCount: items.filter((item) => item.status === "reviewDue").length,
      unverifiedCount: items.filter((item) => item.status === "unverified")
        .length,
      items,
    };
  },
);
