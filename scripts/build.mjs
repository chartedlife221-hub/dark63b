// Build: bundle React + TypeScript with esbuild, prerender the page to static
// HTML, and copy public assets. Output in dist/ is ready for GitHub Pages.
//
//   node scripts/build.mjs            production build
//   node scripts/build.mjs --serve    build, serve on :5173, rebuild on change
//
// Environment:
//   SITE_URL  absolute site URL used for social previews
//             (default https://chartedlife221-hub.github.io/dark63b/)

import { build } from "esbuild";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createReadStream, existsSync, statSync, watch } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";
import { pathToFileURL } from "node:url";

const root = resolve(import.meta.dirname, "..");
const dist = join(root, "dist");
const tmp = join(root, "node_modules", ".cache", "dark63b");
const SITE_URL = (process.env.SITE_URL || "https://chartedlife221-hub.github.io/dark63b/").replace(/\/?$/, "/");
const args = new Set(process.argv.slice(2));

async function run() {
  const t0 = Date.now();
  await rm(dist, { recursive: true, force: true });
  await mkdir(join(dist, "assets"), { recursive: true });

  // 1. Client bundle (hashed file names for long-term caching).
  const client = await build({
    entryPoints: [join(root, "src/main.tsx")],
    bundle: true,
    minify: true,
    sourcemap: false,
    format: "esm",
    target: ["es2020", "safari15"],
    outdir: join(dist, "assets"),
    entryNames: "[name]-[hash]",
    assetNames: "[name]-[hash]",
    metafile: true,
    jsx: "automatic",
    define: { "process.env.NODE_ENV": '"production"' },
    legalComments: "none",
    logLevel: "warning",
  });
  const outputs = Object.keys(client.metafile.outputs).map((p) => p.replace(/^dist\//, "").replace(/.*\/dist\//, ""));
  const js = outputs.find((p) => p.endsWith(".js"));
  const css = outputs.find((p) => p.endsWith(".css"));
  if (!js || !css) throw new Error("Missing build outputs");

  // 2. Prerender the app to HTML.
  await mkdir(tmp, { recursive: true });
  const ssrFile = join(tmp, `prerender-${Date.now()}.mjs`);
  await build({
    entryPoints: [join(root, "src/prerender.tsx")],
    bundle: true,
    platform: "node",
    packages: "external",
    format: "esm",
    outfile: ssrFile,
    jsx: "automatic",
    loader: { ".css": "empty" },
    define: { "process.env.NODE_ENV": '"production"' },
    logLevel: "warning",
  });
  const { render } = await import(pathToFileURL(ssrFile).href);
  const markup = render();
  await rm(ssrFile, { force: true });

  // 3. HTML.
  const template = await readFile(join(root, "src/index.html"), "utf8");
  const html = template
    .replace("<!--app-->", markup)
    .replace("%CSS%", `./${css}`)
    .replace("%JS%", `./${js}`)
    .replaceAll("%SITE_URL%", SITE_URL);
  await writeFile(join(dist, "index.html"), html);

  // 4. Static assets and GitHub Pages extras.
  await cp(join(root, "public"), dist, { recursive: true });
  const base = new URL(SITE_URL).pathname;
  await writeFile(
    join(dist, "404.html"),
    `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Page not found · DARK6.3B</title><meta name="robots" content="noindex"><style>html{background:#000;color:#e8dcc4;font:16px/1.6 system-ui,sans-serif}main{min-height:100vh;display:grid;place-content:center;text-align:center;padding:24px}a{color:#e0b56c}</style></head><body><main><h1 style="font-weight:400">This page doesn't exist.</h1><p><a href="${base}">Return to DARK6.3B</a></p></main></body></html>`,
  );
  await writeFile(join(dist, ".nojekyll"), "");
  await writeFile(join(dist, "robots.txt"), `User-agent: *\nAllow: /\n`);

  const size = (p) => (statSync(join(dist, p)).size / 1024).toFixed(1) + " kB";
  console.log(`Built in ${Date.now() - t0} ms  ·  ${js} ${size(js)}  ·  ${css} ${size(css)}  ·  index.html ${size("index.html")}`);
}

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".mp4": "video/mp4",
  ".jpg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
  ".txt": "text/plain",
};

function serve(port = Number(process.env.PORT) || 5173) {
  // Serves dist/ under the same base path as GitHub Pages, with Range support for video.
  const base = new URL(SITE_URL).pathname;
  createServer((req, res) => {
    const url = new URL(req.url ?? "/", "http://localhost");
    if (url.pathname === "/") {
      res.writeHead(302, { Location: base });
      return res.end();
    }
    if (!url.pathname.startsWith(base)) {
      res.writeHead(404);
      return res.end("Not found");
    }
    let rel = decodeURIComponent(url.pathname.slice(base.length)) || "index.html";
    if (rel.endsWith("/")) rel += "index.html";
    const file = normalize(join(dist, rel));
    if (!file.startsWith(dist) || !existsSync(file) || statSync(file).isDirectory()) {
      res.writeHead(404, { "Content-Type": TYPES[".html"] });
      return createReadStream(join(dist, "404.html")).pipe(res);
    }
    const { size } = statSync(file);
    const type = TYPES[extname(file)] ?? "application/octet-stream";
    const range = req.headers.range?.match(/bytes=(\d*)-(\d*)/);
    if (range) {
      const start = range[1] ? Number(range[1]) : 0;
      const end = range[2] ? Number(range[2]) : size - 1;
      res.writeHead(206, { "Content-Type": type, "Content-Range": `bytes ${start}-${end}/${size}`, "Accept-Ranges": "bytes", "Content-Length": end - start + 1 });
      return createReadStream(file, { start, end }).pipe(res);
    }
    res.writeHead(200, { "Content-Type": type, "Content-Length": size, "Accept-Ranges": "bytes" });
    createReadStream(file).pipe(res);
  }).listen(port, () => console.log(`Serving http://localhost:${port}${base}`));
}

await run();
if (args.has("--serve")) {
  serve();
  if (!args.has("--no-watch")) {
    let timer;
    for (const dir of ["src", "public"]) {
      watch(join(root, dir), { recursive: true }, () => {
        clearTimeout(timer);
        timer = setTimeout(() => run().catch((e) => console.error(e.message)), 120);
      });
    }
  }
}
