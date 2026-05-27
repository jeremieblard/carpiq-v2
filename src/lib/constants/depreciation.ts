/**
 * Courbes de dépréciation par motorisation
 * =========================================
 *
 * Source : extraction directe de `DEPR` dans V1 (27 mai 2026, https://carpiq.eu).
 *
 * Chaque tableau contient 11 valeurs : facteur de valeur restante de 0 à 10 ans.
 * - Index 0 (neuf) : 1.0 (100% du prix neuf)
 * - Index 10 (10 ans) : valeur résiduelle finale
 *
 * Observation : PHEV se déprécie plus vite que ICE/HEV (passe à 0.278 à 10 ans
 * contre 0.35 ICE et 0.38 HEV). Confirmé par les marchés européens 2024-2026.
 *
 * Aucune valeur n'est inventée : reproduction exacte du moteur V1 production.
 */

import type { Powertrain } from '../types';

/** Facteurs de dépréciation à chaque âge (0 à 10 ans) par powertrain. */
export const DEPR: Record<Powertrain, readonly number[]> = {
  ice: [1.00, 0.78, 0.66, 0.60, 0.54, 0.50, 0.46, 0.43, 0.40, 0.38, 0.35],
  hev: [1.00, 0.82, 0.72, 0.65, 0.59, 0.54, 0.50, 0.46, 0.43, 0.40, 0.38],
  phev: [1.00, 0.891, 0.762, 0.656, 0.555, 0.496, 0.443, 0.395, 0.352, 0.313, 0.278],
  bev: [1.00, 0.68, 0.54, 0.44, 0.37, 0.32, 0.28, 0.25, 0.22, 0.20, 0.18],
  die: [1.00, 0.77, 0.65, 0.57, 0.51, 0.46, 0.42, 0.39, 0.36, 0.34, 0.32],
};

/**
 * Récupère le facteur de dépréciation à un âge donné, avec clamp à 10 ans max.
 * Reproduit le comportement V1 : `Math.min(age, 10)`.
 */
export function getDeprecationFactor(pt: Powertrain, age: number): number {
  const curve = DEPR[pt] ?? DEPR.ice;
  const idx = Math.min(Math.max(0, Math.floor(age)), 10);
  // Le ?? est un garde-fou ; à age=0..10 valide, on a toujours un nombre.
  return curve[idx] ?? 1.0;
}
