import { neon } from '@neondatabase/serverless';
import { getUser } from '@/lib/auth';

export async function GET(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  const sql = neon(process.env.POSTGRES_URL);

  await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS email VARCHAR(255)`;
  await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS company VARCHAR(255)`;
  await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS notes TEXT`;
  await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS pipeline_stage VARCHAR(30) DEFAULT 'new'`;
  await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS deal_value DECIMAL(12,2) DEFAULT 0`;
  await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS source VARCHAR(50)`;
  await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS assigned_to VARCHAR(255)`;

  const { searchParams } = new URL(request.url);
  const stage = searchParams.get('stage');
  const search = searchParams.get('search');

  let contacts;
  if (stage && stage !== 'all') {
    contacts = await sql`
      SELECT * FROM contacts WHERE user_id = ${user.id} AND pipeline_stage = ${stage}
      ORDER BY last_message_at DESC NULLS LAST
    `;
  } else if (search) {
    const q = `%${search}%`;
    contacts = await sql`
      SELECT * FROM contacts WHERE user_id = ${user.id} 
      AND (name ILIKE ${q} OR phone ILIKE ${q} OR email ILIKE ${q} OR company ILIKE ${q} OR platform_contact_id ILIKE ${q})
      ORDER BY last_message_at DESC NULLS LAST
    `;
  } else {
    contacts = await sql`
      SELECT * FROM contacts WHERE user_id = ${user.id}
      ORDER BY last_message_at DESC NULLS LAST
    `;
  }

  // Pipeline istatistikleri
  const stats = await sql`
    SELECT pipeline_stage, COUNT(*) as count, COALESCE(SUM(deal_value), 0) as total_value
    FROM contacts WHERE user_id = ${user.id}
    GROUP BY pipeline_stage
  `;

  return Response.json({ contacts, stats });
}

export async function PUT(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { id, name, email, company, phone, notes, pipeline_stage, deal_value, tags, source, assigned_to } = await request.json();
    const sql = neon(process.env.POSTGRES_URL);

    const [updated] = await sql`
      UPDATE contacts SET
        name = COALESCE(${name ?? null}, name),
        email = COALESCE(${email ?? null}, email),
        company = COALESCE(${company ?? null}, company),
        phone = COALESCE(${phone ?? null}, phone),
        notes = COALESCE(${notes ?? null}, notes),
        pipeline_stage = COALESCE(${pipeline_stage ?? null}, pipeline_stage),
        deal_value = COALESCE(${deal_value ?? null}, deal_value),
        tags = COALESCE(${tags ?? null}, tags),
        source = COALESCE(${source ?? null}, source),
        assigned_to = COALESCE(${assigned_to ?? null}, assigned_to)
      WHERE id = ${id} AND user_id = ${user.id}
      RETURNING *
    `;

    if (!updated) return Response.json({ error: 'Bulunamadı' }, { status: 404 });
    return Response.json({ success: true, contact: updated });
  } catch (error) {
    console.error('CRM güncelleme hatası:', error);
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { name, email, company, phone, platform, notes, pipeline_stage, deal_value, tags, source } = await request.json();
    if (!name) return Response.json({ error: 'İsim gerekli' }, { status: 400 });

    const sql = neon(process.env.POSTGRES_URL);
    const contactId = phone || email || `manual-${Date.now()}`;

    const [contact] = await sql`
      INSERT INTO contacts (user_id, platform, platform_contact_id, name, email, company, phone, notes, pipeline_stage, deal_value, tags, source)
      VALUES (${user.id}, ${platform || 'manual'}, ${contactId}, ${name}, ${email || null}, ${company || null}, ${phone || null}, ${notes || null}, ${pipeline_stage || 'new'}, ${deal_value || 0}, ${tags || []}, ${source || 'manual'})
      RETURNING *
    `;

    return Response.json({ success: true, contact });
  } catch (error) {
    console.error('CRM ekleme hatası:', error);
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}
