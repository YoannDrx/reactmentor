import {
  ContentStatus,
  ContentLocale,
  Prisma,
  QuestionFormat,
  QuestionLevel,
  Track,
  TranslationStatus,
} from "@prisma/client";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { parseQuestionContextData } from "@/lib/question-context";

const moduleTranslationSchema = z.object({
  status: z.nativeEnum(TranslationStatus).default(TranslationStatus.READY),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
  summary: z.string().trim().nullable().optional(),
});

const skillTranslationSchema = z.object({
  status: z.nativeEnum(TranslationStatus).default(TranslationStatus.READY),
  title: z.string().trim().min(1),
  description: z.string().trim().min(1),
});

const questionTranslationSchema = z.object({
  status: z.nativeEnum(TranslationStatus).default(TranslationStatus.READY),
  prompt: z.string().trim().min(1),
  explanation: z.string().trim().min(1),
  takeaways: z.array(z.string()).nullable().optional(),
  tlDr: z.string().trim().nullable().optional(),
  shortAnswer: z.string().trim().nullable().optional(),
  lessonBody: z.string().trim().nullable().optional(),
  commonMistakes: z.array(z.string()).nullable().optional(),
  exampleTitle: z.string().trim().nullable().optional(),
  exampleCode: z.string().nullable().optional(),
  exampleLanguage: z.string().trim().nullable().optional(),
  exampleExplanation: z.string().trim().nullable().optional(),
  estimatedReadMinutes: z.number().int().min(0).nullable().optional(),
  contextData: z.unknown().nullable().optional(),
  interviewSignal: z.string().trim().nullable().optional(),
  verbalizePoints: z.array(z.string()).nullable().optional(),
});

const optionTranslationSchema = z.object({
  status: z.nativeEnum(TranslationStatus).default(TranslationStatus.READY),
  label: z.string().trim().min(1),
  explanation: z.string().trim().min(1),
});

const localePair = <TSchema extends z.ZodTypeAny>(schema: TSchema) =>
  z.object({
    fr: schema.nullable().optional(),
    en: schema.nullable().optional(),
  });

const adminContentImportSchema = z.object({
  version: z.literal(1),
  generatedAt: z.string().datetime().optional(),
  modules: z.array(
    z.object({
      slug: z.string().trim().min(1),
      track: z.nativeEnum(Track),
      level: z.nativeEnum(QuestionLevel),
      order: z.number().int().min(0),
      status: z.nativeEnum(ContentStatus),
      translations: localePair(moduleTranslationSchema),
    }),
  ),
  skills: z.array(
    z.object({
      slug: z.string().trim().min(1),
      moduleSlug: z.string().trim().min(1),
      status: z.nativeEnum(ContentStatus),
      translations: localePair(skillTranslationSchema),
    }),
  ),
  pitfallTags: z
    .array(
      z.object({
        slug: z.string().trim().min(1),
        title: z.string().trim().min(1),
        description: z.string().trim().min(1),
      }),
    )
    .default([]),
  questions: z.array(
    z.object({
      slug: z.string().trim().min(1),
      moduleSlug: z.string().trim().min(1),
      primarySkillSlug: z.string().trim().min(1),
      format: z.nativeEnum(QuestionFormat),
      level: z.nativeEnum(QuestionLevel),
      difficulty: z.number().int().min(1).max(5),
      estimatedTimeSec: z.number().int().min(0).nullable().optional(),
      sourceType: z.string().trim().max(120).nullable().optional(),
      version: z.number().int().min(1),
      status: z.nativeEnum(ContentStatus),
      pitfallTagSlugs: z.array(z.string().trim().min(1)).default([]),
      translations: localePair(questionTranslationSchema),
      options: z.array(
        z.object({
          order: z.number().int().min(1),
          isCorrect: z.boolean(),
          translations: localePair(optionTranslationSchema),
        }),
      ),
    }),
  ),
});

type AdminContentImportPayload = z.infer<typeof adminContentImportSchema>;
type AdminImportTransaction = Prisma.TransactionClient;

type ComparableOptionSnapshot = Array<{
  order: number;
  isCorrect: boolean;
  fr: {
    label: string | null;
    explanation: string | null;
  } | null;
  en: {
    label: string | null;
    explanation: string | null;
  } | null;
}>;

function isClosedQuestionFormat(format: QuestionFormat) {
  return (
    format === QuestionFormat.SINGLE_CHOICE ||
    format === QuestionFormat.MULTIPLE_CHOICE
  );
}

function toNullableJson(value: unknown) {
  return value == null ? Prisma.JsonNull : (value as Prisma.InputJsonValue);
}

function getFallbackTranslation<
  TTranslation extends Record<string, unknown>,
>(translations: { fr?: TTranslation | null; en?: TTranslation | null }) {
  return translations.en ?? translations.fr ?? null;
}

function normalizeStringArray(value: string[] | null | undefined) {
  return value ?? [];
}

function assertUniqueSlugs(label: string, slugs: string[]) {
  const uniqueSlugs = new Set(slugs);

  if (uniqueSlugs.size !== slugs.length) {
    throw new Error(`Duplicate ${label} slugs found in import payload.`);
  }
}

function normalizeImportedOptions(
  options: AdminContentImportPayload["questions"][number]["options"],
): ComparableOptionSnapshot {
  return [...options]
    .sort((left, right) => left.order - right.order)
    .map((option, index) => ({
      order: index + 1,
      isCorrect: option.isCorrect,
      fr: option.translations.fr
        ? {
            label: option.translations.fr.label,
            explanation: option.translations.fr.explanation,
          }
        : null,
      en: option.translations.en
        ? {
            label: option.translations.en.label,
            explanation: option.translations.en.explanation,
          }
        : null,
    }));
}

function normalizeExistingOptions(
  options: Array<{
    order: number;
    isCorrect: boolean;
    translations: Array<{
      locale: ContentLocale;
      label: string;
      explanation: string;
    }>;
  }>,
): ComparableOptionSnapshot {
  return [...options]
    .sort((left, right) => left.order - right.order)
    .map((option, index) => {
      const frTranslation =
        option.translations.find((translation) => translation.locale === ContentLocale.FR) ??
        null;
      const enTranslation =
        option.translations.find((translation) => translation.locale === ContentLocale.EN) ??
        null;

      return {
        order: index + 1,
        isCorrect: option.isCorrect,
        fr: frTranslation
          ? {
              label: frTranslation.label,
              explanation: frTranslation.explanation,
            }
          : null,
        en: enTranslation
          ? {
              label: enTranslation.label,
              explanation: enTranslation.explanation,
            }
          : null,
      };
    });
}

function buildImportedBugHuntContextSnapshot(
  translations: AdminContentImportPayload["questions"][number]["translations"],
) {
  return {
    fr: parseQuestionContextData(translations.fr?.contextData ?? null),
    en: parseQuestionContextData(translations.en?.contextData ?? null),
  };
}

function buildExistingBugHuntContextSnapshot(
  translations: Array<{
    locale: ContentLocale;
    contextData: Prisma.JsonValue | null;
  }>,
) {
  return {
    fr: parseQuestionContextData(
      translations.find((translation) => translation.locale === ContentLocale.FR)
        ?.contextData ?? null,
    ),
    en: parseQuestionContextData(
      translations.find((translation) => translation.locale === ContentLocale.EN)
        ?.contextData ?? null,
    ),
  };
}

async function resolveModuleIdBySlug(
  tx: AdminImportTransaction,
  moduleIdsBySlug: Map<string, string>,
  slug: string,
) {
  const cachedModuleId = moduleIdsBySlug.get(slug);

  if (cachedModuleId) {
    return cachedModuleId;
  }

  const learningModule = await tx.learningModule.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
    },
  });

  if (!learningModule) {
    throw new Error(`Unknown module slug in import payload: ${slug}`);
  }

  moduleIdsBySlug.set(slug, learningModule.id);

  return learningModule.id;
}

async function resolveSkillBySlug(
  tx: AdminImportTransaction,
  skillBySlug: Map<string, { id: string; moduleId: string }>,
  slug: string,
) {
  const cachedSkill = skillBySlug.get(slug);

  if (cachedSkill) {
    return cachedSkill;
  }

  const skill = await tx.skill.findUnique({
    where: {
      slug,
    },
    select: {
      id: true,
      moduleId: true,
    },
  });

  if (!skill) {
    throw new Error(`Unknown skill slug in import payload: ${slug}`);
  }

  const resolvedSkill = {
    id: skill.id,
    moduleId: skill.moduleId,
  };

  skillBySlug.set(slug, resolvedSkill);

  return resolvedSkill;
}

async function syncQuestionPitfallTags(
  tx: AdminImportTransaction,
  questionId: string,
  pitfallTagSlugs: string[],
) {
  const normalizedPitfallTagSlugs = Array.from(new Set(pitfallTagSlugs)).sort(
    (left, right) => left.localeCompare(right),
  );

  const pitfallTags = await tx.pitfallTag.findMany({
    where: {
      slug: {
        in: normalizedPitfallTagSlugs,
      },
    },
    select: {
      id: true,
      slug: true,
    },
  });

  if (pitfallTags.length !== normalizedPitfallTagSlugs.length) {
    throw new Error("Import payload references unknown pitfall tags.");
  }

  await tx.questionPitfallTag.deleteMany({
    where: {
      questionId,
    },
  });

  if (pitfallTags.length === 0) {
    return;
  }

  await tx.questionPitfallTag.createMany({
    data: pitfallTags.map((pitfallTag) => ({
      questionId,
      pitfallTagId: pitfallTag.id,
    })),
    skipDuplicates: true,
  });
}

async function upsertModuleTranslations(
  tx: AdminImportTransaction,
  moduleId: string,
  translations: AdminContentImportPayload["modules"][number]["translations"],
) {
  await Promise.all(
    [translations.fr, translations.en].flatMap((translation, index) => {
      if (!translation) {
        return [];
      }

      const locale = index === 0 ? ContentLocale.FR : ContentLocale.EN;

      return [
        tx.learningModuleTranslation.upsert({
          where: {
            moduleId_locale: {
              moduleId,
              locale,
            },
          },
          create: {
            moduleId,
            locale,
            status: translation.status,
            title: translation.title,
            description: translation.description,
            summary: translation.summary ?? null,
          },
          update: {
            status: translation.status,
            title: translation.title,
            description: translation.description,
            summary: translation.summary ?? null,
          },
        }),
      ];
    }),
  );
}

async function upsertSkillTranslations(
  tx: AdminImportTransaction,
  skillId: string,
  translations: AdminContentImportPayload["skills"][number]["translations"],
) {
  await Promise.all(
    [translations.fr, translations.en].flatMap((translation, index) => {
      if (!translation) {
        return [];
      }

      const locale = index === 0 ? ContentLocale.FR : ContentLocale.EN;

      return [
        tx.skillTranslation.upsert({
          where: {
            skillId_locale: {
              skillId,
              locale,
            },
          },
          create: {
            skillId,
            locale,
            status: translation.status,
            title: translation.title,
            description: translation.description,
          },
          update: {
            status: translation.status,
            title: translation.title,
            description: translation.description,
          },
        }),
      ];
    }),
  );
}

async function upsertQuestionTranslations(
  tx: AdminImportTransaction,
  questionId: string,
  translations: AdminContentImportPayload["questions"][number]["translations"],
) {
  await Promise.all(
    [translations.fr, translations.en].flatMap((translation, index) => {
      if (!translation) {
        return [];
      }

      const locale = index === 0 ? ContentLocale.FR : ContentLocale.EN;

      return [
        tx.questionTranslation.upsert({
          where: {
            questionId_locale: {
              questionId,
              locale,
            },
          },
          create: {
            questionId,
            locale,
            status: translation.status,
            prompt: translation.prompt,
            explanation: translation.explanation,
            takeaways: toNullableJson(normalizeStringArray(translation.takeaways)),
            tlDr: translation.tlDr ?? null,
            shortAnswer: translation.shortAnswer ?? null,
            lessonBody: translation.lessonBody ?? null,
            commonMistakes: toNullableJson(
              normalizeStringArray(translation.commonMistakes),
            ),
            exampleTitle: translation.exampleTitle ?? null,
            exampleCode: translation.exampleCode ?? null,
            exampleLanguage: translation.exampleLanguage ?? null,
            exampleExplanation: translation.exampleExplanation ?? null,
            estimatedReadMinutes: translation.estimatedReadMinutes ?? null,
            contextData: toNullableJson(translation.contextData),
            interviewSignal: translation.interviewSignal ?? null,
            verbalizePoints: toNullableJson(
              normalizeStringArray(translation.verbalizePoints),
            ),
          },
          update: {
            status: translation.status,
            prompt: translation.prompt,
            explanation: translation.explanation,
            takeaways: toNullableJson(normalizeStringArray(translation.takeaways)),
            tlDr: translation.tlDr ?? null,
            shortAnswer: translation.shortAnswer ?? null,
            lessonBody: translation.lessonBody ?? null,
            commonMistakes: toNullableJson(
              normalizeStringArray(translation.commonMistakes),
            ),
            exampleTitle: translation.exampleTitle ?? null,
            exampleCode: translation.exampleCode ?? null,
            exampleLanguage: translation.exampleLanguage ?? null,
            exampleExplanation: translation.exampleExplanation ?? null,
            estimatedReadMinutes: translation.estimatedReadMinutes ?? null,
            contextData: toNullableJson(translation.contextData),
            interviewSignal: translation.interviewSignal ?? null,
            verbalizePoints: toNullableJson(
              normalizeStringArray(translation.verbalizePoints),
            ),
          },
        }),
      ];
    }),
  );
}

async function recreateQuestionOptions(
  tx: AdminImportTransaction,
  questionId: string,
  options: AdminContentImportPayload["questions"][number]["options"],
) {
  const normalizedOptions = normalizeImportedOptions(options);

  await tx.questionOption.deleteMany({
    where: {
      questionId,
    },
  });

  for (const option of normalizedOptions) {
    const fallbackTranslation = option.en ?? option.fr;

    const createdOption = await tx.questionOption.create({
      data: {
        questionId,
        order: option.order,
        isCorrect: option.isCorrect,
        label: fallbackTranslation?.label ?? null,
        explanation: fallbackTranslation?.explanation ?? null,
        translations: {
          create: [
            ...(option.fr
              ? [
                  {
                    locale: ContentLocale.FR,
                    status: TranslationStatus.READY,
                    label: option.fr.label ?? "",
                    explanation: option.fr.explanation ?? "",
                  },
                ]
              : []),
            ...(option.en
              ? [
                  {
                    locale: ContentLocale.EN,
                    status: TranslationStatus.READY,
                    label: option.en.label ?? "",
                    explanation: option.en.explanation ?? "",
                  },
                ]
              : []),
          ],
        },
      },
    });

    if (option.fr) {
      await tx.questionOptionTranslation.upsert({
        where: {
          optionId_locale: {
            optionId: createdOption.id,
            locale: ContentLocale.FR,
          },
        },
        create: {
          optionId: createdOption.id,
          locale: ContentLocale.FR,
          status: TranslationStatus.READY,
          label: option.fr.label ?? "",
          explanation: option.fr.explanation ?? "",
        },
        update: {
          status: TranslationStatus.READY,
          label: option.fr.label ?? "",
          explanation: option.fr.explanation ?? "",
        },
      });
    }

    if (option.en) {
      await tx.questionOptionTranslation.upsert({
        where: {
          optionId_locale: {
            optionId: createdOption.id,
            locale: ContentLocale.EN,
          },
        },
        create: {
          optionId: createdOption.id,
          locale: ContentLocale.EN,
          status: TranslationStatus.READY,
          label: option.en.label ?? "",
          explanation: option.en.explanation ?? "",
        },
        update: {
          status: TranslationStatus.READY,
          label: option.en.label ?? "",
          explanation: option.en.explanation ?? "",
        },
      });
    }
  }
}

export function parseAdminContentImportPayload(rawPayload: string) {
  const payload = adminContentImportSchema.parse(JSON.parse(rawPayload));

  assertUniqueSlugs(
    "module",
    payload.modules.map((module) => module.slug),
  );
  assertUniqueSlugs(
    "skill",
    payload.skills.map((skill) => skill.slug),
  );
  assertUniqueSlugs(
    "pitfall tag",
    payload.pitfallTags.map((pitfallTag) => pitfallTag.slug),
  );
  assertUniqueSlugs(
    "question",
    payload.questions.map((question) => question.slug),
  );

  for (const question of payload.questions) {
    if (!isClosedQuestionFormat(question.format) && question.options.length > 0) {
      throw new Error(
        `Question ${question.slug} cannot import options for format ${question.format}.`,
      );
    }

    if (question.format === QuestionFormat.BUG_HUNT) {
      const translations = [question.translations.fr, question.translations.en].filter(
        (translation): translation is NonNullable<typeof translation> => Boolean(translation),
      );
      const hasValidContext = translations.some(
        (translation) =>
          parseQuestionContextData(translation.contextData ?? null) !== null,
      );

      if (!hasValidContext) {
        throw new Error(
          `Question ${question.slug} requires valid bug-hunt context data.`,
        );
      }
    }
  }

  return payload;
}

export async function importAdminContentPayload(rawPayload: string) {
  const payload = parseAdminContentImportPayload(rawPayload);

  return prisma.$transaction(async (tx) => {
    const moduleIdsBySlug = new Map<string, string>();
    const skillBySlug = new Map<string, { id: string; moduleId: string }>();

    for (const pitfallTag of payload.pitfallTags) {
      await tx.pitfallTag.upsert({
        where: {
          slug: pitfallTag.slug,
        },
        create: pitfallTag,
        update: {
          title: pitfallTag.title,
          description: pitfallTag.description,
        },
      });
    }

    for (const learningModule of payload.modules) {
      const fallbackTranslation = getFallbackTranslation(
        learningModule.translations,
      );

      if (!fallbackTranslation) {
        throw new Error(
          `Module ${learningModule.slug} is missing both FR and EN translations.`,
        );
      }

      const savedModule = await tx.learningModule.upsert({
        where: {
          slug: learningModule.slug,
        },
        create: {
          slug: learningModule.slug,
          track: learningModule.track,
          level: learningModule.level,
          order: learningModule.order,
          status: learningModule.status,
          title: fallbackTranslation.title,
          description: fallbackTranslation.description,
          summary: fallbackTranslation.summary ?? null,
        },
        update: {
          track: learningModule.track,
          level: learningModule.level,
          order: learningModule.order,
          status: learningModule.status,
          title: fallbackTranslation.title,
          description: fallbackTranslation.description,
          summary: fallbackTranslation.summary ?? null,
        },
        select: {
          id: true,
        },
      });

      moduleIdsBySlug.set(learningModule.slug, savedModule.id);
      await upsertModuleTranslations(
        tx,
        savedModule.id,
        learningModule.translations,
      );
    }

    for (const skill of payload.skills) {
      const moduleId = await resolveModuleIdBySlug(
        tx,
        moduleIdsBySlug,
        skill.moduleSlug,
      );
      const fallbackTranslation = getFallbackTranslation(skill.translations);

      if (!fallbackTranslation) {
        throw new Error(`Skill ${skill.slug} is missing both FR and EN translations.`);
      }

      const savedSkill = await tx.skill.upsert({
        where: {
          slug: skill.slug,
        },
        create: {
          slug: skill.slug,
          moduleId,
          status: skill.status,
          title: fallbackTranslation.title,
          description: fallbackTranslation.description,
        },
        update: {
          moduleId,
          status: skill.status,
          title: fallbackTranslation.title,
          description: fallbackTranslation.description,
        },
        select: {
          id: true,
          moduleId: true,
        },
      });

      skillBySlug.set(skill.slug, {
        id: savedSkill.id,
        moduleId: savedSkill.moduleId,
      });
      await upsertSkillTranslations(tx, savedSkill.id, skill.translations);
    }

    for (const question of payload.questions) {
      const moduleId = await resolveModuleIdBySlug(
        tx,
        moduleIdsBySlug,
        question.moduleSlug,
      );
      const primarySkill = await resolveSkillBySlug(
        tx,
        skillBySlug,
        question.primarySkillSlug,
      );

      if (primarySkill.moduleId !== moduleId) {
        throw new Error(
          `Question ${question.slug} points to a skill outside of module ${question.moduleSlug}.`,
        );
      }

      const fallbackTranslation = getFallbackTranslation(question.translations);

      if (!fallbackTranslation) {
        throw new Error(
          `Question ${question.slug} is missing both FR and EN translations.`,
        );
      }

      const existingQuestion = await tx.question.findUnique({
        where: {
          slug: question.slug,
        },
        select: {
          id: true,
          format: true,
          _count: {
            select: {
              attempts: true,
            },
          },
          options: {
            orderBy: {
              order: "asc",
            },
            select: {
              order: true,
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
          translations: {
            select: {
              locale: true,
              contextData: true,
            },
          },
        },
      });

      if (
        existingQuestion &&
        existingQuestion._count.attempts > 0 &&
        question.format !== existingQuestion.format
      ) {
        throw new Error(
          `Question ${question.slug} cannot change format once attempts exist.`,
        );
      }

      const shouldLockClosedOptions = existingQuestion
        ? existingQuestion._count.attempts > 0 &&
          isClosedQuestionFormat(existingQuestion.format)
        : false;

      if (
        existingQuestion &&
        shouldLockClosedOptions &&
        JSON.stringify(normalizeExistingOptions(existingQuestion.options)) !==
          JSON.stringify(normalizeImportedOptions(question.options))
      ) {
        throw new Error(
          `Question ${question.slug} cannot change closed options once attempts exist.`,
        );
      }

      if (
        existingQuestion &&
        existingQuestion._count.attempts > 0 &&
        existingQuestion.format === QuestionFormat.BUG_HUNT &&
        JSON.stringify(
          buildExistingBugHuntContextSnapshot(existingQuestion.translations),
        ) !==
          JSON.stringify(buildImportedBugHuntContextSnapshot(question.translations))
      ) {
        throw new Error(
          `Question ${question.slug} cannot change bug-hunt context once attempts exist.`,
        );
      }

      const savedQuestion = existingQuestion
        ? await tx.question.update({
            where: {
              id: existingQuestion.id,
            },
            data: {
              slug: question.slug,
              moduleId,
              primarySkillId: primarySkill.id,
              format: question.format,
              level: question.level,
              difficulty: question.difficulty,
              estimatedTimeSec: question.estimatedTimeSec ?? null,
              sourceType: question.sourceType ?? null,
              version: question.version,
              status: question.status,
              prompt: fallbackTranslation.prompt,
              explanation: fallbackTranslation.explanation,
              takeaways: toNullableJson(
                normalizeStringArray(fallbackTranslation.takeaways),
              ),
            },
            select: {
              id: true,
            },
          })
        : await tx.question.create({
            data: {
              slug: question.slug,
              moduleId,
              primarySkillId: primarySkill.id,
              format: question.format,
              level: question.level,
              difficulty: question.difficulty,
              estimatedTimeSec: question.estimatedTimeSec ?? null,
              sourceType: question.sourceType ?? null,
              version: question.version,
              status: question.status,
              prompt: fallbackTranslation.prompt,
              explanation: fallbackTranslation.explanation,
              takeaways: toNullableJson(
                normalizeStringArray(fallbackTranslation.takeaways),
              ),
            },
            select: {
              id: true,
            },
          });

      await upsertQuestionTranslations(tx, savedQuestion.id, question.translations);

      if (!shouldLockClosedOptions) {
        await recreateQuestionOptions(tx, savedQuestion.id, question.options);
      }

      await syncQuestionPitfallTags(tx, savedQuestion.id, question.pitfallTagSlugs);
    }

    return {
      version: payload.version,
      importedAt: new Date().toISOString(),
      counts: {
        modules: payload.modules.length,
        skills: payload.skills.length,
        pitfallTags: payload.pitfallTags.length,
        questions: payload.questions.length,
      },
    };
  });
}

export type { AdminContentImportPayload };
