import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/Algorythmos.png";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleNewsletterSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ type: "", text: "" });

    try {
      // Mailchimp API configuration
      const MAILCHIMP_API_KEY = process.env.REACT_APP_MAILCHIMP_API_KEY;
      const MAILCHIMP_LIST_ID = process.env.REACT_APP_MAILCHIMP_LIST_ID;
      const MAILCHIMP_SERVER_PREFIX = process.env.REACT_APP_MAILCHIMP_SERVER_PREFIX;

      if (!MAILCHIMP_API_KEY || !MAILCHIMP_LIST_ID || !MAILCHIMP_SERVER_PREFIX) {
        throw new Error("Mailchimp configuration missing");
      }

      const response = await fetch(
        `https://${MAILCHIMP_SERVER_PREFIX}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
        {
          method: "POST",
          headers: {
            "Authorization": `apikey ${MAILCHIMP_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email_address: email,
            status: "subscribed",
            merge_fields: {
              FNAME: "",
              LNAME: "",
            },
          }),
        }
      );

      if (response.ok) {
        setMessage({ type: "success", text: "Thanks for subscribing!" });
        setEmail("");
      } else {
        const errorData = await response.json();
        if (errorData.title === "Member Exists") {
          setMessage({ type: "success", text: "You're already subscribed!" });
        } else {
          throw new Error(errorData.detail || "Subscription failed");
        }
      }
    } catch (error) {
      console.error("Newsletter subscription error:", error);
      setMessage({ 
        type: "error", 
        text: "Subscription failed. Please try again later." 
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer 
      className="w-full bg-gradient-to-br from-[#0D0D0F] via-black to-[#0D0D0F] border-t border-white/10"
      aria-label="Site footer"
    >
      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          
          {/* Column 1: Logo + Tagline + Newsletter */}
          <div className="lg:col-span-1">
            <div className="flex items-center mb-4 gap-2">
            <img src={logo} alt="Algorythmos logo" className="h-10 w-10 rounded-lg shadow-lg ring-1 ring-white/10 group-hover:ring-white/20 transition" />
              <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Algorythmos
              </span>
            </div>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Unlock the Real Value of Your Data
            </p>
            
            {/* Newsletter Form */}
            <form onSubmit={handleNewsletterSubmit} className="space-y-3">
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 rounded-xl font-medium text-white transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Subscribing...
                  </>
                ) : (
                  "Subscribe"
                )}
              </button>
              
              {/* Message Display */}
              {message.text && (
                <div className={`mt-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${
                  message.type === "success" 
                    ? "bg-green-500/10 border border-green-500/20 text-green-400" 
                    : "bg-red-500/10 border border-red-500/20 text-red-400"
                }`}>
                  {message.text}
                </div>
              )}
            </form>
          </div>

          {/* Column 2: Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Links</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/services" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Services
                </Link>
              </li>
              <li>
                <Link to="/case-studies" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Case Studies
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Benefits
                </Link>
              </li>
              <li>
                <a href="/contact" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Pricing
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3: Pages */}
          <div>
            <h3 className="text-white font-semibold mb-4">Pages</h3>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-300">
                  About
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-300">
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Socials + Contact Button */}
          <div>
            <h3 className="text-white font-semibold mb-4">Socials</h3>
            <ul className="space-y-3 mb-6">
              <li>
                <a
                  href="https://www.linkedin.com/company/algorythmos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://github.com/algorythmos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  GitHub
                </a>
              </li>
              <li>
                <a
                  href="https://twitter.com/algorythmos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Twitter/X
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/algorythmos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-white transition-colors duration-300"
                >
                  Instagram
                </a>
              </li>
            </ul>
            
            {/* Contact Button */}
            <Link
              to="/contact"
              className="inline-flex items-center px-4 py-2 border border-white/20 rounded-xl text-white hover:bg-gradient-to-r hover:from-purple-600/20 hover:to-pink-600/20 hover:border-white/40 transition-all duration-300 text-sm"
            >
              Contact Us →
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/10 py-6">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm">
            <div className="text-white font-semibold">
              Algorythmos
            </div>
            <div className="text-gray-400 text-center">
              Visioned and Crafted by Algorythmos
            </div>
            <div className="text-gray-500 text-center md:text-right">
              © 2025 Algorythmos. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
