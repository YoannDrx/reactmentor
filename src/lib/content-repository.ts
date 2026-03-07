import {
  ContentLocale,
  ContentStatus,
  MasteryState,
  type Prisma,
} from "@prisma/client";
import { defaultLocale, type Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";
import { parseQuestionContextData } from "@/lib/question-context";

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

function requireLocalizedTranslation<
  TItem extends {
    locale: ContentLocale;
  },
>(params: {
  entity: "module" | "skill" | "question" | "option";
  entityId: string;
  translations: TItem[];
  locale: Locale;
}) {
  const translation = pickLocalizedTranslation(params.translations, params.locale);

  if (!translation) {
    throw new Error(
      `Missing ${params.entity} translation for ${params.entityId} in locale ${params.locale}.`,
    );
  }

  return translation;
}

export function localizeModule(
  module: ModuleWithTranslations,
  locale: Locale = defaultLocale,
) {
  const translation = requireLocalizedTranslation({
    entity: "module",
    entityId: module.id,
    translations: module.translations,
    locale,
  });

  return {
    ...module,
    locale: dbLocaleToLocale[translation.locale],
    title: translation.title,
    description: translation.description,
    summary: translation.summary ?? null,
  };
}

export function localizeSkill(
  skill: SkillWithTranslations,
  locale: Locale = defaultLocale,
) {
  const translation = requireLocalizedTranslation({
    entity: "skill",
    entityId: skill.id,
    translations: skill.translations,
    locale,
  });

  return {
    ...skill,
    locale: dbLocaleToLocale[translation.locale],
    title: translation.title,
    description: translation.description,
  };
}

export function localizeQuestion(
  question: QuestionWithTranslations,
  locale: Locale = defaultLocale,
) {
  const translation = requireLocalizedTranslation({
    entity: "question",
    entityId: question.id,
    translations: question.translations,
    locale,
  });

  return {
    ...question,
    locale: dbLocaleToLocale[translation.locale],
    prompt: translation.prompt,
    explanation: translation.explanation,
    takeaways: translation.takeaways ?? null,
    contextData: parseQuestionContextData(translation.contextData),
    interviewSignal: translation.interviewSignal ?? null,
    verbalizePoints: translation.verbalizePoints ?? null,
    options: question.options.map((option) => {
      const optionTranslation = requireLocalizedTranslation({
        entity: "option",
        entityId: option.id,
        translations: option.translations,
        locale,
      });

      return {
        ...option,
        locale: dbLocaleToLocale[optionTranslation.locale],
        label: optionTranslation.label,
        explanation: optionTranslation.explanation,
      };
    }),
  };
}

export async function getLocalizedModules(locale: Locale = defaultLocale) {
  const modules = await prisma.learningModule.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
    },
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
    where: {
      status: ContentStatus.PUBLISHED,
    },
    include: {
      translations: true,
      skills: {
        where: {
          status: ContentStatus.PUBLISHED,
        },
        include: {
          translations: true,
        },
        orderBy: {
          slug: "asc",
        },
      },
      questions: {
        where: {
          status: ContentStatus.PUBLISHED,
        },
        select: {
          id: true,
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
    counts: {
      questions: learningModule.questions.length,
      skills: learningModule.skills.length,
    },
  }));
}

export async function getLocalizedModuleCatalogWithProgress(
  userId: string,
  locale: Locale = defaultLocale,
) {
  const modules = await prisma.learningModule.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
    },
    include: {
      translations: true,
      skills: {
        where: {
          status: ContentStatus.PUBLISHED,
        },
        include: {
          translations: true,
        },
        orderBy: {
          slug: "asc",
        },
      },
      questions: {
        where: {
          status: ContentStatus.PUBLISHED,
        },
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
    const publishedQuestionCount = learningModule.questions.length;
    const progressPercent =
      publishedQuestionCount > 0
        ? Math.round(
            (attemptedQuestions / publishedQuestionCount) * 100,
          )
        : 0;

    return {
      ...localizeModule(learningModule, locale),
      skills: learningModule.skills.map((skill) => localizeSkill(skill, locale)),
      counts: {
        questions: publishedQuestionCount,
        skills: learningModule.skills.length,
      },
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
  const learningModule = await prisma.learningModule.findFirst({
    where: {
      slug,
      status: ContentStatus.PUBLISHED,
    },
    include: {
      translations: true,
      skills: {
        where: {
          status: ContentStatus.PUBLISHED,
        },
        include: {
          translations: true,
        },
        orderBy: {
          slug: "asc",
        },
      },
      questions: {
        where: {
          status: ContentStatus.PUBLISHED,
        },
        select: {
          id: true,
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
    counts: {
      questions: learningModule.questions.length,
      skills: learningModule.skills.length,
    },
  };
}

export async function getLocalizedQuestionBySlug(
  slug: string,
  locale: Locale = defaultLocale,
) {
  const question = await prisma.question.findFirst({
    where: {
      slug,
      status: ContentStatus.PUBLISHED,
    },
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

  if (
    question.module.status !== ContentStatus.PUBLISHED ||
    question.primarySkill.status !== ContentStatus.PUBLISHED
  ) {
    return null;
  }

  return {
    ...localizeQuestion(question, locale),
    primarySkill: localizeSkill(question.primarySkill, locale),
    module: localizeModule(question.module, locale),
  };
}
