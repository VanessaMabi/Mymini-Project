import { test, expect } from '../MMP FIXTURES/mmpfixtures';

test.describe('Navigation et pages transverses', () => {
  const pages = [
    { chemin: '/', titre: 'La technologie qui simplifie votre quotidien' },
    { chemin: '/products', titre: 'Notre Catalogue' },
    { chemin: '/about', titre: 'À propos de TechHub' },
    { chemin: '/contact', titre: 'Nous Contacter' },
  ];

  /** Erreurs connues, émises par des librairies tierces et non par l'application. */
  const ERREURS_IGNOREES = [
    /Navigator LockManager lock "lock:sb-.*-auth-token"/, // supabase-js sous Firefox
  ];

  for (const { chemin, titre } of pages) {
    test(`${chemin} se charge sans erreur console`, async ({ page }) => {
      const erreurs: string[] = [];
      const noter = (texte: string) => {
        if (!ERREURS_IGNOREES.some((re) => re.test(texte))) erreurs.push(texte);
      };
      page.on('console', (msg) => msg.type() === 'error' && noter(msg.text()));
      page.on('pageerror', (err) => noter(err.message));

      await page.goto(chemin);
      await expect(page.getByRole('heading', { level: 1 })).toHaveText(titre);
      expect(erreurs).toEqual([]);
    });
  }

  test('les liens du header mènent aux bonnes pages', async ({ page, header }) => {
    await page.goto('/');
    const liens = [
      { lien: header.productsLink, url: /\/products$/ },
      { lien: header.aboutLink, url: /\/about$/ },
      { lien: header.contactLink, url: /\/contact$/ },
      { lien: header.homeLink, url: /\/$/ },
    ];
    for (const { lien, url } of liens) {
      await lien.click();
      await expect(page).toHaveURL(url);
    }
  });

  test('les boutons du bandeau d’accueil mènent au catalogue et à "À propos"', async ({ page }) => {
    await page.goto('/');
    await page.getByTestId('hero-cta-button').click();
    await expect(page).toHaveURL(/\/products$/);

    await page.goto('/');
    await page.getByTestId('hero-about-button').click();
    await expect(page).toHaveURL(/\/about$/);
  });

  test('une route inconnue affiche la page 404', async ({ page }) => {
    await page.goto('/page-inexistante');
    await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  });

  test('BUG – la page 404 est en français', async ({ page }) => {
    test.fail(true, 'La page 404 affiche "Oops! Page not found" / "Return to Home".');
    await page.goto('/page-inexistante');
    await expect(page.getByText('Oops! Page not found')).toHaveCount(0);
  });

  test('BUG – aucun lien du footer ne pointe vers "#"', async ({ page }) => {
    test.fail(true, 'Réseaux sociaux, CGU… pointent vers "#" ; Carrières/Presse/Blog vers "/".');
    await page.goto('/');
    await expect(page.getByRole('contentinfo').locator('a[href="#"]')).toHaveCount(0);
  });
});
