import { neon } from '@neondatabase/serverless';
import { hashPassword, createToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, password, name, company } = await request.json();

    if (!email || !password) {
      return Response.json({ error: 'Email ve şifre gerekli' }, { status: 400 });
    }

    const sql = neon(process.env.POSTGRES_URL);
    const [existing] = await sql`SELECT id FROM users WHERE email = ${email}`;

    if (existing) {
      return Response.json({ error: 'Bu email zaten kayıtlı' }, { status: 400 });
    }

    const password_hash = await hashPassword(password);
    const [user] = await sql`
      INSERT INTO users (email, password_hash, name, company)
      VALUES (${email}, ${password_hash}, ${name || null}, ${company || null})
      RETURNING id, email, name, company, plan, is_admin
    `;

    const token = createToken(user);

    return Response.json({ success: true, user }, {
      headers: { 'Set-Cookie': `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}` }
    });
  } catch (error) {
    console.error('Kayıt hatası:', error);
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
