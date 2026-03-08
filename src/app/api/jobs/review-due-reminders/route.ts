import * as Sentry from "@sentry/nextjs";
import { OperationalEventLevel } from "@prisma/client";
import { env } from "@/lib/env";
import {
  captureReviewDueReminderJobEvent,
  isLifecycleJobConfigured,
  runReviewDueReminderJob,
} from "@/features/emails/lifecycle-email";
import {
  getErrorMessage,
  getErrorMetadata,
} from "@/features/telemetry/telemetry";

export const runtime = "nodejs";

function isAuthorized(request: Request) {
  const authorization = request.headers.get("authorization");
  return authorization === `Bearer ${env.LIFECYCLE_JOB_SECRET}`;
}

function parseLimit(value: string | null) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return undefined;
  }

  return Math.min(100, Math.max(1, Math.round(numericValue)));
}

export async function GET(request: Request) {
  if (!isLifecycleJobConfigured()) {
    await captureReviewDueReminderJobEvent({
      level: OperationalEventLevel.WARN,
      status: "configuration_missing",
    });

    return Response.json(
      {
        error: "Lifecycle job secret is not configured.",
      },
      {
        status: 503,
      },
    );
  }

  if (!isAuthorized(request)) {
    await captureReviewDueReminderJobEvent({
      level: OperationalEventLevel.WARN,
      status: "unauthorized",
    });

    return Response.json(
      {
        error: "Unauthorized.",
      },
      {
        status: 401,
      },
    );
  }

  const { searchParams } = new URL(request.url);
  const dryRun = searchParams.get("dryRun") === "1";
  const limit = parseLimit(searchParams.get("limit"));

  try {
    const result = await runReviewDueReminderJob({
      dryRun,
      limit,
    });

    await captureReviewDueReminderJobEvent({
      status: result.failed > 0 ? "processed_with_failures" : "processed",
      metadata: result,
    });

    return Response.json(result);
  } catch (error) {
    Sentry.captureException(error);

    await captureReviewDueReminderJobEvent({
      level: OperationalEventLevel.ERROR,
      status: "failed",
      message: getErrorMessage(error),
      metadata: getErrorMetadata(error),
    });

    return Response.json(
      {
        error: getErrorMessage(error),
      },
      {
        status: 500,
      },
    );
  }
}
