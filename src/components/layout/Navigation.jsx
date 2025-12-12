import React, { useState, useEffect, useCallback, useRef } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X, ChevronDown, ExternalLink, Globe, Book, Layout, Linkedin, Twitter, Instagram } from "lucide-react";
import logo from "../../assets/Algorythmos.png";
import { useI18n } from "../../app/i18n/I18nContext.jsx";
import { getNavItems, withRegionPath } from "../../app/i18n/navConfig.js";
import RegionSwitcher from "../navigation/RegionSwitcher.jsx";
import MobileMenu from "../navigation/MobileMenu.jsx";
import BottomNavBar from "../navigation/BottomNavBar.jsx";
import AnimatedHamburger from "../navigation/AnimatedHamburger.jsx";
import LogoPulse from '../microanimations/LogoPulse.jsx';
import MenuHoverAnimation from '../microanimations/MenuHoverAnimation.jsx';

/**
 * Premium Navigation Bar - Mifu-inspired, Apple-style scroll
 * Features:
 * - Floating blur bar with shadow
 * - Apple-style hide/show on scroll
 * - Underline animation on links
 * - Premium pill CTA with glow
 * - Condensed mode after scroll threshold
 * - Accessible keyboard navigation
 */

const NavBar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const lastScrollYRef = useRef(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isEcosystemOpen, setIsEcosystemOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const ecosystemRef = useRef(null);
  const { t, region } = useI18n();

  // Get navigation items for current region
  const navItems = getNavItems(region);

  // Region-aware paths
  const calculatorPath = withRegionPath(region, "/pricing") + "#calculator";
  const homePath = withRegionPath(region, "/");

  // Apple-style scroll handler with debouncing
  useEffect(() => {
    let ticking = false;
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const delta = currentY - lastScrollYRef.current;

          // Compact mode threshold
          setIsCompact(currentY > 80);

          // Always show at top
          if (currentY < 10) {
            setShowNavbar(true);
            setIsScrolled(false);
          } else {
            setIsScrolled(true);
            // Hide on scroll down (>15px), show on scroll up
            if (delta > 15) {
              setShowNavbar(false);
            } else if (delta < -10) {
              setShowNavbar(true);
            }
          }

          lastScrollYRef.current = currentY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menus on route change or escape
  useEffect(() => setIsMenuOpen(false), [region]);
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        setIsMenuOpen(false);
        setIsEcosystemOpen(false);
        setActiveMega(null);
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Close ecosystem clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ecosystemRef.current && !ecosystemRef.current.contains(e.target)) {
        setIsEcosystemOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toggle Menu Animation
  const toggleMenu = useCallback(() => {
    if (isAnimating) return;
    setIsAnimating(true);
    setIsMenuOpen(prev => !prev);
    setTimeout(() => setIsAnimating(false), 350);
  }, [isAnimating]);

  // Lock Body Scroll
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMenuOpen]);

  // Ecosystem Links
  const ecosystemLinks = [
    { label: 'Website', href: 'https://algorythmos.com', icon: Globe },
    { label: 'Documentation', href: 'https://docs.algorythmos.fr', icon: Book },
    { label: 'App Console', href: 'https://app.algorythmos.fr', icon: Layout },
  ];

  // Social Links
  const socialLinks = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/algorythmos', icon: Linkedin },
    { label: 'X', href: 'https://x.com/algorythmos', icon: Twitter },
    { label: 'Instagram', href: 'https://www.instagram.com/algorythmos_ai', icon: Instagram },
  ];

  return (
    <>
      {/* Main Navigation Header - Floating Glass Card */}
      <header
        role="navigation"
        aria-label={t("ui.aria.primaryNavigation")}
        className={`
          fixed z-50 
          transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${showNavbar ? "translate-y-0" : "-translate-y-full"}
          ${isScrolled
            ? "top-3 left-4 right-4 rounded-2xl bg-[#0a0a12]/92 backdrop-blur-2xl border border-white/20 shadow-[0_0_0_1px_rgba(255,255,255,0.08),0_20px_50px_rgba(0,0,0,0.5),0_8px_24px_rgba(0,0,0,0.4)]"
            : "top-0 left-0 right-0 bg-transparent border-b border-transparent"
          }
        `}
      >
        {/* Inner Glass Highlight - Top reflection */}
        {isScrolled && (
          <div className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/[0.07] to-transparent" />
          </div>
        )}

        {/* Inner Container */}
        <div className={`
          max-w-7xl mx-auto px-4 md:px-6 lg:px-8
          flex items-center justify-between relative z-10
          transition-all duration-300
          ${isCompact ? "h-14" : "h-16 lg:h-[72px]"}
        `}>

          {/* LEFT: Logo */}
          <Link
            to={homePath}
            className="flex items-center gap-2.5 shrink-0 focus-visible:ring-2 focus-visible:ring-violet-500 rounded-lg relative group"
          >
            <div className="relative">
              <LogoPulse className="absolute inset-[-10px] w-[140%] h-[140%] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={logo}
                alt={t("ui.alt.logo")}
                className={`object-contain relative z-10 transition-all duration-300 ${isCompact ? "h-7" : "h-8"}`}
              />
            </div>
            <span className={`font-bold text-white tracking-tight hidden sm:block transition-all duration-300 ${isCompact ? "text-base" : "text-lg"}`}>
              Algorythmos
            </span>
          </Link>

          {/* CENTER: Navigation Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2 flex-1 justify-center min-w-0 ml-8">
            {navItems.map((item) => (
              <div
                key={item.key}
                className="relative group shrink-0"
                onMouseEnter={() => setActiveMega(item.key)}
                onMouseLeave={() => setActiveMega(null)}
              >
                {/* Nav Link with Underline Animation */}
                <NavLink
                  to={item.path}
                  className={({ isActive }) => `
                    relative px-3 py-2 text-sm font-medium rounded-lg
                    transition-colors duration-200 whitespace-nowrap
                    ${item.children ? "flex items-center gap-1" : ""}
                    ${isActive
                      ? "text-white"
                      : "text-gray-400 hover:text-white"
                    }
                  `}
                >
                  {({ isActive }) => (
                    <>
                      <span className="relative">
                        {t(item.key)}
                        {/* Underline animation */}
                        <span className={`
                          absolute left-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full
                          transition-all duration-300 ease-out
                          ${isActive ? "w-full" : "w-0 group-hover:w-full"}
                        `} />
                      </span>
                      {item.children && (
                        <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${activeMega === item.key ? 'rotate-180' : ''}`} />
                      )}
                    </>
                  )}
                </NavLink>

                {/* Mega Menu Dropdown */}
                {item.children && activeMega === item.key && (
                  <div className="absolute top-full left-0 pt-3 w-[480px] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="relative bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl shadow-black/40 p-5 grid grid-cols-12 gap-5 overflow-hidden">
                      {/* Menu Shimmer FX */}
                      <MenuHoverAnimation className="absolute inset-0 pointer-events-none opacity-20" />

                      <div className="col-span-5 border-r border-white/10 pr-5 relative z-10">
                        <h3 className="text-sm font-bold text-white mb-2">{t(item.key)}</h3>
                        <p className="text-xs text-gray-400 leading-relaxed">{item.description ? t(item.description) : t("nav.exploreServices")}</p>
                      </div>
                      <div className="col-span-7 flex flex-col gap-0.5 relative z-10">
                        {item.children.map(child => (
                          <Link
                            key={child.key}
                            to={child.path}
                            className="block px-3 py-2 rounded-lg hover:bg-white/5 transition-colors group/link"
                          >
                            <div className="text-sm font-medium text-gray-300 group-hover/link:text-white transition-colors">
                              {t(child.key)}
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}

            {/* Ecosystem Dropdown */}
            <div className="relative shrink-0" ref={ecosystemRef}>
              <button
                onClick={() => setIsEcosystemOpen(!isEcosystemOpen)}
                className={`
                  flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg
                  transition-colors duration-200
                  ${isEcosystemOpen ? 'text-white' : 'text-gray-400 hover:text-white'}
                `}
              >
                <span className="relative">
                  Ecosystem
                  <span className={`
                    absolute left-0 -bottom-0.5 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full
                    transition-all duration-300 ease-out
                    ${isEcosystemOpen ? "w-full" : "w-0 group-hover:w-full"}
                  `} />
                </span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isEcosystemOpen ? 'rotate-180' : ''}`} />
              </button>

              {isEcosystemOpen && (
                <div className="absolute top-full left-0 mt-2 w-52 py-2 bg-slate-900/95 backdrop-blur-2xl border border-white/10 rounded-xl shadow-2xl shadow-black/40 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                  {ecosystemLinks.map((link) => (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/5 transition-colors"
                    >
                      <link.icon className="w-4 h-4 text-violet-400" />
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </nav>

          {/* RIGHT: Actions (Desktop) */}
          <div className="hidden lg:flex items-center gap-4 shrink-0 ml-4">
            {/* Social Icons (2XL screens only) */}
            <div className="hidden 2xl:flex items-center gap-1 border-r border-white/10 pr-4">
              {socialLinks.map((social) => (
                <a
                  key={social.href}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                >
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            {/* Region Switcher - Pill style */}
            <div className="shrink-0">
              <RegionSwitcher />
            </div>

            {/* Primary CTA - Mifu-style pill with glow */}
            <Link
              to={calculatorPath}
              className={`
                group relative inline-flex items-center gap-2 
                bg-gradient-to-r from-violet-600 via-purple-600 to-violet-600
                text-white rounded-full font-semibold
                shadow-[0_0_20px_rgba(139,92,246,0.4)]
                hover:shadow-[0_0_30px_rgba(139,92,246,0.6)]
                hover:scale-[1.03] active:scale-[0.98]
                transition-all duration-300 ease-out
                shrink-0 whitespace-nowrap
                ${isCompact ? "px-4 py-2 text-sm" : "px-5 py-2.5 text-sm"}
              `}
            >
              <span>{t("nav.openCalculator")}</span>
              <Book className="w-4 h-4 hidden xl:block group-hover:rotate-6 transition-transform" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden shrink-0 ml-auto">
            <AnimatedHamburger isOpen={isMenuOpen} toggle={toggleMenu} />
          </div>

        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <BottomNavBar onOpenMenu={() => setIsMenuOpen(true)} />
    </>
  );
};

export default NavBar;
