import { ContentStatus, TranslationStatus } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  learningModuleFindManyMock,
  skillFindManyMock,
  pitfallTagFindManyMock,
  questionFindManyMock,
  prismaMock,
} = vi.hoisted(() => ({
  learningModuleFindManyMock: vi.fn(),
  skillFindManyMock: vi.fn(),
  pitfallTagFindManyMock: vi.fn(),
  questionFindManyMock: vi.fn(),
  prismaMock: {
    learningModule: {
      findMany: vi.fn(),
    },
    skill: {
      findMany: vi.fn(),
    },
    pitfallTag: {
      findMany: vi.fn(),
    },
    question: {
      findMany: vi.fn(),
    },
  },
}));

prismaMock.learningModule.findMany = learningModuleFindManyMock;
prismaMock.skill.findMany = skillFindManyMock;
prismaMock.pitfallTag.findMany = pitfallTagFindManyMock;
prismaMock.question.findMany = questionFindManyMock;

vi.mock("@/lib/prisma", () => ({
  prisma: prismaMock,
}));

import { getAdminContentReadModel } from "@/features/admin/admin-content-read-model";

describe("getAdminContentReadModel", () => {
  beforeEach(() => {
    learningModuleFindManyMock.mockReset();
    skillFindManyMock.mockReset();
    pitfallTagFindManyMock.mockReset();
    questionFindManyMock.mockReset();
  });

  it("builds admin inventory stats, form options and publication checklist signals", async () => {
    learningModuleFindManyMock.mockResolvedValue([
      {
        id: "module_1",
        slug: "react-rendering-systems",
        title: "React Rendering Systems",
        track: "REACT",
        level: "MID",
        status: ContentStatus.PUBLISHED,
        order: 1,
        translations: [
          {
            locale: "FR",
            status: TranslationStatus.READY,
            title: "Systemes de rendu React",
          },
          {
            locale: "EN",
            status: TranslationStatus.READY,
            title: "React Rendering Systems",
          },
        ],
        _count: {
          skills: 2,
          questions: 6,
        },
        updatedAt: new Date("2026-03-07T10:00:00.000Z"),
      },
    ]);
    skillFindManyMock.mockResolvedValue([
      {
        id: "skill_1",
        moduleId: "module_1",
        slug: "effects",
        title: "Effects",
        status: ContentStatus.IN_REVIEW,
        translations: [
          {
            locale: "FR",
            status: TranslationStatus.READY,
            title: "Effects",
          },
          {
            locale: "EN",
            status: TranslationStatus.READY,
            title: "Effects",
          },
        ],
        module: {
          id: "module_1",
          slug: "react-rendering-systems",
          title: "React Rendering Systems",
          translations: [
            {
              locale: "FR",
              title: "Systemes de rendu React",
            },
            {
              locale: "EN",
              title: "React Rendering Systems",
            },
          ],
        },
        _count: {
          questionsPrimary: 4,
        },
        updatedAt: new Date("2026-03-07T11:00:00.000Z"),
      },
    ]);
    pitfallTagFindManyMock.mockResolvedValue([
      {
        id: "pitfall_1",
        slug: "stale-closure",
        title: "Stale closure",
        description: "Stale closure confusion.",
        _count: {
          questionLinks: 1,
        },
        updatedAt: new Date("2026-03-07T09:30:00.000Z"),
      },
    ]);
    questionFindManyMock
      .mockResolvedValueOnce([
        {
          id: "question_1",
          slug: "effect-stale-closure",
          moduleId: "module_1",
          primarySkillId: "skill_1",
          prompt: "Explain the stale closure bug.",
          explanation: "The EN explanation is present.",
          takeaways: ["One EN takeaway"],
          format: "OPEN_ENDED",
          level: "MID",
          difficulty: 3,
          estimatedTimeSec: null,
          sourceType: "seed",
          status: ContentStatus.DRAFT,
          options: [],
          pitfallLinks: [
            {
              pitfallTag: {
                slug: "stale-closure",
                title: "Stale closure",
              },
            },
          ],
          translations: [
            {
              locale: "FR",
              status: TranslationStatus.READY,
              prompt: "Explique le bug de stale closure.",
              explanation: "L'explication FR est presente.",
              takeaways: ["Un takeaway FR"],
            },
            {
              locale: "EN",
              status: TranslationStatus.READY,
              prompt: "Explain the stale closure bug.",
              explanation: "The EN explanation is present.",
              takeaways: ["One EN takeaway"],
            },
          ],
          primarySkill: {
            id: "skill_1",
            slug: "effects",
            title: "Effects",
            translations: [
              {
                locale: "FR",
                title: "Effects",
              },
              {
                locale: "EN",
                title: "Effects",
              },
            ],
          },
          module: {
            id: "module_1",
            slug: "react-rendering-systems",
            title: "React Rendering Systems",
            translations: [
              {
                locale: "FR",
                title: "Systemes de rendu React",
              },
              {
                locale: "EN",
                title: "React Rendering Systems",
              },
            ],
          },
          _count: {
            attempts: 0,
          },
          updatedAt: new Date("2026-03-07T12:00:00.000Z"),
        },
      ])
      .mockResolvedValueOnce([
        {
          id: "question_quality_1",
          slug: "effect-stale-closure",
          status: ContentStatus.PUBLISHED,
          format: "OPEN_ENDED",
          sourceType: "seed",
          updatedAt: new Date("2026-03-01T10:00:00.000Z"),
          translations: [
            {
              locale: "FR",
              prompt: "Explique le bug de stale closure.",
              explanation: "L'explication FR est presente.",
              takeaways: ["Un takeaway FR"],
            },
            {
              locale: "EN",
              prompt: "Explain the stale closure bug.",
              explanation: "The EN explanation is present.",
              takeaways: ["One EN takeaway"],
            },
          ],
          module: {
            slug: "react-rendering-systems",
            title: "React Rendering Systems",
            translations: [
              {
                locale: "FR",
                title: "Systemes de rendu React",
              },
              {
                locale: "EN",
                title: "React Rendering Systems",
              },
            ],
          },
          options: [],
          _count: {
            pitfallLinks: 1,
          },
        },
        {
          id: "question_quality_2",
          slug: "question-incomplete",
          status: ContentStatus.DRAFT,
          format: "OPEN_ENDED",
          sourceType: null,
          updatedAt: new Date("2026-03-02T10:00:00.000Z"),
          translations: [
            {
              locale: "FR",
              prompt: "Question incomplete",
              explanation: "Seulement FR",
              takeaways: ["FR only"],
            },
          ],
          module: {
            slug: "react-rendering-systems",
            title: "React Rendering Systems",
            translations: [
              {
                locale: "FR",
                title: "Systemes de rendu React",
              },
              {
                locale: "EN",
                title: "React Rendering Systems",
              },
            ],
          },
          options: [],
          _count: {
            pitfallLinks: 0,
          },
        },
      ]);

    const readModel = await getAdminContentReadModel("en");

    expect(readModel.stats).toEqual({
      modules: {
        total: 1,
        published: 1,
      },
      skills: {
        total: 1,
        published: 0,
      },
      questions: {
        total: 2,
        published: 1,
        publishable: 1,
        translationGaps: 1,
      },
    });

    expect(readModel.moduleOptions).toEqual([
      {
        id: "module_1",
        title: "React Rendering Systems",
      },
    ]);
    expect(readModel.skillOptions).toEqual([
      {
        id: "skill_1",
        moduleId: "module_1",
        title: "Effects",
        moduleTitle: "React Rendering Systems",
      },
    ]);
    expect(readModel.pitfallTagOptions).toEqual([
      {
        slug: "stale-closure",
        title: "Stale closure",
        description: "Stale closure confusion.",
      },
    ]);
    expect(readModel.quality.translationGapQuestions).toBe(1);
    expect(readModel.quality.untaggedQuestions).toBe(1);
    expect(readModel.quality.thinModules).toEqual([]);
    expect(readModel.quality.stalePublishedQuestions).toEqual([]);
    expect(readModel.quality.duplicatePromptCandidates).toEqual([]);
    expect(readModel.quality.coverageByTrack).toEqual([
      {
        track: "REACT",
        modules: 1,
        questions: 6,
      },
    ]);
    expect(readModel.quality.coverageByFormat).toEqual(
      expect.arrayContaining([
        {
          format: "SINGLE_CHOICE",
          count: 0,
        },
        {
          format: "MULTIPLE_CHOICE",
          count: 0,
        },
        {
          format: "OPEN_ENDED",
          count: 2,
        },
        {
          format: "CODE_OUTPUT",
          count: 0,
        },
        {
          format: "BUG_HUNT",
          count: 0,
        },
      ]),
    );
    expect(readModel.modules[0]).toMatchObject({
      id: "module_1",
      title: "React Rendering Systems",
      track: "REACT",
      level: "MID",
      questionCount: 6,
      skillCount: 2,
    });
    expect(readModel.skills[0]).toMatchObject({
      id: "skill_1",
      title: "Effects",
      moduleTitle: "React Rendering Systems",
      questionCount: 4,
    });
    expect(readModel.questions[0]).toEqual(
      expect.objectContaining({
        id: "question_1",
        slug: "effect-stale-closure",
        prompt: "Explain the stale closure bug.",
        status: ContentStatus.DRAFT,
        format: "OPEN_ENDED",
        level: "MID",
        difficulty: 3,
        sourceType: "seed",
        moduleTitle: "React Rendering Systems",
        skillTitle: "Effects",
        translationStatus: {
          fr: TranslationStatus.READY,
          en: TranslationStatus.READY,
        },
        pitfallTagSlugs: ["stale-closure"],
        pitfallTagTitles: ["Stale closure"],
        checklist: {
          issues: [],
          isPublishable: true,
        },
      }),
    );
  });

  it("flags closed questions when bilingual options or correct-answer setup are incomplete", async () => {
    learningModuleFindManyMock.mockResolvedValue([]);
    skillFindManyMock.mockResolvedValue([]);
    pitfallTagFindManyMock.mockResolvedValue([
      {
        id: "pitfall_2",
        slug: "dependency-identity-blind-spot",
        title: "Dependency identity blind spot",
        description: "Deps identity confusion.",
        _count: {
          questionLinks: 1,
        },
        updatedAt: new Date("2026-03-08T08:30:00.000Z"),
      },
    ]);
    questionFindManyMock
      .mockResolvedValueOnce([
        {
          id: "question_2",
          slug: "deps-array",
          moduleId: "module_1",
          primarySkillId: "skill_1",
          prompt: "Which dependencies are stable here?",
          explanation: "Current explanation",
          takeaways: ["Takeaway"],
          format: "SINGLE_CHOICE",
          level: "MID",
          difficulty: 2,
          estimatedTimeSec: 45,
          sourceType: "seed",
          status: ContentStatus.DRAFT,
          options: [
            {
              order: 1,
              isCorrect: false,
              translations: [
                {
                  locale: "FR",
                  label: "Une option FR",
                  explanation: "Explication FR",
                },
              ],
            },
          ],
          pitfallLinks: [
            {
              pitfallTag: {
                slug: "dependency-identity-blind-spot",
                title: "Dependency identity blind spot",
              },
            },
          ],
          translations: [
            {
              locale: "FR",
              status: TranslationStatus.READY,
              prompt: "Quel tableau de deps reste stable ?",
              explanation: "Explication FR",
              takeaways: ["FR takeaway"],
            },
            {
              locale: "EN",
              status: TranslationStatus.READY,
              prompt: "Which dependency array stays stable?",
              explanation: "EN explanation",
              takeaways: ["EN takeaway"],
            },
          ],
          primarySkill: {
            id: "skill_1",
            slug: "effects",
            title: "Effects",
            translations: [
              {
                locale: "FR",
                title: "Effects",
              },
              {
                locale: "EN",
                title: "Effects",
              },
            ],
          },
          module: {
            id: "module_1",
            slug: "react-rendering-systems",
            title: "React Rendering Systems",
            translations: [
              {
                locale: "FR",
                title: "Systemes de rendu React",
              },
              {
                locale: "EN",
                title: "React Rendering Systems",
              },
            ],
          },
          _count: {
            attempts: 1,
          },
          updatedAt: new Date("2026-03-08T09:00:00.000Z"),
        },
      ])
      .mockResolvedValueOnce([
        {
          id: "question_quality_3",
          slug: "deps-array",
          status: ContentStatus.DRAFT,
          format: "SINGLE_CHOICE",
          sourceType: "seed",
          updatedAt: new Date("2026-03-08T09:00:00.000Z"),
          translations: [
            {
              locale: "FR",
              prompt: "Quel tableau de deps reste stable ?",
              explanation: "Explication FR",
              takeaways: ["FR takeaway"],
            },
            {
              locale: "EN",
              prompt: "Which dependency array stays stable?",
              explanation: "EN explanation",
              takeaways: ["EN takeaway"],
            },
          ],
          module: {
            slug: "react-rendering-systems",
            title: "React Rendering Systems",
            translations: [
              {
                locale: "FR",
                title: "Systemes de rendu React",
              },
              {
                locale: "EN",
                title: "React Rendering Systems",
              },
            ],
          },
          options: [
            {
              isCorrect: false,
              translations: [
                {
                  locale: "FR",
                  label: "Une option FR",
                  explanation: "Explication FR",
                },
              ],
            },
          ],
          _count: {
            pitfallLinks: 1,
          },
        },
      ]);

    const readModel = await getAdminContentReadModel("en");

    expect(readModel.questions[0]).toEqual(
      expect.objectContaining({
        attemptsCount: 1,
        canEditOptions: false,
        optionsCount: 1,
        pitfallTagSlugs: ["dependency-identity-blind-spot"],
        pitfallTagTitles: ["Dependency identity blind spot"],
        checklist: {
          isPublishable: false,
          issues: [
            "missingClosedOptions",
            "missingClosedCorrectOption",
            "missingClosedEnOptions",
          ],
        },
      }),
    );
  });

  it("surfaces stale published questions and duplicate prompt clusters for editorial QA", async () => {
    learningModuleFindManyMock.mockResolvedValue([]);
    skillFindManyMock.mockResolvedValue([]);
    pitfallTagFindManyMock.mockResolvedValue([]);
    questionFindManyMock
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([
        {
          id: "question_stale_1",
          slug: "keys-identity-a",
          status: ContentStatus.PUBLISHED,
          format: "OPEN_ENDED",
          sourceType: "seed",
          updatedAt: new Date("2025-01-10T09:00:00.000Z"),
          translations: [
            {
              locale: "FR",
              prompt: "Explique pourquoi les keys pilotent l'identite.",
              explanation: "Explication FR",
              takeaways: ["FR takeaway"],
            },
            {
              locale: "EN",
              prompt: "Explain why keys control identity.",
              explanation: "EN explanation",
              takeaways: ["EN takeaway"],
            },
          ],
          module: {
            slug: "react-rendering-systems",
            title: "React Rendering Systems",
            translations: [
              {
                locale: "FR",
                title: "Systemes de rendu React",
              },
              {
                locale: "EN",
                title: "React Rendering Systems",
              },
            ],
          },
          options: [],
          _count: {
            pitfallLinks: 0,
          },
        },
        {
          id: "question_stale_2",
          slug: "keys-identity-b",
          status: ContentStatus.PUBLISHED,
          format: "OPEN_ENDED",
          sourceType: "benchmark",
          updatedAt: new Date("2025-02-12T09:00:00.000Z"),
          translations: [
            {
              locale: "FR",
              prompt: "Explique pourquoi les keys pilotent l'identite.",
              explanation: "Explication FR",
              takeaways: ["FR takeaway"],
            },
            {
              locale: "EN",
              prompt: "Explain why keys control identity.",
              explanation: "EN explanation",
              takeaways: ["EN takeaway"],
            },
          ],
          module: {
            slug: "react-stateful-ui-coding",
            title: "React Stateful UI Coding",
            translations: [
              {
                locale: "FR",
                title: "UI stateful React",
              },
              {
                locale: "EN",
                title: "React Stateful UI Coding",
              },
            ],
          },
          options: [],
          _count: {
            pitfallLinks: 0,
          },
        },
        {
          id: "question_recent_1",
          slug: "recent-unique-question",
          status: ContentStatus.PUBLISHED,
          format: "OPEN_ENDED",
          sourceType: null,
          updatedAt: new Date("2026-03-01T09:00:00.000Z"),
          translations: [
            {
              locale: "FR",
              prompt: "Question recente unique",
              explanation: "Explication FR",
              takeaways: ["FR takeaway"],
            },
            {
              locale: "EN",
              prompt: "Recent unique question",
              explanation: "EN explanation",
              takeaways: ["EN takeaway"],
            },
          ],
          module: {
            slug: "react-rendering-systems",
            title: "React Rendering Systems",
            translations: [
              {
                locale: "FR",
                title: "Systemes de rendu React",
              },
              {
                locale: "EN",
                title: "React Rendering Systems",
              },
            ],
          },
          options: [],
          _count: {
            pitfallLinks: 0,
          },
        },
      ]);

    const readModel = await getAdminContentReadModel("en");

    expect(readModel.quality.stalePublishedQuestions).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: "question_stale_1",
          slug: "keys-identity-a",
          prompt: "Explain why keys control identity.",
          moduleTitle: "React Rendering Systems",
          sourceType: "seed",
        }),
        expect.objectContaining({
          id: "question_stale_2",
          slug: "keys-identity-b",
          prompt: "Explain why keys control identity.",
          moduleTitle: "React Stateful UI Coding",
          sourceType: "benchmark",
        }),
      ]),
    );
    expect(readModel.quality.duplicatePromptCandidates).toEqual([
      {
        promptKey: "explain why keys control identity",
        prompt: "Explain why keys control identity.",
        questionCount: 2,
        questions: [
          {
            id: "question_stale_1",
            slug: "keys-identity-a",
            prompt: "Explain why keys control identity.",
            moduleTitle: "React Rendering Systems",
          },
          {
            id: "question_stale_2",
            slug: "keys-identity-b",
            prompt: "Explain why keys control identity.",
            moduleTitle: "React Stateful UI Coding",
          },
        ],
      },
    ]);
  });

  it("applies question filters to the editorial inventory without changing global stats", async () => {
    learningModuleFindManyMock.mockResolvedValue([]);
    skillFindManyMock.mockResolvedValue([]);
    pitfallTagFindManyMock.mockResolvedValue([]);
    questionFindManyMock
      .mockResolvedValueOnce([])
      .mockResolvedValueOnce([]);

    const readModel = await getAdminContentReadModel("en", {
      questionStatus: ContentStatus.IN_REVIEW,
      questionFormat: "BUG_HUNT",
    });

    expect(questionFindManyMock).toHaveBeenNthCalledWith(
      1,
      expect.objectContaining({
        where: {
          status: ContentStatus.IN_REVIEW,
          format: "BUG_HUNT",
        },
      }),
    );
    expect(readModel.activeFilters).toEqual({
      questionStatus: ContentStatus.IN_REVIEW,
      questionFormat: "BUG_HUNT",
    });
  });
});
