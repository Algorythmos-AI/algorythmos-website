import React from "react";
import HiddenUtmFields from "./Index/HiddenUtmFields";

export default function ContactForm() {
  return (
    <form method="post" action="/api/contact" className="space-y-4">
      {/* Visible form fields */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-slate-200">
          Name
        </label>
        <input
          type="text"
          id="name"
          name="name"
          required
          className="mt-1 w-full rounded-xl bg-slate-900/60 px-3 py-2 text-slate-100 ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div>
        <label htmlFor="email" className="block text-sm font-medium text-slate-200">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="mt-1 w-full rounded-xl bg-slate-900/60 px-3 py-2 text-slate-100 ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      <div>
        <label htmlFor="message" className="block text-sm font-medium text-slate-200">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={4}
          required
          className="mt-1 w-full rounded-xl bg-slate-900/60 px-3 py-2 text-slate-100 ring-1 ring-slate-700 focus:outline-none focus:ring-2 focus:ring-violet-500"
        />
      </div>

      {/* Hidden UTM fields with last-CTA attribution */}
      <HiddenUtmFields defaults={{ utm_source: "website", utm_medium: "form" }} />

      <button 
        type="submit"
        className="w-full rounded-xl bg-gradient-to-r from-[#6D00FF] via-[#7658E7] to-[#3715E0] px-4 py-2 font-semibold text-white shadow-brand focus:outline-none focus:ring-4 focus:ring-violet-500/40"
      >
        Send Message
      </button>
    </form>
  );
}
