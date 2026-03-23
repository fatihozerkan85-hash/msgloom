import { neon } from '@neondatabase/serverless';

export async function GET() {
  const sql = neon(process.env.POSTGRES_URL);

  const [totalResult] = await sql`SELECT COUNT(*) as count FROM messages`;
  const [incomingResult] = await sql`SELECT COUNT(*) as count FROM messages WHERE direction = 'incoming'`;
  const [outgoingResult] = await sql`SELECT COUNT(*) as count FROM messages WHERE direction = 'outgoing'`;
  const [contactsResult] = await sql`SELECT COUNT(DISTINCT phone) as count FROM messages`;

  return Response.json({
    total: Number(totalResult.count),
    incoming: Number(incomingResult.count),
    outgoing: Number(outgoingResult.count),
    contacts: Number(contactsResult.count),
  });
}
