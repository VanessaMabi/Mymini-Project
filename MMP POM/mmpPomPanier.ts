import { Locator, Page } from '@playwright/test';
import { extrairePrix } from './mmpPrix';

export class MmpPomPanier {
  readonly page: Page;
  readonly heading: Locator;
  readonly emptyHeading: Locator;
  readonly browseProductsButton: Locator;
  readonly clearCartButton: Locator;
  readonly checkoutButton: Locator;
  readonly continueShoppingButton: Locator;
  readonly subtotalRow: Locator;
  readonly shippingRow: Locator;
  readonly totalRow: Locator;
  readonly lines: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Votre Panier' });
    this.emptyHeading = page.getByText('Votre panier est vide');
    this.browseProductsButton = page.getByTestId('browse-products-button');
    this.clearCartButton = page.getByTestId('clear-cart-button');
    this.checkoutButton = page.getByTestId('checkout-button');
    this.continueShoppingButton = page.getByTestId('continue-shopping-button');
    const recapitulatif = page.getByRole('heading', { name: 'Récapitulatif' }).locator('..');
    this.subtotalRow = recapitulatif.getByText(/^Sous-total \(\d+ articles?\)$/).locator('..');
    this.shippingRow = recapitulatif.getByText('Livraison', { exact: true }).locator('..');
    this.totalRow = recapitulatif.getByText('Total', { exact: true }).locator('..');
    this.lines = page.getByRole('main').locator('[data-testid^="quantity-"]');
  }

  /** Ligne du panier d'un produit (bloc qui contient son nom et sa quantité). */
  line(id: number): Locator {
    return this.page
      .getByRole('main')
      .locator('div')
      .filter({ has: this.page.getByTestId(`quantity-${id}`) })
      .filter({ has: this.page.getByRole('heading', { level: 3 }) })
      .last();
  }

  quantity(id: number): Locator {
    return this.page.getByTestId(`quantity-${id}`);
  }

  async increase(id: number, fois = 1): Promise<void> {
    for (let i = 0; i < fois; i++) await this.page.getByTestId(`increase-quantity-${id}`).click();
  }

  async decrease(id: number, fois = 1): Promise<void> {
    for (let i = 0; i < fois; i++) await this.page.getByTestId(`decrease-quantity-${id}`).click();
  }

  async remove(id: number): Promise<void> {
    await this.page.getByTestId(`remove-item-${id}`).click();
  }

  async clear(): Promise<void> {
    await this.clearCartButton.click();
  }

  /** Prix unitaire et total de la ligne : [unitaire, total]. */
  async linePrices(id: number): Promise<{ unitaire: number; total: number }> {
    const prix = extrairePrix(await this.line(id).innerText());
    return { unitaire: prix[0], total: prix[prix.length - 1] };
  }

  async subtotal(): Promise<number> {
    return extrairePrix(await this.subtotalRow.innerText())[0];
  }

  async total(): Promise<number> {
    return extrairePrix(await this.totalRow.innerText())[0];
  }

  async goToCheckout(): Promise<void> {
    await this.checkoutButton.click();
    await this.page.waitForURL('**/checkout');
  }
}
