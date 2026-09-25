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
 * Spam defences (no third-party service): a hidden honeypot field, a minimum
 * fill-time check, and a best-effort per-IP rate limit. The rate limit is held in
 * instance memory, so on Fluid Compute it is shared only within one instance —
 * it blunts bursts but is not a guarantee.
 */
import nodemailer from 'nodemailer';

const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_MAX = 5;
const MIN_FILL_MS = 3000;
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
const esc = (s) => String(s).replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' })[c]);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ ok: false, error: 'Method not allowed' });
  }
  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};
    const name = String(body.name || '').trim();
    const email = String(body.email || '').trim();
    const message = String(body.message || '').trim();
    const company = String(body.company || '').trim();
    // Attribution context (optional, first-party only) — capped so it can't bloat the email.
    const locale = String(body.locale || '').trim().slice(0, 10);
    const utm = String(body.utm || '').trim().slice(0, 300);
    const honeypot = String(body.website || '').trim();
    const startedAt = Number(body.ts || 0);

    // Bots fill every field and submit instantly; humans do neither. Pretend success
    // so the bot learns nothing, but deliver nothing.
    if (honeypot || (startedAt > 0 && Date.now() - startedAt < MIN_FILL_MS)) {
      return res.status(200).json({ ok: true, delivered: false });
    }

    const ip = String(req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '').split(',')[0].trim();
    if (ip && rateLimited(ip)) {
      return res.status(429).json({ ok: false, error: 'Too many requests' });
    }

    if (name.length < 2 || !EMAIL_RE.test(email) || message.length < 10) {
      return res.status(400).json({ ok: false, error: 'Invalid input' });
    }

    const {
      ZOHO_SMTP_HOST = 'smtp.zoho.com.au',
      ZOHO_SMTP_PORT = '465',
      ZOHO_SMTP_USER,
      ZOHO_SMTP_PASS,
      CONTACT_TO,
    } = process.env;

    if (!ZOHO_SMTP_USER || !ZOHO_SMTP_PASS) {
      console.error('[contact] SMTP not configured — enquiry rejected so the visitor can email directly:', { name, email, company });
      return res.status(503).json({ ok: false, error: 'Contact form not configured' });
    }

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
      replyTo: `"${name}" <${email}>`,
      subject: `New enquiry — ${name}${company ? ` (${company})` : ''}`,
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || '—'}\nLocale: ${locale || '—'}\nSource: ${utm || '—'}\n\n${message}`,
      html: `<table style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6">
        <tr><td><strong>Name</strong></td><td>${esc(name)}</td></tr>
        <tr><td><strong>Email</strong></td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        <tr><td><strong>Company</strong></td><td>${esc(company) || '—'}</td></tr>
        <tr><td><strong>Locale</strong></td><td>${esc(locale) || '—'}</td></tr>
        <tr><td><strong>Source</strong></td><td>${esc(utm) || '—'}</td></tr>
      </table><hr><p style="white-space:pre-wrap;font-family:system-ui,sans-serif;font-size:15px;line-height:1.6">${esc(message)}</p>`,
    });

    return res.status(200).json({ ok: true, delivered: true });
  } catch (e) {
    console.error('[contact] send failed:', e);
    return res.status(502).json({ ok: false, error: 'Delivery failed' });
  }
}
