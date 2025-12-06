import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { Menu, X } from "lucide-react";
import logo from "../../assets/Algorythmos.png";
import { useI18n } from "../../app/i18n/I18nContext.jsx";
import { getNavItems, withRegionPath } from "../../app/i18n/navConfig.js";
import CountrySelector from "../navigation/CountrySelector.jsx";

const NavBar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, region, getRegionPath } = useI18n();
  
  // Get navigation items for current region (already prefixed)
  const navItems = getNavItems(region);
  
  // Region-aware calculator path
  const calculatorPath = withRegionPath(region, "/pricing") + "#calculator";
  
  // Region-aware home path
  const homePath = withRegionPath(region, "/");

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setIsMenuOpen(false);
  }, [region]);

  // Desktop nav link class generator
  const getDesktopNavClass = ({ isActive }) => 
    `relative px-4 py-2 text-sm font-medium rounded-lg transition-all duration-200 
     focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50
     ${isActive 
       ? "text-white bg-white/10" 
       : "text-gray-400 hover:text-white hover:bg-white/5"
     }`;

  // Mobile nav link class generator
  const getMobileNavClass = ({ isActive }) => 
    `block px-4 py-3 text-base font-medium rounded-lg transition-all duration-200
     focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50
     ${isActive 
       ? "text-white bg-white/10" 
       : "text-gray-400 hover:text-white hover:bg-white/5"
     }`;

  return (
    <nav
      role="navigation"
      aria-label="Primary navigation"
      className={`sticky top-0 w-full z-50 transition-all duration-300 ${
        scrollY > 20
          ? "bg-black/90 backdrop-blur-xl border-b border-white/5"
          : "bg-black/80 backdrop-blur-lg"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link 
            to={homePath} 
            className="flex items-center gap-3 group"
          >
            <img 
              src={logo} 
              alt="Algorythmos" 
              className="h-8 w-auto object-contain transition-transform duration-200 group-hover:scale-105" 
            />
            <span className="text-lg font-semibold text-white hidden sm:block">
              Algorythmos
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <NavLink 
                key={item.key}
                to={item.path}
                className={getDesktopNavClass}
                end={item.path === homePath}
              >
                {t(item.key)}
              </NavLink>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            {/* Country Selector */}
            <CountrySelector variant="desktop" />
            
            {/* Calculator CTA */}
            <Link
              to={calculatorPath}
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-white 
                         bg-gradient-to-r from-[#6D00FF] to-[#3715E0] rounded-lg
                         hover:opacity-90 transition-opacity duration-200
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
            >
              {t("nav.openCalculator")}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className="md:hidden flex items-center justify-center w-10 h-10 
                       text-gray-400 hover:text-white rounded-lg
                       hover:bg-white/5 transition-colors duration-200
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        id="mobile-menu"
        className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          isMenuOpen ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="px-4 py-4 space-y-1 bg-black/95 border-t border-white/5">
          {navItems.map((item) => (
            <NavLink 
              key={item.key}
              to={item.path}
              className={getMobileNavClass}
              onClick={() => setIsMenuOpen(false)}
              end={item.path === homePath}
            >
              {t(item.key)}
            </NavLink>
          ))}
          
          {/* Mobile Divider */}
          <div className="my-3 border-t border-white/10" />
          
          {/* Mobile Country Selector */}
          <CountrySelector variant="mobile" />
          
          {/* Mobile Calculator CTA */}
          <Link
            to={calculatorPath}
            className="block w-full mt-3 px-4 py-3 text-center text-sm font-medium text-white 
                       bg-gradient-to-r from-[#6D00FF] to-[#3715E0] rounded-lg
                       hover:opacity-90 transition-opacity duration-200
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50"
            onClick={() => setIsMenuOpen(false)}
          >
            {t("nav.openCalculator")}
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
