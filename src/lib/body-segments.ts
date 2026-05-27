/**
 * Logique segments véhicule selon les choix body/bodyMod de l'utilisateur.
 *
 * Portage strict de :
 *   - getBodySegs (v64.0.4 ligne 20745)
 *   - wantsAWD (ligne 20769)
 *   - carHasAWD (ligne 20773)
 *   - isSportCar (ligne 20867)
 *   - _expandSegments (ligne 20890)
 *   - _relaxedDriver (ligne 20924)
 *   - segRank (ligne 20718)
 *
 * Refactor V2 : toutes les dépendances V1 globales (`st.body`, `st.bodyMod`)
 * sont passées en paramètres explicites pour rendre les fonctions pures.
 *
 * Note : `carHasAWD_v609` (qui utilise le catalogue) sera ajouté en Palier 3c
 * quand on aura `getCatalogEntryForCar` et le chargement vehicle_catalog.
 */

import type { BodySelection, Pref, Vehicle, Segment } from './types';
import { SEG_MAP, MOD_MAP, SEG_RANK } from './constants/segments-meta';
import { SPORT_KEYWORDS } from './constants/driver-pools';

// ─────────────────────────────────────────────────────────────────────────────
// getBodySegs — résolution body[] → Segment[]
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Résout les sélections body+modifiers de l'utilisateur en liste de segments.
 *
 * Source : v64.0.4 ligne 20745.
 *
 * Logique :
 *   1. Sépare body[] en `bases` (mini, small, compact...) et `mods` (suv, break, awd)
 *   2. Si aucune base → retourne [] (pas de filtre segment)
 *   3. Calcule segs = union des SEG_MAP[base] pour chaque base
 *   4. Si modifier `suv` :
 *      - base mini/small → REMPLACE segs par [suv_urban, suv_compact]
 *      - base saloon     → REMPLACE segs par [suv_compact, suv_family]
 *   5. Si modifier `break` :
 *      - small → AJOUTE small_break
 *      - compact/saloon → AJOUTE compact_break + saloon_break
 *   6. Si modifier `awd` → AJOUTE suv_compact + suv_family
 *
 * @param body Tableau des sélections body+mods de l'utilisateur (vide accepté).
 */
export function getBodySegs(body: readonly BodySelection[]): Segment[] {
  if (!body.length) return [];

  const bases = body.filter((b): b is keyof typeof SEG_MAP => b in SEG_MAP);
  const mods = body.filter((b): b is keyof typeof MOD_MAP => b in MOD_MAP);
  if (!bases.length) return [];

  let segs: Set<Segment> = new Set(bases.flatMap((b) => SEG_MAP[b] ?? []));

  if (mods.includes('suv')) {
    const suvSegs = new Set<Segment>();
    if (bases.includes('mini') || bases.includes('small')) {
      suvSegs.add('suv_urban');
      suvSegs.add('suv_compact');
    }
    if (bases.includes('saloon')) {
      suvSegs.add('suv_compact');
      suvSegs.add('suv_family');
    }
    segs = suvSegs;
  }

  if (mods.includes('break')) {
    const breakSegs = new Set<Segment>(segs);
    // Note : V1 vérifie `segs.has("small")` mais 'small' n'est jamais dans segs si
    // l'utilisateur a coché "small_break" ; on doit checker en amont via la base.
    // En V1, ce code teste sur `segs` qui contient déjà SEG_MAP[base]. OK conservé.
    if ((segs as Set<string>).has('small')) {
      // 'small_break' n'est pas dans `Segment` strict mais V1 l'ajoute. On le caste.
      breakSegs.add('small_break' as Segment);
    }
    if ((segs as Set<string>).has('compact') || (segs as Set<string>).has('saloon')) {
      breakSegs.add('compact_break');
      breakSegs.add('saloon_break');
    }
    segs = breakSegs;
  }

  if (mods.includes('awd')) {
    segs = new Set<Segment>([...segs, 'suv_compact', 'suv_family']);
  }

  return [...segs];
}

// ─────────────────────────────────────────────────────────────────────────────
// AWD detection
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Indique si l'utilisateur a explicitement demandé du AWD (4 roues motrices).
 *
 * Source : v64.0.4 ligne 20769.
 *
 * Refactor V2 : prend `bodyMod` explicitement (V1 lisait `st.bodyMod` global).
 */
export function wantsAWD(bodyMod: readonly string[] | null | undefined): boolean {
  return (bodyMod ?? []).includes('awd');
}

/** Mots-clés AWD recherchés dans le nom et les pros d'un véhicule. */
const AWD_KEYWORDS: readonly string[] = [
  'awd', '4wd', '4x4', 'quattro', 'xdrive', '4motion',
  'e-awd', 'traction intégrale', 'integral',
];

/** Regex AWD pour matcher sur le nom du véhicule. */
const AWD_NAME_REGEX = /\b(awd|4x4|4wd|xc60|outland)\b/;

/**
 * Détecte si un véhicule est AWD, basé sur ses pros (pf/pe) et son nom.
 *
 * Source : v64.0.4 ligne 20773.
 *
 * Version legacy : utilise uniquement le nom et les pros (sans catalog).
 * Pour la version catalog-aware (priorise les données drivetrains du catalog),
 * voir `carHasAWD_v609` plus bas.
 */
export function carHasAWD(car: Vehicle): boolean {
  const allPros = [
    ...(car.pf ?? []),
    ...(car.pe ?? []),
  ].join(' ').toLowerCase();
  if (AWD_KEYWORDS.some((kw) => allPros.includes(kw))) return true;
  const name = (car.name ?? '').toLowerCase();
  return AWD_NAME_REGEX.test(name);
}

/**
 * Détecte AWD avec priorité au catalog (Palier 3c).
 *
 * Source : v64.0.4 ligne 20812 (`carHasAWD_v609`).
 *
 * Logique :
 *   1. Si une entry catalog existe avec drivetrains : utilise cette info
 *      (true si au moins un dt a awd=true, false sinon)
 *   2. Sinon fallback sur `carHasAWD` (legacy nom + pros)
 *
 * Importé séparément pour éviter dépendance circulaire dans certaines passes.
 */
export function carHasAWD_v609(
  car: Vehicle,
  carHasAWDFromCatalogFn: (c: Vehicle) => boolean | null,
): boolean {
  const fromCat = carHasAWDFromCatalogFn(car);
  if (fromCat !== null) return fromCat;
  return carHasAWD(car);
}

// ─────────────────────────────────────────────────────────────────────────────
// Sport detection
// ─────────────────────────────────────────────────────────────────────────────

/** Marques considérées comme intrinsèquement sport. */
const ALWAYS_SPORT_BRANDS: ReadonlySet<string> = new Set([
  'alpine', 'lotus', 'polestar', 'porsche',
]);

/**
 * Détecte si un véhicule est "sport" (utilisé par filter avec pref=sport).
 *
 * Source : v64.0.4 ligne 20867.
 *
 * Logique :
 *   1. Si la marque est Alpine, Lotus, Polestar ou Porsche → toujours sport
 *   2. Sinon, regarde le nom du véhicule vs SPORT_KEYWORDS
 */
export function isSportCar(car: Vehicle): boolean {
  if (!car) return false;
  const brand = (car.brand ?? '').toLowerCase();
  if (ALWAYS_SPORT_BRANDS.has(brand)) return true;
  const name = (car.name ?? '').toLowerCase();
  return SPORT_KEYWORDS.some((kw) => name.includes(kw));
}

// ─────────────────────────────────────────────────────────────────────────────
// Expansion de segments pour assouplissement (niveaux 1 et 2)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Étend les segments demandés selon le niveau d'assouplissement.
 *
 * Source : v64.0.4 ligne 20890.
 *
 *   - level 0 : retourne `baseSegs` tels quels (pas d'expansion)
 *   - level 1 : ajoute variantes morphologiques de la MÊME catégorie
 *     (saloon → +saloon_break +coupe_sport, compact → +compact_break, small → +small_break)
 *   - level 2 : étend d'UN cran depuis les baseSegs ORIGINAUX
 *     (saloon → +compact +compact_break +suv_compact, compact → +suv_urban +suv_compact)
 *
 * @remarks
 * v62.3 fix : les conditions de cascade utilisent les baseSegs ORIGINAUX,
 * pas le set étendu en cours, pour éviter saloon → compact → small (trop loin).
 */
export function _expandSegments(
  baseSegs: readonly Segment[],
  level: number,
): Segment[] {
  if (!baseSegs || baseSegs.length === 0) return [];

  const set = new Set<Segment>(baseSegs);
  const original = new Set<Segment>(baseSegs);

  if (level >= 1) {
    if (original.has('saloon') || original.has('executive')) {
      set.add('saloon_break');
      set.add('coupe_sport');
    }
    if (original.has('compact')) set.add('compact_break');
    if ((original as Set<string>).has('small')) {
      set.add('small_break' as Segment);
    }
  }

  if (level >= 2) {
    if (original.has('saloon') || original.has('executive')) {
      set.add('compact');
      set.add('compact_break');
      set.add('suv_compact');
    }
    if (original.has('compact') || original.has('compact_break')) {
      set.add('suv_urban');
      set.add('suv_compact');
    }
  }

  return Array.from(set);
}

// ─────────────────────────────────────────────────────────────────────────────
// Relaxation du driver (niveau 3 de l'assouplissement)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Retourne le driver "relaxé" si applicable au niveau 3 d'assouplissement.
 *
 * Source : v64.0.4 ligne 20924.
 *
 * Logique v62.3 :
 *   - `ratio` peut être relaxé vers `cost` (les deux sont mainstream)
 *   - `premium` et `sport` NE SONT JAMAIS relaxés (choix explicites de l'utilisateur)
 *   - Les autres (eco, family, cost) retournent null
 *
 * @returns Le pref relaxé, ou null si pas de relaxation applicable.
 */
export function _relaxedDriver(currentDriver: Pref | null): Pref | null {
  return currentDriver === 'ratio' ? 'cost' : null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Segment rank d'un véhicule
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Rang du segment le plus élevé d'un véhicule.
 *
 * Source : v64.0.4 ligne 20718.
 *
 * Utilisé pour positionner un véhicule dans la hiérarchie des tailles.
 * Si car.seg est vide, fallback sur `compact` (rank 3).
 */
export function segRank(car: Vehicle): number {
  const segs = car.seg && car.seg.length > 0 ? car.seg : ['compact' as Segment];
  return Math.max(...segs.map((s) => SEG_RANK[s] ?? 1));
}
