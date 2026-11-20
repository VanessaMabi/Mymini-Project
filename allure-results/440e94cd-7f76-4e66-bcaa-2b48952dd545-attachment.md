# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: MMPTest Panier.spec.ts >> Panier >> BUG – le panier est conservé après un rechargement de la page
- Location: tests/MMPTest Panier.spec.ts:88:7

# Error details

```
Error: expect(locator).toHaveText(expected) failed

Locator: getByTestId('quantity-1')
Expected: "1"
Timeout: 5000ms
Error: element(s) not found

Call log:
  - Expect "toHaveText" getByTestId('quantity-1') with timeout 5000ms
  - waiting for getByTestId('quantity-1')

```

```yaml
- region "Notifications (F8)":
  - list
- region "Notifications alt+T"
- banner:
  - link "TechHub":
    - /url: /
    - img
    - text: TechHub
  - navigation:
    - link "Accueil":
      - /url: /
    - link "Produits":
      - /url: /products
    - link "À propos":
      - /url: /about
    - link "Contact":
      - /url: /contact
  - button:
    - img
  - link:
    - /url: /cart
    - button:
      - img
  - link:
    - /url: /auth
    - button:
      - img
- main:
  - img
  - heading "Votre panier est vide" [level=1]
  - paragraph: Découvrez notre catalogue et ajoutez des produits à votre panier.
  - link "Voir les produits":
    - /url: /products
    - button "Voir les produits":
      - text: Voir les produits
      - img
- contentinfo:
  - link "TechHub":
    - /url: /
    - img
    - text: TechHub
  - paragraph: La technologie qui simplifie votre quotidien. Découvrez les meilleurs produits tech sélectionnés par nos experts.
  - link "Facebook":
    - /url: "#"
    - img
  - link "Twitter":
    - /url: "#"
    - img
  - link "Instagram":
    - /url: "#"
    - img
  - link "LinkedIn":
    - /url: "#"
    - img
  - heading "Produits" [level=4]
  - list:
    - listitem:
      - link "Accessoires":
        - /url: /products?category=accessories
    - listitem:
      - link "Maison Connectée":
        - /url: /products?category=smart-home
    - listitem:
      - link "Gaming":
        - /url: /products?category=gaming
    - listitem:
      - link "Bureau":
        - /url: /products?category=office
  - heading "Entreprise" [level=4]
  - list:
    - listitem:
      - link "À propos":
        - /url: /about
    - listitem:
      - link "Carrières":
        - /url: /cart
    - listitem:
      - link "Presse":
        - /url: /cart
    - listitem:
      - link "Blog":
        - /url: /cart
  - heading "Support" [level=4]
  - list:
    - listitem:
      - link "Contact":
        - /url: /contact
    - listitem:
      - link "FAQ":
        - /url: /contact#faq
    - listitem:
      - link "Livraison":
        - /url: /cart
    - listitem:
      - link "Retours":
        - /url: /cart
  - heading "Légal" [level=4]
  - list:
    - listitem:
      - link "CGV":
        - /url: /cart
    - listitem:
      - link "Confidentialité":
        - /url: /cart
    - listitem:
      - link "Cookies":
        - /url: /cart
    - listitem:
      - link "Mentions légales":
        - /url: /cart
  - link "contact@techhub.fr":
    - /url: mailto:contact@techhub.fr
    - img
    - text: contact@techhub.fr
  - link "01 23 45 67 89":
    - /url: tel:+33123456789
    - img
    - text: 01 23 45 67 89
  - img
  - text: Paris, France
  - paragraph: © 2026 TechHub. Tous droits réservés.
- complementary "Edit with Lovable":
  - link "Edit with Lovable":
    - /url: https://lovable.dev/projects/lovp_0rewj1v2fv99a9r25rp0m5e892?utm_source=lovable-badge
    - text: Edit with
    - img
  - button "Dismiss"
```

# Test source

```ts
  1  | import { test, expect } from '../MMP FIXTURES/mmpfixtures';
  2  | import { arrondi, produit } from '../DATA/produits';
  3  | 
  4  | test.describe('Panier', () => {
  5  |   test('panier vide : message et lien vers le catalogue', async ({ page, panier, catalogue }) => {
  6  |     await page.goto('/cart');
  7  |     await expect(panier.emptyHeading).toBeVisible();
  8  |     await panier.browseProductsButton.click();
  9  |     await expect(catalogue.heading).toBeVisible();
  10 |   });
  11 | 
  12 |   test('calcule les totaux de lignes, le sous-total et le total', async ({ remplirPanier, panier }) => {
  13 |     const p1 = produit(1);
  14 |     const p2 = produit(2);
  15 |     await remplirPanier([p1.id, p1.id, p2.id]);
  16 | 
  17 |     await test.step('Quantités et totaux de lignes', async () => {
  18 |       await expect(panier.quantity(p1.id)).toHaveText('2');
  19 |       await expect(panier.quantity(p2.id)).toHaveText('1');
  20 |       expect(await panier.linePrices(p1.id)).toEqual({ unitaire: p1.prix, total: arrondi(p1.prix * 2) });
  21 |       expect(await panier.linePrices(p2.id)).toEqual({ unitaire: p2.prix, total: p2.prix });
  22 |     });
  23 | 
  24 |     await test.step('Récapitulatif', async () => {
  25 |       const attendu = arrondi(p1.prix * 2 + p2.prix);
  26 |       await expect(panier.subtotalRow).toContainText('Sous-total (3 articles)');
  27 |       expect(await panier.subtotal()).toBe(attendu);
  28 |       await expect(panier.shippingRow).toContainText('Gratuite');
  29 |       expect(await panier.total()).toBe(attendu);
  30 |     });
  31 |   });
  32 | 
  33 |   test('"+" et "−" modifient la quantité et les montants', async ({ remplirPanier, panier, header }) => {
  34 |     const p = produit(6);
  35 |     await remplirPanier([p.id]);
  36 | 
  37 |     await panier.increase(p.id, 2);
  38 |     await expect(panier.quantity(p.id)).toHaveText('3');
  39 |     await expect(header.cartCount).toHaveText('3');
  40 |     await expect.poll(() => panier.total()).toBe(arrondi(p.prix * 3));
  41 | 
  42 |     await panier.decrease(p.id);
  43 |     await expect(panier.quantity(p.id)).toHaveText('2');
  44 |     await expect.poll(() => panier.total()).toBe(arrondi(p.prix * 2));
  45 |   });
  46 | 
  47 |   test('"−" à la quantité 1 retire l’article', async ({ remplirPanier, panier }) => {
  48 |     test.info().annotations.push({ type: 'à confirmer', description: 'Retrait sans confirmation : comportement à valider avec le métier.' });
  49 |     await remplirPanier([2]);
  50 |     await panier.decrease(2);
  51 |     await expect(panier.emptyHeading).toBeVisible();
  52 |   });
  53 | 
  54 |   test('la corbeille retire uniquement la ligne concernée', async ({ remplirPanier, panier }) => {
  55 |     const reste = produit(2);
  56 |     await remplirPanier([1, reste.id]);
  57 | 
  58 |     await panier.remove(1);
  59 |     await expect(panier.quantity(1)).toHaveCount(0);
  60 |     await expect(panier.quantity(reste.id)).toHaveText('1');
  61 |     expect(await panier.total()).toBe(reste.prix);
  62 |   });
  63 | 
  64 |   test('"Vider le panier" supprime tous les articles', async ({ remplirPanier, panier, header }) => {
  65 |     await remplirPanier([1, 4, 6]);
  66 |     await panier.clear();
  67 |     await expect(panier.emptyHeading).toBeVisible();
  68 |     await expect(header.cartCount).toHaveCount(0);
  69 |   });
  70 | 
  71 |   test('"Continuer mes achats" ramène au catalogue sans vider le panier', async ({ remplirPanier, panier, catalogue, header }) => {
  72 |     await remplirPanier([9]);
  73 |     await panier.continueShoppingButton.click();
  74 |     await expect(catalogue.heading).toBeVisible();
  75 |     await expect(header.cartCount).toHaveText('1');
  76 |   });
  77 | 
  78 |   test('un visiteur non connecté est invité à se connecter au paiement', async ({ page, remplirPanier, panier, checkout }) => {
  79 |     await remplirPanier([5]);
  80 |     await panier.goToCheckout();
  81 | 
  82 |     await expect(checkout.loginRequiredHeading).toBeVisible();
  83 |     await expect(checkout.shippingForm).toHaveCount(0);
  84 |     await checkout.loginButton.click();
  85 |     await expect(page).toHaveURL(/\/auth/);
  86 |   });
  87 | 
  88 |   test('BUG – le panier est conservé après un rechargement de la page', async ({ page, remplirPanier, panier }) => {
  89 |     test.fail(true, 'Le panier est stocké en mémoire uniquement (ni localStorage ni cookie).');
  90 |     await remplirPanier([1]);
  91 |     await page.reload();
> 92 |     await expect(panier.quantity(1)).toHaveText('1');
     |                                      ^ Error: expect(locator).toHaveText(expected) failed
  93 |   });
  94 | });
  95 | 
```