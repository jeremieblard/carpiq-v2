/**
 * Incentives à l'achat neuf (bonus BEV/PHEV).
 *
 * Portage strict de `incForCar` et `bevBonus` depuis v64.0.4 lignes 11212-11216.
 *
 * ⚠ ANOMALIE A3 — V1 a 3 bugs cumulés sur les bonus :
 *   1. `bevBonus(p)` est hardcodé FR (retourne 0/4000/3000/0 selon prix)
 *   2. `incForCar` ne prend pas `country` en paramètre → applique FR à tous pays
 *   3. Les valeurs (4000, 3000) ne correspondent même pas à
 *      `COUNTRY_ENERGY.fr.bonus_bev = 3100` (autre source de vérité V1)
 *
 * Décision Palier 3 : portage strict. La correction (collecte des vrais bonus
 * par pays + paramétrage du `country`) est reportée au backlog Hardening
 * Phase 5/6. Cf. `docs/anomalies/BACKLOG-HARDENING-MOTEUR-TCO.md`.
 */

import type { Vehicle } from './types';

/**
 * Bonus BEV à l'achat neuf, selon prix du véhicule.
 *
 * Source : v64.0.4 ligne 11212.
 *
 * Grille V1 (FR hardcodée, NE correspond PAS à COUNTRY_ENERGY.fr.bonus_bev) :
 *   - newP < 12 000 €      : 0 €     (véhicules trop bas de gamme exclus)
 *   - newP ≤ 30 000 €      : 4 000 € (tranche pleine)
 *   - newP ≤ 47 000 €      : 3 000 € (tranche réduite)
 *   - newP > 47 000 €      : 0 €     (véhicules haut de gamme exclus)
 */
export function bevBonus(newP: number): number {
  if (newP < 12000) return 0;
  if (newP <= 30000) return 4000;
  if (newP <= 47000) return 3000;
  return 0;
}

/**
 * Incentive globale pour un véhicule à un âge donné.
 *
 * Source : v64.0.4 ligne 11216.
 *
 * Logique V1 :
 *   - Si age > 0 (occasion)  → 0 (pas de bonus sur l'occasion)
 *   - Si BEV neuf            → `bevBonus(newP)`
 *   - Si PHEV neuf ≤ 50 000 €→ 1 000 € (forfait FR hardcodé)
 *   - Sinon                  → 0
 */
export function incForCar(car: Vehicle, age: number): number {
  if (age > 0) return 0;
  if (car.pt === 'bev') return bevBonus(car.newP);
  if (car.pt === 'phev' && car.newP <= 50000) return 1000;
  return 0;
}
