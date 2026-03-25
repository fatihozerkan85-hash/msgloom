'use client';

import Link from 'next/link';
import { Check, Zap, Rocket, Building2, MessageSquare, Users, BarChart3, Headphones, Shield, Crown } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
  {
    name: 'Başlangıç', icon: Zap, price: '₺999', period: '/ay',
    description: 'Küçük işletmeler ve yeni başlayanlar için',
    features: ['1 WhatsApp hesabı','1 Telegram hesabı','500 aktif müşteri','Temel CRM özellikleri','Otomatik yanıtlar','1 kullanıcı','Email destek','Temel analitik'],
    highlight: false, color: 'blue'
  },
  {
    name: 'Profesyonel', icon: Rocket, price: '₺2.499', period: '/ay',
    description: 'Büyüyen işletmeler için en popüler plan',
    features: ['3 WhatsApp hesabı','3 Telegram hesabı','2.000 aktif müşteri','Tam CRM özellikleri','Gelişmiş otomasyon','5 kullanıcı','Öncelikli destek','Detaylı analitik','API entegrasyonu','Özel raporlar','Takım yönetimi'],
    highlight: true, color: 'purple', badge: 'En Popüler'
  },
  {
    name: 'Kurumsal', icon: Building2, price: 'Özel', period: '',
    description: 'Büyük ölçekli işletmeler için',
    features: ['Sınırsız WhatsApp hesabı','Sınırsız Telegram hesabı','Sınırsız aktif müşteri','Kurumsal CRM özellikleri','Özel otomasyon','Sınırsız kullanıcı','7/24 premium destek','Kurumsal analitik','Özel API geliştirme','Dedicated hesap yöneticisi','Özel eğitim','SLA garantisi','White-label çözüm'],
    highlight: false, color: 'indigo'
  }
];

const features = [
  { icon: MessageSquare, title: 'Çoklu Platform', description: 'WhatsApp, Telegram ve Instagram DM desteği' },
  { icon: Users, title: 'Takım İşbirliği', description: 'Ekibinizle birlikte çalışın' },
  { icon: BarChart3, title: 'Detaylı Analitik', description: 'Performansınızı anlık takip edin' },
  { icon: Shield, title: 'Güvenlik', description: 'End-to-end şifreleme ve veri güvenliği' },
  { icon: Headphones, title: 'Türkçe Destek', description: 'Profesyonel Türkçe müşteri desteği' },
  { icon: Crown, title: 'Premium Özellikler', description: 'Sürekli yeni özellikler ve güncellemeler' },
];

export default function PricingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center"><MessageSquare className="w-8 h-8 text-blue-600" /><span className="ml-2 text-xl font-semibold text-gray-900">MsgLoom</span></Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/#features" className="text-gray-700 hover:text-blue-600">Özellikler</Link>
              <Link href="/crm-features" className="text-gray-700 hover:text-blue-600">CRM</Link>
              <Link href="/pricing" className="text-blue-600 font-semibold">Fiyatlandırma</Link>
              <Link href="/login" className="text-gray-700 hover:text-blue-600">Giriş</Link>
              <Link href="/register" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Başlayın</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-5xl font-bold text-gray-900 mb-6">Size Uygun Planı Seçin</h1>
            <p className="text-xl text-gray-700 mb-4">İşletmenizin ihtiyaçlarına göre esnek ve şeffaf fiyatlandırma</p>
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-800 px-6 py-3 rounded-full font-semibold">
              <Check className="w-5 h-5" /> 5 Gün Ücretsiz Deneme · Kredi Kartı Gerektirmez
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <motion.div key={index} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative bg-white rounded-2xl shadow-xl overflow-hidden ${plan.highlight ? 'border-4 border-purple-500 transform scale-105' : 'border border-gray-200'}`}>
                {plan.badge && <div className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold">{plan.badge}</div>}
                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg ${plan.color === 'purple' ? 'bg-purple-100' : plan.color === 'indigo' ? 'bg-indigo-100' : 'bg-blue-100'}`}>
                      <plan.icon className={`w-6 h-6 ${plan.color === 'purple' ? 'text-purple-600' : plan.color === 'indigo' ? 'text-indigo-600' : 'text-blue-600'}`} />
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  </div>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-6"><span className="text-5xl font-bold text-gray-900">{plan.price}</span><span className="text-gray-600 text-lg">{plan.period}</span></div>
                  <Link href={plan.price === 'Özel' ? '#contact' : '/register'}
                    className={`block w-full py-3 rounded-lg font-semibold text-center transition-all ${plan.highlight ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg' : 'bg-gray-100 text-gray-900 hover:bg-gray-200'}`}>
                    {plan.price === 'Özel' ? 'İletişime Geçin' : '5 Gün Ücretsiz Deneyin'}
                  </Link>
                  <div className="mt-8 space-y-4">
                    {plan.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-purple-600' : 'text-blue-600'}`} />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Tüm Planlarda Dahil</h2>
            <p className="text-xl text-gray-600">Premium özellikler her pakette</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div key={index} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: index * 0.1 }} viewport={{ once: true }}
                className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-blue-600" />
                </div>
                <div><h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3><p className="text-gray-600">{feature.description}</p></div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Money Back */}
      <section className="py-20 bg-gradient-to-r from-green-50 to-emerald-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}
            className="bg-white rounded-2xl shadow-xl p-12 text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"><Shield className="w-10 h-10 text-green-600" /></div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">%100 Para İade Garantisi</h2>
            <p className="text-xl text-gray-600 mb-8">5 gün içinde beğenmezseniz, hiçbir soru sormadan paranızı iade ediyoruz.</p>
            <Link href="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg hover:shadow-lg text-lg font-semibold inline-flex items-center gap-2">
              <Zap className="w-5 h-5" /> Hemen Başlayın
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Sorularınız mı var?</h2>
          <p className="text-xl text-gray-600 mb-8">Fiyatlandırma ve özellikler hakkında detaylı bilgi almak için ekibimizle iletişime geçin.</p>
          <div className="flex gap-4 justify-center">
            <Link href="/faq" className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 text-lg">SSS</Link>
            <Link href="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 text-lg">Demo Talep Et</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
