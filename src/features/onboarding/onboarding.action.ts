"use server";

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

  const parsed = settingsSchema.safeParse({
    targetRole: String(formData.get("targetRole") ?? ""),
    targetLevel: String(formData.get("targetLevel") ?? ""),
    weeklyGoal: formData.get("weeklyGoal"),
    preferredTracks: formData.getAll("preferredTracks").map(String),
    focusMode: String(formData.get("focusMode") ?? ""),
  });

  if (!parsed.success) {
    return {
      status: "error",
      fieldErrors: collectFieldErrors(parsed.error),
      formError: null,
    };
  }

  try {
    await updateUserPreferences(user.id, parsed.data);
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
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/settings");
  } catch (error) {
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
