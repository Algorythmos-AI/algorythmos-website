import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, ArrowRight } from 'lucide-react';
import { useI18n } from '../../app/i18n/I18nContext.jsx';

/**
 * LocalizedCTA - Region-aware call-to-action component
 * Displays AU or FR-specific messaging based on current locale
 */
const LocalizedCTA = ({ className = '' }) => {
    const { t, region, getRegionPath } = useI18n();

    // Determine which CTA keys to use based on region
    const ctaKey = region === 'FR' ? 'cta.regionFR' : 'cta.regionAU';

    const title = t(`${ctaKey}.title`);
    const subtitle = t(`${ctaKey}.subtitle`);
    const buttonText = t(`${ctaKey}.button`);

    return (
        <section className={`py-16 md:py-20 px-4 sm:px-6 ${className}`}>
            <div className="max-w-4xl mx-auto">
                <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900/80 via-gray-900/60 to-black/80 border border-white/10 p-8 md:p-12 backdrop-blur-xl">
                    {/* Subtle gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-emerald-600/5 pointer-events-none" />

                    <div className="relative z-10 text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
                            <Phone className="w-4 h-4 text-emerald-400" />
                            <span className="text-sm text-gray-300">{subtitle}</span>
                        </div>

                        <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white mb-6">
                            {title}
                        </h2>

                        <Link
                            to={getRegionPath('/contact')}
                            className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold text-lg hover:from-blue-500 hover:to-purple-500 transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-purple-500/20"
                            aria-label={buttonText}
                        >
                            {buttonText}
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LocalizedCTA;
