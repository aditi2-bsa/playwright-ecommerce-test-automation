import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { users, PASSWORD, products, customer } from '../test-data/users';

/**
 * Known-bug tests for "problem_user".
 *
 * Each test checks the CORRECT behaviour. Because the bug is present,
 * the check fails, and test.fail() marks that failure as "expected".
 *   - Bug still there  -> test shows as passed (expected failure)
 *   - Bug gets fixed   -> Playwright flags it, so the team knows to update the test
 *
 * The bug IDs (BUG-001 ...) match the reports in docs/bug-reports.md.
 */
test.describe('Known bugs: problem_user', () => {
  let inventory: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.problem, PASSWORD);
    inventory = new InventoryPage(page);
  });

    test('BUG-001: every product should have its own image', async () => {
    test.fail(true, 'BUG-001: all products show the same image');

    // Wait for all 6 products to load before reading their images
    await expect(inventory.items).toHaveCount(6);

    const imageSources = await inventory.items
      .locator('img')
      .evaluateAll((imgs) => imgs.map((img) => img.getAttribute('src')));

    expect(imageSources).toHaveLength(6); // guard: never pass with 0 images
    expect(new Set(imageSources).size).toBe(6);
  });

  test('BUG-002: sorting Z to A should reorder the products', async () => {
    test.fail(true, 'BUG-002: sort dropdown does not change the order');

    await inventory.sortBy('za');
    const names = await inventory.getNames();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('BUG-003: "Add to cart" should work for every product', async () => {
    test.fail(true, 'BUG-003: some Add to cart buttons do nothing');

    await inventory.addToCart(products.fleeceJacket);
    await expect(inventory.cartBadge).toHaveText('1');
  });

  test('BUG-004: clicking a product name should open that product', async ({ page }) => {
    test.fail(true, 'BUG-004: product link opens a different product');

    await inventory.itemNames.filter({ hasText: products.backpack }).click();

    // On the details page, the product name uses the same data-test value
    await expect(page.getByTestId('inventory-item-name')).toHaveText(products.backpack);
  });

  test('BUG-005: checkout should accept a valid last name', async ({ page }) => {
    test.fail(true, 'BUG-005: last name field cannot be filled, blocking checkout');

    const cart = new CartPage(page);
    const checkout = new CheckoutPage(page);

    await inventory.addToCart(products.backpack);
    await inventory.openCart();
    await cart.checkout();
    await checkout.fillInformation(customer.firstName, customer.lastName, customer.postalCode);

    await expect(page).toHaveURL(/checkout-step-two\.html/);
  });
});
