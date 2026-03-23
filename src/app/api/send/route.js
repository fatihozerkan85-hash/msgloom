import { neon } from '@neondatabase/serverless';
import { getUser } from '@/lib/auth';
import axios from 'axios';

const WHATSAPP_API = 'https://graph.facebook.com/v21.0';

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { to, message, type = 'text', template } = await request.json();
    if (!to) return Response.json({ error: 'Telefon numarası gerekli' }, { status: 400 });

    const sql = neon(process.env.POSTGRES_URL);

    // Kullanıcının WhatsApp hesabını bul
    const [account] = await sql`SELECT * FROM whatsapp_accounts WHERE user_id = ${user.id} AND is_active = true LIMIT 1`;
    if (!account) return Response.json({ error: 'WhatsApp hesabı bağlı değil' }, { status: 400 });

    const url = `${WHATSAPP_API}/${account.phone_number_id}/messages`;
    const headers = { 'Authorization': `Bearer ${account.access_token}`, 'Content-Type': 'application/json' };

    let result;
    if (type === 'template' && template) {
      result = await axios.post(url, {
        messaging_product: 'whatsapp', to, type: 'template',
        template: { name: template, language: { code: 'tr' } }
      }, { headers });
    } else if (message) {
      result = await axios.post(url, {
        messaging_product: 'whatsapp', to, type: 'text', text: { body: message }
      }, { headers });
    } else {
      return Response.json({ error: 'Mesaj veya template gerekli' }, { status: 400 });
    }

    await sql`INSERT INTO messages (user_id, direction, phone, type, text_body, template_name, wa_message_id)
      VALUES (${user.id}, 'outgoing', ${to}, ${type}, ${message || null}, ${template || null}, ${result.data.messages?.[0]?.id || null})`;

    return Response.json({ success: true, data: result.data });
  } catch (error) {
    console.error('Mesaj gönderme hatası:', error.response?.data || error.message);
    return Response.json({ error: error.response?.data || 'Sunucu hatası' }, { status: 500 });
  }
}
