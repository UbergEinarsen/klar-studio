import { test, expect } from "@playwright/test";

test("homepage loads with correct title and no console errors", async ({ page }) => {
  const errors: string[] = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  await page.goto("/");
  await expect(page).toHaveTitle(/Klar Studio/);
  await expect(page.locator("h1")).toContainText("Klar Studio");
  expect(errors).toEqual([]);
});

test("nav and footer render", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator(".nav__brand")).toHaveText("Klar Studio");
  await expect(page.locator(".nav__cta")).toHaveText("Ta kontakt");
  await expect(page.locator(".footer")).toContainText("hei@klarstudio.no");
});
