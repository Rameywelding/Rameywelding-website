import type { APIRoute } from 'astro';
import { Resend } from 'resend';
import { site } from '../../data/site';

// This route is rendered on-demand (a Vercel serverless function), not prerendered.
export const prerender = false;

const TURNSTILE_VERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

function esc(s: string) {
  return s.replace(/[<>&]/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;' }[c]!));
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const fail = (error: string, code = 400) =>
    new Response(JSON.stringify({ ok: false, error }), {
      status: code,
      headers: { 'Content-Type': 'application/json' },
    });

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return fail('Could not read the form. Please try again.');
  }

  // Honeypot — bots fill this; real people never see it.
  if ((form.get('company') as string)?.trim()) {
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const name = (form.get('name') as string)?.trim() ?? '';
  const phone = (form.get('phone') as string)?.trim() ?? '';
  const email = (form.get('email') as string)?.trim() ?? '';
  const town = (form.get('town') as string)?.trim() ?? '';
  const message = (form.get('message') as string)?.trim() ?? '';
  const token = (form.get('cf-turnstile-response') as string) ?? '';

  if (!name || !phone || !message) {
    return fail('Please fill in your name, phone, and a short message.');
  }

  // ── Verify Turnstile ────────────────────────────────────────────────────────
  const secret = import.meta.env.TURNSTILE_SECRET_KEY;
  if (!secret) {
    console.error('Missing TURNSTILE_SECRET_KEY env var.');
    return fail('Server is not configured yet. Please call us instead.', 500);
  }
  try {
    const params = new URLSearchParams({ secret, response: token });
    if (clientAddress) params.set('remoteip', clientAddress);
    const verify = await fetch(TURNSTILE_VERIFY, { method: 'POST', body: params });
    const outcome = (await verify.json()) as { success: boolean };
    if (!outcome.success) {
      return fail('Verification failed. Please refresh and try again.');
    }
  } catch {
    return fail('Could not verify your request. Please try again.', 502);
  }

  // ── Send email ──────────────────────────────────────────────────────────────
  const apiKey = import.meta.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error('Missing RESEND_API_KEY env var.');
    return fail('Email is not configured yet. Please call us instead.', 500);
  }

  const fromAddress =
    import.meta.env.CONTACT_FROM_EMAIL ?? `Website <noreply@${site.domain}>`;
  const toAddress = import.meta.env.CONTACT_TO_EMAIL ?? site.email;

  const resend = new Resend(apiKey);
  try {
    const { error } = await resend.emails.send({
      from: fromAddress,
      to: [toAddress],
      replyTo: email || undefined,
      subject: `New quote request — ${name}${town ? ` (${town})` : ''}`,
      text:
        `New request from the website\n\n` +
        `Name:    ${name}\n` +
        `Phone:   ${phone}\n` +
        `Email:   ${email || '—'}\n` +
        `Town:    ${town || '—'}\n\n` +
        `Message:\n${message}\n`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:560px">
          <h2 style="margin:0 0 4px">New quote request</h2>
          <p style="color:#666;margin:0 0 16px">From the ${esc(site.name)} website</p>
          <table style="border-collapse:collapse;width:100%">
            <tr><td style="padding:6px 0;color:#666;width:90px">Name</td><td style="padding:6px 0"><strong>${esc(name)}</strong></td></tr>
            <tr><td style="padding:6px 0;color:#666">Phone</td><td style="padding:6px 0"><a href="tel:${esc(phone)}">${esc(phone)}</a></td></tr>
            <tr><td style="padding:6px 0;color:#666">Email</td><td style="padding:6px 0">${email ? `<a href="mailto:${esc(email)}">${esc(email)}</a>` : '—'}</td></tr>
            <tr><td style="padding:6px 0;color:#666">Town</td><td style="padding:6px 0">${esc(town) || '—'}</td></tr>
          </table>
          <p style="margin:16px 0 4px;color:#666">Message</p>
          <p style="white-space:pre-wrap;margin:0;padding:12px;background:#f5f5f5;border-radius:6px">${esc(message)}</p>
        </div>`,
    });
    if (error) {
      console.error('Resend error:', error);
      return fail('Could not send your message. Please call us instead.', 502);
    }
  } catch (err) {
    console.error('Send threw:', err);
    return fail('Could not send your message. Please call us instead.', 502);
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
};
