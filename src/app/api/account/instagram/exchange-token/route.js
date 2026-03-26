import { neon } from '@neondatabase/serverless';
import { getUser } from '@/lib/auth';
import axios from 'axios';

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { accessToken: shortToken } = await request.json();
    if (!shortToken) return Response.json({ error: 'Token gerekli' }, { status: 400 });

    // 1. Short-lived token'ı long-lived token'a çevir (60 gün)
    let longToken = shortToken;
    try {
      const ltRes = await axios.get('https://graph.facebook.com/v21.0/oauth/access_token', {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: process.env.FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          fb_exchange_token: shortToken,
        }
      });
      if (ltRes.data.access_token) longToken = ltRes.data.access_token;
    } catch {}

    // 2. Kullanıcının Facebook sayfalarını al
    const pagesRes = await axios.get('https://graph.facebook.com/v21.0/me/accounts', {
      params: { fields: 'id,name,access_token,instagram_business_account', access_token: longToken }
    });

    const pages = pagesRes.data.data || [];
    const results = [];
    const sql = neon(process.env.POSTGRES_URL);

    for (const page of pages) {
      const igAccount = page.instagram_business_account;
      if (!igAccount) continue;

      // IG hesap bilgilerini al
      let igInfo;
      try {
        const igRes = await axios.get(`https://graph.facebook.com/v21.0/${igAccount.id}`, {
          params: { fields: 'id,name,username,profile_picture_url', access_token: page.access_token }
        });
        igInfo = igRes.data;
      } catch {
        continue;
      }

      const platformId = igAccount.id;
      const displayName = igInfo.username || igInfo.name || page.name;

      // Zaten bağlı mı?
      const [existing] = await sql`
        SELECT id, user_id FROM channels WHERE platform = 'instagram' AND platform_id = ${platformId}
      `;

      if (existing && existing.user_id !== user.id) continue; // Başka kullanıcıya ait

      let channel;
      if (existing) {
        [channel] = await sql`
          UPDATE channels SET access_token = ${page.access_token}, display_name = ${displayName},
            extra = ${JSON.stringify({ username: igInfo.username, page_id: page.id, page_name: page.name, profile_picture: igInfo.profile_picture_url })},
            is_active = true
          WHERE id = ${existing.id}
          RETURNING id, platform, platform_id, display_name, is_active, created_at
        `;
      } else {
        [channel] = await sql`
          INSERT INTO channels (user_id, platform, platform_id, access_token, display_name, extra)
          VALUES (${user.id}, 'instagram', ${platformId}, ${page.access_token}, ${displayName},
            ${JSON.stringify({ username: igInfo.username, page_id: page.id, page_name: page.name, profile_picture: igInfo.profile_picture_url })})
          RETURNING id, platform, platform_id, display_name, is_active, created_at
        `;
      }
      results.push(channel);
    }

    if (results.length === 0) {
      return Response.json({
        error: 'Instagram Business hesabı bulunamadı. Facebook sayfanıza bir Instagram Business hesabı bağlı olmalıdır.'
      }, { status: 400 });
    }

    return Response.json({ success: true, channels: results });
  } catch (error) {
    console.error('Instagram OAuth hatası:', error.response?.data || error.message);
    return Response.json({ error: 'Instagram bağlantısı başarısız: ' + (error.response?.data?.error?.message || error.message) }, { status: 500 });
  }
}
