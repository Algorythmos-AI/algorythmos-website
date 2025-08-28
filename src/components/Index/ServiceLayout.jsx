import React, { useMemo } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle } from "lucide-react";

function Breadcrumbs({ title }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm mb-6">
      <ol className="flex flex-wrap gap-2 text-gray-400">
        <li><Link to="/" className="hover:text-white">Home</Link></li>
        <li>›</li>
        <li><Link to="/services" className="hover:text-white">Services</Link></li>
        <li>›</li>
        <li className="text-white">{title}</li>
      </ol>
    </nav>
  );
}

export default function ServiceLayout({
  slug,
  title,
  meta,
  icon: Icon,
  heroPoints = [],
  sections = [],
  faqs = [],
  related = [],
  ctaText = "Book a Consultation",
  children,
}) {
  const serviceLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "Service",
    name: title,
    description: meta,
    provider: { "@type": "Organization", name: "Algorythmos" },
    areaServed: "Europe",
    url: `https://algorythmos.fr/services/${slug}`,
    category: "Artificial Intelligence"
  }), [slug, title, meta]);

  const breadcrumbLd = useMemo(() => ({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://algorythmos.fr/" },
      { "@type": "ListItem", position: 2, name: "Services", item: "https://algorythmos.fr/services" },
      { "@type": "ListItem", position: 3, name: title, item: `https://algorythmos.fr/services/${slug}` }
    ]
  }), [slug, title]);

  const faqLd = useMemo(() => faqs.length ? ({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map(f => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a }
    }))
  }) : null, [faqs]);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-black" />
      </div>

      <Helmet>
        <title>{title} | Algorythmos</title>
        <meta name="description" content={meta} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={meta} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://algorythmos.fr/services/${slug}`} />
        <link rel="canonical" href={`https://algorythmos.fr/services/${slug}`} />
        <script type="application/ld+json">{JSON.stringify(serviceLd)}</script>
        <script type="application/ld+json">{JSON.stringify(breadcrumbLd)}</script>
        {faqLd && <script type="application/ld+json">{JSON.stringify(faqLd)}</script>}
      </Helmet>

      <main className="pt-40 pb-24 px-6">
        <article className="max-w-5xl mx-auto grid lg:grid-cols-[1fr,280px] gap-10">
          <div>
            <Breadcrumbs title={title} />
            <div className="flex items-center gap-4 mb-3">
              {Icon && (
                <span className="inline-flex p-3 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10">
                  <Icon className="w-7 h-7 text-blue-300" />
                </span>
              )}
              <h1 className="text-4xl md:text-5xl font-black leading-tight">
                <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                  {title}
                </span>
              </h1>
            </div>
            <p className="text-lg text-gray-400 mb-6 italic">{meta}</p>

            {!!heroPoints.length && (
              <ul className="grid sm:grid-cols-2 gap-3 mb-10">
                {heroPoints.map((b, i) => (
                  <li key={i} className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-gray-900/70 to-black/70 border border-gray-800/60">
                    <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-100">{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {/* Custom content slot (e.g., animated diagram) */}
            {children}

            <div className="space-y-10">
              {sections.map(sec => (
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

            {!!faqs.length && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-4">FAQs</h2>
                <div className="space-y-3">
                  {faqs.map((f, i) => (
                    <details key={i} className="rounded-xl border border-white/10 p-4 bg-white/5">
                      <summary className="font-semibold cursor-pointer">{f.q}</summary>
                      <p className="text-gray-200 mt-2">{f.a}</p>
                    </details>
                  ))}
                </div>
              </section>
            )}

            <div className="mt-12 flex flex-wrap items-center gap-4">
              <Link
                to={`/contact?service=${slug}`}
                className="group relative inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
                <span className="relative">{ctaText}</span>
              </Link>
              <Link to="/services" className="text-gray-400 hover:text-white underline">Back to Services</Link>
            </div>
          </div>

          <aside className="hidden lg:block">
            <div className="sticky top-32 space-y-6">
              {!!sections.length && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="font-semibold mb-3">Contents</h3>
                  <ul className="space-y-2 text-sm">
                    {sections.map(sec => (
                      <li key={sec.id}>
                        <a href={`#${sec.id}`} className="text-gray-300 hover:text-white">{sec.heading}</a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {!!related.length && (
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  <h3 className="font-semibold mb-3">Related services</h3>
                  <ul className="space-y-2 text-sm">
                    {related.map(r => (
                      <li key={r.path}>
                        <Link to={r.path} className="text-blue-300 hover:text-white">{r.title}</Link>
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
