import { expect, test, type Page } from "@playwright/test";
import {
  completeOnboardingIfNeeded,
  createTestUser,
  signUpWithEmail,
} from "./test-helpers";

async function continueMockFlow(params: {
  page: Page;
  currentStatePattern: RegExp;
  nextStatePattern: RegExp;
  continueLabel: RegExp;
}) {
  const currentState = params.page.getByText(params.currentStatePattern).first();
  const nextState = params.page.getByText(params.nextStatePattern).first();

  await expect(currentState.or(nextState)).toBeVisible({ timeout: 15_000 });

  if (await currentState.isVisible()) {
    await params.page.getByRole("button", { name: params.continueLabel }).click();
  }

  await expect(nextState).toBeVisible({ timeout: 15_000 });
}

test.describe("mock interviews", () => {
  test("completes a timed mock and exposes the report in history", async ({
    page,
  }) => {
    const testUser = createTestUser("react-mentor-mock");

    await signUpWithEmail(page, testUser);
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

    await expect(
      page.getByText(
        /Does changing a key always force|Une key differente force-t-elle toujours/i,
      ),
    ).toBeVisible();
    await page.keyboard.press("2");
    await page.getByRole("button", {
      name: /Submit answer|Valider la reponse/,
    }).click();
    await continueMockFlow({
      page,
      currentStatePattern: /Correct|Incorrect/,
      nextStatePattern:
        /Write a small React snippet that gives a child component a stable callback|Ecris un petit snippet React qui donne a un composant enfant une callback stable/i,
      continueLabel: /Next question|Question suivante/,
    });

    await page.getByLabel(/Language|Langage/).fill("tsx");
    await page.getByLabel(/Your code or snippet|Ton code ou snippet/).fill(`const handleSelect = (id: string) => {
  onSelect(id);
};`);
    await page.getByRole("button", {
      name: /Submit answer|Valider la reponse/,
    }).click();
    await continueMockFlow({
      page,
      currentStatePattern: /Saved for review|Enregistree pour review/,
      nextStatePattern:
        /A teammate wants to mirror a filtered prop into local state|Un equipier veut recopier une prop filtree dans un state local/i,
      continueLabel: /Next question|Question suivante/,
    });

    await page.getByLabel(/Your answer|Ta reponse/).fill(
      "I would push back when the local copy becomes a second source of truth and keep only the real user-owned state.",
    );
    await page.getByRole("button", {
      name: /Submit answer|Valider la reponse/,
    }).click();
    await continueMockFlow({
      page,
      currentStatePattern: /Saved for review|Enregistree pour review/,
      nextStatePattern:
        /Read the snippet, pick the suspicious lines|Lis le snippet, choisis les lignes suspectes/i,
      continueLabel: /Next question|Question suivante/,
    });

    await page.getByRole("button", {
      name: /const timer = window\.setTimeout/,
    }).click();
    await page.getByRole("button", {
      name: /return \(\) =>/,
    }).click();
    await page.getByLabel(/Your bug analysis|Ton analyse du bug/).fill(
      "The cleanup is returned by the inner async function instead of the effect itself, so React never registers it correctly.",
    );
    await page.getByRole("button", {
      name: /Submit answer|Valider la reponse/,
    }).click();
    await continueMockFlow({
      page,
      currentStatePattern: /Saved for review|Enregistree pour review/,
      nextStatePattern: /Mock report|Rapport de mock/,
      continueLabel: /See session result|Voir le resultat/,
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
