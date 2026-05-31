/**
 * Vitest config for the Astro 6 app.
 *
 * Uses Astro's `getViteConfig` so unit tests resolve the same aliases/plugins as
 * the build. `test` is cast because getViteConfig's param type doesn't surface
 * vitest's augmentation. No `src/**` specs exist yet (passWithNoTests). Legacy
 * specs under e2e/ and tests/ are not run here.
 */
import { getViteConfig } from 'astro/config';

export default getViteConfig({
  // @ts-expect-error — vitest augments Vite's config; not surfaced on getViteConfig's param type
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.{js,ts}'],
    passWithNoTests: true,
  },
});
