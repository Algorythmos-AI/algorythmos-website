/**
 * Living-console registry — one entry per `ConsoleName` in `src/data/services.ts`.
 * An explicit map (not a glob) so a missing console is a type error and a
 * build-time throw, never a silent fallback to the static image.
 */
import type { ConsoleName } from '@/data/services';
import AgenticConsole from './AgenticConsole.astro';
import DocumentConsole from './DocumentConsole.astro';
import SqlConsole from './SqlConsole.astro';
import MlopsConsole from './MlopsConsole.astro';
import AiWebsitesConsole from './AiWebsitesConsole.astro';
import LlmopsConsole from './LlmopsConsole.astro';
import PlatformConsole from './PlatformConsole.astro';
import MonitoringConsole from './MonitoringConsole.astro';
import FeaturesConsole from './FeaturesConsole.astro';

export const consoles = {
  AgenticConsole,
  DocumentConsole,
  SqlConsole,
  MlopsConsole,
  AiWebsitesConsole,
  LlmopsConsole,
  PlatformConsole,
  MonitoringConsole,
  FeaturesConsole,
} satisfies Record<ConsoleName, unknown>;
