// Black Friday Deal Finder — tiny static file server for local preview.
// Serves app/ at http://localhost:8080 (or --port <n>). Node 22, stdlib only.
import { createServer } from "node:http";
import { readFileSync, existsSync } from "node:fs";
import { join, extname } from "node:path";

const repoRoot = new URL(".", import.meta.url).pathname;
const appDir = join(repoRoot, "app");
const portIdx = process.argv.indexOf("--port");
const port = portIdx >= 0 ? Number(process.argv[portIdx + 1] || 8080) : 8080;

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml"
};

const server = createServer((req, res) => {
  const path = decodeURIComponent((req.url || "/").split("?")[0]);
  // Never serve anything outside app/, and never serve dotfiles.
  const rel = path === "/" ? "index.html" : path.replace(/^\/+/, "");
  if (rel.includes("..") || rel.startsWith(".")) {
    res.writeHead(403, { "content-type": "text/plain" });
    res.end("forbidden");
    return;
  }
  const file = join(appDir, rel);
  if (!file.startsWith(appDir) || !existsSync(file)) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found");
    return;
  }
  res.writeHead(200, { "content-type": TYPES[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
});

server.listen(port, () => {
  console.log("Black Friday Deal Finder at http://localhost:" + port);
});
