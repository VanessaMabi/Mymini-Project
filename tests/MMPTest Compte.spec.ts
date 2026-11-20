import { test, expect } from '../MMP FIXTURES/mmpfixtures';
import { STORAGE_STATE_USER1 } from '../MMP FIXTURES/mmpAuth';

test.describe('Compte – visiteur non connecté', () => {
  test('/account affiche le formulaire de connexion', async ({ compte, login }) => {
    await compte.goto();
    await expect(login.submitButton).toBeVisible();
    await expect(compte.heading).toHaveCount(0);
  });
});

test.describe('Compte – utilisateur connecté', () => {
  test.use({ storageState: STORAGE_STATE_USER1 });

  test.beforeEach(async ({ page, header }) => {
    await page.goto('/');
    await header.openAccount();
  });

  test('le profil affiche l’email du compte', async ({ compte }) => {
    await expect(compte.heading).toBeVisible();
    await expect(compte.profileValue('Email')).toHaveText(process.env.USER_EMAIL1!);
    await expect(compte.editButton).toBeVisible();
  });

  test('les onglets Profil / Commandes / Paramètres sont disponibles', async ({ compte }) => {
    for (const onglet of [compte.profileTab, compte.ordersTab, compte.settingsTab]) {
      await expect(onglet).toBeVisible();
    }
    await compte.openOrders();
    await expect(compte.ordersHeading).toBeVisible();
  });
});

/**
 * La déconnexion utilise le compte USER_EMAIL2 : une déconnexion Supabase révoque
 * toutes les sessions du compte, ce qui casserait la session partagée de USER_EMAIL1.
 */
test.describe('Déconnexion', () => {
  test('depuis le menu utilisateur', async ({ page, login, header }) => {
    test.skip(!process.env.USER_EMAIL2 || !process.env.USER_PASSWORD2, 'USER_EMAIL2 / USER_PASSWORD2 non définis');

    await page.goto('/auth');
    await login.login(process.env.USER_EMAIL2!, process.env.USER_PASSWORD2!);
    await expect(header.userMenuButton).toBeVisible();

    await header.logout();

    await expect(header.authLink).toBeVisible();
    await expect(header.userMenuButton).toHaveCount(0);
  });
});
