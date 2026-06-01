class CheckoutPage {
  /**
   * @param {import('@playwright/test').Page} page
   */
  constructor(page) {
    this.page = page;
    this.commentTextArea = page.locator('textarea[name="message"]');
    this.placeOrderButton = page.locator('.check_out:has-text("Place Order")');
    this.deliveryAddressList = page.locator('#address_delivery');
    this.billingAddressList = page.locator('#address_invoice');
    
    this.nameOnCardInput = page.locator('[data-qa="name-on-card"]');
    this.cardNumberInput = page.locator('[data-qa="card-number"]');
    this.cvcInput = page.locator('[data-qa="cvc"]');
    this.expiryMonthInput = page.locator('[data-qa="expiry-month"]');
    this.expiryYearInput = page.locator('[data-qa="expiry-year"]');
    this.submitPaymentButton = page.locator('[data-qa="pay-button"]');
    this.successMessage = page.locator('[data-qa="order-placed"] p');
  }

  async navigateToCheckout() {
    await this.page.goto('https://automationexercise.com/checkout');
  }

  async enterOrderComment(comment) {
    await this.commentTextArea.fill(comment);
  }

  async fillPaymentDetails(name, cardNum, cvc, month, year) {
    await this.nameOnCardInput.fill(name);
    await this.cardNumberInput.fill(cardNum);
    await this.cvcInput.fill(cvc);
    await this.expiryMonthInput.fill(month);
    await this.expiryYearInput.fill(year);
  }
}

module.exports = { CheckoutPage };