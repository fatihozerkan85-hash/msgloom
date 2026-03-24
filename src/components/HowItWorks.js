'use client';

import { motion } from 'framer-motion';
import { Link as LinkIcon, Settings, Zap, LineChart, CheckCircle2, ArrowRight } from 'lucide-react';

const steps = [
  {
    number: '01', title: 'Platformu Bağlayın',
    description: 'WhatsApp, Telegram veya Instagram hesabınızı tek tıkla bağlayın. QR kod ile 30 saniyede hazır.',
    image: 'https://images.unsplash.com/photo-1579563231082-c391d12ed2d4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    icon: LinkIcon, color: 'from-blue-500 to-cyan-500',
    features: ['QR kod ile anında bağlantı', 'Çoklu platform desteği', 'Güvenli şifreleme']
  },
  {
    number: '02', title: 'Botunuzu Özelleştirin',
    description: 'Ürünlerinizi ekleyin, yanıt şablonlarını oluşturun, kampanyalarınızı tanımlayın.',
    image: 'https://images.unsplash.com/photo-1575388902449-6bca946ad549?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    icon: Settings, color: 'from-purple-500 to-pink-500',
    features: ['Sürükle-bırak ürün ekleme', 'Akıllı yanıt şablonları', 'Kişiselleştirilebilir mesajlar']
  },
  {
    number: '03', title: 'Otomatik Satış Yapın',
    description: 'Botunuz 7/24 müşterilerinize yanıt versin, ürün önersin ve satış tamamlasın.',
    image: 'https://images.unsplash.com/photo-1769839271832-cfd7a1f6854f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    icon: Zap, color: 'from-orange-500 to-red-500',
    features: ['Anlık otomatik yanıtlar', 'Akıllı ürün önerileri', 'Otomatik sipariş alma']
  },
  {
    number: '04', title: 'Analitiği İzleyin',
    description: 'Dashboard üzerinden satışlarınızı, müşteri memnuniyetini ve performansı takip edin.',
    image: 'https://images.unsplash.com/photo-1748439281934-2803c6a3ee36?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080',
    icon: LineChart, color: 'from-green-500 to-emerald-500',
    features: ['Gerçek zamanlı raporlar', 'Detaylı satış analitiği', 'Müşteri davranış takibi']
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 relative overflow-hidden">
      <motion.div className="absolute top-0 left-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" animate={{ x: [0, 100, 0], y: [0, 50, 0], scale: [1, 1.2, 1] }} transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }} />
      <motion.div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" animate={{ x: [0, -100, 0], y: [0, -50, 0], scale: [1.2, 1, 1.2] }} transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div className="text-center mb-20" initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <motion.div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-blue-200 px-6 py-3 rounded-full mb-6 shadow-lg" animate={{ y: [0, -8, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
            <Zap className="w-5 h-5 text-blue-600" />
            <span className="text-blue-700 font-semibold">Sadece 4 Adım</span>
          </motion.div>
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">Nasıl Çalışır?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">MsgLoom ile dakikalar içinde botunuzu kurun ve satışa başlayın. Teknik bilgiye gerek yok!</p>
        </motion.div>

        <div className="space-y-24">
          {steps.map((step, index) => (
            <motion.div key={step.number} className={`grid md:grid-cols-2 gap-12 items-center`} initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: index * 0.1 }} viewport={{ once: true }}>
              <div className={index % 2 === 1 ? 'md:order-2' : ''}>
                <motion.div className="relative inline-block mb-6" whileHover={{ scale: 1.05 }}>
                  <motion.div className={`text-7xl md:text-8xl font-bold bg-gradient-to-br ${step.color} bg-clip-text text-transparent`} animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                    {step.number}
                  </motion.div>
                </motion.div>
                <div className="flex items-center gap-3 mb-4">
                  <motion.div className={`p-3 bg-gradient-to-br ${step.color} rounded-xl shadow-lg`} whileHover={{ rotate: 360, scale: 1.1 }} transition={{ duration: 0.6 }}>
                    <step.icon className="w-6 h-6 text-white" />
                  </motion.div>
                  <h3 className="text-3xl md:text-4xl font-bold text-gray-900">{step.title}</h3>
                </div>
                <p className="text-xl text-gray-600 mb-8 leading-relaxed">{step.description}</p>
                <ul className="space-y-3 mb-8">
                  {step.features.map((feature, fi) => (
                    <motion.li key={fi} className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 + fi * 0.1 }} viewport={{ once: true }}>
                      <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </motion.li>
                  ))}
                </ul>
                <motion.div className="flex items-center gap-2 text-sm text-gray-500" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }} viewport={{ once: true }}>
                  <span className="font-semibold">Adım {index + 1}/4</span>
                  {index < steps.length - 1 && (
                    <motion.div animate={{ x: [0, 10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                      <ArrowRight className="w-4 h-4" />
                    </motion.div>
                  )}
                </motion.div>
              </div>

              <motion.div className={index % 2 === 1 ? 'md:order-1' : ''} whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                <div className="relative group">
                  <motion.div className={`absolute -inset-1 bg-gradient-to-br ${step.color} rounded-2xl blur opacity-25 group-hover:opacity-40 transition-opacity`} animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }} />
                  <div className="relative h-80 md:h-96 rounded-2xl overflow-hidden shadow-2xl">
                    <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                    <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-10 group-hover:opacity-20 transition-opacity`} />
                    <motion.div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm rounded-full w-16 h-16 flex items-center justify-center shadow-xl" animate={{ y: [0, -10, 0] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                      <span className={`text-2xl font-bold bg-gradient-to-br ${step.color} bg-clip-text text-transparent`}>{step.number}</span>
                    </motion.div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div className="mt-20 text-center" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
          <div className="bg-white/80 backdrop-blur-sm border border-gray-200 rounded-2xl p-10 shadow-xl max-w-3xl mx-auto">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Hazır mısınız?</h3>
            <p className="text-xl text-gray-600 mb-8">Hemen şimdi ücretsiz deneyin. Kredi kartı gerekmez, 14 gün boyunca tüm özellikleri kullanın.</p>
            <motion.a href="/register" className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl font-semibold text-lg shadow-lg inline-flex items-center gap-3" whileHover={{ scale: 1.05, boxShadow: '0 25px 50px -12px rgba(59, 130, 246, 0.5)' }} whileTap={{ scale: 0.95 }}>
              Ücretsiz Başlayın
              <motion.div animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }}>
                <ArrowRight className="w-5 h-5" />
              </motion.div>
            </motion.a>
            <p className="text-sm text-gray-500 mt-4">5 dakikada kurulum • Anında aktifleşme • İstediğiniz zaman iptal edin</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
