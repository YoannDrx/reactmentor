import { QuestionFormat } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  questionProgressFindManyMock,
  localizeQuestionSummaryMock,
  localizeSkillMock,
  localizeModuleMock,
} = vi.hoisted(() => ({
  questionProgressFindManyMock: vi.fn(),
  localizeQuestionSummaryMock: vi.fn((question) => ({
    prompt: question.prompt,
  })),
  localizeSkillMock: vi.fn((skill) => ({
    title: skill.title,
  })),
  localizeModuleMock: vi.fn((module) => ({
    title: module.title,
  })),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    questionProgress: {
      findMany: questionProgressFindManyMock,
    },
  },
}));

vi.mock("@/lib/content-repository", () => ({
  localizeQuestionSummary: localizeQuestionSummaryMock,
  localizeSkill: localizeSkillMock,
  localizeModule: localizeModuleMock,
}));

import { getLessonWorkspaceReadModel } from "@/features/learn/lesson-workspace-read-model";

function createProgressFixture(params: {
  questionId: string;
  slug: string;
  prompt: string;
  skill: string;
  module: string;
  moduleSlug: string;
  format?: QuestionFormat;
  lessonViews?: number;
  lessonCheckpointAttempts?: number;
  lessonCheckpointPassCount?: number;
  lastLessonCheckpointPassed?: boolean | null;
  nextReviewAt?: Date | null;
  lastLessonViewedAt?: Date | null;
  lastLessonCheckpointAt?: Date | null;
  lastAttemptAt?: Date | null;
}) {
  return {
    questionId: params.questionId,
    lessonViews: params.lessonViews ?? 0,
    lessonCheckpointAttempts: params.lessonCheckpointAttempts ?? 0,
    lessonCheckpointPassCount: params.lessonCheckpointPassCount ?? 0,
    lastLessonCheckpointPassed: params.lastLessonCheckpointPassed ?? null,
    nextReviewAt: params.nextReviewAt ?? null,
    lastLessonViewedAt: params.lastLessonViewedAt ?? null,
    lastLessonCheckpointAt: params.lastLessonCheckpointAt ?? null,
    lastAttemptAt: params.lastAttemptAt ?? null,
    question: {
      id: params.questionId,
      slug: params.slug,
      prompt: params.prompt,
      format: params.format ?? QuestionFormat.OPEN_ENDED,
      translations: [],
      primarySkill: {
        title: params.skill,
        translations: [],
      },
      module: {
        title: params.module,
        slug: params.moduleSlug,
        translations: [],
      },
    },
  };
}

describe("getLessonWorkspaceReadModel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-09T09:00:00.000Z"));
    questionProgressFindManyMock.mockReset();
    localizeQuestionSummaryMock.mockClear();
    localizeSkillMock.mockClear();
    localizeModuleMock.mockClear();
  });

  it("maps lesson-tracked questions into workspace priorities", async () => {
    questionProgressFindManyMock.mockResolvedValue([
      createProgressFixture({
        questionId: "question_due",
        slug: "effect-cleanup",
        prompt: "Why must cleanup come from the effect itself?",
        skill: "Effects",
        module: "React Rendering",
        moduleSlug: "react-rendering",
        lessonViews: 2,
        lessonCheckpointAttempts: 1,
        lastLessonCheckpointPassed: false,
        nextReviewAt: new Date("2026-03-08T09:00:00.000Z"),
      }),
      createProgressFixture({
        questionId: "question_unverified",
        slug: "stale-closures",
        prompt: "How does a stale closure appear in a hook?",
        skill: "Effects",
        module: "React Rendering",
        moduleSlug: "react-rendering",
        lessonViews: 1,
      }),
      createProgressFixture({
        questionId: "question_ready",
        slug: "identity-checkpoint",
        prompt: "Why do unstable references break memoization?",
        skill: "Identity",
        module: "React Rendering",
        moduleSlug: "react-rendering",
        lessonViews: 1,
        lessonCheckpointAttempts: 1,
        lessonCheckpointPassCount: 1,
        lastLessonCheckpointPassed: true,
      }),
    ]);

    const readModel = await getLessonWorkspaceReadModel("user_1", "en");

    expect(readModel).toMatchObject({
      count: 3,
      trackedCount: 3,
      viewedCount: 3,
      checkpointReadyCount: 1,
      reviewDueCount: 1,
      unverifiedCount: 1,
    });
    expect(readModel.items.map((item) => item.status)).toEqual([
      "reviewDue",
      "unverified",
      "checkpointReady",
    ]);
    expect(readModel.items[0]).toMatchObject({
      questionId: "question_due",
      moduleSlug: "react-rendering",
      skill: "Effects",
      status: "reviewDue",
      hasAttemptSignal: false,
    });
  });
});
