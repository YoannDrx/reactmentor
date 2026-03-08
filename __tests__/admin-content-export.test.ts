import { ContentLocale, ContentStatus, QuestionFormat } from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  transactionMock,
  learningModuleFindManyMock,
  skillFindManyMock,
  pitfallTagFindManyMock,
  questionFindManyMock,
} = vi.hoisted(() => ({
  transactionMock: vi.fn(),
  learningModuleFindManyMock: vi.fn(),
  skillFindManyMock: vi.fn(),
  pitfallTagFindManyMock: vi.fn(),
  questionFindManyMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: transactionMock,
    learningModule: {
      findMany: learningModuleFindManyMock,
    },
    skill: {
      findMany: skillFindManyMock,
    },
    pitfallTag: {
      findMany: pitfallTagFindManyMock,
    },
    question: {
      findMany: questionFindManyMock,
    },
  },
}));

import { getAdminContentExportPayload } from "@/features/admin/admin-content-export";

describe("getAdminContentExportPayload", () => {
  beforeEach(() => {
    transactionMock.mockReset();
    learningModuleFindManyMock.mockReset();
    skillFindManyMock.mockReset();
    pitfallTagFindManyMock.mockReset();
    questionFindManyMock.mockReset();
  });

  it("exports modules, skills and questions with bilingual translations and options", async () => {
    learningModuleFindManyMock.mockReturnValue([
      {
        slug: "react-rendering-systems",
        track: "REACT",
        level: "MID",
        order: 1,
        status: ContentStatus.PUBLISHED,
        translations: [
          {
            locale: ContentLocale.FR,
            status: "READY",
            title: "Systemes de rendu React",
            description: "Description FR",
            summary: "Resume FR",
          },
          {
            locale: ContentLocale.EN,
            status: "READY",
            title: "React Rendering Systems",
            description: "EN description",
            summary: "EN summary",
          },
        ],
      },
    ]);
    skillFindManyMock.mockReturnValue([
      {
        slug: "effects",
        status: ContentStatus.IN_REVIEW,
        module: {
          slug: "react-rendering-systems",
        },
        translations: [
          {
            locale: ContentLocale.FR,
            status: "READY",
            title: "Effects",
            description: "Description FR",
          },
          {
            locale: ContentLocale.EN,
            status: "READY",
            title: "Effects",
            description: "EN description",
          },
        ],
      },
    ]);
    pitfallTagFindManyMock.mockReturnValue([
      {
        slug: "imagined-deep-compare",
        title: "Imagined deep compare",
        description: "Deep compare confusion.",
      },
      {
        slug: "stale-closure",
        title: "Stale closure",
        description: "Stale closure confusion.",
      },
    ]);
    questionFindManyMock.mockReturnValue([
      {
        slug: "effect-stale-closure",
        format: QuestionFormat.SINGLE_CHOICE,
        level: "MID",
        difficulty: 3,
        estimatedTimeSec: 45,
        sourceType: "seed",
        version: 1,
        status: ContentStatus.DRAFT,
        module: {
          slug: "react-rendering-systems",
        },
        primarySkill: {
          slug: "effects",
        },
        pitfallLinks: [
          {
            pitfallTag: {
              slug: "stale-closure",
            },
          },
          {
            pitfallTag: {
              slug: "imagined-deep-compare",
            },
          },
        ],
        translations: [
          {
            locale: ContentLocale.FR,
            status: "READY",
            prompt: "Prompt FR",
            explanation: "Explication FR",
            takeaways: ["Takeaway FR"],
            tlDr: null,
            shortAnswer: null,
            lessonBody: null,
            commonMistakes: [],
            exampleTitle: null,
            exampleCode: null,
            exampleLanguage: null,
            exampleExplanation: null,
            estimatedReadMinutes: null,
            contextData: null,
            interviewSignal: null,
            verbalizePoints: [],
          },
          {
            locale: ContentLocale.EN,
            status: "READY",
            prompt: "Prompt EN",
            explanation: "Explanation EN",
            takeaways: ["Takeaway EN"],
            tlDr: null,
            shortAnswer: null,
            lessonBody: null,
            commonMistakes: [],
            exampleTitle: null,
            exampleCode: null,
            exampleLanguage: null,
            exampleExplanation: null,
            estimatedReadMinutes: null,
            contextData: null,
            interviewSignal: null,
            verbalizePoints: [],
          },
        ],
        options: [
          {
            order: 1,
            isCorrect: true,
            translations: [
              {
                locale: ContentLocale.FR,
                status: "READY",
                label: "Option FR",
                explanation: "Explication option FR",
              },
              {
                locale: ContentLocale.EN,
                status: "READY",
                label: "Option EN",
                explanation: "Option explanation EN",
              },
            ],
          },
        ],
      },
    ]);
    transactionMock.mockImplementation(async (operations) => operations);

    const payload = await getAdminContentExportPayload();

    expect(payload.version).toBe(1);
    expect(payload.modules).toEqual([
      {
        slug: "react-rendering-systems",
        track: "REACT",
        level: "MID",
        order: 1,
        status: ContentStatus.PUBLISHED,
        translations: {
          fr: {
            status: "READY",
            title: "Systemes de rendu React",
            description: "Description FR",
            summary: "Resume FR",
          },
          en: {
            status: "READY",
            title: "React Rendering Systems",
            description: "EN description",
            summary: "EN summary",
          },
        },
      },
    ]);
    expect(payload.skills).toEqual([
      {
        slug: "effects",
        moduleSlug: "react-rendering-systems",
        status: ContentStatus.IN_REVIEW,
        translations: {
          fr: {
            status: "READY",
            title: "Effects",
            description: "Description FR",
          },
          en: {
            status: "READY",
            title: "Effects",
            description: "EN description",
          },
        },
      },
    ]);
    expect(payload.pitfallTags).toEqual([
      {
        slug: "imagined-deep-compare",
        title: "Imagined deep compare",
        description: "Deep compare confusion.",
      },
      {
        slug: "stale-closure",
        title: "Stale closure",
        description: "Stale closure confusion.",
      },
    ]);
    expect(payload.questions[0]).toEqual(
      expect.objectContaining({
        slug: "effect-stale-closure",
        moduleSlug: "react-rendering-systems",
        primarySkillSlug: "effects",
        format: QuestionFormat.SINGLE_CHOICE,
        pitfallTagSlugs: ["imagined-deep-compare", "stale-closure"],
        options: [
          {
            order: 1,
            isCorrect: true,
            translations: {
              fr: {
                status: "READY",
                label: "Option FR",
                explanation: "Explication option FR",
              },
              en: {
                status: "READY",
                label: "Option EN",
                explanation: "Option explanation EN",
              },
            },
          },
        ],
      }),
    );
  });
});
