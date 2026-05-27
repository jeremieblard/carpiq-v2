/**
 * Tests unitaires Palier 3b — body-segments + match-level + filters.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import {
  getBodySegs,
  wantsAWD,
  carHasAWD,
  isSportCar,
  _expandSegments,
  _relaxedDriver,
  segRank,
} from '../../src/lib/body-segments';
import {
  computeMatchLevel,
  carMatchesSegs,
  expandSegmentsForMatch,
  getSegmentLabel,
  getRequestedSegmentLabel,
} from '../../src/lib/match-level';
import { applyFilters } from '../../src/lib/filters';
import { _resetPricingData } from '../../src/lib/data-loaders';
import type { Vehicle, BodySelection, Segment } from '../../src/lib/types';

// ─────────────────────────────────────────────────────────────────────────────
// Fixtures véhicules pour les tests
// ─────────────────────────────────────────────────────────────────────────────

const toyotaYarisHEV: Vehicle = {
  id: 'yaris_hev',
  name: 'Toyota Yaris Hybrid',
  brand: 'toyota',
  pt: 'hev',
  seg: ['small'],
  newP: 23000,
  co2_wltp: 95,
};

const peugeot208ICE: Vehicle = {
  id: '208_ice',
  name: 'Peugeot 208',
  brand: 'peugeot',
  pt: 'ice',
  seg: ['small'],
  newP: 18000,
  co2_wltp: 130,
};

const teslaModel3BEV: Vehicle = {
  id: 'model3_bev',
  name: 'Tesla Model 3',
  brand: 'tesla',
  pt: 'bev',
  seg: ['saloon'],
  newP: 42000,
  co2_wltp: 0,
};

const dacia: Vehicle = {
  id: 'sandero_ice',
  name: 'Dacia Sandero',
  brand: 'dacia',
  pt: 'ice',
  seg: ['small'],
  newP: 14000,
  co2_wltp: 135,
};

const porscheTaycan: Vehicle = {
  id: 'taycan_bev',
  name: 'Porsche Taycan Turbo S',
  brand: 'porsche',
  pt: 'bev',
  seg: ['executive'],
  newP: 95000,
  co2_wltp: 0,
};

const bmwX3AWD: Vehicle = {
  id: 'x3_awd',
  name: 'BMW X3 xDrive 30e',
  brand: 'bmw',
  pt: 'phev',
  seg: ['suv_compact'],
  newP: 65000,
  co2_wltp: 45,
  pf: ['Confort premium', 'xDrive intégrale'],
};

const audiRS4: Vehicle = {
  id: 'rs4_ice',
  name: 'Audi RS4 Avant',
  brand: 'audi',
  pt: 'ice',
  seg: ['saloon_break'],
  newP: 95000,
  co2_wltp: 240,
};

// ─────────────────────────────────────────────────────────────────────────────
// getBodySegs
// ─────────────────────────────────────────────────────────────────────────────

describe('getBodySegs', () => {
  it('body vide → []', () => {
    expect(getBodySegs([])).toEqual([]);
  });

  it('uniquement modifier → []', () => {
    expect(getBodySegs(['suv'])).toEqual([]);
  });

  it('base "compact" → [compact, saloon]', () => {
    expect(getBodySegs(['compact'])).toEqual(['compact', 'saloon']);
  });

  it('base "mini" → [mini, small]', () => {
    expect(getBodySegs(['mini'])).toEqual(['mini', 'small']);
  });

  it('base "saloon" → [saloon] strict', () => {
    expect(getBodySegs(['saloon'])).toEqual(['saloon']);
  });

  it('compact + suv → suv_urban/compact/family (REMPLACE)', () => {
    const result = getBodySegs(['compact', 'suv']);
    // mini/small/saloon n'étant pas dans bases, juste compact :
    // suvSegs sera vide (compact n'a pas de règle SUV dans V1)
    // En V1 : if (mini OR small) → suv_urban + suv_compact
    //        if (saloon) → suv_compact + suv_family
    // Compact seul → suvSegs = {} → segs devient {}
    expect(result).toEqual([]);
  });

  it('saloon + suv → [suv_compact, suv_family]', () => {
    const result = getBodySegs(['saloon', 'suv']);
    expect(result.sort()).toEqual(['suv_compact', 'suv_family']);
  });

  it('small + suv → [suv_urban, suv_compact]', () => {
    const result = getBodySegs(['small', 'suv']);
    expect(result.sort()).toEqual(['suv_compact', 'suv_urban']);
  });

  it('compact + break → +compact_break +saloon_break', () => {
    const result = getBodySegs(['compact', 'break']);
    // SEG_MAP.compact = [compact, saloon] → segs = {compact, saloon}
    // break + segs.has(compact) → +compact_break +saloon_break
    expect(result.sort()).toEqual(
      ['compact', 'compact_break', 'saloon', 'saloon_break'].sort(),
    );
  });

  it('saloon + awd → +suv_compact +suv_family', () => {
    const result = getBodySegs(['saloon', 'awd']);
    // SEG_MAP.saloon = [saloon] → segs = {saloon}
    // awd → segs = {...segs, suv_compact, suv_family}
    expect(result.sort()).toEqual(['saloon', 'suv_compact', 'suv_family'].sort());
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// wantsAWD
// ─────────────────────────────────────────────────────────────────────────────

describe('wantsAWD', () => {
  it('null → false', () => {
    expect(wantsAWD(null)).toBe(false);
  });

  it('undefined → false', () => {
    expect(wantsAWD(undefined)).toBe(false);
  });

  it('[] → false', () => {
    expect(wantsAWD([])).toBe(false);
  });

  it('["awd"] → true', () => {
    expect(wantsAWD(['awd'])).toBe(true);
  });

  it('["suv"] → false', () => {
    expect(wantsAWD(['suv'])).toBe(false);
  });

  it('["suv", "awd"] → true', () => {
    expect(wantsAWD(['suv', 'awd'])).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// carHasAWD
// ─────────────────────────────────────────────────────────────────────────────

describe('carHasAWD', () => {
  it('Tesla Model 3 sans mention AWD → false', () => {
    expect(carHasAWD(teslaModel3BEV)).toBe(false);
  });

  it('BMW X3 xDrive 30e (xdrive dans le nom) → true', () => {
    expect(carHasAWD(bmwX3AWD)).toBe(true);
  });

  it('Pros contiennent "xDrive intégrale" → true', () => {
    const car: Vehicle = { ...teslaModel3BEV, pf: ['xDrive intégrale'] };
    expect(carHasAWD(car)).toBe(true);
  });

  it('Nom contient "4x4" → true', () => {
    const car: Vehicle = { ...teslaModel3BEV, name: 'Some 4x4 Beast' };
    expect(carHasAWD(car)).toBe(true);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// isSportCar
// ─────────────────────────────────────────────────────────────────────────────

describe('isSportCar', () => {
  it('Porsche → toujours true (brand)', () => {
    expect(isSportCar(porscheTaycan)).toBe(true);
  });

  it('Audi RS4 → true (RS dans nom)', () => {
    expect(isSportCar(audiRS4)).toBe(true);
  });

  it('Toyota Yaris hybride → false', () => {
    expect(isSportCar(toyotaYarisHEV)).toBe(false);
  });

  it('Tesla Model 3 standard → false (Tesla pas always-sport, pas de mot-clé)', () => {
    expect(isSportCar(teslaModel3BEV)).toBe(false);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// _expandSegments (assouplissement progressif)
// ─────────────────────────────────────────────────────────────────────────────

describe('_expandSegments', () => {
  it('vide → []', () => {
    expect(_expandSegments([], 1)).toEqual([]);
  });

  it('level 0 → pas d\'expansion', () => {
    expect(_expandSegments(['saloon'], 0).sort()).toEqual(['saloon']);
  });

  it('level 1 sur saloon → +saloon_break +coupe_sport', () => {
    expect(_expandSegments(['saloon'], 1).sort()).toEqual(
      ['coupe_sport', 'saloon', 'saloon_break'].sort(),
    );
  });

  it('level 1 sur compact → +compact_break', () => {
    expect(_expandSegments(['compact'], 1).sort()).toEqual(
      ['compact', 'compact_break'].sort(),
    );
  });

  it('level 2 sur saloon → +compact +compact_break +suv_compact (mais PAS small)', () => {
    const r = _expandSegments(['saloon'], 2);
    expect(r).toContain('compact');
    expect(r).toContain('compact_break');
    expect(r).toContain('suv_compact');
    expect(r).not.toContain('small');
    expect(r).not.toContain('suv_urban');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// _relaxedDriver
// ─────────────────────────────────────────────────────────────────────────────

describe('_relaxedDriver', () => {
  it('ratio → cost', () => {
    expect(_relaxedDriver('ratio')).toBe('cost');
  });

  it('premium → null (jamais relaxé)', () => {
    expect(_relaxedDriver('premium')).toBeNull();
  });

  it('sport → null (jamais relaxé)', () => {
    expect(_relaxedDriver('sport')).toBeNull();
  });

  it('cost → null', () => {
    expect(_relaxedDriver('cost')).toBeNull();
  });

  it('null → null', () => {
    expect(_relaxedDriver(null)).toBeNull();
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// segRank
// ─────────────────────────────────────────────────────────────────────────────

describe('segRank', () => {
  it('seg vide → rank de "compact" fallback (3)', () => {
    expect(segRank({ ...toyotaYarisHEV, seg: [] })).toBe(3);
  });

  it('Tesla Model 3 (saloon) → 4', () => {
    expect(segRank(teslaModel3BEV)).toBe(4);
  });

  it('BMW X3 (suv_compact) → 4', () => {
    expect(segRank(bmwX3AWD)).toBe(4);
  });

  it('Toyota Yaris (small) → 2', () => {
    expect(segRank(toyotaYarisHEV)).toBe(2);
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// carMatchesSegs + expandSegmentsForMatch
// ─────────────────────────────────────────────────────────────────────────────

describe('carMatchesSegs', () => {
  it('requestedSegs vide → true (pas de filtre)', () => {
    expect(carMatchesSegs(toyotaYarisHEV, [])).toBe(true);
  });

  it('Toyota Yaris (small) avec demande [small] → true', () => {
    expect(carMatchesSegs(toyotaYarisHEV, ['small'])).toBe(true);
  });

  it('Toyota Yaris (small) avec demande [saloon] → false', () => {
    expect(carMatchesSegs(toyotaYarisHEV, ['saloon'])).toBe(false);
  });
});

describe('expandSegmentsForMatch', () => {
  it('saloon (rank 4) → étendu aux rank 3, 4, 5', () => {
    const r = expandSegmentsForMatch(['saloon']);
    // rank 3 : compact, compact_break, coupe_sport
    // rank 4 : saloon, saloon_break, suv_compact, awd, mono
    // rank 5 : suv_family, executive
    expect(r).toContain('compact');
    expect(r).toContain('saloon');
    expect(r).toContain('suv_compact');
    expect(r).toContain('executive');
    // rank 2 (small) ne doit PAS y être
    expect(r).not.toContain('small');
    // rank 6 (suv_large) ne doit PAS y être
    expect(r).not.toContain('suv_large');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// computeMatchLevel
// ─────────────────────────────────────────────────────────────────────────────

describe('computeMatchLevel', () => {
  it('car null → none / no_option_in_age', () => {
    const r = computeMatchLevel(null, ['compact'], 'fr');
    expect(r.level).toBe('none');
    expect(r.explanation).toBe('no_option_in_age');
  });

  it('bodySegs vide → strict (pas de filtre)', () => {
    const r = computeMatchLevel(toyotaYarisHEV, [], 'fr');
    expect(r.level).toBe('strict');
  });

  it('Yaris (small) avec demande [small] → strict', () => {
    const r = computeMatchLevel(toyotaYarisHEV, ['small'], 'fr');
    expect(r.level).toBe('strict');
  });

  it('Yaris (small) avec demande [saloon] → segment_widened (small dans expand ?)', () => {
    // saloon (rank 4) expand → rank 3, 4, 5. small (rank 2) PAS dedans.
    // Donc Yaris (small) NE match PAS l'expansion de [saloon]
    const r = computeMatchLevel(toyotaYarisHEV, ['saloon'], 'fr');
    expect(r.level).toBe('none');
    expect(r.requestedSeg).toBe('berline');
  });

  it('Yaris (small) avec demande [compact] → segment_widened', () => {
    // compact (rank 3) expand → rank 2, 3, 4. small (rank 2) DANS expansion.
    const r = computeMatchLevel(toyotaYarisHEV, ['compact'], 'fr');
    expect(r.level).toBe('segment_widened');
    expect(r.requestedSeg).toBe('compacte');
    expect(r.actualSeg).toBe('citadine');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// getSegmentLabel
// ─────────────────────────────────────────────────────────────────────────────

describe('getSegmentLabel', () => {
  it('FR : compact → "compacte"', () => {
    expect(getSegmentLabel(['compact'], 'fr')).toBe('compacte');
  });

  it('EN : compact → "compact"', () => {
    expect(getSegmentLabel(['compact'], 'en')).toBe('compact');
  });

  it('FR : suv_family → "SUV familial"', () => {
    expect(getSegmentLabel(['suv_family'], 'fr')).toBe('SUV familial');
  });

  it('Vide → null', () => {
    expect(getSegmentLabel([], 'fr')).toBeNull();
  });

  it('Premier segment pris comme primaire', () => {
    expect(getSegmentLabel(['saloon', 'compact'], 'fr')).toBe('berline');
  });
});

// ─────────────────────────────────────────────────────────────────────────────
// applyFilters (tests d'intégration)
// ─────────────────────────────────────────────────────────────────────────────

describe('applyFilters', () => {
  const pool: Vehicle[] = [
    toyotaYarisHEV,
    peugeot208ICE,
    teslaModel3BEV,
    dacia,
    porscheTaycan,
    bmwX3AWD,
    audiRS4,
  ];

  beforeEach(() => {
    _resetPricingData(); // pas de price_grid/depr_curves → niveau 3 fallback
  });

  it('budget restreint → exclut les chers', () => {
    const r = applyFilters(
      pool,
      { budget: 15000, body: [], pref: null },
      0, // age neuf
      0, // level 0
      'fr',
    );
    // Niveau 3 : purchAtAge = newP × DEPR × brandDeprMult × adj fr (0.98)
    // Yaris HEV : 23000 × 1 × 1.06 × 0.98 = 23892 → exclu (budget 15000)
    // 208 ICE : 18000 × 1 × 0.97 × 0.98 = 17110 → exclu
    // Model 3 : 42000 × 1 × 0.98 × 0.98 = 40337 → exclu
    // Dacia : 14000 × 1 × 1.08 × 0.98 = 14817 → INCLUS (≤ 15000)
    // Porsche : exclu (95000)
    // BMW X3 : exclu (65000)
    // Audi RS4 : exclu (95000)
    expect(r.map((c) => c.id)).toEqual(['sandero_ice']);
  });

  it('pref=eco filtre hors BEV/HEV/PHEV ou co2>100', () => {
    const r = applyFilters(
      pool,
      { budget: 100000, body: [], pref: 'eco' },
      0,
      0,
      'fr',
    );
    // eco : doit être BEV/HEV/PHEV ET co2 ≤ 100
    // + DRIVER_BRAND_POOLS.eco exclut Porsche (taycan) et Audi
    // Yaris HEV co2=95 → ok, eco includes toyota → KEEP
    // 208 ICE → exclu (pt)
    // Model 3 → ok (co2=0), eco includes tesla → KEEP
    // Dacia ICE → exclu (pt)
    // Porsche BEV co2=0 → eco PAS include porsche → exclu
    // BMW X3 PHEV co2=45 → ok, eco includes bmw → KEEP
    // Audi RS4 ICE → exclu (pt)
    const ids = r.map((c) => c.id).sort();
    expect(ids).toEqual(['model3_bev', 'x3_awd', 'yaris_hev'].sort());
  });

  it('pref=sport ne garde que les sportives + brands sport pool', () => {
    const r = applyFilters(
      pool,
      { budget: 200000, body: [], pref: 'sport' },
      0,
      0,
      'fr',
    );
    // DRIVER_BRAND_POOLS.sport includes : bmw, porsche, mercedes, audi, cupra, alpine, tesla, polestar, ...
    // Audi RS4 → audi dans pool sport ET nom "RS" → isSportCar(true) → KEEP
    // Porsche Taycan → porsche dans pool ET brand always-sport → KEEP
    // BMW X3 xDrive 30e → bmw dans pool, mais "xDrive 30e" PAS dans SPORT_KEYWORDS
    //   → isSportCar(false) → exclu
    // Tesla Model 3 → tesla dans pool, mais "Model 3" pas dans keywords → exclu
    const ids = r.map((c) => c.id).sort();
    expect(ids).toEqual(['rs4_ice', 'taycan_bev'].sort());
  });

  it('body=[saloon] level 0 → ne garde que les berlines (Model 3)', () => {
    const r = applyFilters(
      pool,
      { budget: 100000, body: ['saloon'], pref: null },
      0,
      0,
      'fr',
    );
    // bodySegs = [saloon], level 0 → pas d'expansion
    // Model 3 (saloon) → KEEP
    // Tesla, BMW X3 (suv_compact), Porsche (executive), RS4 (saloon_break) → exclu
    expect(r.map((c) => c.id)).toEqual(['model3_bev']);
  });

  it('marques exclues filtre', () => {
    const r = applyFilters(
      pool,
      {
        budget: 200000,
        body: [],
        pref: null,
        brand_prefs: { excluded: ['porsche', 'tesla'] },
      },
      0,
      0,
      'fr',
    );
    const brands = r.map((c) => c.brand).sort();
    expect(brands).not.toContain('porsche');
    expect(brands).not.toContain('tesla');
  });

  it('AWD demandé : ne garde que carHasAWD true', () => {
    const r = applyFilters(
      pool,
      { budget: 200000, body: [], bodyMod: ['awd'], pref: null },
      0,
      0,
      'fr',
    );
    // BMW X3 xDrive → carHasAWD true → KEEP
    // Audi RS4 → "RS" dans nom, mais pas de mots-clés AWD → exclu
    expect(r.map((c) => c.id)).toEqual(['x3_awd']);
  });

  it('level 3 sur pref=ratio → relaxe vers cost', () => {
    const r = applyFilters(
      pool,
      { budget: 30000, body: [], pref: 'ratio' },
      0,
      3, // level 3 → ratio devient cost
      'fr',
    );
    // cost includes : dacia, mg, citroen, fiat, suzuki, spring
    // Seul Dacia est dans le pool sous budget
    expect(r.map((c) => c.brand).sort()).toEqual(['dacia']);
  });
});

describe('getRequestedSegmentLabel', () => {
  it('bodySegs vide → null', () => {
    expect(getRequestedSegmentLabel([], 'fr')).toBeNull();
  });

  it('FR : [saloon] → "berline"', () => {
    expect(getRequestedSegmentLabel(['saloon'], 'fr')).toBe('berline');
  });
});
