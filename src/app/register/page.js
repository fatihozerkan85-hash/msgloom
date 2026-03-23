'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', company: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) router.push('/dashboard');
    else setError(data.error);
    setLoading(false);
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-screen flex">
      {/* Left - Visual */}
      <div className="hidden lg:flex flex-1 bg-gradient-to-br from-blue-500 to-blue-700 items-center justify-center p-12">
        <div className="text-white max-w-md">
          <h3 className="text-3xl font-bold mb-4">Dakikalar içinde başlayın</h3>
          <p className="text-blue-100 text-lg mb-8">Ücretsiz hesap oluşturun ve hemen mesaj göndermeye başlayın.</p>
          <div className="bg-white/10 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">💬</div>
              <div>
                <p className="font-medium">100 mesaj/ay ücretsiz</p>
                <p className="text-blue-200 text-sm">Kredi kartı gerekmez</p>
              </div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">⚡</div>
              <div>
                <p className="font-medium">2 dakikada kurulum</p>
                <p className="text-blue-200 text-sm">Hemen kullanmaya başlayın</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">🔒</div>
              <div>
                <p className="font-medium">Güvenli altyapı</p>
                <p className="text-blue-200 text-sm">KVKK uyumlu veri saklama</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right - Form */}
      <div className="flex-1 flex items-center justify-center px-8">
        <div className="w-full max-w-md">
          <Link href="/" className="text-2xl font-bold text-blue-600 mb-2 inline-block">MsgLoom</Link>
          <h2 className="text-3xl font-bold text-gray-900 mt-6 mb-2">Hesap oluşturun</h2>
          <p className="text-gray-500 mb-8">Ücretsiz başlayın, istediğiniz zaman yükseltin</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Ad Soyad</label>
                <input type="text" value={form.name} onChange={update('name')}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition" required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Şirket</label>
                <input type="text" value={form.company} onChange={update('company')}
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition" />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email adresi</label>
              <input type="email" value={form.email} onChange={update('email')}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition" placeholder="ornek@sirket.com" required />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Şifre</label>
              <input type="password" value={form.password} onChange={update('password')}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition" placeholder="En az 6 karakter" required minLength={6} />
            </div>

            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl">{error}</div>}

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition shadow-sm">
              {loading ? 'Hesap oluşturuluyor...' : 'Ücretsiz Kayıt Ol'}
            </button>

            <p className="text-xs text-gray-400 text-center">
              Kayıt olarak <a href="#" className="underline">Kullanım Şartları</a> ve <a href="#" className="underline">Gizlilik Politikası</a>nı kabul etmiş olursunuz.
            </p>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Zaten hesabınız var mı? <Link href="/login" className="text-blue-600 font-medium hover:underline">Giriş yapın</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
