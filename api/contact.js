/**
 * Vercel serverless function — contact form handler.
 * Open-source mail via Nodemailer → your Zoho Mail SMTP (no third-party SaaS).
 * Keeps the Astro site fully static; SMTP creds stay server-side.
 *
 * Configure in Vercel → Settings → Environment Variables:
 *   ZOHO_SMTP_HOST   (default smtp.zoho.com.au — your account is on the .com.au DC)
 *   ZOHO_SMTP_PORT   (default 465, SSL)
 *   ZOHO_SMTP_USER   a real mailbox, e.g. noreply@algorythmos.com  (the SMTP login)
 *   ZOHO_SMTP_PASS   a Zoho *app-specific password* for that mailbox (Security → App Passwords)
 *   CONTACT_TO       where enquiries land, e.g. contact@algorythmos.com (defaults to ZOHO_SMTP_USER)
 * Until configured, submissions are REJECTED (503) so the visitor sees an error and
 * emails directly — an enquiry must never be silently dropped.
 *
 * Abuse handling without losing real enquiries:
 *   - Only a filled honeypot gets the fake "success" reply. A fast or untimed
 *     submission (clock-free `elapsedMs` from the page, or none at all from a
 *     no-JS post or an old cached page) is still delivered, flagged [unverified].
 *   - Cross-site browser posts are refused: a present Origin must match the Host.
 *   - Only JSON (the page script) and urlencoded (the no-JS form post) bodies are
 *     accepted; a no-JS post gets a small localised HTML reply instead of JSON.
 *   - Field lengths are capped, and a best-effort per-IP rate limit is held in
 *     instance memory (shared only within one Fluid Compute instance).
 *   - Logs never include the visitor's name, email, company or message.
 */
import nodemailer from 'nodemailer';

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
/** A human takes longer than this to fill the form; faster submissions are flagged, not dropped. */
export const MIN_FILL_MS = 3000;
/** Server-side caps; the form's maxlength attributes match these. */
export const LIMITS = { name: 200, email: 254, company: 200, message: 5000 };
/** Must equal BUSINESS.email in src/data/business.ts (asserted in src/lib/contact.test.ts). */
export const FALLBACK_EMAIL = 'info@algorythmos.com.au';
/**
 * Strings for the no-JS reply page. Kept inline so the function stays tiny;
 * src/lib/contact.test.ts asserts they equal the dictionary values.
 */
export const NOJS_COPY = {
  en: {
    lang: 'en-AU',
    home: '/au-en/contact',
    success: 'Message sent successfully!',
    error: 'Something went wrong — please email {email} directly.',
    back: 'Back to the contact page',
  },
  fr: {
    lang: 'fr-FR',
    home: '/fr-fr/contact',
    success: 'Message envoyé avec succès !',
    error: "Une erreur s'est produite — veuillez nous écrire directement à {email}.",
    back: 'Retour à la page de contact',
  },
};

/** @type {Map<string, number[]>} */
const hits = new Map();
function rateLimited(ip) {
  const now = Date.now();
  const recent = (hits.get(ip) || []).filter((t) => now - t < RATE_WINDOW_MS);
  recent.push(now);
  hits.set(ip, recent);
  if (hits.size > 5000) hits.clear(); // crude memory cap
  return recent.length > RATE_MAX;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const ESCAPES = { '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&#39;' };
/** HTML-escape for text and attribute contexts. */
export const esc = (s) => String(s).replace(/[<>&"']/g, (c) => ESCAPES[c]);

/** Error details that are safe to log: never the message text, never visitor data. */
const safeError = (e) => ({ name: e?.name, code: e?.code, responseCode: e?.responseCode });

/** A present Origin must be this site; a missing one (non-browser or no-JS post) is allowed. */
function originAllowed(req) {
  const origin = req.headers.origin;
  if (origin === undefined) return true;
  if (origin === 'null') return false;
  const host = req.headers['x-forwarded-host'] || req.headers.host;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}

function readBody(req, isJson) {
  const raw = req.body; // Vercel parses lazily and throws on malformed JSON
  if (raw == null || raw === '') return {};
  if (typeof raw === 'object') return raw;
  if (isJson) return JSON.parse(raw);
  return Object.fromEntries(new URLSearchParams(String(raw)));
}

function noJsPage(localeTag, ok) {
  const c = String(localeTag).toLowerCase().startsWith('fr') ? NOJS_COPY.fr : NOJS_COPY.en;
  const text = ok ? c.success : c.error.replace('{email}', FALLBACK_EMAIL);
  return `<!doctype html><html lang="${c.lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex"><title>Algorythmos</title></head><body style="font-family:system-ui,sans-serif;max-width:36rem;margin:4rem auto;padding:0 1rem;line-height:1.6"><p>${esc(text)}</p><p><a href="${c.home}">${esc(c.back)}</a></p></body></html>`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }

  const contentType = String(req.headers['content-type'] || '').toLowerCase();
  const isJson = contentType.startsWith('application/json');
  const isForm = contentType.startsWith('application/x-www-form-urlencoded');
  if (!isJson && !isForm) {
    return res.status(415).json({ ok: false, error: 'unsupported_media_type' });
  }
  if (!originAllowed(req)) {
    return res.status(403).json({ ok: false, error: 'forbidden_origin' });
  }

  let body;
  try {
    body = readBody(req, isJson);
  } catch {
    return res.status(400).json({ ok: false, error: 'bad_json' });
  }

  const name = String(body.name || '').trim();
  const email = String(body.email || '').trim();
  const message = String(body.message || '').trim();
  const company = String(body.company || '').trim();
  // Attribution context (optional, first-party only) — capped so it can't bloat the email.
  const locale = String(body.locale || '').trim().slice(0, 10);
  const utm = String(body.utm || '').trim().slice(0, 300);
  // `website` is the old honeypot name, still honoured for pages cached before the rename.
  const honeypot = String(body.leave_blank || body.website || '').trim();
  const elapsedMs = Number(body.elapsedMs);

  /** JSON for the page script; a small HTML page for a no-JS form post. */
  const reply = (status, json, ok = false) => {
    if (isForm) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(status).send(noJsPage(locale, ok));
    }
    return res.status(status).json(json);
  };

  // A filled honeypot is a bot: pretend success so it learns nothing, deliver nothing.
  if (honeypot) return reply(200, { ok: true, delivered: false }, true);

  const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
  if (ip && rateLimited(ip)) return reply(429, { ok: false, error: 'Too many requests' });

  for (const [field, max] of Object.entries(LIMITS)) {
    const value = { name, email, company, message }[field];
    if (value.length > max) return reply(400, { ok: false, error: 'too_long', field, max });
  }
  if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 10) {
    return reply(400, { ok: false, error: 'Invalid input' });
  }

  const {
    ZOHO_SMTP_HOST = 'smtp.zoho.com.au',
    ZOHO_SMTP_PORT = '465',
    ZOHO_SMTP_USER,
    ZOHO_SMTP_PASS,
    CONTACT_TO,
  } = process.env;

  if (!ZOHO_SMTP_USER || !ZOHO_SMTP_PASS) {
    console.error('[contact] SMTP not configured — enquiry rejected (503) so the visitor can email directly');
    return reply(503, { ok: false, error: 'Contact form not configured' });
  }

  // Too fast, or untimed (no-JS post, old cached page): still delivered, but flagged.
  const unverified = !(Number.isFinite(elapsedMs) && elapsedMs >= MIN_FILL_MS);

  try {
    const port = Number(ZOHO_SMTP_PORT);
    const transporter = nodemailer.createTransport({
      host: ZOHO_SMTP_HOST,
      port,
      secure: port === 465, // 465 = implicit SSL; 587 = STARTTLS
      auth: { user: ZOHO_SMTP_USER, pass: ZOHO_SMTP_PASS },
    });

    await transporter.sendMail({
      // `from` must be the authenticated Zoho mailbox (or one of its verified aliases)
      from: `"Algorythmos Website" <${ZOHO_SMTP_USER}>`,
      to: CONTACT_TO || ZOHO_SMTP_USER,
      replyTo: { name, address: email },
      subject: `${unverified ? '[unverified] ' : ''}New enquiry — ${name}${company ? ` (${company})` : ''}`,
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || '—'}\nLocale: ${locale || '—'}\nSource: ${utm || '—'}${unverified ? '\nCheck: submitted faster than a person usually types, or without the page script' : ''}\n\n${message}`,
      html: `<table style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6">
        <tr><td><strong>Name</strong></td><td>${esc(name)}</td></tr>
        <tr><td><strong>Email</strong></td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        <tr><td><strong>Company</strong></td><td>${esc(company) || '—'}</td></tr>
        <tr><td><strong>Locale</strong></td><td>${esc(locale) || '—'}</td></tr>
        <tr><td><strong>Source</strong></td><td>${esc(utm) || '—'}</td></tr>${unverified ? '\n        <tr><td><strong>Check</strong></td><td>Submitted faster than a person usually types, or without the page script</td></tr>' : ''}
      </table><hr><p style="white-space:pre-wrap;font-family:system-ui,sans-serif;font-size:15px;line-height:1.6">${esc(message)}</p>`,
    });

    return reply(200, { ok: true, delivered: true }, true);
  } catch (e) {
    console.error('[contact] send failed:', safeError(e));
    return reply(502, { ok: false, error: 'Delivery failed' });
  }
}
