const { getDb } = require('./db');

async function setupDatabase() {
  const sql = getDb();

  await sql`
    CREATE TABLE IF NOT EXISTS messages (
      id SERIAL PRIMARY KEY,
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

  // Add columns if they don't exist (for existing tables)
  await sql`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false
  `;
  await sql`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_code VARCHAR(6)
  `;
  await sql`
    ALTER TABLE users ADD COLUMN IF NOT EXISTS verification_expires TIMESTAMP
  `;

  console.log('Tablolar oluşturuldu / güncellendi');
}

setupDatabase().catch(console.error);
