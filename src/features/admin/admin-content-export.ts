import { ContentLocale } from "@prisma/client";
import { prisma } from "@/lib/prisma";

function pickTranslation<
  TTranslation extends {
    locale: ContentLocale;
  },
>(translations: TTranslation[]) {
  return {
    fr:
      translations.find((translation) => translation.locale === ContentLocale.FR) ??
      null,
    en:
      translations.find((translation) => translation.locale === ContentLocale.EN) ??
      null,
  };
}

export async function getAdminContentExportPayload() {
  const [modules, skills, pitfallTags, questions] = await prisma.$transaction([
    prisma.learningModule.findMany({
      include: {
        translations: true,
      },
      orderBy: [
        {
          order: "asc",
        },
        {
          slug: "asc",
        },
      ],
    }),
    prisma.skill.findMany({
      include: {
        translations: true,
        module: {
          select: {
            slug: true,
          },
        },
      },
      orderBy: {
        slug: "asc",
      },
    }),
    prisma.pitfallTag.findMany({
      orderBy: {
        slug: "asc",
      },
    }),
    prisma.question.findMany({
      include: {
        translations: true,
        module: {
          select: {
            slug: true,
          },
        },
        primarySkill: {
          select: {
            slug: true,
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
        pitfallLinks: {
          include: {
            pitfallTag: {
              select: {
                slug: true,
              },
            },
          },
        },
      },
      orderBy: {
        slug: "asc",
      },
    }),
  ]);

  return {
    version: 1,
    generatedAt: new Date().toISOString(),
    modules: modules.map((module) => {
      const translations = pickTranslation(module.translations);

      return {
        slug: module.slug,
        track: module.track,
        level: module.level,
        order: module.order,
        status: module.status,
        translations: {
          fr:
            translations.fr && {
              status: translations.fr.status,
              title: translations.fr.title,
              description: translations.fr.description,
              summary: translations.fr.summary,
            },
          en:
            translations.en && {
              status: translations.en.status,
              title: translations.en.title,
              description: translations.en.description,
              summary: translations.en.summary,
            },
        },
      };
    }),
    skills: skills.map((skill) => {
      const translations = pickTranslation(skill.translations);

      return {
        slug: skill.slug,
        moduleSlug: skill.module.slug,
        status: skill.status,
        translations: {
          fr:
            translations.fr && {
              status: translations.fr.status,
              title: translations.fr.title,
              description: translations.fr.description,
            },
          en:
            translations.en && {
              status: translations.en.status,
              title: translations.en.title,
              description: translations.en.description,
            },
        },
      };
    }),
    pitfallTags: pitfallTags.map((pitfallTag) => ({
      slug: pitfallTag.slug,
      title: pitfallTag.title,
      description: pitfallTag.description,
    })),
    questions: questions.map((question) => {
      const translations = pickTranslation(question.translations);

      return {
        slug: question.slug,
        moduleSlug: question.module.slug,
        primarySkillSlug: question.primarySkill.slug,
        format: question.format,
        level: question.level,
        difficulty: question.difficulty,
        estimatedTimeSec: question.estimatedTimeSec,
        sourceType: question.sourceType,
        version: question.version,
        status: question.status,
        pitfallTagSlugs: question.pitfallLinks
          .map((link) => link.pitfallTag.slug)
          .sort((left, right) => left.localeCompare(right)),
        translations: {
          fr:
            translations.fr && {
              status: translations.fr.status,
              prompt: translations.fr.prompt,
              explanation: translations.fr.explanation,
              takeaways: translations.fr.takeaways,
              tlDr: translations.fr.tlDr,
              shortAnswer: translations.fr.shortAnswer,
              lessonBody: translations.fr.lessonBody,
              commonMistakes: translations.fr.commonMistakes,
              exampleTitle: translations.fr.exampleTitle,
              exampleCode: translations.fr.exampleCode,
              exampleLanguage: translations.fr.exampleLanguage,
              exampleExplanation: translations.fr.exampleExplanation,
              estimatedReadMinutes: translations.fr.estimatedReadMinutes,
              contextData: translations.fr.contextData,
              interviewSignal: translations.fr.interviewSignal,
              verbalizePoints: translations.fr.verbalizePoints,
            },
          en:
            translations.en && {
              status: translations.en.status,
              prompt: translations.en.prompt,
              explanation: translations.en.explanation,
              takeaways: translations.en.takeaways,
              tlDr: translations.en.tlDr,
              shortAnswer: translations.en.shortAnswer,
              lessonBody: translations.en.lessonBody,
              commonMistakes: translations.en.commonMistakes,
              exampleTitle: translations.en.exampleTitle,
              exampleCode: translations.en.exampleCode,
              exampleLanguage: translations.en.exampleLanguage,
              exampleExplanation: translations.en.exampleExplanation,
              estimatedReadMinutes: translations.en.estimatedReadMinutes,
              contextData: translations.en.contextData,
              interviewSignal: translations.en.interviewSignal,
              verbalizePoints: translations.en.verbalizePoints,
            },
        },
        options: question.options.map((option) => {
          const optionTranslations = pickTranslation(option.translations);

          return {
            order: option.order,
            isCorrect: option.isCorrect,
            translations: {
              fr:
                optionTranslations.fr && {
                  status: optionTranslations.fr.status,
                  label: optionTranslations.fr.label,
                  explanation: optionTranslations.fr.explanation,
                },
              en:
                optionTranslations.en && {
                  status: optionTranslations.en.status,
                  label: optionTranslations.en.label,
                  explanation: optionTranslations.en.explanation,
                },
            },
          };
        }),
      };
    }),
  };
}

export type AdminContentExportPayload = Awaited<
  ReturnType<typeof getAdminContentExportPayload>
>;
