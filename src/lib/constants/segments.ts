/**
 * Mapping carrosseries → segments
 * ================================
 *
 * Source : extraction directe de SEG_MAP et MOD_MAP dans V1 (27 mai 2026).
 *
 * Utilisé par la fonction `resolveBodySegs` (équivalent V2 de `getBodySegs`)
 * qui convertit les sélections utilisateur (`body: string[]`) en segments
 * effectifs utilisés pour filtrer les véhicules du catalogue.
 */

import type { BodyBase, BodyModifier, Segment } from '../types';

// ============================================================
// SEG_MAP : base → segments
// ============================================================

/**
 * Mapping d'une carrosserie de base vers la liste de segments effectifs.
 *
 * Exemple : "compact" → ["compact", "saloon"] signifie qu'un utilisateur qui
 * choisit "compacte" verra aussi des "berlines" dans ses résultats (proximité).
 *
 * Observations :
 * - mini et small se chevauchent (symétrique)
 * - compact inclut saloon mais pas l'inverse (asymétrique)
 * - executive inclut saloon
 * - coupe est mappé à "coupe_sport" uniquement
 */
export const SEG_MAP: Record<BodyBase, readonly Segment[]> = {
  mini: ['mini', 'small'],
  small: ['small', 'mini'],
  compact: ['compact', 'saloon'],
  saloon: ['saloon'],
  executive: ['executive', 'saloon'],
  coupe: ['coupe_sport'],
};

// ============================================================
// MOD_MAP : modifier → action
// ============================================================

/**
 * Modifier de carrosserie (SUV, break, AWD) appliqué par-dessus la base.
 *
 * - `add` : segments ajoutés inconditionnellement quand le modifier est présent.
 * - `boost_saloon` : segments ajoutés UNIQUEMENT si "saloon" fait partie des bases.
 *
 * Exemple : "compact" + "suv" → ["suv_urban", "suv_compact", "suv_family"]
 * (V1 remplace la base par les segments SUV correspondants — voir getBodySegs).
 *
 * Aligné sur la structure V1 :
 * - suv : 3 segments par défaut + 2 supplémentaires si saloon
 * - break : 3 segments
 * - awd : 4 segments dont "awd" (marqueur logique)
 */
export interface BodyModifierConfig {
  add: readonly Segment[];
  boost_saloon?: readonly Segment[];
}

export const MOD_MAP: Record<BodyModifier, BodyModifierConfig> = {
  suv: {
    add: ['suv_urban', 'suv_compact', 'suv_family'],
    boost_saloon: ['suv_compact', 'suv_family'],
  },
  break: {
    add: ['compact_break', 'saloon_break', 'small_break' as Segment],
  },
  awd: {
    add: ['suv_compact', 'suv_family', 'suv_large', 'awd' as Segment],
  },
};

// Note : 'small_break' et 'awd' apparaissent dans MOD_MAP mais ne sont pas dans
// la liste Segment "officielle" (13 valeurs). V1 les utilise comme tags logiques.
// Cast nécessaire — sera affiné dans le Palier 3 quand on saura comment V1 les utilise.
