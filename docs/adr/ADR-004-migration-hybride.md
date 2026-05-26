# ADR-004 — Stratégie de migration : approche hybride

**Statut** : Accepté
**Date** : 2026-05-26
**Décideurs** : Jérémie Blard

## Contexte

CarPIQ V1 est actuellement en production sur https://carpiq.eu. Pendant les 6-8 mois de construction V2, il faut décider comment basculer sans interrompre le service ni perdre l'asset SEO existant.

## Options considérées

- **Approche 1 — Site parallèle puis bascule DNS** : V2 sur staging (`v2.carpiq.eu`) jusqu'à 100%, puis switch DNS d'un coup. Simple mais risqué : un bug en prod ne se voit qu'après bascule.
- **Approche 2 — Migration progressive route par route** : un routeur transitionnel arbitre quelles URLs sont servies par V1 ou V2. Demande de l'infrastructure intermédiaire.
- **Approche 3 — Hybride** : V1 reste fonctionnelle, V2 prend les **nouvelles** pages SEO d'abord (qui n'existent pas en V1), parcours principal migré en dernier.

## Décision

**Approche 3 — Hybride**.

Concrètement :
- V1 reste sur `carpiq.eu` (root domain) servant le parcours questionnaire, le garage et la page d'accueil pendant les Phases 1-3
- V2 démarre sur `v2.carpiq.eu` (sous-domaine staging) pour les Phases 1-2 (institutionnelles + setup)
- À partir de Phase 4, V2 commence à servir les pages véhicules sous `carpiq.eu/voiture/[slug]` (routes qui n'existent pas en V1, donc pas de conflit)
- À partir de Phase 5, V2 sert progressivement les pages utilisateur (`/garage`, `/compte`)
- À la fin de Phase 6, bascule complète : V2 prend également la page d'accueil et le parcours questionnaire

## Conséquences

**Positives** :
- Aucune interruption de service pendant 6-8 mois
- L'asset SEO V1 (s'il existe) est préservé : pas de redirection 301 massive en début de projet
- Valeur SEO V2 livrée incrémentalement (200-500 pages véhicules livrées en Phase 4, indexables immédiatement)
- Si V2 se révèle problématique, rollback possible jusqu'à Phase 6

**Négatives** :
- Cohabitation de 2 codebases pendant 6-8 mois (charge mentale)
- Configuration de routing au niveau Vercel/Cloudflare pour arbitrer V1/V2
- Le design system V2 sera visible publiquement avant que la page d'accueil ne soit refaite, créant une dissonance temporaire entre l'accueil V1 (ancien) et les pages véhicules V2 (nouveau)

## Plan d'exécution détaillé

**Phase 1-2** : V2 uniquement sur `v2.carpiq.eu`, V1 inchangée sur `carpiq.eu`.

**Phase 3** : V2 contient une preview du nouveau parcours sur `v2.carpiq.eu/trouver-ma-voiture`, V1 inchangée.

**Phase 4 (bascule majeure)** :
- Migration de DNS de `carpiq.eu` chez Vercel
- Configuration de routes :
  - `/voiture/*` → V2 (toutes les pages véhicules)
  - `/comparer/*` → V2 (Phase 6 ultérieure mais routes réservées)
  - tous les autres paths → V1 (servie depuis un sous-dossier `/v1/`)
- Test exhaustif avant bascule, rollback prêt

**Phase 5** :
- `/garage`, `/compte`, `/guide-me/*` → V2
- Reste → V1

**Phase 6 (fin)** :
- `/`, `/methodologie`, etc. → V2
- V1 dépréciée, code archivé pour historique

## Mitigation des risques

- Plan de redirections 301 documenté avant chaque bascule (`docs/redirects/phase-N.md`)
- Monitoring Google Search Console quotidien pendant 30 jours après chaque bascule
- Snapshot Search Console des positions actuelles V1 avant Phase 4 (baseline)
- Rollback prêt à 1 commande via Vercel (revert au déploiement précédent)

## Notes

- Vercel configuration pour rewrites/redirects : https://vercel.com/docs/projects/project-configuration#rewrites
- Google guidelines pour les migrations de site : https://developers.google.com/search/docs/crawling-indexing/site-move-with-url-changes
