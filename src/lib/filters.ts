/**
 * Filtrage des candidats avec assouplissement progressif (D-33).
 *
 * Portage de `_applyFilters_v53` depuis v64.0.4 ligne 20931.
 *
 * Cette fonction filtre un pool de véhicules selon :
 *   - Budget utilisateur (purchAtAge - incForCar ≤ budget)
 *   - Fenêtre d'âge × genYear (cohérence v64.0.2)
 *   - Segments demandés (avec expansion selon `level`)
 *   - AWD demandé (`wantsAWD`)
 *   - Driver-as-filter (pref + DRIVER_BRAND_POOLS)
 *   - Pref spéciaux : `eco` (BEV/HEV/PHEV co2≤100), `sport` (isSportCar)
 *   - Marques exclues (brand_prefs.excluded)
 *
 * Le paramètre `level` ∈ [0..3] contrôle l'assouplissement :
 *   - level 0 : strict (segments tels quels, driver utilisateur)
 *   - level 1 : segments étendus en variantes morpho (break, coupe...)
 *   - level 2 : segments étendus d'UN cran (saloon → compact, compact → suv_urban)
 *   - level 3 : driver relaxé (`ratio` → `cost`)
 *
 * Refactor V2 : tous les paramètres explicites, plus de globale.
 *
 * Note : `carHasAWD_v609` (qui prioritise le catalog) sera ajouté en Palier 3c.
 * Cette version utilise `carHasAWD` direct sur car.seg/name/pros.
 */

import type { Vehicle, BodySelection, Pref, Segment, Country } from './types';
import { purchAtAge } from './pricing';
import { incForCar } from './incentives';
import {
  getBodySegs,
  carHasAWD,
  wantsAWD,
  isSportCar,
  _expandSegments,
  _relaxedDriver,
} from './body-segments';
import { carMatchesSegs } from './match-level';
import { DRIVER_BRAND_POOLS } from './constants/driver-pools';

/**
 * Référence d'état utilisateur passée à `_applyFilters` (sous-ensemble de UserState).
 * Plus complet que TcoInputs car le filtrage utilise plus de champs.
 */
export interface FilterStateRef {
  budget: number;
  body: readonly BodySelection[];
  bodyMod?: readonly string[] | null;
  pref: Pref | null;
  /** Préférences de marques (favoris/exclus). */
  brand_prefs?: {
    favorites?: readonly string[];
    excluded?: readonly string[];
  } | null;
}

/**
 * Fenêtre d'âge × genYear pour cohérence "v64.0.2".
 *
 * Pour chaque catégorie d'âge demandée par l'utilisateur, définit la plage
 * d'âges réels acceptables. Un véhicule dont la génération a été lancée après
 * `winProdMax = CURRENT_YEAR - minAge` est exclu (sinon impossible d'exister
 * à cet âge).
 *
 * Source : v64.0.4 ligne 20937 (commentaire "v64.0.2").
 */
const AGE_WINDOWS: Record<number, { minAge: number; maxAge: number }> = {
  2: { minAge: 1, maxAge: 2 },
  5: { minAge: 3, maxAge: 5 },
  7: { minAge: 6, maxAge: 8 },
  10: { minAge: 8, maxAge: 12 },
};

const CURRENT_YEAR = 2026;

/** Regex pour extraire les années de production depuis le nom V1 "Modèle (YYYY-YYYY)". */
const YEAR_RANGE_REGEX = /\((\d{4})-(\d{4})\)/;

/**
 * Vehicle étendu avec champs optionnels utilisés par le filtrage.
 */
interface VehicleFiltered extends Vehicle {
  /** Année de génération (utilisée par la fenêtre v64.0.2). */
  genYear?: number;
  /** Émissions CO2 WLTP (utilisées par pref=eco). */
  co2_wltp?: number;
}

/**
 * Filtre le pool de véhicules selon l'état utilisateur et le niveau d'assouplissement.
 *
 * @param allCars  Pool complet de véhicules à filtrer (catalogue).
 * @param stRef    Référence d'état utilisateur (budget, body, pref, etc.).
 * @param age      Catégorie d'âge cible (0, 2, 5, 7, 10).
 * @param level    Niveau d'assouplissement (0..3).
 * @param country  Pays utilisateur (pour purchAtAge).
 */
export function applyFilters(
  allCars: readonly VehicleFiltered[],
  stRef: FilterStateRef,
  age: number,
  level: number,
  country: Country,
): VehicleFiltered[] {
  let pool: VehicleFiltered[] = allCars.slice();

  // 1. Filtre budget : (purchAtAge - incForCar) ≤ budget
  pool = pool.filter((car) => {
    const purch = purchAtAge(car, age, country);
    const inc = incForCar(car, age);
    return purch - inc <= stRef.budget;
  });

  // 2. Fenêtre d'âge × genYear (cohérence v64.0.2)
  if (age > 0) {
    const win = AGE_WINDOWS[age];
    if (win) {
      const winProdMax = CURRENT_YEAR - win.minAge;
      pool = pool.filter((car) => {
        if (car.genYear && car.genYear > winProdMax) return false;
        const m = (car.name ?? '').match(YEAR_RANGE_REGEX);
        if (m && parseInt(m[2], 10) < CURRENT_YEAR - win.maxAge - 1) return false;
        return true;
      });
    }
  }

  // 3. Filtre segments (avec expansion selon level)
  const baseSegs: Segment[] = getBodySegs(stRef.body);
  if (baseSegs.length > 0) {
    const segs = _expandSegments(baseSegs, Math.min(level, 2));
    pool = pool.filter((car) => carMatchesSegs(car, segs));
  }

  // 4. Filtre AWD si demandé
  if (wantsAWD(stRef.bodyMod)) {
    pool = pool.filter((car) => carHasAWD(car));
  }

  // 5. Filtre driver-as-filter (avec relaxation au level 3)
  let activeDriver: Pref | null = stRef.pref;
  if (level === 3 && stRef.pref) {
    const relaxed = _relaxedDriver(stRef.pref);
    if (relaxed) activeDriver = relaxed;
  }

  if (activeDriver && activeDriver in DRIVER_BRAND_POOLS) {
    const allowedBrands = DRIVER_BRAND_POOLS[activeDriver];
    pool = pool.filter((car) =>
      allowedBrands.includes((car.brand ?? '').toLowerCase()),
    );
  }

  // 6. Filtres spéciaux selon pref
  if (stRef.pref === 'eco') {
    pool = pool.filter(
      (car) =>
        (['bev', 'hev', 'phev'] as const).includes(car.pt as 'bev' | 'hev' | 'phev') &&
        (car.co2_wltp == null || car.co2_wltp <= 100),
    );
  }

  if (stRef.pref === 'sport') {
    pool = pool.filter((car) => isSportCar(car));
  }

  // 7. Filtre marques exclues
  if (stRef.brand_prefs?.excluded && stRef.brand_prefs.excluded.length > 0) {
    const excl = new Set(
      stRef.brand_prefs.excluded.map((b) => String(b).toLowerCase()),
    );
    pool = pool.filter((car) => !excl.has((car.brand ?? '').toLowerCase()));
  }

  return pool;
}
