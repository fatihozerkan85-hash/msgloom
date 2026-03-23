import { neon } from '@neondatabase/serverless';
import { getUser } from '@/lib/auth';

export async function GET(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  const sql = neon(process.env.POSTGRES_URL);
  const messages = await sql`SELECT * FROM messages WHERE user_id = ${user.id} ORDER BY created_at DESC LIMIT 100`;
  return Response.json({ messages });
}
