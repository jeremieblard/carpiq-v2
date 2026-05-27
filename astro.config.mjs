// @ts-check
import { defineConfig } from 'astro/config';

import tailwindcss from '@tailwindcss/vite';
import vue from '@astrojs/vue';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';

/**
 * Configuration Astro CarPIQ V2.
 *
 * Mode `output: 'static'` ne permet pas les API routes. Pour le formulaire
 * de contact (Livrable 4), on bascule en `output: 'server'` avec l'adapter
 * Vercel : tout est pré-rendu statiquement par défaut (`prerender = true`
 * implicite via le `prerender = true` dans chaque page), sauf les API routes
 * qui tournent en serverless functions Vercel.
 *
 * Toutes les pages existantes (/fr/, /en/, etc.) restent statiques. Seule
 * `src/pages/api/contact.ts` tournera côté serveur.
 *
 * @see https://docs.astro.build/en/guides/integrations-guide/vercel/
 */
export default defineConfig({
  site: 'https://carpiq.eu',
  output: 'server',
  adapter: vercel(),

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
