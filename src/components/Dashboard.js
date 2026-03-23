'use client';

import { useState, useEffect } from 'react';

export default function Dashboard() {
  const [stats, setStats] = useState({ total: 0, incoming: 0, outgoing: 0, contacts: 0 });

  useEffect(() => {
    fetch('/api/stats')
      .then(res => res.json())
      .then(data => setStats(data))
      .catch(() => {});
  }, []);

  const cards = [
    { label: 'Toplam Mesaj', value: stats.total, color: 'bg-blue-500', icon: '💬' },
    { label: 'Gelen Mesaj', value: stats.incoming, color: 'bg-green-500', icon: '📥' },
    { label: 'Giden Mesaj', value: stats.outgoing, color: 'bg-purple-500', icon: '📤' },
    { label: 'Kişi Sayısı', value: stats.contacts, color: 'bg-orange-500', icon: '👥' },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <div key={card.label} className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">{card.label}</p>
                <p className="text-3xl font-bold mt-1">{card.value}</p>
              </div>
              <div className={`${card.color} text-white rounded-lg p-3 text-2xl`}>
                {card.icon}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
