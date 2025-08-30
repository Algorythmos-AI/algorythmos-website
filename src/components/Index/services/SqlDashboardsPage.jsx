import React from "react";
import ServiceLayout from "../ServiceLayout";
import { BarChart2 } from "lucide-react";
import SqlDashboardFlowPlayer from "./SqlDashboardFlowPlayer";

export default function SqlDashboardsPage() {
  return (
    <ServiceLayout
      slug="sql-dashboards"
      title="SQL-based Dashboards"
      meta="Transform raw data into clear, actionable dashboards so leaders can make faster, smarter decisions."
      icon={BarChart2}
      heroPoints={[
        "Modeled metrics & dimensions (single source of truth).",
        "Executive-ready dashboards with alerts and RBAC.",
        "Self-serve analytics without report backlogs."
      ]}
      sections={[
        { id: "what-it-is", heading: "What it is", paragraphs: [
          "A modern analytics stack that defines metrics once and reuses them across teams and tools."
        ]},
        { id: "stack", heading: "Typical stack", bullets: [
          "Warehouse: Postgres, Snowflake, BigQuery.",
          "Modeling: dbt (or SQL models).",
          "BI: Metabase, Lightdash, Looker."
        ]},
        { id: "governance", heading: "Governance & performance", bullets: [
          "Role-based access, row-level security where needed.",
          "Materializations and caching for speed.",
          "Change management via Git and CI checks."
        ]},
        { id: "impact", heading: "Business impact", bullets: [
          "Faster, trusted decisions with consistent KPIs.",
          "Reduced ad-hoc reporting load on data teams.",
          "Shared definitions → cross-team alignment."
        ]}
      ]}
      faqs={[
        { q: "Do you replace our BI?", a: "Not necessarily. We standardize models and plug into your preferred BI, or set up a new one if needed." }
      ]}
      related={[
        { title: "MLOps Platform Engineering", path: "/services/mlops-cicd" }
      ]}
      ctaText="Explore a Demo"
    >
      <SqlDashboardFlowPlayer />
    </ServiceLayout>
  );
}
