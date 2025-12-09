import React, { useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle } from "lucide-react";
import { servicesBySlug, servicesList } from "../../data/services";
import { useI18n } from "../../app/i18n/I18nContext";
import { getCanonicalUrl, getOgLocale, generateHreflangLinks, getCanonicalBase } from "../../app/utils/seoHelpers.js";

function Breadcrumbs({ title, t, getRegionPath }) {
  return (
    <nav aria-label={t("ui.aria.breadcrumb")} className="text-sm mb-6">
      <ol className="flex flex-wrap gap-2 text-gray-400">
        <li><Link to={getRegionPath("/")} className="hover:text-white">{t("ui.serviceDetail.breadcrumb.home")}</Link></li>
        <li>›</li>
        <li><Link to={getRegionPath("/services")} className="hover:text-white">{t("ui.serviceDetail.breadcrumb.services")}</Link></li>
        <li>›</li>
        <li className="text-white">{title}</li>
      </ol>
    </nav>
  );
}

export default function ServiceDetailPage() {
  const { t, region, getRegionPath } = useI18n();
  const { slug } = useParams();
  const service = servicesBySlug[slug];

  // SEO helpers
  const canonicalUrl = getCanonicalUrl(region, `/services/${slug}`);
  const canonicalBase = getCanonicalBase(region);
  const ogLocale = getOgLocale(region);
  const hreflangLinks = generateHreflangLinks(`/services/${slug}`);

  if (!service) {
    return (
      <div className="min-h-screen bg-black text-white">
        <main className="pt-40 pb-20 px-6 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            {t("ui.serviceDetail.notFound.title")}
          </h1>
          <p className="text-gray-400">{t("ui.serviceDetail.notFound.message")}</p>
          <div className="mt-8">
            <Link to={getRegionPath("/services")} className="text-blue-300 hover:text-white underline">{t("ui.serviceDetail.backToServices")}</Link>
          </div>
        </main>
      </div>
    );
  }

  const Icon = service.icon;

  const jsonLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: service.title,
    description: service.meta,
    provider: { "@type": "Organization", name: "Algorythmos" },
    areaServed: "Global",
    url: canonicalUrl,
    category: "Artificial Intelligence"
  }), [service, slug, canonicalUrl]);

  const related = servicesList.filter(s => service.related?.includes(s.slug));

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-black" />
      </div>

      <Helmet>
        <title>{service.title} | Algorythmos</title>
        <meta name="description" content={service.meta} />
        <meta property="og:title" content={service.title} />
        <meta property="og:description" content={service.meta} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={canonicalUrl} />
        <meta property="og:locale" content={ogLocale} />
        <link rel="canonical" href={canonicalUrl} />
        {hreflangLinks.map(({ hreflang, href }) => (
          <link key={hreflang} rel="alternate" hreflang={hreflang} href={href} />
        ))}
        <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
      </Helmet>

      <main className="pt-40 pb-24 px-6">
        <article className="max-w-5xl mx-auto grid lg:grid-cols-[1fr,280px] gap-10">
          <div>
            <Breadcrumbs title={service.title} t={t} getRegionPath={getRegionPath} />

            <div className="flex items-center gap-4 mb-3">
              {Icon && (
                <span className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
                  <Icon className="w-7 h-7 text-blue-300" />
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-black leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {service.title}
                </span>
              </h1>
            </div>
            <p className="text-lg text-gray-400 mb-6 italic">{service.meta}</p>

            {service.heroPoints?.length > 0 && (
              <ul className="grid sm:grid-cols-2 gap-3 mb-10">
                {service.heroPoints.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-gray-900/70 to-black/70 border border-gray-800/60">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-100">{b}</span>
                  </li>
                ))}
              </ul>
            )}

            <div className="space-y-10">
              {service.sections?.map((sec) => (
                <section key={sec.id} id={sec.id}>
                  <h2 className="text-2xl font-bold mb-3">{sec.heading}</h2>
                  {sec.paragraphs && (
                    <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/60 to-black/60 border border-gray-800/50 space-y-4">
                      {sec.paragraphs.map((p, i) => (
                        <p key={i} className="text-gray-200 leading-relaxed">{p}</p>
                      ))}
                    </div>
                  )}
                  {sec.bullets && (
                    <ul className="space-y-3">
                      {sec.bullets.map((b, i) => (
                        <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-gray-900/70 to-black/70 border border-gray-800/60">
                          <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                          <span className="text-gray-100">{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              ))}
            </div>

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Link
                to={getRegionPath("/contact")}
                className="group relative inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <span className="relative">{service.callToAction}</span>
              </Link>
              <Link to={getRegionPath("/services")} className="text-gray-400 hover:text-white underline">
                {t("ui.serviceDetail.backToServices")}
              </Link>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-32 space-y-6">
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <h3 className="font-semibold mb-3">{t("ui.serviceDetail.sidebar.contents")}</h3>
                <ul className="space-y-2 text-sm">
                  {service.sections?.map(sec => (
                    <li key={sec.id}>
                      <a href={`#${sec.id}`} className="text-gray-300 hover:text-white">{sec.heading}</a>
                    </li>
                  ))}
                </ul>
              </div>

              {related.length > 0 && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="font-semibold mb-3">{t("ui.serviceDetail.sidebar.related")}</h3>
                  <ul className="space-y-2 text-sm">
                    {related.map(r => (
                      <li key={r.slug}>
                        <Link to={getRegionPath(`/services/${r.slug}`)} className="text-blue-300 hover:text-white">{r.title}</Link>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </aside>
        </article>
      </main>
    </div>
  );
}


