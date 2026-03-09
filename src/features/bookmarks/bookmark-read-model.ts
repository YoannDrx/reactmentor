import { MasteryState } from "@prisma/client";
import type { Locale } from "@/i18n/config";
import {
  localizeModule,
  localizeQuestion,
  localizeSkill,
} from "@/lib/content-repository";
import { prisma } from "@/lib/prisma";

export type BookmarkStatus = "pendingReview" | "due" | "stable" | "saved";
export type BookmarkLearningSignal =
  | "reviewDue"
  | "checkpointReady"
  | "lessonViewed"
  | null;

export async function getBookmarkReadModel(params: {
  userId: string;
  locale: Locale;
}) {
  const now = new Date();
  const bookmarks = await prisma.bookmark.findMany({
    where: {
      userId: params.userId,
    },
    orderBy: {
      createdAt: "desc",
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
          options: {
            include: {
              translations: true,
            },
            orderBy: {
              order: "asc",
            },
          },
          progress: {
            where: {
              userId: params.userId,
            },
            select: {
              nextReviewAt: true,
              masteryState: true,
              lessonViews: true,
              lessonCheckpointAttempts: true,
              lastLessonCheckpointPassed: true,
            },
            take: 1,
          },
          attempts: {
            where: {
              userId: params.userId,
            },
            orderBy: {
              createdAt: "desc",
            },
            select: {
              isCorrect: true,
            },
            take: 1,
          },
          notes: {
            where: {
              userId: params.userId,
            },
            select: {
              body: true,
              updatedAt: true,
            },
            orderBy: {
              updatedAt: "desc",
            },
            take: 1,
          },
        },
      },
    },
    take: 30,
  });

  const items = bookmarks.map((bookmark) => {
    const localizedQuestion = localizeQuestion(bookmark.question, params.locale);
    const localizedSkill = localizeSkill(
      bookmark.question.primarySkill,
      params.locale,
    );
    const localizedModule = localizeModule(bookmark.question.module, params.locale);
    const questionProgress = bookmark.question.progress[0] ?? null;
    const latestAttempt = bookmark.question.attempts[0] ?? null;
    const note = bookmark.question.notes[0] ?? null;
    const isPendingReview = latestAttempt?.isCorrect === null;
    const isDue =
      questionProgress?.nextReviewAt ? questionProgress.nextReviewAt <= now : false;
    const hasLessonSignal = Boolean(
      (questionProgress?.lessonViews ?? 0) > 0 ||
      (questionProgress?.lessonCheckpointAttempts ?? 0) > 0 ||
      (!latestAttempt && questionProgress?.nextReviewAt),
    );
    const status: BookmarkStatus = isPendingReview
      ? "pendingReview"
      : isDue
        ? "due"
        : questionProgress?.masteryState === MasteryState.MASTERED
          ? "stable"
          : "saved";
    const learningSignal: BookmarkLearningSignal =
      hasLessonSignal && isDue
        ? "reviewDue"
        : questionProgress?.lastLessonCheckpointPassed
          ? "checkpointReady"
          : (questionProgress?.lessonViews ?? 0) > 0
            ? "lessonViewed"
            : null;

    return {
      bookmarkId: bookmark.id,
      questionId: bookmark.questionId,
      questionSlug: bookmark.question.slug,
      prompt: localizedQuestion.prompt,
      skill: localizedSkill.title,
      module: localizedModule.title,
      moduleSlug: bookmark.question.module.slug,
      format: bookmark.question.format,
      createdAt: bookmark.createdAt,
      noteBody: note?.body ?? null,
      noteUpdatedAt: note?.updatedAt ?? null,
      status,
      isPendingReview,
      isDue,
      learningSignal,
    };
  });

  return {
    count: items.length,
    pendingCount: items.filter((item) => item.isPendingReview).length,
    dueCount: items.filter((item) => item.isDue).length,
    items,
  };
}
