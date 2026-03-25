'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import Messages from '@/components/Messages';
import SendMessage from '@/components/SendMessage';
import Contacts from '@/components/Contacts';
import Settings from '@/components/Settings';
import Automations from '@/components/Automations';
import Broadcast from '@/components/Broadcast';
import CRM from '@/components/CRM';
import Products from '@/components/Products';
import { CheckCircle2, X } from 'lucide-react';

function DashboardContent() {
  const [activePage, setActivePage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paymentMsg, setPaymentMsg] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const p = searchParams.get('payment');
    if (p === 'success') { setPaymentMsg('Ödeme başarıyla tamamlandı! Planınız güncellendi.'); window.history.replaceState({}, '', '/dashboard'); }
  }, [searchParams]);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) { setUser(data.user); setLoading(false); }
        else router.push('/login');
      })
      .catch(() => router.push('/login'));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Yükleniyor...</p></div>;

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'messages': return <Messages />;
      case 'send': return <SendMessage />;
      case 'contacts': return <Contacts />;
      case 'crm': return <CRM />;
      case 'products': return <Products />;
      case 'automations': return <Automations />;
      case 'broadcast': return <Broadcast />;
      case 'settings': return <Settings user={user} />;
      default: return <Dashboard />;
    }
  };

  const isExpired = user?.subscription === 'expired';

  return (
    <div className="flex h-screen">
      <Sidebar activePage={activePage} setActivePage={setActivePage} user={user} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto p-6 relative">
        {/* Trial/Plan bilgi barı */}
        {user && !isExpired && user.daysLeft !== null && user.daysLeft <= 5 && (
          <div className="mb-4 bg-amber-50 border border-amber-200 text-amber-800 px-4 py-3 rounded-xl flex items-center justify-between">
            <span className="text-sm font-medium">
              ⏳ {user.plan === 'trial' ? 'Deneme süreniz' : 'Plan süreniz'} {user.daysLeft} gün sonra doluyor.
            </span>
            <a href="/pricing" className="text-sm font-semibold text-amber-900 bg-amber-200 px-3 py-1 rounded-lg hover:bg-amber-300 transition">Plan Yükselt</a>
          </div>
        )}

        {paymentMsg && (
          <div className="mb-4 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl flex items-center justify-between">
            <div className="flex items-center gap-2"><CheckCircle2 className="w-5 h-5 text-green-600" /><span className="text-sm font-medium">{paymentMsg}</span></div>
            <button onClick={() => setPaymentMsg(null)} className="text-green-600 hover:text-green-800"><X className="w-4 h-4" /></button>
          </div>
        )}
        {renderPage()}

        {/* Süre dolmuş overlay */}
        {isExpired && (
          <div className="absolute inset-0 bg-white/80 backdrop-blur-sm z-40 flex items-center justify-center">
            <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-10 max-w-md text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <X className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {user.plan === 'trial' ? 'Deneme Süreniz Doldu' : 'Plan Süreniz Doldu'}
              </h2>
              <p className="text-gray-600 mb-6">
                {user.plan === 'trial'
                  ? '5 günlük ücretsiz deneme süreniz sona erdi. Platformu kullanmaya devam etmek için bir plan seçin.'
                  : 'Abonelik süreniz doldu. Yönetim panelinizi tekrar aktifleştirmek için planınızı yenileyin.'}
              </p>
              <div className="space-y-3">
                <a href="/pricing" className="block w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
                  Plan Seçin
                </a>
                <button onClick={handleLogout} className="block w-full text-gray-500 py-2 text-sm hover:text-gray-700 transition">
                  Çıkış Yap
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}


export default function DashboardPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
      <DashboardContent />
    </Suspense>
  );
}
