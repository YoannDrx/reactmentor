import type { Locale } from "@/i18n/config";
import { getBookmarkReadModel } from "@/features/bookmarks/bookmark-read-model";
import {
  getDashboardReadModel,
  getMockInterviewReadModel,
} from "@/features/dashboard/dashboard-read-model";
import { getNoteReadModel } from "@/features/notes/note-read-model";

export type GeneratedPlaylistType =
  | "lessonFollowUp"
  | "recoveryReview"
  | "mockRecovery"
  | "bookmarks"
  | "notes";

export type GeneratedPlaylist = {
  id: GeneratedPlaylistType;
  type: GeneratedPlaylistType;
  mode: "PRACTICE" | "REVIEW";
  questionIds: string[];
  questionCount: number;
  focusSkills: string[];
  moduleSlug: string | null;
  signalCount: number;
};

function uniqueStrings(values: string[]) {
  return Array.from(
    new Set(
      values.map((value) => value.trim()).filter((value) => value.length > 0),
    ),
  );
}

export async function getPlaylistReadModel(params: {
  userId: string;
  locale: Locale;
}) {
  const [bookmarks, notes, dashboardReadModel, mockReadModel] =
    await Promise.all([
      getBookmarkReadModel({
        userId: params.userId,
        locale: params.locale,
      }),
      getNoteReadModel({
        userId: params.userId,
        locale: params.locale,
      }),
      getDashboardReadModel(params.userId, params.locale),
      getMockInterviewReadModel(params.userId, params.locale),
    ]);

  const recoveryReviewQuestionIds = uniqueStrings(
    dashboardReadModel.progress.recoveryPlans.flatMap(
      (plan) => plan.recoveryQuestionIds,
    ),
  ).slice(0, 8);
  const mockRecoveryQuestionIds = uniqueStrings(
    mockReadModel.recoveryQuestions.map((question) => question.questionId),
  ).slice(0, 8);
  const bookmarkQuestionIds = bookmarks.items
    .map((item) => item.questionId)
    .slice(0, 8);
  const noteQuestionIds = notes.items
    .map((item) => item.questionId)
    .slice(0, 8);
  const lessonFollowUpQuestionIds = uniqueStrings(
    dashboardReadModel.progress.learn.followUpQuestionIds,
  ).slice(0, 8);
  const lessonFollowUpItems = dashboardReadModel.progress.learn.items.filter(
    (item) => lessonFollowUpQuestionIds.includes(item.questionId),
  );

  const playlists = [
    {
      id: "lessonFollowUp",
      type: "lessonFollowUp",
      mode: "PRACTICE",
      questionIds: lessonFollowUpQuestionIds,
      questionCount: lessonFollowUpQuestionIds.length,
      focusSkills: uniqueStrings(
        lessonFollowUpItems.map((item) => item.skill),
      ).slice(0, 3),
      moduleSlug: lessonFollowUpItems[0]?.moduleSlug ?? null,
      signalCount: dashboardReadModel.progress.learn.followUpCount,
    },
    {
      id: "recoveryReview",
      type: "recoveryReview",
      mode: "REVIEW",
      questionIds: recoveryReviewQuestionIds,
      questionCount: recoveryReviewQuestionIds.length,
      focusSkills: uniqueStrings(
        dashboardReadModel.progress.recoveryPlans.map((plan) => plan.skill),
      ).slice(0, 3),
      moduleSlug:
        dashboardReadModel.progress.recoveryPlans.find(
          (plan) => plan.moduleSlug,
        )?.moduleSlug ?? null,
      signalCount: dashboardReadModel.review.dueCount,
    },
    {
      id: "mockRecovery",
      type: "mockRecovery",
      mode: "PRACTICE",
      questionIds: mockRecoveryQuestionIds,
      questionCount: mockRecoveryQuestionIds.length,
      focusSkills: uniqueStrings(
        mockReadModel.recoveryQuestions.map((question) => question.skill),
      ).slice(0, 3),
      moduleSlug: mockReadModel.recoveryQuestions[0]?.moduleSlug ?? null,
      signalCount: mockReadModel.recoveryQuestions.length,
    },
    {
      id: "bookmarks",
      type: "bookmarks",
      mode: "PRACTICE",
      questionIds: bookmarkQuestionIds,
      questionCount: bookmarkQuestionIds.length,
      focusSkills: uniqueStrings(
        bookmarks.items.map((item) => item.skill),
      ).slice(0, 3),
      moduleSlug: bookmarks.items[0]?.moduleSlug ?? null,
      signalCount: bookmarks.count,
    },
    {
      id: "notes",
      type: "notes",
      mode: "PRACTICE",
      questionIds: noteQuestionIds,
      questionCount: noteQuestionIds.length,
      focusSkills: uniqueStrings(notes.items.map((item) => item.skill)).slice(
        0,
        3,
      ),
      moduleSlug: notes.items[0]?.moduleSlug ?? null,
      signalCount: notes.count,
    },
  ] satisfies GeneratedPlaylist[];
  const items = playlists.filter((item) => item.questionIds.length > 0);

  return {
    count: items.length,
    items,
  };
}
