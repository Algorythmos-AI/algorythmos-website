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
    { type: 'blog', slug: 'port-botany-document-flows' },
    { type: 'case-study', slug: 'port-botany-ai-ml' },
    { type: 'case-study', slug: 'manufacturing-docs' },
  ],
  'sql-dashboards': [
    { type: 'case-study', slug: 'retail-sql' },
    { type: 'blog', slug: 'ai-consultancy-australia' },
    { type: 'service', slug: 'data-feature-management' },
  ],
  'mlops-cicd': [
    { type: 'blog', slug: 'mlops-production' },
    { type: 'case-study', slug: 'port-botany-ai-ml' },
    { type: 'case-study', slug: 'healthcare-mlops' },
    { type: 'service', slug: 'ai-platform-engineering' },
    { type: 'service', slug: 'model-monitoring' },
  ],
  llmops: [
    { type: 'blog', slug: 'llmsecops' },
    { type: 'blog', slug: 'agentic-ai' },
    { type: 'case-study', slug: 'healthcare-mlops' },
    { type: 'service', slug: 'agentic-automation' },
    { type: 'service', slug: 'model-monitoring' },
  ],
  'ai-platform-engineering': [
    { type: 'blog', slug: 'mlops-production' },
    { type: 'case-study', slug: 'healthcare-mlops' },
    { type: 'service', slug: 'mlops-cicd' },
    { type: 'service', slug: 'model-monitoring' },
  ],
  'model-monitoring': [
    { type: 'blog', slug: 'mlops-production' },
    { type: 'case-study', slug: 'healthcare-mlops' },
    { type: 'service', slug: 'mlops-cicd' },
    { type: 'service', slug: 'llmops' },
  ],
  'data-feature-management': [
    { type: 'blog', slug: 'mlops-production' },
    { type: 'case-study', slug: 'retail-sql' },
    { type: 'service', slug: 'sql-dashboards' },
    { type: 'service', slug: 'model-monitoring' },
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
    { type: 'case-study', slug: 'port-botany-ai-ml' },
  ],
  'eu-ai-act-gdpr-sme-roadmap': [
    { type: 'service', slug: 'document-intelligence' },
    { type: 'blog', slug: 'gdpr-ai' },
  ],
  'port-botany-document-flows': [
    { type: 'case-study', slug: 'port-botany-ai-ml' },
    { type: 'service', slug: 'document-intelligence' },
  ],
  'choosing-ai-consultancy-sydney': [
    { type: 'case-study', slug: 'financial-compliance' },
    { type: 'blog', slug: 'ai-consultancy-australia' },
  ],
};

/** Case study → the service that delivered it + a sibling study. */
export const caseStudyRelated: Record<string, RelatedRef[]> = {
  'port-botany-ai-ml': [
    { type: 'service', slug: 'document-intelligence' },
    { type: 'blog', slug: 'port-botany-document-flows' },
    { type: 'service', slug: 'mlops-cicd' },
  ],
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
