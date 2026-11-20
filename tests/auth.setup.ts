import { test as setup, expect } from '../MMP FIXTURES/mmpfixtures';
import { STORAGE_STATE_USER1 } from '../MMP FIXTURES/mmpAuth';

/**
 * Connexion unique avant la suite. La session Supabase (localStorage) est
 * enregistrée puis réutilisée par les tests qui ont besoin d'un utilisateur connecté.
 */
setup('connexion du compte de test USER_EMAIL1', async ({ page, login, header }) => {
  const email = process.env.USER_EMAIL1;
  const password = process.env.USER_PASSWORD1;
  if (!email || !password) throw new Error('USER_EMAIL1 / USER_PASSWORD1 manquants dans env/.env.<ENV>');

  await page.goto('/auth');
  await login.login(email, password);

  await expect(header.userMenuButton).toBeVisible();
  await page.context().storageState({ path: STORAGE_STATE_USER1 });
});
