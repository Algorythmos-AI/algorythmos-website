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
 * Premium Navigation Bar - Enterprise-grade sticky navbar
 * Features:
 * - Ecosystem dropdown menu
 * - Social icons
 * - Smooth shadow transition on scroll
 * - Premium mobile menu animation
 * - Touch-friendly tap targets
 * - Accessible keyboard navigation
 */
// ... imports remain the same, I will keep the imports from lines 1-11 unchanged effectively by targeting the component code ...
// Actually, I will replace the component definition.

const NavBar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isScrolled, setIsScrolled] = useState(false);
  const [showNavbar, setShowNavbar] = useState(true);
  const lastScrollYRef = useRef(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isEcosystemOpen, setIsEcosystemOpen] = useState(false);
  const [activeMega, setActiveMega] = useState(null);
  const ecosystemRef = useRef(null);
  const { t, region, getRegionPath } = useI18n();

  // Get navigation items for current region
  const navItems = getNavItems(region);

  // Region-aware paths
  const calculatorPath = withRegionPath(region, "/pricing") + "#calculator";
  const homePath = withRegionPath(region, "/");

  // Scroll Handler (Premium feel with jitter protection)
  useEffect(() => {
    let ticking = false;
    lastScrollYRef.current = window.scrollY;

    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const currentY = window.scrollY;
          const delta = currentY - lastScrollYRef.current;

          // Always show at top
          if (currentY < 10) {
            setShowNavbar(true);
            setIsScrolled(false);
          } else {
            setIsScrolled(true);
            // Hide on scroll down, show on scroll up
            if (Math.abs(delta) > 10) {
              setShowNavbar(delta < 0);
            }
          }

          setScrollY(currentY);
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

  // Links Data
  const ecosystemLinks = [
    { label: 'Website', href: 'https://algorythmos.com', icon: Globe },
    { label: 'Documentation', href: 'https://docs.algorythmos.fr', icon: Book },
    { label: 'App Console', href: 'https://app.algorythmos.fr', icon: Layout },
  ];

  const socialLinks = [
    { label: 'LinkedIn', href: 'https://www.linkedin.com/company/algorythmos', icon: Linkedin },
    { label: 'X', href: 'https://x.com/algorythmos', icon: Twitter },
    { label: 'Instagram', href: 'https://www.instagram.com/algorythmos_ai', icon: Instagram },
  ];

  // Nav Link Classes
  const getDesktopNavClass = ({ isActive }) =>
    `relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 
     whitespace-nowrap tracking-tight
     ${isActive ? "text-white bg-white/10" : "text-gray-400 hover:text-white hover:bg-white/5"}`;

  return (
    <>
      <nav
        role="navigation"
        aria-label={t("ui.aria.primaryNavigation")}
        className={`fixed top-0 w-full z-50 transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${showNavbar ? "translate-y-0" : "-translate-y-full"} 
          ${isScrolled
            ? "bg-neural-950/70 backdrop-blur-xl border-b border-white/5 shadow-[0_4px_30px_rgba(0,0,0,0.1)]"
            : "bg-transparent border-b border-transparent"
          }`}
      >
        <div className="container mx-auto flex items-center justify-between px-4 lg:px-6 xl:px-8 h-16 lg:h-[72px]">

          {/* 1. LEFT: Logo */}
          <Link
            to={homePath}
            className="flex items-center gap-3 shrink-0 mr-8 focus-visible:ring-2 rounded-lg relative group"
          >
            <div className="relative">
              <LogoPulse className="absolute inset-[-10px] w-[140%] h-[140%] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img
                src={logo}
                alt={t("ui.alt.logo")}
                className="h-8 w-auto object-contain relative z-10"
              />
            </div>
            <span className="text-lg font-bold text-white tracking-tight hidden sm:block">
              Algorythmos
            </span>
          </Link>

          {/* 2. CENTER: Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 flex-1 min-w-0">
            {navItems.map((item) => (
              <div key={item.key} className="relative group shrink-0"
                onMouseEnter={() => setActiveMega(item.key)}
                onMouseLeave={() => setActiveMega(null)}>

                {/* Link Item */}
                <NavLink
                  to={item.path}
                  className={({ isActive }) => getDesktopNavClass({ isActive }) + (item.children ? " flex items-center gap-1" : "")}
                >
                  {t(item.key)}
                  {item.children && <ChevronDown className={`w-3 h-3 transition-transform ${activeMega === item.key ? 'rotate-180' : ''}`} />}
                </NavLink>

                {/* Mega Menu Logic (Same as before, simplified structure) */}
                {item.children && activeMega === item.key && (
                  <div className="absolute top-full left-0 pt-4 w-[500px] animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="relative bg-neural-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-6 grid grid-cols-12 gap-6 overflow-hidden">
                      {/* Menu Shimmer FX */}
                      <MenuHoverAnimation className="absolute inset-0 pointer-events-none opacity-20" />

                      <div className="col-span-5 border-r border-white/10 pr-6 relative z-10">
                        <h3 className="text-base font-bold text-white mb-2">{t(item.key)}</h3>
                        <p className="text-xs text-gray-400 leading-relaxed mb-4">{item.description ? t(item.description) : t("nav.exploreServices")}</p>
                      </div>
                      <div className="col-span-7 flex flex-col gap-1 relative z-10">
                        {item.children.map(child => (
                          <Link key={child.key} to={child.path} className="block p-2 rounded-lg hover:bg-white/5 transition-colors group/link">
                            <div className="text-sm font-medium text-gray-200 group-hover/link:text-white">{t(child.key)}</div>
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
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${isEcosystemOpen ? 'text-white bg-white/10' : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                Ecosystem <ChevronDown className={`w-3 h-3 transition-transform ${isEcosystemOpen ? 'rotate-180' : ''}`} />
              </button>
              {// Dropdown logic...
                isEcosystemOpen && (
                  <div className="absolute top-full left-0 mt-2 w-56 py-1 bg-neural-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    {ecosystemLinks.map((link) => (
                      <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-3 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/5">
                        <link.icon className="w-4 h-4 text-violet-400" />
                        {link.label}
                      </a>
                    ))}
                  </div>
                )
              }
            </div>
          </div>

          {/* 3. RIGHT: Actions Cluster (Desktop) */}
          <div className="hidden lg:flex items-center gap-3 xl:gap-5 shrink-0 ml-4">

            {/* Socials (hidden on text-heavy screens 1024-1536px) */}
            <div className="hidden 2xl:flex items-center gap-1 border-r border-white/10 pr-4">
              {socialLinks.map((social) => (
                <a key={social.href} href={social.href} target="_blank" rel="noopener noreferrer"
                  className="p-2 text-gray-500 hover:text-white transition-colors">
                  <social.icon className="w-4 h-4" />
                </a>
              ))}
            </div>

            <div className="shrink-0">
              <RegionSwitcher />
            </div>

            {/* CTA Button */}
            <Link
              to={calculatorPath}
              className="group relative inline-flex items-center gap-2 px-5 py-2.5 text-sm font-bold text-white 
                         bg-gradient-to-r from-neon-violet to-neon-blue rounded-full
                         shadow-[0_0_15px_rgba(124,58,237,0.3)]
                         hover:shadow-[0_0_25px_rgba(124,58,237,0.5)] 
                         hover:scale-[1.02] active:scale-[0.98]
                         transition-all duration-300 ease-quint shrink-0 whitespace-nowrap"
            >
              <span>{t("nav.openCalculator")}</span>
              <Book className="w-4 h-4 hidden xl:block" />
            </Link>
          </div>

          {/* Mobile Toggle */}
          <div className="lg:hidden shrink-0 ml-auto">
            <AnimatedHamburger isOpen={isMenuOpen} toggle={toggleMenu} />
          </div>

        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <MobileMenu isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
      <BottomNavBar onOpenMenu={() => setIsMenuOpen(true)} />
    </>
  );
};

export default NavBar;
