/** Clean service catalogue (no React icon imports — SVG path strings instead). */
export interface Service {
  slug: string;
  name: string;
  tagline: string;
  summary: string;
  capabilities: string[];
  outcomes: string[];
  /** lucide-style SVG path */
  icon: string;
}

export const services: Service[] = [
  {
    slug: 'agentic-automation',
    name: 'Agentic Automation',
    tagline: 'Autonomous workflows that act — safely.',
    summary:
      'We design and ship AI agents that complete multi-step business processes end to end, with guardrails, human-in-the-loop checkpoints, and full audit trails so you stay in control.',
    capabilities: [
      'Multi-step task orchestration with tool use',
      'Human-in-the-loop approval gates',
      'Guardrails, evals, and full audit logging',
      'Integration with your existing systems',
    ],
    outcomes: ['Hours of manual work removed per week', 'Consistent, auditable execution', 'Faster turnaround on repetitive processes'],
    icon: 'm12 8 1.9 3.9L18 13.8l-3.2 2.8.8 4.4-3.6-2-3.6 2 .8-4.4L2.9 13.8 8 11.9z',
  },
  {
    slug: 'document-intelligence',
    name: 'Document Intelligence',
    tagline: 'Structured data from messy documents.',
    summary:
      'Turn invoices, contracts, forms, and reports into clean, structured data with OCR + NLP pipelines tuned to your formats — validated, traceable, and ready for downstream systems.',
    capabilities: [
      'OCR for scans, PDFs, and images',
      'Entity & clause extraction with confidence scores',
      'Validation rules and human review queues',
      'Export to your database, ERP, or warehouse',
    ],
    outcomes: ['Manual data entry eliminated', 'Lower error rates with validation', 'Searchable, structured archives'],
    icon: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8zM14 2v6h6M8 13h8M8 17h6',
  },
  {
    slug: 'sql-dashboards',
    name: 'SQL Dashboards',
    tagline: 'Metrics your team can trust.',
    summary:
      'We model your data and build executive dashboards on a clean semantic layer — so the numbers are consistent, explainable, and actually drive decisions.',
    capabilities: [
      'Data modelling and a single semantic layer',
      'Executive and operational dashboards',
      'Self-serve metrics with definitions',
      'Alerting on the numbers that matter',
    ],
    outcomes: ['One source of truth for metrics', 'Decisions backed by trustworthy data', 'Less time spent reconciling reports'],
    icon: 'M4 20V10M10 20V4M16 20v-8M22 20H2',
  },
  {
    slug: 'mlops-cicd',
    name: 'MLOps & CI/CD',
    tagline: 'Ship and operate ML, reliably.',
    summary:
      'We productionise machine-learning systems with automated training, testing, deployment, and monitoring — so models stay accurate, observable, and safe to change.',
    capabilities: [
      'CI/CD pipelines for models and data',
      'Monitoring, drift detection, and retraining',
      'Reproducible experiments and versioning',
      'Safe rollouts with rollback',
    ],
    outcomes: ['Models that stay accurate in production', 'Faster, safer releases', 'Observability across the ML lifecycle'],
    icon: 'M6 3v12M18 9a3 3 0 1 0 0 6 3 3 0 0 0 0-6zM6 21a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM6 15a9 9 0 0 0 9-9',
  },
  {
    slug: 'ai-websites',
    name: 'AI-Powered Websites',
    tagline: 'Fast, SEO-first, AI-ready.',
    summary:
      'High-performance websites built to be discovered — by search engines and AI agents alike — with AI features built in where they add real value.',
    capabilities: [
      'Static-first performance (excellent Core Web Vitals)',
      'SEO + structured data + llms.txt for AI crawlers',
      'AI features (search, chat, personalisation) where useful',
      'Accessible, multilingual, dual-theme',
    ],
    outcomes: ['Top-tier performance scores', 'Discoverable by search + AI agents', 'A site that converts'],
    icon: 'M2 12h20M12 2a15 15 0 0 1 0 20 15 15 0 0 1 0-20zM12 2a10 10 0 0 0 0 20',
  },
];

export const serviceSlugs = services.map((s) => s.slug);
export const getService = (slug: string): Service | undefined => services.find((s) => s.slug === slug);
