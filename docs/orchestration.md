# CarPIQ V2 — Orchestration globale

**Auteur** : Jérémie Blard + Claude
**Date** : 26 mai 2026
**Version** : 1.0 (vivante — révisée à chaque fin de jalon)
**Statut** : Document maître d'exécution

Ce document opérationnalise les specs V2 (consolidée + annexes A et B) en un **plan d'exécution concret, ordonnancé et mesurable**. Il complète sans remplacer les specs : les specs disent **quoi**, ce document dit **dans quel ordre, comment, et comment savoir qu'on a fini**.

---

## 1. Principes opérationnels (non-négociables pour ce projet)

Avant tout détail, sept principes qui gouvernent toutes les décisions tactiques du projet.

**Un — Qualité avant vitesse.** Tu m'as donné l'instruction explicite "focus et qualité". On ne livre pas une étape tant que les critères de validation sont rouges. Mieux vaut rater une date que livrer un truc qui sera repatch dans 3 semaines.

**Deux — V1 reste figée en prod.** Le `index.html` actuel reste en l'état. Pas de patch UX. Les seuls changements autorisés sur V1 : bugs critiques bloquants (crash, perte de données, faille sécurité). Aucun "petit fix" sous prétexte que c'est rapide.

**Trois — Aucun écran live tant que la jauge n'est pas validée.** Chaque page V2 a une fiche de validation à 7 critères (cf. spec consolidée section 8.1). Pas un critère rouge ne passe en review. Le critère "ça marche" ne suffit pas : il faut "ça marche, c'est élégant, c'est mesuré, c'est documenté".

**Quatre — Le code reste maintenable à 1 développeur.** Aucune dépendance exotique, aucun pattern obscur, aucune optimisation prématurée. Un nouveau développeur doit pouvoir prendre le projet en 1 semaine de ramp-up. C'est un critère d'arbitrage technique permanent.

**Cinq — Toute décision majeure est documentée dans un ADR.** Architecture Decision Record numéroté dans `docs/adr/`. Si on se demande "pourquoi Astro ?" dans 6 mois, la réponse est dans `ADR-001-framework-choice.md` avec contexte, options, décision, conséquences. Le format est court (1 page max).

**Six — Mesure avant intuition.** Lighthouse à chaque fin de jalon. Bundle size watchéé à chaque PR. Temps de chargement testé sur device réel à chaque page. Pas d'objectif sans métrique associée.

**Sept — Le `index.html` monolithique de V1 est le fournisseur de logique métier, pas de présentation.** L'algo TCO, les calculs, les filtres, les données i18n existantes sont à extraire et réutiliser. Le HTML/CSS/UI est à refaire intégralement. Pas de "copier-coller le tunnel et ajuster" — c'est l'erreur classique qui transforme une refonte en patch déguisé.

---

## 2. Cartographie du travail total

Pour bien dimensionner, voici le travail total identifié, agrégé depuis les 3 specs.

### 2.1 Volume de pages à produire

| Catégorie | Nombre | Phase | Effort unitaire |
|---|---:|:---:|---|
| Pages institutionnelles | 10-15 | 2 | 1-2j par page |
| Pages parcours utilisateur (4 classes sémantiques + démarrage + résultats) | 6 | 3 | 3-5j par page |
| Pages Guide-moi (démarrage + 4 étapes + profil) | 6 | 5 | 2-4j par page |
| Pages véhicules individuelles | 200-500 | 4 | Template + génération auto |
| Pages comparaisons | 50-200 | 6 | Génération à la demande |
| Pages guides éditoriaux | 30-80 | 6 | 1-2j par page (éditorial) |
| Pages géographiques | 10-30 | 6 | 1j par page |
| Pages thématiques (observatoire, glossaire) | 10-30 | 6 | 1-3j par page |
| Pages utilisateur authentifié (garage, compte) | 5-10 | 5 | 2-4j par page |
| **Total pages à produire** | **327-871** | | |

### 2.2 Composants à construire

Source : annexe B sections 3-9. Approximativement **40-50 composants réutilisables** dont une dizaine sont critiques (accordion, drawer panel, tooltip, button, card de véhicule, slider de budget, etc.).

### 2.3 Logique métier à extraire de V1

Source : annexe consolidée section 7.3. Cinq blocs critiques :

| Bloc | Localisation V1 (env.) | Effort extraction |
|---|---|---:|
| Algorithme TCO-optimizer | `~ligne 100-3000 du JS` | 3-5j |
| Système de filtres et recommandations | `~ligne 3000-6000 du JS` | 2-3j |
| Logique garage et comparateur | `~ligne 6000-9000 du JS` | 2-3j |
| Données i18n (6-7 langues × tous les labels) | bloc `LANG_LABELS` | 1-2j |
| Catalogue véhicules + price grid | déjà en JSON, à structurer | 1-2j |
| **Total extraction** | | **9-15j** |

### 2.4 Effort global estimé

Spec consolidée annonce **20-28 semaines (5-7 mois)**. Mes estimations désagrégées :
- Phase 1 fondations : 3-4 semaines
- Phase 2 institutionnelles : 3-4 semaines
- Phase 3 parcours principal : 4-5 semaines (un peu plus que la spec, marge pour qualité)
- Phase 4 véhicules : 4-6 semaines
- Phase 5 Guide-moi + garage : 3-4 semaines
- Phase 6 comparaisons + guides : 4-6 semaines
- Marge globale 15-20% : 4-5 semaines

**Estimation réaliste** : **24-32 semaines** (6-8 mois). Je préfère annoncer une estimation prudente que sous-évaluer.

---

## 3. Décisions structurantes (à valider ensemble avant Phase 1)

Sept décisions à prendre avant de toucher au code. Aucune n'est triviale, toutes ont des conséquences à long terme.

### 3.1 Framework : Astro vs Next.js

**Reco spec** : Astro 4.x. Trois raisons : profil de site content-first, SEO/Core Web Vitals natif, maintenabilité à équipe restreinte.

**Mon analyse** : pour CarPIQ, Astro est le bon choix **si tu codes seul ou avec un dev qui n'est pas un expert React**. Next.js devient meilleur **si tu prévois d'embaucher** et veux un écosystème plus large de talents.

**À décider en fonction de** : qui va coder ? Toi seul, un freelance Astro/Next, une équipe future ?

### 3.2 Hébergement et CI/CD

**Reco** : Vercel pour le déploiement (intégration Astro/Next native, edge functions, preview deploys par PR), conservation Supabase pour la BDD.

**Alternatives** : Netlify (équivalent à Vercel, parfois moins cher), Cloudflare Pages (très performant, plus complexe), auto-hébergé (à éviter pour cette phase).

### 3.3 Stratégie de migration : approche 3 (hybride)

**Spec recommande l'approche 3** : V1 reste en prod, V2 se construit en parallèle, on bascule progressivement section par section.

**Risque à anticiper** : doubles URLs entre V1 et V2 pendant la transition, gestion des redirects 301, cohabitation de deux codebases pendant 6-8 mois. C'est gérable mais demande de la rigueur.

**Alternative pragmatique** : V2 sur sous-domaine `v2.carpiq.eu` jusqu'à 70% de complétion, puis bascule progressive sur le domaine principal en route-par-route via configuration Vercel.

### 3.4 Génération de contenu pour 200-500 pages véhicules

**Spec propose** : génération assistée IA (Claude/GPT) + revue manuelle.

**Recommandation** : démarrer avec un template dur Astro, générer 10-20 pages prototypes via Claude API, valider le résultat éditorial, **ne pas** scaler à 500 pages sans validation explicite de la qualité. Le risque "spam SEO" est réel si les pages sont médiocres.

### 3.5 Design system : tokens et composants visuels

**À acter avant Phase 1** : palette CarPIQ existante conservée (teal #0F6E56 + amber #BA7517 + Playfair Display + DM Sans) ? Ou refonte visuelle aussi ? Tu mentionnes "Apple Store, Stripe, Linear" comme bench — ça suggère une remise en cause possible du design system actuel.

**Reco** : conserver palette et typo (elles sont bonnes), mais **revoir** la grille, les spacings, les composants, les micro-interactions. C'est le **niveau de raffinement** qui distingue Stripe/Linear de la moyenne, pas la palette.

### 3.6 Analytics et tracking

**Spec mentionne** : Mixpanel (events produit) + Plausible (analytics anonymes RGPD).

**Recommandation** : conserver Mixpanel déjà intégré V1 (les events sont précieux), ajouter Plausible pour l'analytics agrégée, **garder PostHog en option** si besoin de session replay.

### 3.7 i18n : priorisation des langues

**V1 actuel** : 7 langues mais qualité hétérogène. **V2 spec** : démarrage FR + EN, puis DE + NL en phase 2, ES + IT + PT en phase 3.

**Recommandation** : V2 démarre **FR uniquement** pour Phase 1-3. EN ajouté Phase 4 (à la sortie des pages véhicules SEO). DE/NL/ES/IT/PT seulement après stabilisation des templates. Ça simplifie énormément la Phase 1-3.

---

## 4. Orchestration des phases

### Phase 0 — Préparation et validation des décisions (1 semaine)

Pas dans la spec mais critique pour ne pas se rater. Aucune ligne de code de production.

**Livrables** :
- 7 ADR (un par décision structurante de la section 3) signés par toi
- Setup compte Vercel + GitHub repo `carpiq-v2`
- Setup compte Supabase staging (séparé de prod)
- Inventaire complet de la logique métier V1 à extraire (script Python qui catalogue les fonctions JS, leurs dépendances, leur ligne de départ/fin)
- Choix final framework documenté

**Critères de sortie** : tous les ADR signés, comptes opérationnels, premier `npm create astro@latest` réussi.

### Phase 1 — Architecture et fondations (3-4 semaines)

Conforme à la spec.

**Livrables** :
- Repo Astro initialisé avec TypeScript strict
- Structure de dossiers conforme à l'annexe B section 1.2
- Tailwind 4.x configuré avec design tokens CarPIQ
- Intégration Supabase (lecture seule en Phase 1, écriture en Phase 2)
- Pipeline CI/CD : push GitHub → preview déployée sur Vercel
- Module `lib/tco-engine.ts` : extraction de l'algorithme TCO V1 en TypeScript pur (testé unitairement)
- Module `lib/i18n.ts` : extraction du système i18n V1 + structure pour ajout de langues
- Lighthouse CI activé dans la CI, seuil bloquant à 90 mobile sur la page d'accueil de démo
- Sentry + Plausible activés

**Critères de sortie** :
- 100% des tests unitaires verts sur `tco-engine.ts`
- Lighthouse score > 95 sur page de démo statique
- Preview Vercel fonctionnelle à chaque PR

### Phase 2 — Pages institutionnelles + composants atomiques (3-4 semaines)

10-15 pages institutionnelles + le design system de composants atomiques.

**Livrables ordonnés** :
1. **Composants atomiques** (1 semaine) : Button (3 variantes), Input (texte, select), Badge, Card, Icon. Tous documentés avec Storybook ou équivalent léger.
2. **Composants composés** (3-4 jours) : Header, Footer, NavBar, LanguageSwitcher.
3. **Page d'accueil** (3-4 jours) : conforme à l'annexe A section 1, en FR uniquement.
4. **Pages méthodologie + à propos + contact + mentions** (1-1.5 semaine) : 4 pages d'après annexe A sections 2-5.
5. **Pages glossaire (10-15 entrées)** (3-4 jours) : structure type wiki, peu de contenu mais bien indexée.

**Critères de sortie** :
- 10+ pages déployées en preview, indexables (sauf utilisateur)
- Lighthouse score > 90 mobile sur chaque page
- 7 critères de validation (cf. spec consolidée 8.1) verts pour chaque page
- Tests E2E Playwright passent sur tous les parcours statiques

### Phase 3 — Parcours principal (4-5 semaines)

Le plus critique en termes d'UX, de divulgation progressive, de dual native.

**Livrables ordonnés** :
1. **Composants spécialisés** (1 semaine) : SliderBudget, CardChoice, ProgressBar, StepNav, ResultCard (= card véhicule), HeroResult.
2. **Mécanismes de divulgation progressive** (3-4 jours) : Accordion, Tab, Modal, Drawer, Tooltip — selon l'annexe B sections 3-7.
3. **Page démarrage parcours** (annexe A section 6) (2-3 jours).
4. **Page Classe 1 — Budget et priorité** (annexe A section 7) (3-4 jours).
5. **Page Classe 2 — Usage quotidien** (annexe A section 8) (3-4 jours).
6. **Page Classe 3 — Type de véhicule** (annexe A section 9) (3-4 jours).
7. **Page Classe 4 — Contexte personnel** (annexe A section 10) (3-4 jours).
8. **Page de résultats personnalisés** (annexe A section 11) — LA page critique (5-7 jours).
9. **État partagé du parcours** (annexe B section 11) : système de persistance (URL params + Supabase session) qui retient les réponses entre les pages.

**Critères de sortie** :
- Parcours complet bout-en-bout en moins de 3 minutes sur mobile
- Page de résultats : au-dessus du fold = recommandation principale + TCO + 3 CTAs, rien d'autre
- Toute information additionnelle accessible mais en accordion/drawer/page dédiée
- Algo TCO produit les mêmes résultats que V1 sur 100 cas de test
- Lighthouse score > 90 mobile sur toutes les pages parcours

### Phase 4 — Pages véhicules individuelles (4-6 semaines)

200-500 pages, principalement automatisables.

**Livrables ordonnés** :
1. **Template Astro `[slug].astro`** (3-4 jours) : page véhicule générique selon annexe A section 12, alimentée par Supabase.
2. **Génération de 10 pages prototypes** (2-3 jours) : 10 véhicules variés (compact ICE, SUV hybride, berline diesel, Tesla, etc.), évaluation qualité éditoriale.
3. **Itération sur le template + ajout de contenu enrichi** (1 semaine) : sections décomposition TCO, dépréciation, comparaisons concurrents, méthodologie, etc.
4. **Génération automatique du contenu éditorial intro/conclu** (1 semaine) : pipeline Claude API + revue manuelle d'un échantillon de 50 pages.
5. **Scaling à 200-300 pages** (1-2 semaines) : génération complète, indexation, vérification SEO.
6. **Génération à 500 pages** (optionnelle, déclencheur = traction SEO sur les premières 200) : 1 semaine supplémentaire.

**Critères de sortie** :
- 200+ pages véhicules en ligne, indexables
- Schema.org `Product` valide sur 100% des pages (test via Google Rich Results Test)
- Sitemap XML généré automatiquement
- Lighthouse score > 90 sur échantillon de 20 pages
- Aucune page en duplicate content (vérifié via crawler interne)

### Phase 5 — Guide-moi + Garage + Compte (3-4 semaines)

**Livrables ordonnés** :
1. **Composants spécialisés Guide-moi** (3-4 jours) : SilhouettePicker, ValuesGrid, ArchetypeCard, ArchetypeRevealAnimation.
2. **Page démarrage Guide-moi** (annexe A section 14) (2-3 jours).
3. **Page étape 1 — Quotidien** (annexe A section 15) (3-4 jours).
4. **Page étape 2 — Silhouettes** (annexe A section 16) (3-4 jours).
5. **Page étape 3 — Trajets** (annexe A section 17) (3-4 jours).
6. **Page étape 4 — Valeurs** (annexe A section 18) (3-4 jours).
7. **Page profil révélé** (annexe A section 19) (3-4 jours, animations soignées).
8. **Page garage virtuel** (annexe A section 20) (3-4 jours, authentifié, lecture/écriture Supabase).
9. **Page compte utilisateur** (annexe A section 21) (3-4 jours).

**Critères de sortie** :
- Parcours Guide-moi complet en moins de 4 minutes
- Réveil de profil cohérent avec les 6 archétypes définis dans les images uploadées
- Garage fonctionnel : ajout, suppression, comparaison, alertes de prix (si en backlog)
- Tests authentification end-to-end verts

### Phase 6 — Comparaisons + Guides éditoriaux + Pages géographiques (4-6 semaines)

**Livrables ordonnés** :
1. **Page comparaison à la demande** (1-1.5 semaine) : `/comparer/X-vs-Y` générée dynamiquement quand un utilisateur compare, mise en cache et indexée après 30 jours.
2. **10 premiers guides éditoriaux** (1-2 semaines, dépend de la production éditoriale) : production manuelle ou semi-IA des guides type "Guide achat berline 25 000 CHF", "Guide SUV familial 30 000 EUR", etc.
3. **5-10 pages géographiques** (1 semaine) : pages pays/région avec analyses fiscales locales.
4. **Page Observatoire CarPIQ Q3 2026 et Q4 2026** (1 semaine) : génération trimestrielle des données agrégées.
5. **Indexation et SEO final** (3-4 jours) : sitemap consolidé, hreflang complet, validation Search Console.

**Critères de sortie** :
- 50+ pages comparaisons indexables
- 10+ guides éditoriaux publiés avec contenu unique > 800 mots
- 5+ pages géographiques avec spécificités fiscales
- Trafic organique mesurable sur Google Search Console (> 100 impressions/jour est l'objectif minimal)

### Post-Phase 6 — Stabilisation, i18n EN, polish (4-6 semaines)

Ce qu'on ne fait pas dans les 6 phases mais qu'il faut prévoir :
- Internationalisation EN complète sur toutes les pages
- Optimisation performance fine (Critical CSS, prefetch intelligent)
- A/B tests sur les CTAs critiques
- Production éditoriale continue (10-20 guides supplémentaires par mois)
- Préparation extension DE/NL si traction

---

## 5. Ce que je fais maintenant (Phase 0 immédiate)

Tu m'as dit "définis une orchestration globale et lance-toi". Ma lecture : je dois produire l'orchestration (ce document) ET démarrer concrètement la Phase 0. Voici ce que je livre **avec ce message** :

1. **Ce document d'orchestration** (`carpiq-v2-orchestration.md`)
2. **Une note de décisions** (`carpiq-v2-decisions-a-acter.md`) résumant les 7 décisions de la section 3 pour que tu puisses valider rapidement
3. **Un script d'inventaire V1** (`scripts/inventory_v1.py`) qui catalogue la logique métier extractible
4. **Un README de démarrage** (`README-v2-bootstrap.md`) avec les commandes exactes pour initialiser le projet V2 une fois les décisions actées

Je ne lance pas `npm create astro@latest` tant que tu n'as pas validé le framework. C'est exactement le genre de décision qu'on ne défait pas facilement.

---

## 6. Gouvernance et rythme

### Cadence de revue
- **Quotidienne** : pas de revue formelle, on bosse
- **Fin de jalon** : revue formelle entre toi et moi avec validation des 7 critères + démo live + go/no-go pour le jalon suivant
- **Fin de phase** : revue stratégique : on tient le cap ? Y a-t-il des révisions de spec à acter ? Budget temps restant cohérent avec la suite ?

### Critères de bascule entre phases
On ne passe à la phase N+1 que si :
- Tous les livrables de la phase N sont en production (ou preview validée)
- Tous les critères de validation de la phase N sont verts
- Le backlog de dette technique éventuelle est documenté et adressé soit dans un sprint dédié, soit dans la phase N+1

### Gestion du scope
Si on identifie une nouvelle exigence en cours de route :
- Si critique pour les 3 piliers (divulgation progressive, dual native, SEO multi-pages) : on l'intègre dans la phase courante
- Si importante mais pas critique : on l'ajoute au backlog post-Phase 6
- Si nice-to-have : on la documente et on revoit après stabilisation

### Mesures de qualité par phase

| Métrique | Cible | Outil |
|---|---|---|
| Lighthouse Performance mobile | > 90 sur toutes les pages | Lighthouse CI |
| Lighthouse Accessibility | > 95 | Lighthouse CI |
| Lighthouse Best Practices | > 95 | Lighthouse CI |
| Lighthouse SEO | 100 sur pages indexables | Lighthouse CI |
| Bundle JS initial mobile | < 100 KB | Webpack Bundle Analyzer / Astro inspector |
| LCP mobile | < 2.5s | Lighthouse + WebPageTest |
| FID mobile | < 100ms | Lighthouse + RUM (Sentry) |
| CLS | < 0.1 | Lighthouse + RUM |
| Couverture tests unitaires (logique métier) | > 70% | Vitest |
| Schema.org valide | 100% pages indexables | Google Rich Results Test |

---

## 7. Risques identifiés et plans de mitigation

### R1 — Dérapage temporel (probabilité : élevée)

**Description** : tous les projets de refonte ambitieuse dérapent. La spec annonce 5-7 mois, mon estimation va jusqu'à 8 mois. Réalité possible : 10-12 mois.

**Mitigation** :
- Scope freeze strict à chaque phase. Une nouvelle idée est notée mais pas exécutée.
- Critère de bascule formel entre phases. On ne passe pas si rouge.
- Marge de 15-20% intégrée dans mes estimations vs la spec.

### R2 — Qualité éditoriale des 200-500 pages véhicules (probabilité : élevée)

**Description** : génération assistée IA peut produire du contenu insuffisant pour Google. Risque de pénalité algorithmique.

**Mitigation** :
- Démarrer par 10-20 pages prototypes validées manuellement avant scaling
- Critère de bascule Phase 4 : qualité éditoriale validée par toi sur échantillon
- Indexer progressivement (50, puis 100, puis 200, puis 500) et monitorer Search Console
- Plan B : si qualité insuffisante, on réduit le volume cible (par exemple 100 pages très soignées valent mieux que 500 médiocres)

### R3 — Régression d'algo TCO lors de l'extraction (probabilité : modérée)

**Description** : en extrayant l'algorithme TCO de V1 vers `tco-engine.ts`, on peut introduire des bugs subtils qui changent les recommandations.

**Mitigation** :
- Phase 1 inclut le développement d'une suite de 100 cas de test sur l'algo V1 (snapshot des outputs actuels)
- L'algo V2 doit reproduire ces 100 cas à l'identique avant validation

### R4 — Coût d'opportunité (probabilité : modérée)

**Description** : 6-8 mois investis sur la refonte = autres initiatives produit non réalisées. Et si l'usage actuel restait limité même avec V2 ?

**Mitigation** :
- Phase 4 (pages véhicules SEO) déployable dès qu'elle est prête, indépendamment des phases suivantes. Si traction SEO démarre, validation de l'investissement.
- Possibilité de mettre en pause Phase 5-6 si les phases 1-4 suffisent pour valider la traction.

### R5 — Migration mal exécutée et chute de SEO V1 (probabilité : faible mais critique)

**Description** : le ranking actuel de carpiq.eu (s'il existe) pourrait être dégradé par la migration.

**Mitigation** :
- Approche 3 hybride : V1 reste en prod, V2 ne remplace progressivement
- Plan de redirections 301 documenté avant chaque bascule
- Monitoring Search Console quotidien pendant 30 jours après chaque bascule
- Rollback rapide possible via Vercel (déploiement précédent en 1 clic)

---

## 8. Points de décision immédiats

Pour démarrer la Phase 0 cette semaine, voici les 3 décisions à prendre **en priorité** (les autres décisions de la section 3 peuvent être validées au fur et à mesure de la Phase 0) :

**D1 — Framework** : Astro (reco) ? Next.js ? Autre ? → impacte tout le reste, à acter en J+1.

**D2 — Hébergement** : Vercel (reco) ? Netlify ? Autre ? → impacte la CI/CD, à acter en J+2.

**D3 — Conservation du design system actuel** : oui (conserver palette + typo, refaire UI) ? Ou revoir aussi la palette/typo ? → impacte les composants atomiques, à acter en J+3.

Tu peux acter les autres décisions au fur et à mesure de la Phase 0 (1 semaine).

---

## 9. Ce qui se passe ensuite

Une fois ce document d'orchestration validé par toi, je commence par :

1. **Aujourd'hui** : Livraison de ce document + 3 livrables compagnons (décisions à acter, script d'inventaire V1, README bootstrap)
2. **Une fois que tu as validé D1/D2/D3** : Setup repo `carpiq-v2`, initialisation Astro, premier commit, première preview Vercel
3. **Semaine 1** : Phase 0 complète — extraction logique métier V1, 100 cas de test TCO, design tokens Tailwind
4. **Semaine 2-5** : Phase 1 — fondations, premier "Hello CarPIQ V2" déployé en preview avec performance déjà conforme aux cibles

Le rythme global vise un livrable visible toutes les 1-2 semaines pour matérialiser l'avancement.

---

*Document produit le 26 mai 2026. Vivant : sera révisé à chaque fin de jalon en fonction de ce qu'on apprend. Si des décisions changent, on documente le pourquoi dans un ADR daté.*
