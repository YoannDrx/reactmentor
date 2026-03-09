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

type QuestionSummaryWithTranslations = Prisma.QuestionGetPayload<{
  include: {
    translations: true;
    primarySkill: {
      include: {
        translations: true;
      };
    };
    module: {
      include: {
        translations: true;
      };
    };
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

type QuestionCollectionWithTranslations = Prisma.QuestionCollectionGetPayload<{
  include: {
    translations: true;
  };
}>;

type QuestionPromptReference = {
  id: string;
  slug: string;
  translations: Array<{
    locale: ContentLocale;
    prompt: string;
  }>;
};

type QuestionCollectionJourneyInput = QuestionCollectionWithTranslations & {
  items: Array<{
    order: number;
    question: QuestionPromptReference;
  }>;
};

function normalizeStringList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .filter((item): item is string => typeof item === "string")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function pickLocalizedTranslation<
  TItem extends {
    locale: ContentLocale;
  },
>(translations: TItem[], locale: Locale) {
  const dbLocale = getDbLocale(locale);
  const fallbackDbLocale = getFallbackDbLocale(locale);

  return (
    translations.find((translation) => translation.locale === dbLocale) ??
    translations.find(
      (translation) => translation.locale === fallbackDbLocale,
    ) ??
    translations[0] ??
    null
  );
}

function requireLocalizedTranslation<
  TItem extends {
    locale: ContentLocale;
  },
>(params: {
  entity: "module" | "skill" | "question" | "option" | "collection";
  entityId: string;
  translations: TItem[];
  locale: Locale;
}) {
  const translation = pickLocalizedTranslation(
    params.translations,
    params.locale,
  );

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

export function localizeQuestionSummary(
  question: Pick<
    QuestionSummaryWithTranslations,
    | "id"
    | "slug"
    | "moduleId"
    | "primarySkillId"
    | "difficulty"
    | "level"
    | "format"
    | "estimatedTimeSec"
    | "sourceType"
    | "version"
    | "prompt"
    | "explanation"
    | "takeaways"
    | "status"
    | "createdAt"
    | "updatedAt"
    | "translations"
  >,
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
    takeaways: normalizeStringList(translation.takeaways),
    tlDr: translation.tlDr ?? null,
    shortAnswer: translation.shortAnswer ?? null,
    lessonBody: translation.lessonBody ?? null,
    commonMistakes: normalizeStringList(translation.commonMistakes),
    exampleTitle: translation.exampleTitle ?? null,
    exampleCode: translation.exampleCode ?? null,
    exampleLanguage: translation.exampleLanguage ?? null,
    exampleExplanation: translation.exampleExplanation ?? null,
    estimatedReadMinutes:
      typeof translation.estimatedReadMinutes === "number"
        ? translation.estimatedReadMinutes
        : null,
    contextData: parseQuestionContextData(translation.contextData),
    interviewSignal: translation.interviewSignal ?? null,
    verbalizePoints: normalizeStringList(translation.verbalizePoints),
  };
}

export function localizeQuestion(
  question: QuestionWithTranslations,
  locale: Locale = defaultLocale,
) {
  const baseQuestion = localizeQuestionSummary(question, locale);

  return {
    ...baseQuestion,
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

export function localizeQuestionCollection(
  collection: QuestionCollectionWithTranslations,
  locale: Locale = defaultLocale,
) {
  const translation = requireLocalizedTranslation({
    entity: "collection",
    entityId: collection.id,
    translations: collection.translations,
    locale,
  });

  return {
    ...collection,
    locale: dbLocaleToLocale[translation.locale],
    title: translation.title,
    description: translation.description,
    summary: translation.summary ?? null,
  };
}

export function localizeQuestionReference(
  question: QuestionPromptReference,
  locale: Locale = defaultLocale,
) {
  const translation = requireLocalizedTranslation({
    entity: "question",
    entityId: question.id,
    translations: question.translations,
    locale,
  });

  return {
    id: question.id,
    slug: question.slug,
    locale: dbLocaleToLocale[translation.locale],
    prompt: translation.prompt,
  };
}

export function buildPrimaryCollectionJourney(
  currentQuestionSlug: string,
  collections: QuestionCollectionJourneyInput[],
  locale: Locale = defaultLocale,
) {
  const sortedCollections = [...collections].sort((left, right) => {
    if (left.order !== right.order) {
      return left.order - right.order;
    }

    return left.slug.localeCompare(right.slug);
  });

  const primaryCollection = sortedCollections.find((collection) =>
    collection.items.some((item) => item.question.slug === currentQuestionSlug),
  );

  if (!primaryCollection) {
    return null;
  }

  const currentIndex = primaryCollection.items.findIndex(
    (item) => item.question.slug === currentQuestionSlug,
  );

  if (currentIndex === -1) {
    return null;
  }

  const previousItem =
    currentIndex > 0 ? primaryCollection.items[currentIndex - 1] : null;
  const nextItem =
    currentIndex < primaryCollection.items.length - 1
      ? primaryCollection.items[currentIndex + 1]
      : null;

  return {
    collection: localizeQuestionCollection(primaryCollection, locale),
    position: currentIndex + 1,
    total: primaryCollection.items.length,
    previousQuestion: previousItem
      ? localizeQuestionReference(previousItem.question, locale)
      : null,
    nextQuestion: nextItem
      ? localizeQuestionReference(nextItem.question, locale)
      : null,
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
        ? Math.round((attemptedQuestions / publishedQuestionCount) * 100)
        : 0;

    return {
      ...localizeModule(learningModule, locale),
      skills: learningModule.skills.map((skill) =>
        localizeSkill(skill, locale),
      ),
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
          primarySkill: {
            status: ContentStatus.PUBLISHED,
          },
        },
        include: {
          translations: true,
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
        orderBy: [
          {
            difficulty: "asc",
          },
          {
            createdAt: "asc",
          },
        ],
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
    questions: learningModule.questions.map((question) => ({
      ...localizeQuestionSummary(question, locale),
      primarySkill: localizeSkill(question.primarySkill, locale),
      module: localizeModule(question.module, locale),
    })),
  };
}

export async function getLocalizedQuestionCollections(
  locale: Locale = defaultLocale,
) {
  const collections = await prisma.questionCollection.findMany({
    where: {
      status: ContentStatus.PUBLISHED,
    },
    include: {
      translations: true,
      items: {
        where: {
          question: {
            status: ContentStatus.PUBLISHED,
            module: {
              status: ContentStatus.PUBLISHED,
            },
            primarySkill: {
              status: ContentStatus.PUBLISHED,
            },
          },
        },
        orderBy: {
          order: "asc",
        },
        include: {
          question: {
            include: {
              translations: true,
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
          },
        },
      },
    },
    orderBy: {
      order: "asc",
    },
  });

  return collections.map((collection) => ({
    ...localizeQuestionCollection(collection, locale),
    counts: {
      questions: collection.items.length,
    },
    previewQuestions: collection.items.slice(0, 3).map((item) => ({
      ...localizeQuestionSummary(item.question, locale),
      primarySkill: localizeSkill(item.question.primarySkill, locale),
      module: localizeModule(item.question.module, locale),
    })),
  }));
}

export async function getLocalizedQuestionCollectionBySlug(
  slug: string,
  locale: Locale = defaultLocale,
) {
  const collection = await prisma.questionCollection.findFirst({
    where: {
      slug,
      status: ContentStatus.PUBLISHED,
    },
    include: {
      translations: true,
      items: {
        where: {
          question: {
            status: ContentStatus.PUBLISHED,
            module: {
              status: ContentStatus.PUBLISHED,
            },
            primarySkill: {
              status: ContentStatus.PUBLISHED,
            },
          },
        },
        orderBy: {
          order: "asc",
        },
        include: {
          question: {
            include: {
              translations: true,
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
          },
        },
      },
    },
  });

  if (!collection) {
    return null;
  }

  return {
    ...localizeQuestionCollection(collection, locale),
    counts: {
      questions: collection.items.length,
    },
    questions: collection.items.map((item) => ({
      ...localizeQuestionSummary(item.question, locale),
      primarySkill: localizeSkill(item.question.primarySkill, locale),
      module: localizeModule(item.question.module, locale),
    })),
  };
}

async function getLocalizedRelatedQuestions(params: {
  questionId: string;
  moduleId: string;
  primarySkillId: string;
  locale: Locale;
  limit?: number;
}) {
  const limit = params.limit ?? 3;
  const relatedQuestionInclude = {
    translations: true,
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
  } satisfies Prisma.QuestionInclude;

  const sameSkillQuestions = await prisma.question.findMany({
    where: {
      id: {
        not: params.questionId,
      },
      status: ContentStatus.PUBLISHED,
      primarySkillId: params.primarySkillId,
      module: {
        status: ContentStatus.PUBLISHED,
      },
      primarySkill: {
        status: ContentStatus.PUBLISHED,
      },
    },
    include: relatedQuestionInclude,
    orderBy: [
      {
        difficulty: "asc",
      },
      {
        updatedAt: "desc",
      },
    ],
    take: limit,
  });

  const remainingSlots = Math.max(0, limit - sameSkillQuestions.length);
  const excludedIds = new Set([
    params.questionId,
    ...sameSkillQuestions.map((question) => question.id),
  ]);

  const sameModuleQuestions =
    remainingSlots > 0
      ? await prisma.question.findMany({
          where: {
            id: {
              notIn: Array.from(excludedIds),
            },
            status: ContentStatus.PUBLISHED,
            moduleId: params.moduleId,
            module: {
              status: ContentStatus.PUBLISHED,
            },
            primarySkill: {
              status: ContentStatus.PUBLISHED,
            },
          },
          include: relatedQuestionInclude,
          orderBy: [
            {
              difficulty: "asc",
            },
            {
              updatedAt: "desc",
            },
          ],
          take: remainingSlots,
        })
      : [];

  return [...sameSkillQuestions, ...sameModuleQuestions].map((question) => ({
    ...localizeQuestionSummary(question, params.locale),
    primarySkill: localizeSkill(question.primarySkill, params.locale),
    module: localizeModule(question.module, params.locale),
  }));
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
      collectionItems: {
        where: {
          collection: {
            status: ContentStatus.PUBLISHED,
          },
        },
        orderBy: [
          {
            collection: {
              order: "asc",
            },
          },
          {
            order: "asc",
          },
        ],
        include: {
          collection: {
            include: {
              translations: true,
              items: {
                where: {
                  question: {
                    status: ContentStatus.PUBLISHED,
                    module: {
                      status: ContentStatus.PUBLISHED,
                    },
                    primarySkill: {
                      status: ContentStatus.PUBLISHED,
                    },
                  },
                },
                orderBy: {
                  order: "asc",
                },
                include: {
                  question: {
                    select: {
                      id: true,
                      slug: true,
                      translations: {
                        select: {
                          locale: true,
                          prompt: true,
                        },
                      },
                    },
                  },
                },
              },
            },
          },
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

  const relatedQuestions = await getLocalizedRelatedQuestions({
    questionId: question.id,
    moduleId: question.moduleId,
    primarySkillId: question.primarySkillId,
    locale,
  });

  return {
    ...localizeQuestion(question, locale),
    primarySkill: localizeSkill(question.primarySkill, locale),
    module: localizeModule(question.module, locale),
    collections: question.collectionItems.map((item) =>
      localizeQuestionCollection(item.collection, locale),
    ),
    primaryCollectionJourney: buildPrimaryCollectionJourney(
      question.slug,
      question.collectionItems.map((item) => item.collection),
      locale,
    ),
    relatedQuestions,
  };
}
