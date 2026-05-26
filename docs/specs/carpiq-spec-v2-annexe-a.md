# CarPIQ V2 — Annexe A : Spécifications détaillées toutes les pages

**Destinataire** : développeur(s) CarPIQ
**Statut** : complément opérationnel de la spec V2 consolidée
**Version** : 1.0
**Date** : 26 mai 2026
**Périmètre** : spécifications détaillées des 18 pages principales avec structure mobile et desktop, composants, contenu, interactions, critères de validation

---

## Préambule sur l'utilisation de cette annexe

Ce document est conçu comme une référence opérationnelle à consulter page par page pendant l'implémentation. Il ne se lit pas linéairement de début à fin. Pour chaque page que vous allez développer, ouvrez la section correspondante et utilisez-la comme briefing complet.

Chaque page suit la même structure de spécification :
- Informations techniques (URL, title, meta, indexation)
- Structure mobile détaillée
- Structure desktop détaillée
- Composants utilisés
- Contenu textuel précis
- Interactions et états
- Critères de validation

Cette uniformité facilite votre navigation entre pages et garantit que rien n'est oublié.

---

## Table des matières

### Pages institutionnelles
1. Page d'accueil
2. Page méthodologie générale
3. Page à propos / équipe
4. Page contact
5. Page mentions légales et confidentialité

### Pages parcours utilisateur (4 classes sémantiques)
6. Page démarrage parcours principal
7. Page Classe 1 : Budget et priorité
8. Page Classe 2 : Usage quotidien
9. Page Classe 3 : Type de véhicule
10. Page Classe 4 : Contexte personnel

### Pages résultats
11. Page de résultats personnalisés
12. Page véhicule individuelle
13. Page comparaison de véhicules

### Pages Guide-moi
14. Page démarrage Guide-moi
15. Page étape 1 Guide-moi (quotidien)
16. Page étape 2 Guide-moi (silhouettes)
17. Page étape 3 Guide-moi (trajets)
18. Page étape 4 Guide-moi (valeurs)
19. Page profil révélé Guide-moi

### Pages utilisateur
20. Page garage virtuel
21. Page compte utilisateur

### Pages SEO et contenu
22. Pages catégoriques (segments, marques)
23. Pages guides éditoriaux
24. Page Observatoire CarPIQ

---

## 1. Page d'accueil

### 1.1 Informations techniques

**URL** : `/fr/` (équivalents `/en/`, `/de/`, etc.)
**Title tag** : "CarPIQ : comparateur automobile européen indépendant"
**Meta description** : "Calculez le coût mensuel réel d'une voiture en 3 minutes. Méthodologie transparente, sans publicité, sans biais commercial. 7 pays européens."
**H1** : "Quelle voiture acheter, et combien va-t-elle vraiment coûter ?"
**Indexation** : index, follow
**Schema.org** : `Organization` avec nom, logo, description, contact

### 1.2 Structure mobile (375px de référence)

```
┌─────────────────────────────────────┐
│ Header (56px)                       │
│ ┌─────────────┬─────────────────┐ │
│ │ CarPIQ logo │     ☰ menu       │ │
│ └─────────────┴─────────────────┘ │
├─────────────────────────────────────┤
│                                     │
│ Hero section (380px)                │
│ ┌─────────────────────────────────┐│
│ │ [Image background avec overlay] ││
│ │                                 ││
│ │  H1 titre principal en serif    ││
│ │  Sous-titre court explicatif    ││
│ │                                 ││
│ └─────────────────────────────────┘│
├─────────────────────────────────────┤
│                                     │
│ Section CTAs (520px)                │
│ ┌─────────────────────────────────┐│
│ │ Question "Que souhaitez-vous?"  ││
│ │                                 ││
│ │ ┌─────────────────────────────┐││
│ │ │ Image illustration showroom │││
│ │ │ "Trouver ma future voiture" │││
│ │ │ ~3 minutes                  │││
│ │ │ [Bouton primaire pleine L]  │││
│ │ └─────────────────────────────┘││
│ │                                 ││
│ │ ┌─────────────────────────────┐││
│ │ │ Image illustration analyse  │││
│ │ │ "Analyser ma voiture actuelle"│
│ │ │ ~2 minutes                  │││
│ │ │ [Bouton primaire pleine L]  │││
│ │ └─────────────────────────────┘││
│ │                                 ││
│ │ Lien "Vous hésitez ? Guide-moi" ││
│ └─────────────────────────────────┘│
├─────────────────────────────────────┤
│                                     │
│ Section "Comment ça marche" (300px) │
│ - Étape 1 : Vos critères            │
│ - Étape 2 : Notre analyse           │
│ - Étape 3 : Votre recommandation    │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ Section "Pourquoi CarPIQ" (300px)   │
│ - Indépendant                       │
│ - Méthodologie transparente         │
│ - Multi-pays Europe                 │
│                                     │
├─────────────────────────────────────┤
│                                     │
│ Section "Notre méthodologie" (200px)│
│ Aperçu + lien vers page dédiée      │
│                                     │
├─────────────────────────────────────┤
│ Footer (200px)                      │
│ Liens légaux, langues, contact      │
└─────────────────────────────────────┘
```

**Hauteur totale mobile** : environ 2000px, fold à 600-700px (la majorité voit le hero + début des CTAs).

### 1.3 Structure desktop (1440px de référence)

```
┌───────────────────────────────────────────────────────────────┐
│ Header (72px)                                                  │
│ ┌─────────────┬────────────────────────┬──────────────────┐ │
│ │ Logo+baseline│ Nav menu                │ Langues + Login   │ │
│ └─────────────┴────────────────────────┴──────────────────┘ │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│ Hero section (520px)                                           │
│ ┌────────────────────────────────────────────────────────────┐│
│ │ [Image background panoramique avec overlay]                ││
│ │                                                              ││
│ │           H1 titre principal large typographie              ││
│ │              Sous-titre engageant                           ││
│ │                                                              ││
│ │   [Première vue CTA 1]      [Première vue CTA 2]           ││
│ │                                                              ││
│ └────────────────────────────────────────────────────────────┘│
├───────────────────────────────────────────────────────────────┤
│                                                                │
│ Section CTAs (480px)                                           │
│ ┌──────────────────────────┬──────────────────────────────┐  │
│ │                          │                              │  │
│ │  Image illustration      │  Image illustration          │  │
│ │  showroom large          │  analyse large               │  │
│ │                          │                              │  │
│ │  "Trouver ma future      │  "Analyser ma voiture        │  │
│ │   voiture"               │   actuelle"                  │  │
│ │  ~3 minutes              │  ~2 minutes                  │  │
│ │                          │                              │  │
│ │  [Bouton primaire]       │  [Bouton primaire]           │  │
│ └──────────────────────────┴──────────────────────────────┘  │
│                                                                │
│         Lien tertiaire "Vous hésitez ? Guide-moi"             │
│                                                                │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│ Section "Comment ça marche" (3 colonnes, 300px)                │
│ ┌──────────────┬──────────────┬──────────────────────────┐  │
│ │  Étape 1     │  Étape 2     │  Étape 3                 │  │
│ │  Vos critères│  Notre       │  Votre recommandation    │  │
│ │              │  analyse     │                          │  │
│ └──────────────┴──────────────┴──────────────────────────┘  │
│                                                                │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│ Section "Pourquoi CarPIQ" (3 colonnes, 300px)                  │
│                                                                │
├───────────────────────────────────────────────────────────────┤
│                                                                │
│ Section "Méthodologie" (200px) avec preview et CTA            │
│                                                                │
├───────────────────────────────────────────────────────────────┤
│ Footer (240px)                                                 │
│ 5 colonnes : Produit, Méthode, Légal, Contact, Langues        │
└───────────────────────────────────────────────────────────────┘
```

**Hauteur totale desktop** : environ 2400px, fold à 800-900px (la majorité voit le hero + les deux CTAs en entier).

### 1.4 Composants utilisés

- `<SiteHeader />` avec props `variant="home"`
- `<HeroSection />` avec props image, title, subtitle
- `<CTABlock />` × 2 avec props image, title, time, action
- `<SecondaryLink />` pour le lien Guide-moi
- `<ProcessSteps />` pour la section "Comment ça marche"
- `<ValueProps />` pour la section "Pourquoi CarPIQ"
- `<MethodologyPreview />` avec CTA vers page dédiée
- `<SiteFooter />` avec props `variant="full"`

### 1.5 Contenu textuel précis

**H1** : "Quelle voiture acheter, et combien va-t-elle vraiment coûter ?"

**Sous-titre H1** : "3 minutes. Calcul personnalisé selon vos trajets et l'âge du véhicule."

**Question CTA** : "Que souhaitez-vous faire ?"

**CTA 1 titre** : "Trouver ma future voiture"
**CTA 1 description** : "Analyse personnalisée selon votre budget et vos besoins"
**CTA 1 durée** : "~3 minutes"
**CTA 1 bouton** : "Commencer →"

**CTA 2 titre** : "Analyser ma voiture actuelle"
**CTA 2 description** : "Comprenez le vrai coût de votre voiture aujourd'hui"
**CTA 2 durée** : "~2 minutes"
**CTA 2 bouton** : "Commencer →"

**Lien tertiaire** : "Je ne sais pas par où commencer → Guide-moi"

**Section "Comment ça marche"** :
- Étape 1 : "Vos critères"
  Description : "Quelques questions sur votre budget, vos trajets, vos préférences"
- Étape 2 : "Notre analyse"
  Description : "Méthodologie rigoureuse appliquée à 500+ modèles européens"
- Étape 3 : "Votre recommandation"
  Description : "La voiture qui vous correspond, avec son vrai coût mensuel"

**Section "Pourquoi CarPIQ"** :
- Argument 1 : "Indépendant et neutre"
  Description : "Aucune publicité, aucun lien commercial avec les constructeurs"
- Argument 2 : "Méthodologie transparente"
  Description : "Sources de données ouvertes, calculs vérifiables, hypothèses explicites"
- Argument 3 : "Vision européenne"
  Description : "7 pays analysés, fiscalité incluse, prix réels du marché"

### 1.6 Interactions et états

**Header mobile** :
- Au clic sur ☰ : ouverture menu drawer avec navigation et langues
- État connecté : remplacement par avatar utilisateur

**Hero section** :
- Image background : lazy loaded en WebP
- Animation subtle au scroll (parallax léger optionnel)

**CTAs** :
- Au hover (desktop) : légère élévation et amplification de l'ombre
- Au tap (mobile) : effet ripple subtil
- Au clic : navigation immédiate vers `/fr/trouver-ma-voiture` ou `/fr/garage`

**Lien Guide-moi** :
- Au clic : navigation vers `/fr/guide-me`

**Sélecteur de langue** :
- Affiche menu déroulant avec les 7 langues
- Au clic : navigation vers la version traduite de la page actuelle

### 1.7 Critères de validation

- [ ] Lighthouse mobile score > 90
- [ ] LCP < 2.0s en 4G simulé
- [ ] CLS = 0
- [ ] Toutes les images en WebP avec lazy loading approprié
- [ ] H1 unique avec mot-clé principal
- [ ] Meta description entre 150-160 caractères
- [ ] Schema.org Organization présent et valide
- [ ] Tests utilisateur : taux de clic CTA > 40% sur le test des 5 premiers utilisateurs
- [ ] Mobile : aucun élément qui dépasse latéralement
- [ ] Mobile : tous les CTAs ont une zone de tap > 48×48px
- [ ] Desktop : layout harmonieux entre 1024px et 1920px

---

## 2. Page méthodologie générale

### 2.1 Informations techniques

**URL** : `/fr/methodologie`
**Title tag** : "Méthodologie CarPIQ : comment nous calculons le TCO automobile"
**Meta description** : "Découvrez notre méthodologie transparente : sources de données, algorithmes TCO, validation académique IMD. Approche rigoureuse pour des décisions éclairées."
**H1** : "Notre méthodologie : la rigueur au service de votre décision"
**Indexation** : index, follow
**Schema.org** : `TechArticle` avec auteur (CarPIQ), date publication

### 2.2 Structure mobile

```
Header (56px)
│
Hero section (200px)
│ H1 + sous-titre + image illustrative
│
Section "Notre approche" (250px)
│ 3 principes en cards verticales
│
Section "Sources de données" (300px)
│ Liste des sources avec logos et descriptions
│
Section "Algorithmes TCO" (400px)
│ Accordions pour chaque composante :
│ - Prix d'achat
│ - Dépréciation
│ - Carburant/énergie
│ - Entretien
│ - Assurance
│ - Fiscalité
│
Section "Validation académique" (200px)
│ Mention partenariat IMD/EPFL
│ Lien vers white paper
│
Section CTAs (150px)
│ "Voir les sources détaillées"
│ "Commencer une analyse"
│
Footer (180px)
```

### 2.3 Structure desktop

```
Header (72px)
│
Hero section (320px)
│ H1 large + sous-titre + image illustrative à droite
│
Section "Notre approche" (320px)
│ 3 principes en colonnes
│
Section "Sources de données" (400px)
│ Grille de sources avec logos
│ Tableau détaillé en dessous
│
Section "Algorithmes TCO" (600px)
│ Visualisation interactive des composantes
│ Détails accessibles par hover/click
│
Section "Validation académique" (280px)
│ Layout 2 colonnes : description + visuel
│
Section "Transparence" (220px)
│ Engagements CarPIQ
│
Footer riche (240px)
```

### 2.4 Composants utilisés

- `<SiteHeader />` variant="standard"
- `<PageHero />` avec titre H1 et image
- `<PrincipleCards />` pour les 3 principes
- `<DataSourcesList />` pour les sources
- `<TCOComponents />` composant interactif avec accordions
- `<AcademicValidation />` avec lien vers white paper
- `<CTASection />` avec deux boutons
- `<SiteFooter />`

### 2.5 Contenu textuel précis

**H1** : "Notre méthodologie : la rigueur au service de votre décision"

**Sous-titre** : "Comprenez comment CarPIQ calcule le vrai coût d'une voiture. Sources, algorithmes et validations transparentes."

**Section "Notre approche"** :

Principe 1 : "Données primaires uniquement"
Description : "Pas de moyennes industrielles. Chaque chiffre vient d'une source vérifiable : constructeurs, ADAC, Spritmonitor, autorités fiscales nationales."

Principe 2 : "Méthodologie publique"
Description : "Tous nos calculs sont documentés et reproductibles. Vous pouvez challenger nos hypothèses et nos sources."

Principe 3 : "Neutralité commerciale"
Description : "Aucune publicité, aucun lien d'affiliation, aucun biais en faveur d'un constructeur ou d'un type de motorisation."

**Section "Sources de données"** :

Texte d'introduction : "CarPIQ s'appuie sur des sources primaires européennes, vérifiables et régulièrement mises à jour."

Liste des sources :
- "Prix d'achat" : Constructeurs (catalogues officiels), DAT (Allemagne), L'Argus (France)
- "Consommation réelle" : Spritmonitor.de (3M utilisateurs européens)
- "Coûts d'entretien" : ADAC Cost Calculator (référence européenne)
- "Dépréciation" : Données de revente certifiées par marché national
- "Fiscalité" : Autorités fiscales nationales (7 pays)

**Section "Algorithmes TCO"** :

Texte d'introduction : "Le Coût Total de Possession (TCO) intègre 6 composantes principales. Cliquez sur chacune pour comprendre notre méthodologie."

Pour chaque composante (accordion) :

**Prix d'achat**
"Prix catalogue constructeur officiel par pays et configuration. Mise à jour mensuelle. Inclus options de série, exclus options optionnelles."

**Dépréciation**
"Modélisation par courbe à 5 paliers (1, 2, 5, 7, 10 ans) basée sur les données de revente certifiées. Spécifique à chaque modèle et chaque marché national."

**Carburant ou énergie**
"Consommation Spritmonitor (réelle utilisateurs) plutôt que WLTP (théorique). Prix énergétiques moyens annuels par pays. Modulation selon profil de trajet."

**Entretien et réparations**
"Coûts ADAC par marque et catégorie de véhicule. Modulation selon âge et kilométrage cumulé."

**Assurance**
"Estimation par catégorie de risque, segment, et profil utilisateur. Sources : Allianz, AXA, données nationales."

**Fiscalité**
"Calcul national pour chaque pays cible : malus, taxes annuelles, déductibilité professionnelle si applicable."

**Section "Validation académique"** :

"Notre méthodologie est en cours de validation académique avec l'IMD Lausanne dans le cadre d'un partenariat de recherche financé par Innosuisse."

"Le white paper méthodologique sera publié en [date]. Il détaille nos hypothèses, sources, algorithmes et limitations."

[CTA] "Télécharger le white paper" (disponible à partir de la publication)

### 2.6 Interactions et états

**Accordions algorithmes** : ouverts un à la fois, animation 250ms, état mémorisé par session.

**Sources de données** : tooltip au hover sur chaque source montrant la fréquence de mise à jour et la dernière date de synchronisation.

**Lien white paper** : avant publication, lien grisé avec mention "Disponible prochainement". Après publication, lien fonctionnel avec ouverture en nouvel onglet.

### 2.7 Critères de validation

- [ ] Contenu total > 1500 mots (objectif SEO)
- [ ] H2 et H3 hiérarchisés correctement
- [ ] Schema.org TechArticle valide
- [ ] Tous les liens externes en `target="_blank" rel="noopener"`
- [ ] Performance : LCP < 2.5s
- [ ] Accordions accessibles au clavier (Enter, Espace)
- [ ] Mobile : aucun débordement horizontal
- [ ] Test utilisateur : compréhension de la méthodologie validée par 5 utilisateurs

---

## 3. Page à propos et équipe

### 3.1 Informations techniques

**URL** : `/fr/a-propos`
**Title tag** : "À propos de CarPIQ : qui sommes-nous"
**Meta description** : "Découvrez l'histoire et l'équipe derrière CarPIQ, le comparateur automobile européen indépendant. Vision, valeurs, fondateur."
**H1** : "L'équipe derrière CarPIQ"
**Indexation** : index, follow

### 3.2 Structure mobile

```
Hero (240px)
│ H1 + sous-titre + image équipe ou icône
│
Section "Notre mission" (250px)
│ Texte court engageant
│
Section "Le fondateur" (300px)
│ Photo Jeremie + bio
│ Parcours IMD CAS, industriel
│ LinkedIn
│
Section "Notre histoire" (300px)
│ Timeline simple
│ Genèse du projet
│
Section "Nos valeurs" (300px)
│ 3-4 valeurs clés
│
Section "Contact et collaboration" (200px)
│ CTAs vers contact, presse, partenariats
│
Footer (200px)
```

### 3.3 Structure desktop

```
Hero (360px) : layout 2 colonnes texte + image
│
Section "Notre mission" (300px) : texte centré
│
Section "Le fondateur" (400px) : photo + bio en 2 colonnes
│
Section "Notre histoire" (350px) : timeline horizontale
│
Section "Nos valeurs" (320px) : 4 colonnes
│
Section "Contact" (220px)
│
Footer riche (240px)
```

### 3.4 Contenu textuel précis

**H1** : "L'équipe derrière CarPIQ"

**Mission** : "CarPIQ existe pour rendre les décisions automobiles plus éclairées, plus rationnelles, et plus alignées avec les besoins réels des conducteurs européens."

**Sous-mission** : "Notre conviction : les comparateurs automobiles actuels servent les intérêts commerciaux plutôt que ceux des acheteurs. CarPIQ change cela."

**Section "Le fondateur"** :

"Jeremie Blard, fondateur de CarPIQ"

Bio : "Jeremie a 17 ans d'expérience industrielle dans des fonctions techniques et stratégiques. Diplômé du IMD Lausanne (Strategy & Digital Acceleration, mention exceptionnelle, 2026) et certifié PMP, il a lancé CarPIQ en 2026 pour répondre à une question qui le frustrait personnellement : comment vraiment choisir une voiture en Europe ?"

Engagement personnel : "CarPIQ est un projet à temps plein dirigé personnellement par Jeremie. Pas d'équipe marketing, pas d'investisseurs avec agenda commercial. Juste une obsession : la rigueur méthodologique au service de l'utilisateur."

**Section "Notre histoire"** :

Timeline :
- 2025 : "Idée initiale, recherche méthodologique"
- Janvier 2026 : "Diplôme IMD CAS, début du développement"
- Juin 2026 : "Lancement public CarPIQ"
- Septembre 2026 : "Partenariat académique IMD"
- 2027 : "Vision européenne complète"

**Section "Nos valeurs"** :

Valeur 1 : "Indépendance"
"Aucune publicité. Aucun partenariat commercial influençant nos analyses."

Valeur 2 : "Transparence"
"Méthodologie publique. Sources vérifiables. Limitations assumées."

Valeur 3 : "Rigueur"
"Validation académique. Mise à jour continue des données. Itération basée sur les retours."

Valeur 4 : "Européanité"
"7 pays analysés. Vision européenne authentique, pas un produit français traduit."

**Section "Contact et collaboration"** :

"Vous êtes journaliste, chercheur, partenaire potentiel ?"

CTAs :
- "Contact presse" → `/fr/presse`
- "Contact général" → `/fr/contact`
- "Partenariats" → `mailto:partnerships@carpiq.eu`

### 3.5 Critères de validation

- [ ] Photo fondateur de qualité professionnelle
- [ ] LinkedIn du fondateur lié et vérifié
- [ ] Schema.org Person pour le fondateur
- [ ] Schema.org Organization pour CarPIQ
- [ ] Mentions IMD vérifiables
- [ ] Ton authentique sans corporate speak

---

## 4. Page contact

### 4.1 Informations techniques

**URL** : `/fr/contact`
**Title tag** : "Contact CarPIQ"
**Meta description** : "Contactez l'équipe CarPIQ : support utilisateur, presse, partenariats. Réponse sous 48 heures ouvrées."
**Indexation** : index, follow

### 4.2 Structure mobile

```
Hero (180px) : H1 + sous-titre
│
Section "Comment pouvons-nous aider ?" (300px)
│ 3 boutons thématiques :
│ - Support utilisateur
│ - Presse et médias
│ - Partenariats
│
Section formulaire (400px)
│ Champs : nom, email, sujet, message
│ Captcha
│ Bouton envoyer
│
Section "Coordonnées" (200px)
│ Email général
│ Adresse postale Suisse
│ Délai de réponse
│
Footer (180px)
```

### 4.3 Structure desktop

```
Hero (260px) layout centré
│
Section principale (500px) layout 2 colonnes
│ Colonne gauche : formulaire complet
│ Colonne droite : coordonnées et infos
│
Section "FAQ courte" (300px) optionnelle
│
Footer (240px)
```

### 4.4 Contenu textuel précis

**H1** : "Contact"

**Sous-titre** : "Une question, une suggestion, un sujet à explorer ? Nous lisons et répondons à tous les messages."

**Boutons thématiques** :
- "Support utilisateur" : "Une question sur une analyse ? Un bug rencontré ?"
- "Presse et médias" : "Interview, communiqué, données pour article"
- "Partenariats" : "Collaboration commerciale ou académique"

**Formulaire** :
- "Votre nom" (requis)
- "Votre email" (requis, validation format)
- "Sujet" (dropdown selon thématique sélectionnée)
- "Votre message" (textarea, 50 caractères minimum)
- Captcha (anti-spam)
- "Envoyer le message"

**Coordonnées** :
- Email : contact@carpiq.eu (général)
- Email : press@carpiq.eu (presse)
- Email : partnerships@carpiq.eu (partenariats)
- Délai de réponse : "Sous 48 heures ouvrées en moyenne"
- Localisation : "Suisse (Region Lémanique)"

### 4.5 Critères de validation

- [ ] Formulaire fonctionnel avec validation côté client et serveur
- [ ] Anti-spam efficace (captcha ou honeypot)
- [ ] Confirmation envoyée à l'utilisateur après soumission
- [ ] RGPD : consentement explicite pour conservation des données

---

## 5. Page mentions légales et confidentialité

Cette page combine mentions légales, politique de confidentialité, CGU, et politique cookies. Une seule page pour simplifier la navigation utilisateur, avec sections ancrables.

### 5.1 Informations techniques

**URL** : `/fr/legal` (avec ancres `#mentions`, `#confidentialite`, `#cgu`, `#cookies`)
**Title tag** : "Mentions légales et confidentialité | CarPIQ"
**Indexation** : noindex (page légale, pas SEO)

### 5.2 Structure simple unique

```
Hero (150px) : H1
│
Navigation ancres (60px) : 4 boutons vers sections
│
Section "Mentions légales" : éditeur, hébergeur, etc.
│
Section "Politique de confidentialité" : RGPD
│
Section "Conditions générales d'utilisation"
│
Section "Politique cookies" : usage, tracking, opt-out
│
Footer
```

### 5.3 Contenu

Contenu légal standard à faire valider par juriste avant publication. Mentionner explicitement :
- Conformité RGPD
- Pas de vente de données personnelles
- Cookies analytiques optionnels (Mixpanel, Plausible)
- Droits utilisateurs (accès, rectification, oubli, opposition)
- Délégué à la protection des données (à désigner si nécessaire)

---

## 6. Page démarrage parcours principal

### 6.1 Informations techniques

**URL** : `/fr/trouver-ma-voiture`
**Title tag** : "Trouver votre voiture idéale en 3 minutes | CarPIQ"
**Meta description** : "Démarrez votre recherche personnalisée CarPIQ. 4 étapes simples pour analyser plus de 500 modèles européens selon votre profil."
**H1** : "Trouvons votre voiture idéale"
**Indexation** : index, follow

### 6.2 Structure mobile

```
Header avec indicateur progression (70px)
│
Hero compact (200px)
│ H1 + sous-titre rassurant
│ "4 étapes · 3 minutes · Sans compte"
│
Section "Avant de commencer" (300px)
│ 3 points clés en cards :
│ - Vos réponses restent confidentielles
│ - Pas de compte requis
│ - Méthodologie transparente
│
Section CTA (200px)
│ Bouton primaire "Commencer →" pleine largeur
│ Lien tertiaire "Comment ça marche ?"
│
Section "Aperçu du parcours" (300px)
│ Liste numérotée des 4 classes thématiques
│
Footer minimal (120px)
```

### 6.3 Structure desktop

```
Header avec progression (80px)
│
Hero (320px) layout centré
│ H1 large + sous-titre + détails
│
Section principale (480px) layout 2 colonnes
│ Colonne gauche (60%) : explication détaillée
│ Colonne droite (40%) : visuel + CTA
│
Section aperçu parcours (300px)
│ Visualisation horizontale des 4 étapes thématiques
│
Footer (200px)
```

### 6.4 Contenu textuel précis

**H1** : "Trouvons votre voiture idéale"

**Sous-titre** : "4 étapes simples. 3 minutes. Une recommandation personnalisée basée sur le coût mensuel réel."

**Section "Avant de commencer"** :

Point 1 : "Confidentialité totale"
"Aucune information personnelle requise. Pas d'inscription. Vos réponses restent sur votre appareil."

Point 2 : "Méthodologie transparente"
"Chaque étape vous explique pourquoi nous posons ces questions."

Point 3 : "Vous gardez le contrôle"
"À chaque étape, vous pouvez modifier vos réponses précédentes."

**CTA principal** : "Commencer la recherche →"
**Lien secondaire** : "Voir comment ça marche →" (vers méthodologie)

**Aperçu des 4 étapes thématiques** :
1. "Budget et priorité"
2. "Usage quotidien"
3. "Type de véhicule"
4. "Contexte personnel"

### 6.5 Interactions et états

- Animation subtile au clic sur le CTA principal (transition vers l'étape 1)
- Possibilité de modifier des étapes précédentes via le bouton retour
- Sauvegarde de la session en localStorage pour reprise éventuelle

### 6.6 Critères de validation

- [ ] Bouton CTA visible au-dessus du fold
- [ ] Aucune friction d'entrée (pas de demande email à ce stade)
- [ ] Test utilisateur : taux de clic vers étape 1 > 70%

---

## 7. Page Classe 1 : Budget et priorité

### 7.1 Informations techniques

**URL** : `/fr/trouver-ma-voiture/budget-priorite`
**Title tag** : "Étape 1/4 : Budget et priorité | CarPIQ"
**Meta description** : "Définissez votre budget et votre priorité principale pour votre future voiture."
**Indexation** : noindex (page de parcours)

### 7.2 Structure mobile

```
Header progression (70px)
│ "Étape 1 sur 4" + barre de progression
│ Indicateur 25%
│
Question H1 (140px)
│ "Votre budget et votre priorité"
│ Sous-titre : "Deux éléments inséparables pour vous recommander la bonne voiture"
│
Sous-section Budget (340px)
│ Label : "Quel budget total pour cette voiture ?"
│ Affichage chiffre central : "CHF 25 000"
│ Slider horizontal pleine largeur
│ Min: 8 000 CHF / Max: 80 000 CHF
│ Boutons rapides : 10K, 15K, 20K, 25K, 30K, 40K, 50K
│
Sous-section Priorité (320px)
│ Label : "Votre priorité principale"
│ Grille 2×3 de cards :
│ - Coût total minimal
│ - Meilleur rapport qualité-prix
│ - Premium et confort
│ - Sportif et dynamisme
│ - Écologique
│ - Familial et espace
│
Section "Pourquoi ces questions ?" (collapsed) (60px)
│ Bouton accordion qui ouvre une explication
│
Boutons navigation (80px)
│ [Retour] [Continuer →]
│ Continuer désactivé tant que les deux sous-sections ne sont pas répondues
│
Footer minimal (100px)
```

### 7.3 Structure desktop

```
Header progression riche (90px)
│
Hero classe (200px) layout centré
│ H1 + sous-titre explicatif
│
Section principale (600px) layout 2 colonnes
│ Colonne gauche (50%) : Budget interactif
│ ├── Affichage chiffre central très grand
│ ├── Slider plus large avec graduations
│ └── Présets en cards plus visibles
│
│ Colonne droite (50%) : Priorité en grille
│ ├── Grille 2×3 ou 3×2 de cards
│ └── Sélection unique avec feedback visuel
│
Section "Pourquoi ces questions ?" (expandable)
│
Boutons navigation (80px)
│
Footer (120px)
```

### 7.4 Contenu textuel précis

**H1** : "Votre budget et votre priorité"

**Sous-titre** : "Deux éléments inséparables pour vous recommander la bonne voiture."

**Sous-section Budget** :
- Label : "Quel budget total pour cette voiture ?"
- Description : "Prix d'achat tout compris (hors financement)"
- Affichage : "CHF [valeur]"
- Présets boutons : 10 000, 15 000, 20 000, 25 000, 30 000, 40 000, 50 000

**Sous-section Priorité** :
- Label : "Votre priorité principale"
- Description : "Ce qui comptera le plus dans votre choix"

Cards de priorité :
- "Coût total minimal" / "Minimiser les dépenses sur 5 ans"
- "Meilleur rapport qualité-prix" / "Équilibre optimal entre prix et qualité"
- "Premium et confort" / "Privilégier la qualité d'expérience"
- "Sportif et dynamisme" / "Plaisir de conduite avant tout"
- "Écologique" / "Impact environnemental minimisé"
- "Familial et espace" / "Espace et praticité pour la famille"

**"Pourquoi ces questions ?" (accordion)** :
"Votre budget détermine immédiatement les segments de véhicules accessibles. Votre priorité oriente l'algorithme : pour un même budget, un utilisateur qui veut minimiser le coût total recevra des recommandations différentes d'un utilisateur qui privilégie le confort premium. C'est pourquoi ces deux décisions sont prises ensemble."

**Bouton primaire** : "Continuer →"
**Bouton secondaire** : "← Retour"

### 7.5 Interactions et états

- Slider avec haptic feedback sur mobile
- Mise à jour temps réel de l'affichage budget
- Validation : budget minimum 5 000, maximum 200 000
- Sélection priorité : visuel de sélection (bordure teal + fond légèrement teinté)
- Bouton "Continuer" désactivé tant que budget ET priorité ne sont pas définis
- Sauvegarde automatique en localStorage à chaque modification
- Accordion "Pourquoi" avec animation fluide

### 7.6 Critères de validation

- [ ] Au-dessus du fold mobile : budget visible + au moins le début de la grille priorité
- [ ] Slider utilisable au pouce sur mobile (zone tactile élargie)
- [ ] Affichage chiffre toujours lisible (taille minimum)
- [ ] Cards priorité respectent le touch target 48×48px minimum
- [ ] Test utilisateur : compréhension de la cohérence entre budget et priorité
- [ ] Persistence des choix en cas de retour arrière

---

## 8. Page Classe 2 : Usage quotidien

### 8.1 Informations techniques

**URL** : `/fr/trouver-ma-voiture/usage`
**Title tag** : "Étape 2/4 : Votre usage quotidien | CarPIQ"
**Indexation** : noindex

### 8.2 Structure mobile

```
Header progression (70px) : 50%
│
Question H1 (140px)
│ "Vos habitudes de conduite"
│ Sous-titre : "Ces informations déterminent la motorisation et le type optimal pour vous"
│
Sous-section 1 : Kilométrage (220px)
│ Label : "Combien de km par an ?"
│ 4 cards 2×2 :
│ - Moins de 10 000 km / Local
│ - 10-20 000 km / Quotidien
│ - 20-35 000 km / Élevé
│ - Plus de 35 000 km / Très fort
│
Sous-section 2 : Type de trajets (220px)
│ Label : "Quel type de trajets ?"
│ 4 cards 2×2 :
│ - Courts < 30min
│ - Mixte
│ - Longs > 1h
│ - Très longs 2h+
│
Sous-section 3 : Recharge (250px)
│ Label : "Pouvez-vous recharger chez vous ?"
│ 3 cards verticales :
│ - Oui, prise dédiée (idéal BEV)
│ - Peut-être, à étudier
│ - Non, stationnement public
│
Boutons navigation (80px)
│ [Retour] [Continuer →]
│ Continuer désactivé tant que les 3 sous-sections ne sont pas répondues
│
Footer minimal (100px)
```

### 8.3 Structure desktop

```
Header progression (90px)
│
Hero classe (200px)
│ H1 + sous-titre
│
Section principale (700px) layout en 3 colonnes ou en grille
│ Sous-section 1 : Kilométrage (3 colonnes)
│ Sous-section 2 : Type de trajets (4 colonnes)
│ Sous-section 3 : Recharge (3 colonnes)
│
Section "Pourquoi ces questions ?" (expandable)
│
Boutons navigation (80px)
│
Footer (120px)
```

### 8.4 Contenu textuel précis

**H1** : "Vos habitudes de conduite"

**Sous-titre** : "Ces informations déterminent la motorisation et le type de véhicule optimaux pour vous."

**Sous-section 1 — Kilométrage** :
- Label : "Combien de km par an ?"
- Cards :
  - "Local" / "Moins de 10 000 km" / "Trajets occasionnels"
  - "Quotidien" / "10 000 à 20 000 km" / "Usage régulier"
  - "Élevé" / "20 000 à 35 000 km" / "Forte utilisation"
  - "Très fort" / "Plus de 35 000 km" / "Usage professionnel"

**Sous-section 2 — Type de trajets** :
- Label : "Quel type de trajets ?"
- Cards :
  - "Courts" / "Moins de 30 min" / "Trajets urbains"
  - "Mixte" / "Courts et longs" / "Usage varié"
  - "Longs" / "Plus d'1h régulièrement" / "Trajets routiers"
  - "Très longs" / "2h+ fréquemment" / "Grandes distances"

**Sous-section 3 — Recharge** :
- Label : "Pouvez-vous recharger chez vous ?"
- Cards :
  - "Oui, prise dédiée" / "Garage, parking attribué" / "Idéal pour BEV"
  - "Peut-être" / "Possible avec installation" / "À évaluer"
  - "Non" / "Stationnement public" / "Limite l'usage BEV"

**"Pourquoi ces questions ?" (accordion)** :
"Le kilométrage annuel, le type de trajets et la capacité de recharge sont trois informations qui se complètent. Un utilisateur qui fait 5 000 km par an avec des trajets courts et la possibilité de recharger à domicile a un profil idéal pour un véhicule électrique. Un utilisateur qui fait 40 000 km de longs trajets sans recharge à domicile aura besoin d'une motorisation différente. C'est pourquoi ces trois questions sont traitées ensemble."

### 8.5 Interactions et états

- Sélection des cards avec feedback visuel immédiat
- Sélection unique par sous-section (pas de multi-sélection)
- Validation : les 3 sous-sections doivent être répondues pour activer "Continuer"
- Indicateur visuel discret sur les sous-sections non répondues

### 8.6 Critères de validation

- [ ] Sur mobile, scrollabilité fluide entre les 3 sous-sections
- [ ] Touch targets respectés sur toutes les cards
- [ ] Test utilisateur : compréhension immédiate de l'enchaînement des 3 sous-sections
- [ ] Persistence en cas de retour arrière

---

## 9. Page Classe 3 : Type de véhicule

### 9.1 Informations techniques

**URL** : `/fr/trouver-ma-voiture/vehicule`
**Title tag** : "Étape 3/4 : Type de véhicule | CarPIQ"
**Indexation** : noindex

### 9.2 Structure mobile

```
Header progression : 75%
│
Question H1 (140px)
│ "Le type de véhicule"
│ Sous-titre : "Quelle silhouette et quelles options vous correspondent"
│
Sous-section 1 : Carrosserie (480px)
│ Label : "Quelle carrosserie recherchez-vous ?"
│ Grille 2×4 de cards avec silhouettes :
│ - Citadine
│ - Berline
│ - Break
│ - SUV urbain
│ - SUV familial
│ - Coupé
│ - Monospace
│ - Tous types
│
│ Sélection multiple possible (max 3)
│
Sous-section 2 : Modificateurs (200px) - Affichage conditionnel
│ Label : "Quelques préférences additionnelles ?"
│ Affiché uniquement si certaines carrosseries sélectionnées
│ Toggle options : 4 roues motrices, version break, etc.
│
Boutons navigation (80px)
│
Footer (100px)
```

### 9.3 Contenu textuel précis

**H1** : "Le type de véhicule"

**Sous-titre** : "Sélectionnez la silhouette ou les silhouettes qui correspondent à vos besoins."

**Sous-section 1 — Carrosserie** :
- Label : "Quelle carrosserie recherchez-vous ?"
- Description : "Sélectionnez 1 à 3 types qui vous correspondent."
- Cards avec illustrations silhouettes (utilise la bibliothèque archétypes) :
  - "Citadine" / "Pratique en ville"
  - "Berline" / "Confort polyvalent"
  - "Break" / "Espace pour les bagages"
  - "SUV urbain" / "Hauteur en ville"
  - "SUV familial" / "Famille et loisirs"
  - "Coupé sportif" / "Plaisir de conduite"
  - "Monospace" / "Famille nombreuse"
  - "Tous types" / "Je suis flexible"

**Sous-section 2 — Modificateurs** (affichage conditionnel) :
- Label : "Quelques préférences additionnelles ?"
- Description : "Optionnel, mais peut affiner nos recommandations"
- Toggles :
  - "4 roues motrices souhaitées"
  - "Version break privilégiée"
  - "Toit ouvrant"
  - "Coffre généreux prioritaire"

### 9.4 Critères de validation

- [ ] Au moins une carrosserie sélectionnée pour activer "Continuer"
- [ ] Limite à 3 sélections maximum avec feedback si tentative au-delà
- [ ] Affichage conditionnel des modificateurs fluide
- [ ] Test utilisateur : compréhension de la multi-sélection

---

## 10. Page Classe 4 : Contexte personnel

### 10.1 Informations techniques

**URL** : `/fr/trouver-ma-voiture/contexte`
**Title tag** : "Étape 4/4 : Contexte personnel | CarPIQ"
**Indexation** : noindex

### 10.2 Structure mobile

```
Header progression : 95%
│
Question H1 (140px)
│ "Votre contexte"
│ Sous-titre : "Quelques infos pour finaliser nos recommandations"
│
Sous-section 1 : Pays (220px)
│ Label : "Où habitez-vous ?"
│ Grille 2×4 ou liste de cards :
│ - Suisse
│ - France
│ - Allemagne
│ - Belgique
│ - Pays-Bas
│ - Italie
│ - Espagne
│
Sous-section 2 : Tranche d'âge (240px)
│ Label : "Votre tranche d'âge"
│ Description : "Information importante pour estimer l'assurance"
│ 4 cards verticales :
│ - Moins de 25 ans
│ - 25-40 ans
│ - 40-65 ans
│ - Plus de 65 ans
│
Boutons navigation (80px)
│ [Retour] [Voir mes résultats →]
│
Footer (100px)
```

### 10.3 Contenu textuel précis

**H1** : "Votre contexte"

**Sous-titre** : "Quelques informations pour finaliser des recommandations adaptées à votre situation."

**Sous-section 1 — Pays** :
- Label : "Où habitez-vous principalement ?"
- Description : "Détermine la fiscalité, les prix marchés et les modèles disponibles"
- Liste des 7 pays cibles avec drapeaux discrets

**Sous-section 2 — Tranche d'âge** :
- Label : "Votre tranche d'âge"
- Description : "Information utilisée uniquement pour estimer le coût d'assurance"
- Cards :
  - "Moins de 25 ans"
  - "25 à 40 ans"
  - "40 à 65 ans"
  - "Plus de 65 ans"

**Bouton primaire final** : "Voir mes résultats →" (au lieu de "Continuer" - signal de fin de parcours)

### 10.4 Interactions et états

- Sélection unique par sous-section
- Détection automatique du pays par géolocalisation si autorisée (avec confirmation)
- Au clic sur "Voir mes résultats" : transition animée vers la page de résultats avec calcul en cours

### 10.5 Critères de validation

- [ ] Les deux sous-sections doivent être répondues
- [ ] Géolocalisation optionnelle et explicite (RGPD)
- [ ] Test utilisateur : sentiment de finalisation imminente du parcours

---

## 11. Page de résultats personnalisés

### 11.1 Informations techniques

**URL** : `/fr/trouver-ma-voiture/resultats?session=xxx`
**Title tag** : "Votre meilleure option | CarPIQ"
**Indexation** : noindex (page personnelle)

### 11.2 Structure mobile (LA page critique)

```
Header minimal (50px)
│ Logo + Retour
│
Hero résultat (520px - quasi pleine page)
│ ┌─────────────────────────────────┐
│ │ Image bandeau résultats         │
│ │ (max-height 140px en background)│
│ │                                 │
│ │ "Votre meilleure option"        │
│ │                                 │
│ │ [Image véhicule grande format]  │
│ │                                 │
│ │ Nom véhicule (typo serif large) │
│ │ Sous-titre segment + âge        │
│ │                                 │
│ │ CHF 487 / mois (très grand)     │
│ │ "tout compris"                  │
│ │                                 │
│ │ [Bouton primaire] Voir détails →│
│ │ [Bouton secondaire] Autres opt. │
│ │ [Lien] Modifier critères        │
│ └─────────────────────────────────┘
│
Sections secondaires (accessibles au scroll)
│
Section actions rapides (120px)
│ [Ajouter au garage] [Comparer]
│
Section "Pourquoi ce choix" (accordion, 60px collapsé)
│
Section "Alternatives" (accordion → page dédiée)
│
Section "Méthodologie appliquée" (accordion)
│
Section "Modifier mes critères" (accordion)
│
Footer minimal (120px)
```

### 11.3 Structure desktop

```
Header (80px)
│
Hero résultat (60-70% viewport, environ 540px)
│ Layout 2 colonnes
│ Gauche (55%) : image véhicule grande + nom
│ Droite (45%) : chiffres + CTAs
│
Section secondaire (sous le hero)
│ Tabs : Détails / Alternatives / Méthodologie / Comparer
│ Contenu actif en pleine largeur
│
Section "Modifier critères" et footer
```

### 11.4 Contenu textuel précis

**Indicateur** : "Votre meilleure option"

**Nom véhicule** : exemple "Peugeot 308 Hybride"

**Sous-titre** : "Compacte · Occasion 2 ans"

**Chiffre principal** : "CHF 487 / mois"

**Légende** : "tout compris"

**Bouton primaire** : "Voir les détails →"
**Bouton secondaire** : "Voir d'autres options →"
**Lien tertiaire** : "Modifier mes critères"

**Action garage** : "🏠 Ajouter au garage"
**Action comparer** : "📊 Comparer avec autre"

**Accordions secondaires** :

"Pourquoi ce choix ?" : explication contextuelle des critères qui ont fait pencher la balance.

"Voir d'autres options" : lien vers page dédiée des alternatives (`/fr/trouver-ma-voiture/alternatives?session=xxx`).

"Méthodologie appliquée" : lien vers page méthodologie générale + résumé spécifique au cas.

"Modifier mes critères" : permet de revenir au questionnaire avec valeurs pré-remplies.

### 11.5 Interactions critiques

- Au clic sur "Voir les détails" : navigation vers la page véhicule individuelle correspondante
- Au clic sur "Voir d'autres options" : navigation vers page alternatives
- Au clic sur "Ajouter au garage" : si utilisateur non connecté, modal de connexion rapide ou option "Continuer en invité avec localStorage"
- Au clic sur "Comparer" : ajout au comparateur, ouverture interface comparaison

### 11.6 Critères de validation

- [ ] Au-dessus du fold mobile : nom véhicule + TCO + au moins un CTA visibles
- [ ] Au-dessus du fold desktop : tout le hero résultat visible
- [ ] Performance : LCP < 2.0s même pour utilisateurs en cours de session
- [ ] Test utilisateur : taux de clic vers détails > 50%
- [ ] Test utilisateur : compréhension immédiate du chiffre TCO

---

## 12. Page véhicule individuelle

### 12.1 Informations techniques

**URL** : `/fr/voiture/[brand-model-variant]` (exemple : `/fr/voiture/peugeot-308-hybride`)
**Title tag** : "TCO Peugeot 308 Hybride : coût mensuel complet | CarPIQ"
**Meta description** : "Analyse détaillée du coût mensuel de la Peugeot 308 Hybride. Prix, dépréciation, entretien, consommation. Multi-pays Europe."
**H1** : "Peugeot 308 Hybride"
**Indexation** : index, follow
**Schema.org** : `Product` complet avec prix, description, marque, image, offers

### 12.2 Structure mobile

```
Header (56px)
│
Page header (320px)
│ Image véhicule pleine largeur
│ Nom complet H1
│ Tags : Compacte · Hybride
│
Section chiffres clés (200px)
│ TCO mensuel (très grand)
│ Prix d'achat (chiffre secondaire)
│ Économie vs neuf si applicable
│
Section CTAs (100px)
│ [Ajouter au garage]
│ [Comparer avec autre]
│
Sections accordions (8-10 sections)
│ 1. Décomposition du TCO mensuel
│ 2. Caractéristiques techniques essentielles
│ 3. Dépréciation et revente
│ 4. Consommation et énergie
│ 5. Entretien et fiabilité
│ 6. Assurance estimée
│ 7. Fiscalité par pays
│ 8. Comparaisons concurrents
│ 9. Méthodologie appliquée
│ 10. Sources des données
│
Section éditoriale (400-600px)
│ 800+ mots de contenu unique sur le modèle
│ Pour SEO et valeur ajoutée utilisateur
│
Section "Véhicules similaires" (240px)
│ Carrousel horizontal de 3-5 véhicules
│
Footer (200px)
```

### 12.3 Structure desktop

```
Header (80px)
│
Page principale (layout 2 colonnes, full viewport)
│ Colonne gauche (sticky, 40% largeur)
│ - Image véhicule
│ - Chiffres clés
│ - CTAs principaux
│
│ Colonne droite (scrollable, 60% largeur)
│ - Section éditoriale (intro)
│ - Toutes les sections détaillées en pleine largeur
│ - Graphiques interactifs
│ - Comparaisons
│
Section "Véhicules similaires" (grille horizontale, pleine largeur)
│
Footer riche (240px)
```

### 12.4 Contenu textuel structuré

**H1** : "[Marque] [Modèle] [Variante]" (exemple "Peugeot 308 Hybride")

**Sous-titre** : "[Segment] · [Motorisation] · Analyse [Année]"

**Section chiffres clés** :
- "TCO mensuel : CHF [valeur]"
- "Prix d'achat : CHF [valeur]"
- Indicateur d'âge : "Neuf" ou "Occasion X ans"

**Sections accordions (contenu détaillé pour chacune)** :

**Décomposition TCO mensuel** :
"Le coût mensuel de [montant] se décompose ainsi :"
- Dépréciation : X% (CHF Y)
- Énergie : X% (CHF Y)
- Entretien : X% (CHF Y)
- Assurance : X% (CHF Y)
- Fiscalité : X% (CHF Y)

**Caractéristiques techniques** :
- Motorisation : [description]
- Puissance : X chevaux
- Consommation réelle : X L/100km (Spritmonitor) / X kWh/100km (BEV)
- Émissions CO2 : X g/km
- Autonomie (BEV) : X km

**Dépréciation et revente** :
"À l'achat neuf, ce véhicule conservera X% de sa valeur après 3 ans, X% après 5 ans, X% après 10 ans."
Graphique de la courbe de dépréciation.

[Sections similaires pour les autres composantes]

**Section éditoriale (généré ou édité)** :
"La Peugeot 308 Hybride représente une option intéressante pour les conducteurs européens cherchant un équilibre entre efficience énergétique et coût d'usage. Lancée en [année], elle s'inscrit dans la transition électromobile..."

[800+ mots de contenu unique avec analyse détaillée, recommandations selon profil utilisateur, comparaison contextuelle avec concurrentes]

### 12.5 Génération automatique du contenu

Pour scaler la production des 200-500 pages véhicules, utiliser un template structuré avec :
- Variables dynamiques tirées de la base de données (prix, consommation, etc.)
- Sections éditoriales générées par IA avec revue manuelle
- Contenu unique minimum 800 mots par page pour SEO

### 12.6 Critères de validation

- [ ] Schema.org Product valide
- [ ] Title et meta avec mots-clés véhicule
- [ ] Contenu unique > 800 mots
- [ ] Au moins 3 H2 et plusieurs H3
- [ ] Images optimisées avec alt text descriptif
- [ ] Indexation Google Search Console
- [ ] Performance Lighthouse > 90 mobile

---

## 13. Page comparaison de véhicules

### 13.1 Informations techniques

**URL** : `/fr/comparer/[brand-model-1]-vs-[brand-model-2]` (exemple : `/fr/comparer/peugeot-308-vs-renault-megane`)
**Title tag** : "[Modèle 1] vs [Modèle 2] : comparatif TCO 2026 | CarPIQ"
**Meta description** : "Comparatif détaillé [Modèle 1] vs [Modèle 2] : coût mensuel, autonomie, fiabilité. Analyse impartiale CarPIQ."
**H1** : "[Modèle 1] vs [Modèle 2] : comparatif complet"
**Indexation** : index, follow (pour les comparaisons populaires)

### 13.2 Structure mobile

```
Header (56px)
│
Hero comparaison (320px)
│ Titre H1
│ Image véhicule 1 et véhicule 2
│ Indicateurs vainqueur par catégorie
│
Tableau comparatif principal (600px)
│ Comparaison TCO mensuel
│ Comparaison prix d'achat
│ Comparaison consommation
│ Comparaison fiabilité
│ Comparaison équipements
│
Sections détaillées (accordions)
│ - TCO détaillé véhicule 1
│ - TCO détaillé véhicule 2
│ - Différences techniques
│ - Forces et faiblesses
│
Section "Notre recommandation"
│ Selon profil utilisateur
│
Section "Voir aussi" : autres comparaisons populaires
│
Footer (200px)
```

### 13.3 Structure desktop

```
Header (80px)
│
Hero comparaison (400px)
│ Layout 3 colonnes : véhicule 1 | VS | véhicule 2
│
Tableau comparatif détaillé (700px)
│ Layout 2 colonnes côte à côte
│ Toutes les caractéristiques alignées
│
Sections détaillées (pleine largeur)
│
Footer riche (240px)
```

---

## 14-19. Pages Guide-moi (5 pages)

Les pages Guide-moi suivent la structure du parcours principal mais avec :
- Architecture mobile-first plus marquée
- Illustrations contextuelles pour chaque étape
- Questions plus subjectives et émotionnelles
- Page finale de révélation du profil

Détails spécifiques :

**Page 14 — `/fr/guide-me`** : démarrage similaire à `/fr/trouver-ma-voiture` mais positionnement émotionnel "Découvrez la voiture qui vous ressemble".

**Page 15 — `/fr/guide-me/etape-1`** : "Votre quotidien" avec illustration scène de vie quotidienne.

**Page 16 — `/fr/guide-me/etape-2`** : sélection visuelle des 6 archétypes véhicules avec silhouettes Sportif, Élégant, Moderne, Robuste, Épuré, Familial. Sélection 2-3 silhouettes.

**Page 17 — `/fr/guide-me/etape-3`** : "Vos trajets" avec illustration cartographie.

**Page 18 — `/fr/guide-me/etape-4`** : "Vos valeurs et priorités" avec illustration personnage et icônes.

**Page 19 — `/fr/guide-me/profil`** : révélation du profil avec illustration véhicule + critères correspondants. CTA vers parcours principal avec critères pré-remplis.

---

## 20. Page garage virtuel

### 20.1 Informations techniques

**URL** : `/fr/garage`
**Title tag** : "Mon garage CarPIQ"
**Indexation** : noindex (page utilisateur)
**Authentification** : requise

### 20.2 Structure mobile

```
Header (56px)
│
Hero garage (240px)
│ Image illustration garage
│ Titre "Mon garage"
│ Sous-titre avec nombre de véhicules
│
Section véhicules sauvegardés (variable)
│ Liste de cards verticales
│ Chaque card : image, nom, TCO, actions
│
Section vide si pas de véhicules
│ "Vous n'avez pas encore ajouté de véhicule"
│ [CTA] Démarrer une recherche
│
Section "Comparaison rapide"
│ Si 2+ véhicules dans garage, bouton "Comparer ces véhicules"
│
Footer
```

### 20.3 Contenu textuel

**H1** : "Mon garage"

**Sous-titre** : "Vos véhicules sauvegardés et leurs analyses détaillées"

**État vide** : "Vous n'avez pas encore ajouté de véhicule à votre garage. Démarrez une analyse pour découvrir des recommandations personnalisées."

[CTA] "Commencer une analyse →"

**Actions par véhicule** :
- Voir l'analyse détaillée
- Comparer avec un autre véhicule du garage
- Supprimer du garage

---

## 21. Page compte utilisateur

Structure simple avec sections compte (email, mot de passe), préférences (langue, pays par défaut), historique des recherches, et données personnelles (RGPD - export, suppression).

Page accessible uniquement aux utilisateurs authentifiés, noindex.

---

## 22. Pages catégoriques

Pages pivots qui rassemblent les véhicules d'un même segment ou d'une même marque.

**URL exemples** :
- `/fr/segment/berline`
- `/fr/segment/suv-familial`
- `/fr/marque/peugeot`
- `/fr/marque/tesla`

**Structure** :
- Hero présentant le segment/marque
- Filtres applicables (prix, motorisation)
- Liste des véhicules avec preview
- Section éditoriale sur le segment
- Liens vers les pages véhicules individuelles

Excellent SEO sur les requêtes "meilleure berline 2026" ou "comparatif Peugeot".

---

## 23. Pages guides éditoriaux

**URL exemples** :
- `/fr/guide-achat/berline-25000-chf`
- `/fr/guide-achat/voiture-electrique-suisse`
- `/fr/guide-achat/premiere-voiture`

Structure éditoriale classique : H1, sections H2, contenu approfondi 1500+ mots, recommandations véhicules en bas de page avec liens vers pages dédiées.

Production manuelle ou semi-automatique avec IA + revue éditoriale.

---

## 24. Page Observatoire CarPIQ

**URL** : `/fr/observatoire`

Page de présentation de l'Observatoire trimestriel mentionné dans le GTM v2.0. Structure :
- Hero présentant l'observatoire
- Dernier rapport en preview avec téléchargement
- Archive des rapports précédents
- Méthodologie observatoire
- CTA "Recevoir le prochain rapport"

URL des rapports individuels : `/fr/observatoire/q3-2026`, etc.

---

## Conclusion de l'annexe A

Cette annexe couvre les 24 pages principales de CarPIQ V2 avec un niveau de détail opérationnel suffisant pour démarrer l'implémentation.

Pour chaque page, le développeur dispose de :
- Informations techniques (URL, SEO)
- Structures mobile et desktop détaillées
- Composants à utiliser
- Contenu textuel précis
- Interactions et états
- Critères de validation

Les annexes B (patterns d'implémentation), C (migration code existant), et D (design system) compléteront cette référence opérationnelle. Elles seront produites au début de leurs phases respectives quand le contexte technique sera plus précis.

---

*Document produit le 26 mai 2026. Annexe A de la spec V2 consolidée CarPIQ. À utiliser comme référence opérationnelle page par page pendant l'implémentation V2.*
