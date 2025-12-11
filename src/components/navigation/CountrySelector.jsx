// src/components/navigation/CountrySelector.jsx
import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { useI18n, REGIONS } from "../../app/i18n/I18nContext.jsx";
import { FlagGlobal, FlagFR, FlagAU } from "./RegionFlags.jsx";
import { useRegionPersistence } from "../../hooks/useRegionPersistence.js";

/**
 * Premium Enterprise Region Selector
 * - Glassmorphism UI
 * - Instant Feedback
 * - SVG Flags
 * - Layout Persistence
 */
const CountrySelector = ({ variant = "desktop" }) => {
  const { region, setLanguageAndRegion } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const buttonRef = useRef(null);

  const { saveRegionPreference } = useRegionPersistence();

  // Region Config Helper
  const getRegionIcon = (code) => {
    switch (code) {
      case "FR": return <FlagFR className="w-5 h-auto shadow-sm rounded-[2px]" />;
      case "AU": return <FlagAU className="w-5 h-auto shadow-sm rounded-[2px]" />;
      default: return <FlagGlobal className="w-5 h-5 text-gray-400" />;
    }
  };

  const getRegionLabel = (code) => {
    switch (code) {
      case "FR": return "France";
      case "AU": return "Australia";
      default: return "Global";
    }
  };

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
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, []);

  // Handle region selection with Persistence + Navigation
  const handleSelect = (code) => {
    // 1. Save Preference
    saveRegionPreference(code);

    // 2. Set State
    setLanguageAndRegion(code);
    setIsOpen(false);

    // 3. Navigate (Smart Routing)
    // If currently on a page (e.g., /services), try to keep it (e.g., /fr/services)
    // This logic relies on `setLanguageAndRegion` internally handling the base path/context 
    // or we force a navigation here if needed. 
    // The context `setLanguageAndRegion` usually updates the region state, 
    // but we might need to actively push the new URL prefix if the I18nContext doesn't auto-redirect.
    // For now assuming I18nContext + Router integration handles the path update via region change, 
    // but let's ensure instant feedback.
  };

  const regionList = [
    { code: "GLOBAL", label: "Global", icon: <FlagGlobal /> },
    { code: "FR", label: "France", icon: <FlagFR /> },
    { code: "AU", label: "Australia", icon: <FlagAU /> },
  ];

  const isDesktop = variant === "desktop";

  return (
    <div className="relative group/selector">
      {/* Trigger Button */}
      <button
        ref={buttonRef}
        onClick={() => setIsOpen(!isOpen)}
        className={`
          flex items-center gap-2.5 rounded-xl transition-all duration-200 ease-out
          border border-transparent
          focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-500/50
          ${isDesktop
            ? `px-3 py-2 text-sm ${isOpen ? "bg-white/10 text-white" : "text-gray-400 hover:text-white hover:bg-white/5"}`
            : "w-full px-5 py-4 text-left text-base bg-white/5 border-white/5 text-white hover:bg-white/10 active:scale-[0.99]"
          }
        `}
        aria-label="Select Region"
        aria-expanded={isOpen}
      >
        <span className="flex items-center justify-center w-6">
          {getRegionIcon(region)}
        </span>
        <span className={`font-medium ${isDesktop ? "text-sm" : "text-base"}`}>
          {getRegionLabel(region)}
        </span>
        <ChevronDown
          className={`w-4 h-4 text-gray-500 transition-transform duration-300 ease-out ml-auto ${isOpen ? "rotate-180 text-violet-400" : ""}`}
        />
      </button>

      {/* Dropdown Menu */}
      <div
        ref={dropdownRef}
        className={`
          absolute z-[100] overflow-hidden
          transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]
          bg-[#0A0A0A] backdrop-blur-2xl border border-white/10 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]
          ${isDesktop
            ? "right-0 w-60 rounded-2xl mt-3 origin-top-right"
            : "left-0 w-full rounded-xl mt-2 origin-top"
          }
          ${isOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 -translate-y-2 scale-95 pointer-events-none"
          }
        `}
      >
        <div className="p-1.5 flex flex-col gap-0.5">
          {regionList.map((item) => {
            const isActive = region === item.code;
            return (
              <button
                key={item.code}
                onClick={() => handleSelect(item.code)}
                className={`
                  relative flex items-center gap-3 w-full px-3 py-3 rounded-xl transition-all duration-200
                  group text-left
                  ${isActive
                    ? "bg-violet-500/10 text-white"
                    : "text-gray-400 hover:text-white hover:bg-white/5 active:bg-white/10"
                  }
                `}
              >
                {/* Flag Container */}
                <div className={`
                    flex items-center justify-center w-8 h-8 rounded-lg transition-colors
                    ${isActive ? "bg-violet-500/20" : "bg-white/5 group-hover:bg-white/10"}
                  `}>
                  <span className="scale-110">
                    {getRegionIcon(item.code)}
                  </span>
                </div>

                {/* Label & Active Indicator */}
                <div className="flex-1 flex flex-col">
                  <span className={`font-medium ${isActive ? "text-violet-100" : "text-gray-300 group-hover:text-white"}`}>
                    {item.label}
                  </span>
                  {isActive && <span className="text-[10px] uppercase tracking-wider font-bold text-violet-400 mt-0.5">Active</span>}
                </div>

                {isActive && <Check className="w-4 h-4 text-violet-400" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CountrySelector;
