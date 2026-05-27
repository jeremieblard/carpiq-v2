/**
 * Calcul d'assurance auto V1 (calcInsurance).
 *
 * Source : v64.0.4 ligne 8924.
 *
 * Formule :
 *   prime = base × ageMod × regionMod × brandMod × ptMod × urbanMod
 *           × parkingMod × coverMod × countryMod
 *
 * Avec arrondi à la dizaine de €.
 *
 * Refactor V2 : tous les `st.*` et `activeCountry` passés en params explicites.
 */

import type {
  Vehicle,
  Country,
  AgeRange,
  Urban,
  DeptCode,
  Charging,
} from './types';
import {
  INS_BASE_SEGMENT,
  AGE_INS,
  BRAND_INS,
  PT_INS,
  REGION_INS_FR,
  REGION_INS_CH,
  REGION_INS_DE,
  COUNTRY_INS,
} from './constants/insurance-data';

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Détermine le segment d'assurance d'un véhicule.
 *
 * Source : v64.0.4 ligne 8730.
 *
 * Cascade de priorités :
 *   premium/executive → "executive"
 *   sport/coupe_sport → "sport"
 *   suv_large/suv_premium → "suv_large"
 *   suv/suv_family → "suv"
 *   suv_urban/crossover → "suv_urban"
 *   saloon/family → "saloon"
 *   mini/city → "mini"
 *   sinon → "compact"
 */
export function getInsSegment(car: Vehicle): string {
  const segs = (car.seg ?? []) as string[];
  if (segs.includes('premium') || segs.includes('executive')) return 'executive';
  if (segs[0] === 'sport' || segs[0] === 'coupe_sport') return 'sport';
  if (segs.includes('suv_large') || segs.includes('suv_premium')) return 'suv_large';
  if (segs.includes('suv') || segs.includes('suv_family')) return 'suv';
  if (segs.includes('suv_urban') || segs.includes('crossover')) return 'suv_urban';
  if (segs.includes('saloon') || segs.includes('family')) return 'saloon';
  if (segs.includes('mini') || segs.includes('city')) return 'mini';
  return 'compact';
}

/**
 * Modulateur de couverture selon âge du véhicule et prix d'achat.
 *
 * Source : v64.0.4 ligne 8911.
 *
 * Sigmoid sur prix (centré à 17500€), + bonus si véhicule récent (≤1 an),
 * pénalité si vieux (>6 ans).
 */
export function getCoverMod(vehicleAge: number, purchasePrice: number): number {
  const age = vehicleAge ?? 2;
  const price = purchasePrice ?? 20000;
  const sigmoidComponent = 0.55 + 0.45 / (1 + Math.exp(-(price - 17500) / 5000));
  const ageComponent =
    age <= 1 ? 1.05 : age <= 3 ? 1.0 : age <= 6 ? 0.95 : 0.92;
  return sigmoidComponent * ageComponent;
}

/**
 * Modulateur de stationnement selon `st.charging`.
 *
 * Source : v64.0.4 ligne 8916.
 *
 * Refactor V2 : prend `charging` en param (V1 lisait `st.charging` globale).
 *   - 'socket' (charge à domicile) → 0.91 (garage privé)
 *   - 'street' (rue) → 1.05
 *   - sinon → 1.0
 *
 * ⚠ Anomalie : V1 utilise `st.charging` comme proxy de parking, ce qui n'est
 * pas sémantiquement correct (charging ≠ parking). Conservé fidèlement.
 */
export function getParkingMod(charging: Charging | null | undefined): number {
  if (!charging) return 1.0;
  if (charging === 'socket') return 0.91;
  if ((charging as string) === 'street') return 1.05;
  return 1.0;
}

/**
 * Modulateur régional selon dept/canton/land et pays.
 *
 * Source : v64.0.4 ligne 8920.
 *
 * Si pas de dept → 1.0
 * Sinon : lookup dans REGION_INS_FR / REGION_INS_CH / REGION_INS_DE selon pays.
 * Pas de mapping pour les autres pays (BE, NL, IT, ES, PT, LU) → 1.0.
 */
export function getRegionMod(
  dept: DeptCode,
  country: Country,
): number {
  if (!dept) return 1.0;
  if (country === 'ch') return REGION_INS_CH[dept] ?? 1.0;
  if (country === 'de') return REGION_INS_DE[dept] ?? 1.0;
  // fr par défaut (REGION_INS_FR contient les départements FR)
  return REGION_INS_FR[dept] ?? 1.0;
}

// ─────────────────────────────────────────────────────────────────────────────
// Fonction principale
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calcule la prime d'assurance annuelle pour un véhicule.
 *
 * Source : v64.0.4 ligne 8924.
 *
 * @param car            Véhicule à assurer
 * @param purchasePrice  Prix d'achat (€) au moment du snapshot
 * @param vehicleAge     Âge du véhicule (années, défaut 2)
 * @param driverAge      Âge du conducteur (AgeRange du Palier 2)
 * @param dept           Code dept FR / canton CH / land DE (selon country)
 * @param urban          'city' / 'rural' / null
 * @param charging       Possibilité de recharge (utilisé comme proxy parking)
 * @param country        Pays utilisateur
 *
 * @returns Prime annuelle en € (arrondie à la dizaine).
 */
export function calcInsurance(
  car: Vehicle,
  purchasePrice: number,
  vehicleAge: number,
  driverAge: AgeRange,
  dept: DeptCode,
  urban: Urban,
  charging: Charging | null | undefined,
  country: Country,
): number {
  const age = vehicleAge ?? 2;
  const seg = getInsSegment(car);
  const base = INS_BASE_SEGMENT[seg] ?? 820;

  // AGE_INS : AgeRange peut être null, fallback 1.0
  const ageMod = (driverAge && AGE_INS[driverAge]) ?? 1.0;

  const regionMod = getRegionMod(dept, country);

  const brandKey = (car.brand ?? '').toLowerCase();
  const brandMod = BRAND_INS[brandKey] ?? 1.0;

  const ptMod = PT_INS[car.pt] ?? 1.0;

  // urbanMod : "city" → 1.1, "rural" → 0.9, null → 1.0
  const urbanMod = urban === 'city' ? 1.1 : urban === 'rural' ? 0.9 : 1.0;

  const coverMod = getCoverMod(age, purchasePrice);
  const parkingMod = getParkingMod(charging);
  const countryMod = COUNTRY_INS[country] ?? 1.0;

  const raw =
    base *
    ageMod *
    regionMod *
    brandMod *
    ptMod *
    urbanMod *
    parkingMod *
    coverMod *
    countryMod;

  // Arrondi à la dizaine de €
  return 10 * Math.round(raw / 10);
}
