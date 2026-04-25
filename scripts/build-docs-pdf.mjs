#!/usr/bin/env node
/**
 * Sherpa Pros — Build PDFs from docs/
 *
 * Walks docs/ recursively, generates a parallel docs-pdf/ tree with one PDF
 * per .md file. Uses md-to-pdf (Puppeteer + Chrome) with a custom print stylesheet.
 *
 * Run: npm run docs:pdf
 *
 * Output: docs-pdf/<same-tree-as-docs>/<file>.pdf
 *
 * Notes:
 * - PDFs are NOT committed to git (see .gitignore — docs-pdf/ ignored)
 * - First run downloads ~200MB of Chromium via Puppeteer postinstall
 * - Subsequent runs are fast (~3-8 sec per file)
 * - Processes 5 files in parallel to balance speed and memory
 */

import { mdToPdf } from "md-to-pdf";
import { readdirSync, statSync, mkdirSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DOCS_DIR = join(ROOT, "docs");
const PDF_DIR = join(ROOT, "docs-pdf");
const CSS_FILE = join(__dirname, "docs-pdf-editorial.css");
const BATCH_SIZE = 5;

function findMarkdownFiles(dir) {
  const results = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      results.push(...findMarkdownFiles(full));
    } else if (entry.endsWith(".md")) {
      results.push(full);
    }
  }
  return results;
}

async function generatePdf(mdFile) {
  const relPath = relative(DOCS_DIR, mdFile);
  const outFile = join(PDF_DIR, relPath.replace(/\.md$/, ".pdf"));
  mkdirSync(dirname(outFile), { recursive: true });

  try {
    await mdToPdf(
      { path: mdFile },
      {
        dest: outFile,
        stylesheet: [CSS_FILE],
        pdf_options: {
          format: "Letter",
          margin: { top: "0.75in", right: "0.75in", bottom: "0.85in", left: "0.75in" },
          printBackground: true,
          displayHeaderFooter: true,
          headerTemplate: "<div></div>",
          footerTemplate:
            '<div style="font-size:8pt; color:#888; width:100%; padding:0 0.75in; display:flex; justify-content:space-between;">' +
            '<span style="font-family:sans-serif;">Sherpa Pros · ' + relPath + "</span>" +
            '<span class="pageNumber"></span> / <span class="totalPages"></span>' +
            "</div>",
        },
        marked_options: {
          gfm: true,
        },
      }
    );
    return { ok: true, file: relPath };
  } catch (err) {
    return { ok: false, file: relPath, error: err.message };
  }
}

const files = findMarkdownFiles(DOCS_DIR);
console.log(`Found ${files.length} markdown files in ${DOCS_DIR}`);
console.log(`Generating PDFs to ${PDF_DIR}\n`);

const start = Date.now();
let ok = 0;
let failed = 0;
const errors = [];

for (let i = 0; i < files.length; i += BATCH_SIZE) {
  const batch = files.slice(i, i + BATCH_SIZE);
  const results = await Promise.all(batch.map(generatePdf));
  for (const r of results) {
    if (r.ok) {
      console.log(`  ✓ ${r.file}`);
      ok++;
    } else {
      console.log(`  ✗ ${r.file} — ${r.error}`);
      failed++;
      errors.push(r);
    }
  }
}

const elapsed = ((Date.now() - start) / 1000).toFixed(1);
console.log(`\nDone in ${elapsed}s. Success: ${ok}, Failed: ${failed}`);
if (failed > 0) {
  console.log("\nFailed files:");
  for (const e of errors) console.log(`  ${e.file}: ${e.error}`);
  process.exit(1);
}
