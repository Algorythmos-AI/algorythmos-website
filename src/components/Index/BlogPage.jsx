import React from "react";
import { PenTool, Shield, Cpu, Layers } from "lucide-react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    icon: Shield,
    title: "GDPR & AI: What SMEs Need to Know",
    snippet: "How to ensure your AI systems are GDPR-ready and compliant with the upcoming EU AI Act.",
    date: "Aug 2025",
    gradient: "from-blue-500 to-purple-500",
    link: "/blog/gdpr-ai"
  },
  {
    icon: Cpu,
    title: "MLOps: From Prototype to Production",
    snippet: "Best practices for scaling AI securely using CI/CD pipelines, Docker, and Kubernetes.",
    date: "Jul 2025",
    gradient: "from-pink-500 to-rose-500",
    link: "/blog/mlops-production"
  },
  {
    icon: Layers,
    title: "Agentic AI: Moving Beyond Chatbots",
    snippet: "Why the future of AI lies in multi-step, goal-driven automation rather than simple Q&A bots.",
    date: "Jun 2025",
    gradient: "from-green-500 to-emerald-500",
    link: "/blog/agentic-ai"
  },
  {
    icon: PenTool,
    title: "LLMSecOps: Securing Large Language Models",
    snippet: "Introducing LLMSecOps — a lifecycle approach to safe, trustworthy AI adoption.",
    date: "May 2025",
    gradient: "from-yellow-500 to-orange-500",
    link: "/blog/llmsecops"
  }
];

const BlogPage = () => {
  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      <main className="pt-40 pb-20 px-6 max-w-6xl mx-auto text-center">
        <h1 className="text-6xl font-black mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          Blog
        </h1>
        <p className="text-2xl text-gray-300 mb-16 leading-relaxed">
          Insights, frameworks, and strategies from the Algorythmos team on AI, security, and data innovation.
        </p>

        <div className="grid md:grid-cols-2 gap-12">
          {blogPosts.map((post, index) => {
            const Icon = post.icon;
            return (
              <Link
                key={index}
                to={post.link}
                className="group relative p-8 bg-gradient-to-br from-gray-900/60 to-black/60 rounded-3xl 
                border border-gray-800/50 hover:border-white/20 backdrop-blur-xl transition-all duration-700 
                transform hover:scale-105 hover:-translate-y-4 overflow-hidden"
              >
                <div className={`absolute inset-0 bg-gradient-to-br ${post.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-700`} />
                <div className="relative z-10 text-left">
                  <div className={`inline-flex p-4 bg-gradient-to-br ${post.gradient} rounded-2xl mb-6`}>
                    <Icon className="w-10 h-10" />
                  </div>
                  <h3 className="text-2xl font-bold mb-2">{post.title}</h3>
                  <p className="text-gray-400 mb-4">{post.snippet}</p>
                  <span className="text-sm text-gray-500">{post.date}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default BlogPage;
