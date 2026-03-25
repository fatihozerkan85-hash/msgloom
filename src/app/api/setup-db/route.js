import { neon } from '@neondatabase/serverless';

export async function POST(request) {
  try {
    const body = await request.json().catch(() => ({}));
    const secret = body.secret;
    const validSecret = process.env.JWT_SECRET || 'msgloom-secret-key-change-this';
    if (secret && secret !== validSecret) {
      return Response.json({ error: 'Yetkisiz' }, { status: 401 });
    }

    const sql = neon(process.env.POSTGRES_URL);

    await sql`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255), company VARCHAR(255), plan VARCHAR(50) DEFAULT 'free',
      is_admin BOOLEAN DEFAULT false, email_verified BOOLEAN DEFAULT false,
      verification_code VARCHAR(6), verification_expires TIMESTAMP, created_at TIMESTAMP DEFAULT NOW()
    )`;

    await sql`CREATE TABLE IF NOT EXISTS channels (
      id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      platform VARCHAR(20) NOT NULL, platform_id VARCHAR(255) NOT NULL,
      access_token TEXT NOT NULL, display_name VARCHAR(255), phone_number VARCHAR(50),
      business_account_id VARCHAR(100), extra JSONB DEFAULT '{}',
      is_active BOOLEAN DEFAULT true, created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(platform, platform_id)
    )`;

    await sql`CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY, user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
      channel_id INTEGER REFERENCES channels(id) ON DELETE SET NULL,
      platform VARCHAR(20) DEFAULT 'whatsapp', direction VARCHAR(10) NOT NULL,
      contact_id VARCHAR(100) NOT NULL, contact_name VARCHAR(255),
      type VARCHAR(20) DEFAULT 'text', text_body TEXT, media_url TEXT,
      platform_message_id VARCHAR(255), raw_data JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    )`;

    await sql`CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      platform VARCHAR(20) NOT NULL, platform_contact_id VARCHAR(100) NOT NULL,
      name VARCHAR(255), phone VARCHAR(50), tags TEXT[] DEFAULT '{}',
      last_message_at TIMESTAMP, message_count INTEGER DEFAULT 0,
      extra JSONB DEFAULT '{}', created_at TIMESTAMP DEFAULT NOW(),
      UNIQUE(user_id, platform, platform_contact_id)
    )`;

    await sql`CREATE TABLE IF NOT EXISTS automations (
      id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      platform VARCHAR(20) DEFAULT 'all', type VARCHAR(20) NOT NULL DEFAULT 'keyword',
      trigger_text TEXT, response_text TEXT NOT NULL,
      is_active BOOLEAN DEFAULT true, priority INTEGER DEFAULT 0,
      created_at TIMESTAMP DEFAULT NOW()
    )`;

    await sql`CREATE TABLE IF NOT EXISTS quick_replies (
      id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(100) NOT NULL, message TEXT NOT NULL, shortcut VARCHAR(20),
      created_at TIMESTAMP DEFAULT NOW()
    )`;

    await sql`CREATE TABLE IF NOT EXISTS broadcasts (
      id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      platform VARCHAR(20) NOT NULL, message TEXT NOT NULL,
      target_tags TEXT[], total_count INTEGER DEFAULT 0, sent_count INTEGER DEFAULT 0,
      status VARCHAR(20) DEFAULT 'pending', created_at TIMESTAMP DEFAULT NOW()
    )`;

    // Indexes
    await sql`CREATE INDEX IF NOT EXISTS idx_channels_user ON channels(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_messages_user ON messages(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_messages_contact ON messages(user_id, contact_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_contacts_user ON contacts(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_automations_user ON automations(user_id)`;

    // Migrate old tables
    await sql`ALTER TABLE automations ADD COLUMN IF NOT EXISTS platform VARCHAR(20) DEFAULT 'all'`;
    await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS channel_id INTEGER`;
    await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS platform VARCHAR(20) DEFAULT 'whatsapp'`;
    await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS contact_id VARCHAR(100)`;
    await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS contact_name VARCHAR(255)`;
    await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS media_url TEXT`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMP`;

    return Response.json({ success: true, message: 'Tüm tablolar hazır' });
  } catch (error) {
    console.error('DB setup hatası:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
