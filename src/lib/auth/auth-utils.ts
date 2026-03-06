export function sanitizeCallbackUrl(
  callbackUrl: string | undefined,
  fallback = "/dashboard",
) {
  if (!callbackUrl) return fallback;
  if (!callbackUrl.startsWith("/")) return fallback;
  if (callbackUrl.startsWith("//")) return fallback;
  return callbackUrl;
}
