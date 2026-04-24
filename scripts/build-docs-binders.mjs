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
const CSS_FILE = join(__dirname, "docs-pdf.css");

const PAGE_BREAK = '\n\n<div style="page-break-after: always;"></div>\n\n';

const BUILD_DATE = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

function buildCoverPage(binder, totalSections, totalDocs) {
  return `<div style="text-align:center; padding-top:140px; font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">

<div style="font-size:13pt; letter-spacing:6pt; color:#888; margin-bottom:20pt;">SHERPA PROS</div>

<div style="font-size:36pt; font-weight:700; color:#00a9e0; line-height:1.1; margin-bottom:14pt;">${binder.title}</div>

<div style="font-size:14pt; color:#1a1a2e; font-style:italic; margin-bottom:48pt; max-width:520pt; margin-left:auto; margin-right:auto;">${binder.subtitle}</div>

<div style="height:1px; background:#00a9e0; width:80pt; margin:0 auto 24pt auto;"></div>

<div style="font-size:11pt; color:#444; max-width:480pt; margin:0 auto 60pt auto; line-height:1.55;">${binder.description}</div>

<div style="font-size:10pt; color:#666; line-height:1.8;">
<strong>Generated:</strong> ${BUILD_DATE}<br/>
<strong>Sections:</strong> ${totalSections}<br/>
<strong>Documents included:</strong> ${totalDocs}<br/>
<strong>Repository:</strong> github.com/hjdb2424/sherpa-pros-platform
</div>

<div style="position:absolute; bottom:80pt; left:0; right:0; text-align:center; font-size:9pt; color:#999;">
<em>Built by a working New Hampshire general contractor.</em><br/>
<em>The licensed-trade marketplace that thinks like a contractor.</em>
</div>

</div>${PAGE_BREAK}`;
}

function buildToc(binder) {
  const lines = [`<div style="page-break-after:avoid;">\n\n# Table of Contents\n\n</div>\n`];

  let docNum = 1;
  for (const section of binder.sections) {
    lines.push(`\n## ${section.name}\n`);
    for (const file of section.files) {
      const fileName = file.split("/").pop().replace(/\.md$/, "");
      const display = fileName
        .replace(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
      lines.push(`${docNum}. **${display}** \`${file}\``);
      lines.push("");
      docNum++;
    }
  }

  lines.push(PAGE_BREAK);
  return lines.join("\n");
}

function buildSectionDivider(name, sectionNum) {
  return `<div style="text-align:center; padding-top:280px; font-family:-apple-system,sans-serif;">

<div style="font-size:11pt; letter-spacing:4pt; color:#888; margin-bottom:14pt;">SECTION ${sectionNum}</div>

<div style="font-size:32pt; font-weight:700; color:#00a9e0; line-height:1.2;">${name.replace(/^[IVX]+\.\s*/, "")}</div>

<div style="height:1px; background:#00a9e0; width:60pt; margin:24pt auto 0 auto;"></div>

</div>${PAGE_BREAK}`;
}

function buildDocHeader(filePath) {
  return `<div style="font-family:monospace; font-size:8pt; color:#999; border-bottom:1px solid #eee; padding-bottom:4pt; margin-bottom:18pt;">📄 ${filePath}</div>\n\n`;
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
          headerTemplate: "<div></div>",
          footerTemplate:
            '<div style="font-size:8pt; color:#888; width:100%; padding:0 0.75in; display:flex; justify-content:space-between; font-family:sans-serif;">' +
            `<span>Sherpa Pros · ${binder.title}</span>` +
            '<span class="pageNumber"></span> / <span class="totalPages"></span>' +
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
