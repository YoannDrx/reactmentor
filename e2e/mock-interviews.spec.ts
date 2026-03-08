import { expect, test } from "@playwright/test";
import {
  completeOnboardingIfNeeded,
  completeStructuredSession,
  createTestUser,
  signUpWithEmail,
  upgradeUserToPlan,
} from "./test-helpers";

test.describe("mock interviews", () => {
  test.setTimeout(60_000);

  test("completes a timed mock and exposes the report in history", async ({
    page,
  }) => {
    const testUser = createTestUser("react-mentor-mock");

    await signUpWithEmail(page, testUser);
    await upgradeUserToPlan({
      email: testUser.email,
    });
    await completeOnboardingIfNeeded(page);

    await page.goto("/dashboard/mock-interviews");
    await page.waitForLoadState("networkidle");

    const launchButton = page.getByRole("button", {
      name: /Launch template|Lancer le template/,
    });

    await expect(launchButton.first()).toBeVisible({ timeout: 15_000 });
    await launchButton.first().click();

    await expect(page).toHaveURL(/\/dashboard\/session\//);
    await expect(page.getByText(/Time left|Temps restant/)).toBeVisible();

    await completeStructuredSession(page, {
      maxQuestions: 12,
    });
    await expect(
      page.getByText(/Pending review|En review/).first(),
    ).toBeVisible();
    await expect(
      page.getByText(/Skills tested in this mock|Skills testees dans ce mock/),
    ).toBeVisible();

    await page.goto("/dashboard/mock-interviews");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", {
        name: /Mock performance readout|Lecture de performance mock/,
      }),
    ).toBeVisible();
    await expect(
      page.getByRole("link", {
        name: /Open report|Ouvrir le rapport/,
      }),
    ).toBeVisible();
  });
});
