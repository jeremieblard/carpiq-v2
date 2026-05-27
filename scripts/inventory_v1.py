"""
CarPIQ V1 Inventory Script (fix Windows UTF-8)
==============================================

Catalogue la logique métier extractible depuis index.html monolithique
pour préparer la migration vers V2 (Astro/TypeScript).

Produit :
- inventory_report.md : rapport lisible
- inventory_raw.json : données structurées pour traitement automatique

Usage:
    python3 inventory_v1.py [path/to/index.html]
"""

import json
import re
import sys
from datetime import datetime, timezone
from pathlib import Path

CATEGORIES = {
    'tco_engine': {
        'label': 'Algorithme TCO et calculs de cout',
        'patterns': [
            r'function\s+calc\w*TCO\w*',
            r'function\s+computeMonthly\w*',
            r'function\s+getDepreciation\w*',
            r'function\s+computeFuelCost\w*',
            r'function\s+computeInsurance\w*',
            r'function\s+computeMaintenance\w*',
            r'function\s+computeTax\w*',
            r'function\s+buildTcoBreakdown\w*',
            r'function\s+fuelCost',
            r'function\s+annualMaint',
            r'function\s+repairCost',
            r'function\s+insMod',
            r'function\s+purchAtAge',
            r'function\s+phevChargeFactor',
            r'function\s+bevWinterPen',
            r'function\s+urbanMod',
            r'function\s+wltpMult',
            r'function\s+home',
            r'function\s+fp',
            r'function\s+getFP',
            r'function\s+getEP',
            r'function\s+getEPU',
        ],
    },
    'recommendations': {
        'label': 'Systeme de filtres et de recommandations',
        'patterns': [
            r'function\s+getRec\b',
            r'function\s+bestPt\b',
            r'function\s+scorePt\b',
            r'function\s+getBodySegs\b',
            r'function\s+rankVehiclesByTCO\b',
            r'function\s+filter\w*Vehicles',
            r'function\s+match\w*',
            r'function\s+selectBest\w*',
            r'function\s+findAlternatives\w*',
            r'function\s+wantsAWD\b',
            r'function\s+carHasAWD\b',
            r'function\s+incForCar\b',
        ],
    },
    'garage_compare': {
        'label': 'Garage virtuel et comparateur',
        'patterns': [
            r'function\s+\w*addToGarage\w*',
            r'function\s+\w*removeFromGarage\w*',
            r'function\s+\w*compareVehicles\w*',
            r'function\s+\w*renderGarage\w*',
            r'function\s+\w*renderCompare\w*',
            r'function\s+\w*saveGarage\w*',
            r'function\s+\w*loadGarage\w*',
        ],
    },
    'questionnaire_render': {
        'label': 'Fonctions de rendu UI questionnaire (a refaire en composants Astro)',
        'patterns': [
            r'function\s+render\w*',
            r'function\s+show\w*',
            r'function\s+update\w*UI',
        ],
        'note': "Ces fonctions sont liees a la presentation actuelle. On garde la LOGIQUE qu'elles encapsulent (calculs intermediaires, etat) mais on refait le rendering en composants Astro.",
    },
    'i18n': {
        'label': "Systeme d'internationalisation",
        'patterns': [
            r'function\s+t\s*\(',
            r'function\s+setLang\s*\(',
            r'const\s+LANG_LABELS',
            r'const\s+I18N',
            r'const\s+labels\s*=',
            r'lang\s*=\s*["\']fr["\']',
        ],
    },
    'analytics': {
        'label': 'Tracking et analytics',
        'patterns': [
            r'function\s+mpTrack',
            r'function\s+trackEvent',
            r'mixpanel\.',
            r'gtag\s*\(',
            r'function\s+initAnalytics',
        ],
    },
    'storage': {
        'label': 'Persistance locale (localStorage, sessionStorage)',
        'patterns': [
            r'localStorage\.',
            r'sessionStorage\.',
            r'function\s+saveState\w*',
            r'function\s+loadState\w*',
            r'function\s+persistSession\w*',
        ],
    },
    'data_loading': {
        'label': 'Chargement de donnees externes',
        'patterns': [
            r'fetch\s*\(',
            r'\.json\s*\(\s*\)',
            r'function\s+loadCatalog\w*',
            r'function\s+loadPrices\w*',
            r'function\s+loadVehicles\w*',
        ],
    },
    'country_currency': {
        'label': 'Gestion multi-pays et devises',
        'patterns': [
            r'COUNTRY_ENERGY',
            r'COUNTRY_TAX',
            r'function\s+\w*Country\w*',
            r'function\s+\w*Currency\w*',
            r'activeCountry',
            r'CURRENCIES\s*=',
        ],
    },
    'tco_constants': {
        'label': 'Constantes du modele TCO (DEPR, WLTP, CONS, KMM, etc.)',
        'patterns': [
            r'const\s+DEPR\s*=',
            r'const\s+WLTP\s*=',
            r'const\s+CONS\s*=',
            r'const\s+KMM\s*=',
            r'const\s+BPROB\s*=',
            r'const\s+MAINT_MULT\s*=',
            r'const\s+SEG_MAP\s*=',
            r'const\s+MOD_MAP\s*=',
        ],
    },
}


def find_function_body(source: str, start_pos: int) -> tuple:
    open_brace = source.find('{', start_pos)
    if open_brace == -1:
        return start_pos, start_pos
    pos = open_brace + 1
    depth = 1
    while depth > 0 and pos < len(source):
        ch = source[pos]
        if ch == '{':
            depth += 1
        elif ch == '}':
            depth -= 1
        elif ch == '"' or ch == "'" or ch == '`':
            quote = ch
            pos += 1
            while pos < len(source) and source[pos] != quote:
                if source[pos] == '\\':
                    pos += 1
                pos += 1
        pos += 1
    return start_pos, pos


def extract_function_name(source: str, match_start: int) -> str:
    snippet = source[match_start:match_start + 200]
    m = re.search(r'function\s+(\w+)', snippet)
    if m:
        return m.group(1)
    return '<anonymous>'


def find_main_script(html: str) -> tuple:
    scripts = []
    for m in re.finditer(r'<script[^>]*>(.*?)</script>', html, re.DOTALL):
        scripts.append((m.start(), m.end(), m.group(1)))
    if not scripts:
        return 0, 0, ''
    best = max(scripts, key=lambda s: len(s[2]))
    return best


def inventory(html_path: Path) -> dict:
    html = html_path.read_text(encoding='utf-8')
    script_start, script_end, script_source = find_main_script(html)

    report = {
        'meta': {
            'file': str(html_path),
            'file_size_bytes': len(html),
            'script_size_bytes': len(script_source),
            'script_position_in_html': (script_start, script_end),
            'analyzed_at': datetime.now(timezone.utc).isoformat(),
        },
        'categories': {},
        'summary': {
            'total_functions_identified': 0,
            'total_estimated_loc': 0,
        },
    }

    if not script_source:
        report['error'] = 'No <script> block found'
        return report

    for cat_key, cat_def in CATEGORIES.items():
        matches = []
        seen_names = set()
        for pattern in cat_def['patterns']:
            for m in re.finditer(pattern, script_source):
                start = m.start()
                if 'function' in m.group():
                    fname = extract_function_name(script_source, start)
                    if fname in seen_names:
                        continue
                    seen_names.add(fname)
                    body_start, body_end = find_function_body(script_source, start)
                    body_size = body_end - body_start
                    estimated_loc = max(1, body_size // 40)
                    matches.append({
                        'name': fname,
                        'position_in_script': body_start,
                        'absolute_position_in_html': script_start + body_start,
                        'size_chars': body_size,
                        'estimated_loc': estimated_loc,
                        'snippet': script_source[body_start:body_start + 200].replace('\n', ' '),
                    })
                else:
                    snippet = script_source[start:start + 200].replace('\n', ' ')
                    matches.append({
                        'name': m.group(),
                        'position_in_script': start,
                        'absolute_position_in_html': script_start + start,
                        'size_chars': 0,
                        'estimated_loc': 0,
                        'snippet': snippet,
                    })

        matches.sort(key=lambda x: x['position_in_script'])

        cat_total_loc = sum(m['estimated_loc'] for m in matches)
        report['categories'][cat_key] = {
            'label': cat_def['label'],
            'note': cat_def.get('note'),
            'function_count': len([m for m in matches if m['estimated_loc'] > 0]),
            'pattern_match_count': len(matches),
            'total_estimated_loc': cat_total_loc,
            'matches': matches,
        }

        report['summary']['total_functions_identified'] += len(
            [m for m in matches if m['estimated_loc'] > 0]
        )
        report['summary']['total_estimated_loc'] += cat_total_loc

    return report


def render_markdown_report(report: dict) -> str:
    md = []
    meta = report['meta']
    md.append('# CarPIQ V1 - Inventaire de la logique metier extractible')
    md.append('')
    md.append(f"**Fichier analyse** : `{meta['file']}`")
    md.append(f"**Taille du HTML** : {meta['file_size_bytes']:,} bytes")
    md.append(f"**Taille du script principal** : {meta['script_size_bytes']:,} bytes")
    md.append(f"**Analyse le** : {meta['analyzed_at']}")
    md.append('')

    if 'error' in report:
        md.append(f"**ERREUR** : {report['error']}")
        return '\n'.join(md)

    summary = report['summary']
    md.append('## Synthese')
    md.append('')
    md.append(f"- **Fonctions identifiees** : {summary['total_functions_identified']}")
    md.append(f"- **LOC estimees totales** : {summary['total_estimated_loc']:,}")
    md.append('')

    md.append('## Detail par categorie')
    md.append('')

    sorted_cats = sorted(
        report['categories'].items(),
        key=lambda x: x[1]['total_estimated_loc'],
        reverse=True,
    )

    for cat_key, cat_data in sorted_cats:
        md.append(f"### {cat_data['label']}")
        md.append('')
        md.append(f"- **Fonctions** : {cat_data['function_count']}")
        md.append(f"- **LOC estimees** : {cat_data['total_estimated_loc']:,}")
        if cat_data.get('note'):
            md.append('')
            md.append(f"> {cat_data['note']}")
        md.append('')

        if cat_data['matches']:
            md.append('| Fonction / Variable | Position | LOC estimees |')
            md.append('|---|---:|---:|')
            for match in cat_data['matches'][:30]:
                name = match['name'][:50]
                pos = match['absolute_position_in_html']
                loc = match['estimated_loc']
                md.append(f"| `{name}` | {pos:,} | {loc or '-'} |")
            if len(cat_data['matches']) > 30:
                md.append(f"| _... et {len(cat_data['matches']) - 30} autres entries (voir JSON brut)_ | | |")
        md.append('')

    md.append('## Prochaines etapes recommandees')
    md.append('')
    md.append('1. **Extraction prioritaire** : `tco_engine` et `recommendations` (coeur de la valeur produit)')
    md.append('2. **Extraction critique** : `i18n` (systeme reutilise partout)')
    md.append('3. **Extraction secondaire** : `garage_compare`, `analytics`, `storage`')
    md.append('4. **A refaire from scratch** : tout ce qui est dans `questionnaire_render` (presentation a reconcevoir)')
    md.append('')

    return '\n'.join(md)


def main():
    if len(sys.argv) > 1:
        html_path = Path(sys.argv[1])
    else:
        html_path = Path('index.html')

    if not html_path.exists():
        print(f"[ERROR] Fichier introuvable : {html_path}")
        print(f"Usage : python3 {sys.argv[0]} [path/to/index.html]")
        sys.exit(1)

    print(f"[INFO] Analyse de {html_path}...")
    report = inventory(html_path)

    # FIX WINDOWS : forcer UTF-8 explicitement
    json_out = Path('inventory_raw.json')
    json_out.write_text(json.dumps(report, indent=2, ensure_ascii=False), encoding='utf-8')
    print(f"   [OK] JSON brut : {json_out}")

    md_out = Path('inventory_report.md')
    md_out.write_text(render_markdown_report(report), encoding='utf-8')
    print(f"   [OK] Rapport Markdown : {md_out}")

    print()
    print(f"[STATS] Synthese :")
    print(f"   - Fonctions identifiees : {report['summary']['total_functions_identified']}")
    print(f"   - LOC estimees : {report['summary']['total_estimated_loc']:,}")
    print()
    print("Ouvre inventory_report.md pour le detail.")


if __name__ == '__main__':
    main()
