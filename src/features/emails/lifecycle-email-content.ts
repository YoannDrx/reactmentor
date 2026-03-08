import { Track } from "@prisma/client";
import type { Locale } from "@/i18n/config";

export type LifecycleEmailMetaRow = {
  label: string;
  value: string;
};

export type LifecycleEmailContent = {
  locale: Locale;
  subject: string;
  preview: string;
  eyebrow: string;
  title: string;
  intro: string;
  bodyParagraphs: string[];
  ctaLabel: string;
  footerText: string;
  footerLinkLabel: string;
  metaRows: LifecycleEmailMetaRow[];
};

function getFirstName(userName: string) {
  return userName.trim().split(/\s+/)[0] || "there";
}

export function getTrackLabel(track: Track, locale: Locale) {
  if (locale === "en") {
    switch (track) {
      case Track.REACT:
        return "React";
      case Track.REACT_NATIVE:
        return "React Native";
      case Track.TYPESCRIPT:
        return "TypeScript";
      case Track.FRONTEND_SYSTEMS:
        return "Frontend Systems";
    }
  }

  switch (track) {
    case Track.REACT:
      return "React";
    case Track.REACT_NATIVE:
      return "React Native";
    case Track.TYPESCRIPT:
      return "TypeScript";
    case Track.FRONTEND_SYSTEMS:
      return "Frontend Systems";
  }
}

export function buildWelcomeLifecycleEmailContent(params: {
  locale: Locale;
  userName: string;
  targetRole: string;
  preferredTracks: Track[];
}) {
  const firstName = getFirstName(params.userName);
  const trackSummary =
    params.preferredTracks.length > 0
      ? params.preferredTracks
          .map((track) => getTrackLabel(track, params.locale))
          .join(" · ")
      : "React · TypeScript";

  if (params.locale === "en") {
    return {
      locale: "en",
      subject: "React Mentor is ready for your next interview loop",
      preview: "Your prep loop is ready inside React Mentor.",
      eyebrow: "React Mentor",
      title: "Your prep loop is ready.",
      intro:
        "The dashboard now has enough context to prioritize the right drills and review queue for your target.",
      bodyParagraphs: [
        `Hi ${firstName}, your onboarding is complete and the workspace is aligned with the interviews you are actually targeting.`,
        "Start with one focused practice block, then let the review queue expose what still needs to stabilize.",
      ],
      ctaLabel: "Open the dashboard",
      footerText:
        "You can disable lifecycle emails at any time from your settings page.",
      footerLinkLabel: "Manage lifecycle emails",
      metaRows: [
        {
          label: "Target role",
          value: params.targetRole,
        },
        {
          label: "Priority tracks",
          value: trackSummary,
        },
      ],
    } satisfies LifecycleEmailContent;
  }

  return {
    locale: "fr",
    subject: "React Mentor est pret pour ton prochain cycle d'entretien",
    preview: "Ta boucle de preparation est prete dans React Mentor.",
    eyebrow: "React Mentor",
    title: "Ta boucle de preparation est prete.",
    intro:
      "Le dashboard a maintenant assez de contexte pour prioriser les bons drills et la bonne queue de review pour ta cible.",
    bodyParagraphs: [
      `Salut ${firstName}, ton onboarding est termine et le workspace est aligne avec les entretiens que tu vises vraiment.`,
      "Commence par une session pratique ciblee, puis laisse la review queue montrer ce qui doit encore se stabiliser.",
    ],
    ctaLabel: "Ouvrir le dashboard",
    footerText:
      "Tu peux desactiver les emails lifecycle a tout moment depuis les settings.",
    footerLinkLabel: "Gerer les emails lifecycle",
    metaRows: [
      {
        label: "Role cible",
        value: params.targetRole,
      },
      {
        label: "Tracks prioritaires",
        value: trackSummary,
      },
    ],
  } satisfies LifecycleEmailContent;
}

export function buildReviewDueLifecycleEmailContent(params: {
  locale: Locale;
  userName: string;
  dueCount: number;
  moduleTitle: string | null;
  skillTitle: string | null;
}) {
  const firstName = getFirstName(params.userName);

  if (params.locale === "en") {
    return {
      locale: "en",
      subject: `${params.dueCount} review cards are ready to revisit`,
      preview: "Your review queue is back on the critical path.",
      eyebrow: "Review Due",
      title: "Your review queue is back on the critical path.",
      intro:
        "A short review pass now will usually buy more signal than starting fresh random drills.",
      bodyParagraphs: [
        `Hi ${firstName}, you currently have ${params.dueCount} due review cards waiting in the queue.`,
        "Reopen the spaced review flow now to stabilize the concepts that are closest to slipping again.",
      ],
      ctaLabel: "Open review queue",
      footerText:
        "You can disable lifecycle emails at any time from your settings page.",
      footerLinkLabel: "Manage lifecycle emails",
      metaRows: [
        {
          label: "Due cards",
          value: String(params.dueCount),
        },
        ...(params.moduleTitle
          ? [
              {
                label: "Priority module",
                value: params.moduleTitle,
              },
            ]
          : []),
        ...(params.skillTitle
          ? [
              {
                label: "Weak skill",
                value: params.skillTitle,
              },
            ]
          : []),
      ],
    } satisfies LifecycleEmailContent;
  }

  return {
    locale: "fr",
    subject: `${params.dueCount} cartes de review attendent encore`,
    preview: "La queue de review revient sur le chemin critique.",
    eyebrow: "Review Due",
    title: "La queue de review revient sur le chemin critique.",
    intro:
      "Une passe de review courte maintenant rapporte souvent plus de signal que de repartir sur des drills aleatoires.",
    bodyParagraphs: [
      `Salut ${firstName}, tu as actuellement ${params.dueCount} cartes dues dans la queue.`,
      "Relance la review espacee maintenant pour stabiliser les concepts les plus proches de rechuter.",
    ],
    ctaLabel: "Ouvrir la review queue",
    footerText:
      "Tu peux desactiver les emails lifecycle a tout moment depuis les settings.",
    footerLinkLabel: "Gerer les emails lifecycle",
    metaRows: [
      {
        label: "Cartes dues",
        value: String(params.dueCount),
      },
      ...(params.moduleTitle
        ? [
            {
              label: "Module prioritaire",
              value: params.moduleTitle,
            },
          ]
        : []),
      ...(params.skillTitle
        ? [
            {
              label: "Skill fragile",
              value: params.skillTitle,
            },
          ]
        : []),
    ],
  } satisfies LifecycleEmailContent;
}
