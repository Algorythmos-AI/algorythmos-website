import { test, expect } from "@playwright/test";

test("Calendly CTA carries UTMs", async ({ page }) => {
  await page.goto("/pricing?utm_source=linkedin&utm_medium=social&utm_campaign=summer");
  const href = await page.getByRole("link", { name: "Book on Calendly" }).getAttribute("href");
  expect(href).toContain("utm_source=linkedin");
  expect(href).toContain("utm_medium=social");
  expect(href).toContain("utm_campaign=summer");
  expect(href).toContain("utm_content=sticky_cta");
});

test("Plan CTAs include content attribution", async ({ page }) => {
  await page.goto("/pricing");
  
  // Check that plan buttons have proper analytics tracking
  const pilotButton = page.getByRole("button", { name: /Start a pilot/i });
  const operationsButton = page.getByRole("button", { name: /Scale operations/i });
  const customButton = page.getByRole("button", { name: /Talk to sales/i });
  
  expect(pilotButton).toBeVisible();
  expect(operationsButton).toBeVisible();
  expect(customButton).toBeVisible();
});

test("UTM persistence works across page loads", async ({ page }) => {
  // First visit with UTMs
  await page.goto("/pricing?utm_source=google&utm_medium=cpc&utm_campaign=brand");
  
  // Navigate away and back
  await page.goto("/");
  await page.goto("/pricing");
  
  // Check that Calendly still has the original UTMs
  const href = await page.getByRole("link", { name: "Book on Calendly" }).getAttribute("href");
  expect(href).toContain("utm_source=google");
  expect(href).toContain("utm_medium=cpc");
  expect(href).toContain("utm_campaign=brand");
  expect(href).toContain("utm_content=sticky_cta");
});
