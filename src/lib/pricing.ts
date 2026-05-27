/**
 * Cascade pricing — détermination du prix d'achat d'un véhicule selon âge et pays.
 *
 * Portage strict de la cascade V1 (`carpiq-layer1-v64_0_4.html`) :
 *
 *   1. `predictPrice()` via `price_grid.json` (AS24, 221 modèles)
 *      ↓ si null
 *   2. `deprRatioBySegment()` via `depr_curves.json` (tier × pt × country × age × km)
 *      ↓ si null
 *   3. `purchAtAgeStatic()` via `DEPR[pt]` × `brandDeprMult` (fallback FALLBACK)
 *
 * Chaque couche multiplicative par `_countryPriceAdj(country)` SAUF `predictPrice`
 * (qui contient déjà l'ajustement pays via les données AS24).
 *
 * Refactor V2 : `country` et `kmOverride` passés explicitement, plus de lecture
 * de `activeCountry` globale.
 */

import type { Country, Powertrain, Vehicle } from './types';
import { DEPR } from './constants/depreciation';
import { BRAND_DEPR_MULT, BRAND_TIER_MAP } from './constants/brand-data';
import { AS24_MODEL_BASE } from './constants/as24-model-base';
import {
  getPriceGridData,
  getDeprCurvesData,
  priceGridReady,
} from './data-loaders';
import type { PriceGridData, DeprCurvesData } from './data-loaders';

// ─────────────────────────────────────────────────────────────────────────────
// Constantes des grilles d'interpolation
// ─────────────────────────────────────────────────────────────────────────────

/** Ages dans `price_grid.json`. Source v64.0.4 ligne 5811. */
const PRICE_GRID_AGES: readonly number[] = [
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15,
];

/** Km dans `price_grid.json`. Source v64.0.4 ligne 5811. */
const PRICE_GRID_KMS: readonly number[] = [
  0, 10000, 25000, 50000, 75000, 100000, 150000, 200000,
];

/** Ages dans `depr_curves.json` (clamp 0..5). */
const DEPR_CURVES_AGES: readonly number[] = [0, 1, 2, 3, 4, 5];

/** Km dans `depr_curves.json`. */
const DEPR_CURVES_KMS: readonly number[] = [
  0, 10000, 25000, 50000, 75000, 100000, 150000, 200000,
];

// ─────────────────────────────────────────────────────────────────────────────
// Helpers d'interpolation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Interpolation linéaire entre deux points.
 * Si x1 === x2 (point unique), retourne y1.
 */
function _lerp(x: number, x1: number, x2: number, y1: number, y2: number): number {
  return x1 === x2 ? y1 : y1 + ((x - x1) * (y2 - y1)) / (x2 - x1);
}

/**
 * Retourne les deux bornes [b1, b2] de `bins` qui encadrent `q`.
 * Si q est hors bornes, retourne [min, min] ou [max, max] (extrapolation = clamp).
 */
function _bracket(bins: readonly number[], q: number): [number, number] {
  if (q <= bins[0]) return [bins[0], bins[0]];
  if (q >= bins[bins.length - 1]) return [bins[bins.length - 1], bins[bins.length - 1]];
  for (let i = 0; i < bins.length - 1; i++) {
    if (q >= bins[i] && q <= bins[i + 1]) {
      return [bins[i], bins[i + 1]];
    }
  }
  return [bins[0], bins[0]];
}

// ─────────────────────────────────────────────────────────────────────────────
// Modificateurs et helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Ajustement pays appliqué à `car.newP` (fallback et niveau 2 de la cascade).
 *
 * Source : v64.0.4 ligne 12024.
 *
 *   - DE : 1.00 (référence)
 *   - FR : 0.98
 *   - IT : 0.96
 *   - ES : 0.93
 *   - BE : 0.99
 *   - NL : 1.06 (taxe BPM sur véhicules neufs)
 *   - CH : 1.15 (premium pricing CHF, ~15% au-dessus EU)
 *
 * ⚠ V1 ne couvre que 7 pays. PT et LU tombent sur `|| 1.0` = pas d'ajustement.
 */
function _countryPriceAdj(country: Country | null | undefined): number {
  if (!country) return 1.0;
  const m: Record<string, number> = {
    de: 1.0,
    fr: 0.98,
    it: 0.96,
    es: 0.93,
    be: 0.99,
    nl: 1.06,
    ch: 1.15,
  };
  return m[country.toLowerCase()] ?? 1.0;
}

/**
 * Multiplicateur de dépréciation par marque (fallback 1 si inconnue).
 *
 * Utilisé uniquement par `purchAtAgeStatic` (niveau 3 de la cascade).
 * Ne s'applique pas aux niveaux 1 et 2 (qui ont leur propre modulation).
 */
export function brandDeprMult(brand: string): number {
  return BRAND_DEPR_MULT[brand] ?? 1;
}

/**
 * Km canonique pour un âge donné (utilisé quand `kmOverride` n'est pas fourni).
 *
 * Source : v64.0.4 lignes 12044-12048.
 *
 * Reflète l'usage moyen d'un véhicule selon son âge :
 *   - 1 an : 15 000 km
 *   - 2 ans : 25 000 km
 *   - 5 ans : 75 000 km
 *   - 10 ans : 150 000 km
 */
function _canonKmForAge(age: number): number {
  if (age <= 0) return 0;
  const map: Record<number, number> = {
    1: 15000,
    2: 25000,
    3: 45000,
    4: 60000,
    5: 75000,
    6: 90000,
    7: 110000,
    8: 125000,
    9: 138000,
    10: 150000,
  };
  return map[age] ?? Math.min(age * 15000, 200000);
}

// ─────────────────────────────────────────────────────────────────────────────
// Niveau 3 : fallback DEPR statique
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Prix d'achat statique fallback : `newP × DEPR[pt][age] × brandDeprMult(brand)`.
 *
 * Source : v64.0.4 ligne 11872.
 *
 * Utilisé en dernier recours si ni `price_grid.json` ni `depr_curves.json`
 * n'ont pu fournir un prix. Ne contient PAS d'ajustement pays (l'appelant doit
 * le multiplier par `_countryPriceAdj(country)` séparément si nécessaire).
 */
export function purchAtAgeStatic(car: Vehicle, age: number): number {
  const curve = DEPR[car.pt] ?? DEPR.ice;
  const idx = Math.min(age, 10);
  return Math.round(car.newP * curve[idx] * brandDeprMult(car.brand));
}

// ─────────────────────────────────────────────────────────────────────────────
// Niveau 2 : ratio de dépréciation par segment (depr_curves.json)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Ratio de dépréciation interpolé depuis `depr_curves.json`.
 *
 * Source : v64.0.4 ligne 11972.
 *
 * Indexation : tier × powertrain × country × age × km.
 * Si le pays n'est pas dans la grille, fallback sur la clé `_any`.
 * Interpolation bilinéaire sur (age, km) dans la grille [0..5] × [0..200k].
 *
 * @returns Le ratio (0..1) à appliquer à `car.newP`, ou null si données indisponibles.
 */
export function deprRatioBySegment(
  car: Vehicle,
  age: number,
  kmTotal: number,
  country: Country,
): number | null {
  const data: DeprCurvesData | null = getDeprCurvesData();
  if (!data) return null;
  if (age === 0) return 1;

  const tier = BRAND_TIER_MAP[car.brand] ?? 'mainstream';
  const pt = (car.pt ?? 'ice').toLowerCase();

  const tierData = data[tier];
  if (!tierData) return null;

  const ptData = tierData[pt];
  if (!ptData) return null;

  const countryData = ptData[country] ?? ptData['_any'];
  if (!countryData) return null;

  const clampedAge = Math.max(0, Math.min(age, 5));
  const clampedKm = Math.max(0, Math.min(kmTotal, 200000));

  const [a1, a2] = _bracket(DEPR_CURVES_AGES, clampedAge);
  const [k1, k2] = _bracket(DEPR_CURVES_KMS, clampedKm);

  const d1 = countryData[String(a1)];
  const d2 = countryData[String(a2)];
  if (!d1 || !d2) return null;

  const v11 = d1[String(k1)];
  const v12 = d1[String(k2)];
  const v21 = d2[String(k1)];
  const v22 = d2[String(k2)];

  if (v11 == null || v12 == null || v21 == null || v22 == null) return null;

  const r1 = _lerp(clampedKm, k1, k2, v11, v12);
  const r2 = _lerp(clampedKm, k1, k2, v21, v22);
  return _lerp(clampedAge, a1, a2, r1, r2);
}

// ─────────────────────────────────────────────────────────────────────────────
// Niveau 1 : prix absolu prédit (price_grid.json)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Prix absolu prédit interpolé depuis `price_grid.json`.
 *
 * Source : v64.0.4 ligne 6377.
 *
 * Indexation : modelId × powertrain × country × age × km.
 * Interpolation bilinéaire sur (age, km) dans la grille [0..15] × [0..200k].
 *
 * @param modelId  Identifiant modèle (format "brand/slug", ex: "alfa/giulia").
 * @returns Le prix prédit en €/CHF (entier arrondi), ou null si données indisponibles.
 */
export function predictPrice(
  modelId: string,
  pt: Powertrain,
  country: Country,
  age: number,
  km: number,
): number | null {
  const data: PriceGridData | null = getPriceGridData();
  if (!data) return null;

  const m = data[modelId];
  if (!m) return null;
  const p = m[pt];
  if (!p) return null;
  const c = p[country];
  if (!c) return null;

  const clampedAge = Math.max(0, Math.min(age || 0, 15));
  const clampedKm = Math.max(0, Math.min(km || 0, 200000));

  const ageB = _bracket(PRICE_GRID_AGES, clampedAge);
  const kmB = _bracket(PRICE_GRID_KMS, clampedKm);

  const a1 = c[String(ageB[0])];
  const a2 = c[String(ageB[1])];
  if (!a1 || !a2) return null;

  const v11 = a1[String(kmB[0])];
  const v12 = a1[String(kmB[1])];
  const v21 = a2[String(kmB[0])];
  const v22 = a2[String(kmB[1])];

  if (v11 == null || v12 == null || v21 == null || v22 == null) return null;

  const r1 = _lerp(clampedKm, kmB[0], kmB[1], v11, v12);
  const r2 = _lerp(clampedKm, kmB[0], kmB[1], v21, v22);
  return Math.round(_lerp(clampedAge, ageB[0], ageB[1], r1, r2));
}

// ─────────────────────────────────────────────────────────────────────────────
// Cascade : purchAtAge (chef d'orchestre)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Vehicle étendu avec champs optionnels pour la cascade pricing.
 * Reflète les champs internes V1 (`_garageGridId`) qui peuvent être ajoutés
 * dynamiquement par le garage.
 */
interface VehicleForPricing extends Vehicle {
  /** Override du grid ID (utilisé par le garage). */
  _garageGridId?: string;
}

/**
 * Prix d'achat estimé d'un véhicule à un âge donné, en intégrant la cascade
 * à 3 niveaux (price_grid → depr_curves → DEPR statique).
 *
 * Source : v64.0.4 ligne 12038.
 *
 * Refactor V2 : `country` passé explicitement (V1 lisait `activeCountry`).
 *
 * @param car         Véhicule du catalogue.
 * @param age         Âge cible en années (0 = neuf).
 * @param country     Pays utilisateur (impact prix réel et taxes).
 * @param kmOverride  Km override (sinon `_canonKmForAge(age)`).
 *
 * @remarks
 * Sanity cap v62.8 : si `predictPrice(age)` ≥ `predictPrice(0)`, force une
 * dépréciation minimale de 8 %/an pour corriger les inversions du price_grid
 * dues aux biais d'observation AS24.
 */
export function purchAtAge(
  car: VehicleForPricing,
  age: number,
  country: Country,
  kmOverride?: number,
): number {
  const adj = _countryPriceAdj(country);
  const kmTotal =
    typeof kmOverride === 'number' && kmOverride > 0
      ? kmOverride
      : _canonKmForAge(age);

  // Niveau 1 : predictPrice (AS24-based)
  if (priceGridReady()) {
    let gridId: string | null;
    if (car._garageGridId) {
      gridId = car._garageGridId;
    } else {
      const key = `${car.brand ?? ''}:${car.id ?? ''}`;
      const slug = AS24_MODEL_BASE[key] ?? car.id;
      gridId = `${car.brand ?? ''}/${slug}`;
    }

    if (gridId) {
      const ptLower = (car.pt ?? 'ice').toLowerCase() as Powertrain;
      const predicted = predictPrice(gridId, ptLower, country, age, kmTotal);

      if (predicted && predicted > 0) {
        // Sanity cap v62.8 : occasion ne peut PAS être plus chère que neuf prédit
        if (age > 0) {
          const newPredicted = predictPrice(gridId, ptLower, country, 0, 0);
          if (newPredicted && newPredicted > 0 && predicted >= newPredicted) {
            return Math.round(newPredicted * Math.pow(0.92, age));
          }
        }
        return predicted;
      }
    }
  }

  // Niveau 2 : depr_curves avec adjustment pays
  if (age === 0) {
    return Math.round(car.newP * adj);
  }

  if (getDeprCurvesData()) {
    const ratio = deprRatioBySegment(car, age, kmTotal, country);
    if (ratio && ratio > 0) {
      return Math.round(car.newP * ratio * adj);
    }
  }

  // Niveau 3 : DEPR statique avec adjustment pays
  return Math.round(purchAtAgeStatic(car, age) * adj);
}
