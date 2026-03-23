import { neon } from '@neondatabase/serverless';
import { getUser } from '@/lib/auth';

const defaults = [
  // Hero
  ['hero', 'title', 'WhatsApp & Telegram\nMesajlaşma Yönetimi'],
  ['hero', 'subtitle', 'İşletmenizin mesajlaşma süreçlerini tek platformdan yönetin, müşteri iletişimini optimize edin ve verimliliği artırın.'],
  ['hero', 'cta_primary', 'Ücretsiz Deneyin'],
  ['hero', 'cta_secondary', 'Demo İzleyin'],
  // Features
  ['features', 'title', 'Güçlü Özellikler'],
  ['features', 'subtitle', 'İşletmeniz için tasarlanmış kapsamlı mesajlaşma çözümü'],
  ['features', 'card1_title', 'Çoklu Kanal Yönetimi'],
  ['features', 'card1_desc', 'WhatsApp ve Telegram hesaplarınızı tek bir platformdan yönetin.'],
  ['features', 'card2_title', 'Detaylı Analitik'],
  ['features', 'card2_desc', 'Mesajlaşma metriklerinizi görselleştirin.'],
  ['features', 'card3_title', 'Otomasyon'],
  ['features', 'card3_desc', 'Tekrarlayan görevleri otomatikleştirin.'],
  // Demo
  ['demo', 'title', 'Botun Nasıl Çalıştığını'],
  ['demo', 'title_highlight', 'Canlı İzleyin'],
  ['demo', 'subtitle', 'MsgLoom botunu WhatsApp, Telegram ve Instagram\'da kullanın.'],
  ['demo', 'cta', 'Hemen Botunuzu Kurun - Ücretsiz Deneyin'],
  ['demo', 'cta_sub', 'Kredi kartı gerektirmez • 14 gün ücretsiz'],
  // Sales
  ['sales', 'badge', 'Satış Dönüşümü'],
  ['sales', 'title', "DM'den Gelen Her Mesajı"],
  ['sales', 'title_highlight', 'Satışa Çevirin'],
  ['sales', 'description', 'Otomatik yanıtlar, akıllı yönlendirme ve detaylı analitik ile müşteri mesajlarınızı kaçırmayın.'],
  ['sales', 'stat1_value', '%85'],
  ['sales', 'stat1_label', 'Anında Yanıt'],
  ['sales', 'stat1_sub', 'daha hızlı cevap'],
  ['sales', 'stat2_value', '%60'],
  ['sales', 'stat2_label', 'Dönüşüm Oranı'],
  ['sales', 'stat2_sub', 'artış sağlar'],
  ['sales', 'stat3_value', '%95'],
  ['sales', 'stat3_label', 'Müşteri Memnuniyeti'],
  ['sales', 'stat3_sub', 'memnuniyet oranı'],
  ['sales', 'cta', 'Hemen Başlayın'],
  // Why
  ['why', 'title', 'Neden MsgLoom?'],
  ['why', 'card1_title', 'Güvenli İletişim'],
  ['why', 'card1_desc', 'End-to-end şifreleme ile müşteri verileriniz güvende. KVKK ve GDPR uyumlu altyapı.'],
  ['why', 'card2_title', 'Ekip Yönetimi'],
  ['why', 'card2_desc', 'Çoklu kullanıcı desteği ile ekibinizi organize edin. Rol tabanlı erişim kontrolü.'],
  ['why', 'card3_title', '7/24 Destek'],
  ['why', 'card3_desc', 'Türkçe teknik destek ekibimiz her zaman yanınızda.'],
  // Stats
  ['stats', 'stat1_value', '5000+'],
  ['stats', 'stat1_label', 'Aktif Kullanıcı'],
  ['stats', 'stat2_value', '1M+'],
  ['stats', 'stat2_label', 'Günlük Mesaj'],
  ['stats', 'stat3_value', '99.9%'],
  ['stats', 'stat3_label', 'Uptime'],
  ['stats', 'stat4_value', '24/7'],
  ['stats', 'stat4_label', 'Destek'],
  // Setup
  ['setup', 'badge', 'Hızlı Başlangıç'],
  ['setup', 'title', 'Botu Kur ve'],
  ['setup', 'title_highlight', 'Satışa Başla'],
  ['setup', 'subtitle', '3 adımda kurulum tamamla, dakikalar içinde ilk müşterilerinle konuşmaya başla.'],
  ['setup', 'step1_title', 'Hesabını Oluştur'],
  ['setup', 'step1_desc', '2 dakikada kayıt ol, onay beklemeden başla'],
  ['setup', 'step2_title', 'WhatsApp/Telegram Bağla'],
  ['setup', 'step2_desc', 'QR kod ile anında bağlan, tek tık yeterli'],
  ['setup', 'step3_title', 'Satışları İzle'],
  ['setup', 'step3_desc', "Dashboard'tan tüm mesajları yönet, satış yap"],
  ['setup', 'timer', 'Ortalama kurulum süresi sadece'],
  ['setup', 'timer_bold', '5 dakika'],
  // Guarantee
  ['guarantee', 'badge', '%100 Garanti'],
  ['guarantee', 'title', '5 Gün Kullanın,'],
  ['guarantee', 'title_highlight', 'Beğenmezseniz Paranızı İade Edelim'],
  ['guarantee', 'description', 'Ürünümüze güveniyoruz. Eğer 5 gün içinde memnun kalmazsanız, hiçbir soru sormadan paranızı iade ediyoruz.'],
  ['guarantee', 'item1', 'Soru sormadan tam iade'],
  ['guarantee', 'item2', 'Otomatik iade işlemi'],
  ['guarantee', 'item3', 'Kredi kartına 24 saat içinde iade'],
  ['guarantee', 'item4', 'Taahhüt yok, ceza yok'],
  ['guarantee', 'trust_title', '%100 Güvenli'],
  ['guarantee', 'trust_sub', 'Risksiz deneme garantisi'],
  ['guarantee', 'trust_desc', "5,000+ mutlu müşterimiz var ve %98'i ürünü kullanmaya devam ediyor."],
  // CTA
  ['cta', 'title', 'Mesajlaşma Yönetiminizi Bir Üst Seviyeye Taşıyın'],
  ['cta', 'subtitle', '14 gün ücretsiz deneme ile hemen başlayın. Kredi kartı gerektirmez.'],
  ['cta', 'cta_primary', 'Ücretsiz Başlayın'],
  ['cta', 'cta_secondary', 'Fiyatları İnceleyin'],
  // Navbar
  ['navbar', 'brand', 'MsgLoom'],
  ['navbar', 'link1', 'Özellikler'],
  ['navbar', 'link2', 'Avantajlar'],
  ['navbar', 'link3', 'İletişim'],
  ['navbar', 'login', 'Giriş Yap'],
  ['navbar', 'register', 'Başlayın'],
];

export async function POST(request) {
  const user = await getUser(request);
  if (!user || !user.is_admin) return Response.json({ error: 'Yetkisiz' }, { status: 401 });
  try {
    const sql = neon(process.env.POSTGRES_URL);
    await sql`CREATE TABLE IF NOT EXISTS site_content (
      id SERIAL PRIMARY KEY, section VARCHAR(50) NOT NULL,
      key VARCHAR(100) NOT NULL, value TEXT NOT NULL,
      updated_at TIMESTAMP DEFAULT NOW(), UNIQUE(section, key))`;
    for (const [s, k, v] of defaults) {
      await sql`INSERT INTO site_content (section, key, value)
        VALUES (${s}, ${k}, ${v}) ON CONFLICT (section, key) DO NOTHING`;
    }
    return Response.json({ success: true, count: defaults.length });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}
