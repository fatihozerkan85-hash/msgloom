'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Smartphone, Plus, Bot } from 'lucide-react';

export default function Settings({ user }) {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ phone_number_id: '', business_account_id: '', access_token: '', phone_number: '' });
  const [status, setStatus] = useState(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetch('/api/account/whatsapp')
      .then(res => res.json())
      .then(data => setAccounts(data.accounts || []))
      .catch(() => {});
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    setStatus(null);
    const res = await fetch('/api/account/whatsapp', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (data.success) {
      setAccounts([...accounts, data.account]);
      setForm({ phone_number_id: '', business_account_id: '', access_token: '', phone_number: '' });
      setShowForm(false);
      setStatus({ type: 'success', text: 'WhatsApp hesabı başarıyla eklendi' });
    } else {
      setStatus({ type: 'error', text: data.error });
    }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Ayarlar</h2>
        <p className="text-gray-500 text-sm mt-1">Hesap ve entegrasyon ayarlarınız</p>
      </div>

      {status && (
        <div className={`mb-6 p-4 rounded-xl text-sm ${status.type === 'success' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
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

      {/* WhatsApp Hesapları */}
      <div className="bg-white rounded-2xl border border-gray-100 p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-bold text-gray-900">WhatsApp Hesapları</h3>
            <p className="text-xs text-gray-500 mt-0.5">WhatsApp Business API hesaplarınızı yönetin</p>
          </div>
          <button onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition flex items-center gap-1.5">
            <Plus className="w-4 h-4" strokeWidth={1.5} /> Hesap Ekle
          </button>
        </div>

        {accounts.length > 0 ? (
          <div className="space-y-3 mb-4">
            {accounts.map(acc => (
              <div key={acc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-700">
                    <MessageSquare className="w-4 h-4" strokeWidth={1.5} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{acc.phone_number || acc.phone_number_id}</p>
                    <p className="text-xs text-gray-500">ID: {acc.phone_number_id}</p>
                  </div>
                </div>
                <span className={`text-xs px-3 py-1 rounded-full font-medium ${acc.is_active ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                  {acc.is_active ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-xl p-8 text-center mb-4">
            <Smartphone className="w-10 h-10 text-gray-300 mx-auto mb-2" strokeWidth={1.5} />
            <p className="text-gray-500 text-sm">Henüz WhatsApp hesabı eklenmemiş</p>
          </div>
        )}

        {showForm && (
          <form onSubmit={handleAdd} className="border-t border-gray-100 pt-4 space-y-3">
            <div className="grid md:grid-cols-2 gap-3">
              <input type="text" placeholder="Phone Number ID *" value={form.phone_number_id} onChange={update('phone_number_id')}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none" required />
              <input type="text" placeholder="Business Account ID" value={form.business_account_id} onChange={update('business_account_id')}
                className="border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none" />
            </div>
            <input type="text" placeholder="Access Token *" value={form.access_token} onChange={update('access_token')}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none" required />
            <input type="text" placeholder="Telefon Numarası (opsiyonel)" value={form.phone_number} onChange={update('phone_number')}
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none" />
            <div className="flex gap-3">
              <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition">Kaydet</button>
              <button type="button" onClick={() => setShowForm(false)} className="text-gray-500 px-6 py-2.5 rounded-xl text-sm hover:bg-gray-100 transition">İptal</button>
            </div>
          </form>
        )}
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
