'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, LogOut, ExternalLink, FileText, Save, RefreshCw, ChevronDown, ChevronRight, Loader2 } from 'lucide-react';
import { useContent, t } from '@/lib/useContent';

const sectionLabels = {
  navbar: 'Navigasyon', hero: 'Ana Sayfa - Hero', features: 'Özellikler', demo: 'Canlı Demo',
  sales: 'Satış Dönüşümü', why: 'Neden MsgLoom', stats: 'İstatistikler',
  setup: 'Kurulum Adımları', guarantee: 'Garanti', cta: 'CTA (Aksiyon Çağrısı)', footer: 'Footer',
};

const keyLabels = {
  title: 'Başlık', subtitle: 'Alt Başlık', description: 'Açıklama',
  cta_primary: 'Ana Buton', cta_secondary: 'İkinci Buton',
  card1_title: 'Kart 1 Başlık', card1_desc: 'Kart 1 Açıklama',
  card2_title: 'Kart 2 Başlık', card2_desc: 'Kart 2 Açıklama',
  card3_title: 'Kart 3 Başlık', card3_desc: 'Kart 3 Açıklama',
  stat1_value: 'İstatistik 1 Değer', stat1_label: 'İstatistik 1 Etiket',
  stat2_value: 'İstatistik 2 Değer', stat2_label: 'İstatistik 2 Etiket',
  stat3_value: 'İstatistik 3 Değer', stat3_label: 'İstatistik 3 Etiket',
  stat4_value: 'İstatistik 4 Değer', stat4_label: 'İstatistik 4 Etiket',
  brand: 'Marka Adı', link1: 'Link 1', link2: 'Link 2', link3: 'Link 3',
  login: 'Giriş Butonu', register: 'Kayıt Butonu', badge: 'Rozet',
  title_highlight: 'Vurgulu Başlık',
  stat1_sub: 'İstatistik 1 Alt', stat2_sub: 'İstatistik 2 Alt', stat3_sub: 'İstatistik 3 Alt',
  step1_title: 'Adım 1 Başlık', step1_desc: 'Adım 1 Açıklama',
  step2_title: 'Adım 2 Başlık', step2_desc: 'Adım 2 Açıklama',
  step3_title: 'Adım 3 Başlık', step3_desc: 'Adım 3 Açıklama',
  timer: 'Zamanlayıcı', timer_bold: 'Zamanlayıcı Kalın',
  item1: 'Madde 1', item2: 'Madde 2', item3: 'Madde 3', item4: 'Madde 4',
  trust_title: 'Güven Başlık', trust_sub: 'Güven Alt', trust_desc: 'Güven Açıklama',
};

function isAdminAuthenticated() {
  if (typeof window === 'undefined') return false;
  try {
    const token = localStorage.getItem('admin_token');
    if (!token) return false;
    const data = JSON.parse(atob(token));
    return data.role === 'admin' && data.exp > Date.now();
  } catch { return false; }
}

export default function AdminContentPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { content: fallbackContent } = useContent();

  const [content, setContent] = useState({});
  const [contentLoading, setContentLoading] = useState(true);
  const [saving, setSaving] = useState(null);
  const [seeding, setSeeding] = useState(false);
  const [openSections, setOpenSections] = useState({});
  const [status, setStatus] = useState(null);
  const [editValues, setEditValues] = useState({});

  useEffect(() => {
    if (isAdminAuthenticated()) {
      setAuthenticated(true);
    } else {
      router.push('/admin/login');
    }
    setLoading(false);
  }, [router]);

  const fetchContent = () => {
    setContentLoading(true);
    fetch('/api/content')
      .then(res => res.json())
      .then(data => {
        const c = data.content || {};
        setContent(c);
        const vals = {};
        for (const [section, keys] of Object.entries(c)) {
          for (const [key, value] of Object.entries(keys)) {
            vals[`${section}.${key}`] = value;
          }
        }
        setEditValues(vals);
        setContentLoading(false);
      })
      .catch(() => setContentLoading(false));
  };

  useEffect(() => { if (authenticated) fetchContent(); }, [authenticated]);

  const handleSave = async (section, key) => {
    const id = `${section}.${key}`;
    setSaving(id);
    setStatus(null);
    try {
      const res = await fetch('/api/content', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'x-admin-key': 'msgloom2026' },
        body: JSON.stringify({ section, key, value: editValues[id] }),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', text: 'Kaydedildi' });
        setContent(prev => ({ ...prev, [section]: { ...prev[section], [key]: editValues[id] } }));
      } else {
        setStatus({ type: 'error', text: data.error });
      }
    } catch {
      setStatus({ type: 'error', text: 'Bağlantı hatası' });
    }
    setSaving(null);
    setTimeout(() => setStatus(null), 3000);
  };

  const handleSeed = async () => {
    setSeeding(true);
    try {
      await fetch('/api/content/seed', { method: 'POST', headers: { 'x-admin-key': 'msgloom2026' } });
      fetchContent();
      setStatus({ type: 'success', text: 'Varsayılan içerikler yüklendi' });
    } catch {
      setStatus({ type: 'error', text: 'Hata oluştu' });
    }
    setSeeding(false);
    setTimeout(() => setStatus(null), 3000);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin/login');
  };

  const toggleSection = (section) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  if (loading || !authenticated) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
    </div>
  );

  const sections = Object.keys(content);

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
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">İçerik Yönetimi</h2>
            <p className="text-gray-500 text-sm mt-1">Landing page metinlerini düzenleyin</p>
          </div>
          <div className="flex gap-3">
            <button onClick={fetchContent}
              className="flex items-center gap-2 px-4 py-2 text-sm text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition">
              <RefreshCw className="w-4 h-4" strokeWidth={1.5} /> Yenile
            </button>
            <button onClick={handleSeed} disabled={seeding}
              className="flex items-center gap-2 px-4 py-2 text-sm text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition disabled:opacity-50">
              {seeding ? <Loader2 className="w-4 h-4 animate-spin" /> : <FileText className="w-4 h-4" strokeWidth={1.5} />}
              Varsayılanları Yükle
            </button>
          </div>
        </div>

        {status && (
          <div className={`mb-6 p-4 rounded-xl text-sm ${status.type === 'success' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
            {status.text}
          </div>
        )}

        {contentLoading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : sections.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
            <h3 className="font-bold text-gray-900 mb-2">Henüz içerik yok</h3>
            <p className="text-gray-500 text-sm mb-4">Varsayılan içerikleri yüklemek için yukarıdaki butona tıklayın.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {sections.map(section => (
              <div key={section} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                <button onClick={() => toggleSection(section)}
                  className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition">
                  <div className="flex items-center gap-3">
                    {openSections[section] ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                    <h3 className="font-semibold text-gray-900 text-sm">{sectionLabels[section] || section}</h3>
                    <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">{Object.keys(content[section]).length} alan</span>
                  </div>
                </button>
                {openSections[section] && (
                  <div className="px-6 pb-5 space-y-4 border-t border-gray-50">
                    {Object.entries(content[section]).map(([key]) => {
                      const id = `${section}.${key}`;
                      const isLong = (editValues[id] || '').length > 80;
                      return (
                        <div key={key} className="pt-4">
                          <label className="block text-xs font-medium text-gray-500 mb-1.5">{keyLabels[key] || key}</label>
                          <div className="flex gap-2">
                            {isLong ? (
                              <textarea value={editValues[id] || ''} onChange={e => setEditValues(p => ({ ...p, [id]: e.target.value }))}
                                rows={3} className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none resize-none" />
                            ) : (
                              <input type="text" value={editValues[id] || ''} onChange={e => setEditValues(p => ({ ...p, [id]: e.target.value }))}
                                className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none" />
                            )}
                            <button onClick={() => handleSave(section, key)} disabled={saving === id}
                              className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition disabled:opacity-50 flex items-center gap-1.5 shrink-0">
                              {saving === id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" strokeWidth={1.5} />}
                              Kaydet
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
