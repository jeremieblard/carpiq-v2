/**
 * Constantes V1 utilisées par `annualMaint`, `repairCost`, `insMod`, `laborRate`.
 *
 * Source : `carpiq-layer1-v64_0_4.html` (extraction directe, 27 mai 2026).
 *
 * Toutes les valeurs sont extraites verbatim de la prod V1. Aucune normalisation
 * ni nettoyage. Si des anomalies y sont identifiées (cf. backlog Hardening),
 * elles sont conservées en l'état jusqu'à la phase de Hardening.
 */

import type { Powertrain } from '../types';

/**
 * Base entretien annuel (€/an) par powertrain, avant modulation main d'œuvre.
 *
 * Source : v64.0.4 ligne ~11133.
 *
 * BEV plus bas que les autres (pas de vidange, freins épargnés par régen).
 * Diesel plus haut que ICE (AdBlue + entretien injection + FAP).
 */
export const MAINT_BASE_BY_PT: Record<Powertrain, number> = {
  ice: 380,
  hev: 265,
  phev: 320,
  bev: 180,
  die: 420,
} as const;

/**
 * Probabilité annuelle de panne nécessitant réparation, indexée par âge (0..10).
 *
 * Source : v64.0.4 ligne ~11126.
 *
 * Croît de 0.5% à 1 an à 28% à 10 ans (modèle classique baignoire inversée).
 */
export const REPAIR_PROB_BY_AGE: readonly number[] = [
  0.005, 0.012, 0.02, 0.035, 0.055, 0.08, 0.11, 0.145, 0.185, 0.23, 0.28,
] as const;

/**
 * Coût de base par incident de réparation (€), avant modulation pièces.
 *
 * Source : v64.0.4 ligne ~11126 (suffixe de `REPAIR_PROB_BY_AGE`).
 */
export const AVG_REPAIR_COST_BASE = 450 as const;

/**
 * Modificateur d'assurance par tranche d'âge du conducteur.
 *
 * Source : v64.0.4 ligne ~8735.
 *
 * Clés correspondent au vocabulaire `AgeRange` (cf. types-p2.ts).
 * Si la clé n'existe pas (ou si st.age est null), le fallback est 1.
 */
export const AGE_INS: Record<string, number> = {
  u22: 2.45,
  u26: 1.78,
  u30: 1.32,
  '30': 1.0,
  '40': 0.95,
  '45': 0.88,
  '60': 0.94,
  '70': 1.15,
} as const;

/**
 * Taux horaire main d'œuvre par marque (€/h).
 *
 * Source : v64.0.4 ligne ~11086.
 *
 * Influence à la fois `annualMaint` (via laborMult) et `repairCost`
 * (via partsFactor calculé depuis le taux). Marques luxe (Mercedes, Porsche,
 * Audi) ont les taux les plus élevés (jusqu'à 127 €/h).
 * Marques abordables (Dacia, MG, Suzuki) en bas (68-73 €/h).
 *
 * Le fallback si brand inconnue = 82 €/h (cf. `laborRate`).
 */
export const LABOR_RATE_BRAND: Record<string, number> = {
  mercedes: 127,
  porsche: 120,
  audi: 120,
  lexus: 105,
  bmw: 110,
  volvo: 100,
  tesla: 95,
  mini: 95,
  vw: 85,
  toyota: 85,
  honda: 82,
  skoda: 79,
  mazda: 80,
  subaru: 80,
  seat: 71,
  cupra: 78,
  hyundai: 78,
  kia: 78,
  nissan: 78,
  renault: 70,
  peugeot: 75,
  citroen: 72,
  opel: 73,
  fiat: 70,
  dacia: 68,
  ds: 80,
  alfa: 85,
  ford: 78,
  jeep: 78,
  mitsubishi: 76,
  suzuki: 73,
  mg: 72,
  byd: 75,
} as const;
