import * as Sentry from "@sentry/nextjs";
import { getClientSentryOptions, isSentryConfigured } from "@/lib/sentry";

if (isSentryConfigured()) {
  Sentry.init(getClientSentryOptions());
}

export const onRouterTransitionStart = Sentry.captureRouterTransitionStart;
