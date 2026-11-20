import { fakerFR as faker } from '@faker-js/faker';

export interface AdresseLivraison {
  telephone: string;
  adresse: string;
  ville: string;
  codePostal: string;
}

export interface CartePaiement {
  numero: string;
  nom: string;
  expiration: string; // MM/AA
  cvv: string;
}

export interface MessageContact {
  nom: string;
  email: string;
  sujet: string;
  message: string;
}

/** Adresse française aléatoire (téléphone mobile 06/07 + code postal à 5 chiffres). */
export function creerAdresseLivraison(): AdresseLivraison {
  return {
    telephone: `0${faker.helpers.arrayElement(['6', '7'])}${faker.string.numeric(8)}`,
    adresse: faker.location.streetAddress(),
    ville: faker.location.city(),
    codePostal: faker.location.zipCode('#####'),
  };
}

/** Carte de test fictive (numéro Visa de test 4242…) avec une date d'expiration dans le futur. */
export function creerCarteValide(): CartePaiement {
  const dans = faker.date.future({ years: 4 });
  const mm = String(dans.getMonth() + 1).padStart(2, '0');
  const aa = String(dans.getFullYear()).slice(-2);
  return {
    numero: '4242 4242 4242 4242',
    nom: faker.person.fullName().toUpperCase(),
    expiration: `${mm}/${aa}`,
    cvv: faker.string.numeric(3),
  };
}

/** Cartes manifestement invalides : le site devrait les refuser. */
export const CARTES_INVALIDES: { cas: string; carte: CartePaiement }[] = [
  { cas: 'numéro trop court', carte: { numero: '1234', nom: 'TEST AUTO', expiration: '12/30', cvv: '123' } },
  { cas: 'date expirée', carte: { numero: '4242 4242 4242 4242', nom: 'TEST AUTO', expiration: '01/20', cvv: '123' } },
  { cas: 'mois inexistant', carte: { numero: '4242 4242 4242 4242', nom: 'TEST AUTO', expiration: '13/30', cvv: '123' } },
  { cas: 'CVV à 5 chiffres', carte: { numero: '4242 4242 4242 4242', nom: 'TEST AUTO', expiration: '12/30', cvv: '12345' } },
];

export function creerMessageContact(): MessageContact {
  return {
    nom: faker.person.fullName(),
    email: faker.internet.email({ provider: 'yopmail.com' }).toLowerCase(),
    sujet: faker.lorem.sentence({ min: 3, max: 6 }),
    message: faker.lorem.paragraph(),
  };
}
