import React from 'react';

/**
 * Algorythmos Infinite Logo Marquee - Pulse Standard
 * Features: Infinite Scroll, CSS Masking, Monochrome-to-Glow Interaction
 */

const logos = [
  { name: 'SKEMA Business School', country: 'FR' },
  { name: 'Crédit Agricole', country: 'FR' },
  { name: 'BNP Paribas', country: 'FR' },
  { name: 'Station F', country: 'FR' },
  { name: 'Atlassian', country: 'AU' },
  { name: 'Canva', country: 'AU' },
  { name: 'University of Sydney', country: 'AU' },
  { name: 'CSIRO', country: 'AU' }
];

const LogoMarquee = () => {
  // Triple the array to ensure smooth infinite loop on wide screens
  const infiniteLogos = [...logos, ...logos, ...logos];

  return (
    <section className="bg-[#020617] py-24 relative overflow-hidden">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-slate-500">
          Trusted by Global Leaders
        </p>
      </div>

      {/* Marquee Container with Gradient Masks for Side Fading */}
      <div className="relative w-full overflow-hidden mask-fade-edges">
        {/* Rolling Track */}
        <div className="flex animate-marquee-infinite w-max">
          {infiniteLogos.map((logo, index) => (
            <div
              key={`${logo.name}-${index}`}
              className="mx-8 md:mx-16 flex flex-col items-center justify-center group cursor-default relative px-4 py-2"
            >
              {/* Logo Text/Placeholder (Using text as proxy for logos in this text-based env) */}
              {/* In production, replace <span> with actual <img src="..." /> or <svg> */}
              <span className="text-2xl md:text-3xl font-black text-slate-600 tracking-tighter transition-all duration-500 group-hover:text-white group-hover:scale-105">
                {logo.name}
              </span>

              {/* Glow Effect on Hover */}
              <div className="absolute inset-0 bg-violet-600/0 group-hover:bg-violet-600/20 blur-2xl rounded-full transition-all duration-500 opacity-0 group-hover:opacity-100 pointer-events-none" />

              {/* Country Badge */}
              <span className="absolute -top-3 right-0 text-[9px] font-bold text-slate-500 border border-slate-700/50 bg-[#020617]/80 px-1.5 py-0.5 rounded opacity-0 transform translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 delay-75">
                {logo.country}
              </span>
            </div>
          ))}
        </div>
      </div>

      <style>{`
                .mask-fade-edges {
                    mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
                    -webkit-mask-image: linear-gradient(to right, transparent, black 20%, black 80%, transparent);
                }
                
                .animate-marquee-infinite {
                    animation: marqueeScroll 40s linear infinite;
                }

                /* Mobile speed adjustment */
                @media (max-width: 768px) {
                    .animate-marquee-infinite {
                        animation: marqueeScroll 20s linear infinite;
                    }
                }

                @keyframes marqueeScroll {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); } /* Move 1/3 since we tripled the array */
                }

                .animate-marquee-infinite:hover {
                    animation-play-state: paused;
                }
            `}</style>
    </section>
  );
};

export default LogoMarquee;
