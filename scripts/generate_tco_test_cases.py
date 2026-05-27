"""
CarPIQ V1 — Génération de la suite de tests TCO baseline
========================================================

Génère un jeu structuré de cas de test pour snapshotter le comportement
de l'algorithme TCO V1. Ces snapshots seront utilisés pour valider que
l'algorithme V2 (`tco-engine.ts`) produit les mêmes outputs.

Méthode :
1. Construit une matrice de combinaisons d'inputs réalistes (budget × km × parking × pays × motorisation)
2. Pour chaque combinaison, calcule manuellement les valeurs attendues OU
   logue les inputs pour exécution manuelle dans une instance V1 (browser console)
3. Sauvegarde les inputs en JSON pour exécution batch

Usage :
    python3 generate_tco_test_cases.py

Outputs :
    - test_cases_inputs.json : 100+ cas d'entrée prêts à être joués sur V1
    - test_runner_browser.js : script à coller dans la console V1 pour générer les outputs
    - test_cases_expected.json : sera rempli avec les outputs V1 réels après exécution browser
"""

import itertools
import json
from pathlib import Path


# ====================================================================
# Configuration de la matrice de tests
# ====================================================================

# Pays supportés par CarPIQ
COUNTRIES = ['fr', 'ch', 'de', 'be', 'nl', 'lu', 'it', 'es']

# Tranches de budget (CHF/EUR mensuel)
BUDGETS = [300, 500, 800, 1200, 1800]

# Kilométrage annuel
KM_BRACKETS = [
    {'km': 8000, 'label': 'low'},
    {'km': 15000, 'label': 'medium'},
    {'km': 25000, 'label': 'high'},
    {'km': 40000, 'label': 'very_high'},
]

# Fréquence des longs trajets (>200km)
TRIPS = [
    {'count': 0, 'label': 'urban'},
    {'count': 5, 'label': 'occasional'},
    {'count': 20, 'label': 'frequent'},
    {'count': 50, 'label': 'intensive'},
]

# Type de parking / charge à domicile
CHARGING = [
    {'value': 'none', 'label': 'no_charging_possible'},
    {'value': 'slow', 'label': 'home_outlet'},
    {'value': 'fast', 'label': 'wallbox_or_panel'},
]

# Critères secondaires (priorités utilisateur)
CRITERIA = [
    'comfort',
    'economy',
    'safety',
    'ecology',
    'performance',
    'space',
]

# Carrosseries (sélection multiple possible en V1)
BODY_TYPES = [
    ['compact'],
    ['suv'],
    ['berline'],
    ['compact', 'berline'],
    ['suv', 'pickup'],
    [],  # aucun filtre carrosserie
]

# Tranche d'âge utilisateur (impact assurance)
AGE_BRACKETS = [
    '18-25',
    '26-35',
    '36-50',
    '51-65',
    '65+',
]


# ====================================================================
# Construction de la matrice
# ====================================================================

def build_test_cases() -> list:
    """
    Construit ~100 cas de test représentatifs sans exploser
    combinatoirement (sinon on aurait 8 × 5 × 4 × 4 × 3 × 6 × 6 × 5 = 691 200).
    
    Stratégie : un sous-ensemble structuré couvrant les scénarios typiques.
    """
    cases = []
    case_id = 0

    # Scénario 1 : utilisateur urbain typique en France (faible km, pas de charge possible)
    for budget in [300, 500, 800]:
        for criteria in ['economy', 'ecology']:
            case_id += 1
            cases.append({
                'id': f'urban_fr_{case_id:03d}',
                'description': f'Urbain Paris, budget {budget}€, priorité {criteria}',
                'inputs': {
                    'country': 'fr',
                    'budget': budget,
                    'km': 8000,
                    'trips': 0,
                    'charging': 'none',
                    'criteria': criteria,
                    'body': ['compact'],
                    'age': '26-35',
                    'urban': True,
                    'dept': '75',
                },
            })

    # Scénario 2 : famille en banlieue suisse (km moyen, charge wallbox possible)
    for budget in [800, 1200, 1800]:
        for body in [['suv'], ['berline'], ['compact', 'berline']]:
            for criteria in ['comfort', 'space', 'safety']:
                case_id += 1
                cases.append({
                    'id': f'suburban_ch_{case_id:03d}',
                    'description': f'Famille banlieue Suisse, budget {budget}CHF',
                    'inputs': {
                        'country': 'ch',
                        'budget': budget,
                        'km': 15000,
                        'trips': 5,
                        'charging': 'fast',
                        'criteria': criteria,
                        'body': body,
                        'age': '36-50',
                        'urban': False,
                        'dept': 'GE',
                    },
                })

    # Scénario 3 : commuter haut kilométrage (utilisateur Allemagne, trajets fréquents)
    for budget in [500, 800, 1200]:
        for charging in ['none', 'slow', 'fast']:
            case_id += 1
            cases.append({
                'id': f'commuter_de_{case_id:03d}',
                'description': f'Commuter Allemagne, charge {charging}',
                'inputs': {
                    'country': 'de',
                    'budget': budget,
                    'km': 25000,
                    'trips': 20,
                    'charging': charging,
                    'criteria': 'economy',
                    'body': ['berline'],
                    'age': '36-50',
                    'urban': False,
                    'dept': 'BY',
                },
            })

    # Scénario 4 : haut kilométrage professionnel (très haut km, longs trajets fréquents)
    for country in ['fr', 'be', 'nl']:
        for budget in [800, 1200]:
            case_id += 1
            cases.append({
                'id': f'pro_high_km_{case_id:03d}',
                'description': f'Pro haut km {country}, budget {budget}',
                'inputs': {
                    'country': country,
                    'budget': budget,
                    'km': 40000,
                    'trips': 50,
                    'charging': 'fast',
                    'criteria': 'comfort',
                    'body': ['berline', 'suv'],
                    'age': '36-50',
                    'urban': False,
                    'dept': None,
                },
            })

    # Scénario 5 : jeune conducteur (assurance plus chère)
    for budget in [300, 500]:
        for country in ['fr', 'ch']:
            for criteria in ['economy', 'safety']:
                case_id += 1
                cases.append({
                    'id': f'young_driver_{case_id:03d}',
                    'description': f'Jeune conducteur {country}, budget {budget}',
                    'inputs': {
                        'country': country,
                        'budget': budget,
                        'km': 12000,
                        'trips': 2,
                        'charging': 'none',
                        'criteria': criteria,
                        'body': ['compact'],
                        'age': '18-25',
                        'urban': True,
                        'dept': None,
                    },
                })

    # Scénario 6 : senior conducteur (km faible)
    for budget in [500, 800]:
        for country in ['fr', 'ch']:
            case_id += 1
            cases.append({
                'id': f'senior_{case_id:03d}',
                'description': f'Senior {country}, budget {budget}, faible km',
                'inputs': {
                    'country': country,
                    'budget': budget,
                    'km': 6000,
                    'trips': 0,
                    'charging': 'slow',
                    'criteria': 'comfort',
                    'body': ['compact', 'berline'],
                    'age': '65+',
                    'urban': True,
                    'dept': None,
                },
            })

    # Scénario 7 : cas limites pour stress test
    edge_cases = [
        {
            'id': 'edge_minimal_budget',
            'description': 'Budget minimal',
            'inputs': {'country': 'fr', 'budget': 200, 'km': 5000, 'trips': 0, 'charging': 'none',
                       'criteria': 'economy', 'body': [], 'age': '36-50', 'urban': True, 'dept': None},
        },
        {
            'id': 'edge_maximal_budget',
            'description': 'Budget maximal',
            'inputs': {'country': 'ch', 'budget': 3000, 'km': 30000, 'trips': 50, 'charging': 'fast',
                       'criteria': 'performance', 'body': ['suv', 'berline'], 'age': '36-50', 'urban': False, 'dept': 'GE'},
        },
        {
            'id': 'edge_no_filters',
            'description': 'Aucun filtre carrosserie ni critère',
            'inputs': {'country': 'fr', 'budget': 800, 'km': 15000, 'trips': 5, 'charging': 'slow',
                       'criteria': None, 'body': [], 'age': '36-50', 'urban': False, 'dept': None},
        },
        {
            'id': 'edge_all_filters',
            'description': 'Tous les filtres possibles cumulés',
            'inputs': {'country': 'fr', 'budget': 1200, 'km': 20000, 'trips': 10, 'charging': 'fast',
                       'criteria': 'safety', 'body': ['compact', 'berline', 'suv', 'pickup'],
                       'age': '36-50', 'urban': True, 'dept': '75'},
        },
    ]
    cases.extend(edge_cases)

    return cases


# ====================================================================
# Browser-side test runner
# ====================================================================

BROWSER_TEST_RUNNER = """
// CarPIQ V1 — Test Runner pour générer les outputs baseline TCO
// ============================================================
//
// USAGE :
// 1. Ouvre https://carpiq.eu dans Chrome
// 2. Ouvre les DevTools → onglet Console
// 3. Charge les cas de test :
//      fetch('test_cases_inputs.json').then(r => r.json()).then(cases => window.__testCases = cases);
// 4. Colle ce script entier dans la console
// 5. Lance : await runAllTests()
// 6. Récupère le résultat : copy(JSON.stringify(window.__results, null, 2))
// 7. Sauvegarde dans test_cases_expected.json
//
// PRÉREQUIS : la fonction getRec() doit être accessible globalement dans V1
// (vérifiable via : typeof getRec === 'function')

window.__results = [];

async function runOneTest(testCase) {
    const { country, budget, km, trips, charging, criteria, body, age, urban, dept } = testCase.inputs;
    
    // Set V1 state to match test inputs
    // NOTE: l'API exacte dépend de la structure interne V1 - à adapter
    if (typeof st !== 'undefined') {
        st.country = country;
        st.budget = budget;
        st.km = km;
        st.trips = trips;
        st.charging = charging;
        st.priority = criteria;
        st.body = body;
        st.age = age;
        st.urban = urban;
        st.dept = dept;
    }
    if (typeof activeCountry !== 'undefined') {
        activeCountry = country;
    }
    
    // Run recommendation engine
    let rec;
    try {
        rec = getRec();
    } catch (err) {
        return {
            id: testCase.id,
            description: testCase.description,
            inputs: testCase.inputs,
            error: err.message,
            stack: err.stack,
        };
    }
    
    // Extract key fields we care about for regression testing
    return {
        id: testCase.id,
        description: testCase.description,
        inputs: testCase.inputs,
        output: {
            best: rec.best ? {
                make: rec.best.make,
                model: rec.best.model,
                pt: rec.best.pt,
                price: rec.best.price,
                year: rec.best.year,
            } : null,
            bTco: rec.bTco,
            iceTco: rec.iceTco,
            warns: rec.warns,
            why_top3: rec.why ? rec.why.slice(0, 3) : [],
            ptComp: rec.ptComp,
            bodySegs: rec.bodySegs,
            refCar: rec.refCar ? {
                make: rec.refCar.make,
                model: rec.refCar.model,
            } : null,
        },
    };
}

async function runAllTests() {
    if (!window.__testCases) {
        console.error('No test cases loaded. Run: fetch("test_cases_inputs.json")...');
        return;
    }
    
    console.log(`Running ${window.__testCases.length} test cases...`);
    window.__results = [];
    
    for (let i = 0; i < window.__testCases.length; i++) {
        const result = await runOneTest(window.__testCases[i]);
        window.__results.push(result);
        if (i % 10 === 0) {
            console.log(`  ${i+1}/${window.__testCases.length} done`);
        }
    }
    
    console.log('✅ All tests complete. Copy results:');
    console.log('copy(JSON.stringify(window.__results, null, 2))');
    return window.__results;
}

console.log('Test runner loaded. Run: await runAllTests()');
"""


def main():
    out_dir = Path('.')
    
    # Générer les cas
    cases = build_test_cases()
    print(f"📊 {len(cases)} cas de test générés")
    
    # Sauvegarder les inputs
    inputs_path = out_dir / 'test_cases_inputs.json'
    inputs_path.write_text(json.dumps(cases, indent=2, ensure_ascii=False))
    print(f"   ✓ Inputs : {inputs_path}")
    
    # Sauvegarder le runner browser
    runner_path = out_dir / 'test_runner_browser.js'
    runner_path.write_text(BROWSER_TEST_RUNNER)
    print(f"   ✓ Runner browser : {runner_path}")
    
    # Statistiques
    by_country = {}
    by_budget_range = {}
    for c in cases:
        ctry = c['inputs']['country']
        by_country[ctry] = by_country.get(ctry, 0) + 1
        b = c['inputs']['budget']
        bucket = f"{(b // 500) * 500}-{(b // 500 + 1) * 500}"
        by_budget_range[bucket] = by_budget_range.get(bucket, 0) + 1
    
    print()
    print("📈 Répartition par pays :")
    for ctry, count in sorted(by_country.items()):
        print(f"   {ctry}: {count}")
    
    print()
    print("💰 Répartition par tranche de budget :")
    for bucket, count in sorted(by_budget_range.items()):
        print(f"   {bucket}: {count}")
    
    print()
    print("🔄 Prochaine étape : exécuter le runner browser sur https://carpiq.eu")
    print("   pour générer test_cases_expected.json")


if __name__ == '__main__':
    main()
