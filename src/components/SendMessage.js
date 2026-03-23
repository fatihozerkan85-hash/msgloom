'use client';

import { useState } from 'react';

export default function SendMessage() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('text');
  const [template, setTemplate] = useState('hello_world');
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);

    try {
      const body = type === 'template'
        ? { to: phone, type: 'template', template }
        : { to: phone, message };

      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', text: 'Mesaj gönderildi!' });
        setMessage('');
      } else {
        setStatus({ type: 'error', text: data.error?.message || 'Gönderilemedi' });
      }
    } catch {
      setStatus({ type: 'error', text: 'Bağlantı hatası' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Mesaj Gönder</h2>
      <form onSubmit={handleSend} className="bg-white rounded-xl shadow p-6 max-w-lg space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Telefon Numarası</label>
          <input
            type="text"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="905xxxxxxxxx"
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj Tipi</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
          >
            <option value="text">Metin Mesajı</option>
            <option value="template">Template Mesajı</option>
          </select>
        </div>

        {type === 'text' ? (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Mesaj</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={4}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
              placeholder="Mesajınızı yazın..."
              required
            />
          </div>
        ) : (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Template Adı</label>
            <input
              type="text"
              value={template}
              onChange={(e) => setTemplate(e.target.value)}
              className="w-full border rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:outline-none"
            />
          </div>
        )}

        <button
          type="submit"
          disabled={sending}
          className="w-full bg-green-600 text-white py-3 rounded-lg font-medium hover:bg-green-700 disabled:opacity-50 transition-colors"
        >
          {sending ? 'Gönderiliyor...' : 'Gönder'}
        </button>

        {status && (
          <p className={`text-sm ${status.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>
            {status.text}
          </p>
        )}
      </form>
    </div>
  );
}
