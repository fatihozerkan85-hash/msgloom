'use client';

import { useState, useEffect, useRef, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function VerifyContent() {
  const [code, setCode] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendMsg, setResendMsg] = useState('');
  const [countdown, setCountdown] = useState(60);
  const inputRefs = useRef([]);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  useEffect(() => {
    if (!email) router.push('/register');
  }, [email, router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const handleChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value.slice(-1);
    setCode(newCode);
    if (value && index < 5) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length === 6) {
      setCode(pasted.split(''));
      inputRefs.current[5]?.focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fullCode = code.join('');
    if (fullCode.length !== 6) { setError('Lütfen 6 haneli kodu girin'); return; }

    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/auth/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, code: fullCode }),
      });
      const data = await res.json();
      if (data.success) router.push('/');
      else setError(data.error);
    } catch { setError('Bir hata oluştu'); }
    setLoading(false);
  };

  const handleResend = async () => {
    if (countdown > 0) return;
    setResendLoading(true);
    setResendMsg('');
    setError('');
    try {
      const res = await fetch('/api/auth/resend-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (data.success) { setResendMsg('Yeni kod gönderildi'); setCountdown(60); setCode(['','','','','','']); inputRefs.current[0]?.focus(); }
      else setError(data.error);
    } catch { setError('Bir hata oluştu'); }
    setResendLoading(false);
  };

  if (!email) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <Link href="/" className="text-2xl font-bold text-blue-600 inline-block mb-4">MsgLoom</Link>
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📧</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">E-posta Doğrulama</h2>
            <p className="text-gray-500 text-sm">
              <span className="font-medium text-gray-700">{email}</span> adresine gönderilen 6 haneli kodu girin
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-2 mb-6" onPaste={handlePaste}>
              {code.map((digit, i) => (
                <input
                  key={i}
                  ref={el => inputRefs.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className="w-12 h-14 text-center text-xl font-bold border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition"
                  aria-label={`Doğrulama kodu ${i + 1}. hane`}
                />
              ))}
            </div>

            {error && <div className="bg-red-50 text-red-600 text-sm p-3 rounded-xl mb-4 text-center">{error}</div>}
            {resendMsg && <div className="bg-green-50 text-green-600 text-sm p-3 rounded-xl mb-4 text-center">{resendMsg}</div>}

            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition shadow-sm mb-4">
              {loading ? 'Doğrulanıyor...' : 'Doğrula ve Giriş Yap'}
            </button>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">Kod gelmedi mi?</p>
            <button
              onClick={handleResend}
              disabled={countdown > 0 || resendLoading}
              className="text-sm text-blue-600 font-medium hover:underline disabled:text-gray-400 disabled:no-underline"
            >
              {resendLoading ? 'Gönderiliyor...' : countdown > 0 ? `Tekrar gönder (${countdown}s)` : 'Tekrar Gönder'}
            </button>
          </div>
        </div>

        <p className="text-center text-sm text-gray-400 mt-6">
          <Link href="/register" className="text-blue-600 hover:underline">Kayıt sayfasına dön</Link>
        </p>
      </div>
    </div>
  );
}


export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>}>
      <VerifyContent />
    </Suspense>
  );
}
