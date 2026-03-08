import * as Sentry from "@sentry/nextjs";
import { render } from "@react-email/render";
import {
  ContentLocale,
  OperationalEventLevel,
  Prisma,
  Track,
} from "@prisma/client";
import { createElement, type ReactElement } from "react";
import ReviewDueEmail from "@email/review-due.email";
import WelcomeLifecycleEmail from "@email/welcome-lifecycle.email";
import type { Locale } from "@/i18n/config";
import { defaultLocale } from "@/i18n/config";
import {
  buildReviewDueLifecycleEmailContent,
  buildWelcomeLifecycleEmailContent,
} from "@/features/emails/lifecycle-email-content";
import { localizeModule, localizeSkill } from "@/lib/content-repository";
import { env } from "@/lib/env";
import { prisma } from "@/lib/prisma";
import { getResendServerClient, isResendConfigured } from "@/lib/resend";
import { getServerUrl } from "@/lib/server-url";
import {
  captureOperationalEvent,
  getErrorMessage,
  getErrorMetadata,
} from "@/features/telemetry/telemetry";

const LIFECYCLE_EMAIL_SOURCE = "email.lifecycle";
const LIFECYCLE_EMAIL_JOB_SOURCE = "email.lifecycle.job";
const REVIEW_DUE_EMAIL_EVENT = "review_due_email";
const WELCOME_EMAIL_EVENT = "welcome_email";
const REVIEW_DUE_COOLDOWN_HOURS = 24;
const DEFAULT_REVIEW_DUE_LIMIT = 25;
const REVIEW_DUE_CANDIDATE_MULTIPLIER = 4;

type LifecycleEmailDispatchStatus = "sent" | "dry_run" | "failed";

type LifecycleEmailDispatchResult = {
  eventType: string;
  status: LifecycleEmailDispatchStatus;
  messageId: string | null;
  reason: string | null;
};

export type ReviewDueReminderJobResult = {
  executedAt: string;
  dryRun: boolean;
  limit: number;
  candidateUsers: number;
  attempted: number;
  sent: number;
  dryRunCount: number;
  failed: number;
  skipped: number;
  skipReasons: Record<string, number>;
};

function toAppLocale(locale: ContentLocale | null | undefined): Locale {
  return locale === ContentLocale.EN ? "en" : defaultLocale;
}

function addHours(date: Date, hours: number) {
  return new Date(date.getTime() + hours * 60 * 60 * 1000);
}

function buildAbsoluteUrl(path: string) {
  return new URL(path, getServerUrl()).toString();
}

function incrementCounter(counters: Record<string, number>, key: string) {
  counters[key] = (counters[key] ?? 0) + 1;
}

async function renderLifecycleEmail(template: ReactElement) {
  const html = await render(template);
  const text = await render(template, {
    plainText: true,
  });

  return {
    html,
    text,
  };
}

async function buildWelcomeEmail(params: {
  locale: Locale;
  userName: string;
  targetRole: string;
  preferredTracks: Track[];
}) {
  const content = buildWelcomeLifecycleEmailContent({
    locale: params.locale,
    userName: params.userName,
    targetRole: params.targetRole,
    preferredTracks: params.preferredTracks,
  });
  const dashboardUrl = buildAbsoluteUrl("/dashboard");
  const settingsUrl = buildAbsoluteUrl("/dashboard/settings");

  const rendered = await renderLifecycleEmail(
    createElement(WelcomeLifecycleEmail, {
      content,
      ctaUrl: dashboardUrl,
      footerUrl: settingsUrl,
    }),
  );

  return {
    subject: content.subject,
    html: rendered.html,
    text: rendered.text,
  };
}

async function buildReviewDueEmail(params: {
  locale: Locale;
  userName: string;
  dueCount: number;
  moduleTitle: string | null;
  skillTitle: string | null;
}) {
  const content = buildReviewDueLifecycleEmailContent({
    locale: params.locale,
    userName: params.userName,
    dueCount: params.dueCount,
    moduleTitle: params.moduleTitle,
    skillTitle: params.skillTitle,
  });
  const reviewUrl = buildAbsoluteUrl("/dashboard/review");
  const settingsUrl = buildAbsoluteUrl("/dashboard/settings");

  const rendered = await renderLifecycleEmail(
    createElement(ReviewDueEmail, {
      content,
      ctaUrl: reviewUrl,
      footerUrl: settingsUrl,
    }),
  );

  return {
    subject: content.subject,
    html: rendered.html,
    text: rendered.text,
  };
}

async function wasLifecycleEmailSent(params: {
  userId: string;
  eventType: string;
  since?: Date;
}) {
  const existingEvent = await prisma.operationalEvent.findFirst({
    where: {
      userId: params.userId,
      source: LIFECYCLE_EMAIL_SOURCE,
      eventType: params.eventType,
      status: "sent",
      occurredAt: params.since
        ? {
            gte: params.since,
          }
        : undefined,
    },
    select: {
      id: true,
    },
  });

  return Boolean(existingEvent);
}

async function resolveLifecycleLocale(
  userId: string,
  fallbackLocale: Locale = defaultLocale,
) {
  const analyticsLocale = await prisma.productAnalyticsEvent.findFirst({
    where: {
      userId,
      locale: {
        not: null,
      },
    },
    orderBy: {
      occurredAt: "desc",
    },
    select: {
      locale: true,
    },
  });

  return analyticsLocale ? toAppLocale(analyticsLocale.locale) : fallbackLocale;
}

async function dispatchLifecycleEmail(params: {
  userId: string;
  eventType: string;
  recipient: string;
  subject: string;
  html: string;
  text: string;
  metadata?: Prisma.InputJsonValue;
  dryRun?: boolean;
}) {
  if (params.dryRun) {
    await captureOperationalEvent({
      userId: params.userId,
      source: LIFECYCLE_EMAIL_SOURCE,
      eventType: params.eventType,
      level: OperationalEventLevel.INFO,
      status: "dry_run",
      metadata: params.metadata,
    });

    return {
      eventType: params.eventType,
      status: "dry_run",
      messageId: null,
      reason: null,
    } satisfies LifecycleEmailDispatchResult;
  }

  try {
    const response = await getResendServerClient().emails.send({
      from: env.EMAIL_FROM,
      to: [params.recipient],
      subject: params.subject,
      html: params.html,
      text: params.text,
    });

    if (response.error) {
      await captureOperationalEvent({
        userId: params.userId,
        source: LIFECYCLE_EMAIL_SOURCE,
        eventType: params.eventType,
        level: OperationalEventLevel.ERROR,
        status: "failed",
        message: response.error.message,
        metadata: {
          ...(typeof params.metadata === "object" && params.metadata
            ? params.metadata
            : {}),
          resendError: response.error.message,
        },
      });

      return {
        eventType: params.eventType,
        status: "failed",
        messageId: null,
        reason: response.error.message,
      } satisfies LifecycleEmailDispatchResult;
    }

    await captureOperationalEvent({
      userId: params.userId,
      source: LIFECYCLE_EMAIL_SOURCE,
      eventType: params.eventType,
      level: OperationalEventLevel.INFO,
      status: "sent",
      metadata: {
        ...(typeof params.metadata === "object" && params.metadata
          ? params.metadata
          : {}),
        providerMessageId: response.data?.id ?? null,
      },
    });

    return {
      eventType: params.eventType,
      status: "sent",
      messageId: response.data?.id ?? null,
      reason: null,
    } satisfies LifecycleEmailDispatchResult;
  } catch (error) {
    Sentry.captureException(error);
    await captureOperationalEvent({
      userId: params.userId,
      source: LIFECYCLE_EMAIL_SOURCE,
      eventType: params.eventType,
      level: OperationalEventLevel.ERROR,
      status: "failed",
      message: getErrorMessage(error),
      metadata: {
        ...(typeof params.metadata === "object" && params.metadata
          ? params.metadata
          : {}),
        error: getErrorMetadata(error) ?? null,
      },
    });

    return {
      eventType: params.eventType,
      status: "failed",
      messageId: null,
      reason: getErrorMessage(error),
    } satisfies LifecycleEmailDispatchResult;
  }
}

export async function sendWelcomeLifecycleEmail(params: {
  userId: string;
  recipient: string;
  userName: string;
  locale: Locale;
  targetRole: string;
  preferredTracks: Track[];
  lifecycleEmailsEnabled: boolean;
}) {
  if (!params.lifecycleEmailsEnabled) {
    await captureOperationalEvent({
      userId: params.userId,
      source: LIFECYCLE_EMAIL_SOURCE,
      eventType: WELCOME_EMAIL_EVENT,
      level: OperationalEventLevel.INFO,
      status: "skipped_opted_out",
    });
    return;
  }

  const alreadySent = await wasLifecycleEmailSent({
    userId: params.userId,
    eventType: WELCOME_EMAIL_EVENT,
  });

  if (alreadySent) {
    await captureOperationalEvent({
      userId: params.userId,
      source: LIFECYCLE_EMAIL_SOURCE,
      eventType: WELCOME_EMAIL_EVENT,
      level: OperationalEventLevel.INFO,
      status: "skipped_already_sent",
    });
    return;
  }

  if (!isResendConfigured()) {
    await captureOperationalEvent({
      userId: params.userId,
      source: LIFECYCLE_EMAIL_SOURCE,
      eventType: WELCOME_EMAIL_EVENT,
      level: OperationalEventLevel.WARN,
      status: "skipped_provider_unavailable",
    });
    return;
  }

  const email = await buildWelcomeEmail({
    locale: params.locale,
    userName: params.userName,
    targetRole: params.targetRole,
    preferredTracks: params.preferredTracks,
  });

  await dispatchLifecycleEmail({
    userId: params.userId,
    eventType: WELCOME_EMAIL_EVENT,
    recipient: params.recipient,
    subject: email.subject,
    html: email.html,
    text: email.text,
    metadata: {
      targetRole: params.targetRole,
      preferredTrackCount: params.preferredTracks.length,
      locale: params.locale,
    },
  });
}

export function isLifecycleJobConfigured() {
  return Boolean(env.LIFECYCLE_JOB_SECRET);
}

export async function runReviewDueReminderJob(params?: {
  dryRun?: boolean;
  limit?: number;
}) {
  const dryRun = params?.dryRun ?? false;
  const limit = Math.min(
    100,
    Math.max(1, params?.limit ?? DEFAULT_REVIEW_DUE_LIMIT),
  );
  const now = new Date();
  const cooldownThreshold = addHours(now, -REVIEW_DUE_COOLDOWN_HOURS);
  const skipReasons: Record<string, number> = {};
  let attempted = 0;
  let sent = 0;
  let dryRunCount = 0;
  let failed = 0;

  const candidateRows = await prisma.questionProgress.findMany({
    where: {
      nextReviewAt: {
        lte: now,
      },
    },
    select: {
      userId: true,
    },
    distinct: ["userId"],
    orderBy: {
      userId: "asc",
    },
    take: limit * REVIEW_DUE_CANDIDATE_MULTIPLIER,
  });

  for (const candidate of candidateRows) {
    if (attempted >= limit) {
      break;
    }

    const user = await prisma.user.findUnique({
      where: {
        id: candidate.userId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        preferences: {
          select: {
            lifecycleEmailsEnabled: true,
          },
        },
      },
    });

    if (!user) {
      incrementCounter(skipReasons, "missing_user");
      continue;
    }

    if (user.preferences?.lifecycleEmailsEnabled === false) {
      incrementCounter(skipReasons, "opted_out");
      continue;
    }

    const alreadySentRecently = await wasLifecycleEmailSent({
      userId: user.id,
      eventType: REVIEW_DUE_EMAIL_EVENT,
      since: cooldownThreshold,
    });

    if (alreadySentRecently) {
      incrementCounter(skipReasons, "rate_limited");
      continue;
    }

    const dueCount = await prisma.questionProgress.count({
      where: {
        userId: user.id,
        nextReviewAt: {
          lte: now,
        },
      },
    });

    if (dueCount === 0) {
      incrementCounter(skipReasons, "no_due_reviews");
      continue;
    }

    const earliestDue = await prisma.questionProgress.findFirst({
      where: {
        userId: user.id,
        nextReviewAt: {
          lte: now,
        },
      },
      orderBy: {
        nextReviewAt: "asc",
      },
      include: {
        question: {
          include: {
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
          },
        },
      },
    });

    if (!earliestDue) {
      incrementCounter(skipReasons, "no_due_reviews");
      continue;
    }

    attempted += 1;
    const locale = await resolveLifecycleLocale(user.id);
    const email = await buildReviewDueEmail({
      locale,
      userName: user.name,
      dueCount,
      moduleTitle: localizeModule(earliestDue.question.module, locale).title,
      skillTitle: localizeSkill(earliestDue.question.primarySkill, locale)
        .title,
    });

    if (!dryRun && !isResendConfigured()) {
      incrementCounter(skipReasons, "provider_unavailable");
      attempted -= 1;
      continue;
    }

    const result = await dispatchLifecycleEmail({
      userId: user.id,
      eventType: REVIEW_DUE_EMAIL_EVENT,
      recipient: user.email,
      subject: email.subject,
      html: email.html,
      text: email.text,
      dryRun,
      metadata: {
        locale,
        dueCount,
        moduleSlug: earliestDue.question.module.slug,
        skillSlug: earliestDue.question.primarySkill.slug,
      },
    });

    if (result.status === "sent") {
      sent += 1;
      continue;
    }

    if (result.status === "dry_run") {
      dryRunCount += 1;
      continue;
    }

    failed += 1;
    incrementCounter(skipReasons, "dispatch_failed");
  }

  return {
    executedAt: now.toISOString(),
    dryRun,
    limit,
    candidateUsers: candidateRows.length,
    attempted,
    sent,
    dryRunCount,
    failed,
    skipped: Object.values(skipReasons).reduce(
      (total, value) => total + value,
      0,
    ),
    skipReasons,
  } satisfies ReviewDueReminderJobResult;
}

export async function captureReviewDueReminderJobEvent(params: {
  level?: OperationalEventLevel;
  status: string;
  message?: string | null;
  metadata?: Prisma.InputJsonValue;
}) {
  await captureOperationalEvent({
    source: LIFECYCLE_EMAIL_JOB_SOURCE,
    eventType: "review_due_batch",
    level: params.level ?? OperationalEventLevel.INFO,
    status: params.status,
    message: params.message ?? null,
    metadata: params.metadata,
  });
}
