import { test, expect } from '../MMP FIXTURES/mmpfixtures';
import { arrondi, produit } from '../DATA/produits';

test.describe('Panier', () => {
  test('panier vide : message et lien vers le catalogue', async ({ page, panier, catalogue }) => {
    await page.goto('/cart');
    await expect(panier.emptyHeading).toBeVisible();
    await panier.browseProductsButton.click();
    await expect(catalogue.heading).toBeVisible();
  });

  test('calcule les totaux de lignes, le sous-total et le total', async ({ remplirPanier, panier }) => {
    const p1 = produit(1);
    const p2 = produit(2);
    await remplirPanier([p1.id, p1.id, p2.id]);

    await test.step('Quantités et totaux de lignes', async () => {
      await expect(panier.quantity(p1.id)).toHaveText('2');
      await expect(panier.quantity(p2.id)).toHaveText('1');
      expect(await panier.linePrices(p1.id)).toEqual({ unitaire: p1.prix, total: arrondi(p1.prix * 2) });
      expect(await panier.linePrices(p2.id)).toEqual({ unitaire: p2.prix, total: p2.prix });
    });

    await test.step('Récapitulatif', async () => {
      const attendu = arrondi(p1.prix * 2 + p2.prix);
      await expect(panier.subtotalRow).toContainText('Sous-total (3 articles)');
      expect(await panier.subtotal()).toBe(attendu);
      await expect(panier.shippingRow).toContainText('Gratuite');
      expect(await panier.total()).toBe(attendu);
    });
  });

  test('"+" et "−" modifient la quantité et les montants', async ({ remplirPanier, panier, header }) => {
    const p = produit(6);
    await remplirPanier([p.id]);

    await panier.increase(p.id, 2);
    await expect(panier.quantity(p.id)).toHaveText('3');
    await expect(header.cartCount).toHaveText('3');
    await expect.poll(() => panier.total()).toBe(arrondi(p.prix * 3));

    await panier.decrease(p.id);
    await expect(panier.quantity(p.id)).toHaveText('2');
    await expect.poll(() => panier.total()).toBe(arrondi(p.prix * 2));
  });

  test('"−" à la quantité 1 retire l’article', async ({ remplirPanier, panier }) => {
    test.info().annotations.push({ type: 'à confirmer', description: 'Retrait sans confirmation : comportement à valider avec le métier.' });
    await remplirPanier([2]);
    await panier.decrease(2);
    await expect(panier.emptyHeading).toBeVisible();
  });

  test('la corbeille retire uniquement la ligne concernée', async ({ remplirPanier, panier }) => {
    const reste = produit(2);
    await remplirPanier([1, reste.id]);

    await panier.remove(1);
    await expect(panier.quantity(1)).toHaveCount(0);
    await expect(panier.quantity(reste.id)).toHaveText('1');
    expect(await panier.total()).toBe(reste.prix);
  });

  test('"Vider le panier" supprime tous les articles', async ({ remplirPanier, panier, header }) => {
    await remplirPanier([1, 4, 6]);
    await panier.clear();
    await expect(panier.emptyHeading).toBeVisible();
    await expect(header.cartCount).toHaveCount(0);
  });

  test('"Continuer mes achats" ramène au catalogue sans vider le panier', async ({ remplirPanier, panier, catalogue, header }) => {
    await remplirPanier([9]);
    await panier.continueShoppingButton.click();
    await expect(catalogue.heading).toBeVisible();
    await expect(header.cartCount).toHaveText('1');
  });

  test('un visiteur non connecté est invité à se connecter au paiement', async ({ page, remplirPanier, panier, checkout }) => {
    await remplirPanier([5]);
    await panier.goToCheckout();

    await expect(checkout.loginRequiredHeading).toBeVisible();
    await expect(checkout.shippingForm).toHaveCount(0);
    await checkout.loginButton.click();
    await expect(page).toHaveURL(/\/auth/);
  });

  test('BUG – le panier est conservé après un rechargement de la page', async ({ page, remplirPanier, panier }) => {
    test.fail(true, 'Le panier est stocké en mémoire uniquement (ni localStorage ni cookie).');
    await remplirPanier([1]);
    await page.reload();
    await expect(panier.quantity(1)).toHaveText('1');
  });
});
