/**
 * Constantes pour le calcul d'assurance V1.
 *
 * Source : v64.0.4 lignes 8719-8907.
 *
 * Modulateurs multiplicatifs pour calcInsurance :
 *   prime = base[seg] × ageMod × regionMod × brandMod × ptMod × urbanMod
 *           × parkingMod × coverMod × countryMod
 *
 * Note : AGE_INS est déjà compatible avec le type AgeRange du Palier 2
 * (vocabulaire V1 confirmé : u22, u26, u30, "30", "40", "45", "60", "70").
 */

import type { AgeRange, Powertrain } from '../types';

/** Prime de base par segment d'assurance (€). */
export const INS_BASE_SEGMENT: Record<string, number> = {
  compact: 820.0,
  executive: 1250.0,
  mini: 700.0,
  saloon: 950.0,
  sport: 1400.0,
  suv: 920.0,
  suv_large: 1150.0,
  suv_urban: 780.0
};

/** Modulateur d'âge du conducteur. */
export const AGE_INS: Record<string, number> = {
  '30': 1.0,
  '40': 0.95,
  '45': 0.88,
  '60': 0.94,
  '70': 1.15,
  u22: 2.45,
  u26: 1.78,
  u30: 1.32
};

/** Modulateur par marque (fiabilité, coût des pièces). */
export const BRAND_INS: Record<string, number> = {
  alfa: 1.08,
  audi: 1.1,
  bmw: 1.15,
  byd: 1.15,
  citroen: 0.9,
  cupra: 1.05,
  dacia: 0.82,
  ds: 1.06,
  fiat: 0.88,
  ford: 0.95,
  genesis: 1.1,
  honda: 0.95,
  hyundai: 0.94,
  jeep: 1.06,
  kia: 0.94,
  landrover: 1.2,
  lexus: 1.12,
  mazda: 0.95,
  mercedes: 1.18,
  mg: 1.08,
  mini: 1.05,
  mitsubishi: 1.05,
  nissan: 0.96,
  opel: 0.91,
  peugeot: 0.93,
  polestar: 1.18,
  porsche: 1.35,
  renault: 0.92,
  seat: 0.93,
  skoda: 0.96,
  suzuki: 0.85,
  tesla: 1.45,
  toyota: 0.9,
  volvo: 1.05,
  vw: 1.0
};

/** Modulateur par powertrain. */
export const PT_INS: Record<Powertrain, number> = {
  bev: 1.18,
  die: 0.97,
  hev: 1.04,
  ice: 1.0,
  phev: 1.1
} as Record<Powertrain, number>;

/**
 * Modulateur régional FR (par code département).
 * Source : v64.0.4 ligne ~8744.
 */
export const REGION_INS_FR: Record<string, number> = {
  '01': 1.08,
  '02': 1.08,
  '04': 1.1,
  '05': 1.05,
  '06': 1.35,
  '08': 1.05,
  '10': 1.03,
  '11': 1.05,
  '13': 1.38,
  '14': 0.98,
  '16': 0.97,
  '17': 1.0,
  '18': 0.93,
  '19': 0.97,
  '21': 0.97,
  '22': 0.88,
  '24': 0.95,
  '25': 1.0,
  '27': 1.0,
  '28': 0.95,
  '29': 0.88,
  '2A': 1.28,
  '2B': 1.28,
  '30': 1.12,
  '31': 1.12,
  '32': 1.0,
  '33': 1.08,
  '34': 1.15,
  '35': 0.88,
  '36': 0.93,
  '37': 0.95,
  '38': 1.18,
  '39': 0.97,
  '41': 0.95,
  '42': 1.1,
  '44': 0.92,
  '45': 0.97,
  '49': 0.9,
  '50': 0.95,
  '51': 1.05,
  '53': 0.88,
  '54': 1.08,
  '56': 0.9,
  '57': 1.1,
  '58': 0.95,
  '59': 1.15,
  '60': 1.1,
  '61': 0.95,
  '62': 1.12,
  '63': 1.08,
  '64': 1.05,
  '66': 1.08,
  '67': 1.12,
  '68': 1.1,
  '69': 1.25,
  '70': 0.97,
  '71': 0.97,
  '72': 0.9,
  '73': 1.1,
  '74': 1.12,
  '75': 1.42,
  '76': 1.05,
  '77': 1.2,
  '78': 1.18,
  '80': 1.08,
  '81': 1.05,
  '83': 1.3,
  '84': 1.22,
  '85': 0.9,
  '87': 1.0,
  '89': 0.95,
  '90': 1.02,
  '91': 1.18,
  '92': 1.42,
  '93': 1.45,
  '94': 1.38,
  '95': 1.2
};

/**
 * Modulateur régional CH (par code canton à 2 lettres).
 * Source : v64.0.4 ligne ~8810.
 */
export const REGION_INS_CH: Record<string, number> = {
  AG: 1.03,
  AI: 0.96,
  AP: 0.96,
  AR: 0.96,
  BE: 1.01,
  BL: 1.03,
  BS: 1.04,
  FR: 0.99,
  GE: 1.07,
  GL: 0.96,
  GR: 0.97,
  JU: 0.97,
  LU: 1.0,
  NE: 0.99,
  NW: 0.95,
  OW: 0.95,
  SG: 1.02,
  SH: 0.97,
  SO: 1.0,
  SZ: 0.97,
  TG: 0.99,
  TI: 1.08,
  UR: 0.95,
  VD: 1.05,
  VS: 0.98,
  ZG: 0.98,
  ZH: 1.05
};

/**
 * Modulateur régional DE (par Land allemand).
 * Source : v64.0.4 ligne 8850.
 */
export const REGION_INS_DE: Record<string, number> = {
  BW: 1.05,
  Bayern: 1.05,
  Berlin: 1.18,
  Brandenburg: 0.95,
  Bremen: 1.12,
  Hamburg: 1.15,
  Hessen: 1.05,
  Mecklenburg: 0.92,
  NRW: 1.08,
  Niedersachsen: 1.0,
  'Rheinland-Pfalz': 0.98,
  Saarland: 1.02,
  Sachsen: 0.95,
  'Sachsen-Anhalt': 0.93,
  'Schleswig-Holstein': 0.97,
  'Th\u00fcringen': 0.95
};

/** Modulateur par pays appliqué après tous les autres. */
export const COUNTRY_INS: Record<string, number> = {
  fr: 1.0,
  ch: 1.6,
  de: 1.1,
  be: 0.95,
  nl: 1.05,
  it: 1.15,
  es: 0.9,
};
