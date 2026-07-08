import { type Page, type Locator, expect } from '@playwright/test';

export class CartPage {
    readonly page: Page;
    readonly title: Locator;
    readonly checkoutButton: Locator;
    readonly cartItems: Locator;
    readonly cartItemsName: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('.title');
        this.checkoutButton = page.locator('#checkout');
        this.cartItems = page.locator('.cart_item');
        this.cartItemsName = page.locator('.inventory_item_name')
    }

    async expectLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/cart\.html/);
    }

    async getItemsName(): Promise<string[]> {
        return this.cartItemsName.allTextContents();
    }

    async expectItemsCount(count: number): Promise<void> {
        await expect(this.cartItems).toHaveCount(count);
    }

    async doCheckout(): Promise<void> {
        await this.checkoutButton.click();
    }
}