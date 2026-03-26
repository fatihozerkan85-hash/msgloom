import { neon } from '@neondatabase/serverless';
import { getUser } from '@/lib/auth';
import axios from 'axios';

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { accessToken: shortToken } = await request.json();
    if (!shortToken) return Response.json({ error: 'Token gerekli' }, { status: 400 });

    // 1. Long-lived token'a çevir
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

    // 2. Kullanıcının WhatsApp Business hesaplarını bul
    // Önce shared WABA'ları kontrol et
    let wabaAccounts = [];
    try {
      const debugRes = await axios.get('https://graph.facebook.com/v21.0/debug_token', {
        params: { input_token: longToken, access_token: `${process.env.FACEBOOK_APP_ID}|${process.env.FACEBOOK_APP_SECRET}` }
      });
      const granularScopes = debugRes.data.data?.granular_scopes || [];
      const wabaScope = granularScopes.find(s => s.scope === 'whatsapp_business_management');
      if (wabaScope?.target_ids) {
        wabaAccounts = wabaScope.target_ids;
      }
    } catch {}

    // 3. Her WABA için phone number'ları al
    const sql = neon(process.env.POSTGRES_URL);
    const results = [];

    for (const wabaId of wabaAccounts) {
      try {
        const phonesRes = await axios.get(`https://graph.facebook.com/v21.0/${wabaId}/phone_numbers`, {
          params: { access_token: longToken }
        });

        for (const phone of (phonesRes.data.data || [])) {
          const phoneNumberId = phone.id;
          const displayName = phone.verified_name || phone.display_phone_number;
          const phoneNumber = phone.display_phone_number;

          // Zaten bağlı mı?
          const [existing] = await sql`
            SELECT id, user_id FROM whatsapp_accounts WHERE phone_number_id = ${phoneNumberId}
          `;

          if (existing && existing.user_id !== user.id) continue;

          let account;
          if (existing) {
            [account] = await sql`
              UPDATE whatsapp_accounts SET access_token = ${longToken}, business_account_id = ${wabaId},
                display_name = ${displayName}, phone_number = ${phoneNumber}, is_active = true
              WHERE id = ${existing.id}
              RETURNING id, phone_number_id, phone_number, display_name, is_active, created_at
            `;
          } else {
            [account] = await sql`
              INSERT INTO whatsapp_accounts (user_id, phone_number_id, business_account_id, access_token, phone_number, display_name)
              VALUES (${user.id}, ${phoneNumberId}, ${wabaId}, ${longToken}, ${phoneNumber}, ${displayName})
              RETURNING id, phone_number_id, phone_number, display_name, is_active, created_at
            `;
          }

          // WABA'yı subscribe et
          try {
            await axios.post(`https://graph.facebook.com/v21.0/${wabaId}/subscribed_apps`, {}, {
              headers: { 'Authorization': `Bearer ${longToken}` }
            });
          } catch {}

          results.push(account);
        }
      } catch (err) {
        console.error(`WABA ${wabaId} phone fetch error:`, err.response?.data || err.message);
      }
    }

    if (results.length === 0) {
      return Response.json({
        error: 'WhatsApp Business hesabı bulunamadı. Facebook ile giriş yaparken WhatsApp Business hesabınıza erişim izni verdiğinizden emin olun.'
      }, { status: 400 });
    }

    return Response.json({ success: true, accounts: results });
  } catch (error) {
    console.error('WhatsApp OAuth hatası:', error.response?.data || error.message);
    return Response.json({ error: 'WhatsApp bağlantısı başarısız: ' + (error.response?.data?.error?.message || error.message) }, { status: 500 });
  }
}
