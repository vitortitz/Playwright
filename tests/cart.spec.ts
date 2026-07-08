import { test, expect } from '@fixtures/fixture';

const PRODUCT_A = 'Sauce Labs Backpack';
const PRODUCT_B = 'Sauce Labs Bike Light';

test.describe('Cart', () => {


    test('badge starts empty', async ({ loggedInInventory }) => {
        await loggedInInventory.cartCount(0);
    });
    test('adding 2 products to the cart updates the badge and cart content', async ({
        loggedInInventory, cartPage }) => {
        await loggedInInventory.addProductToCart(PRODUCT_A);
        await loggedInInventory.addProductToCart(PRODUCT_B);

        await loggedInInventory.cartCount(2);

        await loggedInInventory.openCart();
        await cartPage.expectLoaded();
        await cartPage.expectItemsCount(2);

        const names = await cartPage.getItemsName();
        expect(names).toEqual(expect.arrayContaining([PRODUCT_A, PRODUCT_B]));
    });

    test('adding one item to the cart reflects quantity 1', async ({
        loggedInInventory
    }) => {
        await loggedInInventory.addProductToCart(PRODUCT_A);
        await loggedInInventory.cartCount(1);
    });
});