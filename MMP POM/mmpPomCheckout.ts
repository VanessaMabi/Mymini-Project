import { expect, Locator, Page } from '@playwright/test';
import { AdresseLivraison, CartePaiement } from '../DATA/fakerCheckout';
import { extrairePrix } from './mmpPrix';

export class MmpPomCheckout {
  readonly page: Page;
  readonly backLink: Locator;

  // Utilisateur non connecté
  readonly loginRequiredHeading: Locator;
  readonly loginButton: Locator;
  readonly backToCartButton: Locator;

  // Étape 1 — Livraison
  readonly shippingForm: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly postalCodeInput: Locator;
  readonly shippingSubmitButton: Locator;
  readonly summary: Locator;

  // Étape 2 — Paiement
  readonly paymentForm: Locator;
  readonly cardNumberInput: Locator;
  readonly cardNameInput: Locator;
  readonly expiryInput: Locator;
  readonly cvvInput: Locator;
  readonly paymentSubmitButton: Locator;

  // Étape 3 — Confirmation
  readonly confirmationHeading: Locator;
  readonly orderNumber: Locator;
  readonly trackOrderButton: Locator;
  readonly continueShoppingButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.backLink = page.getByTestId('checkout-back-link');

    this.loginRequiredHeading = page.getByText('Connexion requise');
    this.loginButton = page.getByTestId('checkout-login-button');
    this.backToCartButton = page.getByTestId('checkout-back-to-cart-button');

    this.shippingForm = page.getByTestId('shipping-form');
    this.firstNameInput = page.getByTestId('shipping-firstname-input');
    this.lastNameInput = page.getByTestId('shipping-lastname-input');
    this.emailInput = page.getByTestId('shipping-email-input');
    this.phoneInput = page.getByTestId('shipping-phone-input');
    this.addressInput = page.getByTestId('shipping-address-input');
    this.cityInput = page.getByTestId('shipping-city-input');
    this.postalCodeInput = page.getByTestId('shipping-postalcode-input');
    this.shippingSubmitButton = page.getByTestId('shipping-submit-button');
    this.summary = page.getByText('Récapitulatif', { exact: true }).locator('..');

    this.paymentForm = page.getByTestId('payment-form');
    this.cardNumberInput = page.getByTestId('payment-cardnumber-input');
    this.cardNameInput = page.getByTestId('payment-cardname-input');
    this.expiryInput = page.getByTestId('payment-expiry-input');
    this.cvvInput = page.getByTestId('payment-cvv-input');
    this.paymentSubmitButton = page.getByTestId('payment-submit-button');

    this.confirmationHeading = page.getByRole('heading', { name: 'Commande confirmée !' });
    this.orderNumber = page.getByText(/^#TH-[A-Z0-9]{8}$/);
    this.trackOrderButton = page.getByRole('button', { name: 'Suivre ma commande' });
    this.continueShoppingButton = page.getByRole('main').getByRole('button', { name: 'Continuer mes achats' });
  }

  /**
   * Attend le pré-remplissage du formulaire par le profil Supabase.
   * ⚠️ Si on saisit avant, le chargement du profil efface les valeurs saisies.
   */
  async waitForProfilePrefill(): Promise<void> {
    await expect(this.emailInput).not.toHaveValue('', { timeout: 10_000 });
  }

  async fillShipping(adresse: AdresseLivraison): Promise<void> {
    await this.waitForProfilePrefill();
    await this.phoneInput.fill(adresse.telephone);
    await this.addressInput.fill(adresse.adresse);
    await this.cityInput.fill(adresse.ville);
    await this.postalCodeInput.fill(adresse.codePostal);
  }

  async submitShipping(adresse: AdresseLivraison): Promise<void> {
    await this.fillShipping(adresse);
    await this.shippingSubmitButton.click();
  }

  async fillPayment(carte: CartePaiement): Promise<void> {
    await this.cardNumberInput.fill(carte.numero);
    await this.cardNameInput.fill(carte.nom);
    await this.expiryInput.fill(carte.expiration);
    await this.cvvInput.fill(carte.cvv);
  }

  async pay(carte: CartePaiement): Promise<void> {
    await this.fillPayment(carte);
    await this.paymentSubmitButton.click();
  }

  /** Total affiché dans le récapitulatif (étape Livraison) ou "Total à payer" (étape Paiement). */
  async displayedTotal(): Promise<number> {
    const ligne = this.page.getByText(/^Total( à payer)?$/).locator('..');
    return extrairePrix(await ligne.innerText())[0];
  }

  /** Champs du formulaire visible qui ne passent pas la validation HTML5 native. */
  async invalidFieldIds(): Promise<string[]> {
    return this.page.locator('main form input:invalid').evaluateAll((inputs) => inputs.map((i) => i.id));
  }
}
