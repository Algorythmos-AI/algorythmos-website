import React from "react";
import { motion, useReducedMotion } from "framer-motion";
import { MemoryLensIcon, TransformSparkIcon, ShieldRingsIcon, IntegrationsMeshIcon } from "./icons/AgenticIcons";

/**
 * EnterpriseCapabilities
 * - Four-card summary matching the "High-performance search", "Built-in agents", "Security & compliance",
 *   and "Integrations" pillars.
 * - Subtle reveal motion, respects prefers-reduced-motion.
 * - Links "Learn more" jump to the long-form details later on the page.
 */
export default function EnterpriseCapabilities() {
  const reduce = useReducedMotion();
  const base = { opacity: 0, y: 16 };
  const shown = { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } };

  const items = [
    {
      icon: MemoryLensIcon,
      title: "High-performance search & memory",
      text:
        "Stream agents with fresh context via fast ingestion and retrieval across documents, tickets, and tables—at scale.",
      href: "#enterprise-capabilities", // deep link to your detailed section
    },
    {
      icon: TransformSparkIcon,
      title: "Built-in agents for data transformation",
      text:
        "Prebuilt skills to parse, clean, and normalize inputs so downstream workflows operate on reliable, structured data.",
      href: "#enterprise-capabilities",
    },
    {
      icon: ShieldRingsIcon,
      title: "Enterprise security & compliance",
      text:
        "SSO/RBAC, workspace isolation, strict access controls, audit logs, and review queues for regulated environments.",
      href: "#enterprise-capabilities",
    },
    {
      icon: IntegrationsMeshIcon,
      title: "Integrations with popular frameworks",
      text:
        "Connect to LangGraph, CrewAI, LlamaIndex, or custom planners. Wire tools & memory (vector DBs) with minimal friction.",
      href: "#enterprise-capabilities",
    },
  ];

  return (
    <section aria-labelledby="enterprise-capabilities-grid" className="mt-10">
      <h2 id="enterprise-capabilities-grid" className="text-2xl font-bold mb-4">
        Enterprise capabilities
      </h2>

      <div className="grid gap-4 md:grid-cols-2">
        {items.map(({ icon: Icon, title, text, href }, i) => (
          <motion.article
            key={title}
            initial={reduce ? false : base}
            whileInView={reduce ? {} : shown}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: reduce ? 0 : i * 0.05 }}
            className="group rounded-2xl border border-white/10 bg-gradient-to-br from-gray-900/60 to-black/60 p-5 hover:border-white/20"
          >
            <div className="flex items-center gap-3 mb-2">
              <span className="inline-flex p-2 rounded-xl bg-white/5">
                <Icon className="w-10 h-10 transition-transform duration-300 group-hover:scale-105" />
              </span>
              <h3 className="text-lg font-semibold">{title}</h3>
            </div>
            <p className="text-gray-300">{text}</p>
            <div className="mt-3">
              <a href={href} className="text-sm text-blue-300 hover:text-white underline underline-offset-4">
                Learn more
              </a>
            </div>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
