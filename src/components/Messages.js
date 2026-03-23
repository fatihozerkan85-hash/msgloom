'use client';

import { useState, useEffect } from 'react';

export default function Messages() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/messages')
      .then(res => res.json())
      .then(data => { setMessages(data.messages || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Mesajlar</h2>
        <p className="text-gray-500 text-sm mt-1">Gelen ve giden tüm mesajlarınız</p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="text-5xl mb-4">💬</div>
          <h3 className="font-bold text-gray-900 mb-2">Henüz mesaj yok</h3>
          <p className="text-gray-500 text-sm">İlk mesajınızı gönderin veya müşterilerinizden mesaj bekleyin.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Yön</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Telefon</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Mesaj</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {messages.map((msg) => (
                <tr key={msg.id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium ${
                      msg.direction === 'incoming' ? 'bg-green-50 text-green-700' : 'bg-blue-50 text-blue-700'
                    }`}>
                      {msg.direction === 'incoming' ? '📥 Gelen' : '📤 Giden'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">{msg.phone}</td>
                  <td className="px-6 py-4 text-sm text-gray-600 max-w-xs truncate">{msg.text_body || msg.template_name || '-'}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{new Date(msg.created_at).toLocaleString('tr-TR')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
