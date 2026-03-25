import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAutoReply } from '@/lib/autoReply';

const IG_API = 'https://graph.facebook.com/v21.0';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return Response.json({ error: 'Doğrulama başarısız' }, { status: 403 });
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (body.object !== 'instagram') return Response.json({ ok: true });

    const sql = neon(process.env.POSTGRES_URL);

    for (const entry of body.entry) {
      const igPageId = entry.id;

      // Bu IG page hangi kullanıcıya ait?
      const [channel] = await sql`
        SELECT id, user_id, access_token FROM channels 
        WHERE platform = 'instagram' AND platform_id = ${igPageId} AND is_active = true
      `;
      if (!channel) continue;

      const userId = channel.user_id;

      for (const msgEvent of (entry.messaging || [])) {
        if (!msgEvent.message) continue;

        const senderId = msgEvent.sender?.id;
        const text = msgEvent.message?.text || '';
        const messageId = msgEvent.message?.mid;

        if (!senderId || senderId === igPageId) continue;

        // Gönderen adını al
        let contactName = null;
        try {
          const profileRes = await axios.get(`${IG_API}/${senderId}`, {
            params: { fields: 'name,username', access_token: channel.access_token }
          });
          contactName = profileRes.data.name || profileRes.data.username || null;
        } catch {}

        // Mesajı kaydet
        await sql`
          INSERT INTO messages (user_id, channel_id, platform, direction, contact_id, contact_name, type, text_body, platform_message_id, raw_data)
          VALUES (${userId}, ${channel.id}, 'instagram', 'incoming', ${senderId}, ${contactName}, 'text', ${text}, ${messageId}, ${JSON.stringify(msgEvent)})
        `;

        // Kişiyi güncelle
        await sql`
          INSERT INTO contacts (user_id, platform, platform_contact_id, name, last_message_at, message_count)
          VALUES (${userId}, 'instagram', ${senderId}, ${contactName}, NOW(), 1)
          ON CONFLICT (user_id, platform, platform_contact_id) 
          DO UPDATE SET name = COALESCE(${contactName}, contacts.name), last_message_at = NOW(), message_count = contacts.message_count + 1
        `;

        // Otomasyon
        if (!text) continue;

        const responseText = await getAutoReply(userId, text, 'instagram', senderId);

        if (responseText) {
          try {
            const res = await axios.post(`${IG_API}/${igPageId}/messages`, {
              recipient: { id: senderId },
              message: { text: responseText }
            }, { headers: { 'Authorization': `Bearer ${channel.access_token}` } });

            await sql`
              INSERT INTO messages (user_id, channel_id, platform, direction, contact_id, type, text_body, platform_message_id)
              VALUES (${userId}, ${channel.id}, 'instagram', 'outgoing', ${senderId}, 'text', ${responseText}, ${res.data.message_id || ''})
            `;
          } catch (err) {
            console.error('IG auto-reply error:', err.response?.data || err.message);
          }
        }
      }
    }

    return Response.json({ ok: true });
  } catch (error) {
    console.error('Instagram webhook hatası:', error);
    return Response.json({ ok: true });
  }
}
