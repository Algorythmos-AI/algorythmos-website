import './App.css';
import { Routes, Route } from 'react-router-dom';
import AdvancedBusinessWebsite from './components/Index/AdvancedBusinessWebsite.jsx';
import ServicesPage from './components/Index/ServicesPage.jsx';
import QuantumAboutPage from './components/Index/QuantumAboutPage.jsx';
import QuantumContactPage from './components/Index/QuantumContactPage.jsx';
import CaseStudiesPage from './components/Index/CaseStudiesPage.jsx';
import BlogPage from './components/Index/BlogPage.jsx';
import NavBar from './components/Index/Navigation.jsx';
import Footer from './components/Index/Footer.jsx';
import CaseStudyPage from './components/Index/CaseStudyPage.jsx';
import BlogDetailPage from './components/Index/BlogDetailPage.jsx';
import ServiceDetailPage from './components/Index/ServiceDetailPage.jsx';
import PricingPage from './components/Index/PricingPage.jsx';

function App() {
  return (
    <>
      <NavBar />
      <Routes>
        <Route path="/" element={<AdvancedBusinessWebsite />} />
        <Route path="/services" element={<ServicesPage />} />
        <Route path="/services/:slug" element={<ServiceDetailPage />} />
        <Route path="/about" element={<QuantumAboutPage />} />
        <Route path="/contact" element={<QuantumContactPage />} />
        <Route path="/case-studies" element={<CaseStudiesPage />} />
        <Route path="/case-studies/:slug" element={<CaseStudyPage />} />
        <Route path="/blog" element={<BlogPage />} />
        <Route path="/blog/:slug" element={<BlogDetailPage />} />
        <Route path="/pricing" element={<PricingPage />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
