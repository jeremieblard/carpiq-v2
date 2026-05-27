/**
 * Tests unitaires Palier 3a — cascade pricing + incentives.
 *
 * Stratégie : pas de baseline directe pour `purchAtAge` (la baseline V1 ne
 * snapshote que `calcTcoCases` et `getRecCases`). On valide ici la mécanique
 * en isolation via :
 *   - cas 1 : niveau 3 (DEPR statique) sans données externes
 *   - cas 2 : niveau 2 (deprCurves) avec mock partiel
 *   - cas 3 : niveau 1 (priceGrid + sanity cap v62.8) avec mock
 *   - cas 4 : incentives BEV/PHEV
 *   - cas 5 : helpers (_canonKmForAge implicite, _countryPriceAdj implicite)
 *
 * Le replay des 57 `getRecCases` aura lieu en Palier 3c (recommendation),
 * qui consomme ce module en boîte noire.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  purchAtAge,
  purchAtAgeStatic,
  predictPrice,
  deprRatioBySegment,
  brandDeprMult,
} from '../../src/lib/pricing';
import { incForCar, bevBonus } from '../../src/lib/incentives';
import {
  _setPriceGridData,
  _setDeprCurvesData,
  _resetPricingData,
} from '../../src/lib/data-loaders';
import type { Vehicle } from '../../src/lib/types';
import type { PriceGridData, DeprCurvesData } from '../../src/lib/data-loaders';

// ─────────────────────────────────────────────────────────────────────────────
// Fixtures véhicules
// ─────────────────────────────────────────────────────────────────────────────

const toyotaCorollaHEV: Vehicle = {
  id: 'corolla', // ← match AS24_MODEL_BASE['toyota:corolla'] = 'corolla'
  name: 'Toyota Corolla Hybrid',
  brand: 'toyota',
  pt: 'hev',
  seg: ['compact'],
  newP: 28000,
};

const teslaModel3BEV: Vehicle = {
  id: 'model3_bev',
  name: 'Tesla Model 3',
  brand: 'tesla',
  pt: 'bev',
  seg: ['saloon'],
  newP: 42000,
};

const dacia: Vehicle = {
  id: 'sandero_ice',
  name: 'Dacia Sandero',
  brand: 'dacia',
  pt: 'ice',
  seg: ['small'],
  newP: 14000,
};

const porscheBEV: Vehicle = {
  id: 'taycan_bev',
  name: 'Porsche Taycan',
  brand: 'porsche',
  pt: 'bev',
  seg: ['executive'],
  newP: 95000,
};

const phevCheap: Vehicle = {
  id: 'cheap_phev',
  name: 'Cheap PHEV',
  brand: 'kia',
  pt: 'phev',
  seg: ['suv_compact'],
  newP: 45000,
};

const phevExpensive: Vehicle = {
  id: 'expensive_phev',
  name: 'Expensive PHEV',
  brand: 'bmw',
  pt: 'phev',
  seg: ['executive'],
  newP: 60000,
};

// ─────────────────────────────────────────────────────────────────────────────
// Niveau 3 : DEPR statique
// ─────────────────────────────────────────────────────────────────────────────

describe('purchAtAgeStatic — niveau 3 (fallback DEPR + brandDeprMult)', () => {
  it('Toyota Corolla HEV age=0 : prix neuf intégral × brandDeprMult', () => {
    // DEPR.hev[0] = 1, brandDeprMult.toyota = 1.06
    // 28000 × 1 × 1.06 = 29680
    expect(purchAtAgeStatic(toyotaCorollaHEV, 0)).toBe(29680);
  });

  it('Toyota Corolla HEV age=5 : applique DEPR.hev[5] × brandDeprMult', () => {
    // DEPR.hev[5] = 0.54, brandDeprMult.toyota = 1.06
    // 28000 × 0.54 × 1.06 = 16027.2 → round 16027
    expect(purchAtAgeStatic(toyotaCorollaHEV, 5)).toBe(16027);
  });

  it('Tesla Model 3 BEV age=2 : DEPR.bev[2] × brandDeprMult.tesla', () => {
    // DEPR.bev[2] = 0.54, brandDeprMult.tesla = 0.98
    // 42000 × 0.54 × 0.98 = 22226.4 → 22226
    expect(purchAtAgeStatic(teslaModel3BEV, 2)).toBe(22226);
  });

  it('Dacia Sandero ICE : tient sa valeur (mult 1.08)', () => {
    // DEPR.ice[3] = 0.6, brandDeprMult.dacia = 1.08
    // 14000 × 0.6 × 1.08 = 9072
    expect(purchAtAgeStatic(dacia, 3)).toBe(9072);
  });

  it('purchAtAge sans données externes : tombe sur niveau 3 × adj pays', () => {
    _resetPricingData(); // priceGrid et deprCurves vides
    // FR adj = 0.98 → 28000 × adj = 27440 (age=0)
    expect(purchAtAge(toyotaCorollaHEV, 0, 'fr')).toBe(27440);
    // CH adj = 1.15 → 28000 × 1.15 = 32200 (age=0)
    expect(purchAtAge(toyotaCorollaHEV, 0, 'ch')).toBe(32200);
    // age=5 FR : purchAtAgeStatic × adj = 16027 × 0.98 = 15706.46 → 15706
    expect(purchAtAge(toyotaCorollaHEV, 5, 'fr')).toBe(15706);
  });
});

describe('brandDeprMult — fallback 1 si marque inconnue', () => {
  it('toyota → 1.06', () => {
    expect(brandDeprMult('toyota')).toBe(1.06);
  });

  it('dacia → 1.08', () => {
    expect(brandDeprMult('dacia')).toBe(1.08);
  });

  it('marque inconnue → 1', () => {
    expect(brandDeprMult('lada')).toBe(1);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Niveau 2 : deprRatioBySegment
// ─────────────────────────────────────────────────────────────────────────────

describe('deprRatioBySegment — niveau 2 (depr_curves.json)', () => {
  beforeEach(() => {
    _resetPricingData();
  });

  it('retourne null si deprCurvesData non chargé', () => {
    expect(deprRatioBySegment(toyotaCorollaHEV, 3, 50000, 'fr')).toBeNull();
  });

  it('age=0 retourne 1 (pas de dépréciation)', () => {
    _setDeprCurvesData({
      mainstream: { hev: { fr: { '0': { '0': 0.95 } } } },
    } as DeprCurvesData);
    expect(deprRatioBySegment(toyotaCorollaHEV, 0, 0, 'fr')).toBe(1);
  });

  it('interpolation bilinéaire dans la grille', () => {
    // Tier mainstream pour toyota, pt hev
    // age=2.5 → bracket [2, 3] ; km=37500 → bracket [25000, 50000]
    _setDeprCurvesData({
      mainstream: {
        hev: {
          fr: {
            '2': { '25000': 0.7, '50000': 0.65 },
            '3': { '25000': 0.6, '50000': 0.55 },
          },
        },
      },
    } as DeprCurvesData);
    // r1 (age=2) = lerp(37500, 25000, 50000, 0.7, 0.65) = 0.675
    // r2 (age=3) = lerp(37500, 25000, 50000, 0.6, 0.55) = 0.575
    // result = lerp(2.5, 2, 3, 0.675, 0.575) = 0.625
    const r = deprRatioBySegment(toyotaCorollaHEV, 2.5, 37500, 'fr');
    expect(r).toBeCloseTo(0.625, 5);
  });

  it('fallback sur clé "_any" si pays non listé', () => {
    // age=2 → bracket [1, 2] → besoin des deux clés '1' et '2'
    _setDeprCurvesData({
      luxury: {
        bev: {
          _any: {
            '1': { '0': 0.9 },
            '2': { '0': 0.8 },
          },
        },
      },
    } as DeprCurvesData);
    // Porsche → tier luxury, pt bev, country=pt absent : fallback _any
    // age=2 exact, km=0 exact → bracket [1, 2] × [0, 0]
    // r1 = lerp(0, 0, 0, 0.9, 0.9) = 0.9 (km borne inférieure)
    // wait : km=0, bracket [0, 0], donc v=0.9 (age=1) et 0.8 (age=2)
    // r1 = 0.9, r2 = 0.8
    // result = lerp(2, 1, 2, 0.9, 0.8) = 0.8
    expect(deprRatioBySegment(porscheBEV, 2, 0, 'pt')).toBeCloseTo(0.8, 5);
  });

  it('clamp âge à 5 (max grille depr_curves)', () => {
    // age=10 → clamp à 5 → bracket [5, 5] (borne max)
    // km=100000 → bracket [100000, 100000] (exactement sur un bin)
    _setDeprCurvesData({
      mainstream: {
        hev: {
          fr: {
            '5': { '100000': 0.4 },
          },
        },
      },
    } as DeprCurvesData);
    // bracket km à 100000 : [75000, 100000] (puisque 100000 n'est pas la dernière borne)
    // Donc on a besoin de '75000' aussi
    // Recalcule en relisant le code : si q est exactement sur un bin interne,
    // bracket retourne [bin_inférieur, q]. Pour matcher juste une cellule unique,
    // il faut utiliser la borne MAX (200000)
    expect(deprRatioBySegment(toyotaCorollaHEV, 10, 100000, 'fr')).toBeNull();
  });

  it('clamp âge à 5 avec km en borne max', () => {
    // age=10 clamp 5 → bracket [5, 5]
    // km=200000 → bracket [200000, 200000] (borne max)
    _setDeprCurvesData({
      mainstream: {
        hev: {
          fr: {
            '5': { '200000': 0.3 },
          },
        },
      },
    } as DeprCurvesData);
    expect(deprRatioBySegment(toyotaCorollaHEV, 10, 200000, 'fr')).toBeCloseTo(0.3, 5);
  });

  it('purchAtAge avec deprCurves : applique ratio × car.newP × adj', () => {
    _resetPricingData();
    // Important : NE PAS charger priceGrid sinon niveau 1 prend la priorité
    // age=2 → purchAtAge → _canonKmForAge(2) = 25000
    // bracket age [1, 2] → besoin clés '1' et '2'
    // bracket km à 25000 → [10000, 25000] → besoin '10000' et '25000'
    _setDeprCurvesData({
      mainstream: {
        hev: {
          fr: {
            '1': { '10000': 0.85, '25000': 0.85 },
            '2': { '10000': 0.7, '25000': 0.7 },
          },
        },
      },
    } as DeprCurvesData);
    // r1 (age=1) = 0.85, r2 (age=2) = 0.7
    // ratio = lerp(2, 1, 2, 0.85, 0.7) = 0.7
    // purchAtAge = round(28000 × 0.7 × 0.98) = round(19208) = 19208
    expect(purchAtAge(toyotaCorollaHEV, 2, 'fr')).toBe(19208);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Niveau 1 : predictPrice + sanity cap v62.8
// ─────────────────────────────────────────────────────────────────────────────

describe('predictPrice — niveau 1 (price_grid.json)', () => {
  beforeEach(() => {
    _resetPricingData();
  });

  it('retourne null si priceGridData non chargé', () => {
    expect(predictPrice('toyota/corolla', 'hev', 'fr', 2, 30000)).toBeNull();
  });

  it('retourne null si modelId absent', () => {
    _setPriceGridData({
      'toyota/corolla': { hev: { fr: { '0': { '0': 28000 } } } },
    } as PriceGridData);
    expect(predictPrice('renault/clio', 'hev', 'fr', 0, 0)).toBeNull();
  });

  it('interpolation bilinéaire OK', () => {
    _setPriceGridData({
      'toyota/corolla': {
        hev: {
          fr: {
            '2': { '25000': 20000, '50000': 18000 },
            '3': { '25000': 17000, '50000': 15000 },
          },
        },
      },
    } as PriceGridData);
    // age=2.5, km=37500 → interpolation
    const p = predictPrice('toyota/corolla', 'hev', 'fr', 2.5, 37500);
    // r1 = lerp(37500, 25000, 50000, 20000, 18000) = 19000
    // r2 = lerp(37500, 25000, 50000, 17000, 15000) = 16000
    // result = lerp(2.5, 2, 3, 19000, 16000) = 17500
    expect(p).toBe(17500);
  });
});

describe('purchAtAge avec sanity cap v62.8', () => {
  beforeEach(() => {
    _resetPricingData();
  });

  it('sanity cap : occasion prédite > neuf prédit → force 8%/an de dépréciation', () => {
    // Le bracket retourne deux bornes — il faut couvrir LES DEUX dans la fixture.
    // age=2 → bracket [1, 2], age=0 → bracket [0, 0]
    // _canonKmForAge(2) = 25000 → bracket [10000, 25000]
    _setPriceGridData({
      'toyota/corolla': {
        hev: {
          fr: {
            '0': { '0': 25000, '10000': 25000, '25000': 25000 },
            '1': { '10000': 28000, '25000': 28000 },
            '2': { '10000': 28000, '25000': 28000 }, // INVERSION
          },
        },
      },
    } as PriceGridData);
    // predicted = 28000, newPredicted = 25000 → cap actif
    // 25000 × 0.92^2 = 21160
    const r = purchAtAge(toyotaCorollaHEV, 2, 'fr');
    expect(r).toBe(Math.round(25000 * Math.pow(0.92, 2)));
  });

  it('pas de sanity cap si occasion < neuf (cas normal)', () => {
    _setPriceGridData({
      'toyota/corolla': {
        hev: {
          fr: {
            '0': { '0': 25000, '10000': 25000, '25000': 25000 },
            '1': { '10000': 22000, '25000': 22000 },
            '2': { '10000': 19000, '25000': 19000 }, // normal
          },
        },
      },
    } as PriceGridData);
    // bracket age [1, 2] × bracket km [10000, 25000]
    // r1 (age=1) = lerp(25000, 10000, 25000, 22000, 22000) = 22000
    // r2 (age=2) = lerp(25000, 10000, 25000, 19000, 19000) = 19000
    // lerp(2, 1, 2, 22000, 19000) = 19000
    expect(purchAtAge(toyotaCorollaHEV, 2, 'fr')).toBe(19000);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// Incentives
// ─────────────────────────────────────────────────────────────────────────────

describe('bevBonus — grille FR hardcodée (anomalie A3)', () => {
  it('< 12 000 € → 0', () => {
    expect(bevBonus(10000)).toBe(0);
    expect(bevBonus(11999)).toBe(0);
  });

  it('12 000–30 000 € → 4 000', () => {
    expect(bevBonus(12000)).toBe(4000);
    expect(bevBonus(25000)).toBe(4000);
    expect(bevBonus(30000)).toBe(4000);
  });

  it('30 000–47 000 € → 3 000', () => {
    expect(bevBonus(30001)).toBe(3000);
    expect(bevBonus(40000)).toBe(3000);
    expect(bevBonus(47000)).toBe(3000);
  });

  it('> 47 000 € → 0', () => {
    expect(bevBonus(47001)).toBe(0);
    expect(bevBonus(100000)).toBe(0);
  });
});

describe('incForCar', () => {
  it('age > 0 → 0 (pas de bonus sur occasion)', () => {
    expect(incForCar(teslaModel3BEV, 1)).toBe(0);
    expect(incForCar(toyotaCorollaHEV, 2)).toBe(0);
  });

  it('BEV neuf → bevBonus(newP)', () => {
    expect(incForCar(teslaModel3BEV, 0)).toBe(3000); // 42k → tranche 3000
    expect(incForCar(porscheBEV, 0)).toBe(0); // 95k → tranche 0
  });

  it('PHEV neuf ≤ 50k → 1 000 €', () => {
    expect(incForCar(phevCheap, 0)).toBe(1000); // 45k
  });

  it('PHEV neuf > 50k → 0', () => {
    expect(incForCar(phevExpensive, 0)).toBe(0); // 60k
  });

  it('HEV/ICE → 0 (pas d\'incentive)', () => {
    expect(incForCar(toyotaCorollaHEV, 0)).toBe(0);
    expect(incForCar(dacia, 0)).toBe(0);
  });
});
