import { neon } from '@neondatabase/serverless';
import { NextResponse } from 'next/server';

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

        // Gelen mesajın hangi phone_number_id'ye geldiğini bul
        const phoneNumberId = change.value.metadata?.phone_number_id;
        if (!phoneNumberId) continue;

        // Bu phone_number_id hangi kullanıcıya ait?
        const [account] = await sql`
          SELECT user_id FROM whatsapp_accounts 
          WHERE phone_number_id = ${phoneNumberId} AND is_active = true 
          LIMIT 1
        `;

        const userId = account?.user_id || null;

        for (const message of change.value.messages) {
          await sql`
            INSERT INTO messages (user_id, direction, phone, type, text_body, wa_message_id, raw_data)
            VALUES (${userId}, 'incoming', ${message.from}, ${message.type}, ${message.text?.body || null}, ${message.id}, ${JSON.stringify(message)})
          `;
        }
      }
    }

    return Response.json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook hatası:', error);
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
