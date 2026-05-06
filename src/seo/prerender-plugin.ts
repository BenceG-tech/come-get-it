/**
 * Build-time static prerender Vite plugin.
 *
 * Runs in `closeBundle` after `vite build` finishes writing dist/.
 * For each route in src/seo/routes.ts:
 *   - clones dist/index.html
 *   - rewrites <title>, meta description, canonical, OG/Twitter, robots
 *   - injects per-route JSON-LD
 *   - replaces #root contents with the route's semantic bodyHtml
 *   - writes dist/<distDir>/index.html
 * Also regenerates dist/sitemap.xml from the same route table.
 */
import { promises as fs } from "node:fs";
import * as path from "node:path";
import type { Plugin, ResolvedConfig } from "vite";
import {
  ROUTES,
  SITE_ORIGIN,
  DEFAULT_OG_IMAGE,
  type RouteSEO,
} from "./routes";

const escapeHtml = (s: string) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

function buildHeadMeta(route: RouteSEO): string {
  const url = `${SITE_ORIGIN}${route.path === "/" ? "/" : route.path}`;
  const robots = route.noindex ? "noindex,nofollow" : "index,follow";
  const title = escapeHtml(route.title);
  const desc = escapeHtml(route.description);
  return `
    <title>${title}</title>
    <meta name="description" content="${desc}" />
    <meta name="robots" content="${robots}" />
    <link rel="canonical" href="${url}" />

    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${desc}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Come Get It" />
    <meta property="og:locale" content="hu_HU" />
    <meta property="og:image" content="${DEFAULT_OG_IMAGE}" />
    <meta property="og:image:secure_url" content="${DEFAULT_OG_IMAGE}" />

    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${desc}" />
    <meta name="twitter:image" content="${DEFAULT_OG_IMAGE}" />
  `.trim();
}

function buildJsonLdScripts(route: RouteSEO): string {
  if (!route.jsonLd?.length) return "";
  return route.jsonLd
    .map(
      (block: Record<string, unknown>) =>
        `<script type="application/ld+json" data-prerender-route="${route.path}">${JSON.stringify(
          block,
        )}</script>`,
    )
    .join("\n    ");
}

function applyRouteToHtml(template: string, route: RouteSEO): string {
  let html = template;

  // 1. Replace the <!-- PRERENDER:HEAD --> sentinel (or the existing <title>+meta block)
  //    with route-specific head meta.
  const headMeta = buildHeadMeta(route);
  if (html.includes("<!-- PRERENDER:HEAD -->")) {
    html = html.replace("<!-- PRERENDER:HEAD -->", headMeta);
  } else {
    // Fallback: replace the first <title>...</title>
    html = html.replace(/<title>[\s\S]*?<\/title>/i, headMeta);
  }

  // 2. Inject route JSON-LD before </head>
  const jsonLd = buildJsonLdScripts(route);
  if (jsonLd) {
    html = html.replace("</head>", `    ${jsonLd}\n  </head>`);
  }

  // 3. Replace #root inner content (between PRERENDER:BODY markers, or full inner)
  const bodyMarker =
    /<div id="root">[\s\S]*?<\/div>\s*(?=<script[^>]*type="module")/i;
  const newRoot = `<div id="root">${route.bodyHtml}</div>\n    `;
  if (bodyMarker.test(html)) {
    html = html.replace(bodyMarker, newRoot);
  } else {
    html = html.replace(
      /<div id="root">[\s\S]*?<\/div>/i,
      `<div id="root">${route.bodyHtml}</div>`,
    );
  }

  return html;
}

function buildSitemap(): string {
  const urls = ROUTES.filter((r: RouteSEO) => !r.noindex)
    .map((r: RouteSEO) => {
      const loc = `${SITE_ORIGIN}${r.path === "/" ? "/" : r.path}`;
      return `  <url>
    <loc>${loc}</loc>
    <lastmod>${r.lastmod}</lastmod>
    <changefreq>${r.changefreq ?? "monthly"}</changefreq>
    <priority>${(r.priority ?? 0.5).toFixed(1)}</priority>
  </url>`;
    })
    .join("\n");
  // Always include llm.html
  const llm = `  <url>
    <loc>${SITE_ORIGIN}/llm.html</loc>
    <lastmod>2026-05-06</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`;
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
${llm}
</urlset>
`;
}

export function prerenderPlugin(): Plugin {
  let config: ResolvedConfig;
  return {
    name: "come-get-it:prerender",
    apply: "build",
    configResolved(c) {
      config = c;
    },
    async closeBundle() {
      const outDir = path.resolve(config.root, config.build.outDir);
      const indexPath = path.join(outDir, "index.html");
      let template: string;
      try {
        template = await fs.readFile(indexPath, "utf8");
      } catch (e) {
        this.warn(`prerender: cannot read ${indexPath}: ${(e as Error).message}`);
        return;
      }

      let count = 0;
      for (const route of ROUTES) {
        const html = applyRouteToHtml(template, route);
        const targetDir =
          route.distDir === "" ? outDir : path.join(outDir, route.distDir);
        await fs.mkdir(targetDir, { recursive: true });
        await fs.writeFile(path.join(targetDir, "index.html"), html, "utf8");
        count++;
      }

      // Sitemap
      await fs.writeFile(
        path.join(outDir, "sitemap.xml"),
        buildSitemap(),
        "utf8",
      );

      // Best-effort: warn about routes in App.tsx not in ROUTES
      try {
        const appSrc = await fs.readFile(
          path.resolve(config.root, "src/App.tsx"),
          "utf8",
        );
        const declared = Array.from(
          appSrc.matchAll(/<Route\s+path="([^"]+)"/g),
        ).map((m) => m[1]);
        const known = new Set(ROUTES.map((r: RouteSEO) => r.path));
        const skip = new Set(["*", "/auth"]);
        for (const p of declared) {
          if (!skip.has(p) && !known.has(p)) {
            this.warn(
              `prerender: route "${p}" declared in App.tsx but missing from src/seo/routes.ts`,
            );
          }
        }
      } catch {
        /* ignore */
      }

      // eslint-disable-next-line no-console
      console.log(
        `\n[prerender] wrote ${count} static route(s) + sitemap.xml to ${path.relative(config.root, outDir)}/`,
      );
    },
  };
}

export default prerenderPlugin;
