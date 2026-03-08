"use server";

import { PlaylistKind, SessionMode } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getUserEntitlementSnapshot } from "@/features/billing/user-entitlements";
import { getUser } from "@/lib/auth/auth-user";
import { prisma } from "@/lib/prisma";

const saveGeneratedPlaylistSchema = z.object({
  sourceKey: z.string().trim().min(1),
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(400).optional(),
  mode: z.nativeEnum(SessionMode),
  questionIds: z.array(z.string().trim().min(1)).default([]),
});

const updatePlaylistSchema = z.object({
  playlistId: z.string().trim().min(1),
  name: z.string().trim().min(1).max(120),
  description: z.string().trim().max(400).optional(),
});

const removePlaylistQuestionSchema = z.object({
  playlistId: z.string().trim().min(1),
  questionId: z.string().trim().min(1),
});

const deletePlaylistSchema = z.object({
  playlistId: z.string().trim().min(1),
  redirectTo: z.string().trim().optional(),
});

function normalizeQuestionIds(questionIds: string[]) {
  return Array.from(
    new Set(
      questionIds
        .map((questionId) => questionId.trim())
        .filter((questionId) => questionId.length > 0),
    ),
  );
}

function toNullableText(value: string | undefined) {
  const normalizedValue = value?.trim() ?? "";
  return normalizedValue.length > 0 ? normalizedValue : null;
}

function revalidatePlaylistPaths(playlistId?: string) {
  revalidatePath("/dashboard");
  revalidatePath("/dashboard/playlists");

  if (playlistId) {
    revalidatePath(`/dashboard/playlists/${playlistId}`);
  }
}

export async function saveGeneratedPlaylistAction(formData: FormData) {
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin?callbackUrl=%2Fdashboard%2Fplaylists");
  }

  const entitlement = await getUserEntitlementSnapshot(user.id);

  if (!entitlement.canUsePlaylists) {
    redirect("/dashboard/playlists");
  }

  const parsed = saveGeneratedPlaylistSchema.safeParse({
    sourceKey: String(formData.get("sourceKey") ?? ""),
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? "") || undefined,
    mode: String(formData.get("mode") ?? ""),
    questionIds: formData.getAll("questionIds").map(String),
  });

  if (!parsed.success) {
    redirect("/dashboard/playlists");
  }

  const questionIds = normalizeQuestionIds(parsed.data.questionIds);

  if (questionIds.length === 0) {
    redirect("/dashboard/playlists");
  }

  const playlist = await prisma.$transaction(async (tx) => {
    const existingPlaylist = await tx.playlist.findFirst({
      where: {
        userId: user.id,
        kind: PlaylistKind.GENERATED,
        sourceKey: parsed.data.sourceKey,
      },
      select: {
        id: true,
      },
    });

    if (existingPlaylist) {
      await tx.playlist.update({
        where: {
          id: existingPlaylist.id,
        },
        data: {
          mode: parsed.data.mode,
          name: parsed.data.name,
          description: toNullableText(parsed.data.description),
          updatedAt: new Date(),
          items: {
            deleteMany: {},
            createMany: {
              data: questionIds.map((questionId, index) => ({
                questionId,
                order: index + 1,
              })),
            },
          },
        },
      });

      return existingPlaylist;
    }

    return tx.playlist.create({
      data: {
        userId: user.id,
        kind: PlaylistKind.GENERATED,
        mode: parsed.data.mode,
        sourceKey: parsed.data.sourceKey,
        name: parsed.data.name,
        description: toNullableText(parsed.data.description),
        items: {
          createMany: {
            data: questionIds.map((questionId, index) => ({
              questionId,
              order: index + 1,
            })),
          },
        },
      },
      select: {
        id: true,
      },
    });
  });

  revalidatePlaylistPaths(playlist.id);
  redirect(`/dashboard/playlists/${playlist.id}`);
}

export async function updatePlaylistAction(formData: FormData) {
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin?callbackUrl=%2Fdashboard%2Fplaylists");
  }

  const entitlement = await getUserEntitlementSnapshot(user.id);

  if (!entitlement.canUsePlaylists) {
    redirect("/dashboard/playlists");
  }

  const parsed = updatePlaylistSchema.safeParse({
    playlistId: String(formData.get("playlistId") ?? ""),
    name: String(formData.get("name") ?? ""),
    description: String(formData.get("description") ?? "") || undefined,
  });

  if (!parsed.success) {
    redirect("/dashboard/playlists");
  }

  const ownedPlaylist = await prisma.playlist.findFirst({
    where: {
      id: parsed.data.playlistId,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!ownedPlaylist) {
    redirect("/dashboard/playlists");
  }

  await prisma.playlist.update({
    where: {
      id: ownedPlaylist.id,
    },
    data: {
      name: parsed.data.name,
      description: toNullableText(parsed.data.description),
      kind: PlaylistKind.MANUAL,
      sourceKey: null,
    },
  });

  revalidatePlaylistPaths(ownedPlaylist.id);
  redirect(`/dashboard/playlists/${ownedPlaylist.id}`);
}

export async function removePlaylistQuestionAction(formData: FormData) {
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin?callbackUrl=%2Fdashboard%2Fplaylists");
  }

  const entitlement = await getUserEntitlementSnapshot(user.id);

  if (!entitlement.canUsePlaylists) {
    redirect("/dashboard/playlists");
  }

  const parsed = removePlaylistQuestionSchema.safeParse({
    playlistId: String(formData.get("playlistId") ?? ""),
    questionId: String(formData.get("questionId") ?? ""),
  });

  if (!parsed.success) {
    redirect("/dashboard/playlists");
  }

  const ownedPlaylist = await prisma.playlist.findFirst({
    where: {
      id: parsed.data.playlistId,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!ownedPlaylist) {
    redirect("/dashboard/playlists");
  }

  await prisma.$transaction(async (tx) => {
    await tx.playlistItem.deleteMany({
      where: {
        playlistId: ownedPlaylist.id,
        questionId: parsed.data.questionId,
      },
    });

    const remainingItems = await tx.playlistItem.findMany({
      where: {
        playlistId: ownedPlaylist.id,
      },
      orderBy: {
        order: "asc",
      },
      select: {
        id: true,
      },
    });

    await Promise.all(
      remainingItems.map((item, index) =>
        tx.playlistItem.update({
          where: {
            id: item.id,
          },
          data: {
            order: index + 1,
          },
        }),
      ),
    );

    await tx.playlist.update({
      where: {
        id: ownedPlaylist.id,
      },
      data: {
        kind: PlaylistKind.MANUAL,
        sourceKey: null,
      },
    });
  });

  revalidatePlaylistPaths(ownedPlaylist.id);
  redirect(`/dashboard/playlists/${ownedPlaylist.id}`);
}

export async function deletePlaylistAction(formData: FormData) {
  const user = await getUser();

  if (!user) {
    redirect("/auth/signin?callbackUrl=%2Fdashboard%2Fplaylists");
  }

  const entitlement = await getUserEntitlementSnapshot(user.id);

  if (!entitlement.canUsePlaylists) {
    redirect("/dashboard/playlists");
  }

  const parsed = deletePlaylistSchema.safeParse({
    playlistId: String(formData.get("playlistId") ?? ""),
    redirectTo: String(formData.get("redirectTo") ?? "") || undefined,
  });

  if (!parsed.success) {
    redirect("/dashboard/playlists");
  }

  const ownedPlaylist = await prisma.playlist.findFirst({
    where: {
      id: parsed.data.playlistId,
      userId: user.id,
    },
    select: {
      id: true,
    },
  });

  if (!ownedPlaylist) {
    redirect("/dashboard/playlists");
  }

  await prisma.playlist.delete({
    where: {
      id: ownedPlaylist.id,
    },
  });

  revalidatePlaylistPaths();
  redirect(parsed.data.redirectTo ?? "/dashboard/playlists");
}
