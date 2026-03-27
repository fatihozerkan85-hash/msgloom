import { neon } from '@neondatabase/serverless';
import axios from 'axios';
import { getAutoReply } from '@/lib/autoReply';
import { verifyTelegramWebhook } from '@/lib/webhookVerify';

const TG_API = 'https://api.telegram.org/bot';

export async function POST(request) {
  try {
    if (!verifyTelegramWebhook(request)) {
      console.error('Telegram webhook secret doğrulaması başarısız');
      return Response.json({ error: 'Yetkisiz' }, { status: 401 });
    }

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

    const responseText = await getAutoReply(userId, text, 'telegram', chatId);

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
