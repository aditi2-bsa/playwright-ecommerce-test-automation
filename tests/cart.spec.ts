import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { users, PASSWORD, products } from '../test-data/users';

test.describe('Shopping cart', () => {
  let inventory: InventoryPage;
  let cart: CartPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard, PASSWORD);
    inventory = new InventoryPage(page);
    cart = new CartPage(page);
  });

  test('cart badge is hidden when the cart is empty', async () => {
    await expect(inventory.cartBadge).toBeHidden();
  });

  test('adding one item shows "1" on the cart badge', async () => {
    await inventory.addToCart(products.backpack);
    await expect(inventory.cartBadge).toHaveText('1');
  });

  test('adding three items shows "3" on the cart badge', async () => {
    await inventory.addToCart(products.backpack);
    await inventory.addToCart(products.bikeLight);
    await inventory.addToCart(products.onesie);
    await expect(inventory.cartBadge).toHaveText('3');
  });

  test('removing an item from the products page updates the badge', async () => {
    await inventory.addToCart(products.backpack);
    await inventory.addToCart(products.bikeLight);
    await inventory.removeFromCart(products.backpack);
    await expect(inventory.cartBadge).toHaveText('1');
  });

  test('added items appear in the cart', async ({ page }) => {
    await inventory.addToCart(products.backpack);
    await inventory.addToCart(products.fleeceJacket);
    await inventory.openCart();

    await expect(page).toHaveURL(/cart\.html/);
    await expect(cart.itemNames).toHaveText([products.backpack, products.fleeceJacket]);
  });

  test('removing an item inside the cart', async () => {
    await inventory.addToCart(products.backpack);
    await inventory.addToCart(products.onesie);
    await inventory.openCart();
    await cart.removeItem(products.backpack);

    await expect(cart.itemNames).toHaveText([products.onesie]);
    await expect(inventory.cartBadge).toHaveText('1');
  });

  test('cart keeps its items after "Continue Shopping"', async () => {
    await inventory.addToCart(products.bikeLight);
    await inventory.openCart();
    await cart.continueShoppingButton.click();

    await expect(inventory.title).toHaveText('Products');
    await expect(inventory.cartBadge).toHaveText('1');
  });
});
