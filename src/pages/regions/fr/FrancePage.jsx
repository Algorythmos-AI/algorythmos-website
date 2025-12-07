// src/pages/regions/fr/FrancePage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AnimatedSection from "../../../components/ui/AnimatedSection";
import { RegionHelmet } from "../../../app/seo";
import {
  Globe,
  Cpu,
  FileText,
  BarChart3,
  Settings,
  Shield,
  Building2,
  Factory,
  Briefcase,
  ShoppingBag,
  ArrowRight,
  Zap,
  Users,
  Target,
  Scale,
  Lock,
} from "lucide-react";

/* ----------------------------- Use Cases ----------------------------- */
const USE_CASES = [
  {
    icon: <Building2 className="w-8 h-8" />,
    title: "Services Financiers",
    titleEn: "Financial Services",
    description: "Automatisez le traitement des documents financiers, la conformité réglementaire et l'analyse des risques avec une IA conforme au RGPD.",
    gradient: "from-blue-500 to-cyan-500",
  },
  {
    icon: <Factory className="w-8 h-8" />,
    title: "Industrie & Manufacturing",
    titleEn: "Manufacturing",
    description: "Optimisez vos opérations avec des dashboards temps réel, la maintenance prédictive et l'automatisation des processus qualité.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: <Briefcase className="w-8 h-8" />,
    title: "Services Professionnels",
    titleEn: "Professional Services",
    description: "Libérez vos équipes des tâches répétitives grâce à l'automatisation agentique et l'extraction intelligente de données.",
    gradient: "from-purple-500 to-pink-500",
  },
  {
    icon: <ShoppingBag className="w-8 h-8" />,
    title: "Retail & E-commerce",
    titleEn: "Retail & E-commerce",
    description: "Analysez vos données clients, automatisez la gestion documentaire et créez des tableaux de bord décisionnels.",
    gradient: "from-orange-500 to-amber-500",
  },
];

/* ----------------------------- Services ----------------------------- */
const SERVICES = [
  {
    icon: <Cpu className="w-6 h-6" />,
    title: "Automatisation Agentique",
    titleEn: "Agentic Automation",
    description: "Des agents IA qui orchestrent vos workflows complexes et éliminent les tâches manuelles.",
    link: "/services/agentic-automation",
  },
  {
    icon: <FileText className="w-6 h-6" />,
    title: "Intelligence Documentaire",
    titleEn: "Document Intelligence",
    description: "Extraction, classification et traitement automatique de vos documents avec OCR et NLP.",
    link: "/services/document-intelligence",
  },
  {
    icon: <BarChart3 className="w-6 h-6" />,
    title: "Dashboards SQL",
    titleEn: "SQL Dashboards",
    description: "Transformez vos données brutes en tableaux de bord décisionnels pour vos dirigeants.",
    link: "/services/sql-dashboards",
  },
  {
    icon: <Settings className="w-6 h-6" />,
    title: "MLOps & CI/CD",
    titleEn: "MLOps & CI/CD",
    description: "Pipelines ML production-ready avec intégration continue, monitoring et gouvernance.",
    link: "/services/mlops-cicd",
  },
];

/* ----------------------------- Compliance Features ----------------------------- */
const COMPLIANCE_FEATURES = [
  {
    icon: <Shield className="w-8 h-8" />,
    title: "RGPD by Design",
    description: "Nos solutions sont conçues dès le départ pour respecter le Règlement Général sur la Protection des Données.",
  },
  {
    icon: <Scale className="w-8 h-8" />,
    title: "EU AI Act Ready",
    description: "Préparation proactive aux exigences du règlement européen sur l'intelligence artificielle.",
  },
  {
    icon: <Lock className="w-8 h-8" />,
    title: "LLMSecOps",
    description: "Sécurité applicative et contrôles spécifiques pour les systèmes basés sur les grands modèles de langage.",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Gouvernance & Audit",
    description: "Traçabilité complète, documentation et audit trail pour vos déploiements IA.",
  },
];

/* ----------------------------- Why Algorythmos ----------------------------- */
const WHY_ALGORYTHMOS = [
  {
    icon: <Globe className="w-8 h-8" />,
    title: "Expertise Locale",
    description: "Basés à Suresnes, nous comprenons le marché français et ses spécificités réglementaires.",
  },
  {
    icon: <Shield className="w-8 h-8" />,
    title: "Conformité Garantie",
    description: "RGPD, EU AI Act, SecNumCloud : la conformité est au cœur de notre approche.",
  },
  {
    icon: <Zap className="w-8 h-8" />,
    title: "Time-to-Value Rapide",
    description: "Du POC à la production en semaines. Nous privilégions le ROI mesurable.",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Modèle Boutique",
    description: "Accès direct à des ingénieurs IA seniors, pas des couches de commerciaux.",
  },
];

/* ----------------------------- How We Work ----------------------------- */
const PROCESS_STEPS = [
  {
    step: "01",
    title: "Découverte & Audit",
    description: "Nous analysons vos workflows actuels et identifions les opportunités d'automatisation.",
  },
  {
    step: "02",
    title: "Proof of Concept",
    description: "Prototype fonctionnel sur vos données en 2-4 semaines pour valider l'approche.",
  },
  {
    step: "03",
    title: "Mise en Production",
    description: "Déploiement avec CI/CD, monitoring et contrôles de sécurité adaptés à votre infrastructure.",
  },
  {
    step: "04",
    title: "Partenariat Continu",
    description: "Amélioration continue, ré-entraînement des modèles et extension à de nouveaux cas d'usage.",
  },
];

const FrancePage = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <RegionHelmet region="FR" />

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
          <AnimatedSection>
            <span className="inline-block px-4 py-2 mb-6 text-sm font-medium rounded-full bg-gradient-to-r from-algviolet/20 to-algblue/20 border border-algviolet/30 text-algpurple">
              🇫🇷 Basé à Suresnes, Île-de-France
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Algorythmos France
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              Cabinet de conseil en IA pour les PME et ETI françaises.
              Automatisation agentique, intelligence documentaire, dashboards SQL et MLOps — 
              conforme RGPD et EU AI Act.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-algviolet via-algpurple to-algblue text-white font-semibold shadow-brand hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Réserver un Appel Découverte
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-300"
              >
                Voir les Tarifs
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Compliance Section - RGPD & EU AI Act */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Conformité{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                RGPD & EU AI Act
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              La conformité réglementaire n'est pas une contrainte, c'est un avantage compétitif.
              Nous intégrons les exigences européennes dès la conception.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {COMPLIANCE_FEATURES.map((item, index) => (
              <AnimatedSection
                key={index}
                delay={index * 100}
                className="p-6 rounded-2xl bg-gradient-to-b from-algviolet/10 to-transparent border border-algviolet/30 hover:border-algviolet/50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-algviolet/20 to-algblue/20 flex items-center justify-center mb-4 text-algpurple">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Why Algorythmos */}
      <section className="relative z-10 py-24 px-4 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Pourquoi{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Algorythmos
              </span>{" "}
              ?
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Une approche boutique qui privilégie la qualité et les résultats mesurables.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {WHY_ALGORYTHMOS.map((item, index) => (
              <AnimatedSection
                key={index}
                delay={index * 100}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-algviolet/50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-algviolet/20 to-algblue/20 flex items-center justify-center mb-4 text-algpurple">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Cas d'Usage{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Sectoriels
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Des solutions IA adaptées aux secteurs clés de l'économie française.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {USE_CASES.map((useCase, index) => (
              <AnimatedSection
                key={index}
                delay={index * 100}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${useCase.gradient} bg-opacity-20 flex items-center justify-center mb-6 text-white`}>
                  {useCase.icon}
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-white">{useCase.title}</h3>
                <p className="text-sm text-gray-500 mb-4">{useCase.titleEn}</p>
                <p className="text-gray-400 leading-relaxed">{useCase.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="relative z-10 py-24 px-4 bg-gradient-to-b from-transparent via-blue-900/5 to-transparent">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Nos{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Services
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Des capacités IA end-to-end délivrées par des ingénieurs seniors.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, index) => (
              <AnimatedSection
                key={index}
                delay={index * 100}
              >
                <Link
                  to={service.link}
                  className="block p-6 h-full rounded-2xl bg-white/5 border border-white/10 hover:border-algviolet/50 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-algviolet/20 to-algblue/20 flex items-center justify-center mb-4 text-algpurple group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <h3 className="text-lg font-semibold mb-1 text-white group-hover:text-algpurple transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{service.titleEn}</p>
                  <p className="text-gray-400 text-sm">{service.description}</p>
                </Link>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* How We Work */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <AnimatedSection
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              Notre{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Méthodologie
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              Une approche structurée pour des résultats mesurables, rapidement.
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {PROCESS_STEPS.map((step, index) => (
              <AnimatedSection
                key={index}
                delay={index * 100}
                className="relative p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="text-5xl font-bold text-algviolet/20 mb-4">{step.step}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">{step.title}</h3>
                <p className="text-gray-400">{step.description}</p>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <AnimatedSection
            className="p-12 rounded-3xl bg-gradient-to-r from-algviolet/20 via-algpurple/10 to-algblue/20 border border-white/10 text-center"
          >
            <Target className="w-16 h-16 mx-auto mb-6 text-algpurple" />
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-white">
              Prêt à Transformer Votre Entreprise avec l'IA ?
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              Réservez un appel découverte gratuit de 30 minutes pour discuter 
              de vos opportunités d'automatisation et calculer votre ROI potentiel.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-algviolet via-algpurple to-algblue text-white font-semibold shadow-brand hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                Réserver un Appel
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/pricing#calculator"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-300"
              >
                Calculer Votre ROI
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default FrancePage;
