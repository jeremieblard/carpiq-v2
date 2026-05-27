
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
