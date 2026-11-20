# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: MMPTest Checkout.spec.ts >> Checkout (utilisateur connecté) >> Étape 2 – Paiement >> BUG – carte refusée : numéro trop court
- Location: tests/MMPTest Checkout.spec.ts:81:11

# Error details

```
Error: aucune commande ne doit être envoyée avec cette carte

expect(received).toBeNull()

Received: {"_guid": "request@105988efe0de4af88a6cc9f92a685671", "_type": "Request"}
```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - region "Notifications (F8)":
      - list
    - region "Notifications alt+T":
      - list:
        - listitem [ref=e3]:
          - generic [ref=e7]: Hub USB-C 12-en-1 ajouté au panier
        - listitem [ref=e9]:
          - generic [ref=e13]: Station de Charge Qi ajouté au panier
    - generic [ref=e15]:
      - banner [ref=e16]:
        - generic [ref=e18]:
          - link "TechHub" [ref=e19] [cursor=pointer]:
            - /url: /
          - navigation [ref=e24]:
            - link "Accueil" [ref=e25] [cursor=pointer]:
              - /url: /
            - link "Produits" [ref=e26] [cursor=pointer]:
              - /url: /products
            - link "À propos" [ref=e27] [cursor=pointer]:
              - /url: /about
            - link "Contact" [ref=e28] [cursor=pointer]:
              - /url: /contact
          - generic [ref=e29]:
            - button [ref=e30] [cursor=pointer]
            - link [ref=e31] [cursor=pointer]:
              - /url: /cart
              - button "2" [ref=e32]
            - button [ref=e34] [cursor=pointer]
      - main [ref=e35]:
        - generic [ref=e36]:
          - link "Retour au panier" [ref=e37] [cursor=pointer]:
            - /url: /cart
          - generic [ref=e40]:
            - generic [ref=e41]: Livraison
            - generic [ref=e50]: Paiement
            - generic [ref=e56]: Confirmation
          - generic [ref=e64]:
            - heading "Paiement sécurisé" [level=2] [ref=e69]
            - generic [ref=e70]:
              - generic [ref=e71]:
                - text: Numéro de carte
                - textbox "Numéro de carte" [ref=e72]:
                  - /placeholder: 1234 5678 9012 3456
                  - text: "1234"
              - generic [ref=e73]:
                - text: Nom sur la carte
                - textbox "Nom sur la carte" [ref=e74]: TEST AUTO
              - generic [ref=e75]:
                - generic [ref=e76]:
                  - text: Date d'expiration
                  - textbox "Date d'expiration" [ref=e77]:
                    - /placeholder: MM/AA
                    - text: 12/30
                - generic [ref=e78]:
                  - text: CVV
                  - textbox "CVV" [ref=e79]:
                    - /placeholder: "123"
                    - text: "123"
              - generic [ref=e81]:
                - generic [ref=e82]: Total à payer
                - generic [ref=e83]: 169.98 €
              - button "Traitement en cours..." [disabled]
            - paragraph [ref=e84]: 🔒 Vos données sont protégées par un cryptage SSL 256 bits
      - contentinfo [ref=e85]:
        - generic [ref=e86]:
          - generic [ref=e87]:
            - generic [ref=e88]:
              - link "TechHub" [ref=e89] [cursor=pointer]:
                - /url: /
              - paragraph [ref=e94]: La technologie qui simplifie votre quotidien. Découvrez les meilleurs produits tech sélectionnés par nos experts.
              - generic [ref=e95]:
                - link "Facebook" [ref=e96] [cursor=pointer]:
                  - /url: "#"
                - link "Twitter" [ref=e99] [cursor=pointer]:
                  - /url: "#"
                - link "Instagram" [ref=e102] [cursor=pointer]:
                  - /url: "#"
                - link "LinkedIn" [ref=e106] [cursor=pointer]:
                  - /url: "#"
            - generic [ref=e111]:
              - heading "Produits" [level=4] [ref=e112]
              - list [ref=e113]:
                - listitem [ref=e114]:
                  - link "Accessoires" [ref=e115] [cursor=pointer]:
                    - /url: /products?category=accessories
                - listitem [ref=e116]:
                  - link "Maison Connectée" [ref=e117] [cursor=pointer]:
                    - /url: /products?category=smart-home
                - listitem [ref=e118]:
                  - link "Gaming" [ref=e119] [cursor=pointer]:
                    - /url: /products?category=gaming
                - listitem [ref=e120]:
                  - link "Bureau" [ref=e121] [cursor=pointer]:
                    - /url: /products?category=office
            - generic [ref=e122]:
              - heading "Entreprise" [level=4] [ref=e123]
              - list [ref=e124]:
                - listitem [ref=e125]:
                  - link "À propos" [ref=e126] [cursor=pointer]:
                    - /url: /about
                - listitem [ref=e127]:
                  - link "Carrières" [ref=e128] [cursor=pointer]:
                    - /url: /checkout
                - listitem [ref=e129]:
                  - link "Presse" [ref=e130] [cursor=pointer]:
                    - /url: /checkout
                - listitem [ref=e131]:
                  - link "Blog" [ref=e132] [cursor=pointer]:
                    - /url: /checkout
            - generic [ref=e133]:
              - heading "Support" [level=4] [ref=e134]
              - list [ref=e135]:
                - listitem [ref=e136]:
                  - link "Contact" [ref=e137] [cursor=pointer]:
                    - /url: /contact
                - listitem [ref=e138]:
                  - link "FAQ" [ref=e139] [cursor=pointer]:
                    - /url: /contact#faq
                - listitem [ref=e140]:
                  - link "Livraison" [ref=e141] [cursor=pointer]:
                    - /url: /checkout
                - listitem [ref=e142]:
                  - link "Retours" [ref=e143] [cursor=pointer]:
                    - /url: /checkout
            - generic [ref=e144]:
              - heading "Légal" [level=4] [ref=e145]
              - list [ref=e146]:
                - listitem [ref=e147]:
                  - link "CGV" [ref=e148] [cursor=pointer]:
                    - /url: /checkout
                - listitem [ref=e149]:
                  - link "Confidentialité" [ref=e150] [cursor=pointer]:
                    - /url: /checkout
                - listitem [ref=e151]:
                  - link "Cookies" [ref=e152] [cursor=pointer]:
                    - /url: /checkout
                - listitem [ref=e153]:
                  - link "Mentions légales" [ref=e154] [cursor=pointer]:
                    - /url: /checkout
          - generic [ref=e155]:
            - generic [ref=e156]:
              - link "contact@techhub.fr" [ref=e157] [cursor=pointer]:
                - /url: mailto:contact@techhub.fr
              - link "01 23 45 67 89" [ref=e161] [cursor=pointer]:
                - /url: tel:+33123456789
              - generic [ref=e164]: Paris, France
            - paragraph [ref=e168]: © 2026 TechHub. Tous droits réservés.
  - complementary "Edit with Lovable" [ref=e169]:
    - link "Edit with Lovable" [ref=e170] [cursor=pointer]:
      - /url: https://lovable.dev/projects/lovp_0rewj1v2fv99a9r25rp0m5e892?utm_source=lovable-badge
      - generic [ref=e171]: Edit with
    - button "Dismiss" [ref=e178] [cursor=pointer]
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
  58  |       await expect(checkout.paymentForm).toBeHidden();
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
> 94  |         expect(await requeteCommande, 'aucune commande ne doit être envoyée avec cette carte').toBeNull();
      |                                                                                                ^ Error: aucune commande ne doit être envoyée avec cette carte
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