/**
 * Constantes de consommation et de coûts du moteur TCO
 * =====================================================
 *
 * Source : extraction directe des constantes V1 (27 mai 2026, https://carpiq.eu).
 * Reproduit exactement les valeurs production utilisées par calcTCO et fuelCost.
 *
 * Constantes incluses :
 * - CONS : consommations par type de trajet × powertrain
 * - WLTP : multiplicateurs de correction WLTP (norme officielle vs réel)
 * - KMM : mapping clé catégorie → km annuels réels
 * - BPROB : probabilités de panne par powertrain × âge
 * - MAINT_MULT : multiplicateur d'entretien selon âge
 */

import type { Powertrain, TripsCategory, KmCategory, ConsPowertrain } from '../types';

// ============================================================
// CONS : consommations par type de trajet
// ============================================================

/**
 * Consommation moyenne par 100 km, indexée par type de trajet et powertrain.
 *
 * Unités :
 * - ICE, HEV, DIE : L/100km
 * - BEV : kWh/100km
 * - PHEV est séparé en deux composantes :
 *   - pon (PHEV onboard) = kWh/100km en mode électrique
 *   - poff (PHEV offboard) = L/100km en mode thermique
 *
 * Note : c'est V1 qui sépare PHEV en pon/poff. La fonction fuelCost combine
 * les deux selon `phevChargeFactor()` qui dépend de la charge à domicile.
 */
export const CONS: Record<TripsCategory, Record<ConsPowertrain, number>> = {
  short: { ice: 7.8, hev: 4.6, pon: 1.4, poff: 8.6, bev: 18.0, die: 7.2 },
  mixed: { ice: 6.8, hev: 5.2, pon: 3.0, poff: 7.6, bev: 17.0, die: 5.8 },
  long: { ice: 6.2, hev: 5.8, pon: 5.6, poff: 7.0, bev: 16.0, die: 5.0 },
  vlong: { ice: 5.9, hev: 6.1, pon: 7.0, poff: 6.6, bev: 15.5, die: 4.8 },
};

// ============================================================
// WLTP : multiplicateurs de correction WLTP → réel
// ============================================================

/**
 * Coefficients de correction entre la norme WLTP officielle et la
 * consommation réelle observée sur la route.
 *
 * - 1.0 = WLTP fidèle à la réalité
 * - > 1.0 = WLTP sous-estime la conso réelle
 *
 * Le multiplicateur le plus haut est PHEV (1.40) car la norme WLTP fait
 * démarrer le test avec batterie pleine, ce qui ne reflète pas l'usage réel.
 */
export const WLTP: Record<Powertrain, number> = {
  ice: 1.24,
  hev: 1.05,
  phev: 1.40,
  bev: 1.15,
  die: 1.18,
};

// ============================================================
// KMM : mapping clé catégorie → km annuels réels
// ============================================================

/**
 * Catégories de kilométrage annuel utilisées dans le parcours utilisateur.
 *
 * - u10 = "under 10k" → 8 000 km/an
 * - m20 = "mid 20k"   → 15 000 km/an
 * - m35 = "mid 35k"   → 27 000 km/an
 * - o35 = "over 35k"  → 42 000 km/an
 */
export const KMM: Record<KmCategory, number> = {
  u10: 8000,
  m20: 15000,
  m35: 27000,
  o35: 42000,
};

/**
 * Résout une catégorie km en valeur numérique annuelle.
 * Reproduit le comportement V1 : `KMM[st.km] || 15000`.
 */
export function resolveKm(kmCategory: KmCategory | null | undefined): number {
  if (kmCategory && kmCategory in KMM) {
    return KMM[kmCategory];
  }
  return 15000; // fallback V1
}

// ============================================================
// BPROB : probabilités de panne (en %) par powertrain × âge
// ============================================================

/**
 * Probabilité de panne sur 12 mois (en %), indexée par powertrain et âge.
 *
 * Échelle : 1.0 = 1% de chance de panne dans l'année.
 *
 * Observations :
 * - BEV a la fiabilité la plus élevée (0.8 à neuf, 16.2 à 10 ans)
 * - PHEV a la plus mauvaise (1.5 à neuf, 23.5 à 10 ans) — complexité ICE+EV
 * - HEV intermédiaire — bénéficie de la fiabilité Toyota
 *
 * 11 valeurs par powertrain (âge 0 à 10).
 */
export const BPROB: Record<Powertrain, readonly number[]> = {
  ice: [1.2, 1.8, 2.4, 3.1, 4.2, 5.8, 7.5, 9.8, 13.2, 17.1, 21.5],
  hev: [1.0, 1.4, 1.9, 2.5, 3.3, 4.5, 5.8, 7.6, 10.2, 13.4, 17.0],
  phev: [1.5, 2.2, 3.0, 3.9, 5.1, 6.8, 8.7, 11.2, 14.8, 18.9, 23.5],
  bev: [0.8, 1.1, 1.5, 2.0, 2.8, 3.9, 5.2, 6.9, 9.4, 12.5, 16.2],
  die: [1.0, 1.5, 2.2, 3.0, 4.0, 5.5, 7.2, 9.5, 12.8, 16.5, 20.8],
};

/**
 * Récupère la probabilité de panne pour un powertrain et un âge donné.
 * Clamp à âge 10 max (comme V1).
 */
export function getBreakdownProbability(pt: Powertrain, age: number): number {
  const curve = BPROB[pt] ?? BPROB.ice;
  const idx = Math.min(Math.max(0, Math.floor(age)), 10);
  return curve[idx] ?? 1.0;
}

// ============================================================
// MAINT_MULT : multiplicateur d'entretien selon l'âge
// ============================================================

/**
 * Multiplicateur appliqué au coût d'entretien de base selon l'âge.
 *
 * - 0-1 an : 1.00 (entretien standard / encore sous garantie)
 * - 2 ans : 1.05
 * - 5 ans : 1.28
 * - 10 ans : 2.45 (entretien plus de 2× le coût initial)
 *
 * 11 valeurs (âge 0 à 10).
 */
export const MAINT_MULT: readonly number[] = [
  1.00, // âge 0
  1.00, // âge 1
  1.05, // âge 2
  1.10, // âge 3
  1.18, // âge 4
  1.28, // âge 5
  1.42, // âge 6
  1.60, // âge 7
  1.82, // âge 8
  2.10, // âge 9
  2.45, // âge 10+
];

/**
 * Récupère le multiplicateur d'entretien à un âge donné, avec clamp.
 */
export function getMaintenanceMultiplier(age: number): number {
  const idx = Math.min(Math.max(0, Math.floor(age)), 10);
  return MAINT_MULT[idx] ?? 1.0;
}
