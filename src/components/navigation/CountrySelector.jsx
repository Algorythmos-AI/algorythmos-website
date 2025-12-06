// src/components/Index/CountrySelector.jsx
// Enterprise-grade country/region selector with globe icon dropdown
import React, { useState, useRef, useEffect } from "react";
import { Globe, ChevronDown, Check } from "lucide-react";
import { useI18n, REGIONS } from "../../app/i18n/I18nContext.jsx";

/**
 * Country Selector Dropdown
 * Accenture-style region selector with globe icon
 */
const CountrySelector = ({ variant = "desktop" }) => {
  const { region, setLanguageAndRegion, t, regionConfig } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        buttonRef.current &&
        !buttonRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsOpen(false);
        buttonRef.current?.focus();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [isOpen]);

  // Handle region selection
  const handleSelect = (regionCode) => {
    setLanguageAndRegion(regionCode);
    setIsOpen(false);
  };

  // Keyboard navigation
  const handleKeyDown = (event, regionCode) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleSelect(regionCode);
    }
  };

  // Get region list for dropdown
  const regionList = Object.values(REGIONS);

  // Styles based on variant
  const isDesktop = variant === "desktop";

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === "ArrowDown" && !isOpen) {
            e.preventDefault();
            setIsOpen(true);
          }
        }}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label={t("region.selector.label")}
        className={`
          flex items-center gap-2 rounded-lg transition-all duration-300
          focus:outline-none focus:ring-2 focus:ring-violet-500/40
          ${isDesktop 
            ? "px-3 py-2 text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 border border-white/20 hover:border-white/40" 
            : "w-full px-4 py-3 text-left font-medium text-gray-300 hover:text-white hover:bg-white/10"
          }
        `}
      >
        <Globe className="w-4 h-4" />
        <span className="hidden sm:inline">{regionConfig.flag}</span>
        <span className={isDesktop ? "hidden lg:inline" : ""}>
          {region === "GLOBAL" ? "Global" : region}
        </span>
        <ChevronDown 
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div
          ref={dropdownRef}
          role="listbox"
          aria-label={t("region.selector.label")}
          className={`
            absolute z-50 mt-2 w-56 rounded-xl
            bg-black/95 backdrop-blur-xl
            border border-white/10 shadow-2xl
            py-2 overflow-hidden
            animate-in fade-in slide-in-from-top-2 duration-200
            ${isDesktop ? "right-0" : "left-0"}
          `}
        >
          {/* Header */}
          <div className="px-4 py-2 border-b border-white/10">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider">
              {t("region.selector.label")}
            </span>
          </div>

          {/* Region Options */}
          <div className="py-1">
            {regionList.map((regionItem) => (
              <button
                key={regionItem.code}
                role="option"
                aria-selected={region === regionItem.code}
                onClick={() => handleSelect(regionItem.code)}
                onKeyDown={(e) => handleKeyDown(e, regionItem.code)}
                className={`
                  w-full flex items-center gap-3 px-4 py-3
                  text-left transition-all duration-200
                  focus:outline-none focus:bg-white/10
                  ${region === regionItem.code 
                    ? "bg-gradient-to-r from-algviolet/20 to-transparent text-white" 
                    : "text-gray-300 hover:bg-white/10 hover:text-white"
                  }
                `}
              >
                {/* Flag */}
                <span className="text-xl">{regionItem.flag}</span>
                
                {/* Label */}
                <div className="flex-1">
                  <div className="font-medium">{t(regionItem.label)}</div>
                  <div className="text-xs text-gray-500">
                    {regionItem.code === "GLOBAL" && "algorythmos.fr"}
                    {regionItem.code === "AU" && "algorythmos.com.au"}
                    {regionItem.code === "FR" && "algorythmos.fr"}
                  </div>
                </div>

                {/* Check mark for selected */}
                {region === regionItem.code && (
                  <Check className="w-4 h-4 text-algviolet" />
                )}
              </button>
            ))}
          </div>

          {/* Footer hint */}
          <div className="px-4 py-2 border-t border-white/10">
            <span className="text-xs text-gray-500">
              Content and services vary by region
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
