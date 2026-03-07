import { ContentLocale, MasteryState, type Prisma } from "@prisma/client";
import { defaultLocale, type Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";

const localeToDbLocale: Record<Locale, ContentLocale> = {
  fr: ContentLocale.FR,
  en: ContentLocale.EN,
};

const dbLocaleToLocale: Record<ContentLocale, Locale> = {
  FR: "fr",
  EN: "en",
};

function getDbLocale(locale: Locale) {
  return localeToDbLocale[locale];
}

function getFallbackDbLocale(locale: Locale) {
  return localeToDbLocale[locale === "fr" ? "en" : "fr"];
}

type ModuleWithTranslations = Prisma.LearningModuleGetPayload<{
  include: {
    translations: true;
  };
}>;

type SkillWithTranslations = Prisma.SkillGetPayload<{
  include: {
    translations: true;
  };
}>;

type QuestionWithTranslations = Prisma.QuestionGetPayload<{
  include: {
    translations: true;
    options: {
      include: {
        translations: true;
      };
    };
  };
}>;

function pickLocalizedTranslation<
  TItem extends {
    locale: ContentLocale;
  },
>(translations: TItem[], locale: Locale) {
  const dbLocale = getDbLocale(locale);
  const fallbackDbLocale = getFallbackDbLocale(locale);

  return (
    translations.find((translation) => translation.locale === dbLocale) ??
    translations.find((translation) => translation.locale === fallbackDbLocale) ??
    translations[0] ??
    null
  );
}

export function localizeModule(
  module: ModuleWithTranslations,
  locale: Locale = defaultLocale,
) {
  const translation = pickLocalizedTranslation(module.translations, locale);

  return {
    ...module,
    locale: translation ? dbLocaleToLocale[translation.locale] : locale,
    title: translation?.title ?? module.title,
    description: translation?.description ?? module.description,
    summary: translation?.summary ?? module.summary,
  };
}

export function localizeSkill(
  skill: SkillWithTranslations,
  locale: Locale = defaultLocale,
) {
  const translation = pickLocalizedTranslation(skill.translations, locale);

  return {
    ...skill,
    locale: translation ? dbLocaleToLocale[translation.locale] : locale,
    title: translation?.title ?? skill.title,
    description: translation?.description ?? skill.description,
  };
}

export function localizeQuestion(
  question: QuestionWithTranslations,
  locale: Locale = defaultLocale,
) {
  const translation = pickLocalizedTranslation(question.translations, locale);

  return {
    ...question,
    locale: translation ? dbLocaleToLocale[translation.locale] : locale,
    prompt: translation?.prompt ?? question.prompt,
    explanation: translation?.explanation ?? question.explanation,
    takeaways: translation?.takeaways ?? question.takeaways,
    interviewSignal: translation?.interviewSignal ?? null,
    verbalizePoints: translation?.verbalizePoints ?? null,
    options: question.options.map((option) => {
      const optionTranslation = pickLocalizedTranslation(option.translations, locale);

      return {
        ...option,
        locale: optionTranslation ? dbLocaleToLocale[optionTranslation.locale] : locale,
        label: optionTranslation?.label ?? option.label,
        explanation: optionTranslation?.explanation ?? option.explanation,
      };
    }),
  };
}

export async function getLocalizedModules(locale: Locale = defaultLocale) {
  const modules = await prisma.learningModule.findMany({
    include: {
      translations: true,
    },
    orderBy: {
      order: "asc",
    },
  });

  return modules.map((module) => localizeModule(module, locale));
}

export async function getLocalizedModuleCatalog(
  locale: Locale = defaultLocale,
) {
  const modules = await prisma.learningModule.findMany({
    include: {
      translations: true,
      skills: {
        include: {
          translations: true,
        },
        orderBy: {
          slug: "asc",
        },
      },
      _count: {
        select: {
          questions: true,
          skills: true,
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  return modules.map((learningModule) => ({
    ...localizeModule(learningModule, locale),
    skills: learningModule.skills.map((skill) => localizeSkill(skill, locale)),
    counts: learningModule._count,
  }));
}

export async function getLocalizedModuleCatalogWithProgress(
  userId: string,
  locale: Locale = defaultLocale,
) {
  const modules = await prisma.learningModule.findMany({
    include: {
      translations: true,
      skills: {
        include: {
          translations: true,
        },
        orderBy: {
          slug: "asc",
        },
      },
      questions: {
        select: {
          id: true,
          attempts: {
            where: {
              userId,
            },
            select: {
              id: true,
            },
            take: 1,
          },
          progress: {
            where: {
              userId,
            },
            select: {
              masteryState: true,
            },
            take: 1,
          },
        },
      },
      _count: {
        select: {
          questions: true,
          skills: true,
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  return modules.map((learningModule) => {
    const attemptedQuestions = learningModule.questions.filter(
      (question) => question.attempts.length > 0,
    ).length;
    const masteredQuestions = learningModule.questions.filter(
      (question) =>
        question.progress[0]?.masteryState === MasteryState.MASTERED,
    ).length;
    const progressPercent =
      learningModule._count.questions > 0
        ? Math.round(
            (attemptedQuestions / learningModule._count.questions) * 100,
          )
        : 0;

    return {
      ...localizeModule(learningModule, locale),
      skills: learningModule.skills.map((skill) => localizeSkill(skill, locale)),
      counts: learningModule._count,
      userProgress: {
        attemptedQuestions,
        masteredQuestions,
        progressPercent,
      },
    };
  });
}

export async function getLocalizedModuleBySlug(
  slug: string,
  locale: Locale = defaultLocale,
) {
  const learningModule = await prisma.learningModule.findUnique({
    where: { slug },
    include: {
      translations: true,
      skills: {
        include: {
          translations: true,
        },
        orderBy: {
          slug: "asc",
        },
      },
      _count: {
        select: {
          questions: true,
          skills: true,
        },
      },
    },
  });

  if (!learningModule) {
    return null;
  }

  return {
    ...localizeModule(learningModule, locale),
    skills: learningModule.skills.map((skill) => localizeSkill(skill, locale)),
    counts: learningModule._count,
  };
}

export async function getLocalizedQuestionBySlug(
  slug: string,
  locale: Locale = defaultLocale,
) {
  const question = await prisma.question.findUnique({
    where: { slug },
    include: {
      translations: true,
      options: {
        include: {
          translations: true,
        },
        orderBy: {
          order: "asc",
        },
      },
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
    },
  });

  if (!question) {
    return null;
  }

  return {
    ...localizeQuestion(question, locale),
    primarySkill: localizeSkill(question.primarySkill, locale),
    module: localizeModule(question.module, locale),
  };
}
