export default {
  content: ['./src/**/*.{astro,html,js,ts,jsx,tsx,md,mdx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      // 2025 "Neural" Color System
      colors: {
        // Legacy Brand Config (Maintained for compatibility)
        algviolet: '#6D00FF',
        algpurple: '#7658E7',
        algblue: '#3715E0',
        algbg: '#050505', // Deepened for OLED feel

        // Neural Monochrome
        neural: {
          950: '#020204', // Void Black
          900: '#0A0A0F', // Primary BG
          800: '#13131F', // Secondary / Cards
          700: '#1C1C2E', // Borders
          600: '#2A2A45', // Muted
          500: '#40405A',
          400: '#6E6E85',
          300: '#A0A0B0',
          100: '#E0E0E6', // High Contrast
          50: '#F5F5F7',
        },

        // Neon Accents (Glows & Highlights)
        neon: {
          violet: '#8B5CF6',
          cyan: '#06B6D4',
          pink: '#EC4899',
          blue: '#3B82F6',
        }
      },
      // Typography
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      // Motion Physics (Apple/Tesla style)
      transitionTimingFunction: {
        'quint': 'cubic-bezier(0.23, 1, 0.32, 1)',
        'expo': 'cubic-bezier(0.19, 1, 0.22, 1)',
        'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
        'bounce-soft': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
      // Enterprise Spacing
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        '30': '7.5rem',
      },
      // Premium Shadows
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-hover': '0 8px 32px 0 rgba(109, 0, 255, 0.15)',
        'neon': '0 0 20px rgba(109, 0, 255, 0.4)',
        'neon-strong': '0 0 30px rgba(109, 0, 255, 0.5), 0 0 60px rgba(109, 0, 255, 0.3)',
        'glow': '0 0 40px -10px rgba(109,0,255,0.5)',
        'card': '0 4px 24px -6px rgba(0,0,0,0.3)',
      },
      // Backgrounds
      backgroundImage: {
        'neural-gradient': 'linear-gradient(135deg, rgba(19,19,31,0.9) 0%, rgba(10,10,15,0.95) 100%)',
        'glass-gradient': 'linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.03) 100%)',
        'glass-shine': 'linear-gradient(45deg, transparent 25%, rgba(255,255,255,0.1) 50%, transparent 75%)',
      },
      // Animation Keyframes
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-up-slow': {
          '0%': { opacity: '0', transform: 'translateY(40px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'scale-reveal': {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'neural-pulse': {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 20px rgba(109, 0, 255, 0.3)' },
          '50%': { opacity: '0.8', boxShadow: '0 0 40px rgba(109, 0, 255, 0.6)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '200% 50%' },
          '100%': { backgroundPosition: '-200% 50%' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
      },
      // Animation Utilities
      animation: {
        'fade-up': 'fade-up 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards',
        'fade-up-slow': 'fade-up-slow 1.2s cubic-bezier(0.23, 1, 0.32, 1) forwards',
        'fade-in': 'fade-in 0.6s ease-out forwards',
        'scale-reveal': 'scale-reveal 0.8s cubic-bezier(0.23, 1, 0.32, 1) forwards',
        'neural-pulse': 'neural-pulse 4s ease-in-out infinite',
        'shimmer': 'shimmer 8s linear infinite',
        'float': 'float 6s ease-in-out infinite',
        'slide-in-right': 'slide-in-right 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards',
      },
      // Containers
      maxWidth: {
        'container': '1280px',
        'wide': '1440px',
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
};
