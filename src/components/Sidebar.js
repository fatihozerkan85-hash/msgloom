'use client';

import { LayoutDashboard, MessageSquare, Send, Users, Settings, LogOut, FileText, Zap } from 'lucide-react';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { id: 'messages', label: 'Mesajlar', Icon: MessageSquare },
  { id: 'send', label: 'Mesaj Gönder', Icon: Send },
  { id: 'contacts', label: 'Kişiler', Icon: Users },
  { id: 'automations', label: 'Otomasyonlar', Icon: Zap },
  { id: 'content', label: 'İçerik Yönetimi', Icon: FileText },
  { id: 'settings', label: 'Ayarlar', Icon: Settings },
];

export default function Sidebar({ activePage, setActivePage, user, onLogout }) {
  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
          <h1 className="text-xl font-bold text-blue-600">MsgLoom</h1>
        </div>
      </div>

      <div className="px-4 py-4 border-b border-gray-100">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-sm font-medium text-gray-900 truncate">{user?.name || user?.email}</p>
          <p className="text-xs text-gray-500 truncate">{user?.company || user?.email}</p>
          <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-blue-100 text-blue-700 text-xs font-medium rounded-full capitalize">{user?.plan || 'free'}</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${
              activePage === item.id
                ? 'bg-blue-50 text-blue-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <item.Icon className="w-5 h-5" strokeWidth={1.5} />
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition">
          <LogOut className="w-5 h-5" strokeWidth={1.5} />
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}
