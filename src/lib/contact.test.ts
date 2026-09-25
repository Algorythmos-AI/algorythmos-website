/**
 * Contact handler (api/contact.js). The rules that matter most:
 *   - a real enquiry is never silently dropped (only a filled honeypot gets fake success);
 *   - cross-site browser posts and unexpected body types are refused;
 *   - a no-JS form post gets a localised HTML reply;
 *   - logs never carry visitor data.
 * Lives under src/ because vitest only includes src/**, and a test file in api/
 * would be deployed as a Vercel function.
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

const sendMail = vi.fn();
vi.mock('nodemailer', () => ({
  default: { createTransport: vi.fn(() => ({ sendMail })) },
}));

import handler, { esc, LIMITS, NOJS_COPY, FALLBACK_EMAIL, MIN_FILL_MS } from '../../api/contact.js';
import en from '../i18n/ui/en.global.json';
import fr from '../i18n/ui/fr.fr.json';
import { BUSINESS } from '../data/business';

type Res = {
  statusCode: number;
  headers: Record<string, string>;
  body: unknown;
  status(code: number): Res;
  json(b: unknown): Res;
  send(b: unknown): Res;
  setHeader(k: string, v: string): void;
};

function mockRes(): Res {
  const res: Res = {
    statusCode: 200,
    headers: {},
    body: undefined,
    status(code) {
      res.statusCode = code;
      return res;
    },
    json(b) {
      res.body = b;
      return res;
    },
    send(b) {
      res.body = b;
      return res;
    },
    setHeader(k, v) {
      res.headers[k.toLowerCase()] = v;
    },
  };
  return res;
}

let ipCounter = 0;
/** Each request gets its own IP: the handler's rate-limit map persists across tests. */
function mockReq(opts: { body?: unknown; headers?: Record<string, string>; method?: string } = {}) {
  ipCounter += 1;
  return {
    method: opts.method ?? 'POST',
    headers: {
      host: 'algorythmos.com',
      origin: 'https://algorythmos.com',
      'content-type': 'application/json',
      'x-forwarded-for': `203.0.113.${ipCounter}`,
      ...opts.headers,
    },
    body: opts.body,
    socket: {},
  };
}

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@example.com',
  message: 'We would like help automating our invoice intake.',
  company: 'Analytical Engines',
  locale: 'en-AU',
  utm: '',
  leave_blank: '',
  elapsedMs: 12_000,
};

async function call(req: ReturnType<typeof mockReq>) {
  const res = mockRes();
  await handler(req as never, res as never);
  return res;
}

beforeEach(() => {
  sendMail.mockReset();
  sendMail.mockResolvedValue({ messageId: 'test' });
  process.env.ZOHO_SMTP_USER = 'noreply@algorythmos.com';
  process.env.ZOHO_SMTP_PASS = 'test-password';
});
afterEach(() => {
  delete process.env.ZOHO_SMTP_USER;
  delete process.env.ZOHO_SMTP_PASS;
  vi.restoreAllMocks();
});

describe('delivery', () => {
  it('delivers a normal enquiry', async () => {
    const res = await call(mockReq({ body: valid }));
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ ok: true, delivered: true });
    expect(sendMail).toHaveBeenCalledTimes(1);
    expect(sendMail.mock.calls[0][0].subject).not.toContain('[unverified]');
  });

  it('only a filled honeypot gets fake success, and nothing is sent', async () => {
    const res = await call(mockReq({ body: { ...valid, leave_blank: 'https://spam.example' } }));
    expect(res.body).toEqual({ ok: true, delivered: false });
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('honours the old honeypot name from cached pages', async () => {
    const res = await call(mockReq({ body: { ...valid, leave_blank: undefined, website: 'x' } }));
    expect(res.body).toEqual({ ok: true, delivered: false });
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('a fast submission is delivered, flagged [unverified]', async () => {
    const res = await call(mockReq({ body: { ...valid, elapsedMs: MIN_FILL_MS - 1 } }));
    expect(res.body).toEqual({ ok: true, delivered: true });
    expect(sendMail.mock.calls[0][0].subject).toMatch(/^\[unverified\] /);
  });

  it('an untimed submission (old cached page sending ts) is delivered, flagged', async () => {
    const { elapsedMs: _unused, ...rest } = valid;
    const res = await call(mockReq({ body: { ...rest, ts: Date.now() + 60_000 } }));
    expect(res.body).toEqual({ ok: true, delivered: true });
    expect(sendMail.mock.calls[0][0].subject).toMatch(/^\[unverified\] /);
  });

  it('uses an address object for replyTo, so quotes in a name cannot break the header', async () => {
    await call(mockReq({ body: { ...valid, name: 'Ada "The Countess" Lovelace' } }));
    expect(sendMail.mock.calls[0][0].replyTo).toEqual({ name: 'Ada "The Countess" Lovelace', address: 'ada@example.com' });
  });

  it('escapes quotes inside the HTML email attributes', async () => {
    await call(mockReq({ body: { ...valid, email: 'a"onmouseover="x@example.com' } }));
    const html: string = sendMail.mock.calls[0][0].html;
    expect(html).not.toContain('"onmouseover="');
    expect(html).toContain('&quot;onmouseover=&quot;');
  });
});

describe('refusals', () => {
  it('refuses a cross-site Origin', async () => {
    const res = await call(mockReq({ body: valid, headers: { origin: 'https://evil.example' } }));
    expect(res.statusCode).toBe(403);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('refuses a null Origin', async () => {
    const res = await call(mockReq({ body: valid, headers: { origin: 'null' } }));
    expect(res.statusCode).toBe(403);
  });

  it('allows a missing Origin (non-browser client)', async () => {
    const req = mockReq({ body: valid });
    delete (req.headers as Record<string, string>).origin;
    const res = await call(req);
    expect(res.statusCode).toBe(200);
  });

  it('allows a preview deployment whose Origin matches its own host', async () => {
    const host = 'algorythmos-astro-git-x.vercel.app';
    const res = await call(mockReq({ body: valid, headers: { host, origin: `https://${host}` } }));
    expect(res.statusCode).toBe(200);
  });

  it('refuses text/plain (a cross-site simple request)', async () => {
    const res = await call(mockReq({ body: JSON.stringify(valid), headers: { 'content-type': 'text/plain' } }));
    expect(res.statusCode).toBe(415);
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('answers malformed JSON with 400, not a delivery failure', async () => {
    const req = mockReq();
    Object.defineProperty(req, 'body', {
      get() {
        throw new SyntaxError('Unexpected token');
      },
    });
    const res = await call(req);
    expect(res.statusCode).toBe(400);
    expect(res.body).toMatchObject({ error: 'bad_json' });
  });

  it('caps every field and names the one that is too long', async () => {
    for (const [field, max] of Object.entries(LIMITS)) {
      const value = field === 'email' ? `${'a'.repeat(max)}@x.io` : 'a'.repeat(max + 1);
      const res = await call(mockReq({ body: { ...valid, [field]: value } }));
      expect(res.statusCode, field).toBe(400);
      expect(res.body, field).toMatchObject({ error: 'too_long', field, max });
    }
    expect(sendMail).not.toHaveBeenCalled();
  });

  it('rejects GET with 405', async () => {
    const res = await call(mockReq({ method: 'GET' }));
    expect(res.statusCode).toBe(405);
  });
});

describe('no-JS form post', () => {
  const form = (body: Record<string, string>, extra: Record<string, string> = {}) =>
    mockReq({ body, headers: { 'content-type': 'application/x-www-form-urlencoded', ...extra } });
  const fields = { name: valid.name, email: valid.email, message: valid.message, company: '', leave_blank: '' };

  it('delivers and replies with an English HTML page', async () => {
    const res = await call(form({ ...fields, locale: 'en-AU' }));
    expect(res.statusCode).toBe(200);
    expect(res.headers['content-type']).toContain('text/html');
    expect(String(res.body)).toContain(NOJS_COPY.en.success);
    expect(String(res.body)).toContain('href="/au-en/contact"');
    expect(sendMail.mock.calls[0][0].subject).toMatch(/^\[unverified\] /);
  });

  it('replies in French for a French page', async () => {
    const res = await call(form({ ...fields, locale: 'fr-FR' }));
    expect(String(res.body)).toContain('lang="fr-FR"');
    expect(String(res.body)).toContain(NOJS_COPY.fr.success);
  });

  it('parses a raw urlencoded string body', async () => {
    const res = await call(form(new URLSearchParams({ ...fields, locale: 'en-AU' }).toString() as never));
    expect(res.statusCode).toBe(200);
    expect(sendMail).toHaveBeenCalledTimes(1);
  });

  it('shows the email-us page on failure, with the real address', async () => {
    delete process.env.ZOHO_SMTP_USER;
    const res = await call(form({ ...fields, locale: 'en-AU' }));
    expect(res.statusCode).toBe(503);
    expect(String(res.body)).toContain(FALLBACK_EMAIL);
  });
});

describe('privacy of logs', () => {
  it('never logs visitor data when SMTP is missing', async () => {
    delete process.env.ZOHO_SMTP_PASS;
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await call(mockReq({ body: valid }));
    expect(res.statusCode).toBe(503);
    const logged = JSON.stringify(spy.mock.calls);
    for (const v of [valid.name, valid.email, valid.company]) expect(logged).not.toContain(v);
  });

  it('logs only safe error fields when sending fails', async () => {
    sendMail.mockRejectedValueOnce(Object.assign(new Error(`rejected: ${valid.email}`), { code: 'EENVELOPE', responseCode: 550 }));
    const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
    const res = await call(mockReq({ body: valid }));
    expect(res.statusCode).toBe(502);
    const logged = JSON.stringify(spy.mock.calls);
    expect(logged).toContain('EENVELOPE');
    expect(logged).not.toContain(valid.email);
  });
});

describe('copy stays in sync with the dictionaries', () => {
  it('no-JS strings equal the dictionary values', () => {
    const d = { en: en as Record<string, string>, fr: fr as Record<string, string> };
    for (const loc of ['en', 'fr'] as const) {
      expect(NOJS_COPY[loc].success).toBe(d[loc]['contactPage.snackbar.success']);
      expect(NOJS_COPY[loc].error).toBe(d[loc]['contact.form.error']);
      expect(NOJS_COPY[loc].back).toBe(d[loc]['contactPage.noJs.back']);
    }
  });

  it('the fallback address is the business email', () => {
    expect(FALLBACK_EMAIL).toBe(BUSINESS.email);
  });

  it('esc covers text and attribute contexts', () => {
    expect(esc(`<a href="x" title='y'>&</a>`)).toBe('&lt;a href=&quot;x&quot; title=&#39;y&#39;&gt;&amp;&lt;/a&gt;');
  });
});
