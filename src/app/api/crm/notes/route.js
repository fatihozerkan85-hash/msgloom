import { neon } from '@neondatabase/serverless';
import { getUser } from '@/lib/auth';

export async function GET(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  const sql = neon(process.env.POSTGRES_URL);

  await sql`CREATE TABLE IF NOT EXISTS crm_notes (
    id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    contact_id INTEGER NOT NULL, note TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW()
  )`;

  const { searchParams } = new URL(request.url);
  const contactId = searchParams.get('contact_id');

  const notes = await sql`
    SELECT * FROM crm_notes WHERE user_id = ${user.id} AND contact_id = ${contactId}
    ORDER BY created_at DESC
  `;
  return Response.json({ notes });
}

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  const { contact_id, note } = await request.json();
  if (!contact_id || !note) return Response.json({ error: 'Eksik bilgi' }, { status: 400 });

  const sql = neon(process.env.POSTGRES_URL);
  const [created] = await sql`
    INSERT INTO crm_notes (user_id, contact_id, note) VALUES (${user.id}, ${contact_id}, ${note}) RETURNING *
  `;
  return Response.json({ success: true, note: created });
}

export async function DELETE(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  const { id } = await request.json();
  const sql = neon(process.env.POSTGRES_URL);
  await sql`DELETE FROM crm_notes WHERE id = ${id} AND user_id = ${user.id}`;
  return Response.json({ success: true });
}
