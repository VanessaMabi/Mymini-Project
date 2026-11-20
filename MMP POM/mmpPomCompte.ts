import { Locator, Page } from '@playwright/test';

export class MmpPomCompte {
  readonly page: Page;
  readonly heading: Locator;
  readonly logoutButton: Locator;
  readonly profileTab: Locator;
  readonly ordersTab: Locator;
  readonly settingsTab: Locator;
  readonly editButton: Locator;
  readonly ordersHeading: Locator;
  readonly orders: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Mon Compte' });
    this.logoutButton = page.getByTestId('account-logout-button');
    this.profileTab = page.getByTestId('account-tab-profile');
    this.ordersTab = page.getByTestId('account-tab-orders');
    this.settingsTab = page.getByTestId('account-tab-settings');
    this.editButton = page.getByTestId('account-edit-button');
    this.ordersHeading = page.getByText('Historique des commandes');
    this.orders = page.locator('[data-testid^="account-order-toggle-"]');
  }

  async goto(): Promise<void> {
    await this.page.goto('/account');
  }

  /** Valeur affichée sous un libellé du profil ("Email", "Téléphone", "Ville"…). */
  profileValue(libelle: string): Locator {
    return this.page.getByRole('main').getByText(libelle, { exact: true }).locator('xpath=following-sibling::*[1]');
  }

  async openOrders(): Promise<void> {
    await this.ordersTab.click();
    await this.ordersHeading.waitFor();
  }

  /** Commande de l'historique à partir du numéro affiché à la confirmation (#TH-ECEBD694). */
  order(numeroConfirmation: string): Locator {
    const id = numeroConfirmation.replace('#TH-', '').toLowerCase();
    return this.page.getByTestId(`account-order-toggle-${id}`);
  }
}
