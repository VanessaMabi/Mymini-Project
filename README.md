# Mymini-Project

[![CI](https://github.com/VanessaMabi/Mymini-Project/actions/workflows/ci.yml/badge.svg)](https://github.com/VanessaMabi/Mymini-Project/actions/workflows/ci.yml)

Tests E2E Playwright (TypeScript, Page Object Model + fixtures) de [shop.missionplaywright.fr](https://shop.missionplaywright.fr).

## En local

```bash
npm ci
npx playwright install --with-deps
npm test                      # tous les navigateurs
npm run test:sans-commande    # sans les tests qui passent une vraie commande
npm run typecheck
npm run report                # ouvre le rapport HTML
```

Les identifiants sont lus dans `env/.env.<ENV>` (par défaut `env/.env.dev`, ignoré par git).

## CI/CD (`.github/workflows/ci.yml`)

| Déclencheur | Navigateurs | Tests `@commande` | Publication Pages |
|---|---|---|---|
| Pull request vers `main` | chromium | non | non |
| Push sur `main` | chromium, firefox, webkit | non | oui |
| Planifié (lun–ven 6h, heure de Paris) | les 3 | non | oui |
| Manuel (onglet Actions → *Run workflow*) | au choix | optionnel | oui (si `main`) |

Étapes : **qualité** (typecheck, `.only` oublié, collecte des tests) → **E2E** (un job par navigateur) → **rapports** (HTML Playwright fusionné + Allure + résumé) → **déploiement** GitHub Pages.

### Configuration du dépôt (une seule fois)

1. **Settings → Secrets and variables → Actions → Secrets** : `USER_EMAIL1`, `USER_PASSWORD1`, `USER_EMAIL2`, `USER_PASSWORD2`.
2. *(optionnel)* onglet **Variables** : `BASE_URL`, `MMP_URL` pour viser un autre environnement.
3. **Settings → Pages → Source : GitHub Actions**.
4. **Settings → Branches → règle sur `main`** : exiger les checks `Qualité du code` et `E2E (chromium)` avant merge.

Rapports publiés : `https://vanessamabi.github.io/Mymini-Project/`
