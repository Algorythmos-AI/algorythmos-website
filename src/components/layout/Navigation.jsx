import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/Algorythmos.png";
import { useI18n } from "../../app/i18n/I18nContext.jsx";
import { getNavItems } from "../../app/i18n/navConfig.js";
import CountrySelector from "../navigation/CountrySelector.jsx";

const NavBar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t, region } = useI18n();
  
  // Get navigation items for current region
  const navItems = getNavItems(region);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Desktop nav link class generator
  const getDesktopNavClass = ({ isActive }) => 
    `relative px-6 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
      isActive 
        ? "text-white after:block after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-[#6D00FF] after:to-[#3715E0] after:mt-1" 
        : "text-gray-300 hover:text-white hover:bg-white/10"
    }`;

  // Mobile nav link class generator
  const getMobileNavClass = ({ isActive }) => 
    `px-4 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
      isActive 
        ? "text-white bg-white/10" 
        : "text-gray-300 hover:text-white hover:bg-white/10"
    }`;

  return (
    <nav
      role="navigation"
      aria-label="Primary navigation"
      className={`sticky top-0 w-full z-50 transition-all duration-500 ${
        scrollY > 50
          ? "bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl"
          : "bg-black/80 backdrop-blur-xl"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <Link to="/" className="flex items-center gap-2">
            <img 
              src={logo} 
              alt="Algorythmos logo" 
              className="h-8 w-auto md:h-10 object-contain bg-transparent" 
            />
            <div className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              Algorythmos
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink 
                key={item.key}
                to={item.path}
                className={getDesktopNavClass}
              >
                {t(item.key)}
              </NavLink>
            ))}
            
            {/* Country Selector */}
            <div className="ml-2 border-l border-white/20 pl-4">
              <CountrySelector variant="desktop" />
            </div>
            
            {/* Calculator CTA */}
            <Link
              to="/pricing#calculator"
              aria-label="Open ROI (Return On Investment) calculator"
              title="Open ROI (Return On Investment) calculator"
              className="ml-4 inline-flex items-center rounded-xl bg-gradient-to-r from-[#6D00FF] via-[#7658E7] to-[#3715E0] px-3 py-2 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_rgba(55,21,224,0.55)] focus:outline-none focus:ring-4 focus:ring-violet-500/40"
            >
              {t("nav.openCalculator")}
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className="md:hidden flex items-center justify-center w-10 h-10 border-2 border-white/30 rounded-lg text-white bg-transparent hover:bg-white/10 transition-all duration-300"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden flex flex-col space-y-1 mt-2 bg-black/95 backdrop-blur-xl rounded-xl p-4 border border-white/10 shadow-2xl">
            {navItems.map((item) => (
              <NavLink 
                key={item.key}
                to={item.path}
                className={getMobileNavClass}
                onClick={() => setIsMenuOpen(false)}
              >
                {t(item.key)}
              </NavLink>
            ))}
            
            {/* Mobile Country Selector */}
            <div className="border-t border-white/10 mt-2 pt-3">
              <CountrySelector variant="mobile" />
            </div>
            
            {/* Mobile Calculator CTA */}
            <Link
              to="/pricing#calculator"
              className="w-full rounded-lg bg-slate-800 px-3 py-2 text-sm font-semibold text-white hover:bg-slate-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
              aria-label="Open ROI (Return On Investment) calculator"
              onClick={() => setIsMenuOpen(false)}
            >
              {t("nav.openCalculator")}
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBar;
