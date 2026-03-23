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

  if (loading) return <p className="text-gray-500">Yükleniyor...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Mesajlar</h2>
      {messages.length === 0 ? (
        <p className="text-gray-500">Henüz mesaj yok.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Yön</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Telefon</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Mesaj</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Tarih</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {messages.map((msg) => (
                <tr key={msg.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-1 rounded text-xs font-medium ${
                      msg.direction === 'incoming' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {msg.direction === 'incoming' ? 'Gelen' : 'Giden'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm">{msg.phone}</td>
                  <td className="px-4 py-3 text-sm">{msg.text_body || msg.template_name || '-'}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(msg.created_at).toLocaleString('tr-TR')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
