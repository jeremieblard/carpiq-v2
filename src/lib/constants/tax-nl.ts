/**
 * Surcharges provinciales Pays-Bas (12 provinces).
 *
 * Source : v64.0.4 ligne 9907.
 *
 * NL n'a PAS de table de fonctions `compute` par province : juste un
 * surcharge multiplicatif appliqué à un barème national de base.
 * Le calcul (par tranche de poids) est fait dans `calcProvincialTaxNL`.
 */

/** Surcharge multiplicative par province (codes officiels NL). */
export const NL_PROVINCE_SURCHARGE: Record<string, number> = {
  FR: 1.288,
  GE: 1.105,
  GR: 1.26,
  LB: 1.27,
  NB: 1.107,
  NH: 1.142,
  OV: 1.255,
  UT: 1.249,
  ZE: 1.232,
  ZH: 1.25,
  DR: 1.252,
  FL: 1.245,
};
