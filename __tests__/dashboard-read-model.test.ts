import {
  ContentLocale,
  ContentStatus,
  MasteryState,
  SessionMode,
} from "@prisma/client";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const {
  transactionMock,
  questionCountMock,
  attemptCountMock,
  attemptFindManyMock,
  questionProgressCountMock,
  questionProgressFindManyMock,
  trainingSessionCountMock,
  trainingSessionFindManyMock,
  skillProgressAggregateMock,
  skillProgressFindManyMock,
  skillFindManyMock,
} = vi.hoisted(() => ({
  transactionMock: vi.fn(),
  questionCountMock: vi.fn(() => Promise.resolve(null)),
  attemptCountMock: vi.fn(() => Promise.resolve(null)),
  attemptFindManyMock: vi.fn(() => Promise.resolve([])),
  questionProgressCountMock: vi.fn(() => Promise.resolve(null)),
  questionProgressFindManyMock: vi.fn(() => Promise.resolve([])),
  trainingSessionCountMock: vi.fn(() => Promise.resolve(null)),
  trainingSessionFindManyMock: vi.fn(() => Promise.resolve([])),
  skillProgressAggregateMock: vi.fn(() => Promise.resolve(null)),
  skillProgressFindManyMock: vi.fn(() => Promise.resolve([])),
  skillFindManyMock: vi.fn(() => Promise.resolve([])),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: transactionMock,
    question: {
      count: questionCountMock,
    },
    attempt: {
      count: attemptCountMock,
      findMany: attemptFindManyMock,
    },
    questionProgress: {
      count: questionProgressCountMock,
      findMany: questionProgressFindManyMock,
    },
    trainingSession: {
      count: trainingSessionCountMock,
      findMany: trainingSessionFindManyMock,
    },
    skillProgress: {
      aggregate: skillProgressAggregateMock,
      findMany: skillProgressFindManyMock,
    },
    skill: {
      findMany: skillFindManyMock,
    },
  },
}));

import {
  getDashboardReadModel,
  getMockInterviewHistory,
  getMockInterviewReadModel,
} from "@/features/dashboard/dashboard-read-model";

function createModuleFixture(params: {
  id: string;
  slug: string;
  titleEn: string;
  titleFr: string;
}) {
  return {
    id: params.id,
    slug: params.slug,
    title: params.titleEn,
    description: `${params.titleEn} description`,
    summary: `${params.titleEn} summary`,
    order: 1,
    track: "REACT",
    level: "MID",
    status: ContentStatus.PUBLISHED,
    createdAt: new Date(),
    updatedAt: new Date(),
    translations: [
      {
        id: `${params.id}_en`,
        moduleId: params.id,
        locale: ContentLocale.EN,
        status: "READY",
        title: params.titleEn,
        description: `${params.titleEn} description`,
        summary: `${params.titleEn} summary`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: `${params.id}_fr`,
        moduleId: params.id,
        locale: ContentLocale.FR,
        status: "READY",
        title: params.titleFr,
        description: `${params.titleFr} description`,
        summary: `${params.titleFr} resume`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  };
}

function createSkillFixture(params: {
  id: string;
  slug: string;
  titleEn: string;
  titleFr: string;
}) {
  return {
    id: params.id,
    slug: params.slug,
    title: params.titleEn,
    description: `${params.titleEn} description`,
    moduleId: "module_1",
    status: ContentStatus.PUBLISHED,
    createdAt: new Date(),
    updatedAt: new Date(),
    progress: [] as Array<{
      userId: string;
      skillId: string;
      masteryScore: number;
      confidenceScore: number;
    }>,
    translations: [
      {
        id: `${params.id}_en`,
        skillId: params.id,
        locale: ContentLocale.EN,
        status: "READY",
        title: params.titleEn,
        description: `${params.titleEn} description`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: `${params.id}_fr`,
        skillId: params.id,
        locale: ContentLocale.FR,
        status: "READY",
        title: params.titleFr,
        description: `${params.titleFr} description`,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
  };
}

function createQuestionFixture(params: {
  id: string;
  slug: string;
  promptEn: string;
  promptFr: string;
  primarySkill: ReturnType<typeof createSkillFixture>;
}) {
  return {
    id: params.id,
    slug: params.slug,
    moduleId: "module_1",
    primarySkillId: params.primarySkill.id,
    difficulty: 3,
    level: "MID",
    format: "SINGLE_CHOICE",
    prompt: params.promptEn,
    explanation: "Legacy explanation",
    takeaways: ["legacy takeaway"],
    status: ContentStatus.PUBLISHED,
    createdAt: new Date(),
    updatedAt: new Date(),
    translations: [
      {
        id: `${params.id}_en`,
        questionId: params.id,
        locale: ContentLocale.EN,
        status: "READY",
        prompt: params.promptEn,
        explanation: "English explanation",
        takeaways: ["english takeaway"],
        interviewSignal: "Explain the rendering mechanism",
        verbalizePoints: ["verbalize the root cause"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: `${params.id}_fr`,
        questionId: params.id,
        locale: ContentLocale.FR,
        status: "READY",
        prompt: params.promptFr,
        explanation: "Explication francaise",
        takeaways: ["point francais"],
        interviewSignal: "Explique le mecanisme de rendu",
        verbalizePoints: ["verbaliser la cause"],
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ],
    primarySkill: params.primarySkill,
    bookmarks: [] as Array<{
      id: string;
    }>,
    notes: [] as Array<{
      body: string;
      updatedAt: Date;
    }>,
    attempts: [] as Array<{
      mode: SessionMode;
      isCorrect: boolean | null;
      createdAt: Date;
    }>,
    options: [
      {
        id: `${params.id}_option_1`,
        questionId: params.id,
        label: "Legacy option",
        explanation: "Legacy option explanation",
        isCorrect: true,
        order: 1,
        createdAt: new Date(),
        translations: [
          {
            id: `${params.id}_option_1_en`,
            optionId: `${params.id}_option_1`,
            locale: ContentLocale.EN,
            status: "READY",
            label: "English option",
            explanation: "English option explanation",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: `${params.id}_option_1_fr`,
            optionId: `${params.id}_option_1`,
            locale: ContentLocale.FR,
            status: "READY",
            label: "Option francaise",
            explanation: "Explication option francaise",
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
      },
    ],
  };
}

describe("getDashboardReadModel", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-07T12:00:00.000Z"));
    transactionMock.mockReset();
    questionCountMock.mockClear();
    attemptCountMock.mockClear();
    attemptFindManyMock.mockReset();
    attemptFindManyMock.mockResolvedValue([]);
    questionProgressCountMock.mockClear();
    questionProgressFindManyMock.mockClear();
    trainingSessionCountMock.mockClear();
    trainingSessionFindManyMock.mockReset();
    trainingSessionFindManyMock.mockResolvedValue([]);
    skillProgressAggregateMock.mockClear();
    skillProgressFindManyMock.mockClear();
    skillFindManyMock.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("returns empty-state friendly data when the learner has no attempts yet", async () => {
    const fallbackSkill = createSkillFixture({
      id: "skill_rendering",
      slug: "rendering-and-identity",
      titleEn: "Rendering and Identity",
      titleFr: "Rendu et identite",
    });

    transactionMock.mockResolvedValue([
      12,
      0,
      0,
      0,
      0,
      { _avg: { masteryScore: null } },
      [],
      [],
      [],
      [fallbackSkill],
      [],
      [],
      [],
    ]);

    const readModel = await getDashboardReadModel("user_1", "fr");

    expect(readModel.hasAttempts).toBe(false);
    expect(readModel.overview.stats).toMatchObject({
      readiness: 0,
      masteredQuestions: 0,
      dueToday: 0,
      completedMocks: 0,
      totalQuestions: 12,
    });
    expect(readModel.overview.skillReadiness).toEqual([
      {
        id: "skill_rendering",
        skill: "Rendu et identite",
        score: 0,
      },
    ]);
    expect(readModel.progress.masteryDistribution).toEqual({
      new: 0,
      learning: 0,
      reviewing: 0,
      mastered: 0,
    });
    expect(readModel.overview.dueItems).toEqual([]);
    expect(readModel.review.items).toEqual([]);
    expect(readModel.review.pendingItems).toEqual([]);
    expect(readModel.overview.recentSessions).toEqual([]);
    expect(readModel.progress.weeklyMomentum).toHaveLength(7);
    expect(readModel.progress.weeklyMomentum.every((item) => item.score === 0)).toBe(
      true,
    );
  });

  it("returns real mock interview history with duration and answer counts", async () => {
    trainingSessionFindManyMock.mockResolvedValue([
      {
        id: "session_mock_1",
        mode: SessionMode.MOCK_INTERVIEW,
        score: 78,
        startedAt: new Date("2026-03-07T10:00:00.000Z"),
        endedAt: new Date("2026-03-07T10:14:00.000Z"),
        config: {
          source: "mock_template",
          locale: "en",
          questionCount: 10,
          templateKey: "react_mid_30",
        },
        _count: {
          attempts: 10,
        },
      },
    ] as never);

    const history = await getMockInterviewHistory("user_1");

    expect(trainingSessionFindManyMock).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          userId: "user_1",
          mode: SessionMode.MOCK_INTERVIEW,
        }),
      }),
    );
    expect(history).toEqual([
      {
        id: "session_mock_1",
        mode: SessionMode.MOCK_INTERVIEW,
        score: 78,
        durationMinutes: 14,
        answersCount: 10,
        endedAt: new Date("2026-03-07T10:14:00.000Z"),
        config: {
          source: "mock_template",
          locale: "en",
          questionCount: 10,
          templateKey: "react_mid_30",
        },
        templateKey: "react_mid_30",
        durationBudgetMinutes: null,
      },
    ]);
  });

  it("builds mock interview summary and template-level signals", async () => {
    trainingSessionFindManyMock.mockResolvedValue([
      {
        id: "session_mock_3",
        mode: SessionMode.MOCK_INTERVIEW,
        score: 84,
        startedAt: new Date("2026-03-07T10:00:00.000Z"),
        endedAt: new Date("2026-03-07T10:24:00.000Z"),
        config: {
          source: "mock_template",
          locale: "en",
          questionCount: 10,
          templateKey: "react_mid_30",
          durationMinutes: 30,
        },
        _count: {
          attempts: 10,
        },
      },
      {
        id: "session_mock_2",
        mode: SessionMode.MOCK_INTERVIEW,
        score: 76,
        startedAt: new Date("2026-03-06T10:00:00.000Z"),
        endedAt: new Date("2026-03-06T10:28:00.000Z"),
        config: {
          source: "mock_template",
          locale: "en",
          questionCount: 10,
          templateKey: "react_mid_30",
          durationMinutes: 30,
        },
        _count: {
          attempts: 10,
        },
      },
      {
        id: "session_mock_1",
        mode: SessionMode.MOCK_INTERVIEW,
        score: 68,
        startedAt: new Date("2026-03-05T10:00:00.000Z"),
        endedAt: new Date("2026-03-05T10:38:00.000Z"),
        config: {
          source: "mock_template",
          locale: "en",
          questionCount: 6,
          templateKey: "frontend_senior_defense",
          durationMinutes: 45,
        },
        _count: {
          attempts: 6,
        },
      },
    ] as never);
    attemptFindManyMock.mockResolvedValue([
      {
        reviewData: {
          kind: "rubric_review",
          criteria: [
            {
              criterion: "accuracy",
              verdict: "missing",
            },
            {
              criterion: "mechanism",
              verdict: "partial",
            },
            {
              criterion: "tradeoffs",
              verdict: "solid",
            },
          ],
          summary: "Still hand-wavy under pressure.",
          scorePercent: 50,
        },
      },
      {
        reviewData: {
          kind: "rubric_review",
          criteria: [
            {
              criterion: "accuracy",
              verdict: "partial",
            },
            {
              criterion: "mechanism",
              verdict: "missing",
            },
            {
              criterion: "tradeoffs",
              verdict: "partial",
            },
          ],
          summary: "Tradeoffs need sharper language.",
          scorePercent: 33,
        },
      },
    ] as never);

    const readModel = await getMockInterviewReadModel("user_1");

    expect(readModel.summary).toEqual({
      completedCount: 3,
      averageScore: 76,
      bestScore: 84,
      latestScore: 84,
      latestDelta: 12,
      latestTrend: "up",
      strongestTemplate: {
        templateKey: "react_mid_30",
        sessionsCount: 2,
        averageScore: 80,
        latestScore: 84,
        averageDurationMinutes: 26,
        durationBudgetMinutes: 30,
      },
      weakestTemplate: {
        templateKey: "frontend_senior_defense",
        sessionsCount: 1,
        averageScore: 68,
        latestScore: 68,
        averageDurationMinutes: 38,
        durationBudgetMinutes: 45,
      },
    });

    expect(readModel.templateBreakdown).toEqual([
      {
        templateKey: "react_mid_30",
        sessionsCount: 2,
        averageScore: 80,
        latestScore: 84,
        averageDurationMinutes: 26,
        durationBudgetMinutes: 30,
      },
      {
        templateKey: "frontend_senior_defense",
        sessionsCount: 1,
        averageScore: 68,
        latestScore: 68,
        averageDurationMinutes: 38,
        durationBudgetMinutes: 45,
      },
    ]);
    expect(readModel.criterionBreakdown).toEqual([
      {
        criterion: "accuracy",
        averageScore: 25,
        reviewCount: 2,
        missingCount: 1,
        partialCount: 1,
      },
      {
        criterion: "mechanism",
        averageScore: 25,
        reviewCount: 2,
        missingCount: 1,
        partialCount: 1,
      },
      {
        criterion: "tradeoffs",
        averageScore: 75,
        reviewCount: 2,
        missingCount: 0,
        partialCount: 1,
      },
    ]);
  });

  it("computes review urgency, mastery distribution and localized recent activity", async () => {
    const renderingModule = createModuleFixture({
      id: "module_rendering",
      slug: "react-rendering-systems",
      titleEn: "React Rendering Systems",
      titleFr: "Systemes de rendu React",
    });
    const skillEffects = createSkillFixture({
      id: "skill_effects",
      slug: "effect-mental-model",
      titleEn: "Effect Mental Model",
      titleFr: "Modele mental des effects",
    });
    const skillRendering = createSkillFixture({
      id: "skill_rendering",
      slug: "rendering-and-identity",
      titleEn: "Rendering and Identity",
      titleFr: "Rendu et identite",
    });

    const overdueQuestion = createQuestionFixture({
      id: "question_overdue",
      slug: "effect-array-reference",
      promptEn:
        "Why does a recreated array in the deps list retrigger the effect?",
      promptFr:
        "Pourquoi un tableau recree dans les deps relance-t-il l effect ?",
      primarySkill: skillEffects,
    });
    const unstableQuestion = createQuestionFixture({
      id: "question_unstable",
      slug: "keys-do-not-force-rerender",
      promptEn: "Do changing keys always force a rerender?",
      promptFr: "Changer une key force-t-il toujours un rerender ?",
      primarySkill: skillRendering,
    });
    const mockFalloutQuestion = createQuestionFixture({
      id: "question_mock_fallout",
      slug: "effect-cleanup-mock-fallout",
      promptEn: "Why can an async cleanup wrapper hide a lifecycle bug?",
      promptFr: "Pourquoi un wrapper de cleanup async peut-il masquer un bug de cycle de vie ?",
      primarySkill: skillRendering,
    });
    skillEffects.progress = [
      {
        userId: "user_1",
        skillId: skillEffects.id,
        masteryScore: 82,
        confidenceScore: 84,
      },
    ];
    skillRendering.progress = [
      {
        userId: "user_1",
        skillId: skillRendering.id,
        masteryScore: 61,
        confidenceScore: 48,
      },
    ];
    overdueQuestion.attempts = [
      {
        mode: SessionMode.REVIEW,
        isCorrect: true,
        createdAt: new Date("2026-03-05T10:00:00.000Z"),
      },
    ];
    unstableQuestion.attempts = [
      {
        mode: SessionMode.PRACTICE,
        isCorrect: false,
        createdAt: new Date("2026-03-07T09:00:00.000Z"),
      },
    ];
    mockFalloutQuestion.attempts = [
      {
        mode: SessionMode.MOCK_INTERVIEW,
        isCorrect: false,
        createdAt: new Date("2026-03-07T08:30:00.000Z"),
      },
    ];
    overdueQuestion.bookmarks = [{ id: "bookmark_overdue" }];
    const pendingBugHuntQuestion = {
      ...createQuestionFixture({
        id: "question_pending_bug_hunt",
        slug: "effect-cleanup-bug-hunt",
        promptEn: "Find the suspicious lines in this effect cleanup snippet.",
        promptFr: "Trouve les lignes suspectes dans ce snippet de cleanup.",
        primarySkill: skillEffects,
      }),
      format: "BUG_HUNT",
      module: renderingModule,
      bookmarks: [{ id: "bookmark_pending" }],
      notes: [
        {
          body: "Mention the cleanup boundary explicitly.",
          updatedAt: new Date("2026-03-07T10:30:00.000Z"),
        },
      ],
      translations: [
        {
          id: "question_pending_bug_hunt_en",
          questionId: "question_pending_bug_hunt",
          locale: ContentLocale.EN,
          status: "READY",
          prompt: "Find the suspicious lines in this effect cleanup snippet.",
          explanation:
            "The cleanup is returned from the inner async function, so React never uses it as the effect cleanup.",
          takeaways: ["Cleanup must come from the effect itself."],
          contextData: {
            kind: "bug_hunt",
            language: "tsx",
            snippetTitle: "SearchBox debounce effect",
            code: `function SearchBox({ query }: { query: string }) {
  useEffect(() => {
    async function syncAnalytics() {
      const timer = window.setTimeout(() => {
        console.log("sync", query);
      }, 300);

      return () => {
        window.clearTimeout(timer);
      };
    }

    void syncAnalytics();
  }, [query]);
}`,
            suggestedLineNumbers: [4, 5],
          },
          interviewSignal: "Explain the cleanup boundary",
          verbalizePoints: ["Cleanup must be returned by useEffect."],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "question_pending_bug_hunt_fr",
          questionId: "question_pending_bug_hunt",
          locale: ContentLocale.FR,
          status: "READY",
          prompt: "Trouve les lignes suspectes dans ce snippet de cleanup.",
          explanation:
            "Le cleanup est retourne depuis la fonction async interne, donc React ne l'utilise jamais comme cleanup de l'effet.",
          takeaways: ["Le cleanup doit etre retourne par l'effet lui-meme."],
          contextData: {
            kind: "bug_hunt",
            language: "tsx",
            snippetTitle: "Effet de debounce SearchBox",
            code: `function SearchBox({ query }: { query: string }) {
  useEffect(() => {
    async function syncAnalytics() {
      const timer = window.setTimeout(() => {
        console.log("sync", query);
      }, 300);

      return () => {
        window.clearTimeout(timer);
      };
    }

    void syncAnalytics();
  }, [query]);
}`,
            suggestedLineNumbers: [4, 5],
          },
          interviewSignal: "Expliquer la frontiere du cleanup",
          verbalizePoints: ["Le cleanup doit venir de useEffect."],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    };

    transactionMock.mockResolvedValue([
      24,
      8,
      3,
      3,
      1,
      { _avg: { masteryScore: 78.4 } },
      [
        { masteryState: MasteryState.NEW },
        { masteryState: MasteryState.LEARNING },
        { masteryState: MasteryState.REVIEWING },
        { masteryState: MasteryState.MASTERED },
        { masteryState: MasteryState.MASTERED },
      ],
      [
        {
          createdAt: new Date("2026-03-07T08:00:00.000Z"),
          isCorrect: true,
        },
        {
          createdAt: new Date("2026-03-07T09:00:00.000Z"),
          isCorrect: false,
        },
        {
          createdAt: new Date("2026-03-06T10:00:00.000Z"),
          isCorrect: true,
        },
      ],
      [
        {
          skillId: skillEffects.id,
          masteryScore: 82,
          correctRate: 0.875,
          coverageCount: 5,
          uniqueQuestionCount: 4,
          uniqueDifficultyCount: 3,
          recentFailureCount: 0,
          confidenceScore: 84,
          lastAttemptAt: new Date("2026-03-07T09:00:00.000Z"),
          skill: skillEffects,
        },
        {
          skillId: skillRendering.id,
          masteryScore: 61,
          correctRate: 0.625,
          coverageCount: 3,
          uniqueQuestionCount: 2,
          uniqueDifficultyCount: 2,
          recentFailureCount: 1,
          confidenceScore: 48,
          lastAttemptAt: new Date("2026-03-06T10:00:00.000Z"),
          skill: skillRendering,
        },
      ],
      [],
      [
        {
          questionId: overdueQuestion.id,
          masteryState: MasteryState.MASTERED,
          lastOutcomeCorrect: true,
          nextReviewAt: new Date("2026-03-03T10:00:00.000Z"),
          question: overdueQuestion,
        },
        {
          questionId: unstableQuestion.id,
          masteryState: MasteryState.LEARNING,
          lastOutcomeCorrect: false,
          nextReviewAt: new Date("2026-03-07T06:00:00.000Z"),
          question: unstableQuestion,
        },
        {
          questionId: mockFalloutQuestion.id,
          masteryState: MasteryState.REVIEWING,
          lastOutcomeCorrect: false,
          nextReviewAt: new Date("2026-03-07T08:00:00.000Z"),
          question: mockFalloutQuestion,
        },
      ],
      [
        {
          id: "attempt_pending_1",
          userId: "user_1",
          questionId: pendingBugHuntQuestion.id,
          sessionId: "session_pending_1",
          responseData: {
            kind: "bug_hunt_response",
            summary:
              "The cleanup is returned by the inner async function instead of the effect.",
            selectedLineNumbers: [5, 4],
          },
          createdAt: new Date("2026-03-07T11:00:00.000Z"),
          question: pendingBugHuntQuestion,
        },
      ],
      [
        {
          id: "session_1",
          mode: SessionMode.MOCK_INTERVIEW,
          score: 74,
          startedAt: new Date("2026-03-06T09:00:00.000Z"),
          endedAt: new Date("2026-03-06T09:28:00.000Z"),
          _count: {
            attempts: 10,
          },
        },
      ],
    ]);

    const readModel = await getDashboardReadModel("user_1", "fr");

    expect(readModel.hasAttempts).toBe(true);
    expect(readModel.overview.stats.readiness).toBe(78);
    expect(readModel.progress.masteryDistribution).toEqual({
      new: 1,
      learning: 1,
      reviewing: 1,
      mastered: 2,
    });
    expect(readModel.overview.skillReadiness).toEqual([
      {
        id: "skill_effects",
        skill: "Modele mental des effects",
        score: 82,
      },
      {
        id: "skill_rendering",
        skill: "Rendu et identite",
        score: 61,
      },
    ]);
    expect(readModel.progress.skillBreakdown).toEqual([
      expect.objectContaining({
        id: "skill_effects",
        skill: "Modele mental des effects",
        score: 82,
        coverageCount: 5,
        uniqueQuestionCount: 4,
        uniqueDifficultyCount: 3,
        recentFailureCount: 0,
        confidenceScore: 84,
        lastAttemptAt: new Date("2026-03-07T09:00:00.000Z"),
      }),
      expect.objectContaining({
        id: "skill_rendering",
        skill: "Rendu et identite",
        score: 61,
        coverageCount: 3,
        uniqueQuestionCount: 2,
        uniqueDifficultyCount: 2,
        recentFailureCount: 1,
        confidenceScore: 48,
        lastAttemptAt: new Date("2026-03-06T10:00:00.000Z"),
      }),
    ]);
    expect(readModel.review.urgentCount).toBe(3);
    expect(readModel.review.items).toEqual([
      expect.objectContaining({
        questionId: "question_overdue",
        questionSlug: "effect-array-reference",
        title: "Pourquoi un tableau recree dans les deps relance-t-il l effect ?",
        skill: "Modele mental des effects",
        urgency: "critical",
        reason: "overdue",
        isBookmarked: true,
      }),
      expect.objectContaining({
        questionId: "question_unstable",
        questionSlug: "keys-do-not-force-rerender",
        title: "Changer une key force-t-il toujours un rerender ?",
        skill: "Rendu et identite",
        urgency: "high",
        reason: "failedRecently",
        isBookmarked: false,
      }),
      expect.objectContaining({
        questionId: "question_mock_fallout",
        questionSlug: "effect-cleanup-mock-fallout",
        title:
          "Pourquoi un wrapper de cleanup async peut-il masquer un bug de cycle de vie ?",
        skill: "Rendu et identite",
        urgency: "high",
        reason: "mockFallout",
        isBookmarked: false,
      }),
    ]);
    expect(readModel.review.pendingCount).toBe(1);
    expect(readModel.review.pendingItems).toEqual([
      expect.objectContaining({
        attemptId: "attempt_pending_1",
        sessionId: "session_pending_1",
        questionId: "question_pending_bug_hunt",
        prompt: "Trouve les lignes suspectes dans ce snippet de cleanup.",
        skill: "Modele mental des effects",
        module: "Systemes de rendu React",
        format: "BUG_HUNT",
        responsePreview: {
          kind: "bug_hunt_response",
          content:
            "The cleanup is returned by the inner async function instead of the effect.",
          language: null,
          selectedLineNumbers: [4, 5],
        },
        verbalizePoints: ["Le cleanup doit venir de useEffect."],
        rubricCriteria: ["rootCause", "evidence", "repair"],
        rubricFocusPoints: [
          "Le cleanup doit venir de useEffect.",
          "Le cleanup doit etre retourne par l'effet lui-meme.",
        ],
        isBookmarked: true,
        noteBody: "Mention the cleanup boundary explicitly.",
        noteUpdatedAt: new Date("2026-03-07T10:30:00.000Z"),
      }),
    ]);
    expect(readModel.overview.recentSessions).toEqual([
      expect.objectContaining({
        id: "session_1",
        mode: SessionMode.MOCK_INTERVIEW,
        score: 74,
        durationMinutes: 28,
        answersCount: 10,
      }),
    ]);
    expect(readModel.progress.weeklyMomentum[5]).toMatchObject({
      dayKey: "fri",
      score: 100,
    });
    expect(readModel.progress.weeklyMomentum[6]).toMatchObject({
      dayKey: "sat",
      score: 50,
    });
  });
});
