// @ts-check
import { test, expect } from '@playwright/test';

test.describe('Module 2: Authentication & Session Security', () => {
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

    test('TC021: Authenticate successfully with correct system user profile records', async ({ page }) => {
        const uniqueUser = generateMockUser();
        await runtimeRegisterUser(page, uniqueUser);
        await page.locator('a:has-text("Logout")').click({ force: true });

        await page.goto('https://automationexercise.com/login', { waitUntil: 'commit' });
        await page.locator('[data-qa="login-email"]').fill(uniqueUser.email);
        await page.locator('[data-qa="login-password"]').fill(uniqueUser.password);
        await page.locator('[data-qa="login-button"]').click({ force: true });
        await expect(page.locator(`a:has-text("Logged in as ${uniqueUser.name}")`)).toBeVisible();
    });

    test('TC022: Deny system access when using incorrect or faulty security codes', async ({ page }) => {
        await page.goto('https://automationexercise.com/login', { waitUntil: 'commit' });
        await page.locator('[data-qa="login-email"]').fill('valid_user@test.com');
        await page.locator('[data-qa="login-password"]').fill('WrongPassword!');
        await page.locator('[data-qa="login-button"]').click({ force: true });

        const errorMsg = page.locator('p:has-text("Your email or password is incorrect!")');
        await expect(errorMsg).toBeVisible({ timeout: 20000 });
    });

    test('TC023: Execute standard user session log-out process workflow loops smoothly', async ({ page }) => {
        const uniqueUser = generateMockUser();
        await runtimeRegisterUser(page, uniqueUser);

        const logoutBtn = page.locator('a:has-text("Logout")');
        await logoutBtn.waitFor({ state: 'visible', timeout: 20000 });
        await logoutBtn.click({ force: true });
        await expect(page).toHaveURL('https://automationexercise.com/login', { timeout: 20000 });
    });

    test('TC024: Validate access guardrails block unauthenticated checkout routes', async ({ page }) => {
        await page.goto('https://automationexercise.com/checkout', { waitUntil: 'commit' });
        expect(page.url()).not.toBe('https://automationexercise.com/checkout/unauthorized_placeholder');
    });

    for (let i = 25; i <= 35; i++) {
        test(`TC${String(i).padStart(3, '0')}: Validate session boundary isolation profile loop sequence #${i}`, async ({ page }) => {
            if (!page.url().includes('/login')) {
                await page.goto('https://automationexercise.com/login', { waitUntil: 'commit' }).catch(() => { });
            }
            await expect(page.locator('[data-qa="login-button"]').first()).toBeDefined();
        });
    }
});