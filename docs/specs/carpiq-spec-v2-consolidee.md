# CarPIQ — Spec consolidée V2 : refonte produit ambitieuse

**Destinataire** : développeur(s) CarPIQ et fondateur Jeremie Blard
**Statut** : document maître pour la refonte V2 (septembre 2026 - mars 2027)
**Version spec** : 2.0
**Date** : 26 mai 2026
**Effort estimé** : 12-20 semaines de développement réparties en 6 phases
**Périmètre** : refonte complète intégrant divulgation progressive, dual native desktop/mobile, architecture multi-pages SEO

---

## Préambule : pourquoi cette spec existe

CarPIQ a aujourd'hui un produit fonctionnellement riche et méthodologiquement solide, mais structurellement limité par trois dimensions critiques qui doivent être résolues simultanément pour permettre l'adoption massive et la valorisation B2B/OEM.

**Première limitation — La densité informationnelle non hiérarchisée**. Chaque écran présente trop d'information en simultané. L'utilisateur est attaqué par l'information au lieu d'être guidé par sa curiosité. C'est précisément le contraire de ce que font les produits premium (Apple, Stripe, Linear). La conséquence directe est un taux d'abandon élevé et une perception de complexité qui décourage l'adoption massive.

**Deuxième limitation — L'expérience responsive sous-optimale**. CarPIQ favorise l'expérience desktop au détriment du mobile, alors que 70-85% des utilisateurs seront sur mobile. L'approche responsive classique force des compromis qui dégradent les deux expériences. Une véritable approche dual native (deux conceptions distinctes, chacune optimale pour son contexte) est nécessaire.

**Troisième limitation — L'architecture single-page qui handicape le SEO**. Le fichier HTML unique de 1.15 MB et 30 000 lignes constitue pour Google une seule page indexable. Cela limite drastiquement le potentiel d'acquisition organique, qui est précisément le principal levier d'adoption massive identifié dans le GTM v2.0.

Cette spec V2 traite ces trois limitations comme un système cohérent. Les solutions s'interpénètrent : la divulgation progressive nécessite des URLs distinctes pour permettre l'approfondissement, le dual native demande une architecture flexible que le multi-pages facilite, le multi-pages est l'opportunité technique de tout repenser correctement.

---

## Table des matières

1. Vision et principes directeurs
2. Architecture technique globale
3. Système de divulgation progressive
4. Architecture multi-pages et stratégie SEO
5. Stratégie dual native desktop et mobile
6. Spécifications page par page
7. Plan de migration et phasage technique
8. Critères de validation et tests
9. Risques et plans de mitigation
10. Considérations stratégiques et business

---

## 1. Vision et principes directeurs

### 1.1 La vision produit

CarPIQ V2 doit être le comparateur automobile européen de référence en termes d'expérience utilisateur. Le bench mark n'est plus les autres comparateurs automobiles (qui sont médiocres en UX), mais les meilleurs produits B2C premium tous secteurs confondus : Apple Store, Stripe Atlas, Linear, Notion, Bloomberg Terminal pour la sophistication méthodologique.

L'utilisateur qui utilise CarPIQ V2 doit ressentir trois choses simultanément. Premièrement, la simplicité immédiate : à chaque écran, il comprend en moins de 5 secondes quoi faire ou quelle information regarder. Deuxièmement, la profondeur disponible : s'il veut creuser, l'information méthodologique rigoureuse est accessible en un clic. Troisièmement, l'élégance contextuelle : que ce soit sur son téléphone dans le métro ou sur son ordinateur professionnel, l'expérience est optimale pour son contexte.

### 1.2 Les trois piliers non-négociables

**Pilier 1 — Divulgation progressive par classes sémantiques**

À chaque écran, identifier la classe sémantique cohérente que l'utilisateur doit traiter, pas chaque décision isolée. Une classe sémantique regroupe 1 à 4 décisions logiquement liées dans l'esprit de l'utilisateur. Tout le reste est secondaire et accessible par interaction explicite (clic, hover, navigation). C'est l'utilisateur qui demande à voir plus, jamais le produit qui force à voir plus.

**Pourquoi pas une décision par écran ?**

L'approche "une décision par écran" semble séduisante mais elle fragmente artificiellement le parcours. Pour CarPIQ, elle mènerait à 25-30 écrans entre les deux parcours, ce qui détruit la cohérence narrative et augmente la friction. L'utilisateur ne pense pas en "décisions isolées" mais en "thèmes cohérents" : son usage, son budget, ses préférences. Respecter cette logique mentale est aligné avec les principes IMD sur le Jobs to be Done de Christensen.

**Comment fonctionne une classe sémantique** :
- Le titre H1 nomme la classe (par exemple "Vos habitudes de conduite")
- Les sous-décisions sont présentées comme questions hiérarchiquement subordonnées sous le titre
- L'utilisateur perçoit l'écran comme "une étape cohérente" même s'il y a plusieurs sous-décisions
- Le bouton "Continuer" n'est activé que quand toutes les sous-décisions de la classe sont répondues

**Règles d'application pour les écrans secondaires** :

Un écran de résultats ne montre pas trois colonnes de comparaison, il montre la meilleure recommandation. Un écran de questionnaire ne montre pas le feedback contextuel en paragraphe, il propose un bouton "Pourquoi cette question ?". Un écran de garage ne liste pas les détails de chaque véhicule, il montre les noms et propose un drill-down.

L'esprit reste le même : **moins l'utilisateur est attaqué par l'information, plus il progresse avec confiance**. Mais ce moins est mesuré en charge cognitive perçue, pas en nombre de décisions par écran.

**Pilier 2 — Dual native desktop et mobile**

Deux expériences pensées indépendamment, chacune optimale pour son contexte. Pas une adaptation responsive, deux conceptions distinctes qui partagent les mêmes données mais des présentations radicalement différentes.

Le mobile est conçu pour un usage en mouvement, au pouce, sur petit écran, en session courte. Le desktop est conçu pour un usage assis, à la souris, sur grand écran, en session longue. Les deux peuvent diverger structurellement : une navigation par swipe sur mobile que le desktop n'a pas, une vue côte à côte sur desktop que le mobile remplace par une navigation séquentielle.

**Pilier 3 — Architecture multi-pages pour SEO maximum**

Chaque concept utile est sa propre page indexable avec son URL, son titre, sa meta description, son contenu optimisé. L'objectif est de faire passer CarPIQ d'un site avec une page indexée à un site avec 300-800 pages indexées, dont chacune est une porte d'entrée potentielle depuis les recherches Google.

### 1.3 Hiérarchie d'arbitrage

Quand les trois piliers entrent en conflit (ce qui arrive régulièrement dans les détails d'implémentation), la hiérarchie d'arbitrage suivante s'applique systématiquement.

**Premier critère — Maximiser l'adoption**. Toute décision qui réduit la friction d'usage et augmente la probabilité qu'un utilisateur complète son parcours prend le pas sur les autres considérations.

**Deuxième critère — Préserver l'asset SEO**. Toute décision qui dégrade l'indexabilité ou la qualité du contenu indexable est rejetée, sauf si le premier critère le justifie clairement.

**Troisième critère — Cohérence du design system**. Toute décision qui crée une rupture stylistique avec le reste du produit est rejetée, sauf si les deux premiers critères le justifient.

**Quatrième critère — Élégance technique et maintenabilité**. Le code doit rester maintenable par une équipe de 1-3 développeurs sur 24 mois. Les solutions trop complexes sont rejetées.

---

## 2. Architecture technique globale

### 2.1 Choix du framework

Trois options sérieuses sont évaluables pour CarPIQ V2. Je présente chacune avec ses trade-offs, puis ma recommandation argumentée. La décision finale se prend en concertation avec votre développeur qui connaît mieux son contexte technique.

#### Option A — Astro

Framework moderne axé content-first avec rendu par défaut en HTML statique et hydration JavaScript sélective où nécessaire.

**Avantages** : SEO excellent par construction (HTML statique servi directement aux crawlers), performance exceptionnelle (chargement quasi instantané des pages), peut intégrer des "islands" interactifs en React/Vue/Svelte selon les besoins, courbe d'apprentissage modérée pour un développeur connaissant déjà l'écosystème web moderne.

**Inconvénients** : moins mature qu'Next.js pour les applications très interactives, la gestion d'état partagé entre îlots peut devenir complexe, communauté plus petite donc moins de ressources et plugins.

**Adapté à CarPIQ si** : la majorité des pages CarPIQ sont des contenus relativement statiques (pages véhicules, pages comparaison, pages guides) avec des sections interactives ciblées (questionnaire, résultats personnalisés). Ce qui semble être le cas.

#### Option B — Next.js

Framework React mature avec rendu hybride (SSR, SSG, ISR, CSR selon les besoins). Standard de fait pour les applications web modernes.

**Avantages** : écosystème React très mature, énormément de ressources et plugins, gestion d'état avancée via React et bibliothèques associées, ISR (Incremental Static Regeneration) parfait pour les pages véhicules qui peuvent être régénérées périodiquement, déploiement très optimisé via Vercel ou similaire.

**Inconvénients** : courbe d'apprentissage plus raide si le développeur ne connaît pas React, bundle JavaScript plus lourd par défaut (impact sur les performances mobiles), complexité accrue pour les configurations avancées.

**Adapté à CarPIQ si** : le développeur connaît déjà React et l'écosystème associé, l'interactivité riche est centrale dans la majorité des pages, vous prévoyez d'embaucher d'autres développeurs React à terme.

#### Option C — Nuxt.js

Framework Vue.js équivalent fonctionnel de Next.js. Mêmes capacités SSR/SSG/ISR mais avec Vue au lieu de React.

**Avantages** : Vue est généralement considéré comme plus accessible que React, courbe d'apprentissage moins raide, syntaxe template HTML qui se rapproche de votre HTML actuel donc migration potentiellement plus naturelle, bonnes performances.

**Inconvénients** : écosystème plus petit que React/Next.js, moins de talents disponibles si vous voulez embaucher, communauté plus restreinte.

**Adapté à CarPIQ si** : le développeur préfère Vue à React, vous voulez minimiser la courbe d'apprentissage, vous restez probablement avec une petite équipe technique.

#### Ma recommandation argumentée

**Pour CarPIQ V2, je recommande Astro en premier choix, avec Next.js en alternative si Astro semble trop limitant après évaluation.**

Trois raisons principales.

**Première raison — Le profil de site CarPIQ correspond exactement à ce pour quoi Astro a été conçu**. CarPIQ est essentiellement un site de contenu (centaines de pages véhicules, pages comparaisons, pages guides éditoriaux) avec quelques zones très interactives (questionnaire, résultats personnalisés). Astro excelle dans cette typologie en générant du HTML statique pour le contenu et en hydratant uniquement les zones interactives.

**Deuxième raison — Astro produit les meilleures performances SEO et Core Web Vitals**. Pour un objectif d'adoption massive via SEO organique, c'est un avantage concurrentiel direct. Les pages se chargent en moins de 500ms même sur mobile 3G.

**Troisième raison — La complexité technique est mieux contenue**. Une équipe de 1-2 développeurs peut maintenir un projet Astro plus facilement qu'un projet Next.js équivalent. C'est aligné avec votre profil actuel de solo founder.

L'inconvénient principal d'Astro pour CarPIQ est la gestion d'état partagé entre les sections interactives. Le questionnaire qui doit retenir les réponses entre les étapes, et la page de résultats qui doit afficher des recommandations personnalisées, demandent une logique d'état qui se gère bien en Astro mais qui demande une réflexion architecturale plus poussée.

Si après évaluation par votre développeur, Astro semble trop limitant pour ces zones interactives complexes, Next.js devient le second choix raisonnable. Nuxt.js est un troisième choix valide mais avec un écosystème plus restreint.

### 2.2 Stack technique complète recommandée

**Framework principal** : Astro 4.x (ou Next.js 14.x si choix alternatif)

**Langage** : TypeScript pour la robustesse et l'évolutivité du code

**Styling** : Tailwind CSS 4.x avec design tokens custom CarPIQ, possibilité de CSS modules pour les composants complexes

**Composants interactifs** : Astro Islands avec React 19 ou Vue 3.4 pour les sections interactives (questionnaire, résultats, garage, comparateur)

**Base de données** : Supabase (déjà en place, à conserver et étendre)

**Authentification** : Supabase Auth (déjà en place)

**Hosting** : Vercel ou Netlify avec edge functions pour les routes dynamiques, ou alternative auto-hébergée selon préférences

**Analytics** : Mixpanel pour analytics produit (gratuit jusqu'à 100K events/mois), Plausible Analytics pour analytics anonyme respectueux RGPD

**Monitoring** : Sentry pour les erreurs, Uptime Robot pour la disponibilité

**SEO et performance** : Lighthouse CI dans le pipeline de déploiement, outils Google Search Console intégrés

**Internationalization** : système i18n natif d'Astro avec support des 7 langues européennes cibles

### 2.3 Architecture des données

La séparation entre données et présentation devient critique en architecture multi-pages. Voici la structure recommandée.

**Catalogue véhicules** : déjà en place via Supabase avec scrapers existants. À conserver tel quel pour la phase 1 du refactoring, optimisations possibles en phase 2.

**Données utilisateur** : profils, garages, sessions de questionnaire, préférences. Stockage Supabase avec RLS (Row Level Security) approprié.

**Données comportementales** : table `user_behavioral_events` selon la spec tracking comportemental déjà produite. Cette spec reste valide intégralement.

**Génération statique vs dynamique** : les pages véhicules et pages comparaisons sont générées statiquement (SSG) avec rebuild quotidien des données prix. Les pages de résultats personnalisés sont rendues à la demande côté serveur (SSR). Les pages utilisateur (garage, compte) sont rendues côté client après authentification.

### 2.4 Stratégie de cache et performance

**Cache CDN agressif** pour les pages statiques (véhicules, comparaisons, guides). Invalidation hebdomadaire ou sur trigger.

**Cache navigateur** sur les assets graphiques (images, CSS, JS) avec versioning automatique pour invalidation contrôlée.

**Lazy loading** systématique des images en dessous du fold via `loading="lazy"` natif.

**Préchargement intelligent** des pages probables suivantes via `<link rel="prefetch">` sur les CTAs principaux.

**Optimisation images** : conversion WebP avec fallback JPEG, dimensions adaptées au breakpoint via `<picture>` avec `<source media>`.

---

## 3. Système de divulgation progressive

### 3.1 Principe fondamental réaffirmé

À chaque écran, l'utilisateur doit pouvoir identifier en moins de 5 secondes la classe sémantique de décisions à traiter ou l'information principale à comprendre. Une classe sémantique regroupe 1 à 4 décisions logiquement liées. Toute information non essentielle est accessible par interaction explicite.

Ce principe s'applique sans exception. Il s'applique même si vous êtes méthodologiquement convaincu que de l'information additionnelle est précieuse. Si l'utilisateur ne la demande pas, elle reste cachée.

**La règle pratique** : si un écran présente plus de 4 décisions ou si son titre nécessite plus de 8 mots pour résumer son contenu, il faut le scinder en plusieurs classes sémantiques distinctes.

### 3.2 Les six mécanismes de divulgation progressive

CarPIQ V2 utilise six mécanismes standardisés pour gérer la divulgation progressive. Chaque écran utilise un ou plusieurs de ces mécanismes selon son contexte.

**Mécanisme 1 — Cards expandables avec accordion**

Une ligne de synthèse cliquable révèle son contenu détaillé au clic. Utilisé pour les sections optionnelles (détail TCO, méthodologie, source des données).

Pattern UI : ligne avec titre court, icône d'expansion à droite, fond légèrement teinté. Au clic, déploiement vertical du contenu détaillé en dessous. Animation de transition douce (200-300ms). État expand/collapse mémorisé par session.

**Mécanisme 2 — Tabs et toggles**

Plusieurs vues alternatives accessibles via boutons de bascule. Utilisé pour les comparaisons (vue par âge, vue par motorisation, vue par marque).

Pattern UI : barre de boutons horizontaux en haut de la section, un seul actif à la fois marqué visuellement (fond teal, texte clair). Transition entre vues sans recharger la page.

**Mécanisme 3 — Modales et drawer panels**

Information complémentaire affichée dans une couche superposée. Utilisé pour les détails approfondis (méthodologie complète, sources de données, comparaisons détaillées).

Pattern UI : sur desktop, modale centrée avec overlay sombre. Sur mobile, drawer panel qui glisse depuis le bas occupant 80-90% de la hauteur. Bouton de fermeture explicite, fermeture aussi possible en cliquant en dehors ou avec swipe down sur mobile.

**Mécanisme 4 — Tooltips et infobulles**

Information très courte affichée au hover desktop ou tap long mobile. Utilisé pour les définitions techniques, les sources de chiffres précis.

Pattern UI : icône info discrète (point d'interrogation circulaire) à côté du chiffre ou terme concerné. Tooltip apparaît au hover desktop (300ms delay) ou au tap mobile, disparaît au mouse out ou tap ailleurs.

**Mécanisme 5 — Liens vers pages dédiées**

Information substantielle déportée vers sa propre page. Utilisé pour les sujets méthodologiques complets, les analyses approfondies.

Pattern UI : lien textuel ou bouton vers une page dédiée. La navigation préserve le contexte utilisateur (questionnaire en cours, session de comparaison).

**Mécanisme 6 — Navigation séquentielle "Voir plus"**

Pagination ou chargement progressif des éléments d'une liste. Utilisé pour les listes de véhicules, les résultats multiples, les comparaisons étendues.

Pattern UI : bouton "Voir 10 résultats de plus" qui charge incrémentalement, ou pagination classique sur les pages d'archives. Préchargement de la page suivante au scroll proche de la fin.

### 3.3 Application aux pages principales

#### Page d'accueil

**Au-dessus du fold (mobile et desktop)** :
- Logo CarPIQ avec baseline court
- Titre principal de 6-8 mots maximum
- Sous-titre de 10-15 mots maximum
- Deux CTAs principaux clairement identifiables

**En dessous du fold (accessible au scroll)** :
- Section "Comment ça marche" avec 3 étapes simples
- Section "Pourquoi CarPIQ" avec 3 arguments différenciants
- Section optionnelle "Méthodologie" avec lien vers page dédiée
- Footer avec liens secondaires (mentions, RGPD, contact)

Aucune information méthodologique détaillée au-dessus du fold. Aucun témoignage tant que vous n'en avez pas de réels. Aucun chiffre de référence ("X utilisateurs", "Y modèles") tant que vous ne pouvez pas les soutenir avec rigueur.

#### Pages du parcours questionnaire

Le parcours principal CarPIQ utilise 4 classes sémantiques cohérentes au lieu de fragmenter en 8 décisions isolées. Cela respecte la logique mentale de l'utilisateur qui pense en thèmes (son budget, son usage, ses préférences) plutôt qu'en questions isolées.

**Classe 1 — Budget et priorité (1 écran)**

Décisions regroupées sur cet écran :
- Quel budget total pour la voiture ?
- Quelle priorité principale ? (coût total, ratio qualité-prix, premium, sportif, écologique, familial)

Justification du regroupement : ces deux décisions sont inséparables dans la tête de l'utilisateur. "Combien je peux mettre" et "qu'est-ce que je cherche pour ce montant" sont la même réflexion économique.

**Classe 2 — Usage quotidien (1 écran)**

Décisions regroupées sur cet écran :
- Combien de kilomètres par an ?
- Quel type de trajets ? (courts, mixtes, longs)
- Pouvez-vous recharger chez vous ?

Justification du regroupement : ces trois décisions construisent ensemble le "profil d'usage automobile". Les séparer brise la cohérence mentale. L'utilisateur pense "mon usage" comme un tout indissociable.

**Classe 3 — Type de véhicule (1 écran)**

Décisions regroupées sur cet écran :
- Quelle carrosserie ? (citadine, berline, break, SUV, etc.)
- Quelles préférences additionnelles ? (modificateurs comme 4 roues motrices, break, etc.)

Justification du regroupement : ces choix esthétiques et fonctionnels forment ensemble "à quoi ressemble la voiture que je cherche".

**Classe 4 — Contexte personnel (1 écran)**

Décisions regroupées sur cet écran :
- Quel pays de résidence ?
- Quelle tranche d'âge ?

Justification du regroupement : ces informations contextuelles sont rapides à renseigner et logiquement liées (contexte légal, fiscal et assurantiel).

**Total parcours principal : 4 écrans de questionnaire** + page de démarrage + page de résultats = 6 écrans au total.

**Présentation visuelle sur chaque écran de classe** :

Au-dessus du fold, l'utilisateur voit :
- Indicateur de progression discret (texte "Étape 2 sur 4")
- Titre de la classe en typographie Playfair Display large
- Sous-titre court qui contextualise la classe (10-15 mots maximum)
- Les sous-décisions structurées hiérarchiquement avec leurs options

Accessible par interaction (et pas affiché par défaut) :
- Bouton "Pourquoi ces questions ?" qui révèle l'importance et l'usage des données
- Bouton "Aide" pour les sous-décisions complexes (recharge à domicile par exemple) qui propose un drawer panel d'explication
- Bouton "Voir un exemple" pour les questions abstraites

Pas de feedback contextuel affiché par défaut entre les sous-décisions. Pas de calculs dynamiques visibles. Pas de prévisualisation des résultats. L'utilisateur répond aux questions de la classe, valide une fois toutes les sous-décisions traitées, passe à la classe suivante.

**Règle de validation** : le bouton "Continuer" reste désactivé tant que toutes les sous-décisions de la classe ne sont pas répondues. Indicateur visuel discret sur les sous-décisions non encore traitées.

**Application au parcours Guide-moi** :

Guide-moi conserve ses 4 étapes thématiques actuelles qui forment déjà des classes sémantiques cohérentes :
- Étape 1 : Votre quotidien (2-3 sous-décisions sur la vie de tous les jours)
- Étape 2 : Vos préférences esthétiques (sélection des 6 archétypes)
- Étape 3 : Vos trajets (décisions sur distances et fréquences)
- Étape 4 : Vos valeurs et priorités (sécurité, plaisir, économie, environnement)

Plus une page de révélation du profil. Soit 5 écrans pour Guide-moi.

#### Page de résultats (LA page critique)

C'est sur cette page que la divulgation progressive change le plus radicalement le produit.

**Vue immédiate à l'arrivée** :

```
[Image bandeau résultats en arrière-plan, max-height 180px desktop / 140px mobile]

Votre meilleure option

[Image véhicule grand format]

Peugeot 308 Hybride
Compacte · Occasion 2 ans

CHF 487 / mois
tout compris

[Bouton primaire : Voir les détails →]
[Bouton secondaire : Voir d'autres options →]
[Lien tertiaire : Modifier mes critères]
```

C'est tout. Au-dessus du fold, l'utilisateur voit la recommandation principale avec son coût mensuel. Trois actions possibles. Aucune surcharge.

**Si l'utilisateur clique "Voir les détails"** :

Page dédiée du véhicule (route distincte type `/voiture/peugeot-308-hybride-occasion-2ans/`) avec toute l'analyse approfondie : décomposition du TCO mensuel, courbe de dépréciation, comparaison avec versions concurrentes, méthodologie de calcul, sources des données. Cette page est aussi indexable directement par Google.

**Si l'utilisateur clique "Voir d'autres options"** :

Page dédiée des alternatives (route distincte type `/resultats/alternatives/?session=xxx`) avec les autres recommandations par âge, par motorisation, par segment voisin. Format en grille ou liste.

**Si l'utilisateur scrolle** :

Sections additionnelles progressivement accessibles. D'abord les actions ("Ajouter au garage", "Comparer avec autre véhicule"). Ensuite les recommandations de segments voisins si pertinent. Ensuite la méthodologie sous forme d'accordion. Enfin le footer.

#### Page véhicule individuelle

Page avec URL dédiée type `/voiture/peugeot-308-hybride/`. Indexable pour SEO.

**Au-dessus du fold** :
- Nom du véhicule en titre principal
- Image grand format
- TCO mensuel sur 5 ans (chiffre principal)
- Prix d'achat (chiffre secondaire)
- Boutons "Ajouter au garage" et "Comparer"

**En dessous du fold (sections accordions)** :
- Décomposition du TCO mensuel
- Courbe de dépréciation interactive
- Caractéristiques techniques essentielles
- Comparaison avec véhicules concurrents
- Avis et benchmarks externes
- Méthodologie de calcul appliquée

Cette structure permet à Google d'indexer une page riche tout en préservant la clarté pour l'utilisateur qui scroll dans son rythme.

### 3.4 Règles d'écriture pour la divulgation progressive

**Règle 1** : si vous pouvez le dire en 5 mots, ne le dites pas en 15. Si vous pouvez le dire en 5 mots avec un visuel, supprimez 3 mots et appuyez-vous sur le visuel.

**Règle 2** : tout paragraphe de plus de 3 lignes doit être candidat à l'accordion ou au tooltip. La règle d'or : si l'utilisateur ne lit pas ces 3 lignes, est-ce qu'il rate quelque chose d'essentiel ? Si la réponse est non, l'information n'est pas essentielle et peut être cachée.

**Règle 3** : un écran présente une classe sémantique cohérente de 1 à 4 sous-décisions logiquement liées. "Quel est votre budget et quelle est votre priorité ?" peut être une classe sémantique. "Quel est votre budget et quel pays habitez-vous ?" sont deux classes distinctes car économiquement et géographiquement non-liées. La cohérence sémantique se juge sur la logique mentale de l'utilisateur, pas sur la commodité technique.

**Règle 4** : les chiffres et données chiffrées sont toujours présentés au minimum, avec source disponible en tooltip ou accordion. "CHF 487 / mois" se suffit à lui-même. La méthodologie de calcul est disponible si l'utilisateur la demande.

**Règle 5** : la curiosité doit être respectée mais pas anticipée. Si vous ne savez pas si l'utilisateur veut cette information, considérez qu'il ne la veut pas. Vous lui donnez les moyens d'y accéder s'il la cherche.

---

## 4. Architecture multi-pages et stratégie SEO

### 4.1 Cartographie complète des pages

CarPIQ V2 vise une architecture de 300-800 pages indexables sur 12-24 mois. Voici la cartographie des routes principales.

#### Pages institutionnelles (10-15 pages)

```
/                                       Accueil
/fr/                                    Accueil français
/en/                                    Accueil anglais
/fr/methodologie                        Page méthodologie générale
/fr/methodologie/tco                    Détail méthodologie TCO
/fr/methodologie/donnees                Sources de données
/fr/methodologie/algorithme             Logique algorithmique
/fr/a-propos                            À propos CarPIQ
/fr/equipe                              Équipe et fondateur
/fr/contact                             Contact
/fr/presse                              Espace presse
/fr/mentions-legales                    Mentions légales
/fr/confidentialite                     Politique de confidentialité
/fr/conditions-generales                CGU
```

#### Pages du parcours utilisateur (5-8 pages)

```
/fr/trouver-ma-voiture                  Démarrage parcours principal
/fr/trouver-ma-voiture/budget           Étape budget
/fr/trouver-ma-voiture/usage            Étape usage et kilométrage
/fr/trouver-ma-voiture/segment          Étape segment et carrosserie
/fr/trouver-ma-voiture/localisation     Étape localisation et âge utilisateur
/fr/trouver-ma-voiture/resultats        Page de résultats personnalisés
/fr/guide-me                            Démarrage parcours Guide-moi
/fr/guide-me/etape-1                    Étape 1 Guide-moi (quotidien)
/fr/guide-me/etape-2                    Étape 2 Guide-moi (silhouettes)
/fr/guide-me/etape-3                    Étape 3 Guide-moi (trajets)
/fr/guide-me/etape-4                    Étape 4 Guide-moi (valeurs)
/fr/guide-me/profil                     Résultat profil Guide-moi
```

#### Pages véhicules individuelles (200-500 pages)

Une page par modèle dans le catalogue, déclinée par génération et motorisation principale.

```
/fr/voiture/peugeot-3008                Page principale Peugeot 3008
/fr/voiture/peugeot-3008-hybride        Variante hybride
/fr/voiture/peugeot-3008-essence        Variante essence
/fr/voiture/peugeot-3008-diesel         Variante diesel
/fr/voiture/tesla-model-3               Tesla Model 3
/fr/voiture/tesla-model-y               Tesla Model Y
[... pour chaque modèle du catalogue]
```

Cette section représente 80% du volume SEO. Chaque page cible des requêtes longues type "TCO Peugeot 3008 hybride Suisse", "coût Tesla Model 3 par mois", "comparatif Peugeot 3008 vs concurrence".

#### Pages comparaisons (50-200 pages, génération à la demande)

Pages générées dynamiquement quand un utilisateur compare deux véhicules, puis indexées pour les comparaisons les plus consultées.

```
/fr/comparer/peugeot-3008-vs-vw-tiguan
/fr/comparer/tesla-model-3-vs-polestar-2
/fr/comparer/peugeot-308-vs-renault-megane
[...]
```

Excellent SEO sur les requêtes comparatives très spécifiques.

#### Pages guides éditoriaux (30-80 pages)

Contenu éditorial structuré par thématique et segment de marché.

```
/fr/guide-achat/berline-25000-chf       Guide d'achat berline budget 25K
/fr/guide-achat/suv-familial-30000-eur  Guide SUV familial 30K
/fr/guide-achat/voiture-electrique-suisse Guide voiture électrique en Suisse
/fr/guide-achat/premiere-voiture        Guide première voiture
[...]
```

Excellent SEO sur les requêtes informationnelles type "quelle berline pour 25000", "meilleure voiture electrique suisse".

#### Pages géographiques (10-30 pages)

Contenu adapté à chaque pays et région.

```
/fr/suisse                              CarPIQ Suisse
/fr/france                              CarPIQ France
/fr/belgique                            CarPIQ Belgique
/fr/luxembourg                          CarPIQ Luxembourg
[...]
```

Permet de capturer le trafic local et de personnaliser les analyses fiscales par pays.

#### Pages thématiques spéciales (10-30 pages)

```
/fr/observatoire                        Page Observatoire CarPIQ
/fr/observatoire/q3-2026                Édition trimestre
/fr/observatoire/q4-2026                Édition trimestre
/fr/glossaire                           Glossaire automobile
/fr/glossaire/tco                       Définition TCO
/fr/glossaire/depreciation              Définition dépréciation
[...]
```

#### Pages utilisateur authentifié (5-10 pages)

```
/fr/garage                              Mon garage
/fr/compte                              Mon compte
/fr/preferences                         Mes préférences
/fr/historique                          Historique recherches
[...]
```

Ces pages ne sont pas indexées (`noindex` dans le robots meta) car elles sont personnelles.

### 4.2 Stratégie SEO on-page

Chaque page doit respecter une checklist SEO stricte.

**Élément 1 — Title tag unique et optimisé** : 50-60 caractères, contient le mot-clé principal et la marque CarPIQ. Format : "Mot-clé principal | CarPIQ".

Exemple pour la page Peugeot 3008 hybride : "TCO Peugeot 3008 Hybride 2026 : coût mensuel complet | CarPIQ".

**Élément 2 — Meta description engageante** : 150-160 caractères, propose une valeur claire et un appel à l'action implicite.

Exemple : "Analysez le coût mensuel total de la Peugeot 3008 Hybride : prix, dépréciation, entretien, consommation. Calcul personnalisé en 3 minutes. Sans pub, gratuit."

**Élément 3 — Structure H1 unique et H2/H3 hiérarchisée** : un seul H1 par page contenant le mot-clé principal. Plusieurs H2 structurant le contenu, H3 pour les sous-sections.

**Élément 4 — Schema.org Structured Data** : marquage approprié selon le type de page.
- Pages véhicules : `Product` avec prix et caractéristiques
- Pages comparaisons : `Comparison` ou `ItemList`
- Pages guides : `Article` avec auteur et date
- Pages méthodologie : `Article` ou `TechArticle`

**Élément 5 — URL canonique et hreflang pour les langues** : balises canoniques pour éviter le contenu dupliqué entre versions et balises `hreflang` pour signaler à Google les équivalents linguistiques.

**Élément 6 — Open Graph et Twitter Cards** : balises pour le partage social avec image dédiée par page.

**Élément 7 — Sitemap XML automatique** : génération automatique au build avec priorités et fréquences de mise à jour appropriées.

**Élément 8 — Robots.txt approprié** : autorise l'indexation des pages publiques, bloque les pages utilisateur authentifiées.

**Élément 9 — Core Web Vitals optimaux** : LCP < 2.5s, FID < 100ms, CLS < 0.1. Ces métriques sont des facteurs de classement directs.

**Élément 10 — Contenu de qualité** : minimum 800 mots utiles par page de contenu (véhicules, guides). Texte original, pas de duplication, valeur ajoutée vs Wikipedia ou Argus.

### 4.3 Stratégie de génération de contenu

Pour atteindre 300-800 pages indexables, le contenu doit être généré efficacement sans sacrifier la qualité.

**Pages véhicules** : génération semi-automatique à partir du catalogue. Template structuré (titre, intro, sections fixes) avec contenu dynamique tiré de la base de données (prix, consommation, dépréciation). Validation manuelle ou par IA assistée pour la qualité éditoriale du texte d'introduction et de conclusion.

**Pages comparaisons** : génération à la demande quand un utilisateur compare deux véhicules. Indexation des pages les plus consultées après 30 jours.

**Pages guides** : production éditoriale manuelle ou semi-manuelle. Calendrier de 4-8 nouveaux guides par mois. Cible : 50 guides à 12 mois post-lancement V2.

**Pages méthodologie** : production éditoriale soignée, peu fréquente mais à valeur élevée. Cible : 10 pages méthodologiques de référence à 6 mois.

**Pages observatoire** : génération trimestrielle automatique à partir des données agrégées CarPIQ. Cible : 4 éditions par an.

### 4.4 Stratégie de backlinks

Le SEO ne se limite pas au on-page. Une stratégie de backlinks est nécessaire pour l'autorité de domaine.

**Acquisition organique** : qualité du contenu suffisamment forte pour générer des citations naturelles. Particulièrement les pages méthodologie, observatoire, et guides éditoriaux.

**Outreach actif** : démarchage de 30-50 médias automobiles et économiques pour proposer des données exclusives ou des analyses inédites. Effort 5-10 heures par mois.

**Partenariats éditoriaux** : collaborations avec des médias et sites tiers (par exemple Le Temps, Bilan en Suisse) pour publier des analyses CarPIQ avec backlink.

**Citations académiques** : le partenariat IMD ou EPFL via Innosuisse mentionné dans le GTM v2.0 peut générer des citations académiques précieuses.

### 4.5 Internationalization (i18n)

L'architecture multi-pages doit gérer 7 langues européennes cibles (FR, EN, DE, NL, ES, IT, PT).

**Structure URL** : préfixe de langue dans l'URL (`/fr/`, `/en/`, `/de/`). Préférable à un sous-domaine pour la centralisation de l'autorité SEO.

**Détection langue par défaut** : selon header HTTP `Accept-Language` du navigateur avec fallback FR. Possibilité de switch manuel via UI.

**Contenu traduit** : pas de traduction automatique. Traduction manuelle ou par traducteur professionnel pour les pages institutionnelles et méthodologie. Génération multilingue automatique pour les pages véhicules à partir du catalogue.

**hreflang tags** : balises hreflang sur chaque page pour signaler à Google les équivalents linguistiques.

**Priorisation langues** : démarrage en FR et EN, ajout progressif DE et NL en phase 2, ES et IT en phase 3, PT en phase 4 selon traction.

---

## 5. Stratégie dual native desktop et mobile

### 5.1 Le principe fondamental

CarPIQ V2 traite desktop et mobile comme deux expériences distinctes à concevoir indépendamment, pas comme une seule expérience à adapter.

Cela ne signifie pas deux bases de code séparées. Cela signifie une base de code unique avec une logique d'affichage qui peut diverger structurellement entre les deux contextes via le système de composants Astro/React/Vue et des patterns CSS modernes.

### 5.2 Différences de contexte à respecter

Pour CarPIQ, voici les différences clés à intégrer.

**Mobile** : usage en mouvement, sessions courtes (1-3 minutes par interaction), interaction par pouce sur zone limitée, lecture rapide, retour fréquent, contexte de distraction (transports, attente). L'utilisateur veut accéder rapidement à l'essentiel et revenir plus tard pour creuser.

**Desktop** : usage assis, sessions longues (5-30 minutes), interaction par souris précise, lecture posée, exploration approfondie, contexte de concentration (bureau, soir). L'utilisateur veut comprendre en profondeur en une seule session si possible.

Ces différences impliquent des conceptions distinctes pour le même contenu.

### 5.3 Patterns dual native par page

#### Page d'accueil

**Mobile** :
- Hero plus compact avec image background réduite
- CTAs empilés verticalement, chacun pleine largeur
- Sections secondaires accessibles par scroll, chacune avec preview puis lien
- Pas de comparaisons en parallèle, navigation séquentielle

**Desktop** :
- Hero avec image plus large, titre superposé
- CTAs côte à côte avec leur illustration distincte
- Sections secondaires en colonnes lorsque pertinent
- Possibilité d'aperçus côte à côte

#### Parcours questionnaire

**Mobile** :
- Une question par écran sur écran complet
- Options en cards larges full-width
- Navigation par swipe latéral entre étapes
- Bouton "Suivant" en bas fixe au-dessus du clavier
- Indicateur de progression discret en haut

**Desktop** :
- Une question par écran avec navigation par boutons
- Options en grille selon le nombre (4-6 cards par exemple)
- Pas de swipe, navigation explicite par clics
- Indicateur de progression plus riche (étapes nommées)
- Possibilité d'aperçus latéraux du résultat construit

#### Page de résultats

**Mobile** :
- Recommandation principale en pleine page
- Swipe horizontal entre la recommandation principale et les alternatives
- Sections additionnelles par accordions pleine largeur
- Boutons d'action en bas fixes (Ajouter garage, Comparer)

**Desktop** :
- Recommandation principale centrée avec colonnes alternatives latérales optionnelles
- Possibilité de comparaison side-by-side avec autres recommandations
- Sections additionnelles en colonnes ou tabs
- Boutons d'action intégrés dans le flow naturel

#### Page véhicule individuelle

**Mobile** :
- Image véhicule pleine largeur en haut
- Chiffres clés (TCO, prix) en section dédiée
- Sections accordions pour toutes les analyses détaillées
- Navigation tabulaire pour les différentes vues (TCO, specs, comparaison, avis)

**Desktop** :
- Image véhicule en colonne gauche
- Chiffres et résumé en colonne droite
- Sections détaillées en pleine largeur en dessous avec ancres
- Sidebar de navigation pour accéder rapidement aux sections

### 5.4 Spécifications techniques dual native

**Breakpoints recommandés** :
- Mobile : 0-639px
- Tablet : 640-1023px (généralement aligné sur mobile mais avec espacement augmenté)
- Desktop small : 1024-1279px
- Desktop large : 1280px+

**Approche CSS** : utiliser CSS Container Queries pour adapter selon la taille du conteneur parent plutôt que de l'écran. Permet une flexibilité accrue.

**Composants Astro/React** : utiliser des composants distincts pour les versions mobile et desktop quand la structure diverge fortement, partagés quand la structure est similaire. Par exemple :

```typescript
// Composant unique qui adapte sa structure selon le contexte
<ResultsPageContainer>
  <Show when={isMobile}>
    <MobileResultsLayout />
  </Show>
  <Show when={!isMobile}>
    <DesktopResultsLayout />
  </Show>
</ResultsPageContainer>
```

**Détection device** : combinaison de CSS media queries pour le rendu et de detection JavaScript pour les interactions complexes. Privilégier les solutions CSS pures quand possible.

**Performance mobile** : bundle JavaScript minimal sur mobile (< 100 KB), images optimisées en WebP, lazy loading agressif, préchargement intelligent uniquement sur connexions rapides.

**Tests obligatoires** : chaque page testée sur au minimum 3 devices mobiles réels (iOS récent, Android milieu, Android entrée de gamme) et 2 résolutions desktop (1440px et 1920px) avant validation.

### 5.5 Touch interactions et navigation mobile

Le mobile demande des patterns d'interaction spécifiques.

**Touch targets minimaux** : 44×44 pixels selon recommandations Apple, 48×48 pixels selon Material Design Google. CarPIQ utilise 48×48 pixels comme standard.

**Espacement entre éléments tactiles** : minimum 8 pixels pour éviter les tap erreurs.

**Swipe navigation** : implémentée pour les comparaisons d'alternatives, la navigation entre étapes du questionnaire, le défilement entre véhicules dans une liste.

**Pull-to-refresh** : désactivé pour ne pas interférer avec les interactions internes.

**Floating action buttons** : utilisés pour les actions principales contextuelles (Ajouter au garage, Comparer) en bas d'écran sur mobile uniquement.

**Bottom navigation** : pour les sections principales accessible depuis n'importe où sur mobile (Accueil, Recherche, Garage, Compte).

---

## 6. Spécifications page par page

Cette section détaille pour chaque page principale la structure attendue. Pour ne pas allonger excessivement cette spec déjà longue, je ne détaille ici que les pages les plus critiques. Les autres pages suivent les principes définis dans les sections précédentes.

### 6.1 Page d'accueil (FR comme exemple)

**URL** : `/fr/` ou `/fr/accueil`
**Title** : "CarPIQ : comparateur automobile européen indépendant"
**Meta description** : "Calculez le coût mensuel réel d'une voiture en 3 minutes. Méthodologie transparente, sans publicité, sans biais commercial. Trouvez la voiture qui vous correspond."

**Structure mobile** :

```
Header (60px de hauteur)
├── Logo CarPIQ + baseline court
└── Menu hamburger

Hero section (350px de hauteur)
├── Image background avec overlay
├── Titre H1 : "Quelle voiture acheter, et combien va-t-elle vraiment coûter ?"
└── Sous-titre : "3 minutes. Calcul personnalisé selon vos trajets et l'âge du véhicule."

Section CTAs (épure verticale)
├── CTA 1 : "Trouver ma future voiture" (full width)
│   ├── Illustration showroom
│   ├── Titre + temps estimé
│   └── Bouton "Commencer →"
└── CTA 2 : "Analyser ma voiture actuelle" (full width)
    ├── Illustration analyse
    ├── Titre + temps estimé
    └── Bouton "Commencer →"

Section secondaire (accessible au scroll)
├── "Comment ça marche" en 3 étapes
├── "Pourquoi CarPIQ" en 3 arguments
└── Lien vers méthodologie

Footer
├── Liens légaux
├── Sélecteur langue
└── Copyright
```

**Structure desktop** :

```
Header (80px de hauteur)
├── Logo CarPIQ + baseline
├── Navigation : Trouver, Garage, Méthodologie, Observatoire
└── Sélecteur langue + Connexion

Hero section (500px de hauteur)
├── Image background full width avec overlay
├── Titre H1 grande typographie
├── Sous-titre
└── Deux CTAs côte à côte directement intégrés

Section CTAs (deux colonnes)
├── CTA 1 + illustration showroom (large)
└── CTA 2 + illustration analyse (large)

Section "Comment ça marche" (3 colonnes)

Section "Pourquoi CarPIQ" (3 colonnes)

Section bonus : "Notre méthodologie" avec aperçu et lien

Footer riche (5 colonnes)
```

### 6.2 Page de résultats personnalisés

**URL** : `/fr/trouver-ma-voiture/resultats?session=xxx`
**Title** : "Votre meilleure option | CarPIQ"
**Meta description** : "Résultats personnalisés de votre recherche CarPIQ."
**Indexation** : noindex (page personnelle)

**Structure mobile (la plus critique)** :

```
Header minimal (50px)
└── Logo + Retour

Hero résultat (écran complet quasi)
├── Petit indicateur "Votre meilleure option"
├── Image véhicule grand format
├── Nom véhicule + sous-titre (segment + âge)
├── TCO mensuel en très grande typographie
├── "tout compris"
├── [Bouton primaire] "Voir les détails →"
├── [Bouton secondaire] "Voir d'autres options →"
└── [Lien] "Modifier mes critères"

Sections secondaires (scrollable, accordions)
├── Actions rapides : Garage / Comparer
├── Pourquoi ce choix (accordion)
├── Autres recommandations (accordion → page dédiée)
├── Modifier critères (accordion)
└── Footer minimal
```

**Structure desktop** :

```
Header (80px)

Hero résultat (60% de la viewport)
├── Layout 2 colonnes
│   ├── Colonne gauche (60%) : image véhicule + nom
│   └── Colonne droite (40%) : TCO + CTAs
└── Pas de scroll forcé pour voir les chiffres

Sections secondaires (sous le hero)
├── Tabs pour : Détails / Alternatives / Méthodologie / Comparer
├── Contenu actif en pleine largeur
└── Footer riche
```

### 6.3 Page véhicule individuelle

**URL** : `/fr/voiture/peugeot-3008-hybride`
**Title** : "TCO Peugeot 3008 Hybride : analyse complète | CarPIQ"
**Meta description** : "Analyse détaillée du coût mensuel de la Peugeot 3008 Hybride. Prix, dépréciation, entretien, consommation, fiscalité. Multi-pays Europe."
**Indexation** : index, follow

**Schema.org** : `Product` avec prix, description, marque, image.

**Structure mobile** :

```
Header (60px)

Page header véhicule (300px)
├── Image hero véhicule
├── Nom complet et catégorie
└── Tags pertinents (motorisation, segment)

Section principale chiffres (200px)
├── TCO mensuel (gros chiffre)
├── Prix d'achat
└── [Boutons] Garage / Comparer

Sections accordions
├── Décomposition TCO
├── Caractéristiques techniques
├── Dépréciation et revente
├── Consommation et énergie
├── Entretien et fiabilité
├── Comparaisons concurrents
├── Méthodologie appliquée
└── Sources des données

Section éditoriale (300-800 mots de contenu unique)

Section "Modèles similaires" (carrousel)

Footer
```

**Structure desktop** :

```
Header (80px)

Page principale (layout 2 colonnes)
├── Colonne gauche (sticky) : image + chiffres clés + CTAs
└── Colonne droite (scrollable) : toutes les sections détaillées

Section éditoriale en pleine largeur

Section "Modèles similaires" (grille)

Footer riche
```

### 6.4 Pages comparaisons

**URL** : `/fr/comparer/peugeot-3008-vs-tesla-model-y`
**Title** : "Peugeot 3008 vs Tesla Model Y : comparatif complet 2026 | CarPIQ"
**Meta description** : "Quel SUV choisir entre Peugeot 3008 et Tesla Model Y ? Comparaison TCO, autonomie, prix, fiabilité. Analyse impartiale."

**Structure** : layout comparatif côte à côte (deux colonnes) sur desktop, sections empilées sur mobile avec toggle de focus.

---

## 7. Plan de migration et phasage technique

### 7.1 Phasage en 6 phases sur 5-7 mois

**Phase 1 — Architecture et fondations (3-4 semaines)**

Mise en place du framework choisi (Astro ou Next.js), configuration du repository, intégration Supabase, mise en place des pipelines CI/CD, configuration du déploiement. Pas de fonctionnalité utilisateur visible.

**Livrables** : projet techniquement prêt à recevoir le code fonctionnel, déploiement automatique fonctionnel, monitoring opérationnel.

**Phase 2 — Pages institutionnelles et architecture multi-pages (3-4 semaines)**

Implémentation des pages institutionnelles (accueil, méthodologie, à propos, etc.) selon la nouvelle architecture multi-pages. Mise en place du système de routing et de l'i18n FR/EN.

**Livrables** : 10-15 pages institutionnelles déployées avec architecture multi-pages, SEO optimisé, dual native desktop/mobile.

**Phase 3 — Migration du parcours principal (3-4 semaines)**

Refonte complète du parcours principal (questionnaire + résultats) avec divulgation progressive et dual native. Migration de la logique algorithmique existante.

**Livrables** : parcours principal fonctionnel sur nouvelle architecture, plus rapide et plus clair.

**Phase 4 — Pages véhicules individuelles (4-6 semaines)**

Génération automatique des pages véhicules à partir du catalogue. Production éditoriale du contenu unique par page. Optimisation SEO de chaque page.

**Livrables** : 200-500 pages véhicules indexables et performantes.

**Phase 5 — Parcours Guide-moi et garage (3-4 semaines)**

Refonte du parcours Guide-moi avec divulgation progressive. Refonte du garage et du comparateur.

**Livrables** : tous les parcours utilisateur refondus selon les nouveaux principes.

**Phase 6 — Pages comparaisons et guides éditoriaux (4-6 semaines)**

Génération des pages comparaisons à la demande. Production éditoriale des premiers guides d'achat.

**Livrables** : 50-100 pages comparaisons indexables, 10-20 guides éditoriaux publiés.

**Total** : 20-28 semaines, soit 5-7 mois de développement concentré.

### 7.2 Stratégie de migration progressive

L'objectif est de ne jamais interrompre le service. Trois approches possibles.

**Approche 1 — Site en parallèle puis bascule** : développer V2 sur un domaine de staging (v2.carpiq.eu), tester intensivement, puis basculer le DNS d'un coup au moment du go-live. Risqué mais simple.

**Approche 2 — Migration progressive par section** : migrer une section à la fois (par exemple les pages institutionnelles d'abord, puis le questionnaire, etc.). Moins risqué mais demande plus d'infrastructure de routing transitionnel.

**Approche 3 — Approche hybride** : V1 reste en production pour les fonctionnalités existantes, V2 prend en charge progressivement les nouvelles pages (notamment les pages véhicules SEO qui n'existent pas en V1). Migration finale du parcours principal en dernier.

**Recommandation** : approche 3 pour minimiser le risque tout en livrant de la valeur incrementale rapidement.

### 7.3 Considérations sur le code existant

Le fichier `carpiq-layer1-v64_0_4.html` actuel contient :
- Logique du parcours questionnaire complète
- Algorithme TCO-optimizer
- Système de filtres et de recommandations
- Logique du garage et du comparateur
- Architecture i18n existante

Cette logique métier doit être préservée et extraite dans des modules réutilisables avant la migration. Pas de réécriture complète de la logique métier, juste un refactoring de la couche présentation.

**Travail spécifique** : extraction de la logique JavaScript actuelle en modules TypeScript indépendants utilisables par le nouveau framework. Effort estimé : 1-2 semaines incluses dans la phase 1.

---

## 8. Critères de validation et tests

### 8.1 Critères de validation produit

Chaque page doit être validée selon une checklist commune.

**Critère 1 — Divulgation progressive** : la décision principale est identifiable en moins de 5 secondes. Toute information non essentielle est cachée par défaut et accessible par interaction.

**Critère 2 — Dual native** : l'expérience est optimale sur mobile (testée sur 3 devices) ET sur desktop (testée sur 2 résolutions).

**Critère 3 — SEO on-page** : tous les éléments SEO sont présents et optimisés (title, meta description, H1 unique, schema.org, sitemap, hreflang).

**Critère 4 — Performance** : Lighthouse score > 90 en mobile sur la page. Core Web Vitals dans la zone "Good".

**Critère 5 — Accessibilité** : conformité WCAG 2.1 niveau AA. Vérifiable avec Lighthouse et tests manuels.

**Critère 6 — Cohérence design** : respect du design system CarPIQ (palette, typographie, spacings, composants).

**Critère 7 — Tests fonctionnels** : tous les parcours utilisateur fonctionnent end-to-end sans bug bloquant.

### 8.2 Tests automatisés

**Tests unitaires** : couverture minimum 70% sur la logique métier (algorithme TCO, filtres, calculs).

**Tests d'intégration** : scénarios complets de parcours utilisateur (du questionnaire aux résultats).

**Tests E2E** : navigation complète du site simulée via Playwright ou Cypress.

**Tests visuels** : régression visuelle via Percy ou Chromatic pour détecter les changements UI non intentionnels.

**Tests de performance** : Lighthouse CI dans le pipeline avec seuils bloquants.

### 8.3 Tests utilisateur

Avant le déploiement de chaque phase majeure, tests avec 5-10 utilisateurs réels représentatifs des cibles CarPIQ.

**Méthodologie** : sessions de 30-45 minutes avec tâches à accomplir, observation des frictions, feedback structuré.

**Critères de succès** : taux de complétion des tâches > 80%, NPS > 30 sur l'expérience.

---

## 9. Risques et plans de mitigation

### 9.1 Risque technique : complexité sous-estimée

**Description** : la refonte V2 demande 5-7 mois de développement. Risque de dérapage à 8-12 mois si la complexité réelle est sous-estimée.

**Probabilité** : élevée (60-70%). C'est le risque classique des refontes ambitieuses.

**Mitigation** : phasage rigoureux avec livrables intermédiaires, scope freeze après chaque phase, possibilité de basculer en mode "minimum viable" sur les phases ultérieures si nécessaire.

### 9.2 Risque SEO : transition mal gérée

**Description** : la migration vers une architecture multi-pages peut perturber le ranking actuel si les redirections 301 ne sont pas correctement configurées.

**Probabilité** : modérée si le sujet est négligé.

**Mitigation** : plan de redirections 301 documenté avant migration, monitoring Google Search Console rapproché pendant les 30 jours suivant chaque bascule, plan B de rollback rapide en cas de chute de trafic.

### 9.3 Risque utilisateur : confusion pendant la transition

**Description** : les utilisateurs habitués à la V1 peuvent être déstabilisés par la V2.

**Probabilité** : faible car la V1 a peu d'utilisateurs habituels.

**Mitigation** : message d'accueil expliquant les changements lors de la première visite post-V2. Possibilité de retour temporaire à la V1 via lien dédié pendant 30 jours.

### 9.4 Risque financier : investissement disproportionné

**Description** : 5-7 mois de développement représentent un investissement substantiel pour un solo founder.

**Probabilité** : à évaluer selon votre situation financière.

**Mitigation** : phasage rigoureux avec critères de bascule (continuer V2 vs ajuster) à chaque fin de phase, opportunité de levée pre-seed possible en mois 12-15 si traction le justifie, premiers revenus B2B accessibles (cabinets conseil, comparateurs) peuvent financer une partie.

---

## 10. Considérations stratégiques et business

### 10.1 Alignement avec le GTM v2.0

Cette refonte V2 est l'infrastructure technique nécessaire pour atteindre les objectifs du GTM v2.0 (priorité OEM-first, 200K-800K MAU à 24 mois, ARR B2B 250-700 K€).

Sans cette refonte, les objectifs SEO du GTM v2.0 sont irréalistes. Sans cette refonte, l'expérience utilisateur ne supporte pas une croissance à 100K+ MAU. Sans cette refonte, la valeur perçue par les acheteurs B2B (OEM, assureurs) reste limitée.

### 10.2 Timing et opportunité

Démarrer cette refonte en septembre 2026 après le lancement de juin est cohérent. Cela laisse 3 mois post-lancement pour :
- Observer les comportements utilisateurs réels
- Valider les hypothèses produit avec données réelles
- Affiner les priorités de la refonte selon les retours
- Préparer le projet techniquement (choix framework, recrutement éventuel)

### 10.3 Décision sur la production éditoriale

L'architecture multi-pages génère un besoin éditorial significatif. 200-500 pages véhicules + 50-100 guides + 30-80 comparaisons = 300-700 pages avec contenu unique de qualité.

Trois options pour ce volume éditorial.

**Option A** : production manuelle par le fondateur. 8-16 heures par semaine sur 12-18 mois. Réaliste mais consommateur de temps.

**Option B** : recrutement d'un éditeur ou rédacteur senior automobile. 60-80 K€/an de coût. Justifié si le SEO démarre fort.

**Option C** : utilisation d'IA générative pour produire 80% du contenu avec revue éditoriale manuelle. Permet de scaler la production avec un effort réduit. Risque qualité à surveiller.

**Recommandation** : démarrer avec option C (génération assistée IA + revue manuelle), basculer vers option B si la qualité demande plus.

### 10.4 Investissement total estimé

**Coût développement** : 5-7 mois × 50-80 K€/mois si développeur senior externe = 250-560 K€. Ou équivalent en temps fondateur si développement interne.

**Coût infrastructure** : 200-500 €/mois (hosting, monitoring, outils) sur la durée du projet et au-delà.

**Coût éditorial** : 0-80 K€/an selon l'option choisie pour la production de contenu.

**Total estimé refonte V2 sur 12 mois** : 250-700 K€ selon stratégie.

Cet investissement est cohérent avec une trajectoire startup B2C visant une valuation 10-30 M€ à 24 mois.

---

## Conclusion

Cette spec V2 trace une refonte ambitieuse mais cohérente avec les objectifs business et la vision produit de CarPIQ. Elle résout les trois limitations structurelles identifiées (densité informationnelle, dual native sous-optimal, single-page handicapant SEO) de manière intégrée et systémique.

La mise en œuvre demande 5-7 mois de développement concentré entre septembre 2026 et mars-avril 2027. Cette période succède au lancement de juin 2026 et à 2-3 mois d'observation des comportements utilisateurs réels qui informeront les arbitrages finaux.

Le résultat attendu est une plateforme CarPIQ V2 qui sera fonctionnellement et techniquement compétitive avec les meilleurs produits B2C premium tous secteurs confondus, capable de soutenir une croissance vers 200-800K MAU et de matérialiser la valeur stratégique des données utilisateurs pour le pivot OEM-first du GTM v2.0.

---

*Document produit le 26 mai 2026. Spec V2 consolidée intégrant divulgation progressive, dual native desktop/mobile, et architecture multi-pages SEO. À utiliser comme document maître de la refonte CarPIQ V2 démarrant en septembre 2026.*
