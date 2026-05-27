/**
 * Driver-as-filter (D-32) : pools de marques associés aux préférences utilisateur.
 *
 * Source : v64.0.4 ligne 20858.
 *
 * Le `pref` utilisateur (premium / ratio / cost / sport / eco / family) sert de
 * FILTRE marque, pas de facteur de scoring. Les véhicules dont la marque n'est
 * pas dans `DRIVER_BRAND_POOLS[pref]` sont exclus du pool de candidats.
 *
 * Référence : décision D-32 (driver-as-filter), avril 2026.
 */

import type { Pref } from '../types';

/**
 * Marques associées à chaque préférence utilisateur.
 *
 * Si le pref utilisateur est `null` ou `undefined`, aucun filtre marque n'est appliqué.
 */
export const DRIVER_BRAND_POOLS: Record<Pref, readonly string[]> = {
  premium: [
    'audi', 'bmw', 'mercedes', 'lexus', 'volvo', 'jaguar',
    'land-rover', 'landrover', 'genesis', 'polestar', 'porsche',
    'maserati', 'alfa', 'alfa-romeo', 'mini', 'ds',
  ],
  ratio: [
    'peugeot', 'skoda', 'vw', 'volkswagen', 'ford', 'renault',
    'hyundai', 'kia', 'toyota', 'mazda', 'honda', 'seat',
    'opel', 'nissan',
  ],
  cost: ['dacia', 'mg', 'citroen', 'fiat', 'suzuki', 'spring'],
  sport: [
    'bmw', 'porsche', 'mercedes', 'audi', 'cupra', 'alpine',
    'tesla', 'polestar', 'alfa', 'alfa-romeo', 'subaru', 'lotus',
    'honda', 'ford', 'toyota', 'hyundai', 'kia',
  ],
  eco: [
    'tesla', 'hyundai', 'kia', 'toyota', 'lexus', 'polestar',
    'volvo', 'renault', 'peugeot', 'bmw', 'vw', 'volkswagen',
    'fiat', 'mg', 'dacia', 'citroen', 'byd', 'audi',
    'mercedes', 'ford', 'nissan', 'seat', 'skoda', 'opel', 'mini',
  ],
  family: [
    'skoda', 'peugeot', 'vw', 'volkswagen', 'ford', 'renault',
    'citroen', 'volvo', 'kia', 'hyundai', 'toyota', 'seat',
    'opel', 'dacia', 'nissan', 'fiat',
  ],
} as const;

/**
 * Marques considérées comme premium (utilisé pour heuristiques diverses).
 *
 * Source : v64.0.4 ligne 20858.
 */
export const PREMIUM_BRANDS: ReadonlySet<string> = new Set([
  'bmw', 'mercedes', 'audi', 'volvo', 'lexus', 'porsche',
]);

/**
 * Marques avec gamme sport notable.
 *
 * Source : v64.0.4 ligne 20858.
 */
export const SPORT_BRANDS: ReadonlySet<string> = new Set([
  'bmw', 'cupra', 'tesla', 'audi', 'porsche', 'mg',
]);

/**
 * Mots-clés qui marquent un véhicule comme "sport" dans son nom commercial.
 *
 * Source : v64.0.4 ligne 20858 (suffixe de DRIVER_BRAND_POOLS).
 */
export const SPORT_KEYWORDS: readonly string[] = [
  'm2', 'm3', 'm4', 'm5', 'm8', 'm340', 'm440', 'm550', 'm850', ' m ',
  'amg', '63 amg', '45 amg', '35 amg', '43 amg', '53 amg',
  ' rs ', 'rs3', 'rs4', 'rs5', 'rs6', 'rs7', 'rsq',
  ' s3', ' s4', ' s5', ' s6', ' s7', 'sq2', 'sq5', 'sq7', 'sq8',
  'gti', 'gtd', 'gtx', 'vrs', 'r-line', 'tsi 245', 'tsi 280', 'tsi 300',
  ' golf r', ' tt rs', ' vz', 'cupra', 'quadrifoglio', 'veloce',
  'gt-line', 'rs line', 'mégane rs', 'clio rs', 'megane rs',
  '308 gti', ' gti ', 'trophy', 'gts', 'gt3', 'gt4', 'turbo s', 'turbo',
  'performance', 'plaid', 'type r', 'typer', 'n line', ' n ',
  'i30 n', 'i20 n', 'kona n', 'ev6 gt', 'ioniq 5 n',
  ' st ', 'st-line', 'st line', 'focus rs', 'fiesta rs', 'mustang',
  ' sti', 'wrx', ' gr ', 'gr-', 'gr yaris', 'gr corolla', 'supra',
];
