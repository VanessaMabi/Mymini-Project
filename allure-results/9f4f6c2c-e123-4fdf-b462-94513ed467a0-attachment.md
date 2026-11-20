# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: MMPTest Checkout.spec.ts >> Checkout (utilisateur connecté) >> Étape 1 – Livraison >> BUG – un téléphone et un code postal mal formés sont refusés
- Location: tests/MMPTest Checkout.spec.ts:55:9

# Error details

```
Error: expect(locator).toBeHidden() failed

Locator:  getByTestId('payment-form')
Expected: hidden
Received: visible
Timeout:  5000ms

Call log:
  - Expect "toBeHidden" getByTestId('payment-form') with timeout 5000ms
  - waiting for getByTestId('payment-form')
    14 × locator resolved to <form class="space-y-4" data-testid="payment-form">…</form>
       - unexpected value "visible"

```

```yaml
- text: Numéro de carte
- textbox "Numéro de carte":
  - /placeholder: 1234 5678 9012 3456
- text: Nom sur la carte
- textbox "Nom sur la carte"
- text: Date d'expiration
- textbox "Date d'expiration":
  - /placeholder: MM/AA
- text: CVV
- textbox "CVV":
  - /placeholder: "123"
- text: Total à payer 169.98 €
- button "Payer 169.98 €":
  - img
  - text: Payer 169.98 €
```

# Test source

```ts
  1   | import { test, expect } from '../MMP FIXTURES/mmpfixtures';
  2   | import { STORAGE_STATE_USER1 } from '../MMP FIXTURES/mmpAuth';
  3   | import { CARTES_INVALIDES, creerAdresseLivraison, creerCarteValide } from '../DATA/fakerCheckout';
  4   | import { arrondi, produit } from '../DATA/produits';
  5   | import { formatPrix } from '../MMP POM/mmpPrix';
  6   | 
  7   | /** Tous les tests de ce fichier tournent avec la session du compte USER_EMAIL1 (cf. tests/auth.setup.ts). */
  8   | test.use({ storageState: STORAGE_STATE_USER1 });
  9   | 
  10  | test.describe('Checkout (utilisateur connecté)', () => {
  11  |   const p1 = produit(6);
  12  |   const p2 = produit(2);
  13  |   const totalAttendu = arrondi(p1.prix + p2.prix);
  14  | 
  15  |   test.beforeEach(async ({ remplirPanier, panier }) => {
  16  |     await remplirPanier([p1.id, p2.id]);
  17  |     await panier.goToCheckout();
  18  |   });
  19  | 
  20  |   test.describe('Étape 1 – Livraison', () => {
  21  |     test('le formulaire est pré-rempli avec le profil', async ({ checkout }) => {
  22  |       await checkout.waitForProfilePrefill();
  23  |       await expect(checkout.emailInput).toHaveValue(process.env.USER_EMAIL1!);
  24  |       await expect(checkout.firstNameInput).not.toHaveValue('');
  25  |       await expect(checkout.lastNameInput).not.toHaveValue('');
  26  |     });
  27  | 
  28  |     test('le récapitulatif reprend les articles et le total du panier', async ({ checkout }) => {
  29  |       await expect(checkout.summary).toContainText(p1.nom);
  30  |       await expect(checkout.summary).toContainText(p2.nom);
  31  |       await expect(checkout.summary.getByText('Qté: 1')).toHaveCount(2);
  32  |       expect(await checkout.displayedTotal()).toBe(totalAttendu);
  33  |     });
  34  | 
  35  |     test('tous les champs sont obligatoires', async ({ checkout }) => {
  36  |       await checkout.waitForProfilePrefill();
  37  |       const champs = [
  38  |         checkout.firstNameInput, checkout.lastNameInput, checkout.emailInput, checkout.phoneInput,
  39  |         checkout.addressInput, checkout.cityInput, checkout.postalCodeInput,
  40  |       ];
  41  |       for (const champ of champs) await champ.clear();
  42  | 
  43  |       await checkout.shippingSubmitButton.click();
  44  | 
  45  |       expect(await checkout.invalidFieldIds()).toEqual(['firstName', 'lastName', 'email', 'phone', 'address', 'city', 'postalCode']);
  46  |       await expect(checkout.paymentForm).toHaveCount(0);
  47  |     });
  48  | 
  49  |     test('"Retour au panier" ramène au panier sans le vider', async ({ page, checkout, panier }) => {
  50  |       await checkout.backLink.click();
  51  |       await expect(page).toHaveURL(/\/cart$/);
  52  |       await expect(panier.quantity(p1.id)).toHaveText('1');
  53  |     });
  54  | 
  55  |     test('BUG – un téléphone et un code postal mal formés sont refusés', async ({ checkout }) => {
  56  |       test.fail(true, 'Le site accepte téléphone "abc" et code postal "12" et passe à l’étape Paiement.');
  57  |       await checkout.submitShipping({ telephone: 'abc', adresse: '1 rue du Test', ville: 'Paris', codePostal: '12' });
> 58  |       await expect(checkout.paymentForm).toBeHidden();
      |                                          ^ Error: expect(locator).toBeHidden() failed
  59  |       await expect(checkout.shippingForm).toBeVisible();
  60  |     });
  61  |   });
  62  | 
  63  |   test.describe('Étape 2 – Paiement', () => {
  64  |     test.beforeEach(async ({ checkout }) => {
  65  |       await checkout.submitShipping(creerAdresseLivraison());
  66  |       await expect(checkout.paymentForm).toBeVisible();
  67  |     });
  68  | 
  69  |     test('affiche le total à payer sur le bouton', async ({ checkout }) => {
  70  |       expect(await checkout.displayedTotal()).toBe(totalAttendu);
  71  |       await expect(checkout.paymentSubmitButton).toHaveText(`Payer ${formatPrix(totalAttendu)}`);
  72  |     });
  73  | 
  74  |     test('tous les champs de carte sont obligatoires', async ({ checkout }) => {
  75  |       await checkout.paymentSubmitButton.click();
  76  |       expect(await checkout.invalidFieldIds()).toEqual(['cardNumber', 'cardName', 'expiry', 'cvv']);
  77  |       await expect(checkout.confirmationHeading).toHaveCount(0);
  78  |     });
  79  | 
  80  |     for (const { cas, carte } of CARTES_INVALIDES) {
  81  |       test(`BUG – carte refusée : ${cas}`, async ({ page, checkout }) => {
  82  |         test.fail(true, 'Aucune validation de la carte : la commande est confirmée quelle que soit la saisie.');
  83  | 
  84  |         // Filet de sécurité : si le site accepte la carte, la commande n'est PAS créée en base.
  85  |         await page.route('**/rest/v1/orders**', (route) =>
  86  |           route.request().method() === 'POST' ? route.abort() : route.continue(),
  87  |         );
  88  |         const estCommande = (r: { url(): string; method(): string }) => r.url().includes('/rest/v1/orders') && r.method() === 'POST';
  89  | 
  90  |         // Écoute démarrée AVANT le clic (la requête part pendant le clic). 5 s laissées au site pour l'envoyer ou non.
  91  |         const requeteCommande = page.waitForRequest(estCommande, { timeout: 5_000 }).catch(() => null);
  92  |         await checkout.pay(carte);
  93  | 
  94  |         expect(await requeteCommande, 'aucune commande ne doit être envoyée avec cette carte').toBeNull();
  95  |         await expect(checkout.paymentForm).toBeVisible();
  96  |       });
  97  |     }
  98  |   });
  99  | 
  100 |   /** ⚠️ Crée une vraie commande sur le compte de test. Exclure avec : --grep-invert @commande */
  101 |   test('parcours complet : livraison → paiement → confirmation → historique', { tag: '@commande' }, async ({ page, checkout, header, compte }) => {
  102 |     test.slow();
  103 |     const adresse = creerAdresseLivraison();
  104 |     let numeroCommande = '';
  105 | 
  106 |     await test.step('Livraison', async () => {
  107 |       await checkout.submitShipping(adresse);
  108 |       await expect(checkout.paymentForm).toBeVisible();
  109 |     });
  110 | 
  111 |     await test.step('Paiement avec une carte de test', async () => {
  112 |       const commandeCreee = page.waitForResponse(
  113 |         (r) => r.url().includes('/rest/v1/orders') && r.request().method() === 'POST',
  114 |       );
  115 |       await checkout.pay(creerCarteValide());
  116 |       expect((await commandeCreee).status()).toBe(201);
  117 |     });
  118 | 
  119 |     await test.step('Confirmation', async () => {
  120 |       await expect(checkout.confirmationHeading).toBeVisible();
  121 |       await expect(checkout.orderNumber).toBeVisible();
  122 |       numeroCommande = await checkout.orderNumber.innerText();
  123 |       await expect(checkout.trackOrderButton).toBeVisible();
  124 |     });
  125 | 
  126 |     await test.step('La commande apparaît dans l’historique du compte', async () => {
  127 |       await header.openAccount();
  128 |       await compte.openOrders();
  129 |       const commande = compte.order(numeroCommande);
  130 |       await expect(commande).toBeVisible();
  131 |       await expect(commande).toContainText('Confirmée');
  132 |       await expect(commande).toContainText(formatPrix(totalAttendu));
  133 |     });
  134 | 
  135 |     await test.step('L’adresse de livraison est enregistrée dans le profil', async () => {
  136 |       await compte.profileTab.click();
  137 |       await expect(compte.profileValue('Ville')).toHaveText(adresse.ville);
  138 |       await expect(compte.profileValue('Code postal')).toHaveText(adresse.codePostal);
  139 |     });
  140 |   });
  141 | });
  142 | 
```