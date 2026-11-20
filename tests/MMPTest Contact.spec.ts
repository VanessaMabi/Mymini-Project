import { test, expect } from '../MMP FIXTURES/mmpfixtures';
import { creerMessageContact } from '../DATA/fakerCheckout';

test.describe('Contact', () => {
  test.beforeEach(async ({ contact }) => {
    await contact.goto();
  });

  test('les 4 champs sont obligatoires', async ({ contact }) => {
    await contact.submitButton.click();

    for (const champ of [contact.nameInput, contact.emailInput, contact.subjectInput, contact.messageInput]) {
      await expect(champ).toHaveAttribute('required', '');
      expect(await contact.validationMessage(champ)).not.toBe('');
    }
    await expect(contact.successMessage).toHaveCount(0);
  });

  test('un email mal formé est refusé', async ({ contact }) => {
    await contact.send({ ...creerMessageContact(), email: 'pasunemail' });
    expect(await contact.validationMessage(contact.emailInput)).not.toBe('');
    await expect(contact.successMessage).toHaveCount(0);
  });

  test('envoi réussi : état "Envoi en cours", confirmation puis formulaire vidé', async ({ contact }) => {
    await contact.send(creerMessageContact());

    await expect(contact.sendingButton).toBeVisible();
    await expect(contact.successMessage).toBeVisible();
    await expect(contact.submitButton).toBeEnabled();
    for (const champ of [contact.nameInput, contact.emailInput, contact.subjectInput, contact.messageInput]) {
      await expect(champ).toHaveValue('');
    }
  });

  test('la FAQ déplie la réponse au clic', async ({ page, contact }) => {
    await expect(contact.faqHeading).toBeVisible();
    await contact.faqQuestion('Quels sont les délais de livraison ?').click();
    await expect(page.getByText(/La livraison standard prend 2-4 jours ouvrés/)).toBeVisible();
  });

  test('les coordonnées de l’entreprise sont affichées', async ({ page }) => {
    const main = page.getByRole('main');
    await expect(main.getByText('contact@techhub.fr', { exact: true })).toBeVisible();
    await expect(main.getByText('01 23 45 67 89', { exact: true })).toBeVisible();
    await expect(main.getByText('Lun-Ven : 9h-18h', { exact: true })).toBeVisible();
  });
});
