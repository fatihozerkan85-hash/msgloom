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
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col">
      <div className="p-6 border-b border-gray-100">
        <h1 className="text-xl font-bold text-green-600">MsgLoom</h1>
      </div>

      <div className="px-4 py-4 border-b border-gray-100">
        <div className="bg-gray-50 rounded-xl p-3">
          <p className="text-sm font-medium text-gray-900 truncate">{user?.name || user?.email}</p>
          <p className="text-xs text-gray-500 truncate">{user?.company || user?.email}</p>
          <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-green-100 text-green-700 text-xs font-medium rounded-full capitalize">{user?.plan || 'free'}</span>
        </div>
      </div>

      <nav className="flex-1 p-3 space-y-0.5">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActivePage(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm font-medium transition-all ${
              activePage === item.id
                ? 'bg-green-50 text-green-700'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>

      <div className="p-3 border-t border-gray-100">
        <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left text-sm text-gray-500 hover:bg-red-50 hover:text-red-600 transition">
          <span className="text-lg">🚪</span>
          <span>Çıkış Yap</span>
        </button>
      </div>
    </aside>
  );
}
