# CarPIQ V1 - Inventaire de la logique metier extractible

**Fichier analyse** : `v1_snapshot.html`
**Taille du HTML** : 925,141 bytes
**Taille du script principal** : 837,536 bytes
**Analyse le** : 2026-05-27T09:06:20.890854+00:00

## Synthese

- **Fonctions identifiees** : 88
- **LOC estimees totales** : 22,595

## Detail par categorie

### Systeme de filtres et de recommandations

- **Fonctions** : 8
- **LOC estimees** : 9,585

| Fonction / Variable | Position | LOC estimees |
|---|---:|---:|
| `incForCar` | 214,512 | 2 |
| `getBodySegs` | 508,182 | 19 |
| `wantsAWD` | 508,962 | 1 |
| `carHasAWD` | 509,021 | 7 |
| `rankVehiclesByTCO` | 515,281 | 10 |
| `scorePt` | 535,447 | 34 |
| `bestPt` | 536,830 | 13 |
| `getRec` | 544,872 | 9499 |

### Garage virtuel et comparateur

- **Fonctions** : 14
- **LOC estimees** : 8,520

| Fonction / Variable | Position | LOC estimees |
|---|---:|---:|
| `renderCompareSelection` | 222,226 | 72 |
| `renderCompareView` | 225,107 | 73 |
| `_renderCompareSection1` | 229,654 | 39 |
| `_renderCompareSection2` | 231,241 | 47 |
| `_renderCompareSection3` | 233,128 | 59 |
| `_renderCompareSection6` | 235,508 | 54 |
| `_renderCompareSection4` | 239,029 | 62 |
| `_renderCompareSection5` | 241,537 | 59 |
| `_renderCompareSection7` | 244,294 | 7631 |
| `renderGarageModal` | 806,646 | 25 |
| `renderGarageList` | 807,950 | 33 |
| `renderGarageForm` | 811,848 | 129 |
| `saveGarageForm` | 820,010 | 58 |
| `renderGarageDetail` | 822,355 | 179 |

### Fonctions de rendu UI questionnaire (a refaire en composants Astro)

- **Fonctions** : 40
- **LOC estimees** : 4,349

> Ces fonctions sont liees a la presentation actuelle. On garde la LOGIQUE qu'elles encapsulent (calculs intermediaires, etat) mais on refait le rendering en composants Astro.

| Fonction / Variable | Position | LOC estimees |
|---|---:|---:|
| `renderCountryBtns` | 146,146 | 6 |
| `showGarageToast` | 220,245 | 1 |
| `renderCompareSelection` | 222,226 | 72 |
| `renderCompareView` | 225,107 | 73 |
| `renderSaveBanner` | 245,961 | 1 |
| `showResumeBanner` | 570,865 | 61 |
| `renderCurve` | 574,778 | 150 |
| `render` | 582,971 | 22 |
| `renderIntro` | 587,425 | 57 |
| `renderQ` | 590,441 | 8 |
| `renderGuidedStep` | 628,824 | 4 |
| `renderGuidedResult` | 631,608 | 41 |
| `renderBudget` | 633,251 | 1 |
| `renderPref` | 633,295 | 188 |
| `renderKmTripsCharge` | 645,576 | 136 |
| `renderBudgetKmTrips` | 651,041 | 1 |
| `renderCharging` | 651,276 | 26 |
| `renderBody` | 652,324 | 177 |
| `renderLocAge` | 659,410 | 97 |
| `renderSelectedCarKpi` | 671,666 | 150 |
| `renderCustomCompare` | 684,558 | 239 |
| `renderSelectedCarKPI` | 694,153 | 399 |
| `renderRefinePanelBody` | 730,671 | 133 |
| `renderRefinePanelHTML` | 735,999 | 11 |
| `renderResults` | 736,445 | 1053 |
| `renderMobileTabs` | 788,424 | 33 |
| `showEmailCapture` | 791,155 | 1 |
| `renderDepreciationChartSvg` | 792,153 | 82 |
| `renderGarageModal` | 806,646 | 25 |
| `renderGarageList` | 807,950 | 33 |
| _... et 10 autres entries (voir JSON brut)_ | | |

### Algorithme TCO et calculs de cout

- **Fonctions** : 16
- **LOC estimees** : 93

| Fonction / Variable | Position | LOC estimees |
|---|---:|---:|
| `home` | 147,406 | 1 |
| `phevChargeFactor` | 147,474 | 2 |
| `insMod` | 159,134 | 1 |
| `getFP` | 190,804 | 1 |
| `getEP` | 190,847 | 1 |
| `getEPU` | 190,890 | 1 |
| `wltpMult` | 191,612 | 7 |
| `repairCost` | 212,425 | 9 |
| `annualMaint` | 212,859 | 4 |
| `fp` | 213,086 | 1 |
| `bevWinterPen` | 213,156 | 1 |
| `urbanMod` | 213,209 | 2 |
| `fuelCost` | 213,322 | 19 |
| `calcTCO` | 214,626 | 11 |
| `purchAtAgeStatic` | 248,811 | 3 |
| `purchAtAge` | 252,867 | 29 |

### Systeme d'internationalisation

- **Fonctions** : 2
- **LOC estimees** : 26

| Fonction / Variable | Position | LOC estimees |
|---|---:|---:|
| `lang="fr"` | 144,699 | - |
| `t` | 145,641 | 1 |
| `setLang` | 146,401 | 25 |
| `const labels=` | 660,813 | - |

### Gestion multi-pays et devises

- **Fonctions** : 8
- **LOC estimees** : 22

| Fonction / Variable | Position | LOC estimees |
|---|---:|---:|
| `setCountry` | 145,774 | 9 |
| `COUNTRY_ENERGY` | 145,804 | - |
| `activeCountry` | 145,835 | - |
| `renderCountryBtns` | 146,146 | 6 |
| `activeCountry` | 146,242 | - |
| `COUNTRY_ENERGY` | 146,269 | - |
| `activeCountry` | 146,384 | - |
| `activeCountry` | 153,226 | - |
| `activeCountry` | 158,734 | - |
| `activeCountry` | 159,014 | - |
| `activeCountry` | 176,057 | - |
| `COUNTRY_ENERGY` | 187,392 | - |
| `activeCountry` | 189,951 | - |
| `COUNTRY_ENERGY` | 190,347 | - |
| `COUNTRY_ENERGY` | 190,682 | - |
| `COUNTRY_ENERGY` | 190,755 | - |
| `activeCountry` | 190,770 | - |
| `COUNTRY_ENERGY` | 190,786 | - |
| `getCountryCO2` | 190,935 | 1 |
| `getCountryBonusBEV` | 190,988 | 1 |
| `getCountryBonusPHEV` | 191,054 | 1 |
| `getCountryFlag` | 191,122 | 1 |
| `getCountryLang` | 191,181 | 1 |
| `activeCountry` | 217,662 | - |
| `activeCountry` | 217,676 | - |
| `activeCountry` | 246,854 | - |
| `activeCountry` | 246,868 | - |
| `activeCountry` | 247,402 | - |
| `activeCountry` | 247,416 | - |
| `activeCountry` | 247,471 | - |
| _... et 63 autres entries (voir JSON brut)_ | | |

### Tracking et analytics

- **Fonctions** : 0
- **LOC estimees** : 0

| Fonction / Variable | Position | LOC estimees |
|---|---:|---:|
| `mixpanel.` | 518,575 | - |
| `mixpanel.` | 518,590 | - |

### Persistance locale (localStorage, sessionStorage)

- **Fonctions** : 0
- **LOC estimees** : 0

| Fonction / Variable | Position | LOC estimees |
|---|---:|---:|
| `localStorage.` | 215,492 | - |
| `localStorage.` | 215,643 | - |
| `localStorage.` | 244,023 | - |
| `localStorage.` | 244,223 | - |
| `localStorage.` | 250,230 | - |
| `localStorage.` | 570,338 | - |
| `localStorage.` | 570,439 | - |
| `localStorage.` | 570,631 | - |
| `localStorage.` | 862,813 | - |
| `localStorage.` | 862,996 | - |
| `localStorage.` | 868,768 | - |
| `localStorage.` | 868,869 | - |
| `localStorage.` | 868,959 | - |
| `localStorage.` | 900,895 | - |
| `localStorage.` | 900,974 | - |
| `sessionStorage.` | 901,236 | - |
| `sessionStorage.` | 901,391 | - |
| `sessionStorage.` | 901,539 | - |

### Chargement de donnees externes

- **Fonctions** : 0
- **LOC estimees** : 0

| Fonction / Variable | Position | LOC estimees |
|---|---:|---:|
| `fetch(` | 87,480 | - |
| `.json()` | 87,594 | - |
| `fetch(` | 96,078 | - |
| `.json()` | 96,197 | - |
| `fetch(` | 96,658 | - |
| `.json()` | 96,742 | - |
| `fetch(` | 96,941 | - |
| `.json()` | 97,026 | - |
| `fetch(` | 250,595 | - |
| `.json()` | 250,710 | - |
| `fetch(` | 258,536 | - |
| `.json()` | 258,644 | - |
| `fetch(` | 573,474 | - |
| `fetch(` | 791,639 | - |
| `fetch(` | 905,290 | - |

### Constantes du modele TCO (DEPR, WLTP, CONS, KMM, etc.)

- **Fonctions** : 0
- **LOC estimees** : 0

| Fonction / Variable | Position | LOC estimees |
|---|---:|---:|
| `const CONS=` | 191,330 | - |
| `const DEPR=` | 191,904 | - |
| `const BPROB=` | 192,580 | - |
| `const MAINT_MULT=` | 213,021 | - |
| `const KMM=` | 215,340 | - |

## Prochaines etapes recommandees

1. **Extraction prioritaire** : `tco_engine` et `recommendations` (coeur de la valeur produit)
2. **Extraction critique** : `i18n` (systeme reutilise partout)
3. **Extraction secondaire** : `garage_compare`, `analytics`, `storage`
4. **A refaire from scratch** : tout ce qui est dans `questionnaire_render` (presentation a reconcevoir)
