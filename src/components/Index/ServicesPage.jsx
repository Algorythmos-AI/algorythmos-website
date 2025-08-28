// /src/components/Index/ServicesPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { servicesList } from "../../data/services";

export default function ServicesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>Services | Algorythmos</title>
        <meta
          name="description"
          content="AI services by Algorythmos: Agentic Automation, Document Intelligence, SQL Dashboards, and MLOps & CI/CD."
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
          {servicesList.map(({ slug, title, tagline, icon: Icon }) => (
            <Link
              key={slug}
              to={`/services/${slug}`}
              className="group rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/60 to-black/60 p-6 hover:border-white/20 hover:shadow-2xl"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex p-3 rounded-xl bg-white/5">
                  <Icon className="w-6 h-6 text-blue-300" />
                </span>
                <h2 className="text-xl font-bold">{title}</h2>
              </div>
              <p className="text-gray-300">{tagline}</p>
              <div className="mt-5 text-sm text-blue-300 group-hover:text-white">Read more →</div>
            </Link>
          ))}
        </section>
      </main>
    </div>
  );
}
