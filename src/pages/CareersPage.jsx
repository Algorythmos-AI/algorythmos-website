import React from 'react';
import {
  Globe2,
  Users,
  TrendingUp,
  Heart,
  BookOpen,
  Zap,
  Mail,
  MapPin,
} from 'lucide-react';
import { useI18n } from '../app/i18n/I18nContext.jsx';
import { RegionHelmet } from '../app/seo';
import SeoBreadcrumbs from '../app/seo/SeoBreadcrumbs.jsx';
import ScrollReveal from '../components/ui/ScrollReveal.jsx';

const values = [
  { icon: Zap, key: 'impact' },
  { icon: BookOpen, key: 'rigor' },
  { icon: Users, key: 'partnership' },
  { icon: Globe2, key: 'remote' },
];

const benefits = [
  'compensation',
  'remote',
  'learning',
  'hardware',
  'health',
  'pto',
  'research',
  'mentorship',
];

const locations = [
  { key: 'london' },
  { key: 'sydney' },
  { key: 'remote' },
];

const CareersPage = () => {
  const { t, region } = useI18n();

  return (
    <div className="min-h-screen bg-[#020617] text-white">
      <RegionHelmet region={region} />
      <SeoBreadcrumbs items={[{ name: "Home", path: "/" }, { name: t('careers.breadcrumb'), path: "/careers" }]} />

      {/* Hero */}
      <section className="pt-32 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-violet-600/10 via-transparent to-transparent" />
        <div className="max-w-4xl mx-auto text-center relative z-10">
          <span className="inline-block px-4 py-1.5 rounded-full bg-violet-500/10 border border-violet-500/20 text-violet-400 text-sm font-medium mb-6">
            {t('careers.hero.eyebrow')}
          </span>
          <h1 className="text-4xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-white to-gray-400 bg-clip-text text-transparent">
            {t('careers.hero.title')}
          </h1>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            {t('careers.hero.description')}
          </p>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center mb-16">{t('careers.values.title')}</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {values.map(({ icon: Icon, key }) => (
              <ScrollReveal key={key}>
                <article className="p-8 rounded-2xl border border-white/5 bg-slate-900/40 backdrop-blur-md hover:border-violet-500/30 transition-all duration-300">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-indigo-500/20 flex items-center justify-center mb-5">
                    <Icon size={24} strokeWidth={1.5} aria-hidden="true" className="text-violet-400" />
                  </div>
                  <h3 className="text-xl font-bold mb-3">{t(`careers.values.${key}.title`)}</h3>
                  <p className="text-gray-400 leading-relaxed">{t(`careers.values.${key}.body`)}</p>
                </article>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center mb-12">{t('careers.benefits.title')}</h2>
          </ScrollReveal>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {benefits.map((key) => (
              <li key={key} className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <Heart size={18} strokeWidth={1.5} aria-hidden="true" className="text-rose-400 mt-0.5 shrink-0" />
                <span className="text-gray-300">{t(`careers.benefits.${key}`)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Locations */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-center mb-12">{t('careers.locations.title')}</h2>
          </ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {locations.map(({ key }) => (
              <div key={key} className="flex items-center gap-4 p-6 rounded-2xl border border-white/5 bg-slate-900/40">
                <MapPin size={20} strokeWidth={1.5} aria-hidden="true" className="text-violet-400 shrink-0" />
                <div>
                  <h3 className="font-bold">{t(`careers.locations.${key}.city`)}</h3>
                  <p className="text-sm text-gray-500">{t(`careers.locations.${key}.country`)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-20 px-6 bg-slate-900/30">
        <div className="max-w-3xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-3xl font-bold mb-8">{t('careers.roles.title')}</h2>
          </ScrollReveal>
          <div className="p-10 rounded-3xl border border-white/10 bg-gradient-to-br from-violet-500/5 to-indigo-500/5">
            <TrendingUp size={32} strokeWidth={1.5} aria-hidden="true" className="text-violet-400 mx-auto mb-6" />
            <h3 className="text-xl font-bold mb-4">{t('careers.roles.noRoles.title')}</h3>
            <p className="text-gray-400 mb-8 leading-relaxed max-w-xl mx-auto">
              {t('careers.roles.noRoles.description')}
            </p>
            <a
              href="mailto:careers@algorythmos.com?subject=Talent%20Network%20—%20Expression%20of%20Interest"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-semibold transition-all duration-200 shadow-lg shadow-violet-500/20"
            >
              <Mail size={18} strokeWidth={1.5} aria-hidden="true" />
              {t('careers.roles.noRoles.cta')}
            </a>
          </div>
        </div>
      </section>

      {/* EEO */}
      <section className="py-12 px-6 border-t border-white/5">
        <div className="max-w-3xl mx-auto">
          <p className="text-xs text-gray-600 text-center leading-relaxed">
            {t('careers.eeo')}
          </p>
        </div>
      </section>
    </div>
  );
};

export default CareersPage;
