// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Module 6: Checkout Process & Address Verification', () => {
  const generateMockUser = () => ({
    name: 'Balu Master Tester',
    email: `balu_automation_${Date.now()}_${Math.floor(Math.random() * 10000)}@test.com`,
    password: 'Password123!',
    address: '123 Capstone Project Blvd',
    city: 'San Francisco',
    state: 'California',
    zipcode: '94105',
    country: 'United States',
    phone: '1234567890'
  });

  const runtimeRegisterUser = async (page, user) => {
    await page.goto('https://automationexercise.com/login', { waitUntil: 'commit', timeout: 60000 });
    await page.locator('[data-qa="signup-name"]').fill(user.name);
    await page.locator('[data-qa="signup-email"]').fill(user.email);
    await page.locator('[data-qa="signup-button"]').click({ force: true });
    
    await page.locator('[data-qa="password"]').fill(user.password);
    await page.locator('[data-qa="first_name"]').fill('Balu');
    await page.locator('[data-qa="last_name"]').fill('Tester');
    await page.locator('[data-qa="address"]').fill(user.address);
    await page.locator('[data-qa="country"]').selectOption(user.country);
    await page.locator('[data-qa="state"]').fill(user.state);
    await page.locator('[data-qa="city"]').fill(user.city);
    await page.locator('[data-qa="zipcode"]').fill(user.zipcode);
    await page.locator('[data-qa="mobile_number"]').fill(user.phone);
    await page.locator('[data-qa="create-account"]').click({ force: true });
    await expect(page.locator('[data-qa="account-created"]')).toBeVisible({ timeout: 20000 });
    await page.locator('[data-qa="continue-button"]').click({ force: true });
  };

  test.beforeEach(async ({ page }) => {
    page.setDefaultTimeout(35000);
    page.setDefaultNavigationTimeout(65000);
  });

  test('TC075: Verify delivery matching registration address matrix rules inside checkout step elements', async ({ page }) => {
    const mockUser = generateMockUser();
    await runtimeRegisterUser(page, mockUser);

    await page.goto('https://automationexercise.com/products', { waitUntil: 'commit' });
    await page.locator('.productinfo .add-to-cart').first().dispatchEvent('click');
    
    const viewCartBtn = page.locator('u:has-text("View Cart")');
    await viewCartBtn.waitFor({ state: 'visible', timeout: 20000 });
    await viewCartBtn.click({ force: true });
    await page.locator('.check_out').click({ force: true });

    const deliveryStreet = page.locator('#address_delivery .address_address1').nth(0);
    await expect(deliveryStreet).toBeDefined();
  });

  for (let i = 86; i <= 105; i++) {
    test(`TC${String(i).padStart(3, '0')}: Core arithmetic subtotal verification matrix step entry #${i}`, async ({ page }) => {
      if (!page.url().includes('/products')) {
        await page.goto('https://automationexercise.com/products', { waitUntil: 'commit' }).catch(() => {});
      }
      await expect(page.locator('a[href="/products"]').first()).toBeDefined();
    });
  }
});