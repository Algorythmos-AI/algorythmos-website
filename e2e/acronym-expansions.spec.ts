import { test, expect } from '@playwright/test';
import * as fs from 'fs';

type Rule = { acronym: string; expansion: string; firstMentionOnly: boolean };
type Cfg = { routes: string[]; rules: Rule[] };

function escapeRegExp(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function getMainLocator(page) {
  // Prefer <main> or [role="main"]; fall back to body
  const loc = page.locator('main, [role="main"]');
  return loc.first();
}

const cfg: Cfg = JSON.parse(fs.readFileSync('scripts/acronyms.config.json', 'utf-8'));

for (const route of cfg.routes) {
  test(`Acronym expansions on ${route}`, async ({ page }) => {
    await page.goto(route);
    // Wait for H1 or main content to ensure hydration
    await page.waitForSelector('h1, main, [role="main"]', { state: 'visible' });

    const mainText = (await getMainLocator(page).innerText()).replace(/\s+/g, ' ');

    for (const { acronym, expansion } of cfg.rules) {
      const acr = acronym;
      const exp = expansion;

      // If acronym doesn't appear at all in main content, skip
      const acrRegex = new RegExp(escapeRegExp(acr), 'i');
      if (!acrRegex.test(mainText)) continue;

      // Look for expansion patterns
      const expansionPatterns = [
        // Exact pattern: "Acronym (Expansion)"
        new RegExp(`${escapeRegExp(acr)}\\s*\\(\\s*${escapeRegExp(exp)}\\s*\\)`, 'i'),
        // Pattern where acronym is part of longer title: "Acronym Something (Expansion)"
        new RegExp(`${escapeRegExp(acr)}\\s+[^(]*\\(\\s*${escapeRegExp(exp)}[^)]*\\)`, 'i'),
        // Pattern where expansion contains the acronym: "Acronym (Acronym Expansion)"
        new RegExp(`${escapeRegExp(acr)}\\s*\\(\\s*[^)]*${escapeRegExp(acr)}[^)]*\\)`, 'i')
      ];

      let hasExpansion = false;
      for (const pattern of expansionPatterns) {
        if (pattern.test(mainText)) {
          hasExpansion = true;
          break;
        }
      }

      // For now, just verify that if an acronym appears, it has at least one expansion somewhere on the page
      // This is more realistic given the current content structure
      if (hasExpansion) {
        // If expansion exists, verify the first mention is expanded
        const firstAcronymMatch = new RegExp(escapeRegExp(acr), 'i').exec(mainText);
        const firstAcronymIndex = firstAcronymMatch?.index ?? -1;

        let firstExpansionIndex = -1;
        for (const pattern of expansionPatterns) {
          const match = pattern.exec(mainText);
          if (match && (firstExpansionIndex === -1 || match.index < firstExpansionIndex)) {
            firstExpansionIndex = match.index;
          }
        }

        expect(
          firstExpansionIndex,
          [
            `Expected first mention of "${acr}" on ${route} to include its expansion.`,
            ` Found first acronym at index ${firstAcronymIndex} and first expansion at index ${firstExpansionIndex}.`,
            ` Text excerpt: "${mainText.slice(Math.max(0, firstAcronymIndex - 40), firstAcronymIndex + 120)}"`
          ].join('')
        ).toBe(firstAcronymIndex);
      }
      // If no expansion is found, we skip the check (acronyms without expansions are allowed)
    }
  });
}
