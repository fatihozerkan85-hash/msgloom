'use client';

import { useState, useEffect, useCallback } from 'react';
import { MessageSquare, Smartphone, Trash2, CheckCircle, XCircle, Send as SendIcon, ChevronDown, ChevronUp, ExternalLink, Copy, Check } from 'lucide-react';

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
  const [showTgGuide, setShowTgGuide] = useState(false);
  const [copiedToken, setCopiedToken] = useState(false);

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
              <p className="text-xs text-gray-500 mt-2">2 dakikada botunuzu bağlayın — teknik bilgi gerekmez</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Adım adım rehber */}
              <button
                type="button"
                onClick={() => setShowTgGuide(!showTgGuide)}
                className="w-full flex items-center justify-between bg-white border border-blue-200 rounded-xl p-4 hover:bg-blue-50 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">📖</span>
                  <div className="text-left">
                    <p className="font-semibold text-blue-900 text-sm">Bot Token Nasıl Alınır?</p>
                    <p className="text-xs text-blue-600">Adım adım görsel rehber — 2 dakikada tamamlayın</p>
                  </div>
                </div>
                {showTgGuide ? <ChevronUp className="w-5 h-5 text-blue-500" /> : <ChevronDown className="w-5 h-5 text-blue-500" />}
              </button>

              {showTgGuide && (
                <div className="bg-white border border-blue-100 rounded-xl overflow-hidden">
                  {/* Adım 1 */}
                  <div className="p-5 border-b border-blue-50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">1</div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-2">Telegram&apos;da @BotFather&apos;ı açın</p>
                        <p className="text-sm text-gray-600 mb-3">Telegram uygulamasında arama çubuğuna <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">@BotFather</span> yazın ve açın.</p>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-gray-200">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">BF</div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">BotFather</p>
                              <p className="text-xs text-gray-400">Telegram resmi bot yöneticisi</p>
                            </div>
                            <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">✓ Doğrulanmış</span>
                          </div>
                          <div className="space-y-2">
                            <div className="bg-white rounded-lg p-2.5 text-xs text-gray-700 border border-gray-100 max-w-[80%]">
                              I can help you create and manage Telegram bots. Choose what you want to do:
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {['/newbot', '/mybots', '/setname', '/setdescription'].map(cmd => (
                                <span key={cmd} className="text-xs bg-blue-50 text-blue-700 px-2.5 py-1 rounded-lg border border-blue-200">{cmd}</span>
                              ))}
                            </div>
                          </div>
                        </div>
                        <a href="https://t.me/BotFather" target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 mt-3 text-xs text-blue-600 hover:text-blue-800 font-medium">
                          <ExternalLink className="w-3.5 h-3.5" /> Doğrudan BotFather&apos;ı aç
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Adım 2 */}
                  <div className="p-5 border-b border-blue-50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">2</div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-2">/newbot komutunu gönderin</p>
                        <p className="text-sm text-gray-600 mb-3">BotFather&apos;a <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded text-blue-700">/newbot</span> yazıp gönderin.</p>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="space-y-2">
                            <div className="bg-blue-100 rounded-lg p-2.5 text-xs text-blue-800 max-w-[60%] ml-auto">/newbot</div>
                            <div className="bg-white rounded-lg p-2.5 text-xs text-gray-700 border border-gray-100 max-w-[80%]">
                              Alright, a new bot. How are we going to call it? Please choose a name for your bot.
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Adım 3 */}
                  <div className="p-5 border-b border-blue-50">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">3</div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-2">Bot adı ve username belirleyin</p>
                        <p className="text-sm text-gray-600 mb-3">Önce botunuza bir isim verin (örn: &quot;Mağazam Bot&quot;), sonra bir username belirleyin. Username <span className="font-mono bg-orange-50 text-orange-700 px-1.5 py-0.5 rounded">bot</span> ile bitmelidir.</p>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="space-y-2">
                            <div className="bg-blue-100 rounded-lg p-2.5 text-xs text-blue-800 max-w-[60%] ml-auto">Mağazam Bot</div>
                            <div className="bg-white rounded-lg p-2.5 text-xs text-gray-700 border border-gray-100 max-w-[80%]">
                              Good. Now let&apos;s choose a username for your bot. It must end in &apos;bot&apos;.
                            </div>
                            <div className="bg-blue-100 rounded-lg p-2.5 text-xs text-blue-800 max-w-[60%] ml-auto">magazam_bot</div>
                          </div>
                        </div>
                        <div className="mt-3 bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-2">
                          <span className="text-base">💡</span>
                          <p className="text-xs text-amber-800">Username benzersiz olmalı ve <span className="font-semibold">bot</span> ile bitmelidir. Örnek: <span className="font-mono">sirketadi_bot</span>, <span className="font-mono">magazambot</span></p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Adım 4 */}
                  <div className="p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">4</div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 mb-2">Token&apos;ı kopyalayın ve aşağıya yapıştırın</p>
                        <p className="text-sm text-gray-600 mb-3">BotFather size bir token verecek. Bu token&apos;ı kopyalayıp aşağıdaki alana yapıştırın.</p>
                        <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                          <div className="space-y-2">
                            <div className="bg-white rounded-lg p-2.5 text-xs text-gray-700 border border-gray-100 max-w-[85%]">
                              Done! Congratulations on your new bot. You will find it at <span className="text-blue-600">t.me/magazam_bot</span>.
                              <br /><br />
                              Use this token to access the HTTP API:
                              <br />
                              <span className="font-mono bg-green-50 text-green-800 px-1.5 py-0.5 rounded border border-green-200 inline-block mt-1">7123456789:AAHxxx...xxxyz</span>
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 bg-green-50 border border-green-200 rounded-lg p-3 flex items-start gap-2">
                          <span className="text-base">✅</span>
                          <p className="text-xs text-green-800">Token&apos;ı kopyalayın ve aşağıdaki alana yapıştırın. Geri kalan her şeyi biz hallederiz — webhook ayarı, mesaj alma ve otomatik yanıtlar otomatik çalışır.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Token giriş formu */}
              <form onSubmit={handleTelegram} className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Bot Token</label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="7123456789:AAHxxx...xxxyz"
                      value={tgToken}
                      onChange={e => setTgToken(e.target.value)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono pr-10"
                      required
                    />
                    {tgToken && (
                      <button
                        type="button"
                        onClick={() => { navigator.clipboard.writeText(tgToken); setCopiedToken(true); setTimeout(() => setCopiedToken(false), 2000); }}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-600 transition"
                        title="Kopyala"
                      >
                        {copiedToken ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
                      </button>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-1">BotFather&apos;dan aldığınız token&apos;ı yapıştırın</p>
                </div>
                <div className="flex gap-2">
                  <button type="submit" disabled={saving} className="bg-[#0088cc] text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-[#0077b5] disabled:opacity-50 transition inline-flex items-center gap-2">
                    {saving ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Bağlanıyor...</> : '🔵 Botu Bağla'}
                  </button>
                  <button type="button" onClick={() => { setShowTgForm(false); setShowTgGuide(false); }} className="text-gray-500 px-4 py-2.5 rounded-xl text-sm hover:bg-gray-100 transition">İptal</button>
                </div>
              </form>
            </div>
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
