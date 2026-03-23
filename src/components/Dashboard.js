'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Inbox, Send, Users, Link, Zap, BookOpen } from 'lucide-react';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, incoming: 0, outgoing: 0, contacts: 0 });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {});
  }, []);

  const cards = [
    { label: 'Toplam Mesaj', value: stats.total, change: '+12%', color: 'from-blue-500 to-blue-600', Icon: MessageSquare },
    { label: 'Gelen Mesaj', value: stats.incoming, change: '+8%', color: 'from-sky-500 to-sky-600', Icon: Inbox },
    { label: 'Giden Mesaj', value: stats.outgoing, change: '+15%', color: 'from-indigo-500 to-indigo-600', Icon: Send },
    { label: 'Kişi Sayısı', value: stats.contacts, change: '+5%', color: 'from-orange-500 to-orange-600', Icon: Users },
  ];

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard</h2>
        <p className="text-gray-500 text-sm mt-1">Mesajlaşma aktivitelerinize genel bakış</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition">
            <div className="flex items-center justify-between mb-4">
              <div className={`bg-gradient-to-r ${card.color} text-white rounded-xl p-3`}>
                <card.Icon className="w-5 h-5" strokeWidth={1.5} />
              </div>
              <span className="text-xs font-medium text-blue-600 bg-blue-50 px-2 py-1 rounded-full">{card.change}</span>
            </div>
            <p className="text-3xl font-bold text-gray-900">{card.value}</p>
            <p className="text-sm text-gray-500 mt-1">{card.label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-white rounded-2xl border border-gray-100 p-6">
        <h3 className="font-bold text-gray-900 mb-4">Hızlı Başlangıç</h3>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
            <div className="flex items-center gap-2 mb-1">
              <Link className="w-4 h-4 text-blue-600" strokeWidth={1.5} />
              <p className="font-medium text-blue-800 text-sm">1. WhatsApp Hesabı Bağla</p>
            </div>
            <p className="text-blue-600 text-xs mt-1">Ayarlar sayfasından API bilgilerinizi girin</p>
          </div>
          <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
            <div className="flex items-center gap-2 mb-1">
              <Zap className="w-4 h-4 text-indigo-600" strokeWidth={1.5} />
              <p className="font-medium text-indigo-800 text-sm">2. İlk Mesajınızı Gönderin</p>
            </div>
            <p className="text-indigo-600 text-xs mt-1">Mesaj Gönder sayfasından test edin</p>
          </div>
          <div className="bg-sky-50 rounded-xl p-4 border border-sky-100">
            <div className="flex items-center gap-2 mb-1">
              <BookOpen className="w-4 h-4 text-sky-600" strokeWidth={1.5} />
              <p className="font-medium text-sky-800 text-sm">3. Kişilerinizi Yönetin</p>
            </div>
            <p className="text-sky-600 text-xs mt-1">Gelen mesajlar otomatik kaydedilir</p>
          </div>
        </div>
      </div>
    </div>
  );
}
