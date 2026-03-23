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

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div></div>;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Kişiler</h2>
        <p className="text-gray-500 text-sm mt-1">Mesajlaştığınız tüm kişiler</p>
      </div>

      {contacts.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <div className="text-5xl mb-4">👥</div>
          <h3 className="font-bold text-gray-900 mb-2">Henüz kişi yok</h3>
          <p className="text-gray-500 text-sm">Mesaj gönderdiğinizde veya aldığınızda kişiler otomatik olarak burada görünecek.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {contacts.map((contact) => (
            <div key={contact.phone} className="bg-white rounded-2xl border border-gray-100 p-5 hover:shadow-md transition">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-700 font-bold text-lg">
                  {contact.phone.slice(-2)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{contact.phone}</p>
                  <p className="text-xs text-gray-500">{contact.message_count} mesaj</p>
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-gray-50">
                <p className="text-xs text-gray-400">Son mesaj: {new Date(contact.last_message).toLocaleString('tr-TR')}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
