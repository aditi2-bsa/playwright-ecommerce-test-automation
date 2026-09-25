import { type Locator, type Page } from '@playwright/test';

/**
 * Page Object for the three checkout steps:
 *  1. Your Information (name + postal code)
 *  2. Overview (items, subtotal, tax, total)
 *  3. Complete ("Thank you for your order!")
 */
export class CheckoutPage {
  readonly page: Page;

  // Step 1
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;
  readonly errorMessage: Locator;

  // Step 2
  readonly itemPrices: Locator;
  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  // Step 3
  readonly completeHeader: Locator;

  constructor(page: Page) {
    this.page = page;
    this.firstNameInput = page.getByTestId('firstName');
    this.lastNameInput = page.getByTestId('lastName');
    this.postalCodeInput = page.getByTestId('postalCode');
    this.continueButton = page.getByTestId('continue');
    this.errorMessage = page.getByTestId('error');

    this.itemPrices = page.getByTestId('inventory-item-price');
    this.subtotalLabel = page.getByTestId('subtotal-label');
    this.taxLabel = page.getByTestId('tax-label');
    this.totalLabel = page.getByTestId('total-label');
    this.finishButton = page.getByTestId('finish');

    this.completeHeader = page.getByTestId('complete-header');
  }

  async fillInformation(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.fill(firstName);
    await this.lastNameInput.fill(lastName);
    await this.postalCodeInput.fill(postalCode);
    await this.continueButton.click();
  }

  /** Pulls the dollar amount out of labels like "Item total: $29.99". */
  private async readAmount(label: Locator): Promise<number> {
    const text = (await label.textContent()) ?? '';
    const match = text.match(/\$([\d.]+)/);
    if (!match) throw new Error(`No dollar amount found in "${text}"`);
    return parseFloat(match[1]);
  }

  async getSubtotal() {
    return this.readAmount(this.subtotalLabel);
  }

  async getTax() {
    return this.readAmount(this.taxLabel);
  }

  async getTotal() {
    return this.readAmount(this.totalLabel);
  }

  async getItemPrices(): Promise<number[]> {
    const texts = await this.itemPrices.allTextContents();
    return texts.map((t) => parseFloat(t.replace('$', '')));
  }

  async finish() {
    await this.finishButton.click();
  }
}
