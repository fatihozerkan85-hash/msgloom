import { neon } from '@neondatabase/serverless';
import { verifyPassword, createToken } from '@/lib/auth';
import { rateLimit, resetRateLimit } from '@/lib/rateLimit';

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: 'Email ve şifre gerekli' }, { status: 400 });
    }

    // Rate limiting — IP + email bazlı
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rlKey = `login:${ip}:${email}`;
    const rl = rateLimit(rlKey, { maxAttempts: 5, windowMs: 15 * 60 * 1000 });
    if (!rl.allowed) {
      return Response.json({ error: `Çok fazla deneme. ${rl.retryAfter} saniye sonra tekrar deneyin.` }, { status: 429 });
    }

    const sql = neon(process.env.POSTGRES_URL);
    const [user] = await sql`SELECT * FROM users WHERE email = ${email}`;

    if (!user) {
      return Response.json({ error: 'Email veya şifre hatalı' }, { status: 401 });
    }

    const valid = await verifyPassword(password, user.password_hash);
    if (!valid) {
      return Response.json({ error: 'Email veya şifre hatalı' }, { status: 401 });
    }

    if (!user.email_verified) {
      return Response.json({ error: 'E-posta adresiniz doğrulanmamış', needsVerification: true, email: user.email }, { status: 403 });
    }

    // Başarılı giriş — rate limit sıfırla
    resetRateLimit(rlKey);

    const token = createToken(user);
    const { password_hash, verification_code, verification_expires, ...safeUser } = user;

    return Response.json({ success: true, user: safeUser }, {
      headers: { 'Set-Cookie': `token=${token}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${7 * 24 * 60 * 60}` }
    });
  } catch (error) {
    console.error('Giriş hatası:', error);
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
