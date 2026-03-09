import { MasteryState } from "@prisma/client";
import type { Locale } from "@/i18n/config";
import {
  localizeModule,
  localizeQuestion,
  localizeSkill,
} from "@/lib/content-repository";
import { prisma } from "@/lib/prisma";

export type NoteStatus = "pendingReview" | "due" | "stable" | "saved";
export type NoteLearningSignal =
  | "reviewDue"
  | "checkpointReady"
  | "lessonViewed"
  | null;

export async function getNoteReadModel(params: {
  userId: string;
  locale: Locale;
}) {
  const now = new Date();
  const notes = await prisma.note.findMany({
    where: {
      userId: params.userId,
    },
    orderBy: {
      updatedAt: "desc",
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
          bookmarks: {
            where: {
              userId: params.userId,
            },
            select: {
              id: true,
            },
            take: 1,
          },
        },
      },
    },
    take: 30,
  });

  const items = notes.map((note) => {
    const localizedQuestion = localizeQuestion(note.question, params.locale);
    const localizedSkill = localizeSkill(note.question.primarySkill, params.locale);
    const localizedModule = localizeModule(note.question.module, params.locale);
    const questionProgress = note.question.progress[0] ?? null;
    const latestAttempt = note.question.attempts[0] ?? null;
    const isPendingReview = latestAttempt?.isCorrect === null;
    const isDue =
      questionProgress?.nextReviewAt ? questionProgress.nextReviewAt <= now : false;
    const hasLessonSignal = Boolean(
      (questionProgress?.lessonViews ?? 0) > 0 ||
      (questionProgress?.lessonCheckpointAttempts ?? 0) > 0 ||
      (!latestAttempt && questionProgress?.nextReviewAt),
    );
    const status: NoteStatus = isPendingReview
      ? "pendingReview"
      : isDue
        ? "due"
        : questionProgress?.masteryState === MasteryState.MASTERED
          ? "stable"
          : "saved";
    const learningSignal: NoteLearningSignal =
      hasLessonSignal && isDue
        ? "reviewDue"
        : questionProgress?.lastLessonCheckpointPassed
          ? "checkpointReady"
          : (questionProgress?.lessonViews ?? 0) > 0
            ? "lessonViewed"
            : null;

    return {
      noteId: note.id,
      questionId: note.questionId,
      questionSlug: note.question.slug,
      prompt: localizedQuestion.prompt,
      skill: localizedSkill.title,
      module: localizedModule.title,
      moduleSlug: note.question.module.slug,
      body: note.body,
      updatedAt: note.updatedAt,
      status,
      isPendingReview,
      isDue,
      isBookmarked: note.question.bookmarks.length > 0,
      learningSignal,
    };
  });

  return {
    count: items.length,
    pendingCount: items.filter((item) => item.isPendingReview).length,
    dueCount: items.filter((item) => item.isDue).length,
    bookmarkedCount: items.filter((item) => item.isBookmarked).length,
    items,
  };
}
