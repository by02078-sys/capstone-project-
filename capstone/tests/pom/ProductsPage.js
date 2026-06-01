const { expect } = require('@playwright/test');

class ProductsPage {
    /**
     * @param {import('@playwright/test').Page} page
     */
    constructor(page) {
        this.page = page;
        this.productsLink = page.locator('.shop-menu a[href="/products"]');
        this.searchInput = page.locator('#search_product');
        this.searchButton = page.locator('#submit_search');
        this.firstProductCard = page.locator('.single-products').first();
        this.addToCartButton = page.locator('.overlay-content .add-to-cart').first();
        this.continueShoppingButton = page.locator('button:has-text("Continue Shopping")');
        this.viewCartLink = page.locator('u:has-text("View Cart")');
    }

    async navigate() {
        await this.page.goto('https://automationexercise.com/products');
        await this.searchInput.waitFor({ state: 'visible' });
    }

    async addFirstProductToCart() {
        await this.firstProductCard.hover();
        await this.page.locator('.productinfo .add-to-cart').first().click();
    }
}

module.exports = { ProductsPage };