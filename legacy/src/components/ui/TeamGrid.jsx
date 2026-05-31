// src/components/Index/TeamGrid.jsx
import React from "react";
import { Linkedin, Github, Twitter as XIcon, Sparkles } from "lucide-react";
import { TEAM } from "../../data/team";
import { useInView } from "../../app/utils/useInView";
import { useI18n } from "../../app/i18n/I18nContext";

// Resolve images from src/assets/team/* at build time (Vite)
const images = import.meta.glob("/src/assets/team/*.{jpg,jpeg,png,webp}", {
  eager: true,
  as: "url",
});

function resolveImage(filename) {
  // filename like "sam-kalaliya.jpg"
  const entry = Object.entries(images).find(([path]) =>
    path.endsWith(`/team/${filename}`)
  );
  return entry ? entry[1] : null;
}

const RolePill = ({ children }) => (
  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full
    text-[11px] md:text-xs font-semibold text-white
    bg-gradient-to-r from-[#6D00FF] via-[#7658E7] to-[#3715E0]
    ring-1 ring-white/10 shadow-[0_0_0_1px_rgba(255,255,255,0.04)]
    hover:shadow-[0_0_24px_0_rgba(118,88,231,0.25)]
    transition-shadow">
    <Sparkles className="size-3.5 md:size-4 opacity-90" />
    {children}
  </span>
);

const Card = ({ person, index, t }) => {
  const [ref, isInView] = useInView({ threshold: 0.3, once: true });
  const imgUrl = resolveImage(person.image);
  
  // Check for reduced motion preference
  const prefersReducedMotion = typeof window !== 'undefined' 
    && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

  return (
    <article
      ref={ref}
      className={`group relative rounded-3xl bg-white/5 ring-1 ring-white/10 p-6 md:p-8 flex flex-col gap-4 hover:-translate-y-0.5 transition-all duration-500 ${
        prefersReducedMotion ? 'opacity-100' : 'animate-on-scroll'
      } ${isInView ? 'in-view' : ''}`}
      style={{ transitionDelay: prefersReducedMotion ? '0ms' : `${index * 50}ms` }}
      itemScope
      itemType="https://schema.org/Person"
    >
      {/* glow */}
      <div className="pointer-events-none absolute -inset-6 -z-10 rounded-[2rem] opacity-50 blur-3xl mix-blend-screen"
           style={{ background: "radial-gradient(120px 120px at 20% 10%, #6D00FF55, transparent 60%), radial-gradient(140px 140px at 80% 80%, #7658E755, transparent 60%)" }} />

      {/* photo */}
      <div className="relative aspect-square w-28 h-28 md:w-32 md:h-32 rounded-2xl overflow-hidden ring-1 ring-white/10">
        {imgUrl ? (
          <img
            src={imgUrl}
            alt={t("team.photo.alt", { name: person.name })}
            loading="lazy"
            className="size-full object-cover"
            itemProp="image"
          />
        ) : (
          <div className="size-full grid place-items-center bg-gradient-to-br from-[#6D00FF1a] to-[#7658E71a] text-white/70 text-3xl font-semibold">
            {person.name
              .split(" ")
              .map((w) => w[0])
              .slice(0, 2)
              .join("")}
          </div>
        )}
      </div>

      {/* text */}
      <div className="relative">
        {/* soft scrim behind text to guarantee contrast */}
        <div className="pointer-events-none absolute -inset-x-3 -inset-y-2 rounded-2xl bg-black/10 backdrop-blur-[1px]" />
        <div className="relative space-y-2">
          <h3 className="text-xl md:text-2xl font-semibold tracking-tight text-white drop-shadow-[0_1px_0_rgba(0,0,0,.5)]" itemProp="name">
            {person.name}
          </h3>

          <div className="flex flex-wrap items-center gap-2">
            <RolePill itemProp="jobTitle">{t(person.roleKey)}</RolePill>
            {person.taglineKey && (
              <span className="text-xs md:text-sm text-slate-300/90">{t(person.taglineKey)}</span>
            )}
          </div>

          {person.blurbKey && (
            <p className="pt-1.5 text-xs md:text-sm leading-relaxed text-slate-300/80">
              {t(person.blurbKey)}
            </p>
          )}
        </div>
      </div>

      {/* social */}
      <div className="pt-2 flex items-center gap-3">
        {person.links?.linkedin && person.links.linkedin !== "#" && (
          <a href={person.links.linkedin} target="_blank" rel="noreferrer"
             aria-label={t("ui.aria.openOnLinkedIn").replace("{name}", person.name)}
             className="p-2 rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition">
            <Linkedin className="size-4 md:size-5 text-white/80" />
          </a>
        )}
        {person.links?.github && person.links.github !== "#" && (
          <a href={person.links.github} target="_blank" rel="noreferrer"
             aria-label={t("ui.aria.openOnGitHub").replace("{name}", person.name)}
             className="p-2 rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition">
            <Github className="size-4 md:size-5 text-white/80" />
          </a>
        )}
        {person.links?.x && person.links.x !== "#" && (
          <a href={person.links.x} target="_blank" rel="noreferrer"
             aria-label={t("ui.aria.openOnX").replace("{name}", person.name)}
             className="p-2 rounded-full bg-white/5 ring-1 ring-white/10 hover:bg-white/10 transition">
            <XIcon className="size-4 md:size-5 text-white/80" />
          </a>
        )}
      </div>
    </article>
  );
};

export default function TeamGrid() {
  const { t } = useI18n();

  return (
    <section aria-labelledby="team" className="relative">
      <h2 id="team" className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-center text-white">
        {t("ui.team.title.prefix")} <span className="text-[#7658E7]">{t("ui.team.title.highlight")}</span>
      </h2>
      <p className="mt-4 text-base md:text-lg text-slate-300/90 text-center max-w-3xl mx-auto">
        {t("ui.team.subtitle")}
      </p>

      <div className="mt-10 md:mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
        {TEAM.map((p, i) => (
          <Card key={p.slug} person={p} index={i} t={t} />
        ))}
      </div>
    </section>
  );
}
