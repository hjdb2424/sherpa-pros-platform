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
import { readdirSync, statSync, mkdirSync, writeFileSync, readFileSync } from "node:fs";
import { join, dirname, relative, basename } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const DOCS_DIR = join(ROOT, "docs");
const PDF_DIR = join(ROOT, "docs-pdf");
const CSS_FILE = join(__dirname, "docs-pdf-editorial.css");
const BATCH_SIZE = 5;
const CSS_CONTENT = readFileSync(CSS_FILE, "utf8");
const FONTS_LINK = '<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght,SOFT,WONK@9..144,300..900,0..100,0..1&family=Manrope:wght@300..800&family=Barlow+Condensed:wght@500;700;900&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">';
const SCREEN_CSS = `body{max-width:760px;margin:0 auto;padding:64px 48px 96px;background:#FBF7EE;color:#1a1a2e;font-family:'Manrope',-apple-system,BlinkMacSystemFont,sans-serif;font-size:16px;line-height:1.65}@media (max-width:768px){body{padding:36px 22px 64px;font-size:15px}}.doc-nav{position:sticky;top:0;background:rgba(251,247,238,0.95);backdrop-filter:blur(8px);margin:-64px -48px 32px;padding:14px 48px;border-bottom:1px solid #E8E0CC;font-family:'Barlow Condensed',sans-serif;font-size:13px;letter-spacing:2px;text-transform:uppercase;font-weight:700;display:flex;justify-content:space-between;align-items:center;z-index:100}.doc-nav a{color:#1a1a2e;text-decoration:none;border-bottom:1px solid transparent;transition:border-color .15s}.doc-nav a:hover{border-bottom-color:#FF4500}.doc-nav .pdf-link{color:#FF4500}@media (max-width:768px){.doc-nav{margin:-36px -22px 24px;padding:12px 22px;font-size:11px;letter-spacing:1.5px}}`;

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
  const pdfFile = join(PDF_DIR, relPath.replace(/\.md$/, ".pdf"));
  const htmlFile = join(PDF_DIR, relPath.replace(/\.md$/, ".html"));
  mkdirSync(dirname(pdfFile), { recursive: true });

  try {
    await mdToPdf(
      { path: mdFile },
      {
        dest: pdfFile,
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

    const htmlOut = await mdToPdf(
      { path: mdFile },
      { as_html: true, marked_options: { gfm: true } }
    );
    const bodyMatch = (htmlOut?.content || "").match(/<body[^>]*>([\s\S]*)<\/body>/i);
    const bodyHtml = bodyMatch ? bodyMatch[1] : (htmlOut?.content || "");
    const title = basename(relPath, ".md").replace(/[-_]/g, " ");
    const pdfHref = basename(pdfFile);
    const indexHref = relPath.split("/").map(() => "..").join("/") + "/index.html";
    const screenHtml = `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} — Sherpa Pros</title>
<link rel="icon" href="${indexHref.replace("/index.html", "")}/../public/favicon.ico">
${FONTS_LINK}
<style>${CSS_CONTENT}</style>
<style>${SCREEN_CSS}</style>
</head>
<body>
<nav class="doc-nav">
  <a href="${indexHref}">← All Deliverables</a>
  <a class="pdf-link" href="${pdfHref}">Download PDF →</a>
</nav>
${bodyHtml}
</body>
</html>`;
    writeFileSync(htmlFile, screenHtml);
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
