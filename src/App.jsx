import './App.css';
import { Routes, Route } from 'react-router-dom';

// Pages
import AdvancedBusinessWebsite from './pages/home/AdvancedBusinessWebsite.jsx';
import ServicesPage from './pages/services/ServicesPage.jsx';
import ServiceDetailPage from './pages/services/ServiceDetailPage.jsx';
import AgenticAutomationPage from './pages/services/services/AgenticAutomationPage.jsx';
import DocumentIntelligencePage from './pages/services/services/DocumentIntelligencePage.jsx';
import SqlDashboardsPage from './pages/services/services/SqlDashboardsPage.jsx';
import MlopsCicdPage from './pages/services/services/MlopsCicdPage.jsx';
import QuantumAboutPage from './pages/contact/QuantumAboutPage.jsx';
import QuantumContactPage from './pages/contact/QuantumContactPage.jsx';
import PricingPage from './pages/contact/PricingPage.jsx';
import CaseStudiesPage from './pages/insights/CaseStudiesPage.jsx';
import CaseStudyPage from './pages/insights/CaseStudyPage.jsx';
import BlogPage from './pages/insights/BlogPage.jsx';
import BlogDetailPage from './pages/insights/BlogDetailPage.jsx';
import AustraliaPage from './pages/regions/au/AustraliaPage.jsx';
import FrancePage from './pages/regions/fr/FrancePage.jsx';

// Layout & Common Components
import NavBar from './components/layout/Navigation.jsx';
import Footer from './components/layout/Footer.jsx';
import GlobalCtaTracker from './components/common/GlobalCtaTracker.jsx';

function App() {
  return (
    <>
      <GlobalCtaTracker />
      <NavBar />
      <Routes>
        <Route path="/" element={<AdvancedBusinessWebsite />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/agentic-automation" element={<AgenticAutomationPage />} />
        <Route path="/services/document-intelligence" element={<DocumentIntelligencePage />} />
        <Route path="/services/sql-dashboards" element={<SqlDashboardsPage />} />
        <Route path="/services/mlops-cicd" element={<MlopsCicdPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/about" element={<QuantumAboutPage />} />
        <Route path="/contact" element={<QuantumContactPage />} />
        <Route path="/case-studies" element={<CaseStudiesPage />} />
        <Route path="/case-studies/:slug" element={<CaseStudyPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/pricing" element={<PricingPage />} />
        <Route path="/au" element={<AustraliaPage />} />
        <Route path="/fr" element={<FrancePage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
