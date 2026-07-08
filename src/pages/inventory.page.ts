import { type Page, type Locator, expect } from '@playwright/test';

export type SortOption =
    | 'az'
    | 'za'
    | 'lohi' // price: low to high
    | 'hilo'; // price: high to low

export class InventoryPage {
    readonly page: Page;
    readonly title: Locator;
    readonly inventoryItems: Locator;
    readonly inventoryItemNames: Locator;
    readonly inventoryItemPrices: Locator;
    readonly cartBadge: Locator;
    readonly cartLink: Locator;
    readonly sortDropdown: Locator;

    constructor(page: Page) {
        this.page = page;
        this.title = page.locator('.title');
        this.inventoryItems = page.locator('.inventory_item');
        this.inventoryItemNames = page.locator('inventory_item_name');
        this.inventoryItemPrices = page.locator('inventory_item_price');
        this.cartBadge = page.locator('.shopping_cart_badge');
        this.cartLink = page.locator('.shopping_cart_link');
        this.sortDropdown = page.locator('.product_sort_container');
    }

    async expectLoaded(): Promise<void> {
        await expect(this.page).toHaveURL(/.*inventory\.html/);
        await expect(this.title).toHaveText('Products');
    }

    async addProductToCart(productName: string): Promise<void> {
        const item = this.page.locator('.inventory_item').filter({ hasText: productName });
        await item.getByRole('button', { name: 'Add to cart' }).click();
    }

    async cartCount(count: number): Promise<number> {
        if ((await this.cartBadge.count()) == 0) {
            return 0;
        }
        const text = await this.cartBadge.textContent();
        return Number(text?.trim() ?? '0');
    }

    async openCart(): Promise<void> {
        await this.cartLink.click();
    }

    async sortBy(option: SortOption): Promise<void> {
        await this.sortDropdown.selectOption(option);
    }

    async getPrices(): Promise<number[]> {
        const raw = await this.inventoryItemPrices.allTextContents();
        return raw.map((price) => Number(price.replace('$', '').trim()))
    }

}