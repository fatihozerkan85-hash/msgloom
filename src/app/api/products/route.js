import { neon } from '@neondatabase/serverless';
import { getUser } from '@/lib/auth';

export async function GET(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  const sql = neon(process.env.POSTGRES_URL);

  await sql`CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY, user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL, description TEXT, price DECIMAL(12,2) NOT NULL DEFAULT 0,
    currency VARCHAR(5) DEFAULT 'TRY', category VARCHAR(100),
    keywords TEXT, stock INTEGER, image_url TEXT,
    is_active BOOLEAN DEFAULT true, created_at TIMESTAMP DEFAULT NOW()
  )`;

  await sql`CREATE TABLE IF NOT EXISTS product_settings (
    id SERIAL PRIMARY KEY, user_id INTEGER UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    auto_offer BOOLEAN DEFAULT true,
    offer_template TEXT DEFAULT 'Merhaba! 🛍️\n\n📦 *{product_name}*\n{product_desc}\n\n💰 Fiyat: {price} {currency}\n{stock_info}\n\nSipariş vermek için "SATIN AL" yazın veya detay için sorun!'
  )`;

  const products = await sql`SELECT * FROM products WHERE user_id = ${user.id} ORDER BY created_at DESC`;

  const [settings] = await sql`SELECT * FROM product_settings WHERE user_id = ${user.id}`;

  return Response.json({ products, settings: settings || { auto_offer: true, offer_template: 'Merhaba! 🛍️\n\n📦 *{product_name}*\n{product_desc}\n\n💰 Fiyat: {price} {currency}\n{stock_info}\n\nSipariş vermek için "SATIN AL" yazın veya detay için sorun!' } });
}

export async function POST(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { name, description, price, currency, category, keywords, stock, image_url } = await request.json();
    if (!name || price === undefined) return Response.json({ error: 'Ürün adı ve fiyat gerekli' }, { status: 400 });

    const sql = neon(process.env.POSTGRES_URL);
    const [product] = await sql`
      INSERT INTO products (user_id, name, description, price, currency, category, keywords, stock, image_url)
      VALUES (${user.id}, ${name}, ${description || null}, ${price}, ${currency || 'TRY'}, ${category || null}, ${keywords || null}, ${stock ?? null}, ${image_url || null})
      RETURNING *
    `;
    return Response.json({ success: true, product });
  } catch (error) {
    console.error('Ürün ekleme hatası:', error);
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function PUT(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  try {
    const { id, name, description, price, currency, category, keywords, stock, image_url, is_active, offer_template, auto_offer } = await request.json();
    const sql = neon(process.env.POSTGRES_URL);

    // Teklif ayarları güncelleme
    if (offer_template !== undefined || auto_offer !== undefined) {
      await sql`
        INSERT INTO product_settings (user_id, auto_offer, offer_template)
        VALUES (${user.id}, ${auto_offer ?? true}, ${offer_template ?? ''})
        ON CONFLICT (user_id) DO UPDATE SET
          auto_offer = COALESCE(${auto_offer ?? null}, product_settings.auto_offer),
          offer_template = COALESCE(${offer_template ?? null}, product_settings.offer_template)
      `;
      const [settings] = await sql`SELECT * FROM product_settings WHERE user_id = ${user.id}`;
      return Response.json({ success: true, settings });
    }

    // Ürün güncelleme
    const [updated] = await sql`
      UPDATE products SET
        name = COALESCE(${name ?? null}, name),
        description = COALESCE(${description ?? null}, description),
        price = COALESCE(${price ?? null}, price),
        currency = COALESCE(${currency ?? null}, currency),
        category = COALESCE(${category ?? null}, category),
        keywords = COALESCE(${keywords ?? null}, keywords),
        stock = COALESCE(${stock ?? null}, stock),
        image_url = COALESCE(${image_url ?? null}, image_url),
        is_active = COALESCE(${is_active ?? null}, is_active)
      WHERE id = ${id} AND user_id = ${user.id} RETURNING *
    `;
    if (!updated) return Response.json({ error: 'Bulunamadı' }, { status: 404 });
    return Response.json({ success: true, product: updated });
  } catch (error) {
    return Response.json({ error: 'Sunucu hatası' }, { status: 500 });
  }
}

export async function DELETE(request) {
  const user = await getUser(request);
  if (!user) return Response.json({ error: 'Yetkisiz' }, { status: 401 });

  const { id } = await request.json();
  const sql = neon(process.env.POSTGRES_URL);
  await sql`DELETE FROM products WHERE id = ${id} AND user_id = ${user.id}`;
  return Response.json({ success: true });
}
