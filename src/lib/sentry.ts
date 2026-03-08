import type {
  BrowserOptions,
  EdgeOptions,
  NodeOptions,
} from "@sentry/nextjs";
import { env } from "@/lib/env";

function resolveSentryEnvironment() {
  return (
    env.NEXT_PUBLIC_SENTRY_ENVIRONMENT ??
    env.SENTRY_ENVIRONMENT ??
    process.env.NODE_ENV ??
    "development"
  );
}

function resolveSentryTracesSampleRate() {
  return (
    env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE ??
    env.SENTRY_TRACES_SAMPLE_RATE ??
    (process.env.NODE_ENV === "development" ? 1 : 0.1)
  );
}

function getBaseSentryOptions() {
  const dsn = env.NEXT_PUBLIC_SENTRY_DSN ?? undefined;

  return {
    dsn,
    enabled: Boolean(dsn),
    environment: resolveSentryEnvironment(),
    tracesSampleRate: resolveSentryTracesSampleRate(),
    enableLogs: true,
  };
}

export function isSentryConfigured() {
  return Boolean(env.NEXT_PUBLIC_SENTRY_DSN);
}

export function getClientSentryOptions(): BrowserOptions {
  return {
    ...getBaseSentryOptions(),
    sendDefaultPii: false,
  };
}

export function getServerSentryOptions(): NodeOptions {
  return {
    ...getBaseSentryOptions(),
    sendDefaultPii: true,
  };
}

export function getEdgeSentryOptions(): EdgeOptions {
  return {
    ...getBaseSentryOptions(),
    sendDefaultPii: false,
  };
}
