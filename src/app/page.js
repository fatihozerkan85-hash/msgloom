'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => { if (data.user) router.push('/dashboard'); else setChecking(false); })
      .catch(() => setChecking(false));
  }, [router]);

  if (checking) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-blue-600 text-xl">💬</span>
            <span className="text-xl font-bold text-gray-900">MsgLoom</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-blue-600 transition">Özellikler</a>
            <a href="#benefits" className="hover:text-blue-600 transition">Avantajlar</a>
            <a href="#contact" className="hover:text-blue-600 transition">İletişim</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-700 hover:text-blue-600 font-medium px-4 py-2 hidden md:inline-block">Giriş Yap</Link>
            <Link href="/register" className="text-sm bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition">
              Başlayın
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
              WhatsApp & Telegram<br />Mesajlaşma Yönetimi
            </h1>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              İşletmenizin mesajlaşma süreçlerini tek platformdan yönetin, müşteri iletişimini optimize edin ve verimliliği artırın.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/register" className="bg-blue-600 text-white px-7 py-3.5 rounded-lg font-medium hover:bg-blue-700 transition">
                Ücretsiz Deneyin
              </Link>
              <a href="#features" className="border border-gray-300 text-gray-700 px-7 py-3.5 rounded-lg font-medium hover:border-blue-400 hover:text-blue-600 transition">
                Demo İzleyin
              </a>
            </div>
          </div>
          <div>
            <img src="https://images.unsplash.com/photo-1758691737543-09a1b2b715fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
              alt="Team Collaboration" className="rounded-2xl shadow-xl w-full" />
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Güçlü Özellikler</h2>
            <p className="text-gray-600">İşletmeniz için tasarlanmış kapsamlı mesajlaşma çözümü</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                img: 'https://images.unsplash.com/photo-1760346546771-a81d986459ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
                icon: '💬', title: 'Çoklu Kanal Yönetimi',
                desc: 'WhatsApp ve Telegram hesaplarınızı tek bir platformdan yönetin. Tüm mesajlarınızı merkezi bir yerden takip edin.'
              },
              {
                img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
                icon: '📊', title: 'Detaylı Analitik',
                desc: 'Mesajlaşma metriklerinizi görselleştirin. Performans raporları ile verimliliği ölçümleyin ve optimize edin.'
              },
              {
                img: 'https://images.unsplash.com/photo-1759752393975-7ca7b302fcc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
                icon: '⚡', title: 'Otomasyon',
                desc: 'Tekrarlayan görevleri otomatikleştirin. Akıllı yanıtlar ve mesaj şablonları ile zamandan tasarruf edin.'
              }
            ].map((f, i) => (
              <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg transition">
                <div className="h-52 overflow-hidden">
                  <img src={f.img} alt={f.title} className="w-full h-full object-cover" />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-blue-600">{f.icon}</span>
                    <h3 className="font-bold text-gray-900">{f.title}</h3>
                  </div>
                  <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Sales Conversion - Blue background */}
      <section id="benefits" className="py-20 px-6 bg-blue-600">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              📈 Satış Dönüşümü
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
              DM'den Gelen Her Mesajı<br />
              <span className="text-yellow-300">Satışa Çevirin</span>
            </h2>
            <p className="text-blue-100 mb-8 leading-relaxed">
              Otomatik yanıtlar, akıllı yönlendirme ve detaylı analitik ile müşteri mesajlarınızı kaçırmayın, her fırsatı değerlendirin.
            </p>

            {/* Stat rows */}
            <div className="space-y-3 mb-8">
              {[
                { value: '%85', label: 'Anında Yanıt', sub: 'daha hızlı cevap' },
                { value: '%60', label: 'Dönüşüm Oranı', sub: 'artış sağlar' },
                { value: '%95', label: 'Müşteri Memnuniyeti', sub: 'memnuniyet oranı' },
              ].map((s, i) => (
                <div key={i} className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4">
                  <div className="flex items-center gap-4">
                    <span className="bg-orange-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg">{s.value}</span>
                    <div>
                      <p className="text-white font-medium text-sm">{s.label}</p>
                      <p className="text-blue-200 text-xs">{s.sub}</p>
                    </div>
                  </div>
                  <span className="text-blue-200">→</span>
                </div>
              ))}
            </div>

            <Link href="/register" className="inline-block border-2 border-white text-white px-7 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition">
              Hemen Başlayın
            </Link>
          </div>

          <div className="relative">
            <img src="https://images.unsplash.com/photo-1758691736484-4914d363a3cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
              alt="Sales Growth" className="rounded-2xl w-full" />
            {/* Floating: Yeni Mesaj */}
            <div className="absolute top-4 right-4 bg-white rounded-xl shadow-lg p-4 max-w-[220px]">
              <div className="flex items-center gap-2 mb-2">
                <span className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">💬</span>
                <div>
                  <p className="text-xs font-bold text-gray-900">Yeni Mesaj</p>
                  <p className="text-xs text-gray-500">WhatsApp</p>
                </div>
              </div>
              <p className="text-xs text-gray-600">"Ürününüz hakkında bilgi alabilir miyim?"</p>
            </div>
            {/* Floating: Satış */}
            <div className="absolute bottom-4 right-4 bg-green-500 rounded-xl shadow-lg p-4 text-white">
              <p className="text-xs font-medium flex items-center gap-1">📈 Satış Tamamlandı!</p>
              <p className="text-2xl font-bold">₺2,450</p>
              <p className="text-xs text-green-100">+%35 bu hafta</p>
            </div>
          </div>
        </div>
      </section>

      {/* Why MsgLoom - Image + List layout */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <img src="https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
              alt="Data Analytics" className="rounded-2xl shadow-xl w-full" />
          </div>
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">Neden MsgLoom?</h2>
            <div className="space-y-6">
              {[
                { icon: '🔒', title: 'Güvenli İletişim', desc: 'End-to-end şifreleme ile müşteri verileriniz güvende. KVKK ve GDPR uyumlu altyapı.' },
                { icon: '👥', title: 'Ekip Yönetimi', desc: 'Çoklu kullanıcı desteği ile ekibinizi organize edin. Rol tabanlı erişim kontrolü.' },
                { icon: '🌐', title: '7/24 Destek', desc: 'Türkçe teknik destek ekibimiz her zaman yanınızda. Hızlı çözüm, kesintisiz hizmet.' },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-4">
                  <span className="text-blue-600 text-xl mt-1">{f.icon}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                    <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Banner - Blue */}
      <section className="py-12 px-6 bg-blue-600">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: '5000+', label: 'Aktif Kullanıcı' },
            { value: '1M+', label: 'Günlük Mesaj' },
            { value: '99.9%', label: 'Uptime' },
            { value: '24/7', label: 'Destek' },
          ].map((s, i) => (
            <div key={i}>
              <p className="text-3xl md:text-4xl font-bold text-white">{s.value}</p>
              <p className="text-blue-200 text-sm mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Setup Steps - Orange numbered */}
      <section id="setup" className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <img src="https://images.unsplash.com/photo-1653823815301-faf2f30db0bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
              alt="Easy Setup" className="rounded-2xl shadow-xl w-full" />
          </div>
          <div>
            <span className="inline-flex items-center gap-2 bg-orange-500 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              🚀 Hızlı Başlangıç
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">
              Botu Kur ve
            </h2>
            <h2 className="text-3xl md:text-4xl font-bold text-orange-500 mb-6">Satışa Başla</h2>
            <p className="text-gray-600 mb-8">3 adımda kurulum tamamla, dakikalar içinde ilk müşterilerinle konuşmaya başla.</p>

            <div className="space-y-6 mb-8">
              {[
                { icon: '👤', title: 'Hesabını Oluştur', desc: '2 dakikada kayıt ol, onay beklemeden başla' },
                { icon: '💬', title: 'WhatsApp/Telegram Bağla', desc: 'QR kod ile anında bağlan, tek tık yeterli' },
                { icon: '📈', title: 'Satışları İzle', desc: "Dashboard'tan tüm mesajları yönet, satış yap" },
              ].map((s, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0">{i + 1}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-orange-500">{s.icon}</span>
                      <h3 className="font-bold text-gray-900">{s.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 mt-0.5">{s.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-gray-50 rounded-xl px-5 py-3 inline-flex items-center gap-2">
              <span className="text-gray-500">⏱</span>
              <p className="text-sm text-gray-700">Ortalama kurulum süresi sadece <span className="font-bold">5 dakika</span></p>
            </div>
          </div>
        </div>
      </section>

      {/* Guarantee - Green bg */}
      <section id="guarantee" className="py-20 px-6 bg-green-50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
              ✅ %100 Garanti
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">5 Gün Kullanın,</h2>
            <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-6 leading-tight">Beğenmezseniz Paranızı İade Edelim</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Ürünümüze güveniyoruz. Eğer 5 gün içinde memnun kalmazsanız, hiçbir soru sormadan paranızı iade ediyoruz.
            </p>
            <div className="space-y-3 mb-8">
              {[
                'Soru sormadan tam iade',
                'Otomatik iade işlemi',
                'Kredi kartına 24 saat içinde iade',
                'Taahhüt yok, ceza yok',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className="text-green-500 text-lg">✓</span>
                  <span className="text-gray-700">{item}</span>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-2xl p-5 border border-gray-100 inline-block">
              <div className="flex items-center gap-3 mb-2">
                <span className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-lg">🛡️</span>
                <div>
                  <p className="font-bold text-gray-900">%100 Güvenli</p>
                  <p className="text-xs text-gray-500">Risksiz deneme garantisi</p>
                </div>
              </div>
              <p className="text-sm text-gray-600">5,000+ mutlu müşterimiz var ve <span className="font-bold">%98</span>'i ürünü kullanmaya devam ediyor.</p>
            </div>
          </div>

          <div className="relative">
            <img src="https://images.unsplash.com/photo-1632961974688-fae53de3cabc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
              alt="Trust Guarantee" className="rounded-2xl shadow-xl w-full" />
            {/* Review card */}
            <div className="absolute bottom-6 left-6 bg-white rounded-xl shadow-lg p-4 max-w-[250px]">
              <div className="flex gap-0.5 text-yellow-400 mb-2">★ ★ ★ ★ ★</div>
              <p className="text-xs text-gray-600 italic mb-2">"İlk günden satışlarım arttı. Kesinlikle denemeye değer!"</p>
              <p className="text-xs text-gray-400">- Ahmet K., E-ticaret</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA - Dark */}
      <section className="py-20 px-6 bg-gray-900">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Mesajlaşma Yönetiminizi Bir Üst Seviyeye Taşıyın</h2>
          <p className="text-gray-400 text-lg mb-8">14 gün ücretsiz deneme ile hemen başlayın. Kredi kartı gerektirmez.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/register" className="bg-blue-600 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-blue-700 transition">
              Ücretsiz Başlayın
            </Link>
            <a href="#" className="border border-gray-600 text-gray-300 px-8 py-3.5 rounded-lg font-medium hover:border-blue-400 hover:text-blue-400 transition">
              Fiyatları İnceleyin
            </a>
          </div>
        </div>
      </section>

      {/* Footer - Dark */}
      <footer className="py-16 px-6 bg-gray-950 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <span className="text-blue-400">💬</span>
                <span className="text-lg font-bold text-white">MsgLoom</span>
              </div>
              <p className="text-sm leading-relaxed">WhatsApp & Telegram mesajlaşma yönetiminde güvenilir çözüm ortağınız.</p>
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
