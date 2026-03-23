'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => { if (data.user) router.push('/dashboard'); else setChecking(false); })
      .catch(() => setChecking(false));
    fetch('/api/plans')
      .then(res => res.json())
      .then(data => setPlans(data.plans || []))
      .catch(() => {});
  }, [router]);

  if (checking) return <div className="min-h-screen flex items-center justify-center"><p>Yükleniyor...</p></div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full bg-white/90 backdrop-blur-sm z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-green-600">MsgLoom</span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-green-600 transition">Özellikler</a>
            <a href="#pricing" className="hover:text-green-600 transition">Fiyatlandırma</a>
            <a href="#faq" className="hover:text-green-600 transition">SSS</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-700 hover:text-green-600 font-medium px-4 py-2">Giriş Yap</Link>
            <Link href="/register" className="text-sm bg-green-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-green-700 transition shadow-sm">
              Ücretsiz Başla
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-block bg-green-50 text-green-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
            🚀 WhatsApp & Telegram için #1 Mesajlaşma Platformu
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
            Müşterilerinizle iletişimi
            <span className="text-green-600"> kolaylaştırın</span>
          </h1>
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            WhatsApp Business API ve Telegram Bot entegrasyonu ile müşterilerinize tek panelden ulaşın. Toplu mesaj gönderin, otomatik yanıtlar kurun.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/register" className="bg-green-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-green-700 transition shadow-lg shadow-green-200">
              Ücretsiz Deneyin →
            </Link>
            <a href="#features" className="border-2 border-gray-200 text-gray-700 px-8 py-4 rounded-full text-lg font-medium hover:border-green-300 hover:text-green-600 transition">
              Nasıl Çalışır?
            </a>
          </div>
          <p className="text-sm text-gray-400 mt-4">Kredi kartı gerekmez · 100 mesaj/ay ücretsiz</p>
        </div>
      </section>

      {/* Trusted */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-5xl mx-auto text-center px-6">
          <p className="text-sm text-gray-500 mb-6">Güvenilir işletmelerin tercihi</p>
          <div className="flex flex-wrap justify-center gap-12 opacity-40">
            <span className="text-2xl font-bold text-gray-400">Şirket 1</span>
            <span className="text-2xl font-bold text-gray-400">Şirket 2</span>
            <span className="text-2xl font-bold text-gray-400">Şirket 3</span>
            <span className="text-2xl font-bold text-gray-400">Şirket 4</span>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Tek platformda tüm mesajlaşma kanalları</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">WhatsApp ve Telegram üzerinden müşterilerinizle etkileşime geçin</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: '💬', title: 'WhatsApp Business API', desc: 'Resmi Meta API ile güvenli ve ölçeklenebilir mesajlaşma. Template mesajlar, medya gönderimi ve daha fazlası.' },
              { icon: '🤖', title: 'Telegram Bot Entegrasyonu', desc: 'Telegram botunuzu bağlayın, otomatik yanıtlar kurun ve müşterilerinize anında ulaşın.' },
              { icon: '📤', title: 'Toplu Mesaj Gönderimi', desc: 'Binlerce müşterinize tek tıkla kampanya mesajları gönderin. Segmentasyon ve zamanlama desteği.' },
              { icon: '📊', title: 'Detaylı Analitik', desc: 'Gönderim oranları, okunma oranları ve müşteri etkileşimlerini gerçek zamanlı takip edin.' },
              { icon: '👥', title: 'Müşteri Yönetimi', desc: 'Kişi listeleri oluşturun, etiketleyin ve segmentlere ayırın. CRM entegrasyonu ile güçlendirin.' },
              { icon: '🔒', title: 'Güvenli Altyapı', desc: 'End-to-end şifreleme, KVKK uyumlu veri saklama ve güvenli API erişimi.' },
            ].map((f, i) => (
              <div key={i} className="bg-white border border-gray-100 rounded-2xl p-8 hover:shadow-lg hover:border-green-100 transition group">
                <div className="text-4xl mb-4">{f.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-green-600 transition">{f.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">3 adımda başlayın</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Hesap Oluşturun', desc: 'Ücretsiz kayıt olun ve dashboard\'a erişin.' },
              { step: '2', title: 'Kanallarınızı Bağlayın', desc: 'WhatsApp Business API veya Telegram botunuzu entegre edin.' },
              { step: '3', title: 'Mesaj Göndermeye Başlayın', desc: 'Tek tek veya toplu mesaj gönderin, gelen mesajları yönetin.' },
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-green-600 text-white rounded-2xl flex items-center justify-center text-2xl font-bold mx-auto mb-4">{s.step}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{s.title}</h3>
                <p className="text-gray-600 text-sm">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Basit ve şeffaf fiyatlandırma</h2>
            <p className="text-lg text-gray-600">İşletmenize uygun planı seçin</p>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {plans.map((plan, i) => (
              <div key={plan.id} className={`rounded-2xl p-8 border-2 transition ${i === 2 ? 'border-green-500 bg-green-50 shadow-xl scale-105' : 'border-gray-100 bg-white hover:border-green-200'}`}>
                {i === 2 && <div className="text-xs font-bold text-green-600 uppercase mb-2">En Popüler</div>}
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-sm text-gray-500 mt-1 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">{plan.price_monthly === 0 ? 'Ücretsiz' : `₺${plan.price_monthly}`}</span>
                  {plan.price_monthly > 0 && <span className="text-gray-500 text-sm">/ay</span>}
                </div>
                <ul className="space-y-3 mb-8">
                  {(plan.features || []).map((f, j) => (
                    <li key={j} className="flex items-center gap-2 text-sm text-gray-600">
                      <span className="text-green-500">✓</span> {f}
                    </li>
                  ))}
                </ul>
                <Link href="/register" className={`block text-center py-3 rounded-full font-medium transition ${i === 2 ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-100 text-gray-700 hover:bg-green-600 hover:text-white'}`}>
                  {plan.price_monthly === 0 ? 'Ücretsiz Başla' : 'Planı Seç'}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-6 bg-gray-50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-12">Sıkça Sorulan Sorular</h2>
          {[
            { q: 'WhatsApp Business API nedir?', a: 'Meta tarafından sağlanan resmi API\'dir. İşletmelerin müşterileriyle ölçeklenebilir şekilde iletişim kurmasını sağlar.' },
            { q: 'Ücretsiz plan ne kadar süre geçerli?', a: 'Ücretsiz plan süresiz olarak geçerlidir. Ayda 100 mesaj gönderebilirsiniz.' },
            { q: 'Kendi WhatsApp numaram ile kullanabilir miyim?', a: 'Evet, Meta Business hesabınızı bağlayarak kendi numaranızı kullanabilirsiniz.' },
            { q: 'Telegram entegrasyonu nasıl çalışır?', a: 'BotFather üzerinden oluşturduğunuz bot token\'ını panelden ekleyerek Telegram entegrasyonunu aktif edebilirsiniz.' },
          ].map((item, i) => (
            <div key={i} className="bg-white rounded-xl p-6 mb-4 border border-gray-100">
              <h3 className="font-bold text-gray-900 mb-2">{item.q}</h3>
              <p className="text-gray-600 text-sm">{item.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-green-600">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Müşterilerinizle iletişimi bugün güçlendirin</h2>
          <p className="text-green-100 text-lg mb-8">Ücretsiz hesap oluşturun, dakikalar içinde mesaj göndermeye başlayın.</p>
          <Link href="/register" className="bg-white text-green-700 px-8 py-4 rounded-full text-lg font-bold hover:bg-green-50 transition inline-block shadow-lg">
            Ücretsiz Deneyin →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 bg-gray-900 text-gray-400">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div>
            <span className="text-xl font-bold text-white">MsgLoom</span>
            <p className="text-sm mt-1">WhatsApp & Telegram Mesajlaşma Platformu</p>
          </div>
          <div className="flex gap-6 text-sm">
            <a href="#" className="hover:text-white transition">Gizlilik Politikası</a>
            <a href="#" className="hover:text-white transition">Kullanım Şartları</a>
            <a href="#" className="hover:text-white transition">İletişim</a>
          </div>
          <p className="text-sm">© 2024 MsgLoom. Tüm hakları saklıdır.</p>
        </div>
      </footer>
    </div>
  );
}
