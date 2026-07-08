import { test as base } from '@playwright/test';
import { LoginPage } from '@pages/login.page';
import { InventoryPage } from '@pages/inventory.page'
import { CartPage } from '@pages/cart.page';
import { users } from '@data/users'
import { CheckoutPage } from '@pages/checkout.page';
/**
 * Custom fixtures.
 *
 * - Page Objects are injected ready to use, avoiding repeated `new Page(page)`.
 * - `loggedInInventory` already provides the standard authenticated user, so
 *   tests that assume an already started session don't repeat the login step.
 * - `bookingApi` provides the already authenticated API service.
 */
type Fixtures = {
    loginPage: LoginPage;
    inventoryPage: InventoryPage;
    loggedInInventory: InventoryPage;
    cartPage: CartPage
    checkoutPage: CheckoutPage
};

export const test = base.extend<Fixtures>({
    loginPage: async ({ page }, use) => {
        await use(new LoginPage(page));
    },

    inventoryPage: async ({ page }, use) => {
        await use(new InventoryPage(page));
    },

    cartPage: async ({ page }, use) => {
        await use(new CartPage(page));
    },
    checkoutPage: async ({ page }, use) => {
        await use(new CheckoutPage(page));
    },

    loggedInInventory: async ({ page }, use) => {
        const loginPage = new LoginPage(page);
        const inventoryPage = new InventoryPage(page);
        await loginPage.goto();
        await loginPage.login(users.standard);
        await inventoryPage.expectLoaded();
        await use(inventoryPage);
    }

});
export { expect } from '@playwright/test';

