// ============================================================
// Telegram Notifications — Miracle Platform
// ============================================================
// Токен бота и chat_id НИКОГДА не хранятся на фронтенде.
// Уведомления идут через Supabase Edge Function,
// где секреты живут в Supabase Secrets.
//
// Авторизация: Supabase SDK автоматически передаёт JWT в
// заголовке Authorization — Edge Function проверяет его
// подпись через SUPABASE_JWT_SECRET (серверный секрет).
// Никакой клиентский секрет в бандл не попадает.

import { supabase } from '../lib/supabase';

export interface TelegramApplication {
  organizerName: string;
  tournamentName: string;
  package: string;
  telegram: string;
  email?: string;
  description: string;
}

async function callEdgeFunction(payload: object): Promise<void> {
  if (!supabase) return;
  // Supabase SDK сам добавляет Authorization: Bearer <JWT>
  const { error } = await supabase.functions.invoke('send-telegram', {
    body: payload,
  });
  if (error) console.error('[Telegram] Edge Function error:', error.message);
}

export async function sendNewApplicationNotification(
  app: TelegramApplication
): Promise<void> {
  await callEdgeFunction({ type: 'new_application', app });
}

export async function sendApplicationStatusUpdate(
  app: TelegramApplication & { status: string; notes?: string }
): Promise<void> {
  await callEdgeFunction({ type: 'status_update', app });
}
