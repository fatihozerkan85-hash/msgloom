import { neon } from '@neondatabase/serverless';
import { getUser } from '@/lib/auth';

function isAdminHeader(request) {
  const authHeader = request.headers.get('x-admin-key');
  return authHeader === process.env.ADMIN_PASSWORD;
}

export async function GET() {
  try {
    const sql = neon(process.env.POSTGRES_URL);

    // Tablo yoksa oluştur ve varsayılan içerikleri ekle
    await sql`CREATE TABLE IF NOT EXISTS site_content (
      id SERIAL PRIMARY KEY,
      section VARCHAR(50) NOT NULL,
      key VARCHAR(100) NOT NULL,
      value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(section, key)
    )`;

    const rows = await sql`SELECT section, key, value FROM site_content ORDER BY section, key`;

    // Objeye dönüştür: { hero: { title: '...', subtitle: '...' }, ... }
    const content = {};
    for (const row of rows) {
      if (!content[row.section]) content[row.section] = {};
      content[row.section][row.key] = row.value;
    }

    return Response.json({ content });
  } catch (error) {
    console.error('Content GET error:', error);
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function PUT(request) {
  const adminOk = isAdminHeader(request);
  const user = await getUser(request);
  if (!adminOk && (!user || !user.is_admin)) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { section, key, value } = await request.json();
    if (!section || !key || value === undefined) {
      return Response.json({ error: 'section, key ve value gerekli' }, { status: 400 });
    }

    const sql = neon(process.env.POSTGRES_URL);

    await sql`INSERT INTO site_content (section, key, value, updated_at)
      VALUES (${section}, ${key}, ${value}, NOW())
      ON CONFLICT (section, key) DO UPDATE SET value = ${value}, updated_at = NOW()`;

    return Response.json({ success: true });
  } catch (error) {
    console.error('Content PUT error:', error);
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
