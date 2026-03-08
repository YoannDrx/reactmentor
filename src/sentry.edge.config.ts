import * as Sentry from "@sentry/nextjs";
import { getEdgeSentryOptions, isSentryConfigured } from "@/lib/sentry";

if (isSentryConfigured()) {
  Sentry.init(getEdgeSentryOptions());
}
