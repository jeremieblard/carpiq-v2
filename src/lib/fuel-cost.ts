/**
 * Calcul du coût annuel d'énergie (carburant ou électricité) d'un véhicule.
 *
 * Portage strict de `fuelCost(pt, trips, km)` et de ses helpers depuis
 * `carpiq-layer1-v64_0_4.html` (lignes 11148-11200 et amont).
 *
 * Toutes les anomalies identifiées en V1 sont CONSERVÉES en l'état pour
 * garantir la reproductibilité des 96 cas baseline. Elles sont traitées
 * dans le backlog `docs/anomalies/BACKLOG-HARDENING-MOTEUR-TCO.md`.
 *
 * Refactor V2 : toutes les fonctions sont pures, les dépendances V1
 * (st.charging, st.urban, st.dept, activeCountry) sont passées en
 * paramètres explicites.
 */

import type { Powertrain, TripsCategory, Charging, Country, Urban, DeptCode } from './types';
import { CONS, WLTP } from './constants/consumption';
import { COUNTRY_ENERGY } from './constants/country-data';
import { DD, DD_DEF } from './constants/dept-data';
import type { DeptData } from './constants/dept-data';

// ─────────────────────────────────────────────────────────────────────────────
// Constantes globales (extraites de v64.0.4 ligne 10451)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Prix de l'essence "fallback global", utilisé par `fp()`.
 *
 * ⚠ ANOMALIE A1 : cette valeur (1.72 €/L) est utilisée par `fuelCost` pour
 * ICE/HEV/PHEV au lieu du prix pays-dépendant `getFP(country)`. Bug latent
 * V1 conservé en V2 pour reproductibilité baseline. Cf. backlog Hardening.
 */
const FP_BASE = 1.72;

// ─────────────────────────────────────────────────────────────────────────────
// Helpers — prix énergie par pays
// ─────────────────────────────────────────────────────────────────────────────

/** Retourne les données énergie pour un pays (fallback FR si pays inconnu). */
function getEnergyData(country: Country) {
  return COUNTRY_ENERGY[country] ?? COUNTRY_ENERGY.fr;
}

/** Prix essence (€/L) pour le pays donné. */
export function getFP(country: Country): number {
  return getEnergyData(country).fp;
}

/** Prix électricité à domicile (€/kWh) pour le pays donné. */
export function getEP(country: Country): number {
  return getEnergyData(country).ep;
}

/** Prix électricité en borne publique (€/kWh) pour le pays donné. */
export function getEPU(country: Country): number {
  return getEnergyData(country).epu;
}

/**
 * Prix essence "fallback" constant 1.72 €/L.
 *
 * ⚠ ANOMALIE A1 — Conserve le comportement V1 où `fuelCost` ICE/HEV/PHEV
 * utilise cette valeur au lieu de `getFP(country)`. À corriger au Hardening.
 */
function fp(): number {
  return FP_BASE;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers — modificateurs de consommation
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Indique si le conducteur peut charger à domicile (BEV/PHEV).
 *
 * ⚠ Cette fonction n'a pas d'effet utile en V1 car elle est appelée dans une
 * expression virgule `(home(), fp())` où son résultat est ignoré. Conservée
 * pour reproductibilité et pour `phevChargeFactor` qui, lui, utilise la même
 * sémantique. Cf. anomalie A1.
 */
function home(charging: Charging): boolean {
  return charging === 'socket' || charging === 'maybe';
}

/**
 * Facteur de charge à domicile pour PHEV (0..1).
 *
 *   socket → 1   (charge possible, mode élec à plein régime)
 *   maybe  → 0.6 (charge incertaine, mode élec partiel)
 *   no     → 0   (pas de charge, mode thermique uniquement)
 */
function phevChargeFactor(charging: Charging): number {
  if (charging === 'socket') return 1;
  if (charging === 'maybe') return 0.6;
  return 0;
}

/**
 * Pénalité de consommation BEV en hiver, basée sur le département.
 *
 * Formule V1 : 1 + (DD[dept].wp / 100) × 4 / 12
 *   = facteur × (4 mois d'hiver sur 12)
 *
 * Pour FR Paris (wp=18%) : pénalité ≈ 6% sur l'année.
 * Pour FR Alsace (wp=26%) : pénalité ≈ 8.7% sur l'année.
 * Fallback (DD_DEF, wp=15%) : ≈ 5% sur l'année.
 *
 * ⚠ ANOMALIE A4 — DD ne contient que des départements FR. Tous les
 * utilisateurs non-FR retombent sur DD_DEF. À étendre au Hardening.
 */
function bevWinterPen(dept: DeptCode): number {
  const dd: DeptData = (dept && DD[dept]) || DD_DEF;
  return 1 + (dd.wp / 100) * 4 / 12;
}

/**
 * Modificateur urbain selon zone de résidence et powertrain.
 *
 *   city :
 *     - ICE  → ×1.14 (stop-and-go + moteur froid)
 *     - HEV  → ×0.92 (régen freinage compense)
 *     - PHEV → ×0.85 (mode élec en ville)
 *     - BEV  → ×1.02 (clim + embouteillages)
 *     - DIE  → ×1    (pas de modificateur)
 *
 *   rural ou null → ×1 (pas de modificateur)
 *
 * ⚠ ANOMALIE A2 — V1 ne gère pas "rural" dans cette fonction (asymétrie
 * avec la version utilisée par `calcInsurance` qui sait, elle, gérer rural).
 * Conservation V1. À corriger au Hardening.
 */
function urbanMod(pt: Powertrain, urban: Urban): number {
  if (urban !== 'city') return 1;
  if (pt === 'ice') return 1.14;
  if (pt === 'hev') return 0.92;
  if (pt === 'phev') return 0.85;
  if (pt === 'bev') return 1.02;
  return 1;
}

/**
 * Multiplicateur WLTP en fonction du type de trajet et du powertrain.
 *
 * Modélise l'écart entre consommation normée WLTP et consommation réelle :
 *   - ICE : pire en short (1.2), meilleur en vlong (0.88)
 *   - HEV : meilleur en short (0.75, régen), pire en vlong (1.2)
 *   - PHEV : très bas en short (0.3, batterie suffit), très haut en vlong (2.5)
 *   - BEV : équilibré (1 en mixed)
 *   - DIE : meilleur sur long (similaire à ICE)
 */
function wltpMult(pt: Powertrain, trip: TripsCategory): number {
  const m: Record<Powertrain, Record<TripsCategory, number>> = {
    ice: { short: 1.2, mixed: 1.05, long: 0.95, vlong: 0.88 },
    hev: { short: 0.75, mixed: 0.92, long: 1.08, vlong: 1.2 },
    phev: { short: 0.3, mixed: 0.8, long: 1.8, vlong: 2.5 },
    bev: { short: 1.15, mixed: 1, long: 0.95, vlong: 1.3 },
    die: { short: 1.3, mixed: 1.1, long: 0.95, vlong: 0.88 },
  };
  return (m[pt] ?? m.ice)[trip] ?? 1;
}

// ─────────────────────────────────────────────────────────────────────────────
// fuelCost — fonction principale
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Coût annuel d'énergie (carburant ou électricité), en €.
 *
 * Refactor V2 : toutes les dépendances V1 (`st.charging`, `st.urban`, `st.dept`,
 * `activeCountry`) sont passées en paramètres explicites. Le calcul interne
 * reste strictement identique à V1.
 *
 * @param pt       Powertrain du véhicule.
 * @param trips    Catégorie de trajet (short/mixed/long/vlong).
 * @param km       Kilométrage annuel.
 * @param charging Type de chargement disponible (socket/maybe/no).
 * @param urban    Type d'urbanité du conducteur (city/rural/null).
 * @param dept     Code département (pour winter penalty BEV).
 * @param country  Pays (pour prix énergie BEV/PHEV/Diesel — pas ICE/HEV par bug A1).
 *
 * @remarks
 * ⚠ ANOMALIE A1 — En V1, `fuelCost` ICE/HEV/PHEV utilise `fp() = 1.72 €/L`
 * constant au lieu de `getFP(country)`. Seul Diesel utilise correctement
 * le prix pays-dépendant. Conservation V1 ; cf. backlog Hardening.
 */
export function fuelCost(
  pt: Powertrain,
  trips: TripsCategory,
  km: number,
  charging: Charging,
  urban: Urban,
  dept: DeptCode,
  country: Country,
): number {
  const c = CONS[trips] ?? CONS.mixed;
  // Expression virgule V1 : (home(), fp()) → home() évalué pour rien, f = fp() = 1.72
  // ANOMALIE A1 conservée :
  home(charging); // appelé pour reproduire l'effet de bord V1 (aucun en fait)
  const f = fp(); // ⚠ jamais getFP(country) pour ICE/HEV/PHEV — bug A1
  const um = urbanMod(pt, urban);
  const wm = wltpMult(pt, trips);

  if (pt === 'ice') {
    return (km / 100) * c.ice * WLTP.ice * wm * f * um;
  }

  if (pt === 'die') {
    // Seul cas où getFP() est correctement appelé (modulé × 0.88)
    const fp_die = 0.88 * getFP(country);
    return (km / 100) * (c.die ?? c.ice) * WLTP.die * wm * fp_die * um;
  }

  if (pt === 'hev') {
    return (km / 100) * c.hev * WLTP.hev * wm * f * um;
  }

  if (pt === 'phev') {
    const cf = phevChargeFactor(charging);
    if (cf > 0) {
      const elecShare = 0.55 * cf;
      return (
        ((km * elecShare) / 100) * c.pon * WLTP.phev * wm * getEP(country) +
        ((km * (1 - elecShare)) / 100) * c.poff * WLTP.phev * wm * f
      ) * um;
    }
    return (km / 100) * c.poff * WLTP.phev * (2.5 * wm) * f * um;
  }

  if (pt === 'bev') {
    const ep_home = getEP(country);
    const ep_pub = getEPU(country);
    let r: number;
    if (charging === 'socket') {
      r = 0.85 * ep_home + 0.15 * ep_pub;
    } else if (charging === 'maybe') {
      r = 0.5 * ep_home + 0.5 * ep_pub;
    } else if (urban === 'city') {
      r = 0.5 * ep_pub + 0.5 * ep_home;
    } else {
      r = 0.7 * ep_pub + 0.3 * ep_home;
    }
    return (km / 100) * c.bev * WLTP.bev * bevWinterPen(dept) * r * um;
  }

  return 0;
}
