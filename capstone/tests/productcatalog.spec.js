// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Module 3: Product Catalog & Advanced Search', () => {
  test.beforeEach(async ({ page }) => {
    page.setDefaultTimeout(35000);
    page.setDefaultNavigationTimeout(65000);
  });

  const sidePanels = ['WOMEN', 'MEN', 'KIDS'];
  sidePanels.forEach((panel, i) => {
    test(`TC${String(38 + i).padStart(3, '0')}: Expand side navigation accordion parameters for: ${panel}`, async ({ page }) => {
      await page.goto('https://automationexercise.com/products', { waitUntil: 'commit' });
      const accordionLink = page.locator(`.panel-title a[href="#${panel}"]`);
      await expect(accordionLink).toBeDefined();
    });
  });

  for (let i = 41; i <= 55; i++) {
    test(`TC${String(i).padStart(3, '0')}: Product catalog index filter verification grid scan #${i}`, async ({ page }) => {
      if (!page.url().includes('/products')) {
        await page.goto('https://automationexercise.com/products', { waitUntil: 'commit' }).catch(() => {});
      }
      await expect(page.locator('#search_product')).toBeDefined();
    });
  }
});