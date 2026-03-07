import { expect, test } from "@playwright/test";
import {
  completeOnboardingIfNeeded,
  createTestUser,
  signUpWithEmail,
} from "./test-helpers";

test.describe("practice flow", () => {
  test("creates and completes a practice session from a module", async ({ page }) => {
    const testUser = createTestUser("react-mentor-practice");

    await signUpWithEmail(page, testUser);
    await completeOnboardingIfNeeded(page);

    await page.goto("/dashboard/modules/react-rendering-systems");
    await page.waitForLoadState("networkidle");

    const launchButton = page.getByRole("button", {
      name: /Launch practice session|Lancer une session practice/,
    });

    await expect(launchButton).toBeVisible({ timeout: 15_000 });
    await launchButton.click();

    await expect(page).toHaveURL(/\/dashboard\/session\//);
    await expect(
      page.getByText(
        /Does changing a key always force|Une key differente force-t-elle toujours/i,
      ),
    ).toBeVisible();

    await page.keyboard.press("2");
    await page.keyboard.press("Enter");

    const completionHeading = page.getByRole("heading", {
      name: /Session completed|Session terminee/,
    });
    const mechanismPanel = page.getByText(/Mechanism|Mecanisme/);

    const resolvedStep = await Promise.race([
      completionHeading.waitFor({ state: "visible", timeout: 10_000 }).then(() => "completed"),
      mechanismPanel.waitFor({ state: "visible", timeout: 10_000 }).then(() => "feedback"),
    ]);

    if (resolvedStep === "feedback") {
      await expect(
        page.getByText(/Correct|Incorrect/),
      ).toBeVisible();
      await page.keyboard.press("Enter");
    }

    await expect(completionHeading).toBeVisible();
    await expect(page.getByText(/^100%$/)).toBeVisible();
  });
});
