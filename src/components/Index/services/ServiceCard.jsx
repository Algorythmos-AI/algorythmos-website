import React from "react";
import { ChevronRight } from "lucide-react";

export default function ServiceCard({ title, href, icon: Icon, excerpt }) {
  return (
    <a
      href={href}
      className="group relative block rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#6D00FF]"
      aria-label={`${title} — Read more`}
    >
      {/* soft gradient edge */}
      <div className="pointer-events-none absolute inset-0 rounded-2xl ring-1 ring-white/5" />
      <div className="flex items-start gap-4">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#6D00FF]/20 to-[#7658E7]/20 ring-1 ring-white/10">
          {Icon ? <Icon className="h-5 w-5 opacity-90" /> : <span className="h-5 w-5" />}
        </div>
        <div className="min-w-0">
          <h3 className="text-base font-semibold leading-6 text-white">
            {title}
          </h3>
          <p className="mt-2 text-sm leading-6 text-white/70 line-clamp-3">
            {excerpt}
          </p>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-2 text-sm font-medium text-white/80">
        <span>Read more</span>
        <ChevronRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5" />
      </div>
    </a>
  );
}
