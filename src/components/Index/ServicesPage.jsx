// /src/components/Index/ServicesPage.jsx
import React from "react";
import { Helmet } from "react-helmet-async";
import { Layers, Bot, FileText, BarChart3 } from "lucide-react";
import ServiceCard from "./services/ServiceCard";
import { servicesList } from "../../data/services";

export default function ServicesPage() {
  // Map icons by slug or title (adjust if your data format differs)
  const iconBySlug = {
    "agentic-automation": Bot,
    "document-intelligence": FileText,
    "sql-dashboards": BarChart3,
    "mlops-cicd": Layers
  };

  // Optional: tighten the excerpt for MLOps card only (display purpose on /services)
  const formatExcerpt = (s) => {
    if (s.slug === "mlops-cicd") {
      return "Productionize AI (Artificial Intelligence) with CI/CD (Continuous Integration/Continuous Delivery) on Kubernetes and Docker—automated evaluations, observability, safe rollbacks, and governance with DevSecOps (Development, Security & Operations) baked in.";
    }
    return s.tagline || s.meta || s.description || "";
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Services | Algorythmos</title>
        <meta
          name="description"
          content="AI services by Algorythmos: Agentic Automation, Document Intelligence, SQL Dashboards, and MLOps Platform Engineering."
        />
        <link rel="canonical" href="https://algorythmos.fr/services" />
      </Helmet>

      <main className="pt-36 pb-20 px-6 max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            What we build for you
          </h1>
          <p className="text-gray-400 mt-3 max-w-2xl">
            Each service has a deep-dive page with architecture, impact, and FAQs—designed like Weaviate's agentic pages.
          </p>
        </header>

        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {servicesList.map((s) => (
            <ServiceCard
              key={s.slug}
              title={s.title}
              href={`/services/${s.slug}`}
              icon={iconBySlug[s.slug] || Layers}
              excerpt={formatExcerpt(s)}
            />
          ))}
        </section>
      </main>
    </div>
  );
}
