/**
 * Référentiel du catalogue TechHub (relevé le 18/11/2026 sur shop.missionplaywright.fr).
 * Si le catalogue évolue, mettre à jour ce fichier : les tests s'appuient dessus.
 */

export type CategorieSlug = 'accessories' | 'smart-home' | 'gaming' | 'office';

export interface Produit {
  id: number;
  nom: string;
  categorie: CategorieSlug;
  prix: number;
  ancienPrix?: number; // présent uniquement si le produit est en promotion
  note: number;
  nbAvis: number;
  nouveau: boolean;
  enStock: boolean;
}

export const CATEGORIES: Record<CategorieSlug, { libelle: string; nbAnnonceAccueil: number }> = {
  accessories: { libelle: 'Accessoires', nbAnnonceAccueil: 24 },
  'smart-home': { libelle: 'Maison Connectée', nbAnnonceAccueil: 18 },
  gaming: { libelle: 'Gaming', nbAnnonceAccueil: 32 },
  office: { libelle: 'Bureau', nbAnnonceAccueil: 21 },
};

export const PRODUITS: Produit[] = [
  { id: 1, nom: 'Écouteurs Sans Fil Pro', categorie: 'accessories', prix: 199.99, ancienPrix: 249.99, note: 4.8, nbAvis: 1247, nouveau: true, enStock: true },
  { id: 2, nom: 'Hub USB-C 12-en-1', categorie: 'accessories', prix: 89.99, note: 4.6, nbAvis: 823, nouveau: false, enStock: true },
  { id: 3, nom: 'Lampe Bureau Intelligente', categorie: 'smart-home', prix: 149.99, note: 4.7, nbAvis: 456, nouveau: true, enStock: true },
  { id: 4, nom: 'Clavier Mécanique RGB', categorie: 'gaming', prix: 179.99, ancienPrix: 219.99, note: 4.9, nbAvis: 2103, nouveau: false, enStock: true },
  { id: 5, nom: 'Webcam 4K Pro Stream', categorie: 'office', prix: 199.99, note: 4.5, nbAvis: 678, nouveau: false, enStock: true },
  { id: 6, nom: 'Station de Charge Qi', categorie: 'accessories', prix: 79.99, note: 4.4, nbAvis: 892, nouveau: false, enStock: true },
  { id: 7, nom: 'Thermostat Connecté Pro', categorie: 'smart-home', prix: 249.99, note: 4.7, nbAvis: 534, nouveau: false, enStock: true },
  { id: 8, nom: 'Souris Gaming Elite', categorie: 'gaming', prix: 129.99, note: 4.8, nbAvis: 1567, nouveau: true, enStock: true },
  { id: 9, nom: 'Support Écran Ergonomique', categorie: 'office', prix: 119.99, note: 4.6, nbAvis: 423, nouveau: false, enStock: true },
  { id: 10, nom: 'Enceinte Portable 360', categorie: 'accessories', prix: 159.99, ancienPrix: 189.99, note: 4.5, nbAvis: 756, nouveau: false, enStock: true },
  { id: 11, nom: 'Caméra Sécurité Outdoor', categorie: 'smart-home', prix: 179.99, note: 4.6, nbAvis: 389, nouveau: false, enStock: true },
  { id: 12, nom: 'Casque VR Gaming', categorie: 'gaming', prix: 449.99, note: 4.7, nbAvis: 234, nouveau: true, enStock: false },
];

export const FILTRES_PRIX = [
  { libelle: 'Moins de 100€', min: 0, max: 100 },
  { libelle: '100€ - 200€', min: 100, max: 200 },
  { libelle: 'Plus de 200€', min: 200, max: Infinity },
] as const;

export function produit(id: number): Produit {
  const p = PRODUITS.find((x) => x.id === id);
  if (!p) throw new Error(`Produit ${id} absent du référentiel DATA/produits.ts`);
  return p;
}

export const produitsEnStock = () => PRODUITS.filter((p) => p.enStock);
export const produitsEnPromo = () => PRODUITS.filter((p) => p.ancienPrix !== undefined);
export const produitsParCategorie = (slug: CategorieSlug) => PRODUITS.filter((p) => p.categorie === slug);

/** Arrondi à 2 décimales pour comparer des montants sans erreur de flottant. */
export const arrondi = (n: number) => Math.round(n * 100) / 100;
