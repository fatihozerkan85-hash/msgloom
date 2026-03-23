import { neon } from '@neondatabase/serverless';
import { getUser } from '@/lib/auth';

export async function GET(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  const sql = neon(process.env.POSTGRES_URL);
  const accounts = await sql`SELECT id, phone_number_id, business_account_id, phone_number, is_active, created_at FROM whatsapp_accounts WHERE user_id = ${user.id}`;
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

    const sql = neon(process.env.POSTGRES_URL);
    const [account] = await sql`
      INSERT INTO whatsapp_accounts (user_id, phone_number_id, business_account_id, access_token, phone_number)
      VALUES (${user.id}, ${phone_number_id}, ${business_account_id || null}, ${access_token}, ${phone_number || null})
      RETURNING id, phone_number_id, phone_number, is_active, created_at
    `;

    return Response.json({ success: true, account });
  } catch (error) {
    console.error('WhatsApp hesap ekleme hatası:', error);
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
