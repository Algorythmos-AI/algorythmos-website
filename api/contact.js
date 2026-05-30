/**
 * Vercel serverless function — contact form handler.
 * Keeps the Astro site fully static (no @astrojs/vercel adapter, avoids its
 * build-time path-to-regexp advisory). Secrets stay server-side.
 *
 * Configure in Vercel project env (Settings → Environment Variables):
 *   EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY
 * Until configured, submissions are accepted (202) and logged so UX works.
 */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

    const { EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY, EMAILJS_PRIVATE_KEY } = process.env;
    if (!EMAILJS_SERVICE_ID || !EMAILJS_TEMPLATE_ID || !EMAILJS_PUBLIC_KEY || !EMAILJS_PRIVATE_KEY) {
      console.warn('[contact] EmailJS env not configured — message not delivered:', { name, email, company });
      return res.status(202).json({ ok: true, delivered: false });
    }

    const r = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        service_id: EMAILJS_SERVICE_ID,
        template_id: EMAILJS_TEMPLATE_ID,
        user_id: EMAILJS_PUBLIC_KEY,
        accessToken: EMAILJS_PRIVATE_KEY,
        template_params: { from_name: name, reply_to: email, company, message },
      }),
    });
    if (!r.ok) {
      const detail = await r.text().catch(() => '');
      console.error('[contact] EmailJS error', r.status, detail);
      return res.status(502).json({ ok: false, error: 'Delivery failed' });
    }
    return res.status(200).json({ ok: true, delivered: true });
  } catch (e) {
    console.error('[contact]', e);
    return res.status(500).json({ ok: false, error: 'Server error' });
  }
}
