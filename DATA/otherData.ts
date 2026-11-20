import { randomUUID } from "node:crypto";
import type { RegistrationData } from "../MMP POM/mmpPomRegistration";

export function createRegistrationDetails(): RegistrationData {
  const id = randomUUID();
  const password = `Password ${id.slice(0, 4)}`;

  return {
    nom: `Test ${id.slice(0, 3)}`,
    email: `test-${id.slice(0, 3)}@example.com`,
    password,
    confirmPassword: password,
  };
}