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
      className={`fixed top-0 w-full z-40 transition-all duration-500 ${
        scrollY > 50
          ? "bg-black/20 backdrop-blur-2xl border-b border-white/10 shadow-2xl"
          : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center gap-2">
          {/* Logo / Brand */}
          <img src={logo} alt="Algorythmos logo" className="h-10 w-10 rounded-lg shadow-lg ring-1 ring-white/10 group-hover:ring-white/20 transition" />
          <div className="text-3xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent animate-pulse">
            Algorythmos
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-1">
            <Link to="/" className="relative px-6 py-3 rounded-xl font-medium transition-all duration-300 text-gray-300 hover:text-white">
              Home
            </Link>
            <Link to="/services" className="relative px-6 py-3 rounded-xl font-medium transition-all duration-300 text-gray-300 hover:text-white">
              Services
            </Link>
            <Link to="/about" className="relative px-6 py-3 rounded-xl font-medium transition-all duration-300 text-gray-300 hover:text-white">
              About
            </Link>
            <Link to="/blog" className="relative px-6 py-3 rounded-xl font-medium transition-all duration-300 text-gray-300 hover:text-white">
              Blog
            </Link>
            <Link to="/case-studies" className="relative px-6 py-3 rounded-xl font-medium transition-all duration-300 text-gray-300 hover:text-white">
              Case Studies
            </Link>
            
            <Link to="/contact" className="relative px-6 py-3 rounded-xl font-medium transition-all duration-300 text-gray-300 hover:text-white">
              Contact
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            aria-label="Toggle navigation"
            aria-expanded={isMenuOpen}
            aria-controls="mobile-menu"
            className="md:hidden flex items-center px-3 py-2 border-2 border-white rounded text-white bg-transparent"
            onClick={() => setIsMenuOpen((prev) => !prev)}
          >
            {isMenuOpen ? "✖" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div id="mobile-menu" className="md:hidden flex flex-col space-y-2 mt-2 bg-black/90 rounded-xl p-4 border border-white/10">
            <Link to="/" className="px-4 py-2 rounded-xl font-medium text-gray-300 hover:text-white">Home</Link>
            <Link to="/services" className="px-4 py-2 rounded-xl font-medium text-gray-300 hover:text-white">Services</Link>
            <Link to="/about" className="px-4 py-2 rounded-xl font-medium text-gray-300 hover:text-white">About</Link>
            <Link to="/contact" className="px-4 py-2 rounded-xl font-medium text-gray-300 hover:text-white">Contact</Link>
            <Link to="/case-studies" className="px-4 py-2 rounded-xl font-medium text-gray-300 hover:text-white">Case Studies</Link>
            <Link to="/blog" className="px-4 py-2 rounded-xl font-medium text-gray-300 hover:text-white">Blog</Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
