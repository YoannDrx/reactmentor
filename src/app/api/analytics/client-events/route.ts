import { ProductAnalyticsEventName } from "@prisma/client";
import { z } from "zod";
import {
  ensureAccountCreatedAnalyticsEvent,
  toContentLocale,
} from "@/features/telemetry/telemetry";
import { getUser } from "@/lib/auth/auth-user";

const clientEventSchema = z.object({
  name: z.literal(ProductAnalyticsEventName.ACCOUNT_CREATED),
  source: z.string().trim().min(1).max(120).optional(),
  locale: z.enum(["fr", "en"]).optional(),
});

export async function POST(request: Request) {
  const user = await getUser();

  if (!user) {
    return new Response("Unauthorized", {
      status: 401,
    });
  }

  const body = await request.json().catch(() => null);
  const parsed = clientEventSchema.safeParse(body);

  if (!parsed.success) {
    return new Response("Invalid client event payload.", {
      status: 400,
    });
  }

  await ensureAccountCreatedAnalyticsEvent({
    userId: user.id,
    source: parsed.data.source ?? "auth.signup.client",
    locale: toContentLocale(parsed.data.locale),
  });

  return new Response(null, {
    status: 204,
  });
}
