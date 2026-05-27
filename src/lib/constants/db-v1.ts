/**
 * DB véhicules V1 extrait fidèlement de v64.0.4 (ligne 12255).
 *
 * 307 véhicules dans l'ordre canonique V1 (urbains/petits → premium/SUV).
 *
 * Cet export est utilisé par les tests de baseline pour matcher exactement
 * le comportement V1. Le `vehicle_catalog.json` du Palier 3c a parfois des
 * `_legacy_db.db_seg` divergents (ex: yaris_hev avec seg=[compact,coupe_sport]
 * au lieu de [small]) — ce fichier est la source de vérité fidèle V1.
 *
 * En production, le DB de V2 devrait être construit depuis vehicle_catalog
 * mais avec les `db_seg` réalignés sur ces valeurs canoniques.
 */

import type { Vehicle } from '../types';

interface VehicleWithGen extends Vehicle {
  genYear?: number;
  isHistorical?: boolean;
}

export const DB_V1: readonly VehicleWithGen[] = [
  {
    "id": "aygo",
    "name": "Toyota Aygo X",
    "brand": "toyota",
    "pt": "ice",
    "newP": 38500,
    "co2_wltp": 110.0,
    "seg": [
      "mini"
    ]
  },
  {
    "id": "spring",
    "name": "Dacia Spring",
    "brand": "dacia",
    "pt": "bev",
    "newP": 13420,
    "co2_wltp": 0.0,
    "seg": [
      "mini"
    ]
  },
  {
    "id": "fiat500e",
    "name": "Fiat 500e",
    "brand": "fiat",
    "pt": "bev",
    "newP": 23990,
    "co2_wltp": 69.0,
    "seg": [
      "mini"
    ]
  },
  {
    "id": "ecC3",
    "name": "Citroën ë-C3",
    "brand": "citroen",
    "pt": "bev",
    "newP": 23300,
    "co2_wltp": 124.0,
    "seg": [
      "mini"
    ]
  },
  {
    "id": "c3",
    "name": "Citroën C3 (essence)",
    "brand": "citroen",
    "pt": "ice",
    "newP": 18490,
    "co2_wltp": 120.0,
    "seg": [
      "suv_urban"
    ]
  },
  {
    "id": "yaris_hev",
    "name": "Toyota Yaris Hybrid",
    "brand": "toyota",
    "pt": "hev",
    "newP": 28340,
    "co2_wltp": 101.0,
    "seg": [
      "small"
    ]
  },
  {
    "id": "clio_hev",
    "name": "Renault Clio E-Tech Hybrid",
    "brand": "renault",
    "pt": "hev",
    "newP": 30950,
    "co2_wltp": 111.0,
    "seg": [
      "small"
    ]
  },
  {
    "id": "r5_bev_old",
    "name": "Renault 5 E-Tech",
    "brand": "renault",
    "pt": "bev",
    "newP": 36800,
    "seg": [
      "suv_urban"
    ]
  },
  {
    "id": "e208",
    "name": "Peugeot e-208",
    "brand": "peugeot",
    "pt": "bev",
    "newP": 29900,
    "co2_wltp": 91.0,
    "seg": [
      "small"
    ]
  },
  {
    "id": "208",
    "name": "Peugeot 208 (essence)",
    "brand": "peugeot",
    "pt": "ice",
    "newP": 19900,
    "co2_wltp": 92.0,
    "seg": [
      "small"
    ]
  },
  {
    "id": "corsa",
    "name": "Opel Corsa",
    "brand": "opel",
    "pt": "ice",
    "newP": 21990,
    "co2_wltp": 107.0,
    "seg": [
      "small"
    ]
  },
  {
    "id": "polo",
    "name": "Volkswagen Polo",
    "brand": "vw",
    "pt": "ice",
    "newP": 28999,
    "co2_wltp": 123.0,
    "seg": [
      "small"
    ]
  },
  {
    "id": "jazz",
    "name": "Honda Jazz e:HEV",
    "brand": "honda",
    "pt": "hev",
    "newP": 29599,
    "co2_wltp": 105.0,
    "seg": [
      "mini"
    ]
  },
  {
    "id": "ibiza",
    "name": "SEAT Ibiza",
    "brand": "seat",
    "pt": "ice",
    "newP": 22990,
    "co2_wltp": 121.0,
    "seg": [
      "small"
    ]
  },
  {
    "id": "golf",
    "name": "Volkswagen Golf TSI",
    "brand": "vw",
    "pt": "ice",
    "newP": 32900,
    "co2_wltp": 117.0,
    "seg": [
      "compact",
      "compact_break"
    ]
  },
  {
    "id": "corolla",
    "name": "Toyota Corolla Hybrid",
    "brand": "toyota",
    "pt": "hev",
    "newP": 31900,
    "co2_wltp": 107.0,
    "seg": [
      "compact",
      "compact_break"
    ]
  },
  {
    "id": "308h",
    "name": "Peugeot 308 Hybrid 48V",
    "brand": "peugeot",
    "pt": "hev",
    "newP": 30900,
    "co2_wltp": 106.0,
    "seg": [
      "compact",
      "compact_break"
    ]
  },
  {
    "id": "308phev",
    "name": "Peugeot 308 PHEV",
    "brand": "peugeot",
    "pt": "phev",
    "newP": 38900,
    "co2_wltp": 106.0,
    "seg": [
      "compact",
      "compact_break"
    ]
  },
  {
    "id": "megane_e",
    "name": "Renault Mégane E-Tech",
    "brand": "renault",
    "pt": "bev",
    "newP": 35900,
    "seg": [
      "compact",
      "compact_break"
    ]
  },
  {
    "id": "ioniq6",
    "name": "Hyundai Ioniq 6",
    "brand": "hyundai",
    "pt": "bev",
    "newP": 59795,
    "co2_wltp": 0.0,
    "seg": [
      "compact",
      "compact_break",
      "saloon",
      "saloon_break"
    ]
  },
  {
    "id": "tesla3",
    "name": "Tesla Model 3 RWD",
    "brand": "tesla",
    "pt": "bev",
    "newP": 42990,
    "co2_wltp": 0.0,
    "seg": [
      "compact",
      "compact_break",
      "saloon",
      "saloon_break"
    ]
  },
  {
    "id": "octavia",
    "name": "Škoda Octavia",
    "brand": "skoda",
    "pt": "ice",
    "newP": 29900,
    "co2_wltp": 120.0,
    "seg": [
      "compact",
      "saloon"
    ]
  },
  {
    "id": "leon",
    "name": "SEAT Leon",
    "brand": "seat",
    "pt": "ice",
    "newP": 29500,
    "co2_wltp": 121.0,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "cupra_leon",
    "name": "Cupra Leon PHEV",
    "brand": "cupra",
    "pt": "phev",
    "newP": 39990,
    "co2_wltp": 118.0,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "a3",
    "name": "Audi A3 Sportback",
    "brand": "audi",
    "pt": "ice",
    "newP": 34990,
    "co2_wltp": 128.0,
    "seg": [
      "compact",
      "coupe_sport"
    ]
  },
  {
    "id": "classe_a",
    "name": "Mercedes Classe A",
    "brand": "mercedes",
    "pt": "ice",
    "newP": 36990,
    "co2_wltp": 131.0,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "bmw118",
    "name": "BMW Série 1 118i",
    "brand": "bmw",
    "pt": "ice",
    "newP": 41900,
    "co2_wltp": 133.0,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "408h",
    "name": "Peugeot 408 Hybrid",
    "brand": "peugeot",
    "pt": "hev",
    "newP": 42900,
    "genYear": 2023,
    "co2_wltp": 101.0,
    "seg": [
      "compact",
      "saloon",
      "coupe_sport"
    ]
  },
  {
    "id": "408phev",
    "name": "Peugeot 408 PHEV",
    "brand": "peugeot",
    "pt": "phev",
    "newP": 49900,
    "genYear": 2023,
    "co2_wltp": 101.0,
    "seg": [
      "compact",
      "saloon"
    ]
  },
  {
    "id": "duster",
    "name": "Dacia Duster",
    "brand": "dacia",
    "pt": "ice",
    "newP": 19490,
    "co2_wltp": 130.0,
    "seg": [
      "suv_urban"
    ]
  },
  {
    "id": "yaris_cross",
    "name": "Toyota Yaris Cross Hybrid",
    "brand": "toyota",
    "pt": "hev",
    "newP": 30900,
    "co2_wltp": 100.0,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "chr",
    "name": "Toyota C-HR Hybrid",
    "brand": "toyota",
    "pt": "hev",
    "newP": 32900,
    "co2_wltp": 101.0,
    "seg": [
      "suv_urban"
    ]
  },
  {
    "id": "captur_h",
    "name": "Renault Captur E-Tech Hybrid",
    "brand": "renault",
    "pt": "hev",
    "newP": 29900,
    "co2_wltp": 121.0,
    "seg": [
      "suv_urban"
    ]
  },
  {
    "id": "captur_phev",
    "name": "Renault Captur PHEV",
    "brand": "renault",
    "pt": "phev",
    "newP": 35900,
    "co2_wltp": 121.0,
    "seg": [
      "suv_urban"
    ]
  },
  {
    "id": "puma",
    "name": "Ford Puma ST-Line HEV",
    "brand": "ford",
    "pt": "hev",
    "newP": 29490,
    "co2_wltp": 125.0,
    "seg": [
      "suv_urban"
    ]
  },
  {
    "id": "hrv",
    "name": "Honda HR-V e:HEV",
    "brand": "honda",
    "pt": "hev",
    "newP": 32900,
    "co2_wltp": 122.0,
    "seg": [
      "suv_urban"
    ]
  },
  {
    "id": "tucson_h",
    "name": "Hyundai Tucson HEV",
    "brand": "hyundai",
    "pt": "hev",
    "newP": 38490,
    "co2_wltp": 128.0,
    "seg": [
      "suv_compact",
      "suv_family"
    ]
  },
  {
    "id": "tucson_phev",
    "name": "Hyundai Tucson PHEV",
    "brand": "hyundai",
    "pt": "phev",
    "newP": 36900,
    "co2_wltp": 128.0,
    "seg": [
      "suv_compact",
      "suv_family"
    ]
  },
  {
    "id": "kona_e",
    "name": "Hyundai Kona Electric",
    "brand": "hyundai",
    "pt": "bev",
    "newP": 37490,
    "co2_wltp": 76.0,
    "seg": [
      "suv_urban"
    ]
  },
  {
    "id": "e2008",
    "name": "Peugeot e-2008",
    "brand": "peugeot",
    "pt": "bev",
    "newP": 28500,
    "co2_wltp": 110.0,
    "seg": [
      "suv_urban"
    ]
  },
  {
    "id": "cx30",
    "name": "Mazda CX-30",
    "brand": "mazda",
    "pt": "hev",
    "newP": 31900,
    "co2_wltp": 139.0,
    "seg": [
      "suv_urban"
    ]
  },
  {
    "id": "juke",
    "name": "Nissan Juke Hybrid",
    "brand": "nissan",
    "pt": "hev",
    "newP": 30490,
    "co2_wltp": 124.0,
    "seg": [
      "suv_urban"
    ]
  },
  {
    "id": "arona",
    "name": "SEAT Arona",
    "brand": "seat",
    "pt": "ice",
    "newP": 26990,
    "co2_wltp": 127.0,
    "seg": [
      "suv_urban"
    ]
  },
  {
    "id": "kamiq",
    "name": "Škoda Kamiq",
    "brand": "skoda",
    "pt": "ice",
    "newP": 24990,
    "co2_wltp": 128.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "avenger",
    "name": "Jeep Avenger BEV",
    "brand": "jeep",
    "pt": "bev",
    "newP": 35490,
    "co2_wltp": 99.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "mg_zs",
    "name": "MG ZS EV",
    "brand": "mg",
    "pt": "bev",
    "newP": 29990,
    "co2_wltp": 133.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "id3",
    "name": "Volkswagen ID.3",
    "brand": "vw",
    "pt": "bev",
    "newP": 37900,
    "co2_wltp": 0.0,
    "seg": [
      "compact",
      "suv_compact"
    ]
  },
  {
    "id": "xc40_bev",
    "name": "Volvo XC40 Recharge",
    "brand": "volvo",
    "pt": "bev",
    "newP": 86500,
    "co2_wltp": 96.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "q4",
    "name": "Audi Q4 e-tron",
    "brand": "audi",
    "pt": "bev",
    "newP": 51990,
    "co2_wltp": 0.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "eqa",
    "name": "Mercedes EQA",
    "brand": "mercedes",
    "pt": "bev",
    "newP": 61750,
    "co2_wltp": 0.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "ix1",
    "name": "BMW iX1",
    "brand": "bmw",
    "pt": "bev",
    "newP": 55900,
    "co2_wltp": 1.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "lexy_ux",
    "name": "Lexus UX 250h",
    "brand": "lexus",
    "pt": "hev",
    "newP": 43900,
    "co2_wltp": 121.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "byd_atto",
    "name": "BYD Atto 3",
    "brand": "byd",
    "pt": "bev",
    "newP": 36990,
    "co2_wltp": 0.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "qashqai",
    "name": "Nissan Qashqai e-Power",
    "brand": "nissan",
    "pt": "hev",
    "newP": 36490,
    "co2_wltp": 135.0,
    "seg": [
      "suv_compact",
      "suv_family"
    ]
  },
  {
    "id": "rav4_h",
    "name": "Toyota RAV4 Hybrid",
    "brand": "toyota",
    "pt": "hev",
    "newP": 39900,
    "co2_wltp": 113.0,
    "seg": [
      "suv_family",
      "suv_urban"
    ]
  },
  {
    "id": "rav4_phev",
    "name": "Toyota RAV4 PHEV",
    "brand": "toyota",
    "pt": "phev",
    "newP": 55900,
    "co2_wltp": 113.0,
    "seg": [
      "suv_large"
    ]
  },
  {
    "id": "3008h",
    "name": "Peugeot 3008 Hybrid 48V",
    "brand": "peugeot",
    "pt": "hev",
    "newP": 38500,
    "co2_wltp": 111.0,
    "seg": [
      "suv_compact",
      "suv_family"
    ]
  },
  {
    "id": "3008phev",
    "name": "Peugeot 3008 PHEV",
    "brand": "peugeot",
    "pt": "phev",
    "newP": 47900,
    "co2_wltp": 111.0,
    "seg": [
      "suv_compact",
      "suv_family"
    ]
  },
  {
    "id": "sportage_h",
    "name": "Kia Sportage HEV",
    "brand": "kia",
    "pt": "hev",
    "newP": 38900,
    "co2_wltp": 127.0,
    "seg": [
      "suv_compact",
      "suv_family"
    ]
  },
  {
    "id": "sportage_phev",
    "name": "Kia Sportage PHEV",
    "brand": "kia",
    "pt": "phev",
    "newP": 48900,
    "co2_wltp": 127.0,
    "seg": [
      "suv_compact",
      "suv_family"
    ]
  },
  {
    "id": "santa_fe",
    "name": "Hyundai Santa Fe HEV",
    "brand": "hyundai",
    "pt": "hev",
    "newP": 46990,
    "co2_wltp": 100.0,
    "seg": [
      "suv_large"
    ]
  },
  {
    "id": "kuga",
    "name": "Ford Kuga PHEV",
    "brand": "ford",
    "pt": "phev",
    "newP": 44990,
    "co2_wltp": 92.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "kodiaq",
    "name": "Škoda Kodiaq",
    "brand": "skoda",
    "pt": "ice",
    "newP": 36990,
    "co2_wltp": 145.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "tiguan",
    "name": "Volkswagen Tiguan",
    "brand": "vw",
    "pt": "ice",
    "newP": 57600,
    "co2_wltp": 129.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "id4",
    "name": "Volkswagen ID.4",
    "brand": "vw",
    "pt": "bev",
    "newP": 55418,
    "co2_wltp": 0.0,
    "seg": [
      "suv_compact",
      "suv_family"
    ]
  },
  {
    "id": "tesla_y",
    "name": "Tesla Model Y RWD",
    "brand": "tesla",
    "pt": "bev",
    "newP": 44990,
    "co2_wltp": 0.0,
    "seg": [
      "suv_compact",
      "suv_family"
    ]
  },
  {
    "id": "xc60",
    "name": "Volvo XC60 Recharge PHEV",
    "brand": "volvo",
    "pt": "phev",
    "newP": 59990,
    "co2_wltp": 71.0,
    "seg": [
      "saloon"
    ]
  },
  {
    "id": "x3phev_old",
    "name": "BMW X3 xDrive30e (old)",
    "brand": "bmw",
    "pt": "phev",
    "newP": 66900,
    "co2_wltp": 51.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "berlingo",
    "name": "Citroën Berlingo",
    "brand": "citroen",
    "pt": "ice",
    "newP": 24900,
    "co2_wltp": 120.0,
    "seg": [
      "mono"
    ]
  },
  {
    "id": "jogger",
    "name": "Dacia Jogger",
    "brand": "dacia",
    "pt": "ice",
    "newP": 18490,
    "co2_wltp": 120.0,
    "seg": [
      "mono",
      "suv_compact"
    ]
  },
  {
    "id": "touran",
    "name": "Volkswagen Touran",
    "brand": "vw",
    "pt": "ice",
    "newP": 32990,
    "co2_wltp": 145.0,
    "seg": [
      "mono"
    ]
  },
  {
    "id": "scenic_e",
    "name": "Renault Scénic E-Tech",
    "brand": "renault",
    "pt": "bev",
    "newP": 39900,
    "seg": [
      "mono",
      "suv_compact"
    ]
  },
  {
    "id": "zafira",
    "name": "Opel Zafira-e Life",
    "brand": "opel",
    "pt": "bev",
    "newP": 48900,
    "co2_wltp": 22.0,
    "seg": [
      "mono"
    ]
  },
  {
    "id": "forester_hev",
    "name": "Subaru Forester e-Boxer",
    "brand": "subaru",
    "pt": "hev",
    "newP": 37900,
    "co2_wltp": 185.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "outback_ice",
    "name": "Subaru Outback",
    "brand": "subaru",
    "pt": "ice",
    "newP": 35900,
    "co2_wltp": 193.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "xv_hev",
    "name": "Subaru XV/Crosstrek e-Boxer",
    "brand": "subaru",
    "pt": "hev",
    "newP": 32900,
    "co2_wltp": 175.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "compass_phev",
    "name": "Jeep Compass 4xe PHEV",
    "brand": "jeep",
    "pt": "phev",
    "newP": 44900,
    "co2_wltp": 119.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "renegade_phev",
    "name": "Jeep Renegade 4xe PHEV",
    "brand": "jeep",
    "pt": "phev",
    "newP": 40900,
    "co2_wltp": 118.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "eclipse_phev",
    "name": "Mitsubishi Eclipse Cross PHEV",
    "brand": "mitsubishi",
    "pt": "phev",
    "newP": 42900,
    "co2_wltp": 46.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "q5_ice",
    "name": "Audi Q5 (2020-2022)",
    "brand": "audi",
    "pt": "ice",
    "newP": 52900,
    "co2_wltp": 173.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "x3_phev",
    "name": "BMW X3 xDrive30e PHEV",
    "brand": "bmw",
    "pt": "phev",
    "newP": 77700,
    "co2_wltp": 51.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "modely_awd",
    "name": "Tesla Model Y AWD",
    "brand": "tesla",
    "pt": "bev",
    "newP": 54900,
    "co2_wltp": 0.0,
    "seg": [
      "suv_compact",
      "suv_family"
    ]
  },
  {
    "id": "polestar2_awd",
    "name": "Polestar 2 AWD",
    "brand": "polestar",
    "pt": "bev",
    "newP": 57900,
    "seg": [
      "compact",
      "saloon",
      "coupe_sport"
    ]
  },
  {
    "id": "tiguan_allspace",
    "name": "VW Tiguan Allspace 4Motion",
    "brand": "vw",
    "pt": "ice",
    "newP": 42900,
    "co2_wltp": 129.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "santafe_phev",
    "name": "Hyundai Santa Fe hybride rechargeable AWD",
    "brand": "hyundai",
    "pt": "phev",
    "newP": 52900,
    "co2_wltp": 100.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "sorento_phev",
    "name": "Kia Sorento hybride rechargeable AWD",
    "brand": "kia",
    "pt": "phev",
    "newP": 46550,
    "co2_wltp": 127.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "formentor_phev",
    "name": "CUPRA Formentor e-Hybrid",
    "brand": "cupra",
    "pt": "phev",
    "newP": 50005,
    "co2_wltp": 130.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "kodiaq_ice",
    "name": "Škoda Kodiaq 7 places (2020-2022)",
    "brand": "skoda",
    "pt": "ice",
    "newP": 38900,
    "co2_wltp": 145.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "gla_ice",
    "name": "Mercedes GLA 250 4MATIC",
    "brand": "mercedes",
    "pt": "ice",
    "newP": 44900,
    "co2_wltp": 163.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "gla_phev",
    "name": "Mercedes GLA 250 e 4MATIC PHEV",
    "brand": "mercedes",
    "pt": "phev",
    "newP": 52900,
    "co2_wltp": 27.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "glc_ice",
    "name": "Mercedes GLC 300 4MATIC",
    "brand": "mercedes",
    "pt": "ice",
    "newP": 58900,
    "co2_wltp": 165.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "eqa_bev",
    "name": "Mercedes EQA 250",
    "brand": "mercedes",
    "pt": "bev",
    "newP": 49900,
    "co2_wltp": 0.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "eqa_awd",
    "name": "Mercedes EQA 300 4MATIC",
    "brand": "mercedes",
    "pt": "bev",
    "newP": 55900,
    "co2_wltp": 0.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "x1_ice",
    "name": "BMW X1 xDrive23i",
    "brand": "bmw",
    "pt": "ice",
    "newP": 44900,
    "co2_wltp": 128.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "x1_phev",
    "name": "BMW X1 xDrive25e PHEV",
    "brand": "bmw",
    "pt": "phev",
    "newP": 52900,
    "co2_wltp": 19.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "serie3_xdrive",
    "name": "BMW Série 3 320i xDrive",
    "brand": "bmw",
    "pt": "ice",
    "newP": 49900,
    "co2_wltp": 155.0,
    "seg": [
      "compact",
      "saloon"
    ]
  },
  {
    "id": "x3_ice",
    "name": "BMW X3 xDrive20i",
    "brand": "bmw",
    "pt": "ice",
    "newP": 58900,
    "co2_wltp": 170.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "ix1_bev",
    "name": "BMW iX1 xDrive30",
    "brand": "bmw",
    "pt": "bev",
    "newP": 55900,
    "co2_wltp": 2.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "q3_ice",
    "name": "Audi Q3 45 TFSI Quattro",
    "brand": "audi",
    "pt": "ice",
    "newP": 42900,
    "co2_wltp": 155.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "q3_phev",
    "name": "Audi Q3 45 TFSI e Quattro",
    "brand": "audi",
    "pt": "phev",
    "newP": 52900,
    "co2_wltp": 155.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "q4_awd",
    "name": "Audi Q4 e-tron Quattro",
    "brand": "audi",
    "pt": "bev",
    "newP": 55900,
    "co2_wltp": 0.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "xc40_awd",
    "name": "Volvo XC40 AWD",
    "brand": "volvo",
    "pt": "ice",
    "newP": 44900,
    "co2_wltp": 96.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "xc40_bev_awd",
    "name": "Volvo XC40 Recharge Twin AWD",
    "brand": "volvo",
    "pt": "bev",
    "newP": 56900,
    "co2_wltp": 96.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "alfa_stelvio_ice",
    "name": "Alfa Romeo Stelvio",
    "brand": "alfa",
    "pt": "ice",
    "newP": 52900,
    "co2_wltp": 166.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "alfa_tonale_phev",
    "name": "Alfa Romeo Tonale PHEV",
    "brand": "alfa",
    "pt": "phev",
    "newP": 47900,
    "co2_wltp": 124.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "alfa_giulia_ice",
    "name": "Alfa Romeo Giulia",
    "brand": "alfa",
    "pt": "ice",
    "newP": 46900,
    "co2_wltp": 166.0,
    "seg": [
      "compact",
      "saloon"
    ]
  },
  {
    "id": "ds3_bev",
    "name": "DS 3 E-Tense BEV",
    "brand": "ds",
    "pt": "bev",
    "newP": 38900,
    "seg": [
      "small",
      "suv_compact"
    ]
  },
  {
    "id": "ds4_phev",
    "name": "DS 4 E-Tense PHEV",
    "brand": "ds",
    "pt": "phev",
    "newP": 47900,
    "co2_wltp": 31.0,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "ds9_phev",
    "name": "DS 9 E-Tense PHEV",
    "brand": "ds",
    "pt": "phev",
    "newP": 62900,
    "co2_wltp": 29.0,
    "seg": [
      "saloon"
    ]
  },
  {
    "id": "mini_ice",
    "name": "MINI Cooper",
    "brand": "mini",
    "pt": "ice",
    "newP": 26900,
    "co2_wltp": 101.0,
    "seg": [
      "small"
    ]
  },
  {
    "id": "mini_bev",
    "name": "MINI Cooper Electric",
    "brand": "mini",
    "pt": "bev",
    "newP": 34900,
    "co2_wltp": 104.0,
    "seg": [
      "small"
    ]
  },
  {
    "id": "mini_countryman_phev",
    "name": "MINI Countryman PHEV",
    "brand": "mini",
    "pt": "phev",
    "newP": 46900,
    "co2_wltp": 99.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "mini_countryman_bev",
    "name": "MINI Countryman Electric",
    "brand": "mini",
    "pt": "bev",
    "newP": 47900,
    "co2_wltp": 0.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "porsche_cayenne_phev",
    "name": "Porsche Cayenne E-Hybrid",
    "brand": "porsche",
    "pt": "phev",
    "newP": 89900,
    "co2_wltp": 70.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "porsche_macan_bev",
    "name": "Porsche Macan Electric",
    "brand": "porsche",
    "pt": "bev",
    "newP": 79900,
    "co2_wltp": 201.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "suzuki_swace_hev",
    "name": "Suzuki Swace HEV",
    "brand": "suzuki",
    "pt": "hev",
    "newP": 29900,
    "co2_wltp": 102.0,
    "seg": [
      "compact_break",
      "saloon_break"
    ]
  },
  {
    "id": "suzuki_vitara_hev",
    "name": "Suzuki Vitara HEV",
    "brand": "suzuki",
    "pt": "hev",
    "newP": 28900,
    "co2_wltp": 124.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "suzuki_across_phev",
    "name": "Suzuki Across PHEV",
    "brand": "suzuki",
    "pt": "phev",
    "newP": 47900,
    "co2_wltp": 28.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "smart1_bev",
    "name": "Smart #1 BEV",
    "brand": "smart",
    "pt": "bev",
    "newP": 39900,
    "seg": [
      "small",
      "suv_compact"
    ]
  },
  {
    "id": "genesis_gv60_bev",
    "name": "Genesis GV60 AWD",
    "brand": "hyundai",
    "pt": "bev",
    "newP": 59900,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "fiat_500_ice",
    "name": "Fiat 500 (2020)",
    "brand": "fiat",
    "pt": "ice",
    "newP": 17900,
    "co2_wltp": 69.0,
    "seg": [
      "small"
    ]
  },
  {
    "id": "fiat_500e_bev",
    "name": "Fiat 500e BEV",
    "brand": "fiat",
    "pt": "bev",
    "newP": 29900,
    "co2_wltp": 69.0,
    "seg": [
      "small"
    ]
  },
  {
    "id": "fiat_600_bev",
    "name": "Fiat Grande Panda BEV",
    "brand": "fiat",
    "pt": "bev",
    "newP": 27900,
    "co2_wltp": 112.0,
    "seg": [
      "small",
      "suv_compact"
    ]
  },
  {
    "id": "opel_corsa_ice",
    "name": "Opel Corsa",
    "brand": "opel",
    "pt": "ice",
    "newP": 16900,
    "co2_wltp": 107.0,
    "seg": [
      "small"
    ]
  },
  {
    "id": "opel_corsa_bev",
    "name": "Opel Corsa Electric",
    "brand": "opel",
    "pt": "bev",
    "newP": 31900,
    "co2_wltp": 106.0,
    "seg": [
      "small"
    ]
  },
  {
    "id": "seat_ibiza_ice",
    "name": "SEAT Ibiza",
    "brand": "seat",
    "pt": "ice",
    "newP": 17900,
    "co2_wltp": 121.0,
    "seg": [
      "small"
    ]
  },
  {
    "id": "skoda_fabia_ice",
    "name": "Škoda Fabia",
    "brand": "skoda",
    "pt": "ice",
    "newP": 17400,
    "co2_wltp": 118.0,
    "seg": [
      "small"
    ]
  },
  {
    "id": "honda_jazz_hev",
    "name": "Honda Jazz e:HEV",
    "brand": "honda",
    "pt": "hev",
    "newP": 26900,
    "co2_wltp": 105.0,
    "seg": [
      "small"
    ]
  },
  {
    "id": "toyota_yaris_ice",
    "name": "Toyota Yaris",
    "brand": "toyota",
    "pt": "ice",
    "newP": 18900,
    "co2_wltp": 101.0,
    "seg": [
      "small"
    ]
  },
  {
    "id": "toyota_yaris_hev",
    "name": "Toyota Yaris Hybrid",
    "brand": "toyota",
    "pt": "hev",
    "newP": 22900,
    "co2_wltp": 101.0,
    "seg": [
      "small"
    ]
  },
  {
    "id": "mg_4_bev",
    "name": "MG 4 BEV",
    "brand": "mg",
    "pt": "bev",
    "newP": 28900,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "byd_dolphin_bev",
    "name": "BYD Dolphin BEV",
    "brand": "byd",
    "pt": "bev",
    "newP": 26900,
    "co2_wltp": 0.0,
    "seg": [
      "compact",
      "small"
    ]
  },
  {
    "id": "skoda_octavia_ice",
    "name": "Škoda Octavia",
    "brand": "skoda",
    "pt": "ice",
    "newP": 28900,
    "co2_wltp": 120.0,
    "seg": [
      "saloon"
    ]
  },
  {
    "id": "skoda_octavia_hev",
    "name": "Škoda Octavia iV PHEV",
    "brand": "skoda",
    "pt": "phev",
    "newP": 39900,
    "co2_wltp": 118.0,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "honda_civic_hev",
    "name": "Honda Civic e:HEV",
    "brand": "honda",
    "pt": "hev",
    "newP": 34900,
    "co2_wltp": 111.0,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "bmw_220e_phev",
    "name": "BMW 220e Active Tourer PHEV",
    "brand": "bmw",
    "pt": "phev",
    "newP": 49900,
    "co2_wltp": 123.0,
    "seg": [
      "compact",
      "mono"
    ]
  },
  {
    "id": "toyota_corolla_hev",
    "name": "Toyota Corolla HEV",
    "brand": "toyota",
    "pt": "hev",
    "newP": 29900,
    "co2_wltp": 107.0,
    "seg": [
      "compact",
      "coupe_sport"
    ]
  },
  {
    "id": "toyota_corolla_break",
    "name": "Toyota Corolla Touring Sports HEV",
    "brand": "toyota",
    "pt": "hev",
    "newP": 32900,
    "co2_wltp": 107.0,
    "seg": [
      "compact_break",
      "saloon_break"
    ]
  },
  {
    "id": "vw_passat_hev",
    "name": "VW Passat eHybrid PHEV",
    "brand": "vw",
    "pt": "phev",
    "newP": 50900,
    "co2_wltp": 120.0,
    "seg": [
      "compact",
      "saloon"
    ]
  },
  {
    "id": "mg5_bev",
    "name": "MG 5 Estate BEV",
    "brand": "mg",
    "pt": "bev",
    "newP": 31900,
    "seg": [
      "compact",
      "saloon"
    ]
  },
  {
    "id": "byd_seal_bev",
    "name": "BYD Seal BEV",
    "brand": "byd",
    "pt": "bev",
    "newP": 42900,
    "co2_wltp": 8.0,
    "seg": [
      "compact",
      "saloon"
    ]
  },
  {
    "id": "toyota_ch_r_hev",
    "name": "Toyota C-HR HEV",
    "brand": "toyota",
    "pt": "hev",
    "newP": 31900,
    "co2_wltp": 101.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "toyota_ch_r_phev",
    "name": "Toyota C-HR PHEV",
    "brand": "toyota",
    "pt": "phev",
    "newP": 42900,
    "co2_wltp": 101.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "ford_puma_hev",
    "name": "Ford Puma ST-Line HEV",
    "brand": "ford",
    "pt": "hev",
    "newP": 26900,
    "co2_wltp": 125.0,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "vw_t_roc_ice",
    "name": "VW T-Roc",
    "brand": "vw",
    "pt": "ice",
    "newP": 29900,
    "co2_wltp": 136.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "vw_t_roc_phev",
    "name": "VW T-Roc R-Line eHybrid",
    "brand": "vw",
    "pt": "phev",
    "newP": 42900,
    "co2_wltp": 136.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "skoda_kamiq_ice",
    "name": "Škoda Kamiq",
    "brand": "skoda",
    "pt": "ice",
    "newP": 24900,
    "co2_wltp": 128.0,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "seat_arona_ice",
    "name": "SEAT Arona",
    "brand": "seat",
    "pt": "ice",
    "newP": 22900,
    "co2_wltp": 127.0,
    "seg": [
      "suv_urban"
    ]
  },
  {
    "id": "nissan_qashqai_hev",
    "name": "Nissan Qashqai e-Power",
    "brand": "nissan",
    "pt": "hev",
    "newP": 39900,
    "co2_wltp": 135.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "renault_austral_hev",
    "name": "Renault Austral E-Tech HEV",
    "brand": "renault",
    "pt": "hev",
    "newP": 36900,
    "co2_wltp": 117.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "renault_austral_phev",
    "name": "Renault Austral E-Tech PHEV",
    "brand": "renault",
    "pt": "phev",
    "newP": 44900,
    "co2_wltp": 117.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "bmw_x2_bev",
    "name": "BMW iX2 xDrive30",
    "brand": "bmw",
    "pt": "bev",
    "newP": 57900,
    "co2_wltp": 0.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "audi_q2_ice",
    "name": "Audi Q2",
    "brand": "audi",
    "pt": "ice",
    "newP": 34900,
    "co2_wltp": 140.0,
    "seg": [
      "small",
      "suv_compact"
    ]
  },
  {
    "id": "volvo_xc40_phev",
    "name": "Volvo XC40 Recharge PHEV",
    "brand": "volvo",
    "pt": "phev",
    "newP": 54900,
    "co2_wltp": 96.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "mg_zs_bev",
    "name": "MG ZS EV",
    "brand": "mg",
    "pt": "bev",
    "newP": 29900,
    "co2_wltp": 133.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "byd_atto3_bev",
    "name": "BYD Atto 3 BEV",
    "brand": "byd",
    "pt": "bev",
    "newP": 38900,
    "co2_wltp": 0.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "skoda_kodiaq_phev",
    "name": "Škoda Kodiaq iV PHEV",
    "brand": "skoda",
    "pt": "phev",
    "newP": 52900,
    "co2_wltp": 145.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "seat_tarraco_phev",
    "name": "SEAT Tarraco e-Hybrid",
    "brand": "seat",
    "pt": "phev",
    "newP": 47900,
    "co2_wltp": 129.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "nissan_ariya_bev",
    "name": "Nissan Ariya BEV",
    "brand": "nissan",
    "pt": "bev",
    "newP": 52900,
    "co2_wltp": 0.0,
    "seg": [
      "suv_compact",
      "suv_family"
    ]
  },
  {
    "id": "kia_sportage_hev",
    "name": "Kia Sportage HEV",
    "brand": "kia",
    "pt": "hev",
    "newP": 36900,
    "co2_wltp": 127.0,
    "seg": [
      "suv_compact",
      "suv_family"
    ]
  },
  {
    "id": "kia_sportage_phev",
    "name": "Kia Sportage PHEV",
    "brand": "kia",
    "pt": "phev",
    "newP": 44900,
    "co2_wltp": 127.0,
    "seg": [
      "suv_compact",
      "suv_family"
    ]
  },
  {
    "id": "hyundai_nexo_bev",
    "name": "Hyundai Tucson ICE",
    "brand": "hyundai",
    "pt": "ice",
    "newP": 29900,
    "co2_wltp": 129.0,
    "seg": [
      "suv_compact",
      "suv_family"
    ]
  },
  {
    "id": "ford_explorer_bev",
    "name": "Ford Explorer BEV",
    "brand": "ford",
    "pt": "bev",
    "newP": 48900,
    "co2_wltp": 7.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "renault_espace_hev",
    "name": "Renault Espace E-Tech HEV",
    "brand": "renault",
    "pt": "hev",
    "newP": 42900,
    "co2_wltp": 108.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "toyota_rav4_ice",
    "name": "Toyota RAV4 ICE",
    "brand": "toyota",
    "pt": "ice",
    "newP": 34900,
    "co2_wltp": 114.0,
    "seg": [
      "suv_compact",
      "suv_family"
    ]
  },
  {
    "id": "honda_cr_v_phev",
    "name": "Honda CR-V e:PHEV",
    "brand": "honda",
    "pt": "phev",
    "newP": 52900,
    "co2_wltp": 121.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "bmw_x5_phev",
    "name": "BMW X5 xDrive50e PHEV",
    "brand": "bmw",
    "pt": "phev",
    "newP": 89900,
    "co2_wltp": 25.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "audi_q7_phev",
    "name": "Audi Q7 TFSI e Quattro",
    "brand": "audi",
    "pt": "phev",
    "newP": 89900,
    "co2_wltp": 166.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "skoda_superb_phev",
    "name": "Škoda Superb iV PHEV",
    "brand": "skoda",
    "pt": "phev",
    "newP": 51900,
    "co2_wltp": 130.0,
    "seg": [
      "executive"
    ]
  },
  {
    "id": "bmw_i4_bev",
    "name": "BMW i4 eDrive40",
    "brand": "bmw",
    "pt": "bev",
    "newP": 62900,
    "co2_wltp": 0.0,
    "seg": [
      "compact",
      "saloon"
    ]
  },
  {
    "id": "audi_a6_phev",
    "name": "Audi A6 TFSI e Quattro",
    "brand": "audi",
    "pt": "phev",
    "newP": 72900,
    "co2_wltp": 129.0,
    "seg": [
      "saloon"
    ]
  },
  {
    "id": "mercedes_eqe_bev",
    "name": "Mercedes EQE BEV",
    "brand": "mercedes",
    "pt": "bev",
    "newP": 74900,
    "co2_wltp": 0.0,
    "seg": [
      "saloon"
    ]
  },
  {
    "id": "toyota_bz4x_bev",
    "name": "Toyota bZ4X BEV",
    "brand": "toyota",
    "pt": "bev",
    "newP": 44900,
    "co2_wltp": 0.0,
    "seg": [
      "suv_compact",
      "suv_family"
    ]
  },
  {
    "id": "lexus_ux_hev",
    "name": "Lexus UX 250h HEV",
    "brand": "lexus",
    "pt": "hev",
    "newP": 43900,
    "co2_wltp": 121.0,
    "seg": [
      "executive"
    ]
  },
  {
    "id": "lexus_nx_phev",
    "name": "Lexus NX 450h+ PHEV",
    "brand": "lexus",
    "pt": "phev",
    "newP": 62900,
    "co2_wltp": 23.0,
    "seg": [
      "executive"
    ]
  },
  {
    "id": "mazda_cx30_hev",
    "name": "Mazda CX-30",
    "brand": "mazda",
    "pt": "ice",
    "newP": 27900,
    "co2_wltp": 139.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "mazda_mx30_bev",
    "name": "Mazda MX-30 BEV",
    "brand": "mazda",
    "pt": "bev",
    "newP": 34900,
    "co2_wltp": 13.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "vw_id7_bev",
    "name": "VW ID.7 BEV",
    "brand": "vw",
    "pt": "bev",
    "newP": 59900,
    "co2_wltp": 0.0,
    "seg": [
      "compact",
      "saloon"
    ]
  },
  {
    "id": "kia_ev6_bev",
    "name": "Kia EV6 AWD",
    "brand": "kia",
    "pt": "bev",
    "newP": 55900,
    "seg": [
      "compact",
      "suv_compact"
    ]
  },
  {
    "id": "hyundai_ioniq6_bev",
    "name": "Hyundai Ioniq 6 AWD",
    "brand": "hyundai",
    "pt": "bev",
    "newP": 54900,
    "co2_wltp": 0.0,
    "seg": [
      "compact",
      "saloon"
    ]
  },
  {
    "id": "vw_id5_bev",
    "name": "VW ID.5 GTX AWD",
    "brand": "vw",
    "pt": "bev",
    "newP": 57900,
    "co2_wltp": 0.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "bmw_ix3_bev",
    "name": "BMW iX3 BEV",
    "brand": "bmw",
    "pt": "bev",
    "newP": 64900,
    "co2_wltp": 2.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "mercedes_eqc_bev",
    "name": "Mercedes EQC 400 4MATIC",
    "brand": "mercedes",
    "pt": "bev",
    "newP": 72900,
    "co2_wltp": 0.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "audi_etron_bev",
    "name": "Audi Q8 e-tron Quattro",
    "brand": "audi",
    "pt": "bev",
    "newP": 74900,
    "co2_wltp": 222.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "clio5_ice",
    "name": "Renault Clio V (essence)",
    "brand": "renault",
    "pt": "ice",
    "newP": 16900,
    "co2_wltp": 116.0,
    "seg": [
      "small"
    ]
  },
  {
    "id": "captur2_ice",
    "name": "Renault Captur II (essence)",
    "brand": "renault",
    "pt": "ice",
    "newP": 19900,
    "co2_wltp": 128.0,
    "seg": [
      "suv_urban"
    ]
  },
  {
    "id": "zoe_2024",
    "name": "Renault Zoé (2024)",
    "brand": "renault",
    "pt": "bev",
    "newP": 27900,
    "seg": [
      "small"
    ]
  },
  {
    "id": "r5_bev",
    "name": "Renault R5 E-Tech BEV",
    "brand": "renault",
    "pt": "bev",
    "newP": 24900,
    "seg": [
      "small"
    ]
  },
  {
    "id": "megane_bev",
    "name": "Renault Mégane E-Tech BEV",
    "brand": "renault",
    "pt": "bev",
    "newP": 34900,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "sandero_ice",
    "name": "Dacia Sandero",
    "brand": "dacia",
    "pt": "ice",
    "newP": 11990,
    "co2_wltp": 120.0,
    "seg": [
      "small"
    ]
  },
  {
    "id": "sandero_hev",
    "name": "Dacia Sandero HEV",
    "brand": "dacia",
    "pt": "hev",
    "newP": 15900,
    "co2_wltp": 120.0,
    "seg": [
      "small"
    ]
  },
  {
    "id": "208_bev_new",
    "name": "Peugeot e-208 (2024)",
    "brand": "peugeot",
    "pt": "bev",
    "newP": 32900,
    "co2_wltp": 91.0,
    "seg": [
      "small"
    ]
  },
  {
    "id": "2008_ice",
    "name": "Peugeot 2008 (essence)",
    "brand": "peugeot",
    "pt": "ice",
    "newP": 22900,
    "co2_wltp": 112.0,
    "seg": [
      "suv_urban"
    ]
  },
  {
    "id": "e2008_bev_new",
    "name": "Peugeot e-2008 (2024)",
    "brand": "peugeot",
    "pt": "bev",
    "newP": 40900,
    "co2_wltp": 111.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "308_ice",
    "name": "Peugeot 308 (essence)",
    "brand": "peugeot",
    "pt": "ice",
    "newP": 25900,
    "co2_wltp": 106.0,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "3008_ice",
    "name": "Peugeot 3008 (essence)",
    "brand": "peugeot",
    "pt": "ice",
    "newP": 36900,
    "co2_wltp": 111.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "3008_bev",
    "name": "Peugeot E-3008 BEV",
    "brand": "peugeot",
    "pt": "bev",
    "newP": 46990,
    "co2_wltp": 110.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "5008_hev",
    "name": "Peugeot 5008 HEV",
    "brand": "peugeot",
    "pt": "hev",
    "newP": 44900,
    "co2_wltp": 130.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "5008_bev",
    "name": "Peugeot E-5008 BEV",
    "brand": "peugeot",
    "pt": "bev",
    "newP": 54990,
    "co2_wltp": 129.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "c3_bev",
    "name": "Citroën ë-C3 BEV",
    "brand": "citroen",
    "pt": "bev",
    "newP": 23300,
    "co2_wltp": 124.0,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "c4_ice",
    "name": "Citroën C4 (essence)",
    "brand": "citroen",
    "pt": "ice",
    "newP": 23900,
    "co2_wltp": 105.0,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "ec4_bev",
    "name": "Citroën ë-C4 BEV",
    "brand": "citroen",
    "pt": "bev",
    "newP": 38900,
    "co2_wltp": 127.0,
    "seg": [
      "compact",
      "coupe_sport"
    ]
  },
  {
    "id": "golf8_mild",
    "name": "VW Golf 8 eTSI Mild Hybrid",
    "brand": "vw",
    "pt": "hev",
    "newP": 30900,
    "co2_wltp": 118.0,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "troc_ice",
    "name": "VW T-Roc (essence)",
    "brand": "vw",
    "pt": "ice",
    "newP": 27900,
    "co2_wltp": 136.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "troc_phev",
    "name": "VW T-Roc eHybrid PHEV",
    "brand": "vw",
    "pt": "phev",
    "newP": 40900,
    "co2_wltp": 136.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "kona_ice",
    "name": "Hyundai Kona (essence)",
    "brand": "hyundai",
    "pt": "ice",
    "newP": 38725,
    "co2_wltp": 79.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "ioniq5_rwd",
    "name": "Hyundai Ioniq 5 RWD",
    "brand": "hyundai",
    "pt": "bev",
    "newP": 41900,
    "co2_wltp": 0.0,
    "seg": [
      "compact",
      "suv_compact"
    ]
  },
  {
    "id": "i20_ice",
    "name": "Hyundai i20",
    "brand": "hyundai",
    "pt": "ice",
    "newP": 18900,
    "co2_wltp": 123.0,
    "seg": [
      "small"
    ]
  },
  {
    "id": "sportage_ice",
    "name": "Kia Sportage (essence)",
    "brand": "kia",
    "pt": "ice",
    "newP": 29900,
    "co2_wltp": 127.0,
    "seg": [
      "suv_compact",
      "suv_family"
    ]
  },
  {
    "id": "niro_hev_new",
    "name": "Kia Niro hybride (2023)",
    "brand": "kia",
    "pt": "hev",
    "newP": 28900,
    "co2_wltp": 54.0,
    "seg": [
      "small",
      "suv_compact"
    ]
  },
  {
    "id": "niro_phev_new",
    "name": "Kia Niro hybride rechargeable (2023)",
    "brand": "kia",
    "pt": "phev",
    "newP": 36900,
    "co2_wltp": 54.0,
    "seg": [
      "small",
      "suv_compact"
    ]
  },
  {
    "id": "niro_bev_new",
    "name": "Kia e-Niro (2023)",
    "brand": "kia",
    "pt": "bev",
    "newP": 42900,
    "co2_wltp": 55.0,
    "seg": [
      "small",
      "suv_compact"
    ]
  },
  {
    "id": "x1_bev",
    "name": "BMW iX1 xDrive30 BEV",
    "brand": "bmw",
    "pt": "bev",
    "newP": 55900,
    "co2_wltp": 2.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "serie3_phev",
    "name": "BMW 330e PHEV",
    "brand": "bmw",
    "pt": "phev",
    "newP": 73300,
    "co2_wltp": 31.0,
    "seg": [
      "saloon"
    ]
  },
  {
    "id": "gla_bev",
    "name": "Mercedes EQA 250+ BEV",
    "brand": "mercedes",
    "pt": "bev",
    "newP": 51900,
    "co2_wltp": 0.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "kuga_ice",
    "name": "Ford Kuga (essence)",
    "brand": "ford",
    "pt": "ice",
    "newP": 32900,
    "co2_wltp": 92.0,
    "seg": [
      "suv_compact",
      "suv_family"
    ]
  },
  {
    "id": "focus_hev",
    "name": "Ford Focus ST-Line HEV",
    "brand": "ford",
    "pt": "hev",
    "newP": 29900,
    "co2_wltp": 129.0,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "mustang_bev",
    "name": "Ford Mustang Mach-E BEV",
    "brand": "ford",
    "pt": "bev",
    "newP": 48900,
    "co2_wltp": 50.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "octavia_ice",
    "name": "Škoda Octavia (essence)",
    "brand": "skoda",
    "pt": "ice",
    "newP": 27900,
    "co2_wltp": 120.0,
    "seg": [
      "saloon"
    ]
  },
  {
    "id": "octavia_phev",
    "name": "Škoda Octavia iV PHEV",
    "brand": "skoda",
    "pt": "phev",
    "newP": 41900,
    "co2_wltp": 118.0,
    "seg": [
      "saloon"
    ]
  },
  {
    "id": "leon_ice",
    "name": "SEAT León (essence)",
    "brand": "seat",
    "pt": "ice",
    "newP": 22900,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "leon_phev",
    "name": "SEAT León e-Hybrid PHEV",
    "brand": "seat",
    "pt": "phev",
    "newP": 46719,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "born_bev",
    "name": "CUPRA Born BEV",
    "brand": "cupra",
    "pt": "bev",
    "newP": 37900,
    "co2_wltp": 0.0,
    "seg": [
      "compact",
      "coupe_sport"
    ]
  },
  {
    "id": "mokka_ice_new",
    "name": "Opel Mokka (essence)",
    "brand": "opel",
    "pt": "ice",
    "newP": 24900,
    "co2_wltp": 112.0,
    "seg": [
      "suv_urban"
    ]
  },
  {
    "id": "mokka_bev_new",
    "name": "Opel Mokka Electric",
    "brand": "opel",
    "pt": "bev",
    "newP": 36900,
    "co2_wltp": 111.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "grandland_phev",
    "name": "Opel Grandland PHEV",
    "brand": "opel",
    "pt": "phev",
    "newP": 42900,
    "co2_wltp": 132.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "astra_hev",
    "name": "Opel Astra GSe PHEV",
    "brand": "opel",
    "pt": "phev",
    "newP": 38900,
    "co2_wltp": 110.0,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "cx5_ice_new",
    "name": "Mazda CX-5 (essence)",
    "brand": "mazda",
    "pt": "ice",
    "newP": 32900,
    "co2_wltp": 159.0,
    "seg": [
      "suv_compact",
      "suv_family"
    ]
  },
  {
    "id": "asx_ice",
    "name": "Mitsubishi ASX (essence)",
    "brand": "mitsubishi",
    "pt": "ice",
    "newP": 24900,
    "co2_wltp": 116.0,
    "seg": [
      "suv_urban"
    ]
  },
  {
    "id": "outlander_phev_new",
    "name": "Mitsubishi Outlander hybride rechargeable (2023)",
    "brand": "mitsubishi",
    "pt": "phev",
    "newP": 52900,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "taycan_bev",
    "name": "Porsche Taycan BEV",
    "brand": "porsche",
    "pt": "bev",
    "newP": 99900,
    "co2_wltp": 0.0,
    "seg": [
      "compact",
      "saloon",
      "coupe_sport"
    ]
  },
  {
    "id": "rx_hev",
    "name": "Lexus RX 500h HEV",
    "brand": "lexus",
    "pt": "hev",
    "newP": 74900,
    "seg": [
      "executive"
    ]
  },
  {
    "id": "classe_c_ice",
    "name": "Mercedes Classe C 220d",
    "brand": "mercedes",
    "pt": "ice",
    "newP": 47900,
    "co2_wltp": 131.0,
    "seg": [
      "saloon"
    ]
  },
  {
    "id": "classe_c_phev",
    "name": "Mercedes C 300 e PHEV",
    "brand": "mercedes",
    "pt": "phev",
    "newP": 58900,
    "co2_wltp": 20.0,
    "seg": [
      "saloon"
    ]
  },
  {
    "id": "glc_phev",
    "name": "Mercedes GLC 300 e PHEV",
    "brand": "mercedes",
    "pt": "phev",
    "newP": 89900,
    "co2_wltp": 21.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "eqb_bev",
    "name": "Mercedes EQB 300 4MATIC",
    "brand": "mercedes",
    "pt": "bev",
    "newP": 58900,
    "co2_wltp": 0.0,
    "seg": [
      "suv_compact",
      "suv_family"
    ]
  },
  {
    "id": "gle_phev",
    "name": "Mercedes GLE 350 de PHEV",
    "brand": "mercedes",
    "pt": "phev",
    "newP": 84900,
    "co2_wltp": 25.0,
    "seg": [
      "executive"
    ]
  },
  {
    "id": "classe_a_phev",
    "name": "Mercedes Classe A 250 e PHEV",
    "brand": "mercedes",
    "pt": "phev",
    "newP": 44900,
    "co2_wltp": 26.0,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "serie2_phev",
    "name": "BMW 225e Active Tourer PHEV",
    "brand": "bmw",
    "pt": "phev",
    "newP": 44900,
    "seg": [
      "compact",
      "mono"
    ]
  },
  {
    "id": "serie4_ice",
    "name": "BMW Série 4 Coupé",
    "brand": "bmw",
    "pt": "ice",
    "newP": 54900,
    "seg": [
      "compact",
      "saloon"
    ]
  },
  {
    "id": "serie5_phev",
    "name": "BMW 530e PHEV",
    "brand": "bmw",
    "pt": "phev",
    "newP": 105050,
    "co2_wltp": 24.0,
    "seg": [
      "executive"
    ]
  },
  {
    "id": "x2_bev",
    "name": "BMW X2 sDrive20i",
    "brand": "bmw",
    "pt": "ice",
    "newP": 46900,
    "co2_wltp": 133.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "x4_ice",
    "name": "BMW X4 xDrive20d",
    "brand": "bmw",
    "pt": "ice",
    "newP": 62900,
    "co2_wltp": 156.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "serie1_ice",
    "name": "BMW Série 1 120i",
    "brand": "bmw",
    "pt": "ice",
    "newP": 39900,
    "co2_wltp": 128.0,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "a4_ice",
    "name": "Audi A4 Avant 40 TFSI",
    "brand": "audi",
    "pt": "ice",
    "newP": 46900,
    "co2_wltp": 148.0,
    "seg": [
      "saloon"
    ]
  },
  {
    "id": "a4_phev",
    "name": "Audi A4 TFSI e PHEV",
    "brand": "audi",
    "pt": "phev",
    "newP": 56900,
    "co2_wltp": 148.0,
    "seg": [
      "saloon"
    ]
  },
  {
    "id": "a6_ice",
    "name": "Audi A6 55 TFSI",
    "brand": "audi",
    "pt": "ice",
    "newP": 64900,
    "co2_wltp": 40.0,
    "seg": [
      "executive"
    ]
  },
  {
    "id": "q6_bev",
    "name": "Audi Q6 e-tron Quattro",
    "brand": "audi",
    "pt": "bev",
    "newP": 74900,
    "co2_wltp": 0.0,
    "seg": [
      "suv_compact",
      "suv_family"
    ]
  },
  {
    "id": "bmw_m2_ice",
    "name": "BMW M2",
    "brand": "bmw",
    "pt": "ice",
    "newP": 72900,
    "co2_wltp": 208.0,
    "seg": [
      "coupe_sport"
    ]
  },
  {
    "id": "bmw_m4_ice",
    "name": "BMW M4 Competition",
    "brand": "bmw",
    "pt": "ice",
    "newP": 94900,
    "co2_wltp": 229.0,
    "seg": [
      "coupe_sport"
    ]
  },
  {
    "id": "audi_rs3_ice",
    "name": "Audi RS3 Sportback",
    "brand": "audi",
    "pt": "ice",
    "newP": 69900,
    "co2_wltp": 189.0,
    "seg": [
      "compact",
      "coupe_sport"
    ]
  },
  {
    "id": "mercedes_amg_a45_ice",
    "name": "Mercedes-AMG A 45 S",
    "brand": "mercedes",
    "pt": "ice",
    "newP": 72900,
    "seg": [
      "compact",
      "coupe_sport"
    ]
  },
  {
    "id": "porsche_911_ice",
    "name": "Porsche 911 Carrera",
    "brand": "porsche",
    "pt": "ice",
    "newP": 129900,
    "co2_wltp": 241.0,
    "seg": [
      "coupe_sport"
    ]
  },
  {
    "id": "alpine_a110_ice",
    "name": "Alpine A110",
    "brand": "renault",
    "pt": "ice",
    "newP": 72900,
    "seg": [
      "coupe_sport"
    ]
  },
  {
    "id": "toyota_gr86_ice",
    "name": "Toyota GR86",
    "brand": "toyota",
    "pt": "ice",
    "newP": 36900,
    "co2_wltp": 199.0,
    "seg": [
      "coupe_sport"
    ]
  },
  {
    "id": "cupra_formentor_ice",
    "name": "CUPRA Formentor 2.0 TSI",
    "brand": "cupra",
    "pt": "ice",
    "newP": 39900,
    "co2_wltp": 159.0,
    "seg": [
      "coupe_sport",
      "suv_compact"
    ]
  },
  {
    "id": "tesla_model3_perf",
    "name": "Tesla Model 3 Performance",
    "brand": "tesla",
    "pt": "bev",
    "newP": 56900,
    "co2_wltp": 0.0,
    "seg": [
      "compact",
      "coupe_sport"
    ]
  },
  {
    "id": "clio_die",
    "name": "Renault Clio dCi",
    "brand": "renault",
    "pt": "die",
    "newP": 19900,
    "co2_wltp": 116.0,
    "seg": [
      "small"
    ]
  },
  {
    "id": "p308_die",
    "name": "Peugeot 308 BlueHDi",
    "brand": "peugeot",
    "pt": "die",
    "newP": 30900,
    "co2_wltp": 105.0,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "golf_tdi",
    "name": "Volkswagen Golf TDI",
    "brand": "vw",
    "pt": "die",
    "newP": 34900,
    "co2_wltp": 117.0,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "octavia_tdi",
    "name": "Škoda Octavia TDI",
    "brand": "skoda",
    "pt": "die",
    "newP": 33900,
    "co2_wltp": 120.0,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "karoq_tdi",
    "name": "Škoda Karoq TDI",
    "brand": "skoda",
    "pt": "die",
    "newP": 37900,
    "co2_wltp": 143.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "kodiaq_tdi",
    "name": "Škoda Kodiaq TDI",
    "brand": "skoda",
    "pt": "die",
    "newP": 43900,
    "co2_wltp": 145.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "tiguan_tdi",
    "name": "VW Tiguan TDI",
    "brand": "vw",
    "pt": "die",
    "newP": 42900,
    "co2_wltp": 129.0,
    "seg": [
      "suv_compact",
      "suv_family"
    ]
  },
  {
    "id": "a4_tdi",
    "name": "Audi A4 TDI Quattro",
    "brand": "audi",
    "pt": "die",
    "newP": 52900,
    "co2_wltp": 148.0,
    "seg": [
      "compact",
      "saloon"
    ]
  },
  {
    "id": "a6_tdi",
    "name": "Audi A6 TDI Quattro",
    "brand": "audi",
    "pt": "die",
    "newP": 67900,
    "co2_wltp": 129.0,
    "seg": [
      "saloon"
    ]
  },
  {
    "id": "q5_tdi",
    "name": "Audi Q5 TDI Quattro",
    "brand": "audi",
    "pt": "die",
    "newP": 60900,
    "co2_wltp": 137.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "serie3_tdi",
    "name": "BMW Série 3 320d",
    "brand": "bmw",
    "pt": "die",
    "newP": 52900,
    "co2_wltp": 136.0,
    "seg": [
      "compact",
      "saloon"
    ]
  },
  {
    "id": "x3_tdi",
    "name": "BMW X3 xDrive20d",
    "brand": "bmw",
    "pt": "die",
    "newP": 60900,
    "co2_wltp": 155.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "glc_tdi",
    "name": "Mercedes GLC 220d",
    "brand": "mercedes",
    "pt": "die",
    "newP": 64900,
    "co2_wltp": 137.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "classe_c_tdi",
    "name": "Mercedes Classe C 220d",
    "brand": "mercedes",
    "pt": "die",
    "newP": 52900,
    "co2_wltp": 131.0,
    "seg": [
      "compact",
      "saloon"
    ]
  },
  {
    "id": "mazda_cx60_die",
    "name": "Mazda CX-60 e-Skyactiv D",
    "brand": "mazda",
    "pt": "die",
    "newP": 52900,
    "co2_wltp": 89.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "leon_tdi",
    "name": "SEAT León TDI",
    "brand": "seat",
    "pt": "die",
    "newP": 28900,
    "seg": [
      "compact"
    ]
  },
  {
    "id": "formentor_tdi",
    "name": "CUPRA Formentor TDI",
    "brand": "cupra",
    "pt": "die",
    "newP": 39900,
    "co2_wltp": 122.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "rx450h",
    "name": "Lexus RX 450h HEV",
    "brand": "lexus",
    "pt": "hev",
    "newP": 64900,
    "co2_wltp": 25.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "highlander_hev",
    "name": "Toyota Highlander HEV",
    "brand": "toyota",
    "pt": "hev",
    "newP": 59900,
    "co2_wltp": 155.0,
    "seg": [
      "suv_family"
    ]
  },
  {
    "id": "xc60_recharge",
    "name": "Volvo XC60 Recharge T6",
    "brand": "volvo",
    "pt": "phev",
    "newP": 65900,
    "co2_wltp": 71.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "q5_55e",
    "name": "Audi Q5 55 TFSI e PHEV",
    "brand": "audi",
    "pt": "phev",
    "newP": 67900,
    "co2_wltp": 162.0,
    "seg": [
      "suv_compact"
    ]
  },
  {
    "id": "c300e_break",
    "name": "Mercedes Classe C 300 e Break",
    "brand": "mercedes",
    "pt": "phev",
    "newP": 64900,
    "co2_wltp": 31.0,
    "seg": [
      "saloon_break"
    ]
  },
  {
    "id": "e300e",
    "name": "Mercedes Classe E 300 e PHEV",
    "brand": "mercedes",
    "pt": "phev",
    "newP": 71900,
    "co2_wltp": 23.0,
    "seg": [
      "saloon",
      "executive"
    ]
  },
  {
    "id": "530e",
    "name": "BMW Série 5 530e PHEV",
    "brand": "bmw",
    "pt": "phev",
    "newP": 69900,
    "co2_wltp": 22.0,
    "seg": [
      "saloon",
      "executive"
    ]
  },
  {
    "id": "xc90_t8",
    "name": "Volvo XC90 T8 Recharge PHEV",
    "brand": "volvo",
    "pt": "phev",
    "newP": 79900,
    "co2_wltp": 74.0,
    "seg": [
      "suv_large",
      "suv_family"
    ]
  },
  {
    "id": "touareg_phev",
    "name": "Volkswagen Touareg eHybrid",
    "brand": "vw",
    "pt": "phev",
    "newP": 79900,
    "co2_wltp": 180.0,
    "seg": [
      "suv_large"
    ]
  },
  {
    "id": "cla200",
    "name": "Mercedes CLA 200 AMG Line",
    "brand": "mercedes",
    "pt": "ice",
    "newP": 43900,
    "co2_wltp": 137.0,
    "seg": [
      "compact",
      "coupe_sport"
    ]
  },
  {
    "id": "cla250e",
    "name": "Mercedes CLA 250 e PHEV",
    "brand": "mercedes",
    "pt": "phev",
    "newP": 52900,
    "co2_wltp": 24.0,
    "seg": [
      "compact",
      "coupe_sport"
    ]
  },
  {
    "id": "eqa_coupe",
    "name": "Mercedes EQA 250 AMG Line",
    "brand": "mercedes",
    "pt": "bev",
    "newP": 52900,
    "co2_wltp": 0.0,
    "seg": [
      "suv_compact",
      "coupe_sport"
    ]
  },
  {
    "id": "c_coupe",
    "name": "Mercedes Classe C Coupé C200",
    "brand": "mercedes",
    "pt": "ice",
    "newP": 58900,
    "co2_wltp": 131.0,
    "seg": [
      "saloon",
      "coupe_sport"
    ]
  },
  {
    "id": "amg_c43",
    "name": "Mercedes-AMG C 43 4MATIC",
    "brand": "mercedes",
    "pt": "ice",
    "newP": 72900,
    "co2_wltp": 217.0,
    "seg": [
      "saloon",
      "coupe_sport"
    ]
  },
  {
    "id": "cls450",
    "name": "Mercedes CLS 450 4MATIC",
    "brand": "mercedes",
    "pt": "ice",
    "newP": 84900,
    "co2_wltp": 199.0,
    "seg": [
      "executive",
      "coupe_sport"
    ]
  },
  {
    "id": "serie2_coupe",
    "name": "BMW Série 2 Coupé M240i",
    "brand": "bmw",
    "pt": "ice",
    "newP": 52900,
    "co2_wltp": 220.0,
    "seg": [
      "compact",
      "saloon",
      "coupe_sport"
    ]
  },
  {
    "id": "serie4_gran",
    "name": "BMW Série 4 Gran Coupé 430i",
    "brand": "bmw",
    "pt": "ice",
    "newP": 59900,
    "co2_wltp": 162.0,
    "seg": [
      "saloon",
      "coupe_sport"
    ]
  },
  {
    "id": "m340i",
    "name": "BMW M340i xDrive",
    "brand": "bmw",
    "pt": "ice",
    "newP": 67900,
    "co2_wltp": 185.0,
    "seg": [
      "saloon",
      "coupe_sport"
    ]
  },
  {
    "id": "440i_gran",
    "name": "BMW Série 4 Gran Coupé M440i",
    "brand": "bmw",
    "pt": "ice",
    "newP": 67900,
    "co2_wltp": 181.0,
    "seg": [
      "saloon",
      "coupe_sport"
    ]
  },
  {
    "id": "i4_m50",
    "name": "BMW i4 M50 xDrive",
    "brand": "bmw",
    "pt": "bev",
    "newP": 75900,
    "co2_wltp": 4.0,
    "seg": [
      "saloon",
      "coupe_sport"
    ]
  },
  {
    "id": "m3_comp",
    "name": "BMW M3 Competition xDrive",
    "brand": "bmw",
    "pt": "ice",
    "newP": 82900,
    "co2_wltp": 226.0,
    "seg": [
      "saloon",
      "coupe_sport"
    ]
  },
  {
    "id": "a5_sportback",
    "name": "Audi A5 Sportback 40 TFSI",
    "brand": "audi",
    "pt": "ice",
    "newP": 52900,
    "co2_wltp": 152.0,
    "seg": [
      "compact",
      "saloon",
      "coupe_sport"
    ]
  },
  {
    "id": "a5_sportback_phev",
    "name": "Audi A5 Sportback TFSI e",
    "brand": "audi",
    "pt": "phev",
    "newP": 62900,
    "co2_wltp": 152.0,
    "seg": [
      "compact",
      "saloon",
      "coupe_sport"
    ]
  },
  {
    "id": "tt_rs",
    "name": "Audi TT RS Coupé",
    "brand": "audi",
    "pt": "ice",
    "newP": 69900,
    "seg": [
      "coupe_sport"
    ]
  },
  {
    "id": "s5_sportback",
    "name": "Audi S5 Sportback",
    "brand": "audi",
    "pt": "ice",
    "newP": 68900,
    "co2_wltp": 210.0,
    "seg": [
      "saloon",
      "coupe_sport"
    ]
  },
  {
    "id": "rs5_sportback",
    "name": "Audi RS5 Sportback",
    "brand": "audi",
    "pt": "ice",
    "newP": 84900,
    "co2_wltp": 210.0,
    "seg": [
      "saloon",
      "coupe_sport"
    ]
  },
  {
    "id": "a7_sportback",
    "name": "Audi A7 Sportback 55 TFSI",
    "brand": "audi",
    "pt": "ice",
    "newP": 74900,
    "co2_wltp": 172.0,
    "seg": [
      "executive",
      "coupe_sport"
    ]
  },
  {
    "id": "etron_gt",
    "name": "Audi e-tron GT quattro",
    "brand": "audi",
    "pt": "bev",
    "newP": 105900,
    "co2_wltp": 0.0,
    "seg": [
      "saloon",
      "coupe_sport"
    ]
  },
  {
    "id": "ftype_p300",
    "name": "Jaguar F-Type P300",
    "brand": "jaguar",
    "pt": "ice",
    "newP": 72900,
    "co2_wltp": 230.0,
    "seg": [
      "coupe_sport"
    ]
  },
  {
    "id": "ftype_p450",
    "name": "Jaguar F-Type P450 AWD",
    "brand": "jaguar",
    "pt": "ice",
    "newP": 99900,
    "co2_wltp": 230.0,
    "seg": [
      "coupe_sport"
    ]
  },
  {
    "id": "ipace",
    "name": "Jaguar I-Pace BEV",
    "brand": "jaguar",
    "pt": "bev",
    "newP": 77900,
    "co2_wltp": 0.0,
    "seg": [
      "suv_compact",
      "coupe_sport"
    ]
  },
  {
    "id": "xe_p300",
    "name": "Jaguar XE P300 AWD",
    "brand": "jaguar",
    "pt": "ice",
    "newP": 54900,
    "co2_wltp": 157.0,
    "seg": [
      "saloon",
      "coupe_sport"
    ]
  },
  {
    "id": "giulia_qv",
    "name": "Alfa Romeo Giulia Quadrifoglio",
    "brand": "alfa",
    "pt": "ice",
    "newP": 89900,
    "co2_wltp": 166.0,
    "seg": [
      "saloon",
      "coupe_sport"
    ]
  }
];
