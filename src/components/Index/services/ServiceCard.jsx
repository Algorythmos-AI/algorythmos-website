import React from "react";
import { ChevronRight } from "lucide-react";
import useParallaxTilt from "./hooks/useParallaxTilt";

export default function ServiceCard({ title, href, icon: Icon, excerpt }) {
  const { ref, cardStyle, iconStyle } = useParallaxTilt(6, 8);

  return (
    <a
      href={href}
      ref={ref}
      style={cardStyle}
      className="group relative block rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-transform duration-200 will-change-transform hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D00FF]"
      aria-label={`${title} — Read more`}
    >
      {/* glow layers */}
      <span
        className="card-glow-blur absolute -inset-3"
        aria-hidden="true"
      />
      <span
        className="card-glow absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        aria-hidden="true"
        style={{ animation: "glowShift 4.5s linear infinite" }}
      />

      <div className="relative z-10 flex items-start gap-4">
        <div
          className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#6D00FF]/20 to-[#7658E7]/20 ring-1 ring-white/10 transition-transform duration-200 will-change-transform"
          style={iconStyle}
        >
          {Icon ? <Icon className="h-5 w-5 opacity-90" /> : <span className="h-5 w-5" />}
        </div>

        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-6 text-white">{title}</h3>
          <p className="mt-2 text-sm leading-6 text-white/70 line-clamp-3">{excerpt}</p>
        </div>
      </div>

      <div className="relative z-10 mt-4 flex items-center gap-2 text-sm font-medium text-white/80">
        <span>Read more</span>
        <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </div>
    </a>
  );
}
