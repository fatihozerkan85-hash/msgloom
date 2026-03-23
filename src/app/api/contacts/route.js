import { neon } from '@neondatabase/serverless';

export async function GET() {
  const sql = neon(process.env.POSTGRES_URL);
  const contacts = await sql`
    SELECT phone, COUNT(*) as message_count, MAX(created_at) as last_message
    FROM messages
    GROUP BY phone
    ORDER BY last_message DESC
  `;
  return Response.json({ contacts });
}
