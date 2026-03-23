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

  console.log('Tablo oluşturuldu');
}

setupDatabase().catch(console.error);
