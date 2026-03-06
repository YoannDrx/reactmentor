import { screen, waitFor } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { SignUpForm } from "@/features/auth/sign-up-form";
import { messages } from "@/i18n/messages";
import { mockAuthClient, mockRouter, mockToast } from "@test/mocks";
import { renderWithApp } from "@test/render";

describe("SignUpForm", () => {
  const authMessages = messages.en.auth;

  it("blocks submission when passwords do not match", async () => {
    const { user } = renderWithApp(<SignUpForm />);

    await user.type(screen.getByLabelText(authMessages.fields.name), "John Doe");
    await user.type(
      screen.getByLabelText(authMessages.fields.email),
      "john@example.com",
    );
    await user.type(
      screen.getByLabelText(authMessages.fields.password),
      "password123",
    );
    await user.type(
      screen.getByLabelText(authMessages.fields.confirmPassword),
      "password321",
    );
    await user.click(
      screen.getByRole("button", { name: authMessages.actions.createAccount }),
    );

    expect(
      await screen.findByText(authMessages.errors.passwordsMismatch),
    ).toBeVisible();
    expect(mockAuthClient.signUp.email).not.toHaveBeenCalled();
  });

  it("submits signup data and redirects to the safe callback", async () => {
    mockAuthClient.signUp.email.mockResolvedValue({
      data: { success: true },
      error: null,
    });

    const { user } = renderWithApp(<SignUpForm callbackUrl="/dashboard" />);

    await user.type(screen.getByLabelText(authMessages.fields.name), "John Doe");
    await user.type(
      screen.getByLabelText(authMessages.fields.email),
      "john@example.com",
    );
    await user.type(
      screen.getByLabelText(authMessages.fields.password),
      "password123",
    );
    await user.type(
      screen.getByLabelText(authMessages.fields.confirmPassword),
      "password123",
    );
    await user.click(
      screen.getByRole("button", { name: authMessages.actions.createAccount }),
    );

    await waitFor(() => {
      expect(mockAuthClient.signUp.email).toHaveBeenCalledWith({
        name: "John Doe",
        email: "john@example.com",
        password: "password123",
      });
    });

    expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
    expect(mockRouter.refresh).toHaveBeenCalled();
    expect(mockToast.success).toHaveBeenCalledWith(
      authMessages.toasts.workspaceCreated,
    );
  });

  it("falls back to /dashboard when the callback is unsafe", async () => {
    mockAuthClient.signUp.email.mockResolvedValue({
      data: { success: true },
      error: null,
    });

    const { user } = renderWithApp(<SignUpForm callbackUrl="https://evil.com" />);

    await user.type(screen.getByLabelText(authMessages.fields.name), "John Doe");
    await user.type(
      screen.getByLabelText(authMessages.fields.email),
      "john@example.com",
    );
    await user.type(
      screen.getByLabelText(authMessages.fields.password),
      "password123",
    );
    await user.type(
      screen.getByLabelText(authMessages.fields.confirmPassword),
      "password123",
    );
    await user.click(
      screen.getByRole("button", { name: authMessages.actions.createAccount }),
    );

    await waitFor(() => {
      expect(mockAuthClient.signUp.email).toHaveBeenCalled();
    });

    expect(mockRouter.push).toHaveBeenCalledWith("/dashboard");
  });

  it("shows the returned auth error", async () => {
    mockAuthClient.signUp.email.mockResolvedValue({
      data: null,
      error: { message: "Account already exists" },
    });

    const { user } = renderWithApp(<SignUpForm />);

    await user.type(screen.getByLabelText(authMessages.fields.name), "John Doe");
    await user.type(
      screen.getByLabelText(authMessages.fields.email),
      "john@example.com",
    );
    await user.type(
      screen.getByLabelText(authMessages.fields.password),
      "password123",
    );
    await user.type(
      screen.getByLabelText(authMessages.fields.confirmPassword),
      "password123",
    );
    await user.click(
      screen.getByRole("button", { name: authMessages.actions.createAccount }),
    );

    await waitFor(() => {
      expect(mockToast.error).toHaveBeenCalledWith("Account already exists");
    });
  });

  it("keeps the callback url in the sign in link", () => {
    renderWithApp(<SignUpForm callbackUrl="/dashboard/review" />);

    expect(
      screen.getByRole("link", { name: authMessages.signUp.footerAction }),
    ).toHaveAttribute(
      "href",
      "/auth/signin?callbackUrl=%2Fdashboard%2Freview",
    );
  });
});
