import { test, expect } from '../MMP FIXTURES/mmpfixtures';
import { STORAGE_STATE_USER1 } from '../MMP FIXTURES/mmpAuth';
import { CARTES_INVALIDES, creerAdresseLivraison, creerCarteValide } from '../DATA/fakerCheckout';
import { arrondi, produit } from '../DATA/produits';
import { formatPrix } from '../MMP POM/mmpPrix';

/** Tous les tests de ce fichier tournent avec la session du compte USER_EMAIL1 (cf. tests/auth.setup.ts). */
test.use({ storageState: STORAGE_STATE_USER1 });

test.describe('Checkout (utilisateur connecté)', () => {
  const p1 = produit(6);
  const p2 = produit(2);
  const totalAttendu = arrondi(p1.prix + p2.prix);

  test.beforeEach(async ({ remplirPanier, panier }) => {
    await remplirPanier([p1.id, p2.id]);
    await panier.goToCheckout();
  });

  test.describe('Étape 1 – Livraison', () => {
    test('le formulaire est pré-rempli avec le profil', async ({ checkout }) => {
      await checkout.waitForProfilePrefill();
      await expect(checkout.emailInput).toHaveValue(process.env.USER_EMAIL1!);
      await expect(checkout.firstNameInput).not.toHaveValue('');
      await expect(checkout.lastNameInput).not.toHaveValue('');
    });

    test('le récapitulatif reprend les articles et le total du panier', async ({ checkout }) => {
      await expect(checkout.summary).toContainText(p1.nom);
      await expect(checkout.summary).toContainText(p2.nom);
      await expect(checkout.summary.getByText('Qté: 1')).toHaveCount(2);
      expect(await checkout.displayedTotal()).toBe(totalAttendu);
    });

    test('tous les champs sont obligatoires', async ({ checkout }) => {
      await checkout.waitForProfilePrefill();
      const champs = [
        checkout.firstNameInput, checkout.lastNameInput, checkout.emailInput, checkout.phoneInput,
        checkout.addressInput, checkout.cityInput, checkout.postalCodeInput,
      ];
      for (const champ of champs) await champ.clear();

      await checkout.shippingSubmitButton.click();

      expect(await checkout.invalidFieldIds()).toEqual(['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode']);
      await expect(checkout.paymentForm).toHaveCount(0);
    });

    test('"Retour au panier" ramène au panier sans le vider', async ({ page, checkout, panier }) => {
      await checkout.backLink.click();
      await expect(page).toHaveURL(/\/cart$/);
      await expect(panier.quantity(p1.id)).toHaveText('1');
    });

    test('BUG – un téléphone et un code postal mal formés sont refusés', async ({ checkout }) => {
      test.fail(true, 'Le site accepte téléphone "abc" et code postal "12" et passe à l’étape Paiement.');
      await checkout.submitShipping({ telephone: 'abc', adresse: '1 rue du Test', ville: 'Paris', codePostal: '12' });
      await expect(checkout.paymentForm).toBeHidden();
      await expect(checkout.shippingForm).toBeVisible();
    });
  });

  test.describe('Étape 2 – Paiement', () => {
    test.beforeEach(async ({ checkout }) => {
      await checkout.submitShipping(creerAdresseLivraison());
      await expect(checkout.paymentForm).toBeVisible();
    });

    test('affiche le total à payer sur le bouton', async ({ checkout }) => {
      expect(await checkout.displayedTotal()).toBe(totalAttendu);
      await expect(checkout.paymentSubmitButton).toHaveText(`Payer ${formatPrix(totalAttendu)}`);
    });

    test('tous les champs de carte sont obligatoires', async ({ checkout }) => {
      await checkout.paymentSubmitButton.click();
      expect(await checkout.invalidFieldIds()).toEqual(['cardNumber', 'cardName', 'expiry', 'cvv']);
      await expect(checkout.confirmationHeading).toHaveCount(0);
    });

    for (const { cas, carte } of CARTES_INVALIDES) {
      test(`BUG – carte refusée : ${cas}`, async ({ page, checkout }) => {
        test.fail(true, 'Aucune validation de la carte : la commande est confirmée quelle que soit la saisie.');

        // Filet de sécurité : si le site accepte la carte, la commande n'est PAS créée en base.
        await page.route('**/rest/v1/orders**', (route) =>
          route.request().method() === 'POST' ? route.abort() : route.continue(),
        );
        const estCommande = (r: { url(): string; method(): string }) => r.url().includes('/rest/v1/orders') && r.method() === 'POST';

        // Écoute démarrée AVANT le clic (la requête part pendant le clic). 5 s laissées au site pour l'envoyer ou non.
        const requeteCommande = page.waitForRequest(estCommande, { timeout: 5_000 }).catch(() => null);
        await checkout.pay(carte);

        expect(await requeteCommande, 'aucune commande ne doit être envoyée avec cette carte').toBeNull();
        await expect(checkout.paymentForm).toBeVisible();
      });
    }
  });

  /** ⚠️ Crée une vraie commande sur le compte de test. Exclure avec : --grep-invert @commande */
  test('parcours complet : livraison → paiement → confirmation → historique', { tag: '@commande' }, async ({ page, checkout, header, compte }) => {
    test.slow();
    const adresse = creerAdresseLivraison();
    let numeroCommande = '';

    await test.step('Livraison', async () => {
      await checkout.submitShipping(adresse);
      await expect(checkout.paymentForm).toBeVisible();
    });

    await test.step('Paiement avec une carte de test', async () => {
      const commandeCreee = page.waitForResponse(
        (r) => r.url().includes('/rest/v1/orders') && r.request().method() === 'POST',
      );
      await checkout.pay(creerCarteValide());
      expect((await commandeCreee).status()).toBe(201);
    });

    await test.step('Confirmation', async () => {
      await expect(checkout.confirmationHeading).toBeVisible();
      await expect(checkout.orderNumber).toBeVisible();
      numeroCommande = await checkout.orderNumber.innerText();
      await expect(checkout.trackOrderButton).toBeVisible();
    });

    await test.step('La commande apparaît dans l’historique du compte', async () => {
      await header.openAccount();
      await compte.openOrders();
      const commande = compte.order(numeroCommande);
      await expect(commande).toBeVisible();
      await expect(commande).toContainText('Confirmée');
      await expect(commande).toContainText(formatPrix(totalAttendu));
    });

    await test.step('L’adresse de livraison est enregistrée dans le profil', async () => {
      await compte.profileTab.click();
      await expect(compte.profileValue('Ville')).toHaveText(adresse.ville);
      await expect(compte.profileValue('Code postal')).toHaveText(adresse.codePostal);
    });
  });
});
