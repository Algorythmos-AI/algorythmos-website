import React, { useEffect, useState } from "react";
import { readStoredUtm } from "../lib/utm";

export default function ContactForm() {
  const [utm, setUtm] = useState({});
  
  useEffect(() => {
    setUtm(readStoredUtm());
  }, []);

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

      {/* Hidden attribution fields */}
      <input type="hidden" name="utm_source" value={utm.utm_source || "pricing"} />
      <input type="hidden" name="utm_medium" value={utm.utm_medium || "cta"} />
      <input type="hidden" name="utm_campaign" value={utm.utm_campaign || "discovery"} />
      <input type="hidden" name="utm_content" value={utm.utm_content || "unknown"} />
      <input type="hidden" name="gclid" value={utm.gclid || ""} />
      <input type="hidden" name="fbclid" value={utm.fbclid || ""} />

      <button 
        type="submit"
        className="w-full rounded-xl bg-gradient-to-r from-[#6D00FF] via-[#7658E7] to-[#3715E0] px-4 py-2 font-semibold text-white shadow-brand focus:outline-none focus:ring-4 focus:ring-violet-500/40"
      >
        Send Message
      </button>
    </form>
  );
}
