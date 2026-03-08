import { ContentLocale, ContentStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";
import {
  buildPrimaryCollectionJourney,
  localizeModule,
  localizeQuestionReference,
  localizeQuestionCollection,
  localizeQuestion,
  localizeQuestionSummary,
  localizeSkill,
} from "@/lib/content-repository";

describe("content-repository localization helpers", () => {
  it("localizes modules with the requested locale", () => {
    const learningModule = {
      id: "module_1",
      slug: "react-rendering-systems",
      title: "Legacy title",
      description: "Legacy description",
      summary: "Legacy summary",
      order: 1,
      track: "REACT",
      level: "MID",
      status: ContentStatus.PUBLISHED,
      createdAt: new Date(),
      updatedAt: new Date(),
      translations: [
        {
          id: "tr_en",
          moduleId: "module_1",
          locale: ContentLocale.EN,
          status: "READY",
          title: "React Rendering Systems",
          description: "English description",
          summary: "English summary",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: "tr_fr",
          moduleId: "module_1",
          locale: ContentLocale.FR,
          status: "READY",
          title: "Systemes de rendu React",
          description: "Description francaise",
          summary: "Resume francais",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    } as Parameters<typeof localizeModule>[0];

    const localized = localizeModule(learningModule, "fr");

    expect(localized.title).toBe("Systemes de rendu React");
    expect(localized.description).toBe("Description francaise");
    expect(localized.locale).toBe("fr");
  });

  it("falls back to the other locale for skills when the requested one is missing", () => {
    const skill = {
      id: "skill_1",
      slug: "effect-mental-model",
      title: "Legacy skill title",
      description: "Legacy skill description",
      moduleId: "module_1",
      status: ContentStatus.PUBLISHED,
      createdAt: new Date(),
      updatedAt: new Date(),
      translations: [
        {
          id: "skill_tr_en",
          skillId: "skill_1",
          locale: ContentLocale.EN,
          status: "READY",
          title: "Effect Mental Model",
          description: "English skill description",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    } as Parameters<typeof localizeSkill>[0];

    const localized = localizeSkill(skill, "fr");

    expect(localized.title).toBe("Effect Mental Model");
    expect(localized.description).toBe("English skill description");
    expect(localized.locale).toBe("en");
  });

  it("localizes question content and option labels together", () => {
    const question = {
      id: "question_1",
      slug: "keys-do-not-force-rerender",
      moduleId: "module_1",
      primarySkillId: "skill_1",
      difficulty: 3,
      level: "MID",
      format: "SINGLE_CHOICE",
      prompt: "Legacy prompt",
      explanation: "Legacy explanation",
      takeaways: ["legacy takeaway"],
      status: ContentStatus.PUBLISHED,
      createdAt: new Date(),
      updatedAt: new Date(),
      translations: [
        {
          id: "question_tr_fr",
          questionId: "question_1",
          locale: ContentLocale.FR,
          status: "READY",
          prompt: "Prompt FR",
          explanation: "Explication FR",
          takeaways: ["takeaway fr"],
          tlDr: "TLDR FR",
          shortAnswer: "Short answer FR",
          lessonBody: "Lesson body FR",
          commonMistakes: ["mistake fr"],
          exampleTitle: "Example title FR",
          exampleCode: "const value = 1;",
          exampleLanguage: "ts",
          exampleExplanation: "Example explanation FR",
          estimatedReadMinutes: 4,
          interviewSignal: null,
          verbalizePoints: ["point fr"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      options: [
        {
          id: "option_1",
          questionId: "question_1",
          label: "Legacy option",
          explanation: "Legacy option explanation",
          isCorrect: true,
          order: 1,
          createdAt: new Date(),
          translations: [
            {
              id: "option_tr_fr",
              optionId: "option_1",
              locale: ContentLocale.FR,
              status: "READY",
              label: "Option FR",
              explanation: "Explication option FR",
              createdAt: new Date(),
              updatedAt: new Date(),
            },
          ],
        },
      ],
    } as Parameters<typeof localizeQuestion>[0];

    const localized = localizeQuestion(question, "fr");

    expect(localized.prompt).toBe("Prompt FR");
    expect(localized.explanation).toBe("Explication FR");
    expect(localized.tlDr).toBe("TLDR FR");
    expect(localized.shortAnswer).toBe("Short answer FR");
    expect(localized.lessonBody).toBe("Lesson body FR");
    expect(localized.commonMistakes).toEqual(["mistake fr"]);
    expect(localized.exampleTitle).toBe("Example title FR");
    expect(localized.exampleCode).toBe("const value = 1;");
    expect(localized.exampleLanguage).toBe("ts");
    expect(localized.exampleExplanation).toBe("Example explanation FR");
    expect(localized.estimatedReadMinutes).toBe(4);
    expect(localized.options[0]?.label).toBe("Option FR");
    expect(localized.options[0]?.explanation).toBe("Explication option FR");
    expect(localized.locale).toBe("fr");
  });

  it("localizes question summaries without option payloads", () => {
    const question = {
      id: "question_summary_1",
      slug: "effect-array-reference",
      moduleId: "module_1",
      primarySkillId: "skill_1",
      difficulty: 4,
      level: "SENIOR",
      format: "SINGLE_CHOICE",
      estimatedTimeSec: 180,
      sourceType: null,
      version: 1,
      prompt: "Legacy prompt",
      explanation: "Legacy explanation",
      takeaways: ["legacy takeaway"],
      status: ContentStatus.PUBLISHED,
      createdAt: new Date(),
      updatedAt: new Date(),
      translations: [
        {
          id: "question_summary_tr_en",
          questionId: "question_summary_1",
          locale: ContentLocale.EN,
          status: "READY",
          prompt: "Prompt EN",
          explanation: "Explanation EN",
          takeaways: ["takeaway en"],
          tlDr: "TLDR EN",
          shortAnswer: "Short EN",
          lessonBody: "Lesson EN",
          commonMistakes: ["mistake en"],
          exampleTitle: "Example EN",
          exampleCode: "console.log('hi')",
          exampleLanguage: "ts",
          exampleExplanation: "Example explanation EN",
          estimatedReadMinutes: 6,
          contextData: null,
          interviewSignal: "signal",
          verbalizePoints: ["point en"],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    } as Parameters<typeof localizeQuestionSummary>[0];

    const localized = localizeQuestionSummary(question, "en");

    expect(localized.prompt).toBe("Prompt EN");
    expect(localized.takeaways).toEqual(["takeaway en"]);
    expect(localized.verbalizePoints).toEqual(["point en"]);
    expect(localized.commonMistakes).toEqual(["mistake en"]);
    expect(localized.estimatedReadMinutes).toBe(6);
  });

  it("localizes question collections with translation fallback", () => {
    const collection = {
      id: "collection_1",
      slug: "react-interview-foundations",
      title: "Legacy collection title",
      description: "Legacy collection description",
      summary: "Legacy collection summary",
      order: 1,
      status: ContentStatus.PUBLISHED,
      createdAt: new Date(),
      updatedAt: new Date(),
      translations: [
        {
          id: "collection_tr_en",
          collectionId: "collection_1",
          locale: ContentLocale.EN,
          status: "READY",
          title: "React Interview Foundations",
          description: "English collection description",
          summary: "English collection summary",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    } as Parameters<typeof localizeQuestionCollection>[0];

    const localized = localizeQuestionCollection(collection, "fr");

    expect(localized.title).toBe("React Interview Foundations");
    expect(localized.description).toBe("English collection description");
    expect(localized.locale).toBe("en");
  });

  it("localizes lightweight question references for collection navigation", () => {
    const reference = {
      id: "question_ref_1",
      slug: "controlled-input-keeps-react-in-charge",
      translations: [
        {
          locale: ContentLocale.FR,
          prompt:
            "Dans un input React controle, qui est la source de verite pour la valeur affichee ?",
        },
      ],
    } as Parameters<typeof localizeQuestionReference>[0];

    const localized = localizeQuestionReference(reference, "fr");

    expect(localized.prompt).toContain("source de verite");
    expect(localized.slug).toBe("controlled-input-keeps-react-in-charge");
    expect(localized.locale).toBe("fr");
  });

  it("builds primary collection navigation from the first editorial collection", () => {
    const laterCollection = {
      id: "collection_later",
      slug: "later-collection",
      title: "Legacy later",
      description: "Legacy later description",
      summary: "Legacy later summary",
      order: 4,
      status: ContentStatus.PUBLISHED,
      createdAt: new Date(),
      updatedAt: new Date(),
      translations: [
        {
          id: "later_tr_en",
          collectionId: "collection_later",
          locale: ContentLocale.EN,
          status: "READY",
          title: "Later collection",
          description: "Later description",
          summary: "Later summary",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      items: [
        {
          order: 1,
          question: {
            id: "q4",
            slug: "question-later-a",
            translations: [
              {
                locale: ContentLocale.EN,
                prompt: "Later A",
              },
            ],
          },
        },
        {
          order: 2,
          question: {
            id: "q2",
            slug: "current-question",
            translations: [
              {
                locale: ContentLocale.EN,
                prompt: "Current question",
              },
            ],
          },
        },
      ],
    } as Parameters<typeof buildPrimaryCollectionJourney>[1][number];

    const primaryCollection = {
      id: "collection_primary",
      slug: "primary-collection",
      title: "Legacy primary",
      description: "Legacy primary description",
      summary: "Legacy primary summary",
      order: 1,
      status: ContentStatus.PUBLISHED,
      createdAt: new Date(),
      updatedAt: new Date(),
      translations: [
        {
          id: "primary_tr_en",
          collectionId: "collection_primary",
          locale: ContentLocale.EN,
          status: "READY",
          title: "Primary collection",
          description: "Primary description",
          summary: "Primary summary",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      items: [
        {
          order: 1,
          question: {
            id: "q1",
            slug: "question-before",
            translations: [
              {
                locale: ContentLocale.EN,
                prompt: "Question before",
              },
            ],
          },
        },
        {
          order: 2,
          question: {
            id: "q2",
            slug: "current-question",
            translations: [
              {
                locale: ContentLocale.EN,
                prompt: "Current question",
              },
            ],
          },
        },
        {
          order: 3,
          question: {
            id: "q3",
            slug: "question-after",
            translations: [
              {
                locale: ContentLocale.EN,
                prompt: "Question after",
              },
            ],
          },
        },
      ],
    } as Parameters<typeof buildPrimaryCollectionJourney>[1][number];

    const journey = buildPrimaryCollectionJourney(
      "current-question",
      [laterCollection, primaryCollection],
      "en",
    );

    expect(journey?.collection.slug).toBe("primary-collection");
    expect(journey?.position).toBe(2);
    expect(journey?.total).toBe(3);
    expect(journey?.previousQuestion?.slug).toBe("question-before");
    expect(journey?.nextQuestion?.slug).toBe("question-after");
  });

  it("does not fall back to legacy root fields when translations are missing", () => {
    const learningModule = {
      id: "module_missing_translation",
      slug: "legacy-only-module",
      title: "Legacy-only title",
      description: "Legacy-only description",
      summary: "Legacy-only summary",
      order: 9,
      track: "REACT",
      level: "MID",
      status: ContentStatus.PUBLISHED,
      createdAt: new Date(),
      updatedAt: new Date(),
      translations: [],
    } as Parameters<typeof localizeModule>[0];

    expect(() => localizeModule(learningModule, "fr")).toThrow(
      "Missing module translation for module_missing_translation in locale fr.",
    );
  });
});
