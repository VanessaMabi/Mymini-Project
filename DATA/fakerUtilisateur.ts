import { faker } from '@faker-js/faker';

/**
 * Mot de passe garanti avec au moins 1 majuscule, 1 minuscule et 1 chiffre
 * (format attendu par le formulaire, ex. "Yopmail8").
 */
function creerMotDePasse(): string {
  const majuscule = faker.string.alpha({ length: 1, casing: 'upper' });
  const minuscules = faker.string.alpha({ length: 8, casing: 'lower' });
  const chiffres = faker.string.numeric(2);
  return `${majuscule}${minuscules}${chiffres}`;
}

export function creerUtilisateur() {
  const prenom = faker.person.firstName();
  const nom = faker.person.lastName();

  return {
    nom: `${prenom} ${nom}`,
    email: faker.internet
      .email({ firstName: prenom, lastName: nom, provider: 'yopmail.com' })
      .toLowerCase(),
    password: creerMotDePasse(),
  };
}
