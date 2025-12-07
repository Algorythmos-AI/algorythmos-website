// /src/components/Index/ServicesPage.jsx
import React from "react";
import { Helmet } from "react-helmet-async";
import { Layers, Bot, FileText, BarChart3 } from "lucide-react";
import ServiceCard from "./services/ServiceCard";
import { servicesList } from "../../data/services";
import { useI18n } from "../../app/i18n/I18nContext.jsx";

export default function ServicesPage() {
  const { t, region } = useI18n();
  
  // Map icons by slug or title (adjust if your data format differs)
  const iconBySlug = {
    "agentic-automation": Bot,
    "document-intelligence": FileText,
    "sql-dashboards": BarChart3,
    "mlops-cicd": Layers
  };

  // Map slugs to translation key indices
  const slugToIndex = {
    "agentic-automation": 0,
    "document-intelligence": 1,
    "sql-dashboards": 2,
    "mlops-cicd": 3
  };

  // Get translated title and excerpt for each service
  const getServiceTitle = (slug) => {
    const index = slugToIndex[slug];
    return t(`services.cards.${index}.title`);
  };

  const getServiceExcerpt = (slug) => {
    const index = slugToIndex[slug];
    return t(`services.cards.${index}.excerpt`);
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>{t("services.meta.title")}</title>
        <meta
          name="description"
          content={t("services.meta.description")}
        />
        <link rel="canonical" href="https://www.algorythmos.fr/services" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t("services.meta.title")} />
        <meta property="og:description" content={t("services.meta.description")} />
        <meta property="og:url" content="https://www.algorythmos.fr/services" />
        <meta property="og:image" content="https://www.algorythmos.fr/Algorythmos.png" />
        <meta property="og:site_name" content="Algorythmos" />
        <meta property="og:locale" content={region === "FR" ? "fr_FR" : "en_US"} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("services.meta.title")} />
        <meta name="twitter:description" content={t("services.meta.description")} />
        <meta name="twitter:image" content="https://www.algorythmos.fr/Algorythmos.png" />
      </Helmet>

      <main className="pt-36 pb-20 px-6 max-w-6xl mx-auto">
        <header className="mb-10">
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t("services.hero.title")}
          </h1>
          <p className="text-gray-400 mt-3 max-w-2xl">
            {t("services.hero.subtitle")}
          </p>
        </header>

        <section className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {servicesList.map((s) => (
            <ServiceCard
              key={s.slug}
              title={getServiceTitle(s.slug)}
              href={`/services/${s.slug}`}
              icon={iconBySlug[s.slug] || Layers}
              excerpt={getServiceExcerpt(s.slug)}
            />
          ))}
        </section>
      </main>
    </div>
  );
}
