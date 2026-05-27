/**
 * Test runner Vitest — replay des 96 cas `calcTcoCases` baseline V1.
 *
 * Critère de bascule Palier 2 → 3 : **96/96 cas verts**.
 *
 * NOTE — La baseline a été snapshotée le 27 mai 2026 sur la prod V1 (v64.0.4)
 * avec `activeCountry = "ch"` (auto-détecté par timezone Suisse). Le runner V1
 * n'a jamais modifié `activeCountry` entre les cas malgré la présence d'un
 * champ `active_country` dans chaque input — ce champ est du folklore non
 * appliqué.
 *
 * Pour reproduire fidèlement le comportement V1, ce test :
 *   - Lit `metadata.snapshot.activeCountry` (= "ch")
 *   - Force `country: "ch"` pour les 96 cas (ignore `inputs.active_country`)
 *   - Force `urban: null` (V1 voit `st_urban: true/false` mais teste `=== "city"`)
 *   - Force `dept: null` et `driverAge: null` (jamais positionnés par le runner)
 *
 * Si la baseline est un jour re-snapshotée avec un runner amélioré qui
 * positionne réellement ces champs, cette logique de normalisation pourra
 * être supprimée.
 */

import { describe, it, expect } from 'vitest';
import baseline from '../fixtures/baseline_expected.json';
import { calcTco } from '../../src/lib/tco-engine';
import type { TcoInputs, Powertrain, TripsCategory, Charging, Country } from '../../src/lib/types';

/**
 * Tolérance pour les comparaisons en virgule flottante.
 * Les entiers (purchP, saleP, depr5, maint, rep) doivent matcher à l'unité près.
 * Les floats (yf, mo, risk) sont comparés à ±0.01.
 */
const FLOAT_TOLERANCE = 0.01;

interface BaselineCase {
  id: string;
  inputs: {
    pt: Powertrain;
    newP: number;
    brand: string;
    age: number;
    km: number;
    st_trips: TripsCategory;
    st_charging: Charging;
    st_urban: boolean;
    active_country: string;
  };
  output: {
    purchP: number;
    saleP: number;
    depr5: number;
    yf: number;
    maint: number;
    rep: number;
    mo: number;
    risk: number;
  };
}

interface BaselineFile {
  calcTcoCases: BaselineCase[];
  metadata: {
    snapshot: {
      activeCountry: string;
    };
  };
}

const typedBaseline = baseline as unknown as BaselineFile;
const activeCountryAtSnapshot = typedBaseline.metadata.snapshot.activeCountry as Country;

/**
 * Convertit un cas baseline en TcoInputs en reproduisant le comportement
 * effectif du runner V1 (cf. en-tête de fichier).
 */
function normalizeInputs(c: BaselineCase): TcoInputs {
  return {
    pt: c.inputs.pt,
    newP: c.inputs.newP,
    brand: c.inputs.brand,
    age: c.inputs.age,
    km: c.inputs.km,
    trips: c.inputs.st_trips,
    charging: c.inputs.st_charging,
    urban: null,
    dept: null,
    country: activeCountryAtSnapshot,
    driverAge: null,
  };
}

describe('TCO Engine — baseline V1 replay (96 cas calcTcoCases)', () => {
  it(`baseline a été snapshotée avec activeCountry="${activeCountryAtSnapshot}"`, () => {
    expect(activeCountryAtSnapshot).toBe('ch');
  });

  describe('96 cas baseline', () => {
    for (const baseCase of typedBaseline.calcTcoCases) {
      it(baseCase.id, () => {
        const result = calcTco(normalizeInputs(baseCase));
        // Entiers : strict
        expect(result.purchP).toBe(baseCase.output.purchP);
        expect(result.saleP).toBe(baseCase.output.saleP);
        expect(result.depr5).toBe(baseCase.output.depr5);
        expect(result.maint).toBe(baseCase.output.maint);
        expect(result.rep).toBe(baseCase.output.rep);
        // Floats : tolérance 0.01
        expect(result.yf).toBeCloseTo(baseCase.output.yf, 2);
        expect(result.mo).toBeCloseTo(baseCase.output.mo, 2);
        expect(result.risk).toBeCloseTo(baseCase.output.risk, 2);
      });
    }
  });
});
