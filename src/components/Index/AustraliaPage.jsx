// src/components/Index/AustraliaPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import {
  Globe,
  Cpu,
  FileText,
  BarChart3,
  Settings,
  Shield,
  Building2,
  Truck,
  Stethoscope,
  HardHat,
  ArrowRight,
  Zap,
  Users,
  Target,
} from "lucide-react";

/* ----------------------------- JSON-LD Structured Data ----------------------------- */
const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Algorythmos Australia",
  "alternateName": "Algorythmos",
  "url": "https://algorythmos.com.au",
  "logo": "https://algorythmos.com.au/Algorythmos.png",
  "description": "Algorythmos Australia delivers AI consultancy, agentic automation, document intelligence, and MLOps for Australian SMEs and enterprises across healthcare, logistics, mining, and financial services.",
  "foundingDate": "2025",
  "areaServed": {
    "@type": "Country",
    "name": "Australia"
  },
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Sydney",
    "addressRegion": "NSW",
    "addressCountry": "AU"
  },
  "sameAs": [
    "https://www.linkedin.com/company/algorythmos",
    "https://x.com/algorythmos"
  ],
  "parentOrganization": {
    "@type": "Corporation",
    "name": "Algorythmos",
    "url": "https://www.algorythmos.fr"
  }
};

/* ----------------------------- Use Cases ----------------------------- */
const USE_CASES = [
  {
    icon: <Stethoscope className="w-8 h-8" />,
    title: "Healthcare",
    description: "Automate patient intake, medical records processing, and clinical document extraction with AI that meets Australian healthcare compliance standards.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Truck className="w-8 h-8" />,
    title: "Logistics & Supply Chain",
    description: "Streamline freight documentation, customs processing, and supply chain visibility with intelligent document automation and real-time dashboards.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: <HardHat className="w-8 h-8" />,
    title: "Mining & Resources",
    description: "Deploy AI-powered analytics for operational efficiency, safety compliance reporting, and predictive maintenance across remote sites.",
    gradient: "from-orange-500 to-amber-500",
  },
  {
    icon: <Building2 className="w-8 h-8" />,
    title: "Financial Services",
    description: "Accelerate loan processing, automate compliance checks, and extract insights from financial documents with enterprise-grade security.",
    gradient: "from-purple-500 to-pink-500",
  },
];

/* ----------------------------- Services ----------------------------- */
const SERVICES = [
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "Agentic Automation",
    description: "AI agents that orchestrate complex workflows, eliminate manual handoffs, and scale with your business.",
    link: "/services/agentic-automation",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Document Intelligence",
    description: "Extract, classify, and process documents automatically with OCR and NLP tailored to Australian business formats.",
    link: "/services/document-intelligence",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "SQL Analytics Dashboards",
    description: "Transform raw data into executive-ready dashboards that drive decisions across your organisation.",
    link: "/services/sql-dashboards",
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: "MLOps & CI/CD",
    description: "Production-grade machine learning pipelines with continuous integration, monitoring, and governance.",
    link: "/services/mlops-cicd",
  },
];

/* ----------------------------- Why Algorythmos ----------------------------- */
const WHY_ALGORYTHMOS = [
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Local Expertise, Global Standards",
    description: "We combine Australian market knowledge with world-class AI engineering practices from Europe.",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Security & Compliance First",
    description: "Built for Australian Privacy Principles (APPs) and enterprise security requirements from day one.",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Rapid Time-to-Value",
    description: "From discovery to production in weeks, not months. We focus on measurable ROI, not endless pilots.",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Boutique Partnership Model",
    description: "Direct access to senior AI engineers who understand your business, not layers of account managers.",
  },
];

/* ----------------------------- How We Work ----------------------------- */
const PROCESS_STEPS = [
  {
    step: "01",
    title: "Discovery & Assessment",
    description: "We map your current workflows, identify automation opportunities, and quantify potential ROI.",
  },
  {
    step: "02",
    title: "Proof of Concept",
    description: "Build a working prototype on your data within 2-4 weeks to validate the approach and refine requirements.",
  },
  {
    step: "03",
    title: "Production Deployment",
    description: "Deploy to production with CI/CD pipelines, monitoring, and security controls tailored to your infrastructure.",
  },
  {
    step: "04",
    title: "Ongoing Partnership",
    description: "Continuous improvement, model retraining, and expansion to new use cases as your needs evolve.",
  },
];

const AustraliaPage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <Helmet>
        <title>Algorythmos Australia | AI Consultancy for Australian SMEs & Enterprises</title>
        <meta
          name="description"
          content="Algorythmos Australia delivers AI consultancy, agentic automation, document intelligence, and MLOps for Australian SMEs and enterprises across healthcare, logistics, mining, and financial services."
        />
        <link rel="canonical" href="https://algorythmos.com.au" />
        
        {/* Hreflang for international targeting */}
        <link rel="alternate" hreflang="x-default" href="https://www.algorythmos.fr" />
        <link rel="alternate" hreflang="en-AU" href="https://algorythmos.com.au" />
        <link rel="alternate" hreflang="fr-FR" href="https://algorythmos.fr" />
        
        {/* Open Graph */}
        <meta property="og:type" content="website" />
        <meta property="og:title" content="Algorythmos Australia | AI Consultancy for Australian SMEs & Enterprises" />
        <meta property="og:description" content="Algorythmos Australia delivers AI consultancy, agentic automation, document intelligence, and MLOps for Australian SMEs and enterprises across healthcare, logistics, mining, and financial services." />
        <meta property="og:url" content="https://algorythmos.com.au" />
        <meta property="og:image" content="https://algorythmos.com.au/Algorythmos.png" />
        <meta property="og:site_name" content="Algorythmos Australia" />
        <meta property="og:locale" content="en_AU" />
        
        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Algorythmos Australia | AI Consultancy for Australian SMEs & Enterprises" />
        <meta name="twitter:description" content="Algorythmos Australia delivers AI consultancy, agentic automation, document intelligence, and MLOps for Australian SMEs and enterprises." />
        <meta name="twitter:image" content="https://algorythmos.com.au/Algorythmos.png" />
        
        {/* JSON-LD Structured Data */}
        <script type="application/ld+json">
          {JSON.stringify(organizationJsonLd)}
        </script>
      </Helmet>

      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-black" />
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{
            background: "linear-gradient(45deg, #3B82F6, #8B5CF6)",
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`,
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{
            background: "linear-gradient(45deg, #6D00FF, #3715E0)",
            transform: `translate(-${scrollY * 0.1}px, -${scrollY * 0.05}px)`,
            animationDelay: "1s",
          }}
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 min-h-[70vh] flex items-center justify-center px-4 pt-16">
        <div className="max-w-6xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="inline-block px-4 py-2 mb-6 text-sm font-medium rounded-full bg-gradient-to-r from-algviolet/20 to-algblue/20 border border-algviolet/30 text-algpurple">
              🇦🇺 Serving Australian Businesses
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Algorythmos Australia
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              AI consultancy delivering agentic automation, document intelligence, and MLOps 
              for Australian SMEs and enterprises — from Sydney to Perth, Melbourne to Brisbane.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-algviolet via-algpurple to-algblue text-white font-semibold shadow-brand hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Book a Discovery Call
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-300"
              >
                View Pricing
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Why Algorythmos in Australia */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Algorythmos
              </span>{" "}
              in Australia?
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              We bring European AI engineering excellence to Australian businesses, 
              combining global best practices with local market understanding.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_ALGORYTHMOS.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-algviolet/50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-algviolet/20 to-algblue/20 flex items-center justify-center mb-4 text-algpurple">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="relative z-10 py-24 px-4 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Typical{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Use Cases
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              AI solutions tailored for key Australian industry sectors.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {USE_CASES.map((useCase, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${useCase.gradient} bg-opacity-20 flex items-center justify-center mb-6 text-white`}>
                  {useCase.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-4 text-white">{useCase.title}</h3>
                <p className="text-gray-400 leading-relaxed">{useCase.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Our{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Services
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              End-to-end AI capabilities delivered by senior engineers who understand Australian business.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Link
                  to={service.link}
                  className="block p-6 h-full rounded-2xl bg-white/5 border border-white/10 hover:border-algviolet/50 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-algviolet/20 to-algblue/20 flex items-center justify-center mb-4 text-algpurple group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-2 text-white group-hover:text-algpurple transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-gray-400 text-sm">{service.description}</p>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="relative z-10 py-24 px-4 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              How We{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Work
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              A structured approach that delivers measurable results, fast.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="text-5xl font-bold text-algviolet/20 mb-4">{step.step}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="p-12 rounded-3xl bg-gradient-to-r from-algviolet/20 via-algpurple/10 to-algblue/20 border border-white/10 text-center"
          >
            <Target className="w-16 h-16 mx-auto mb-6 text-algpurple" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Ready to Transform Your Business with AI?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Book a free 30-minute discovery call to discuss your automation opportunities 
              and see how we can help you achieve measurable ROI.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-algviolet via-algpurple to-algblue text-white font-semibold shadow-brand hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Book Discovery Call
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/pricing#calculator"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-300"
              >
                Calculate Your ROI
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default AustraliaPage;
