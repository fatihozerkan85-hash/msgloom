'use client';

const menuItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊' },
  { id: 'messages', label: 'Mesajlar', icon: '💬' },
  { id: 'send', label: 'Mesaj Gönder', icon: '📤' },
  { id: 'contacts', label: 'Kişiler', icon: '👥' },
  { id: 'settings', label: 'Ayarlar', icon: '⚙️' },
];

export default function Sidebar({ activePage, setActivePage, user, onLogout }) {
  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col">
      <div className="p-6 border-b border-gray-700">
        <h1 className="text-xl font-bold text-green-400">MsgLoom</h1>
        <p className="text-xs text-gray-400 mt-1">{user?.company || user?.name || user?.email}</p>
        <span className="inline-block mt-1 px-2 py-0.5 bg-green-800 text-green-300 text-xs rounded">{user?.plan || 'free'}</span>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
              activePage === item.id ? 'bg-green-600 text-white' : 'text-gray-300 hover:bg-gray-800'
            }`}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-700">
        <button onClick={onLogout} className="w-full text-left text-gray-400 hover:text-red-400 text-sm px-4 py-2">
          🚪 Çıkış Yap
        </button>
      </div>
    </aside>
  );
}
