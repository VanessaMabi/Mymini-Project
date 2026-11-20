import { Locator, Page } from '@playwright/test';

/**
 * En-tête commun à toutes les pages (navigation, panier, compte).
 * ⚠️ Le panier est stocké en mémoire : pour le conserver entre deux pages,
 * naviguer avec ces liens (navigation côté client) et non avec page.goto().
 */
export class MmpPomHeader {
  readonly page: Page;
  readonly logo: Locator;
  readonly homeLink: Locator;
  readonly productsLink: Locator;
  readonly aboutLink: Locator;
  readonly contactLink: Locator;
  readonly cartLink: Locator;
  readonly cartCount: Locator;
  readonly authLink: Locator;
  readonly userMenuButton: Locator;
  readonly accountMenuItem: Locator;
  readonly logoutMenuItem: Locator;
  readonly toast: Locator;

  constructor(page: Page) {
    this.page = page;
    this.logo = page.getByTestId('header-logo');
    this.homeLink = page.getByTestId('nav-link-home');
    this.productsLink = page.getByTestId('nav-link-products');
    this.aboutLink = page.getByTestId('nav-link-about');
    this.contactLink = page.getByTestId('nav-link-contact');
    this.cartLink = page.getByTestId('cart-link');
    this.cartCount = page.getByTestId('cart-count');
    this.authLink = page.getByTestId('auth-link');
    this.userMenuButton = page.getByTestId('user-menu-button');
    this.accountMenuItem = page.getByTestId('account-link');
    this.logoutMenuItem = page.getByTestId('logout-button');
    // Le site a 2 zones de notifications ("Notifications (F8)" et "Notifications alt+T") :
    // selon l'action, le toast s'affiche dans l'une ou l'autre.
    this.toast = page.locator('[aria-label^="Notifications"] li');
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
    await this.page.waitForURL('**/cart');
  }

  async openCatalog(): Promise<void> {
    await this.productsLink.click();
    await this.page.waitForURL('**/products');
  }

  async openAccount(): Promise<void> {
    await this.userMenuButton.click();
    await this.accountMenuItem.click();
    await this.page.waitForURL('**/account');
  }

  async logout(): Promise<void> {
    await this.userMenuButton.click();
    await this.logoutMenuItem.click();
  }
}
