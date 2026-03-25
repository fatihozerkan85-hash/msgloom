import { neon } from '@neondatabase/serverless';
import { generateCode, sendVerificationEmail } from '@/lib/email';

export async function POST(request) {
  try {
    const { email } = await request.json();

    if (!email) {
      return Response.json({ error: 'Email gerekli' }, { status: 400 });
    }

    const sql = neon(process.env.POSTGRES_URL);
    const [user] = await sql`SELECT id, email_verified FROM users WHERE email = ${email}`;

    if (!user) {
      return Response.json({ error: 'Kullanıcı bulunamadı' }, { status: 404 });
    }

    if (user.email_verified) {
      return Response.json({ error: 'Email zaten doğrulanmış' }, { status: 400 });
    }

    const code = generateCode();
    const expires = new Date(Date.now() + 10 * 60 * 1000);

    await sql`
      UPDATE users SET verification_code = ${code}, verification_expires = ${expires}
      WHERE id = ${user.id}
    `;

    const emailResult = await sendVerificationEmail(email, code);
    if (!emailResult.success) {
      return Response.json({ error: 'E-posta gönderilemedi' }, { status: 500 });
    }

    return Response.json({ success: true, message: 'Yeni doğrulama kodu gönderildi' });
  } catch (error) {
    console.error('Kod gönderme hatası:', error);
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
