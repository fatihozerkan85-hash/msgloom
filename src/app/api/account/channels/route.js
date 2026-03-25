import { neon } from '@neondatabase/serverless';
import { getUser } from '@/lib/auth';
import axios from 'axios';

export async function GET(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  const sql = neon(process.env.POSTGRES_URL);

  await sql`CREATE TABLE IF NOT EXISTS channels (
    id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    platform VARCHAR(20) NOT NULL, platform_id VARCHAR(255) NOT NULL,
    access_token TEXT NOT NULL, display_name VARCHAR(255), phone_number VARCHAR(50),
    business_account_id VARCHAR(100), extra JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true, created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(platform, platform_id)
  )`;

  const channels = await sql`
    SELECT id, platform, platform_id, display_name, phone_number, is_active, created_at 
    FROM channels WHERE user_id = ${user.id} ORDER BY created_at DESC
  `;
  return Response.json({ channels });
}

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { platform, token: botToken, page_id, access_token } = await request.json();

    const sql = neon(process.env.POSTGRES_URL);

    if (platform === 'telegram') {
      if (!botToken) return Response.json({ error: 'Bot token gerekli' }, { status: 400 });

      // Bot bilgilerini doğrula
      let botInfo;
      try {
        const res = await axios.get(`https://api.telegram.org/bot${botToken}/getMe`);
        botInfo = res.data.result;
      } catch {
        return Response.json({ error: 'Geçersiz bot token' }, { status: 400 });
      }

      const platformId = String(botInfo.id);
      const displayName = botInfo.first_name || botInfo.username;

      // Zaten var mı?
      const [existing] = await sql`SELECT id FROM channels WHERE platform = 'telegram' AND platform_id = ${platformId}`;
      if (existing) return Response.json({ error: 'Bu bot zaten bağlı' }, { status: 400 });

      // Kaydet
      const [channel] = await sql`
        INSERT INTO channels (user_id, platform, platform_id, access_token, display_name, extra)
        VALUES (${user.id}, 'telegram', ${platformId}, ${botToken}, ${displayName}, ${JSON.stringify({ username: botInfo.username })})
        RETURNING id, platform, platform_id, display_name, is_active, created_at
      `;

      // Webhook ayarla
      const webhookUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'https://msgloom.com.tr'}/api/webhook/telegram?cid=${channel.id}`;
      try {
        await axios.post(`https://api.telegram.org/bot${botToken}/setWebhook`, { url: webhookUrl });
      } catch (err) {
        console.error('TG webhook set error:', err.response?.data);
      }

      return Response.json({ success: true, channel });
    }

    if (platform === 'instagram') {
      if (!page_id || !access_token) return Response.json({ error: 'Page ID ve Access Token gerekli' }, { status: 400 });

      // IG hesap bilgilerini doğrula
      let igInfo;
      try {
        const res = await axios.get(`https://graph.facebook.com/v21.0/${page_id}`, {
          params: { fields: 'name,username', access_token }
        });
        igInfo = res.data;
      } catch {
        return Response.json({ error: 'Geçersiz Instagram bilgileri' }, { status: 400 });
      }

      const [existing] = await sql`SELECT id FROM channels WHERE platform = 'instagram' AND platform_id = ${page_id}`;
      if (existing) return Response.json({ error: 'Bu Instagram hesabı zaten bağlı' }, { status: 400 });

      const [channel] = await sql`
        INSERT INTO channels (user_id, platform, platform_id, access_token, display_name, extra)
        VALUES (${user.id}, 'instagram', ${page_id}, ${access_token}, ${igInfo.name || igInfo.username}, ${JSON.stringify({ username: igInfo.username })})
        RETURNING id, platform, platform_id, display_name, is_active, created_at
      `;

      return Response.json({ success: true, channel });
    }

    return Response.json({ error: 'Desteklenmeyen platform' }, { status: 400 });
  } catch (error) {
    console.error('Kanal ekleme hatası:', error);
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { id } = await request.json();
    const sql = neon(process.env.POSTGRES_URL);

    // Telegram ise webhook'u kaldır
    const [channel] = await sql`SELECT platform, access_token FROM channels WHERE id = ${id} AND user_id = ${user.id}`;
    if (channel?.platform === 'telegram') {
      try { await axios.post(`https://api.telegram.org/bot${channel.access_token}/deleteWebhook`); } catch {}
    }

    await sql`DELETE FROM channels WHERE id = ${id} AND user_id = ${user.id}`;
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
