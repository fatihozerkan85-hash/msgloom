import { neon } from '@neondatabase/serverless';

export async function GET() {
  const sql = neon(process.env.POSTGRES_URL);
  const plans = await sql`SELECT * FROM plans WHERE is_active = true ORDER BY price_monthly ASC`;
  return Response.json({ plans });
}
