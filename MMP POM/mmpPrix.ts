import { Locator } from '@playwright/test';

/** Extrait tous les montants "123.45 €" d'un texte, dans l'ordre d'apparition. */
export function extrairePrix(texte: string): number[] {
  return [...texte.matchAll(/(\d+(?:[.,]\d{1,2})?)\s?€/g)].map((m) => Number(m[1].replace(',', '.')));
}

/** Premier montant trouvé dans le texte d'un locator. */
export async function lirePrix(locator: Locator): Promise<number> {
  const prix = extrairePrix(await locator.innerText());
  if (prix.length === 0) throw new Error(`Aucun prix trouvé dans : ${await locator.innerText()}`);
  return prix[0];
}

/** Formate un nombre comme sur le site : 199.99 → "199.99 €". */
export const formatPrix = (n: number) => `${n.toFixed(2)} €`;
