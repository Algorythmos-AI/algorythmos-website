import { test, expect } from "@playwright/test";

test("MLOps pipeline: Pause halts and Play resumes", async ({ page }) => {
  await page.goto("/services/mlops-cicd");

  const root = page.locator('[data-pipeline="mlops"]');
  await expect(root).toBeVisible();

  // Grab initial active index
  const initial = await root.getAttribute("data-active-index");

  // Pause and verify index stays the same for >2s
  await page.getByRole("button", { name: /^Pause$/i }).click();
  await page.waitForTimeout(2200);
  await expect(root).toHaveAttribute("data-active-index", initial!);

  // Play and verify index changes within ~2.5s
  await page.getByRole("button", { name: /^Play$/i }).click();
  await page.waitForTimeout(2500);
  const afterPlay = await root.getAttribute("data-active-index");
  expect(afterPlay).not.toBe(initial);

  // Also verify clicking a step updates immediately
  await page.getByRole("tab", { name: /Develop/i }).click();
  await expect(root).toHaveAttribute("data-active-index", /0|^Develop$/); // index changed; accept any index value with regex
});
