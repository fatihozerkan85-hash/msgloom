'use client';

import { useState, useEffect, useCallback } from 'react';

// Varsayılan değerler
const fallback = {
  navbar: { brand: 'MsgLoom', link1: 'Özellikler', link2: 'Avantajlar', link3: 'İletişim', login: 'Giriş Yap', register: 'Başlayın' },
  hero: { title: 'WhatsApp & Telegram\nMesajlaşma Yönetimi', subtitle: 'İşletmenizin mesajlaşma süreçlerini tek platformdan yönetin, müşteri iletişimini optimize edin ve verimliliği artırın.', cta_primary: 'Ücretsiz Deneyin', cta_secondary: 'Demo İzleyin' },
  features: { title: 'Güçlü Özellikler', subtitle: 'İşletmeniz için tasarlanmış kapsamlı mesajlaşma çözümü', card1_title: 'Çoklu Kanal Yönetimi', card1_desc: 'WhatsApp ve Telegram hesaplarınızı tek bir platformdan yönetin.', card2_title: 'Detaylı Analitik', card2_desc: 'Mesajlaşma metriklerinizi görselleştirin.', card3_title: 'Otomasyon', card3_desc: 'Tekrarlayan görevleri otomatikleştirin.' },
  sales: { badge: 'Satış Dönüşümü', title: "DM'den Gelen Her Mesajı", title_highlight: 'Satışa Çevirin', description: 'Otomatik yanıtlar, akıllı yönlendirme ve detaylı analitik ile müşteri mesajlarınızı kaçırmayın.', stat1_value: '%85', stat1_label: 'Anında Yanıt', stat1_sub: 'daha hızlı cevap', stat2_value: '%60', stat2_label: 'Dönüşüm Oranı', stat2_sub: 'artış sağlar', stat3_value: '%95', stat3_label: 'Müşteri Memnuniyeti', stat3_sub: 'memnuniyet oranı', cta: 'Hemen Başlayın' },
  why: { title: 'Neden MsgLoom?', card1_title: 'Güvenli İletişim', card1_desc: 'End-to-end şifreleme ile müşteri verileriniz güvende.', card2_title: 'Ekip Yönetimi', card2_desc: 'Çoklu kullanıcı desteği ile ekibinizi organize edin.', card3_title: '7/24 Destek', card3_desc: 'Türkçe teknik destek ekibimiz her zaman yanınızda.' },
  stats: { stat1_value: '5000+', stat1_label: 'Aktif Kullanıcı', stat2_value: '1M+', stat2_label: 'Günlük Mesaj', stat3_value: '99.9%', stat3_label: 'Uptime', stat4_value: '24/7', stat4_label: 'Destek' },
  setup: { badge: 'Hızlı Başlangıç', title: 'Botu Kur ve', title_highlight: 'Satışa Başla', subtitle: '3 adımda kurulum tamamla, dakikalar içinde ilk müşterilerinle konuşmaya başla.', step1_title: 'Hesabını Oluştur', step1_desc: '2 dakikada kayıt ol, onay beklemeden başla', step2_title: 'WhatsApp/Telegram Bağla', step2_desc: 'QR kod ile anında bağlan, tek tık yeterli', step3_title: 'Satışları İzle', step3_desc: "Dashboard'tan tüm mesajları yönet, satış yap", timer: 'Ortalama kurulum süresi sadece', timer_bold: '5 dakika' },
  guarantee: { badge: '%100 Garanti', title: '5 Gün Kullanın,', title_highlight: 'Beğenmezseniz Paranızı İade Edelim', description: 'Ürünümüze güveniyoruz. Eğer 5 gün içinde memnun kalmazsanız, hiçbir soru sormadan paranızı iade ediyoruz.', item1: 'Soru sormadan tam iade', item2: 'Otomatik iade işlemi', item3: 'Kredi kartına 24 saat içinde iade', item4: 'Taahhüt yok, ceza yok', trust_title: '%100 Güvenli', trust_sub: 'Risksiz deneme garantisi', trust_desc: "5,000+ mutlu müşterimiz var ve %98'i ürünü kullanmaya devam ediyor." },
  cta: { title: 'Mesajlaşma Yönetiminizi Bir Üst Seviyeye Taşıyın', subtitle: '14 gün ücretsiz deneme ile hemen başlayın. Kredi kartı gerektirmez.', cta_primary: 'Ücretsiz Başlayın', cta_secondary: 'Fiyatları İnceleyin' },
};

const STORAGE_KEY = 'msgloom_content';

function getStoredContent() {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored);
  } catch { return null; }
}

export function saveContent(content) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
  // Dispatch event so other tabs/components pick up the change
  window.dispatchEvent(new Event('content-updated'));
}

export function useContent() {
  const [content, setContent] = useState(fallback);
  const [loaded, setLoaded] = useState(false);

  const loadContent = useCallback(() => {
    const stored = getStoredContent();
    if (stored && Object.keys(stored).length > 0) {
      const merged = { ...fallback };
      for (const [section, keys] of Object.entries(stored)) {
        merged[section] = { ...(fallback[section] || {}), ...keys };
      }
      setContent(merged);
    }
    setLoaded(true);
  }, []);

  useEffect(() => {
    loadContent();
    const handler = () => loadContent();
    window.addEventListener('content-updated', handler);
    window.addEventListener('storage', handler);
    return () => {
      window.removeEventListener('content-updated', handler);
      window.removeEventListener('storage', handler);
    };
  }, [loadContent]);

  return { content, loaded };
}

export function getAllContent() {
  const stored = getStoredContent();
  if (stored && Object.keys(stored).length > 0) {
    const merged = { ...fallback };
    for (const [section, keys] of Object.entries(stored)) {
      merged[section] = { ...(fallback[section] || {}), ...keys };
    }
    return merged;
  }
  return { ...fallback };
}

export function getDefaults() {
  return JSON.parse(JSON.stringify(fallback));
}

export function t(content, section, key) {
  return content?.[section]?.[key] || fallback?.[section]?.[key] || '';
}
