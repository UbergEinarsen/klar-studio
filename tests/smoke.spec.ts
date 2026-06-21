import { test, expect } from "@playwright/test";

test("homepage loads with correct title and no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto("/");
  await expect(page).toHaveTitle(/Klar Studio/);
  await expect(page.locator("h1")).toContainText("Klar,ferdig");
  expect(errors).toEqual([]);
});

test("nav and footer render", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".nav__brand")).toHaveText("Klar Studio");
  await expect(page.locator(".nav__cta")).toHaveText("Ta kontakt");
  await expect(page.locator(".footer")).toContainText("hei@klarstudio.no");
});

test("hero shows headline and CTA", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".hero h1")).toContainText("på nett");
  await expect(page.locator(".hero__cta a")).toHaveText("Er du klar?");
});

test("services section shows three pillars", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("#tjenester h3")).toHaveCount(3);
  await expect(page.locator("#tjenester")).toContainText("Google Maps");
});

test("why section shows the ranking stat", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".why__num")).toHaveText("#1");
});

test("work section shows featured project and demo badges", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".work__featured")).toBeVisible();
  await expect(page.locator(".work__badge").first()).toHaveText("Demo");
});
