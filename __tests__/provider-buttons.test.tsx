import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProviderButtons } from "@/features/auth/provider-buttons";
import { messages } from "@/i18n/messages";
import { mockAuthClient, mockToast } from "@test/mocks";
import { renderWithApp } from "@test/render";

describe("ProviderButtons", () => {
  const authMessages = messages.en.auth;

  it("shows the readiness state when no provider is configured", () => {
    renderWithApp(<ProviderButtons providers={[]} />);

    expect(screen.getByText(authMessages.social.readyTitle)).toBeVisible();
    expect(screen.getByText(authMessages.social.readyDescription)).toBeVisible();
  });

  it("renders only the enabled providers", () => {
    renderWithApp(<ProviderButtons providers={["google"]} />);

    expect(
      screen.getByRole("button", { name: authMessages.social.continueWithGoogle }),
    ).toBeVisible();
    expect(
      screen.queryByRole("button", {
        name: authMessages.social.continueWithGithub,
      }),
    ).not.toBeInTheDocument();
  });

  it("starts the provider flow with the sanitized callback", async () => {
    mockAuthClient.signIn.social.mockResolvedValue({
      data: { url: "https://accounts.google.com" },
      error: null,
    });

    const { user } = renderWithApp(
      <ProviderButtons
        providers={["github", "google"]}
        callbackUrl="/dashboard/mock-interviews"
      />,
    );

    await user.click(
      screen.getByRole("button", { name: authMessages.social.continueWithGoogle }),
    );

    await waitFor(() => {
      expect(mockAuthClient.signIn.social).toHaveBeenCalledWith({
        provider: "google",
        callbackURL: "/dashboard/mock-interviews",
      });
    });
  });

  it("falls back to /dashboard for unsafe provider callbacks", async () => {
    mockAuthClient.signIn.social.mockResolvedValue({
      data: { url: "https://accounts.google.com" },
      error: null,
    });

    const { user } = renderWithApp(
      <ProviderButtons providers={["google"]} callbackUrl="https://evil.com" />,
    );

    await user.click(
      screen.getByRole("button", { name: authMessages.social.continueWithGoogle }),
    );

    await waitFor(() => {
      expect(mockAuthClient.signIn.social).toHaveBeenCalledWith({
        provider: "google",
        callbackURL: "/dashboard",
      });
    });
  });

  it("shows provider errors via toast", async () => {
    mockAuthClient.signIn.social.mockResolvedValue({
      data: null,
      error: { message: "OAuth is unavailable" },
    });

    const { user } = renderWithApp(
      <ProviderButtons providers={["google"]} callbackUrl="/dashboard" />,
    );

    await user.click(
      screen.getByRole("button", { name: authMessages.social.continueWithGoogle }),
    );

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("OAuth is unavailable");
    });
  });

  it("preserves the callback url in the sign up link", () => {
    renderWithApp(
      <ProviderButtons providers={["github"]} callbackUrl="/dashboard/modules" />,
    );

    expect(
      screen.getByRole("link", { name: authMessages.actions.createInstead }),
    ).toHaveAttribute(
      "href",
      "/auth/signup?callbackUrl=%2Fdashboard%2Fmodules",
    );
  });
});
