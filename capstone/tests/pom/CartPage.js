class CartPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.cartRows = page.locator('#cart_info_table tbody tr');
    this.emptyCartMessage = page.locator('#empty_cart p');
    this.proceedToCheckoutButton = page.locator('.check_out');
  }

  async navigate() {
    await this.page.goto('https://automationexercise.com/view_cart');
  }

  getCartRow(productId) {
    return this.page.locator(`tr#product-${productId}`);
  }

  async deleteItem(productId) {
    await this.getCartRow(productId).locator('.cart_delete .cart_quantity_delete').click();
    await this.getCartRow(productId).waitFor({ state: 'detached', timeout: 5000 });
  }
}

module.exports = { CartPage };