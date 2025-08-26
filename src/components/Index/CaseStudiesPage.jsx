import React from "react";
import { BarChart2, FileText, Zap, Users } from "lucide-react";
import { Link } from "react-router-dom";

const caseStudies = [
  {
    icon: BarChart2,
    title: "Financial Services – Compliance Automation",
    challenge: "Manual compliance reporting took days and was error-prone.",
    solution: "We deployed an AI-powered compliance engine integrated with client systems.",
    result: "Reports generated in minutes with 99% accuracy, saving 40% in costs.",
    gradient: "from-blue-500 to-purple-500",
    link: "/case-studies/financial-compliance"
  },
  {
    icon: FileText,
    title: "Manufacturing – Document Intelligence",
    challenge: "Processing thousands of invoices manually slowed operations.",
    solution: "OCR + NLP pipeline for automated invoice and contract extraction.",
    result: "Cut manual effort by 50% and improved data accuracy by 30%.",
    gradient: "from-pink-500 to-rose-500",
    link: "/case-studies/manufacturing-docs"
  },
  {
    icon: Zap,
    title: "Healthcare – MLOps & CI/CD",
    challenge: "AI models took weeks to move from prototype to production.",
    solution: "Implemented CI/CD pipelines with Docker, Kubernetes & GitHub Actions.",
    result: "Deployment time reduced by 60%, downtime cut in half.",
    gradient: "from-green-500 to-emerald-500",
    link: "/case-studies/healthcare-mlops"
  },
  {
    icon: Users,
    title: "Retail – SQL Dashboards",
    challenge: "Leaders lacked visibility across multi-region operations.",
    solution: "Real-time SQL dashboards integrated with ERP & CRM systems.",
    result: "Decision-making accelerated, boosting revenue by 15%.",
    gradient: "from-yellow-500 to-orange-500",
    link: "/case-studies/retail-sql"
  }
];

const CaseStudiesPage = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <main className="pt-40 pb-20 px-6 max-w-6xl mx-auto text-center">
        <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Case Studies
        </h1>
        <p className="text-2xl text-gray-300 mb-16 leading-relaxed">
          Discover how Algorythmos has helped enterprises unlock measurable ROI 
          with practical, secure AI solutions.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {caseStudies.map((study, index) => {
            const Icon = study.icon;
            return (
              <Link
                key={index}
                to={study.link}
                className="group relative p-10 bg-gradient-to-br from-gray-900/60 to-black/60 rounded-3xl 
                border border-gray-800/50 hover:border-white/20 backdrop-blur-xl transition-all duration-700 
                transform hover:scale-105 hover:-translate-y-4 overflow-hidden block text-left"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${study.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />
                <div className="relative z-10">
                  <div className={`inline-flex p-4 bg-gradient-to-br ${study.gradient} rounded-2xl mb-6`}>
                    <Icon className="w-12 h-12" />
                  </div>
                  <h3 className="text-3xl font-bold mb-4">{study.title}</h3>
                  <p className="text-lg text-gray-400"><strong>Challenge:</strong> {study.challenge}</p>
                  <p className="text-lg text-gray-400"><strong>Solution:</strong> {study.solution}</p>
                  <p className="text-lg text-gray-400"><strong>Result:</strong> {study.result}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default CaseStudiesPage;
