const { getDb } = require('../lib/db');

module.exports = async function handler(req, res) {
  // GET - WhatsApp webhook doğrulama
  if (req.method === 'GET') {
    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
      console.log('Webhook doğrulandı');
      return res.status(200).send(challenge);
    }
    return res.status(403).json({ error: 'Doğrulama başarısız' });
  }

  // POST - Gelen mesajları işle
  if (req.method === 'POST') {
    try {
      const body = req.body;

      if (body.object === 'whatsapp_business_account') {
        const sql = getDb();

        for (const entry of body.entry) {
          for (const change of entry.changes) {
            if (change.field === 'messages' && change.value.messages) {
              for (const message of change.value.messages) {
                await sql`
                  INSERT INTO messages (direction, phone, type, text_body, wa_message_id, raw_data)
                  VALUES ('incoming', ${message.from}, ${message.type}, ${message.text?.body || null}, ${message.id}, ${JSON.stringify(message)})
                `;
                console.log('Mesaj alındı:', message.from);
              }
            }
          }
        }
      }

      return res.status(200).json({ status: 'ok' });
    } catch (error) {
      console.error('Webhook hatası:', error);
      return res.status(500).json({ error: 'Sunucu hatası' });
    }
  }

  return res.status(405).json({ error: 'Method not allowed' });
};
