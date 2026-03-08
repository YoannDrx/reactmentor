import * as Sentry from "@sentry/nextjs";
import { getServerSentryOptions, isSentryConfigured } from "@/lib/sentry";

if (isSentryConfigured()) {
  Sentry.init(getServerSentryOptions());
}
