'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Smartphone, Plus, Bot, Trash2, CheckCircle, XCircle, Wifi } from 'lucide-react';

const FB_APP_ID = '949647074467565';

export default function Settings({ user }) {
  const [accounts, setAccounts] = useState([]);
  const [status, setStatus] = useState(null);
  const [showManual, setShowManual] = useState(false);
  const [form, setForm] = useState({ phone_number_id: '', business_account_id: '', access_token: '', phone_number: '' });
  const [adding, setAdding] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);

  useEffect(() => {
    fetch('/api/account/whatsapp')
      .then(res => res.json())
      .then(data => setAccounts(data.accounts || []))
      .catch(() => {});
  }, []);

  // Facebook SDK yükle
  useEffect(() => {
    if (document.getElementById('facebook-jssdk')) {
      setSdkReady(true);
      return;
    }

    window.fbAsyncInit = function () {
      window.FB.init({
        appId: FB_APP_ID,
        autoLogAppEvents: true,
        xfbml: false,
        version: 'v21.0'
      });
      setSdkReady(true);
    };

    const script = document.createElement('script');
    script.id = 'facebook-jssdk';
    script.src = 'https://connect.facebook.net/en_US/sdk.js';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);
  }, []);

  const handleEmbeddedSignup = useCallback(() => {
    if (!window.FB) {
      setStatus({ type: 'error', text: 'Facebook SDK yüklenemedi. Sayfayı yenileyin.' });
      return;
    }

    setConnecting(true);
    setStatus(null);

    window.FB.login(
      function (response) {
        if (response.authResponse) {
          const code = response.authResponse.code;

          // sessionInfoListener'dan gelen bilgileri kullan
          // Eğer listener tetiklenmezse, code ile backend'e gönder
          if (code && window.__wa_signup_data) {
            exchangeToken(code, window.__wa_signup_data.waba_id, window.__wa_signup_data.phone_number_id);
          } else if (code) {
            // Code var ama signup data yok — kullanıcıya bilgi ver
            setStatus({ type: 'error', text: 'WhatsApp bilgileri alınamadı. Lütfen tekrar deneyin.' });
            setConnecting(false);
          }
        } else {
          setStatus({ type: 'error', text: 'Facebook girişi iptal edildi' });
          setConnecting(false);
        }
      },
      {
        config_id: process.env.NEXT_PUBLIC_WHATSAPP_CONFIG_ID || '',
        response_type: 'code',
        override_default_response_type: true,
        extras: {
          setup: {},
          featureType: '',
          sessionInfoVersion: 2,
        }
      }
    );
  }, []);

  // Session info listener — Embedded Signup tamamlandığında tetiklenir
  useEffect(() => {
    const listener = (event) => {
      if (!event.origin.includes('facebook.com')) return;
      try {
        const data = JSON.parse(event.data);
        if (data.type === 'WA_EMBEDDED_SIGNUP') {
          if (data.event === 'FINISH') {
            window.__wa_signup_data = {
              phone_number_id: data.data?.phone_number_id,
              waba_id: data.data?.waba_id,
            };
          }
        }
      } catch {}
    };

    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, []);

  const exchangeToken = async (code, wabaId, phoneNumberId) => {
    try {
      const res = await fetch('/api/account/whatsapp/exchange-token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, waba_id: wabaId, phone_number_id: phoneNumberId }),
      });
      const data = await res.json();
      if (data.success) {
        setAccounts(prev => {
          const exists = prev.find(a => a.id === data.account.id);
          if (exists) return prev.map(a => a.id === data.account.id ? data.account : a);
          return [data.account, ...prev];
        });
        setStatus({ type: 'success', text: `WhatsApp bağlandı${data.account.display_name ? ': ' + data.account.display_name : ''}` });
      } else {
        setStatus({ type: 'error', text: data.error });
      }
    } catch {
      setStatus({ type: 'error', text: 'Bağlantı hatası' });
    }
    setConnecting(false);
    window.__wa_signup_data = null;
  };

  const handleManualAdd = async (e) => {
    e.preventDefault();
    setStatus(null);
    setAdding(true);
    try {
      const res = await fetch('/api/account/whatsapp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setAccounts([data.account, ...accounts]);
        setForm({ phone_number_id: '', business_account_id: '', access_token: '', phone_number: '' });
        setShowManual(false);
        setStatus({ type: 'success', text: 'WhatsApp hesabı eklendi' });
      } else {
        setStatus({ type: 'error', text: data.error });
      }
    } catch {
      setStatus({ type: 'error', text: 'Bağlantı hatası' });
    }
    setAdding(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu WhatsApp hesabını silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch('/api/account/whatsapp', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();
      if (data.success) {
        setAccounts(accounts.filter(a => a.id !== id));
        setStatus({ type: 'success', text: 'Hesap silindi' });
      }
    } catch {}
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Ayarlar</h2>
        <p className="text-gray-500 text-sm mt-1">Hesap ve entegrasyon ayarlarınız</p>
      </div>

      {status && (
        <div className={`mb-6 p-4 rounded-xl text-sm flex items-center gap-2 ${status.type === 'success' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {status.type === 'success' ? <CheckCircle className="w-4 h-4 flex-shrink-0" /> : <XCircle className="w-4 h-4 flex-shrink-0" />}
          {status.text}
        </div>
      )}

      {/* Hesap Bilgileri */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h3 className="font-bold text-gray-900 mb-4">Hesap Bilgileri</h3>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Email</p>
            <p className="text-sm font-medium text-gray-900">{user?.email}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Ad Soyad</p>
            <p className="text-sm font-medium text-gray-900">{user?.name || '-'}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Şirket</p>
            <p className="text-sm font-medium text-gray-900">{user?.company || '-'}</p>
          </div>
          <div className="bg-gray-50 rounded-xl p-4">
            <p className="text-xs text-gray-500 mb-1">Plan</p>
            <span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full capitalize">{user?.plan || 'free'}</span>
          </div>
        </div>
      </div>

      {/* WhatsApp Bağlantısı */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-bold text-gray-900">WhatsApp Hesapları</h3>
            <p className="text-xs text-gray-500 mt-0.5">WhatsApp Business numaranızı bağlayın</p>
          </div>
        </div>

        {/* Bağlı hesaplar */}
        {accounts.length > 0 && (
          <div className="space-y-3 mb-6">
            {accounts.map(acc => (
              <div key={acc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <MessageSquare className="w-4 h-4 text-green-700" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{acc.display_name || acc.phone_number || acc.phone_number_id}</p>
                    <p className="text-xs text-gray-500">{acc.phone_number ? acc.phone_number : `ID: ${acc.phone_number_id}`}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${acc.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {acc.is_active ? '● Bağlı' : 'Pasif'}
                  </span>
                  <button onClick={() => handleDelete(acc.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition" title="Bağlantıyı kaldır">
                    <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Embedded Signup Butonu */}
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-6 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wifi className="w-7 h-7 text-green-600" strokeWidth={1.5} />
          </div>
          <h4 className="font-bold text-gray-900 mb-2">WhatsApp Numaranızı Bağlayın</h4>
          <p className="text-sm text-gray-600 mb-4">Facebook hesabınızla giriş yapın, WhatsApp Business numaranızı seçin — 2 dakikada hazır.</p>
          
          <button
            onClick={handleEmbeddedSignup}
            disabled={connecting || !sdkReady}
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-8 py-3.5 rounded-xl font-semibold text-base transition shadow-lg shadow-green-200 disabled:opacity-50 inline-flex items-center gap-2"
          >
            {connecting ? (
              <><div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div> Bağlanıyor...</>
            ) : (
              <><svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg> WhatsApp Bağla</>
            )}
          </button>

          <p className="text-xs text-gray-400 mt-3">Facebook hesabınız üzerinden güvenli bağlantı</p>
        </div>

        {/* Manuel ekleme (gelişmiş) */}
        <div className="mt-4">
          <button onClick={() => setShowManual(!showManual)} className="text-xs text-gray-400 hover:text-gray-600 transition">
            {showManual ? 'Kapat' : 'Gelişmiş: Manuel API bilgisi ile ekle →'}
          </button>

          {showManual && (
            <form onSubmit={handleManualAdd} className="mt-3 border border-gray-200 rounded-xl p-4 space-y-3">
              <p className="text-xs text-gray-500">Meta Business Suite → WhatsApp → API Setup sayfasından bilgilerinizi alın.</p>
              <div className="grid md:grid-cols-2 gap-3">
                <input type="text" placeholder="Phone Number ID *" value={form.phone_number_id} onChange={update('phone_number_id')}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none" required />
                <input type="text" placeholder="Business Account ID" value={form.business_account_id} onChange={update('business_account_id')}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none" />
              </div>
              <input type="password" placeholder="Access Token *" value={form.access_token} onChange={update('access_token')}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none" required />
              <div className="flex gap-3">
                <button type="submit" disabled={adding} className="bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">
                  {adding ? 'Doğrulanıyor...' : 'Kaydet'}
                </button>
                <button type="button" onClick={() => setShowManual(false)} className="text-gray-500 px-5 py-2 rounded-xl text-sm hover:bg-gray-100 transition">İptal</button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* Telegram (yakında) */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 opacity-60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Bot className="w-5 h-5 text-gray-400" strokeWidth={1.5} />
            <div>
              <h3 className="font-bold text-gray-900">Telegram Bot</h3>
              <p className="text-xs text-gray-500 mt-0.5">Telegram bot entegrasyonu</p>
            </div>
          </div>
          <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-xs font-medium">Yakında</span>
        </div>
      </div>
    </div>
  );
}
