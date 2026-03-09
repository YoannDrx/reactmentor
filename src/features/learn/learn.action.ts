"use server";

import { ContentStatus, ProductAnalyticsEventName } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { sanitizeCallbackUrl } from "@/lib/auth/auth-utils";
import { getUser } from "@/lib/auth/auth-user";
import { prisma } from "@/lib/prisma";
import {
  captureProductAnalyticsEvent,
  toContentLocale,
} from "@/features/telemetry/telemetry";
import {
  buildLessonCheckpointProgressPatch,
  buildLessonReviewQueuePatch,
  buildLessonViewProgressPatch,
} from "./lesson-progress";

const baseLessonActionSchema = z.object({
  questionId: z.string().trim().min(1),
  locale: z.enum(["fr", "en"]).optional(),
  pathToRevalidate: z.string().trim().optional(),
  callbackUrl: z.string().trim().optional(),
});

const lessonCheckpointSchema = baseLessonActionSchema.extend({
  passed: z.enum(["true", "false"]).transform((value) => value === "true"),
});

async function requireLessonUser(callbackUrl: string | undefined) {
  const user = await getUser();

  if (!user) {
    const safeCallbackUrl = sanitizeCallbackUrl(callbackUrl, "/learn");
    redirect(`/auth/signin?callbackUrl=${encodeURIComponent(safeCallbackUrl)}`);
  }

  return user;
}

async function getPublishedQuestionSignal(questionId: string) {
  return prisma.question.findFirst({
    where: {
      id: questionId,
      status: ContentStatus.PUBLISHED,
    },
    select: {
      id: true,
      slug: true,
      module: {
        select: {
          slug: true,
        },
      },
    },
  });
}

function revalidateLessonPaths(pathToRevalidate?: string) {
  const pathsToRevalidate = new Set<string>([
    "/dashboard",
    "/dashboard/learn",
    "/dashboard/progress",
    "/dashboard/review",
    "/learn",
  ]);

  if (pathToRevalidate) {
    pathsToRevalidate.add(pathToRevalidate);
  }

  for (const path of pathsToRevalidate) {
    revalidatePath(path);
  }
}

export async function markLessonViewedAction(formData: FormData) {
  const parsed = baseLessonActionSchema.safeParse({
    questionId: String(formData.get("questionId") ?? ""),
    locale: String(formData.get("locale") ?? "") || undefined,
    pathToRevalidate: String(formData.get("pathToRevalidate") ?? "") || undefined,
    callbackUrl: String(formData.get("callbackUrl") ?? "") || undefined,
  });

  if (!parsed.success) {
    return;
  }

  const user = await requireLessonUser(parsed.data.callbackUrl);
  const question = await getPublishedQuestionSignal(parsed.data.questionId);

  if (!question) {
    return;
  }

  const now = new Date();
  const previousProgress = await prisma.questionProgress.findUnique({
    where: {
      userId_questionId: {
        userId: user.id,
        questionId: question.id,
      },
    },
    select: {
      lessonViews: true,
      lastLessonViewedAt: true,
      lessonCheckpointAttempts: true,
      lessonCheckpointPassCount: true,
      lastLessonCheckpointAt: true,
      lastLessonCheckpointPassed: true,
      nextReviewAt: true,
      masteryState: true,
    },
  });

  const lessonPatch = buildLessonViewProgressPatch(previousProgress, now);

  await prisma.questionProgress.upsert({
    where: {
      userId_questionId: {
        userId: user.id,
        questionId: question.id,
      },
    },
    update: lessonPatch,
    create: {
      userId: user.id,
      questionId: question.id,
      ...lessonPatch,
    },
  });

  await captureProductAnalyticsEvent({
    userId: user.id,
    name: ProductAnalyticsEventName.LESSON_VIEWED,
    source: "learn.action.mark_viewed",
    questionId: question.id,
    moduleSlug: question.module.slug,
    locale: toContentLocale(parsed.data.locale),
  });

  revalidateLessonPaths(parsed.data.pathToRevalidate);
}

export async function completeLessonCheckpointAction(formData: FormData) {
  const parsed = lessonCheckpointSchema.safeParse({
    questionId: String(formData.get("questionId") ?? ""),
    passed: String(formData.get("passed") ?? ""),
    locale: String(formData.get("locale") ?? "") || undefined,
    pathToRevalidate: String(formData.get("pathToRevalidate") ?? "") || undefined,
    callbackUrl: String(formData.get("callbackUrl") ?? "") || undefined,
  });

  if (!parsed.success) {
    return;
  }

  const user = await requireLessonUser(parsed.data.callbackUrl);
  const question = await getPublishedQuestionSignal(parsed.data.questionId);

  if (!question) {
    return;
  }

  const now = new Date();
  const previousProgress = await prisma.questionProgress.findUnique({
    where: {
      userId_questionId: {
        userId: user.id,
        questionId: question.id,
      },
    },
    select: {
      lessonViews: true,
      lastLessonViewedAt: true,
      lessonCheckpointAttempts: true,
      lessonCheckpointPassCount: true,
      lastLessonCheckpointAt: true,
      lastLessonCheckpointPassed: true,
      nextReviewAt: true,
      masteryState: true,
    },
  });

  const lessonPatch = buildLessonCheckpointProgressPatch(previousProgress, {
    passed: parsed.data.passed,
    now,
  });

  await prisma.questionProgress.upsert({
    where: {
      userId_questionId: {
        userId: user.id,
        questionId: question.id,
      },
    },
    update: lessonPatch,
    create: {
      userId: user.id,
      questionId: question.id,
      ...lessonPatch,
    },
  });

  await captureProductAnalyticsEvent({
    userId: user.id,
    name: ProductAnalyticsEventName.LESSON_CHECKPOINT_COMPLETED,
    source: "learn.action.checkpoint",
    questionId: question.id,
    moduleSlug: question.module.slug,
    locale: toContentLocale(parsed.data.locale),
    metadata: {
      passed: parsed.data.passed,
    },
  });

  revalidateLessonPaths(parsed.data.pathToRevalidate);
}

export async function addLessonToReviewAction(formData: FormData) {
  const parsed = baseLessonActionSchema.safeParse({
    questionId: String(formData.get("questionId") ?? ""),
    locale: String(formData.get("locale") ?? "") || undefined,
    pathToRevalidate: String(formData.get("pathToRevalidate") ?? "") || undefined,
    callbackUrl: String(formData.get("callbackUrl") ?? "") || undefined,
  });

  if (!parsed.success) {
    return;
  }

  const user = await requireLessonUser(parsed.data.callbackUrl);
  const question = await getPublishedQuestionSignal(parsed.data.questionId);

  if (!question) {
    return;
  }

  const now = new Date();
  const previousProgress = await prisma.questionProgress.findUnique({
    where: {
      userId_questionId: {
        userId: user.id,
        questionId: question.id,
      },
    },
    select: {
      lessonViews: true,
      lastLessonViewedAt: true,
      lessonCheckpointAttempts: true,
      lessonCheckpointPassCount: true,
      lastLessonCheckpointAt: true,
      lastLessonCheckpointPassed: true,
      nextReviewAt: true,
      masteryState: true,
    },
  });

  const lessonPatch = buildLessonReviewQueuePatch(previousProgress, now);

  await prisma.questionProgress.upsert({
    where: {
      userId_questionId: {
        userId: user.id,
        questionId: question.id,
      },
    },
    update: lessonPatch,
    create: {
      userId: user.id,
      questionId: question.id,
      ...lessonPatch,
    },
  });

  await captureProductAnalyticsEvent({
    userId: user.id,
    name: ProductAnalyticsEventName.LESSON_REVIEW_QUEUED,
    source: "learn.action.queue_review",
    questionId: question.id,
    moduleSlug: question.module.slug,
    locale: toContentLocale(parsed.data.locale),
  });

  revalidateLessonPaths(parsed.data.pathToRevalidate);
}
