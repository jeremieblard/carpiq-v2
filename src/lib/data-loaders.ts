/**
 * Chargement asynchrone des données externes pour la cascade pricing.
 *
 * Source : v64.0.4 lignes ~5809-5840 (priceGridData) et ~11918-11932 (deprCurvesData).
 *
 * Les deux JSON sont volumineux et chargés en arrière-plan :
 *   - `price_grid.json`  : ~6.6 MB, 221 modèles AS24 (prix par age × km × country)
 *   - `depr_curves.json` : ~211 KB, 6192 cellules (tier × pt × country × age × km)
 *
 * Convention V1 : les variables sont `null` avant chargement, et les fonctions
 * de pricing détectent ça pour tomber sur les fallbacks. On reproduit cette
 * sémantique en V2.
 *
 * Note V2 : ces données sont chargées une seule fois au démarrage de la page
 * (déclenché par `initPricingData()` dans un layout Astro ou un script global).
 * Les fonctions de pricing les consomment via les getters `getPriceGridData()`
 * et `getDeprCurvesData()` — pas d'import direct de variables mutables.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types des données chargées
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Structure de `price_grid.json` :
 *   { "alfa/giulia": { "ice": { "fr": { "0": { "0": 49375, "10000": ..., ... }, ... } } } }
 *
 * Clés successives : modelId, powertrain, country, age (string), km (string).
 */
export type PriceGridData = Record<
  string, // modelId (ex: "alfa/giulia")
  Record<
    string, // powertrain (ice, hev, phev, bev, die)
    Record<
      string, // country (fr, be, ch...)
      Record<
        string, // age en string ("0", "1", "2"...)
        Record<string, number> // km en string → prix en €/CHF
      >
    >
  >
>;

/**
 * Structure de `depr_curves.json` :
 *   { "mainstream": { "ice": { "fr": { "0": { "0": 0.845, "10000": 0.7051, ... } } } } }
 *
 * Clés successives : tier, powertrain, country (ou "_any"), age, km.
 * Les valeurs sont des ratios (0..1) à appliquer à `car.newP`.
 */
export type DeprCurvesData = Record<
  string, // tier (luxury, premium, mainstream, budget)
  Record<
    string, // powertrain
    Record<
      string, // country ou "_any"
      Record<
        string, // age
        Record<string, number> // km → ratio (0..1)
      >
    >
  >
>;

// ─────────────────────────────────────────────────────────────────────────────
// État interne (équivalent des globales V1)
// ─────────────────────────────────────────────────────────────────────────────

let priceGridData: PriceGridData | null = null;
let priceGridLoading = true;

let deprCurvesData: DeprCurvesData | null = null;
let deprCurvesLoading = true;

// ─────────────────────────────────────────────────────────────────────────────
// Getters publics
// ─────────────────────────────────────────────────────────────────────────────

/** Retourne `true` si `priceGridData` est chargé et utilisable. */
export function priceGridReady(): boolean {
  return priceGridData !== null;
}

/** Retourne `true` si `deprCurvesData` est chargé et utilisable. */
export function deprCurvesReady(): boolean {
  return deprCurvesData !== null;
}

/** Accès aux données de prix AS24 (ou null si pas encore chargées). */
export function getPriceGridData(): PriceGridData | null {
  return priceGridData;
}

/** Accès aux courbes de dépréciation (ou null si pas encore chargées). */
export function getDeprCurvesData(): DeprCurvesData | null {
  return deprCurvesData;
}

// ─────────────────────────────────────────────────────────────────────────────
// Chargement
// ─────────────────────────────────────────────────────────────────────────────

/**
 * URL des JSON. Par défaut, les fichiers sont attendus à la racine du site
 * (cohérent avec V1 qui les charge en relatif depuis `index.html`).
 *
 * Surcharge possible via les paramètres de `initPricingData()` pour les tests
 * et environnements alternatifs.
 */
export interface PricingDataUrls {
  priceGrid?: string;
  deprCurves?: string;
}

/**
 * Initialise le chargement des deux JSON en parallèle.
 *
 * Reproduit le comportement V1 : les fetch sont déclenchés au boot, mais les
 * fonctions de pricing tolèrent l'absence de données (fallback sur DEPR statique).
 *
 * @returns Promise qui résout quand les DEUX fetch sont terminés (succès ou échec).
 */
export async function initPricingData(urls: PricingDataUrls = {}): Promise<void> {
  const priceGridUrl = urls.priceGrid ?? '/price_grid.json';
  const deprCurvesUrl = urls.deprCurves ?? '/depr_curves.json';

  await Promise.all([
    loadPriceGrid(priceGridUrl),
    loadDeprCurves(deprCurvesUrl),
  ]);
}

async function loadPriceGrid(url: string): Promise<void> {
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: PriceGridData = await res.json();
    priceGridData = data;
    priceGridLoading = false;
    const nModels = Object.keys(data).length;
    // eslint-disable-next-line no-console
    console.log(`[priceGrid] loaded: ${nModels} models`);
  } catch (e) {
    priceGridLoading = false;
    // eslint-disable-next-line no-console
    console.warn(
      '[priceGrid] unavailable, using static fallback:',
      e instanceof Error ? e.message : String(e),
    );
  }
}

async function loadDeprCurves(url: string): Promise<void> {
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: DeprCurvesData = await res.json();
    deprCurvesData = data;
    deprCurvesLoading = false;
    const nTiers = Object.keys(data).length;
    // eslint-disable-next-line no-console
    console.log(`[deprCurves] loaded: ${nTiers} tiers`);
  } catch (e) {
    deprCurvesLoading = false;
    // eslint-disable-next-line no-console
    console.warn(
      '[deprCurves] unavailable, using static fallback:',
      e instanceof Error ? e.message : String(e),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// API de test — injection directe (pour Vitest)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Injecte directement les données de prix (sans fetch). Réservé aux tests.
 *
 * @internal
 */
export function _setPriceGridData(data: PriceGridData | null): void {
  priceGridData = data;
  priceGridLoading = false;
}

/**
 * Injecte directement les courbes de dépréciation (sans fetch). Réservé aux tests.
 *
 * @internal
 */
export function _setDeprCurvesData(data: DeprCurvesData | null): void {
  deprCurvesData = data;
  deprCurvesLoading = false;
}

/**
 * Reset complet de l'état interne. Réservé aux tests (entre cas).
 *
 * @internal
 */
export function _resetPricingData(): void {
  priceGridData = null;
  priceGridLoading = true;
  deprCurvesData = null;
  deprCurvesLoading = true;
}
