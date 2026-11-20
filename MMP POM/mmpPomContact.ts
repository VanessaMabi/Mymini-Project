import { Locator, Page } from '@playwright/test';
import { MessageContact } from '../DATA/fakerCheckout';

export class MmpPomContact {
  readonly page: Page;
  readonly heading: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly submitButton: Locator;
  readonly sendingButton: Locator;
  readonly successMessage: Locator;
  readonly faqHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    const main = page.getByRole('main');
    this.heading = page.getByRole('heading', { name: 'Nous Contacter' });
    this.nameInput = main.getByLabel('Nom complet');
    this.emailInput = main.getByLabel('Email');
    this.subjectInput = main.getByLabel('Sujet');
    this.messageInput = main.getByLabel('Message');
    this.submitButton = main.getByRole('button', { name: 'Envoyer le message' });
    this.sendingButton = main.getByRole('button', { name: 'Envoi en cours...' });
    this.successMessage = page.getByText('Message envoyé !');
    this.faqHeading = page.getByText('Questions fréquentes');
  }

  async goto(): Promise<void> {
    await this.page.goto('/contact');
    await this.heading.waitFor();
  }

  async fill(message: MessageContact): Promise<void> {
    await this.nameInput.fill(message.nom);
    await this.emailInput.fill(message.email);
    await this.subjectInput.fill(message.sujet);
    await this.messageInput.fill(message.message);
  }

  async send(message: MessageContact): Promise<void> {
    await this.fill(message);
    await this.submitButton.click();
  }

  faqQuestion(question: string): Locator {
    return this.page.getByText(question, { exact: true });
  }

  /** Message de validation natif du navigateur (vide si le champ est valide). */
  async validationMessage(champ: Locator): Promise<string> {
    return champ.evaluate((el: HTMLInputElement) => el.validationMessage);
  }
}
