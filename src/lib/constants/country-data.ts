/**
 * Données énergie et incitations par pays
 * ========================================
 *
 * Source : extraction directe de COUNTRY_ENERGY V1 (27 mai 2026).
 *
 * 9 pays supportés. Chaque entrée contient :
 * - Prix énergie (essence, électricité résidentielle et publique)
 * - Intensité carbone du mix électrique (gCO2/kWh)
 * - Bonus BEV et PHEV courants
 * - Métadonnées : nom, drapeau, langue, devise, notes
 *
 * Note sur le Luxembourg : carburant le moins cher d'Europe (1.52 €/L),
 * pas de ZFE, prime BEV importante (€6 000).
 */

import type { Country, CountryData } from '../types';

export const COUNTRY_ENERGY: Record<Country, CountryData> = {
  fr: {
    fp: 1.88,
    ep: 0.2664,
    epu: 0.52,
    co2g: 56,
    bonus_bev: 3100,
    bonus_phev: 0,
    name: 'France',
    flag: '🇫🇷',
    lang: 'fr',
    curr: '€',
    currSym: '€',
    bonus_note: "Prime CEE jusqu'à €4 200 (rev. modestes) / €3 100 (autres). électrique assemblé EU: +€1 000.",
    zfe: 'ZFE-m: +30 villes, Crit\u2019Air 2 diesel interdit en centre',
  },
  be: {
    fp: 1.86,
    ep: 0.298,
    epu: 0.54,
    co2g: 155,
    bonus_bev: 0,
    bonus_phev: 0,
    name: 'Belgique',
    flag: '🇧🇪',
    lang: 'fr',
    curr: '€',
    currSym: '€',
    bonus_note: "Wallonie: prime jusqu'à €3 500 (cond. revenus). Flandre: pas d'aide directe 2025.",
    zfe: 'Bruxelles LEZ: diesel Euro 5 interdit dès 2025',
  },
  nl: {
    fp: 2.36,
    ep: 0.358,
    epu: 0.65,
    co2g: 270,
    bonus_bev: 2950,
    bonus_phev: 0,
    name: 'Nederland',
    flag: '🇳🇱',
    lang: 'nl',
    curr: '€',
    currSym: '€',
    bonus_note: 'SEPP subsidie: max €2 950 voor électrique <€45 000 (voorwaarden van toepassing).',
    zfe: 'Amsterdam/Rotterdam ZE: diesel verboden in stadscentrum',
  },
  ch: {
    fp: 1.93,
    ep: 0.225,
    epu: 0.5,
    co2g: 42,
    bonus_bev: 0,
    bonus_phev: 0,
    name: 'Suisse',
    flag: '🇨🇭',
    lang: 'fr',
    curr: 'CHF',
    currSym: 'CHF ',
    bonus_note: 'Bonus cantonal: Vaud/Genève CHF 3 000. Aucun bonus fédéral suisse.',
    zfe: 'Pas de ZFE en Suisse',
  },
  de: {
    fp: 2.24,
    ep: 0.3835,
    epu: 0.58,
    co2g: 380,
    bonus_bev: 0,
    bonus_phev: 0,
    name: 'Deutschland',
    flag: '🇩🇪',
    lang: 'de',
    curr: '€',
    currSym: '€',
    bonus_note: 'Umweltbonus eingestellt Dez. 2023. Keine Bundesförderung 2025-2026.',
    zfe: 'Umweltzonen: Euro 4 Diesel in den meisten Großstädten verboten',
  },
  es: {
    fp: 1.68,
    ep: 0.244,
    epu: 0.46,
    co2g: 170,
    bonus_bev: 4500,
    bonus_phev: 0,
    name: 'España',
    flag: '🇪🇸',
    lang: 'es',
    curr: '€',
    currSym: '€',
    bonus_note: "Plan MOVES III: jusqu'à €7 000 électrique (avec mise à la casse). Sans casse: ~€4 500.",
    zfe: 'ZBE: Madrid, Barcelone, Valence — diesel Euro 4 interdit',
  },
  it: {
    fp: 1.87,
    ep: 0.3274,
    epu: 0.58,
    co2g: 230,
    bonus_bev: 6000,
    bonus_phev: 1500,
    name: 'Italia',
    flag: '🇮🇹',
    lang: 'it',
    curr: '€',
    currSym: '€',
    bonus_note: "Incentivi auto 2025: jusqu'à €6 000 électrique + €1 500 hybride rechargeable (limité, quota annuel épuisé rapidement).",
    zfe: 'Zone ZTL: Rome, Milan — restrictions diesel Euro 4/5 selon ville',
  },
  pt: {
    fp: 1.9,
    ep: 0.22,
    epu: 0.44,
    co2g: 140,
    bonus_bev: 4000,
    bonus_phev: 0,
    name: 'Portugal',
    flag: '🇵🇹',
    lang: 'pt',
    curr: '€',
    currSym: '€',
    bonus_note: "IAPMEI 2025: jusqu'à €4 000 électrique conditionné à la mise à la casse d'un ancien véhicule.",
    zfe: 'ZVEI Lisbonne/Porto: diesel Euro 5 restreint en centre',
  },
  lu: {
    fp: 1.52,
    ep: 0.267,
    epu: 0.48,
    co2g: 150,
    bonus_bev: 6000,
    bonus_phev: 0,
    name: 'Luxembourg',
    flag: '🇱🇺',
    lang: 'fr',
    curr: '€',
    currSym: '€',
    bonus_note: "Prime état: €6 000 pour électrique (voitures particulières, immat. à partir janv. 2025).",
    zfe: "Pas de ZFE au Luxembourg — carburant parmi les moins chers d'Europe",
  },
};

// ============================================================
// Accesseurs typés (reproduisent l'API V1)
// ============================================================

/** Prix essence du pays courant. Reproduit `getFP()` V1. */
export function getFP(country: Country): number {
  return COUNTRY_ENERGY[country]?.fp ?? COUNTRY_ENERGY.fr.fp;
}

/** Prix électricité résidentielle. Reproduit `getEP()` V1. */
export function getEP(country: Country): number {
  return COUNTRY_ENERGY[country]?.ep ?? COUNTRY_ENERGY.fr.ep;
}

/** Prix électricité publique. Reproduit `getEPU()` V1. */
export function getEPU(country: Country): number {
  return COUNTRY_ENERGY[country]?.epu ?? COUNTRY_ENERGY.fr.epu;
}

/** Intensité carbone du mix électrique. Reproduit `getCountryCO2()` V1. */
export function getCountryCO2(country: Country): number {
  return COUNTRY_ENERGY[country]?.co2g ?? COUNTRY_ENERGY.fr.co2g;
}

/** Bonus BEV courant. Reproduit `getCountryBonusBEV()` V1. */
export function getCountryBonusBEV(country: Country): number {
  return COUNTRY_ENERGY[country]?.bonus_bev ?? 0;
}

/** Bonus PHEV courant. Reproduit `getCountryBonusPHEV()` V1. */
export function getCountryBonusPHEV(country: Country): number {
  return COUNTRY_ENERGY[country]?.bonus_phev ?? 0;
}

/** Drapeau emoji. Reproduit `getCountryFlag()` V1. */
export function getCountryFlag(country: Country): string {
  return COUNTRY_ENERGY[country]?.flag ?? '🇪🇺';
}

/** Langue par défaut. Reproduit `getCountryLang()` V1. */
export function getCountryLang(country: Country): CountryData['lang'] {
  return COUNTRY_ENERGY[country]?.lang ?? 'fr';
}
