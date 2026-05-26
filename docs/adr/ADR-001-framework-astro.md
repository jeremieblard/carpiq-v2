# ADR-001 — Choix du framework : Astro 4.x

**Statut** : Accepté
**Date** : 2026-05-26
**Décideurs** : Jérémie Blard

## Contexte

CarPIQ V2 doit servir 300-800 pages indexables à terme, dont environ 80% sont du contenu majoritairement statique (pages véhicules, comparaisons, guides) et 20% sont fortement interactives (questionnaire, page de résultats, garage).

Le framework doit :
- Maximiser Lighthouse Performance et SEO sur le contenu statique
- Permettre des îlots d'interactivité ciblés
- Rester maintenable par 1-3 développeurs sur 24 mois
- Avoir un coût d'apprentissage acceptable

## Options considérées

- **Astro 4.x** : HTML statique par défaut, hydratation sélective via "islands". Lighthouse 95+ natif.
- **Next.js 14.x** : standard React, SSR/SSG/ISR hybride, écosystème massif. Plus de bundle JS par défaut.
- **Nuxt 3.x** : équivalent Vue de Next, plus accessible mais écosystème restreint.

## Décision

**Astro 4.x avec Vue 3.4 pour les îlots interactifs**.

Astro correspond exactement au profil de site CarPIQ : majorité de contenu statique avec interactivité ciblée. Vue est privilégié à React pour les îlots car la syntaxe template HTML est plus proche du HTML actuel V1, facilitant la migration mentale.

## Conséquences

**Positives** :
- Bundle JS minimal sur les pages statiques (< 20 KB JS sur les pages véhicules)
- Lighthouse score > 95 natif sans optimisation custom
- SEO maximal par construction (HTML statique servi directement aux crawlers)
- Système i18n natif d'Astro déjà bien conçu

**Négatives** :
- Écosystème plus petit que Next.js (moins de plugins, moins de StackOverflow)
- Gestion d'état partagé entre îlots demande une réflexion architecturale (utilisation de `nanostores` recommandée)
- Bassin de développeurs Astro plus restreint si recrutement à terme

## Mitigation des risques

Si la complexité d'état partagé devient ingérable au cours de la Phase 3 (parcours questionnaire qui retient les réponses entre 4 pages), envisager :
- Soit un seul îlot Vue large qui contient tout le parcours (perd l'avantage statique)
- Soit un système de persistance via URL params + Supabase (privilégié)
- Bascule vers Next.js comme plan B avant la fin de Phase 3 si bloqué

## Notes

- Documentation officielle : https://docs.astro.build
- Comparatif Astro vs Next.js : https://astro.build/blog/why-astro-instead-of-nextjs/
- Performance native Astro : Lighthouse 100 sur https://astro.build elle-même
