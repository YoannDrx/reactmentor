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

    await page.goto("/dashboard/mock-interviews");
    await page.waitForLoadState("networkidle");

    const launchMockButton = page.getByRole("button", {
      name: /Launch template|Lancer le template/,
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

  test("saves the current live question into bookmarks and surfaces it on the dedicated page", async ({
    page,
  }) => {
    const testUser = createTestUser("react-mentor-bookmarks");

    await signUpWithEmail(page, testUser);
    await completeOnboardingIfNeeded(page);

    await expect(page).toHaveURL(/\/dashboard$/);

    const launchMockButton = page.getByRole("button", {
      name: /Launch this mock|Lancer ce mock/,
    });

    await expect(launchMockButton.first()).toBeVisible();
    await launchMockButton.first().click();

    await expect(page).toHaveURL(/\/dashboard\/session\//);

    const currentQuestion = page.getByText(
      /Does changing a key always force|Une key differente force-t-elle toujours/i,
    );
    await expect(currentQuestion).toBeVisible();

    const saveBookmarkButton = page.getByRole("button", {
      name: /Save question|Sauvegarder/,
    });

    await saveBookmarkButton.click();
    await expect(
      page.getByRole("button", {
        name: /Remove bookmark|Retirer/,
      }),
    ).toBeVisible({ timeout: 15_000 });

    await page.goto("/dashboard/bookmarks");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", {
        name: /Saved questions|Questions sauvegardees/,
      }),
    ).toBeVisible();
    await expect(
      page.getByText(
        /Does changing a key always force|Une key differente force-t-elle toujours/i,
      ),
    ).toBeVisible();

    await page.getByRole("button", {
      name: /Remove bookmark|Retirer/,
    }).click();
    await expect(
      page.getByText(
        /No saved question yet|Aucune question sauvegardee pour l'instant/,
      ),
    ).toBeVisible({ timeout: 15_000 });
  });

  test("writes a note from bookmarks and finds it in the notes recap", async ({
    page,
  }) => {
    const testUser = createTestUser("react-mentor-notes");

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
      page.getByText(
        /Does changing a key always force|Une key differente force-t-elle toujours/i,
      ),
    ).toBeVisible();

    await page.getByRole("button", {
      name: /Save question|Sauvegarder/,
    }).click();
    await expect(
      page.getByRole("button", {
        name: /Remove bookmark|Retirer/,
      }),
    ).toBeVisible({ timeout: 15_000 });

    await page.goto("/dashboard/bookmarks");
    await page.waitForLoadState("networkidle");

    const noteField = page.getByPlaceholder(
      /Write the mechanism|Ecris le mecanisme/i,
    );
    await noteField.fill("Lead with identity, then explain what a key actually resets.");
    await page.getByRole("button", {
      name: /Save note|Enregistrer la note/,
    }).click();

    await page.reload();
    await expect(page.getByPlaceholder(/Write the mechanism|Ecris le mecanisme/i)).toHaveValue(
      "Lead with identity, then explain what a key actually resets.",
      {
        timeout: 15_000,
      },
    );

    await page.goto("/dashboard/notes");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByRole("heading", {
        name: /Personal notes|Notes personnelles/,
      }),
    ).toBeVisible();
  });
});
