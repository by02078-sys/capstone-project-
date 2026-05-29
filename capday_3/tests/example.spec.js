const { test, expect } = require('@playwright/test');

// Enforce serial mode so steps run sequentially and stop if one fails
test.describe.configure({ mode: 'serial' });

test.describe('Automation Exercise - 18 test cases', () => {
  let page;

  // Launch a shared browser context for all tests to maintain state
  test.beforeAll(async ({ browser }) => {
    page = await browser.newPage();
  });

  // Clean up and close browser after all 18 steps complete
  test.afterAll(async () => {
    await page.close();
  });

  // 1. Launch browser & 2. Navigate to URL
  test('Step 01 & 02: Navigate to Automation Exercise URL', async () => {
    await page.goto('http://automationexercise.com', { waitUntil: 'domcontentloaded' });
  });

  // 3. Verify that home page is visible successfully
  test('Step 03: Verify home page is visible successfully', async () => {
    const homePageLogo = page.locator('.logo img');
    await expect(homePageLogo).toBeVisible();
    await expect(page).toHaveTitle('Automation Exercise');
  });

  // 4. Click on 'Signup / Login' button
  test('Step 04: Click on Signup / Login button', async () => {
    // Using a more resilient text match that ignores icon font characters
    await page.getByRole('link', { name: 'Signup / Login' }).click();
  });

  // 5. Verify 'New User Signup!' is visible
  test('Step 05: Verify New User Signup! is visible', async () => {
    const signupHeading = page.getByRole('heading', { name: 'New User Signup!' });
    await expect(signupHeading).toBeVisible();
  });

  // 6. Enter name and email address
  test('Step 06: Enter name and email address', async () => {
    const uniqueEmail = `balaji_${Date.now()}@example.com`;
    await page.locator('input[data-qa="signup-name"]').fill('Balaji');
    await page.locator('input[data-qa="signup-email"]').fill(uniqueEmail);
  });

  // 7. Click 'Signup' button
  test('Step 07: Click Signup button', async () => {
    await page.locator('button[data-qa="signup-button"]').click();
  });

  // 8. Verify that 'ENTER ACCOUNT INFORMATION' is visible
  test('Step 08: Verify ENTER ACCOUNT INFORMATION is visible', async () => {
    const formHeading = page.getByRole('heading', { name: 'Enter Account Information', ignoreCase: true });
    await expect(formHeading).toBeVisible();
  });

  // 9. Fill details: Title, Name, Email, Password, Date of birth
  test('Step 09: Fill account details', async () => {
    await page.locator('#id_gender1').check(); 
    await page.locator('input[data-qa="password"]').fill('SecurePass123!');
    
    await page.locator('select[data-qa="days"]').selectOption('15');
    await page.locator('select[data-qa="months"]').selectOption('7'); 
    await page.locator('select[data-qa="years"]').selectOption('1995');
  });

  // 10. Select checkbox 'Sign up for our newsletter!'
  test('Step 10: Select checkbox Sign up for our newsletter!', async () => {
    await page.locator('#newsletter').check();
  });

  // 11. Select checkbox 'Receive special offers from our partners!'
  test('Step 11: Select checkbox Receive special offers from our partners!', async () => {
    await page.locator('#optin').check();
  });

  // 12. Fill details: First name, Last name, Company, Address, Address2, Country, State, City, Zipcode, Mobile Number
  test('Step 12: Fill address details', async () => {
    await page.locator('input[data-qa="first_name"]').fill('Balaji');
    await page.locator('input[data-qa="last_name"]').fill('S');
    await page.locator('input[data-qa="company"]').fill('Tech Solutions Inc');
    await page.locator('input[data-qa="address"]').fill('123 Main Street');
    await page.locator('input[data-qa="address2"]').fill('Suite 400');
    await page.locator('select[data-qa="country"]').selectOption('United States');
    await page.locator('input[data-qa="state"]').fill('California');
    await page.locator('input[data-qa="city"]').fill('Los Angeles');
    await page.locator('input[data-qa="zipcode"]').fill('90001');
    await page.locator('input[data-qa="mobile_number"]').fill('1234567890');
  });

  // 13. Click 'Create Account button'
  test('Step 13: Click Create Account button', async () => {
    await page.locator('button[data-qa="create-account"]').click();
  });

  // 14. Verify that 'ACCOUNT CREATED!' is visible
  // FIXED: Removed ({ page }) from the arguments so it continues utilizing the global state context
  test('Step 14: Verify ACCOUNT CREATED! is visible', async () => {
    const accountCreatedHeading = page.locator('[data-qa="account-created"]');
    await expect(accountCreatedHeading).toBeVisible();
  });

  // 15. Click 'Continue' button
  test('Step 15: Click Continue button', async () => {
    // FIXED: Enclosed custom attribute inside valid square brackets
    await page.locator('[data-qa="continue-button"]').click();
  });

  // 16. Verify that 'Logged in as username' is visible
  test('Step 16: Verify Logged in as username is visible', async () => {
    const loggedInText = page.locator('header i.fa-user + b');
    await expect(loggedInText).toHaveText('Balaji');
  });

  // 17. Click 'Delete Account' button
  test('Step 17: Click Delete Account button', async () => {
    await page.getByRole('link', { name: 'Delete Account' }).click();
  });

  // 18. Verify that 'ACCOUNT DELETED!' is visible and click 'Continue' button
  test('Step 18: Verify ACCOUNT DELETED! is visible and click Continue', async () => {
    // FIXED: Enclosed attribute custom target selector cleanly
    const accountDeletedHeading = page.locator('[data-qa="account-deleted"]');
    await expect(accountDeletedHeading).toBeVisible();
    
    await page.locator('[data-qa="continue-button"]').click();
  });
});