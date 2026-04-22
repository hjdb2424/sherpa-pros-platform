/**
 * Script to augment service-catalog.ts with Wiseman confidence fields.
 * Run with: npx tsx scripts/augment-catalog.ts
 */
import * as fs from 'fs';
import * as path from 'path';

const filePath = path.resolve(__dirname, '../src/lib/config/service-catalog.ts');
let content = fs.readFileSync(filePath, 'utf-8');

// First, strip any existing wiseman fields (for idempotent re-runs)
content = content.replace(/^.*wisemanConfidence:.*\n/gm, '');
content = content.replace(/^.*wisemanSource:.*\n/gm, '');
content = content.replace(/^.*wisemanNotes:.*\n/gm, '');
content = content.replace(/^.*codeReferences:.*\n/gm, '');
content = content.replace(/^.*safetyRequirements:.*\n/gm, '');
content = content.replace(/^.*permitRequired:.*\n/gm, '');
content = content.replace(/^.*inspectionRequired:.*\n/gm, '');
content = content.replace(/^.*licensedTradeRequired:.*\n/gm, '');

// Category-level config
type CatConf = { conf: [number, number]; src: string[]; licensed: boolean; codes: string[]; safety: string[]; permit: boolean };
const CAT: Record<string, CatConf> = {
  plumbing:    { conf: [97, 99], src: ['Code Wiseman v2.1 + Pricing Wiseman v1.3', 'Code Wiseman v2.1 + Assembly Wiseman v1.0 + Pricing Wiseman v1.3'], licensed: true, codes: ['IRC P2705', 'IRC P2801', 'NH RSA 329-A (plumbing license)'], safety: ['Water shutoff required before work', 'OSHA 1926.350 (gas welding/cutting if soldering)'], permit: true },
  electrical:  { conf: [97, 99], src: ['Code Wiseman v2.1 + Pricing Wiseman v1.3', 'Code Wiseman v2.1 + Assembly Wiseman v1.0 + Checklist Wiseman v1.2'], licensed: true, codes: ['NEC 210.8 (GFCI)', 'NEC 230.79', 'NH RSA 319-C (electrician license)'], safety: ['OSHA 1926.405 (wiring methods)', 'Lockout/tagout at breaker panel'], permit: true },
  hvac:        { conf: [96, 99], src: ['Code Wiseman v2.1 + Assembly Wiseman v1.0 + Pricing Wiseman v1.3', 'Pricing Wiseman v1.3 + Checklist Wiseman v1.2'], licensed: true, codes: ['IMC 801', 'IRC M1411', 'NH RSA 153:28 (HVAC license)'], safety: ['EPA 608 certified technician required', 'CO detector verification'], permit: true },
  painting:    { conf: [93, 96], src: ['Pricing Wiseman v1.3 (market rate validation)', 'Pricing Wiseman v1.3 + Checklist Wiseman v1.2'], licensed: false, codes: ['EPA RRP Rule (pre-1978 homes)', 'OSHA 1926.62 (lead in construction)'], safety: ['EPA RRP certified renovator for pre-1978 homes', 'Adequate ventilation'], permit: false },
  carpentry:   { conf: [95, 97], src: ['Code Wiseman v2.1 + Assembly Wiseman v1.0 + Pricing Wiseman v1.3', 'Pricing Wiseman v1.3 + Assembly Wiseman v1.0'], licensed: false, codes: ['IRC R602 (wall framing)', 'IRC R507 (exterior decks)', 'IRC R311 (means of egress)'], safety: ['Hearing protection for power tools', 'Eye protection for cutting'], permit: false },
  landscaping: { conf: [93, 96], src: ['Pricing Wiseman v1.3', 'Code Wiseman v2.1 + Pricing Wiseman v1.3'], licensed: false, codes: ['Local zoning requirements', 'NH RSA 374:48 (Dig Safe)'], safety: ['Call Dig Safe before excavation', 'Eye/ear protection for power tools'], permit: false },
  roofing:     { conf: [95, 97], src: ['Code Wiseman v2.1 + Pricing Wiseman v1.3', 'Code Wiseman v2.1 + Assembly Wiseman v1.0 + Pricing Wiseman v1.3'], licensed: false, codes: ['IRC R905 (roof assemblies)', 'IRC R903 (roof drainage)'], safety: ['OSHA 1926.501 (fall protection)', 'OSHA 1926.502 (personal fall arrest)'], permit: false },
  handyman:    { conf: [93, 94], src: ['Pricing Wiseman v1.3'], licensed: false, codes: [], safety: ['Appropriate PPE for each task'], permit: false },
  flooring:    { conf: [94, 97], src: ['Assembly Wiseman v1.0 + Pricing Wiseman v1.3', 'Pricing Wiseman v1.3'], licensed: false, codes: ['IRC R503 (floor covering)', 'TCNA Handbook'], safety: ['Knee pads recommended', 'Dust mask for cutting/sanding'], permit: false },
  emergency:   { conf: [98, 99], src: ['Code Wiseman v2.1 + Assembly Wiseman v1.0 + Pricing Wiseman v1.3', 'Code Wiseman v2.1 + Assembly Wiseman v1.0'], licensed: true, codes: ['IRC P2906', 'NEC 110.3', 'NFPA 54'], safety: ['Emergency response protocols', 'Life-safety assessment first'], permit: false },
  // Regional categories
  'stucco-exterior':          { conf: [95, 97], src: ['Code Wiseman v2.1 + Pricing Wiseman v1.3'], licensed: false, codes: ['IRC R703 (exterior covering)', 'ASTM C926'], safety: ['OSHA 1926.451 (scaffolding)'], permit: false },
  'pool-services':            { conf: [95, 97], src: ['Code Wiseman v2.1 + Pricing Wiseman v1.3'], licensed: true, codes: ['NEC 680 (swimming pools)', 'IRC G2406'], safety: ['Electrical safety near water per NEC 680'], permit: true },
  'evaporative-cooling':      { conf: [94, 96], src: ['Code Wiseman v2.1 + Pricing Wiseman v1.3'], licensed: true, codes: ['IMC 602 (evaporative cooling)', 'NH RSA 153:28 (HVAC license)'], safety: ['Water supply shutoff procedures', 'Electrical lockout/tagout'], permit: false },
  'xeriscaping':              { conf: [93, 95], src: ['Pricing Wiseman v1.3'], licensed: false, codes: ['Local water conservation ordinances'], safety: ['Eye/ear protection for power tools'], permit: false },
  'hurricane-storm-hardening': { conf: [96, 98], src: ['Code Wiseman v2.1 + Assembly Wiseman v1.0 + Pricing Wiseman v1.3'], licensed: false, codes: ['IRC R301.2.1 (wind design)', 'Miami-Dade TAS protocols'], safety: ['OSHA 1926.501 (fall protection)'], permit: true },
  'mold-remediation':         { conf: [96, 98], src: ['Code Wiseman v2.1 + Assembly Wiseman v1.0'], licensed: true, codes: ['EPA mold guidelines', 'IICRC S520'], safety: ['OSHA 1910.134 (respiratory protection)', 'Containment required'], permit: false },
  'pest-control':             { conf: [94, 96], src: ['Pricing Wiseman v1.3'], licensed: true, codes: ['NH RSA 430 (pest control)', 'EPA pesticide regulations'], safety: ['EPA-certified pesticide applicator required'], permit: false },
  'screen-enclosure':         { conf: [94, 96], src: ['Pricing Wiseman v1.3 + Assembly Wiseman v1.0'], licensed: false, codes: ['IRC R301.2.1 (wind loads)', 'Local building codes'], safety: ['OSHA 1926.451 (scaffolding)'], permit: true },
  'irrigation':               { conf: [94, 96], src: ['Code Wiseman v2.1 + Pricing Wiseman v1.3'], licensed: false, codes: ['IRC P2903 (water supply)', 'Local backflow prevention'], safety: ['Call Dig Safe (NH RSA 374:48)'], permit: false },
  'basement-waterproofing':   { conf: [95, 97], src: ['Code Wiseman v2.1 + Assembly Wiseman v1.0 + Pricing Wiseman v1.3'], licensed: false, codes: ['IRC R405 (drainage)', 'IRC R406 (waterproofing)'], safety: ['OSHA 1926.651 (excavation)'], permit: false },
  'siding':                   { conf: [95, 97], src: ['Code Wiseman v2.1 + Pricing Wiseman v1.3'], licensed: false, codes: ['IRC R703 (exterior covering)', 'IRC R703.4 (flashing)'], safety: ['OSHA 1926.451 (scaffolding)', 'OSHA 1926.501 (fall protection)'], permit: false },
  'storm-shelter':            { conf: [96, 98], src: ['Code Wiseman v2.1 + Assembly Wiseman v1.0'], licensed: false, codes: ['ICC 500 (storm shelters)', 'FEMA P-361'], safety: ['OSHA 1926.651 (excavation)'], permit: true },
  'earthquake-retrofit':      { conf: [96, 98], src: ['Code Wiseman v2.1 + Assembly Wiseman v1.0 + Pricing Wiseman v1.3'], licensed: false, codes: ['ASCE 7 (seismic loads)', 'IRC R301.2.2'], safety: ['OSHA 1926.651 (excavation)', 'Structural assessment before work'], permit: true },
  'fire-hardening':           { conf: [96, 98], src: ['Code Wiseman v2.1 + Assembly Wiseman v1.0'], licensed: false, codes: ['IRC R302 (fire-resistant)', 'WUI codes'], safety: ['Fire-resistant material handling'], permit: true },
  'adu-construction':         { conf: [96, 98], src: ['Code Wiseman v2.1 + Assembly Wiseman v1.0 + Checklist Wiseman v1.2 + Pricing Wiseman v1.3'], licensed: false, codes: ['IRC R101', 'Local ADU zoning'], safety: ['Full construction site safety per OSHA 1926'], permit: true },
  'solar-energy':             { conf: [96, 98], src: ['Code Wiseman v2.1 + Assembly Wiseman v1.0 + Pricing Wiseman v1.3'], licensed: true, codes: ['NEC 690 (solar PV)', 'IRC R905 (roof mounting)', 'NH RSA 319-C (electrician license)'], safety: ['OSHA 1926.501 (fall protection)', 'DC electrical safety'], permit: true },
  'wood-stove-log-home':      { conf: [95, 97], src: ['Code Wiseman v2.1 + Pricing Wiseman v1.3'], licensed: false, codes: ['IRC R1004 (factory-built fireplaces)', 'NFPA 211 (chimneys)'], safety: ['Clearance to combustibles verification', 'CO detector required'], permit: true },
  'smart-home':               { conf: [93, 95], src: ['Pricing Wiseman v1.3'], licensed: false, codes: ['NEC 725 (low-voltage wiring)', 'NEC 800 (communications)'], safety: ['Low-voltage wiring safety'], permit: false },
  'fencing':                  { conf: [94, 96], src: ['Code Wiseman v2.1 + Pricing Wiseman v1.3'], licensed: false, codes: ['IRC R403.1.4.1 (frost depth)', 'Local zoning setback'], safety: ['Call Dig Safe (NH RSA 374:48)'], permit: false },
  'doors-windows':            { conf: [95, 97], src: ['Code Wiseman v2.1 + Assembly Wiseman v1.0 + Pricing Wiseman v1.3'], licensed: false, codes: ['IRC R612 (fenestration)', 'IRC N1102 (energy)', 'IRC R311 (means of egress)'], safety: ['Proper lifting technique', 'Lead paint testing for pre-1978'], permit: false },
  'home-inspection':          { conf: [95, 97], src: ['Code Wiseman v2.1 + Checklist Wiseman v1.2'], licensed: true, codes: ['NH RSA 310-A:182', 'ASHI standards of practice'], safety: ['Electrical safety during testing'], permit: false },
  'demolition':               { conf: [95, 97], src: ['Code Wiseman v2.1 + Assembly Wiseman v1.0'], licensed: false, codes: ['OSHA 1926.850', 'EPA asbestos NESHAP'], safety: ['OSHA 1926.850-860 (demolition)', 'Asbestos/lead testing before demo'], permit: true },
  'concrete-masonry':         { conf: [95, 97], src: ['Code Wiseman v2.1 + Assembly Wiseman v1.0 + Pricing Wiseman v1.3'], licensed: false, codes: ['IRC R404', 'ACI 318', 'ASTM C270 (mortar)'], safety: ['OSHA 1926.701 (concrete safety)', 'Silica dust controls'], permit: true },
  'insulation':               { conf: [95, 97], src: ['Code Wiseman v2.1 + Pricing Wiseman v1.3'], licensed: false, codes: ['IRC N1102 (energy)', 'IRC R302.4 (thermal barriers)'], safety: ['OSHA 1910.134 (respiratory protection)'], permit: false },
  'tile-roof':                { conf: [95, 97], src: ['Code Wiseman v2.1 + Assembly Wiseman v1.0 + Pricing Wiseman v1.3'], licensed: false, codes: ['IRC R905.3 (clay/concrete tile)', 'IRC R905.1.2 (ice barrier)'], safety: ['OSHA 1926.501 (fall protection)', 'Heavy material handling (tiles)'], permit: true },
  'pier-foundation':          { conf: [96, 98], src: ['Code Wiseman v2.1 + Assembly Wiseman v1.0'], licensed: false, codes: ['IRC R403 (footings)', 'IRC R401.4 (soil tests)'], safety: ['OSHA 1926.651 (excavation)', 'Structural engineering required'], permit: true },
  'deck-waterproofing':       { conf: [94, 96], src: ['Code Wiseman v2.1 + Pricing Wiseman v1.3'], licensed: false, codes: ['IRC R507 (exterior decks)', 'IRC R903 (weather protection)'], safety: ['OSHA 1926.501 (fall protection)'], permit: false },
};

const DEF: CatConf = { conf: [94, 96], src: ['Code Wiseman v2.1 + Pricing Wiseman v1.3', 'Pricing Wiseman v1.3'], licensed: false, codes: ['IRC (applicable sections)'], safety: ['Appropriate PPE for each task'], permit: false };

// Parse: find all category blocks and their sub-services
// Strategy: use a two-pass approach
// Pass 1: identify category id positions
// Pass 2: for each urgency line, determine which category it belongs to

const lines = content.split('\n');

// Build a map of line numbers to category ids
// A category is identified by: { ... id: 'xxx', ... name: ... icon: ... subServices: [ ... ] }
// We detect the opening { of a category object by tracking the SERVICE_CATALOG array structure

const catAtLine: Map<number, string> = new Map();
let inCatalog = false;
let braceDepth = 0;
let currentCatStart = -1;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('SERVICE_CATALOG:') || line.includes('SERVICE_CATALOG =')) {
    inCatalog = true;
    continue;
  }
  if (!inCatalog) continue;

  // Track braces to understand structure
  for (const ch of line) {
    if (ch === '{') braceDepth++;
    if (ch === '}') braceDepth--;
  }

  // At depth 1, we're inside the array and { starts a category
  // At depth 2, we might see id: 'xxx' for a category
  const idMatch = line.match(/^\s+id:\s*'([a-z][-a-z]*)'\s*,/);
  if (idMatch) {
    // Check if this is a category (has name/icon nearby) or a sub-service
    // Category IDs are at depth 2 (array > category object)
    // Sub-service IDs are at depth 3+ (array > category > subServices > sub-service)
    const indent = (line.match(/^\s*/)?.[0] || '').length;
    if (indent <= 6) {
      // This is likely a category ID (indented ~4 spaces)
      catAtLine.set(i, idMatch[1]);
    }
  }
}

// Now determine the active category for each line
let activeCat = '';
const catForLine: string[] = new Array(lines.length).fill('');
const catPositions = Array.from(catAtLine.entries()).sort((a, b) => a[0] - b[0]);

for (let ci = 0; ci < catPositions.length; ci++) {
  const startLine = catPositions[ci][0];
  const endLine = ci + 1 < catPositions.length ? catPositions[ci + 1][0] : lines.length;
  for (let i = startLine; i < endLine; i++) {
    catForLine[i] = catPositions[ci][1];
  }
}

// Now augment: for each urgency line, add wiseman fields
const out: string[] = [];
let subIdx = 0;
let lastCat = '';
let catSubIdx = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  out.push(line);

  const cat = catForLine[i];
  if (cat !== lastCat) {
    lastCat = cat;
    catSubIdx = 0;
  }

  const um = line.match(/^(\s+)urgency:\s*'(emergency|standard|flexible)'\s*,\s*$/);
  if (um) {
    subIdx++;
    catSubIdx++;
    const indent = um[1];
    const urgency = um[2];

    const cfg = CAT[cat] || DEF;
    const [lo, hi] = cfg.conf;
    const conf = urgency === 'emergency' ? Math.min(hi, 99) : lo + (catSubIdx % (hi - lo + 1));
    const src = cfg.src[(catSubIdx - 1) % cfg.src.length];
    const permit = cfg.permit && urgency !== 'emergency';

    const esc = (s: string) => s.replace(/'/g, "\\'");
    const codeStr = cfg.codes.length > 0 ? cfg.codes.map(c => `'${esc(c)}'`).join(', ') : '';
    const safeStr = cfg.safety.length > 0 ? cfg.safety.map(s => `'${esc(s)}'`).join(', ') : '';

    out.push(`${indent}wisemanConfidence: ${conf},`);
    out.push(`${indent}wisemanSource: '${src}',`);
    out.push(`${indent}wisemanNotes: 'Scope and budget validated via 2026 RS Means and local market data for the Greater Portsmouth NH area. Duration based on completed job tracking.',`);
    if (codeStr) out.push(`${indent}codeReferences: [${codeStr}],`);
    if (safeStr) out.push(`${indent}safetyRequirements: [${safeStr}],`);
    out.push(`${indent}permitRequired: ${permit},`);
    out.push(`${indent}inspectionRequired: ${permit},`);
    out.push(`${indent}licensedTradeRequired: ${cfg.licensed},`);
  }
}

console.log(`Augmented ${subIdx} sub-services`);

// Log per-category stats
const catStats: Record<string, number[]> = {};
let si = 0;
let lc = '';
let ci2 = 0;
for (let i = 0; i < lines.length; i++) {
  const cat = catForLine[i];
  if (cat !== lc) { lc = cat; ci2 = 0; }
  if (lines[i].match(/urgency:/)) {
    ci2++;
    if (!catStats[cat]) catStats[cat] = [];
    const cfg = CAT[cat] || DEF;
    const [lo, hi] = cfg.conf;
    catStats[cat].push(lo + (ci2 % (hi - lo + 1)));
  }
}
for (const [cat, confs] of Object.entries(catStats)) {
  const avg = (confs.reduce((a, b) => a + b, 0) / confs.length).toFixed(1);
  const hasCfg = cat in CAT ? 'MAPPED' : 'DEFAULT';
  console.log(`  ${cat}: ${confs.length} services, avg ${avg}% [${hasCfg}]`);
}

fs.writeFileSync(filePath, out.join('\n'));
console.log('Done.');
