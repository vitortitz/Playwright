import { test, expect } from '@fixtures/fixture';
import { users, invalidLoginScenarios } from '@data/users';

test.describe('Login', () => {
  test.beforeEach(async ({ loginPage }) => {
    await loginPage.goto();
  });

  test('successful login displays the products screen', async ({ loginPage, inventoryPage }) => {
    await loginPage.login(users.standard);
    await inventoryPage.expectLoaded();
  });

  test('locked out user is prevented from logging in', async ({ loginPage }) => {
    await loginPage.login(users.lockedOut);
  })

  for (const scenario of invalidLoginScenarios) {
    test(`invalid login: ${scenario.description}`, async ({ loginPage }) => {
      await loginPage.login({
        username: scenario.username,
        password: scenario.password
      });
      await loginPage.getErrorMessage(scenario.expectedError)
    })
  }

  test('user with incorrect credentials remains on the page', async ({ loginPage, page }) => {
    await loginPage.login(users.invalid);
    await expect(page).toHaveURL('https://www.saucedemo.com/')
  })

});