# Plan d'extraction Phase 1 — Migration de la logique métier V1 vers TypeScript

**Date** : 27 mai 2026
**Inputs** : `scripts/inventory_report.md` + introspection console sur https://carpiq.eu
**Cible** : Phase 1 de l'orchestration (3-4 semaines)
**Statut** : Document de référence pour la Phase 1

Ce document précise **quelles fonctions V1 extraire dans quel module V2, dans quel ordre, avec quels tests**.

---

## 1. Synthèse de l'inventaire V1

| Catégorie | Fonctions | LOC estimées (brutes) | LOC réelles probables | Action |
|---|---:|---:|---:|---|
| Algorithme TCO + helpers (`tco_engine`) | 16 | 93 | 200-300 | **Extraire intégralement** |
| Recommandations (`recommendations`) | 8 | 9 585 (artefact détecteur) | 300-500 | **Extraire intégralement** |
| Constantes TCO (DEPR, WLTP, CONS, etc.) | 5 (consts) | n/a | 80-120 | **Extraire intégralement** |
| Pays (`country_currency`) | 8 | 22 | 60-100 | **Extraire intégralement** |
| i18n | 2 | 26 | 40-60 | **Adapter (utiliser Astro i18n)** |
| Storage (localStorage) | 18 occurrences | n/a | 30 par usage | **Refaire (URL params + Supabase)** |
| Garage / Compare (`garage_compare`) | 14 | 8 520 (artefact) | 400-700 | **Phase 5** |
| Rendu UI questionnaire (`questionnaire_render`) | 40 | 4 349 | 2 000-3 000 | **Refaire from scratch en composants Astro** |
| Analytics | 2 occurrences | n/a | 10 | **Adapter (Mixpanel + Plausible)** |
| Data loading (fetch) | 15 occurrences | n/a | 100-200 | **Refaire (Supabase client)** |

**Total logique métier à extraire** : ~800-1200 LOC réelles (ICEs du moteur)
**Total UI à refaire** : ~2000-3000 LOC remplacées par composants Astro

---

## 2. Ordre d'extraction

Le principe : on extrait du **bas niveau au haut niveau**. Chaque module dépend uniquement de modules déjà extraits et testés. À chaque palier, on valide via les snapshots `baseline_expected.json`.

### Palier 1 — Fondations TypeScript (1 semaine)

**1.1 — `src/lib/types.ts`** (effort : 0.5j)

Types TypeScript pour toute la logique métier :
- `Powertrain = 'ice' | 'hev' | 'phev' | 'bev' | 'die'`
- `TripsCategory = 'short' | 'mixed' | 'long' | 'vlong'`
- `KmCategory = 'u10' | 'm20' | 'm35' | 'o35'`
- `Charging = 'no' | 'maybe' | 'socket'`
- `Pref = 'cost' | 'ratio' | 'premium' | 'sport' | 'eco' | 'family'`
- `Country = 'fr' | 'be' | 'nl' | 'ch' | 'de' | 'es' | 'it' | 'pt' | 'lu'`
- `Vehicle` interface (id, name, brand, pt, seg, newP, etc.)
- `TcoResult` interface (purchP, saleP, depr5, yf, maint, rep, mo, risk)
- `RecResult` interface (best, refCar, bTco, iceTco, bodySegs, warns, ptComp)
- `UserState` interface (budget, km, trips, charging, body, pref, urban, age, dept)

Aucun test : pure définition de types.

**1.2 — `src/lib/constants/depreciation.ts`** (effort : 0.5j)

Extraction de `DEPR` (position 191904 dans V1).

```typescript
export const DEPR: Record<Powertrain, number[]> = {
  ice: [...],
  hev: [...],
  // etc.
};
```

Test : `DEPR.ice.length === 11` (0 à 10 ans).

**1.3 — `src/lib/constants/consumption.ts`** (effort : 0.5j)

Extraction de :
- `CONS` (position 191330) — consommation par trip type
- `WLTP` — multiplicateurs WLTP par powertrain
- `KMM` (position 215340) — mapping `u10`/`m20`/`m35`/`o35` vers km annuels
- `BPROB` (position 192580) — probabilités de panne par powertrain × âge
- `MAINT_MULT` (position 213021) — multiplicateur entretien selon âge

**1.4 — `src/lib/constants/segments.ts`** (effort : 0.5j)

Extraction de `SEG_MAP` et `MOD_MAP` (vu dans `getBodySegs`).

---

### Palier 2 — Algorithme TCO pur (1 semaine)

**2.1 — `src/lib/country-data.ts`** (effort : 1j)

Extraction de :
- `COUNTRY_ENERGY` (mapping prix énergie par pays)
- `getCountryCO2`, `getCountryBonusBEV`, `getCountryBonusPHEV`, `getCountryFlag`, `getCountryLang`
- `getFP` (fuel price), `getEP` (electric price home), `getEPU` (electric price public)

Test :
- `getFP('fr')` retourne le prix essence FR
- `getFP('ch')` retourne un prix CHF différent
- 9 pays supportés

**2.2 — `src/lib/fuel-cost.ts`** (effort : 1.5j)

Extraction de `fuelCost(pt, trips, km)` + helpers internes :
- `home()`, `phevChargeFactor()`, `bevWinterPen()`, `urbanMod()`, `wltpMult()`

**Refactoring obligatoire** : la version V1 lit `st.charging`, `st.urban`, `st.trips` en globale. La version V2 prend ces params explicitement :

```typescript
export function fuelCost(
  pt: Powertrain,
  trips: TripsCategory,
  km: number,
  charging: Charging,
  urban: boolean,
  country: Country
): number {
  // ...
}
```

Test : snapshot sur 96 cas `calc_tco_inputs.json` → l'output doit matcher `yf` du baseline_expected.

**2.3 — `src/lib/maintenance.ts`** (effort : 0.5j)

Extraction de `annualMaint`, `repairCost`, `insMod`, `purchAtAge`.

**Refactoring** : prennent leurs params explicitement (pas de globales).

**2.4 — `src/lib/tco-engine.ts`** (effort : 1j)

Extraction de `calcTCO(pt, newP, brand, age, km)` :

```typescript
export interface TcoInputs {
  pt: Powertrain;
  newP: number;
  brand: string;
  age: number;          // 0, 2, 5, 8...
  km: number;           // km annuels effectifs
  trips: TripsCategory; // pour fuelCost
  charging: Charging;   // pour fuelCost (BEV/PHEV)
  urban: boolean;       // pour fuelCost
  country: Country;     // pour fuelCost
}

export function calcTco(inputs: TcoInputs): TcoResult {
  // ...
}
```

**Test critique** : sur les 96 cas du baseline, l'output `calcTco(...)` doit matcher à 100% les valeurs de `baseline_expected.json.calcTcoCases[*].output`.

**Critère de bascule Palier 2 → 3** : 96/96 cas verts. Si < 96, on debug avant de continuer.

---

### Palier 3 — Recommandation end-to-end (1 semaine)

**3.1 — `src/lib/catalog.ts`** (effort : 1j)

Le catalogue (`DB` dans V1) est déjà en JSON. On le charge dans Supabase (ou en JSON statique pour Phase 1 si Supabase pas encore prêt).

```typescript
export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  pt: Powertrain;
  seg: string[];
  newP: number;
  // ... champs subjective_scores etc.
}

export async function loadCatalog(): Promise<Vehicle[]> { ... }

export function filterVehiclesBySegment(vehicles: Vehicle[], segs: string[]): Vehicle[] { ... }

export function purchAtAge(vehicle: Vehicle, age: number): number { ... }
```

**3.2 — `src/lib/body-segments.ts`** (effort : 0.5j)

Extraction de `getBodySegs(body: string[])`. Refactoring : prend `body` en argument.

**3.3 — `src/lib/score.ts`** (effort : 1j)

Extraction de `scorePt(pt, params)`. Refactoring : prend tous les params nécessaires explicitement.

**3.4 — `src/lib/recommendation.ts`** (effort : 1.5j)

Extraction de `bestPt` et `getRec`. Le plus complexe car c'est le chef d'orchestre.

```typescript
export interface RecInputs {
  budget: number;
  km: KmCategory;
  trips: TripsCategory;
  charging: Charging;
  body: string[];
  pref: Pref | null;
  urban: boolean;
  age: AgeRange | null;
  dept: string | null;
  country: Country;
}

export function recommend(inputs: RecInputs, catalog: Vehicle[]): RecResult {
  // ...
}
```

**Test critique** : sur les 57 cas `get_rec_inputs.json`, l'output doit matcher `baseline_expected.json.getRecCases[*].output` pour les champs déterministes (`best`, `refCar.id`, `bTco.yf`, `bTco.mo`).

**Critère de bascule Palier 3 → 4** : ≥ 55/57 cas verts (on tolère 2 écarts si on les comprend et documente).

---

### Palier 4 — Intégration et validation (0.5 semaine)

**4.1 — `tests/unit/baseline-replay.test.ts`** (effort : 1j)

Un seul test runner Vitest qui :
1. Charge `baseline_expected.json`
2. Pour chaque cas `calcTcoCases` : appelle `calcTco()`, compare au baseline (égalité stricte sur entiers, tolérance 0.01 sur floats)
3. Pour chaque cas `getRecCases` : appelle `recommend()`, compare aux champs déterministes

```typescript
import { describe, it, expect } from 'vitest';
import baseline from '../../tests/fixtures/baseline_expected.json';
import { calcTco } from '@/lib/tco-engine';
import { recommend } from '@/lib/recommendation';

describe('TCO Engine — baseline V1 replay', () => {
  baseline.calcTcoCases.forEach((testCase) => {
    it(`calcTco: ${testCase.id}`, () => {
      const result = calcTco({ ...testCase.inputs });
      expect(result.purchP).toBe(testCase.output.purchP);
      expect(result.yf).toBeCloseTo(testCase.output.yf, 2);
      // etc.
    });
  });
});
```

**4.2 — Documentation finale** (effort : 0.5j)

Mettre à jour `docs/adr/` avec un ADR-008 documentant les écarts éventuels (cas où l'algo V2 diffère intentionnellement de V1 — par exemple si on identifie un bug latent V1 qu'on corrige).

---

## 3. Critères de validation Phase 1

Avant de basculer en Phase 2, on doit cocher :

- [ ] Tous les modules `src/lib/*.ts` créés avec TypeScript strict
- [ ] 100% des cas `calcTcoCases` baseline en vert
- [ ] ≥ 95% des cas `getRecCases` baseline en vert (écarts documentés)
- [ ] Couverture de tests unitaires sur `lib/*.ts` > 70%
- [ ] Aucune fonction lit de globale (toutes les dépendances passées en arguments)
- [ ] Aucun appel `localStorage` direct (utilisation d'une abstraction)
- [ ] Lighthouse CI toujours vert
- [ ] Tous les commits suivent les conventions (feat/fix/test/docs/chore)
- [ ] Documentation à jour : README, ADR-008 si écarts intentionnels

---

## 4. Ce qui n'est PAS dans la Phase 1

À expliciter pour éviter le scope creep :

- **Aucune page Astro ne consomme encore `recommend()`** — l'UI vient en Phase 3
- **Garage / Compare** : reportés en Phase 5
- **i18n EN, DE, etc.** : Phase 4
- **Pages véhicules SEO** : Phase 4
- **Production éditoriale** : Phase 4-6

---

## 5. Risques identifiés

### R1 — Cas `getRec` non reproductibles à 100%

**Description** : `getRec` peut dépendre de variables qu'on n'a pas snapshotées (ordre d'itération sur Map, random, dates).

**Mitigation** :
- Le snapshot a déjà été pris (153 cas dans `baseline_expected.json`)
- Si l'algo V1 utilise du randomness, on l'identifiera au premier écart et on documentera
- Tolérance de 2-3 écarts sur 57 cas getRec acceptable si comprise

### R2 — Découverte de logique non-cataloguée

**Description** : il peut y avoir de la logique métier dans des fonctions qu'on a classées en `questionnaire_render` (présentation). Exemple : `renderResults` (1053 LOC) contient peut-être des calculs intermédiaires.

**Mitigation** :
- En Phase 3 (parcours principal), on extraira ces calculs intermédiaires au fur et à mesure
- Si on découvre de la logique critique, on ajoute un cas de test à `baseline_expected.json` et on étend le module concerné

### R3 — Performances du runner de tests

**Description** : 153 cas × validation = potentiel ralentissement de la CI.

**Mitigation** :
- Vitest est rapide, 153 cas devraient s'exécuter en < 1 seconde
- Si lent, paralléliser via `vitest --threads`

---

## 6. Premier commit de Phase 1

Quand on démarre Phase 1, premier commit :

```bash
git checkout -b phase-1/foundations
mkdir -p src/lib/constants
# Créer types.ts
git add src/lib/types.ts
git commit -m "feat(lib): add core TypeScript types for vehicle and TCO domain"
```

Puis Palier 1 (3-4 jours), commit par module, PR à la fin.

---

*Document produit le 27 mai 2026 par Claude + Jérémie. Sera révisé à la fin de chaque palier.*
