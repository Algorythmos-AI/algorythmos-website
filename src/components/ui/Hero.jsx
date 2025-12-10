import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronRight, Play } from 'lucide-react';
import { useI18n } from '../../app/i18n/I18nContext.jsx';
import Button from './Button.jsx';
import BackgroundVideo from './BackgroundVideo.jsx';
import ScrollRevealFX from '../microanimations/ScrollRevealFX.jsx';
import heroPoster from '../../assets/video/hero-poster.png';

/**
 * Global Consultancy Hero (Accenture Style)
 * - Massive Left-Aligned Typography
 * - Deep Atmospheric Background with Particles
 * - High-Contrast Actions
 */
const Hero = () => {
    const { t, getRegionPath } = useI18n();
    const canvasRef = useRef(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // Particle System (Tuned for subtlety)
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');

        // Canvas sizing
        const resize = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };
        window.addEventListener('resize', resize);
        resize();

        // Config
        const CONFIG = {
            particleCount: window.innerWidth < 768 ? 30 : 60,
            connectionDist: 180,
            mouseDist: 250,
            speed: 0.3, // Slower, more majestic
            color: '124, 58, 237' // neon-violet
        };

        let particles = [];
        let mouse = { x: 0, y: 0 };

        // Init
        for (let i = 0; i < CONFIG.particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * CONFIG.speed,
                vy: (Math.random() - 0.5) * CONFIG.speed,
                size: Math.random() * 2 + 0.5, // Smaller, finer particles
                alpha: Math.random() * 0.5 + 0.2
            });
        }

        // Animation Loop
        let animationId;
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            particles.forEach(p => {
                p.x += p.vx;
                p.y += p.vy;

                // Bounce
                if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
                if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

                // Mouse Interaction (Gentle push)
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < CONFIG.mouseDist) {
                    const force = (CONFIG.mouseDist - dist) / CONFIG.mouseDist;
                    p.x -= dx * force * 0.02;
                    p.y -= dy * force * 0.02;
                }

                // Draw Particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(${CONFIG.color}, ${p.alpha})`;
                ctx.fill();
            });

            // Draw Connections
            particles.forEach((p1, i) => {
                for (let j = i + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx = p1.x - p2.x;
                    const dy = p1.y - p2.y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < CONFIG.connectionDist) {
                        ctx.beginPath();
                        ctx.moveTo(p1.x, p1.y);
                        ctx.lineTo(p2.x, p2.y);
                        // Very subtle lines
                        ctx.strokeStyle = `rgba(${CONFIG.color}, ${0.1 * (1 - dist / CONFIG.connectionDist)})`;
                        ctx.stroke();
                    }
                }
            });

            animationId = requestAnimationFrame(animate);
        };

        const handleMouseMove = (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        };
        window.addEventListener('mousemove', handleMouseMove);

        animate();
        setIsLoaded(true);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', resize);
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    // Staggered text animation classes
    const fadeInUp = "animate-in slide-in-from-bottom-8 fade-in duration-700 ease-out fill-mode-backwards";

    return (
        <section className="relative min-h-screen flex items-center bg-neural-950 overflow-hidden">

            {/* 1. Background Layer */}
            <div className="absolute inset-0 z-0">
                {/* Video Background (New) */}
                <BackgroundVideo
                    posterSrc={heroPoster}
                    videoSrc="/assets/video/hero-loop.mp4" // Placeholder for when the user generates the video
                    opacity={0.5}
                    className="z-0"
                />

                {/* Canvas (Overlayed at reduced opacity or standard) */}
                <canvas
                    ref={canvasRef}
                    className={`absolute inset-0 transition-opacity duration-1000 z-10 ${isLoaded ? 'opacity-40' : 'opacity-0'}`}
                />

                {/* Gradient Video/Flares (Simulated with div) */}
                <div className="absolute top-[-20%] right-[-10%] w-[70vw] h-[70vw] bg-neon-violet/10 rounded-full blur-[150px] animate-pulse-slow z-20" />
                <div className="absolute bottom-[-10%] left-[-10%] w-[50vw] h-[50vw] bg-neon-blue/5 rounded-full blur-[150px] z-20" />

                {/* Micro-Animation: Scroll/Particle Reveal */}
                <ScrollRevealFX className="absolute inset-0 z-20 opacity-60 pointer-events-none mix-blend-screen" />

                {/* Contrast Mesh Overlay (Ensures text readablity) */}
                <div className="absolute inset-0 bg-gradient-to-r from-neural-950 via-neural-950/80 to-transparent z-30" />
                <div className="absolute inset-0 bg-black/20 z-30" /> {/* General dim */}
            </div>

            {/* 2. Content Layer */}
            <div className="relative z-10 container mx-auto px-6 lg:px-12 pt-20">
                <div className="max-w-4xl">

                    {/* Eyebrow Label */}
                    <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm mb-8 ${fadeInUp}`}
                        style={{ animationDelay: '100ms' }}
                    >
                        <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-pulse" />
                        <span className="text-xs font-semibold tracking-widest uppercase text-neural-300">
                            Global AI Consultancy
                        </span>
                    </div>

                    {/* Main Headline */}
                    <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white tracking-tighter leading-[1.05] mb-8">
                        <span
                            className={`block ${fadeInUp}`}
                            style={{ animationDelay: '200ms' }}
                        >
                            Reinventing Business
                        </span>
                        <span
                            className={`block bg-gradient-to-r from-white via-neural-100 to-neural-400 bg-clip-text text-transparent ${fadeInUp}`}
                            style={{ animationDelay: '350ms' }}
                        >
                            at the Speed of <span className="text-neon-violet">AI.</span>
                        </span>
                    </h1>

                    {/* Subheadline */}
                    <p
                        className={`text-lg sm:text-xl md:text-2xl text-neural-300 font-light leading-relaxed max-w-2xl mb-12 ${fadeInUp}`}
                        style={{ animationDelay: '500ms' }}
                    >
                        We build the intelligent algorithms that power the world’s most adaptable enterprises.
                    </p>

                    {/* CTAs */}
                    <div
                        className={`flex flex-col sm:flex-row gap-5 ${fadeInUp}`}
                        style={{ animationDelay: '650ms' }}
                    >
                        {/* Primary: Brand Gradient */}
                        <Button
                            to={getRegionPath("/contact")}
                            variant="primary"
                            className="w-full sm:w-auto text-base font-bold h-auto"
                        >
                            Start Your Transformation
                        </Button>

                        {/* Secondary: Outline Gradient */}
                        <Button
                            to={getRegionPath("/services")}
                            variant="secondary"
                            className="w-full sm:w-auto text-base font-semibold h-auto flex items-center gap-2"
                        >
                            Explore Capabilities <ChevronRight className="w-4 h-4" />
                        </Button>
                    </div>

                </div>
            </div>

            {/* 3. Scroll Indicator (Minimalist) */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/30 animate-bounce delay-1000 duration-[2s]">
                <div className="w-[1px] h-16 bg-gradient-to-b from-transparent via-white/50 to-transparent" />
            </div>

        </section>
    );
};

export default Hero;
