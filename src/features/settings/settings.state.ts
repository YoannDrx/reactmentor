export type SettingsFieldName =
  | "targetRole"
  | "targetLevel"
  | "weeklyGoal"
  | "preferredTracks"
  | "focusMode";

export type SettingsFieldErrorCode =
  | "invalid"
  | "tooLong"
  | "tooSmall"
  | "tooBig"
  | "required";

export type SettingsActionState = {
  status: "idle" | "success" | "error";
  fieldErrors: Partial<Record<SettingsFieldName, SettingsFieldErrorCode>>;
  formError: "unauthorized" | "unknown" | null;
};

export const initialSettingsActionState: SettingsActionState = {
  status: "idle",
  fieldErrors: {},
  formError: null,
};
