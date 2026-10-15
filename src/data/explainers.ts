/**
 * Explainers — the small step-through diagrams inside long evidence reports.
 *
 * Copy lives in i18n (`explainers.<id>.{title,caption,steps.N,labels.*}`); this
 * module carries structure only. Each diagram is server-rendered in its final,
 * fully labelled state; `src/lib/explainerLoop.ts` only adds the stepping.
 */

/**
 * Single switch for the stepping. `false` ships every explainer as its static
 * diagram and step list, with no script armed and no replay button.
 */
export const EXPLAINERS_ENABLED = true;

export const EXPLAINER_IDS = [
  'agent-loop',
  'fleet-path',
  'launch-link',
  'mine-block',
  'whole-job',
  'speech-loop',
  'em-spectrum',
  'fibre-span',
  'sat-links',
  'orbital-node',
  'fibre-free-route',
  'cell-read',
  'array-access',
  'cell-footprint',
  'vertical-channel',
  'pitch-multiply',
  'capacitor-stack',
  'ai-memory-map',
  'footprint-vs-stack',
  'qual-ladder',
  'explore-flow',
  'pilot-roadmap',
] as const;
export type ExplainerId = (typeof EXPLAINER_IDS)[number];

/** How many steps each explainer walks through (`explainers.<id>.steps.0…n-1`). */
export const EXPLAINER_STEPS: Record<ExplainerId, number> = {
  'agent-loop': 6,
  'fleet-path': 6,
  'launch-link': 6,
  'mine-block': 6,
  'whole-job': 6,
  'speech-loop': 6,
  'em-spectrum': 6,
  'fibre-span': 6,
  'sat-links': 6,
  'orbital-node': 6,
  'fibre-free-route': 6,
  'cell-read': 6,
  'array-access': 6,
  'cell-footprint': 6,
  'vertical-channel': 6,
  'pitch-multiply': 6,
  'capacitor-stack': 6,
  'ai-memory-map': 6,
  'footprint-vs-stack': 6,
  'qual-ladder': 6,
  'explore-flow': 5,
  'pilot-roadmap': 4,
};

/**
 * Which explainers a case study shows: one slot per pillar, in order, plus the orchestration one.
 * `null` leaves a pillar without a diagram.
 */
export const caseStudyExplainers: Record<string, { pillars: (ExplainerId | null)[]; orchestration?: ExplainerId }> = {
  'ai-robotics-space-bitcoin-convergence': {
    pillars: ['agent-loop', 'fleet-path', 'launch-link', 'mine-block'],
    orchestration: 'whole-job',
  },
  'signals-fibre-satellites-orbital-compute': {
    pillars: ['speech-loop', 'em-spectrum', 'fibre-span', 'sat-links', 'orbital-node'],
    orchestration: 'fibre-free-route',
  },
  'dram-4f2-cell-architecture': {
    pillars: ['cell-read', 'array-access', 'cell-footprint', 'vertical-channel', 'pitch-multiply', 'capacitor-stack', 'ai-memory-map', 'footprint-vs-stack'],
    orchestration: 'qual-ladder',
  },
  'ai-in-mining-mbsc': {
    pillars: [null, 'explore-flow', null, null, null, null],
    orchestration: 'pilot-roadmap',
  },
};
