"use server";

import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import {
  OperationalEventLevel,
  ProductAnalyticsEventName,
} from "@prisma/client";
import { getUser } from "@/lib/auth/auth-user";
import {
  captureOperationalEvent,
  captureProductAnalyticsEvent,
  getErrorMessage,
  getErrorMetadata,
} from "@/features/telemetry/telemetry";
import {
  collectFieldErrors,
  settingsSchema,
} from "@/features/settings/settings.validation";
import type { SettingsActionState } from "@/features/settings/settings.state";
import { updateUserPreferences } from "@/features/settings/user-preferences";
import { sendWelcomeLifecycleEmail } from "@/features/emails/lifecycle-email";
import { getLocale } from "@/i18n/server";

export async function completeOnboardingAction(
  _previousState: SettingsActionState,
  formData: FormData,
): Promise<SettingsActionState> {
  const user = await getUser();

  if (!user) {
    return {
      status: "error",
      fieldErrors: {},
      formError: "unauthorized",
    };
  }

  const locale = await getLocale();
  const parsed = settingsSchema.safeParse({
    targetRole: String(formData.get("targetRole") ?? ""),
    targetLevel: String(formData.get("targetLevel") ?? ""),
    weeklyGoal: formData.get("weeklyGoal"),
    preferredTracks: formData.getAll("preferredTracks").map(String),
    focusMode: String(formData.get("focusMode") ?? ""),
    lifecycleEmailsEnabled:
      formData.get("lifecycleEmailsEnabled") === null
        ? true
        : formData.get("lifecycleEmailsEnabled") === "on",
  });

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: collectFieldErrors(parsed.error),
      formError: null,
    };
  }

  try {
    const updatedPreference = await updateUserPreferences(user.id, parsed.data);
    await captureProductAnalyticsEvent({
      userId: user.id,
      name: ProductAnalyticsEventName.ONBOARDING_COMPLETED,
      source: "onboarding.action",
      metadata: {
        targetLevel: parsed.data.targetLevel,
        weeklyGoal: parsed.data.weeklyGoal,
        preferredTrackCount: parsed.data.preferredTracks.length,
        focusMode: parsed.data.focusMode,
      },
    });
    await sendWelcomeLifecycleEmail({
      userId: user.id,
      recipient: user.email,
      userName: user.name,
      locale,
      targetRole: updatedPreference.targetRole,
      preferredTracks: updatedPreference.preferredTracks,
      lifecycleEmailsEnabled: updatedPreference.lifecycleEmailsEnabled,
    });
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
  } catch (error) {
    Sentry.captureException(error);
    await captureOperationalEvent({
      userId: user.id,
      source: "onboarding.action",
      eventType: "complete_onboarding_failed",
      level: OperationalEventLevel.ERROR,
      status: "failed",
      message: getErrorMessage(error),
      metadata: getErrorMetadata(error),
    });

    return {
      status: "error",
      fieldErrors: {},
      formError: "unknown",
    };
  }

  redirect("/dashboard");
}
