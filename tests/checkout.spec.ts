import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { CartPage } from '../pages/CartPage';
import { CheckoutPage } from '../pages/CheckoutPage';
import { users, PASSWORD, products, customer, errorMessages } from '../test-data/users';

test.describe('Checkout', () => {
  let inventory: InventoryPage;
  let cart: CartPage;
  let checkout: CheckoutPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard, PASSWORD);
    inventory = new InventoryPage(page);
    cart = new CartPage(page);
    checkout = new CheckoutPage(page);

    // Every checkout test starts with two items in the cart
    await inventory.addToCart(products.backpack);
    await inventory.addToCart(products.bikeLight);
    await inventory.openCart();
    await cart.checkout();
  });

  test('complete purchase end-to-end', async ({ page }) => {
    await checkout.fillInformation(customer.firstName, customer.lastName, customer.postalCode);
    await expect(page).toHaveURL(/checkout-step-two\.html/);

    await checkout.finish();

    await expect(page).toHaveURL(/checkout-complete\.html/);
    await expect(checkout.completeHeader).toHaveText('Thank you for your order!');
    await expect(inventory.cartBadge).toBeHidden(); // cart is emptied after ordering
  });

  test('item total, tax and total are calculated correctly', async () => {
    await checkout.fillInformation(customer.firstName, customer.lastName, customer.postalCode);

    const prices = await checkout.getItemPrices();
    const subtotal = await checkout.getSubtotal();
    const tax = await checkout.getTax();
    const total = await checkout.getTotal();

    const expectedSubtotal = prices.reduce((sum, p) => sum + p, 0);

    // toBeCloseTo avoids false failures from decimal rounding (e.g. 0.1 + 0.2)
    expect(subtotal).toBeCloseTo(expectedSubtotal, 2);
    expect(tax).toBeCloseTo(subtotal * 0.08, 2); // SauceDemo charges 8% tax
    expect(total).toBeCloseTo(subtotal + tax, 2);
  });

  test('first name is required', async () => {
    await checkout.fillInformation('', customer.lastName, customer.postalCode);
    await expect(checkout.errorMessage).toHaveText(errorMessages.firstNameRequired);
  });

  test('last name is required', async () => {
    await checkout.fillInformation(customer.firstName, '', customer.postalCode);
    await expect(checkout.errorMessage).toHaveText(errorMessages.lastNameRequired);
  });

  test('postal code is required', async () => {
    await checkout.fillInformation(customer.firstName, customer.lastName, '');
    await expect(checkout.errorMessage).toHaveText(errorMessages.postalCodeRequired);
  });
});
