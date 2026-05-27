/**
 * Strict segment matching (D-65, v62.13).
 *
 * Portage de `computeMatchLevel_v62_13` et helpers depuis v64.0.4 lignes 21339+.
 *
 * Fonction principale : `computeMatchLevel(car, bodySegs, lang)` retourne le niveau
 * de match du véhicule par rapport aux segments demandés :
 *   - `strict`          : véhicule match exactement un des segments demandés
 *   - `segment_widened` : match seulement après expansion du segment
 *   - `none`            : aucun match même après expansion
 *
 * Le badge vert ✓ "Respecte tous vos critères" s'affiche sur la carte hero
 * uniquement quand `level === 'strict'` ET que l'utilisateur a explicitement
 * demandé un body segment (`bodySegs.length > 0`).
 *
 * Refactor V2 : pas de dépendance globale. `bodySegs` passé en paramètre
 * (V1 appelait `getBodySegs()` qui lisait `st.body`).
 *
 * Note : `carSegsFromCatalog` (qui lit le catalogue chargé async) sera ajouté
 * au Palier 3c avec le chargement de `vehicle_catalog.json`. Pour l'instant,
 * `carMatchesSegs` utilise uniquement `car.seg` (champ legacy direct du DB).
 */

import type { Vehicle, Segment } from './types';
import { SEG_RANK, SEG_LABEL_FR, SEG_LABEL_EN } from './constants/segments-meta';

/** Langues supportées pour les labels segment. */
export type LabelLang = 'fr' | 'en';

/** Niveaux de match possibles entre un véhicule et les segments demandés. */
export type MatchLevelTag = 'strict' | 'segment_widened' | 'none';

/** Codes d'explication pour le niveau de match. */
export type MatchExplanation =
  | null
  | 'segment_widened'
  | 'no_segment_match'
  | 'no_option_in_age';

/**
 * Résultat de `computeMatchLevel` :
 *   - level         : strict / segment_widened / none
 *   - explanation   : code i18n pour expliquer le widen/no-match
 *   - requestedSeg  : label du segment demandé (lang-dépendant)
 *   - actualSeg     : label du segment réel du véhicule (si différent)
 */
export interface MatchLevelResult {
  level: MatchLevelTag;
  explanation: MatchExplanation;
  requestedSeg: string | null;
  actualSeg?: string | null;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers : matching et labels
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Vérifie si un véhicule matche au moins un des segments demandés.
 *
 * Source : v64.0.4 ligne 20842 (`carMatchesSegs_v609`).
 *
 * Version Palier 3b : utilise uniquement `car.seg` (champ legacy direct).
 * Version Palier 3c : préfère `carSegsFromCatalog(car)` si le catalog est chargé.
 *
 * @returns `true` si `requestedSegs` est vide (pas de filtre), ou si l'un des
 *          segments du véhicule est dans `requestedSegs`.
 */
export function carMatchesSegs(
  car: Vehicle,
  requestedSegs: readonly Segment[],
): boolean {
  if (!requestedSegs || requestedSegs.length === 0) return true;
  return (car.seg ?? []).some((s) => requestedSegs.includes(s));
}

/**
 * Étend les segments selon le strict matching v62.13.
 *
 * Source : v64.0.4 ligne 21324 (`expandSegments_v62_13`).
 *
 * Logique : pour chaque segment demandé, ajoute tous les segments dont le rank
 * (SEG_RANK) diffère d'au plus ±1. C'est moins agressif que `_expandSegments`
 * du module body-segments (qui est utilisé pour l'assouplissement progressif).
 *
 * Exemple :
 *   - bodySegs = ['saloon'] (rank 4)
 *   - rank set = {4}
 *   - segments ajoutés : tous ceux de rank 3, 4, 5
 *     → compact, compact_break, coupe_sport (rank 3)
 *     → saloon, saloon_break, suv_compact, awd, mono (rank 4)
 *     → suv_family, executive (rank 5)
 */
export function expandSegmentsForMatch(bodySegs: readonly Segment[]): Segment[] {
  if (!bodySegs || bodySegs.length === 0) return [];
  const rankSet = new Set(bodySegs.map((s) => SEG_RANK[s] ?? 3));
  const expanded = new Set<Segment>(bodySegs);
  for (const rank of rankSet) {
    for (const seg in SEG_RANK) {
      const segRank = SEG_RANK[seg];
      if (Math.abs(segRank - rank) <= 1) {
        expanded.add(seg as Segment);
      }
    }
  }
  return [...expanded];
}

/**
 * Label humain du segment principal d'un véhicule.
 *
 * Source : v64.0.4 ligne 21144 (`getSegmentLabel_v62_13`).
 *
 * Prend le PREMIER segment de la liste comme étant le label représentatif.
 * Si le segment n'a pas de label dans la map, retourne le segment brut.
 */
export function getSegmentLabel(
  segs: readonly Segment[] | Segment | null | undefined,
  lang: LabelLang,
): string | null {
  if (!segs || (Array.isArray(segs) && segs.length === 0)) return null;
  const map = lang === 'fr' ? SEG_LABEL_FR : SEG_LABEL_EN;
  const primary = Array.isArray(segs) ? segs[0] : segs;
  return map[primary] ?? primary;
}

/**
 * Label humain du segment DEMANDÉ par l'utilisateur (basé sur `bodySegs`).
 *
 * Source : v64.0.4 ligne 21152 (`getRequestedSegmentLabel_v62_13`).
 */
export function getRequestedSegmentLabel(
  bodySegs: readonly Segment[],
  lang: LabelLang,
): string | null {
  if (!bodySegs || bodySegs.length === 0) return null;
  return getSegmentLabel(bodySegs, lang);
}

// ─────────────────────────────────────────────────────────────────────────────
// computeMatchLevel — fonction principale
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Calcule le niveau de match d'un véhicule par rapport aux segments demandés.
 *
 * Source : v64.0.4 ligne 21339 (`computeMatchLevel_v62_13`).
 *
 * Logique :
 *   1. Si pas de véhicule → `none` avec explanation `no_option_in_age`
 *   2. Si bodySegs vide → toujours `strict` (pas de filtre = match)
 *   3. Match strict : `car.seg` intersecte `bodySegs` → `strict`
 *   4. Match étendu : `car.seg` intersecte `expandSegmentsForMatch(bodySegs)` → `segment_widened`
 *   5. Sinon → `none`
 *
 * @param car      Véhicule à évaluer (peut être null en cas d'absence d'option).
 * @param bodySegs Segments demandés par l'utilisateur (résolus par getBodySegs).
 * @param lang     Langue pour les labels (fr/en).
 */
export function computeMatchLevel(
  car: Vehicle | null,
  bodySegs: readonly Segment[],
  lang: LabelLang = 'fr',
): MatchLevelResult {
  if (!car) {
    return {
      level: 'none',
      explanation: 'no_option_in_age',
      requestedSeg: null,
      actualSeg: null,
    };
  }

  if (!bodySegs || bodySegs.length === 0) {
    return { level: 'strict', explanation: null, requestedSeg: null };
  }

  // Match strict
  if (carMatchesSegs(car, bodySegs)) {
    return { level: 'strict', explanation: null, requestedSeg: null };
  }

  // Match étendu (expansion ±1 rank)
  const expanded = expandSegmentsForMatch(bodySegs);
  if (carMatchesSegs(car, expanded)) {
    return {
      level: 'segment_widened',
      explanation: 'segment_widened',
      requestedSeg: getRequestedSegmentLabel(bodySegs, lang),
      actualSeg: getSegmentLabel(car.seg, lang),
    };
  }

  // Pas de match
  return {
    level: 'none',
    explanation: 'no_segment_match',
    requestedSeg: getRequestedSegmentLabel(bodySegs, lang),
  };
}
