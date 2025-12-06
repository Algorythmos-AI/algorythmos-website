// src/components/navigation/CountrySelector.jsx
// Enterprise-grade country/region selector
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useI18n, REGIONS } from "../../app/i18n/I18nContext.jsx";
import { withRegionPath } from "../../app/i18n/navConfig.js";

/**
 * Country Selector Dropdown
 * Clean, minimal region selector matching enterprise standards
 */
const CountrySelector = ({ variant = "desktop" }) => {
  const { region, setLanguageAndRegion, t, regionConfig } = useI18n();
  const navigate = useNavigate();
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
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        aria-label="Select region"
        className={`
          flex items-center gap-2 rounded-lg transition-all duration-200
          focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50
          ${isDesktop 
            ? "px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/5" 
            : "w-full px-4 py-3 text-left text-gray-400 hover:text-white hover:bg-white/5"
          }
        `}
      >
        {/* Flag only - no duplicate globe */}
        <span className="text-lg leading-none">{regionConfig.flag}</span>
        <span className="font-medium">
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
          aria-label="Select region"
          className={`
            absolute z-50 mt-2 w-48 rounded-lg
            bg-black/95 backdrop-blur-xl
            border border-white/10 shadow-xl
            py-1 overflow-hidden
            ${isDesktop ? "right-0" : "left-0"}
          `}
        >
          {regionList.map((regionItem) => (
            <button
              key={regionItem.code}
              role="option"
              aria-selected={region === regionItem.code}
              onClick={() => handleSelect(regionItem.code)}
              className={`
                w-full flex items-center gap-3 px-4 py-2.5
                text-left text-sm transition-colors duration-150
                focus:outline-none focus:bg-white/10
                ${region === regionItem.code 
                  ? "text-white bg-white/5" 
                  : "text-gray-400 hover:text-white hover:bg-white/5"
                }
              `}
            >
              {/* Flag */}
              <span className="text-lg leading-none">{regionItem.flag}</span>
              
              {/* Label */}
              <span className="flex-1 font-medium">
                {regionItem.code === "GLOBAL" ? "Global" : regionItem.code}
              </span>

              {/* Check mark for selected */}
              {region === regionItem.code && (
                <Check className="w-4 h-4 text-violet-400" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default CountrySelector;
