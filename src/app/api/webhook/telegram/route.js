import { neon } from '@neondatabase/serverless';
import axios from 'axios';

const TG_API = 'https://api.telegram.org/bot';

export async function POST(request) {
  try {
    const body = await request.json();
    const message = body.message || body.edited_message;
    if (!message) return Response.json({ ok: true });

    const chatId = String(message.chat.id);
    const text = message.text || '';
    const contactName = [message.from?.first_name, message.from?.last_name].filter(Boolean).join(' ') || null;

    const sql = neon(process.env.POSTGRES_URL);

    // Bot token'dan hangi kullanıcıya ait olduğunu bul
    // Telegram webhook URL'inde channel_id var: /api/webhook/telegram?cid=123
    const { searchParams } = new URL(request.url);
    const channelId = searchParams.get('cid');

    if (!channelId) return Response.json({ ok: true });

    const [channel] = await sql`
      SELECT id, user_id, access_token FROM channels 
      WHERE id = ${channelId} AND platform = 'telegram' AND is_active = true
    `;
    if (!channel) return Response.json({ ok: true });

    const userId = channel.user_id;

    // Mesajı kaydet
    await sql`
      INSERT INTO messages (user_id, channel_id, platform, direction, contact_id, contact_name, type, text_body, platform_message_id, raw_data)
      VALUES (${userId}, ${channel.id}, 'telegram', 'incoming', ${chatId}, ${contactName}, 'text', ${text}, ${String(message.message_id)}, ${JSON.stringify(message)})
    `;

    // Kişiyi güncelle/oluştur
    await sql`
      INSERT INTO contacts (user_id, platform, platform_contact_id, name, last_message_at, message_count)
      VALUES (${userId}, 'telegram', ${chatId}, ${contactName}, NOW(), 1)
      ON CONFLICT (user_id, platform, platform_contact_id) 
      DO UPDATE SET name = COALESCE(${contactName}, contacts.name), last_message_at = NOW(), message_count = contacts.message_count + 1
    `;

    // Otomasyon
    if (!text) return Response.json({ ok: true });

    const automations = await sql`
      SELECT * FROM automations 
      WHERE user_id = ${userId} AND is_active = true AND (platform = 'all' OR platform = 'telegram')
      ORDER BY priority DESC, created_at ASC
    `;

    if (automations.length === 0) return Response.json({ ok: true });

    const incomingText = text.toLowerCase().trim();

    // İlk mesaj mı?
    const [prev] = await sql`
      SELECT COUNT(*) as count FROM messages WHERE user_id = ${userId} AND contact_id = ${chatId} AND platform = 'telegram' AND direction = 'incoming'
    `;
    const isFirst = Number(prev.count) <= 1;

    let responseText = null;

    if (isFirst) {
      const w = automations.find(a => a.type === 'welcome');
      if (w) responseText = w.response_text;
    }

    if (!responseText) {
      const kw = automations.find(a => {
        if (a.type !== 'keyword' || !a.trigger_text) return false;
        return a.trigger_text.toLowerCase().split(',').map(k => k.trim()).some(k => incomingText.includes(k));
      });
      if (kw) responseText = kw.response_text;
    }

    if (!responseText) {
      const d = automations.find(a => a.type === 'default');
      if (d) responseText = d.response_text;
    }

    if (responseText) {
      try {
        const res = await axios.post(`${TG_API}${channel.access_token}/sendMessage`, {
          chat_id: chatId, text: responseText
        });
        await sql`
          INSERT INTO messages (user_id, channel_id, platform, direction, contact_id, type, text_body, platform_message_id)
          VALUES (${userId}, ${channel.id}, 'telegram', 'outgoing', ${chatId}, 'text', ${responseText}, ${String(res.data.result?.message_id || '')})
        `;
      } catch (err) {
        console.error('TG auto-reply error:', err.response?.data || err.message);
      }
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Telegram webhook hatası:', error);
    return Response.json({ ok: true });
  }
}
