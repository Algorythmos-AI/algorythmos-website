import React, { useEffect, useState } from 'react';
import { NavLink, Link } from 'react-router-dom';
import {
  Home,
  Briefcase,
  DollarSign,
  Users,
  BookOpen,
  FileText,
  Mail,
  UserPlus,
  ExternalLink,
  Globe,
  Book,
  Layout,
  Youtube,
  Linkedin,
  Twitter,
  Instagram,
  PenTool,
  Calendar,
  ChevronRight,
  ArrowRight
} from 'lucide-react';
import { useI18n } from '../../app/i18n/I18nContext';
import { withRegionPath } from '../../app/i18n/navConfig';
import CountrySelector from './CountrySelector';
import AnimatedHamburger from './AnimatedHamburger';

/**
 * Enterprise Mobile Menu Component
 * - Structured navigation with sections
 * - Algorythmos ecosystem links
 * - Social media + scheduling
 * - Accenture/McKinsey-level UX
 */
const MobileMenu = ({ isOpen, onClose }) => {
  const { t, region, getRegionPath } = useI18n();
  const [isRendered, setIsRendered] = useState(false);

  // Main navigation items with icons
  const mainNavItems = [
    { key: 'nav.home', path: getRegionPath('/'), icon: Home },
    { key: 'nav.services', path: getRegionPath('/services'), icon: Briefcase },
    { key: 'nav.pricing', path: getRegionPath('/pricing'), icon: DollarSign },
    { key: 'nav.about', path: getRegionPath('/about'), icon: Users },
    { key: 'nav.blog', path: getRegionPath('/blog'), icon: BookOpen },
    { key: 'nav.caseStudies', path: getRegionPath('/case-studies'), icon: FileText },
    { key: 'nav.contact', path: getRegionPath('/contact'), icon: Mail },
    { key: 'nav.careers', path: getRegionPath('/careers'), icon: UserPlus },
  ];

  // Ecosystem links
  const ecosystemLinks = [
    { label: 'Website', href: 'https://algorythmos.com', icon: Globe },
    { label: 'Documentation', href: 'https://docs.algorythmos.fr', icon: Book },
    { label: 'App Console', href: 'https://app.algorythmos.fr', icon: Layout },
  ];

  // Social links
  const socialLinks = [
    { label: 'YouTube', href: 'https://www.youtube.com/@AlgorythmosAI', icon: Youtube },
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/algorythmos', icon: Linkedin },
    { label: 'X (Twitter)', href: 'https://x.com/algorythmos', icon: Twitter },
    { label: 'Medium', href: 'https://medium.com/@algorythmos', icon: PenTool },
    { label: 'Instagram', href: 'https://www.instagram.com/algorythmos_ai', icon: Instagram },
  ];

  // Handle mounting/unmounting for animation
  useEffect(() => {
    if (isOpen) {
      setIsRendered(true);
    } else {
      const timer = setTimeout(() => setIsRendered(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on Escape
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!isRendered) return null;

  // Section title component
  const SectionTitle = ({ children, delay = 0 }) => (
    <h3
      className={`text-xs font-semibold uppercase tracking-wider text-gray-500 mb-3 transform transition-all duration-400 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </h3>
  );

  // Internal nav link component
  const NavItem = ({ item, index }) => {
    const Icon = item.icon;
    return (
      <li
        style={{ transitionDelay: `${80 + (index * 40)}ms` }}
        className={`transform transition-all duration-400 ease-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      >
        <NavLink
          to={item.path}
          onClick={onClose}
          className={({ isActive }) => `
            flex items-center gap-3 py-2.5 px-3 rounded-xl
            transition-all duration-200 group
            ${isActive
              ? 'bg-white/10 text-white'
              : 'text-gray-300 hover:bg-white/5 hover:text-white'
            }
          `}
        >
          <Icon className="w-5 h-5 text-gray-400 group-hover:text-violet-400 transition-colors" />
          <span className="text-base font-medium">{t(item.key)}</span>
        </NavLink>
      </li>
    );
  };

  // External link component
  const ExternalLinkItem = ({ item, index, baseDelay = 0 }) => {
    const Icon = item.icon;
    return (
      <li
        style={{ transitionDelay: `${baseDelay + (index * 40)}ms` }}
        className={`transform transition-all duration-400 ease-out ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
      >
        <a
          href={item.href}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between py-2.5 px-3 rounded-xl text-gray-300 hover:bg-white/5 hover:text-white transition-all duration-200 group"
        >
          <div className="flex items-center gap-3">
            <Icon className="w-5 h-5 text-gray-400 group-hover:text-violet-400 transition-colors" />
            <span className="text-base font-medium">{item.label}</span>
          </div>
          <ExternalLink className="w-4 h-4 text-gray-500 group-hover:text-gray-400 transition-colors" />
        </a>
      </li>
    );
  };

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col bg-neutral-950/98 backdrop-blur-xl transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      aria-modal="true"
      role="dialog"
      aria-label="Mobile Navigation"
    >
      {/* Header - Fixed */}
      <div className="flex-shrink-0 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-white/10 bg-neutral-950/80 backdrop-blur-md relative z-[110]">
        <AnimatedHamburger isOpen={true} toggle={onClose} />
        <div className="w-40 relative z-[120]">
          <CountrySelector variant="mobile" />
        </div>
      </div>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto overscroll-contain">
        <nav className="flex flex-col gap-4 px-6 pb-6 pb-safe">

          {/* Main Pages Section */}
          <section className="mb-6">
            <SectionTitle delay={50}>Pages</SectionTitle>
            <ul className="space-y-1">
              {mainNavItems.map((item, index) => (
                <NavItem key={item.path} item={item} index={index} />
              ))}
            </ul>
          </section>

          {/* Divider */}
          <div className="h-px bg-white/10 my-5" />

          {/* Algorythmos Ecosystem Section */}
          <section className="mb-6">
            <SectionTitle delay={350}>Algorythmos Ecosystem</SectionTitle>
            <ul className="space-y-1">
              {ecosystemLinks.map((item, index) => (
                <ExternalLinkItem key={item.href} item={item} index={index} baseDelay={380} />
              ))}
            </ul>
          </section>

          {/* Divider */}
          <div className="h-px bg-white/10 my-5" />

          {/* Social Media Section */}
          <section className="mb-6">
            <SectionTitle delay={500}>Follow Us</SectionTitle>
            <ul className="space-y-1">
              {socialLinks.map((item, index) => (
                <ExternalLinkItem key={item.href} item={item} index={index} baseDelay={530} />
              ))}
            </ul>
          </section>

          {/* Divider */}
          <div className="h-px bg-white/10 my-5" />

          {/* Schedule Section */}
          <section className="mb-6">
            <SectionTitle delay={680}>Schedule a Meeting</SectionTitle>
            <a
              href="https://calendly.com/algorythmos-france/30min"
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-between py-3 px-4 rounded-xl bg-gradient-to-r from-violet-600/20 to-indigo-600/20 border border-violet-500/30 text-white hover:from-violet-600/30 hover:to-indigo-600/30 hover:border-violet-500/50 transition-all duration-300 group transform ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'}`}
              style={{ transitionDelay: '710ms' }}
            >
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-violet-400" />
                <div>
                  <span className="text-base font-semibold">Book a 30-min Call</span>
                  <p className="text-xs text-gray-400">Free consultation with our team</p>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-violet-400 group-hover:translate-x-1 transition-transform" />
            </a>
          </section>

        </nav>
      </div>

      {/* Footer CTA - Fixed */}
      <div
        className={`flex-shrink-0 px-4 sm:px-6 py-4 pb-safe border-t border-white/10 bg-neutral-950/80 backdrop-blur-md transform transition-all duration-500 ${isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
        style={{ transitionDelay: '600ms' }}
      >
        <Link
          to={withRegionPath(region, "/pricing") + "#calculator"}
          onClick={onClose}
          className="flex items-center justify-center gap-2 w-full py-3.5 px-6 rounded-xl bg-white text-black font-semibold text-base hover:bg-gray-100 transition-all duration-200 shadow-[0_0_20px_rgba(255,255,255,0.15)]"
        >
          {t("nav.openCalculator") || "Open Calculator"} <Book className="w-5 h-5" />
        </Link>
      </div>
    </div>
  );
};

export default MobileMenu;
