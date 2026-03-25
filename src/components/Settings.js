'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Smartphone, Plus, Trash2, CheckCircle, XCircle, Wifi, Send as SendIcon } from 'lucide-react';

const FB_APP_ID = '949647074467565';

export default function Settings({ user }) {
  const [waAccounts, setWaAccounts] = useState([]);
  const [channels, setChannels] = useState([]);
  const [status, setStatus] = useState(null);
  const [connecting, setConnecting] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const [showTgForm, setShowTgForm] = useState(false);
  const [showIgForm, setShowIgForm] = useState(false);
  const [showWaManual, setShowWaManual] = useState(false);
  const [tgToken, setTgToken] = useState('');
  const [igForm, setIgForm] = useState({ page_id: '', access_token: '' });
  const [waForm, setWaForm] = useState({ phone_number_id: '', access_token: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch('/api/account/whatsapp').then(r => r.json()).then(d => setWaAccounts(d.accounts || [])).catch(() => {});
    fetch('/api/account/channels').then(r => r.json()).then(d => setChannels(d.channels || [])).catch(() => {});
  }, []);

  // Facebook SDK
  useEffect(() => {
    if (document.getElementById('facebook-jssdk')) { setSdkReady(true); return; }
    window.fbAsyncInit = function () {
      window.FB.init({ appId: FB_APP_ID, autoLogAppEvents: true, xfbml: false, version: 'v21.0' });
      setSdkReady(true);
    };
    const s = document.createElement('script');
    s.id = 'facebook-jssdk'; s.src = 'https://connect.facebook.net/en_US/sdk.js'; s.async = true; s.defer = true;
    document.body.appendChild(s);
  }, []);

  useEffect(() => {
    const listener = (e) => {
      if (!e.origin.includes('facebook.com')) return;
      try {
        const d = JSON.parse(e.data);
        if (d.type === 'WA_EMBEDDED_SIGNUP' && d.event === 'FINISH') {
          window.__wa_signup_data = { phone_number_id: d.data?.phone_number_id, waba_id: d.data?.waba_id };
        }
      } catch {}
    };
    window.addEventListener('message', listener);
    return () => window.removeEventListener('message', listener);
  }, []);

  const handleEmbeddedSignup = useCallback(() => {
    if (!window.FB) { setStatus({ type: 'error', text: 'Facebook SDK yüklenemedi' }); return; }
    setConnecting(true); setStatus(null);
    window.FB.login(function (r) {
      if (r.authResponse?.code && window.__wa_signup_data) {
        exchangeWaToken(r.authResponse.code, window.__wa_signup_data.waba_id, window.__wa_signup_data.phone_number_id);
      } else { setStatus({ type: 'error', text: 'Bağlantı iptal edildi' }); setConnecting(false); }
    }, { config_id: process.env.NEXT_PUBLIC_WHATSAPP_CONFIG_ID || '', response_type: 'code', override_default_response_type: true, extras: { setup: {}, featureType: '', sessionInfoVersion: 2 } });
  }, []);

  const exchangeWaToken = async (code, wabaId, phoneNumberId) => {
    try {
      const r = await fetch('/api/account/whatsapp/exchange-token', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code, waba_id: wabaId, phone_number_id: phoneNumberId }) });
      const d = await r.json();
      if (d.success) { setWaAccounts(p => { const e = p.find(a => a.id === d.account.id); return e ? p.map(a => a.id === d.account.id ? d.account : a) : [d.account, ...p]; }); setStatus({ type: 'success', text: 'WhatsApp bağlandı' }); }
      else setStatus({ type: 'error', text: d.error });
    } catch { setStatus({ type: 'error', text: 'Bağlantı hatası' }); }
    setConnecting(false); window.__wa_signup_data = null;
  };

  const handleWaManual = async (e) => {
    e.preventDefault(); setSaving(true); setStatus(null);
    const r = await fetch('/api/account/whatsapp', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(waForm) });
    const d = await r.json();
    if (d.success) { setWaAccounts([d.account, ...waAccounts]); setWaForm({ phone_number_id: '', access_token: '' }); setShowWaManual(false); setStatus({ type: 'success', text: 'WhatsApp eklendi' }); }
    else setStatus({ type: 'error', text: d.error });
    setSaving(false);
  };

  const handleTelegram = async (e) => {
    e.preventDefault(); setSaving(true); setStatus(null);
    const r = await fetch('/api/account/channels', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ platform: 'telegram', token: tgToken }) });
    const d = await r.json();
    if (d.success) { setChannels([d.channel, ...channels]); setTgToken(''); setShowTgForm(false); setStatus({ type: 'success', text: `Telegram bağlandı: @${d.channel.display_name}` }); }
    else setStatus({ type: 'error', text: d.error });
    setSaving(false);
  };

  const handleInstagram = async (e) => {
    e.preventDefault(); setSaving(true); setStatus(null);
    const r = await fetch('/api/account/channels', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ platform: 'instagram', ...igForm }) });
    const d = await r.json();
    if (d.success) { setChannels([d.channel, ...channels]); setIgForm({ page_id: '', access_token: '' }); setShowIgForm(false); setStatus({ type: 'success', text: 'Instagram bağlandı' }); }
    else setStatus({ type: 'error', text: d.error });
    setSaving(false);
  };

  const deleteWa = async (id) => { if (!confirm('Silmek istediğinize emin misiniz?')) return; const r = await fetch('/api/account/whatsapp', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); if ((await r.json()).success) setWaAccounts(waAccounts.filter(a => a.id !== id)); };
  const deleteChannel = async (id) => { if (!confirm('Silmek istediğinize emin misiniz?')) return; const r = await fetch('/api/account/channels', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) }); if ((await r.json()).success) setChannels(channels.filter(c => c.id !== id)); };

  const tgChannels = channels.filter(c => c.platform === 'telegram');
  const igChannels = channels.filter(c => c.platform === 'instagram');

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Ayarlar</h2>
        <p className="text-gray-500 text-sm mt-1">Hesap ve kanal entegrasyonları</p>
      </div>

      {status && (
        <div className={`mb-6 p-4 rounded-xl text-sm flex items-center gap-2 ${status.type === 'success' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {status.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />} {status.text}
        </div>
      )}

      {/* Hesap Bilgileri */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <h3 className="font-bold text-gray-900 mb-4">Hesap Bilgileri</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {[{ l: 'Email', v: user?.email }, { l: 'Ad Soyad', v: user?.name || '-' }, { l: 'Şirket', v: user?.company || '-' }].map(i => (
            <div key={i.l} className="bg-gray-50 rounded-xl p-4"><p className="text-xs text-gray-500 mb-1">{i.l}</p><p className="text-sm font-medium text-gray-900">{i.v}</p></div>
          ))}
          <div className="bg-gray-50 rounded-xl p-4"><p className="text-xs text-gray-500 mb-1">Plan</p><span className="inline-block px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full capitalize">{user?.plan || 'free'}</span></div>
        </div>
      </div>

      {/* ===== WHATSAPP ===== */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center"><MessageSquare className="w-4 h-4 text-green-600" /></div>
          <div><h3 className="font-bold text-gray-900">WhatsApp</h3><p className="text-xs text-gray-500">WhatsApp Business API</p></div>
        </div>

        {waAccounts.map(a => (
          <div key={a.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-3">
            <div><p className="text-sm font-medium text-gray-900">{a.display_name || a.phone_number || a.phone_number_id}</p><p className="text-xs text-gray-500">ID: {a.phone_number_id}</p></div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium">● Bağlı</span>
              <button onClick={() => deleteWa(a.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}

        <div className="bg-green-50 border border-green-200 rounded-xl p-5 text-center">
          <button onClick={handleEmbeddedSignup} disabled={connecting || !sdkReady}
            className="bg-[#25D366] hover:bg-[#20bd5a] text-white px-6 py-3 rounded-xl font-semibold transition shadow-lg shadow-green-200 disabled:opacity-50 inline-flex items-center gap-2">
            {connecting ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Bağlanıyor...</> : '🟢 WhatsApp Bağla'}
          </button>
          <p className="text-xs text-gray-500 mt-2">Facebook ile giriş yaparak bağlayın</p>
        </div>

        <button onClick={() => setShowWaManual(!showWaManual)} className="text-xs text-gray-400 hover:text-gray-600 mt-3 block">{showWaManual ? 'Kapat' : 'Manuel ekle →'}</button>
        {showWaManual && (
          <form onSubmit={handleWaManual} className="mt-2 border border-gray-200 rounded-xl p-4 space-y-2">
            <input type="text" placeholder="Phone Number ID *" value={waForm.phone_number_id} onChange={e => setWaForm({ ...waForm, phone_number_id: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
            <input type="password" placeholder="Access Token *" value={waForm.access_token} onChange={e => setWaForm({ ...waForm, access_token: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
            <button type="submit" disabled={saving} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50">{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
          </form>
        )}
      </div>

      {/* ===== TELEGRAM ===== */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center"><SendIcon className="w-4 h-4 text-blue-600" /></div>
          <div><h3 className="font-bold text-gray-900">Telegram</h3><p className="text-xs text-gray-500">Telegram Bot API</p></div>
        </div>

        {tgChannels.map(c => (
          <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-3">
            <div><p className="text-sm font-medium text-gray-900">{c.display_name}</p><p className="text-xs text-gray-500">ID: {c.platform_id}</p></div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">● Bağlı</span>
              <button onClick={() => deleteChannel(c.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}

        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5">
          {!showTgForm ? (
            <div className="text-center">
              <button onClick={() => setShowTgForm(true)} className="bg-[#0088cc] hover:bg-[#0077b5] text-white px-6 py-3 rounded-xl font-semibold transition inline-flex items-center gap-2">
                🔵 Telegram Bot Bağla
              </button>
              <p className="text-xs text-gray-500 mt-2">@BotFather'dan aldığınız bot token'ı girin</p>
            </div>
          ) : (
            <form onSubmit={handleTelegram} className="space-y-3">
              <div className="bg-white border border-blue-100 rounded-lg p-3 text-xs text-blue-700">
                <p className="font-medium mb-1">Bot token nasıl alınır?</p>
                <p>1. Telegram'da @BotFather'a gidin → 2. /newbot yazın → 3. Bot adı ve username belirleyin → 4. Verilen token'ı buraya yapıştırın</p>
              </div>
              <input type="text" placeholder="123456789:ABCdefGHIjklMNOpqrsTUVwxyz" value={tgToken} onChange={e => setTgToken(e.target.value)}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono" required />
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="bg-[#0088cc] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#0077b5] disabled:opacity-50">{saving ? 'Bağlanıyor...' : 'Bağla'}</button>
                <button type="button" onClick={() => setShowTgForm(false)} className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-100">İptal</button>
              </div>
            </form>
          )}
        </div>
      </div>

      {/* ===== INSTAGRAM ===== */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 bg-gradient-to-br from-pink-100 to-purple-100 rounded-lg flex items-center justify-center"><Smartphone className="w-4 h-4 text-pink-600" /></div>
          <div><h3 className="font-bold text-gray-900">Instagram</h3><p className="text-xs text-gray-500">Instagram Messaging API</p></div>
        </div>

        {igChannels.map(c => (
          <div key={c.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl mb-3">
            <div><p className="text-sm font-medium text-gray-900">{c.display_name}</p><p className="text-xs text-gray-500">ID: {c.platform_id}</p></div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2 py-1 rounded-full bg-pink-100 text-pink-700 font-medium">● Bağlı</span>
              <button onClick={() => deleteChannel(c.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg transition"><Trash2 className="w-4 h-4" /></button>
            </div>
          </div>
        ))}

        <div className="bg-gradient-to-r from-pink-50 to-purple-50 border border-pink-200 rounded-xl p-5">
          {!showIgForm ? (
            <div className="text-center">
              <button onClick={() => setShowIgForm(true)} className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition inline-flex items-center gap-2">
                📸 Instagram Bağla
              </button>
              <p className="text-xs text-gray-500 mt-2">Instagram Business hesabınızı bağlayın</p>
            </div>
          ) : (
            <form onSubmit={handleInstagram} className="space-y-3">
              <div className="bg-white border border-pink-100 rounded-lg p-3 text-xs text-pink-700">
                <p className="font-medium mb-1">Instagram API bilgileri</p>
                <p>Meta Business Suite → Instagram → API Setup'tan Page ID ve Access Token alın. Instagram hesabınız bir Facebook sayfasına bağlı olmalıdır.</p>
              </div>
              <input type="text" placeholder="Instagram Page ID *" value={igForm.page_id} onChange={e => setIgForm({ ...igForm, page_id: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none" required />
              <input type="password" placeholder="Access Token *" value={igForm.access_token} onChange={e => setIgForm({ ...igForm, access_token: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm focus:ring-2 focus:ring-pink-500 focus:outline-none" required />
              <div className="flex gap-2">
                <button type="submit" disabled={saving} className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-5 py-2 rounded-lg text-sm font-medium disabled:opacity-50">{saving ? 'Bağlanıyor...' : 'Bağla'}</button>
                <button type="button" onClick={() => setShowIgForm(false)} className="text-gray-500 px-4 py-2 rounded-lg text-sm hover:bg-gray-100">İptal</button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
