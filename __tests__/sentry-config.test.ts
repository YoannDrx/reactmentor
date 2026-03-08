import { beforeEach, describe, expect, it, vi } from "vitest";

const envMock = vi.hoisted(() => ({
  env: {
    NEXT_PUBLIC_SENTRY_DSN: undefined as string | undefined,
    NEXT_PUBLIC_SENTRY_ENVIRONMENT: undefined as string | undefined,
    NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE: undefined as number | undefined,
    SENTRY_ENVIRONMENT: undefined as string | undefined,
    SENTRY_TRACES_SAMPLE_RATE: undefined as number | undefined,
  },
}));

vi.mock("@/lib/env", () => envMock);

import {
  getClientSentryOptions,
  getServerSentryOptions,
  isSentryConfigured,
} from "@/lib/sentry";

describe("sentry config", () => {
  beforeEach(() => {
    envMock.env.NEXT_PUBLIC_SENTRY_DSN = undefined;
    envMock.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT = undefined;
    envMock.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE = undefined;
    envMock.env.SENTRY_ENVIRONMENT = undefined;
    envMock.env.SENTRY_TRACES_SAMPLE_RATE = undefined;
  });

  it("stays disabled when no DSN is configured", () => {
    expect(isSentryConfigured()).toBe(false);
    expect(getClientSentryOptions()).toEqual(
      expect.objectContaining({
        dsn: undefined,
        enabled: false,
        sendDefaultPii: false,
      }),
    );
  });

  it("builds client and server options from the configured environment", () => {
    envMock.env.NEXT_PUBLIC_SENTRY_DSN = "https://public@example.ingest.sentry.io/1";
    envMock.env.NEXT_PUBLIC_SENTRY_ENVIRONMENT = "preview";
    envMock.env.NEXT_PUBLIC_SENTRY_TRACES_SAMPLE_RATE = 0.25;

    expect(isSentryConfigured()).toBe(true);
    expect(getClientSentryOptions()).toEqual(
      expect.objectContaining({
        dsn: "https://public@example.ingest.sentry.io/1",
        enabled: true,
        environment: "preview",
        tracesSampleRate: 0.25,
        sendDefaultPii: false,
      }),
    );
    expect(getServerSentryOptions()).toEqual(
      expect.objectContaining({
        dsn: "https://public@example.ingest.sentry.io/1",
        enabled: true,
        environment: "preview",
        tracesSampleRate: 0.25,
        sendDefaultPii: true,
      }),
    );
  });
});
