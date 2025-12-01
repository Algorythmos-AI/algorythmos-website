// src/components/Index/QuantumAboutPage.jsx
import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
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
      <section className="relative min-h-screen flex items-center justify-center z-10 pt-20 md:pt-0">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <div className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 mb-6 sm:mb-8 bg-gradient-to-r from-blue-600/20 to-purple-600/20 backdrop-blur-sm border border-white/20 rounded-full text-sm sm:text-lg font-medium">
              <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 mr-2 sm:mr-3 animate-spin" />
              Driving AI Innovations
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-9xl font-black mb-6 sm:mb-8 leading-tight">
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Beyond
              </span>
              <span className="block text-white">Business as Usual</span>
            </h1>

            <p className="text-lg sm:text-xl md:text-2xl lg:text-4xl text-gray-300 mb-8 sm:mb-12 max-w-5xl mx-auto leading-relaxed px-4">
              At Algorythmos, we transform complex data challenges into
              <span className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent font-bold"> practical AI solutions </span>
              for enterprises and SMEs across France and Australia. Our mission is clear: to deliver secure, ROI-driven innovation that helps businesses from Suresnes to Sydney scale, adapt, and thrive.
            </p>
          </div>
        </div>
      </section>

      {/* What Does Algorythmos Mean? */}
      <section className="py-16 sm:py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Section Header */}
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              What Does Algorythmos Mean?
            </h2>
          </div>

          {/* Two-Card Fusion Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 mb-12 sm:mb-16">
            {/* Card 1: Algorithm */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-900/30 via-blue-800/20 to-purple-900/30 border border-blue-500/30 backdrop-blur-xl p-8 sm:p-10 transition-all duration-700 hover:scale-105 hover:border-blue-400/50 shadow-lg hover:shadow-blue-500/20">
              {/* Geometric Pattern Background */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-0 left-0 w-full h-full" style={{
                  backgroundImage: `repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(59, 130, 246, 0.1) 10px, rgba(59, 130, 246, 0.1) 20px)`
                }}>
                </div>
              </div>

              <div className="relative z-10">
                {/* Icon */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-blue-500/20 rounded-2xl group-hover:bg-blue-500/30 transition-colors duration-300">
                    <Cpu className="w-8 h-8 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white mb-1">Algorithm</h3>
                    <p className="text-sm sm:text-base text-blue-300/80">Logic, structure, precision</p>
                  </div>
                </div>

                {/* Code-style snippet */}
                <div className="bg-black/40 border border-blue-500/20 rounded-xl p-4 font-mono text-sm sm:text-base text-blue-300 backdrop-blur-sm">
                  <span className="text-purple-400">{'{'}</span> reason <span className="text-gray-400">→</span> automate <span className="text-gray-400">→</span> optimise <span className="text-purple-400">{'}'}</span>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700 -z-10" />
            </div>

            {/* Card 2: Rhythmos */}
            <div className="group relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-900/30 via-pink-800/20 to-rose-900/30 border border-purple-500/30 backdrop-blur-xl p-8 sm:p-10 transition-all duration-700 hover:scale-105 hover:border-purple-400/50 shadow-lg hover:shadow-purple-500/20">
              {/* Wavy Pattern Background */}
              <div className="absolute inset-0 opacity-10">
                <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <pattern id="wave-pattern" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                      <path d="M0 50 Q 25 30, 50 50 T 100 50" stroke="rgba(236, 72, 153, 0.3)" strokeWidth="2" fill="none" />
                      <path d="M0 70 Q 25 50, 50 70 T 100 70" stroke="rgba(168, 85, 247, 0.3)" strokeWidth="2" fill="none" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#wave-pattern)" />
                </svg>
              </div>

              <div className="relative z-10">
                {/* Icon */}
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 bg-purple-500/20 rounded-2xl group-hover:bg-purple-500/30 transition-colors duration-300">
                    <Network className="w-8 h-8 text-purple-400" />
                  </div>
                  <div>
                    <h3 className="text-2xl sm:text-3xl font-black text-white mb-1">Rhythmos</h3>
                    <p className="text-sm sm:text-base text-purple-300/80">Flow, timing, adaptation</p>
                  </div>
                </div>

                {/* Greek etymology note */}
                <div className="bg-black/40 border border-purple-500/20 rounded-xl p-4 backdrop-blur-sm">
                  <p className="text-sm sm:text-base text-purple-300 italic">
                    <span className="font-semibold text-pink-300">Greek:</span> ῥυθμός (rhythmós)
                  </p>
                  <p className="text-xs sm:text-sm text-purple-400/80 mt-1">
                    "flow, harmony, natural pattern"
                  </p>
                </div>
              </div>

              {/* Hover glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-700 -z-10" />
            </div>
          </div>

          {/* Explanation Text - Three Paragraphs */}
          <div className="max-w-4xl mx-auto">
            <div className="relative rounded-3xl bg-gradient-to-br from-gray-900/80 via-gray-800/60 to-black/80 border border-gray-700/50 backdrop-blur-xl p-8 sm:p-10 md:p-12 shadow-2xl overflow-hidden">
              {/* Subtle background accent */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-500/10 to-purple-500/10 rounded-full blur-3xl -z-10" />
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-gradient-to-tr from-purple-500/10 to-pink-500/10 rounded-full blur-3xl -z-10" />

              <div className="relative z-10 prose prose-lg prose-invert max-w-prose mx-auto">
                <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-loose mb-6">
                  Algorythmos is born from two worlds. <span className="text-blue-400 font-semibold">"Algorithm"</span>, the domain of logic and structured intelligence. And <span className="text-purple-400 font-semibold">"Rhythmos"</span>, the Greek idea of flow, harmony, and natural pattern. Together, they form a brand built on balance: rigorous reasoning paired with the rhythm of real business life.
                </p>

                <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-loose mb-6">
                  For us, the algorithm represents precision, automation, and the intelligence behind every decision. The rhythm represents timing, human context, and the way every organisation moves at its own pace.
                </p>

                <p className="text-base sm:text-lg md:text-xl text-gray-200 leading-loose">
                  Algorythmos stands for AI that doesn't fight your workflow but moves with it – learning your patterns, adapting to your tempo, and becoming a natural part of how your team operates every day.
                </p>
              </div>

              {/* Decorative accent line */}
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-50" />
            </div>
          </div>
        </div>
      </section>

      {/* Tabs */}
      <section className="py-16 sm:py-24 relative z-10">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-center mb-12 sm:mb-16">
            <div className="flex flex-col sm:flex-row bg-gray-900/50 backdrop-blur-xl rounded-2xl p-2 border border-gray-700/50 w-full sm:w-auto">
              {Object.keys(TAB_CONTENT).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-medium text-xs md:text-sm transition-all duration-500 relative ${
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

          <div className="text-center">
            <h2 id="mission" className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white text-center">
              {TAB_CONTENT[activeTab].title}
            </h2>
            <p className="mt-4 text-base md:text-lg text-slate-300/90 max-w-2xl mx-auto text-center">
              {TAB_CONTENT[activeTab].content}
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section aria-label="Company key facts" className="mt-10 md:mt-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {STATS.map(({ icon: Icon, value, label }) => (
              <div
                key={label}
                className="rounded-3xl bg-white/5 ring-1 ring-white/10 p-6 md:p-8 flex flex-col gap-3 hover:-translate-y-0.5 transition-transform duration-300"
              >
                <Icon className="size-6 md:size-7 text-white/70" aria-hidden="true" />
                <div className="text-3xl md:text-4xl lg:text-5xl font-bold leading-none tracking-tight text-white">
                  {value}
                </div>
                <div className="text-xs md:text-sm uppercase tracking-wide text-slate-400/90">
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 sm:py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-20">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black mb-6 sm:mb-8">
              Our
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Values
              </span>
            </h2>
            <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 max-w-4xl mx-auto px-4">
              These principles guide every solution we deliver — ensuring innovation, trust, and measurable business impact.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 md:gap-12">
            {VALUES.map((value, i) => (
              <div
                key={i}
                className="group relative p-6 sm:p-8 md:p-10 bg-gradient-to-br from-gray-900/60 to-black/60 rounded-3xl border border-gray-800/50 hover:border-white/20 backdrop-blur-xl transition-all duration-700 transform hover:scale-105 hover:-translate-y-4 overflow-hidden shadow-lg"
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
      <section className="py-32 relative z-10">
        <div className="max-w-6xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-6xl md:text-7xl font-black mb-8">
              Our
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Journey
              </span>
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto">
              Milestones from first prototype to secure, production‑ready AI for enterprises.
            </p>
          </div>

          <div className="relative">
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-500 via-purple-500 to-pink-500" />
            {TIMELINE.map((item, i) => {
              const leftSide = i % 2 === 0;
              return (
                <div key={i} className={`relative flex items-center mb-16 ${leftSide ? "justify-start" : "justify-end"}`}>
                  <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full border-4 border-black z-10 animate-pulse" />
                  <div className={`w-full md:w-5/12 ${leftSide ? "md:pr-12 text-right" : "md:pl-12 text-left"}`}>
                    <div className="group p-8 bg-gradient-to-br from-gray-900/80 to-black/80 rounded-3xl border border-gray-800/50 hover:border-white/20 backdrop-blur-xl transition-all duration-500 transform hover:scale-105">
                      <div className={`flex items-center mb-4 ${leftSide ? "justify-end" : "justify-start"}`}>
                        <div className="text-purple-400 mr-3 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                        <div className="text-2xl font-black bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">{item.year}</div>
                      </div>
                      <h3 className="text-2xl font-bold mb-4 group-hover:text-blue-400 transition-colors duration-300">{item.title}</h3>
                      <p className="text-gray-300 group-hover:text-white transition-colors duration-300 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-32 relative z-10">
        <div className="max-w-5xl mx-auto text-center px-6 lg:px-8">
          <h2 className="text-6xl md:text-8xl font-black mb-8">
            Ready to
            <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              Start Your AI Journey?
            </span>
          </h2>

          <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
            Move beyond experimentation. Unlock secure, ROI-driven AI solutions that reduce costs, save time, and empower smarter decisions.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link
              to="/contact"
              className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-2xl overflow-hidden transform hover:scale-105 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              <span className="relative">Book a Consultation</span>
            </Link>

            <Link
              to="/services"
              className="group relative px-12 py-6 border-2 border-gray-600 rounded-2xl font-bold text-2xl hover:border-white transition-all duration-500 backdrop-blur-sm overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
              <span className="relative">Explore Our Services</span>
            </Link>
          </div>

          <div className="mt-6 text-gray-400 text-sm space-x-4">
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
