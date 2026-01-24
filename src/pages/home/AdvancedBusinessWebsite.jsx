import React, { Suspense, lazy, useEffect, useState } from 'react';
import { Brain, Rocket, Eye, Globe, Shield, Sparkles, CheckCircle, MousePointer2, Star } from 'lucide-react';
import { useI18n } from '../../app/i18n/I18nContext.jsx';
import { RegionHelmet } from '../../app/seo';
import SeoBreadcrumbs from '../../app/seo/SeoBreadcrumbs.jsx';
import Hero from '../../components/ui/Hero.jsx';
import ScrollReveal from '../../components/ui/ScrollReveal.jsx';
import Button from '../../components/ui/Button.jsx';

// Lazy-load heavy UI components
const LogoMarquee = lazy(() => import('../../components/ui/LogoMarquee.jsx'));
const ServicesShowcase = lazy(() => import('../../components/ui/ServicesShowcase.jsx'));
const ScrollSequence = lazy(() => import('../../components/microanimations/ScrollSequence.jsx'));

const AdvancedBusinessWebsite = () => {
  const { t, getRegionPath } = useI18n();

  // Mobile detection for performance optimization
  const [isMobile, setIsMobile] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    const checkMotion = () => setPrefersReducedMotion(
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );

    checkMobile();
    checkMotion();
    window.addEventListener('resize', checkMobile);

    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: t("home.features.0.title"),
      description: t("home.features.0.description"),
      gradient: "from-violet-500 to-indigo-500"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: t("home.features.1.title"),
      description: t("home.features.1.description"),
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: t("home.features.2.title"),
      description: t("home.features.2.description"),
      gradient: "from-emerald-500 to-teal-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t("home.features.3.title"),
      description: t("home.features.3.description"),
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: t("home.features.4.title"),
      description: t("home.features.4.description"),
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: t("home.features.5.title"),
      description: t("home.features.5.description"),
      gradient: "from-pink-500 to-rose-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t("home.features.6.title"),
      description: t("home.features.6.description"),
      gradient: "from-emerald-500 to-cyan-500"
    }
  ];

  const testimonials = [
    {
      name: t("home.testimonials.0.name"),
      role: t("home.testimonials.0.role"),
      content: t("home.testimonials.0.content"),
      rating: 5,
      avatar: "🧬"
    },
    {
      name: t("home.testimonials.1.name"),
      role: t("home.testimonials.1.role"),
      content: t("home.testimonials.1.content"),
      rating: 5,
      avatar: "🚀"
    },
    {
      name: t("home.testimonials.2.name"),
      role: t("home.testimonials.2.role"),
      content: t("home.testimonials.2.content"),
      rating: 5,
      avatar: "⚡"
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative selection:bg-indigo-500/30 selection:text-white">
      <RegionHelmet region="GLOBAL" />
      <SeoBreadcrumbs items={[{ name: "Home", path: "/" }]} />

      {/* 1. Neural Particle Hero */}
      <Hero />

      {/* 2. Partners Marquee (Infinite Loop) */}
      <div className="relative z-20 border-b border-white/5 bg-[#020617]">
        <Suspense fallback={<div className="h-40 bg-[#020617]" />}>
          <LogoMarquee />
        </Suspense>
      </div>

      {/* 3. Advanced Features Section */}
      <section className="py-24 md:py-32 relative z-10 bg-[#020617]">
        <div className="container-main">

          <ScrollReveal>
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter text-white">
                {t("home.capabilities.title")}
                <span className="block bg-gradient-to-r from-indigo-400 via-violet-400 to-fuchsia-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
                  {t("home.capabilities.titleHighlight")}
                </span>
              </h2>
              <p className="text-xl text-slate-400 max-w-4xl mx-auto leading-relaxed font-light">
                {t("home.capabilities.subtitle")}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ScrollReveal key={index} delay={index * 100} animation="fade-up">
                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-8 relative overflow-hidden group h-full transition-all duration-500 hover:border-violet-500/30 hover:shadow-[0_0_40px_-10px_rgba(124,58,237,0.3)]">
                  {/* Hover Glow */}
                  <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 blur-[80px] transition-opacity duration-700`} />

                  {/* Icon */}
                  <div className="relative mb-8 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 ease-out">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg ring-1 ring-white/20`}>
                      {feature.icon}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-violet-200 transition-colors tracking-tight">
                    {feature.title}
                  </h3>

                  <p className="text-slate-400 leading-relaxed group-hover:text-slate-200 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Neural Genesis — Scroll Animation Cinematic Section */}
      {/* Removed fixed height constraints to fix content void */}
      {!isMobile && !prefersReducedMotion && (
        <section className="relative bg-[#020617] overflow-hidden py-12">
          <Suspense fallback={<div className="h-screen bg-[#020617]" />}>
            <ScrollSequence />
          </Suspense>
          {/* Overlay Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="text-center px-6">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white/90 tracking-tighter drop-shadow-2xl">
                How AI <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Transforms</span>
              </h2>
              <p className="text-xl md:text-2xl text-slate-300 mt-6 font-light tracking-wide">Your Business Intelligence</p>
            </div>
          </div>
        </section>
      )}

      {/* Mobile fallback - static frame */}
      {(isMobile || prefersReducedMotion) && (
        <section className="relative py-32 bg-[#020617] overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <img
              src="/assets/lottie/scroll/scroll_0025.png"
              alt="Neural network visualization"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="relative z-10 text-center px-6">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tighter">
              How AI <span className="bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">Transforms</span>
            </h2>
            <p className="text-lg text-slate-300 mt-6 font-light">Your Business Intelligence</p>
          </div>
        </section>
      )}

      {/* 5. Neural Testimonials */}
      <section className="py-24 md:py-32 relative overflow-hidden bg-[#020617]">
        {/* Background Atmosphere */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/10 blur-[130px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-violet-600/10 blur-[130px] rounded-full pointer-events-none" />

        <div className="container-main relative z-10">
          <ScrollReveal>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter text-white">
                {t("home.testimonials.title")}
                <span className="block bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                  {t("home.testimonials.titleHighlight")}
                </span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal key={index} delay={index * 150} animation="scale">
                <div className="bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[2rem] p-10 h-full relative group hover:border-violet-500/30 hover:-translate-y-2 transition-all duration-500 shadow-xl">
                  <div className="flex items-center gap-1 mb-8">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  <p className="text-xl text-slate-200 mb-10 leading-relaxed font-light italic">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 rounded-full bg-slate-800 flex items-center justify-center text-3xl border border-white/10 shadow-inner">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-white group-hover:text-violet-300 transition-colors duration-300 text-lg">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-slate-400 uppercase tracking-wider font-semibold">
                        {testimonial.role}
                      </div>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6. Ultimate CTA */}
      <section className="py-24 md:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617] to-indigo-950/30" />

        <div className="container-narrow relative text-center z-10 px-6">
          <ScrollReveal animation="fade-up-slow">
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-tight text-white">
              {t("home.cta.title")}
              <span className="block bg-gradient-to-r from-violet-400 via-fuchsia-400 to-indigo-400 bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
                {t("home.cta.titleHighlight")}
              </span>
            </h2>

            <p className="text-2xl text-slate-300 mb-12 leading-relaxed max-w-3xl mx-auto font-light">
              {t("home.cta.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button
                to={getRegionPath("/contact")}
                variant="primary"
                className="w-full sm:w-auto text-lg px-12 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:shadow-[0_0_30px_rgba(124,58,237,0.5)] transition-shadow duration-300 rounded-full font-bold tracking-wide"
                icon={<Rocket className="w-6 h-6" />}
              >
                {t("home.cta.primary")}
              </Button>

              <Button
                to={getRegionPath("/services")}
                variant="secondary"
                className="w-full sm:w-auto text-lg px-12 py-6 border-white/10 hover:bg-white/5 rounded-full font-bold tracking-wide"
                icon={<MousePointer2 className="w-6 h-6" />}
              >
                {t("home.cta.secondary")}
              </Button>
            </div>

            <div className="flex items-center justify-center gap-10 text-slate-400 text-sm font-bold tracking-widest uppercase">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-emerald-400" />
                {t("home.cta.badge")}
              </div>
              <div className="hidden sm:flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-violet-400" />
                {t("home.cta.badgeSecondary")}
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default AdvancedBusinessWebsite;