import { neon } from '@neondatabase/serverless';
import axios from 'axios';

const WHATSAPP_API = 'https://graph.facebook.com/v21.0';

async function sendTextMessage(to, message) {
  const url = `${WHATSAPP_API}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const response = await axios.post(url, {
    messaging_product: 'whatsapp', to, type: 'text', text: { body: message }
  }, {
    headers: { 'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' }
  });
  return response.data;
}

async function sendTemplateMessage(to, templateName, languageCode = 'tr') {
  const url = `${WHATSAPP_API}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;
  const response = await axios.post(url, {
    messaging_product: 'whatsapp', to, type: 'template',
    template: { name: templateName, language: { code: languageCode } }
  }, {
    headers: { 'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`, 'Content-Type': 'application/json' }
  });
  return response.data;
}

export async function POST(request) {
  try {
    const { to, message, type = 'text', template } = await request.json();

    if (!to) return Response.json({ error: 'Telefon numarası gerekli' }, { status: 400 });

    let result;
    if (type === 'template' && template) {
      result = await sendTemplateMessage(to, template);
    } else if (message) {
      result = await sendTextMessage(to, message);
    } else {
      return Response.json({ error: 'Mesaj veya template gerekli' }, { status: 400 });
    }

    const sql = neon(process.env.POSTGRES_URL);
    await sql`INSERT INTO messages (direction, phone, type, text_body, template_name, wa_message_id)
      VALUES ('outgoing', ${to}, ${type}, ${message || null}, ${template || null}, ${result.messages?.[0]?.id || null})`;

    return Response.json({ success: true, data: result });
  } catch (error) {
    console.error('Mesaj gönderme hatası:', error.response?.data || error.message);
    return Response.json({ error: error.response?.data || 'Sunucu hatası' }, { status: 500 });
  }
}
