import { expect, type Page } from "@playwright/test";

export const createTestUser = (prefix = "react-mentor-e2e") => ({
  name: "React Mentor Tester",
  email: `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`,
  password: "Password123!",
});

export async function fillSignUpForm(
  page: Page,
  user: ReturnType<typeof createTestUser>,
) {
  await page.goto("/auth/signup");
  await page.getByLabel(/Name|Nom/).fill(user.name);
  await page.getByLabel(/Email/).fill(user.email);
  await page.getByLabel(/^Password$|^Mot de passe$/).fill(user.password);
  await page.getByLabel(/Confirm|Confirmation/).fill(user.password);
}

export async function signUpWithEmail(
  page: Page,
  user: ReturnType<typeof createTestUser>,
) {
  await fillSignUpForm(page, user);
  const form = page.locator("form").first();
  const submitButton = page.getByRole("button", {
    name: /Create my account|Créer mon compte/,
  });

  for (let attempt = 0; attempt < 2; attempt += 1) {
    if (attempt === 0) {
      await form.evaluate((node) => {
        if (node instanceof HTMLFormElement) {
          node.requestSubmit();
        }
      });
    } else {
      await submitButton.click();
    }

    try {
      await expect
        .poll(() => page.url(), {
          timeout: 12_000,
        })
        .toMatch(/\/(onboarding|dashboard)(\?.*)?$/);
      return;
    } catch (error) {
      if (attempt === 1) {
        throw error;
      }
    }
  }
}

export async function completeOnboardingIfNeeded(page: Page) {
  await expect
    .poll(() => page.url(), {
      timeout: 20_000,
    })
    .toMatch(/\/(onboarding|dashboard)(\?.*)?$/);
  await page.waitForLoadState("networkidle");

  if (!page.url().includes("/onboarding")) {
    return;
  }

  await page
    .getByLabel(/Target role|Role cible/)
    .fill("Frontend Product Engineer");
  await page.getByRole("button", { name: /Continue|Continuer/ }).click();
  await page.getByRole("button", { name: /Continue|Continuer/ }).click();
  await page
    .getByRole("button", { name: /Open dashboard|Ouvrir le dashboard/ })
    .click();
  await expect(page).toHaveURL(/\/dashboard$/);
}

export async function completeStructuredSession(
  page: Page,
  options?: {
    maxQuestions?: number;
  },
) {
  const maxQuestions = options?.maxQuestions ?? 12;
  const completionHeading = page.getByRole("heading", {
    name: /Session completed|Session terminee/,
  });
  const mechanismPanel = page.getByText(/Mechanism|Mecanisme/);

  for (let step = 0; step < maxQuestions; step += 1) {
    if (await completionHeading.isVisible().catch(() => false)) {
      break;
    }

    await page.keyboard.press("1");
    await page.keyboard.press("Enter");

    const resolvedStep = await Promise.race([
      completionHeading
        .waitFor({ state: "visible", timeout: 10_000 })
        .then(() => "completed"),
      mechanismPanel
        .waitFor({ state: "visible", timeout: 10_000 })
        .then(() => "feedback"),
    ]);

    if (resolvedStep === "feedback") {
      await expect(page.getByText(/Correct|Incorrect/)).toBeVisible();
      await page.keyboard.press("Enter");
      await page.waitForLoadState("networkidle");
    }
  }

  await expect(completionHeading).toBeVisible();
}
