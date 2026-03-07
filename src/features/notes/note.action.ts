"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getUser } from "@/lib/auth/auth-user";
import { prisma } from "@/lib/prisma";

const saveQuestionNoteSchema = z.object({
  questionId: z.string().trim().min(1),
  body: z.string().trim().max(2000).optional(),
  clear: z
    .union([z.literal("true"), z.literal("false"), z.string().trim()])
    .optional(),
  pathToRevalidate: z.string().trim().optional(),
});

export async function saveQuestionNoteAction(formData: FormData) {
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin?callbackUrl=%2Fdashboard");
  }

  const parsed = saveQuestionNoteSchema.safeParse({
    questionId: String(formData.get("questionId") ?? ""),
    body: String(formData.get("body") ?? "") || undefined,
    clear: String(formData.get("clear") ?? "") || undefined,
    pathToRevalidate: String(formData.get("pathToRevalidate") ?? "") || undefined,
  });

  if (!parsed.success) {
    return;
  }

  const shouldClear = parsed.data.clear === "true";
  const nextBody = shouldClear ? "" : (parsed.data.body ?? "");
  const existingNote = await prisma.note.findFirst({
    where: {
      userId: user.id,
      questionId: parsed.data.questionId,
    },
    orderBy: {
      updatedAt: "desc",
    },
  });

  if (nextBody.length === 0) {
    if (existingNote) {
      await prisma.note.delete({
        where: {
          id: existingNote.id,
        },
      });
    }
  } else if (existingNote) {
    await prisma.note.update({
      where: {
        id: existingNote.id,
      },
      data: {
        body: nextBody,
      },
    });
  } else {
    await prisma.note.create({
      data: {
        userId: user.id,
        questionId: parsed.data.questionId,
        body: nextBody,
      },
    });
  }

  const pathsToRevalidate = new Set<string>([
    "/dashboard",
    "/dashboard/bookmarks",
    "/dashboard/notes",
    "/dashboard/review",
    "/dashboard/session",
  ]);

  if (parsed.data.pathToRevalidate) {
    pathsToRevalidate.add(parsed.data.pathToRevalidate);
  }

  for (const path of pathsToRevalidate) {
    revalidatePath(path);
  }
}
