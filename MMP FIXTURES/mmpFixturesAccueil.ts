import { test as base, expect } from '@playwright/test';
import { MmpPomAccueil } from '../MMP POM/mmpPomAccueil';

type Fixtures = {
  accueil: MmpPomAccueil;
};

export const test = base.extend<Fixtures>({
  accueil: async ({ page }, use) => {
    await use(new MmpPomAccueil(page));
  },
});

export { expect };
