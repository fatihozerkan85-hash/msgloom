const axios = require('axios');

const WHATSAPP_API = 'https://graph.facebook.com/v21.0';

async function sendTextMessage(phoneNumberId, accessToken, to, message) {
  const url = `${WHATSAPP_API}/${phoneNumberId}/messages`;
  const response = await axios.post(url, {
    messaging_product: 'whatsapp',
    to,
    type: 'text',
    text: { body: message }
  }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
}

async function sendTemplateMessage(phoneNumberId, accessToken, to, templateName, languageCode = 'tr') {
  const url = `${WHATSAPP_API}/${phoneNumberId}/messages`;
  const response = await axios.post(url, {
    messaging_product: 'whatsapp',
    to,
    type: 'template',
    template: { name: templateName, language: { code: languageCode } }
  }, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json'
    }
  });
  return response.data;
}

module.exports = { sendTextMessage, sendTemplateMessage };
