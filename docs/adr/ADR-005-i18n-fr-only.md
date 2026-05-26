# ADR-005 — Internationalization : démarrage FR uniquement Phase 1-3

**Statut** : Accepté
**Date** : 2026-05-26
**Décideurs** : Jérémie Blard

## Contexte

V1 supporte 7 langues (FR, EN, DE, NL, ES, IT, PT) avec une qualité hétérogène. La spec V2 cible également 7 langues à terme. La question : faut-il démarrer V2 multilingue ou monolingue ?

L'i18n est un facteur de complexité énorme qui touche tous les composants, toutes les pages, tous les contenus. Mal géré dès le départ, il devient un cauchemar de dette technique.

## Options considérées

- **FR uniquement Phase 1-3, EN Phase 4, autres ensuite** : démarrage rapide, focus exclusif sur la qualité.
- **FR + EN dès Phase 1** : double effort dès le début, mais infrastructure i18n validée plus tôt.
- **6-7 langues dès le départ** : reproduit V1 en plus rigoureux. Très coûteux.

## Décision

**FR uniquement pour les Phases 1-3. EN ajouté en Phase 4. Autres langues après validation de traction.**

## Conséquences

**Positives** :
- Concentration totale sur la qualité d'exécution pendant Phase 1-3 (4-5 mois)
- Pas de duplication de contenu à maintenir pendant la période de design intensif
- Architecture i18n d'Astro intégrée dès Phase 1 (mais utilisée uniquement pour FR) — donc prête à accueillir EN sans refactoring
- Pas de traduction de 500 pages véhicules dans 7 langues avant validation que le concept fonctionne

**Négatives** :
- Les utilisateurs anglophones de V1 n'auront pas de version V2 pendant 4-5 mois (à mitiger : V1 reste en prod pour eux)
- Cas de figure imprévus en mode multilingue pourraient ne être découverts qu'en Phase 4

## Détails d'application

**En Phase 1** :
- Configuration Astro i18n native avec FR comme seule langue active
- Préfixe URL `/fr/` activé dès le départ (pas de racine `/` ambiguë)
- Structure de contenu prête pour multilingue (`src/content/fr/`, `src/content/en/` etc., mais `en/` vide pour l'instant)
- Système `t()` ou équivalent fonctionnel mais n'utilisant qu'un seul dictionnaire FR

**En Phase 4** :
- Activation de EN
- Traduction professionnelle (ou très soignée) des pages institutionnelles (10-15 pages)
- Génération automatique des pages véhicules EN à partir des templates + données catalogue (les chiffres sont les mêmes, seuls les labels changent)
- Ajout de hreflang tags FR ↔ EN

**Après Phase 6** :
- Ajout DE puis NL si traction marché Suisse / Belgique / Pays-Bas démontrée
- ES, IT, PT en dernier selon priorités business

## Mitigation des risques

- Pendant les Phases 1-3, V1 multilingue reste en prod accessible aux utilisateurs non-francophones
- Architecture i18n d'Astro testée avec un mini-fichier EN (1-2 strings) dès Phase 2 pour valider que le système fonctionne, sans investir dans la traduction massive
- Un audit i18n est planifié en début de Phase 4 pour identifier toute string hardcodée FR qui devrait être passée dans le système i18n

## Notes

- Documentation Astro i18n : https://docs.astro.build/en/guides/internationalization/
- Outil de traduction recommandé pour la Phase 4 : DeepL Pro ou agence spécialisée tech
