// /src/components/Index/ServicesPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Bot, FileText, BarChart2, Layers, ArrowRight } from "lucide-react";
// Footer is global via App.jsx

const services = [
  {
    slug: "agentic-automation",
    icon: <Bot className="w-12 h-12" />,
    title: "Agentic Automation",
    description:
      "Deploy AI agents that handle repetitive workflows, integrate with APIs, and streamline operations—boosting productivity and reducing costs.",
    gradient: "from-blue-500 to-purple-500",
  },
  {
    slug: "document-intelligence",
    icon: <FileText className="w-12 h-12" />,
    title: "Document Intelligence",
    description:
      "Extract insights from contracts, invoices, and reports using next-gen OCR & NLP. Improve accuracy, reduce manual effort, and accelerate compliance.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    slug: "sql-dashboards",
    icon: <BarChart2 className="w-12 h-12" />,
    title: "SQL-Based Dashboards",
    description:
      "Turn raw data into actionable dashboards built on SQL. Empower leaders to make faster, smarter, and more confident decisions in real-time.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    slug: "mlops-cicd",
    icon: <Layers className="w-12 h-12" />,
    title: "MLOps & CI/CD",
    description:
      "Streamline AI deployment with CI/CD pipelines, Docker, Kubernetes, and GitHub Actions—cutting deployment errors by 50% and reducing operational costs.",
    gradient: "from-yellow-500 to-orange-500",
  },
];

const ServicesPage = () => {
  // Page-specific state only

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative flex flex-col">
      {/* Global Navbar is rendered by App.jsx */}

      {/* Hero Section */}
      <main className="pt-40 pb-20 px-6 max-w-5xl mx-auto text-center flex-grow">
        <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Our Services
        </h1>
        <p className="text-2xl text-gray-300 mb-16 leading-relaxed">
          Algorythmos is a boutique AI & Data Science consultancy helping
          enterprises unlock the real value of their data. We specialize in
          secure, ROI-driven AI solutions that reduce costs, save time, and
          empower better decision-making.
        </p>

        {/* Services Grid */}
        <div className="grid md:grid-cols-2 gap-12">
          {services.map((service, index) => (
            <Link
              key={service.title}
              to={`/services/${service.slug}`}
              className="group relative p-10 bg-gradient-to-br from-gray-900/60 to-black/60 rounded-3xl 
              border border-gray-800/50 hover:border-white/20 backdrop-blur-xl transition-all duration-700 
              transform hover:scale-105 hover:-translate-y-4 overflow-hidden block"
              style={{ transitionDelay: `${index * 150}ms` }}
              aria-label={`${service.title} details`}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-br ${service.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700`}
              />
              <div className="relative z-10">
                <div
                  className={`inline-flex p-4 bg-gradient-to-br ${service.gradient} rounded-2xl mb-6 group-hover:scale-110 transition-all duration-500`}
                >
                  {service.icon}
                </div>
                <h3 className="text-3xl font-bold mb-4">{service.title}</h3>
                <p className="text-lg text-gray-300 group-hover:text-white transition-colors duration-500">
                  {service.description}
                </p>
              </div>
            </Link>
          ))}
        </div>

        {/* Call to Action */}
        <div className="mt-20">
          <Link
            to="/contact"
            className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-2xl overflow-hidden transform hover:scale-105 transition-all duration-500 shadow-lg inline-flex"
            aria-label="Book a consultation"
          >
            <span className="relative flex items-center justify-center">
              Book a Consultation
              <ArrowRight className="ml-3 w-7 h-7 group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </Link>
        </div>
      </main>

      {/* Global Footer is rendered by App.jsx */}
    </div>
  );
};

export default ServicesPage;
