# Stratégie test runner Palier 2

**Date** : 27 mai 2026
**Statut** : test 96/96 vert validé en sandbox Python

## Découverte

La baseline `baseline_expected.json` a été snapshotée le 27 mai 2026 à 08:59 UTC
sur la prod V1 (v64.0.4) avec `activeCountry = "ch"` au moment du snapshot
(visible dans `metadata.snapshot.activeCountry`).

V1 auto-détecte le pays via la timezone du navigateur (cf. v64.0.4 ligne 10605
environ). Le runner s'est exécuté depuis Genève → timezone `Europe/Zurich` →
`activeCountry = "ch"`.

**Le runner V1 n'a jamais modifié `activeCountry` entre les cas**. Le champ
`active_country` présent dans chaque `inputs` est du folklore non appliqué.
Tous les 96 cas ont été calculés avec les prix énergie CH (`fp=1.93 €/L`,
`ep=0.225 €/kWh`, `epu=0.5 €/kWh`).

## Implications pour le test runner V2

Le runner V2 (`tests/unit/tco-engine.test.ts`) :

1. **Lit `metadata.snapshot.activeCountry`** = `"ch"`
2. **Force `country: "ch"`** pour les 96 cas (ignore `inputs.active_country`)
3. **Force `urban: null`** car le snapshot V1 avait `st.urban = false` (booléen),
   et le code v64.0.4 teste `=== "city"` (string) → jamais matché
4. **Force `dept: null`** et **`driverAge: null`** car ces champs n'ont jamais
   été positionnés par le runner

## Code de production V2 inchangé

Le code de `calcTco`, `fuelCost`, etc. supporte correctement le vocabulaire
complet (`country` réel pour les 9 pays, `urban: "city"|"rural"|null`,
`driverAge: AgeRange`). C'est juste le test qui normalise les inputs vers
le comportement effectif du runner V1.

## Validation sandbox

Test Python reproduisant la logique V2 exécuté contre les 96 cas baseline :
**96/96 verts**. Aucune divergence sur `purchP`, `saleP`, `depr5`, `yf`,
`maint`, `rep`, `mo`, `risk`.

Détails de l'implémentation correcte :
- `Math.round` JS (half-away-from-zero, pas banker's rounding)
- `Math.round(93.75) = 94` appliqué AVANT addition dans `repairCost.fapRisk`
- `fp() = FP_BASE = 1.72` constant (anomalie A1 conservée pour reproductibilité)
- `bevWinterPen` utilise `DD_DEF.wp = 15%` quand `dept` est null

## Suite

Une fois Palier 2 mergé :
- Le test runner reste valide tant que la prod V1 ne change pas
- Si re-snapshot futur depuis une nouvelle prod, mettre à jour
  `metadata.snapshot.activeCountry` et le runner s'adaptera automatiquement
- Le code V2 est prêt à être consommé par le Palier 3 (recommend, getRec)

---

*Note jointe à la PR Palier 2.*
