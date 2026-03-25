import { neon } from '@neondatabase/serverless';
import { getUser } from '@/lib/auth';

export async function GET(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  const sql = neon(process.env.POSTGRES_URL);

  // Yeni contacts tablosundan çek, yoksa eski messages'tan
  try {
    const contacts = await sql`
      SELECT * FROM contacts WHERE user_id = ${user.id} ORDER BY last_message_at DESC
    `;
    return Response.json({ contacts });
  } catch {
    // Fallback: eski yapı
    const contacts = await sql`
      SELECT phone as platform_contact_id, 'whatsapp' as platform, COUNT(*) as message_count, MAX(created_at) as last_message_at
      FROM messages WHERE user_id = ${user.id}
      GROUP BY phone ORDER BY last_message_at DESC
    `;
    return Response.json({ contacts });
  }
}

export async function PUT(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  const { id, tags, name } = await request.json();
  const sql = neon(process.env.POSTGRES_URL);

  const [updated] = await sql`
    UPDATE contacts SET 
      tags = COALESCE(${tags || null}, tags),
      name = COALESCE(${name || null}, name)
    WHERE id = ${id} AND user_id = ${user.id} RETURNING *
  `;

  if (!updated) return Response.json({ error: 'Bulunamadı' }, { status: 404 });
  return Response.json({ success: true, contact: updated });
}
