import { test, expect } from '../MMP FIXTURES/mmpfixtures';
import { creerUtilisateur } from '../DATA/fakerUtilisateur';

test.describe('Inscription', () => {
  test.beforeEach(async ({ registration }) => {
    await registration.goto();
    await registration.openRegistrationForm();
  });

  test('création de compte réussie avec un utilisateur aléatoire', async ({ registration }) => {
    const utilisateur = creerUtilisateur();

    await test.step('Le formulaire d’inscription est affiché', async () => {
      await expect(registration.heading).toBeVisible();
      await expect(registration.panel).toBeVisible();
    });

    await test.step('Remplir le formulaire', async () => {
      await registration.fillForm(utilisateur);

      await expect(registration.nameInput).toHaveValue(utilisateur.nom);
      await expect(registration.emailInput).toHaveValue(utilisateur.email);
      await expect(registration.passwordInput).toHaveValue(utilisateur.password);
      await expect(registration.confirmPasswordInput).toHaveValue(utilisateur.password);
    });

    await test.step('Soumettre et vérifier le message de succès', async () => {
      await registration.submitButton.click();

      await expect(registration.statusToast).toBeVisible();
      await expect(registration.successMessage).toBeVisible();
      await expect(registration.verifyEmailMessage).toBeVisible();
    });
  });
});
