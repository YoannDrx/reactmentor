"use server";

import {
  ContentLocale,
  ContentStatus,
  OperationalEventLevel,
  QuestionFormat,
  QuestionLevel,
  TranslationStatus,
  Track,
} from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { importAdminContentPayload } from "@/features/admin/admin-content-import";
import {
  captureOperationalEvent,
  getErrorMessage,
  getErrorMetadata,
} from "@/features/telemetry/telemetry";
import { requireContentAdmin } from "@/lib/auth/content-admin";
import { prisma } from "@/lib/prisma";

const moduleSchema = z.object({
  slug: z.string().trim().min(1).max(120),
  track: z.nativeEnum(Track),
  level: z.nativeEnum(QuestionLevel),
  order: z.coerce.number().int().min(0).max(999).default(0),
  status: z.nativeEnum(ContentStatus),
  titleFr: z.string().trim().min(1).max(160),
  descriptionFr: z.string().trim().min(1).max(500),
  summaryFr: z.string().trim().max(500).optional(),
  titleEn: z.string().trim().min(1).max(160),
  descriptionEn: z.string().trim().min(1).max(500),
  summaryEn: z.string().trim().max(500).optional(),
});

const moduleUpdateSchema = moduleSchema.extend({
  id: z.string().trim().min(1),
  translationStatusFr: z.nativeEnum(TranslationStatus),
  translationStatusEn: z.nativeEnum(TranslationStatus),
});

const skillSchema = z.object({
  moduleId: z.string().trim().min(1),
  slug: z.string().trim().min(1).max(120),
  status: z.nativeEnum(ContentStatus),
  titleFr: z.string().trim().min(1).max(160),
  descriptionFr: z.string().trim().min(1).max(500),
  titleEn: z.string().trim().min(1).max(160),
  descriptionEn: z.string().trim().min(1).max(500),
});

const skillUpdateSchema = skillSchema.extend({
  id: z.string().trim().min(1),
  translationStatusFr: z.nativeEnum(TranslationStatus),
  translationStatusEn: z.nativeEnum(TranslationStatus),
});

const pitfallTagSchema = z.object({
  slug: z.string().trim().min(1).max(120),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().min(1).max(500),
});

const pitfallTagUpdateSchema = pitfallTagSchema.extend({
  id: z.string().trim().min(1),
});

const questionSchema = z.object({
  moduleId: z.string().trim().min(1),
  primarySkillId: z.string().trim().min(1),
  slug: z.string().trim().min(1).max(120),
  format: z.nativeEnum(QuestionFormat),
  level: z.nativeEnum(QuestionLevel),
  difficulty: z.coerce.number().int().min(1).max(5),
  status: z.nativeEnum(ContentStatus),
  estimatedTimeSec: z.coerce.number().int().min(0).max(7200).optional(),
  sourceType: z.string().trim().max(120).optional(),
  promptFr: z.string().trim().min(1),
  explanationFr: z.string().trim().min(1),
  takeawaysFr: z.string().trim().min(1),
  promptEn: z.string().trim().min(1),
  explanationEn: z.string().trim().min(1),
  takeawaysEn: z.string().trim().min(1),
  correctOptionIndexes: z.string().trim().optional(),
  optionLabelsFr: z.string().optional(),
  optionExplanationsFr: z.string().optional(),
  optionLabelsEn: z.string().optional(),
  optionExplanationsEn: z.string().optional(),
});

const questionUpdateSchema = questionSchema.extend({
  id: z.string().trim().min(1),
  translationStatusFr: z.nativeEnum(TranslationStatus),
  translationStatusEn: z.nativeEnum(TranslationStatus),
});

const contentStatusSchema = z.object({
  entity: z.enum(["module", "skill", "question"]),
  id: z.string().trim().min(1),
  status: z.nativeEnum(ContentStatus),
});

function splitTakeaways(value: string) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function splitMultilineEntries(value: string | undefined) {
  return (value ?? "")
    .split("\n")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);
}

function parsePitfallTagSlugs(values: FormDataEntryValue[]) {
  return Array.from(
    new Set(
      values
        .filter((value): value is string => typeof value === "string")
        .map((value) => value.trim())
        .filter((value) => value.length > 0),
    ),
  ).sort((left, right) => left.localeCompare(right));
}

function isClosedQuestionFormat(format: QuestionFormat) {
  return (
    format === QuestionFormat.SINGLE_CHOICE ||
    format === QuestionFormat.MULTIPLE_CHOICE
  );
}

function parseCorrectOptionIndexes(value: string | undefined, optionCount: number) {
  const entries = (value ?? "")
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item.length > 0);

  if (entries.length === 0) {
    return [];
  }

  const indexes = Array.from(
    new Set(
      entries.flatMap((entry) => {
        const parsed = Number.parseInt(entry, 10);

        return Number.isInteger(parsed) ? [parsed] : [];
      }),
    ),
  ).sort((left, right) => left - right);

  if (
    indexes.length !== entries.length ||
    indexes.some((index) => index < 1 || index > optionCount)
  ) {
    return null;
  }

  return indexes;
}

function buildClosedQuestionOptionPayload(params: {
  format: QuestionFormat;
  correctOptionIndexes?: string;
  optionLabelsFr?: string;
  optionExplanationsFr?: string;
  optionLabelsEn?: string;
  optionExplanationsEn?: string;
}) {
  if (!isClosedQuestionFormat(params.format)) {
    return [];
  }

  const labelsFr = splitMultilineEntries(params.optionLabelsFr);
  const explanationsFr = splitMultilineEntries(params.optionExplanationsFr);
  const labelsEn = splitMultilineEntries(params.optionLabelsEn);
  const explanationsEn = splitMultilineEntries(params.optionExplanationsEn);
  const optionCount = labelsFr.length;

  if (
    optionCount < 2 ||
    labelsEn.length !== optionCount ||
    explanationsFr.length !== optionCount ||
    explanationsEn.length !== optionCount
  ) {
    return null;
  }

  const correctOptionIndexes = parseCorrectOptionIndexes(
    params.correctOptionIndexes,
    optionCount,
  );

  if (!correctOptionIndexes || correctOptionIndexes.length === 0) {
    return null;
  }

  if (
    params.format === QuestionFormat.SINGLE_CHOICE &&
    correctOptionIndexes.length !== 1
  ) {
    return null;
  }

  if (correctOptionIndexes.length >= optionCount) {
    return null;
  }

  return Array.from({ length: optionCount }, (_, index) => ({
    order: index + 1,
    isCorrect: correctOptionIndexes.includes(index + 1),
    fr: {
      label: labelsFr[index] ?? "",
      explanation: explanationsFr[index] ?? "",
    },
    en: {
      label: labelsEn[index] ?? "",
      explanation: explanationsEn[index] ?? "",
    },
  }));
}

function hasText(value: string | null | undefined) {
  return typeof value === "string" && value.trim().length > 0;
}

function hasTakeaways(value: unknown) {
  return Array.isArray(value) && value.some((item) => typeof item === "string");
}

async function ensureQuestionPublishable(questionId: string) {
  const question = await prisma.question.findUnique({
    where: {
      id: questionId,
    },
    select: {
      format: true,
      translations: {
        select: {
          locale: true,
          prompt: true,
          explanation: true,
          takeaways: true,
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
    },
  });

  if (!question) {
    return false;
  }

  const frTranslation =
    question.translations.find(
      (translation) => translation.locale === ContentLocale.FR,
    ) ?? null;
  const enTranslation =
    question.translations.find(
      (translation) => translation.locale === ContentLocale.EN,
    ) ?? null;

  const baseQuestionPublishable = Boolean(
    frTranslation &&
    enTranslation &&
    hasText(frTranslation.prompt) &&
    hasText(frTranslation.explanation) &&
    hasText(enTranslation.prompt) &&
    hasText(enTranslation.explanation) &&
    hasTakeaways(frTranslation.takeaways) &&
    hasTakeaways(enTranslation.takeaways),
  );

  if (!baseQuestionPublishable) {
    return false;
  }

  if (!isClosedQuestionFormat(question.format)) {
    return true;
  }

  const correctCount = question.options.filter((option) => option.isCorrect).length;
  const incorrectCount = question.options.length - correctCount;

  if (
    question.options.length < 2 ||
    correctCount === 0 ||
    (question.format === QuestionFormat.SINGLE_CHOICE && correctCount !== 1) ||
    incorrectCount === 0
  ) {
    return false;
  }

  const hasFrOptionGaps = question.options.some((option) => {
    const translation =
      option.translations.find((item) => item.locale === ContentLocale.FR) ?? null;

    return !translation || !hasText(translation.label) || !hasText(translation.explanation);
  });
  const hasEnOptionGaps = question.options.some((option) => {
    const translation =
      option.translations.find((item) => item.locale === ContentLocale.EN) ?? null;

    return !translation || !hasText(translation.label) || !hasText(translation.explanation);
  });

  return !hasFrOptionGaps && !hasEnOptionGaps;
}

function revalidateAdminPaths() {
  revalidatePath("/dashboard/admin");
  revalidatePath("/dashboard/modules");
  revalidatePath("/learn");
}

async function ensurePitfallTagSlugsExist(pitfallTagSlugs: string[]) {
  if (pitfallTagSlugs.length === 0) {
    return true;
  }

  const tags = await prisma.pitfallTag.findMany({
    where: {
      slug: {
        in: pitfallTagSlugs,
      },
    },
    select: {
      slug: true,
    },
  });

  return tags.length === pitfallTagSlugs.length;
}

async function syncQuestionPitfallTags(
  questionId: string,
  pitfallTagSlugs: string[],
) {
  const normalizedPitfallTagSlugs = Array.from(new Set(pitfallTagSlugs)).sort(
    (left, right) => left.localeCompare(right),
  );

  const pitfallTags = await prisma.pitfallTag.findMany({
    where: {
      slug: {
        in: normalizedPitfallTagSlugs,
      },
    },
    select: {
      id: true,
    },
  });

  await prisma.questionPitfallTag.deleteMany({
    where: {
      questionId,
    },
  });

  if (pitfallTags.length === 0) {
    return;
  }

  await prisma.questionPitfallTag.createMany({
    data: pitfallTags.map((pitfallTag) => ({
      questionId,
      pitfallTagId: pitfallTag.id,
    })),
    skipDuplicates: true,
  });
}

export async function createAdminModuleAction(formData: FormData) {
  await requireContentAdmin("/dashboard/admin");

  const parsed = moduleSchema.safeParse({
    slug: String(formData.get("slug") ?? ""),
    track: String(formData.get("track") ?? ""),
    level: String(formData.get("level") ?? ""),
    order: formData.get("order") ?? 0,
    status: String(formData.get("status") ?? ""),
    titleFr: String(formData.get("titleFr") ?? ""),
    descriptionFr: String(formData.get("descriptionFr") ?? ""),
    summaryFr: String(formData.get("summaryFr") ?? "") || undefined,
    titleEn: String(formData.get("titleEn") ?? ""),
    descriptionEn: String(formData.get("descriptionEn") ?? ""),
    summaryEn: String(formData.get("summaryEn") ?? "") || undefined,
  });

  if (!parsed.success) {
    redirect("/dashboard/admin");
  }

  await prisma.learningModule.create({
    data: {
      slug: parsed.data.slug,
      track: parsed.data.track,
      level: parsed.data.level,
      order: parsed.data.order,
      status: parsed.data.status,
      title: parsed.data.titleEn,
      description: parsed.data.descriptionEn,
      summary: parsed.data.summaryEn ?? null,
      translations: {
        create: [
          {
            locale: ContentLocale.FR,
            status: TranslationStatus.READY,
            title: parsed.data.titleFr,
            description: parsed.data.descriptionFr,
            summary: parsed.data.summaryFr ?? null,
          },
          {
            locale: ContentLocale.EN,
            status: TranslationStatus.READY,
            title: parsed.data.titleEn,
            description: parsed.data.descriptionEn,
            summary: parsed.data.summaryEn ?? null,
          },
        ],
      },
    },
  });

  revalidateAdminPaths();
  redirect("/dashboard/admin");
}

export async function createAdminSkillAction(formData: FormData) {
  await requireContentAdmin("/dashboard/admin");

  const parsed = skillSchema.safeParse({
    moduleId: String(formData.get("moduleId") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    status: String(formData.get("status") ?? ""),
    titleFr: String(formData.get("titleFr") ?? ""),
    descriptionFr: String(formData.get("descriptionFr") ?? ""),
    titleEn: String(formData.get("titleEn") ?? ""),
    descriptionEn: String(formData.get("descriptionEn") ?? ""),
  });

  if (!parsed.success) {
    redirect("/dashboard/admin");
  }

  await prisma.skill.create({
    data: {
      moduleId: parsed.data.moduleId,
      slug: parsed.data.slug,
      status: parsed.data.status,
      title: parsed.data.titleEn,
      description: parsed.data.descriptionEn,
      translations: {
        create: [
          {
            locale: ContentLocale.FR,
            status: TranslationStatus.READY,
            title: parsed.data.titleFr,
            description: parsed.data.descriptionFr,
          },
          {
            locale: ContentLocale.EN,
            status: TranslationStatus.READY,
            title: parsed.data.titleEn,
            description: parsed.data.descriptionEn,
          },
        ],
      },
    },
  });

  revalidateAdminPaths();
  redirect("/dashboard/admin");
}

export async function createAdminPitfallTagAction(formData: FormData) {
  await requireContentAdmin("/dashboard/admin");

  const parsed = pitfallTagSchema.safeParse({
    slug: String(formData.get("slug") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
  });

  if (!parsed.success) {
    redirect("/dashboard/admin");
  }

  await prisma.pitfallTag.create({
    data: parsed.data,
  });

  revalidateAdminPaths();
  redirect("/dashboard/admin");
}

export async function importAdminContentAction(formData: FormData) {
  const user = await requireContentAdmin("/dashboard/admin");

  const payloadJson = String(formData.get("payloadJson") ?? "").trim();
  const payloadFile = formData.get("payloadFile");
  const rawPayload =
    payloadFile instanceof File && payloadFile.size > 0
      ? await payloadFile.text()
      : payloadJson;

  if (rawPayload.length === 0) {
    redirect("/dashboard/admin");
  }

  try {
    await importAdminContentPayload(rawPayload);
    await captureOperationalEvent({
      userId: user.id,
      source: "content.import",
      eventType: "admin_content_import",
      level: OperationalEventLevel.INFO,
      status: "success",
      metadata: {
        payloadLength: rawPayload.length,
      },
    });
  } catch (error) {
    await captureOperationalEvent({
      userId: user.id,
      source: "content.import",
      eventType: "admin_content_import",
      level: OperationalEventLevel.ERROR,
      status: "failed",
      message: getErrorMessage(error),
      metadata: {
        payloadLength: rawPayload.length,
        error: getErrorMetadata(error) ?? null,
      },
    });

    redirect("/dashboard/admin");
  }

  revalidateAdminPaths();
  redirect("/dashboard/admin");
}

export async function createAdminQuestionAction(formData: FormData) {
  await requireContentAdmin("/dashboard/admin");
  const estimatedTimeSecValue = String(
    formData.get("estimatedTimeSec") ?? "",
  ).trim();

  const parsed = questionSchema.safeParse({
    moduleId: String(formData.get("moduleId") ?? ""),
    primarySkillId: String(formData.get("primarySkillId") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    format: String(formData.get("format") ?? ""),
    level: String(formData.get("level") ?? ""),
    difficulty: formData.get("difficulty") ?? "",
    status: String(formData.get("status") ?? ""),
    estimatedTimeSec:
      estimatedTimeSecValue.length > 0 ? estimatedTimeSecValue : undefined,
    sourceType: String(formData.get("sourceType") ?? "") || undefined,
    promptFr: String(formData.get("promptFr") ?? ""),
    explanationFr: String(formData.get("explanationFr") ?? ""),
    takeawaysFr: String(formData.get("takeawaysFr") ?? ""),
    promptEn: String(formData.get("promptEn") ?? ""),
    explanationEn: String(formData.get("explanationEn") ?? ""),
    takeawaysEn: String(formData.get("takeawaysEn") ?? ""),
    correctOptionIndexes:
      String(formData.get("correctOptionIndexes") ?? "") || undefined,
    optionLabelsFr: String(formData.get("optionLabelsFr") ?? "") || undefined,
    optionExplanationsFr:
      String(formData.get("optionExplanationsFr") ?? "") || undefined,
    optionLabelsEn: String(formData.get("optionLabelsEn") ?? "") || undefined,
    optionExplanationsEn:
      String(formData.get("optionExplanationsEn") ?? "") || undefined,
  });

  if (!parsed.success) {
    redirect("/dashboard/admin");
  }

  const skill = await prisma.skill.findUnique({
    where: {
      id: parsed.data.primarySkillId,
    },
    select: {
      moduleId: true,
    },
  });

  if (!skill || skill.moduleId !== parsed.data.moduleId) {
    redirect("/dashboard/admin");
  }

  const pitfallTagSlugs = parsePitfallTagSlugs(
    formData.getAll("pitfallTagSlugs"),
  );

  if (!(await ensurePitfallTagSlugsExist(pitfallTagSlugs))) {
    redirect("/dashboard/admin");
  }

  const optionPayload = buildClosedQuestionOptionPayload({
    format: parsed.data.format,
    correctOptionIndexes: parsed.data.correctOptionIndexes,
    optionLabelsFr: parsed.data.optionLabelsFr,
    optionExplanationsFr: parsed.data.optionExplanationsFr,
    optionLabelsEn: parsed.data.optionLabelsEn,
    optionExplanationsEn: parsed.data.optionExplanationsEn,
  });

  if (optionPayload === null) {
    redirect("/dashboard/admin");
  }

  const question = await prisma.question.create({
    data: {
      slug: parsed.data.slug,
      moduleId: parsed.data.moduleId,
      primarySkillId: parsed.data.primarySkillId,
      difficulty: parsed.data.difficulty,
      level: parsed.data.level,
      format: parsed.data.format,
      estimatedTimeSec: parsed.data.estimatedTimeSec ?? null,
      sourceType: parsed.data.sourceType ?? null,
      status: parsed.data.status,
      prompt: parsed.data.promptEn,
      explanation: parsed.data.explanationEn,
      takeaways: splitTakeaways(parsed.data.takeawaysEn),
      translations: {
        create: [
          {
            locale: ContentLocale.FR,
            status: TranslationStatus.READY,
            prompt: parsed.data.promptFr,
            explanation: parsed.data.explanationFr,
            takeaways: splitTakeaways(parsed.data.takeawaysFr),
          },
          {
            locale: ContentLocale.EN,
            status: TranslationStatus.READY,
            prompt: parsed.data.promptEn,
            explanation: parsed.data.explanationEn,
            takeaways: splitTakeaways(parsed.data.takeawaysEn),
          },
        ],
      },
      ...(optionPayload.length > 0
        ? {
            options: {
              create: optionPayload.map((option) => ({
                order: option.order,
                isCorrect: option.isCorrect,
                label: option.en.label,
                explanation: option.en.explanation,
                translations: {
                  create: [
                    {
                      locale: ContentLocale.FR,
                      status: TranslationStatus.READY,
                      label: option.fr.label,
                      explanation: option.fr.explanation,
                    },
                    {
                      locale: ContentLocale.EN,
                      status: TranslationStatus.READY,
                      label: option.en.label,
                      explanation: option.en.explanation,
                    },
                  ],
                },
              })),
            },
          }
        : {}),
    },
  });

  await syncQuestionPitfallTags(question.id, pitfallTagSlugs);

  revalidateAdminPaths();
  redirect("/dashboard/admin");
}

export async function updateAdminModuleAction(formData: FormData) {
  await requireContentAdmin("/dashboard/admin");

  const parsed = moduleUpdateSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    track: String(formData.get("track") ?? ""),
    level: String(formData.get("level") ?? ""),
    order: formData.get("order") ?? 0,
    status: String(formData.get("status") ?? ""),
    titleFr: String(formData.get("titleFr") ?? ""),
    descriptionFr: String(formData.get("descriptionFr") ?? ""),
    summaryFr: String(formData.get("summaryFr") ?? "") || undefined,
    translationStatusFr: String(formData.get("translationStatusFr") ?? ""),
    titleEn: String(formData.get("titleEn") ?? ""),
    descriptionEn: String(formData.get("descriptionEn") ?? ""),
    summaryEn: String(formData.get("summaryEn") ?? "") || undefined,
    translationStatusEn: String(formData.get("translationStatusEn") ?? ""),
  });

  if (!parsed.success) {
    redirect("/dashboard/admin");
  }

  await prisma.learningModule.update({
    where: {
      id: parsed.data.id,
    },
    data: {
      slug: parsed.data.slug,
      track: parsed.data.track,
      level: parsed.data.level,
      order: parsed.data.order,
      status: parsed.data.status,
      title: parsed.data.titleEn,
      description: parsed.data.descriptionEn,
      summary: parsed.data.summaryEn ?? null,
      translations: {
        upsert: [
          {
            where: {
              moduleId_locale: {
                moduleId: parsed.data.id,
                locale: ContentLocale.FR,
              },
            },
            create: {
              locale: ContentLocale.FR,
              status: parsed.data.translationStatusFr,
              title: parsed.data.titleFr,
              description: parsed.data.descriptionFr,
              summary: parsed.data.summaryFr ?? null,
            },
            update: {
              status: parsed.data.translationStatusFr,
              title: parsed.data.titleFr,
              description: parsed.data.descriptionFr,
              summary: parsed.data.summaryFr ?? null,
            },
          },
          {
            where: {
              moduleId_locale: {
                moduleId: parsed.data.id,
                locale: ContentLocale.EN,
              },
            },
            create: {
              locale: ContentLocale.EN,
              status: parsed.data.translationStatusEn,
              title: parsed.data.titleEn,
              description: parsed.data.descriptionEn,
              summary: parsed.data.summaryEn ?? null,
            },
            update: {
              status: parsed.data.translationStatusEn,
              title: parsed.data.titleEn,
              description: parsed.data.descriptionEn,
              summary: parsed.data.summaryEn ?? null,
            },
          },
        ],
      },
    },
  });

  revalidateAdminPaths();
  redirect("/dashboard/admin");
}

export async function updateAdminSkillAction(formData: FormData) {
  await requireContentAdmin("/dashboard/admin");

  const parsed = skillUpdateSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    moduleId: String(formData.get("moduleId") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    status: String(formData.get("status") ?? ""),
    titleFr: String(formData.get("titleFr") ?? ""),
    descriptionFr: String(formData.get("descriptionFr") ?? ""),
    translationStatusFr: String(formData.get("translationStatusFr") ?? ""),
    titleEn: String(formData.get("titleEn") ?? ""),
    descriptionEn: String(formData.get("descriptionEn") ?? ""),
    translationStatusEn: String(formData.get("translationStatusEn") ?? ""),
  });

  if (!parsed.success) {
    redirect("/dashboard/admin");
  }

  await prisma.skill.update({
    where: {
      id: parsed.data.id,
    },
    data: {
      moduleId: parsed.data.moduleId,
      slug: parsed.data.slug,
      status: parsed.data.status,
      title: parsed.data.titleEn,
      description: parsed.data.descriptionEn,
      translations: {
        upsert: [
          {
            where: {
              skillId_locale: {
                skillId: parsed.data.id,
                locale: ContentLocale.FR,
              },
            },
            create: {
              locale: ContentLocale.FR,
              status: parsed.data.translationStatusFr,
              title: parsed.data.titleFr,
              description: parsed.data.descriptionFr,
            },
            update: {
              status: parsed.data.translationStatusFr,
              title: parsed.data.titleFr,
              description: parsed.data.descriptionFr,
            },
          },
          {
            where: {
              skillId_locale: {
                skillId: parsed.data.id,
                locale: ContentLocale.EN,
              },
            },
            create: {
              locale: ContentLocale.EN,
              status: parsed.data.translationStatusEn,
              title: parsed.data.titleEn,
              description: parsed.data.descriptionEn,
            },
            update: {
              status: parsed.data.translationStatusEn,
              title: parsed.data.titleEn,
              description: parsed.data.descriptionEn,
            },
          },
        ],
      },
    },
  });

  revalidateAdminPaths();
  redirect("/dashboard/admin");
}

export async function updateAdminPitfallTagAction(formData: FormData) {
  await requireContentAdmin("/dashboard/admin");

  const parsed = pitfallTagUpdateSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    title: String(formData.get("title") ?? ""),
    description: String(formData.get("description") ?? ""),
  });

  if (!parsed.success) {
    redirect("/dashboard/admin");
  }

  await prisma.pitfallTag.update({
    where: {
      id: parsed.data.id,
    },
    data: {
      slug: parsed.data.slug,
      title: parsed.data.title,
      description: parsed.data.description,
    },
  });

  revalidateAdminPaths();
  redirect("/dashboard/admin");
}

export async function updateAdminQuestionAction(formData: FormData) {
  await requireContentAdmin("/dashboard/admin");
  const estimatedTimeSecValue = String(
    formData.get("estimatedTimeSec") ?? "",
  ).trim();

  const parsed = questionUpdateSchema.safeParse({
    id: String(formData.get("id") ?? ""),
    moduleId: String(formData.get("moduleId") ?? ""),
    primarySkillId: String(formData.get("primarySkillId") ?? ""),
    slug: String(formData.get("slug") ?? ""),
    format: String(formData.get("format") ?? ""),
    level: String(formData.get("level") ?? ""),
    difficulty: formData.get("difficulty") ?? "",
    status: String(formData.get("status") ?? ""),
    estimatedTimeSec:
      estimatedTimeSecValue.length > 0 ? estimatedTimeSecValue : undefined,
    sourceType: String(formData.get("sourceType") ?? "") || undefined,
    promptFr: String(formData.get("promptFr") ?? ""),
    explanationFr: String(formData.get("explanationFr") ?? ""),
    takeawaysFr: String(formData.get("takeawaysFr") ?? ""),
    translationStatusFr: String(formData.get("translationStatusFr") ?? ""),
    promptEn: String(formData.get("promptEn") ?? ""),
    explanationEn: String(formData.get("explanationEn") ?? ""),
    takeawaysEn: String(formData.get("takeawaysEn") ?? ""),
    translationStatusEn: String(formData.get("translationStatusEn") ?? ""),
    correctOptionIndexes:
      String(formData.get("correctOptionIndexes") ?? "") || undefined,
    optionLabelsFr: String(formData.get("optionLabelsFr") ?? "") || undefined,
    optionExplanationsFr:
      String(formData.get("optionExplanationsFr") ?? "") || undefined,
    optionLabelsEn: String(formData.get("optionLabelsEn") ?? "") || undefined,
    optionExplanationsEn:
      String(formData.get("optionExplanationsEn") ?? "") || undefined,
  });

  if (!parsed.success) {
    redirect("/dashboard/admin");
  }

  const skill = await prisma.skill.findUnique({
    where: {
      id: parsed.data.primarySkillId,
    },
    select: {
      moduleId: true,
    },
  });

  if (!skill || skill.moduleId !== parsed.data.moduleId) {
    redirect("/dashboard/admin");
  }

  const pitfallTagSlugs = parsePitfallTagSlugs(
    formData.getAll("pitfallTagSlugs"),
  );

  if (!(await ensurePitfallTagSlugsExist(pitfallTagSlugs))) {
    redirect("/dashboard/admin");
  }

  const existingQuestion = await prisma.question.findUnique({
    where: {
      id: parsed.data.id,
    },
    select: {
      format: true,
      _count: {
        select: {
          attempts: true,
        },
      },
    },
  });

  if (!existingQuestion) {
    redirect("/dashboard/admin");
  }

  if (
    existingQuestion._count.attempts > 0 &&
    parsed.data.format !== existingQuestion.format
  ) {
    redirect("/dashboard/admin");
  }

  const shouldLockClosedOptions =
    existingQuestion._count.attempts > 0 &&
    isClosedQuestionFormat(existingQuestion.format);
  const optionPayload = shouldLockClosedOptions
    ? []
    : buildClosedQuestionOptionPayload({
        format: parsed.data.format,
        correctOptionIndexes: parsed.data.correctOptionIndexes,
        optionLabelsFr: parsed.data.optionLabelsFr,
        optionExplanationsFr: parsed.data.optionExplanationsFr,
        optionLabelsEn: parsed.data.optionLabelsEn,
        optionExplanationsEn: parsed.data.optionExplanationsEn,
      });

  if (optionPayload === null) {
    redirect("/dashboard/admin");
  }

  await prisma.question.update({
    where: {
      id: parsed.data.id,
    },
    data: {
      slug: parsed.data.slug,
      moduleId: parsed.data.moduleId,
      primarySkillId: parsed.data.primarySkillId,
      difficulty: parsed.data.difficulty,
      level: parsed.data.level,
      format: parsed.data.format,
      estimatedTimeSec: parsed.data.estimatedTimeSec ?? null,
      sourceType: parsed.data.sourceType ?? null,
      status: parsed.data.status,
      prompt: parsed.data.promptEn,
      explanation: parsed.data.explanationEn,
      takeaways: splitTakeaways(parsed.data.takeawaysEn),
      translations: {
        upsert: [
          {
            where: {
              questionId_locale: {
                questionId: parsed.data.id,
                locale: ContentLocale.FR,
              },
            },
            create: {
              locale: ContentLocale.FR,
              status: parsed.data.translationStatusFr,
              prompt: parsed.data.promptFr,
              explanation: parsed.data.explanationFr,
              takeaways: splitTakeaways(parsed.data.takeawaysFr),
            },
            update: {
              status: parsed.data.translationStatusFr,
              prompt: parsed.data.promptFr,
              explanation: parsed.data.explanationFr,
              takeaways: splitTakeaways(parsed.data.takeawaysFr),
            },
          },
          {
            where: {
              questionId_locale: {
                questionId: parsed.data.id,
                locale: ContentLocale.EN,
              },
            },
            create: {
              locale: ContentLocale.EN,
              status: parsed.data.translationStatusEn,
              prompt: parsed.data.promptEn,
              explanation: parsed.data.explanationEn,
              takeaways: splitTakeaways(parsed.data.takeawaysEn),
            },
            update: {
              status: parsed.data.translationStatusEn,
              prompt: parsed.data.promptEn,
              explanation: parsed.data.explanationEn,
              takeaways: splitTakeaways(parsed.data.takeawaysEn),
            },
          },
        ],
      },
      ...(!shouldLockClosedOptions
        ? parsed.data.format === QuestionFormat.SINGLE_CHOICE ||
          parsed.data.format === QuestionFormat.MULTIPLE_CHOICE
          ? {
              options: {
                deleteMany: {},
                create: optionPayload.map((option) => ({
                  order: option.order,
                  isCorrect: option.isCorrect,
                  label: option.en.label,
                  explanation: option.en.explanation,
                  translations: {
                    create: [
                      {
                        locale: ContentLocale.FR,
                        status: TranslationStatus.READY,
                        label: option.fr.label,
                        explanation: option.fr.explanation,
                      },
                      {
                        locale: ContentLocale.EN,
                        status: TranslationStatus.READY,
                        label: option.en.label,
                        explanation: option.en.explanation,
                      },
                    ],
                  },
                })),
              },
            }
          : {
              options: {
                deleteMany: {},
              },
            }
        : {}),
    },
  });

  await syncQuestionPitfallTags(parsed.data.id, pitfallTagSlugs);

  revalidateAdminPaths();
  redirect("/dashboard/admin");
}

export async function updateContentStatusAction(formData: FormData) {
  await requireContentAdmin("/dashboard/admin");

  const parsed = contentStatusSchema.safeParse({
    entity: String(formData.get("entity") ?? ""),
    id: String(formData.get("id") ?? ""),
    status: String(formData.get("status") ?? ""),
  });

  if (!parsed.success) {
    redirect("/dashboard/admin");
  }

  if (
    parsed.data.entity === "question" &&
    parsed.data.status === ContentStatus.PUBLISHED &&
    !(await ensureQuestionPublishable(parsed.data.id))
  ) {
    redirect("/dashboard/admin");
  }

  if (parsed.data.entity === "module") {
    await prisma.learningModule.update({
      where: {
        id: parsed.data.id,
      },
      data: {
        status: parsed.data.status,
      },
    });
  }

  if (parsed.data.entity === "skill") {
    await prisma.skill.update({
      where: {
        id: parsed.data.id,
      },
      data: {
        status: parsed.data.status,
      },
    });
  }

  if (parsed.data.entity === "question") {
    await prisma.question.update({
      where: {
        id: parsed.data.id,
      },
      data: {
        status: parsed.data.status,
      },
    });
  }

  revalidateAdminPaths();
  redirect("/dashboard/admin");
}
