import { test, expect } from '@fixtures/fixture';

test.describe('Product sorting', () => {
    test('sorting by price (low to high) sorts the list correctly', async ({
        loggedInInventory,
    }) => {
        await loggedInInventory.sortBy('lohi');

        const prices = await loggedInInventory.getPrices();

        // Validates via code: the list should be in ascending order
        const expected = [...prices].sort((a, b) => a - b);
        expect(prices).toEqual(expected);
    });

    test('sorting by price (high to low) sorts the list correctly', async ({
        loggedInInventory,
    }) => {
        await loggedInInventory.sortBy('hilo');

        const prices = await loggedInInventory.getPrices();
        const expected = [...prices].sort((a, b) => b - a);
        expect(prices).toEqual(expected);
    });

    test('sorting by name (A to Z) sorts alphabetically', async ({
        loggedInInventory,
    }) => {
        await loggedInInventory.sortBy('az');

        const names = await loggedInInventory.inventoryItemNames.allTextContents();
        const expected = [...names].sort((a, b) => a.localeCompare(b));
        expect(names).toEqual(expected);
    });
});
