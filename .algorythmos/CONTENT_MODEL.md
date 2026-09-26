# Content Model

## i18n Key Naming
```
{section}.{component}.{element}
```

Examples:
- `services.items.{slug}.name`
- `serviceAiWebsites.hero.subtitle`
- `blogDetail.posts.{slug}.content.0.heading`

## Service Pages
Catalogue: `services.items.{slug}.{name,tagline,summary,capabilities.N,outcomes.N}`.
Detail page: `service{Name}.meta.*`, `service{Name}.hero.subtitle`, `service{Name}.faqs.*` — the
namespace is the registry's `ns` field in `src/data/services.ts`. Adding a service: register it
there (slug, icon, ns, family, console, blueprint), add its console (see `docs/CONSOLES.md`), its
SVG in `serviceVisuals`, and EN + FR copy; `src/data/services.test.ts` fails until every part exists.

## Blog Posts
Keys: `blog.posts.{index}.*`, `blogDetail.posts.{slug}.*`

## CTAs
Keys: `cta.regionAU.*`, `cta.regionFR.*`

## Full rules: /docs/CONTRIBUTING.md

## Unused keys

Dictionary keys with no reference in `src/` are **deleted, never parked** (25 Sep 2026: ten dead groups, ~410 keys, including placeholder people and testimonials, were removed). Before removing a group, prove zero references with `grep -rE "['\"\`]<group>\." src` and check the dynamic `t(\`…\`)` template roots; `npm run keys:check` after a build proves nothing rendered depended on it.
