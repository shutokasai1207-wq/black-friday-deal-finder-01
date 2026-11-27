// Black Friday Deal Finder — hand-in program for make.fun (Node 22, standard library only).
//
// Copies app/ and screenshots/ into the output directory and writes
// dossier.json with buildDossier from vendor/makefun-frontend.ts.
// The output directory comes from MAKEFUN_OUTPUT_DIR, defaulting to /output.
// It never deletes the output directory: the grading environment may mount
// /output, so we only create it. All source paths are anchored to this
// script's location, so grading works from any working directory.

import { buildDossier } from "./vendor/makefun-frontend.ts";
import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const repoRoot = new URL(".", import.meta.url).pathname;

if (!existsSync(join(repoRoot, "app")) || !existsSync(join(repoRoot, "app", "index.html"))) {
  throw new Error("app/index.html not found.");
}

const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

// Create the output directory (and parents) if it is not there yet.
mkdirSync(outDir, { recursive: true });

// Copy the site itself.
cpSync(join(repoRoot, "app"), join(outDir, "app"), { recursive: true });

// Copy the screenshots when they exist.
const shotsDir = join(repoRoot, "screenshots");
if (existsSync(shotsDir)) {
  cpSync(shotsDir, join(outDir, "screenshots"), { recursive: true });
}

// Build the dossier with the competition's limits.
const dossier = buildDossier(outDir, {
  text_max_bytes: 163840,
  screenshots_max: 4,
  screenshot_max_bytes: 262144,
  app_max_entries: 993,
  app_max_bytes: 16777216
});
if (!dossier || dossier.length === 0) {
  throw new Error("buildDossier returned an empty dossier.");
}
writeFileSync(join(outDir, "dossier.json"), dossier);

console.log("Wrote dossier.json to " + outDir + " (" + dossier.length + " bytes)");
