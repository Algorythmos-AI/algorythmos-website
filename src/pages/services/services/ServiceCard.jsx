// /src/components/Index/services/ServiceCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

/**
 * ServiceCard - Reusable card component for service listings
 * @param {string} title - Service title
 * @param {string} href - Link to service detail page
 * @param {React.Component} icon - Lucide icon component
 * @param {string} excerpt - Short description/tagline
 */
export default function ServiceCard({ title, href, icon: Icon, excerpt }) {
  return (
    <Link
      to={href}
      className="group relative block rounded-2xl bg-gradient-to-br from-slate-900/50 to-slate-800/30 p-6 ring-1 ring-white/10 transition-all duration-300 hover:ring-white/20 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1"
    >
      {/* Icon */}
      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 ring-1 ring-white/10">
        {Icon && <Icon className="h-6 w-6 text-blue-400" />}
      </div>

      {/* Title */}
      <h3 className="mb-2 text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
        {title}
      </h3>

      {/* Excerpt */}
      <p className="mb-4 text-sm leading-relaxed text-gray-400">
        {excerpt}
      </p>

      {/* Learn More Link */}
      <div className="flex items-center text-sm font-semibold text-blue-400 group-hover:text-blue-300 transition-colors">
        Learn more
        <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
      </div>

      {/* Hover glow effect */}
      <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-blue-500/0 to-purple-500/0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none" />
    </Link>
  );
}
