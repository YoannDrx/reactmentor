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

  test("supports multiple-choice practice questions end to end", async ({ page }) => {
    const testUser = createTestUser("react-mentor-practice-multi");

    await signUpWithEmail(page, testUser);
    await completeOnboardingIfNeeded(page);

    await page.goto("/dashboard/modules/typescript-for-components");
    await page.waitForLoadState("networkidle");

    const launchButton = page.getByRole("button", {
      name: /Launch practice session|Lancer une session practice/,
    });

    await expect(launchButton).toBeVisible({ timeout: 15_000 });
    await launchButton.click();

    await expect(page).toHaveURL(/\/dashboard\/session\//);
    await expect(
      page.getByText(
        /Which decisions help a generic React component preserve type inference|Quelles decisions aident un composant React generique a preserver l'inference/i,
      ),
    ).toBeVisible();
    await expect(
      page.getByText(/Multiple answers|Reponses multiples/),
    ).toBeVisible();

    await page.keyboard.press("1");
    await page.keyboard.press("3");
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
      await expect(page.getByText(/Correct|Incorrect/)).toBeVisible();
      await expect(page.getByText(/Correct/)).toBeVisible();
      await page.keyboard.press("Enter");
    }

    await expect(completionHeading).toBeVisible();
    await expect(page.getByText(/^100%$/)).toBeVisible();
  });

  test("supports open-answer practice questions with pending-review feedback", async ({
    page,
  }) => {
    const testUser = createTestUser("react-mentor-practice-open");

    await signUpWithEmail(page, testUser);
    await completeOnboardingIfNeeded(page);

    await page.goto("/dashboard/modules/react-answer-defense");
    await page.waitForLoadState("networkidle");

    const launchButton = page.getByRole("button", {
      name: /Launch practice session|Lancer une session practice/,
    });

    await expect(launchButton).toBeVisible({ timeout: 15_000 });
    await launchButton.click();

    await expect(page).toHaveURL(/\/dashboard\/session\//);
    await expect(
      page.getByText(
        /A teammate wants to mirror a filtered prop into local state|Un equipier veut recopier une prop filtree dans un state local/i,
      ),
    ).toBeVisible();

    await page.getByLabel(/Your answer|Ta reponse/).fill(
      "I would push back when the local copy becomes a second source of truth. If the value is derivable from props, I would compute it during render and keep only the real user-owned state.",
    );
    await page.getByRole("button", {
      name: /Submit answer|Valider la reponse/,
    }).click();

    const codeQuestionPrompt = page.getByText(
      /Write a small React snippet that gives a child component a stable callback|Ecris un petit snippet React qui donne a un composant enfant une callback stable/i,
    );
    const pendingReviewBadge = page.getByText(
      /Saved for review|Enregistree pour review/,
    );

    const firstTransition = await Promise.race([
      pendingReviewBadge.waitFor({ state: "visible", timeout: 10_000 }).then(() => "feedback"),
      codeQuestionPrompt.waitFor({ state: "visible", timeout: 10_000 }).then(() => "next"),
    ]);

    if (firstTransition === "feedback") {
      await page.keyboard.press("Enter");
    }

    await expect(codeQuestionPrompt).toBeVisible();

    await page.getByLabel(/Language|Langage/).fill("tsx");
    await page.getByLabel(/Your code or snippet|Ton code ou snippet/).fill(`const handleSelect = useCallback(
  (id: string) => {
    onSelect(id);
  },
  [onSelect],
);`);
    await page.getByRole("button", {
      name: /Submit answer|Valider la reponse/,
    }).click();

    const completionHeading = page.getByRole("heading", {
      name: /Session completed|Session terminee/,
    });
    const finalTransition = await Promise.race([
      completionHeading.waitFor({ state: "visible", timeout: 10_000 }).then(() => "completed"),
      pendingReviewBadge.waitFor({ state: "visible", timeout: 10_000 }).then(() => "feedback"),
    ]);

    if (finalTransition === "feedback") {
      await page.keyboard.press("Enter");
    }

    await expect(completionHeading).toBeVisible();
    await expect(
      page.getByText(/Pending review|En review/).first(),
    ).toBeVisible();
  });

  test("supports bug-hunt practice questions and manual review grading", async ({
    page,
  }) => {
    const testUser = createTestUser("react-mentor-practice-bughunt");

    await signUpWithEmail(page, testUser);
    await completeOnboardingIfNeeded(page);

    await page.goto("/dashboard/modules/react-bug-hunt-lab");
    await page.waitForLoadState("networkidle");

    const launchButton = page.getByRole("button", {
      name: /Launch practice session|Lancer une session practice/,
    });

    await expect(launchButton).toBeVisible({ timeout: 15_000 });
    await launchButton.click();

    await expect(page).toHaveURL(/\/dashboard\/session\//);

    const sessionUrl = page.url();
    const bugHuntPrompt = page.getByText(
      /Read the snippet, pick the suspicious lines|Lis le snippet, choisis les lignes suspectes/i,
    );

    await expect(bugHuntPrompt).toBeVisible();
    await page
      .getByRole("button", {
        name: /const timer = window\.setTimeout/,
      })
      .click();
    await page
      .getByRole("button", {
        name: /return \(\) =>/,
      })
      .click();
    await page.getByLabel(/Your bug analysis|Ton analyse du bug/).fill(
      "The timeout cleanup is returned from the inner async function instead of the effect itself, so React never registers it as the real cleanup.",
    );
    await page.getByRole("button", {
      name: /Submit answer|Valider la reponse/,
    }).click();

    const completionHeading = page.getByRole("heading", {
      name: /Session completed|Session terminee/,
    });
    const pendingReviewBadge = page.getByText(/Pending review|En review/).first();

    const bugHuntTransition = await Promise.race([
      completionHeading.waitFor({ state: "visible", timeout: 10_000 }).then(() => "completed"),
      pendingReviewBadge.waitFor({ state: "visible", timeout: 10_000 }).then(() => "feedback"),
    ]);

    if (bugHuntTransition === "feedback") {
      await page.keyboard.press("Enter");
    }

    await expect(completionHeading).toBeVisible();
    await expect(pendingReviewBadge).toBeVisible();

    await page.goto("/dashboard/review");
    await page.waitForLoadState("networkidle");

    const pendingCardPrompt = page.getByText(
      /Lis le snippet, choisis les lignes suspectes|Read the snippet, pick the suspicious lines/i,
    );

    await expect(pendingCardPrompt).toBeVisible();
    await page.getByRole("button", {
      name: /Mark solid|Marquer solide/,
    }).click();

    await expect(pendingCardPrompt).not.toBeVisible();
    await expect(
      page.getByText(/No manual review is waiting|Aucune review manuelle en attente/),
    ).toBeVisible();

    await page.goto(sessionUrl);
    await page.waitForLoadState("networkidle");

    await expect(completionHeading).toBeVisible();
    await expect(page.getByText(/^100%$/)).toBeVisible();
  });
});
