import { Locator, Page } from '@playwright/test';

export interface RegistrationData {
  nom: string;
  email: string;
  password: string;
  confirmPassword?: string; // par défaut = password
}

export class MmpPomRegistration {
  readonly page: Page;
  readonly signupTab: Locator;
  readonly panel: Locator;
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly confirmPasswordInput: Locator;
  readonly submitButton: Locator;
  readonly statusToast: Locator;
  readonly successMessage: Locator;
  readonly verifyEmailMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.signupTab = page.getByRole('tab', { name: 'Inscription' });
    this.panel = page.getByRole('tabpanel', { name: 'Inscription' });
    this.heading = page.getByRole('heading', { name: 'Créer un compte' });
    this.nameInput = page.getByTestId('signup-name-input');
    this.emailInput = page.getByTestId('signup-email-input');
    this.passwordInput = page.getByTestId('signup-password-input');
    this.confirmPasswordInput = page.getByTestId('signup-confirm-password-input');
    this.submitButton = page.getByTestId('signup-submit-button');
    this.statusToast = page
      .getByRole('region', { name: /Notifications/ })
      .getByRole('status');
    this.successMessage = this.statusToast.getByText('Inscription réussie !');
    this.verifyEmailMessage = this.statusToast.getByText(/Vérifiez votre email pour/);
  }

  async goto(): Promise<void> {
    await this.page.goto(process.env.MMP_URL ?? 'https://shop.missionplaywright.fr/auth');
  }

  async openRegistrationForm(): Promise<void> {
    await this.signupTab.click();
  }

  async fillForm(data: RegistrationData): Promise<void> {
    await this.nameInput.fill(data.nom);
    await this.emailInput.fill(data.email);
    await this.passwordInput.fill(data.password);
    await this.confirmPasswordInput.fill(data.confirmPassword ?? data.password);
  }

  async register(data: RegistrationData): Promise<void> {
    await this.openRegistrationForm();
    await this.fillForm(data);
    await this.submitButton.click();
  }
}
