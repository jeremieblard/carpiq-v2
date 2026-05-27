// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';

/**
 * Configuration Astro CarPIQ V2.
 *
 * i18n natif Astro (depuis Astro 4) :
 *   - Langues actuelles : FR, EN
 *   - Préfixe URL : /fr/, /en/
 *   - Default locale : FR (fallback si Accept-Language non-supporté)
 *   - prefixDefaultLocale = true : forcer le préfixe même pour la default
 *     locale, plus prévisible et SEO-friendly (cf. spec consolidée section 4.5)
 *   - routing.redirectToDefaultLocale = true : / redirige vers /fr/ par défaut
 *
 * Langues à venir (post-Phase 2) : DE, NL, ES, IT, PT (spec section 4.5).
 *
 * @see https://docs.astro.build/en/guides/internationalization/
 */
export default defineConfig({
  site: 'https://carpiq.eu',

  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: true,
    },
  },

  vite: {
    plugins: [tailwindcss()],
  },

  integrations: [vue(), sitemap()],
});
