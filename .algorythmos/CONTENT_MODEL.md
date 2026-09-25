# Content Model

## i18n Key Naming
```
{section}.{component}.{element}
```

Examples:
- `services.cards.0.title`
- `serviceAiWebsites.hero.subtitle`
- `blogDetail.posts.{slug}.content.0.heading`

## Service Pages
Keys: `service{Name}.meta.*`, `service{Name}.hero.*`, `service{Name}.faqs.*`

## Blog Posts
Keys: `blog.posts.{index}.*`, `blogDetail.posts.{slug}.*`

## CTAs
Keys: `cta.regionAU.*`, `cta.regionFR.*`

## Full rules: /docs/CONTRIBUTING.md

## Unused keys

Dictionary keys with no reference in `src/` are **deleted, never parked** (25 Sep 2026: ten dead groups, ~410 keys, including placeholder people and testimonials, were removed). Before removing a group, prove zero references with `grep -rE "['\"\`]<group>\." src` and check the dynamic `t(\`…\`)` template roots; `npm run keys:check` after a build proves nothing rendered depended on it.
