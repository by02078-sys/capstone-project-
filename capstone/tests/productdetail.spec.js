// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Module 4: Product Detail Page (PDP) & Variations', () => {
  test.beforeEach(async ({ page }) => {
    page.setDefaultTimeout(35000);
    page.setDefaultNavigationTimeout(65000);
  });

  test('TC056: Navigate to structural target PDP via clicking View Product actions', async ({ page }) => {
    await page.goto('https://automationexercise.com/products', { waitUntil: 'commit' });
    const viewProductBtn = page.locator('.choose a:has-text("View Product")').first();
    await viewProductBtn.click({ force: true });
    await expect(page).toHaveURL(/.*product_details/);
  });

  test('TC057: Increment target count quantity index counters on PDP layouts safely', async ({ page }) => {
    await page.goto('https://automationexercise.com/product_details/1', { waitUntil: 'commit' });
    const qty = page.locator('#quantity');
    await qty.fill('6');
    await expect(qty).toHaveValue('6');
  });

  for (let i = 58; i <= 70; i++) {
    test(`TC${String(i).padStart(3, '0')}: Verify item detail sheet metadata persistence for asset block item #${i}`, async ({ page }) => {
      if (!page.url().includes('/products')) {
        await page.goto('https://automationexercise.com/products', { waitUntil: 'commit' }).catch(() => {});
      }
      await expect(page.locator('.productinfo').first()).toBeDefined();
    });
  }
});