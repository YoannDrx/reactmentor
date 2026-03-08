"use server";

import { ProductAnalyticsEventName } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { captureProductAnalyticsEvent } from "@/features/telemetry/telemetry";
import { getUser } from "@/lib/auth/auth-user";
import { prisma } from "@/lib/prisma";

const toggleBookmarkSchema = z.object({
  questionId: z.string().trim().min(1),
  pathToRevalidate: z.string().trim().optional(),
});

export async function toggleBookmarkAction(formData: FormData) {
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin?callbackUrl=%2Fdashboard");
  }

  const parsed = toggleBookmarkSchema.safeParse({
    questionId: String(formData.get("questionId") ?? ""),
    pathToRevalidate: String(formData.get("pathToRevalidate") ?? "") || undefined,
  });

  if (!parsed.success) {
    return;
  }

  const existingBookmark = await prisma.bookmark.findUnique({
    where: {
      userId_questionId: {
        userId: user.id,
        questionId: parsed.data.questionId,
      },
    },
  });

  if (existingBookmark) {
    await prisma.bookmark.delete({
      where: {
        id: existingBookmark.id,
      },
    });
  } else {
    await prisma.bookmark.create({
      data: {
        userId: user.id,
        questionId: parsed.data.questionId,
      },
    });

    await captureProductAnalyticsEvent({
      userId: user.id,
      name: ProductAnalyticsEventName.BOOKMARK_CREATED,
      source: "bookmark.action",
      questionId: parsed.data.questionId,
    });
  }

  const pathsToRevalidate = new Set<string>([
    "/dashboard",
    "/dashboard/review",
    "/dashboard/mock-interviews",
    "/dashboard/bookmarks",
    "/dashboard/session",
  ]);

  if (parsed.data.pathToRevalidate) {
    pathsToRevalidate.add(parsed.data.pathToRevalidate);
  }

  for (const path of pathsToRevalidate) {
    revalidatePath(path);
  }
}
