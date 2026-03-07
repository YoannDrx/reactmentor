import { ContentLocale, ContentStatus } from "@prisma/client";
import { describe, expect, it } from "vitest";
import {
  localizeModule,
  localizeQuestion,
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
    expect(localized.options[0]?.label).toBe("Option FR");
    expect(localized.options[0]?.explanation).toBe("Explication option FR");
    expect(localized.locale).toBe("fr");
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
