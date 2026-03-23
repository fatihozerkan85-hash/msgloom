import { neon } from '@neondatabase/serverless';

export async function GET() {
  const sql = neon(process.env.POSTGRES_URL);
  const messages = await sql`SELECT * FROM messages ORDER BY created_at DESC LIMIT 100`;
  return Response.json({ messages });
}
