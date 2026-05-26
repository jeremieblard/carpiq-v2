# ADR-003 — Design system : conservation des tokens, refonte des composants

**Statut** : Accepté
**Date** : 2026-05-26
**Décideurs** : Jérémie Blard

## Contexte

La V1 utilise un design system identifiable :
- Palette teal pétrole (#0F6E56) + amber chaud (#BA7517)
- Typographies Playfair Display (titres) + DM Sans (corps)
- Hierarchy : ink (#1A1A1A) > muted (#6B7280) > faint (#9CA3AF)

La spec V2 vise un niveau d'exécution comparable à Apple Store / Stripe / Linear. La question : faut-il aussi refondre les tokens visuels, ou seulement l'exécution (composants, micro-interactions, spacings) ?

## Options considérées

- **Conservation tokens, refonte composants** : on garde palette + typo + base sémantique, on refait tout le reste.
- **Refonte partielle** : on retravaille soit la palette soit la typo.
- **Refonte complète** : nouveau design system from scratch.

## Décision

**Conservation des design tokens existants, refonte intégrale des composants et de l'exécution**.

Les tokens visuels actuels (palette teal/amber, Playfair + DM Sans) sont **bons** et **différenciants** dans le marché des comparateurs automobiles (tous bleu/gris). Le problème de V1 n'est PAS les tokens, c'est :
- Hiérarchie d'information faible
- Spacings incohérents entre les écrans
- Composants visuellement médiocres (boutons, cards, options)
- Absence de micro-interactions raffinées
- Densité informationnelle excessive

C'est l'**exécution** qui distingue Stripe/Linear de la moyenne, pas la quantité de couleurs.

## Conséquences

**Positives** :
- Identité de marque préservée — les utilisateurs V1 ne sont pas dépaysés
- Économie d'énergie créative pour se concentrer sur les vrais problèmes (exécution)
- Pas de risque de "refonte cosmétique" qui ne résout rien sur le fond

**Négatives** :
- Si à terme on veut un repositionnement marketing (par exemple vers un public plus premium B2B/OEM), une nouvelle palette pourrait être justifiée. Pas le problème immédiat.

## Détails d'application

**Tokens conservés intégralement** :
- Couleurs : teal #0F6E56, amber #BA7517, ink #1A1A1A, muted #6B7280, faint #9CA3AF, border #E5E7EB, bg #FAFAF9, card #FFFFFF
- Typographies : Playfair Display (display), DM Sans (body)

**Tokens à définir précisément en Phase 1** (pas encore stabilisés en V1) :
- Échelle typographique (font sizes en rem, line heights)
- Échelle d'espacement (spacing scale 0.5/1/1.5/2/3/4/6/8/12 rem)
- Échelle de rayons (border-radius)
- Échelle d'ombres (box-shadows)
- Tokens d'animation (durations, easings)
- Couleurs sémantiques additionnelles : teal-pale, amber-pale, success-green, warning-amber, error-red

**Composants à refaire intégralement** : tous. Aucun composant V1 n'est porté tel quel.

## Notes

- Référence d'exécution : https://stripe.com (qualité Stripe Atlas et docs)
- Référence d'exécution : https://linear.app (qualité interactions et anim)
- Référence d'exécution : https://www.apple.com/shop/ (qualité produit + sobriété)
