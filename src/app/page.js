'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) router.push('/dashboard');
        else setChecking(false);
      })
      .catch(() => setChecking(false));
  }, [router]);

  if (checking) return <div className="min-h-screen flex items-center justify-center"><p>Yükleniyor...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-green-600">MsgLoom</h1>
          <div className="space-x-4">
            <a href="/login" className="text-gray-600 hover:text-green-600">Giriş Yap</a>
            <a href="/register" className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700">Kayıt Ol</a>
          </div>
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-4 py-20 text-center">
        <h2 className="text-4xl font-bold mb-4">WhatsApp & Telegram Mesajlaşma Platformu</h2>
        <p className="text-xl text-gray-600 mb-8">Müşterilerinizle tek panelden iletişim kurun</p>
        <a href="/register" className="bg-green-600 text-white px-8 py-3 rounded-lg text-lg hover:bg-green-700 inline-block">
          Ücretsiz Başlayın
        </a>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12 grid md:grid-cols-3 gap-8">
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <div className="text-4xl mb-4">💬</div>
          <h3 className="font-bold text-lg mb-2">WhatsApp Business API</h3>
          <p className="text-gray-600">Resmi API ile güvenli mesajlaşma</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <div className="text-4xl mb-4">🤖</div>
          <h3 className="font-bold text-lg mb-2">Telegram Bot</h3>
          <p className="text-gray-600">Telegram üzerinden otomatik mesajlaşma</p>
        </div>
        <div className="bg-white p-6 rounded-xl shadow text-center">
          <div className="text-4xl mb-4">📊</div>
          <h3 className="font-bold text-lg mb-2">Detaylı Raporlama</h3>
          <p className="text-gray-600">Tüm mesajlarınızı tek panelden takip edin</p>
        </div>
      </div>
    </div>
  );
}
