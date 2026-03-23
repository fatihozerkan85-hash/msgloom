import jwt from 'jsonwebtoken';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'msgloom2026';
const ADMIN_SECRET = process.env.JWT_SECRET || 'msgloom-secret-key-change-this';

export async function POST(request) {
  try {
    const { password } = await request.json();

    if (password !== ADMIN_PASSWORD) {
      return Response.json({ error: 'Hatalı şifre' }, { status: 401 });
    }

    const token = jwt.sign({ role: 'admin' }, ADMIN_SECRET, { expiresIn: '24h' });

    return Response.json({ success: true }, {
      headers: {
        'Set-Cookie': `admin_token=${token}; Path=/admin; HttpOnly; SameSite=Lax; Max-Age=${24 * 60 * 60}`
      }
    });
  } catch (error) {
    console.error('Admin auth error:', error);
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
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
