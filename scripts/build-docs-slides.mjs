#!/usr/bin/env node
/**
 * Sherpa Pros — Render Marp slide decks from docs/slides/ into PDF + HTML + PPTX.
 *
 * Run: npm run docs:slides
 *
 * Output:
 *   docs-pdf/slides/<deck>.pdf
 *   docs-pdf/slides/<deck>.html
 *   docs-pdf/slides/<deck>.pptx
 *
 * Renders each Marp markdown to all 3 formats. PDF is the canonical print
 * version; HTML is the web-shareable interactive version (left/right arrows
 * to navigate); PPTX is for handoff to anyone who wants to edit in Keynote /
 * PowerPoint / Google Slides.
 */

import { readdirSync, mkdirSync } from "node:fs";
import { join, dirname, basename } from "node:path";
import { fileURLToPath } from "node:url";
import { execSync } from "node:child_process";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, "..");
const SLIDES_DIR = join(ROOT, "docs", "slides");
const OUT_DIR = join(ROOT, "docs-pdf", "slides");
const MARP = join(ROOT, "node_modules", ".bin", "marp");

mkdirSync(OUT_DIR, { recursive: true });

const decks = readdirSync(SLIDES_DIR).filter((f) => f.endsWith(".md"));
console.log(`Found ${decks.length} Marp decks in ${SLIDES_DIR}`);
console.log(`Rendering to ${OUT_DIR}\n`);

const start = Date.now();
const formats = ["pdf", "html", "pptx"];
let success = 0;
let failed = 0;

for (const deck of decks) {
  const stem = basename(deck, ".md");
  console.log(`Rendering: ${deck}`);

  for (const fmt of formats) {
    const inFile = join(SLIDES_DIR, deck);
    const outFile = join(OUT_DIR, `${stem}.${fmt}`);

    try {
      const themeSet = join(__dirname, "marp-themes", "sherpa-pros-editorial.css");
      execSync(
        `"${MARP}" "${inFile}" --${fmt} -o "${outFile}" --allow-local-files --theme-set "${themeSet}"`,
        { stdio: ["ignore", "pipe", "pipe"] },
      );
      console.log(`  ✓ ${stem}.${fmt}`);
      success++;
    } catch (err) {
      console.log(`  ✗ ${stem}.${fmt} — ${err.message.split("\n")[0]}`);
      failed++;
    }
  }
}

const elapsed = ((Date.now() - start) / 1000).toFixed(1);
console.log(`\nDone in ${elapsed}s. Rendered ${success}/${success + failed} outputs.`);
if (failed > 0) process.exit(1);
