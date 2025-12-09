import React, { useState, useRef, useEffect } from 'react';
import { Globe, ChevronDown, Check } from 'lucide-react';
import { useI18n } from '../../app/i18n/I18nContext.jsx';
import { setLocale } from '../../lib/locale';

const regions = [
    { code: 'GLOBAL', label: 'Global', flag: '🌍', locale: 'en' },
    { code: 'AU', label: 'Australia', flag: '🇦🇺', locale: 'au-en' },
    { code: 'FR', label: 'France', flag: '🇫🇷', locale: 'fr-fr' },
];

/**
 * Region Switcher Component (Premium Dropdown)
 * Compact, glassmorphic dropdown that solves layout overlap issues.
 */
export default function RegionSwitcher() {
    const { region: currentRegionCode } = useI18n();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Close when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const currentRegion = regions.find(r => r.code === currentRegionCode) || regions[0];

    const handleSelect = (locale) => {
        setIsOpen(false);
        setLocale(locale);
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 border border-transparent
          ${isOpen
                        ? 'bg-white/10 text-white border-white/10'
                        : 'text-gray-400 hover:text-white hover:bg-white/5'
                    }`}
                aria-label="Select Region"
                aria-expanded={isOpen}
            >
                <span className="text-base leading-none">{currentRegion.flag}</span>
                <span className="hidden xl:inline">{currentRegion.label}</span>
                <span className="xl:hidden">{currentRegion.code}</span>
                <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 py-1 bg-neural-900/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200 z-50">
                    <div className="px-3 py-2 border-b border-white/5 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                        Select Region
                    </div>
                    {regions.map((item) => {
                        const isActive = item.code === currentRegionCode;
                        return (
                            <button
                                key={item.code}
                                onClick={() => handleSelect(item.locale)}
                                className={`w-full flex items-center justify-between px-4 py-3 text-sm transition-colors
                  ${isActive
                                        ? 'bg-white/5 text-neon-violet'
                                        : 'text-gray-300 hover:bg-white/5 hover:text-white'
                                    }`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-lg leading-none">{item.flag}</span>
                                    <span>{item.label}</span>
                                </div>
                                {isActive && <Check className="w-4 h-4" />}
                            </button>
                        );
                    })}
                </div>
            )}
        </div>
    );
}
