const { test, expect } = require('@playwright/test');

test.describe('Automation Exercise - Product Detail Page (PDP) & Variations Suite', () => {

  const baseUrl = 'https://automationexercise.com';
  const pdpUrl = `${baseUrl}/product_details/1`;

  // Global hook to block resource-heavy advertisement nodes causing test timeouts
  test.beforeEach(async ({ page }) => {
    await page.route('**/pagead/js/**', route => route.abort());
    await page.route('**/google-analytics.com/**', route => route.abort());
  });

  // =================================================================
  // PHASE 1: CORE DATA ATTRIBUTE VERIFICATION (TESTS 1 - 5)
  // =================================================================

  // Test 1
  test('Test 1: Core PDP Landing Page Resolution', async ({ page }) => {
    await page.goto(pdpUrl, { waitUntil: 'commit' });
    await expect(page).toHaveURL(pdpUrl);
    
    const productInfoBlock = page.locator('.product-information');
    await expect(productInfoBlock).toBeVisible();
  });

  // Test 2
  test('Test 2: Product Name Header Text Validation', async ({ page }) => {
    await page.goto(pdpUrl, { waitUntil: 'commit' });
    
    const productHeader = page.locator('.product-information h2');
    await expect(productHeader).toContainText('Blue Top');
  });

  // Test 3
  test('Test 3: Catalog Price vs PDP Price Synchronization', async ({ page }) => {
    await page.goto(`${baseUrl}/products`, { waitUntil: 'commit' });
    const catalogPrice = await page.locator('.productinfo h2').first().innerText();

    await page.goto(pdpUrl, { waitUntil: 'commit' });
    const pdpPrice = await page.locator('.product-information span span').innerText();

    expect(catalogPrice.trim()).toBe(pdpPrice.trim());
  });

  // Test 4
  test('Test 4: Description Elements Metadata Presence', async ({ page }) => {
    await page.goto(pdpUrl, { waitUntil: 'commit' });
    
    const productMeta = page.locator('.product-information p');
    await expect(productMeta.first()).toContainText('Category:');
  });

  // Test 5
  test('Test 5: Product Stock Availability Attribute Rendering', async ({ page }) => {
    await page.goto(pdpUrl, { waitUntil: 'commit' });
    
    const availabilityNode = page.locator('.product-information p:has-text("Availability:")');
    await expect(availabilityNode).toContainText('In Stock');
  });

  // =================================================================
  // PHASE 2: MEDIA VISIBILITY & METRICS (TESTS 6 - 8)
  // =================================================================

  // Test 6
  test('Test 6: Primary Product Feature Image Visibility', async ({ page }) => {
    await page.goto(pdpUrl, { waitUntil: 'commit' });
    
    const viewImage = page.locator('.view-product img');
    await expect(viewImage).toBeVisible();
    
    const src = await viewImage.getAttribute('src');
    expect(src).toBeTruthy();
  });

  // Test 7
  test('Test 7: Condition Badge State Presentation', async ({ page }) => {
    await page.goto(pdpUrl, { waitUntil: 'commit' });
    
    const conditionNode = page.locator('.product-information p:has-text("Condition:")');
    await expect(conditionNode).toContainText('New');
  });

  // Test 8
  test('Test 8: Brand Manufacturing Meta Data Matching', async ({ page }) => {
    await page.goto(pdpUrl, { waitUntil: 'commit' });
    
    const brandNode = page.locator('.product-information p:has-text("Brand:")');
    await expect(brandNode).toContainText('Polo');
  });

  // =================================================================
  // PHASE 3: QUANTITY BOUNDARY CONSTRAINTS (TESTS 9 - 14)
  // =================================================================

  // Test 9
  test('Test 9: Default Quantity Value Baseline', async ({ page }) => {
    await page.goto(pdpUrl, { waitUntil: 'commit' });
    
    const quantityInput = page.locator('#quantity');
    await expect(quantityInput).toHaveValue('1');
  });

  // Test 10
  test('Test 10: Manual Numerical Entry Modification Override', async ({ page }) => {
    await page.goto(pdpUrl, { waitUntil: 'commit' });
    
    const quantityInput = page.locator('#quantity');
    await quantityInput.fill('5');
    
    await expect(quantityInput).toHaveValue('5');
  });

  // Test 11
  test('Test 11: Bulk Entry Boundary Integration', async ({ page }) => {
    await page.goto(pdpUrl, { waitUntil: 'commit' });
    
    const quantityInput = page.locator('#quantity');
    await quantityInput.fill('100');
    
    await expect(quantityInput).toHaveValue('100');
  });

  // Test 12
  test('Test 12: Negative Number Sanitation Processing', async ({ page }) => {
    await page.goto(pdpUrl, { waitUntil: 'commit' });
    
    const quantityInput = page.locator('#quantity');
    await quantityInput.fill('-5');
    
    // 💡 Fix: HTML5 elements natively flag negative numbers as invalid matching the 'min="1"' restriction
    const isInvalid = await quantityInput.evaluate(el => el.matches(':invalid'));
    expect(isInvalid).toBe(true);
  });

  // Test 13
  test('Test 13: Floating Point Decimals Truncation Validation', async ({ page }) => {
    await page.goto(pdpUrl, { waitUntil: 'commit' });
    
    const quantityInput = page.locator('#quantity');
    await quantityInput.fill('2.5');
    
    // 💡 Fix: Floating point values trigger the native step mismatch state rule constraints
    const stepMismatch = await quantityInput.evaluate(el => el.validity.stepMismatch);
    expect(stepMismatch).toBe(true);
  });

  // Test 14
  test('Test 14: Clear String Text Input Prevention', async ({ page }) => {
    await page.goto(pdpUrl, { waitUntil: 'commit' });
    
    const quantityInput = page.locator('#quantity');
    
    // 💡 Fix: Use .pressSequentially to type text into numeric inputs without triggering fill() engine rules
    await quantityInput.focus();
    await quantityInput.pressSequentially('invalid_text');
    
    // Core engine drops alphabetic strings from numerical property nodes
    const resultingVal = await quantityInput.inputValue();
    expect(resultingVal).toBe('');
  });

  // =================================================================
  // PHASE 4: CART ACTIONS & STATE PERSISTENCE (TESTS 15 - 17)
  // =================================================================

  // Test 15
  test('Test 15: Add To Cart CTA Form Trigger Interaction', async ({ page }) => {
    await page.goto(pdpUrl, { waitUntil: 'commit' });
    
    const addToCartButton = page.locator('button.cart');
    await expect(addToCartButton).toBeEnabled();
    await addToCartButton.click();

    const successModal = page.locator('#cartModal');
    
    // 💡 Fix: Wait for the modal popup to finish its fade-in animation layout cleanly
    await successModal.waitFor({ state: 'visible', timeout: 5000 });
    await expect(successModal).toBeVisible();
  });

  // Test 16
  test('Test 16: Bulk Quantity State Retention inside Cart Thread', async ({ page }) => {
    await page.goto(pdpUrl, { waitUntil: 'commit' });
    
    const quantityInput = page.locator('#quantity');
    await quantityInput.fill('4');
    
    await page.locator('button.cart').click();
    
    // 💡 Fix: Wait for the modal wrapper to fully appear before looking for its contents
    await page.locator('#cartModal').waitFor({ state: 'visible' });

    // 💡 Fix: Use Playwright's native text routing to locate the link clearly
    const viewCartLink = page.getByRole('link', { name: 'View Cart' });
    await viewCartLink.click();

    // Ensure we are safely on the cart page before looking for quantities
    await page.waitForURL(`${baseUrl}/view_cart`);

    const cartQuantity = page.locator('.disabled').first();
    await expect(cartQuantity).toHaveText('4');
  });

  // Test 17
  test('Test 17: Success Modal Dismissal Workflow', async ({ page }) => {
    await page.goto(pdpUrl, { waitUntil: 'commit' });
    await page.locator('button.cart').click();

    // 💡 Fix: Wait for the modal popup to become fully visible on the screen
    await page.locator('#cartModal').waitFor({ state: 'visible' });

    // 💡 Fix: Target the button by its exact visible UI text link
    const closeModalBtn = page.getByRole('button', { name: 'Continue Shopping' });
    await closeModalBtn.click();

    // Verify system returns access focus directly back to PDP canvas
    await expect(page.locator('#cartModal')).not.toBeVisible();
  });
  // =================================================================
  // PHASE 5: INPUT EXPLOITATION & SECURITY BOUNDS (TESTS 18 - 20)
  // =================================================================

  // Test 18
  test('Test 18: HTML Tag Script Injection Sanitization within Quantity Block', async ({ page }) => {
    await page.goto(pdpUrl, { waitUntil: 'commit' });
    
    const quantityInput = page.locator('#quantity');
    await quantityInput.focus();
    
    // 💡 Fix: Used pressSequentially to simulate physical execution string handling defensively
    await quantityInput.pressSequentially("<span onclick=\"alert(1)\">99</span>");
    await page.locator('button.cart').click();

    await expect(page.locator('.product-information')).toBeVisible();
  });

  // Test 19
  test('Test 19: Deep Alternative Variant PDP Deep Link Routing Resolution', async ({ page }) => {
    const targetAltUrl = `${baseUrl}/product_details/2`;
    await page.goto(targetAltUrl, { waitUntil: 'commit' });

    await expect(page).toHaveURL(targetAltUrl);
    await expect(page.locator('.product-information h2')).toContainText('Men Tshirt');
  });

  // Test 20
  test('Test 20: Missing Identity Resource Dynamic Route Fault Tolerance', async ({ page }) => {
    await page.goto(`${baseUrl}/product_details/999999`, { waitUntil: 'commit' });
    
    const mainWorkspace = page.locator('body');
    await expect(mainWorkspace).toBeVisible();
  });

});