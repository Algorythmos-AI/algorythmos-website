# Brand and logo

The logo, its colours, usage rules and every export live in [`/brand`](../brand/README.md).
That folder is the single source of truth; it is excluded from deployments (`.vercelignore`).

The website's own logo files in `public/` are generated from the same master:

| File | Used by |
|---|---|
| `logo-mark.webp` | Header and footer (`src/components/layout`) and the console window bars |
| `logo-mark.png` | Press page download |
| `Algorythmos.png` | Default `og:image` and JSON-LD logo, 1200 × 630 (name pinned by `scripts/seo-validate.js`) |
| `favicon.ico`, `favicon-192.png`, `favicon-512.png` | Browser tab and manifest "any" icons |
| `apple-touch-icon.png`, `maskable-192.png`, `maskable-512.png` | Home-screen icons |
| `bimi/algorythmos.svg` | BIMI (SVG Tiny PS) |

To change the logo: edit `brand/source/master.svg`, run `npm run brand:build -- --site`, and
commit the result. `npm run brand:check` (in CI) fails if these files drift from the master.

To roll back a logo change, revert its commit; the 2025 files are also kept in
`brand/archive/2025/`.
