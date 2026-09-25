import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { users, PASSWORD, errorMessages } from '../test-data/users';

test.describe('Login', () => {
  let loginPage: LoginPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    await loginPage.goto();
  });

  test('standard user can log in and sees the products page', async ({ page }) => {
    await loginPage.login(users.standard, PASSWORD);

    const inventory = new InventoryPage(page);
    await expect(page).toHaveURL(/inventory\.html/);
    await expect(inventory.title).toHaveText('Products');
    await expect(inventory.items).toHaveCount(6);
  });

  test('wrong password shows an error', async ({ page }) => {
    await loginPage.login(users.standard, 'wrong_password');

    await expect(loginPage.errorMessage).toHaveText(errorMessages.invalidCredentials);
    await expect(page).not.toHaveURL(/inventory\.html/);
  });

  test('locked-out user cannot log in', async () => {
    await loginPage.login(users.lockedOut, PASSWORD);

    await expect(loginPage.errorMessage).toHaveText(errorMessages.lockedOut);
  });

  test('empty username shows "Username is required"', async () => {
    await loginPage.login('', PASSWORD);

    await expect(loginPage.errorMessage).toHaveText(errorMessages.usernameRequired);
  });

  test('empty password shows "Password is required"', async () => {
    await loginPage.login(users.standard, '');

    await expect(loginPage.errorMessage).toHaveText(errorMessages.passwordRequired);
  });

  test('cannot open the products page without logging in', async ({ page }) => {
    await page.goto('/inventory.html');

    // SauceDemo sends you back to login with an error
    await expect(page).toHaveURL('https://www.saucedemo.com/');
    await expect(loginPage.errorMessage).toContainText('You can only access');
  });
});
