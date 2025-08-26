import React from "react";
import partner1 from "../../assets/partners/partner1.svg";
import partner2 from "../../assets/partners/partner2.svg";
import partner3 from "../../assets/partners/partner3.svg";

const logos = [partner1, partner2, partner3];

export default function PartnersCarousel() {
  return (
    <section className="relative py-14">
      <h2 className="text-center text-xl md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
        Trusted by 50+ businesses worldwide
      </h2>

      <div className="mt-8 relative group overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-black to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-black to-transparent" />

        <div className="flex items-center gap-12 animate-scroll will-change-transform group-hover:[animation-play-state:paused]">
          {[...logos, ...logos, ...logos].map((src, idx) => (
            <img
              key={idx}
              src={src}
              alt={`Partner ${idx + 1}`}
              className="h-12 md:h-16 w-auto opacity-80 hover:opacity-100 invert hover:scale-110 transition duration-300"
              loading="lazy"
              decoding="async"
            />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scrollX { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        .animate-scroll { animation: scrollX 28s linear infinite; }
      `}</style>
    </section>
  );
}


