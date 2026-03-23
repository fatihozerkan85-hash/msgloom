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

    if (body.object === 'whatsapp_business_account') {
      const sql = neon(process.env.POSTGRES_URL);

      for (const entry of body.entry) {
        for (const change of entry.changes) {
          if (change.field === 'messages' && change.value.messages) {
            for (const message of change.value.messages) {
              await sql`INSERT INTO messages (direction, phone, type, text_body, wa_message_id, raw_data)
                VALUES ('incoming', ${message.from}, ${message.type}, ${message.text?.body || null}, ${message.id}, ${JSON.stringify(message)})`;
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
