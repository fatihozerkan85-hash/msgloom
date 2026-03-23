import { neon } from '@neondatabase/serverless';
import { getUser } from '@/lib/auth';

export async function GET(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  const sql = neon(process.env.POSTGRES_URL);
  const contacts = await sql`
    SELECT phone, COUNT(*) as message_count, MAX(created_at) as last_message
    FROM messages WHERE user_id = ${user.id}
    GROUP BY phone ORDER BY last_message DESC
  `;
  return Response.json({ contacts });
}
