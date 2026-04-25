#!/usr/bin/env node
/**
 * Sherpa Pros — Build categorized binder PDFs from docs/
 *
 * Reads `binder-manifest.mjs`. For each binder defined there, concatenates the
 * referenced markdown files into one combined markdown (with cover page + TOC
 * + page breaks between docs), then runs md-to-pdf to produce one binder PDF.
 *
 * Run: npm run docs:binders
 *
 * Output: docs-pdf/binders/<slug>.pdf
 *
 * Notes:
 * - Combined markdown is held in memory (not written to disk)
 * - Each section gets a numbered cover (I, II, III...) before its docs
 * - Each doc gets a page break before it
 * - Footer: "Sherpa Pros · {binder title} · page X / Y"
 */

import { mdToPdf } from "md-to-pdf";
import { readFileSync, mkdirSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { BINDERS } from "./binder-manifest.mjs";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DOCS_DIR = join(ROOT, "docs");
const BINDERS_DIR = join(ROOT, "docs-pdf", "binders");
const CSS_FILE = join(__dirname, "docs-pdf-editorial.css");

const PAGE_BREAK = '\n\n<div style="page-break-after: always;"></div>\n\n';

const BUILD_DATE = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const ARCHIVE_URL = "https://www.thesherpapros.com/";

// Roman numeral conversion for Part labels on section dividers
function toRoman(num) {
  const map = [
    ["M", 1000], ["CM", 900], ["D", 500], ["CD", 400],
    ["C", 100], ["XC", 90], ["L", 50], ["XL", 40],
    ["X", 10], ["IX", 9], ["V", 5], ["IV", 4], ["I", 1],
  ];
  let result = "";
  let n = num;
  for (const [letter, value] of map) {
    while (n >= value) {
      result += letter;
      n -= value;
    }
  }
  return result;
}

// Strip leading roman-numeral + period from manifest section names
// (manifest uses "I. Strategy" — we want "Strategy" + standalone "PART I")
function stripRomanPrefix(name) {
  return name.replace(/^[IVX]+\.\s*/, "");
}

/**
 * COVER PAGE — full-page editorial composition.
 *
 * Composition (top-to-bottom):
 *   1. Top-right diagonal sky-blue cut accent (logo reference)
 *   2. Eyebrow: small-caps "SHERPA PROS · PHASE 0 BINDER" (body grotesque, navy, 4pt tracking)
 *   3. Thin sky-blue full-width rule
 *   4. HUGE display-serif title (~96pt, navy, line-height 0.95)
 *   5. Italic display-serif subtitle (24pt, slate)
 *   6. Justified body grotesque description (14pt, max 60% width)
 *   7. Three-column lower-third meta block (PUBLISHED / DOCUMENTS / ARCHIVE)
 *   8. Thin amber rule + italic display-serif tagline at the foot
 *
 * NOTE on diagonal: Puppeteer's printed PDFs reliably render CSS `clip-path`
 * polygons and rotated absolutely-positioned blocks, but SVG accents inside
 * markdown are unreliable through md-to-pdf's marked pipeline. We use a
 * positioned `<div>` with `clip-path: polygon(...)` for the diagonal cut.
 */
function buildCoverPage(binder, totalSections, totalDocs) {
  return `<div class="sp-cover">
<style>
  .sp-cover {
    position: relative;
    height: 9.75in;
    margin: 0;
    padding: 0;
    page-break-after: always;
    overflow: hidden;
    font-family: 'Inter', 'Helvetica Neue', system-ui, sans-serif;
    color: #1a1a2e;
  }
  .sp-cover .sp-diag {
    position: absolute;
    top: 0;
    right: 0;
    width: 2.4in;
    height: 1.6in;
    background: #00a9e0;
    clip-path: polygon(100% 0, 0 0, 100% 100%);
  }
  .sp-cover .sp-eyebrow {
    margin-top: 0.55in;
    font-size: 9pt;
    letter-spacing: 4pt;
    text-transform: uppercase;
    font-weight: 600;
    color: #1a1a2e;
  }
  .sp-cover .sp-rule-top {
    height: 1px;
    background: #00a9e0;
    width: 100%;
    margin-top: 14pt;
    margin-bottom: 0;
  }
  .sp-cover .sp-title {
    font-family: 'Canela', 'Tiempos Headline', 'Playfair Display', Georgia, serif;
    font-weight: 600;
    font-size: 88pt;
    line-height: 0.95;
    letter-spacing: -2pt;
    color: #1a1a2e;
    margin-top: 0.55in;
    margin-bottom: 0;
    max-width: 6.6in;
  }
  .sp-cover .sp-subtitle {
    font-family: 'Canela', 'Tiempos Headline', 'Playfair Display', Georgia, serif;
    font-style: italic;
    font-weight: 400;
    font-size: 24pt;
    line-height: 1.25;
    color: #64748b;
    margin-top: 28pt;
    max-width: 6.4in;
  }
  .sp-cover .sp-description {
    font-family: 'Inter', 'Helvetica Neue', system-ui, sans-serif;
    font-size: 12pt;
    line-height: 1.6;
    color: #1a1a2e;
    text-align: justify;
    max-width: 60%;
    margin-top: 0.55in;
  }
  .sp-cover .sp-meta {
    position: absolute;
    bottom: 1.05in;
    left: 0;
    right: 0;
    display: flex;
    justify-content: space-between;
    gap: 0.4in;
    border-top: 0.5pt solid #e6e8ec;
    padding-top: 18pt;
  }
  .sp-cover .sp-meta-col {
    flex: 1;
  }
  .sp-cover .sp-meta-label {
    font-size: 8pt;
    letter-spacing: 2.4pt;
    text-transform: uppercase;
    color: #64748b;
    font-weight: 600;
    margin-bottom: 6pt;
  }
  .sp-cover .sp-meta-value {
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 10.5pt;
    color: #1a1a2e;
    font-weight: 500;
    line-height: 1.4;
  }
  .sp-cover .sp-meta-value.mono {
    font-family: 'JetBrains Mono', 'IBM Plex Mono', Menlo, monospace;
    font-size: 9pt;
  }
  .sp-cover .sp-rule-bottom {
    position: absolute;
    bottom: 0.55in;
    left: 0;
    right: 0;
    height: 1px;
    background: #f59e0b;
  }
  .sp-cover .sp-tagline {
    position: absolute;
    bottom: 0.2in;
    left: 0;
    right: 0;
    font-family: 'Canela', 'Tiempos Headline', 'Playfair Display', Georgia, serif;
    font-style: italic;
    font-size: 11pt;
    color: #1a1a2e;
    text-align: left;
  }
</style>

<div class="sp-diag"></div>

<div class="sp-eyebrow">SHERPA&nbsp;PROS&nbsp;&nbsp;·&nbsp;&nbsp;PHASE&nbsp;0&nbsp;BINDER</div>
<div class="sp-rule-top"></div>

<div class="sp-title">${binder.title}</div>

<div class="sp-subtitle">${binder.subtitle}</div>

<div class="sp-description">${binder.description}</div>

<div class="sp-meta">
  <div class="sp-meta-col">
    <div class="sp-meta-label">Published</div>
    <div class="sp-meta-value">${BUILD_DATE}</div>
  </div>
  <div class="sp-meta-col">
    <div class="sp-meta-label">Documents</div>
    <div class="sp-meta-value">${totalDocs} documents · ${totalSections} sections</div>
  </div>
  <div class="sp-meta-col">
    <div class="sp-meta-label">Archive</div>
    <div class="sp-meta-value mono">${ARCHIVE_URL}</div>
  </div>
</div>

<div class="sp-rule-bottom"></div>
<div class="sp-tagline"><em>The licensed-trade marketplace, built by a working contractor.</em></div>

</div>${PAGE_BREAK}`;
}

/**
 * TABLE OF CONTENTS — editorial composition.
 *
 * Replaces the auto-numbered bullet list with:
 *   - Eyebrow: "SHERPA PROS · CONTENTS"
 *   - Big display-serif "Contents" title (60pt)
 *   - Per-section: oversized roman numeral + small-caps section name
 *   - Per-document: title + dotted-leader-style page reference (placeholder for V2)
 *
 * NOTE: md-to-pdf has no native cross-reference / page-number injection.
 * We render document titles only — no page numbers — relying on the section
 * dividers and document headers downstream for navigation. This is closer
 * to a magazine TOC (where the eye scans titles, not page-numbers) than to
 * a textbook TOC.
 */
function buildToc(binder) {
  const sectionsHtml = binder.sections
    .map((section, i) => {
      const sectionTitle = stripRomanPrefix(section.name);
      const roman = toRoman(i + 1);
      const docs = section.files
        .map((file) => {
          const fileName = file.split("/").pop().replace(/\.md$/, "");
          const display = fileName
            .replace(/-/g, " ")
            .replace(/\b\w/g, (c) => c.toUpperCase());
          return `      <li class="sp-toc-doc">
        <span class="sp-toc-doc-title">${display}</span>
        <span class="sp-toc-doc-leader"></span>
        <span class="sp-toc-doc-ref">in&nbsp;Part&nbsp;${roman}</span>
      </li>`;
        })
        .join("\n");
      return `  <li class="sp-toc-section">
    <div class="sp-toc-section-head">
      <span class="sp-toc-roman">${roman}.</span>
      <span class="sp-toc-section-name">${sectionTitle}</span>
    </div>
    <ul class="sp-toc-doc-list">
${docs}
    </ul>
  </li>`;
    })
    .join("\n");

  return `<div class="sp-toc">
<style>
  .sp-toc {
    position: relative;
    page-break-after: always;
    font-family: 'Inter', 'Helvetica Neue', system-ui, sans-serif;
    color: #1a1a2e;
    padding-top: 0.4in;
  }
  .sp-toc .sp-toc-eyebrow {
    font-size: 9pt;
    letter-spacing: 4pt;
    text-transform: uppercase;
    font-weight: 600;
    color: #1a1a2e;
    margin-bottom: 12pt;
  }
  .sp-toc .sp-toc-rule {
    height: 1px;
    background: #00a9e0;
    width: 100%;
    margin-bottom: 28pt;
  }
  .sp-toc .sp-toc-title {
    font-family: 'Canela', 'Tiempos Headline', 'Playfair Display', Georgia, serif;
    font-weight: 600;
    font-size: 60pt;
    line-height: 1.0;
    letter-spacing: -1.5pt;
    color: #1a1a2e;
    margin: 0 0 36pt 0;
  }
  .sp-toc .sp-toc-list {
    list-style: none;
    margin: 0;
    padding: 0;
  }
  .sp-toc .sp-toc-section {
    margin-bottom: 22pt;
    page-break-inside: avoid;
  }
  .sp-toc .sp-toc-section-head {
    display: flex;
    align-items: baseline;
    gap: 14pt;
    border-bottom: 0.5pt solid #e6e8ec;
    padding-bottom: 6pt;
    margin-bottom: 8pt;
  }
  .sp-toc .sp-toc-roman {
    font-family: 'Canela', 'Tiempos Headline', 'Playfair Display', Georgia, serif;
    font-size: 28pt;
    font-weight: 500;
    color: #00a9e0;
    line-height: 1;
    min-width: 0.7in;
  }
  .sp-toc .sp-toc-section-name {
    font-family: 'Inter', 'Helvetica Neue', sans-serif;
    font-size: 14pt;
    text-transform: uppercase;
    letter-spacing: 2.4pt;
    font-weight: 600;
    color: #1a1a2e;
  }
  .sp-toc .sp-toc-doc-list {
    list-style: none;
    margin: 0 0 0 0.7in;
    padding: 0;
  }
  .sp-toc .sp-toc-doc {
    display: flex;
    align-items: baseline;
    gap: 6pt;
    padding: 3pt 0;
    font-size: 11pt;
    color: #1a1a2e;
  }
  .sp-toc .sp-toc-doc-title {
    flex: 0 0 auto;
  }
  .sp-toc .sp-toc-doc-leader {
    flex: 1 1 auto;
    border-bottom: 0.5pt dotted #b8bcc4;
    margin: 0 4pt;
    transform: translateY(-3pt);
  }
  .sp-toc .sp-toc-doc-ref {
    flex: 0 0 auto;
    font-size: 9pt;
    color: #64748b;
    font-style: italic;
  }
</style>

<div class="sp-toc-eyebrow">SHERPA&nbsp;PROS&nbsp;&nbsp;·&nbsp;&nbsp;CONTENTS</div>
<div class="sp-toc-rule"></div>
<div class="sp-toc-title">Contents</div>

<ul class="sp-toc-list">
${sectionsHtml}
</ul>

</div>${PAGE_BREAK}`;
}

/**
 * SECTION DIVIDER — full-page magazine-style divider.
 *
 * Composition:
 *   - Top 30%: small-caps "PART [I/II/III…]" + thin sky-blue rule
 *   - Middle 40%: oversized display-serif section title + italic descriptor
 *   - Bottom 30%: negative space
 *   - Diagonal sky-blue cut accent in alternating top corner per section
 *     (odd → top-left, even → top-right) for visual rhythm
 */
function buildSectionDivider(name, sectionNum) {
  const cleanName = stripRomanPrefix(name);
  const roman = toRoman(sectionNum);
  const cornerClass = sectionNum % 2 === 1 ? "sp-diag-left" : "sp-diag-right";

  return `<div class="sp-divider">
<style>
  .sp-divider {
    position: relative;
    height: 9.75in;
    page-break-after: always;
    overflow: hidden;
    font-family: 'Inter', 'Helvetica Neue', system-ui, sans-serif;
    color: #1a1a2e;
  }
  .sp-divider .sp-diag-left {
    position: absolute;
    top: 0;
    left: 0;
    width: 2.0in;
    height: 1.4in;
    background: #00a9e0;
    clip-path: polygon(0 0, 100% 0, 0 100%);
  }
  .sp-divider .sp-diag-right {
    position: absolute;
    top: 0;
    right: 0;
    width: 2.0in;
    height: 1.4in;
    background: #00a9e0;
    clip-path: polygon(100% 0, 0 0, 100% 100%);
  }
  .sp-divider .sp-divider-top {
    position: absolute;
    top: 25%;
    left: 0;
    right: 0;
    text-align: center;
  }
  .sp-divider .sp-part-label {
    font-size: 10pt;
    letter-spacing: 5pt;
    text-transform: uppercase;
    font-weight: 600;
    color: #1a1a2e;
    margin-bottom: 14pt;
  }
  .sp-divider .sp-part-rule {
    height: 1px;
    width: 80pt;
    background: #00a9e0;
    margin: 0 auto;
  }
  .sp-divider .sp-divider-mid {
    position: absolute;
    top: 38%;
    left: 0;
    right: 0;
    text-align: center;
    padding: 0 1in;
  }
  .sp-divider .sp-divider-title {
    font-family: 'Canela', 'Tiempos Headline', 'Playfair Display', Georgia, serif;
    font-weight: 600;
    font-size: 56pt;
    line-height: 1.05;
    letter-spacing: -1.5pt;
    color: #1a1a2e;
    margin: 0;
  }
  .sp-divider .sp-divider-descriptor {
    font-family: 'Canela', 'Tiempos Headline', 'Playfair Display', Georgia, serif;
    font-style: italic;
    font-size: 16pt;
    color: #64748b;
    margin-top: 18pt;
  }
</style>

<div class="${cornerClass}"></div>

<div class="sp-divider-top">
  <div class="sp-part-label">Part&nbsp;${roman}</div>
  <div class="sp-part-rule"></div>
</div>

<div class="sp-divider-mid">
  <div class="sp-divider-title">${cleanName}</div>
  <div class="sp-divider-descriptor">Section ${sectionNum} of the binder.</div>
</div>

</div>${PAGE_BREAK}`;
}

function buildDocHeader(filePath) {
  // Editorial source-line: monospace path, hairline rule, navy. Used at the
  // top of every document so the reader can trace any printed page back to
  // its source markdown.
  return `<div style="font-family:'JetBrains Mono','IBM Plex Mono',Menlo,monospace; font-size:7.5pt; color:#64748b; letter-spacing:0.4pt; border-bottom:0.5pt solid #e6e8ec; padding-bottom:5pt; margin-bottom:18pt;">SOURCE&nbsp;&nbsp;·&nbsp;&nbsp;${filePath}</div>\n\n`;
}

function buildBinderMarkdown(binder) {
  const totalDocs = binder.sections.reduce((sum, s) => sum + s.files.length, 0);
  const parts = [];

  // Cover
  parts.push(buildCoverPage(binder, binder.sections.length, totalDocs));

  // TOC
  parts.push(buildToc(binder));

  // Sections + docs
  let sectionNum = 1;
  for (const section of binder.sections) {
    parts.push(buildSectionDivider(section.name, sectionNum));
    sectionNum++;

    for (const file of section.files) {
      const fullPath = join(DOCS_DIR, file);
      let content;
      try {
        content = readFileSync(fullPath, "utf8");
      } catch {
        console.warn(`  ⚠ Missing: ${file}`);
        content = `*Missing file: ${file}*`;
      }

      parts.push(buildDocHeader(file));
      parts.push(content);
      parts.push(PAGE_BREAK);
    }
  }

  return parts.join("\n");
}

async function buildBinder(binder) {
  const outFile = join(BINDERS_DIR, `${binder.slug}.pdf`);
  mkdirSync(BINDERS_DIR, { recursive: true });

  const combinedMd = buildBinderMarkdown(binder);
  const totalDocs = binder.sections.reduce((sum, s) => sum + s.files.length, 0);

  console.log(`Building: ${binder.slug} (${binder.sections.length} sections, ${totalDocs} docs)`);

  try {
    await mdToPdf(
      { content: combinedMd },
      {
        dest: outFile,
        stylesheet: [CSS_FILE],
        pdf_options: {
          format: "Letter",
          margin: { top: "0.75in", right: "0.75in", bottom: "0.85in", left: "0.75in" },
          printBackground: true,
          displayHeaderFooter: true,
          // Editorial header: small-caps eyebrow, dark navy, no rule on top.
          // Puppeteer print headers are rendered in an isolated context, so we
          // keep all styling inline and avoid web fonts (Helvetica Neue is
          // resolved by the system; the small caps come from letter-spacing).
          headerTemplate:
            '<div style="font-size:7.5pt; color:#1a1a2e; width:100%; padding:0 0.75in; ' +
            "font-family:'Helvetica Neue', Helvetica, Arial, sans-serif; letter-spacing:2.4pt; " +
            'text-transform:uppercase; font-weight:600; display:flex; justify-content:space-between; align-items:center;">' +
            "<span>Sherpa&nbsp;Pros</span>" +
            `<span>${binder.title}</span>` +
            "</div>",
          // Editorial footer: thin sky-blue rule above; navy small-caps left,
          // page X / Y right in same scale. Total height matches "bottom" margin.
          footerTemplate:
            '<div style="width:100%; padding:0 0.75in; ' +
            "font-family:'Helvetica Neue', Helvetica, Arial, sans-serif;\">" +
            '<div style="height:1px; background:#00a9e0; width:100%; margin-bottom:6pt;"></div>' +
            '<div style="font-size:7.5pt; color:#1a1a2e; letter-spacing:2.4pt; ' +
            'text-transform:uppercase; font-weight:600; display:flex; justify-content:space-between; align-items:center;">' +
            "<span>thesherpapros.com</span>" +
            '<span><span class="pageNumber"></span>&nbsp;/&nbsp;<span class="totalPages"></span></span>' +
            "</div>" +
            "</div>",
        },
        marked_options: { gfm: true },
      }
    );
    return { ok: true, slug: binder.slug, path: outFile };
  } catch (err) {
    return { ok: false, slug: binder.slug, error: err.message };
  }
}

console.log(`Building ${BINDERS.length} binders to ${BINDERS_DIR}\n`);
const start = Date.now();

const results = [];
for (const binder of BINDERS) {
  results.push(await buildBinder(binder));
}

const elapsed = ((Date.now() - start) / 1000).toFixed(1);
const ok = results.filter((r) => r.ok).length;
const failed = results.filter((r) => !r.ok).length;

console.log(`\nDone in ${elapsed}s. Success: ${ok}, Failed: ${failed}`);
for (const r of results) {
  if (r.ok) console.log(`  ✓ ${r.slug}.pdf`);
  else console.log(`  ✗ ${r.slug}: ${r.error}`);
}

if (failed > 0) process.exit(1);
