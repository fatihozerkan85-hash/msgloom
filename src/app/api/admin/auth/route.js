import jwt from 'jsonwebtoken';

const ADMIN_SECRET = process.env.JWT_SECRET || 'msgloom-secret-key-change-this';

export async function POST(request) {
  try {
    const body = await request.json();
    const password = (body.password || '').trim();
    const adminPass = (process.env.ADMIN_PASSWORD || 'msgloom2026').trim();

    if (!password || password !== adminPass) {
      return Response.json({ error: 'Hatalı şifre', hint: `len:${password.length}/${adminPass.length}` }, { status: 401 });
    }

    const token = jwt.sign({ role: 'admin', iat: Date.now() }, ADMIN_SECRET, { expiresIn: '24h' });

    const cookie = `admin_token=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${24 * 60 * 60}`;

    return Response.json({ success: true }, {
      headers: { 'Set-Cookie': cookie }
    });
  } catch (error) {
    console.error('Admin auth error:', error);
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
