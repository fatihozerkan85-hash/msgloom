import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';
import axios from 'axios';
import { getAutoReply } from '@/lib/autoReply';
import { verifyMetaWebhook } from '@/lib/webhookVerify';

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
    const rawBody = await request.text();
    const signature = request.headers.get('x-hub-signature-256');

    if (!verifyMetaWebhook(rawBody, signature)) {
      console.error('WhatsApp webhook imza doğrulaması başarısız');
      return Response.json({ error: 'Geçersiz imza' }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    if (body.object !== 'whatsapp_business_account') return Response.json({ status: 'ignored' });

    const sql = neon(process.env.POSTGRES_URL);

    for (const entry of body.entry) {
      for (const change of entry.changes) {
        if (change.field !== 'messages' || !change.value?.messages) continue;

        const phoneNumberId = change.value.metadata?.phone_number_id;
        if (!phoneNumberId) continue;

        const [account] = await sql`
          SELECT user_id, access_token FROM whatsapp_accounts 
          WHERE phone_number_id = ${phoneNumberId} AND is_active = true LIMIT 1
        `;
        if (!account) continue;

        const userId = account.user_id;

        for (const message of change.value.messages) {
          await sql`
            INSERT INTO messages (user_id, direction, phone, type, text_body, wa_message_id, raw_data, platform, contact_id)
            VALUES (${userId}, 'incoming', ${message.from}, ${message.type}, ${message.text?.body || null}, ${message.id}, ${JSON.stringify(message)}, 'whatsapp', ${message.from})
          `;

          await sql`
            INSERT INTO contacts (user_id, platform, platform_contact_id, phone, last_message_at, message_count)
            VALUES (${userId}, 'whatsapp', ${message.from}, ${message.from}, NOW(), 1)
            ON CONFLICT (user_id, platform, platform_contact_id) 
            DO UPDATE SET last_message_at = NOW(), message_count = contacts.message_count + 1
          `.catch(() => {});

          if (message.type !== 'text' || !message.text?.body) continue;

          const responseText = await getAutoReply(userId, message.text.body, 'whatsapp', message.from);

          if (responseText) {
            try {
              const sendRes = await axios.post(
                `${WHATSAPP_API}/${phoneNumberId}/messages`,
                { messaging_product: 'whatsapp', to: message.from, type: 'text', text: { body: responseText } },
                { headers: { 'Authorization': `Bearer ${account.access_token}`, 'Content-Type': 'application/json' } }
              );
              await sql`
                INSERT INTO messages (user_id, direction, phone, type, text_body, wa_message_id, platform, contact_id)
                VALUES (${userId}, 'outgoing', ${message.from}, 'text', ${responseText}, ${sendRes.data.messages?.[0]?.id || null}, 'whatsapp', ${message.from})
              `;
            } catch (err) {
              console.error('WA auto-reply error:', err.response?.data || err.message);
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
