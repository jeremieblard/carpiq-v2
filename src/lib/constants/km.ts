/**
 * Mapping catégorie km utilisateur → km annuels réels.
 *
 * Source : v64.0.4 ligne 11239.
 *
 * Utilisé par `getKm` (scoring.ts) et par les calculs TCO en aval.
 */

import type { KmCategory } from '../types';

/**
 * Conversion KmCategory → km annuels réels.
 *
 *   u10 (under 10k) → 8 000 km
 *   m20 (mid 20k) → 15 000 km
 *   m35 (mid 35k) → 27 000 km
 *   o35 (over 35k) → 42 000 km
 */
export const KMM: Record<KmCategory, number> = {
  u10: 8000,
  m20: 15000,
  m35: 27000,
  o35: 42000,
} as const;
