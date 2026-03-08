import {
  ContentStatus,
  QuestionFormat,
  QuestionLevel,
  Track,
} from "@prisma/client";
import { beforeEach, describe, expect, it, vi } from "vitest";

const { transactionMock } = vi.hoisted(() => ({
  transactionMock: vi.fn(),
}));

vi.mock("@/lib/prisma", () => ({
  prisma: {
    $transaction: transactionMock,
  },
}));

import { importAdminContentPayload } from "@/features/admin/admin-content-import";

function createTransactionMock() {
  return {
    pitfallTag: {
      upsert: vi.fn(),
      findMany: vi.fn(),
    },
    learningModule: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
    },
    learningModuleTranslation: {
      upsert: vi.fn(),
    },
    skill: {
      upsert: vi.fn(),
      findUnique: vi.fn(),
    },
    skillTranslation: {
      upsert: vi.fn(),
    },
    question: {
      findUnique: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
    },
    questionTranslation: {
      upsert: vi.fn(),
    },
    questionOption: {
      deleteMany: vi.fn(),
      create: vi.fn(),
    },
    questionOptionTranslation: {
      upsert: vi.fn(),
    },
    questionPitfallTag: {
      deleteMany: vi.fn(),
      createMany: vi.fn(),
    },
  };
}

describe("importAdminContentPayload", () => {
  beforeEach(() => {
    transactionMock.mockReset();
  });

  it("upserts admin content from the exported JSON contract", async () => {
    const tx = createTransactionMock();

    tx.learningModule.upsert.mockResolvedValue({ id: "module_1" });
    tx.skill.upsert.mockResolvedValue({ id: "skill_1", moduleId: "module_1" });
    tx.question.findUnique.mockResolvedValue(null);
    tx.question.create.mockResolvedValue({ id: "question_1" });
    tx.pitfallTag.findMany.mockResolvedValue([
      {
        id: "pitfall_1",
        slug: "stale-closure",
      },
    ]);
    transactionMock.mockImplementation(async (callback) => callback(tx));

    const result = await importAdminContentPayload(
      JSON.stringify({
        version: 1,
        modules: [
          {
            slug: "react-rendering-systems",
            track: Track.REACT,
            level: QuestionLevel.MID,
            order: 1,
            status: ContentStatus.PUBLISHED,
            translations: {
              fr: {
                title: "Systemes de rendu React",
                description: "Description FR",
                summary: "Resume FR",
              },
              en: {
                title: "React Rendering Systems",
                description: "EN description",
                summary: "EN summary",
              },
            },
          },
        ],
        skills: [
          {
            slug: "effects",
            moduleSlug: "react-rendering-systems",
            status: ContentStatus.IN_REVIEW,
            translations: {
              fr: {
                title: "Effects",
                description: "Description FR",
              },
              en: {
                title: "Effects",
                description: "EN description",
              },
            },
          },
        ],
        pitfallTags: [
          {
            slug: "stale-closure",
            title: "Stale closure",
            description: "Stale closure confusion.",
          },
        ],
        questions: [
          {
            slug: "effect-stale-closure",
            moduleSlug: "react-rendering-systems",
            primarySkillSlug: "effects",
            format: QuestionFormat.OPEN_ENDED,
            level: QuestionLevel.MID,
            difficulty: 3,
            estimatedTimeSec: 45,
            sourceType: "seed",
            version: 1,
            status: ContentStatus.DRAFT,
            pitfallTagSlugs: ["stale-closure"],
            translations: {
              fr: {
                prompt: "Prompt FR",
                explanation: "Explication FR",
                takeaways: ["Takeaway FR"],
              },
              en: {
                prompt: "Prompt EN",
                explanation: "Explanation EN",
                takeaways: ["Takeaway EN"],
              },
            },
            options: [],
          },
        ],
      }),
    );

    expect(tx.pitfallTag.upsert).toHaveBeenCalledWith({
      where: {
        slug: "stale-closure",
      },
      create: {
        slug: "stale-closure",
        title: "Stale closure",
        description: "Stale closure confusion.",
      },
      update: {
        title: "Stale closure",
        description: "Stale closure confusion.",
      },
    });
    expect(tx.learningModule.upsert).toHaveBeenCalled();
    expect(tx.skill.upsert).toHaveBeenCalled();
    expect(tx.question.create).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          slug: "effect-stale-closure",
          moduleId: "module_1",
          primarySkillId: "skill_1",
          format: QuestionFormat.OPEN_ENDED,
          level: QuestionLevel.MID,
          difficulty: 3,
          estimatedTimeSec: 45,
          sourceType: "seed",
          status: ContentStatus.DRAFT,
        }),
        select: {
          id: true,
        },
      }),
    );
    expect(tx.questionPitfallTag.deleteMany).toHaveBeenCalledWith({
      where: {
        questionId: "question_1",
      },
    });
    expect(tx.questionPitfallTag.createMany).toHaveBeenCalledWith({
      data: [
        {
          questionId: "question_1",
          pitfallTagId: "pitfall_1",
        },
      ],
      skipDuplicates: true,
    });
    expect(result).toEqual(
      expect.objectContaining({
        version: 1,
        counts: {
          modules: 1,
          skills: 1,
          pitfallTags: 1,
          questions: 1,
        },
      }),
    );
  });

  it("rejects closed-question option changes when attempts already exist", async () => {
    const tx = createTransactionMock();

    tx.learningModule.upsert.mockResolvedValue({ id: "module_1" });
    tx.skill.upsert.mockResolvedValue({ id: "skill_1", moduleId: "module_1" });
    tx.question.findUnique.mockResolvedValue({
      id: "question_1",
      format: QuestionFormat.SINGLE_CHOICE,
      _count: {
        attempts: 2,
      },
      options: [
        {
          order: 1,
          isCorrect: true,
          translations: [
            {
              locale: "FR",
              label: "Bonne reponse FR",
              explanation: "Explication FR",
            },
            {
              locale: "EN",
              label: "Correct answer EN",
              explanation: "Explanation EN",
            },
          ],
        },
        {
          order: 2,
          isCorrect: false,
          translations: [
            {
              locale: "FR",
              label: "Distracteur FR",
              explanation: "Explication distracteur FR",
            },
            {
              locale: "EN",
              label: "Distractor EN",
              explanation: "Distractor explanation EN",
            },
          ],
        },
      ],
      translations: [],
    });
    transactionMock.mockImplementation(async (callback) => callback(tx));

    await expect(
      importAdminContentPayload(
        JSON.stringify({
          version: 1,
          modules: [
            {
              slug: "react-rendering-systems",
              track: Track.REACT,
              level: QuestionLevel.MID,
              order: 1,
              status: ContentStatus.PUBLISHED,
              translations: {
                fr: {
                  title: "Systemes de rendu React",
                  description: "Description FR",
                },
                en: {
                  title: "React Rendering Systems",
                  description: "EN description",
                },
              },
            },
          ],
          skills: [
            {
              slug: "effects",
              moduleSlug: "react-rendering-systems",
              status: ContentStatus.PUBLISHED,
              translations: {
                fr: {
                  title: "Effects",
                  description: "Description FR",
                },
                en: {
                  title: "Effects",
                  description: "EN description",
                },
              },
            },
          ],
          pitfallTags: [],
          questions: [
            {
              slug: "effect-stale-closure",
              moduleSlug: "react-rendering-systems",
              primarySkillSlug: "effects",
              format: QuestionFormat.SINGLE_CHOICE,
              level: QuestionLevel.MID,
              difficulty: 3,
              version: 1,
              status: ContentStatus.DRAFT,
              pitfallTagSlugs: [],
              translations: {
                fr: {
                  prompt: "Prompt FR",
                  explanation: "Explication FR",
                  takeaways: ["Takeaway FR"],
                },
                en: {
                  prompt: "Prompt EN",
                  explanation: "Explanation EN",
                  takeaways: ["Takeaway EN"],
                },
              },
              options: [
                {
                  order: 1,
                  isCorrect: false,
                  translations: {
                    fr: {
                      label: "Nouvelle option FR",
                      explanation: "Nouvelle explication FR",
                    },
                    en: {
                      label: "New option EN",
                      explanation: "New explanation EN",
                    },
                  },
                },
                {
                  order: 2,
                  isCorrect: true,
                  translations: {
                    fr: {
                      label: "Autre option FR",
                      explanation: "Autre explication FR",
                    },
                    en: {
                      label: "Other option EN",
                      explanation: "Other explanation EN",
                    },
                  },
                },
              ],
            },
          ],
        }),
      ),
    ).rejects.toThrow(
      "Question effect-stale-closure cannot change closed options once attempts exist.",
    );

    expect(tx.question.update).not.toHaveBeenCalled();
    expect(tx.question.create).not.toHaveBeenCalled();
  });
});
