import React from "react";
import { Link, useLocation } from "react-router-dom";
import { MessageCircle } from "lucide-react";
import { useI18n } from "../../app/i18n/I18nContext";
import { withRegionPath } from "../../app/i18n/navConfig";

export default function FloatingContactButton() {
    const { region, t } = useI18n();
    const location = useLocation();

    const contactPath = withRegionPath(region, "/contact");

    // Don't show on contact page
    if (location.pathname === contactPath) return null;

    return (
        <Link
            to={contactPath}
            className={`
        fixed z-40 flex items-center justify-center
        rounded-full shadow-lg hover:shadow-glow
        bg-gradient-to-r from-algviolet to-algblue
        text-white transition-transform hover:scale-110 active:scale-95
        
        /* Desktop: Bottom right */
        bottom-8 right-8 w-14 h-14
        
        /* Mobile: Higher up to avoid bottom nav */
        max-lg:bottom-24 max-lg:right-6 max-lg:w-12 max-lg:h-12
      `}
            aria-label={t("nav.contact") || "Contact Us"}
        >
            <MessageCircle className="w-6 h-6 max-lg:w-5 max-lg:h-5" />
        </Link>
    );
}
