/**
 * Modificateurs par marque pour la dépréciation et le tier marché.
 *
 * Source : v64.0.4 lignes ~10760 et ~11933.
 *
 * - `BRAND_DEPR_MULT` : modulateur de courbe DEPR par marque
 *   (toyota tient mieux sa valeur → ×1.06, renault moins bien → ×0.97).
 *   Utilisé par `purchAtAgeStatic` (fallback de la cascade pricing).
 *
 * - `BRAND_TIER_MAP` : classification commerciale (luxury/premium/mainstream/budget)
 *   utilisée pour indexer `depr_curves.json` au niveau 2 de la cascade.
 */

/** Tier marché d'une marque (pour depr_curves.json). */
export type BrandTier = 'luxury' | 'premium' | 'mainstream' | 'budget';

/**
 * Multiplicateur de dépréciation par marque.
 * Fallback 1 si la marque n'est pas listée (`brandDeprMult`).
 *
 * Source : v64.0.4 ligne ~10760 (33 marques).
 */
export const BRAND_DEPR_MULT: Record<string, number> = {
  alfa: 0.96,
  audi: 1.02,
  bmw: 1.02,
  byd: 0.95,
  citroen: 0.97,
  cupra: 0.99,
  dacia: 1.08,
  ds: 0.95,
  fiat: 0.96,
  ford: 0.97,
  honda: 1.05,
  hyundai: 1.01,
  jeep: 0.98,
  kia: 1.02,
  lexus: 1.07,
  mazda: 1.04,
  mercedes: 1.02,
  mg: 0.93,
  mini: 1.04,
  mitsubishi: 0.99,
  nissan: 0.99,
  opel: 0.96,
  peugeot: 0.97,
  porsche: 1.1,
  renault: 0.97,
  seat: 0.98,
  skoda: 0.99,
  subaru: 1.03,
  suzuki: 1.05,
  tesla: 0.98,
  toyota: 1.06,
  volvo: 1.0,
  vw: 1.0,
} as const;

/**
 * Mapping marque → tier marché (pour depr_curves.json).
 * Fallback "mainstream" si marque non listée (`deprRatioBySegment`).
 *
 * Source : v64.0.4 lignes ~11933-11971 (35 marques).
 */
export const BRAND_TIER_MAP: Record<string, BrandTier> = {
  porsche: 'luxury',
  jaguar: 'luxury',
  tesla: 'luxury',
  genesis: 'luxury',
  bmw: 'premium',
  audi: 'premium',
  mercedes: 'premium',
  volvo: 'premium',
  lexus: 'premium',
  mini: 'premium',
  ds: 'premium',
  alfa: 'premium',
  cupra: 'premium',
  polestar: 'premium',
  vw: 'mainstream',
  ford: 'mainstream',
  opel: 'mainstream',
  peugeot: 'mainstream',
  renault: 'mainstream',
  citroen: 'mainstream',
  toyota: 'mainstream',
  honda: 'mainstream',
  mazda: 'mainstream',
  nissan: 'mainstream',
  hyundai: 'mainstream',
  kia: 'mainstream',
  skoda: 'mainstream',
  seat: 'mainstream',
  fiat: 'mainstream',
  subaru: 'mainstream',
  mitsubishi: 'mainstream',
  jeep: 'mainstream',
  suzuki: 'mainstream',
  dacia: 'budget',
  mg: 'budget',
  byd: 'budget',
} as const;
