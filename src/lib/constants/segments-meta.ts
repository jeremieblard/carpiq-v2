/**
 * Métadonnées des segments de carrosserie V1.
 *
 * Source : v64.0.4 lignes 20683-20720 et 21129-21142.
 *
 * Contient :
 *   - SEG_MAP    : mapping body bases sélectionnables → segments véhicule
 *   - MOD_MAP    : mapping body modifiers (suv, break, awd) → comportements
 *   - SEG_RANK   : ordre hiérarchique des segments (mini=1 → suv_large=6)
 *   - SEG_LABEL_FR/EN : labels humains pour affichage UI
 */

import type { Segment, BodyBase, BodyModifier } from '../types';

/**
 * Mapping des bases sélectionnables (BodyBase) vers les segments véhicule.
 *
 * Note : ce mapping est asymétrique :
 *   - `mini` → [mini, small]   (un utilisateur "mini" accepte aussi "small")
 *   - `small` → [small, mini]  (réciproque)
 *   - `compact` → [compact, saloon] (compact accepte saloon)
 *   - `saloon` → [saloon]      (saloon strict)
 *   - `executive` → [executive, saloon]
 *   - `coupe` → [coupe_sport]
 *
 * Source : v64.0.4 ligne 20683.
 */
export const SEG_MAP: Record<BodyBase, readonly Segment[]> = {
  mini: ['mini', 'small'],
  small: ['small', 'mini'],
  compact: ['compact', 'saloon'],
  saloon: ['saloon'],
  executive: ['executive', 'saloon'],
  coupe: ['coupe_sport'],
} as const;

/**
 * Comportements associés aux modifiers (BodyModifier) :
 *   - `suv`   : remplace les segs par SUV variants selon la base
 *   - `break` : ajoute des variants "break" aux segs présents
 *   - `awd`   : ajoute les segs SUV (les véhicules AWD sont surreprésentés en SUV)
 *
 * Source : v64.0.4 ligne 20690.
 */
export interface ModifierBehavior {
  add: readonly Segment[];
  boost_saloon?: readonly Segment[];
}

export const MOD_MAP: Record<BodyModifier, ModifierBehavior> = {
  suv: {
    add: ['suv_urban', 'suv_compact', 'suv_family'],
    boost_saloon: ['suv_compact', 'suv_family'],
  },
  break: {
    // 'small_break' est dans BodySelection mais pas Segment strict (généré
    // dynamiquement par getBodySegs). On le caste pour rester fidèle à V1.
    add: ['compact_break', 'saloon_break', 'small_break' as Segment],
  },
  awd: {
    // 'awd' est conservé comme marqueur de segment artificiel (cf. SEG_RANK.awd=4).
    add: ['suv_compact', 'suv_family', 'suv_large', 'awd' as Segment],
  },
} as const;

/**
 * Ordre hiérarchique des segments. Plus haut = plus grand véhicule.
 *
 * Utilisé par `_expandSegments` (assouplissement) et `expandSegments_v62_13`
 * (strict matching).
 *
 * Source : v64.0.4 ligne 20701.
 */
export const SEG_RANK: Record<string, number> = {
  mini: 1,
  small: 2,
  small_break: 2,
  suv_urban: 2,
  compact: 3,
  compact_break: 3,
  coupe_sport: 3,
  saloon: 4,
  saloon_break: 4,
  suv_compact: 4,
  suv_family: 5,
  executive: 5,
  suv_large: 6,
  awd: 4,
  mono: 4,
} as const;

/**
 * Labels FR pour affichage utilisateur.
 *
 * Source : v64.0.4 ligne 21129.
 */
export const SEG_LABEL_FR: Record<string, string> = {
  mini: 'mini-citadine',
  small: 'citadine',
  small_break: 'break citadine',
  suv_urban: 'crossover urbain',
  compact: 'compacte',
  compact_break: 'break compact',
  coupe_sport: 'coupé sportif',
  saloon: 'berline',
  saloon_break: 'break',
  suv_compact: 'SUV compact',
  suv_family: 'SUV familial',
  executive: 'grande berline',
  suv_large: 'grand SUV',
  mono: 'monospace',
  minivan: 'minivan',
  awd: '4x4',
} as const;

/**
 * Labels EN pour affichage utilisateur.
 *
 * Source : v64.0.4 ligne 21136.
 */
export const SEG_LABEL_EN: Record<string, string> = {
  mini: 'city car',
  small: 'supermini',
  small_break: 'supermini estate',
  suv_urban: 'urban crossover',
  compact: 'compact',
  compact_break: 'compact estate',
  coupe_sport: 'sports coupé',
  saloon: 'saloon',
  saloon_break: 'estate',
  suv_compact: 'compact SUV',
  suv_family: 'family SUV',
  executive: 'executive saloon',
  suv_large: 'large SUV',
  mono: 'MPV',
  minivan: 'minivan',
  awd: '4x4',
} as const;
