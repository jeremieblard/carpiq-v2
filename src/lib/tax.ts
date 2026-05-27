/**
 * Calcul de la taxe annuelle par pays (calcAnnualTax + helpers).
 *
 * Source : v64.0.4 lignes 9383-9985.
 *
 * Dispatcher par pays :
 *   - FR : barème CO2 progressif (123/150/190/230 g/km)
 *   - CH : calcCantonalTaxCH via CH_CANTON_TAX (26 cantons + default)
 *   - DE : forfait + delta CO2 95g/km
 *   - BE : calcRegionalTaxBE via BE_REGIONS (WAL/FLA/BXL)
 *   - NL : calcProvincialTaxNL via NL_PROVINCE_SURCHARGE (12 provinces)
 *   - IT : forfait kW × 3 (kw fictif par segment)
 *   - ES : forfait par segment
 *   - PT, LU : 0 (pas implémenté V1)
 *
 * Refactor V2 : `dept`, `country` passés explicitement (V1 lisait `st.dept`,
 * `activeCountry` globales).
 */

import type { Vehicle, Country, DeptCode } from './types';
import { CH_CANTON_TAX, CH_CANTON_DEFAULT } from './constants/tax-ch';
import type { EstimatedSpecs } from './constants/tax-ch';
import { BE_REGIONS } from './constants/tax-be';
import { NL_PROVINCE_SURCHARGE } from './constants/tax-nl';
import { CO2_WLTP, CO2_WLTP_BY_SEGMENT } from './constants/co2-data';
import { getInsSegment } from './insurance';

// ─────────────────────────────────────────────────────────────────────────────
// estimateVehicleSpecs — poids, kW, cylindrée estimés selon segment
// ─────────────────────────────────────────────────────────────────────────────

/** Table de base : specs typiques par segment fiscal. */
const SPECS_BASE: Record<string, EstimatedSpecs> = {
  mini: { weight: 1100, kW: 70, cc: 1200 },
  compact: { weight: 1400, kW: 110, cc: 1500 },
  saloon: { weight: 1550, kW: 130, cc: 1800 },
  executive: { weight: 1850, kW: 200, cc: 2500 },
  suv_urban: { weight: 1450, kW: 115, cc: 1500 },
  suv: { weight: 1700, kW: 150, cc: 2000 },
  suv_premium: { weight: 1950, kW: 220, cc: 2500 },
  suv_large: { weight: 2200, kW: 250, cc: 3000 },
  sport: { weight: 1600, kW: 280, cc: 2800 },
};

/**
 * Estime poids/puissance/cylindrée d'un véhicule selon ses segments.
 *
 * Source : v64.0.4 ligne 9391.
 *
 * Ajustements selon powertrain :
 *   - BEV : +250 kg, ×1.4 kW, cc=0
 *   - PHEV : +200 kg, ×1.15 kW
 *   - HEV : +100 kg
 *   - DIE : ×1.1 cc
 */
export function estimateVehicleSpecs(car: Vehicle): EstimatedSpecs {
  const segs = (car.seg ?? []) as string[];
  let seg = 'compact';

  // Cascade de priorités V1
  if (
    (segs.includes('premium') || segs.includes('executive')) &&
    (segs.includes('suv') || segs.includes('suv_family') || segs.includes('crossover'))
  ) {
    seg = 'suv_premium';
  } else if (segs.includes('premium') || segs.includes('executive')) {
    seg = 'executive';
  } else if (segs[0] === 'sport' || segs[0] === 'coupe_sport') {
    seg = 'sport';
  } else if (segs.includes('suv_large')) {
    seg = 'suv_large';
  } else if (segs.includes('suv') || segs.includes('suv_family')) {
    seg = 'suv';
  } else if (segs.includes('suv_urban') || segs.includes('crossover')) {
    seg = 'suv_urban';
  } else if (segs.includes('saloon') || segs.includes('family')) {
    seg = 'saloon';
  } else if (segs.includes('mini') || segs.includes('city')) {
    seg = 'mini';
  }

  const specs: EstimatedSpecs = { ...(SPECS_BASE[seg] ?? SPECS_BASE.compact) };
  const pt = car.pt ?? 'ice';

  if (pt === 'bev') {
    specs.weight += 250;
    specs.kW = Math.round(1.4 * specs.kW);
    specs.cc = 0;
  } else if (pt === 'phev') {
    specs.weight += 200;
    specs.kW = Math.round(1.15 * specs.kW);
  } else if (pt === 'hev') {
    specs.weight += 100;
  } else if (pt === 'die') {
    specs.cc = Math.round(1.1 * specs.cc);
  }

  return specs;
}

// ─────────────────────────────────────────────────────────────────────────────
// getCO2 — valeur CO2 WLTP avec fallback
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Retourne la valeur CO2 WLTP d'un véhicule (g/km).
 *
 * Source : v64.0.4 ligne 9383.
 *
 * Cascade :
 *   1. BEV → 0 (toujours)
 *   2. CO2_WLTP[car.id] si présent
 *   3. CO2_WLTP_BY_SEGMENT[getInsSegment(car)][car.pt] si présent
 *   4. 130 g/km par défaut
 */
export function getCO2(car: Vehicle): number {
  if (car.pt === 'bev') return 0;
  const direct = CO2_WLTP[car.id];
  if (direct !== undefined) return direct;
  const seg = CO2_WLTP_BY_SEGMENT[getInsSegment(car)];
  if (seg) {
    const v = seg[car.pt];
    if (v !== undefined) return v;
  }
  return 130;
}

// ─────────────────────────────────────────────────────────────────────────────
// Taxes par pays (dispatchers)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Taxe cantonale suisse (26 cantons + default).
 *
 * Source : v64.0.4 ligne 9790.
 */
export function calcCantonalTaxCH(
  car: Vehicle,
  vehicleAge: number,
  dept: DeptCode,
): number {
  const cantonData = (dept && CH_CANTON_TAX[dept]) || CH_CANTON_DEFAULT;
  const specs = estimateVehicleSpecs(car);
  const co2 = getCO2(car);
  const pt = car.pt ?? 'ice';
  const age = vehicleAge ?? 0;

  if (pt === 'bev') {
    const bev = cantonData.bev ?? { exempt_years: 0 };
    if (bev.exempt_years === Infinity) return 0;
    if (
      bev.exempt_years &&
      age < bev.exempt_years &&
      (!bev.max_weight || specs.weight <= bev.max_weight)
    ) {
      return 0;
    }
    if (bev.fixed_min !== undefined) return bev.fixed_min;
    if (bev.discount !== undefined && bev.permanent) {
      const base = cantonData.compute(specs, co2, age, pt);
      return Math.round(base * (1 - bev.discount));
    }
    if (cantonData.bev_legacy_weight_reduction) {
      specs.weight *= 1 - cantonData.bev_legacy_weight_reduction;
    }
  }

  if ((pt === 'hev' || pt === 'phev') && cantonData.hev_discount) {
    const discountInfo =
      typeof cantonData.hev_discount === 'object'
        ? cantonData.hev_discount
        : { rate: cantonData.hev_discount, max_years: Infinity };
    if (age < discountInfo.max_years) {
      const base = cantonData.compute(specs, co2, age, pt);
      return Math.round(base * (1 - discountInfo.rate));
    }
  }

  return cantonData.compute(specs, co2, age, pt);
}

/**
 * Taxe régionale belge (Wallonie / Flandre / Bruxelles).
 *
 * Source : v64.0.4 ligne 9872.
 */
export function calcRegionalTaxBE(
  car: Vehicle,
  vehicleAge: number,
  dept: DeptCode,
): number {
  // Mapping province → région
  const PROVINCE_TO_REGION: Record<string, string> = {
    BW: 'WAL',
    HT: 'WAL',
    LG: 'WAL',
    LX: 'WAL',
    NA: 'WAL',
    BU: 'BXL',
    AN: 'FLA',
    VB: 'FLA',
    OV: 'FLA',
    WV: 'FLA',
    LI: 'FLA',
    VL: 'FLA',
  };
  const province = dept ?? 'BW';
  const region = PROVINCE_TO_REGION[province] ?? 'WAL';
  const data = BE_REGIONS[region] ?? BE_REGIONS.WAL;

  const specs = estimateVehicleSpecs(car);
  const co2 = getCO2(car);
  const pt = car.pt ?? 'ice';
  const age = vehicleAge ?? 0;

  if (pt === 'bev') {
    if (
      data.bev_exempt_until !== undefined &&
      new Date().getFullYear() < data.bev_exempt_until
    ) {
      return 0;
    }
    if (data.bev_discount !== undefined) {
      const base = data.compute(specs, co2, age, pt);
      return Math.round(base * (1 - data.bev_discount));
    }
  }

  if (pt === 'phev' && data.phev_discount !== undefined) {
    const base = data.compute(specs, co2, age, pt);
    return Math.round(base * (1 - data.phev_discount));
  }

  if (pt === 'hev' && data.hev_discount !== undefined) {
    const base = data.compute(specs, co2, age, pt);
    return Math.round(base * (1 - data.hev_discount));
  }

  return data.compute(specs, co2, age, pt);
}

/**
 * Taxe provinciale Pays-Bas (12 provinces, surcharge × barème national).
 *
 * Source : v64.0.4 ligne 9922.
 */
export function calcProvincialTaxNL(
  car: Vehicle,
  _vehicleAge: number,
  dept: DeptCode,
): number {
  const province = dept ?? 'NH';
  const surcharge = NL_PROVINCE_SURCHARGE[province] ?? 1.2;
  const specs = estimateVehicleSpecs(car);
  const pt = car.pt ?? 'ice';

  if (pt === 'bev') return 0;

  const w = specs.weight;
  let qbase = 0;

  if (pt === 'die') {
    qbase =
      w <= 800 ? 70 :
      w <= 1000 ? 90 :
      w <= 1200 ? 110 :
      w <= 1400 ? 135 :
      w <= 1600 ? 165 :
      w <= 1800 ? 200 :
      w <= 2000 ? 240 : 240 + 0.18 * (w - 2000);
  } else {
    qbase =
      w <= 800 ? 40 :
      w <= 1000 ? 60 :
      w <= 1200 ? 75 :
      w <= 1400 ? 90 :
      w <= 1600 ? 115 :
      w <= 1800 ? 140 :
      w <= 2000 ? 170 : 170 + 0.14 * (w - 2000);
  }

  const annual = 4 * qbase * surcharge;

  if (pt === 'hev' || pt === 'phev') {
    return Math.round(0.75 * annual);
  }
  return Math.round(annual);
}

// ─────────────────────────────────────────────────────────────────────────────
// calcAnnualTax — fonction principale (dispatch par country)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calcule la taxe annuelle pour un véhicule selon le pays.
 *
 * Source : v64.0.4 ligne 9934.
 *
 * @param car           Véhicule
 * @param purchasePrice Prix d'achat (utilisé pour certains barèmes) — non utilisé en V1 sauf signature
 * @param vehicleAge    Âge du véhicule
 * @param dept          Code département/canton/province/region selon pays
 * @param country       Pays utilisateur
 */
export function calcAnnualTax(
  car: Vehicle,
  _purchasePrice: number,
  vehicleAge: number,
  dept: DeptCode,
  country: Country,
): number {
  const co2 = getCO2(car);

  if (country === 'fr') {
    if (car.pt === 'bev' || co2 === 0 || co2 <= 123) return 0;
    if (co2 <= 150) return Math.round(10 * (co2 - 123));
    if (co2 <= 190) return Math.round(40 * (co2 - 150) + 270);
    if (co2 <= 230) return Math.round(60 * (co2 - 190) + 1870);
    return Math.round(160 * (co2 - 230) + 4270);
  }

  if (country === 'ch') {
    return calcCantonalTaxCH(car, vehicleAge, dept);
  }

  if (country === 'de') {
    if (car.pt === 'bev') return 0;
    const baseFixed = car.pt === 'die' ? 270 : 220;
    const co2Surcharge = co2 > 95 ? Math.round(2 * (co2 - 95)) : 0;
    return baseFixed + co2Surcharge;
  }

  if (country === 'be') {
    return calcRegionalTaxBE(car, vehicleAge, dept);
  }

  if (country === 'nl') {
    return calcProvincialTaxNL(car, vehicleAge, dept);
  }

  if (country === 'it') {
    const kwMap: Record<string, number> = {
      mini: 70,
      compact: 90,
      saloon: 130,
      suv: 120,
      executive: 180,
      sport: 250,
    };
    const kw = kwMap[getInsSegment(car)] ?? 100;
    if (car.pt === 'bev') return 0;
    return Math.round(3 * kw);
  }

  if (country === 'es') {
    const baseMap: Record<string, number> = {
      mini: 80,
      compact: 100,
      saloon: 130,
      suv: 150,
      executive: 200,
    };
    const base = baseMap[getInsSegment(car)] ?? 110;
    if (car.pt === 'bev') return 0;
    return base;
  }

  // PT, LU et autres → 0 (pas implémenté V1)
  return 0;
}
