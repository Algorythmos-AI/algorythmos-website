// scripts/generate-sitemaps.js
// Generate region-aware sitemaps for Algorythmos (.com, .fr, /au)

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
import { REGION_CONFIG } from "./regionSeoConfig.js";

const PUBLIC_DIR = "public";

// Core routes for the main product site (without region prefix)
const CORE_ROUTES = [
    "/",            // home
    "/services",
    "/pricing",
    "/about",
    "/blog",
    "/case-studies",
    "/contact",
    "/ecosystem",
];

const routeMeta = {
    "/": { changefreq: "weekly", priority: "1.0" },
    "/services": { changefreq: "monthly", priority: "0.9" },
    "/pricing": { changefreq: "monthly", priority: "0.8" },
    "/about": { changefreq: "monthly", priority: "0.7" },
    "/blog": { changefreq: "weekly", priority: "0.6" },
    "/case-studies": { changefreq: "monthly", priority: "0.6" },
    "/contact": { changefreq: "monthly", priority: "0.5" },
    "/ecosystem": { changefreq: "monthly", priority: "0.5" },
};

// Helper to ensure /public exists (should already, but be safe)
if (!existsSync(PUBLIC_DIR)) {
    mkdirSync(PUBLIC_DIR, { recursive: true });
}

function buildUrl(domain, basePath, route) {
    // domain: https://algorythmos.com or https://algorythmos.fr
    // basePath: "" or "/au"
    const cleanRoute = route === "/" ? "/" : route;
    const prefix = basePath || "";
    const fullPath =
        cleanRoute === "/" ? `${prefix}/` : `${prefix}${cleanRoute}`;

    // Avoid double slashes
    return `${domain}${fullPath}`.replace(/([^:]\/)\/+/g, "$1");
}

function buildSingleSitemap(domain, basePath = "", fileName) {
    const urlsXml = CORE_ROUTES.map((route) => {
        const meta = routeMeta[route] || {
            changefreq: "monthly",
            priority: "0.5",
        };
        const loc = buildUrl(domain, basePath, route);
        return `  <url>
    <loc>${loc}</loc>
    <changefreq>${meta.changefreq}</changefreq>
    <priority>${meta.priority}</priority>
  </url>`;
    }).join("\n\n");

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset 
  xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
  xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urlsXml}
</urlset>
`;

    const targetPath = join(PUBLIC_DIR, fileName);
    writeFileSync(targetPath, xml, "utf-8");
    console.log(`✅ Generated ${targetPath}`);
}

function buildIndexSitemap() {
    const locs = [
        `https://algorythmos.com/sitemap-com.xml`,
        `https://algorythmos.fr/sitemap-fr.xml`,
        `https://algorythmos.com/sitemap-au.xml`,
    ];

    const xml = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${locs
            .map(
                (loc) => `  <sitemap>
    <loc>${loc}</loc>
  </sitemap>`
            )
            .join("\n")}
</sitemapindex>
`;

    const targetPath = join(PUBLIC_DIR, "sitemap-index.xml");
    writeFileSync(targetPath, xml, "utf-8");
    console.log(`✅ Generated ${targetPath}`);
}

// ----------------- Run for each region -----------------

// GLOBAL (.com)
buildSingleSitemap(
    REGION_CONFIG.GLOBAL.expectedDomain, // https://algorythmos.com
    "",                                  // no base path
    REGION_CONFIG.GLOBAL.sitemapFile     // sitemap-com.xml
);

// FR (.fr)
buildSingleSitemap(
    REGION_CONFIG.FR.expectedDomain,     // https://algorythmos.fr
    "",                                  // no base path
    REGION_CONFIG.FR.sitemapFile         // sitemap-fr.xml
);

// AU (.com/au)
buildSingleSitemap(
    "https://algorythmos.com",           // base domain
    "/au",                               // region path
    REGION_CONFIG.AU.sitemapFile         // sitemap-au.xml
);

// Master index
buildIndexSitemap();
