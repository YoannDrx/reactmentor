import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SignInForm } from "@/features/auth/sign-in-form";
import { messages } from "@/i18n/messages";
import { mockAuthClient, mockRouter, mockToast } from "@test/mocks";
import { renderWithApp } from "@test/render";

describe("SignInForm", () => {
  const authMessages = messages.en.auth;

  it("submits credentials and redirects to the safe callback", async () => {
    mockAuthClient.signIn.email.mockResolvedValue({
      data: { success: true },
      error: null,
    });

    const { user } = renderWithApp(<SignInForm callbackUrl="/dashboard/review" />);

    await user.type(
      screen.getByLabelText(authMessages.fields.email),
      "john@example.com",
    );
    await user.type(
      screen.getByLabelText(authMessages.fields.password),
      "password123",
    );
    await user.click(
      screen.getByRole("button", { name: authMessages.actions.accessDashboard }),
    );

    await waitFor(() => {
      expect(mockAuthClient.signIn.email).toHaveBeenCalledWith({
        email: "john@example.com",
        password: "password123",
        rememberMe: true,
      });
    });

    expect(mockRouter.push).toHaveBeenCalledWith("/dashboard/review");
    expect(mockRouter.refresh).toHaveBeenCalled();
    expect(mockToast.success).toHaveBeenCalledWith(authMessages.toasts.welcomeBack);
  });

  it("falls back to /dashboard for unsafe callback urls", async () => {
    mockAuthClient.signIn.email.mockResolvedValue({
      data: { success: true },
      error: null,
    });

    const { user } = renderWithApp(
      <SignInForm callbackUrl="https://evil.com/dashboard" />,
    );

    await user.type(
      screen.getByLabelText(authMessages.fields.email),
      "john@example.com",
    );
    await user.type(
      screen.getByLabelText(authMessages.fields.password),
      "password123",
    );
    await user.click(
      screen.getByRole("button", { name: authMessages.actions.accessDashboard }),
    );

    await waitFor(() => {
      expect(mockAuthClient.signIn.email).toHaveBeenCalled();
    });

    expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
  });

  it("shows validation messages and does not submit invalid data", async () => {
    const { user } = renderWithApp(<SignInForm />);

    await user.type(
      screen.getByLabelText(authMessages.fields.email),
      "john@example.com",
    );
    await user.type(screen.getByLabelText(authMessages.fields.password), "123");
    await user.click(
      screen.getByRole("button", { name: authMessages.actions.accessDashboard }),
    );

    expect(await screen.findByText(authMessages.errors.passwordMin)).toBeVisible();
    expect(mockAuthClient.signIn.email).not.toHaveBeenCalled();
  });

  it("shows the auth error returned by the client", async () => {
    mockAuthClient.signIn.email.mockResolvedValue({
      data: null,
      error: { message: "Invalid credentials" },
    });

    const { user } = renderWithApp(<SignInForm />);

    await user.type(
      screen.getByLabelText(authMessages.fields.email),
      "john@example.com",
    );
    await user.type(
      screen.getByLabelText(authMessages.fields.password),
      "password123",
    );
    await user.click(
      screen.getByRole("button", { name: authMessages.actions.accessDashboard }),
    );

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("Invalid credentials");
    });
  });

  it("keeps the callback url in the sign up link", () => {
    renderWithApp(<SignInForm callbackUrl="/dashboard/modules" />);

    expect(
      screen.getByRole("link", { name: authMessages.actions.needAccount }),
    ).toHaveAttribute(
      "href",
      "/auth/signup?callbackUrl=%2Fdashboard%2Fmodules",
    );
  });
});
