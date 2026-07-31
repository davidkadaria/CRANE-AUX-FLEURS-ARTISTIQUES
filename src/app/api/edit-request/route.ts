import { NextResponse } from 'next/server';

// Reader-submitted edit requests (text selection → modal → here → Telegram).
// Needs TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID in the environment (Vercel);
// without them the endpoint answers 503 and the site works read-only.

const MAX_LENGTHS: Record<string, number> = {
  email: 200,
  original: 1500,
  corrected: 1500,
  note: 1000,
  poemTitle: 200,
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export async function POST(request: Request) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) {
    return NextResponse.json({ error: 'not configured' }, { status: 503 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'bad json' }, { status: 400 });
  }

  // Honeypot: real users never fill this hidden field - pretend success
  if (body.website) return NextResponse.json({ ok: true });

  const field = (name: string): string =>
    typeof body[name] === 'string' ? (body[name] as string).trim() : '';

  const email = field('email');
  const original = field('original');
  const corrected = field('corrected');
  const note = field('note');
  const poemTitle = field('poemTitle');
  const poemId = Number(body.poemId);

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !original || !corrected) {
    return NextResponse.json({ error: 'invalid fields' }, { status: 400 });
  }
  for (const [name, max] of Object.entries(MAX_LENGTHS)) {
    if (field(name).length > max) {
      return NextResponse.json({ error: `${name} too long` }, { status: 400 });
    }
  }

  const poemUrl = Number.isInteger(poemId)
    ? `https://galaktioni.ge/poem/${poemId}/`
    : '';
  const text = [
    '📖 <b>რედაქტირების მოთხოვნა</b>',
    '',
    `<b>ლექსი:</b> ${escapeHtml(poemTitle)}${Number.isInteger(poemId) ? ` (№${poemId})` : ''}`,
    poemUrl,
    '',
    `<b>ელფოსტა:</b> ${escapeHtml(email)}`,
    '',
    `<b>მონიშნული ტექსტი:</b>`,
    `<i>${escapeHtml(original)}</i>`,
    '',
    `<b>შესწორებული ვერსია:</b>`,
    escapeHtml(corrected),
    ...(note ? ['', '<b>განმარტება:</b>', escapeHtml(note)] : []),
  ].join('\n');

  const telegram = await fetch(
    `https://api.telegram.org/bot${token}/sendMessage`,
    {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: 'HTML',
        link_preview_options: { is_disabled: true },
      }),
    },
  );
  if (!telegram.ok) {
    return NextResponse.json({ error: 'telegram failed' }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
