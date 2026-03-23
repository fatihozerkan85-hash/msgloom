'use client';

import { useState, useEffect } from 'react';

export default function Settings({ user }) {
  const [accounts, setAccounts] = useState([]);
  const [form, setForm] = useState({ phone_number_id: '', business_account_id: '', access_token: '', phone_number: '' });
  const [status, setStatus] = useState(null);

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
      setStatus({ type: 'success', text: 'WhatsApp hesabı eklendi' });
    } else {
      setStatus({ type: 'error', text: data.error });
    }
  };

  const update = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Ayarlar</h2>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="font-bold text-lg mb-4">Hesap Bilgileri</h3>
        <p className="text-sm text-gray-600">Email: {user?.email}</p>
        <p className="text-sm text-gray-600">Plan: {user?.plan}</p>
        <p className="text-sm text-gray-600">Şirket: {user?.company || '-'}</p>
      </div>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="font-bold text-lg mb-4">WhatsApp Hesapları</h3>
        {accounts.length > 0 ? (
          <div className="space-y-2 mb-4">
            {accounts.map(acc => (
              <div key={acc.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div>
                  <p className="text-sm font-medium">{acc.phone_number || acc.phone_number_id}</p>
                  <p className="text-xs text-gray-500">ID: {acc.phone_number_id}</p>
                </div>
                <span className={`text-xs px-2 py-1 rounded ${acc.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {acc.is_active ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-sm mb-4">Henüz WhatsApp hesabı eklenmemiş.</p>
        )}

        <h4 className="font-medium text-sm mb-3">Yeni WhatsApp Hesabı Ekle</h4>
        <form onSubmit={handleAdd} className="space-y-3">
          <input type="text" placeholder="Phone Number ID" value={form.phone_number_id} onChange={update('phone_number_id')}
            className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none" required />
          <input type="text" placeholder="Business Account ID" value={form.business_account_id} onChange={update('business_account_id')}
            className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none" />
          <input type="text" placeholder="Access Token" value={form.access_token} onChange={update('access_token')}
            className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none" required />
          <input type="text" placeholder="Telefon Numarası (opsiyonel)" value={form.phone_number} onChange={update('phone_number')}
            className="w-full border rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-green-500 focus:outline-none" />
          <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded-lg text-sm hover:bg-green-700">Ekle</button>
          {status && <p className={`text-sm ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{status.text}</p>}
        </form>
      </div>
    </div>
  );
}
