import { expect, test } from "@playwright/test";
import {
  SESSION_LAUNCH_TIMEOUT_MS,
  completeOnboardingIfNeeded,
  createTestUser,
  signUpWithEmail,
} from "./test-helpers";

test.describe("dashboard overview", () => {
  test.describe.configure({ timeout: 90_000 });

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

    await expect(launchMockButton.first()).toBeVisible({
      timeout: SESSION_LAUNCH_TIMEOUT_MS,
    });
    await Promise.all([
      page.waitForURL(/\/dashboard\/session\//, {
        timeout: SESSION_LAUNCH_TIMEOUT_MS,
      }),
      launchMockButton.first().click(),
    ]);

    await expect(
      page.getByText(/Time left|Temps restant/),
    ).toBeVisible({ timeout: SESSION_LAUNCH_TIMEOUT_MS });
    await expect(
      page.getByRole("button", {
        name: /Submit answer|Valider la reponse/,
      }),
    ).toBeVisible({ timeout: SESSION_LAUNCH_TIMEOUT_MS });
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

    await expect(launchMockButton.first()).toBeVisible({
      timeout: SESSION_LAUNCH_TIMEOUT_MS,
    });
    await Promise.all([
      page.waitForURL(/\/dashboard\/session\//, {
        timeout: SESSION_LAUNCH_TIMEOUT_MS,
      }),
      launchMockButton.first().click(),
    ]);

    const currentQuestion = page.locator("main .font-display.text-3xl").first();
    await expect(currentQuestion).toBeVisible({
      timeout: SESSION_LAUNCH_TIMEOUT_MS,
    });
    const liveQuestionPrompt = (await currentQuestion.textContent())?.trim();

    expect(liveQuestionPrompt).toBeTruthy();
    await expect(
      page.getByRole("button", {
        name: /Save question|Sauvegarder/,
      }),
    ).toBeVisible({
      timeout: SESSION_LAUNCH_TIMEOUT_MS,
    });

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
    await expect(
      page.getByRole("heading", {
        name: /Saved questions|Questions sauvegardees/,
      }),
    ).toBeVisible({ timeout: SESSION_LAUNCH_TIMEOUT_MS });
    await expect(
      page.getByText(liveQuestionPrompt ?? "", { exact: true }),
    ).toBeVisible();

    const removeBookmarkButton = page.getByRole("button", {
      name: /Remove bookmark|Retirer/,
    });
    await Promise.all([
      page.waitForResponse(
        (response) =>
          response.request().method() === "POST" &&
          response.url().includes("/dashboard/bookmarks"),
        {
          timeout: SESSION_LAUNCH_TIMEOUT_MS,
        },
      ),
      removeBookmarkButton.click(),
    ]);
    await page.reload();
    await expect(
      page.getByText(
        /No saved question yet|Aucune question sauvegardee pour l'instant/,
      ),
    ).toBeVisible({ timeout: SESSION_LAUNCH_TIMEOUT_MS });
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

    await expect(launchMockButton.first()).toBeVisible({
      timeout: SESSION_LAUNCH_TIMEOUT_MS,
    });
    await Promise.all([
      page.waitForURL(/\/dashboard\/session\//, {
        timeout: SESSION_LAUNCH_TIMEOUT_MS,
      }),
      launchMockButton.first().click(),
    ]);

    const currentQuestion = page.locator("main .font-display.text-3xl").first();
    await expect(currentQuestion).toBeVisible({
      timeout: SESSION_LAUNCH_TIMEOUT_MS,
    });
    const liveQuestionPrompt = (await currentQuestion.textContent())?.trim();

    expect(liveQuestionPrompt).toBeTruthy();
    await expect(
      page.getByRole("button", {
        name: /Save question|Sauvegarder/,
      }),
    ).toBeVisible({
      timeout: SESSION_LAUNCH_TIMEOUT_MS,
    });

    await page.getByRole("button", {
      name: /Save question|Sauvegarder/,
    }).click();
    await expect(
      page.getByRole("button", {
        name: /Remove bookmark|Retirer/,
      }),
    ).toBeVisible({ timeout: 15_000 });

    await page.goto("/dashboard/bookmarks");
    await expect(
      page.getByRole("heading", {
        name: /Saved questions|Questions sauvegardees/,
      }),
    ).toBeVisible({ timeout: SESSION_LAUNCH_TIMEOUT_MS });
    await expect(
      page.getByText(liveQuestionPrompt ?? "", { exact: true }),
    ).toBeVisible();

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
    await expect(
      page.getByRole("heading", {
        name: /Personal notes|Notes personnelles/,
      }),
    ).toBeVisible({ timeout: SESSION_LAUNCH_TIMEOUT_MS });
    await expect(
      page.getByText(liveQuestionPrompt ?? "", { exact: true }),
    ).toBeVisible();
  });
});
