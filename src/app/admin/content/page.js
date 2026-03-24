'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, LogOut, ExternalLink, FileText, Save, RefreshCw, ChevronDown, ChevronRight, Loader2, Check, RotateCcw, Download, Upload } from 'lucide-react';
import { getAllContent, getDefaults, saveContent } from '@/lib/useContent';

const sectionLabels = {
  navbar: 'Navigasyon', hero: 'Ana Sayfa - Hero', features: 'Özellikler',
  sales: 'Satış Dönüşümü', why: 'Neden MsgLoom', stats: 'İstatistikler',
  setup: 'Kurulum Adımları', guarantee: 'Garanti', cta: 'CTA (Aksiyon Çağrısı)',
};

const keyLabels = {
  title: 'Başlık', subtitle: 'Alt Başlık', description: 'Açıklama', brand: 'Marka Adı',
  cta_primary: 'Ana Buton', cta_secondary: 'İkinci Buton', badge: 'Rozet',
  title_highlight: 'Vurgulu Başlık', link1: 'Link 1', link2: 'Link 2', link3: 'Link 3',
  login: 'Giriş Butonu', register: 'Kayıt Butonu', cta: 'CTA Butonu',
  card1_title: 'Kart 1 Başlık', card1_desc: 'Kart 1 Açıklama',
  card2_title: 'Kart 2 Başlık', card2_desc: 'Kart 2 Açıklama',
  card3_title: 'Kart 3 Başlık', card3_desc: 'Kart 3 Açıklama',
  stat1_value: 'İstatistik 1 Değer', stat1_label: 'İstatistik 1 Etiket', stat1_sub: 'İstatistik 1 Alt',
  stat2_value: 'İstatistik 2 Değer', stat2_label: 'İstatistik 2 Etiket', stat2_sub: 'İstatistik 2 Alt',
  stat3_value: 'İstatistik 3 Değer', stat3_label: 'İstatistik 3 Etiket', stat3_sub: 'İstatistik 3 Alt',
  stat4_value: 'İstatistik 4 Değer', stat4_label: 'İstatistik 4 Etiket',
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

  const [content, setContent] = useState({});
  const [editValues, setEditValues] = useState({});
  const [openSections, setOpenSections] = useState({});
  const [status, setStatus] = useState(null);

  useEffect(() => {
    if (isAdminAuthenticated()) {
      setAuthenticated(true);
      loadContent();
    } else {
      router.push('/admin/login');
    }
    setLoading(false);
  }, [router]);

  const loadContent = () => {
    const c = getAllContent();
    setContent(c);
    const vals = {};
    for (const [section, keys] of Object.entries(c)) {
      for (const [key, value] of Object.entries(keys)) {
        vals[`${section}.${key}`] = value;
      }
    }
    setEditValues(vals);
  };

  const handleSave = (section, key) => {
    const id = `${section}.${key}`;
    const newContent = { ...content };
    if (!newContent[section]) newContent[section] = {};
    newContent[section][key] = editValues[id];
    setContent(newContent);
    saveContent(newContent);
    setStatus({ type: 'success', text: `"${keyLabels[key] || key}" kaydedildi` });
    setTimeout(() => setStatus(null), 2000);
  };

  const handleResetDefaults = () => {
    if (!confirm('Tüm içerikler varsayılana dönecek. Emin misiniz?')) return;
    const defaults = getDefaults();
    setContent(defaults);
    saveContent(defaults);
    const vals = {};
    for (const [section, keys] of Object.entries(defaults)) {
      for (const [key, value] of Object.entries(keys)) {
        vals[`${section}.${key}`] = value;
      }
    }
    setEditValues(vals);
    setStatus({ type: 'success', text: 'Varsayılan içerikler yüklendi' });
    setTimeout(() => setStatus(null), 3000);
  };

  const handleExport = () => {
    const blob = new Blob([JSON.stringify(content, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `msgloom-content-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = e.target.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        try {
          const imported = JSON.parse(ev.target.result);
          setContent(imported);
          saveContent(imported);
          const vals = {};
          for (const [section, keys] of Object.entries(imported)) {
            for (const [key, value] of Object.entries(keys)) {
              vals[`${section}.${key}`] = value;
            }
          }
          setEditValues(vals);
          setStatus({ type: 'success', text: 'İçerikler başarıyla içe aktarıldı' });
        } catch {
          setStatus({ type: 'error', text: 'Geçersiz JSON dosyası' });
        }
        setTimeout(() => setStatus(null), 3000);
      };
      reader.readAsText(file);
    };
    input.click();
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
      <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
            <span className="font-bold text-gray-900">MsgLoom</span>
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
            <p className="text-gray-500 text-sm mt-1">Sitedeki tüm metinleri buradan düzenleyin</p>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={handleImport}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition">
              <Upload className="w-3.5 h-3.5" strokeWidth={1.5} /> İçe Aktar
            </button>
            <button onClick={handleExport}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition">
              <Download className="w-3.5 h-3.5" strokeWidth={1.5} /> Dışa Aktar
            </button>
            <button onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-white bg-blue-600 rounded-xl hover:bg-blue-700 transition">
              <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} /> Varsayılanları Yükle
            </button>
          </div>
        </div>

        {status && (
          <div className={`mb-6 p-4 rounded-xl text-sm flex items-center gap-2 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
            {status.type === 'success' && <Check className="w-4 h-4" strokeWidth={2} />}
            {status.text}
          </div>
        )}

        <div className="space-y-3">
          {sections.map(section => (
            <div key={section} className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <button onClick={() => toggleSection(section)}
                className="w-full flex items-center justify-between px-6 py-4 hover:bg-gray-50 transition text-left">
                <div className="flex items-center gap-3">
                  {openSections[section] ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronRight className="w-4 h-4 text-gray-400" />}
                  <h3 className="font-semibold text-gray-900 text-sm">{sectionLabels[section] || section}</h3>
                  <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                    {Object.keys(content[section] || {}).length} alan
                  </span>
                </div>
              </button>
              {openSections[section] && (
                <div className="px-6 pb-5 space-y-4 border-t border-gray-50">
                  {Object.entries(content[section] || {}).map(([key]) => {
                    const id = `${section}.${key}`;
                    const val = editValues[id] || '';
                    const isLong = val.length > 80;
                    return (
                      <div key={key} className="pt-4">
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">
                          {keyLabels[key] || key}
                        </label>
                        <div className="flex gap-2">
                          {isLong ? (
                            <textarea value={val}
                              onChange={e => setEditValues(p => ({ ...p, [id]: e.target.value }))}
                              rows={3}
                              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none resize-none" />
                          ) : (
                            <input type="text" value={val}
                              onChange={e => setEditValues(p => ({ ...p, [id]: e.target.value }))}
                              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none" />
                          )}
                          <button onClick={() => handleSave(section, key)}
                            className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 transition flex items-center gap-1.5 shrink-0">
                            <Save className="w-3.5 h-3.5" strokeWidth={1.5} /> Kaydet
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
      </main>
    </div>
  );
}
