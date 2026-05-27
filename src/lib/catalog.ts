/**
 * Chargement et accès au catalogue véhicules V2 (vehicle_catalog.json).
 *
 * Source : v64.0.4 lignes 5841 (chargement) et 20780 (getCatalogEntryForCar).
 *
 * Structure JSON :
 *   {
 *     catalog: {
 *       "<catalog_id>": {
 *         brand: string,
 *         model_family: string,
 *         current_generation: boolean,
 *         seg?: string[],
 *         bodies?: { [bodyKey]: { seg?: string[] } },
 *         drivetrains?: { [dtKey]: { awd?: boolean } }
 *       }
 *     },
 *     _legacy_db?: ... (rétrocompat V1)
 *   }
 *
 * Le matching `car ↔ catalog entry` se fait via `AS24_MODEL_BASE[brand:id]`
 * ou fallback sur `car.id`. Prefère les entrées `current_generation === true`.
 */

import type { Vehicle } from './types';
import { AS24_MODEL_BASE } from './constants/as24-model-base';

// ─────────────────────────────────────────────────────────────────────────────
// Types des données du catalogue
// ─────────────────────────────────────────────────────────────────────────────

/** Entrée du catalogue pour un modèle (génération donnée). */
export interface CatalogEntry {
  brand: string;
  model_family: string;
  current_generation?: boolean;
  seg?: string[];
  bodies?: Record<string, { seg?: string[] } & Record<string, unknown>>;
  drivetrains?: Record<string, { awd?: boolean } & Record<string, unknown>>;
  // Champs supplémentaires possibles (genYear, etc.)
  [key: string]: unknown;
}

/** Structure complète de vehicle_catalog.json. */
export interface VehicleCatalogData {
  catalog: Record<string, CatalogEntry>;
  _legacy_db?: unknown;
  [key: string]: unknown;
}

// ─────────────────────────────────────────────────────────────────────────────
// État interne
// ─────────────────────────────────────────────────────────────────────────────

let vehicleCatalogData: VehicleCatalogData | null = null;
let catalogLoading = true;

/** Cache de résolution `car → catalog entry` pour éviter les lookups répétés. */
const _catalogEntryCache = new Map<string, CatalogEntry | null>();

// ─────────────────────────────────────────────────────────────────────────────
// Getters publics
// ─────────────────────────────────────────────────────────────────────────────

/** Retourne `true` si le catalogue est chargé. */
export function catalogReady(): boolean {
  return vehicleCatalogData !== null;
}

/** Accès aux données du catalogue (ou null si pas chargées). */
export function getCatalogData(): VehicleCatalogData | null {
  return vehicleCatalogData;
}

// ─────────────────────────────────────────────────────────────────────────────
// Chargement async
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Charge `vehicle_catalog.json` depuis l'URL fournie.
 *
 * @param url URL du JSON (défaut `/vehicle_catalog.json`).
 */
export async function loadCatalog(url: string = '/vehicle_catalog.json'): Promise<void> {
  try {
    const res = await fetch(url, { cache: 'no-cache' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data: VehicleCatalogData = await res.json();
    vehicleCatalogData = data;
    catalogLoading = false;
    _catalogEntryCache.clear(); // invalider le cache après reload
    const nModels = data.catalog ? Object.keys(data.catalog).length : 0;
    // eslint-disable-next-line no-console
    console.log(`[catalog] loaded: ${nModels} entries`);
  } catch (e) {
    catalogLoading = false;
    // eslint-disable-next-line no-console
    console.warn(
      '[catalog] unavailable:',
      e instanceof Error ? e.message : String(e),
    );
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// getCatalogEntryForCar — matching car ↔ catalog entry
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Cherche l'entrée du catalogue qui correspond à un véhicule.
 *
 * Source : v64.0.4 ligne 20780.
 *
 * Algorithme :
 *   1. Cache hit ? retourne
 *   2. Catalog vide ? null
 *   3. Slug = AS24_MODEL_BASE[brand:id] ou car.id
 *   4. Premier passage : entry avec brand + model_family + current_generation === true
 *   5. Second passage (fallback) : entry avec brand + model_family (sans current_gen)
 *   6. Cache la réponse (même null) et retourne
 */
export function getCatalogEntryForCar(car: Vehicle): CatalogEntry | null {
  if (!car || !car.id || !car.brand) return null;

  const cacheKey = `${car.brand}:${car.id}`;
  if (_catalogEntryCache.has(cacheKey)) {
    return _catalogEntryCache.get(cacheKey) ?? null;
  }

  if (!vehicleCatalogData || !vehicleCatalogData.catalog) {
    return null;
  }

  const slug = AS24_MODEL_BASE[cacheKey] ?? car.id;
  let match: CatalogEntry | null = null;

  // Premier passage : current_generation === true
  for (const cid in vehicleCatalogData.catalog) {
    const e = vehicleCatalogData.catalog[cid];
    if (e.brand === car.brand && e.model_family === slug && e.current_generation) {
      match = e;
      break;
    }
  }

  // Second passage : sans current_generation
  if (!match) {
    for (const cid in vehicleCatalogData.catalog) {
      const e = vehicleCatalogData.catalog[cid];
      if (e.brand === car.brand && e.model_family === slug) {
        match = e;
        break;
      }
    }
  }

  _catalogEntryCache.set(cacheKey, match);
  return match;
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers catalog-aware (versions v609)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Retourne les segments du véhicule depuis le catalog (priorité forte).
 *
 * Source : v64.0.4 ligne 20827.
 *
 * Combine `entry.seg` et les `seg` de tous les `entry.bodies`. Retourne null
 * si pas d'entry trouvée → caller doit fallback sur `car.seg`.
 */
export function carSegsFromCatalog(car: Vehicle): Set<string> | null {
  const e = getCatalogEntryForCar(car);
  if (!e) return null;
  const segs = new Set<string>();
  (e.seg ?? []).forEach((s) => segs.add(s));
  if (e.bodies) {
    for (const bKey in e.bodies) {
      const body = e.bodies[bKey];
      if (body && body.seg && Array.isArray(body.seg)) {
        body.seg.forEach((s: string) => segs.add(s));
      }
    }
  }
  return segs;
}

/**
 * Détecte AWD via le catalog (priorité forte sur la détection par nom).
 *
 * Source : v64.0.4 ligne 20812.
 *
 * Si entry présente avec `drivetrains` : true si au moins un dt a `awd === true`.
 * Sinon fallback sur `carHasAWD` (legacy par nom + pros) → caller doit appeler
 * `carHasAWD(car)` si cette fonction retourne null.
 *
 * @returns true / false si entry présente, null si pas d'entry (fallback requis).
 */
export function carHasAWDFromCatalog(car: Vehicle): boolean | null {
  const e = getCatalogEntryForCar(car);
  if (e && e.drivetrains) {
    for (const dtKey in e.drivetrains) {
      const dt = e.drivetrains[dtKey];
      if (dt && dt.awd === true) return true;
    }
    return false;
  }
  return null;
}

// ─────────────────────────────────────────────────────────────────────────────
// API de test — injection directe (pour Vitest)
// ─────────────────────────────────────────────────────────────────────────────

/** Injecte directement les données du catalog (sans fetch). Réservé aux tests. */
export function _setCatalogData(data: VehicleCatalogData | null): void {
  vehicleCatalogData = data;
  catalogLoading = false;
  _catalogEntryCache.clear();
}

/** Reset complet de l'état (pour tests). */
export function _resetCatalogData(): void {
  vehicleCatalogData = null;
  catalogLoading = true;
  _catalogEntryCache.clear();
}
