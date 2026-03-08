import { Resend } from "resend";
import { env } from "@/lib/env";

let resendClient: Resend | null = null;

export function isResendConfigured() {
  return Boolean(env.RESEND_API_KEY);
}

export function getResendServerClient() {
  if (!env.RESEND_API_KEY) {
    throw new Error("Resend API key is not configured.");
  }

  resendClient ??= new Resend(env.RESEND_API_KEY);
  return resendClient;
}
