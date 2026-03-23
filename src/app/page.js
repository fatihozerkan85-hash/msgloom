'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => { if (data.user) router.push('/dashboard'); else setChecking(false); })
      .catch(() => setChecking(false));
  }, [router]);

  if (checking) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <span className="text-2xl font-bold text-green-600">MsgLoom</span>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-green-600 transition">Özellikler</a>
            <a href="#benefits" className="hover:text-green-600 transition">Avantajlar</a>
            <a href="#setup" className="hover:text-green-600 transition">Nasıl Başlanır</a>
            <a href="#guarantee" className="hover:text-green-600 transition">Garanti</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-700 hover:text-green-600 font-medium px-4 py-2">Giriş Yap</Link>
            <Link href="/register" className="text-sm bg-green-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-green-700 transition shadow-sm">
              Ücretsiz Dene
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              WhatsApp & Telegram<br />
              <span className="text-green-600">Mesajlaşma Yönetimi</span>
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              İşletmenizin mesajlaşma süreçlerini tek platformdan yönetin, müşteri iletişimini optimize edin ve verimliliği artırın.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/register" className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-green-700 transition shadow-lg shadow-green-200 text-center">
                Ücretsiz Deneyin
              </Link>
              <a href="#features" className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-full text-lg font-medium hover:border-green-300 hover:text-green-600 transition text-center">
                Demo İzleyin
              </a>
            </div>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1758691737543-09a1b2b715fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
              alt="Team Collaboration" className="rounded-3xl shadow-2xl w-full" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Güçlü Özellikler</h2>
            <p className="text-lg text-gray-600">İşletmeniz için tasarlanmış kapsamlı mesajlaşma çözümü</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                img: 'https://images.unsplash.com/photo-1760346546771-a81d986459ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
                title: 'Çoklu Kanal Yönetimi',
                desc: 'WhatsApp ve Telegram hesaplarınızı tek bir platformdan yönetin. Tüm mesajlarınızı merkezi bir yerden takip edin.'
              },
              {
                img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
                title: 'Detaylı Analitik',
                desc: 'Mesajlaşma metriklerinizi görselleştirin. Performans raporları ile verimliliği ölçümleyin ve optimize edin.'
              },
              {
                img: 'https://images.unsplash.com/photo-1759752393975-7ca7b302fcc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
                title: 'Otomasyon',
                desc: 'Tekrarlayan görevleri otomatikleştirin. Akıllı yanıtlar ve mesaj şablonları ile zamandan tasarruf edin.'
              }
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition group">
                <div className="h-48 overflow-hidden">
                  <img src={f.img} alt={f.title} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" />
                </div>
                <div className="p-6">
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sales Conversion */}
      <section id="benefits" className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block bg-green-50 text-green-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">Satış Dönüşümü</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              DM'den Gelen Her Mesajı<br /><span className="text-green-600">Satışa Çevirin</span>
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Otomatik yanıtlar, akıllı yönlendirme ve detaylı analitik ile müşteri mesajlarınızı kaçırmayın, her fırsatı değerlendirin.
            </p>
            <div className="grid grid-cols-3 gap-4 mb-8">
              {[
                { value: '%85', label: 'Anında Yanıt', sub: 'daha hızlı cevap' },
                { value: '%60', label: 'Dönüşüm Oranı', sub: 'artış sağlar' },
                { value: '%95', label: 'Müşteri Memnuniyeti', sub: 'memnuniyet oranı' },
              ].map((s, i) => (
                <div key={i} className="bg-green-50 rounded-2xl p-4 text-center">
                  <p className="text-2xl font-bold text-green-600">{s.value}</p>
                  <p className="text-xs font-medium text-gray-900 mt-1">{s.label}</p>
                  <p className="text-xs text-gray-500">{s.sub}</p>
                </div>
              ))}
            </div>
            <Link href="/register" className="bg-green-600 text-white px-8 py-3.5 rounded-full font-medium hover:bg-green-700 transition shadow-lg shadow-green-200 inline-block">
              Hemen Başlayın
            </Link>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1758691736484-4914d363a3cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
              alt="Sales Growth" className="rounded-3xl shadow-2xl w-full" />
            {/* Floating cards */}
            <div className="absolute -left-4 top-1/4 bg-white rounded-xl shadow-lg p-4 max-w-[200px]">
              <div className="flex items-center gap-2 mb-1">
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                <span className="text-xs font-medium text-gray-900">Yeni Mesaj</span>
                <span className="text-xs text-green-600">WhatsApp</span>
              </div>
              <p className="text-xs text-gray-600">"Ürününüz hakkında bilgi alabilir miyim?"</p>
            </div>
            <div className="absolute -right-4 bottom-1/4 bg-white rounded-xl shadow-lg p-4 max-w-[200px]">
              <p className="text-xs font-medium text-gray-900">Satış Tamamlandı!</p>
              <p className="text-lg font-bold text-green-600">₺2,450</p>
              <p className="text-xs text-green-500">+%35 bu hafta</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why MsgLoom */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Neden MsgLoom?</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {[
              { icon: '🔒', title: 'Güvenli İletişim', desc: 'End-to-end şifreleme ile müşteri verileriniz güvende. KVKK ve GDPR uyumlu altyapı.' },
              { icon: '👥', title: 'Ekip Yönetimi', desc: 'Çoklu kullanıcı desteği ile ekibinizi organize edin. Rol tabanlı erişim kontrolü.' },
              { icon: '🎧', title: '7/24 Destek', desc: 'Türkçe teknik destek ekibimiz her zaman yanınızda. Hızlı çözüm, kesintisiz hizmet.' },
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-lg transition text-center">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { value: '5000+', label: 'Aktif Kullanıcı' },
              { value: '1M+', label: 'Günlük Mesaj' },
              { value: '99.9%', label: 'Uptime' },
              { value: '24/7', label: 'Destek' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 text-center shadow-sm">
                <p className="text-3xl font-bold text-green-600">{s.value}</p>
                <p className="text-sm text-gray-600 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Setup Steps */}
      <section id="setup" className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1653823815301-faf2f30db0bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
              alt="Easy Setup" className="rounded-3xl shadow-2xl w-full" />
          </div>
          <div>
            <span className="inline-block bg-green-50 text-green-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">Hızlı Başlangıç</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              Botu Kur ve<br /><span className="text-green-600">Satışa Başla</span>
            </h2>
            <p className="text-gray-600 mb-8">3 adımda kurulum tamamla, dakikalar içinde ilk müşterilerinle konuşmaya başla.</p>
            <div className="space-y-6">
              {[
                { step: '1', title: 'Hesabını Oluştur', desc: '2 dakikada kayıt ol, onay beklemeden başla' },
                { step: '2', title: 'WhatsApp/Telegram Bağla', desc: 'QR kod ile anında bağlan, tek tık yeterli' },
                { step: '3', title: 'Satışları İzle', desc: "Dashboard'tan tüm mesajları yönet, satış yap" },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-green-600 text-white rounded-xl flex items-center justify-center font-bold shrink-0">{s.step}</div>
                  <div>
                    <h3 className="font-bold text-gray-900">{s.title}</h3>
                    <p className="text-sm text-gray-600">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-6 flex items-center gap-2">
              <span className="text-green-500">⚡</span> Ortalama kurulum süresi sadece 5 dakika
            </p>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section id="guarantee" className="py-20 px-6 bg-gradient-to-br from-green-50 to-emerald-50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-block bg-green-100 text-green-700 text-sm font-medium px-4 py-1.5 rounded-full mb-4">%100 Garanti</span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6 leading-tight">
              5 Gün Kullanın,<br /><span className="text-green-600">Beğenmezseniz Paranızı İade Edelim</span>
            </h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Ürünümüze güveniyoruz. Eğer 5 gün içinde memnun kalmazsanız, hiçbir soru sormadan paranızı iade ediyoruz.
            </p>
            <div className="grid grid-cols-2 gap-4 mb-8">
              {[
                'Soru sormadan tam iade',
                'Otomatik iade işlemi',
                'Kredi kartına 24 saat içinde iade',
                'Taahhüt yok, ceza yok',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-green-500">✓</span>
                  <span className="text-sm text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-sm inline-block">
              <div className="flex items-center gap-3 mb-2">
                <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">%100 Güvenli</span>
                <span className="text-xs text-gray-500">Risksiz deneme garantisi</span>
              </div>
              <p className="text-xs text-gray-500">5,000+ mutlu müşterimiz var ve %98'i ürünü kullanmaya devam ediyor.</p>
            </div>
          </div>
          <div className="relative">
            <img src="https://images.unsplash.com/photo-1632961974688-fae53de3cabc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
              alt="Trust Guarantee" className="rounded-3xl shadow-2xl w-full" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 text-center shadow-xl">
                <p className="text-xs font-bold text-green-600 mb-1">5 GÜN GARANTİ</p>
                <p className="text-2xl font-bold text-gray-900">%100 İade</p>
                <div className="flex justify-center gap-0.5 mt-2 text-yellow-400">★ ★ ★ ★ ★</div>
                <p className="text-xs text-gray-600 mt-2 italic">"İlk günden satışlarım arttı. Kesinlikle denemeye değer!"</p>
                <p className="text-xs text-gray-400 mt-1">- Ahmet K., E-ticaret</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Mesajlaşma Yönetiminizi Bir Üst Seviyeye Taşıyın</h2>
          <p className="text-gray-400 text-lg mb-8">14 gün ücretsiz deneme ile hemen başlayın. Kredi kartı gerektirmez.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-green-700 transition shadow-lg shadow-green-900/30">
              Ücretsiz Başlayın
            </Link>
            <a href="#pricing" className="border-2 border-gray-700 text-gray-300 px-8 py-4 rounded-full text-lg font-medium hover:border-green-500 hover:text-green-400 transition">
              Fiyatları İnceleyin
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-950 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <span className="text-xl font-bold text-white">MsgLoom</span>
              <p className="text-sm mt-3 leading-relaxed">WhatsApp & Telegram mesajlaşma yönetiminde güvenilir çözüm ortağınız.</p>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-4">Ürün</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition">Özellikler</a></li>
                <li><a href="#" className="hover:text-white transition">Fiyatlandırma</a></li>
                <li><a href="#" className="hover:text-white transition">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-4">Şirket</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Hakkımızda</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Kariyer</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-4">Destek</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Yardım Merkezi</a></li>
                <li><a href="#" className="hover:text-white transition">İletişim</a></li>
                <li><a href="#" className="hover:text-white transition">Gizlilik</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2026 MsgLoom. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
