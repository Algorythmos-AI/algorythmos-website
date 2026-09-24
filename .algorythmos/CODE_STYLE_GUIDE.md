# Code Style Guide

## React Components
- Use functional components with hooks
- Use `const { t } = useI18n()` for all text
- Props should be destructured
- Component names use PascalCase

## File Structure
```
src/
  pages/           # Route components
  components/      # Reusable UI
  app/i18n/        # Translation files
  constants/       # Shared constants
  data/            # Static data
```

## CSS/Tailwind
- Use Tailwind utilities
- gap-6 for grids
- max-w-7xl for containers
- Prefer dark mode by default

## Full rules: /docs/CONTRIBUTING.md
