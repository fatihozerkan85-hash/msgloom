import jwt from 'jsonwebtoken';
import { rateLimit, resetRateLimit } from '@/lib/rateLimit';

const ADMIN_SECRET = process.env.JWT_SECRET;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

export async function POST(request) {
  try {
    if (!ADMIN_SECRET || !ADMIN_PASSWORD) {
      return Response.json({ error: 'Sunucu yapılandırma hatası' }, { status: 500 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rlKey = `admin:${ip}`;
    const rl = rateLimit(rlKey, { maxAttempts: 3, windowMs: 30 * 60 * 1000 });
    if (!rl.allowed) {
      return Response.json({ error: `Çok fazla deneme. ${rl.retryAfter} saniye sonra tekrar deneyin.` }, { status: 429 });
    }

    const body = await request.text();
    let password = '';
    try {
      const parsed = JSON.parse(body);
      password = String(parsed.password || '').trim();
    } catch {
      return Response.json({ error: 'Geçersiz istek' }, { status: 400 });
    }

    if (password === ADMIN_PASSWORD) {
      resetRateLimit(rlKey);
      const token = jwt.sign({ role: 'admin' }, ADMIN_SECRET, { expiresIn: '4h' });
      const cookie = `admin_token=${token}; Path=/; HttpOnly; SameSite=Strict; Secure; Max-Age=${4 * 60 * 60}`;
      return Response.json({ success: true }, { headers: { 'Set-Cookie': cookie } });
    }

    return Response.json({ error: 'Hatalı şifre' }, { status: 401 });
  } catch (error) {
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const cookie = request.cookies.get('admin_token')?.value;
    if (!cookie) return Response.json({ authenticated: false }, { status: 401 });

    const decoded = jwt.verify(cookie, ADMIN_SECRET || '');
    if (decoded.role !== 'admin') return Response.json({ authenticated: false }, { status: 401 });

    return Response.json({ authenticated: true });
  } catch {
    return Response.json({ authenticated: false }, { status: 401 });
  }
}
