import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ChevronDown, Menu, X, ArrowRight, Star, Users, Zap, Shield, CheckCircle, Play, MousePointer2, Sparkles, Globe, Rocket, Brain, Eye } from 'lucide-react';
import PartnersCarousel from './PartnersCarousel.jsx';
import HeroIllustration from './HeroIllustration.jsx';
import ServicesShowcase from './ServicesShowcase.jsx'; // Added import for ServicesShowcase

const AdvancedBusinessWebsite = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [scrollY, setScrollY] = useState(0);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isLoaded, setIsLoaded] = useState(false);
  const [particles, setParticles] = useState([]);
  const canvasRef = useRef(null);
  const heroRef = useRef(null);

  // Initialize particles
  useEffect(() => {
    const particleCount = 50;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 1200),
      y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800),
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: Math.random() * 3 + 1,
      opacity: Math.random() * 0.5 + 0.2,
    }));
    setParticles(newParticles);
    setIsLoaded(true);
  }, []);

  // Mouse tracking
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Scroll tracking with smooth updates
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setScrollY(window.scrollY);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || typeof window === 'undefined') return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const animateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      setParticles(prevParticles => 
        prevParticles.map(particle => {
          // Update position
          particle.x += particle.vx;
          particle.y += particle.vy;

          // Bounce off edges
          if (particle.x <= 0 || particle.x >= canvas.width) particle.vx *= -1;
          if (particle.y <= 0 || particle.y >= canvas.height) particle.vy *= -1;

          // Mouse interaction
          const dx = mousePosition.x - particle.x;
          const dy = mousePosition.y - particle.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          
          if (distance < 100) {
            particle.x -= dx * 0.01;
            particle.y -= dy * 0.01;
          }

          // Draw particle
          ctx.beginPath();
          ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
          ctx.fill();

          // Connect nearby particles
          prevParticles.forEach(otherParticle => {
            if (otherParticle.id !== particle.id) {
              const dx2 = particle.x - otherParticle.x;
              const dy2 = particle.y - otherParticle.y;
              const distance2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);
              
              if (distance2 < 100) {
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.strokeStyle = `rgba(59, 130, 246, ${0.1 * (1 - distance2 / 100)})`;
                ctx.stroke();
              }
            }
          });

          return particle;
        })
      );

      requestAnimationFrame(animateParticles);
    };

    animateParticles();
  }, [mousePosition]);

  // Parallax calculation
  const parallaxOffset = scrollY * 0.5;
  const parallaxOffset2 = scrollY * 0.3;

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "Agentic Automation 🤖",
      description: "Deploy AI agents that handle repetitive workflows, integrate APIs, and streamline operations to increase productivity.",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: <Rocket className="w-8 h-8" />,
      title: "Document Intelligence 📄",
      description: "Extract insights from contracts, invoices, and business documents with next-gen OCR (Optical Character Recognition) and NLP (Natural Language Processing).",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "SQL-Based Dashboards 📊",
      description: "Transform raw data into clear, actionable dashboards so leaders can make faster, smarter decisions.",
      gradient: "from-green-500 to-teal-500"
    },
    {
      icon: <Globe className="w-8 h-8" />,
      title: "MLOps Platform Engineering ⚙️",
      description: "Productionize AI with CI/CD (Continuous Integration/Continuous Delivery) on Kubernetes and Docker, automated evaluations, observability, and safe rollbacks—with governance and DevSecOps (Development, Security & Operations) baked in.",
      gradient: "from-orange-500 to-red-500"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "AI Security & Compliance 🔐",
      description: "Ensure your AI systems are safe, compliant, and trustworthy with AppSec, OWASP Top 10 for LLMs, and LLMSecOps integration.",
      gradient: "from-indigo-500 to-purple-500"
    },
    {
      icon: <Sparkles className="w-8 h-8" />,
      title: "AI Strategy & Roadmapping 🚀",
      description: "From prototypes to enterprise rollouts, we guide you with a clear AI roadmap aligned with measurable ROI and long-term goals.",
      gradient: "from-pink-500 to-rose-500"
    }
  ];

  const testimonials = [
    {
      name: "Dr. Sarah Chen",
      role: "Chief Data Officer – Financial Services",
      content: "Algorythmos helped us automate reporting and streamline compliance. What used to take days is now done in minutes, with complete accuracy.",
      rating: 5,
      avatar: "🧬"
    },
    {
      name: "Marcus Rodriguez",
      role: "Head of Operations – Manufacturing Group",
      content: "Their Document Intelligence solution transformed how we process contracts and invoices. We reduced manual effort by over 40% while improving data quality.",
      rating: 5,
      avatar: "🚀"
    },
    {
      name: "Dr. Emma Nakamura",
      role: "CTO – Healthcare Startup",
      content: "Thanks to Algorythmos, we deployed AI models into production securely with MLOps and CI/CD pipelines. Downtime dropped, and our time-to-market was cut in half",
      rating: 5,
      avatar: "⚡"
    }
  ];

  const stats = [
    { number: "∞", label: "Scalability", suffix: "" },
    { number: "99.999%", label: "Uptime", suffix: "" },
    { number: "100+", label: "Integrations", suffix: "" },
    { number: "<1ms", label: "Response Time", suffix: "" }
  ];

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Animated Particle Canvas */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
        style={{ opacity: isLoaded ? 1 : 0 }}
      />

      {/* Floating Cursor Effect */}
      <div
        className="fixed w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full pointer-events-none z-50 mix-blend-difference transition-transform duration-100"
        style={{
          left: mousePosition.x - 12,
          top: mousePosition.y - 12,
          transform: `scale(${mousePosition.x > 0 ? 1 : 0})`,
        }}
      />

      {/* Global Navbar is rendered by App.jsx */}

      {/* Revolutionary Hero Section */}
      <section 
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 md:pt-0"
      >
        {/* Dynamic Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-purple-900/20 to-black" />
          
          {/* Animated Orbs */}
          <div 
            className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full filter blur-3xl opacity-70 animate-pulse"
            style={{
              background: 'linear-gradient(45deg, #3B82F6, #8B5CF6)',
              transform: `translate(${parallaxOffset}px, ${parallaxOffset * 0.3}px) scale(${1 + scrollY * 0.001})`
            }}
          />
          <div 
            className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full filter blur-3xl opacity-70 animate-pulse"
            style={{
              background: 'linear-gradient(45deg, #EC4899, #F59E0B)',
              transform: `translate(${-parallaxOffset * 0.7}px, ${-parallaxOffset * 0.5}px) scale(${1 + scrollY * 0.001})`,
              animationDelay: '2s'
            }}
          />

          {/* Floating Geometric Shapes */}
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-spin"
              style={{
                left: `${20 + i * 15}%`,
                top: `${20 + i * 10}%`,
                animationDuration: `${10 + i * 2}s`,
                animationDelay: `${i * 0.5}s`,
                transform: `translate(${parallaxOffset * (0.1 * i)}px, ${parallaxOffset * (0.05 * i)}px)`
              }}
            >
              <div className={`w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-400 ${
                i % 2 === 0 ? 'rotate-45' : 'rounded-full'
              } opacity-20`} />
            </div>
          ))}
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className={`grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 items-center ${isLoaded ? 'opacity-100' : 'opacity-0 translate-y-6'} transition-all duration-700`}>
            {/* Left: Copy */}
            <div className="text-center md:text-left">
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-black leading-tight mb-6">
                <span className="block">Unlock the Real Value</span>
                <span className="block bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Of Your Data</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-300 leading-relaxed mb-8 max-w-xl mx-auto md:mx-0">
                AI consultancy for enterprises and SMEs across France and Australia. Algorythmos delivers secure, production-ready AI solutions—from automation and MLOps to document intelligence—with measurable ROI and strategic guidance from Sydney to Suresnes.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
                <Link to="/contact" className="group relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:scale-105 hover:shadow-lg transition w-full sm:w-auto">
                  <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                  <span className="relative flex items-center justify-center">Start Your AI Journey <ArrowRight className="ml-3 w-5 h-5" /></span>
                </Link>
                <Link to="/services" className="relative inline-flex items-center justify-center px-6 sm:px-8 py-3 sm:py-4 rounded-2xl font-semibold text-base sm:text-lg border-2 border-gray-600 hover:border-white hover:scale-105 hover:shadow-lg transition backdrop-blur-sm w-full sm:w-auto">
                  <span className="relative flex items-center justify-center"><Play className="mr-3 w-5 h-5" />Explore Our Services</span>
                </Link>
              </div>

              {/* Services Showcase - Mobile */}
              <div className="mt-12 md:hidden">
                <ServicesShowcase />
              </div>
            </div>

            {/* Right: Services Showcase (desktop) */}
            <div className="hidden md:block">
              <ServicesShowcase />
            </div>
          </div>

          {/* Metrics Grid */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-5xl mx-auto">
            {stats.map((stat, index) => (
              <div
                key={index}
                className="w-full h-24 md:h-32 mx-auto rounded-2xl border border-white/10 backdrop-blur-sm bg-gradient-to-br from-gray-900/40 to-black/40 hover:border-white/30 hover:from-blue-600/10 hover:to-purple-600/10 transform hover:scale-105 transition duration-300 cursor-pointer flex flex-col items-center justify-center shadow-lg"
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-1">
                  {stat.number}{stat.suffix}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          {/* Partners Carousel */}
          <PartnersCarousel />
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-gray-400 animate-bounce">
          <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 9l6 6 6-6" />
          </svg>
        </div>
      </section>

      {/* Advanced Features Section */}
      <section className="py-32 relative">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-5xl md:text-7xl font-black mb-8">
              Our
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Capabilities
              </span>
            </h2>
            <p className="text-2xl text-gray-300 max-w-4xl mx-auto leading-relaxed">
              Comprehensive AI solutions for businesses in France and Australia—reducing costs, saving time, and delivering measurable impact. 
              From agentic automation to secure MLOps, we provide the strategic foundation for smarter, safer, and faster AI-driven decisions.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group relative p-8 bg-gradient-to-br from-gray-900/50 to-black/50 rounded-3xl border border-gray-800/50 hover:border-white/20 transition-all duration-700 transform hover:scale-105 hover:-translate-y-4 backdrop-blur-sm overflow-hidden"
                style={{ 
                  transitionDelay: `${index * 100}ms`,
                  animation: `fadeInUp 0.8s ease-out ${index * 0.1}s both`
                }}
              >
                {/* Animated Background Gradient */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />
                
                {/* Floating Icon */}
                <div className="relative mb-6 transform group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                  <div className={`inline-flex p-4 bg-gradient-to-br ${feature.gradient} rounded-2xl shadow-2xl`}>
                    {feature.icon}
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} rounded-2xl blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-500`} />
                </div>

                <h3 className="text-2xl font-bold mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-500">
                  {feature.title}
                </h3>
                
                <p className="text-gray-300 leading-relaxed group-hover:text-white transition-colors duration-500">
                  {feature.description}
                </p>

                {/* Hover Effect Particles */}
                <div className="absolute -top-2 -right-2 w-4 h-4 bg-blue-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" />
                <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 group-hover:animate-ping" style={{ animationDelay: '0.5s' }} />
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Revolutionary Testimonials */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-blue-900/10 via-purple-900/5 to-black" />
        
        <div className="max-w-7xl mx-auto px-6 lg:px-8 relative">
          <div className="text-center mb-20 animate-fade-in-up">
            <h2 className="text-5xl md:text-7xl font-black mb-8">
              What Our
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Clients Say
              </span>
            </h2>
            <p className="text-2xl text-gray-300 max-w-3xl mx-auto">
              Trusted by forward-thinking leaders who turned AI into measurable business results.

            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="group relative p-8 bg-gradient-to-br from-gray-900/80 to-black/80 rounded-3xl border border-gray-800/50 hover:border-white/20 transition-all duration-700 transform hover:scale-105 hover:-translate-y-6 backdrop-blur-xl overflow-hidden"
                style={{ 
                  transitionDelay: `${index * 200}ms`,
                  animation: `fadeInUp 0.8s ease-out ${index * 0.2}s both`
                }}
              >
                {/* Animated Border */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 opacity-0 group-hover:opacity-100 transition-opacity duration-700" style={{ padding: '2px' }}>
                  <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black rounded-3xl" />
                </div>

                <div className="relative z-10">
                  {/* Avatar and Rating */}
                  <div className="flex items-center mb-6">
                    <div className="text-4xl mr-4 transform group-hover:scale-110 transition-transform duration-500">
                      {testimonial.avatar}
                    </div>
                    <div className="flex">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star 
                          key={i} 
                          className="w-6 h-6 text-yellow-400 fill-current transform group-hover:scale-110 transition-transform duration-300" 
                          style={{ transitionDelay: `${i * 100}ms` }}
                        />
                      ))}
                    </div>
                  </div>

                  <p className="text-gray-200 mb-8 text-lg italic leading-relaxed group-hover:text-white transition-colors duration-500">
                    "{testimonial.content}"
                  </p>
                  
                  <div>
                    <div className="font-bold text-xl bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent group-hover:from-purple-400 group-hover:to-pink-400 transition-all duration-500">
                      {testimonial.name}
                    </div>
                    <div className="text-gray-400 group-hover:text-gray-300 transition-colors duration-500">
                      {testimonial.role}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ultimate CTA Section */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 via-purple-600/20 to-pink-600/20" />
          <div className="absolute top-0 left-0 w-full h-full opacity-50" style={{
            backgroundImage: "radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 1px, transparent 1px)",
            backgroundSize: "30px 30px"
          }} />
        </div>

        <div className="relative max-w-5xl mx-auto text-center px-6 lg:px-8">
          <div className="animate-fade-in-up">
            <h2 className="text-6xl md:text-8xl font-black mb-8 leading-tight">
              Ready to Start
              <span className="block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Your AI Journey?
              </span>
            </h2>
            
            <p className="text-2xl text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Unlock secure, ROI-driven AI solutions that reduce costs, save time, and empower smarter decisions.
              <span className="block mt-2 text-blue-400">Move beyond experimentation.</span>
            </p>
            
            <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
              <Link to="/contact" className="group relative px-12 py-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl font-bold text-2xl overflow-hidden transform hover:scale-105 transition-all duration-500">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                <div className="relative flex items-center justify-center">
                  Begin Evolution
                  <Rocket className="ml-3 w-7 h-7 group-hover:translate-x-2 group-hover:-translate-y-1 transition-transform duration-300" />
                </div>
                <div className="absolute -inset-2 rounded-2xl bg-gradient-to-r from-blue-600 to-purple-600 blur-2xl opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
              </Link>
              
              <Link to="/services" className="group relative px-12 py-6 border-2 border-gray-600 rounded-2xl font-bold text-2xl hover:border-white transition-all duration-500 backdrop-blur-sm overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/20 to-purple-600/20 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-700 origin-left" />
                <div className="relative flex items-center justify-center">
                  <MousePointer2 className="mr-3 w-7 h-7 group-hover:rotate-12 transition-transform duration-300" />
                  Interactive Tour
                </div>
              </Link>
            </div>

            <div className="flex items-center justify-center text-gray-400 space-x-8">
              <div className="flex items-center">
                <CheckCircle className="w-6 h-6 mr-3 text-green-400 animate-pulse" />
                Secure & Compliant (GDPR + EU AI Act) • Rapid Prototyping to Scalable Rollouts
              </div>
              <div className="hidden sm:flex items-center">
                <Sparkles className="w-6 h-6 mr-3 text-purple-400 animate-spin" />
                AI-powered Automation
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Global Footer is rendered by App.jsx */}

      {/* Advanced CSS Animations */}
      <style>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes slideInRight {
          from {
            opacity: 0;
            transform: translateX(50px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        
        @keyframes glow {
          0%, 100% {
            box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
          }
          50% {
            box-shadow: 0 0 40px rgba(147, 51, 234, 0.5);
          }
        }
        
        .animate-fade-in-up {
          animation: fadeInUp 1s ease-out;
        }
        
        .animate-slide-in-left {
          animation: slideInLeft 1s ease-out;
        }
        
        .animate-slide-in-right {
          animation: slideInRight 1s ease-out 0.3s both;
        }
        
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
        
        .animate-glow {
          animation: glow 3s ease-in-out infinite;
        }
        
        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.1);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(180deg, #3B82F6, #8B5CF6);
          border-radius: 4px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(180deg, #8B5CF6, #EC4899);
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Glass morphism effect */
        .glass {
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        /* Enhanced gradient text animation */
        .gradient-text-animated {
          background: linear-gradient(-45deg, #3B82F6, #8B5CF6, #EC4899, #F59E0B);
          background-size: 400% 400%;
          background-clip: text;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: gradientShift 4s ease infinite;
        }
        
        @keyframes gradientShift {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }
        
        /* Particle trail effect */
        .particle-trail {
          position: absolute;
          width: 4px;
          height: 4px;
          background: radial-gradient(circle, rgba(59, 130, 246, 0.8), transparent);
          border-radius: 50%;
          pointer-events: none;
          animation: particleFloat 3s linear infinite;
        }
        
        @keyframes particleFloat {
          0% {
            transform: translateY(0) scale(1);
            opacity: 1;
          }
          100% {
            transform: translateY(-100px) scale(0);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
};

export default AdvancedBusinessWebsite;