import {
  ContentStatus,
  PlaylistKind,
  type Prisma,
  SessionMode,
} from "@prisma/client";
import type { Locale } from "@/i18n/config";
import {
  localizeModule,
  localizeQuestionSummary,
  localizeSkill,
} from "@/lib/content-repository";
import { prisma } from "@/lib/prisma";

type PlaylistWithQuestions = Prisma.PlaylistGetPayload<{
  include: {
    items: {
      orderBy: {
        order: "asc";
      };
      include: {
        question: {
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
        };
      };
    };
  };
}>;

function uniqueStrings(values: string[]) {
  return Array.from(
    new Set(
      values.map((value) => value.trim()).filter((value) => value.length > 0),
    ),
  );
}

function getPlayableQuestions(playlist: PlaylistWithQuestions, locale: Locale) {
  return playlist.items.flatMap((item) => {
    if (
      item.question.status !== ContentStatus.PUBLISHED ||
      item.question.module.status !== ContentStatus.PUBLISHED ||
      item.question.primarySkill.status !== ContentStatus.PUBLISHED
    ) {
      return [];
    }

    const question = localizeQuestionSummary(item.question, locale);
    const skill = localizeSkill(item.question.primarySkill, locale);
    const localizedModule = localizeModule(item.question.module, locale);

    return [
      {
        id: question.id,
        slug: question.slug,
        prompt: question.prompt,
        format: question.format,
        difficulty: question.difficulty,
        estimatedTimeSec: question.estimatedTimeSec,
        skill: skill.title,
        module: localizedModule.title,
        moduleSlug: localizedModule.slug,
      },
    ];
  });
}

function mapSavedPlaylistSummary(
  playlist: PlaylistWithQuestions,
  locale: Locale,
) {
  const questions = getPlayableQuestions(playlist, locale);
  const moduleSlugs = uniqueStrings(
    questions.map((question) => question.moduleSlug),
  );

  return {
    id: playlist.id,
    name: playlist.name,
    description: playlist.description,
    kind: playlist.kind,
    mode: playlist.mode,
    sourceKey: playlist.sourceKey,
    questionIds: questions.map((question) => question.id),
    questionCount: questions.length,
    focusSkills: uniqueStrings(
      questions.map((question) => question.skill),
    ).slice(0, 4),
    moduleSlug: moduleSlugs.length === 1 ? moduleSlugs[0] : null,
    updatedAt: playlist.updatedAt,
  };
}

export async function getSavedPlaylistsReadModel(params: {
  userId: string;
  locale: Locale;
}) {
  const playlists = await prisma.playlist.findMany({
    where: {
      userId: params.userId,
    },
    include: {
      items: {
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
      updatedAt: "desc",
    },
  });

  const items = playlists
    .map((playlist) => mapSavedPlaylistSummary(playlist, params.locale))
    .filter(
      (playlist) =>
        playlist.questionCount > 0 || playlist.kind === PlaylistKind.MANUAL,
    );

  return {
    count: items.length,
    items,
  };
}

export async function getSavedPlaylistReadModel(params: {
  userId: string;
  locale: Locale;
}) {
  return getSavedPlaylistsReadModel(params);
}

export async function getSavedPlaylistDetail(params: {
  playlistId: string;
  userId: string;
  locale: Locale;
}) {
  const playlist = await prisma.playlist.findFirst({
    where: {
      id: params.playlistId,
      userId: params.userId,
    },
    include: {
      items: {
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

  if (!playlist) {
    return null;
  }

  const summary = mapSavedPlaylistSummary(playlist, params.locale);
  const questions = getPlayableQuestions(playlist, params.locale);

  return {
    ...summary,
    questions,
    stats: {
      manualQuestionCount: questions.length,
      moduleCount: uniqueStrings(
        questions.map((question) => question.moduleSlug),
      ).length,
    },
  };
}

export type SavedPlaylistsReadModel = Awaited<
  ReturnType<typeof getSavedPlaylistsReadModel>
>;
export type SavedPlaylistDetail = Awaited<
  ReturnType<typeof getSavedPlaylistDetail>
>;
export { PlaylistKind, SessionMode };
