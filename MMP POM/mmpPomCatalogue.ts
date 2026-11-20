import { Locator, Page } from '@playwright/test';
import { CategorieSlug } from '../DATA/produits';
import { extrairePrix } from './mmpPrix';

export type OptionTri = 'Nouveautés' | 'Popularité' | 'Prix croissant' | 'Prix décroissant';

export class MmpPomCatalogue {
  readonly page: Page;
  readonly heading: Locator;
  readonly filtersButton: Locator;
  readonly productCount: Locator;
  readonly sortSelect: Locator;
  readonly productCards: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heading = page.getByRole('heading', { name: 'Notre Catalogue' });
    this.filtersButton = page.getByRole('button', { name: 'Filtres', exact: true });
    this.productCount = page.getByText(/^\d+ produits?$/);
    this.sortSelect = page.getByRole('main').getByRole('combobox');
    this.productCards = page.getByRole('main').locator('[data-testid^="product-card-"]');
  }

  async goto(categorie?: CategorieSlug): Promise<void> {
    await this.page.goto(categorie ? `/products?category=${categorie}` : '/products');
    await this.heading.waitFor();
  }

  card(id: number): Locator {
    return this.page.getByTestId(`product-card-${id}`);
  }

  quickAddButton(id: number): Locator {
    return this.page.getByTestId(`add-to-cart-${id}`);
  }

  async openFilters(): Promise<void> {
    await this.filtersButton.click();
    await this.page.getByRole('heading', { name: 'Catégories' }).waitFor();
  }

  /** Filtre catégorie ("Toutes", "Accessoires", "Gaming"…). Ouvre le panneau si besoin. */
  async filterByCategory(libelle: string): Promise<void> {
    const bouton = this.page.getByRole('button', { name: libelle, exact: true });
    if (!(await bouton.isVisible())) await this.openFilters();
    await bouton.click();
  }

  /** Filtre prix ("Tous les prix", "Moins de 100€"…). Ouvre le panneau si besoin. */
  async filterByPrice(libelle: string): Promise<void> {
    const bouton = this.page.getByRole('button', { name: libelle, exact: true });
    if (!(await bouton.isVisible())) await this.openFilters();
    await bouton.click();
  }

  async sortBy(option: OptionTri): Promise<void> {
    await this.sortSelect.selectOption({ label: option });
  }

  /** Prix actuel (hors prix barré) de chaque carte affichée, dans l'ordre d'affichage. */
  async displayedPrices(): Promise<number[]> {
    const textes = await this.productCards.allInnerTexts();
    return textes.map((t) => extrairePrix(t)[0]);
  }

  async displayedIds(): Promise<number[]> {
    const ids = await this.productCards.evaluateAll((cards) =>
      cards.map((c) => Number(c.getAttribute('data-testid')!.replace('product-card-', ''))),
    );
    return ids;
  }

  async displayedNames(): Promise<string[]> {
    return this.productCards.getByRole('heading', { level: 3 }).allInnerTexts();
  }

  async openProduct(id: number): Promise<void> {
    await this.card(id).click();
    await this.page.waitForURL(`**/product/${id}`);
  }

  /** Ajoute un produit via le bouton rapide de la carte (sans ouvrir la fiche). */
  async quickAdd(id: number): Promise<void> {
    await this.quickAddButton(id).click();
  }
}
