// src/pages/NotFoundPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { useI18n } from "../app/i18n/I18nContext";
import { Home, Mail } from "lucide-react";

export default function NotFoundPage() {
  const { t, getRegionPath } = useI18n();

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center px-4">
      <Helmet>
        <title>{t("notFoundPage.meta.title")}</title>
        <meta name="description" content={t("notFoundPage.meta.description")} />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>

      <div className="max-w-lg text-center">
        {/* Error Code */}
        <div className="text-9xl font-bold bg-gradient-to-r from-algviolet via-algpurple to-algblue bg-clip-text text-transparent mb-6">
          {t("notFoundPage.errorCode")}
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl font-bold mb-4 text-white">
          {t("notFoundPage.title")}
        </h1>

        {/* Subtitle */}
        <p className="text-xl text-gray-400 mb-4">
          {t("notFoundPage.subtitle")}
        </p>

        {/* Description */}
        <p className="text-gray-500 mb-8">
          {t("notFoundPage.description")}
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to={getRegionPath("/")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-algviolet via-algpurple to-algblue text-white font-semibold shadow-brand hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
          >
            <Home className="w-5 h-5" />
            {t("notFoundPage.cta.home")}
          </Link>
          <Link
            to={getRegionPath("/contact")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border-2 border-white/20 text-white font-semibold hover:bg-white/10 transition-all duration-300"
          >
            <Mail className="w-5 h-5" />
            {t("notFoundPage.cta.contact")}
          </Link>
        </div>
      </div>
    </div>
  );
}
