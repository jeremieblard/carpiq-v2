/**
 * Helpers et scoring pour la recommandation.
 *
 * Source v64.0.4 :
 *   - home (ligne 7489) : helper home charging
 *   - getKm (ligne 11246) : conversion KmCategory → km/an réel
 *   - calcMonthlyTotal (ligne 11234) : TCO + insurance + tax → mensualité
 *   - tcoMonthly_v51 (ligne 20879) : wrapper try/catch
 *   - scorePt (ligne 21683) : scoring d'un powertrain
 *   - carPrefScore (ligne 21478) : scoring d'un véhicule selon pref
 *
 * Refactor V2 : toutes les globales V1 (`st.*`, `activeCountry`) sont passées
 * en params explicites via un `stRef`.
 */

import type {
  Vehicle,
  Powertrain,
  Country,
  KmCategory,
  TripsCategory,
  Charging,
  Urban,
  AgeRange,
  DeptCode,
  Pref,
  BodySelection,
} from './types';
import { KMM } from './constants/km';
import { calcTco } from './tco-engine';
import { purchAtAge } from './pricing';
import { incForCar } from './incentives';
import { calcInsurance } from './insurance';
import { calcAnnualTax } from './tax';

// ─────────────────────────────────────────────────────────────────────────────
// Référence d'état utilisateur (sous-ensemble de UserState)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Référence d'état utilisateur pour les fonctions de scoring.
 * Plus complet que TcoInputs car le scoring lit aussi pref, body, age conducteur.
 */
export interface ScoringStateRef {
  budget: number;
  km: KmCategory | null;
  trips: TripsCategory | null;
  charging: Charging | null;
  body: readonly BodySelection[];
  bodyMod?: readonly string[] | null;
  pref: Pref | null;
  urban: Urban;
  age: AgeRange;
  dept: DeptCode;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers V1
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Indique si l'utilisateur a la possibilité de recharger à domicile.
 *
 * Source : v64.0.4 ligne 7489 (helper inline).
 *
 * V1 utilise `st.charging === 'socket'` comme proxy.
 */
export function home(charging: Charging | null | undefined): boolean {
  return charging === 'socket';
}

/**
 * Convertit la catégorie km utilisateur en km annuels réels.
 *
 * Source : v64.0.4 ligne 11246.
 *
 *   u10 → ~8 000 km, m20 → ~15 000 km, m35 → ~27 000 km, o35 → ~42 000 km
 *   null/inconnu → 15 000 km (default)
 */
export function getKm(kmCategory: KmCategory | null | undefined): number {
  if (!kmCategory) return 15000;
  return KMM[kmCategory] ?? 15000;
}

// ─────────────────────────────────────────────────────────────────────────────
// calcMonthlyTotal — TCO + insurance + tax → mensualité
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Coût mensuel total d'un véhicule : TCO calc + assurance / 12 + taxe / 12.
 *
 * Source : v64.0.4 ligne 11234.
 *
 * Refactor V2 : prend `stRef` et `country` explicites au lieu de globales.
 */
export function calcMonthlyTotal(
  car: Vehicle,
  age: number,
  stRef: ScoringStateRef,
  country: Country,
): number {
  const km = getKm(stRef.km);
  const net = purchAtAge(car, age, country) - incForCar(car, age);
  const tco = calcTco({
    pt: car.pt,
    newP: car.newP,
    brand: car.brand,
    age,
    km,
    trips: stRef.trips ?? 'mixed',
    charging: stRef.charging ?? 'no',
    urban: stRef.urban,
    dept: stRef.dept,
    country,
    driverAge: stRef.age,
  });
  const ins = calcInsurance(
    car,
    net,
    age,
    stRef.age,
    stRef.dept,
    stRef.urban,
    stRef.charging,
    country,
  );
  const tax = calcAnnualTax(car, net, age, stRef.dept, country);
  return Math.round(tco.mo + ins / 12 + tax / 12);
}

/**
 * Wrapper try/catch autour de calcMonthlyTotal.
 *
 * Source : v64.0.4 ligne 20879 (`tcoMonthly_v51`).
 *
 * V1 retourne 0 si calcul échoue (pour ne pas casser le ranking).
 */
export function tcoMonthly(
  car: Vehicle,
  age: number | null | undefined,
  stRef: ScoringStateRef,
  country: Country,
): number {
  const safeAge = age ?? 0;
  try {
    return calcMonthlyTotal(car, safeAge, stRef, country) || 0;
  } catch {
    return 0;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// scorePt — scoring d'un powertrain
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Score d'un powertrain donné l'état utilisateur. Plus haut = meilleur.
 *
 * Source : v64.0.4 ligne 21683.
 *
 * Logique :
 *   1. Trouve un véhicule représentatif (refPrice/refBrand) du PT sous budget
 *   2. Score de base = 5000 - 3 × tco.mo (calculé sur le véhicule représentatif)
 *   3. Cascade de bonus/malus selon trips × pt × home charging
 *   4. Modifications selon pref utilisateur
 *
 * @param pt          Powertrain à scorer
 * @param DB          Pool de véhicules disponibles
 * @param stRef       État utilisateur
 * @param country     Pays
 */
export function scorePt(
  pt: Powertrain,
  DB: readonly Vehicle[],
  stRef: ScoringStateRef,
  country: Country,
): number {
  const budget = stRef.budget || 25000;
  const km = getKm(stRef.km);
  const tr = stRef.trips ?? 'mixed';
  const h = home(stRef.charging);

  // Cars du PT compatibles budget (à age=0 OU age=2)
  const carsOfPt = DB.filter((car) => {
    if (car.pt !== pt) return false;
    const pp0 = purchAtAge(car, 0, country);
    const pp2 = purchAtAge(car, 2, country);
    return pp0 <= budget || pp2 <= budget;
  });

  let refPrice: number;
  let refBrand: string;

  if (carsOfPt.length > 0) {
    const sorted = [...carsOfPt].sort((a, b) => a.newP - b.newP);
    const median = sorted[Math.floor(sorted.length / 2)];
    refPrice = Math.min(budget, median.newP);
    refBrand = median.brand;
  } else {
    // Fallback : refPrice par défaut selon pt
    const defaults: Record<Powertrain, number> = {
      ice: 22000,
      hev: 26000,
      phev: 38000,
      bev: 34000,
      die: 24000,
    };
    refPrice = defaults[pt] ?? 25000;
    refBrand = 'toyota';
  }

  // TCO de base
  const tc = calcTco({
    pt,
    newP: refPrice,
    brand: refBrand || 'toyota',
    age: 0,
    km,
    trips: tr,
    charging: stRef.charging ?? 'no',
    urban: stRef.urban,
    dept: stRef.dept,
    country,
    driverAge: stRef.age,
  });

  let s = 5000 - 3 * tc.mo;

  // Bonus/malus selon trips × pt
  if (pt === 'hev' && (tr === 'short' || tr === 'mixed')) s += 120;
  if (pt === 'die' && (tr === 'long' || tr === 'vlong')) s += 80;
  if (pt === 'die' && tr === 'short') s -= 100;
  if (pt === 'bev' && h && tr !== 'vlong') s += 100;
  if (pt === 'bev' && !h) s -= 180;
  if (pt === 'phev' && !h && (tr === 'long' || tr === 'vlong')) s -= 160;
  if (pt === 'phev' && !h) s -= 80;
  if (pt === 'ice' && tr === 'short') s -= 80;

  // Modifications selon pref
  if (stRef.pref === 'cost') {
    s = 5000 - 4 * tc.mo;
  } else if (stRef.pref === 'ratio') {
    const ratioBonus: Record<string, number> = {
      toyota: 60,
      lexus: 60,
      honda: 50,
      mazda: 40,
      hyundai: 20,
      kia: 20,
    };
    s += ratioBonus[refBrand] ?? 20;
  } else if (stRef.pref === 'premium') {
    if (pt === 'bev') s += 150;
    if (pt === 'phev') s += 80;
    if (pt === 'ice') s -= 100;
  } else if (stRef.pref === 'sport') {
    if (pt === 'bev') s += 120;
    if (pt === 'phev') s += 60;
    if (pt === 'hev') s -= 40;
  } else if (stRef.pref === 'eco') {
    if (pt === 'bev') s += 200;
    if (pt === 'phev') s += 100;
    if (pt === 'hev') s += 80;
    if (pt === 'die') s -= 150;
    if (pt === 'ice') s -= 50;
  } else if (stRef.pref === 'family') {
    if (pt === 'hev') s += 40;
    if (pt === 'phev' && h) s += 30;
  }

  return s;
}

// ─────────────────────────────────────────────────────────────────────────────
// carPrefScore — scoring d'un véhicule selon pref (utilisé dans ptComp)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Score un véhicule selon la pref utilisateur pour le tri ptComp.
 *
 * Source : v64.0.4 ligne 21478.
 *
 * Plus haut = meilleur. Utilisé pour choisir le véhicule "représentatif"
 * d'un powertrain dans la grille ptComp.
 *
 * Note : la logique exacte V1 dépend de pref + caractéristiques (newP, brand).
 * À ce stade Palier 3c, on porte une version simplifiée basée sur le prix
 * (median proche du budget). Si la baseline diverge, on raffinera.
 */
export function carPrefScore(
  car: Vehicle,
  pt: Powertrain,
  stRef: ScoringStateRef,
): number {
  // Version simplifiée : score inverse de la distance au budget
  // (le véhicule le plus proche du budget = meilleur représentant)
  const distance = Math.abs(car.newP - stRef.budget);
  let score = -distance;

  // Bonus selon pref (heuristiques V1 approximatives)
  if (stRef.pref === 'premium') {
    const premiumBrands = ['bmw', 'mercedes', 'audi', 'volvo', 'lexus', 'porsche'];
    if (premiumBrands.includes(car.brand.toLowerCase())) score += 5000;
  }
  if (stRef.pref === 'cost' || stRef.pref === 'ratio') {
    // Préférer moins cher
    score = -car.newP;
  }
  if (stRef.pref === 'sport') {
    const sportBrands = ['bmw', 'porsche', 'audi', 'cupra'];
    if (sportBrands.includes(car.brand.toLowerCase())) score += 5000;
  }

  return score;
}
