'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import Dashboard from '@/components/Dashboard';
import Messages from '@/components/Messages';
import SendMessage from '@/components/SendMessage';
import Contacts from '@/components/Contacts';
import Settings from '@/components/Settings';
import Automations from '@/components/Automations';
import Broadcast from '@/components/Broadcast';
import CRM from '@/components/CRM';
import Products from '@/components/Products';

export default function DashboardPage() {
  const [activePage, setActivePage] = useState('dashboard');
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user) { setUser(data.user); setLoading(false); }
        else router.push('/login');
      })
      .catch(() => router.push('/login'));
  }, [router]);

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p>Yükleniyor...</p></div>;

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'messages': return <Messages />;
      case 'send': return <SendMessage />;
      case 'contacts': return <Contacts />;
      case 'crm': return <CRM />;
      case 'products': return <Products />;
      case 'automations': return <Automations />;
      case 'broadcast': return <Broadcast />;
      case 'settings': return <Settings user={user} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen">
      <Sidebar activePage={activePage} setActivePage={setActivePage} user={user} onLogout={handleLogout} />
      <main className="flex-1 overflow-y-auto p-6">
        {renderPage()}
      </main>
    </div>
  );
}
