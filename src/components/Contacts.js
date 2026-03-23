'use client';

import { useState, useEffect } from 'react';

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/contacts')
      .then(res => res.json())
      .then(data => { setContacts(data.contacts || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  if (loading) return <p className="text-gray-500">Yükleniyor...</p>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Kişiler</h2>
      {contacts.length === 0 ? (
        <p className="text-gray-500">Henüz kişi yok. Mesaj alındığında otomatik eklenecek.</p>
      ) : (
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Telefon</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Toplam Mesaj</th>
                <th className="px-4 py-3 text-sm font-medium text-gray-600">Son Mesaj</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {contacts.map((contact) => (
                <tr key={contact.phone} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-sm font-medium">{contact.phone}</td>
                  <td className="px-4 py-3 text-sm">{contact.message_count}</td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {new Date(contact.last_message).toLocaleString('tr-TR')}
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
