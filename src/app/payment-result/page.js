'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, X, RefreshCw, Phone, Mail, ArrowLeft, Download, ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

function PaymentResultContent() {
  const searchParams = useSearchParams();
  const status = searchParams.get('status');
  const plan = searchParams.get('plan');
  const amount = searchParams.get('amount');

  const [confettiFired, setConfettiFired] = useState(false);

  useEffect(() => {
    if (status === 'success' && !confettiFired) {
      setConfettiFired(true);
      import('canvas-confetti').then(mod => {
        const confetti = mod.default;
        confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
        setTimeout(() => {
          confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0 } });
          confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1 } });
        }, 200);
      });
    }
  }, [status, confettiFired]);

  const planNames = { starter: 'Başlangıç Plan', pro: 'Profesyonel Plan' };
  const planPrices = { starter: '₺999', pro: '₺2.499' };
  const orderNumber = `MSL-2026-${Math.floor(Math.random() * 10000)}`;

  if (status === 'success') {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-emerald-50 z-50 flex items-center justify-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.3, type: 'spring' }}
          className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 text-center">
            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
              className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full shadow-lg mb-4">
              <CheckCircle2 className="w-14 h-14 text-white" />
            </motion.div>
            <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-3xl font-bold text-gray-900 mb-2">
              Ödeme Başarılı! 🎉
            </motion.h2>
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-gray-600">
              Siparişiniz başarıyla tamamlandı
            </motion.p>
          </div>

          <div className="p-8 space-y-6">
            <div className="bg-gray-50 rounded-xl p-6 space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Sipariş No:</span>
                <span className="font-semibold text-gray-900">{orderNumber}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Plan:</span>
                <span className="font-semibold text-gray-900">{planNames[plan] || plan || 'Plan'}</span>
              </div>
              <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                <span className="text-gray-900 font-semibold">Toplam Tutar:</span>
                <span className="text-2xl font-bold text-green-600">{amount ? `₺${amount}` : planPrices[plan] || ''}</span>
              </div>
            </div>

            <div className="bg-green-50 border-2 border-green-200 rounded-xl p-4">
              <p className="text-green-800 text-sm">
                ✓ E-posta adresinize onay mesajı gönderildi<br/>
                ✓ Hesabınız aktif edildi, hemen kullanmaya başlayabilirsiniz<br/>
                ✓ Faturanız email'inize iletildi
              </p>
            </div>

            <div className="space-y-3">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link href="/dashboard" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2">
                  <Home className="w-5 h-5" /> Yönetim Paneline Git <ArrowRight className="w-5 h-5" />
                </Link>
              </motion.div>
              <Link href="/" className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 block text-center">
                Ana Sayfaya Dön
              </Link>
            </div>

            <p className="text-center text-sm text-gray-500">
              Sorunuz mu var? <a href="mailto:destek@msgloom.com.tr" className="text-blue-600 hover:underline">Canlı destek</a> ile iletişime geçin
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  // Failed / Error
  const commonErrors = [
    { title: 'Yetersiz Bakiye', description: 'Kartınızda yeterli bakiye bulunmuyor olabilir' },
    { title: 'Kart Bilgileri Hatalı', description: 'Kart numarası, son kullanma tarihi veya CVV hatalı girilmiş olabilir' },
    { title: '3D Secure Onayı', description: '3D Secure doğrulaması tamamlanmamış olabilir' },
    { title: 'Banka Tarafından Reddedildi', description: 'Bankanız işlemi güvenlik nedeniyle reddetmiş olabilir' },
  ];

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-red-50 to-orange-50 z-50 flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, scale: 0.9, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} transition={{ duration: 0.3, type: 'spring' }}
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden">
        <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 text-center relative overflow-hidden">
          <motion.div initial={{ scale: 0, rotate: -180 }} animate={{ scale: 1, rotate: 0 }} transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
            className="relative inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-500 to-orange-600 rounded-full shadow-lg mb-4">
            <XCircle className="w-14 h-14 text-white" />
          </motion.div>
          <motion.h2 initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="text-3xl font-bold text-gray-900 mb-2">
            Ödeme Gerçekleşmedi
          </motion.h2>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }} className="text-gray-600">
            İşleminiz tamamlanamadı
          </motion.p>
        </div>

        <div className="p-8 space-y-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-red-900 mb-1">Ödeme işlemi gerçekleştirilemedi</p>
                <p className="text-sm text-red-700">Lütfen tekrar deneyin</p>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold text-gray-900 mb-3">Olası Nedenler:</h3>
            <div className="space-y-2">
              {commonErrors.map((error, i) => (
                <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * i }} className="flex items-start gap-2 text-sm">
                  <div className="w-1.5 h-1.5 bg-red-500 rounded-full mt-2 flex-shrink-0" />
                  <div><span className="font-medium text-gray-900">{error.title}:</span> <span className="text-gray-600">{error.description}</span></div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <h4 className="font-semibold text-blue-900 mb-2">💡 Ne Yapmalıyım?</h4>
            <ul className="space-y-1 text-sm text-blue-800">
              <li>• Kart bilgilerinizi kontrol edin</li>
              <li>• Kartınızın bakiyesini kontrol edin</li>
              <li>• Farklı bir kart ile deneyebilirsiniz</li>
              <li>• Bankanızı arayarak işlemi onaylayabilirsiniz</li>
            </ul>
          </div>

          <div className="space-y-3">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link href="/pricing" className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2 block text-center">
                <RefreshCw className="w-5 h-5" /> Tekrar Dene
              </Link>
            </motion.div>
            <Link href="/" className="w-full border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center gap-2 block text-center">
              <ArrowLeft className="w-5 h-5" /> Geri Dön
            </Link>
          </div>

          <div className="border-t pt-6">
            <p className="text-center text-sm text-gray-600 mb-4">Sorun devam ediyorsa yardım alın:</p>
            <div className="flex gap-3">
              <a href="tel:+908500000000" className="flex-1 flex items-center justify-center gap-2 bg-green-50 text-green-700 py-2 rounded-lg hover:bg-green-100 transition-colors text-sm font-medium">
                <Phone className="w-4 h-4" /> Destek Hattı
              </a>
              <a href="mailto:destek@msgloom.com.tr" className="flex-1 flex items-center justify-center gap-2 bg-blue-50 text-blue-700 py-2 rounded-lg hover:bg-blue-100 transition-colors text-sm font-medium">
                <Mail className="w-4 h-4" /> Email
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function PaymentResultPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
      <PaymentResultContent />
    </Suspense>
  );
}
