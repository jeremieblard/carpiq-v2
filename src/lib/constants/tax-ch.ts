/**
 * Taxe annuelle cantonale Suisse (26 cantons + default).
 *
 * Source : v64.0.4 lignes 9451-9787.
 *
 * Chaque canton a son barème spécifique (méthode + paramètres). La fonction
 * `compute(specs, co2, age, pt)` calcule la taxe annuelle en CHF selon
 * les spécifications estimées du véhicule.
 *
 * Type EstimatedSpecs (cf. tax.ts) :
 *   { weight: number;  // kg
 *     kW: number;      // puissance kilowatts
 *     cc: number;      // cylindrée cm³ (0 pour BEV) }
 *
 * Méthodes utilisées :
 *   - kw_only : taxe linéaire en kW
 *   - kw_only_strong_co2 : kW + surcharge CO2 forte
 *   - weight_power_co2 : combine poids + puissance + CO2
 *   - cc_only : taxe basée sur cylindrée
 *   - hp_basic : taxe forfaitaire par tranche de chevaux fiscaux
 *   - power_weight : combine puissance et poids
 *   - average : fallback générique (CH_CANTON_DEFAULT)
 *
 * ⚠ Code copié quasi à l'identique de v64.0.4 (logique cantonale complexe).
 * Re-formaté pour TypeScript : ajout de types sur compute().
 */

/** Spécifications estimées d'un véhicule (sortie de estimateVehicleSpecs). */
export interface EstimatedSpecs {
  weight: number;
  kW: number;
  cc: number;
}

/** Configuration d'exemption / réduction BEV par canton. */
export interface CantonBevConfig {
  exempt_years?: number;
  max_weight?: number;
  fixed_min?: number;
  discount?: number;
  permanent?: boolean;
  registered_after?: number;
  max_years?: number;
  then_normal?: boolean;
  first_year_exempt?: boolean;
}

/** Réduction HEV / PHEV (peut être un nombre ou un objet avec max_years). */
export type CantonHevDiscount =
  | number
  | { rate: number; max_years: number };

/** Définition d'un canton ou du fallback default. */
export interface CantonTaxData {
  name: string;
  method: string;
  bev?: CantonBevConfig;
  hev_discount?: CantonHevDiscount;
  bev_legacy_weight_reduction?: number;
  compute: (specs: EstimatedSpecs, co2: number, age: number, pt: string) => number;
}

/**
 * Table des taxes cantonales suisses.
 * Clés : codes canton à 2 lettres (GE, VD, ZH, etc.).
 */
export const CH_CANTON_TAX: Record<string, CantonTaxData> = {
  GE: {
    name: "Genève",
    method: "kw_only_strong_co2",
    bev: {
      exempt_years: 3,
      max_weight: 2300
    },
    hev_discount: 0,
    compute: (s, co2, age) => {
      let tax = 0;
      const kw = s.kW;
      return tax = kw <= 50 ? 480 + 5 * kw : kw <= 100 ? 730 + 9 * (kw - 50) : kw <= 150 ? 1180 + 12 * (kw - 100) : kw <= 200 ? 1780 + 15 * (kw - 150) : 2530 + 22 * (kw - 200), 
      co2 > 130 && (tax += 8 * Math.min(co2 - 130, 30)), co2 > 160 && (tax += 15 * Math.min(co2 - 160, 40)), 
      co2 > 200 && (tax += 30 * (co2 - 200)), Math.round(tax);
    }
  },
  VD: {
    name: "Vaud",
    method: "weight_power_co2",
    bev: {
      exempt_years: 2,
      max_weight: 3500,
      registered_after: 2024
    },
    bev_legacy_weight_reduction: .25,
    hev_discount: {
      rate: .6,
      max_years: 4
    },
    compute: (s, co2, age) => {
      let tax = .15 * s.weight;
      const kw = s.kW;
      return tax += 1.6 * Math.min(kw, 50), kw > 50 && (tax += 2 * (Math.min(kw, 100) - 50)), 
      kw > 100 && (tax += 2.4 * (Math.min(kw, 150) - 100)), kw > 150 && (tax += 2.8 * (kw - 150)), 
      co2 > 124 && (tax += 4 * Math.min(co2 - 124, 50)), co2 > 174 && (tax += 8 * (co2 - 174)), 
      Math.round(tax);
    }
  },
  ZH: {
    name: "Zurich",
    method: "displacement_weight",
    bev: {
      exempt_years: 8
    },
    hev_discount: 0,
    compute: (s, co2, age) => {
      let cc_part = 0;
      cc_part = s.cc <= 1500 ? s.cc / 100 * 6 : s.cc <= 2500 ? 90 + (s.cc - 1500) / 100 * 9 : 180 + (s.cc - 2500) / 100 * 12;
      let w_part = 0;
      return w_part = s.weight <= 1500 ? .1 * s.weight : s.weight <= 2e3 ? 150 + .18 * (s.weight - 1500) : 240 + .25 * (s.weight - 2e3), 
      Math.round(cc_part + w_part);
    }
  },
  BE: {
    name: "Bern",
    method: "weight_progressive",
    bev: {
      discount: .6,
      max_years: 4,
      then_normal: !0
    },
    hev_discount: {
      rate: .6,
      max_years: 4
    },
    compute: (s, co2, age) => {
      const w = s.weight;
      let tax = 0;
      return tax = w <= 1e3 ? .24 * w : w <= 1500 ? 240 + .32 * (w - 1e3) : w <= 2e3 ? 400 + .42 * (w - 1500) : 610 + .55 * (w - 2e3), 
      Math.round(tax);
    }
  },
  AG: {
    name: "Aargau",
    method: "displacement",
    bev: {
      exempt_years: 0
    },
    hev_discount: 0,
    compute: (s, co2, age, pt) => {
      const cc_equiv = "bev" === pt ? 15 * s.kW : s.cc;
      let tax = 0;
      return tax = cc_equiv <= 1500 ? cc_equiv / 100 * 18 : cc_equiv <= 2500 ? 270 + (cc_equiv - 1500) / 100 * 22 : 490 + (cc_equiv - 2500) / 100 * 30, 
      Math.round(tax);
    }
  },
  BS: {
    name: "Basel-Stadt",
    method: "weight_only",
    bev: {
      exempt_years: 0,
      discount: .5,
      permanent: !0
    },
    hev_discount: .25,
    compute: (s, co2, age) => {
      const w_leer = s.weight - 100;
      return w_leer <= 1200 ? Math.round(.22 * w_leer) : w_leer <= 1700 ? Math.round(264 + .36 * (w_leer - 1200)) : Math.round(444 + .48 * (w_leer - 1700));
    }
  },
  BL: {
    name: "Basel-Land",
    method: "weight_with_co2",
    bev: {
      discount: .75,
      permanent: !0
    },
    hev_discount: .5,
    compute: (s, co2, age) => {
      let tax = .24 * s.weight;
      return co2 > 130 && (tax += 2.5 * (co2 - 130)), Math.round(tax);
    }
  },
  AI: {
    name: "Appenzell IR",
    method: "weight_only",
    bev: {
      exempt_years: 0
    },
    hev_discount: 0,
    compute: (s, co2, age) => {
      const w = s.weight;
      return w <= 1500 ? Math.round(.18 * w) : Math.round(270 + .26 * (w - 1500));
    }
  },
  AR: {
    name: "Appenzell AR",
    method: "weight_only",
    bev: {
      exempt_years: 0
    },
    hev_discount: 0,
    compute: (s, co2, age) => {
      const w = s.weight;
      return w <= 1400 ? Math.round(.35 * w) : Math.round(490 + .78 * (w - 1400));
    }
  },
  JU: {
    name: "Jura",
    method: "weight_only",
    bev: {
      discount: .5,
      permanent: !0
    },
    hev_discount: .3,
    compute: (s, co2, age) => {
      const w = s.weight;
      return w <= 1500 ? Math.round(.42 * w) : Math.round(630 + .5 * (w - 1500));
    }
  },
  SG: {
    name: "Saint-Gall",
    method: "weight_power",
    bev: {
      exempt_years: 4
    },
    hev_discount: .3,
    compute: (s, co2, age) => {
      let tax = .18 * s.weight + 1.5 * s.kW;
      return Math.round(tax);
    }
  },
  UR: {
    name: "Uri",
    method: "weight_only",
    bev: {
      exempt_years: 1 / 0
    },
    hev_discount: .5,
    compute: (s, co2, age) => Math.round(.13 * s.weight)
  },
  GL: {
    name: "Glarus",
    method: "displacement_with_co2",
    bev: {
      exempt_years: 1 / 0
    },
    hev_discount: .4,
    compute: (s, co2, age) => {
      let tax = s.cc / 100 * 15;
      return co2 > 140 && (tax += 1.5 * (co2 - 140)), Math.round(tax);
    }
  },
  GR: {
    name: "Graubünden",
    method: "weight_with_discount",
    bev: {
      discount: .8,
      permanent: !0
    },
    hev_discount: .4,
    compute: (s, co2, age) => Math.round(.22 * s.weight)
  },
  LU: {
    name: "Lucerne",
    method: "displacement_with_co2",
    bev: {
      exempt_years: 4
    },
    hev_discount: 0,
    compute: (s, co2, age, pt) => {
      let tax = ("bev" === pt ? 15 * s.kW : s.cc) / 100 * 16;
      return co2 > 130 && (tax += 2 * (co2 - 130)), Math.round(tax);
    }
  },
  NW: {
    name: "Nidwalden",
    method: "displacement",
    bev: {
      exempt_years: 3
    },
    hev_discount: .3,
    compute: (s, co2, age) => Math.round(s.cc / 100 * 11)
  },
  OW: {
    name: "Obwalden",
    method: "displacement_with_co2",
    bev: {
      exempt_years: 1 / 0
    },
    hev_discount: .3,
    compute: (s, co2, age) => {
      let tax = s.cc / 100 * 11;
      return co2 > 140 && (tax += 2 * (co2 - 140)), Math.round(tax);
    }
  },
  SH: {
    name: "Schaffhausen",
    method: "displacement",
    bev: {
      exempt_years: 0
    },
    hev_discount: 0,
    compute: (s, co2, age, pt) => {
      const cc_eff = "bev" === pt ? 15 * s.kW : s.cc;
      return Math.round(cc_eff / 100 * 11);
    }
  },
  SO: {
    name: "Solothurn",
    method: "displacement",
    bev: {
      exempt_years: 4
    },
    hev_discount: .3,
    compute: (s, co2, age) => Math.round(s.cc / 100 * 14)
  },
  TG: {
    name: "Thurgau",
    method: "displacement_with_co2",
    bev: {
      exempt_years: 4
    },
    hev_discount: .3,
    compute: (s, co2, age) => {
      let tax = s.cc / 100 * 13;
      return co2 > 130 && (tax += 1.8 * (co2 - 130)), Math.round(tax);
    }
  },
  VS: {
    name: "Valais",
    method: "displacement",
    bev: {
      exempt_years: 0
    },
    hev_discount: 0,
    compute: (s, co2, age, pt) => {
      const cc_eff = "bev" === pt ? 15 * s.kW : s.cc;
      return Math.round(cc_eff / 100 * 14);
    }
  },
  ZG: {
    name: "Zoug",
    method: "displacement",
    bev: {
      exempt_years: 1 / 0
    },
    hev_discount: .3,
    compute: (s, co2, age) => Math.round(s.cc / 100 * 9)
  },
  FR: {
    name: "Fribourg",
    method: "weight_displacement",
    bev: {
      discount: .3,
      permanent: !0,
      first_year_exempt: !0
    },
    hev_discount: .2,
    compute: (s, co2, age) => {
      let tax = .15 * s.weight + s.cc / 100 * 16;
      return Math.round(tax);
    }
  },
  NE: {
    name: "Neuchâtel",
    method: "co2_dominant",
    bev: {
      fixed_min: 80
    },
    hev_discount: .4,
    compute: (s, co2, age) => {
      let tax = 200;
      return tax += co2 <= 120 ? .5 * co2 : co2 <= 160 ? 60 + 2 * (co2 - 120) : co2 <= 200 ? 140 + 4 * (co2 - 160) : 300 + 6 * (co2 - 200), 
      tax += .05 * Math.max(0, s.weight - 1200), Math.round(tax);
    }
  },
  SZ: {
    name: "Schwyz",
    method: "power_weight",
    bev: {
      exempt_years: 0
    },
    hev_discount: 0,
    compute: (s, co2, age, pt) => Math.round(1.4 * s.kW + .1 * s.weight)
  },
  TI: {
    name: "Ticino",
    method: "power_weight",
    bev: {
      exempt_years: 0
    },
    hev_discount: 0,
    compute: (s, co2, age, pt) => Math.round(2.5 * s.kW + .15 * s.weight)
  }
};

/**
 * Fallback générique pour cantons non listés ou dept=null.
 * Source : v64.0.4 ligne 9777.
 */
export const CH_CANTON_DEFAULT: CantonTaxData = {
  name: "Suisse (moyen)",
  method: "average",
  bev: {
    exempt_years: 4
  },
  hev_discount: .3,
  compute: (s, co2, age) => {
    let tax = .12 * s.weight + .8 * s.kW;
    return co2 > 130 && (tax += 1.5 * (co2 - 130)), Math.round(tax);
  }

};
