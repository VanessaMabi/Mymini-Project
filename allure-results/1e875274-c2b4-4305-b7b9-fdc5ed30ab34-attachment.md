# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: MMPTest Navigation.spec.ts >> Navigation et pages transverses >> BUG – la page 404 est en français
- Location: tests/MMPTest Navigation.spec.ts:60:7

# Error details

```
Error: expect(locator).toHaveCount(expected) failed

Locator:  getByText('Oops! Page not found')
Expected: 0
Received: 1
Timeout:  5000ms

Call log:
  - Expect "toHaveCount" getByText('Oops! Page not found') with timeout 5000ms
  - waiting for getByText('Oops! Page not found')
    14 × locator resolved to 1 element
       - unexpected value "1"

```

# Page snapshot

```yaml
- generic [active] [ref=e1]:
  - generic [ref=e2]:
    - region "Notifications (F8)":
      - list
    - region "Notifications alt+T"
    - generic [ref=e4]:
      - heading "404" [level=1] [ref=e5]
      - paragraph [ref=e6]: Oops! Page not found
      - link "Return to Home" [ref=e7] [cursor=pointer]:
        - /url: /
  - complementary "Edit with Lovable" [ref=e8]:
    - link "Edit with Lovable" [ref=e9] [cursor=pointer]:
      - /url: https://lovable.dev/projects/lovp_0rewj1v2fv99a9r25rp0m5e892?utm_source=lovable-badge
      - generic [ref=e10]: Edit with
    - button "Dismiss" [ref=e17] [cursor=pointer]
```

# Test source

```ts
  1  | import { test, expect } from '../MMP FIXTURES/mmpfixtures';
  2  | 
  3  | test.describe('Navigation et pages transverses', () => {
  4  |   const pages = [
  5  |     { chemin: '/', titre: 'La technologie qui simplifie votre quotidien' },
  6  |     { chemin: '/products', titre: 'Notre Catalogue' },
  7  |     { chemin: '/about', titre: 'À propos de TechHub' },
  8  |     { chemin: '/contact', titre: 'Nous Contacter' },
  9  |   ];
  10 | 
  11 |   /** Erreurs connues, émises par des librairies tierces et non par l'application. */
  12 |   const ERREURS_IGNOREES = [
  13 |     /Navigator LockManager lock "lock:sb-.*-auth-token"/, // supabase-js sous Firefox
  14 |   ];
  15 | 
  16 |   for (const { chemin, titre } of pages) {
  17 |     test(`${chemin} se charge sans erreur console`, async ({ page }) => {
  18 |       const erreurs: string[] = [];
  19 |       const noter = (texte: string) => {
  20 |         if (!ERREURS_IGNOREES.some((re) => re.test(texte))) erreurs.push(texte);
  21 |       };
  22 |       page.on('console', (msg) => msg.type() === 'error' && noter(msg.text()));
  23 |       page.on('pageerror', (err) => noter(err.message));
  24 | 
  25 |       await page.goto(chemin);
  26 |       await expect(page.getByRole('heading', { level: 1 })).toHaveText(titre);
  27 |       expect(erreurs).toEqual([]);
  28 |     });
  29 |   }
  30 | 
  31 |   test('les liens du header mènent aux bonnes pages', async ({ page, header }) => {
  32 |     await page.goto('/');
  33 |     const liens = [
  34 |       { lien: header.productsLink, url: /\/products$/ },
  35 |       { lien: header.aboutLink, url: /\/about$/ },
  36 |       { lien: header.contactLink, url: /\/contact$/ },
  37 |       { lien: header.homeLink, url: /\/$/ },
  38 |     ];
  39 |     for (const { lien, url } of liens) {
  40 |       await lien.click();
  41 |       await expect(page).toHaveURL(url);
  42 |     }
  43 |   });
  44 | 
  45 |   test('les boutons du bandeau d’accueil mènent au catalogue et à "À propos"', async ({ page }) => {
  46 |     await page.goto('/');
  47 |     await page.getByTestId('hero-cta-button').click();
  48 |     await expect(page).toHaveURL(/\/products$/);
  49 | 
  50 |     await page.goto('/');
  51 |     await page.getByTestId('hero-about-button').click();
  52 |     await expect(page).toHaveURL(/\/about$/);
  53 |   });
  54 | 
  55 |   test('une route inconnue affiche la page 404', async ({ page }) => {
  56 |     await page.goto('/page-inexistante');
  57 |     await expect(page.getByRole('heading', { name: '404' })).toBeVisible();
  58 |   });
  59 | 
  60 |   test('BUG – la page 404 est en français', async ({ page }) => {
  61 |     test.fail(true, 'La page 404 affiche "Oops! Page not found" / "Return to Home".');
  62 |     await page.goto('/page-inexistante');
> 63 |     await expect(page.getByText('Oops! Page not found')).toHaveCount(0);
     |                                                          ^ Error: expect(locator).toHaveCount(expected) failed
  64 |   });
  65 | 
  66 |   test('BUG – aucun lien du footer ne pointe vers "#"', async ({ page }) => {
  67 |     test.fail(true, 'Réseaux sociaux, CGU… pointent vers "#" ; Carrières/Presse/Blog vers "/".');
  68 |     await page.goto('/');
  69 |     await expect(page.getByRole('contentinfo').locator('a[href="#"]')).toHaveCount(0);
  70 |   });
  71 | });
  72 | 
```