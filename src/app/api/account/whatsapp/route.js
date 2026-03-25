import { neon } from '@neondatabase/serverless';
import { getUser } from '@/lib/auth';
import axios from 'axios';

export async function GET(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  const sql = neon(process.env.POSTGRES_URL);
  const accounts = await sql`
    SELECT id, phone_number_id, business_account_id, phone_number, display_name, is_active, created_at 
    FROM whatsapp_accounts WHERE user_id = ${user.id} ORDER BY created_at DESC
  `;
  return Response.json({ accounts });
}

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { phone_number_id, business_account_id, access_token, phone_number } = await request.json();

    if (!phone_number_id || !access_token) {
      return Response.json({ error: 'Phone Number ID ve Access Token gerekli' }, { status: 400 });
    }

    // Token'ı doğrula — Meta API'ye test isteği at
    try {
      const verifyRes = await axios.get(`https://graph.facebook.com/v21.0/${phone_number_id}`, {
        headers: { 'Authorization': `Bearer ${access_token}` }
      });
      var displayName = verifyRes.data.verified_name || verifyRes.data.display_phone_number || null;
    } catch (err) {
      const msg = err.response?.data?.error?.message || 'Token veya Phone Number ID geçersiz';
      return Response.json({ error: `WhatsApp doğrulama başarısız: ${msg}` }, { status: 400 });
    }

    const sql = neon(process.env.POSTGRES_URL);

    // Aynı phone_number_id zaten var mı?
    const [existing] = await sql`SELECT id FROM whatsapp_accounts WHERE phone_number_id = ${phone_number_id}`;
    if (existing) {
      return Response.json({ error: 'Bu WhatsApp numarası zaten başka bir hesaba bağlı' }, { status: 400 });
    }

    const [account] = await sql`
      INSERT INTO whatsapp_accounts (user_id, phone_number_id, business_account_id, access_token, phone_number, display_name)
      VALUES (${user.id}, ${phone_number_id}, ${business_account_id || null}, ${access_token}, ${phone_number || null}, ${displayName})
      RETURNING id, phone_number_id, phone_number, display_name, is_active, created_at
    `;

    return Response.json({ success: true, account });
  } catch (error) {
    console.error('WhatsApp hesap ekleme hatası:', error);
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { id } = await request.json();
    const sql = neon(process.env.POSTGRES_URL);

    const result = await sql`DELETE FROM whatsapp_accounts WHERE id = ${id} AND user_id = ${user.id} RETURNING id`;
    if (result.length === 0) {
      return Response.json({ error: 'Hesap bulunamadı' }, { status: 404 });
    }

    return Response.json({ success: true });
  } catch (error) {
    console.error('WhatsApp hesap silme hatası:', error);
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
