import React from "react";
import { motion } from "framer-motion";
import { Bot, FileText, BarChart2 } from "lucide-react";

export default function HeroIllustration({ title = "AI-Powered Agentic Automation" }) {
  return (
    <div className="relative mx-auto w-full max-w-md h-72 lg:h-96 rounded-3xl border border-white/10 bg-gradient-to-br from-gray-900/60 to-black/60 overflow-hidden shadow-2xl hover:scale-105 transition">
      {/* Background glows */}
      <div className="pointer-events-none absolute -top-16 -left-16 w-56 h-56 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 blur-3xl opacity-30" />
      <div className="pointer-events-none absolute -bottom-20 -right-16 w-64 h-64 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 blur-3xl opacity-30" />

      {/* Title */}
      <div className="absolute top-4 left-4 z-20">
        <span className="text-xs md:text-sm font-semibold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
          {title}
        </span>
      </div>

      {/* Workflow panel */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-5">
        <div className="w-full grid grid-cols-3 gap-4 items-center">
          {/* Input */}
          <motion.div
            className="rounded-2xl p-4 h-32 bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <FileText className="w-7 h-7 text-pink-300 mb-2" />
            <div className="text-xs text-gray-300">Incoming Docs / Emails</div>
            <div className="mt-2 w-full h-2 rounded bg-white/10 overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-pink-500 to-purple-500" initial={{ x: "-100%" }} animate={{ x: 0 }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }} />
            </div>
          </motion.div>

          {/* Agent */}
          <motion.div
            className="relative rounded-full h-28 w-28 mx-auto flex items-center justify-center border border-white/10 bg-gradient-to-br from-gray-800/60 to-black/60"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: [0.95, 1, 0.95], opacity: 1 }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 via-pink-500/20 to-indigo-500/20 blur-xl" />
            <Bot className="relative z-10 w-8 h-8 text-purple-300" />
            <span className="absolute -bottom-6 text-[10px] text-gray-400">AI Agent</span>
          </motion.div>

          {/* Output */}
          <motion.div
            className="rounded-2xl p-4 h-32 bg-white/5 border border-white/10 backdrop-blur-md flex flex-col items-center justify-center"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <BarChart2 className="w-7 h-7 text-indigo-300 mb-2" />
            <div className="text-xs text-gray-300">Structured Data / Dashboards</div>
            <div className="mt-2 w-full h-2 rounded bg-white/10 overflow-hidden">
              <motion.div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500" initial={{ x: "-100%" }} animate={{ x: 0 }} transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut", delay: 0.4 }} />
            </div>
          </motion.div>

          {/* Flow pulse */}
          <motion.div
            className="col-span-3 relative h-6 mt-3"
            initial={false}
          >
            <div className="absolute left-[12%] right-[12%] top-1/2 -translate-y-1/2 h-[2px] bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500/60 opacity-60" />
            <motion.span
              className="absolute top-1/2 -translate-y-1/2 h-3 w-3 rounded-full bg-gradient-to-r from-pink-400 to-purple-400 shadow-[0_0_12px_rgba(236,72,153,0.6)]"
              initial={{ left: "12%" }}
              animate={{ left: ["12%", "50%", "88%"] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            />
          </motion.div>
        </div>
      </div>
    </div>
  );
}


