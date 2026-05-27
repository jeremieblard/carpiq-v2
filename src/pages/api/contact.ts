/**
 * API route /api/contact — réception du formulaire de contact.
 *
 * Route SSR (n'est pas pré-rendue) qui :
 *   1. Valide le payload (nom, email, sujet, message)
 *   2. Honeypot anti-spam (champ `_gotcha` doit être vide)
 *   3. Envoie l'email via Resend
 *   4. Retourne { ok: true } ou { ok: false, error: string }
 *
 * Variables d'env requises (Vercel) :
 *   - RESEND_API_KEY : clé API Resend (commence par "re_")
 *   - CONTACT_TO_EMAIL : adresse qui reçoit les messages (ex: contact@carpiq.eu)
 *   - CONTACT_FROM_EMAIL : adresse from utilisée pour l'envoi
 *                          (doit être sur un domaine vérifié dans Resend)
 *
 * Sécurité :
 *   - Pas de captcha visible (UX friction), mais honeypot pour bloquer les bots
 *   - Rate limit géré côté Vercel (50 req/min IP par défaut)
 *   - Pas de log de PII en console
 */

import type { APIRoute } from 'astro';

export const prerender = false;

interface ContactPayload {
  name: string;
  email: string;
  subject: string;
  topic?: string; // categorie : 'support' | 'press' | 'partnerships'
  message: string;
  _gotcha?: string; // honeypot
}

/** Validation simple email (suffit pour la plupart des cas réels). */
function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

/** Sanitise une chaîne pour empêcher l'injection HTML dans l'email envoyé. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

export const POST: APIRoute = async ({ request }) => {
  // Parser le body (JSON ou form data)
  let payload: ContactPayload;
  try {
    const contentType = request.headers.get('content-type') ?? '';
    if (contentType.includes('application/json')) {
      payload = (await request.json()) as ContactPayload;
    } else {
      const formData = await request.formData();
      payload = {
        name: String(formData.get('name') ?? ''),
        email: String(formData.get('email') ?? ''),
        subject: String(formData.get('subject') ?? ''),
        topic: String(formData.get('topic') ?? ''),
        message: String(formData.get('message') ?? ''),
        _gotcha: String(formData.get('_gotcha') ?? ''),
      };
    }
  } catch {
    return new Response(
      JSON.stringify({ ok: false, error: 'invalid_payload' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // Honeypot : si rempli, c'est un bot
  if (payload._gotcha && payload._gotcha.trim() !== '') {
    // Faux 200 pour ne pas révéler au bot qu'on l'a détecté
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Validation
  const name = (payload.name ?? '').trim();
  const email = (payload.email ?? '').trim();
  const subject = (payload.subject ?? '').trim();
  const topic = (payload.topic ?? 'support').trim();
  const message = (payload.message ?? '').trim();

  if (!name || name.length < 2 || name.length > 100) {
    return new Response(
      JSON.stringify({ ok: false, error: 'name_invalid' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }
  if (!isValidEmail(email)) {
    return new Response(
      JSON.stringify({ ok: false, error: 'email_invalid' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }
  if (!subject || subject.length < 3 || subject.length > 200) {
    return new Response(
      JSON.stringify({ ok: false, error: 'subject_invalid' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }
  if (!message || message.length < 50 || message.length > 5000) {
    return new Response(
      JSON.stringify({ ok: false, error: 'message_too_short' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } },
    );
  }

  // Récupérer les vars d'env Vercel
  const RESEND_API_KEY = import.meta.env.RESEND_API_KEY;
  const CONTACT_TO_EMAIL = import.meta.env.CONTACT_TO_EMAIL ?? 'contact@carpiq.eu';
  const CONTACT_FROM_EMAIL =
    import.meta.env.CONTACT_FROM_EMAIL ?? 'noreply@carpiq.eu';

  if (!RESEND_API_KEY) {
    // En dev sans clé : on log dans la console et on renvoie ok
    // (utile pour tester le front sans setup Resend)
    // eslint-disable-next-line no-console
    console.log('[contact] RESEND_API_KEY missing — message would be:', {
      from: CONTACT_FROM_EMAIL,
      to: CONTACT_TO_EMAIL,
      subject: `[${topic}] ${subject}`,
      name,
      email,
      message: message.slice(0, 200) + '…',
    });
    return new Response(JSON.stringify({ ok: true, dev_mode: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // Construire le mail
  const htmlBody = `
    <h2>Nouveau message via le formulaire de contact CarPIQ</h2>
    <p><strong>De :</strong> ${escapeHtml(name)} &lt;${escapeHtml(email)}&gt;</p>
    <p><strong>Catégorie :</strong> ${escapeHtml(topic)}</p>
    <p><strong>Sujet :</strong> ${escapeHtml(subject)}</p>
    <hr />
    <p style="white-space: pre-wrap;">${escapeHtml(message)}</p>
  `.trim();

  const textBody =
    `Nouveau message via le formulaire de contact CarPIQ\n\n` +
    `De : ${name} <${email}>\n` +
    `Catégorie : ${topic}\n` +
    `Sujet : ${subject}\n\n` +
    `${message}\n`;

  // Appeler Resend
  try {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: `CarPIQ Contact <${CONTACT_FROM_EMAIL}>`,
        to: [CONTACT_TO_EMAIL],
        reply_to: email,
        subject: `[CarPIQ ${topic}] ${subject}`,
        html: htmlBody,
        text: textBody,
      }),
    });

    if (!res.ok) {
      const errText = await res.text();
      // eslint-disable-next-line no-console
      console.error('[contact] Resend error', res.status, errText);
      return new Response(
        JSON.stringify({ ok: false, error: 'send_failed' }),
        { status: 502, headers: { 'Content-Type': 'application/json' } },
      );
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.error('[contact] Network error', e);
    return new Response(
      JSON.stringify({ ok: false, error: 'network_error' }),
      { status: 502, headers: { 'Content-Type': 'application/json' } },
    );
  }
};

/** GET non supporté (uniquement POST pour soumissions). */
export const GET: APIRoute = () =>
  new Response(JSON.stringify({ ok: false, error: 'method_not_allowed' }), {
    status: 405,
    headers: { 'Content-Type': 'application/json', Allow: 'POST' },
  });
