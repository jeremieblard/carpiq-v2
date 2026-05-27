/**
 * Calculs d'entretien, réparations, et modulation d'assurance.
 *
 * Portage strict de `annualMaint`, `repairCost`, `insMod`, `laborRate`
 * depuis `carpiq-layer1-v64_0_4.html` (lignes 11086-11148).
 *
 * Refactor V2 : toutes les dépendances V1 (`st.trips`, `st.age`) passées
 * en paramètres explicites.
 */

import type { Powertrain, TripsCategory, AgeRange } from './types';
import {
  MAINT_BASE_BY_PT,
  REPAIR_PROB_BY_AGE,
  AVG_REPAIR_COST_BASE,
  AGE_INS,
  LABOR_RATE_BRAND,
} from './constants/maintenance-data';

/**
 * Taux horaire main d'œuvre d'une marque (€/h). Fallback 82 si inconnue.
 */
export function laborRate(brand: string): number {
  return LABOR_RATE_BRAND[brand] ?? 82;
}

/**
 * Modificateur d'assurance selon tranche d'âge du conducteur.
 *
 * Fallback 1 si `driverAge` est null ou non listé dans `AGE_INS`.
 *
 * Pour info : u22 = ×2.45 (très jeune), 45 = ×0.88 (optimal),
 * 70 = ×1.15 (sénior). Cf. constants/maintenance-data.ts.
 */
export function insMod(driverAge: AgeRange): number {
  if (driverAge === null) return 1;
  return AGE_INS[driverAge] ?? 1;
}

/**
 * Entretien annuel (€/an) selon powertrain, marque.
 *
 * Formule V1 :
 *   base × laborMult + adblue
 * Où :
 *   - base       = MAINT_BASE_BY_PT[pt]   (ex: ICE=380, BEV=180)
 *   - laborMult  = laborRate(brand) / 82  (référence Honda = 1)
 *   - adblue     = 35 si Diesel, 0 sinon  (recharge AdBlue annuelle)
 *
 * Exemples :
 *   - Toyota ICE  : 380 × (85/82) ≈ 394 €/an
 *   - Mercedes ICE : 380 × (127/82) ≈ 588 €/an
 *   - Toyota Diesel : 420 × (85/82) + 35 ≈ 470 €/an
 *   - Tesla BEV : 180 × (95/82) ≈ 209 €/an
 */
export function annualMaint(pt: Powertrain, brand: string): number {
  const base = MAINT_BASE_BY_PT[pt];
  const adblue = pt === 'die' ? 35 : 0;
  const laborMult = laborRate(brand) / 82;
  return Math.round(base * laborMult + adblue);
}

/**
 * Provision réparations annuelle (€/an) selon powertrain, marque, âge, trips.
 *
 * Formule V1 :
 *   round(prob × baseCost × 12 + fapRisk)
 * Où :
 *   - prob        = REPAIR_PROB_BY_AGE[min(age, 10)]
 *   - lr          = laborRate(brand)
 *   - partsFactor = 1.6 si lr>100, 1.3 si lr>90, 1.1 si lr>80, 1 sinon
 *   - baseCost    = 450 × partsFactor × partsFactor   (cf. note ci-dessous)
 *   - fapRisk     = 150 si Diesel+short, 93.75 si Diesel+mixed,
 *                   75 si Diesel autre, 0 sinon
 *
 * NOTE — `partsFactor` est appliqué AU CARRÉ. Confirmé par Jérémie comme
 * volontaire (effet cumulatif main d'œuvre × pièces). Pas un bug.
 */
export function repairCost(
  pt: Powertrain,
  brand: string,
  age: number,
  trips: TripsCategory,
): number {
  const idx = Math.min(age, 10);
  const prob = REPAIR_PROB_BY_AGE[idx];
  const lr = laborRate(brand);
  const partsFactor =
    lr > 100 ? 1.6 : lr > 90 ? 1.3 : lr > 80 ? 1.1 : 1;
  const baseCost = AVG_REPAIR_COST_BASE * partsFactor * partsFactor;
  // V1 : Math.round() est appliqué AU fapRisk individuel avant addition.
  // 93.75 → round → 94. Crucial pour reproduire la baseline.
  const fapRisk =
    pt === 'die' && trips === 'short'
      ? Math.round(150)
      : pt === 'die' && trips === 'mixed'
      ? Math.round(93.75)
      : pt === 'die'
      ? Math.round(75)
      : 0;
  return Math.round(prob * baseCost * 12 + fapRisk);
}
