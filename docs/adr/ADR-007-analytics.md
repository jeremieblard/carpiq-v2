# ADR-007 — Analytics : Mixpanel (events produit) + Plausible (analytics agrégées RGPD)

**Statut** : Accepté
**Date** : 2026-05-26
**Décideurs** : Jérémie Blard

## Contexte

V1 utilise déjà Mixpanel pour les events produit. La spec V2 recommande d'ajouter Plausible pour les analytics agrégées respectueuses RGPD. Faut-il en ajouter d'autres (PostHog, Google Analytics, etc.) ?

## Options considérées

- **Mixpanel seul** : continuité avec V1, pas de nouveau coût.
- **Mixpanel + Plausible** : events produit + analytics agrégées RGPD-compliant.
- **PostHog** : remplace Mixpanel, ajoute session replay et feature flags. ~150€/mois.
- **Combinaison riche (Mixpanel + Plausible + PostHog)** : exhaustif mais cher et lourd à analyser.

## Décision

**Mixpanel (events produit) + Plausible (analytics anonymes RGPD)**.

## Conséquences

**Positives** :
- Mixpanel déjà intégré V1 → continuité des events, pas de rupture dans la timeline d'analyse
- Plausible offre un dashboard agrégé simple et RGPD-compliant par défaut (pas de cookies, pas de bannière obligatoire)
- Coût modeste : Mixpanel gratuit jusqu'à 100K events/mois, Plausible 9$/mois en early stage

**Négatives** :
- Pas de session replay pour comprendre les abandons spécifiques (peut être ajouté plus tard via PostHog si besoin)
- 2 outils à maintenir au lieu d'1

## Détails d'implémentation

**Mixpanel** :
- Réutilisation du compte V1
- Events à conserver (continuité avec V1) :
  - `intro_shown`, `cta_find_future_clicked`, `cta_analyze_current_clicked`
  - `step_started`, `step_completed`, `question_answered`
  - `results_shown`, `vehicle_clicked`, `add_to_garage`
  - `compare_initiated`, `compare_completed`
  - `select_lang`, `select_country`
- Events à ajouter en V2 :
  - `archetype_revealed` (Guide-moi Phase 5)
  - `comparison_page_viewed` (Phase 6)
  - `vehicle_page_viewed` avec slug du véhicule (Phase 4)
- Script : chargement via `<script async>` sur les pages où Mixpanel est utilisé (lazy load pour ne pas pénaliser Lighthouse)

**Plausible** :
- Nouveau compte à créer
- Domaine : `carpiq.eu` puis `v2.carpiq.eu` en staging
- Tag : `<script defer data-domain="carpiq.eu" src="https://plausible.io/js/script.js">`
- Dashboard accessible à `https://plausible.io/carpiq.eu`
- Goals à configurer : conversions sur "questionnaire completed", "garage created"

**Sentry** (déjà mentionné en Phase 1) :
- Monitoring d'erreurs JavaScript
- Free tier suffisant en early stage (5K errors/mois)
- Configuration minimale dès Phase 1 pour éviter les bugs silencieux

## Mitigation des risques

- Si Mixpanel dépasse 100K events/mois (cible : >500 utilisateurs actifs quotidiens), passer au plan Growth (~50$/mois) ou évaluer PostHog
- Bannière de consentement légère pour conformité RGPD (Plausible nativement compliant mais Mixpanel nécessite consentement pour certains usages)

## Notes

- Documentation Mixpanel : https://developer.mixpanel.com
- Documentation Plausible : https://plausible.io/docs
- Documentation Sentry : https://docs.sentry.io
- RGPD et analytics : https://www.cnil.fr/fr/cookies-et-traceurs-comment-mettre-mon-site-web-en-conformite
