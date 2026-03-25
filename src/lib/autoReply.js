import { neon } from '@neondatabase/serverless';

export async function getAutoReply(userId, incomingText, platform, contactId) {
  const sql = neon(process.env.POSTGRES_URL);
  const text = incomingText.toLowerCase().trim();

  // İlk mesaj mı?
  const [prev] = await sql`
    SELECT COUNT(*) as count FROM messages 
    WHERE user_id = ${userId} AND contact_id = ${contactId} AND platform = ${platform} AND direction = 'incoming'
  `;
  const isFirst = Number(prev.count) <= 1;

  // Otomasyon kuralları
  const automations = await sql`
    SELECT * FROM automations 
    WHERE user_id = ${userId} AND is_active = true AND (platform = 'all' OR platform = ${platform})
    ORDER BY priority DESC, created_at ASC
  `;

  // 1. Karşılama mesajı
  if (isFirst) {
    const w = automations.find(a => a.type === 'welcome');
    if (w) return w.response_text;
  }

  // 2. Ürün eşleşmesi — fiyat/ürün sorgusu
  try {
    const [settings] = await sql`SELECT * FROM product_settings WHERE user_id = ${userId}`;
    const autoOffer = settings?.auto_offer !== false;

    if (autoOffer) {
      const products = await sql`
        SELECT * FROM products WHERE user_id = ${userId} AND is_active = true
      `;

      for (const product of products) {
        const searchTerms = [product.name.toLowerCase()];
        if (product.keywords) {
          searchTerms.push(...product.keywords.toLowerCase().split(',').map(k => k.trim()));
        }
        if (product.category) searchTerms.push(product.category.toLowerCase());

        const matched = searchTerms.some(term => term && text.includes(term));
        if (matched) {
          const template = settings?.offer_template || 
            '📦 *{product_name}*\n{product_desc}\n\n💰 Fiyat: {price} {currency}\n{stock_info}';

          const stockInfo = product.stock !== null && product.stock !== undefined
            ? (product.stock > 0 ? `📊 Stok: ${product.stock} adet` : '⚠️ Stok tükendi')
            : '';

          const currency = product.currency === 'TRY' ? '₺' : product.currency === 'USD' ? '$' : product.currency === 'EUR' ? '€' : product.currency;

          return template
            .replace(/{product_name}/g, product.name)
            .replace(/{product_desc}/g, product.description || '')
            .replace(/{price}/g, Number(product.price).toLocaleString('tr-TR'))
            .replace(/{currency}/g, currency)
            .replace(/{stock_info}/g, stockInfo)
            .replace(/{category}/g, product.category || '')
            .replace(/\n\n\n+/g, '\n\n')
            .trim();
        }
      }

      // "fiyat", "ücret", "kaç tl", "fiyat listesi" gibi genel sorgularda tüm ürünleri listele
      const priceKeywords = ['fiyat', 'ücret', 'kaç tl', 'fiyat listesi', 'fiyatlar', 'ne kadar', 'price'];
      if (products.length > 0 && priceKeywords.some(k => text.includes(k))) {
        let list = '📋 *Ürün Listemiz:*\n\n';
        const currency = (p) => p.currency === 'TRY' ? '₺' : p.currency === 'USD' ? '$' : p.currency;
        for (const p of products.slice(0, 10)) {
          list += `• ${p.name} — ${currency(p)}${Number(p.price).toLocaleString('tr-TR')}`;
          if (p.stock !== null && p.stock <= 0) list += ' (Tükendi)';
          list += '\n';
        }
        list += '\nDetay için ürün adını yazın!';
        return list;
      }
    }
  } catch (err) {
    // Ürün tablosu yoksa devam et
  }

  // 3. Anahtar kelime eşleşmesi
  const kw = automations.find(a => {
    if (a.type !== 'keyword' || !a.trigger_text) return false;
    return a.trigger_text.toLowerCase().split(',').map(k => k.trim()).some(k => text.includes(k));
  });
  if (kw) return kw.response_text;

  // 4. Varsayılan yanıt
  const d = automations.find(a => a.type === 'default');
  if (d) return d.response_text;

  return null;
}
