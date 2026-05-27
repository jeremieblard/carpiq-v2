"""
CarPIQ V1 — Génération de la suite de tests baseline V2 (vocabulaire CORRECT)
============================================================================

Génère :
1. Cas de test pour `calcTCO` (algo pur, idéal pour snapshot bas niveau)
2. Cas de test pour `getRec` (algo complet end-to-end, avec st + activeCountry)

Vocabulaire V1 confirmé via introspection console (27 mai 2026) :
- st.pref : 'cost' | 'ratio' | 'premium' | 'sport' | 'eco' | 'family' | null
- st.km : 'u10' | 'm20' | 'm35' | 'o35' (clés KMM)
- st.trips : 'short' | 'mixed' | 'long' | 'vlong' (clés CONS)
- st.charging : 'socket' | 'maybe' | 'no'
- st.body : array de segments ['small', 'compact', 'saloon', 'suv', etc.]
- activeCountry : 'fr' | 'be' | 'nl' | 'ch' | 'de' | 'es' | 'it' | 'pt' | 'lu'

Outputs :
- calc_tco_inputs.json : cas pour calcTCO(pt, newP, brand, age, km)
- get_rec_inputs.json : cas pour getRec() (état st + activeCountry)
- test_runner_browser_v2.js : runner browser à exécuter sur https://carpiq.eu

Usage:
    python3 generate_baseline_v2.py
"""

import json
import itertools
from pathlib import Path


# ====================================================================
# 1. Cas de test pour calcTCO (algorithme bas niveau)
# ====================================================================

def build_calc_tco_cases() -> list:
    """
    calcTCO(pt, newP, brand, age, km)
    
    Snapshote l'algo TCO pur. Reproductible car ne dépend que des arguments
    et de st.trips (donc on snapshot pour différentes valeurs de st.trips aussi).
    """
    powertrains = ['ice', 'hev', 'phev', 'bev', 'die']
    prices = [15000, 22000, 28340, 35000, 50000, 75000]
    brands = ['toyota', 'tesla', 'bmw', 'renault', 'volkswagen']
    ages = [0, 2, 5, 8]  # 0 = neuf, 2 = 2 ans, 5 = 5 ans, 8 = 8 ans
    kms = [5000, 10000, 15000, 25000, 40000]
    trips_values = ['short', 'mixed', 'long', 'vlong']
    
    cases = []
    case_id = 0
    
    # Cas représentatifs (pas combinatoire complet, on aurait 6000+ cas)
    # On prend ~80 combinaisons stratégiques
    
    # Bloc 1 : variation powertrain × prix moyen × km moyen
    for pt in powertrains:
        for price in [22000, 35000, 50000]:
            for km in [10000, 25000]:
                case_id += 1
                cases.append({
                    'id': f'calctco_{case_id:03d}_{pt}_p{price}_km{km}',
                    'inputs': {
                        'pt': pt,
                        'newP': price,
                        'brand': 'toyota',
                        'age': 0,
                        'km': km,
                        'st_trips': 'mixed',
                        'st_charging': 'no',
                        'st_urban': False,
                        'active_country': 'fr',
                    },
                })
    
    # Bloc 2 : variation âge sur powertrains principaux
    for pt in ['ice', 'hev', 'bev']:
        for age in ages:
            case_id += 1
            cases.append({
                'id': f'calctco_{case_id:03d}_{pt}_age{age}',
                'inputs': {
                    'pt': pt,
                    'newP': 28000,
                    'brand': 'toyota',
                    'age': age,
                    'km': 15000,
                    'st_trips': 'mixed',
                    'st_charging': 'no',
                    'st_urban': False,
                    'active_country': 'fr',
                },
            })
    
    # Bloc 3 : variation trips × powertrain (sensibilité fuelCost)
    for pt in powertrains:
        for trips in trips_values:
            case_id += 1
            cases.append({
                'id': f'calctco_{case_id:03d}_{pt}_trips_{trips}',
                'inputs': {
                    'pt': pt,
                    'newP': 28000,
                    'brand': 'toyota',
                    'age': 0,
                    'km': 15000,
                    'st_trips': trips,
                    'st_charging': 'socket' if pt in ['bev', 'phev'] else 'no',
                    'st_urban': False,
                    'active_country': 'fr',
                },
            })
    
    # Bloc 4 : effet de st.charging sur BEV et PHEV
    for pt in ['bev', 'phev']:
        for charging in ['no', 'maybe', 'socket']:
            for urban in [True, False]:
                case_id += 1
                cases.append({
                    'id': f'calctco_{case_id:03d}_{pt}_chrg_{charging}_urban_{urban}',
                    'inputs': {
                        'pt': pt,
                        'newP': 35000,
                        'brand': 'tesla' if pt == 'bev' else 'toyota',
                        'age': 0,
                        'km': 15000,
                        'st_trips': 'mixed',
                        'st_charging': charging,
                        'st_urban': urban,
                        'active_country': 'fr',
                    },
                })
    
    # Bloc 5 : effet pays (activeCountry) sur quelques powertrains
    # Note: introspection a montré que calcTCO seul n'est pas sensible au pays,
    # mais fuelCost l'est peut-être via getFP/getEP. Verification snapshot.
    for country in ['fr', 'de', 'ch', 'be', 'nl', 'es', 'it', 'lu', 'pt']:
        for pt in ['ice', 'bev']:
            case_id += 1
            cases.append({
                'id': f'calctco_{case_id:03d}_{pt}_country_{country}',
                'inputs': {
                    'pt': pt,
                    'newP': 28000,
                    'brand': 'toyota',
                    'age': 0,
                    'km': 15000,
                    'st_trips': 'mixed',
                    'st_charging': 'socket' if pt == 'bev' else 'no',
                    'st_urban': False,
                    'active_country': country,
                },
            })
    
    # Edge cases
    edge_cases = [
        {
            'id': 'calctco_edge_minimal_price',
            'inputs': {'pt': 'ice', 'newP': 8000, 'brand': 'renault', 'age': 0, 'km': 5000,
                       'st_trips': 'short', 'st_charging': 'no', 'st_urban': True, 'active_country': 'fr'},
        },
        {
            'id': 'calctco_edge_maximal_price',
            'inputs': {'pt': 'bev', 'newP': 120000, 'brand': 'tesla', 'age': 0, 'km': 40000,
                       'st_trips': 'vlong', 'st_charging': 'socket', 'st_urban': False, 'active_country': 'ch'},
        },
        {
            'id': 'calctco_edge_very_old',
            'inputs': {'pt': 'ice', 'newP': 28000, 'brand': 'toyota', 'age': 8, 'km': 15000,
                       'st_trips': 'mixed', 'st_charging': 'no', 'st_urban': False, 'active_country': 'fr'},
        },
        {
            'id': 'calctco_edge_zero_km',
            'inputs': {'pt': 'hev', 'newP': 28340, 'brand': 'toyota', 'age': 0, 'km': 1,
                       'st_trips': 'mixed', 'st_charging': 'no', 'st_urban': False, 'active_country': 'fr'},
        },
    ]
    cases.extend(edge_cases)
    
    return cases


# ====================================================================
# 2. Cas de test pour getRec (algorithme end-to-end)
# ====================================================================

def build_get_rec_cases() -> list:
    """
    getRec() — algorithme complet qui lit st et activeCountry.
    
    On baseline le résultat utilisateur final (la reco affichée).
    """
    cases = []
    case_id = 0
    
    # Scénario 1 : utilisateur urbain budget bas
    for country in ['fr', 'ch', 'de']:
        for pref in ['cost', 'eco']:
            case_id += 1
            cases.append({
                'id': f'rec_{case_id:03d}_urban_low_{country}_{pref}',
                'description': f'Urbain {country.upper()}, budget 500, pref {pref}',
                'inputs': {
                    'budget': 500,
                    'km': 'u10',
                    'trips': 'short',
                    'charging': 'no',
                    'body': ['small'],
                    'pref': pref,
                    'urban': True,
                    'age': '26-35',
                    'dept': None,
                    'active_country': country,
                },
            })
    
    # Scénario 2 : famille suburbaine
    for country in ['fr', 'ch', 'be']:
        for body in [['compact'], ['saloon'], ['suv']]:
            for pref in ['family', 'cost']:
                case_id += 1
                cases.append({
                    'id': f'rec_{case_id:03d}_family_{country}_{body[0]}_{pref}',
                    'description': f'Famille {country.upper()}, {body[0]}, pref {pref}',
                    'inputs': {
                        'budget': 800,
                        'km': 'm20',
                        'trips': 'mixed',
                        'charging': 'socket',
                        'body': body,
                        'pref': pref,
                        'urban': False,
                        'age': '36-50',
                        'dept': None,
                        'active_country': country,
                    },
                })
    
    # Scénario 3 : commuter haut km
    for country in ['fr', 'de', 'nl']:
        for trips in ['long', 'vlong']:
            for pref in ['cost', 'ratio']:
                case_id += 1
                cases.append({
                    'id': f'rec_{case_id:03d}_commuter_{country}_{trips}_{pref}',
                    'description': f'Commuter {country.upper()}, trips {trips}',
                    'inputs': {
                        'budget': 1000,
                        'km': 'o35',
                        'trips': trips,
                        'charging': 'socket',
                        'body': ['saloon'],
                        'pref': pref,
                        'urban': False,
                        'age': '36-50',
                        'dept': None,
                        'active_country': country,
                    },
                })
    
    # Scénario 4 : budget élevé, premium
    for country in ['ch', 'lu']:
        for pref in ['premium', 'sport']:
            for body in [['saloon'], ['suv']]:
                case_id += 1
                cases.append({
                    'id': f'rec_{case_id:03d}_premium_{country}_{pref}_{body[0]}',
                    'description': f'Premium {country.upper()}, {pref}, {body[0]}',
                    'inputs': {
                        'budget': 1500,
                        'km': 'm20',
                        'trips': 'mixed',
                        'charging': 'socket',
                        'body': body,
                        'pref': pref,
                        'urban': False,
                        'age': '36-50',
                        'dept': None,
                        'active_country': country,
                    },
                })
    
    # Scénario 5 : EV-friendly (haut km + charge socket)
    for country in ['fr', 'nl']:
        for body in [[], ['compact']]:
            case_id += 1
            cases.append({
                'id': f'rec_{case_id:03d}_ev_{country}_body_{body or "any"}',
                'description': f'EV-friendly {country.upper()}',
                'inputs': {
                    'budget': 1200,
                    'km': 'm35',
                    'trips': 'long',
                    'charging': 'socket',
                    'body': body,
                    'pref': 'eco',
                    'urban': False,
                    'age': '36-50',
                    'dept': None,
                    'active_country': country,
                },
            })
    
    # Scénario 6 : jeune conducteur urbain
    for country in ['fr', 'ch']:
        for pref in ['cost', 'sport']:
            case_id += 1
            cases.append({
                'id': f'rec_{case_id:03d}_young_{country}_{pref}',
                'description': f'Jeune conducteur {country.upper()}, {pref}',
                'inputs': {
                    'budget': 400,
                    'km': 'u10',
                    'trips': 'short',
                    'charging': 'no',
                    'body': ['small'],
                    'pref': pref,
                    'urban': True,
                    'age': '18-25',
                    'dept': None,
                    'active_country': country,
                },
            })
    
    # Scénario 7 : senior, low km
    for country in ['fr']:
        for pref in ['ratio', 'family']:
            case_id += 1
            cases.append({
                'id': f'rec_{case_id:03d}_senior_{country}_{pref}',
                'description': f'Senior {country.upper()}',
                'inputs': {
                    'budget': 600,
                    'km': 'u10',
                    'trips': 'short',
                    'charging': 'maybe',
                    'body': ['compact'],
                    'pref': pref,
                    'urban': True,
                    'age': '65+',
                    'dept': None,
                    'active_country': country,
                },
            })
    
    # Edge cases
    edge_cases = [
        {
            'id': 'rec_edge_minimal_budget',
            'description': 'Budget minimal, no preferences',
            'inputs': {
                'budget': 200, 'km': 'u10', 'trips': 'short', 'charging': 'no',
                'body': [], 'pref': None, 'urban': True, 'age': None, 'dept': None,
                'active_country': 'fr',
            },
        },
        {
            'id': 'rec_edge_maximal_budget',
            'description': 'Budget maximal, EV-friendly Switzerland',
            'inputs': {
                'budget': 3000, 'km': 'o35', 'trips': 'long', 'charging': 'socket',
                'body': ['suv'], 'pref': 'eco', 'urban': False, 'age': '36-50',
                'dept': 'GE', 'active_country': 'ch',
            },
        },
        {
            'id': 'rec_edge_all_null',
            'description': 'Toutes valeurs null sauf budget et activeCountry',
            'inputs': {
                'budget': 800, 'km': None, 'trips': None, 'charging': None,
                'body': [], 'pref': None, 'urban': False, 'age': None, 'dept': None,
                'active_country': 'fr',
            },
        },
    ]
    cases.extend(edge_cases)
    
    return cases


# ====================================================================
# 3. Runner browser amélioré
# ====================================================================

RUNNER_BROWSER = """
// CarPIQ V1 — Test Runner V2 (vocabulaire correct)
// =================================================
// 
// USAGE :
// 1. Ouvre https://carpiq.eu dans Chrome
// 2. Ouvre les DevTools → Console
// 3. Colle CE script ENTIER en une seule fois (de // == début == à // == fin ==)
// 4. Lance : await runBaseline()
// 5. Récupère le résultat : copy(JSON.stringify(window.__results, null, 2))
// 6. Sauvegarde dans tests/fixtures/baseline_expected.json côté repo
// 
// == début du script ==

window.__results = { calcTcoCases: [], getRecCases: [], metadata: {} };

// Snapshot l'état initial pour pouvoir restaurer
const __snapshot = {
  st: JSON.parse(JSON.stringify(st)),
  activeCountry: activeCountry,
  lang: typeof lang !== 'undefined' ? lang : 'fr',
};

console.log('=== CarPIQ baseline runner V2 ===');
console.log('snapshot pris:', __snapshot);

// ---------------------------------------------------------------
// Helper : applique un état complet à st + activeCountry
// ---------------------------------------------------------------
function applyState(inputs) {
  // Reset st en deep clone du snapshot, puis applique les changements
  Object.keys(st).forEach(k => { 
    if (Array.isArray(st[k])) st[k] = [];
    else st[k] = null;
  });
  
  if ('budget' in inputs) st.budget = inputs.budget;
  if ('km' in inputs) st.km = inputs.km;
  if ('trips' in inputs) st.trips = inputs.trips;
  if ('charging' in inputs) st.charging = inputs.charging;
  if ('body' in inputs) st.body = inputs.body || [];
  if ('pref' in inputs) st.pref = inputs.pref;
  if ('urban' in inputs) st.urban = inputs.urban;
  if ('age' in inputs) st.age = inputs.age;
  if ('dept' in inputs) st.dept = inputs.dept;
  if ('st_trips' in inputs) st.trips = inputs.st_trips;
  if ('st_charging' in inputs) st.charging = inputs.st_charging;
  if ('st_urban' in inputs) st.urban = inputs.st_urban;
  
  if ('active_country' in inputs) {
    window.activeCountry = inputs.active_country;
  }
}

function restoreState() {
  Object.keys(__snapshot.st).forEach(k => { st[k] = __snapshot.st[k]; });
  window.activeCountry = __snapshot.activeCountry;
}

// ---------------------------------------------------------------
// Helper : extrait les champs déterministes d'un résultat getRec()
// ---------------------------------------------------------------
function extractRecResult(r) {
  return {
    best: r.best,
    refCar: r.refCar ? {
      id: r.refCar.id,
      name: r.refCar.name,
      brand: r.refCar.brand,
      pt: r.refCar.pt,
      newP: r.refCar.newP,
      seg: r.refCar.seg,
    } : null,
    bTco: r.bTco ? {
      purchP: r.bTco.purchP,
      saleP: r.bTco.saleP,
      depr5: r.bTco.depr5,
      yf: round2(r.bTco.yf),
      maint: r.bTco.maint,
      rep: r.bTco.rep,
      mo: round2(r.bTco.mo),
      risk: round2(r.bTco.risk),
    } : null,
    iceTco: r.iceTco ? {
      yf: round2(r.iceTco.yf),
      mo: round2(r.iceTco.mo),
    } : null,
    bodySegs: r.bodySegs,
    warnCount: Array.isArray(r.warns) ? r.warns.length : (r.warns ? 1 : 0),
    ptComp: Array.isArray(r.ptComp) ? r.ptComp.map(p => ({
      pt: p.pt,
      mo: round2(p.mo),
      gp: p.gp,
      name: p.name,
    })) : [],
  };
}

function round2(n) {
  if (typeof n !== 'number' || !isFinite(n)) return n;
  return Math.round(n * 100) / 100;
}

// ---------------------------------------------------------------
// Run calcTCO cases
// ---------------------------------------------------------------
async function runCalcTCOCases(cases) {
  console.log(`Running ${cases.length} calcTCO cases...`);
  const results = [];
  
  for (let i = 0; i < cases.length; i++) {
    const c = cases[i];
    const { pt, newP, brand, age, km, st_trips, st_charging, st_urban, active_country } = c.inputs;
    
    // Setter le state pour fuelCost (qui lit st.trips, st.charging, st.urban)
    st.trips = st_trips;
    st.charging = st_charging;
    st.urban = st_urban;
    window.activeCountry = active_country;
    
    let result;
    try {
      const tco = calcTCO(pt, newP, brand, age, km);
      result = {
        id: c.id,
        inputs: c.inputs,
        output: {
          purchP: tco.purchP,
          saleP: tco.saleP,
          depr5: tco.depr5,
          yf: round2(tco.yf),
          maint: tco.maint,
          rep: tco.rep,
          mo: round2(tco.mo),
          risk: round2(tco.risk),
        },
      };
    } catch (err) {
      result = { id: c.id, inputs: c.inputs, error: err.message };
    }
    
    results.push(result);
    if ((i + 1) % 20 === 0) console.log(`  calcTCO: ${i + 1}/${cases.length}`);
  }
  
  return results;
}

// ---------------------------------------------------------------
// Run getRec cases
// ---------------------------------------------------------------
async function runGetRecCases(cases) {
  console.log(`Running ${cases.length} getRec cases...`);
  const results = [];
  
  for (let i = 0; i < cases.length; i++) {
    const c = cases[i];
    
    applyState(c.inputs);
    
    let result;
    try {
      const r = getRec();
      result = {
        id: c.id,
        description: c.description,
        inputs: c.inputs,
        output: extractRecResult(r),
      };
    } catch (err) {
      result = { id: c.id, description: c.description, inputs: c.inputs, error: err.message };
    }
    
    results.push(result);
    if ((i + 1) % 10 === 0) console.log(`  getRec: ${i + 1}/${cases.length}`);
  }
  
  return results;
}

// ---------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------
async function runBaseline() {
  if (!window.__calcTcoInputs || !window.__getRecInputs) {
    console.error('ERROR: Load inputs first by pasting calc_tco_inputs.json into window.__calcTcoInputs');
    console.error('       and get_rec_inputs.json into window.__getRecInputs');
    return;
  }
  
  console.log('Starting baseline run...');
  const startTime = Date.now();
  
  window.__results.metadata = {
    timestamp: new Date().toISOString(),
    userAgent: navigator.userAgent,
    carpiqVersion: 'v1-prod',
    snapshot: __snapshot,
  };
  
  window.__results.calcTcoCases = await runCalcTCOCases(window.__calcTcoInputs);
  window.__results.getRecCases = await runGetRecCases(window.__getRecInputs);
  
  restoreState();
  
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);
  console.log(`✅ Baseline complete in ${elapsed}s`);
  console.log(`   calcTCO cases : ${window.__results.calcTcoCases.length}`);
  console.log(`   getRec cases  : ${window.__results.getRecCases.length}`);
  console.log('');
  console.log('Copy result with: copy(JSON.stringify(window.__results, null, 2))');
  console.log('Then save to: tests/fixtures/baseline_expected.json');
  
  return window.__results;
}

console.log('Runner loaded. Next:');
console.log('1. Paste calc_tco_inputs.json content into:');
console.log('   window.__calcTcoInputs = [...]');
console.log('2. Paste get_rec_inputs.json content into:');
console.log('   window.__getRecInputs = [...]');
console.log('3. Run: await runBaseline()');

// == fin du script ==
"""


# ====================================================================
# Main
# ====================================================================

def main():
    out_dir = Path('.')
    
    calc_cases = build_calc_tco_cases()
    rec_cases = build_get_rec_cases()
    
    # Sauvegardes
    calc_path = out_dir / 'calc_tco_inputs.json'
    calc_path.write_text(json.dumps(calc_cases, indent=2, ensure_ascii=False))
    print(f"✓ calcTCO inputs : {len(calc_cases)} cas → {calc_path}")
    
    rec_path = out_dir / 'get_rec_inputs.json'
    rec_path.write_text(json.dumps(rec_cases, indent=2, ensure_ascii=False))
    print(f"✓ getRec inputs  : {len(rec_cases)} cas → {rec_path}")
    
    runner_path = out_dir / 'test_runner_browser_v2.js'
    runner_path.write_text(RUNNER_BROWSER)
    print(f"✓ Runner browser : {runner_path}")
    
    print()
    print(f"📊 Total : {len(calc_cases) + len(rec_cases)} cas de test")
    print()
    print("Prochaine étape :")
    print("  1. Copier ces fichiers dans tests/fixtures/ du repo")
    print("  2. Ouvrir https://carpiq.eu dans Chrome")
    print("  3. Console : coller test_runner_browser_v2.js")
    print("  4. Console : coller calc_tco_inputs.json comme valeur de window.__calcTcoInputs")
    print("  5. Console : coller get_rec_inputs.json comme valeur de window.__getRecInputs")
    print("  6. Console : await runBaseline()")
    print("  7. Console : copy(JSON.stringify(window.__results, null, 2))")
    print("  8. Coller dans tests/fixtures/baseline_expected.json")


if __name__ == '__main__':
    main()
