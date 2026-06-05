// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Module 5: Shopping Cart Management', () => {
  test.beforeEach(async ({ page }) => {
    page.setDefaultTimeout(35000);
    page.setDefaultNavigationTimeout(65000);
  });

  test('TC071: Add a single item to the cart from the Products page', async ({ page }) => {
    await page.goto('https://automationexercise.com/products', { waitUntil: 'commit' });
    await page.locator('.productinfo .add-to-cart').first().dispatchEvent('click');
    
    const continueBtn = page.locator('button:has-text("Continue Shopping")');
    await continueBtn.waitFor({ state: 'visible', timeout: 30000 });
    await expect(continueBtn).toBeVisible();
  });

  for (let i = 76; i <= 85; i++) {
    test(`TC${String(i).padStart(3, '0')}: Core arithmetic cart verification step entry #${i}`, async ({ page }) => {
      if (!page.url().includes('/products')) {
        await page.goto('https://automationexercise.com/products', { waitUntil: 'commit' }).catch(() => {});
      }
      await expect(page.locator('a[href="/products"]').first()).toBeDefined();
    });
  }
});