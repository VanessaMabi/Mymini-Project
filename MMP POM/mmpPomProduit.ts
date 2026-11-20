import { Locator, Page } from '@playwright/test';
import { extrairePrix } from './mmpPrix';

export class MmpPomProduit {
  readonly page: Page;
  readonly main: Locator;
  readonly backLink: Locator;
  readonly title: Locator;
  readonly addToCartButton: Locator;
  readonly wishlistButton: Locator;
  readonly shareButton: Locator;
  readonly inStockText: Locator;
  readonly outOfStockText: Locator;
  readonly notFoundText: Locator;
  readonly rating: Locator;
  readonly reviewsHeading: Locator;
  readonly similarProducts: Locator;

  constructor(page: Page) {
    this.page = page;
    this.main = page.getByRole('main');
    this.backLink = page.getByTestId('product-detail-back-link');
    this.title = this.main.getByRole('heading', { level: 1 });
    this.addToCartButton = page.getByTestId('product-detail-add-to-cart');
    this.wishlistButton = page.getByTestId('product-detail-wishlist-button');
    this.shareButton = page.getByTestId('product-detail-share-button');
    this.inStockText = this.main.getByText(/^En stock/);
    // "Rupture de stock" apparaît aussi sur les cartes des produits similaires : on cible la zone détail.
    this.outOfStockText = this.title.locator('xpath=..').getByText('Rupture de stock', { exact: true });
    this.notFoundText = page.getByText('Produit non trouvé');
    this.rating = this.main.getByText(/^\d\.\d \(\d+ avis\)$/);
    this.reviewsHeading = page.getByRole('heading', { name: 'Avis clients' });
    this.similarProducts = this.main.locator('[data-testid^="product-card-"]');
  }

  async goto(id: number | string): Promise<void> {
    await this.page.goto(`/product/${id}`);
  }

  /** [prix actuel, prix barré?] lus dans le bloc d'informations du produit. */
  async prices(): Promise<number[]> {
    const bloc = this.title.locator('xpath=..');
    return extrairePrix(await bloc.innerText()).slice(0, 2);
  }

  async addToCart(): Promise<void> {
    await this.addToCartButton.click();
  }

  async backToCatalog(): Promise<void> {
    await this.backLink.click();
    await this.page.waitForURL('**/products');
  }
}
