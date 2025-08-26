import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Algorythmos.png";

const Navbar = () => {
  const [scrollY, setScrollY] = useState(0);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      aria-label="Main navigation"
      className={`sticky top-0 w-full z-50 transition-all duration-500 ${
        scrollY > 50
          ? "bg-black/80 backdrop-blur-xl border-b border-white/10 shadow-2xl"
          : "bg-black/80 backdrop-blur-xl"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
          <div className="hidden md:flex space-x-1">
            <Link to="/" className="relative px-6 py-3 rounded-xl font-medium transition-all duration-300 text-gray-300 hover:text-white hover:bg-white/10">
              Home
            </Link>
            <Link to="/services" className="relative px-6 py-3 rounded-xl font-medium transition-all duration-300 text-gray-300 hover:text-white hover:bg-white/10">
              Services
            </Link>
            <Link to="/about" className="relative px-6 py-3 rounded-xl font-medium transition-all duration-300 text-gray-300 hover:text-white hover:bg-white/10">
              About
            </Link>
            <Link to="/blog" className="relative px-6 py-3 rounded-xl font-medium transition-all duration-300 text-gray-300 hover:text-white hover:bg-white/10">
              Blog
            </Link>
            <Link to="/case-studies" className="relative px-6 py-3 rounded-xl font-medium transition-all duration-300 text-gray-300 hover:text-white hover:bg-white/10">
              Case Studies
            </Link>
            
            <Link to="/contact" className="relative px-6 py-3 rounded-xl font-medium transition-all duration-300 text-gray-300 hover:text-white hover:bg-white/10">
              Contact
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className="md:hidden flex items-center justify-center w-10 h-10 border-2 border-white/30 rounded-lg text-white bg-transparent hover:bg-white/10 transition-all duration-300"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden flex flex-col space-y-1 mt-2 bg-black/95 backdrop-blur-xl rounded-xl p-4 border border-white/10 shadow-2xl">
            <Link 
              to="/" 
              className="px-4 py-3 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/services" 
              className="px-4 py-3 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Services
            </Link>
            <Link 
              to="/about" 
              className="px-4 py-3 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              About
            </Link>
            <Link 
              to="/contact" 
              className="px-4 py-3 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <Link 
              to="/case-studies" 
              className="px-4 py-3 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Case Studies
            </Link>
            <Link 
              to="/blog" 
              className="px-4 py-3 rounded-lg font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-300"
              onClick={() => setIsMenuOpen(false)}
            >
              Blog
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
