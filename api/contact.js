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
 * Until configured, submissions are accepted (202) and logged so the UX works.
 */
import nodemailer from 'nodemailer';

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
      console.warn('[contact] Zoho SMTP not configured — message not delivered:', { name, email, company });
      return res.status(202).json({ ok: true, delivered: false });
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
      text: `Name: ${name}\nEmail: ${email}\nCompany: ${company || '—'}\n\n${message}`,
      html: `<table style="font-family:system-ui,sans-serif;font-size:15px;line-height:1.6">
        <tr><td><strong>Name</strong></td><td>${esc(name)}</td></tr>
        <tr><td><strong>Email</strong></td><td><a href="mailto:${esc(email)}">${esc(email)}</a></td></tr>
        <tr><td><strong>Company</strong></td><td>${esc(company) || '—'}</td></tr>
      </table><hr><p style="white-space:pre-wrap;font-family:system-ui,sans-serif;font-size:15px;line-height:1.6">${esc(message)}</p>`,
    });

    return res.status(200).json({ ok: true, delivered: true });
  } catch (e) {
    console.error('[contact] send failed:', e);
    return res.status(502).json({ ok: false, error: 'Delivery failed' });
  }
}
