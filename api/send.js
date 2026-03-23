const { sendTextMessage, sendTemplateMessage } = require('../lib/whatsapp');
const { getDb } = require('../lib/db');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { to, message, type = 'text', template } = req.body;

    if (!to) {
      return res.status(400).json({ error: 'Telefon numarası gerekli' });
    }

    let result;

    if (type === 'template' && template) {
      result = await sendTemplateMessage(to, template);
    } else if (message) {
      result = await sendTextMessage(to, message);
    } else {
      return res.status(400).json({ error: 'Mesaj veya template gerekli' });
    }

    // Gönderilen mesajı kaydet
    const sql = getDb();
    await sql`
      INSERT INTO messages (direction, phone, type, text_body, template_name, wa_message_id)
      VALUES ('outgoing', ${to}, ${type}, ${message || null}, ${template || null}, ${result.messages?.[0]?.id || null})
    `;

    return res.status(200).json({ success: true, data: result });
  } catch (error) {
    console.error('Mesaj gönderme hatası:', error.response?.data || error.message);
    return res.status(500).json({ error: error.response?.data || 'Sunucu hatası' });
  }
};
