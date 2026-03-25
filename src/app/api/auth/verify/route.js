import { neon } from '@neondatabase/serverless';
import { createToken } from '@/lib/auth';

export async function POST(request) {
  try {
    const { email, code } = await request.json();

    if (!email || !code) {
      return Response.json({ error: 'Email ve doğrulama kodu gerekli' }, { status: 400 });
    }

    const sql = neon(process.env.POSTGRES_URL);
    const [user] = await sql`
      SELECT id, email, name, company, plan, is_admin, verification_code, verification_expires
      FROM users WHERE email = ${email}
    `;

    if (!user) {
      return Response.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    if (user.verification_code !== code) {
      return Response.json({ error: 'Doğrulama kodu hatalı' }, { status: 400 });
    }

    if (new Date(user.verification_expires) < new Date()) {
      return Response.json({ error: 'Doğrulama kodunun süresi dolmuş. Lütfen yeni kod isteyin.' }, { status: 400 });
    }

    await sql`
      UPDATE users SET email_verified = true, verification_code = NULL, verification_expires = NULL
      WHERE id = ${user.id}
    `;

    const token = createToken({ id: user.id, email: user.email, plan: user.plan, is_admin: user.is_admin });

    return Response.json({ success: true, user: { id: user.id, email: user.email, name: user.name, company: user.company, plan: user.plan } }, {
      headers: { 'Set-Cookie': `token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}` }
    });
  } catch (error) {
    console.error('Doğrulama hatası:', error);
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
