import { neon } from '@neondatabase/serverless';

export async function POST(request) {
  try {
    const { secret } = await request.json();
    if (secret !== process.env.JWT_SECRET) {
      return Response.json({ error: 'Yetkisiz' }, { status: 401 });
    }

    const sql = neon(process.env.POSTGRES_URL);

    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        name VARCHAR(255),
        company VARCHAR(255),
        plan VARCHAR(50) DEFAULT 'free',
        is_admin BOOLEAN DEFAULT false,
        email_verified BOOLEAN DEFAULT false,
        verification_code VARCHAR(6),
        verification_expires TIMESTAMP,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS whatsapp_accounts (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        phone_number_id VARCHAR(100) NOT NULL,
        business_account_id VARCHAR(100),
        access_token TEXT NOT NULL,
        phone_number VARCHAR(20),
        display_name VARCHAR(255),
        is_active BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
        direction VARCHAR(10) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        type VARCHAR(20) DEFAULT 'text',
        text_body TEXT,
        template_name VARCHAR(100),
        wa_message_id VARCHAR(100),
        raw_data JSONB,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;

    await sql`CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_messages_phone ON messages(phone)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_wa_accounts_user_id ON whatsapp_accounts(user_id)`;
    await sql`CREATE INDEX IF NOT EXISTS idx_wa_accounts_phone_number_id ON whatsapp_accounts(phone_number_id)`;

    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code VARCHAR(6)`;
    await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_expires TIMESTAMP`;
    await sql`ALTER TABLE messages ADD COLUMN IF NOT EXISTS user_id INTEGER`;

    return Response.json({ success: true, message: 'Tüm tablolar oluşturuldu' });
  } catch (error) {
    console.error('DB setup hatası:', error);
    return Response.json({ error: error.message }, { status: 500 });
  }
}
