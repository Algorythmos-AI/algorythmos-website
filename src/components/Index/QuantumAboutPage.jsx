// src/components/Index/QuantumAboutPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { motion } from "framer-motion";
import TeamGrid from "./TeamGrid";
import { track } from "../../lib/analytics";
import { persistUtmFromLocation, readStoredUtm } from "../../lib/utm";

import {
  Brain,
  Zap,
  Globe,
  Users,
  Award,
  Target,
  Rocket,
  Eye,
  Heart,
  Sparkles,
  TrendingUp,
  Shield,
  Cpu,
  Network,
} from "lucide-react";

/* ----------------------------- static content ----------------------------- */
const STATS = [
  { icon: Rocket, value: "2025", label: "Founded" },
  { icon: Globe, value: "Suresnes, FR", label: "Headquarters" },
  { icon: Users, value: "2–10", label: "Team Size" },
  { icon: Shield, value: "GDPR • EU AI Act", label: "Compliance Ready" },
];



const VALUES = [
  {
    icon: <Brain className="w-12 h-12" />,
    title: "Infinite Innovation",
    description:
      "We push beyond the boundaries of what's possible, constantly evolving and reimagining the future of business intelligence.",
    gradient: "from-blue-500 to-purple-500",
  },
  {
    icon: <Heart className="w-12 h-12" />,
    title: "Human-Centric Design",
    description:
      "Technology serves humanity. Every quantum leap we make is designed to enhance human potential and create meaningful impact.",
    gradient: "from-pink-500 to-rose-500",
  },
  {
    icon: <Globe className="w-12 h-12" />,
    title: "Global Consciousness",
    description:
      "Our solutions transcend borders, cultures, and limitations. We think globally while acting with precision and purpose.",
    gradient: "from-green-500 to-emerald-500",
  },
  {
    icon: <Zap className="w-12 h-12" />,
    title: "Quantum Excellence",
    description:
      "Excellence isn't a destination—it's our quantum state. We exist in a superposition of continuous improvement and breakthrough innovation.",
    gradient: "from-yellow-500 to-orange-500",
  },
];

const TIMELINE = [
  { year: "2024 Jun", title: "Idea at SKEMA Business School", description: "Conceived Algorythmos after graduating from SKEMA—focus: practical, secure, ROI‑driven AI for enterprises.", icon: <Award className="w-8 h-8" /> },
  { year: "2024 Jul", title: "Problem Discovery", description: "Conducted 20+ founder interviews with finance/ops leaders to validate pain points in document processing, data access, and deployment risk.", icon: <Target className="w-8 h-8" /> },
  { year: "2024 Sep", title: "Document Intelligence Prototype", description: "Built the first OCR + NLP pipeline for invoices/contracts; moved from manual to programmatic extraction.", icon: <Cpu className="w-8 h-8" /> },
  { year: "2024 Oct", title: "First Pilot (Anonymized EU Mid‑Market)", description: "Automated monthly invoice reconciliation; reduced cycle time from days to hours and cut repetitive work for the finance team.", icon: <Users className="w-8 h-8" /> },
  { year: "2024 Nov", title: "Security by Design", description: "Established AppSec baseline and LLMSecOps controls; mapped to GDPR & EU AI Act.", icon: <Shield className="w-8 h-8" /> },
  { year: "2025 Jan", title: "Company Founded — Suresnes, FR", description: "Algorythmos incorporated with a boutique model to stay close to impact and delivery quality.", icon: <Rocket className="w-8 h-8" /> },
  { year: "2025 Feb", title: "Agentic Automation POC", description: "Deployed AI agents to orchestrate API workflows; eliminated hand‑offs and manual status updates.", icon: <Brain className="w-8 h-8" /> },
  { year: "2025 Mar", title: "MLOps to CI/CD", description: "Productionized models using CI/CD, Docker, and Kubernetes—fewer deployment errors, faster iteration.", icon: <Network className="w-8 h-8" /> },
  { year: "2025 Apr", title: "First Paying Customer", description: "Signed a mid‑market logistics client for document intelligence + agentic automation; leadership gained near‑real‑time visibility on exceptions.", icon: <Globe className="w-8 h-8" /> },
  { year: "2025 May", title: "Compliance Toolkit", description: "Released DPIA templates and policy packs aligned to GDPR and emerging EU AI Act requirements.", icon: <Award className="w-8 h-8" /> },
  { year: "2025 Jun", title: "Integration & Data Accelerators", description: "Shipped connectors for common data stacks/message buses, reducing time‑to‑first‑value.", icon: <Network className="w-8 h-8" /> },
  { year: "2025 Jul", title: "SQL Dashboard Starter", description: "Launched a reusable analytics starter to turn raw SQL into executive‑ready dashboards.", icon: <TrendingUp className="w-8 h-8" /> },
  { year: "2025 Aug", title: "Scale & Seed Readiness", description: "Active pilots in 3 verticals; preparing for seed with delivery playbooks and compliance posture.", icon: <Eye className="w-8 h-8" /> },
];

const TAB_CONTENT = {
  mission: {
    title: "Our Mission",
    content:
      "Algorythmos helps enterprises unlock the real value of their data with secure, practical, ROI‑driven AI. We design, build, and integrate solutions that reduce costs, save time, and improve decision‑making.",
  },
  vision: {
    title: "Our Vision",
    content:
      "A world where AI is trustworthy by design—compliant with GDPR and the EU AI Act, engineered with AppSec and LLMSecOps, and built to augment people, not replace them.",
  },
  impact: {
    title: "Our Impact",
    content:
      "From rapid prototypes to production systems, we deliver measurable outcomes: faster cycles, fewer manual steps, and clearer decisions. We partner end‑to‑end—from strategy to MLOps with CI/CD.",
  },
};

/* -------------------------------- component -------------------------------- */

const QuantumAboutPage = () => {
  const [scrollY, setScrollY] = useState(0);
  const [activeTab, setActiveTab] = useState("mission");
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [mouse, setMouse] = useState({ x: 0, y: 0 });

  // Page view tracking with UTM context
  useEffect(() => {
    persistUtmFromLocation();
    const utm = readStoredUtm();
    track("page_view", { page: "about", ...utm });
  }, []);

  // Canvas + particles are refs so we don't trigger re-renders every frame
  const canvasRef = useRef(null);
  const particlesRef = useRef([]);
  const rafRef = useRef(null);

  // Init particles once (SSR-safe)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const count = 30;
    particlesRef.current = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      size: Math.random() * 2 + 1,
      opacity: Math.random() * 0.3 + 0.1,
      color: ["59, 130, 246", "147, 51, 234", "236, 72, 153"][Math.floor(Math.random() * 3)],
    }));
  }, []);

  // Mouse + scroll listeners
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleMouse = (e) => setMouse({ x: e.clientX, y: e.clientY });
    const handleScroll = () => setScrollY(window.scrollY);

    window.addEventListener("mousemove", handleMouse);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("mousemove", handleMouse);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Resize canvas
  useEffect(() => {
    if (typeof window === "undefined") return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, []);

  // Animate particles with RAF (no setState inside loop)
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === "undefined") return;
    const ctx = canvas.getContext("2d");

    const draw = () => {
      const { width, height } = canvas;
      ctx.clearRect(0, 0, width, height);

      for (const p of particlesRef.current) {
        // update
        p.x += p.vx;
        p.y += p.vy;

        if (p.x <= 0 || p.x >= width) p.vx *= -1;
        if (p.y <= 0 || p.y >= height) p.vy *= -1;

        // mouse repulsion
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 80 && dist > 0) {
          p.x -= (dx / dist) * 0.4;
          p.y -= (dy / dist) * 0.4;
        }

        // draw
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.opacity})`;
        ctx.shadowColor = `rgba(${p.color}, 0.8)`;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      rafRef.current = requestAnimationFrame(draw);
    };

    rafRef.current = requestAnimationFrame(draw);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [mouse.x, mouse.y]);

  return (
    <div className="relative min-h-screen bg-black text-white overflow-hidden">
      <Helmet>
        <title>About | Algorythmos™</title>
        <meta
          name="description"
          content="Algorythmos is a boutique AI consultancy founded in 2025, delivering secure, ROI-driven AI solutions for SMEs and enterprises across France and Australia. Learn about our mission, values, and team supporting clients from Suresnes to Sydney."
        />
        <link rel="canonical" href="https://www.algorythmos.fr/about" />
        <meta property="og:type" content="website" />
        <meta property="og:title" content="About Us | Algorythmos™" />
        <meta property="og:description" content="Algorythmos is a boutique AI consultancy founded in 2025, delivering secure, ROI-driven AI solutions for SMEs and enterprises across France and Australia. Learn about our mission, values, and team supporting clients from Suresnes to Sydney." />
        <meta property="og:url" content="https://www.algorythmos.fr/about" />
        <meta property="og:image" content="https://www.algorythmos.fr/Algorythmos.png" />
        <meta property="og:site_name" content="Algorythmos" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About Us | Algorythmos™" />
        <meta name="twitter:description" content="Algorythmos is a boutique AI consultancy founded in 2025, delivering secure, ROI-driven AI solutions for SMEs and enterprises across France and Australia. Learn about our mission, values, and team supporting clients from Suresnes to Sydney." />
        <meta property="og:url" content="https://www.algorythmos.fr/about" />
        <meta property="og:image" content="https://www.algorythmos.fr/Algorythmos.png" />
        <meta property="og:site_name" content="Algorythmos" />
        <meta property="og:locale" content="en_US" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="About | Algorythmos™" />
        <meta name="twitter:description" content="Algorythmos is a boutique AI consultancy founded in 2025, delivering secure, ROI-driven AI solutions for SMEs across Europe. Learn about our mission, values, and team." />
        <meta name="twitter:image" content="https://www.algorythmos.fr/Algorythmos.png" />
      </Helmet>
      
      {/* Global Navbar is rendered by App.jsx */}

      {/* Canvas Background */}
      <canvas ref={canvasRef} className="fixed inset-0 pointer-events-none z-0 opacity-40" />

      {/* Dynamic Background Gradient blobs */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-black" />
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{
            background: "linear-gradient(45deg, #3B82F6, #8B5CF6)",
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`,
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 animate-pulse"
          style={{
            background: "linear-gradient(45deg, #EC4899, #F59E0B)",
            transform: `translate(${-scrollY * 0.08}px, ${-scrollY * 0.06}px)`,
            animationDelay: "2s",
          }}
        />
      </div>

      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center z-10 pt-24 sm:pt-28 md:pt-0 pb-12 sm:pb-16 md:pb-0">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <div className="inline-flex items-center px-5 sm:px-7 py-2.5 sm:py-3.5 mb-8 sm:mb-10 md:mb-12 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-full text-sm sm:text-base md:text-lg font-medium shadow-lg">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2.5 sm:mr-3 animate-spin" />
              Driving AI Innovations
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl 2xl:text-9xl font-black mb-8 sm:mb-10 md:mb-12 leading-[1.1] tracking-tight">
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Beyond
              </span>
              <span className="block text-white mt-2 sm:mt-3">Business as Usual</span>
            </h1>

            <p className="text-base sm:text-lg md:text-xl lg:text-2xl xl:text-3xl text-gray-200 mb-10 sm:mb-12 md:mb-14 max-w-5xl mx-auto leading-relaxed px-2 sm:px-4">
              At Algorythmos, we transform complex data challenges into
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-bold"> practical AI solutions </span>
              for enterprises and SMEs across France and Australia. Our mission is clear: to deliver secure, ROI-driven innovation that helps businesses from Suresnes to Sydney scale, adapt, and thrive.
            </p>
          </motion.div>
        </div>
      </section>

      {/* What Does Algorythmos Mean? */}
      <section className="py-16 sm:py-20 md:py-28 lg:py-32 xl:py-36 relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          {/* Section Header */}
          <motion.div 
            className="text-center mb-12 sm:mb-16 md:mb-20 lg:mb-24 xl:mb-28"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-extrabold mb-6 sm:mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent tracking-tight leading-[1.1] px-4">
              What Does Algorythmos Mean?
            </h2>
          </motion.div>

          {/* Two-Card Fusion Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12 xl:gap-14 mb-12 sm:mb-16 md:mb-20 lg:mb-24 xl:mb-28">
            {/* Card 1: Algorithm */}
            <motion.div 
              className="group relative overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] bg-white/[0.02] backdrop-blur-3xl border border-white/[0.08] p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 transition-all duration-700 hover:scale-[1.012] hover:border-blue-400/30 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.4)] hover:shadow-[0_24px_64px_-12px_rgba(59,130,246,0.25)]"  
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.1 }}
            >
              {/* Refined gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/[0.08] via-blue-600/[0.04] to-purple-600/[0.06] opacity-80" />
              
              {/* Geometric Pattern Background */}
              <div className="absolute inset-0 opacity-[0.06]">
                <div className="absolute top-0 left-0 w-full h-full" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 14px, rgba(59, 130, 246, 0.12) 14px, rgba(59, 130, 246, 0.12) 28px)`
                }}>
                </div>
              </div>

              <div className="relative z-10">
                {/* Icon & Title */}
                <div className="flex items-start gap-4 sm:gap-5 mb-6 sm:mb-8 lg:mb-9">
                  <div className="p-3 sm:p-3.5 lg:p-4 bg-blue-400/10 border border-blue-400/20 rounded-xl sm:rounded-2xl group-hover:bg-blue-400/15 group-hover:border-blue-400/30 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 flex-shrink-0">
                    <Cpu className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 sm:mb-3 tracking-tight">Algorithm</h3>
                    <div className="h-[1px] w-16 sm:w-20 bg-gradient-to-r from-blue-400/60 via-blue-400/30 to-transparent mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base lg:text-lg text-blue-300/90 leading-loose tracking-[0.02em]">Logic, structure, precision</p>
                  </div>
                </div>

                {/* Code-style snippet */}
                <div className="bg-black/60 border border-blue-400/20 rounded-xl sm:rounded-[1.25rem] p-4 sm:p-5 lg:p-6 font-mono text-sm sm:text-base lg:text-lg text-blue-300 backdrop-blur-sm shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)] overflow-x-auto">
                  <span className="text-purple-400">{'{'}</span> <span className="text-gray-200">reason</span> <span className="text-blue-400 mx-1">→</span> <span className="text-gray-200">automate</span> <span className="text-blue-400 mx-1">→</span> <span className="text-gray-200">optimise</span> <span className="text-purple-400">{'}'}</span>
                </div>
              </div>

              {/* Softer hover glow effect */}
              <div className="absolute -inset-3 bg-gradient-to-r from-blue-500/20 via-blue-600/15 to-purple-600/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700 -z-10" />
            </motion.div>

            {/* Card 2: Rhythmos */}
            <motion.div 
              className="group relative overflow-hidden rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] bg-white/[0.02] backdrop-blur-3xl border border-white/[0.08] p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14 transition-all duration-700 hover:scale-[1.012] hover:border-purple-400/30 shadow-[0_8px_40px_-12px_rgba(0,0,0,0.4)] hover:shadow-[0_24px_64px_-12px_rgba(168,85,247,0.25)]"  
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              {/* Refined gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/[0.08] via-pink-600/[0.04] to-rose-600/[0.06] opacity-80" />
              
              {/* Wavy Pattern Background */}
              <div className="absolute inset-0 opacity-[0.07]">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="wave-pattern" x="0" y="0" width="140" height="140" patternUnits="userSpaceOnUse">
                      <path d="M0 70 Q 35 50, 70 70 T 140 70" stroke="rgba(236, 72, 153, 0.35)" strokeWidth="2.5" fill="none" />
                      <path d="M0 90 Q 35 70, 70 90 T 140 90" stroke="rgba(168, 85, 247, 0.35)" strokeWidth="2.5" fill="none" />
                      <path d="M0 110 Q 35 90, 70 110 T 140 110" stroke="rgba(236, 72, 153, 0.25)" strokeWidth="2" fill="none" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#wave-pattern)" />
                </svg>
              </div>

              <div className="relative z-10">
                {/* Icon & Title */}
                <div className="flex items-start gap-4 sm:gap-5 mb-6 sm:mb-8 lg:mb-9">
                  <div className="p-3 sm:p-3.5 lg:p-4 bg-purple-400/10 border border-purple-400/20 rounded-xl sm:rounded-2xl group-hover:bg-purple-400/15 group-hover:border-purple-400/30 transition-all duration-500 group-hover:scale-110 group-hover:-rotate-3 flex-shrink-0">
                    <Network className="w-7 h-7 sm:w-8 sm:h-8 lg:w-9 lg:h-9 text-purple-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white mb-2 sm:mb-3 tracking-tight">Rhythmos</h3>
                    <div className="h-[1px] w-16 sm:w-20 bg-gradient-to-r from-purple-400/60 via-purple-400/30 to-transparent mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base lg:text-lg text-purple-300/90 leading-loose tracking-[0.02em]">Flow, timing, adaptation</p>
                  </div>
                </div>

                {/* Greek etymology note */}
                <div className="bg-black/60 border border-purple-400/20 rounded-xl sm:rounded-[1.25rem] p-4 sm:p-5 lg:p-6 backdrop-blur-sm shadow-[inset_0_2px_8px_rgba(0,0,0,0.3)]">
                  <p className="text-sm sm:text-base lg:text-lg text-purple-300 italic leading-loose">
                    <span className="font-semibold text-pink-300">Greek:</span> <span className="text-purple-200">ῥυθμός</span> <span className="text-purple-400/80">(rhythmós)</span>
                  </p>
                  <p className="text-xs sm:text-sm lg:text-base text-purple-400/80 mt-2 sm:mt-3 leading-loose">
                    "flow, harmony, natural pattern"
                  </p>
                </div>
              </div>

              {/* Softer hover glow effect */}
              <div className="absolute -inset-3 bg-gradient-to-r from-purple-500/20 via-pink-600/15 to-rose-600/20 rounded-[2.5rem] opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-700 -z-10" />
            </motion.div>
          </div>

          {/* Explanation Text - Three Paragraphs */}
          <div className="max-w-4xl mx-auto mt-10 sm:mt-12 md:mt-16 lg:mt-20 xl:mt-24">
            <motion.div 
              className="relative rounded-2xl sm:rounded-3xl lg:rounded-[2.5rem] bg-gradient-to-br from-gray-900/95 via-gray-850/90 to-gray-900/95 border border-white/[0.06] backdrop-blur-3xl px-6 py-10 sm:px-10 sm:py-12 md:px-12 md:py-14 lg:px-14 lg:py-16 xl:px-16 xl:py-20 shadow-[0_24px_88px_-12px_rgba(0,0,0,0.5)] overflow-hidden"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-blue-400/40 via-purple-400/40 to-transparent" />
              
              {/* Subtle background accent blobs */}
              <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-blue-500/[0.06] via-purple-500/[0.04] to-transparent rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 left-0 w-96 h-96 bg-gradient-to-tr from-purple-500/[0.06] via-pink-500/[0.04] to-transparent rounded-full blur-3xl -z-10" />

              <div className="relative z-10 max-w-prose mx-auto space-y-6 sm:space-y-8 lg:space-y-9">
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 leading-[1.7] sm:leading-[1.75] tracking-[0.01em]">
                  Algorythmos is born from two worlds. <span className="text-blue-400 font-semibold">"Algorithm"</span>, the domain of logic and structured intelligence. And <span className="text-purple-400 font-semibold">"Rhythmos"</span>, the Greek idea of flow, harmony, and natural pattern. Together, they form a brand built on balance: rigorous reasoning paired with the rhythm of real business life.
                </p>

                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 leading-[1.7] sm:leading-[1.75] tracking-[0.01em]">
                  For us, the algorithm represents precision, automation, and the intelligence behind every decision. The rhythm represents timing, human context, and the way every organisation moves at its own pace.
                </p>

                <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-100 leading-[1.7] sm:leading-[1.75] tracking-[0.01em]">
                  Algorythmos stands for AI that doesn't fight your workflow but moves with it – learning your patterns, adapting to your tempo, and becoming a natural part of how your team operates every day.
                </p>
              </div>

              {/* Bottom decorative accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-[1px] bg-gradient-to-r from-blue-500/30 via-purple-500/30 to-pink-500/30" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-16 sm:py-20 md:py-24 lg:py-28 relative z-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="flex justify-center mb-12 sm:mb-14 md:mb-16">
            <div className="flex flex-col sm:flex-row bg-gray-900/50 backdrop-blur-xl rounded-xl sm:rounded-2xl p-2 border border-gray-700/50 w-full sm:w-auto max-w-2xl">
              {Object.keys(TAB_CONTENT).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 sm:px-8 py-3.5 sm:py-4 rounded-lg sm:rounded-xl font-medium text-sm md:text-base transition-all duration-500 relative min-h-[44px] flex items-center justify-center ${
                    activeTab === tab ? "text-white" : "text-gray-400 hover:text-white"
                  }`}
                  aria-pressed={activeTab === tab}
                >
                  {activeTab === tab && (
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl opacity-100" />
                  )}
                  <span className="relative z-10 capitalize">{tab}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="text-center px-4">
            <h2 id="mission" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white mb-5 sm:mb-6">
              {TAB_CONTENT[activeTab].title}
            </h2>
            <p className="mt-4 sm:mt-5 md:mt-6 text-base sm:text-lg md:text-xl text-slate-300/90 max-w-2xl mx-auto leading-relaxed">
              {TAB_CONTENT[activeTab].content}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Company key facts" className="py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 sm:gap-6 md:gap-8">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="rounded-2xl sm:rounded-3xl bg-white/5 ring-1 ring-white/10 p-6 sm:p-7 md:p-8 flex flex-col gap-3 sm:gap-4 hover:-translate-y-1 transition-all duration-300 min-h-[160px] sm:min-h-[180px]"
              >
                <Icon className="w-6 h-6 sm:w-7 sm:h-7 text-white/70" aria-hidden="true" />
                <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-none tracking-tight text-white">
                  {value}
                </div>
                <div className="text-xs sm:text-sm uppercase tracking-wide text-slate-400/90">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-20 md:py-28 lg:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 sm:mb-8 px-4">
              Our
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-2">
                Values
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto px-4 leading-relaxed">
              These principles guide every solution we deliver — ensuring innovation, trust, and measurable business impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-10 lg:gap-12">
            {VALUES.map((value, i) => (
              <div
                key={i}
                className="group relative p-6 sm:p-8 md:p-10 bg-gradient-to-br from-gray-900/60 to-black/60 rounded-2xl sm:rounded-3xl border border-gray-800/50 hover:border-white/20 backdrop-blur-xl transition-all duration-700 transform hover:scale-[1.02] hover:-translate-y-2 overflow-hidden shadow-lg"
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${value.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-700`} />
                <div className="relative z-10">
                  <div className={`inline-flex p-4 bg-gradient-to-br ${value.gradient} rounded-2xl mb-4 sm:mb-6 group-hover:scale-110 group-hover:rotate-12 transition-all duration-500`}>
                    {value.icon}
                  </div>
                  <h3 className="text-xl sm:text-2xl md:text-3xl font-bold mb-4 sm:mb-6 group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                    {value.title}
                  </h3>
                  <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-500">
                    {value.description}
                  </p>
                </div>
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{ animationDelay: "0.5s" }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-16 sm:py-32 relative z-10 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/5 via-purple-900/5 to-black" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="mt-24 md:mt-28">
            <TeamGrid />
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-16 sm:py-20 md:py-28 lg:py-32 relative z-10">
        <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12">
          <div className="text-center mb-12 sm:mb-16 md:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 sm:mb-8 px-4">
              Our
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-2">
                Journey
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto px-4 leading-relaxed">
              Milestones from first prototype to secure, production‑ready AI for enterprises.
            </p>
          </div>

          <div className="relative">
            <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-0.5 sm:w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />
            {TIMELINE.map((item, i) => {
              const leftSide = i % 2 === 0;
              return (
                <div key={i} className={`relative flex items-center mb-10 sm:mb-12 md:mb-16 ${leftSide ? "justify-start" : "justify-end"}`}>
                  <div className="hidden md:block absolute left-1/2 transform -translate-x-1/2 w-5 h-5 sm:w-6 sm:h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-black z-10 animate-pulse" />
                  <div className={`w-full md:w-5/12 ${leftSide ? "md:pr-8 lg:pr-12 md:text-right" : "md:pl-8 lg:pl-12 text-left"}`}>
                    <div className="group p-6 sm:p-7 md:p-8 bg-gradient-to-br from-gray-900/80 to-black/80 rounded-2xl sm:rounded-3xl border border-gray-800/50 hover:border-white/20 backdrop-blur-xl transition-all duration-500 transform hover:scale-[1.02]">
                      <div className={`flex items-center gap-3 mb-4 sm:mb-5 ${leftSide ? "md:justify-end" : "justify-start"}`}>
                        <div className="text-purple-400 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                        <div className="text-xl sm:text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{item.year}</div>
                      </div>
                      <h3 className="text-xl sm:text-2xl font-bold mb-3 sm:mb-4 group-hover:text-blue-400 transition-colors duration-300">{item.title}</h3>
                      <p className="text-sm sm:text-base text-gray-300 group-hover:text-white transition-colors duration-300 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 sm:py-20 md:py-28 lg:py-32 relative z-10">
        <div className="max-w-5xl mx-auto text-center px-6 sm:px-8 lg:px-12">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl 2xl:text-8xl font-black mb-6 sm:mb-8 leading-tight">
            Ready to
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent mt-2">
              Start Your AI Journey?
            </span>
          </h2>

          <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-10 sm:mb-12 max-w-3xl mx-auto leading-relaxed px-4">
            Move beyond experimentation. Unlock secure, ROI-driven AI solutions that reduce costs, save time, and empower smarter decisions.
          </p>

          <div className="flex flex-col sm:flex-row gap-5 sm:gap-6 justify-center items-center px-4">
            <Link
              to="/contact"
              className="group relative px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl md:text-2xl overflow-hidden transform hover:scale-105 transition-all duration-500 min-h-[56px] flex items-center justify-center w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              <span className="relative">Book a Consultation</span>
            </Link>

            <Link
              to="/services"
              className="group relative px-8 sm:px-10 md:px-12 py-4 sm:py-5 md:py-6 border-2 border-gray-600 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl md:text-2xl hover:border-white transition-all duration-500 backdrop-blur-sm overflow-hidden min-h-[56px] flex items-center justify-center w-full sm:w-auto"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              <span className="relative">Explore Our Services</span>
            </Link>
          </div>

          <div className="mt-6 sm:mt-8 text-gray-400 text-xs sm:text-sm flex flex-wrap justify-center gap-x-4 gap-y-2 px-4">
            <span>✅ GDPR & EU AI Act Ready</span>
            <span>•</span>
            <span>⚙️ MLOps with CI/CD</span>
            <span>•</span>
            <span>🤖 Agentic Automation</span>
          </div>
        </div>
      </section>

      {/* Global Footer is rendered by App.jsx */}

      {/* Local keyframes (works in CRA/Vite) */}
      <style>{`
        @keyframes fadeInUp { from { opacity:0; transform: translateY(30px);} to { opacity:1; transform: translateY(0);} }
        @keyframes slideInRight { from { opacity:0; transform: translateX(50px);} to { opacity:1; transform: translateX(0);} }
        @keyframes float { 0%,100% { transform: translateY(0);} 50% { transform: translateY(-10px);} }
        @keyframes gradientShift { 0% { background-position:0% 50%; } 100% { background-position:100% 50%; } }
        @keyframes pulse { 0%,100% { transform: scale(1); opacity:1;} 50% { transform: scale(1.05); opacity:.8;} }
      `}</style>
    </div>
  );
};

export default QuantumAboutPage;
