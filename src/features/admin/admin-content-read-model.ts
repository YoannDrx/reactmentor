import {
  ContentLocale,
  ContentStatus,
  QuestionFormat,
  TranslationStatus,
} from "@prisma/client";
import type { Locale } from "@/i18n/config";
import { prisma } from "@/lib/prisma";

const editableQuestionFormats = [
  QuestionFormat.SINGLE_CHOICE,
  QuestionFormat.MULTIPLE_CHOICE,
  QuestionFormat.OPEN_ENDED,
  QuestionFormat.CODE_OUTPUT,
  QuestionFormat.BUG_HUNT,
] as const;
const millisecondsPerDay = 24 * 60 * 60 * 1000;
const freshnessReviewWindowDays = 120;

function isClosedQuestionFormat(format: QuestionFormat) {
  return (
    format === QuestionFormat.SINGLE_CHOICE ||
    format === QuestionFormat.MULTIPLE_CHOICE
  );
}

function normalizeStringList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is string => typeof item === "string");
}

function countStatuses(
  rows: Array<{
    status: ContentStatus;
    _count: {
      _all: number;
    };
  }>,
) {
  const summary = {
    total: 0,
    draft: 0,
    inReview: 0,
    published: 0,
    archived: 0,
  };

  for (const row of rows) {
    summary.total += row._count._all;

    if (row.status === ContentStatus.DRAFT) {
      summary.draft += row._count._all;
    }

    if (row.status === ContentStatus.IN_REVIEW) {
      summary.inReview += row._count._all;
    }

    if (row.status === ContentStatus.PUBLISHED) {
      summary.published += row._count._all;
    }

    if (row.status === ContentStatus.ARCHIVED) {
      summary.archived += row._count._all;
    }
  }

  return summary;
}

function countQuestionFormats(rows: Array<{ format: QuestionFormat }>) {
  return Object.values(QuestionFormat).map((format) => ({
    format,
    count: rows.filter((row) => row.format === format).length,
  }));
}

function toStatusCountRows(rows: Array<{ status: ContentStatus }>) {
  const counts = new Map<ContentStatus, number>();

  for (const row of rows) {
    counts.set(row.status, (counts.get(row.status) ?? 0) + 1);
  }

  return Array.from(counts.entries()).map(([status, count]) => ({
    status,
    _count: {
      _all: count,
    },
  }));
}

function getTranslationCompletion(
  translations: Array<{
    locale: ContentLocale;
  }>,
) {
  const hasFr = translations.some(
    (translation) => translation.locale === ContentLocale.FR,
  );
  const hasEn = translations.some(
    (translation) => translation.locale === ContentLocale.EN,
  );

  return {
    fr: hasFr,
    en: hasEn,
    isComplete: hasFr && hasEn,
  };
}

function getTranslationStatusMap(
  translations: Array<{
    locale: ContentLocale;
    status?: TranslationStatus;
  }>,
) {
  const frTranslation =
    translations.find((translation) => translation.locale === ContentLocale.FR) ??
    null;
  const enTranslation =
    translations.find((translation) => translation.locale === ContentLocale.EN) ??
    null;

  return {
    fr: frTranslation?.status ?? TranslationStatus.MISSING,
    en: enTranslation?.status ?? TranslationStatus.MISSING,
  };
}

function pickTranslation<
  TTranslation extends {
    locale: ContentLocale;
  },
>(translations: TTranslation[], locale: Locale) {
  const primaryLocale = locale === "fr" ? ContentLocale.FR : ContentLocale.EN;
  const fallbackLocale = locale === "fr" ? ContentLocale.EN : ContentLocale.FR;

  return (
    translations.find((translation) => translation.locale === primaryLocale) ??
    translations.find((translation) => translation.locale === fallbackLocale) ??
    translations[0] ??
    null
  );
}

function hasText(value: string | null | undefined) {
  return typeof value === "string" && value.trim().length > 0;
}

function toTextareaValue(value: string | null | undefined) {
  return value ?? "";
}

function toTakeawaysTextareaValue(value: unknown) {
  return normalizeStringList(value).join("\n");
}

function toOptionTextareaValue(
  options: Array<{
    translations: Array<{
      locale: ContentLocale;
      label?: string | null;
      explanation?: string | null;
    }>;
  }>,
  locale: ContentLocale,
  field: "label" | "explanation",
) {
  return options
    .map((option) => {
      const translation =
        option.translations.find((item) => item.locale === locale) ?? null;
      const value = translation?.[field];

      return typeof value === "string" ? value : "";
    })
    .join("\n");
}

function toCorrectOptionIndexesValue(
  options: Array<{
    order: number;
    isCorrect: boolean;
  }>,
) {
  return options
    .filter((option) => option.isCorrect)
    .map((option) => option.order)
    .join(", ");
}

function toSortedSlugList(values: string[]) {
  return [...values].sort((left, right) => left.localeCompare(right));
}

function normalizePromptKey(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function buildQuestionChecklist(question: {
  format: QuestionFormat;
  translations: Array<{
    locale: ContentLocale;
    prompt?: string;
    explanation?: string;
    takeaways?: unknown;
  }>;
  options?: Array<{
    isCorrect: boolean;
    translations: Array<{
      locale: ContentLocale;
      label?: string | null;
      explanation?: string | null;
    }>;
  }>;
}) {
  const frTranslation =
    question.translations.find(
      (translation) => translation.locale === ContentLocale.FR,
    ) ?? null;
  const enTranslation =
    question.translations.find(
      (translation) => translation.locale === ContentLocale.EN,
    ) ?? null;
  const issues: Array<
    | "missingFrCore"
    | "missingEnCore"
    | "missingFrTakeaways"
    | "missingEnTakeaways"
    | "missingClosedOptions"
    | "missingClosedCorrectOption"
    | "missingClosedDistractors"
    | "missingClosedFrOptions"
    | "missingClosedEnOptions"
  > = [];

  if (
    !frTranslation ||
    !hasText(frTranslation.prompt) ||
    !hasText(frTranslation.explanation)
  ) {
    issues.push("missingFrCore");
  }

  if (
    !enTranslation ||
    !hasText(enTranslation.prompt) ||
    !hasText(enTranslation.explanation)
  ) {
    issues.push("missingEnCore");
  }

  if (
    !frTranslation ||
    normalizeStringList(frTranslation.takeaways).length === 0
  ) {
    issues.push("missingFrTakeaways");
  }

  if (
    !enTranslation ||
    normalizeStringList(enTranslation.takeaways).length === 0
  ) {
    issues.push("missingEnTakeaways");
  }

  if (isClosedQuestionFormat(question.format)) {
    const options = question.options ?? [];
    const correctCount = options.filter((option) => option.isCorrect).length;
    const incorrectCount = options.length - correctCount;

    if (options.length < 2) {
      issues.push("missingClosedOptions");
    }

    if (
      correctCount === 0 ||
      (question.format === QuestionFormat.SINGLE_CHOICE && correctCount !== 1)
    ) {
      issues.push("missingClosedCorrectOption");
    }

    if (incorrectCount === 0) {
      issues.push("missingClosedDistractors");
    }

    const hasFrOptionGaps = options.some((option) => {
      const translation =
        option.translations.find((item) => item.locale === ContentLocale.FR) ??
        null;

      return !translation || !hasText(translation.label) || !hasText(translation.explanation);
    });
    const hasEnOptionGaps = options.some((option) => {
      const translation =
        option.translations.find((item) => item.locale === ContentLocale.EN) ??
        null;

      return !translation || !hasText(translation.label) || !hasText(translation.explanation);
    });

    if (hasFrOptionGaps) {
      issues.push("missingClosedFrOptions");
    }

    if (hasEnOptionGaps) {
      issues.push("missingClosedEnOptions");
    }
  }

  return {
    issues,
    isPublishable: issues.length === 0,
  };
}

export async function getAdminContentReadModel(
  locale: Locale,
  filters?: {
    questionStatus?: ContentStatus | null;
    questionFormat?: QuestionFormat | null;
  },
) {
  const now = new Date();
  const [
    modules,
    skills,
    pitfallTags,
    latestQuestions,
    questionChecklistRows,
  ] = await Promise.all([
    prisma.learningModule.findMany({
      include: {
        translations: true,
        _count: {
          select: {
            skills: true,
            questions: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),
    prisma.skill.findMany({
      include: {
        translations: true,
        module: {
          include: {
            translations: true,
          },
        },
        _count: {
          select: {
            questionsPrimary: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),
    prisma.pitfallTag.findMany({
      include: {
        _count: {
          select: {
            questionLinks: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
    }),
    prisma.question.findMany({
      where: {
        ...(filters?.questionStatus
          ? {
              status: filters.questionStatus,
            }
          : {}),
        ...(filters?.questionFormat
          ? {
              format: filters.questionFormat,
            }
          : {}),
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
        pitfallLinks: {
          include: {
            pitfallTag: true,
          },
        },
        module: {
          include: {
            translations: true,
          },
        },
        primarySkill: {
          include: {
            translations: true,
          },
        },
        _count: {
          select: {
            attempts: true,
          },
        },
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 12,
    }),
    prisma.question.findMany({
      select: {
        id: true,
        slug: true,
        status: true,
        format: true,
        sourceType: true,
        updatedAt: true,
        translations: {
          select: {
            locale: true,
            prompt: true,
            explanation: true,
            takeaways: true,
          },
        },
        module: {
          select: {
            slug: true,
            title: true,
            translations: {
              select: {
                locale: true,
                title: true,
              },
            },
          },
        },
        options: {
          select: {
            isCorrect: true,
            translations: {
              select: {
                locale: true,
                label: true,
                explanation: true,
              },
            },
          },
        },
        _count: {
          select: {
            pitfallLinks: true,
          },
        },
      },
    }),
    ]);

  const moduleStatusRows = toStatusCountRows(modules);
  const skillStatusRows = toStatusCountRows(skills);
  const questionStatusRows = toStatusCountRows(questionChecklistRows);
  const moduleSummary = countStatuses(moduleStatusRows);
  const skillSummary = countStatuses(skillStatusRows);
  const questionSummary = countStatuses(questionStatusRows);
  const publishableQuestionCount = questionChecklistRows.filter((question) =>
    buildQuestionChecklist(question).isPublishable,
  ).length;
  const translationGapCount =
    questionChecklistRows.length - publishableQuestionCount;
  const untaggedQuestionCount = questionChecklistRows.filter(
    (question) => question._count.pitfallLinks === 0,
  ).length;
  const thinModuleCandidates = modules
    .filter((module) => module._count.questions < 3 || module._count.skills < 2)
    .map((module) => ({
      id: module.id,
      slug: module.slug,
      title:
        pickTranslation(module.translations, locale)?.title ??
        module.title ??
        module.slug,
      skillCount: module._count.skills,
      questionCount: module._count.questions,
    }));
  const coverageByTrack = Object.values(
    modules.reduce<
      Record<
        string,
        {
          track: (typeof modules)[number]["track"];
          modules: number;
          questions: number;
        }
      >
    >((summary, module) => {
      const currentSummary = summary[module.track] ?? {
        track: module.track,
        modules: 0,
        questions: 0,
      };

      currentSummary.modules += 1;
      currentSummary.questions += module._count.questions;
      summary[module.track] = currentSummary;

      return summary;
    }, {}),
  );
  const coverageByFormat = countQuestionFormats(questionChecklistRows);
  const stalePublishedQuestions = questionChecklistRows
    .filter(
      (question) =>
        question.status === ContentStatus.PUBLISHED &&
        now.getTime() - question.updatedAt.getTime() >=
          freshnessReviewWindowDays * millisecondsPerDay,
    )
    .map((question) => {
      const checklist = buildQuestionChecklist(question);
      const localizedTranslation = pickTranslation(question.translations, locale);
      const localizedModule = pickTranslation(question.module.translations, locale);

      return {
        id: question.id,
        slug: question.slug,
        prompt: localizedTranslation?.prompt ?? question.slug,
        moduleTitle:
          localizedModule?.title ?? question.module.title ?? question.module.slug,
        updatedAt: question.updatedAt,
        ageInDays: Math.floor(
          (now.getTime() - question.updatedAt.getTime()) / millisecondsPerDay,
        ),
        sourceType: question.sourceType ?? null,
        issueCount: checklist.issues.length,
      };
    })
    .sort((left, right) => right.ageInDays - left.ageInDays);
  const duplicatePromptGroups = new Map<
    string,
    Array<{
      id: string;
      slug: string;
      prompt: string;
      moduleTitle: string;
    }>
  >();

  for (const question of questionChecklistRows) {
    const localizedTranslation = pickTranslation(question.translations, locale);
    const localizedModule = pickTranslation(question.module.translations, locale);
    const moduleTitle =
      localizedModule?.title ?? question.module.title ?? question.module.slug;
    const localizedPrompt = localizedTranslation?.prompt ?? null;

    if (!hasText(localizedPrompt)) {
      continue;
    }

    const promptKey = normalizePromptKey(localizedPrompt);

    if (!promptKey) {
      continue;
    }

    const currentGroup = duplicatePromptGroups.get(promptKey) ?? [];

    currentGroup.push({
      id: question.id,
      slug: question.slug,
      prompt: localizedPrompt,
      moduleTitle,
    });
    duplicatePromptGroups.set(promptKey, currentGroup);
  }

  const duplicatePromptCandidates = Array.from(duplicatePromptGroups.entries())
    .map(([promptKey, items]) => {
      const uniqueItems = Array.from(
        new Map(items.map((item) => [item.id, item])).values(),
      );

      if (uniqueItems.length < 2) {
        return null;
      }

      return {
        promptKey,
        prompt: uniqueItems[0]?.prompt ?? promptKey,
        questionCount: uniqueItems.length,
        questions: uniqueItems.sort((left, right) =>
          left.moduleTitle.localeCompare(right.moduleTitle),
        ),
      };
    })
    .filter((group): group is NonNullable<typeof group> => group !== null)
    .sort((left, right) => {
      if (right.questionCount !== left.questionCount) {
        return right.questionCount - left.questionCount;
      }

      return left.prompt.localeCompare(right.prompt);
    });
  const sections = {
    modules: modules.slice(0, 8).map((module) => ({
      id: module.id,
      slug: module.slug,
      title:
        pickTranslation(module.translations, locale)?.title ??
        module.title ??
        module.slug,
      track: module.track,
      level: module.level,
      order: module.order,
      status: module.status,
      translations: getTranslationCompletion(module.translations),
      translationStatus: getTranslationStatusMap(module.translations),
      titleFr:
        module.translations.find(
          (translation) => translation.locale === ContentLocale.FR,
        )?.title ?? "",
      descriptionFr:
        module.translations.find(
          (translation) => translation.locale === ContentLocale.FR,
        )?.description ?? "",
      summaryFr: toTextareaValue(
        module.translations.find(
          (translation) => translation.locale === ContentLocale.FR,
        )?.summary,
      ),
      titleEn:
        module.translations.find(
          (translation) => translation.locale === ContentLocale.EN,
        )?.title ??
        module.title ??
        "",
      descriptionEn:
        module.translations.find(
          (translation) => translation.locale === ContentLocale.EN,
        )?.description ??
        module.description ??
        "",
      summaryEn: toTextareaValue(
        module.translations.find(
          (translation) => translation.locale === ContentLocale.EN,
        )?.summary ?? module.summary,
      ),
      questionCount: module._count.questions,
      skillCount: module._count.skills,
      updatedAt: module.updatedAt,
    })),
    skills: skills.slice(0, 10).map((skill) => ({
      id: skill.id,
      slug: skill.slug,
      title:
        pickTranslation(skill.translations, locale)?.title ??
        skill.title ??
        skill.slug,
      moduleTitle:
        pickTranslation(skill.module.translations, locale)?.title ??
        skill.module.title ??
        skill.module.slug,
      moduleId: skill.moduleId,
      status: skill.status,
      translations: getTranslationCompletion(skill.translations),
      translationStatus: getTranslationStatusMap(skill.translations),
      titleFr:
        skill.translations.find(
          (translation) => translation.locale === ContentLocale.FR,
        )?.title ?? "",
      descriptionFr:
        skill.translations.find(
          (translation) => translation.locale === ContentLocale.FR,
        )?.description ?? "",
      titleEn:
        skill.translations.find(
          (translation) => translation.locale === ContentLocale.EN,
        )?.title ??
        skill.title ??
        "",
      descriptionEn:
        skill.translations.find(
          (translation) => translation.locale === ContentLocale.EN,
        )?.description ??
        skill.description ??
        "",
      questionCount: skill._count.questionsPrimary,
      updatedAt: skill.updatedAt,
    })),
    questions: latestQuestions.map((question) => ({
      id: question.id,
      slug: question.slug,
      prompt:
        pickTranslation(question.translations, locale)?.prompt ??
        question.prompt ??
        question.slug,
      skillTitle:
        pickTranslation(question.primarySkill.translations, locale)?.title ??
        question.primarySkill.title ??
        question.primarySkill.slug,
      moduleTitle:
        pickTranslation(question.module.translations, locale)?.title ??
        question.module.title ??
        question.module.slug,
      format: question.format,
      difficulty: question.difficulty,
      status: question.status,
      translations: getTranslationCompletion(question.translations),
      updatedAt: question.updatedAt,
    })),
  };

  return {
    editableQuestionFormats,
    activeFilters: {
      questionStatus: filters?.questionStatus ?? null,
      questionFormat: filters?.questionFormat ?? null,
    },
    summary: {
      modules: moduleSummary,
      skills: skillSummary,
      questions: questionSummary,
    },
    sections,
    stats: {
      modules: {
        total: moduleSummary.total,
        published: moduleSummary.published,
      },
      skills: {
        total: skillSummary.total,
        published: skillSummary.published,
      },
      questions: {
        total: questionSummary.total,
        published: questionSummary.published,
        publishable: publishableQuestionCount,
        translationGaps: translationGapCount,
      },
    },
    quality: {
      translationGapQuestions: translationGapCount,
      untaggedQuestions: untaggedQuestionCount,
      thinModules: thinModuleCandidates,
      coverageByTrack,
      coverageByFormat,
      freshnessReviewWindowDays,
      stalePublishedQuestions,
      duplicatePromptCandidates,
    },
    moduleOptions: modules.map((module) => ({
      id: module.id,
      title:
        pickTranslation(module.translations, locale)?.title ??
        module.title ??
        module.slug,
    })),
    skillOptions: skills.map((skill) => ({
      id: skill.id,
      moduleId: skill.moduleId,
      title:
        pickTranslation(skill.translations, locale)?.title ??
        skill.title ??
        skill.slug,
      moduleTitle:
        pickTranslation(skill.module.translations, locale)?.title ??
        skill.module.title ??
        skill.module.slug,
    })),
    pitfallTagOptions: toSortedSlugList(
      pitfallTags.map((pitfallTag) => pitfallTag.slug),
    ).map((slug) => {
      const pitfallTag =
        pitfallTags.find((item) => item.slug === slug) ?? null;

      return {
        slug,
        title: pitfallTag?.title ?? slug,
        description: pitfallTag?.description ?? "",
      };
    }),
    modules: sections.modules,
    skills: sections.skills,
    pitfallTags: pitfallTags.map((pitfallTag) => ({
      id: pitfallTag.id,
      slug: pitfallTag.slug,
      title: pitfallTag.title,
      description: pitfallTag.description,
      questionCount: pitfallTag._count.questionLinks,
      updatedAt: pitfallTag.updatedAt,
    })),
    questions: latestQuestions.map((question) => {
      const localizedTranslation = pickTranslation(question.translations, locale);
      const frTranslation =
        question.translations.find(
          (translation) => translation.locale === ContentLocale.FR,
        ) ?? null;
      const enTranslation =
        question.translations.find(
          (translation) => translation.locale === ContentLocale.EN,
        ) ?? null;
      const attemptsCount = question._count?.attempts ?? 0;
      const options = question.options ?? [];
      const pitfallTagSlugs = toSortedSlugList(
        question.pitfallLinks.map((link) => link.pitfallTag.slug),
      );
      const pitfallTagTitles = pitfallTagSlugs.map((slug) => {
        const pitfallTag =
          question.pitfallLinks.find((link) => link.pitfallTag.slug === slug) ??
          null;

        return pitfallTag?.pitfallTag.title ?? slug;
      });

      return {
        id: question.id,
        slug: question.slug,
        prompt:
          localizedTranslation?.prompt ?? question.prompt ?? question.slug,
        status: question.status,
        format: question.format,
        level: question.level,
        difficulty: question.difficulty,
        sourceType: question.sourceType,
        moduleTitle:
          pickTranslation(question.module.translations, locale)?.title ??
          question.module.title ??
          question.module.slug,
        skillTitle:
          pickTranslation(question.primarySkill.translations, locale)?.title ??
          question.primarySkill.title ??
          question.primarySkill.slug,
      translationStatus: {
          fr: frTranslation?.status ?? TranslationStatus.MISSING,
          en: enTranslation?.status ?? TranslationStatus.MISSING,
        },
        moduleId: question.moduleId,
        primarySkillId: question.primarySkillId,
        estimatedTimeSec: question.estimatedTimeSec,
        attemptsCount,
        canEditOptions: attemptsCount === 0,
        optionsCount: options.length,
        pitfallTagSlugs,
        pitfallTagTitles,
        correctOptionIndexes: toCorrectOptionIndexesValue(options),
        optionLabelsFr: toOptionTextareaValue(
          options,
          ContentLocale.FR,
          "label",
        ),
        optionExplanationsFr: toOptionTextareaValue(
          options,
          ContentLocale.FR,
          "explanation",
        ),
        optionLabelsEn: toOptionTextareaValue(
          options,
          ContentLocale.EN,
          "label",
        ),
        optionExplanationsEn: toOptionTextareaValue(
          options,
          ContentLocale.EN,
          "explanation",
        ),
        promptFr: toTextareaValue(frTranslation?.prompt),
        explanationFr: toTextareaValue(frTranslation?.explanation),
        takeawaysFr: toTakeawaysTextareaValue(frTranslation?.takeaways),
        promptEn: toTextareaValue(enTranslation?.prompt ?? question.prompt),
        explanationEn: toTextareaValue(
          enTranslation?.explanation ?? question.explanation,
        ),
        takeawaysEn: toTakeawaysTextareaValue(
          enTranslation?.takeaways ?? question.takeaways,
        ),
        checklist: buildQuestionChecklist(question),
      };
    }),
  };
}

export type AdminContentReadModel = Awaited<
  ReturnType<typeof getAdminContentReadModel>
>;
