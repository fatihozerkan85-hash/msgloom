import { neon } from '@neondatabase/serverless';
import { getUser } from '@/lib/auth';
import axios from 'axios';

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { code, waba_id, phone_number_id } = await request.json();

    if (!code || !phone_number_id) {
      return Response.json({ error: 'Eksik bilgi' }, { status: 400 });
    }

    // 1. Code'u access_token'a çevir
    const tokenRes = await axios.get('https://graph.facebook.com/v21.0/oauth/access_token', {
      params: {
        client_id: process.env.FACEBOOK_APP_ID,
        client_secret: process.env.FACEBOOK_APP_SECRET,
        code: code,
      }
    });

    const shortToken = tokenRes.data.access_token;
    if (!shortToken) {
      return Response.json({ error: 'Token alınamadı' }, { status: 400 });
    }

    // 2. Short-lived token'ı long-lived token'a çevir (60 gün)
    // Not: Embedded Signup'tan gelen token zaten system user token olabilir, 
    // ama güvenlik için debug edelim
    let accessToken = shortToken;
    try {
      const longRes = await axios.get('https://graph.facebook.com/v21.0/oauth/access_token', {
        params: {
          grant_type: 'fb_exchange_token',
          client_id: process.env.FACEBOOK_APP_ID,
          client_secret: process.env.FACEBOOK_APP_SECRET,
          fb_exchange_token: shortToken,
        }
      });
      if (longRes.data.access_token) {
        accessToken = longRes.data.access_token;
      }
    } catch {
      // Short token ile devam et
    }

    // 3. Phone number bilgilerini al
    let displayName = null;
    let phoneNumber = null;
    try {
      const phoneRes = await axios.get(`https://graph.facebook.com/v21.0/${phone_number_id}`, {
        params: { fields: 'verified_name,display_phone_number,quality_rating' },
        headers: { 'Authorization': `Bearer ${accessToken}` }
      });
      displayName = phoneRes.data.verified_name || null;
      phoneNumber = phoneRes.data.display_phone_number || null;
    } catch {
      // Bilgi alınamazsa devam et
    }

    // 4. WABA'yı uygulamaya subscribe et (webhook almak için)
    if (waba_id) {
      try {
        await axios.post(`https://graph.facebook.com/v21.0/${waba_id}/subscribed_apps`, {}, {
          headers: { 'Authorization': `Bearer ${accessToken}` }
        });
      } catch {
        // Subscribe başarısız olsa da devam et
      }
    }

    // 5. DB'ye kaydet
    const sql = neon(process.env.POSTGRES_URL);

    // Aynı phone_number_id var mı?
    const [existing] = await sql`SELECT id, user_id FROM whatsapp_accounts WHERE phone_number_id = ${phone_number_id}`;
    if (existing && existing.user_id !== user.id) {
      return Response.json({ error: 'Bu numara başka bir hesaba bağlı' }, { status: 400 });
    }

    let account;
    if (existing) {
      // Güncelle
      [account] = await sql`
        UPDATE whatsapp_accounts 
        SET access_token = ${accessToken}, business_account_id = ${waba_id || null}, 
            display_name = ${displayName}, phone_number = ${phoneNumber}, is_active = true
        WHERE id = ${existing.id}
        RETURNING id, phone_number_id, phone_number, display_name, is_active, created_at
      `;
    } else {
      // Yeni ekle
      [account] = await sql`
        INSERT INTO whatsapp_accounts (user_id, phone_number_id, business_account_id, access_token, phone_number, display_name)
        VALUES (${user.id}, ${phone_number_id}, ${waba_id || null}, ${accessToken}, ${phoneNumber}, ${displayName})
        RETURNING id, phone_number_id, phone_number, display_name, is_active, created_at
      `;
    }

    return Response.json({ success: true, account });
  } catch (error) {
    console.error('Token exchange hatası:', error.response?.data || error.message);
    return Response.json({ error: 'WhatsApp bağlantısı başarısız: ' + (error.response?.data?.error?.message || error.message) }, { status: 500 });
  }
}
