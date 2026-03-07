export type RecordAttemptActionState = {
  status: "idle" | "success" | "error";
  formError: "unauthorized" | "invalid" | "expired" | "unknown" | null;
};

export const initialRecordAttemptActionState: RecordAttemptActionState = {
  status: "idle",
  formError: null,
};
