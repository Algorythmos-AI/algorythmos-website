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
        <link rel="canonical" href="https://www.algorythmos.fr/services" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Services | Algorythmos" />
        <meta property="og:description" content="AI services by Algorythmos: Agentic Automation, Document Intelligence, SQL Dashboards, and MLOps Platform Engineering." />
        <meta property="og:url" content="https://www.algorythmos.fr/services" />
        <meta property="og:image" content="https://www.algorythmos.fr/Algorythmos.png" />
        <meta property="og:site_name" content="Algorythmos" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Services | Algorythmos" />
        <meta name="twitter:description" content="AI services by Algorythmos: Agentic Automation, Document Intelligence, SQL Dashboards, and MLOps Platform Engineering." />
        <meta name="twitter:image" content="https://www.algorythmos.fr/Algorythmos.png" />
      </Helmet>

      <main className="pt-36 pb-20 px-6 max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            What we build for you
          </h1>
          <p className="text-gray-400 mt-3 max-w-2xl">
            AI consultancy services for enterprises and SMEs across France and Australia. Each service offers deep-dive architecture, measurable impact, and FAQs—from automation to MLOps, built for businesses from Sydney to Suresnes.
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
