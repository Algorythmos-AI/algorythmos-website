/**
 * Topic-cluster map — hand-curated internal links between the money pages
 * (services), the proof (case studies) and the content (blog). Funnels link
 * equity toward services + local landing pages and gives crawlers a coherent
 * two-cluster (AU / FR) topical graph. Consumed by RelatedLinks.astro, which
 * resolves each ref to a localized label + path and appends the locale's local
 * landing page automatically.
 */
export interface RelatedRef {
  type: 'service' | 'blog' | 'case-study';
  slug: string;
}

/** Service detail → supporting content + proof (+ locale landing, added in component). */
export const serviceRelated: Record<string, RelatedRef[]> = {
  'agentic-automation': [
    { type: 'blog', slug: 'agentic-ai' },
    { type: 'case-study', slug: 'financial-compliance' },
    { type: 'case-study', slug: 'manufacturing-docs' },
  ],
  'document-intelligence': [
    { type: 'blog', slug: 'gdpr-ai' },
    { type: 'case-study', slug: 'manufacturing-docs' },
    { type: 'case-study', slug: 'healthcare-burden' },
  ],
  'sql-dashboards': [
    { type: 'case-study', slug: 'retail-sql' },
    { type: 'blog', slug: 'ai-consultancy-australia' },
  ],
  'mlops-cicd': [
    { type: 'blog', slug: 'mlops-production' },
    { type: 'blog', slug: 'llmsecops' },
    { type: 'case-study', slug: 'healthcare-mlops' },
  ],
  'ai-websites': [
    { type: 'blog', slug: 'ai-consultancy-australia' },
    { type: 'service', slug: 'agentic-automation' },
  ],
};

/** Blog post → the service it supports + sibling posts. */
export const blogRelated: Record<string, RelatedRef[]> = {
  'agentic-ai': [
    { type: 'service', slug: 'agentic-automation' },
    { type: 'blog', slug: 'mlops-production' },
  ],
  'gdpr-ai': [
    { type: 'service', slug: 'document-intelligence' },
    { type: 'blog', slug: 'llmsecops' },
  ],
  'mlops-production': [
    { type: 'service', slug: 'mlops-cicd' },
    { type: 'blog', slug: 'llmsecops' },
  ],
  'llmsecops': [
    { type: 'service', slug: 'mlops-cicd' },
    { type: 'blog', slug: 'mlops-production' },
  ],
  'ai-consultancy-australia': [
    { type: 'service', slug: 'agentic-automation' },
    { type: 'blog', slug: 'agentic-ai' },
  ],
  'pulse-clinical-ai': [
    { type: 'service', slug: 'document-intelligence' },
    { type: 'case-study', slug: 'healthcare-burden' },
  ],
  'ai-automation-australian-smes': [
    { type: 'service', slug: 'agentic-automation' },
    { type: 'blog', slug: 'ai-consultancy-australia' },
  ],
  'eu-ai-act-gdpr-sme-roadmap': [
    { type: 'service', slug: 'document-intelligence' },
    { type: 'blog', slug: 'gdpr-ai' },
  ],
};

/** Case study → the service that delivered it + a sibling study. */
export const caseStudyRelated: Record<string, RelatedRef[]> = {
  'admin-burden-evidence': [
    { type: 'service', slug: 'document-intelligence' },
    { type: 'case-study', slug: 'healthcare-burden' },
  ],
  'healthcare-burden': [
    { type: 'service', slug: 'document-intelligence' },
    { type: 'blog', slug: 'pulse-clinical-ai' },
  ],
  'financial-compliance': [
    { type: 'service', slug: 'agentic-automation' },
    { type: 'blog', slug: 'gdpr-ai' },
  ],
  'manufacturing-docs': [
    { type: 'service', slug: 'document-intelligence' },
    { type: 'case-study', slug: 'admin-burden-evidence' },
  ],
  'healthcare-mlops': [
    { type: 'service', slug: 'mlops-cicd' },
    { type: 'blog', slug: 'mlops-production' },
  ],
  'retail-sql': [
    { type: 'service', slug: 'sql-dashboards' },
    { type: 'blog', slug: 'ai-consultancy-australia' },
  ],
};
