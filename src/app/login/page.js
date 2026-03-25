'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Suspense } from 'react';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get('redirect');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    const data = await res.json();
    if (data.success) router.push(redirect || '/dashboard');
    else if (data.needsVerification) router.push(`/verify?email=${encodeURIComponent(data.email)}`);
    else setError(data.error);
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left - Form */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          <Link href="/" className="text-2xl font-bold text-blue-600 mb-2 inline-block">MsgLoom</Link>
          <h2 className="text-3xl font-bold text-gray-900 mt-6 mb-2">Tekrar hoş geldiniz</h2>
          <p className="text-gray-500 mb-8">Hesabınıza giriş yapın</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email adresi</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition" placeholder="ornek@sirket.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Şifre</label>
              <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition" placeholder="••••••••" required />
            </div>

            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">{error}</div>}

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition shadow-sm">
              {loading ? 'Giriş yapılıyor...' : 'Giriş Yap'}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Hesabınız yok mu? <Link href="/register" className="text-blue-600 font-medium hover:underline">Ücretsiz kayıt olun</Link>
          </p>
        </div>
      </div>

      {/* Right - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-500 to-blue-700 items-center justify-center p-12">
        <div className="text-white max-w-md">
          <h3 className="text-3xl font-bold mb-4">Mesajlaşmayı güçlendirin</h3>
          <p className="text-blue-100 text-lg mb-8">WhatsApp ve Telegram üzerinden müşterilerinize tek panelden ulaşın.</p>
          <div className="space-y-4">
            {['Resmi WhatsApp Business API', 'Toplu mesaj gönderimi', 'Detaylı analitik ve raporlama', 'Güvenli ve ölçeklenebilir'].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <span className="bg-white/20 rounded-full p-1">✓</span>
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
      <LoginContent />
    </Suspense>
  );
}