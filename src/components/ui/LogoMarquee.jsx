import React from 'react';

/**
 * Algorythmos Infinite Logo Marquee
 * Features: Pure CSS animation, Edge masking, Monochrome-to-Glow transitions
 */

const logos = [
    { name: 'SKEMA Business School', country: 'FR' },
    { name: 'Atlassian', country: 'AU' },
    { name: 'Crédit Agricole', country: 'FR' },
    { name: 'Canva', country: 'AU' },
    { name: 'BNP Paribas', country: 'FR' },
    { name: 'Telstra', country: 'AU' },
    { name: 'HEC Paris', country: 'FR' },
    { name: 'University of Sydney', country: 'AU' },
    { name: 'NVIDIA', country: 'Global' },
    { name: 'Stripe', country: 'Global' },
    { name: 'Station F', country: 'FR' },
    { name: 'CSIRO', country: 'AU' }
];

const LogoMarquee = () => {
    // We double the array to create the seamless infinite loop
    const duplicatedLogos = [...logos, ...logos];

    return (
        <div className="bg-[#020617] py-20 overflow-hidden relative">
            {/* Section Header */}
            <div className="max-w-7xl mx-auto px-6 mb-12">
                <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 text-center">
                    Trusted by 50+ Institutions & Businesses Worldwide
                </h3>
            </div>

            {/* Marquee Container with Edge Fading Mask */}
            <div className="relative flex overflow-hidden marquee-mask">
                <div className="flex animate-marquee whitespace-nowrap py-4">
                    {duplicatedLogos.map((logo, index) => (
                        <div
                            key={index}
                            className="mx-12 flex items-center justify-center group cursor-default"
                        >
                            {/* Logo Wrapper */}
                            <div className="relative">
                                <span className="text-2xl md:text-3xl font-black text-slate-400 opacity-50 grayscale group-hover:grayscale-0 group-hover:opacity-100 group-hover:text-white transition-all duration-500 tracking-tighter">
                                    {logo.name}
                                </span>
                                {/* Violet Glow underlay on hover */}
                                <div className="absolute inset-0 bg-violet-600/0 group-hover:bg-violet-600/10 blur-xl transition-all duration-500 rounded-full pointer-events-none" />
                            </div>

                            {/* Country Badge (Subtle) */}
                            <span className="ml-2 text-[8px] font-bold text-slate-600 border border-slate-800 px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                                {logo.country}
                            </span>
                        </div>
                    ))}
                </div>
            </div>

            <style dangerouslySetInnerHTML={{
                __html: `
        /* The side-fade effect */
        .marquee-mask {
          mask-image: linear-gradient(
            to right,
            transparent,
            black 15%,
            black 85%,
            transparent
          );
          -webkit-mask-image: linear-gradient(
            to right,
            transparent,
            black 15%,
            black 85%,
            transparent
          );
        }

        /* The Animation Logic */
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 40s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }

        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        /* Responsive speed adjustment */
        @media (max-width: 768px) {
          .animate-marquee {
            animation: marquee 25s linear infinite;
          }
        }
      `}} />
        </div>
    );
};

export default LogoMarquee;
