// src/pages/regions/fr/FrancePage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import AnimatedSection from "../../../components/ui/AnimatedSection";
import { RegionHelmet } from "../../../app/seo";
import { useI18n } from "../../../app/i18n/I18nContext";
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

/* ----------------------------- Icon Maps ----------------------------- */
const USE_CASE_ICONS = [
  <Building2 className="w-8 h-8" />,
  <Factory className="w-8 h-8" />,
  <Briefcase className="w-8 h-8" />,
  <ShoppingBag className="w-8 h-8" />,
];

const USE_CASE_GRADIENTS = [
  "from-blue-500 to-cyan-500",
  "from-green-500 to-emerald-500",
  "from-purple-500 to-pink-500",
  "from-orange-500 to-amber-500",
];

const SERVICE_ICONS = [
  <Cpu className="w-6 h-6" />,
  <FileText className="w-6 h-6" />,
  <BarChart3 className="w-6 h-6" />,
  <Settings className="w-6 h-6" />,
];

const SERVICE_LINKS = [
  "/services/agentic-automation",
  "/services/document-intelligence",
  "/services/sql-dashboards",
  "/services/mlops-cicd",
];

const COMPLIANCE_ICONS = [
  <Shield className="w-8 h-8" />,
  <Scale className="w-8 h-8" />,
  <Lock className="w-8 h-8" />,
  <Users className="w-8 h-8" />,
];

const WHY_US_ICONS = [
  <Globe className="w-8 h-8" />,
  <Shield className="w-8 h-8" />,
  <Zap className="w-8 h-8" />,
  <Users className="w-8 h-8" />,
];

const STEP_NUMBERS = ["01", "02", "03", "04"];

const FrancePage = () => {
  const { t } = useI18n();
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
              {t("regionFr.hero.badge")}
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                {t("regionFr.hero.title")}
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-8 leading-relaxed">
              {t("regionFr.hero.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-algviolet via-algpurple to-algblue text-white font-semibold shadow-brand hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {t("regionFr.hero.ctaPrimary")}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/pricing"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-300"
              >
                {t("regionFr.hero.ctaSecondary")}
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
              {t("regionFr.compliance.titlePrefix")}{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t("regionFr.compliance.titleHighlight")}
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {t("regionFr.compliance.subtitle")}
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((index) => (
              <AnimatedSection
                key={index}
                delay={index * 100}
                className="p-6 rounded-2xl bg-gradient-to-b from-algviolet/10 to-transparent border border-algviolet/30 hover:border-algviolet/50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-algviolet/20 to-algblue/20 flex items-center justify-center mb-4 text-algpurple">
                  {COMPLIANCE_ICONS[index]}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{t(`regionFr.compliance.items.${index}.title`)}</h3>
                <p className="text-gray-400">{t(`regionFr.compliance.items.${index}.description`)}</p>
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
              {t("regionFr.whyUs.titlePrefix")}{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t("regionFr.whyUs.titleHighlight")}
              </span>{" "}
              ?
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {t("regionFr.whyUs.subtitle")}
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((index) => (
              <AnimatedSection
                key={index}
                delay={index * 100}
                className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-algviolet/50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-gradient-to-r from-algviolet/20 to-algblue/20 flex items-center justify-center mb-4 text-algpurple">
                  {WHY_US_ICONS[index]}
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">{t(`regionFr.whyUs.items.${index}.title`)}</h3>
                <p className="text-gray-400">{t(`regionFr.whyUs.items.${index}.description`)}</p>
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
              {t("regionFr.useCases.titlePrefix")}{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t("regionFr.useCases.titleHighlight")}
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {t("regionFr.useCases.subtitle")}
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 gap-8">
            {[0, 1, 2, 3].map((index) => (
              <AnimatedSection
                key={index}
                delay={index * 100}
                className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300"
              >
                <div className={`w-16 h-16 rounded-xl bg-gradient-to-r ${USE_CASE_GRADIENTS[index]} bg-opacity-20 flex items-center justify-center mb-6 text-white`}>
                  {USE_CASE_ICONS[index]}
                </div>
                <h3 className="text-2xl font-semibold mb-2 text-white">{t(`regionFr.useCases.items.${index}.title`)}</h3>
                <p className="text-sm text-gray-500 mb-4">{t(`regionFr.useCases.items.${index}.titleEn`)}</p>
                <p className="text-gray-400 leading-relaxed">{t(`regionFr.useCases.items.${index}.description`)}</p>
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
              {t("regionFr.services.titlePrefix")}{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t("regionFr.services.titleHighlight")}
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {t("regionFr.services.subtitle")}
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((index) => (
              <AnimatedSection
                key={index}
                delay={index * 100}
              >
                <Link
                  to={SERVICE_LINKS[index]}
                  className="block p-6 h-full rounded-2xl bg-white/5 border border-white/10 hover:border-algviolet/50 hover:bg-white/10 transition-all duration-300 group"
                >
                  <div className="w-12 h-12 rounded-lg bg-gradient-to-r from-algviolet/20 to-algblue/20 flex items-center justify-center mb-4 text-algpurple group-hover:scale-110 transition-transform duration-300">
                    {SERVICE_ICONS[index]}
                  </div>
                  <h3 className="text-lg font-semibold mb-1 text-white group-hover:text-algpurple transition-colors">
                    {t(`regionFr.services.items.${index}.title`)}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{t(`regionFr.services.items.${index}.titleEn`)}</p>
                  <p className="text-gray-400 text-sm">{t(`regionFr.services.items.${index}.description`)}</p>
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
              {t("regionFr.howWeWork.titlePrefix")}{" "}
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                {t("regionFr.howWeWork.titleHighlight")}
              </span>
            </h2>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {t("regionFr.howWeWork.subtitle")}
            </p>
          </AnimatedSection>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[0, 1, 2, 3].map((index) => (
              <AnimatedSection
                key={index}
                delay={index * 100}
                className="relative p-6 rounded-2xl bg-white/5 border border-white/10"
              >
                <div className="text-5xl font-bold text-algviolet/20 mb-4">{STEP_NUMBERS[index]}</div>
                <h3 className="text-xl font-semibold mb-3 text-white">{t(`regionFr.howWeWork.steps.${index}.title`)}</h3>
                <p className="text-gray-400">{t(`regionFr.howWeWork.steps.${index}.description`)}</p>
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
              {t("regionFr.cta.title")}
            </h2>
            <p className="text-lg text-gray-300 mb-8 max-w-2xl mx-auto">
              {t("regionFr.cta.subtitle")}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-algviolet via-algpurple to-algblue text-white font-semibold shadow-brand hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
              >
                {t("regionFr.cta.ctaPrimary")}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                to="/pricing#calculator"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl border-2 border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-300"
              >
                {t("regionFr.cta.ctaSecondary")}
              </Link>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default FrancePage;
