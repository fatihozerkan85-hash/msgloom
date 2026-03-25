'use client';

import Link from 'next/link';
import { Users, LineChart, Workflow, FileText, Calendar, Zap, Target, Mail, Phone, MessageSquare, TrendingUp, BarChart3 } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  { icon: Users, title: 'Müşteri Yönetimi', description: 'Tüm müşteri bilgilerini tek merkezden yönetin. Detaylı profiller, notlar ve geçmiş iletişim kayıtları.', image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
  { icon: Target, title: 'Satış Pipeline', description: 'Satış sürecinizi görselleştirin. Fırsatları takip edin, aşamalarını yönetin ve dönüşüm oranlarını artırın.', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
  { icon: Workflow, title: 'Otomasyon', description: 'Tekrar eden görevleri otomatikleştirin. Akıllı iş akışları ile zamandan tasarruf edin.', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
  { icon: BarChart3, title: 'Raporlama & Analitik', description: "Detaylı raporlar ve dashboard'lar ile performansınızı anlık takip edin.", image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
  { icon: Calendar, title: 'Randevu Yönetimi', description: 'Müşteri randevularınızı planlayın, hatırlatmalar gönderin ve takip edin.', image: 'https://images.unsplash.com/photo-1506784365847-bbad939e9335?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
  { icon: Mail, title: 'Çoklu Kanal Entegrasyonu', description: "WhatsApp, Telegram, Instagram DM - tüm kanalları tek yerden yönetin.", image: 'https://images.unsplash.com/photo-1557838923-2985c318be48?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600' },
];

const benefits = [
  { icon: TrendingUp, title: 'Satışları %40 Artırın', description: 'Hiçbir fırsatı kaçırmayın, her müşteri etkileşimini değerlendirin.' },
  { icon: Zap, title: 'Zamandan %60 Tasarruf', description: 'Otomatik iş akışları ile manuel işlemleri minimize edin.' },
  { icon: Users, title: 'Müşteri Memnuniyeti', description: 'Hızlı yanıt süreleri ve kişiselleştirilmiş hizmet sunun.' },
  { icon: LineChart, title: 'Data-Driven Kararlar', description: 'Detaylı analizler ile bilinçli iş kararları alın.' },
];

export default function CRMFeaturesPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/" className="flex items-center"><MessageSquare className="w-8 h-8 text-blue-600" /><span className="ml-2 text-xl font-semibold text-gray-900">MsgLoom</span></Link>
            <div className="hidden md:flex items-center gap-8">
              <Link href="/#features" className="text-gray-700 hover:text-blue-600">Özellikler</Link>
              <Link href="/crm-features" className="text-blue-600 font-semibold">CRM</Link>
              <Link href="/pricing" className="text-gray-700 hover:text-blue-600">Fiyatlandırma</Link>
              <Link href="/login" className="text-gray-700 hover:text-blue-600">Giriş</Link>
              <Link href="/register" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Başlayın</Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">WhatsApp & Telegram için Güçlü CRM</h1>
              <p className="text-xl text-gray-700 mb-8">Mesajlaşma platformlarınızı profesyonel bir CRM'e dönüştürün. Müşteri ilişkilerinizi yönetin, satışları artırın.</p>
              <div className="flex gap-4">
                <Link href="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 text-lg flex items-center gap-2"><Zap className="w-5 h-5" /> Hemen Başlayın</Link>
                <Link href="/pricing" className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 text-lg">Fiyatları İncele</Link>
              </div>
              <div className="flex gap-8 mt-8 text-sm text-gray-600">
                <div>✓ 5 gün ücretsiz deneme</div><div>✓ Kredi kartı gerektirmez</div><div>✓ Kurulum 2 dakika</div>
              </div>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1553877522-43269d4ea984?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" alt="CRM Dashboard" className="w-full h-full object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">CRM Özellikleri</h2>
            <p className="text-xl text-gray-600">İşletmeniz için gereken her şey, tek platformda</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg hover:border-blue-300 transition-all">
                <div className="h-48 mb-6 rounded-lg overflow-hidden"><img src={f.image} alt={f.title} className="w-full h-full object-cover" /></div>
                <div className="flex items-center gap-3 mb-4"><f.icon className="w-6 h-6 text-blue-600" /><h3 className="text-xl font-semibold text-gray-900">{f.title}</h3></div>
                <p className="text-gray-600">{f.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Neden MsgLoom CRM?</h2>
            <p className="text-xl text-gray-600">Rakiplerinizin önüne geçin</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((b, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
                className="bg-white rounded-xl p-6 text-center hover:shadow-xl transition-shadow">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4"><b.icon className="w-8 h-8 text-blue-600" /></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{b.title}</h3>
                <p className="text-gray-600">{b.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }}>
            <h2 className="text-4xl font-bold text-white mb-6">CRM'inizi Bugün Kurun</h2>
            <p className="text-xl text-blue-100 mb-8">5 gün ücretsiz deneyin, beğenmezseniz %100 para iade garantisi</p>
            <Link href="/register" className="bg-white text-blue-600 px-8 py-4 rounded-lg hover:bg-gray-100 text-lg font-semibold inline-flex items-center gap-2"><Zap className="w-5 h-5" /> Şimdi Başlayın - 5 Gün Ücretsiz</Link>
            <p className="text-blue-100 mt-4 text-sm">Kredi kartı bilgisi gerektirmez</p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
