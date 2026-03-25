import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import axios from 'axios';

const WHATSAPP_API = 'https://graph.facebook.com/v21.0';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const mode = searchParams.get('hub.mode');
  const token = searchParams.get('hub.verify_token');
  const challenge = searchParams.get('hub.challenge');

  if (mode === 'subscribe' && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  return Response.json({ error: 'Doğrulama başarısız' }, { status: 403 });
}

export async function POST(request) {
  try {
    const body = await request.json();

    if (body.object !== 'whatsapp_business_account') {
      return Response.json({ status: 'ignored' });
    }

    const sql = neon(process.env.POSTGRES_URL);

    for (const entry of body.entry) {
      for (const change of entry.changes) {
        if (change.field !== 'messages' || !change.value?.messages) continue;

        const phoneNumberId = change.value.metadata?.phone_number_id;
        if (!phoneNumberId) continue;

        // Bu phone_number_id hangi kullanıcıya ait?
        const [account] = await sql`
          SELECT user_id, access_token FROM whatsapp_accounts 
          WHERE phone_number_id = ${phoneNumberId} AND is_active = true 
          LIMIT 1
        `;

        if (!account) continue;

        const userId = account.user_id;
        const accessToken = account.access_token;

        for (const message of change.value.messages) {
          // Mesajı kaydet
          await sql`
            INSERT INTO messages (user_id, direction, phone, type, text_body, wa_message_id, raw_data, platform, contact_id)
            VALUES (${userId}, 'incoming', ${message.from}, ${message.type}, ${message.text?.body || null}, ${message.id}, ${JSON.stringify(message)}, 'whatsapp', ${message.from})
          `;

          // Kişiyi güncelle
          await sql`
            INSERT INTO contacts (user_id, platform, platform_contact_id, phone, last_message_at, message_count)
            VALUES (${userId}, 'whatsapp', ${message.from}, ${message.from}, NOW(), 1)
            ON CONFLICT (user_id, platform, platform_contact_id) 
            DO UPDATE SET last_message_at = NOW(), message_count = contacts.message_count + 1
          `.catch(() => {});

          // Sadece text mesajlara otomatik yanıt ver
          if (message.type !== 'text' || !message.text?.body) continue;

          const incomingText = message.text.body.toLowerCase().trim();

          // Kullanıcının otomasyon kurallarını al
          const automations = await sql`
            SELECT * FROM automations 
            WHERE user_id = ${userId} AND is_active = true AND (platform = 'all' OR platform = 'whatsapp')
            ORDER BY priority DESC, created_at ASC
          `;

          if (automations.length === 0) continue;

          // İlk kez yazan mı kontrol et (karşılama mesajı için)
          const [prevMessages] = await sql`
            SELECT COUNT(*) as count FROM messages 
            WHERE user_id = ${userId} AND phone = ${message.from} AND direction = 'incoming'
          `;
          const isFirstMessage = Number(prevMessages.count) <= 1;

          let responseText = null;

          // 1. Karşılama mesajı (ilk kez yazanlara)
          if (isFirstMessage) {
            const welcome = automations.find(a => a.type === 'welcome');
            if (welcome) responseText = welcome.response_text;
          }

          // 2. Anahtar kelime eşleşmesi
          if (!responseText) {
            const keywordMatch = automations.find(a => {
              if (a.type !== 'keyword' || !a.trigger_text) return false;
              const keywords = a.trigger_text.toLowerCase().split(',').map(k => k.trim());
              return keywords.some(kw => incomingText.includes(kw));
            });
            if (keywordMatch) responseText = keywordMatch.response_text;
          }

          // 3. Varsayılan yanıt (hiçbir kural eşleşmezse)
          if (!responseText) {
            const defaultRule = automations.find(a => a.type === 'default');
            if (defaultRule) responseText = defaultRule.response_text;
          }

          // Yanıt gönder
          if (responseText) {
            try {
              const sendRes = await axios.post(
                `${WHATSAPP_API}/${phoneNumberId}/messages`,
                {
                  messaging_product: 'whatsapp',
                  to: message.from,
                  type: 'text',
                  text: { body: responseText }
                },
                { headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' } }
              );

              // Gönderilen yanıtı da kaydet
              await sql`
                INSERT INTO messages (user_id, direction, phone, type, text_body, wa_message_id)
                VALUES (${userId}, 'outgoing', ${message.from}, 'text', ${responseText}, ${sendRes.data.messages?.[0]?.id || null})
              `;
            } catch (err) {
              console.error('Otomatik yanıt gönderilemedi:', err.response?.data || err.message);
            }
          }
        }
      }
    }

    return Response.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook hatası:', error);
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
