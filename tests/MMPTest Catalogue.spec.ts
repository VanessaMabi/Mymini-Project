import { test, expect } from '../MMP FIXTURES/mmpfixtures';
import { CATEGORIES, CategorieSlug, FILTRES_PRIX, PRODUITS, produitsParCategorie } from '../DATA/produits';

test.describe('Catalogue', () => {
  test.beforeEach(async ({ catalogue }) => {
    await catalogue.goto();
  });

  test('affiche tous les produits du référentiel', async ({ catalogue }) => {
    await expect(catalogue.productCount).toHaveText(`${PRODUITS.length} produits`);
    await expect(catalogue.productCards).toHaveCount(PRODUITS.length);
    expect((await catalogue.displayedIds()).sort((a, b) => a - b)).toEqual(PRODUITS.map((p) => p.id));
  });

  test.describe('Tri', () => {
    test('par prix croissant', async ({ catalogue }) => {
      await catalogue.sortBy('Prix croissant');
      await expect(async () => {
        const prix = await catalogue.displayedPrices();
        expect(prix).toEqual([...prix].sort((a, b) => a - b));
      }).toPass();
    });

    test('par prix décroissant', async ({ catalogue }) => {
      await catalogue.sortBy('Prix décroissant');
      await expect(async () => {
        const prix = await catalogue.displayedPrices();
        expect(prix).toEqual([...prix].sort((a, b) => b - a));
      }).toPass();
    });

    test('par popularité (nombre d’avis décroissant)', async ({ catalogue }) => {
      test.info().annotations.push({
        type: 'à confirmer',
        description: 'Hypothèse : la popularité suit le nombre d’avis. À valider avec le métier.',
      });
      await catalogue.sortBy('Popularité');
      const attendu = [...PRODUITS].sort((a, b) => b.nbAvis - a.nbAvis).map((p) => p.id);
      await expect.poll(() => catalogue.displayedIds()).toEqual(attendu);
    });

    test('le tri ne change pas le nombre de produits', async ({ catalogue }) => {
      for (const option of ['Popularité', 'Prix croissant', 'Prix décroissant', 'Nouveautés'] as const) {
        await catalogue.sortBy(option);
        await expect(catalogue.productCards).toHaveCount(PRODUITS.length);
      }
    });
  });

  test.describe('Filtre par catégorie', () => {
    for (const slug of Object.keys(CATEGORIES) as CategorieSlug[]) {
      const { libelle } = CATEGORIES[slug];
      const attendus = produitsParCategorie(slug);

      test(`${libelle} : ${attendus.length} produits et URL ?category=${slug}`, async ({ page, catalogue }) => {
        await catalogue.filterByCategory(libelle);

        await expect(page).toHaveURL(new RegExp(`category=${slug}$`));
        await expect(catalogue.productCount).toHaveText(new RegExp(`^${attendus.length} produits?$`));
        await expect(catalogue.productCards).toHaveCount(attendus.length);
        expect((await catalogue.displayedIds()).sort((a, b) => a - b)).toEqual(attendus.map((p) => p.id));
      });
    }

    test('l’URL ?category= applique directement le filtre', async ({ catalogue }) => {
      await catalogue.goto('gaming');
      await expect(catalogue.productCards).toHaveCount(produitsParCategorie('gaming').length);
    });

    test('"Toutes" réaffiche le catalogue complet', async ({ catalogue }) => {
      await catalogue.filterByCategory('Bureau');
      await expect(catalogue.productCards).toHaveCount(produitsParCategorie('office').length);
      await catalogue.filterByCategory('Toutes');
      await expect(catalogue.productCards).toHaveCount(PRODUITS.length);
    });
  });

  test.describe('Filtre par prix', () => {
    for (const { libelle, min, max } of FILTRES_PRIX) {
      const attendus = PRODUITS.filter((p) => p.prix >= min && p.prix < max);

      test(`${libelle} : uniquement des prix dans [${min} ; ${max}[`, async ({ catalogue }) => {
        await catalogue.filterByPrice(libelle);
        await expect(catalogue.productCards).toHaveCount(attendus.length);

        for (const prix of await catalogue.displayedPrices()) {
          expect(prix).toBeGreaterThanOrEqual(min);
          expect(prix).toBeLessThan(max);
        }
      });
    }

    test('se combine avec le filtre catégorie', async ({ catalogue }) => {
      await catalogue.filterByCategory('Accessoires');
      await catalogue.filterByPrice('Moins de 100€');

      const attendus = produitsParCategorie('accessories').filter((p) => p.prix < 100);
      await expect(catalogue.productCards).toHaveCount(attendus.length);
      expect((await catalogue.displayedIds()).sort((a, b) => a - b)).toEqual(attendus.map((p) => p.id));
    });
  });

  test.describe('Cartes produit', () => {
    test('le bouton d’ajout rapide est désactivé pour un produit en rupture', async ({ catalogue }) => {
      for (const p of PRODUITS) {
        if (p.enStock) await expect(catalogue.quickAddButton(p.id)).toBeEnabled();
        else await expect(catalogue.quickAddButton(p.id)).toBeDisabled();
      }
    });

    test('un clic sur une carte ouvre la fiche produit', async ({ catalogue, produit }) => {
      const p = PRODUITS[1];
      await catalogue.openProduct(p.id);
      await expect(produit.title).toHaveText(p.nom);
    });
  });

  test('BUG – les compteurs de catégories de l’accueil correspondent au catalogue', async ({ page }) => {
    test.fail(true, 'Accueil : 24/18/32/21 produits annoncés, catalogue réel : 4/3/3/2.');
    await page.goto('/');
    for (const slug of Object.keys(CATEGORIES) as CategorieSlug[]) {
      const carte = page.getByTestId(`category-card-${slug}`);
      await expect.soft(carte).toContainText(`${produitsParCategorie(slug).length} produits`);
    }
  });
});
