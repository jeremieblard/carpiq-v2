
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
