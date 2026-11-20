import { test, expect } from '../MMP FIXTURES/mmpfixtures';
import { CATEGORIES, PRODUITS, produit as produitRef, produitsEnPromo } from '../DATA/produits';
import { formatPrix } from '../MMP POM/mmpPrix';

test.describe('Fiche produit', () => {
  test.describe('Informations conformes au référentiel', () => {
    for (const p of PRODUITS) {
      test(`#${p.id} ${p.nom}`, async ({ produit }) => {
        await produit.goto(p.id);

        await expect(produit.title).toHaveText(p.nom);
        await expect(produit.main.getByText(CATEGORIES[p.categorie].libelle, { exact: true }).first()).toBeVisible();
        await expect(produit.rating).toHaveText(`${p.note} (${p.nbAvis} avis)`);

        const [prix, ancienPrix] = await produit.prices();
        expect(prix).toBe(p.prix);
        if (p.ancienPrix) expect(ancienPrix).toBe(p.ancienPrix);
      });
    }
  });

  test.describe('Promotions', () => {
    for (const p of produitsEnPromo()) {
      test(`#${p.id} le badge de remise correspond à l’écart de prix`, async ({ produit }) => {
        await produit.goto(p.id);
        const remise = Math.round((1 - p.prix / p.ancienPrix!) * 100);
        await expect(produit.main.getByText(`-${remise}%`, { exact: true })).toBeVisible();
      });
    }
  });

  test('produit en stock : bouton actif et mention "En stock"', async ({ produit }) => {
    await produit.goto(1);
    await expect(produit.inStockText).toBeVisible();
    await expect(produit.addToCartButton).toBeEnabled();
  });

  test('produit en rupture : bouton désactivé et mention "Rupture de stock"', async ({ produit }) => {
    const enRupture = PRODUITS.find((p) => !p.enStock)!;
    await produit.goto(enRupture.id);
    await expect(produit.outOfStockText).toBeVisible();
    await expect(produit.addToCartButton).toBeDisabled();
  });

  test('ajout au panier : toast de confirmation et compteur du header', async ({ produit, header }) => {
    const p = produitRef(4);
    await produit.goto(p.id);
    await produit.addToCart();

    await expect(header.toast).toContainText(`${p.nom} ajouté au panier`);
    await expect(header.cartCount).toHaveText('1');

    await produit.addToCart();
    await expect(header.cartCount).toHaveText('2');
  });

  test('les produits similaires sont de la même catégorie et excluent le produit affiché', async ({ produit }) => {
    const p = produitRef(1);
    await produit.goto(p.id);
    await expect(produit.similarProducts.first()).toBeVisible();

    const ids = await produit.similarProducts.evaluateAll((cards) =>
      cards.map((c) => Number(c.getAttribute('data-testid')!.replace('product-card-', ''))),
    );
    expect(ids).not.toContain(p.id);
    for (const id of ids) expect(produitRef(id).categorie).toBe(p.categorie);
  });

  test('"Retour au catalogue" ramène sur /products', async ({ produit, catalogue }) => {
    await produit.goto(2);
    await produit.backToCatalog();
    await expect(catalogue.heading).toBeVisible();
  });

  test('un identifiant inconnu affiche "Produit non trouvé"', async ({ produit }) => {
    await produit.goto(999);
    await expect(produit.notFoundText).toBeVisible();
    await expect(produit.addToCartButton).toHaveCount(0);
  });

  test('le prix affiché sur la carte du catalogue est le même que sur la fiche', async ({ catalogue, produit }) => {
    const p = produitRef(10);
    await catalogue.goto();
    await expect(catalogue.card(p.id)).toContainText(formatPrix(p.prix));
    await catalogue.openProduct(p.id);
    expect((await produit.prices())[0]).toBe(p.prix);
  });
});
