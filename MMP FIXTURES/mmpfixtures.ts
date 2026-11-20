import { test as base, expect } from '@playwright/test';
import { MmpPomRegistration } from '../MMP POM/mmpPomRegistration';
import { MmpPomLogin } from '../MMP POM/mmpPomLogin';
import { MmpPomAccueil } from '../MMP POM/mmpPomAccueil';
import { MmpPomHeader } from '../MMP POM/mmpPomHeader';
import { MmpPomCatalogue } from '../MMP POM/mmpPomCatalogue';
import { MmpPomProduit } from '../MMP POM/mmpPomProduit';
import { MmpPomPanier } from '../MMP POM/mmpPomPanier';
import { MmpPomCheckout } from '../MMP POM/mmpPomCheckout';
import { MmpPomContact } from '../MMP POM/mmpPomContact';
import { MmpPomCompte } from '../MMP POM/mmpPomCompte';

type Fixtures = {
  registration: MmpPomRegistration;
  login: MmpPomLogin;
  accueil: MmpPomAccueil;
  header: MmpPomHeader;
  catalogue: MmpPomCatalogue;
  produit: MmpPomProduit;
  panier: MmpPomPanier;
  checkout: MmpPomCheckout;
  contact: MmpPomContact;
  compte: MmpPomCompte;
  /**
   * Remplit le panier depuis le catalogue puis ouvre /cart.
   * Ex. : await remplirPanier([1, 2, 2]) → produit 1 ×1, produit 2 ×2.
   * Tout se fait en navigation côté client, car le panier n'est pas persisté.
   */
  remplirPanier: (ids: number[]) => Promise<void>;
};

export const test = base.extend<Fixtures>({
  registration: async ({ page }, use) => {
    await use(new MmpPomRegistration(page));
  },
  login: async ({ page }, use) => {
    await use(new MmpPomLogin(page));
  },
  accueil: async ({ page }, use) => {
    await use(new MmpPomAccueil(page));
  },
  header: async ({ page }, use) => {
    await use(new MmpPomHeader(page));
  },
  catalogue: async ({ page }, use) => {
    await use(new MmpPomCatalogue(page));
  },
  produit: async ({ page }, use) => {
    await use(new MmpPomProduit(page));
  },
  panier: async ({ page }, use) => {
    await use(new MmpPomPanier(page));
  },
  checkout: async ({ page }, use) => {
    await use(new MmpPomCheckout(page));
  },
  contact: async ({ page }, use) => {
    await use(new MmpPomContact(page));
  },
  compte: async ({ page }, use) => {
    await use(new MmpPomCompte(page));
  },
  remplirPanier: async ({ catalogue, header }, use) => {
    await use(async (ids: number[]) => {
      await catalogue.goto();
      for (const id of ids) {
        await catalogue.quickAdd(id);
      }
      await expect(header.cartCount).toHaveText(String(ids.length));
      await header.openCart();
    });
  },
});

export { expect };
