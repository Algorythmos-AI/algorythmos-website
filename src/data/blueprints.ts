/**
 * Blueprint illustration kinds — every kind listed here must have a matching
 * `kind === '<kind>'` branch in `src/components/ui/BlueprintArt.astro`
 * (enforced by `src/data/services.test.ts`).
 */
export type BlueprintKind = 'agentic' | 'document' | 'sql' | 'mlops' | 'vault' | 'web';
