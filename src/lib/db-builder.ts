/**
 * Construction du DB plat (style V1) depuis vehicle_catalog.json.
 *
 * Le vehicle_catalog V2 stocke les véhicules dans `catalog[*]._legacy_db.*`
 * sous une forme dénormalisée (préfixe `db_*`). Cette fonction reconstruit
 * un tableau Vehicle[] V1-compatible pour alimenter le moteur de recommandation.
 *
 * Source : structure observée dans vehicle_catalog.json (Palier 3c).
 */

import type { Vehicle, Powertrain, Segment } from './types';
import { getCatalogData } from './catalog';
import type { CatalogEntry } from './catalog';
import { DB_ORDER_V1 } from './constants/db-order-v1';

/**
 * Index ID → position canonique V1 (pré-calculé pour O(1) lookup).
 */
const _idToOrderIndex: Map<string, number> = new Map(
  DB_ORDER_V1.map((id, idx) => [id, idx]),
);

/** Fallback index pour IDs absents de DB_ORDER_V1. */
const _UNKNOWN_INDEX = 10000;

/**
 * Entrée _legacy_db imbriquée dans une CatalogEntry.
 * Préfixes `db_*` reflètent les noms V1 originaux.
 */
interface LegacyDbItem {
  db_id: string;
  db_name: string;
  db_pt: Powertrain;
  db_seg: Segment[];
  db_newP: number;
  db_co2_wltp?: number | null;
  db_fuel_l_100?: number | null;
  db_elec_wh_km?: number | null;
  db_battery_kwh?: number | null;
  db_wltp_range_km?: number | null;
  db_length_cm?: number | null;
  db_genYear?: number | null;
  db_isHistorical?: boolean;
  db_uncertain?: boolean;
  engine_id?: string;
  body_id?: string;
  drivetrain_id?: string;
}

/** Vehicle V2 avec champ optionnel genYear pour effectiveAge. */
interface VehicleWithGen extends Vehicle {
  genYear?: number;
  isHistorical?: boolean;
}

/**
 * Construit le DB plat depuis le catalog chargé.
 *
 * Itère sur toutes les entries du catalog, et pour chaque `_legacy_db.<id>`
 * produit un Vehicle V1-compatible.
 *
 * @returns Tableau Vehicle[]. Vide si le catalog n'est pas chargé.
 */
export function buildDbFromCatalog(): VehicleWithGen[] {
  const cat = getCatalogData();
  if (!cat || !cat.catalog) return [];

  const db: VehicleWithGen[] = [];
  for (const cid in cat.catalog) {
    const entry = cat.catalog[cid];
    const legacy = (entry as CatalogEntry & { _legacy_db?: Record<string, LegacyDbItem> })._legacy_db;
    if (!legacy || typeof legacy !== 'object') continue;

    for (const dbId in legacy) {
      const item = legacy[dbId];
      if (!item || !item.db_id || !item.db_pt) continue;
      const vehicle: VehicleWithGen = {
        id: item.db_id,
        name: item.db_name,
        brand: entry.brand,
        pt: item.db_pt,
        seg: item.db_seg ?? [],
        newP: item.db_newP,
        co2_wltp: item.db_co2_wltp ?? undefined,
        fuel_l_100: item.db_fuel_l_100 ?? undefined,
        length_cm: item.db_length_cm ?? undefined,
        genYear: item.db_genYear ?? undefined,
        isHistorical: item.db_isHistorical ?? false,
      };
      db.push(vehicle);
    }
  }

  // Trier selon l'ordre canonique V1 (assure que DB.find() matche V1)
  db.sort((a, b) => {
    const ia = _idToOrderIndex.get(a.id) ?? _UNKNOWN_INDEX;
    const ib = _idToOrderIndex.get(b.id) ?? _UNKNOWN_INDEX;
    return ia - ib;
  });

  return db;
}
