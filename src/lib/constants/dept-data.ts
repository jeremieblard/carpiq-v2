/**
 * Données par département FR — Region Insurance, Winter Penalty, ZFE.
 *
 * Source : v64.0.4 lignes 8219-8710 (extraction directe, 27 mai 2026).
 *
 * Chaque entrée :
 *   - ri  : multiplicateur d'assurance régional (référence ~1)
 *   - wp  : winter penalty BEV en % (impact conso hiver)
 *   - zfe : présence d'une Zone à Faibles Émissions
 *
 * Si un utilisateur a un département non listé (ou st.dept = null),
 * fallback sur DD_DEF.
 *
 * NOTE : V1 n'expose DD que pour les départements FR. Les utilisateurs des
 * autres pays (BE, CH, DE, NL, ES, IT, PT, LU) tombent toujours sur DD_DEF.
 * Cette limitation est documentée dans le backlog Hardening (anomalie A4).
 *
 * NOTE 2 : V1 contient 3 doublons dans DD (codes 12, 27, 55). En JS, la
 * deuxième occurrence écrase silencieusement la première. On reproduit ce
 * comportement (last-write-wins) en TS pour parité parfaite.
 */

export interface DeptData {
  /** Multiplicateur d'assurance régional. */
  ri: number;
  /** Winter penalty BEV en % (impact conso hiver). */
  wp: number;
  /** Présence d'une Zone à Faibles Émissions. */
  zfe: boolean;
}

export const DD: Record<string, DeptData> = {
  '75': { ri: 1.28, wp: 18, zfe: true },
  '92': { ri: 1.25, wp: 18, zfe: true },
  '93': { ri: 1.22, wp: 18, zfe: true },
  '94': { ri: 1.22, wp: 18, zfe: true },
  '91': { ri: 1.18, wp: 18, zfe: false },
  '77': { ri: 1.15, wp: 18, zfe: false },
  '78': { ri: 1.18, wp: 18, zfe: false },
  '95': { ri: 1.16, wp: 18, zfe: false },
  '69': { ri: 1.1, wp: 16, zfe: true },
  '38': { ri: 1.08, wp: 22, zfe: false },
  '42': { ri: 1.06, wp: 18, zfe: false },
  '13': { ri: 1.12, wp: 8, zfe: true },
  '06': { ri: 1.15, wp: 6, zfe: false },
  '83': { ri: 1.08, wp: 7, zfe: false },
  '84': { ri: 1.04, wp: 9, zfe: false },
  '34': { ri: 1.06, wp: 8, zfe: false },
  '30': { ri: 1.04, wp: 9, zfe: false },
  '31': { ri: 1.06, wp: 10, zfe: true },
  '33': { ri: 1.05, wp: 10, zfe: false },
  '64': { ri: 1.02, wp: 12, zfe: false },
  '40': { ri: 0.98, wp: 10, zfe: false },
  '32': { ri: 0.94, wp: 10, zfe: false },
  '44': { ri: 1.02, wp: 12, zfe: false },
  '49': { ri: 0.98, wp: 13, zfe: false },
  '85': { ri: 0.96, wp: 12, zfe: false },
  '35': { ri: 1.0, wp: 13, zfe: false },
  '22': { ri: 0.96, wp: 13, zfe: false },
  '29': { ri: 0.95, wp: 12, zfe: false },
  '56': { ri: 0.96, wp: 12, zfe: false },
  '59': { ri: 1.08, wp: 18, zfe: false },
  '62': { ri: 1.04, wp: 18, zfe: false },
  '02': { ri: 1.02, wp: 18, zfe: false },
  '60': { ri: 1.06, wp: 17, zfe: false },
  '80': { ri: 1.02, wp: 18, zfe: false },
  '67': { ri: 1.06, wp: 25, zfe: false },
  '68': { ri: 1.04, wp: 25, zfe: false },
  '57': { ri: 1.02, wp: 22, zfe: false },
  '54': { ri: 1.02, wp: 22, zfe: false },
  '55': { ri: 0.9, wp: 19, zfe: false },
  '88': { ri: 0.96, wp: 24, zfe: false },
  '25': { ri: 1.0, wp: 28, zfe: false },
  '39': { ri: 0.98, wp: 26, zfe: false },
  '70': { ri: 0.96, wp: 24, zfe: false },
  '73': { ri: 1.02, wp: 32, zfe: false },
  '74': { ri: 1.05, wp: 30, zfe: false },
  '01': { ri: 1.04, wp: 22, zfe: false },
  '26': { ri: 1.02, wp: 18, zfe: false },
  '07': { ri: 0.98, wp: 16, zfe: false },
  '63': { ri: 0.96, wp: 22, zfe: false },
  '43': { ri: 0.92, wp: 24, zfe: false },
  '15': { ri: 0.88, wp: 22, zfe: false },
  '03': { ri: 0.92, wp: 20, zfe: false },
  '18': { ri: 0.9, wp: 18, zfe: false },
  '36': { ri: 0.88, wp: 18, zfe: false },
  '23': { ri: 0.88, wp: 20, zfe: false },
  '87': { ri: 0.92, wp: 18, zfe: false },
  '19': { ri: 0.9, wp: 16, zfe: false },
  '24': { ri: 0.92, wp: 12, zfe: false },
  '46': { ri: 0.9, wp: 12, zfe: false },
  '47': { ri: 0.92, wp: 11, zfe: false },
  '48': { ri: 0.86, wp: 22, zfe: false },
  '12': { ri: 0.88, wp: 15, zfe: false },
  '72': { ri: 0.96, wp: 14, zfe: false },
  '53': { ri: 0.94, wp: 13, zfe: false },
  '61': { ri: 0.92, wp: 14, zfe: false },
  '14': { ri: 0.98, wp: 13, zfe: false },
  '50': { ri: 0.96, wp: 12, zfe: false },
  '27': { ri: 1.0, wp: 15, zfe: false },
  '28': { ri: 0.98, wp: 16, zfe: false },
  '45': { ri: 0.96, wp: 17, zfe: false },
  '41': { ri: 0.94, wp: 16, zfe: false },
  '37': { ri: 0.96, wp: 14, zfe: false },
  '86': { ri: 0.92, wp: 14, zfe: false },
  '79': { ri: 0.9, wp: 13, zfe: false },
  '16': { ri: 0.92, wp: 12, zfe: false },
  '17': { ri: 0.94, wp: 11, zfe: false },
  '76': { ri: 1.02, wp: 14, zfe: false },
  '71': { ri: 0.96, wp: 20, zfe: false },
  '21': { ri: 1.0, wp: 20, zfe: false },
  '58': { ri: 0.92, wp: 18, zfe: false },
  '89': { ri: 0.94, wp: 18, zfe: false },
  '10': { ri: 0.96, wp: 17, zfe: false },
  '52': { ri: 0.9, wp: 19, zfe: false },
  '51': { ri: 0.96, wp: 17, zfe: false },
  '08': { ri: 0.92, wp: 19, zfe: false },
  '04': { ri: 0.94, wp: 14, zfe: false },
  '05': { ri: 0.92, wp: 28, zfe: false },
  '09': { ri: 0.9, wp: 16, zfe: false },
  '11': { ri: 0.92, wp: 10, zfe: false },
  '66': { ri: 0.96, wp: 8, zfe: false },
  '65': { ri: 0.9, wp: 20, zfe: false },
  '81': { ri: 0.94, wp: 11, zfe: false },
  '82': { ri: 0.92, wp: 11, zfe: false },
  '90': { ri: 1.0, wp: 26, zfe: false },
} as const;

/** Fallback département : utilisé si st.dept absent ou non listé dans DD. */
export const DD_DEF: DeptData = { ri: 1, wp: 15, zfe: false } as const;