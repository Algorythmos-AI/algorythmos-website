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
      gradient: "from-neon-violet to-neon-blue"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: t("home.features.1.title"),
      description: t("home.features.1.description"),
      gradient: "from-neon-blue to-neon-cyan"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: t("home.features.2.title"),
      description: t("home.features.2.description"),
      gradient: "from-emerald-400 to-teal-500"
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
      gradient: "from-neon-pink to-rose-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: t("home.features.6.title"),
      description: t("home.features.6.description"),
      gradient: "from-emerald-400 to-cyan-500"
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
    <div className="min-h-screen bg-neural-950 text-white overflow-hidden relative selection:bg-neon-violet/30 selection:text-white">
      <RegionHelmet region="GLOBAL" />
      <SeoBreadcrumbs items={[{ name: "Home", path: "/" }]} />

      {/* 1. Neural Particle Hero */}
      <Hero />

      {/* 2. Advanced Features Section */}
      <section className="py-16 md:py-24 relative z-10">
        <div className="container-main">

          <ScrollReveal>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tight">
                {t("home.capabilities.title")}
                <span className="block bg-gradient-to-r from-neon-blue via-neon-violet to-neon-pink bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
                  {t("home.capabilities.titleHighlight")}
                </span>
              </h2>
              <p className="text-xl text-neural-300 max-w-4xl mx-auto leading-relaxed">
                {t("home.capabilities.subtitle")}
              </p>
            </div>
          </ScrollReveal>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <ScrollReveal key={index} delay={index * 100} animation="fade-up">
                <div className="glass-panel-hover p-8 relative overflow-hidden group h-full">
                  {/* Hover Glow */}
                  <div className={`absolute -right-20 -top-20 w-64 h-64 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-20 blur-[80px] transition-opacity duration-700`} />

                  {/* Icon */}
                  <div className="relative mb-8 transform group-hover:scale-110 group-hover:-translate-y-1 transition-all duration-500 ease-quint">
                    <div className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${feature.gradient} shadow-lg ring-1 ring-white/20`}>
                      {feature.icon}
                    </div>
                  </div>

                  <h3 className="text-2xl font-bold mb-4 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>

                  <p className="text-neural-300 leading-relaxed group-hover:text-neural-100 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Partners Marquee (Lazy Loaded) */}
      <div className="border-y border-white/5 bg-neural-900/50 backdrop-blur-sm">
        <Suspense fallback={<div className="h-20" />}>
          <LogoMarquee />
        </Suspense>
      </div>

      {/* 2.5 Neural Genesis — Scroll Animation Cinematic Section */}
      {!isMobile && !prefersReducedMotion && (
        <section className="relative bg-neural-950 overflow-hidden">
          <Suspense fallback={<div className="h-screen bg-neural-950" />}>
            <ScrollSequence />
          </Suspense>
          {/* Overlay Text */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-20">
            <div className="text-center px-6">
              <h2 className="text-4xl md:text-6xl lg:text-7xl font-black text-white/80 tracking-tight drop-shadow-2xl">
                How AI <span className="bg-gradient-to-r from-neon-violet to-neon-cyan bg-clip-text text-transparent">Transforms</span>
              </h2>
              <p className="text-xl md:text-2xl text-neural-300 mt-4">Your Business Intelligence</p>
            </div>
          </div>
        </section>
      )}

      {/* Mobile fallback - static frame */}
      {(isMobile || prefersReducedMotion) && (
        <section className="relative py-24 bg-neural-950 overflow-hidden">
          <div className="absolute inset-0 opacity-40">
            <img
              src="/assets/lottie/scroll/scroll_0025.png"
              alt="Neural network visualization"
              className="w-full h-full object-cover"
              loading="lazy"
            />
          </div>
          <div className="relative z-10 text-center px-6">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              How AI <span className="bg-gradient-to-r from-neon-violet to-neon-cyan bg-clip-text text-transparent">Transforms</span>
            </h2>
            <p className="text-lg text-neural-300 mt-4">Your Business Intelligence</p>
          </div>
        </section>
      )}

      {/* 3. Neural Testimonials */}
      <section className="py-16 md:py-20 relative overflow-hidden">
        {/* Background Atmosphere */}
        <div className="absolute inset-0 bg-neural-900/50" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-neon-blue/5 blur-[120px] rounded-full" />

        <div className="container-main relative z-10">
          <ScrollReveal>
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">
                {t("home.testimonials.title")}
                <span className="block bg-gradient-to-r from-neon-violet to-neon-cyan bg-clip-text text-transparent">
                  {t("home.testimonials.titleHighlight")}
                </span>
              </h2>
            </div>
          </ScrollReveal>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <ScrollReveal key={index} delay={index * 150} animation="scale">
                <div className="glass-panel p-10 h-full relative group hover:border-white/20 transition-colors duration-500">
                  <div className="flex items-center gap-1 mb-6">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>

                  <p className="text-xl text-neural-100 mb-8 leading-relaxed font-light italic">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center text-2xl border border-white/10">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-bold text-white group-hover:text-neon-cyan transition-colors duration-300">
                        {testimonial.name}
                      </div>
                      <div className="text-sm text-neural-400">
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

      {/* 4. Ultimate CTA */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-neural-gradient opacity-90" />

        <div className="container-narrow relative text-center z-10">
          <ScrollReveal animation="fade-up-slow">
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-titulo">
              {t("home.cta.title")}
              <span className="block bg-gradient-to-r from-neon-violet via-neon-pink to-neon-blue bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
                {t("home.cta.titleHighlight")}
              </span>
            </h2>

            <p className="text-2xl text-neural-300 mb-12 leading-relaxed">
              {t("home.cta.subtitle")}
            </p>

            <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mb-12">
              <Button
                to={getRegionPath("/contact")}
                variant="primary"
                className="w-full sm:w-auto text-lg px-10 py-5"
                icon={<Rocket className="w-5 h-5" />}
              >
                {t("home.cta.primary")}
              </Button>

              <Button
                to={getRegionPath("/services")}
                variant="secondary"
                className="w-full sm:w-auto text-lg px-10 py-5"
                icon={<MousePointer2 className="w-5 h-5" />}
              >
                {t("home.cta.secondary")}
              </Button>
            </div>

            <div className="flex items-center justify-center gap-8 text-neural-400 text-sm font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-neon-cyan" />
                {t("home.cta.badge")}
              </div>
              <div className="hidden sm:flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-neon-violet" />
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