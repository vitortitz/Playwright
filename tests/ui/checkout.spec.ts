import { test, expect } from '@fixtures/fixture';

test.describe('E2E Purchase Flow', () => {
    test('complete purchase: login -> cart -> checkout -> success', async ({
        loggedInInventory, cartPage, checkoutPage
    }) => {
        await loggedInInventory.addProductToCart('Sauce Labs Backpack');
        await loggedInInventory.cartCount(1);

        await loggedInInventory.openCart();
        await cartPage.expectLoaded();
        await cartPage.expectItemsCount(1);
        await cartPage.doCheckout();


        await checkoutPage.fillInformation({
            firstName: 'Vitor',
            lastName: 'Silva',
            postalCode: '38910-000'
        });

        await checkoutPage.finish();

        await checkoutPage.expectOrderComplete();
    });
});