import { expect, test } from "@playwright/test";
import {
  completeOnboardingIfNeeded,
  createTestUser,
  signUpWithEmail,
} from "./test-helpers";

test.describe("dashboard overview", () => {
  test("surfaces the recommended module path for a first-run learner", async ({
    page,
  }) => {
    const testUser = createTestUser("react-mentor-dashboard-rec");

    await signUpWithEmail(page, testUser);
    await completeOnboardingIfNeeded(page);

    await expect(page).toHaveURL(/\/dashboard$/);

    const openRecommendedModuleButton = page.getByRole("link", {
      name: /Open recommended module|Ouvrir le module recommande/,
    });

    await expect(openRecommendedModuleButton).toBeVisible();
    await openRecommendedModuleButton.click();

    await expect(page).toHaveURL(/\/dashboard\/modules\/.+$/);
  });

  test("launches a recommended mock directly from the overview", async ({ page }) => {
    const testUser = createTestUser("react-mentor-dashboard");

    await signUpWithEmail(page, testUser);
    await completeOnboardingIfNeeded(page);

    await expect(page).toHaveURL(/\/dashboard$/);

    const launchMockButton = page.getByRole("button", {
      name: /Launch this mock|Lancer ce mock/,
    });

    await expect(launchMockButton.first()).toBeVisible();
    await launchMockButton.first().click();

    await expect(page).toHaveURL(/\/dashboard\/session\//);
    await expect(
      page.getByText(/Time left|Temps restant/),
    ).toBeVisible();
    await expect(
      page.getByRole("button", {
        name: /Submit answer|Valider la reponse/,
      }),
    ).toBeVisible();
  });
});
