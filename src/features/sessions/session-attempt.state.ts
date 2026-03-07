export type RecordAttemptActionState = {
  status: "idle" | "success" | "error";
  feedbackStatus: "correct" | "incorrect" | "pending_review" | null;
  formError:
    | "unauthorized"
    | "invalid"
    | "unsupported"
    | "expired"
    | "unknown"
    | null;
};

export const initialRecordAttemptActionState: RecordAttemptActionState = {
  status: "idle",
  feedbackStatus: null,
  formError: null,
};
