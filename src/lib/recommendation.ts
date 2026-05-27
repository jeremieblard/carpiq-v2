/**
 * Recommendation engine V2 — bestPt + getRec + _rankWithRelaxation_v53.
 *
 * Source v64.0.4 :
 *   - bestPt (ligne 21725) : meilleur powertrain pour l'utilisateur
 *   - getRec (ligne 21928) : recommandation complète (best + refCar + ptComp)
 *   - _rankWithRelaxation_v53 (ligne 20995) : ranking avec assouplissement progressif
 *
 * Refactor V2 : pas de globale, tout passé en params. Retourne un objet DONNÉES
 * pur (pas de HTML). La couche UI génère le HTML séparément.
 */

import type {
  Vehicle,
  Powertrain,
  Country,
  Segment,
  TcoResult,
} from './types';
import { calcTco } from './tco-engine';
import { purchAtAge } from './pricing';
import { incForCar } from './incentives';
import {
  getBodySegs,
  wantsAWD,
  carHasAWD,
  carHasAWD_v609,
} from './body-segments';
import { carHasAWDFromCatalog } from './catalog';
import { applyFilters } from './filters';
import type { FilterStateRef } from './filters';
import {
  scorePt,
  carPrefScore,
  tcoMonthly,
  getKm,
  home,
} from './scoring';
import type { ScoringStateRef } from './scoring';

// ─────────────────────────────────────────────────────────────────────────────
// Types des outputs Palier 3c
// ─────────────────────────────────────────────────────────────────────────────

/** Élément de la grille comparative ptComp. */
export interface PtCompItem {
  pt: Powertrain;
  mo: number;
  gp: number;
  name: string;
}

/** Résultat agrégé pour ranking individuel d'un véhicule (level 0-3). */
export interface RankedVehicle {
  car: Vehicle;
  tcoMonthly: number;
  age: number;
  effectiveAge: number;
  purchPrice: number;
  net: number;
  level: number;
}

/** Résultat de _rankWithRelaxation_v53. */
export interface RankingResult {
  rankings: RankedVehicle[];
  /** Level atteint (0-3 = match, 4 = abandon). */
  level: number;
}

/** Résultat brut de getRec (données pures, sans HTML). */
export interface RecResult {
  best: Powertrain;
  refCar: Vehicle;
  bTco: TcoResult;
  iceTco: TcoResult;
  bodySegs: Segment[];
  ptComp: PtCompItem[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Constantes
// ─────────────────────────────────────────────────────────────────────────────

/** Année courante V2 (utilisée pour effectiveAge). */
const CURRENT_YEAR = 2026;

/** Ages testés par bestPt et ptComp. */
const TEST_AGES: readonly number[] = [0, 2, 5];

/** Tous les powertrains dans l'ordre de présentation. */
const ALL_POWERTRAINS: readonly Powertrain[] = ['ice', 'hev', 'phev', 'bev', 'die'];

// ─────────────────────────────────────────────────────────────────────────────
// bestPt — meilleur powertrain pour l'utilisateur
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Sélectionne le meilleur powertrain pour l'utilisateur.
 *
 * Source : v64.0.4 ligne 21725.
 *
 * Algorithme :
 *   1. Trie les 5 PT par scorePt(pt) décroissant
 *   2. Premier passage : prend le premier PT ayant ≥1 véhicule (age 0/2/5)
 *      sous budget ET matchant body+AWD
 *   3. Second passage : prend le premier PT sous budget (sans contrainte body/AWD)
 *   4. Sinon retourne le top scorePt brut
 *
 * @param DB      Pool de véhicules
 * @param stRef   État utilisateur
 * @param country Pays
 */
export function bestPt(
  DB: readonly Vehicle[],
  stRef: ScoringStateRef,
  country: Country,
): Powertrain {
  const ranked = [...ALL_POWERTRAINS].sort(
    (a, b) => scorePt(b, DB, stRef, country) - scorePt(a, DB, stRef, country),
  );
  const bodySegs = getBodySegs(stRef.body);
  const awdWanted = wantsAWD(stRef.bodyMod);

  // Premier passage : strict
  for (const pt of ranked) {
    const hasMatch = TEST_AGES.some((age) =>
      DB.some((c) => {
        if (c.pt !== pt) return false;
        const net = purchAtAge(c, age, country) - incForCar(c, age);
        const segOk =
          bodySegs.length === 0 ||
          (c.seg ?? []).some((s) => bodySegs.includes(s));
        const awdOk = !awdWanted || carHasAWD(c);
        return net <= stRef.budget && segOk && awdOk;
      }),
    );
    if (hasMatch) return pt;
  }

  // Second passage : sans contrainte body/AWD
  for (const pt of ranked) {
    const hasMatch = TEST_AGES.some((age) =>
      DB.some(
        (c) =>
          c.pt === pt &&
          purchAtAge(c, age, country) - incForCar(c, age) <= stRef.budget,
      ),
    );
    if (hasMatch) return pt;
  }

  // Aucun fallback : top scorePt brut
  return ranked[0];
}

// ─────────────────────────────────────────────────────────────────────────────
// _rankWithRelaxation_v53 — ranking avec assouplissement progressif
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Effectue le ranking d'un pool en tentant chaque niveau d'assouplissement (0-3).
 *
 * Source : v64.0.4 ligne 20995.
 *
 * Logique :
 *   - Pour chaque level 0..3 : applique applyFilters, scorePar tcoMonthly
 *   - Retourne le premier level non vide
 *   - Si tous vides : retourne level=4 (abandon)
 *
 * Inclut le clamp `effectiveAge` v64.0.4 : si la génération du véhicule
 * (genYear) est postérieure à `age` années en arrière, force l'âge effectif
 * à `CURRENT_YEAR - genYear`.
 *
 * @param DB      Pool de véhicules
 * @param stRef   État utilisateur (FilterStateRef + age + dept + etc.)
 * @param age     Catégorie d'âge demandée
 * @param country Pays
 */
export function rankWithRelaxation(
  DB: readonly Vehicle[],
  stRef: FilterStateRef & ScoringStateRef,
  age: number,
  country: Country,
): RankingResult {
  for (let level = 0; level <= 3; level++) {
    const pool = applyFilters(DB, stRef, age, level, country);
    if (pool.length === 0) continue;

    const scored: RankedVehicle[] = pool
      .map((car) => {
        // v64.0.4 : effectiveAge clamp si génération trop récente
        const effectiveAge =
          (car as Vehicle & { genYear?: number }).genYear &&
          CURRENT_YEAR - (car as Vehicle & { genYear?: number }).genYear! < age
            ? Math.max(0, CURRENT_YEAR - (car as Vehicle & { genYear?: number }).genYear!)
            : age;
        const purch = purchAtAge(car, effectiveAge, country);
        const inc = incForCar(car, effectiveAge);
        return {
          car,
          tcoMonthly: tcoMonthly(car, effectiveAge, stRef, country),
          age,
          effectiveAge,
          purchPrice: purch,
          net: purch - inc,
          level,
        };
      })
      .filter((s) => s.tcoMonthly > 0);

    if (scored.length > 0) {
      scored.sort((a, b) => a.tcoMonthly - b.tcoMonthly);
      return { rankings: scored, level };
    }
  }

  return { rankings: [], level: 4 };
}

// ─────────────────────────────────────────────────────────────────────────────
// getRec — recommandation complète
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Recommandation complète : best + refCar + bTco + iceTco + bodySegs + ptComp.
 *
 * Source : v64.0.4 ligne 21928 (partie données pures, sans HTML).
 *
 * Logique :
 *   1. best = bestPt(DB, stRef, country)
 *   2. bodySegs = getBodySegs(stRef.body)
 *   3. refCar = premier véhicule du DB matchant best + body + AWD
 *      fallback : premier du best, sinon DB[0]
 *   4. bTco = calcTco sur refCar à age=0
 *   5. iceRef = premier véhicule ICE du DB
 *   6. iceTco = calcTco sur iceRef à age=0
 *   7. ptComp = pour chaque PT, le véhicule représentatif sous budget+segOk
 *      (fallback wider si pool vide)
 *
 * Le HTML (warns, why, localBar, beHtml) NE FAIT PAS PARTIE de cette fonction
 * en V2. Il sera généré par la couche UI à partir de l'objet RecResult.
 */
export function getRec(
  DB: readonly Vehicle[],
  stRef: ScoringStateRef,
  country: Country,
): RecResult {
  const best = bestPt(DB, stRef, country);
  const bodySegs = getBodySegs(stRef.body);
  const km = getKm(stRef.km);
  const trips = stRef.trips ?? 'mixed';
  const awdWanted = wantsAWD(stRef.bodyMod);

  // refCar : cascade de 3 niveaux
  const refCar: Vehicle =
    DB.find(
      (c) =>
        c.pt === best &&
        (bodySegs.length === 0 ||
          (c.seg ?? []).some((s) => bodySegs.includes(s))) &&
        (!awdWanted || carHasAWD(c)),
    ) ??
    DB.find((c) => c.pt === best) ??
    DB[0];

  // TCO sur refCar (age 0)
  const bTco: TcoResult = calcTco({
    pt: best,
    newP: refCar.newP,
    brand: refCar.brand,
    age: 0,
    km,
    trips,
    charging: stRef.charging ?? 'no',
    urban: stRef.urban,
    dept: stRef.dept,
    country,
    driverAge: stRef.age,
  });

  // ICE reference (pour comparaison)
  const iceRef: Vehicle = DB.find((c) => c.pt === 'ice') ?? DB[0];
  const iceTco: TcoResult = calcTco({
    pt: 'ice',
    newP: iceRef.newP,
    brand: iceRef.brand,
    age: 0,
    km,
    trips,
    charging: stRef.charging ?? 'no',
    urban: stRef.urban,
    dept: stRef.dept,
    country,
    driverAge: stRef.age,
  });

  // ptComp : grille comparative par powertrain
  // Inclut 'die' si best=die OU trips long/vlong, sinon exclut
  const ptList: Powertrain[] =
    best === 'die' || trips === 'long' || trips === 'vlong'
      ? ['ice', 'hev', 'phev', 'bev', 'die']
      : ['ice', 'hev', 'phev', 'bev'];

  const ptComp: PtCompItem[] = ptList
    .map((pt): PtCompItem | null => {
      const pool = DB.filter((car) => {
        if (car.pt !== pt) return false;
        const net = purchAtAge(car, 0, country) - incForCar(car, 0);
        const segOk =
          bodySegs.length === 0 ||
          (car.seg ?? []).some((s) => bodySegs.includes(s));
        return net <= stRef.budget && segOk;
      });
      const wider = DB.filter((c) => c.pt === pt);
      const candidates = pool.length > 0 ? pool : wider;
      if (candidates.length === 0) return null;

      const ref = [...candidates].sort(
        (a, b) => carPrefScore(b, pt, stRef) - carPrefScore(a, pt, stRef),
      )[0];

      if (!ref) return null;

      const tc = calcTco({
        pt,
        newP: ref.newP,
        brand: ref.brand,
        age: 0,
        km,
        trips,
        charging: stRef.charging ?? 'no',
        urban: stRef.urban,
        dept: stRef.dept,
        country,
        driverAge: stRef.age,
      });

      return {
        pt,
        mo: tc.mo,
        gp: purchAtAge(ref, 0, country) - incForCar(ref, 0),
        name: ref.name,
      };
    })
    .filter((x): x is PtCompItem => x !== null);

  return {
    best,
    refCar,
    bTco,
    iceTco,
    bodySegs,
    ptComp,
  };
}
