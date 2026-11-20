import { test, expect } from '../MMP FIXTURES/mmpFixturesAccueil';

test.describe('Page d’accueil', () => {
  test('affiche la navigation, les icônes et permet de parcourir les accessoires', async ({ page, accueil }) => {
    await accueil.goto();

    await test.step('Les liens de navigation sont visibles et pointent vers les bonnes pages', async () => {
      const navigation = [
        { link: accueil.homeLink, href: '/' },
        { link: accueil.productsLink, href: '/products' },
        { link: accueil.aboutLink, href: '/about' },
        { link: accueil.contactLink, href: '/contact' },
      ];

      for (const { link, href } of navigation) {
        await expect(link).toBeVisible();
        await expect(link).toHaveAttribute('href', href);
      }
    });

    await test.step('Les icônes de recherche, panier et connexion sont visibles', async () => {
      await expect(accueil.searchButton).toBeVisible();
      await expect(accueil.cartLink).toBeVisible();
      await expect(accueil.cartLink).toHaveAttribute('href', '/cart');
      await expect(accueil.loginButton).toBeVisible();
      await expect(accueil.authLink).toHaveAttribute('href', '/auth');
    });

    await test.step('La catégorie Accessoires ouvre le catalogue filtré', async () => {
      await expect(accueil.categoriesHeading).toBeVisible();
      await accueil.openAccessoriesCategory();

      await expect(page).toHaveURL('https://shop.missionplaywright.fr/products?category=accessories');
      await expect(accueil.catalogHeading).toBeVisible();
      await expect(accueil.productLinks).toHaveCount(4);
    });
  });
});