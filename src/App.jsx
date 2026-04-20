/**
 * 🚨 IMPORTANT FOR AI AGENTS
 *
 * This project is bilingual EN/FR.
 * Routing MUST respect locale prefixes:
 *   /services/...           → EN
 *   /au-en/services/...     → EN (AU)
 *   /fr-fr/services/...     → FR
 *
 * Do NOT hardcode English or French strings.
 * Always use:   const { t } = useI18n();
 * And:          t('your.key.here')
 *
 * Full rules:
 * /docs/AI_AGENT_WORKFLOW.md
 */

import React, { Suspense, lazy } from 'react';
import './App.css';
import { Routes, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

// ============================================
// EAGER IMPORTS - Always loaded (shell components)
// ============================================
import NavBar from './components/layout/Navigation.jsx';
import Footer from './components/layout/Footer.jsx';
import GlobalCtaTracker from './components/common/GlobalCtaTracker.jsx';
import PageLoader from './components/common/PageLoader.jsx';
import RegionLayout from './pages/regions/RegionLayout.jsx';
import { GeoRouter } from './components/routing/GeoRouter.jsx';
import { SeoHead } from './components/seo/SeoHead.jsx';
import { AuthProvider } from './app/auth/AuthContext.jsx';

// ============================================
// LAZY IMPORTS - Route-level code splitting
// Each page loads only when its route is accessed
// ============================================

// Home
const AdvancedBusinessWebsite = lazy(() => import('./pages/home/AdvancedBusinessWebsite.jsx'));

// Services
const ServicesPage = lazy(() => import('./pages/services/ServicesPage.jsx'));
const ServiceDetailPage = lazy(() => import('./pages/services/ServiceDetailPage.jsx'));
const AgenticAutomationPage = lazy(() => import('./pages/services/services/AgenticAutomationPage.jsx'));
const DocumentIntelligencePage = lazy(() => import('./pages/services/services/DocumentIntelligencePage.jsx'));
const SqlDashboardsPage = lazy(() => import('./pages/services/services/SqlDashboardsPage.jsx'));
const MlopsCicdPage = lazy(() => import('./pages/services/services/MlopsCicdPage.jsx'));
const AiWebsitesPage = lazy(() => import('./pages/services/services/AiWebsitesPage.jsx'));

// Contact & Company
const QuantumAboutPage = lazy(() => import('./pages/contact/QuantumAboutPage.jsx'));
const QuantumContactPage = lazy(() => import('./pages/contact/QuantumContactPage.jsx'));
const PricingPage = lazy(() => import('./pages/contact/PricingPage.jsx'));
const CareersPage = lazy(() => import('./pages/CareersPage.jsx'));

// Insights
const CaseStudiesPage = lazy(() => import('./pages/insights/CaseStudiesPage.jsx'));
const CaseStudyPage = lazy(() => import('./pages/insights/CaseStudyPage.jsx'));
const BlogPage = lazy(() => import('./pages/insights/BlogPage.jsx'));
const BlogDetailPage = lazy(() => import('./pages/insights/BlogDetailPage.jsx'));

// Region Pages
const AustraliaPage = lazy(() => import('./pages/regions/au/AustraliaPage.jsx'));
const FrancePage = lazy(() => import('./pages/regions/fr/FrancePage.jsx'));

// Error Pages
const NotFoundPage = lazy(() => import('./pages/NotFoundPage.jsx'));

// Legal Pages
const PrivacyPolicyPage = lazy(() => import('./pages/legal/PrivacyPolicyPage.jsx'));
const TermsOfServicePage = lazy(() => import('./pages/legal/TermsOfServicePage.jsx'));

// Organisation JSON-LD schema (global) — World-class enhanced for Google Knowledge Panel
const ORGANISATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Algorythmos",
  "alternateName": "Algorythmos™",
  "url": "https://algorythmos.com",
  "logo": "https://algorythmos.com/Algorythmos.png",
  "image": "https://algorythmos.com/Algorythmos.png",
  "description": "Algorythmos is a global AI consultancy delivering agentic automation, document intelligence, SQL dashboards, and MLOps for SMEs and enterprises in Australia and France.",
  "foundingDate": "2025",
  "foundingLocation": {
    "@type": "Place",
    "name": "Suresnes, France"
  },
  "areaServed": [
    { "@type": "Country", "name": "Australia" },
    { "@type": "Country", "name": "France" },
    { "@type": "Continent", "name": "Europe" },
    { "@type": "GeoShape", "name": "APAC" }
  ],
  "knowsAbout": [
    "Artificial Intelligence",
    "Agentic Automation",
    "Document Intelligence",
    "OCR",
    "MLOps",
    "SQL Dashboards",
    "LLM Engineering",
    "AI Consulting"
  ],
  "sameAs": [
    "https://www.linkedin.com/company/algorythmos",
    "https://twitter.com/algorythmos",
    "https://github.com/algorythmos",
    "https://medium.com/@algorythmos"
  ],
  "contactPoint": [
    {
      "@type": "ContactPoint",
      "contactType": "sales",
      "areaServed": ["AU", "APAC"],
      "availableLanguage": "English",
      "url": "https://algorythmos.com/au-en/contact"
    },
    {
      "@type": "ContactPoint",
      "contactType": "sales",
      "areaServed": ["FR", "Europe"],
      "availableLanguage": ["French", "English"],
      "url": "https://algorythmos.com/fr-fr/contact"
    }
  ],
  "address": [
    {
      "@type": "PostalAddress",
      "addressCountry": "AU",
      "addressLocality": "Sydney",
      "addressRegion": "NSW"
    },
    {
      "@type": "PostalAddress",
      "addressCountry": "FR",
      "addressLocality": "Suresnes",
      "addressRegion": "Île-de-France",
      "postalCode": "92150"
    }
  ]
};

// SiteNavigationElement JSON-LD for main nav (NVIDIA-style sitelinks)
const SITE_NAVIGATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "SiteNavigationElement",
  "name": ["Home", "Services", "Pricing", "About", "Case Studies", "Blog", "Contact", "Careers"],
  "url": [
    "https://algorythmos.com/",
    "https://algorythmos.com/services",
    "https://algorythmos.com/pricing",
    "https://algorythmos.com/about",
    "https://algorythmos.com/case-studies",
    "https://algorythmos.com/blog",
    "https://algorythmos.com/contact",
    "https://algorythmos.com/careers"
  ]
};

function App() {
  return (
    <AuthProvider>
      <GeoRouter />
      <SeoHead />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(ORGANISATION_SCHEMA)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(SITE_NAVIGATION_SCHEMA)}
        </script>
      </Helmet>
      <GlobalCtaTracker />
      <NavBar />

      {/* Suspense wrapper for all lazy-loaded routes */}
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* ========================================
              GLOBAL (default) routes - no prefix
          ======================================== */}
          <Route path="/" element={<AdvancedBusinessWebsite />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/agentic-automation" element={<AgenticAutomationPage />} />
          <Route path="/services/document-intelligence" element={<DocumentIntelligencePage />} />
          <Route path="/services/sql-dashboards" element={<SqlDashboardsPage />} />
          <Route path="/services/mlops-cicd" element={<MlopsCicdPage />} />
          <Route path="/services/ai-websites" element={<AiWebsitesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/about" element={<QuantumAboutPage />} />
          <Route path="/contact" element={<QuantumContactPage />} />
          <Route path="/case-studies" element={<CaseStudiesPage />} />
          <Route path="/case-studies/:slug" element={<CaseStudyPage />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogDetailPage />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/careers" element={<CareersPage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />

          {/* ========================================
              AUSTRALIA /au-en/* routes
          ======================================== */}
          <Route path="/au-en" element={<RegionLayout region="AU"><AustraliaPage /></RegionLayout>} />
          <Route path="/au-en/services" element={<RegionLayout region="AU"><ServicesPage /></RegionLayout>} />
          <Route path="/au-en/services/agentic-automation" element={<RegionLayout region="AU"><AgenticAutomationPage /></RegionLayout>} />
          <Route path="/au-en/services/document-intelligence" element={<RegionLayout region="AU"><DocumentIntelligencePage /></RegionLayout>} />
          <Route path="/au-en/services/sql-dashboards" element={<RegionLayout region="AU"><SqlDashboardsPage /></RegionLayout>} />
          <Route path="/au-en/services/mlops-cicd" element={<RegionLayout region="AU"><MlopsCicdPage /></RegionLayout>} />
          <Route path="/au-en/services/ai-websites" element={<RegionLayout region="AU"><AiWebsitesPage /></RegionLayout>} />
          <Route path="/au-en/services/:slug" element={<RegionLayout region="AU"><ServiceDetailPage /></RegionLayout>} />
          <Route path="/au-en/about" element={<RegionLayout region="AU"><QuantumAboutPage /></RegionLayout>} />
          <Route path="/au-en/contact" element={<RegionLayout region="AU"><QuantumContactPage /></RegionLayout>} />
          <Route path="/au-en/pricing" element={<RegionLayout region="AU"><PricingPage /></RegionLayout>} />
          <Route path="/au-en/case-studies" element={<RegionLayout region="AU"><CaseStudiesPage /></RegionLayout>} />
          <Route path="/au-en/case-studies/:slug" element={<RegionLayout region="AU"><CaseStudyPage /></RegionLayout>} />
          <Route path="/au-en/blog" element={<RegionLayout region="AU"><BlogPage /></RegionLayout>} />
          <Route path="/au-en/blog/:slug" element={<RegionLayout region="AU"><BlogDetailPage /></RegionLayout>} />
          <Route path="/au-en/careers" element={<RegionLayout region="AU"><CareersPage /></RegionLayout>} />
          <Route path="/au-en/privacy" element={<RegionLayout region="AU"><PrivacyPolicyPage /></RegionLayout>} />
          <Route path="/au-en/terms" element={<RegionLayout region="AU"><TermsOfServicePage /></RegionLayout>} />

          {/* ========================================
              FRANCE /fr-fr/* routes
          ======================================== */}
          <Route path="/fr-fr" element={<RegionLayout region="FR"><FrancePage /></RegionLayout>} />
          <Route path="/fr-fr/services" element={<RegionLayout region="FR"><ServicesPage /></RegionLayout>} />
          <Route path="/fr-fr/services/agentic-automation" element={<RegionLayout region="FR"><AgenticAutomationPage /></RegionLayout>} />
          <Route path="/fr-fr/services/document-intelligence" element={<RegionLayout region="FR"><DocumentIntelligencePage /></RegionLayout>} />
          <Route path="/fr-fr/services/sql-dashboards" element={<RegionLayout region="FR"><SqlDashboardsPage /></RegionLayout>} />
          <Route path="/fr-fr/services/mlops-cicd" element={<RegionLayout region="FR"><MlopsCicdPage /></RegionLayout>} />
          <Route path="/fr-fr/services/ai-websites" element={<RegionLayout region="FR"><AiWebsitesPage /></RegionLayout>} />
          <Route path="/fr-fr/services/:slug" element={<RegionLayout region="FR"><ServiceDetailPage /></RegionLayout>} />
          <Route path="/fr-fr/about" element={<RegionLayout region="FR"><QuantumAboutPage /></RegionLayout>} />
          <Route path="/fr-fr/contact" element={<RegionLayout region="FR"><QuantumContactPage /></RegionLayout>} />
          <Route path="/fr-fr/pricing" element={<RegionLayout region="FR"><PricingPage /></RegionLayout>} />
          <Route path="/fr-fr/case-studies" element={<RegionLayout region="FR"><CaseStudiesPage /></RegionLayout>} />
          <Route path="/fr-fr/case-studies/:slug" element={<RegionLayout region="FR"><CaseStudyPage /></RegionLayout>} />
          <Route path="/fr-fr/blog" element={<RegionLayout region="FR"><BlogPage /></RegionLayout>} />
          <Route path="/fr-fr/blog/:slug" element={<RegionLayout region="FR"><BlogDetailPage /></RegionLayout>} />
          <Route path="/fr-fr/careers" element={<RegionLayout region="FR"><CareersPage /></RegionLayout>} />
          <Route path="/fr-fr/privacy" element={<RegionLayout region="FR"><PrivacyPolicyPage /></RegionLayout>} />
          <Route path="/fr-fr/terms" element={<RegionLayout region="FR"><TermsOfServicePage /></RegionLayout>} />

          {/* ========================================
              404 Catch-all route
          ======================================== */}
          <Route path="*" element={<NotFoundPage />} />

          {/* ========================================
              Future regions - uncomment when ready
          ======================================== */}
        </Routes>
      </Suspense>

      <Footer />
    </AuthProvider>
  );
}

export default App;
