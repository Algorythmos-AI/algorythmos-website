import { useParams } from "react-router-dom";
import { Helmet } from "react-helmet-async";
import { CheckCircle } from "lucide-react";

const caseStudies = {
  "financial-compliance": {
    title: "AI in Financial Services – Compliance Automation",
    meta: "AI compliance automation in financial services. Faster reporting, fewer errors, 40% cost savings.",
    challenge: "Manual compliance reporting took days and was error-prone.",
    solution: "We deployed an AI-powered compliance engine with automated validation and integration into client systems.",
    results: [
      "Reports generated in minutes",
      "99% accuracy",
      "40% cost savings",
    ],
    cta: "Contact Algorythmos to explore AI for compliance automation.",
  },
  "manufacturing-docs": {
    title: "AI Automation in Manufacturing – Document Intelligence",
    meta: "AI document intelligence in manufacturing. Faster invoice processing, fewer errors, automated validation.",
    challenge: "Processing thousands of invoices manually caused backlogs and errors.",
    solution:
      "We deployed OCR + NLP to extract fields, validate SKUs, and automate approvals with human-in-the-loop checks.",
    results: [
      "50% less manual effort",
      "30% better data accuracy",
      "2x faster invoice cycle",
    ],
    cta: "Contact Algorythmos to explore AI for manufacturing operations.",
  },
  "healthcare-mlops": {
    title: "AI for Healthcare – MLOps Platform Engineering",
    meta: "MLOps in healthcare. Deploy AI models faster with CI/CD and compliance.",
    challenge: "Healthcare models stalled moving from prototype to production.",
    solution:
      "We added CI/CD pipelines with data validation, versioning, drift detection, and compliance monitoring.",
    results: [
      "60% faster deployments",
      "50% fewer failures",
      "Traceable model lifecycle",
    ],
    cta: "Contact Algorythmos to explore MLOps for healthcare.",
  },
  "retail-sql": {
    title: "AI for Retail Analytics – SQL Dashboards",
    meta: "Retail analytics with AI dashboards. Real-time KPIs and demand insights.",
    challenge: "Retailers lacked unified demand visibility across regions.",
    solution:
      "We built SQL dashboards with demand forecasting, promotion analysis, and real-time store-level KPIs.",
    results: [
      "15% revenue uplift",
      "Faster planning cycles",
      "Consistent multi-region metrics",
    ],
    cta: "Contact Algorythmos to explore AI for retail analytics.",
  },
};

export default function CaseStudyPage() {
  const { slug } = useParams();
  const study = caseStudies[slug];

  if (!study) {
    return (
      <div className="min-h-screen bg-black text-white">
        <main className="pt-40 pb-20 px-6 max-w-3xl mx-auto text-center">
          <h1 className="text-4xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
            Case study not found
          </h1>
          <p className="text-gray-400">We couldn't find the case study you requested.</p>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Optional subtle backdrop to ensure navbar appears dark */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-purple-900/10 to-black" />
      </div>

      {/* ✅ Dynamic SEO tags */}
      <Helmet>
        <title>{study.title} | Algorythmos</title>
        <meta name="description" content={study.meta} />
        <meta property="og:title" content={study.title} />
        <meta property="og:description" content={study.meta} />
        <meta property="og:type" content="article" />
        <meta property="og:url" content={`https://algorythmos.fr/case-studies/${slug}`} />
      </Helmet>

      <main className="pt-40 pb-24 px-6">
        <article className="max-w-3xl mx-auto">
          {/* Title */}
          <h1 className="text-4xl md:text-5xl font-black mb-4 leading-tight">
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              {study.title}
            </span>
          </h1>

          {/* Meta/Subtitle */}
          <p className="text-lg text-gray-400 mb-10 italic">
            {study.meta}
          </p>

          {/* Challenge */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-3">Challenge</h2>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/60 to-black/60 border border-gray-800/50">
              <p className="text-gray-200 leading-relaxed">{study.challenge}</p>
            </div>
          </section>

          {/* Solution */}
          <section className="mb-10">
            <h2 className="text-2xl font-bold mb-3">Solution</h2>
            <div className="p-6 rounded-2xl bg-gradient-to-br from-gray-900/60 to-black/60 border border-gray-800/50">
              <p className="text-gray-200 leading-relaxed">{study.solution}</p>
            </div>
          </section>

          {/* Results */}
          <section className="mb-12">
            <h2 className="text-2xl font-bold mb-4">Results</h2>
            <ul className="space-y-3">
              {study.results.map((r, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 p-4 rounded-xl bg-gradient-to-br from-gray-900/70 to-black/70 border border-gray-800/60"
                >
                  <CheckCircle className="w-6 h-6 text-green-400 flex-shrink-0 mt-0.5" />
                  <span className="text-gray-100">{r}</span>
                </li>
              ))}
            </ul>
          </section>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <a
              href="/contact"
              className="group relative inline-flex items-center justify-center px-8 py-4 rounded-2xl font-semibold text-lg bg-gradient-to-r from-blue-600 to-purple-600 overflow-hidden"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
              <span className="relative">Book a Consultation</span>
            </a>
            <span className="text-gray-400">
              {study.cta}
            </span>
          </div>
        </article>
      </main>
    </div>
  );
}
