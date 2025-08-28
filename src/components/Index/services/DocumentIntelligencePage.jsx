import React from "react";
import ServiceLayout from "../ServiceLayout";
import { FileText } from "lucide-react";

export default function DocumentIntelligencePage() {
  return (
    <ServiceLayout
      slug="document-intelligence"
      title="Document Intelligence"
      meta="Extract insights from contracts, invoices, and business documents with next-gen OCR and NLP—improving accuracy and reducing manual effort."
      icon={FileText}
      heroPoints={[
        "Enterprise-grade OCR + layout parsing.",
        "Domain-tuned extraction and schema validation.",
        "Human-in-the-loop UI for low-confidence fields."
      ]}
      sections={[
        { id: "what-it-is", heading: "What it is", paragraphs: [
          "We transform unstructured files into reliable, structured data for ERP, finance, procurement, and compliance workflows."
        ]},
        { id: "pipeline", heading: "Pipeline", paragraphs: [
          "Ingestion → OCR/layout → entity extraction → validation rules → human review (optional) → export to DB/ERP/warehouse."
        ]},
        { id: "integrations", heading: "Integrations", bullets: [
          "S3/GCS/Azure blob, SFTP, email inbox.",
          "Export to Postgres, Snowflake, BigQuery, SAP/Oracle/NetSuite.",
          "Webhooks and REST APIs."
        ]},
        { id: "impact", heading: "Business impact", bullets: [
          "50% less manual keying and faster approvals.",
          "Standardized data across vendors and templates.",
          "Clear confidence scores and exception queues."
        ]}
      ]}
      faqs={[
        { q: "Which file types?", a: "PDF, PNG, JPG, TIFF; single or batches. Handwritten support varies by language/quality." },
        { q: "New templates?", a: "Yes—few-shot examples and rules adapt quickly to new formats." }
      ]}
      related={[
        { title: "Agentic Automation", path: "/services/agentic-automation" },
        { title: "SQL-based Dashboards", path: "/services/sql-dashboards" }
      ]}
      ctaText="Book a Consultation"
    />
  );
}
