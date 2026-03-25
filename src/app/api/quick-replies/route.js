import { neon } from '@neondatabase/serverless';
import { getUser } from '@/lib/auth';

export async function GET(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  const sql = neon(process.env.POSTGRES_URL);
  await sql`CREATE TABLE IF NOT EXISTS quick_replies (
    id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) NOT NULL, message TEXT NOT NULL, shortcut VARCHAR(20),
    created_at TIMESTAMP DEFAULT NOW()
  )`;

  const replies = await sql`SELECT * FROM quick_replies WHERE user_id = ${user.id} ORDER BY created_at DESC`;
  return Response.json({ replies });
}

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  const { title, message, shortcut } = await request.json();
  if (!title || !message) return Response.json({ error: 'Başlık ve mesaj gerekli' }, { status: 400 });

  const sql = neon(process.env.POSTGRES_URL);
  const [reply] = await sql`
    INSERT INTO quick_replies (user_id, title, message, shortcut)
    VALUES (${user.id}, ${title}, ${message}, ${shortcut || null}) RETURNING *
  `;
  return Response.json({ success: true, reply });
}

export async function DELETE(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  const { id } = await request.json();
  const sql = neon(process.env.POSTGRES_URL);
  await sql`DELETE FROM quick_replies WHERE id = ${id} AND user_id = ${user.id}`;
  return Response.json({ success: true });
}
