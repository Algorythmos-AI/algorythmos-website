/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx,md,mdx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    /* Full list, in ascending order, so `nav` sits between lg and xl in the
       generated CSS. Adding it via `extend` would append it after 2xl and break
       the cascade. `nav` is where the desktop header fits in both locales. */
    screens: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      nav: '1120px',
      xl: '1280px',
      '2xl': '1536px',
    },
    extend: {
      // ── Semantic, theme-aware tokens (light + dark via CSS vars) ──
      colors: {
        bg: 'rgb(var(--bg) / <alpha-value>)',
        surface: {
          DEFAULT: 'rgb(var(--surface-1) / <alpha-value>)',
          1: 'rgb(var(--surface-1) / <alpha-value>)',
          2: 'rgb(var(--surface-2) / <alpha-value>)',
          3: 'rgb(var(--surface-3) / <alpha-value>)',
        },
        ink: {
          DEFAULT: 'rgb(var(--text) / <alpha-value>)',
          muted: 'rgb(var(--text-muted) / <alpha-value>)',
          subtle: 'rgb(var(--text-subtle) / <alpha-value>)',
        },
        brand: {
          DEFAULT: 'rgb(var(--brand) / <alpha-value>)',
          strong: 'rgb(var(--brand-strong) / <alpha-value>)',
          fg: 'rgb(var(--on-brand) / <alpha-value>)',
        },
        accent: 'rgb(var(--accent) / <alpha-value>)',
        line: {
          DEFAULT: 'rgb(var(--border) / <alpha-value>)',
          strong: 'rgb(var(--border-strong) / <alpha-value>)',
          /* ≥3:1 against bg — required for form-control boundaries (WCAG 1.4.11) */
          input: 'rgb(var(--border-input) / <alpha-value>)',
        },
        ring: 'rgb(var(--ring) / <alpha-value>)',
        success: 'rgb(var(--success) / <alpha-value>)',
        warning: 'rgb(var(--warning) / <alpha-value>)',
        danger: 'rgb(var(--danger) / <alpha-value>)',

        // ── Legacy palette (kept for harvested islands during transition) ──
        algviolet: '#6D00FF',
        algpurple: '#7658E7',
        algblue: '#3715E0',
        algbg: '#050505',
        neural: {
          950: '#020204', 900: '#0A0A0F', 800: '#13131F', 700: '#1C1C2E',
          600: '#2A2A45', 500: '#40405A', 400: '#6E6E85', 300: '#A0A0B0',
          100: '#E0E0E6', 50: '#F5F5F7',
        },
        neon: { violet: '#8B5CF6', cyan: '#06B6D4', pink: '#EC4899', blue: '#3B82F6' },
      },
      fontFamily: {
        sans: ['Inter Variable', 'Inter Fallback', 'ui-sans-serif', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif'],
        mono: ['ui-monospace', 'SF Mono', 'Menlo', 'monospace'],
      },
      // Fluid display scale (adds text-display/h1/h2/h3/lead; numeric scale untouched)
      fontSize: {
        mega: ['clamp(2.75rem, 1.1rem + 7.2vw, 6.5rem)', { lineHeight: '0.98', letterSpacing: '-0.03em' }],
        display: ['clamp(2.5rem, 1.4rem + 4.6vw, 4.75rem)', { lineHeight: '1.04', letterSpacing: '-0.025em' }],
        h1: ['clamp(2rem, 1.4rem + 2.6vw, 3.25rem)', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        h2: ['clamp(1.5rem, 1.2rem + 1.4vw, 2.25rem)', { lineHeight: '1.16', letterSpacing: '-0.015em' }],
        h3: ['clamp(1.25rem, 1.1rem + 0.7vw, 1.6rem)', { lineHeight: '1.25', letterSpacing: '-0.01em' }],
        lead: ['clamp(1.075rem, 1rem + 0.4vw, 1.3rem)', { lineHeight: '1.6' }],
      },
      transitionTimingFunction: {
        quint: 'cubic-bezier(0.23, 1, 0.32, 1)',
        expo: 'cubic-bezier(0.19, 1, 0.22, 1)',
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      spacing: { 18: '4.5rem', 22: '5.5rem', 30: '7.5rem' },
      boxShadow: {
        e1: 'var(--shadow-sm)',
        e2: 'var(--shadow-md)',
        e3: 'var(--shadow-lg)',
        glow: 'var(--glow)',
        // legacy
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        neon: '0 0 20px rgba(109, 0, 255, 0.4)',
        card: '0 4px 24px -6px rgba(0,0,0,0.3)',
      },
      backgroundImage: {
        'grad-brand': 'var(--grad-brand)',
        'grad-cta': 'var(--grad-cta)',
        'grad-surface': 'var(--grad-surface)',
      },
      keyframes: {
        'fade-up': { '0%': { opacity: '0', transform: 'translateY(20px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'fade-up-slow': { '0%': { opacity: '0', transform: 'translateY(40px)' }, '100%': { opacity: '1', transform: 'translateY(0)' } },
        'fade-in': { '0%': { opacity: '0' }, '100%': { opacity: '1' } },
        'scale-reveal': { '0%': { opacity: '0', transform: 'scale(0.95) translateY(10px)' }, '100%': { opacity: '1', transform: 'scale(1) translateY(0)' } },
        'slide-in-right': { '0%': { opacity: '0', transform: 'translateX(20px)' }, '100%': { opacity: '1', transform: 'translateX(0)' } },
        shimmer: { '0%': { backgroundPosition: '200% 50%' }, '100%': { backgroundPosition: '-200% 50%' } },
        float: { '0%, 100%': { transform: 'translateY(0)' }, '50%': { transform: 'translateY(-10px)' } },
      },
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards',
        'fade-up-slow': 'fade-up-slow 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'scale-reveal': 'scale-reveal 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards',
        shimmer: 'shimmer 8s linear infinite',
        float: 'float 6s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards',
      },
      maxWidth: { container: '1200px', wide: '1440px', measure: '68ch' },
      borderRadius: { DEFAULT: '0.75rem', '2xl': '1rem', '3xl': '1.5rem', '4xl': '2rem' },
    },
  },
  plugins: [],
};
