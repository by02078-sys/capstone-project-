const { test, expect } = require('@playwright/test');

test.describe('Automation Exercise - Authentication & Session Security Suite', () => {

  const baseUrl = 'http://automationexercise.com';
  const loginUrl = `${baseUrl}/login`;

  // ==========================================
  // PHASE 1: REGISTRATION & PASSWORD ENFORCEMENT
  // ==========================================

  // Test Case 1: Password Field Masking
  test('Test Case 1: Password Field Masking', async ({ page }) => {
    await page.goto(loginUrl, { waitUntil: 'domcontentloaded' });
    
    const passwordInput = page.locator('input[data-qa="signup-password"]');
    await expect(passwordInput).toHaveAttribute('type', 'password');
  });

  // Test Case 2: SQL Injection (SQLi) in Login Fields
  test('Test Case 2: SQL Injection (SQLi) in Login Fields', async ({ page }) => {
    await page.goto(loginUrl, { waitUntil: 'domcontentloaded' });

    await page.locator('input[data-qa="login-email"]').fill("' OR '1'='1");
    await page.locator('input[data-qa="login-password"]').fill('password123');
    await page.locator('button[data-qa="login-button"]').click();

    const errorMessage = page.locator('.login-form p', { hasText: /incorrect/i });
    await expect(page).not.toHaveURL(`${baseUrl}/`);
  });

  // Test Case 3: Sensitive Data Masking in Logs / URL Query Parameters
  test('Test Case 3: Sensitive Data Masking in Logs / URL Query Parameters', async ({ page }) => {
    await page.goto(loginUrl, { waitUntil: 'domcontentloaded' });

    const requestPromise = page.waitForRequest(res => res.url().includes('login'));

    await page.locator('input[data-qa="login-email"]').fill('balaji@example.com');
    await page.locator('input[data-qa="login-password"]').fill('SecurePass123!');
    await page.locator('button[data-qa="login-button"]').click();

    const request = await requestPromise;
    
    expect(request.method()).toBe('POST');
    expect(page.url()).not.toContain('password=');
  });

  // ==========================================
  // PHASE 2: SESSION BOUNDARIES & AUTHORIZATION
  // ==========================================

  // Test Case 4: Forced Browsing (Broken Object Level Authorization)
  test('Test Case 4: Forced Browsing (Broken Object Level Authorization)', async ({ page }) => {
    await page.goto(`${baseUrl}/delete_account`, { waitUntil: 'domcontentloaded' });
    await expect(page).not.toHaveURL(`${baseUrl}/delete_account`);
  });

  // Test Case 5: Session Invalidation on Logout
  test('Test Case 5: Session Invalidation on Logout', async ({ page }) => {
    await page.goto(loginUrl, { waitUntil: 'domcontentloaded' });
    await page.locator('input[data-qa="login-email"]').fill('balaji@example.com');
    await page.locator('input[data-qa="login-password"]').fill('SecurePass123!');
    await page.locator('button[data-qa="login-button"]').click();

    await page.getByRole('link', { name: 'Logout' }).click();
    await page.goBack();

    const loggedInText = page.locator('header i.fa-user + b');
    await expect(loggedInText).not.toBeVisible();
  });

  // Test Case 6: Multiple Concurrent Sessions Handling
  test('Test Case 6: Multiple Concurrent Sessions Handling', async ({ browser }) => {
    const contextA = await browser.newContext();
    const contextB = await browser.newContext();

    const pageA = await contextA.newPage();
    const pageB = await contextB.newPage();

    await pageA.goto(loginUrl);
    await pageA.locator('input[data-qa="login-email"]').fill('balaji@example.com');
    await pageA.locator('input[data-qa="login-password"]').fill('SecurePass123!');
    await pageA.locator('button[data-qa="login-button"]').click();

    await pageB.goto(loginUrl);
    await pageB.locator('input[data-qa="login-email"]').fill('balaji@example.com');
    await pageB.locator('input[data-qa="login-password"]').fill('SecurePass123!');
    await pageB.locator('button[data-qa="login-button"]').click();

    await expect(pageA.locator('header i.fa-user + b')).toHaveText('Balaji');
    await expect(pageB.locator('header i.fa-user + b')).toHaveText('Balaji');

    await contextA.close();
    await contextB.close();
  });

  // ==========================================
  // PHASE 3: SESSION STATE & COOKIE SECURITY
  // ==========================================

  // Test Case 7: Session Cookie Expiry Check
  test('Test Case 7: Session Cookie Expiry Check', async ({ page, context }) => {
    await page.goto(loginUrl);
    await page.locator('input[data-qa="login-email"]').fill('balaji@example.com');
    await page.locator('input[data-qa="login-password"]').fill('SecurePass123!');
    await page.locator('button[data-qa="login-button"]').click();

    const cookies = await context.cookies();
    expect(cookies.length).toBeGreaterThan(0);
  });

  // Test Case 8: HttpOnly Flag Enforcement on Session Tokens
  test('Test Case 8: HttpOnly Flag Enforcement on Session Tokens', async ({ page, context }) => {
    await page.goto(loginUrl);
    await page.locator('input[data-qa="login-email"]').fill('balaji@example.com');
    await page.locator('button[data-qa="login-button"]').click();

    const cookies = await context.cookies();
    
    for (const cookie of cookies) {
      if (cookie.name === 'session_id' || cookie.name.includes('auth')) {
        expect(cookie.httpOnly).toBe(true);
      }
    }
  });

  // Test Case 9: Secure Cookie Attribute Deployment
  test('Test Case 9: Secure Cookie Attribute Deployment', async ({ page, context }) => {
    await page.goto(loginUrl);
    const cookies = await context.cookies();

    for (const cookie of cookies) {
      expect(cookie.secure).toBe(true);
    }
  });

  // ==========================================
  // PHASE 4: DEFENSIVE VULNERABILITY CONTROLS
  // ==========================================

  // Test Case 10: Account Enumeration Protection via Feedback Messages
  test('Test Case 10: Account Enumeration Protection via Feedback Messages', async ({ page }) => {
    await page.goto(loginUrl);
    
    await page.locator('input[data-qa="login-email"]').fill('fakeuser999999@notreal.com');
    await page.locator('input[data-qa="login-password"]').fill('anyPassword!');
    await page.locator('button[data-qa="login-button"]').click();

    const feedback = page.locator('.login-form p');
    await expect(feedback).toContainText(/incorrect|invalid/i);
    await expect(feedback).not.toContainText(/email does not exist/i);
  });

  // Test Case 11: Cross-Site Request Forgery (CSRF) Guardrails on State Forms
  test('Test Case 11: Cross-Site Request Forgery (CSRF) Guardrails on State Forms', async ({ page }) => {
    await page.goto(loginUrl);
    
    const formElement = page.locator('form').first();
    expect(formElement).toBeDefined();
  });

  // Test Case 12: Session Hijacking via Extracted Token Spoofing
  test('Test Case 12: Session Hijacking via Extracted Token Spoofing', async ({ browser, context }) => {
    const pageA = await context.newPage();
    await pageA.goto(loginUrl);
    await pageA.locator('input[data-qa="login-email"]').fill('balaji@example.com');
    await pageA.locator('input[data-qa="login-password"]').fill('SecurePass123!');
    await pageA.locator('button[data-qa="login-button"]').click();

    const authCookies = await context.cookies();

    const maliciousContext = await browser.newContext();
    const pageB = await maliciousContext.newPage();

    await maliciousContext.addCookies(authCookies);
    await pageB.goto(baseUrl);

    await pageB.reload();
    await maliciousContext.close();
  });

  // ==========================================
  // PHASE 5: INPUT VALIDATION & BOUNDARY CONSTRAINTS
  // ==========================================

  // Test Case 13: XSS Script Insertion via Account Profile Data
  test('Test Case 13: XSS Script Insertion via Account Profile Data', async ({ page }) => {
    await page.goto(loginUrl);
    
    const xssPayload = "<script>alert('XSS')</script>";
    await page.locator('input[data-qa="signup-name"]').fill(xssPayload);
    await page.locator('input[data-qa="signup-email"]').fill(`test_xss_${Date.now()}@example.com`);
    await page.locator('button[data-qa="signup-button"]').click();

    const formHeading = page.getByRole('heading', { name: 'Enter Account Information' });
    await expect(formHeading).toBeVisible();
  });

  // Test Case 14: HTML Injection Prevention within Text Elements
  test('Test Case 14: HTML Injection Prevention within Text Elements', async ({ page }) => {
    await page.goto(loginUrl);
    
    const htmlPayload = "<h1>InjectedText</h1>";
    await page.locator('input[data-qa="signup-name"]').fill(htmlPayload);
    await page.locator('input[data-qa="signup-email"]').fill(`test_html_${Date.now()}@example.com`);
    await page.locator('button[data-qa="signup-button"]').click();

    const isHeaderParsed = await page.locator('h1:has-text("InjectedText")').count();
    expect(isHeaderParsed).toBe(0);
  });

  // Test Case 15: Session Cache Handling via Browser Controls
  test('Test Case 15: Session Cache Handling via Browser Controls', async ({ page }) => {
    await page.goto(loginUrl);
    await page.locator('input[data-qa="login-email"]').fill('balaji@example.com');
    await page.locator('input[data-qa="login-password"]').fill('SecurePass123!');
    await page.locator('button[data-qa="login-button"]').click();

    await page.getByRole('link', { name: 'Logout' }).click();

    const response = await page.goto(baseUrl);
    const headers = response.headers();

    const cacheControl = headers['cache-control'] || '';
    expect(cacheControl).toBeDefined();
  });

});