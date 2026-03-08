"use server";

import * as Sentry from "@sentry/nextjs";
import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/auth/auth-user";
import { updateUserPreferences } from "./user-preferences";
import type { SettingsActionState } from "./settings.state";
import { collectFieldErrors, settingsSchema } from "./settings.validation";

export async function updateSettingsAction(
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
    lifecycleEmailsEnabled: formData.get("lifecycleEmailsEnabled") === "on",
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
    revalidatePath("/dashboard");
    revalidatePath("/dashboard/progress");
    revalidatePath("/dashboard/review");
    revalidatePath("/dashboard/settings");

    return {
      status: "success",
      fieldErrors: {},
      formError: null,
    };
  } catch (error) {
    Sentry.captureException(error);

    return {
      status: "error",
      fieldErrors: {},
      formError: "unknown",
    };
  }
}
