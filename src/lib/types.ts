/**
 * Types de domaine CarPIQ V2
 * ============================
 *
 * Source de vérité pour les types métier.
 * Tous les modules `lib/*` consomment uniquement les types définis ici.
 *
 * Aligné sur le vocabulaire V1 confirmé par introspection :
 * - Powertrain : 5 types (ice, hev, phev, bev, die)
 * - TripsCategory : 4 valeurs (short, mixed, long, vlong)
 * - KmCategory : 4 valeurs (u10, m20, m35, o35)
 * - Country : 9 pays (fr, be, nl, ch, de, es, it, pt, lu)
 */

// ============================================================
// Énumérations primitives
// ============================================================

/** Type de motorisation. Aligné sur les clés DEPR/BPROB/WLTP V1. */
export type Powertrain = 'ice' | 'hev' | 'phev' | 'bev' | 'die';

/** Catégorie de longueur de trajets. Aligné sur les clés CONS V1. */
export type TripsCategory = 'short' | 'mixed' | 'long' | 'vlong';

/** Catégorie de kilométrage annuel. Aligné sur les clés KMM V1.
 *  u10 = under 10k (~8k réel)
 *  m20 = mid 20k (~15k réel)
 *  m35 = mid 35k (~27k réel)
 *  o35 = over 35k (~42k réel)
 */
export type KmCategory = 'u10' | 'm20' | 'm35' | 'o35';

/** Possibilité de recharge à domicile. */
export type Charging = 'no' | 'maybe' | 'socket';

/** Préférence utilisateur (driver du scoring). */
export type Pref = 'cost' | 'ratio' | 'premium' | 'sport' | 'eco' | 'family';

/** Pays supportés (lecture COUNTRY_ENERGY V1). */
export type Country = 'fr' | 'be' | 'nl' | 'ch' | 'de' | 'es' | 'it' | 'pt' | 'lu';

/** Tranche d'âge du conducteur (impact sur l'assurance). */
export type AgeRange = '18-25' | '26-35' | '36-50' | '51-65' | '65+';

/** Powertrains apparaissant comme clés dans CONS V1.
 *  Notez que PHEV est ABSENT : V1 le sépare en pon (mode électrique) et
 *  poff (mode thermique), et fuelCost combine les deux via phevChargeFactor.
 */
export type ConsPowertrain = 'ice' | 'hev' | 'bev' | 'die' | 'pon' | 'poff';

// ============================================================
// Segments de carrosserie (issus de la DB V1)
// ============================================================

/** Segments physiques détectés dans la DB V1 (13 segments confirmés). */
export type Segment =
  | 'mini'
  | 'small'
  | 'compact'
  | 'saloon'
  | 'executive'
  | 'coupe_sport'
  | 'mono'
  | 'compact_break'
  | 'saloon_break'
  | 'suv_urban'
  | 'suv_compact'
  | 'suv_family'
  | 'suv_large';

/** Bases de carrosserie sélectionnables par l'utilisateur. */
export type BodyBase = 'mini' | 'small' | 'compact' | 'saloon' | 'executive' | 'coupe';

/** Modifiers de carrosserie (combinables avec les bases). */
export type BodyModifier = 'suv' | 'break' | 'awd';

/** Valeur possible d'un élément du tableau `st.body` en V1.
 *  Peut être soit une base, soit un modifier, soit le segment direct.
 */
export type BodySelection = BodyBase | BodyModifier | 'small_break';

// ============================================================
// Véhicule (depuis le catalogue V1 DB)
// ============================================================

/** Scores subjectifs du véhicule (issus du pipeline ML V1). */
export interface SubjectiveScores {
  image_score: number;
  design_tags: string[];
  driving_pleasure_score: number;
  comfort_score: number;
  brand_origin: string;
  eco_score: number;
  brand_character_tags: string[];
  methodology: string;
  schema_version: number;
  last_updated: string;
}

/** Véhicule du catalogue. Reflète la structure de DB[i] en V1. */
export interface Vehicle {
  id: string;
  name: string;
  brand: string;
  pt: Powertrain;
  seg: Segment[];
  newP: number;

  // Dimensions
  length_cm?: number;
  width_cm?: number;
  height_cm?: number;

  // Données environnementales
  co2_wltp?: number;
  fuel_l_100?: number;

  // Bullets descriptifs (multilingue : f=FR, e=EN)
  bf?: string;
  be?: string;
  df?: string;
  de?: string;

  // Pros / cons (multilingue)
  pf?: string[];
  pe?: string[];
  cf?: string[];
  ce?: string[];

  // Scores ML
  subjective_scores?: SubjectiveScores;
  _subj_cid_source?: string;
}

// ============================================================
// État utilisateur (équivalent V2 de `st` en V1)
// ============================================================

/** État du parcours utilisateur. Remplace `st` global de V1.
 *  Tous les champs sont nullable pour refléter l'état initial pré-réponse.
 */
export interface UserState {
  budget: number | null;
  km: KmCategory | null;
  trips: TripsCategory | null;
  charging: Charging | null;
  body: BodySelection[];
  pref: Pref | null;
  urban: boolean;
  age: AgeRange | null;
  dept: string | null;
}

// ============================================================
// Inputs explicites aux fonctions métier
// ============================================================

/** Inputs purs pour `calcTco`. Pas de dépendance à un état global.
 *  Note : V1 lit `st.trips`, `st.charging`, `st.urban` en globale via `fuelCost`.
 *  V2 les passe explicitement.
 */
export interface TcoInputs {
  pt: Powertrain;
  newP: number;
  brand: string;
  age: number;             // 0 (neuf) à 10
  km: number;              // km annuels réels (issus de KMM[KmCategory])
  trips: TripsCategory;    // pour fuelCost
  charging: Charging;      // pour fuelCost (BEV/PHEV)
  urban: boolean;          // pour fuelCost (urbanMod)
  country: Country;        // pour fuelCost (getFP/getEP)
}

/** Inputs explicites pour `recommend` (équivalent V2 de getRec). */
export interface RecInputs {
  budget: number;
  km: KmCategory;
  trips: TripsCategory;
  charging: Charging;
  body: BodySelection[];
  pref: Pref | null;
  urban: boolean;
  age: AgeRange | null;
  dept: string | null;
  country: Country;
}

// ============================================================
// Outputs des fonctions métier
// ============================================================

/** Résultat du calcul TCO pour un véhicule donné. */
export interface TcoResult {
  /** Prix d'achat estimé à l'âge demandé (€/CHF). */
  purchP: number;
  /** Prix de revente estimé après +5 ans. */
  saleP: number;
  /** Dépréciation cumulée sur 5 ans (purchP - saleP). */
  depr5: number;
  /** Coût annuel carburant/énergie. */
  yf: number;
  /** Coût annuel entretien. */
  maint: number;
  /** Coût annuel réparation. */
  rep: number;
  /** Coût mensuel équivalent total. */
  mo: number;
  /** Indice de risque de panne (0 à 1+, plus haut = plus risqué). */
  risk: number;
}

/** Comparaison de coût mensuel par powertrain (élément de getRec().ptComp). */
export interface PowertrainComparison {
  pt: Powertrain;
  mo: number;
  gp: number;
  name: string;
}

/** Résultat global d'une recommandation. */
export interface RecResult {
  /** Powertrain recommandé. */
  best: Powertrain;
  /** Véhicule de référence pour la reco. */
  refCar: Vehicle;
  /** TCO du véhicule recommandé. */
  bTco: TcoResult;
  /** TCO d'un véhicule ICE de comparaison. */
  iceTco: TcoResult;
  /** Segments de carrosserie résolus depuis `body`. */
  bodySegs: Segment[];
  /** Comparaison par powertrain. */
  ptComp: PowertrainComparison[];
  /** Avertissements (chaîne ou liste). */
  warns: string | string[];
  /** Explication textuelle (FR ou EN selon lang). */
  why?: string;
}

// ============================================================
// Données pays
// ============================================================

/** Métadonnées énergie et incitations par pays. */
export interface CountryData {
  /** Prix essence (€/L ou CHF/L). */
  fp: number;
  /** Prix électricité résidentielle (€/kWh ou CHF/kWh). */
  ep: number;
  /** Prix électricité publique (€/kWh ou CHF/kWh). */
  epu: number;
  /** Intensité carbone du mix électrique (gCO2/kWh). */
  co2g: number;
  /** Bonus BEV (€ ou CHF). */
  bonus_bev: number;
  /** Bonus PHEV (€ ou CHF). */
  bonus_phev: number;
  /** Nom du pays affiché. */
  name: string;
  /** Drapeau emoji. */
  flag: string;
  /** Langue par défaut. */
  lang: 'fr' | 'en' | 'de' | 'nl' | 'es' | 'it' | 'pt';
  /** Devise. */
  curr: '€' | 'CHF';
  /** Symbole devise complet. */
  currSym: string;
  /** Note sur les bonus (multilingue). */
  bonus_note: string;
  /** Information ZFE. */
  zfe: string;
}
