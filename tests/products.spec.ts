import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { InventoryPage } from '../pages/InventoryPage';
import { users, PASSWORD } from '../test-data/users';

test.describe('Products page sorting', () => {
  let inventory: InventoryPage;

  test.beforeEach(async ({ page }) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(users.standard, PASSWORD);
    inventory = new InventoryPage(page);
  });

  test('sort by name A to Z', async () => {
    await inventory.sortBy('az');
    const names = await inventory.getNames();
    expect(names).toEqual([...names].sort());
  });

  test('sort by name Z to A', async () => {
    await inventory.sortBy('za');
    const names = await inventory.getNames();
    expect(names).toEqual([...names].sort().reverse());
  });

  test('sort by price low to high', async () => {
    await inventory.sortBy('lohi');
    const prices = await inventory.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => a - b));
  });

  test('sort by price high to low', async () => {
    await inventory.sortBy('hilo');
    const prices = await inventory.getPrices();
    expect(prices).toEqual([...prices].sort((a, b) => b - a));
  });
});
