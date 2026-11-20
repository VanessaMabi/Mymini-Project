import { test as base, expect } from '@playwright/test';
import { MmpPomRegistration } from '../MMP POM/mmpPomRegistration';

type Fixtures = {
  registration: MmpPomRegistration;
};

export const test = base.extend<Fixtures>({
  registration: async ({ page }, use) => {
    await use(new MmpPomRegistration(page));
  },
});

export { expect };