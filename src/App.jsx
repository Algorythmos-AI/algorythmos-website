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

// Organisation JSON-LD schema (global)
const ORGANISATION_SCHEMA = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": "Algorythmos",
  "url": "https://algorythmos.com",
  "logo": "https://algorythmos.com/Algorythmos.png",
  "description": "AI consultancy delivering secure, ROI-driven AI solutions for SMEs and enterprises in Australia and France.",
  "areaServed": ["Australia", "France"],
  "sameAs": [
    "https://www.linkedin.com/company/algorythmos",
    "https://twitter.com/algorythmos",
    "https://github.com/algorythmos"
  ],
  "address": [
    {
      "@type": "PostalAddress",
      "addressCountry": "AU",
      "addressLocality": "Sydney"
    },
    {
      "@type": "PostalAddress",
      "addressCountry": "FR",
      "addressLocality": "Suresnes"
    }
  ]
};

function App() {
  return (
    <>
      <GeoRouter />
      <SeoHead />
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(ORGANISATION_SCHEMA)}
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
    </>
  );
}

export default App;
