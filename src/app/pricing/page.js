'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Check, Zap, Rocket, Building2, MessageSquare, Users, BarChart3, Headphones, Shield, Crown, X } from 'lucide-react';
import { motion } from 'framer-motion';

const plans = [
  {
    id: 'starter', name: 'Başlangıç', icon: Zap, price: '₺999', period: '/ay',
    description: 'Küçük işletmeler ve yeni başlayanlar için',
    features: ['1 WhatsApp hesabı','1 Telegram hesabı','500 aktif müşteri','Temel CRM özellikleri','Otomatik yanıtlar','1 kullanıcı','Email destek','Temel analitik'],
    highlight: false, color: 'blue', borderColor: 'border-blue-500', bgHover: 'hover:border-blue-400', glowColor: 'shadow-blue-200'
  },
  {
    id: 'pro', name: 'Profesyonel', icon: Rocket, price: '₺2.499', period: '/ay',
    description: 'Büyüyen işletmeler için en popüler plan',
    features: ['3 WhatsApp hesabı','3 Telegram hesabı','2.000 aktif müşteri','Tam CRM özellikleri','Gelişmiş otomasyon','5 kullanıcı','Öncelikli destek','Detaylı analitik','API entegrasyonu','Özel raporlar','Takım yönetimi'],
    highlight: true, color: 'purple', badge: 'En Popüler', borderColor: 'border-purple-500', bgHover: 'hover:border-purple-400', glowColor: 'shadow-purple-200'
  },
  {
    id: 'enterprise', name: 'Kurumsal', icon: Building2, price: 'Özel', period: '',
    description: 'Büyük ölçekli işletmeler için',
    features: ['Sınırsız WhatsApp hesabı','Sınırsız Telegram hesabı','Sınırsız aktif müşteri','Kurumsal CRM','Özel otomasyon','Sınırsız kullanıcı','7/24 premium destek','Kurumsal analitik','Özel API','Dedicated hesap yöneticisi','SLA garantisi','White-label'],
    highlight: false, color: 'indigo', borderColor: 'border-indigo-500', bgHover: 'hover:border-indigo-400', glowColor: 'shadow-indigo-200'
  }
];

const allFeatures = [
  { icon: MessageSquare, title: 'Çoklu Platform', description: 'WhatsApp, Telegram ve Instagram DM desteği' },
  { icon: Users, title: 'Takım İşbirliği', description: 'Ekibinizle birlikte çalışın' },
  { icon: BarChart3, title: 'Detaylı Analitik', description: 'Performansınızı anlık takip edin' },
  { icon: Shield, title: 'Güvenlik', description: 'End-to-end şifreleme ve veri güvenliği' },
  { icon: Headphones, title: 'Türkçe Destek', description: 'Profesyonel Türkçe müşteri desteği' },
  { icon: Crown, title: 'Premium Özellikler', description: 'Sürekli yeni özellikler ve güncellemeler' },
];

export default function PricingPage() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [loading, setLoading] = useState(null);
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutHtml, setCheckoutHtml] = useState('');
  const checkoutRef = useRef(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me').then(r => r.json()).then(d => { if (d.user) setUser(d.user); setChecking(false); }).catch(() => setChecking(false));
  }, []);

  useEffect(() => {
    if (showCheckout && checkoutHtml && checkoutRef.current) {
      checkoutRef.current.innerHTML = checkoutHtml;
      const scripts = checkoutRef.current.querySelectorAll('script');
      scripts.forEach(s => {
        const ns = document.createElement('script');
        if (s.src) ns.src = s.src; else ns.textContent = s.textContent;
        document.body.appendChild(ns);
      });
    }
  }, [showCheckout, checkoutHtml]);

  const handleBuy = async (planId) => {
    if (!user) {
      router.push(`/login?redirect=/pricing&plan=${planId}`);
      return;
    }
    if (planId === 'enterprise') {
      window.location.href = 'mailto:info@msgloom.com.tr?subject=Kurumsal Plan Talebi';
      return;
    }

    setLoading(planId);
    try {
      const res = await fetch('/api/payment/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId }),
      });
      const data = await res.json();
      if (data.requireLogin) { router.push(`/login?redirect=/pricing&plan=${planId}`); return; }
      if (data.success) { setCheckoutHtml(data.checkoutFormContent); setShowCheckout(true); }
      else alert(data.error || 'Ödeme başlatılamadı');
    } catch { alert('Bağlantı hatası'); }
    setLoading(null);
  };

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
              {user ? (
                <Link href="/dashboard" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Dashboard</Link>
              ) : (
                <>
                  <Link href="/login" className="text-gray-700 hover:text-blue-600">Giriş</Link>
                  <Link href="/register" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">Başlayın</Link>
                </>
              )}
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
          <div className="grid md:grid-cols-3 gap-8 items-start">
            {plans.map((plan, index) => (
              <motion.div
                key={plan.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                whileHover={{ y: -12, scale: 1.03, boxShadow: '0 25px 60px -12px rgba(0,0,0,0.15)' }}
                className={`relative bg-white rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 ${
                  plan.highlight ? `border-4 ${plan.borderColor} shadow-2xl ${plan.glowColor}` : `border-2 border-gray-200 ${plan.bgHover} hover:shadow-xl hover:${plan.glowColor}`
                }`}
              >
                {plan.badge && (
                  <motion.div
                    className="absolute top-0 right-0 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-1.5 rounded-bl-xl text-sm font-semibold"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {plan.badge}
                  </motion.div>
                )}

                <div className="p-8">
                  <div className="flex items-center gap-3 mb-4">
                    <motion.div
                      className={`inline-flex items-center justify-center w-12 h-12 rounded-xl ${
                        plan.color === 'purple' ? 'bg-purple-100' : plan.color === 'indigo' ? 'bg-indigo-100' : 'bg-blue-100'
                      }`}
                      whileHover={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 0.5 }}
                    >
                      <plan.icon className={`w-6 h-6 ${plan.color === 'purple' ? 'text-purple-600' : plan.color === 'indigo' ? 'text-indigo-600' : 'text-blue-600'}`} />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900">{plan.name}</h3>
                  </div>

                  <p className="text-gray-600 mb-6">{plan.description}</p>

                  <div className="mb-6">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    <span className="text-gray-600 text-lg">{plan.period}</span>
                  </div>

                  <motion.button
                    onClick={() => handleBuy(plan.id)}
                    disabled={loading === plan.id}
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    className={`w-full py-3.5 rounded-xl font-semibold transition-all disabled:opacity-50 ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg'
                        : plan.id === 'enterprise'
                          ? 'bg-indigo-600 text-white hover:bg-indigo-700'
                          : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                  >
                    {loading === plan.id ? (
                      <span className="inline-flex items-center gap-2"><span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></span> İşleniyor...</span>
                    ) : plan.id === 'enterprise' ? 'İletişime Geçin' : !user ? 'Giriş Yap ve Satın Al' : '5 Gün Ücretsiz Deneyin'}
                  </motion.button>

                  {!user && plan.id !== 'enterprise' && (
                    <p className="text-xs text-gray-400 text-center mt-2">Satın almak için giriş yapmanız gerekiyor</p>
                  )}

                  <div className="mt-8 space-y-3">
                    {plan.features.map((feature, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 + idx * 0.05 }}
                        className="flex items-start gap-3"
                      >
                        <Check className={`w-5 h-5 mt-0.5 flex-shrink-0 ${plan.highlight ? 'text-purple-600' : 'text-blue-600'}`} />
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </motion.div>
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
            {allFeatures.map((f, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }}
                className="flex items-start gap-4 p-6 bg-gray-50 rounded-xl hover:bg-blue-50 transition-colors">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg flex-shrink-0"><f.icon className="w-6 h-6 text-blue-600" /></div>
                <div><h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3><p className="text-gray-600">{f.description}</p></div>
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
            <motion.button onClick={() => handleBuy('starter')} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-lg hover:shadow-lg text-lg font-semibold inline-flex items-center gap-2">
              <Zap className="w-5 h-5" /> Hemen Başlayın
            </motion.button>
          </motion.div>
        </div>
      </section>

      {/* iyzico Checkout Modal */}
      {showCheckout && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto relative"
          >
            <button onClick={() => setShowCheckout(false)} className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 z-10">
              <X className="w-5 h-5" />
            </button>
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Güvenli Ödeme</h3>
              <div ref={checkoutRef} id="iyzipay-checkout-form"></div>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
