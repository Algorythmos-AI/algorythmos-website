// src/components/GlobalCtaTracker.jsx
import React, { useEffect } from "react";
import { recordLastCta } from "../lib/utm";

export default function GlobalCtaTracker() {
  useEffect(() => {
    const onClick = (e) => {
      const el = e.target.closest("[data-cta]");
      if (!el) return;
      const id = el.getAttribute("data-cta");
      if (id) recordLastCta(id);
    };
    
    document.addEventListener("click", onClick);
    return () => document.removeEventListener("click", onClick);
  }, []);

  // This component doesn't render anything
  return null;
}
