/**
 * Taxe annuelle régionale Belgique (3 régions : Wallonie, Flandre, Bruxelles).
 *
 * Source : v64.0.4 lignes 9830-9870.
 *
 * Méthodes :
 *   - fiscal_hp_progressive : barème chevaux fiscaux progressif (WAL, BXL)
 *   - weight_euro_co2 : taxe poids + euro + CO2 (FLA)
 */

import type { EstimatedSpecs } from './tax-ch';

/** Définition d'une région belge. */
export interface RegionTaxData {
  name: string;
  method: string;
  bev_discount?: number;
  bev_exempt_until?: number;
  phev_discount?: number;
  hev_discount?: number;
  compute: (specs: EstimatedSpecs, co2: number, age: number, pt: string) => number;
}

/**
 * Table des taxes régionales belges.
 * Clés : WAL (Wallonie), FLA (Flandre), BXL (Bruxelles).
 */
export const BE_REGIONS: Record<string, RegionTaxData> = {
  WAL: {
    name: "Wallonie",
    method: "fiscal_hp_progressive",
    bev_discount: .75,
    phev_discount: .3,
    hev_discount: .1,
    compute: (s, co2, age, pt) => {
      const cv = "bev" === pt ? Math.max(7, Math.round(.07 * s.kW)) : Math.round(s.cc / 200);
      let tax = 0;
      return tax = cv <= 4 ? 90 : cv <= 7 ? 90 + 60 * (cv - 4) : cv <= 10 ? 270 + 80 * (cv - 7) : cv <= 14 ? 510 + 130 * (cv - 10) : cv <= 18 ? 1030 + 180 * (cv - 14) : 1750 + 230 * (cv - 18), 
      co2 > 145 && (tax += 3 * (co2 - 145)), co2 > 200 && (tax += 6 * (co2 - 200)), Math.round(tax);
    }
  },
  FLA: {
    name: "Flandre",
    method: "weight_euro_co2",
    bev_exempt_until: 2026,
    phev_discount: .3,
    hev_discount: .15,
    compute: (s, co2, age, pt) => {
      let tax = 0;
      return tax = s.weight <= 1200 ? .16 * s.weight : s.weight <= 1700 ? 192 + .22 * (s.weight - 1200) : 302 + .3 * (s.weight - 1700), 
      co2 > 122 && (tax += 1.8 * (co2 - 122)), co2 > 165 && (tax += 4 * (co2 - 165)), 
      Math.round(tax);
    }
  },
  BXL: {
    name: "Bruxelles",
    method: "fiscal_hp_progressive",
    bev_discount: .75,
    phev_discount: .4,
    hev_discount: .15,
    compute: (s, co2, age, pt) => {
      const cv = "bev" === pt ? Math.max(7, Math.round(.07 * s.kW)) : Math.round(s.cc / 200);
      let tax = 0;
      return tax = cv <= 4 ? 100 : cv <= 7 ? 100 + 70 * (cv - 4) : cv <= 10 ? 310 + 90 * (cv - 7) : cv <= 14 ? 580 + 140 * (cv - 10) : cv <= 18 ? 1140 + 195 * (cv - 14) : 1920 + 250 * (cv - 18), 
      co2 > 130 && (tax += 4 * (co2 - 130)), co2 > 185 && (tax += 8 * (co2 - 185)), Math.round(tax);
    }
  }
};

