import jwt from 'jsonwebtoken';

const ADMIN_SECRET = process.env.JWT_SECRET || 'msgloom-secret-key-change-this';

export async function POST(request) {
  try {
    const body = await request.text();
    let password = '';
    try {
      const parsed = JSON.parse(body);
      password = String(parsed.password || '').trim();
    } catch {
      return Response.json({ error: 'Geçersiz istek' }, { status: 400 });
    }

    if (password === 'msgloom2026') {
      const token = jwt.sign({ role: 'admin' }, ADMIN_SECRET, { expiresIn: '24h' });
      const cookie = `admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${24 * 60 * 60}`;
      return Response.json({ success: true }, {
        headers: { 'Set-Cookie': cookie }
      });
    }

    return Response.json({ error: 'Hatalı şifre' }, { status: 401 });
  } catch (error) {
    return Response.json({ error: 'Sunucu hatası: ' + error.message }, { status: 500 });
  }
}

export async function GET(request) {
  try {
    const cookie = request.cookies.get('admin_token')?.value;
    if (!cookie) return Response.json({ authenticated: false }, { status: 401 });

    const decoded = jwt.verify(cookie, ADMIN_SECRET);
    if (decoded.role !== 'admin') return Response.json({ authenticated: false }, { status: 401 });

    return Response.json({ authenticated: true });
  } catch {
    return Response.json({ authenticated: false }, { status: 401 });
  }
}
