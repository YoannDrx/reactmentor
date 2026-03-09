import { expect, test } from "@playwright/test";
import {
  completeOnboardingIfNeeded,
  createTestUser,
  signUpWithEmail,
  upgradeUserToPlan,
} from "./test-helpers";

const collectionSlug = "rendering-and-identity";
const questionSlug = "jsx-is-a-ui-description";
const questionPrompt =
  /What is JSX actually giving React|Qu'est-ce que JSX donne vraiment a React/i;

test.describe("learn surfaces", () => {
  test("keeps public learn pages accessible as teasers", async ({ page }) => {
    await page.goto("/learn");
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(/\/learn$/);
    await expect(
      page.getByRole("heading", {
        name: /Detailed interview courses|Des cours d'entretien detailles/i,
      }),
    ).toBeVisible();
    await expect(
      page.getByText(
        /Turn reading into a real training loop|Transformer la lecture en vraie boucle d entrainement/i,
      ),
    ).toBeVisible();

    await page.goto(`/learn/questions/${questionSlug}`);
    await page.waitForLoadState("networkidle");

    await expect(page).toHaveURL(new RegExp(`/learn/questions/${questionSlug}$`));
    await expect(page.getByText(questionPrompt)).toBeVisible();
    await expect(
      page.getByText(/Lesson preview|Apercu du cours/i),
    ).toBeVisible();
    await expect(
      page.getByRole("heading", {
        name: /Detailed explanation|Explication detaillee/i,
      }),
    ).toHaveCount(0);
  });

  test("redirects authenticated users from public learn routes into dashboard learn", async ({
    page,
  }) => {
    const testUser = createTestUser("react-mentor-learn-redirect");

    await signUpWithEmail(page, testUser);
    await completeOnboardingIfNeeded(page);

    await page.goto("/learn");
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(/\/dashboard\/learn$/);

    await page.goto(`/learn/collections/${collectionSlug}`);
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(
      new RegExp(`/dashboard/learn/collections/${collectionSlug}$`),
    );

    await page.goto(`/learn/questions/${questionSlug}`);
    await page.waitForLoadState("networkidle");
    await expect(page).toHaveURL(
      new RegExp(`/dashboard/learn/questions/${questionSlug}$`),
    );
    await expect(
      page.getByRole("button", {
        name: /Mark as studied|Marquer comme etudie/i,
      }),
    ).toBeVisible();
  });

  test("sends a lesson from dashboard learn into review and playlist follow-up", async ({
    page,
  }) => {
    const testUser = createTestUser("react-mentor-learn-follow-up");

    await signUpWithEmail(page, testUser);
    await upgradeUserToPlan({
      email: testUser.email,
    });
    await completeOnboardingIfNeeded(page);

    await page.goto(`/dashboard/learn/questions/${questionSlug}`);
    await page.waitForLoadState("networkidle");

    await page
      .getByRole("button", {
        name: /Mark as studied|Marquer comme etudie/i,
      })
      .click();

    await expect(
      page.getByText(/Lesson viewed|Cours vu/i).first(),
    ).toBeVisible({ timeout: 15_000 });

    await page
      .getByRole("button", {
        name: /Queue for review|Ajouter a la review/i,
      })
      .click();

    await expect(
      page.getByText(/Review due|A revoir/i).first(),
    ).toBeVisible({ timeout: 15_000 });

    await page.goto("/dashboard/review");
    await page.waitForLoadState("networkidle");

    await expect(page.getByText(questionPrompt)).toBeVisible();
    await expect(
      page.getByText(/Learn signal|Signal learn/i).first(),
    ).toBeVisible();

    await page.goto("/dashboard/playlists");
    await page.waitForLoadState("networkidle");

    await expect(
      page.getByText(/Lesson follow-up|Suivi de cours/i),
    ).toBeVisible();
    await expect(
      page.getByRole("button", {
        name: /Save playlist|Sauvegarder la playlist/i,
      }),
    ).toBeVisible();
  });
});
