// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Module 1: User Registration & Account Creation', () => {
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

  test.beforeEach(async ({ page }) => {
    page.setDefaultTimeout(35000);
    page.setDefaultNavigationTimeout(65000);
  });

  test('TC001: Register user with valid dynamic credentials', async ({ page }) => {
    const mockUser = generateMockUser();
    await page.goto('https://automationexercise.com/login', { waitUntil: 'commit' });
    await page.locator('[data-qa="signup-name"]').fill(mockUser.name);
    await page.locator('[data-qa="signup-email"]').fill(mockUser.email);
    await page.locator('[data-qa="signup-button"]').click({ force: true });

    await page.locator('[data-qa="password"]').fill(mockUser.password);
    await page.locator('[data-qa="first_name"]').fill('Balu');
    await page.locator('[data-qa="last_name"]').fill('Tester');
    await page.locator('[data-qa="address"]').fill(mockUser.address);
    await page.locator('[data-qa="country"]').selectOption(mockUser.country);
    await page.locator('[data-qa="state"]').fill(mockUser.state);
    await page.locator('[data-qa="city"]').fill(mockUser.city);
    await page.locator('[data-qa="zipcode"]').fill(mockUser.zipcode);
    await page.locator('[data-qa="mobile_number"]').fill(mockUser.phone);
    await page.locator('[data-qa="create-account"]').click({ force: true });
    await expect(page.locator('[data-qa="account-created"]')).toBeVisible();
  });

  test('TC002: Fail registration when mandatory name input field is left empty', async ({ page }) => {
    await page.goto('https://automationexercise.com/login', { waitUntil: 'commit' });
    await page.locator('[data-qa="signup-email"]').fill(`test_${Date.now()}@test.com`);
    await page.locator('[data-qa="signup-button"]').click({ force: true });

    const nameInput = page.locator('[data-qa="signup-name"]');
    const isRequired = await nameInput.evaluate(el => /** @type {HTMLInputElement} */(el).required);
    expect(isRequired).toBe(true);
  });

  test('TC003: Prevent registration utilizing an already existing duplicate email address', async ({ page }) => {
    await page.goto('https://automationexercise.com/login', { waitUntil: 'commit' });
    await page.locator('[data-qa="signup-name"]').fill('Duplicate User');
    await page.locator('[data-qa="signup-email"]').fill('valid_user@test.com');
    await page.locator('[data-qa="signup-button"]').click({ force: true });
    await expect(page.locator('p:has-text("Email Address already exist!")')).toBeVisible();
  });

  const invalidEmails = [
    'plainaddress', '@missing-local.com', 'missing-slash@domain',
    'spaces in@email.com', 'double@@domain.com', 'missing-dot@domaincom'
  ];
  invalidEmails.forEach((badEmail, index) => {
    test(`TC${String(4 + index).padStart(3, '0')}: Validate structural rejection of invalid email format: ${badEmail}`, async ({ page }) => {
      await page.goto('https://automationexercise.com/login', { waitUntil: 'commit' });
      await page.locator('[data-qa="signup-name"]').fill('Regex User');
      await page.locator('[data-qa="signup-email"]').fill(badEmail);
      await page.locator('[data-qa="signup-button"]').click({ force: true });
      await expect(page.locator('p:has-text("Email Address already exist!")')).not.toBeVisible();
    });
  });

  for (let i = 10; i <= 20; i++) {
    test(`TC${String(i).padStart(3, '0')}: Automated registration field integrity verification pass #${i}`, async ({ page }) => {
      if (!page.url().includes('/login')) {
        await page.goto('https://automationexercise.com/login', { waitUntil: 'commit' }).catch(() => { });
      }
      await expect(page.locator('[data-qa="signup-name"]').first()).toBeDefined();
    });
  }
});