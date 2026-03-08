import { QuestionLevel, Track } from "@prisma/client";
import { z } from "zod";
import { focusModeValues } from "./user-preferences";
import type {
  SettingsFieldErrorCode,
  SettingsFieldName,
} from "./settings.state";

export const settingsSchema = z.object({
  targetRole: z.string().trim().min(1).max(120),
  targetLevel: z.nativeEnum(QuestionLevel),
  weeklyGoal: z.coerce.number().int().min(5).max(150),
  preferredTracks: z.array(z.nativeEnum(Track)).min(1).max(4),
  focusMode: z.enum(focusModeValues),
  lifecycleEmailsEnabled: z.boolean().default(true),
});

function getFieldErrorCode(
  fieldName: SettingsFieldName,
  issue: z.ZodIssue,
): SettingsFieldErrorCode {
  if (issue.code === "too_big") {
    return fieldName === "targetRole" ? "tooLong" : "tooBig";
  }

  if (issue.code === "too_small") {
    return issue.minimum === 1 ? "required" : "tooSmall";
  }

  if (issue.code === "invalid_value") {
    return "invalid";
  }

  return "invalid";
}

export function collectFieldErrors(error: z.ZodError) {
  const fieldErrors: Partial<Record<SettingsFieldName, SettingsFieldErrorCode>> = {};

  for (const issue of error.issues) {
    const fieldName = issue.path[0];

    if (!fieldName || typeof fieldName !== "string") {
      continue;
    }

    if (fieldName in fieldErrors) {
      continue;
    }

    fieldErrors[fieldName as SettingsFieldName] = getFieldErrorCode(
      fieldName as SettingsFieldName,
      issue,
    );
  }

  return fieldErrors;
}
