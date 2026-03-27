import { neon } from '@neondatabase/serverless';
import { rateLimit } from '@/lib/rateLimit';

export async function POST(request) {
  try {
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    const rl = rateLimit(`setup-db:${ip}`, { maxAttempts: 3, windowMs: 60 * 60 * 1000 });
    if (!rl.allowed) {
      return Response.json({ error: 'Çok fazla deneme' }, { status: 429 });
    }

    const body = await request.json().catch(() => ({}));
    const secret = body.secret;
    const validSecret = process.env.SETUP_DB_SECRET;
    if (!validSecret || !secret || secret !== validSecret) {
      return Response.json({ error: 'Yetkisiz' }, { status: 401 });
    }

    const sql = neon(process.env.POSTGRES_URL);
    const results = [];

    // 1. TABLOLAR
    await sql`CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY, email VARCHAR(255) UNIQUE NOT NULL, password_hash VARCHAR(255) NOT NULL,
      name VARCHAR(255), company VARCHAR(255), plan VARCHAR(50) DEFAULT 'free',
      is_admin BOOLEAN DEFAULT false, email_verified BOOLEAN DEFAULT false,
      verification_code VARCHAR(6), verification_expires TIMESTAMP, created_at TIMESTAMP DEFAULT NOW()
    )`;
    results.push('users OK');

    await sql`CREATE TABLE IF NOT EXISTS whatsapp_accounts (
      id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      phone_number_id VARCHAR(100) NOT NULL, business_account_id VARCHAR(100),
      access_token TEXT NOT NULL, phone_number VARCHAR(20), display_name VARCHAR(255),
      is_active BOOLEAN DEFAULT true, created_at TIMESTAMP DEFAULT NOW()
    )`;
    results.push('whatsapp_accounts OK');

    await sql`CREATE TABLE IF NOT EXISTS channels (
      id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      platform VARCHAR(20) NOT NULL, platform_id VARCHAR(255) NOT NULL,
      access_token TEXT NOT NULL, display_name VARCHAR(255), phone_number VARCHAR(50),
      business_account_id VARCHAR(100), extra JSONB DEFAULT '{}',
      is_active BOOLEAN DEFAULT true, created_at TIMESTAMP DEFAULT NOW()
    )`;
    results.push('channels OK');

    await sql`CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY, user_id INTEGER, direction VARCHAR(10) NOT NULL,
      phone VARCHAR(20), type VARCHAR(20) DEFAULT 'text', text_body TEXT,
      template_name VARCHAR(100), wa_message_id VARCHAR(100), raw_data JSONB,
      created_at TIMESTAMP DEFAULT NOW()
    )`;
    results.push('messages OK');

    await sql`CREATE TABLE IF NOT EXISTS contacts (
      id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255), phone VARCHAR(50), created_at TIMESTAMP DEFAULT NOW()
    )`;
    results.push('contacts OK');

    await sql`CREATE TABLE IF NOT EXISTS automations (
      id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      type VARCHAR(20) NOT NULL DEFAULT 'keyword', trigger_text TEXT, response_text TEXT NOT NULL,
      is_active BOOLEAN DEFAULT true, priority INTEGER DEFAULT 0, created_at TIMESTAMP DEFAULT NOW()
    )`;
    results.push('automations OK');

    await sql`CREATE TABLE IF NOT EXISTS quick_replies (
      id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title VARCHAR(100) NOT NULL, message TEXT NOT NULL, shortcut VARCHAR(20), created_at TIMESTAMP DEFAULT NOW()
    )`;
    results.push('quick_replies OK');

    await sql`CREATE TABLE IF NOT EXISTS broadcasts (
      id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      platform VARCHAR(20) NOT NULL, message TEXT NOT NULL, target_tags TEXT[],
      total_count INTEGER DEFAULT 0, sent_count INTEGER DEFAULT 0,
      status VARCHAR(20) DEFAULT 'pending', created_at TIMESTAMP DEFAULT NOW()
    )`;
    results.push('broadcasts OK');

    await sql`CREATE TABLE IF NOT EXISTS crm_notes (
      id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      contact_id INTEGER NOT NULL, note TEXT NOT NULL, created_at TIMESTAMP DEFAULT NOW()
    )`;
    results.push('crm_notes OK');

    await sql`CREATE TABLE IF NOT EXISTS products (
      id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(255) NOT NULL, description TEXT, price DECIMAL(12,2) NOT NULL DEFAULT 0,
      currency VARCHAR(5) DEFAULT 'TRY', category VARCHAR(100), keywords TEXT,
      stock INTEGER, image_url TEXT, is_active BOOLEAN DEFAULT true, created_at TIMESTAMP DEFAULT NOW()
    )`;
    results.push('products OK');

    await sql`CREATE TABLE IF NOT EXISTS product_settings (
      id SERIAL PRIMARY KEY, user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      auto_offer BOOLEAN DEFAULT true, offer_template TEXT
    )`;
    results.push('product_settings OK');

    await sql`CREATE TABLE IF NOT EXISTS payments (
      id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL, plan VARCHAR(50),
      amount DECIMAL(12,2), currency VARCHAR(5) DEFAULT 'TRY',
      iyzico_payment_id VARCHAR(100), status VARCHAR(20) DEFAULT 'success', created_at TIMESTAMP DEFAULT NOW()
    )`;
    results.push('payments OK');

    // 2. KOLON EKLEMELERİ (önce kolonlar, sonra indexler)
    // users
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code VARCHAR(6)`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_expires TIMESTAMP`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS trial_ends_at TIMESTAMP`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS plan_expires_at TIMESTAMP`;
    // messages
    await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS user_id INTEGER`;
    await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS channel_id INTEGER`;
    await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS platform VARCHAR(20) DEFAULT 'whatsapp'`;
    await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS contact_id VARCHAR(100)`;
    await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS contact_name VARCHAR(255)`;
    await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS media_url TEXT`;
    await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS platform_message_id VARCHAR(255)`;
    // contacts
    await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS platform VARCHAR(20) DEFAULT 'whatsapp'`;
    await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS platform_contact_id VARCHAR(100)`;
    await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}'`;
    await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS last_message_at TIMESTAMP`;
    await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS message_count INTEGER DEFAULT 0`;
    await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS extra JSONB DEFAULT '{}'`;
    await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS email VARCHAR(255)`;
    await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS company VARCHAR(255)`;
    await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS notes TEXT`;
    await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS pipeline_stage VARCHAR(30) DEFAULT 'new'`;
    await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS deal_value DECIMAL(12,2) DEFAULT 0`;
    await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS source VARCHAR(50)`;
    await sql`ALTER TABLE contacts ADD COLUMN IF NOT EXISTS assigned_to VARCHAR(255)`;
    // automations
    await sql`ALTER TABLE automations ADD COLUMN IF NOT EXISTS platform VARCHAR(20) DEFAULT 'all'`;
    results.push('ALTER columns OK');

    // 3. INDEXLER (kolonlar eklendikten sonra)
    await sql`CREATE INDEX IF NOT EXISTS idx_channels_user ON channels(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_messages_user ON messages(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_contacts_user ON contacts(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_automations_user ON automations(user_id)`;
    results.push('indexes OK');

    // contact_id indexi — kolon varsa ekle
    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_messages_contact ON messages(user_id, contact_id)`;
      results.push('messages_contact index OK');
    } catch { results.push('messages_contact index skipped'); }

    try {
      await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_contacts_unique ON contacts(user_id, platform, platform_contact_id)`;
      results.push('contacts unique index OK');
    } catch { results.push('contacts unique index skipped'); }

    return Response.json({ success: true, message: 'Tüm tablolar hazır', results });
  } catch (error) {
    console.error('DB setup hatası:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
