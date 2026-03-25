import { neon } from '@neondatabase/serverless';
import { getUser } from '@/lib/auth';

export async function GET(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  const sql = neon(process.env.POSTGRES_URL);

  // Tablo yoksa oluştur
  await sql`
    CREATE TABLE IF NOT EXISTS automations (
      id SERIAL PRIMARY KEY,
      user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type VARCHAR(20) NOT NULL DEFAULT 'keyword',
      trigger_text TEXT,
      response_text TEXT NOT NULL,
      is_active BOOLEAN DEFAULT true,
      priority INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )
  `;
  await sql`CREATE INDEX IF NOT EXISTS idx_automations_user_id ON automations(user_id)`;

  const automations = await sql`
    SELECT * FROM automations WHERE user_id = ${user.id} ORDER BY priority DESC, created_at DESC
  `;
  return Response.json({ automations });
}

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { type, trigger_text, response_text, platform } = await request.json();

    if (!response_text) {
      return Response.json({ error: 'Yanıt metni gerekli' }, { status: 400 });
    }

    if (type === 'keyword' && !trigger_text) {
      return Response.json({ error: 'Anahtar kelime gerekli' }, { status: 400 });
    }

    const sql = neon(process.env.POSTGRES_URL);

    // welcome tipi zaten varsa güncelle
    if (type === 'welcome') {
      const [existing] = await sql`SELECT id FROM automations WHERE user_id = ${user.id} AND type = 'welcome'`;
      if (existing) {
        const [updated] = await sql`
          UPDATE automations SET response_text = ${response_text}, is_active = true
          WHERE id = ${existing.id} RETURNING *
        `;
        return Response.json({ success: true, automation: updated });
      }
    }

    const priority = type === 'welcome' ? 100 : type === 'default' ? -1 : 0;

    const [automation] = await sql`
      INSERT INTO automations (user_id, type, trigger_text, response_text, priority, platform)
      VALUES (${user.id}, ${type}, ${trigger_text || null}, ${response_text}, ${priority}, ${platform || 'all'})
      RETURNING *
    `;

    return Response.json({ success: true, automation });
  } catch (error) {
    console.error('Otomasyon ekleme hatası:', error);
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function PUT(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { id, trigger_text, response_text, is_active } = await request.json();
    const sql = neon(process.env.POSTGRES_URL);

    const [updated] = await sql`
      UPDATE automations 
      SET trigger_text = COALESCE(${trigger_text}, trigger_text),
          response_text = COALESCE(${response_text}, response_text),
          is_active = COALESCE(${is_active}, is_active)
      WHERE id = ${id} AND user_id = ${user.id}
      RETURNING *
    `;

    if (!updated) return Response.json({ error: 'Bulunamadı' }, { status: 404 });
    return Response.json({ success: true, automation: updated });
  } catch (error) {
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { id } = await request.json();
    const sql = neon(process.env.POSTGRES_URL);
    await sql`DELETE FROM automations WHERE id = ${id} AND user_id = ${user.id}`;
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
