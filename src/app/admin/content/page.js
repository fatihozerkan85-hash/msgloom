'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ContentManager from '@/components/ContentManager';
import { MessageSquare, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function AdminContentPage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => {
        if (data.user && data.user.is_admin) {
          setUser(data.user);
          setLoading(false);
        } else if (data.user) {
          router.push('/dashboard');
        } else {
          router.push('/login');
        }
      })
      .catch(() => router.push('/login'));
  }, [router]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white border-b border-gray-100 px-6 py-4">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard" className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition text-sm">
              <ArrowLeft className="w-4 h-4" strokeWidth={1.5} /> Dashboard
            </Link>
            <div className="h-5 w-px bg-gray-200" />
            <div className="flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
              <span className="font-bold text-gray-900">MsgLoom</span>
              <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Admin</span>
            </div>
          </div>
          <p className="text-sm text-gray-500">{user?.email}</p>
        </div>
      </nav>
      <main className="max-w-5xl mx-auto px-6 py-8">
        <ContentManager />
      </main>
    </div>
  );
}
