// ============================================================
// Edge Function — Telegram уведомления
// ============================================================
// Деплой:
//   supabase functions deploy send-telegram
//
// Секреты — задать через Supabase Dashboard → Settings → Secrets:
//   supabase secrets set TELEGRAM_BOT_TOKEN=ВАШ_ТОКЕН
//   supabase secrets set TELEGRAM_CHAT_ID=ВАШ_CHAT_ID
//
// SUPABASE_JWT_SECRET доступен автоматически — вручную задавать не нужно.
// INTERNAL_SECRET больше не нужен.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import * as jose from 'https://deno.land/x/jose@v4.14.4/index.ts';

const BOT_TOKEN   = Deno.env.get('TELEGRAM_BOT_TOKEN')!;
const CHAT_ID     = Deno.env.get('TELEGRAM_CHAT_ID')!;
const JWT_SECRET  = Deno.env.get('SUPABASE_JWT_SECRET')!;

const PACKAGE_LABELS: Record<string, string> = {
  diamond: '💎 Diamond — 1000₽',
  premium: '⭐ Premium — 500₽',
  common:  '🔹 Common — 250₽',
};

async function tgSend(text: string): Promise<void> {
  const res = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' }),
    }
  );
  if (!res.ok) {
    const err = await res.json();
    console.error('[Telegram] Ошибка:', err.description);
  }
}

function sanitize(str: unknown): string {
  return String(str ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .slice(0, 500);
}

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // ── Проверка JWT подписи Supabase ────────────────────────────
  // Supabase SDK автоматически шлёт Authorization: Bearer <JWT>.
  // Проверяем подпись — это гарантирует, что запрос пришёл
  // именно из нашего проекта, а не от постороннего.
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  if (!token) {
    return new Response('Forbidden', { status: 403 });
  }
  try {
    await jose.jwtVerify(token, new TextEncoder().encode(JWT_SECRET));
  } catch {
    return new Response('Forbidden', { status: 403 });
  }

  try {
    const { type, app } = await req.json();

    if (!app || typeof app !== 'object') {
      return new Response('Bad Request', { status: 400 });
    }

    const pkg   = PACKAGE_LABELS[app.package] ?? sanitize(app.package);
    const email = app.email ? `\n📧 Email: ${sanitize(app.email)}` : '';

    if (type === 'new_application') {
      await tgSend(
        `🆕 <b>Новая заявка на турнир!</b>\n\n` +
        `🏆 <b>${sanitize(app.tournamentName)}</b>\n` +
        `👤 Организатор: ${sanitize(app.organizerName)}\n` +
        `📦 Пакет: ${pkg}\n` +
        `📱 Telegram: ${sanitize(app.telegram)}${email}\n\n` +
        `📝 <i>${sanitize(app.description)}</i>\n\n` +
        `👉 Зайди в <b>Админ-панель → Заявки</b>`
      );
    } else if (type === 'status_update') {
      const statusLabels: Record<string, string> = {
        pending:   '🟡 На рассмотрении',
        processed: '✅ Одобрено',
        rejected:  '🔴 Отклонено',
      };
      const label = statusLabels[app.status] ?? sanitize(app.status);
      const note  = app.notes ? `\n\n💬 Заметка: ${sanitize(app.notes)}` : '';
      await tgSend(
        `📋 <b>Статус заявки обновлён</b>\n\n` +
        `🏆 <b>${sanitize(app.tournamentName)}</b>\n` +
        `👤 ${sanitize(app.organizerName)}\n` +
        `Статус: ${label}${note}`
      );
    } else {
      return new Response('Unknown type', { status: 400 });
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('[Edge Function] Ошибка:', e);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});
