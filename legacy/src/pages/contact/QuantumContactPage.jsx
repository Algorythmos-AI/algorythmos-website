// /src/components/Index/QuantumContactPage.jsx
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import emailjs from "@emailjs/browser";       // npm install @emailjs/browser
import { track } from "../../app/utils/analytics";
import { persistUtmFromLocation, readStoredUtm } from "../../app/utils/utm";
import { useI18n } from "../../app/i18n/I18nContext";
import { getCanonicalUrl, getOgLocale, generateHreflangLinks, getCanonicalBase } from "../../app/utils/seoHelpers.js";
import GlobalMap from "../../components/GlobalMap";
import SeoBreadcrumbs from "../../app/seo/SeoBreadcrumbs.jsx";
// Footer is global via App.jsx

const SERVICE_ID = "service_m5jcw4i";
const TEMPLATE_ID = "template_r1yfz0r";
const PUBLIC_KEY = "FtkTJ5DgfHW4fImxo";


const QuantumContactPage = () => {
  const { t, region } = useI18n();

  // SEO helpers
  const canonicalUrl = getCanonicalUrl(region, "/contact");
  const canonicalBase = getCanonicalBase(region);
  const ogLocale = getOgLocale(region);
  const hreflangLinks = generateHreflangLinks("/contact");

  const [scrollY, setScrollY] = useState(0);
  // scrollY used for parallax effects below

  // Page view tracking with UTM context
  useEffect(() => {
    persistUtmFromLocation();
    const utm = readStoredUtm();
    track("page_view", { page: "contact", ...utm });
  }, []);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Form state
  const [form, setForm] = useState({ name: "", email: "", message: "", website: "" }); // website = honeypot
  const [errors, setErrors] = useState({});
  const [sending, setSending] = useState(false);
  const [showSnackbar, setShowSnackbar] = useState(false);

  // Real-time validation
  const validate = (field, value) => {
    switch (field) {
      case "name":
        return value.trim().length < 2 ? t("contactPage.validation.nameMin") : "";
      case "email":
        return !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? t("contactPage.validation.emailInvalid") : "";
      case "message":
        return value.trim().length < 10 ? t("contactPage.validation.messageMin") : "";
      default:
        return "";
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (name in errors) {
      setErrors((prev) => ({ ...prev, [name]: validate(name, value) }));
    }
  };

  const sendEmail = async (e) => {
    e.preventDefault();

    // Bot check: if honeypot filled, silently abort
    if (form.website) return;

    const newErrors = {
      name: validate("name", form.name),
      email: validate("email", form.email),
      message: validate("message", form.message),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    if (!SERVICE_ID || !TEMPLATE_ID || !PUBLIC_KEY) {
      console.error("EmailJS env vars are missing");
      setErrors((prev) => ({
        ...prev,
        message: "Email service not configured. Please try again later.",
      }));
      return;
    }

    try {
      setSending(true);
      await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        { name: form.name, email: form.email, message: form.message },
        { publicKey: PUBLIC_KEY }
      );
      setForm({ name: "", email: "", message: "", website: "" });
      setShowSnackbar(true);
      setTimeout(() => setShowSnackbar(false), 3500);
    } catch (err) {
      console.error(err);
      setErrors((prev) => ({
        ...prev,
        message: "Failed to send. Please try again.",
      }));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <Helmet>
        <title>{t("contactPage.meta.title")}</title>
        <meta
          name="description"
          content={t("contactPage.meta.description")}
        />
        <link rel="canonical" href={canonicalUrl} />
        {hreflangLinks.map(({ hreflang, href }) => (
          <link key={hreflang} rel="alternate" hreflang={hreflang} href={href} />
        ))}
        <meta property="og:type" content="website" />
        <meta property="og:title" content={t("contactPage.meta.title")} />
        <meta property="og:description" content={t("contactPage.meta.description")} />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:image" content={`${canonicalBase}/Algorythmos.png`} />
        <meta property="og:site_name" content="Algorythmos" />
        <meta property="og:locale" content={ogLocale} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={t("contactPage.meta.title")} />
        <meta name="twitter:description" content={t("contactPage.meta.description")} />
        <meta name="twitter:image" content={`${canonicalBase}/Algorythmos.png`} />
      </Helmet>
      <SeoBreadcrumbs items={[{ name: "Home", path: "/" }, { name: t("nav.contact"), path: "/contact" }]} />

      {/* Global Navbar is rendered by App.jsx */}

      {/* Decorative background (optional) */}
      <canvas className="fixed inset-0 pointer-events-none z-0 opacity-40" />

      {/* Dynamic Gradient Orbs */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-black" />
        <div
          className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full filter blur-3xl opacity-30 animate-pulse"
          style={{
            background: "linear-gradient(45deg, #3B82F6, #8B5CF6)",
            transform: `translate(${scrollY * 0.1}px, ${scrollY * 0.05}px)`,
          }}
        />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full filter blur-3xl opacity-30 animate-pulse"
          style={{
            background: "linear-gradient(45deg, #EC4899, #F59E0B)",
            transform: `translate(${-scrollY * 0.08}px, ${-scrollY * 0.06}px)`,
            animationDelay: "2s",
          }}
        />
      </div>

      {/* Contact Content */}
      <main className="pt-32 md:pt-32 pb-16 md:pb-32 px-4 sm:px-6 md:px-12 max-w-5xl mx-auto text-center relative z-10">
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black mb-6 sm:mb-8 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          {t("contactPage.hero.title")}
        </h1>
        <p className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-300 mb-8 sm:mb-12 px-4">
          {t("contactPage.hero.subtitle")}
        </p>

        {/* Global Map Section */}
        <GlobalMap />

        <div className="flex justify-center">
          <form
            className="w-full max-w-lg mx-auto bg-white/5 rounded-2xl p-6 sm:p-8 shadow-lg border border-gray-800 flex flex-col gap-4 sm:gap-6 backdrop-blur-md"
            onSubmit={sendEmail}
            autoComplete="off"
            noValidate
          >
            {/* Honeypot (hidden) */}
            <input
              type="text"
              name="website"
              value={form.website}
              onChange={handleChange}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            {/* Name */}
            <div className="mb-2 text-left">
              <label htmlFor="name" className="block mb-2 text-sm sm:text-base font-medium text-gray-200">
                {t("contactPage.form.nameLabel")}
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={form.name}
                onChange={handleChange}
                required
                aria-invalid={!!errors.name}
                className={`w-full pl-4 pr-4 py-3 rounded-lg bg-gray-900/80 text-white text-base focus:outline-none focus:ring-2 focus:ring-blue-400 border border-gray-700 transition-all duration-300 ${errors.name ? "border-red-500 ring-red-400" : ""
                  }`}
                autoComplete="name"
              />
              {errors.name && (
                <span className="text-red-400 text-xs animate-pulse ml-2 mt-1 block">{errors.name}</span>
              )}
            </div>

            {/* Email */}
            <div className="mb-2 text-left">
              <label htmlFor="email" className="block mb-2 text-sm sm:text-base font-medium text-gray-200">
                {t("contactPage.form.emailLabel")}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                aria-invalid={!!errors.email}
                className={`w-full pl-4 pr-4 py-3 rounded-lg bg-gray-900/80 text-white text-base focus:outline-none focus:ring-2 focus:ring-purple-400 border border-gray-700 transition-all duration-300 ${errors.email ? "border-red-500 ring-red-400" : ""
                  }`}
                autoComplete="email"
                inputMode="email"
              />
              {errors.email && (
                <span className="text-red-400 text-xs animate-pulse ml-2 mt-1 block">{errors.email}</span>
              )}
            </div>

            {/* Message */}
            <div className="mb-2 text-left">
              <label htmlFor="message" className="block mb-2 text-sm sm:text-base font-medium text-gray-200">
                {t("contactPage.form.messageLabel")}
              </label>
              <textarea
                id="message"
                name="message"
                rows={4}
                value={form.message}
                onChange={handleChange}
                required
                aria-invalid={!!errors.message}
                className={`w-full pl-4 pr-4 py-3 rounded-lg bg-gray-900/80 text-white text-base focus:outline-none focus:ring-2 focus:ring-pink-400 border border-gray-700 transition-all duration-300 resize-none ${errors.message ? "border-red-500 ring-red-400" : ""
                  }`}
                autoComplete="off"
              />
              {errors.message && (
                <span className="text-red-400 text-xs animate-pulse ml-2 mt-1 block">{errors.message}</span>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={sending}
              className="mt-4 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white text-base font-semibold rounded-lg py-3 shadow-md hover:scale-105 hover:shadow-lg transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-400 disabled:opacity-60 disabled:cursor-not-allowed"
            >
              {sending ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin" width="20" height="20" fill="none" stroke="currentColor">
                    <circle cx="10" cy="10" r="8" strokeWidth="4" />
                  </svg>
                  {t("contactPage.form.sendingButton")}
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path d="M2 12l8-8 8 8" />
                  </svg>
                  {t("contactPage.form.submitButton")}
                </span>
              )}
            </button>
          </form>
        </div>
      </main>

      {/* Snackbar */}
      {showSnackbar && (
        <div
          className="fixed right-8 flex items-center gap-4 px-6 py-4 rounded-xl shadow-2xl z-50 backdrop-blur-lg border border-white/10"
          style={{
            top: "88px",
            background:
              "linear-gradient(90deg, #3B82F6 0%, #8B5CF6 60%, #EC4899 100%)",
            minWidth: "320px",
            boxShadow: "0 8px 32px rgba(139,92,246,0.18)",
          }}
          role="status"
          aria-live="polite"
        >
          <span className="flex items-center justify-center w-8 h-8 rounded-full bg-white/10 text-blue-200">
            <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="#fff" />
              <path d="M7 13l3 3 7-7" stroke="#fff" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </span>
          <span className="font-semibold text-base text-white drop-shadow">
            {t("contactPage.snackbar.success")}
          </span>
          <button
            className="ml-auto text-white/80 hover:text-white text-lg px-2 py-1 rounded focus:outline-none focus:ring-2 focus:ring-blue-400 transition-colors"
            onClick={() => setShowSnackbar(false)}
            aria-label={t("contactPage.snackbar.closeLabel")}
          >
            ✖
          </button>
        </div>
      )}

      {/* Global Footer is rendered by App.jsx */}
    </div>
  );
};

export default QuantumContactPage;
