import React, { useState, useCallback, useEffect, useRef } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import { Link } from 'react-router-dom';
import { Bot, FileText, BarChart3, ServerCog, ChevronLeft, ChevronRight } from 'lucide-react';
import { useI18n } from '../../app/i18n/I18nContext';

// Static service metadata (icons, links, gradients)
const SERVICE_META = [
  { id: 'agents', icon: Bot, ctaLink: '/services#agents', gradient: 'from-violet-600 to-indigo-600' },
  { id: 'docs', icon: FileText, ctaLink: '/services#docs', gradient: 'from-blue-600 to-cyan-600' },
  { id: 'dashboards', icon: BarChart3, ctaLink: '/services#dashboards', gradient: 'from-emerald-600 to-teal-600' },
  { id: 'mlops', icon: ServerCog, ctaLink: '/services#mlops', gradient: 'from-orange-600 to-red-600' },
];

const ServicesShowcase = ({ 
  autoplay = true, 
  intervalMs = 6000 
}) => {
  const { t } = useI18n();
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'start',
    skipSnaps: false,
    dragFree: false
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const progressBarRef = useRef(null);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPrefersReducedMotion(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
    }
  }, []);

  // Build services array with translated text
  const services = SERVICE_META.map((meta, index) => ({
    ...meta,
    title: t(`ui.servicesShowcase.services.${index}.title`),
    bullets: [
      t(`ui.servicesShowcase.services.${index}.bullets.0`),
      t(`ui.servicesShowcase.services.${index}.bullets.1`),
      t(`ui.servicesShowcase.services.${index}.bullets.2`),
    ],
    metric: t(`ui.servicesShowcase.services.${index}.metric`),
    cta: t(`ui.servicesShowcase.services.${index}.cta`),
  }));

  const scrollPrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev();
  }, [emblaApi]);

  const scrollNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext();
  }, [emblaApi]);

  const scrollTo = useCallback((index) => {
    if (emblaApi) emblaApi.scrollTo(index);
  }, [emblaApi]);

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
    if (progressBarRef.current) {
      progressBarRef.current.style.width = '0%';
    }
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    return () => emblaApi.off('select', onSelect);
  }, [emblaApi, onSelect]);

  // Auto-play logic
  useEffect(() => {
    if (!autoplay || prefersReducedMotion || !isPlaying) return;

    const interval = setInterval(() => {
      scrollNext();
    }, intervalMs);

    return () => clearInterval(interval);
  }, [autoplay, prefersReducedMotion, isPlaying, intervalMs, scrollNext]);

  // Progress bar animation
  useEffect(() => {
    if (!autoplay || prefersReducedMotion || !isPlaying) return;

    const duration = intervalMs / 1000;
    const startTime = Date.now();

    const animateProgress = () => {
      const elapsed = (Date.now() - startTime) / 1000;
      const newProgress = Math.min((elapsed / duration) * 100, 100);
      
      if (progressBarRef.current) {
        progressBarRef.current.style.width = `${newProgress}%`;
      }

      if (newProgress < 100) {
        requestAnimationFrame(animateProgress);
      }
    };

    const animationId = requestAnimationFrame(animateProgress);
    return () => cancelAnimationFrame(animationId);
  }, [selectedIndex, autoplay, prefersReducedMotion, isPlaying, intervalMs]);

  const handleMouseEnter = () => {
    if (autoplay && !prefersReducedMotion) {
      setIsPlaying(false);
    }
  };

  const handleMouseLeave = () => {
    if (autoplay && !prefersReducedMotion) {
      setIsPlaying(true);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault();
      scrollPrev();
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      scrollNext();
    }
  };

  return (
    <div 
      className="w-full"
      data-analytics="hero-services"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onKeyDown={handleKeyDown}
      role="region"
      aria-roledescription="carousel"
      aria-label={t("ui.aria.coreServices")}
    >
      <style>{`
        @keyframes glowPulse {
          0%, 100% { transform: scale(1); opacity: 0.6; }
          50% { transform: scale(1.05); opacity: 0.8; }
        }
        @keyframes iconBounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-8px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
      {/* Carousel Container */}
      <div className="embla overflow-hidden" ref={emblaRef}>
        <div className="embla__container flex">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div 
                key={service.id}
                className="embla__slide flex-[0_0_100%] min-w-0"
                aria-label={`${service.title} - ${index + 1} of ${services.length}`}
              >
                <div
                  className="relative p-6 sm:p-8"
                  style={{ animation: prefersReducedMotion ? 'none' : 'fadeUp 0.6s ease-out forwards' }}
                >
                  {/* Animated Gradient Glow */}
                  <div
                    className={`absolute -inset-6 rounded-[24px] blur-2xl opacity-60 bg-gradient-to-br ${service.gradient}`}
                    style={{ 
                      mixBlendMode: 'screen',
                      animation: prefersReducedMotion ? 'none' : 'glowPulse 4s ease-in-out infinite'
                    }}
                  />

                  {/* Glassmorphic Card */}
                  <div className="relative rounded-3xl bg-slate-900/50 ring-1 ring-white/10 backdrop-blur-xl p-6 sm:p-8 border border-white/5">
                    {/* Icon */}
                    <div
                      className={`inline-flex p-4 bg-gradient-to-br ${service.gradient} rounded-2xl mb-6`}
                      style={{ animation: prefersReducedMotion ? 'none' : 'iconBounce 3s ease-in-out infinite' }}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </div>

                    {/* Title */}
                    <h3
                      className="text-2xl sm:text-3xl font-bold text-white mb-4"
                      style={{ animation: prefersReducedMotion ? 'none' : 'slideInLeft 0.5s ease-out 0.2s forwards', opacity: prefersReducedMotion ? 1 : 0 }}
                    >
                      {service.title}
                    </h3>

                    {/* Bullets */}
                    <ul
                      className="space-y-2 mb-6"
                      style={{ animation: prefersReducedMotion ? 'none' : 'fadeIn 0.5s ease-out 0.3s forwards', opacity: prefersReducedMotion ? 1 : 0 }}
                    >
                      {service.bullets.map((bullet, idx) => (
                        <li
                          key={idx}
                          className="flex items-center text-gray-300 text-sm sm:text-base"
                          style={{ 
                            animation: prefersReducedMotion ? 'none' : 'slideInLeft 0.4s ease-out forwards',
                            animationDelay: prefersReducedMotion ? '0s' : `${0.4 + idx * 0.1}s`,
                            opacity: prefersReducedMotion ? 1 : 0
                          }}
                        >
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient} mr-3`} />
                          {bullet}
                        </li>
                      ))}
                    </ul>

                    {/* Metric */}
                    <div
                      className={`inline-block px-4 py-2 bg-gradient-to-r ${service.gradient} rounded-xl text-white font-semibold text-sm sm:text-base mb-6`}
                      style={{ animation: prefersReducedMotion ? 'none' : 'scaleIn 0.5s ease-out 0.6s forwards', opacity: prefersReducedMotion ? 1 : 0 }}
                    >
                      {service.metric}
                    </div>

                    {/* CTA Button */}
                    <div
                      style={{ animation: prefersReducedMotion ? 'none' : 'fadeUp 0.5s ease-out 0.7s forwards', opacity: prefersReducedMotion ? 1 : 0 }}
                    >
                      <Link
                        to={service.ctaLink}
                        className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${service.gradient} hover:scale-105 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl`}
                      >
                        {service.cta}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="flex items-center justify-between mt-6">
        {/* Previous/Next Buttons */}
        <div className="flex gap-2">
          <button
            onClick={scrollPrev}
            className="p-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300"
            aria-label={t("ui.aria.previousService")}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            className="p-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300"
            aria-label={t("ui.aria.nextService")}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Pagination Dots */}
        <div className="flex gap-2">
          {services.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === selectedIndex 
                  ? 'bg-white scale-125' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
              aria-label={t("ui.aria.goToSlide", { number: index + 1 })}
              aria-pressed={index === selectedIndex}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      {autoplay && !prefersReducedMotion && (
        <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
          <div
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-violet-600 to-indigo-600"
            style={{ width: '0%', transition: 'width 0.1s linear' }}
          />
        </div>
      )}
    </div>
  );
};

export default ServicesShowcase;
