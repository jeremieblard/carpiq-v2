/**
 * Moteur TCO V2 — `calcTco`.
 *
 * Portage strict de `calcTCO(pt, newP, brand, age, km)` depuis
 * `carpiq-layer1-v64_0_4.html` (ligne 11220).
 *
 * Refactor V2 :
 *   - Toutes les dépendances V1 globales (`st.trips`, `activeCountry`, etc.)
 *     sont passées en paramètres explicites via `TcoInputs`.
 *   - Aucune lecture de variable globale.
 *   - Pure : même entrée → même sortie, toujours.
 */

import type { TcoInputs, TcoResult } from './types';
import { DEPR } from './constants/depreciation';
import { MAINT_MULT, BPROB } from './constants/consumption';
import { fuelCost } from './fuel-cost';
import { annualMaint, repairCost, insMod } from './maintenance';

/**
 * Calcule le TCO (Total Cost of Ownership) d'un véhicule sur 5 ans.
 *
 * Décompose le coût total mensuel en :
 *   - dépréciation (purchP - saleP étalée sur 5 ans)
 *   - énergie (yf × 5)
 *   - entretien (maint × 5)
 *   - réparations (rep × 5)
 *
 * Et retourne aussi le risque de panne à l'âge donné (BPROB).
 *
 * Formule monthly : (depr5 + 5 × (yf + maint + rep)) / 60
 */
export function calcTco(inputs: TcoInputs): TcoResult {
  const { pt, newP, brand, age, km, trips, charging, urban, dept, country, driverAge } = inputs;

  // Dépréciation : courbe DEPR statique (cf. cascade pricing en Palier 3)
  const curve = DEPR[pt] ?? DEPR.ice;
  const idx = Math.min(age, 10);
  const sIdx = Math.min(idx + 5, 10);
  const purchP = Math.round(newP * curve[idx]);
  const saleP = Math.round(newP * curve[sIdx]);
  const depr5 = purchP - saleP;

  // Coûts annuels
  const yf = fuelCost(pt, trips, km, charging, urban, dept, country);
  const maint = Math.round(annualMaint(pt, brand) * MAINT_MULT[idx] * insMod(driverAge));
  const rep = repairCost(pt, brand, age, trips);

  // Coût mensuel total amorti sur 5 ans
  const mo = (depr5 + 5 * (yf + maint + rep)) / 60;

  // Risque de panne (probabilité en %)
  const risk = (BPROB[pt] ?? BPROB.ice)[idx];

  return { purchP, saleP, depr5, yf, maint, rep, mo, risk };
}
