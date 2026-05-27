/**
 * i18n CarPIQ V2 — helpers et types pour l'internationalisation.
 *
 * Stack : Astro i18n natif (pas de lib tierce).
 *
 * Usage typique dans une page :
 *
 *   ---
 *   import { getLangFromUrl, useT } from '../../i18n';
 *   const lang = getLangFromUrl(Astro.url);
 *   const t = useT(lang);
 *   ---
 *   <h1>{t('home.title')}</h1>
 *
 * Usage typique dans un composant Vue (avec props.lang) :
 *
 *   <script setup lang="ts">
 *   import { useT, type Lang } from '../../i18n';
 *   const props = defineProps<{ lang: Lang }>();
 *   const t = useT(props.lang);
 *   </script>
 *   <template><h1>{{ t('home.title') }}</h1></template>
 *
 * Note : les composants Vue ne peuvent pas appeler `Astro.url`, donc la
 * langue doit leur être passée en prop depuis la page Astro parent.
 */

import fr from './fr';
import en from './en';

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

/** Langues supportées V2 (sera étendu en Phase 3+). */
export const LANGUAGES = ['fr', 'en'] as const;
export type Lang = (typeof LANGUAGES)[number];

/** Langue par défaut. */
export const DEFAULT_LANG: Lang = 'fr';

/**
 * Le dictionnaire FR est la source de vérité du type Dictionary.
 * Les autres langues doivent matcher exactement ces clés (TypeScript râle sinon).
 */
export type Dictionary = typeof fr;
export type TranslationKey = NestedKeyOf<Dictionary>;

/** Génère un type union de toutes les clés imbriquées en notation `a.b.c`. */
type NestedKeyOf<T> = T extends object
  ? {
      [K in keyof T]: K extends string
        ? T[K] extends object
          ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
          : `${K}`
        : never;
    }[keyof T]
  : never;

// ─────────────────────────────────────────────────────────────────────────────
// Registry des dictionnaires
// ─────────────────────────────────────────────────────────────────────────────

const dictionaries: Record<Lang, Dictionary> = {
  fr,
  en,
};

// ─────────────────────────────────────────────────────────────────────────────
// Helpers publics
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Extrait la langue depuis l'URL Astro (`Astro.url`).
 *
 * Exemples :
 *   /fr/tokens → 'fr'
 *   /en/components → 'en'
 *   / → 'fr' (default)
 *   /unknown/foo → 'fr' (fallback car 'unknown' n'est pas dans LANGUAGES)
 */
export function getLangFromUrl(url: URL): Lang {
  const seg = url.pathname.split('/')[1];
  return LANGUAGES.includes(seg as Lang) ? (seg as Lang) : DEFAULT_LANG;
}

/**
 * Retourne une fonction `t(key)` qui résout une clé de traduction
 * (notation `a.b.c`) dans la langue donnée.
 *
 * Avec fallback automatique sur la default locale si la clé n'existe pas
 * dans la langue demandée. Si elle n'existe pas non plus dans la default
 * locale, retourne la clé elle-même (utile pour identifier les manques en dev).
 */
export function useT(lang: Lang): (key: TranslationKey) => string {
  const dict = dictionaries[lang] ?? dictionaries[DEFAULT_LANG];
  const fallback = dictionaries[DEFAULT_LANG];

  return (key: TranslationKey): string => {
    const value = resolveKey(dict, key) ?? resolveKey(fallback, key);
    return value ?? key;
  };
}

/** Résout une clé dot-notée dans un objet. */
function resolveKey(obj: unknown, key: string): string | undefined {
  const parts = key.split('.');
  let current: unknown = obj;
  for (const p of parts) {
    if (current && typeof current === 'object' && p in current) {
      current = (current as Record<string, unknown>)[p];
    } else {
      return undefined;
    }
  }
  return typeof current === 'string' ? current : undefined;
}

/**
 * Convertit un path actuel vers son équivalent dans une autre langue.
 *
 * Exemples :
 *   pathInLang('/fr/tokens', 'en') → '/en/tokens'
 *   pathInLang('/fr/', 'en') → '/en/'
 *   pathInLang('/', 'en') → '/en/'
 *
 * Utilisé par LanguageSwitcher pour générer le lien vers l'autre langue.
 */
export function pathInLang(currentPath: string, targetLang: Lang): string {
  // Retire le préfixe de langue actuel s'il existe
  const segments = currentPath.split('/').filter(Boolean);
  const firstSeg = segments[0];
  if (firstSeg && LANGUAGES.includes(firstSeg as Lang)) {
    segments.shift();
  }
  return `/${targetLang}/${segments.join('/')}` + (currentPath.endsWith('/') ? '' : '');
}
