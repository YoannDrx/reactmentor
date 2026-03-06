import { describe, expect, it } from "vitest";
import { sanitizeCallbackUrl } from "@/lib/auth/auth-utils";

describe("sanitizeCallbackUrl", () => {
  it("returns the fallback when callback is missing", () => {
    expect(sanitizeCallbackUrl(undefined)).toBe("/dashboard");
  });

  it("keeps safe relative callback urls", () => {
    expect(sanitizeCallbackUrl("/dashboard/review")).toBe("/dashboard/review");
  });

  it("rejects absolute callback urls", () => {
    expect(sanitizeCallbackUrl("https://evil.com")).toBe("/dashboard");
  });

  it("rejects protocol-relative callback urls", () => {
    expect(sanitizeCallbackUrl("//evil.com")).toBe("/dashboard");
  });

  it("uses the provided fallback when callback is unsafe", () => {
    expect(sanitizeCallbackUrl("https://evil.com", "/auth/signin")).toBe(
      "/auth/signin",
    );
  });
});
