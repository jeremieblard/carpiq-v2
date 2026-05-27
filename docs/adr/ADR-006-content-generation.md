# ADR-006 — Génération du contenu éditorial : IA assistée + revue manuelle avec garde-fous

**Statut** : Accepté
**Date** : 2026-05-26
**Décideurs** : Jérémie Blard

## Contexte

L'architecture multi-pages V2 cible 300-800 pages indexables :
- 200-500 pages véhicules avec contenu unique
- 30-80 pages guides éditoriaux
- 50-200 pages comparaisons

Google pénalise le contenu généré automatiquement de faible qualité (mise à jour "Helpful Content Update"). Mais produire manuellement 500 pages de qualité représente 8-16h/semaine pendant 12-18 mois, irréaliste pour un solo founder.

## Options considérées

- **Production manuelle complète** : 8-16h/semaine de rédaction par le fondateur. Insoutenable sur 500 pages.
- **Recrutement éditeur senior automobile** : 60-80 K€/an. Justifié seulement si SEO démarre fort.
- **Génération assistée IA + revue manuelle systématique** : Claude/GPT pour le brouillon, humain pour la validation/édition.

## Décision

**Génération assistée IA (Claude API) + revue manuelle systématique, scaling par paliers validés**.

## Conséquences

**Positives** :
- Permet d'atteindre 200-500 pages en quelques semaines au lieu de mois
- Coût Claude API très inférieur à un recrutement éditeur (estimation : 200-500 € pour 500 pages)
- Itération rapide sur les templates et la qualité

**Négatives** :
- Risque de classement Google "spam" si la qualité n'est pas au rendez-vous
- Demande discipline de revue manuelle (sans skipper)
- Difficulté à scaler la revue manuelle au-delà de 100-200 pages par mois pour une seule personne

## Garde-fous obligatoires

Ces règles sont **non-négociables** et conditionnent l'usage de la génération IA :

**Règle 1 — Revue manuelle systématique** : aucune page générée n'est publiée sans revue humaine. La revue valide : pertinence, fluidité, absence d'erreurs factuelles, ton aligné CarPIQ.

**Règle 2 — Scaling par paliers validés** :
- Palier 1 : 10-20 pages prototypes. Validation conjointe Jérémie + Claude sur la qualité.
- Palier 2 (si palier 1 validé) : passer à 50 pages. Monitoring Google Search Console pendant 30 jours.
- Palier 3 (si palier 2 validé) : passer à 100 pages.
- Palier 4 (si palier 3 validé) : passer à 200 pages.
- Palier 5 (si palier 4 validé et trafic organique mesurable) : passer à 500 pages.

Aucun palier ne déclenche le suivant automatiquement.

**Règle 3 — Mesure du contenu dupliqué** : à chaque palier, vérification via Copyscape (ou équivalent) qu'aucune page ne duplique du contenu existant sur le web.

**Règle 4 — Mesure de qualité éditoriale** : Lighthouse SEO 100, validation Google Rich Results Test (Schema.org `Product`), longueur > 800 mots utiles par page véhicule.

**Règle 5 — Plan B documenté** : si Google pénalise (chute de trafic > 30% sur Search Console), retrait immédiat des pages les plus faibles et passage au palier précédent.

## Structure du pipeline de génération

**Étape 1** : extraction des données structurées du catalogue Supabase (nom, prix, consommation, dépréciation, etc.).

**Étape 2** : appel Claude API avec :
- Template de prompt structuré (intro, section TCO, section dépréciation, section comparaison, conclusion)
- Données du véhicule
- Contraintes éditoriales (ton, longueur, mots-clés)

**Étape 3** : génération du brouillon stocké dans `src/content/vehicules/[slug]/draft.md`.

**Étape 4** : revue manuelle dans une UI dédiée. Validation → déplacement vers `src/content/vehicules/[slug]/published.md` et indexation.

**Étape 5** : monitoring trimestriel : si une page n'attire aucun trafic après 6 mois et a une faible qualité éditoriale, candidat à la suppression.

## Notes

- Documentation Google Helpful Content : https://developers.google.com/search/blog/2022/08/helpful-content-update
- Documentation Claude API : https://docs.anthropic.com
- Outil Copyscape : https://www.copyscape.com (pour la vérification de duplicate content)
