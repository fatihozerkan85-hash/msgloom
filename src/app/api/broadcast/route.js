import { neon } from '@neondatabase/serverless';
import { getUser } from '@/lib/auth';
import axios from 'axios';

const WA_API = 'https://graph.facebook.com/v21.0';
const TG_API = 'https://api.telegram.org/bot';

export async function GET(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  const sql = neon(process.env.POSTGRES_URL);
  await sql`CREATE TABLE IF NOT EXISTS broadcasts (
    id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(20) NOT NULL, message TEXT NOT NULL,
    target_tags TEXT[], total_count INTEGER DEFAULT 0, sent_count INTEGER DEFAULT 0,
    status VARCHAR(20) DEFAULT 'pending', created_at TIMESTAMP DEFAULT NOW()
  )`;

  const broadcasts = await sql`SELECT * FROM broadcasts WHERE user_id = ${user.id} ORDER BY created_at DESC LIMIT 50`;
  return Response.json({ broadcasts });
}

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { platform, message, tags } = await request.json();
    if (!platform || !message) return Response.json({ error: 'Platform ve mesaj gerekli' }, { status: 400 });

    const sql = neon(process.env.POSTGRES_URL);

    // Hedef kişileri bul
    let contacts;
    if (tags && tags.length > 0) {
      contacts = await sql`SELECT * FROM contacts WHERE user_id = ${user.id} AND platform = ${platform} AND tags && ${tags}`;
    } else {
      contacts = await sql`SELECT * FROM contacts WHERE user_id = ${user.id} AND platform = ${platform}`;
    }

    if (contacts.length === 0) return Response.json({ error: 'Gönderilecek kişi bulunamadı' }, { status: 400 });

    // Broadcast kaydı oluştur
    const [broadcast] = await sql`
      INSERT INTO broadcasts (user_id, platform, message, target_tags, total_count, status)
      VALUES (${user.id}, ${platform}, ${message}, ${tags || []}, ${contacts.length}, 'sending')
      RETURNING *
    `;

    // Kanal bilgilerini al
    let channelToken, channelPlatformId;
    if (platform === 'whatsapp') {
      const [wa] = await sql`SELECT access_token, phone_number_id FROM whatsapp_accounts WHERE user_id = ${user.id} AND is_active = true LIMIT 1`;
      if (!wa) return Response.json({ error: 'WhatsApp hesabı bağlı değil' }, { status: 400 });
      channelToken = wa.access_token; channelPlatformId = wa.phone_number_id;
    } else {
      const [ch] = await sql`SELECT access_token, platform_id FROM channels WHERE user_id = ${user.id} AND platform = ${platform} AND is_active = true LIMIT 1`;
      if (!ch) return Response.json({ error: `${platform} hesabı bağlı değil` }, { status: 400 });
      channelToken = ch.access_token; channelPlatformId = ch.platform_id;
    }

    // Mesajları gönder (arka planda)
    let sentCount = 0;
    for (const contact of contacts) {
      try {
        if (platform === 'whatsapp') {
          await axios.post(`${WA_API}/${channelPlatformId}/messages`, {
            messaging_product: 'whatsapp', to: contact.platform_contact_id, type: 'text', text: { body: message }
          }, { headers: { 'Authorization': `Bearer ${channelToken}`, 'Content-Type': 'application/json' } });
        } else if (platform === 'telegram') {
          await axios.post(`${TG_API}${channelToken}/sendMessage`, { chat_id: contact.platform_contact_id, text: message });
        } else if (platform === 'instagram') {
          await axios.post(`${WA_API}/${channelPlatformId}/messages`, {
            recipient: { id: contact.platform_contact_id }, message: { text: message }
          }, { headers: { 'Authorization': `Bearer ${channelToken}` } });
        }
        sentCount++;
      } catch (err) {
        console.error(`Broadcast send error to ${contact.platform_contact_id}:`, err.response?.data?.error?.message || err.message);
      }
    }

    await sql`UPDATE broadcasts SET sent_count = ${sentCount}, status = 'completed' WHERE id = ${broadcast.id}`;

    return Response.json({ success: true, broadcast: { ...broadcast, sent_count: sentCount, status: 'completed' } });
  } catch (error) {
    console.error('Broadcast hatası:', error);
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
