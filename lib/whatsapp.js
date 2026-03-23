const axios = require('axios');

const WHATSAPP_API = 'https://graph.facebook.com/v21.0';

async function sendTextMessage(to, message) {
  const url = `${WHATSAPP_API}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const response = await axios.post(url, {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: message }
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data;
}

async function sendTemplateMessage(to, templateName, languageCode = 'tr') {
  const url = `${WHATSAPP_API}/${process.env.WHATSAPP_PHONE_NUMBER_ID}/messages`;

  const response = await axios.post(url, {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: {
      name: templateName,
      language: { code: languageCode }
    }
  }, {
    headers: {
      'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data;
}

module.exports = { sendTextMessage, sendTemplateMessage };
