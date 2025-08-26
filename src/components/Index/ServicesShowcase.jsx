import React, { useState, useCallback, useEffect } from 'react';
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion';
import useEmblaCarousel from 'embla-carousel-react';
import { Link } from 'react-router-dom';
import { Bot, FileText, BarChart3, ServerCog, ChevronLeft, ChevronRight } from 'lucide-react';

const ServicesShowcase = ({ 
  autoplay = true, 
  intervalMs = 6000 
}) => {
  const [emblaRef, emblaApi] = useEmblaCarousel({ 
    loop: true, 
    align: 'start',
    skipSnaps: false,
    dragFree: false
  });
  
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(autoplay);
  const prefersReducedMotion = useReducedMotion();

  const services = [
    {
      id: 'agents',
      title: 'Agentic Automation',
      icon: Bot,
      bullets: ['API integrations', 'Orchestrated workflows', 'Human-in-the-loop'],
      metric: '↑ 20–40% team productivity',
      cta: 'See Agent Automations',
      ctaLink: '/services#agents',
      gradient: 'from-violet-600 to-indigo-600'
    },
    {
      id: 'docs',
      title: 'Document Intelligence',
      icon: FileText,
      bullets: ['OCR + NLP', 'Contracts & invoices', 'Entity extraction'],
      metric: '↓ 80% manual effort',
      cta: 'Explore Doc Intelligence',
      ctaLink: '/services#docs',
      gradient: 'from-blue-600 to-cyan-600'
    },
    {
      id: 'dashboards',
      title: 'SQL-based Dashboards',
      icon: BarChart3,
      bullets: ['Single source of truth', 'Governed metrics', 'Self-serve'],
      metric: '→ Decisions in minutes',
      cta: 'View Dashboards',
      ctaLink: '/services#dashboards',
      gradient: 'from-emerald-600 to-teal-600'
    },
    {
      id: 'mlops',
      title: 'MLOps & CI/CD',
      icon: ServerCog,
      bullets: ['Docker & K8s', 'GitHub Actions', 'Model registry'],
      metric: '½ deployment errors',
      cta: 'Ship Models Faster',
      ctaLink: '/services#mlops',
      gradient: 'from-orange-600 to-red-600'
    }
  ];

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
    setProgress(0);
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
      setProgress(newProgress);

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
      aria-label="Our core services"
    >
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
                <motion.div
                  className="relative p-6 sm:p-8"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, ease: "easeOut" }}
                >
                  {/* Animated Gradient Glow */}
                  <motion.div
                    className={`absolute -inset-6 rounded-[24px] blur-2xl opacity-60 bg-gradient-to-br ${service.gradient}`}
                    animate={{ 
                      scale: [1, 1.05, 1],
                      opacity: [0.6, 0.8, 0.6]
                    }}
                    transition={{ 
                      duration: 4, 
                      repeat: Infinity, 
                      ease: "easeInOut" 
                    }}
                    style={{ mixBlendMode: 'screen' }}
                  />

                  {/* Glassmorphic Card */}
                  <div className="relative rounded-3xl bg-slate-900/50 ring-1 ring-white/10 backdrop-blur-xl p-6 sm:p-8 border border-white/5">
                    {/* Icon */}
                    <motion.div
                      className={`inline-flex p-4 bg-gradient-to-br ${service.gradient} rounded-2xl mb-6`}
                      animate={prefersReducedMotion ? {} : { 
                        y: [0, -8, 0] 
                      }}
                      transition={{ 
                        duration: 3, 
                        repeat: Infinity, 
                        ease: "easeInOut" 
                      }}
                    >
                      <Icon className="h-8 w-8 text-white" />
                    </motion.div>

                    {/* Title */}
                    <motion.h3
                      className="text-2xl sm:text-3xl font-bold text-white mb-4"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2, duration: 0.5 }}
                    >
                      {service.title}
                    </motion.h3>

                    {/* Bullets */}
                    <motion.ul
                      className="space-y-2 mb-6"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.3, duration: 0.5 }}
                    >
                      {service.bullets.map((bullet, idx) => (
                        <motion.li
                          key={idx}
                          className="flex items-center text-gray-300 text-sm sm:text-base"
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.4 + idx * 0.1, duration: 0.4 }}
                        >
                          <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${service.gradient} mr-3`} />
                          {bullet}
                        </motion.li>
                      ))}
                    </motion.ul>

                    {/* Metric */}
                    <motion.div
                      className={`inline-block px-4 py-2 bg-gradient-to-r ${service.gradient} rounded-xl text-white font-semibold text-sm sm:text-base mb-6`}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      {service.metric}
                    </motion.div>

                    {/* CTA Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.7, duration: 0.5 }}
                    >
                      <Link
                        to={service.ctaLink}
                        className={`inline-flex items-center px-6 py-3 bg-gradient-to-r ${service.gradient} hover:scale-105 rounded-xl text-white font-semibold transition-all duration-300 shadow-lg hover:shadow-xl`}
                      >
                        {service.cta}
                        <ChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </motion.div>
                  </div>
                </motion.div>
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
            aria-label="Previous service"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={scrollNext}
            className="p-2 rounded-xl border border-white/20 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white transition-all duration-300"
            aria-label="Next service"
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
              aria-label={`Go to slide ${index + 1}`}
              aria-pressed={index === selectedIndex}
            />
          ))}
        </div>
      </div>

      {/* Progress Bar */}
      {autoplay && !prefersReducedMotion && (
        <div className="mt-4 h-1 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-violet-600 to-indigo-600"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1, ease: "linear" }}
          />
        </div>
      )}
    </div>
  );
};

export default ServicesShowcase;
