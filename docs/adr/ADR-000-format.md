# ADR-000 — Format des Architecture Decision Records

**Statut** : Accepté
**Date** : 2026-05-26
**Décideurs** : Jérémie Blard

## Contexte

Pour la refonte CarPIQ V2 (durée prévue : 6-8 mois), de nombreuses décisions techniques structurantes vont être prises. Sans documentation systématique, il devient impossible de reconstituer pourquoi tel choix a été fait il y a 4 mois. Les ADR (Architecture Decision Records) sont la pratique standard pour résoudre ce problème.

## Décision

Toute décision techniquement structurante est documentée dans un fichier `docs/adr/ADR-NNN-titre.md` numéroté séquentiellement.

Le format suit le template MADR allégé :

```
# ADR-NNN — Titre

**Statut** : Proposé | Accepté | Déprécié | Remplacé par ADR-XXX
**Date** : YYYY-MM-DD
**Décideurs** : Noms

## Contexte
Pourquoi cette décision se pose. Quels sont les contraintes et les forces en jeu.

## Options considérées
- Option A : ...
- Option B : ...
- Option C : ...

## Décision
Quelle option a été retenue, en 1-3 phrases.

## Conséquences
Ce que cela implique positivement et négativement. Ce qui devient possible, ce qui devient plus difficile.

## Notes / Liens
Références externes, discussions, benchmarks.
```

## Conséquences

**Positives** :
- Trace écrite de chaque décision majeure, retrouvable dans le repo Git
- Onboarding facilité pour un futur développeur
- Discussion structurée plutôt qu'oral

**Négatives** :
- Léger surcoût de documentation à chaque décision (15-20 minutes par ADR)
- Risque de sur-documenter des décisions triviales — à éviter en limitant l'usage aux choix structurants

## Critère de déclenchement

Un ADR est requis si au moins un de ces critères est vrai :
- La décision est difficile à défaire après 2 semaines
- La décision impacte la structure de plus de 3 fichiers
- La décision nécessite un consensus entre plusieurs personnes
- La décision pose un trade-off non-évident

Pour les décisions tactiques courantes (renommer une variable, ajouter un test, etc.), pas d'ADR.
