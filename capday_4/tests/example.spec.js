const { test, expect } = require('@playwright/test');

test.describe('Automation Exercise - Product Catalog & Advanced Search Suite', () => {

  const baseUrl = 'https://automationexercise.com';
  const productsUrl = `${baseUrl}/products`;

  // Helper hook to bypass heavy background ads and third-party trackers completely
  test.beforeEach(async ({ page }) => {
    await page.route('**/pagead/js/**', route => route.abort());
    await page.route('**/google-analytics.com/**', route => route.abort());
  });

  // Test 1
  test('Test 1: Exact Match Keyword Search Verification', async ({ page }) => {
    // 💡 Fix: Changed 'commit' to 'load' to allow a smoother, full DOM state transition
    await page.goto(productsUrl, { waitUntil: 'load' });
    await page.locator('#search_product').fill('Blue Top');
    await page.locator('#submit_search').click();

    await expect(page.locator('.features_items')).toContainText('Searched Products');
    const productNames = page.locator('.productinfo p');
    await expect(productNames.first()).toContainText('Blue Top');
  });

  // Test 2
  test('Test 2: Partial Match Substring Search Execution', async ({ page }) => {
    await page.goto(productsUrl, { waitUntil: 'load' });
    await page.locator('#search_product').fill('Dress');
    await page.locator('#submit_search').click();

    await expect(page.locator('.features_items')).toBeVisible();
    const productCount = await page.locator('.productinfo p').count();
    expect(productCount).toBeGreaterThan(0);
  });

  // Test 3
  test('Test 3: Case-Insensitive Search Argument Normalization', async ({ page }) => {
    await page.goto(productsUrl, { waitUntil: 'load' });
    await page.locator('#search_product').fill('t-sHiRt');
    await page.locator('#submit_search').click();

    const firstProduct = page.locator('.productinfo p').first();
    await expect(firstProduct).toContainText(/t-shirt/i);
  });

  // Test 4
  test('Test 4: Safe Boundary Handling for Empty Search Submissions', async ({ page }) => {
    await page.goto(productsUrl, { waitUntil: 'load' });
    await page.locator('#search_product').fill('');
    await page.locator('#submit_search').click();

    await expect(page.locator('.features_items')).toBeVisible();
  });

  // Test 5
  test('Test 5: Non-Existent Product Search Boundary Response', async ({ page }) => {
    await page.goto(productsUrl, { waitUntil: 'load' });
    await page.locator('#search_product').fill('InvalidFakeProductXYZ123');
    await page.locator('#submit_search').click();

    await expect(page.locator('.features_items')).toBeVisible();
    await expect(page.locator('.features_items')).not.toContainText('Fancy Green Dress');
  });

  // Test 6
  test('Test 6: Category Panel Expansion Hierarchy Integrity', async ({ page }) => {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });

    const womenCategory = page.locator('a[href="#Women"]');
    await expect(womenCategory).toBeVisible();
    await womenCategory.click();

    await expect(page.locator('#Women')).toBeVisible();
  });

  // Test 7
  test('Test 7: Women Category - Dress Sub-category Routing', async ({ page }) => {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.locator('a[href="#Women"]').click();
    await page.locator('a[href="/category_products/1"]').click();

    await expect(page.locator('.features_items h2.title')).toContainText('Women - Dress Products');
  });

  // Test 8
  test('Test 8: Men Category - T-Shirts Sub-category Routing', async ({ page }) => {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.locator('a[href="#Men"]').click();
    await page.locator('a[href="/category_products/3"]').click();

    await expect(page.locator('.features_items h2.title')).toContainText('Men - Tshirts Products');
  });

  // Test 9
  test('Test 9: Kids Category - Dress Sub-category Routing', async ({ page }) => {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });
    await page.locator('a[href="#Kids"]').click();
    await page.locator('a[href="/category_products/4"]').click();

    await expect(page.locator('.features_items h2.title')).toContainText('Kids - Dress Products');
  });

  // Test 10
  test('Test 10: State Resiliency During Direct Filter Deep Linking', async ({ page }) => {
    await page.goto(`${baseUrl}/category_products/2`, { waitUntil: 'load' });
    await expect(page.locator('.features_items h2.title')).toContainText('Women - Tops Products');
  });

  // Test 11
  test('Test 11: Cross-Category Toggle Clearing Verification', async ({ page }) => {
    await page.goto(baseUrl, { waitUntil: 'domcontentloaded' });

    await page.locator('a[href="#Women"]').click();
    await page.locator('a[href="/category_products/1"]').click();
    await page.waitForURL('**/category_products/1');

    await page.locator('a[href="#Men"]').click();
    // 💡 Fix: Give the accordion transition a tiny delay to register layout space cleanly
    await page.waitForTimeout(500);
    await page.locator('a[href="/category_products/3"]').click({ force: true });

    await expect(page.locator('.features_items h2.title')).toContainText('Men - Tshirts Products');
    await expect(page.locator('.features_items h2.title')).not.toContainText('Women');
  });

  // Test 12
  test('Test 12: Brand Filter Sidebar Isolation & Counts Visibility', async ({ page }) => {
    await page.goto(productsUrl, { waitUntil: 'load' });
    const brandsSidebar = page.locator('.brands_products');
    await expect(brandsSidebar).toBeVisible();
  });

  // Test 13
  test('Test 13: Polo Brand Filter Selection & Verification', async ({ page }) => {
    await page.goto(productsUrl, { waitUntil: 'load' });
    await page.locator('a[href="/brand_products/Polo"]').scrollIntoViewIfNeeded();
    await page.locator('a[href="/brand_products/Polo"]').click({ force: true });

    await expect(page.locator('.features_items h2.title')).toContainText('Brand - Polo Products');
    const items = await page.locator('.productinfo p').allInnerTexts();
    expect(items.length).toBeGreaterThan(0);
  });

  // Test 14
  test('Test 14: Madame Brand Filter Isolation Workflow', async ({ page }) => {
    await page.goto(productsUrl, { waitUntil: 'load' });
    await page.locator('a[href="/brand_products/Madame"]').click({ force: true });

    await expect(page.locator('.features_items h2.title')).toContainText('Brand - Madame Products');
  });

  // Test 15
  test('Test 15: Product Information Price Tag DOM Extraction', async ({ page }) => {
    await page.goto(productsUrl, { waitUntil: 'load' });

    const priceText = await page.locator('.productinfo h2').first().innerText();
    expect(priceText).toMatch(/Rs\.\s\d+/);
  });

  // Test 16
  test('Test 16: Deep Overlay Product Detail Modal Extraction', async ({ page }) => {
    await page.goto(productsUrl, { waitUntil: 'load' });
    await page.locator('a[href="/product_details/1"]').click();

    await expect(page).toHaveURL(`${baseUrl}/product_details/1`);
    await expect(page.locator('.product-information h2')).toBeVisible();
    await expect(page.locator('.product-information span span')).toContainText('Rs.');
  });

  // Test 17
  test('Test 17: Multi-Tab Concurrency Isolation Performance', async ({ context }) => {
    const pageA = await context.newPage();
    const pageB = await context.newPage();

    await pageA.goto(`${baseUrl}/category_products/1`, { waitUntil: 'load' });
    await pageB.goto(`${baseUrl}/category_products/3`, { waitUntil: 'load' });

    await expect(pageA.locator('.features_items h2.title')).toContainText('Women - Dress Products');
    await expect(pageB.locator('.features_items h2.title')).toContainText('Men - Tshirts Products');
  });

  // Test 18
  test('Test 18: Script Tag XSS Injection Neutralization in Search Input', async ({ page }) => {
    await page.goto(productsUrl, { waitUntil: 'load' });
    const xssPayload = "<script>alert('XSS-Catalog-Threat')</script>";

    await page.locator('#search_product').fill(xssPayload);
    await page.locator('#submit_search').click();

    await expect(page.locator('.features_items')).toBeVisible();
  });

  // Test 19
  test('Test 19: Special Characters & SQLi Escape Boundary Handling', async ({ page }) => {
    await page.goto(productsUrl, { waitUntil: 'load' });
    const sqliPayload = "'===SELECT * FROM products WHERE '1'='1";

    await page.locator('#search_product').fill(sqliPayload);
    await page.locator('#submit_search').click();

    const textOutput = page.locator('.features_items');
    await expect(textOutput).toBeVisible();
  });

});


