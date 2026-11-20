import { test, expect } from '../MMP FIXTURES/mmpfixtures';

const USER_EMAIL = process.env.USER_EMAIL1!;
const USER_PASSWORD = process.env.USER_PASSWORD1!;

test.describe('Connexion', () => {
  test.beforeEach(async ({ login }) => {
    await login.goto();
  });

  test('connexion réussie avec des identifiants valides', async ({ login }) => {
    await test.step('Se connecter', async () => {
      await login.login(USER_EMAIL, USER_PASSWORD);
    });

    await test.step('Le message de bienvenue s’affiche', async () => {
      await expect(login.statusToast).toBeVisible();
      await expect(login.successMessage).toBeVisible();
      await expect(login.errorMessage).toBeHidden();
    });
  });

  const casEchec = [
    { titre: 'mot de passe incorrect', email: USER_EMAIL, password: 'Yopmail' },
    { titre: 'email inconnu', email: 'mmp9@yopmail.com', password: 'Yopmail9' },
  ];

  for (const { titre, email, password } of casEchec) {
    test(`échec de connexion : ${titre}`, async ({ login, page }) => {
      await test.step('Tenter de se connecter', async () => {
        await login.login(email, password);
      });

      await test.step("Le message d'erreur s'affiche et l'utilisateur reste sur /auth", async () => {
        await expect(login.statusToast).toBeVisible();
        await expect(login.errorMessage).toBeVisible();
        await expect(page).toHaveURL(/\/auth/);
        await expect(login.submitButton).toBeVisible();
      });
    });
  }
});
