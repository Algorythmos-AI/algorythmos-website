import { useEffect, useState } from 'react';

import logo from '../../assets/Algorythmos.png';

export const NavBar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  // Close menu on escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('keydown', handleEscape);
      return () => document.removeEventListener('keydown', handleEscape);
    }
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <nav
      role="navigation"
      aria-label="Primary navigation"
      className={`sticky top-0 w-full z-50 transition-all duration-500 ${
        scrollY > 50
          ? 'bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl'
          : 'bg-black/80 backdrop-blur-xl'
      }`}
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Brand */}
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="Algorythmos logo"
              className="h-8 w-auto md:h-10 object-contain bg-transparent"
            />
            <div className="text-xl md:text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
              Algorythmos
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `relative px-6 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
                  isActive
                    ? 'text-white after:block after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-[#6D00FF] after:to-[#3715E0] after:mt-1'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `relative px-6 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
                  isActive
                    ? 'text-white after:block after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-[#6D00FF] after:to-[#3715E0] after:mt-1'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              Services
            </NavLink>
            <NavLink
              to="/pricing"
              className={({ isActive }) =>
                `relative px-6 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
                  isActive
                    ? 'text-white after:block after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-[#6D00FF] after:to-[#3715E0] after:mt-1'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              Pricing
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `relative px-6 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
                  isActive
                    ? 'text-white after:block after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-[#6D00FF] after:to-[#3715E0] after:mt-1'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/blog"
              className={({ isActive }) =>
                `relative px-6 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
                  isActive
                    ? 'text-white after:block after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-[#6D00FF] after:to-[#3715E0] after:mt-1'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              Blog
            </NavLink>
            <NavLink
              to="/case-studies"
              className={({ isActive }) =>
                `relative px-6 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
                  isActive
                    ? 'text-white after:block after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-[#6D00FF] after:to-[#3715E0] after:mt-1'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              Case Studies
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `relative px-6 py-3 rounded-xl font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
                  isActive
                    ? 'text-white after:block after:h-0.5 after:rounded-full after:bg-gradient-to-r after:from-[#6D00FF] after:to-[#3715E0] after:mt-1'
                    : 'text-gray-300 hover:text-white hover:bg-white/10'
                }`
              }
            >
              Contact
            </NavLink>

            {/* Calculator CTA */}
            <Link
              to="/pricing#calculator"
              aria-label="Open ROI (Return On Investment) calculator"
              title="Open ROI (Return On Investment) calculator"
              className="ml-4 inline-flex items-center rounded-xl bg-gradient-to-r from-[#6D00FF] via-[#7658E7] to-[#3715E0] px-3 py-2 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_rgba(55,21,224,0.55)] focus:outline-none focus:ring-4 focus:ring-violet-500/40"
            >
              Open calculator
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className="md:hidden flex items-center justify-center w-11 h-11 border-2 border-white/30 rounded-lg text-white bg-transparent hover:bg-white/10 transition-all duration-300 mobile-tap-target"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            <div className="relative w-5 h-5">
              <span
                className={`absolute top-0 left-0 w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}
              />
              <span
                className={`absolute top-2 left-0 w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}
              />
              <span
                className={`absolute top-4 left-0 w-5 h-0.5 bg-white transition-all duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}
              />
            </div>
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMenuOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 md:hidden"
              onClick={closeMenu}
              aria-hidden="true"
            />

            {/* Mobile Menu Drawer */}
            <div
              id="mobile-menu"
              className="fixed inset-y-0 right-0 w-72 bg-black/95 backdrop-blur-xl border-l border-white/10 shadow-2xl z-50 md:hidden transform transition-transform duration-300 ease-in-out"
              role="dialog"
              aria-modal="true"
              aria-labelledby="mobile-menu-title"
            >
              <div className="flex flex-col h-full p-6">
                <div className="flex items-center justify-between mb-8">
                  <h2 id="mobile-menu-title" className="text-lg font-semibold text-white">
                    Menu
                  </h2>
                  <button
                    onClick={closeMenu}
                    className="w-8 h-8 flex items-center justify-center text-white hover:bg-white/10 rounded-lg transition-colors"
                    aria-label="Close menu"
                  >
                    ✕
                  </button>
                </div>

                <nav className="flex-1 space-y-2">
                  <NavLink
                    to="/"
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
                        isActive
                          ? 'text-white bg-white/10'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`
                    }
                    onClick={closeMenu}
                  >
                    Home
                  </NavLink>
                  <NavLink
                    to="/services"
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
                        isActive
                          ? 'text-white bg-white/10'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`
                    }
                    onClick={closeMenu}
                  >
                    Services
                  </NavLink>
                  <NavLink
                    to="/pricing"
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
                        isActive
                          ? 'text-white bg-white/10'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`
                    }
                    onClick={closeMenu}
                  >
                    Pricing
                  </NavLink>
                  <NavLink
                    to="/about"
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
                        isActive
                          ? 'text-white bg-white/10'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`
                    }
                    onClick={closeMenu}
                  >
                    About
                  </NavLink>
                  <NavLink
                    to="/blog"
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
                        isActive
                          ? 'text-white bg-white/10'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`
                    }
                    onClick={closeMenu}
                  >
                    Blog
                  </NavLink>
                  <NavLink
                    to="/case-studies"
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
                        isActive
                          ? 'text-white bg-white/10'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`
                    }
                    onClick={closeMenu}
                  >
                    Case Studies
                  </NavLink>
                  <NavLink
                    to="/contact"
                    className={({ isActive }) =>
                      `block px-4 py-3 rounded-lg font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40 ${
                        isActive
                          ? 'text-white bg-white/10'
                          : 'text-gray-300 hover:text-white hover:bg-white/10'
                      }`
                    }
                    onClick={closeMenu}
                  >
                    Contact
                  </NavLink>
                </nav>

                {/* Mobile Calculator CTA */}
                <div className="pt-4 border-t border-white/10">
                  <Link
                    to="/pricing#calculator"
                    className="w-full block text-center rounded-lg bg-gradient-to-r from-[#6D00FF] via-[#7658E7] to-[#3715E0] px-4 py-3 text-sm font-semibold text-white shadow-[0_10px_40px_-10px_rgba(55,21,224,0.55)] hover:shadow-[0_15px_50px_-10px_rgba(55,21,224,0.7)] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-violet-500/40"
                    aria-label="Open ROI (Return On Investment) calculator"
                    onClick={closeMenu}
                  >
                    Open calculator
                  </Link>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

