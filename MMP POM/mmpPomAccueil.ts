import { Locator, Page } from '@playwright/test';

export class MmpPomAccueil {
  readonly page: Page;
  readonly header: Locator;
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly aboutLink: Locator;
  readonly contactLink: Locator;
  readonly searchButton: Locator;
  readonly cartLink: Locator;
  readonly loginButton: Locator;
  readonly authLink: Locator;
  readonly categoriesHeading: Locator;
  readonly accessoriesCategoryLink: Locator;
  readonly catalogHeading: Locator;
  readonly productLinks: Locator;

  constructor(page: Page) {
    this.page = page;
    this.header = page.getByRole('banner');
    this.homeLink = this.header.getByRole('link', { name: 'Accueil', exact: true });
    this.productsLink = this.header.getByRole('link', { name: 'Produits', exact: true });
    this.aboutLink = this.header.getByRole('link', { name: 'À propos', exact: true });
    this.contactLink = this.header.getByRole('link', { name: 'Contact', exact: true });
    this.searchButton = this.header.getByTestId('search-button');
    this.cartLink = this.header.getByTestId('cart-link');
    this.loginButton = this.header.getByTestId('login-button');
    this.authLink = this.header.getByTestId('auth-link');
    this.categoriesHeading = page.getByRole('heading', { name: 'Explorez nos catégories' });
    this.accessoriesCategoryLink = page.getByTestId('category-link-accessories');
    this.catalogHeading = page.getByRole('heading', { name: 'Notre Catalogue' });
    this.productLinks = page.locator('main a[href^="/product/"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('https://shop.missionplaywright.fr/');
  }

  async openAccessoriesCategory(): Promise<void> {
    await this.accessoriesCategoryLink.click();
  }
}
