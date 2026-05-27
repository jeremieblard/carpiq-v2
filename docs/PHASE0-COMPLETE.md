# Phase 0 — Clôture et validation

**Date de fin** : 27 mai 2026
**Durée effective** : ~2 jours intensifs (24-27 mai)
**Statut** : ✅ **COMPLÈTE — Go pour Phase 1**

Ce document acte la fin de la Phase 0 et le démarrage de la Phase 1.

---

## 1. Livrables Phase 0

### Documents stratégiques

| Document | Localisation | Statut |
|---|---|---|
| Vision produit V2 | `docs/specs/carpiq-spec-v2-consolidee.md` | ✅ |
| Spec détaillée des 24 pages | `docs/specs/carpiq-spec-v2-annexe-a.md` | ✅ |
| Patterns techniques et composants | `docs/specs/carpiq-spec-v2-annexe-b.md` | ✅ |
| Orchestration des 6 phases | `docs/orchestration.md` | ✅ |
| Plan d'extraction Phase 1 | `docs/extraction-plan.md` | ✅ |

### Décisions actées (8 ADR)

| ADR | Sujet | Décision |
|---|---|---|
| ADR-000 | Format ADR | MADR allégé, 1 page max |
| ADR-001 | Framework | Astro 4.x avec Vue 3 pour îlots |
| ADR-002 | Hébergement | Vercel (Pro plan) |
| ADR-003 | Design system | Conservation tokens, refonte composants |
| ADR-004 | Migration | Approche 3 hybride |
| ADR-005 | i18n | FR uniquement Phase 1-3 |
| ADR-006 | Contenu éditorial | IA + revue manuelle, scaling par paliers |
| ADR-007 | Analytics | Mixpanel + Plausible |

### Infrastructure technique

| Item | Statut | Notes |
|---|---|---|
| Repo GitHub `carpiq-v2` | ✅ | https://github.com/jeremieblard/carpiq-v2 |
| Vercel connecté + preview deploys | ✅ | URL `carpiq-v2-*.vercel.app` |
| Astro 4.x + TypeScript strict | ✅ | Build OK |
| Tailwind 4.x + tokens CarPIQ | ✅ | Via `@theme` dans `global.css` |
| Vue 3 (pour îlots) | ✅ | Intégration ajoutée |
| Sitemap @astrojs/sitemap | ✅ | Sera activé à la config `site` |
| Lighthouse CI sur GitHub Actions | ✅ | Vert sur main |
| Structure de dossiers V2 | ✅ | Conforme annexe B |
| Page démo `/tokens` | ✅ | Référence visuelle accessible |

### Baseline algorithmique (le plus critique)

| Item | Statut | Volume |
|---|---|---|
| Vocabulaire V1 documenté (KMM, CONS, trips, pref, etc.) | ✅ | 9 enums identifiés |
| Cas de test calcTCO | ✅ | 96 cas |
| Cas de test getRec | ✅ | 57 cas |
| Snapshots `baseline_expected.json` | ✅ | 153 cas, 17+ modèles distincts |
| Runner browser réutilisable | ✅ | `test_runner_browser_v2.js` |
| Inventaire V1 généré automatiquement | ✅ | 88 fonctions cataloguées |

---

## 2. Métriques Phase 0

**Commits poussés** : ~12 commits
**Lignes de configuration** : ~500 LOC (config + ADR)
**Lignes de scripts Python** : ~600 LOC
**Lignes de fixtures JSON** : ~3500 LOC (cas + snapshots V1)
**Workflow CI fonctionnel** : 1 (Lighthouse CI)

**Lighthouse scores actuels** (page `/tokens` sur preview Vercel) :
- Performance : ≥ 90 (warn threshold) ✅
- Accessibility : ≥ 95 ✅
- Best Practices : ≥ 90 ✅
- SEO : ≥ 95 ✅

---

## 3. Découvertes importantes

### Découverte 1 — V1 utilise un vocabulaire spécifique

Le moteur TCO ne réagit qu'aux **bonnes clés enum** :
- `st.km` : `u10` / `m20` / `m35` / `o35` (pas un nombre)
- `st.trips` : `short` / `mixed` / `long` / `vlong`
- `st.charging` : `socket` / `maybe` / `no`
- `st.pref` : `cost` / `ratio` / `premium` / `sport` / `eco` / `family`

C'est documenté pour la Phase 1.

### Découverte 2 — getRec est très influent

`getRec` représente 200-500 LOC réelles (l'estimateur a comptabilisé du code en aval). C'est le chef d'orchestre du moteur. Sa migration prend ~1.5j en Phase 1.

### Découverte 3 — calcTCO est l'algorithme pur

`calcTCO(pt, newP, brand, age, km)` est déterministe sur ses arguments (sauf `st.trips` qu'il lit en globale via `fuelCost`). C'est la cible parfaite pour les premiers snapshots. La refonte TS supprimera la dépendance globale en passant `trips` explicitement.

### Découverte 4 — Biais observable sur Hyundai Santa Fe HEV

Sur les 57 cas getRec snapshots, 39 retournent Santa Fe HEV. Le biais sera à investiguer en Phase 1 (peut-être un effet recherché, peut-être un bug latent V1 à corriger).

### Découverte 5 — calcTCO n'est PAS sensible à `activeCountry`

Bug ou design ? Le coût TCO calculé en France vs Allemagne pour le même véhicule donne exactement la même valeur. La sensibilité pays vit dans `fuelCost` via `getFP/getEP`. À comprendre en Phase 1.

---

## 4. Risques résiduels avant Phase 1

| Risque | Probabilité | Impact | Mitigation |
|---|---|---|---|
| Cas getRec non reproductibles à 100% | Moyenne | Moyen | Tolérance 2-3 écarts sur 57, documenter |
| Découverte de logique non-cataloguée | Faible | Moyen | Itération Palier par Palier |
| Performances tests baseline en CI | Faible | Faible | Vitest est rapide |

---

## 5. Critères de validation Phase 0 — checklist

- [x] Repo GitHub opérationnel
- [x] Vercel déploie à chaque push
- [x] 8 ADR signés et versionnés
- [x] Astro + Tailwind + Vue fonctionnels
- [x] Page tokens accessible avec design system
- [x] Lighthouse CI configuré et vert
- [x] 153 cas de test baseline TCO collectés depuis V1
- [x] Plan d'extraction Phase 1 documenté
- [x] Vocabulaire V1 documenté

**Tous les critères verts.**

---

## 6. Go pour Phase 1

**Décision** : on bascule en Phase 1 dès maintenant.

**Objectif Phase 1** : extraire le moteur TCO V1 vers `src/lib/*.ts` en TypeScript strict, validé par le snapshot baseline à 100% sur calcTCO et ≥ 95% sur getRec.

**Durée prévue** : 3-4 semaines.

**Premier livrable Phase 1** : `src/lib/types.ts` avec les définitions de domaine.

**Cadence** : 4 paliers de ~1 semaine chacun (foundations / TCO pur / recommandation / intégration + validation).

---

## 7. Ce qu'on ne fait pas en Phase 1 (rappel)

Pour éviter le scope creep :
- ❌ Aucune page Astro consommatrice de `recommend()` (Phase 3)
- ❌ Aucun composant UI métier (Phase 2-3)
- ❌ Garage / Compare (Phase 5)
- ❌ i18n EN (Phase 4)
- ❌ Pages SEO véhicules (Phase 4)

Phase 1 = **uniquement la logique métier extraite en TypeScript testé**.

---

*Document produit le 27 mai 2026. Marque la fin officielle de la Phase 0. Sera référencé dans tous les futurs ADR de la Phase 1.*
