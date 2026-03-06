import { expect, test, type Page } from "@playwright/test";

const createTestUser = () => ({
  name: "React Mentor Tester",
  email: `react-mentor-${Date.now()}-${Math.random().toString(36).slice(2, 8)}@example.com`,
  password: "Password123!",
});

const fillSignUpForm = async (
  page: Page,
  user: ReturnType<typeof createTestUser>,
) => {
  await page.goto("/auth/signup");
  await page.getByLabel(/Name|Nom/).fill(user.name);
  await page.getByLabel(/Email/).fill(user.email);
  await page.getByLabel(/^Password$|^Mot de passe$/).fill(user.password);
  await page.getByLabel(/Confirm|Confirmation/).fill(user.password);
};

test.describe("authentication flows", () => {
  test("redirects unauthenticated users to sign in", async ({ page }) => {
    await page.goto("/dashboard");

    await expect(page).toHaveURL(/\/auth\/signin\?callbackUrl=%2Fdashboard/);
  });

  test("signs up with email and opens the dashboard", async ({ page }) => {
    const testUser = createTestUser();

    await fillSignUpForm(page, testUser);
    await page
      .getByRole("button", { name: /Create my account|Créer mon compte/ })
      .click();

    await expect(page).toHaveURL(/\/dashboard$/);
  });

  test("signs in with an existing email account", async ({ browser }) => {
    const testUser = createTestUser();
    const signUpContext = await browser.newContext();
    const signUpPage = await signUpContext.newPage();

    await fillSignUpForm(signUpPage, testUser);
    await signUpPage
      .getByRole("button", { name: /Create my account|Créer mon compte/ })
      .click();
    await expect(signUpPage).toHaveURL(/\/dashboard$/);
    await signUpContext.close();

    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("/auth/signin");
    await page.getByLabel(/Email/).fill(testUser.email);
    await page.getByLabel(/^Password$|^Mot de passe$/).fill(testUser.password);
    await page
      .getByRole("button", { name: /Access dashboard|Accéder au dashboard/ })
      .click();

    await expect(page).toHaveURL(/\/dashboard$/);
    await context.close();
  });

  test("starts the google oauth flow when the provider is configured", async ({
    request,
    baseURL,
  }) => {
    const response = await request.post(`${baseURL}/api/auth/sign-in/social`, {
      data: {
        provider: "google",
        callbackURL: "/dashboard",
      },
      headers: {
        "content-type": "application/json",
        origin: baseURL ?? "http://localhost:3000",
        referer: `${baseURL ?? "http://localhost:3000"}/auth/signin`,
      },
    });

    expect(response.ok()).toBeTruthy();

    const body = (await response.json()) as { redirect: boolean; url: string };

    expect(body.redirect).toBe(true);
    expect(body.url).toContain("accounts.google.com");
    expect(body.url).toContain("client_id=");
  });
});
