import { neon } from '@neondatabase/serverless';
import { getUser } from '@/lib/auth';

export async function GET(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  const sql = neon(process.env.POSTGRES_URL);
  const [totalResult] = await sql`SELECT COUNT(*) as count FROM messages WHERE user_id = ${user.id}`;
  const [incomingResult] = await sql`SELECT COUNT(*) as count FROM messages WHERE user_id = ${user.id} AND direction = 'incoming'`;
  const [outgoingResult] = await sql`SELECT COUNT(*) as count FROM messages WHERE user_id = ${user.id} AND direction = 'outgoing'`;
  const [contactsResult] = await sql`SELECT COUNT(DISTINCT phone) as count FROM messages WHERE user_id = ${user.id}`;

  return Response.json({
    total: Number(totalResult.count),
    incoming: Number(incomingResult.count),
    outgoing: Number(outgoingResult.count),
    contacts: Number(contactsResult.count),
  });
}
