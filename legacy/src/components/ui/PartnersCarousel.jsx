import React, { useMemo } from "react";
import { useI18n } from "../../app/i18n/I18nContext.jsx";
import {
  LogoAccenture, LogoStripe, LogoDecathlon, LogoFnac,
  LogoCreditAgricole, LogoAtlassian, LogoCanva, LogoTelstra,
  LogoNvidia, LogoIBM, LogoHubSpot, LogoCSIRO
} from "./PartnerLogos.jsx";

export default function PartnersCarousel() {
  const { t } = useI18n();

  // Memoize logos to prevent re-renders
  const brands = useMemo(() => [
    { name: "Accenture", Component: LogoAccenture },
    { name: "Stripe", Component: LogoStripe },
    { name: "Nvidia", Component: LogoNvidia },
    { name: "Decathlon", Component: LogoDecathlon },
    { name: "Atlassian", Component: LogoAtlassian },
    { name: "HubSpot", Component: LogoHubSpot },
    { name: "IBM", Component: LogoIBM },
    { name: "Canva", Component: LogoCanva },
    { name: "Telstra", Component: LogoTelstra },
    { name: "Crédit Agricole", Component: LogoCreditAgricole },
    { name: "Fnac", Component: LogoFnac },
    { name: "CSIRO", Component: LogoCSIRO },
  ], []);

  return (
    <section className="relative py-20 bg-neural-950/50 border-y border-white/5 overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-neural-gradient opacity-30 pointer-events-none" />

      <div className="container mx-auto px-4 mb-12 relative z-10 text-center">
        <h2 className="text-sm md:text-base font-semibold uppercase tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-neon-violet to-neon-pink opacity-90">
          {t("ui.partners.headline") || "Trusted by 50+ businesses worldwide"}
        </h2>
      </div>

      {/* Marquee Container with Gradient Masks */}
      <div className="relative w-full overflow-hidden">
        {/* Left Fade Mask */}
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-32 z-10 bg-gradient-to-r from-neural-950 to-transparent" />
        {/* Right Fade Mask */}
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-32 z-10 bg-gradient-to-l from-neural-950 to-transparent" />

        {/* Sliding Track - Duplicated for seamless loop */}
        <div className="flex w-[200%] animate-marquee hover:[animation-play-state:paused]">

          {/* First Set */}
          <div className="flex w-1/2 justify-around items-center gap-12 md:gap-20 px-6">
            {brands.map((brand, idx) => (
              <div
                key={`b1-${idx}`}
                className="flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
              >
                <brand.Component className="h-7 md:h-9 w-auto text-white" />
              </div>
            ))}
          </div>

          {/* Second Set (Duplicate) */}
          <div className="flex w-1/2 justify-around items-center gap-12 md:gap-20 px-6">
            {brands.map((brand, idx) => (
              <div
                key={`b2-${idx}`}
                className="flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
              >
                <brand.Component className="h-7 md:h-9 w-auto text-white" />
              </div>
            ))}
          </div>

        </div>
      </div>

      {/* Animation Styles */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 60s linear infinite;
        }
        @media (max-width: 768px) {
          .animate-marquee {
            animation-duration: 40s;
          }
        }
      `}</style>
    </section>
  );
}


