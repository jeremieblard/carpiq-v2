# ADR-002 — Hébergement : Vercel

**Statut** : Accepté
**Date** : 2026-05-26
**Décideurs** : Jérémie Blard

## Contexte

L'architecture multi-pages V2 nécessite un hébergement qui :
- Sert du contenu statique avec CDN global
- Permet des routes dynamiques (page résultats personnalisés, pages comparaisons générées à la demande)
- Offre des preview deploys par PR pour la revue de code visuelle
- S'intègre nativement avec Astro
- Reste abordable en early stage (< 50 €/mois)

## Options considérées

- **Vercel** : créateurs de Next.js, intégration Astro native, preview deploys, edge functions globales. Free tier généreux puis 20$/mois Pro.
- **Netlify** : équivalent à Vercel, parfois moins cher, edge functions plus limitées.
- **Cloudflare Pages** : performance CDN maximale, gratuit jusqu'à 500 builds/mois, configuration plus complexe.
- **Auto-hébergé (VPS + Docker + Nginx)** : maximum de contrôle, énorme coût en temps de maintenance.

## Décision

**Vercel** avec compte Pro à 20$/mois.

## Conséquences

**Positives** :
- Setup en moins d'une heure (connexion GitHub, détection auto Astro, déploiement instantané)
- Preview deploys par PR avec URL unique : transforme la revue de code en revue visuelle
- Edge functions globales pour les routes dynamiques (pages résultats personnalisés)
- Intégration native avec Astro maintenue par l'éditeur lui-même
- Rollback en 1 clic vers déploiement précédent

**Négatives** :
- Vendor lock-in léger (les edge functions Vercel ne sont pas portables tel quel vers un autre host)
- Coût à terme peut grimper si bandwidth élevé (mais reste raisonnable jusqu'à 1M visiteurs/mois)
- Dépendance à un fournisseur tiers pour la disponibilité du site

## Mitigation des risques

Pour limiter le lock-in :
- Utiliser les edge functions Vercel uniquement quand nécessaire (la majorité des pages sont statiques)
- Documenter dans `docs/infrastructure.md` toutes les configurations Vercel utilisées
- Maintenir un plan de migration documenté vers Cloudflare Pages ou Netlify si besoin

## Notes

- Documentation Vercel + Astro : https://vercel.com/docs/frameworks/astro
- Pricing : https://vercel.com/pricing
- Status page : https://vercel-status.com (à monitorer)
