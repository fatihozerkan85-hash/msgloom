'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ContentManager from '@/components/ContentManager';
import { MessageSquare, LogOut, ExternalLink } from 'lucide-react';

export default function AdminContentPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/admin/auth')
      .then(res => res.json())
      .then(data => {
        if (data.authenticated) {
          setAuthenticated(true);
        } else {
          router.push('/admin/login');
        }
        setLoading(false);
      })
      .catch(() => {
        router.push('/admin/login');
        setLoading(false);
      });
  }, [router]);

  const handleLogout = async () => {
    document.cookie = 'admin_token=; Path=/; Max-Age=0';
    router.push('/admin/login');
  };

  if (loading || !authenticated) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
              <span className="font-bold text-gray-900">MsgLoom</span>
            </div>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Admin Panel</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition">
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} /> Siteyi Gör
            </a>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition">
              <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} /> Çıkış
            </button>
          </div>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-6 py-8">
        <ContentManager />
      </main>
    </div>
  );
}
