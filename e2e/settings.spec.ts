import { expect, test } from "@playwright/test";
import {
  completeOnboardingIfNeeded,
  createTestUser,
  signUpWithEmail,
} from "./test-helpers";

test.describe("settings", () => {
  test("updates preferences and keeps the billing summary visible", async ({
    page,
  }) => {
    const testUser = createTestUser("react-mentor-settings");

    await signUpWithEmail(page, testUser);
    await completeOnboardingIfNeeded(page);

    await page.goto("/dashboard/settings");
    await page.waitForLoadState("networkidle");

    const targetRoleField = page.locator('input[name="targetRole"]');
    const weeklyGoalField = page.locator('input[name="weeklyGoal"]');
    const saveButton = page.getByRole("button", {
      name: /Save setup|Enregistrer/i,
    });

    await expect(targetRoleField).toBeVisible();
    await targetRoleField.fill("Senior Frontend Platform Engineer");
    await weeklyGoalField.fill("45");
    await page
      .locator('input[name="targetLevel"][value="SENIOR"]')
      .check({ force: true });
    await saveButton.click();

    await expect(
      page.getByText(/Preferences updated|Preferences mises a jour/i),
    ).toBeVisible({ timeout: 15_000 });
    await expect(
      page.getByText(/Billing and entitlements|Billing et entitlements/i),
    ).toBeVisible();

    await page.reload();
    await page.waitForLoadState("networkidle");

    await expect(targetRoleField).toHaveValue(
      "Senior Frontend Platform Engineer",
    );
    await expect(weeklyGoalField).toHaveValue("45");
    await expect(
      page.getByText("Senior Frontend Platform Engineer", { exact: true }),
    ).toBeVisible();
  });
});
