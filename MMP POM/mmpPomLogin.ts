import { Locator, Page } from '@playwright/test';

export class MmpPomLogin {
  readonly page: Page;
  readonly loginTab: Locator;
  readonly panel: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly statusToast: Locator;
  readonly errorMessage: Locator;
  readonly successMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.loginTab = page.getByRole('tab', { name: 'Connexion' });
    this.panel = page.getByRole('tabpanel', { name: 'Connexion' });
    this.emailInput = this.panel.getByLabel('Email');
    this.passwordInput = this.panel.getByLabel('Mot de passe', { exact: true });
    this.submitButton = this.panel.getByRole('button', { name: 'Se connecter' });
    this.statusToast = page
      .getByRole('region', { name: /Notifications/ })
      .getByRole('status');
    this.errorMessage = this.statusToast.getByText('Email ou mot de passe incorrect');
    this.successMessage = this.statusToast.getByText('Bienvenue sur TechHub !');
  }

  async goto(): Promise<void> {
    await this.page.goto(process.env.MMP_URL ?? 'https://shop.missionplaywright.fr/auth');
  }

  async login(email: string, password: string): Promise<void> {
    await this.loginTab.click();
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
  }
}