'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MessageSquare, LogOut, ExternalLink, Save, ChevronDown, ChevronRight, Check, RotateCcw, Download, Upload, Loader2, Github } from 'lucide-react';
import { getDefaults } from '@/lib/useContent';

const GITHUB_REPO = 'fatihozerkan85-hash/msgloom';
const GITHUB_FILE = 'public/content.json';
const GITHUB_BRANCH = 'main';

const sectionLabels = {
  navbar: 'Navigasyon', hero: 'Ana Sayfa - Hero', features: 'Özellikler',
  howItWorks: 'Nasıl Çalışır (4 Adım)', demo: 'Canlı Bot Demo',
  sales: 'Satış Dönüşümü', why: 'Neden MsgLoom', stats: 'İstatistikler',
  setup: 'Kurulum Adımları', guarantee: 'Garanti', cta: 'CTA (Aksiyon Çağrısı)',
  footer: 'Footer (Alt Bilgi)',
};

const keyLabels = {
  title: 'Başlık', subtitle: 'Alt Başlık', description: 'Açıklama', brand: 'Marka Adı',
  cta_primary: 'Ana Buton', cta_secondary: 'İkinci Buton', badge: 'Rozet',
  title_highlight: 'Vurgulu Başlık', link1: 'Link 1', link2: 'Link 2', link3: 'Link 3', link4: 'Link 4 (Nasıl Çalışır)',
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
  step1_number: 'Adım 1 Numara', step2_number: 'Adım 2 Numara', step3_number: 'Adım 3 Numara', step4_number: 'Adım 4 Numara',
  step4_title: 'Adım 4 Başlık', step4_desc: 'Adım 4 Açıklama',
  step1_feat1: 'Adım 1 Özellik 1', step1_feat2: 'Adım 1 Özellik 2', step1_feat3: 'Adım 1 Özellik 3',
  step2_feat1: 'Adım 2 Özellik 1', step2_feat2: 'Adım 2 Özellik 2', step2_feat3: 'Adım 2 Özellik 3',
  step3_feat1: 'Adım 3 Özellik 1', step3_feat2: 'Adım 3 Özellik 2', step3_feat3: 'Adım 3 Özellik 3',
  step4_feat1: 'Adım 4 Özellik 1', step4_feat2: 'Adım 4 Özellik 2', step4_feat3: 'Adım 4 Özellik 3',
  cta_title: 'CTA Başlık', cta_desc: 'CTA Açıklama', cta_button: 'CTA Buton', cta_sub: 'CTA Alt Metin',
  timer: 'Zamanlayıcı', timer_bold: 'Zamanlayıcı Kalın',
  item1: 'Madde 1', item2: 'Madde 2', item3: 'Madde 3', item4: 'Madde 4',
  trust_title: 'Güven Başlık', trust_sub: 'Güven Alt', trust_desc: 'Güven Açıklama',
  review_text: 'Yorum Metni', review_author: 'Yorum Yazarı',
  // Demo bölümü
  wa_badge: 'WhatsApp Rozet', wa_title: 'WhatsApp Başlık', wa_desc: 'WhatsApp Açıklama',
  wa_feat_title: 'WhatsApp Özellik Başlık', wa_feat1: 'WA Özellik 1', wa_feat2: 'WA Özellik 2', wa_feat3: 'WA Özellik 3', wa_feat4: 'WA Özellik 4',
  tg_badge: 'Telegram Rozet', tg_title: 'Telegram Başlık', tg_desc: 'Telegram Açıklama',
  tg_feat_title: 'Telegram Özellik Başlık', tg_feat1: 'TG Özellik 1', tg_feat2: 'TG Özellik 2', tg_feat3: 'TG Özellik 3', tg_feat4: 'TG Özellik 4',
  ig_badge: 'Instagram Rozet', ig_title: 'Instagram Başlık', ig_desc: 'Instagram Açıklama',
  ig_feat_title: 'Instagram Özellik Başlık', ig_feat1: 'IG Özellik 1', ig_feat2: 'IG Özellik 2', ig_feat3: 'IG Özellik 3', ig_feat4: 'IG Özellik 4',
  // Footer
  desc: 'Açıklama', col1_title: 'Kolon 1 Başlık', col1_link1: 'Kolon 1 Link 1', col1_link2: 'Kolon 1 Link 2', col1_link3: 'Kolon 1 Link 3',
  col2_title: 'Kolon 2 Başlık', col2_link1: 'Kolon 2 Link 1', col2_link2: 'Kolon 2 Link 2', col2_link3: 'Kolon 2 Link 3',
  col3_title: 'Kolon 3 Başlık', col3_link1: 'Kolon 3 Link 1', col3_link2: 'Kolon 3 Link 2', col3_link3: 'Kolon 3 Link 3',
  copyright: 'Telif Hakkı',
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
  const [publishing, setPublishing] = useState(false);
  const [githubToken, setGithubToken] = useState('');
  const [showTokenInput, setShowTokenInput] = useState(false);
  const [fileSha, setFileSha] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (isAdminAuthenticated()) {
      setAuthenticated(true);
      const savedToken = localStorage.getItem('github_token');
      if (savedToken) setGithubToken(savedToken);
      loadContent();
    } else {
      router.push('/admin/login');
    }
    setLoading(false);
  }, [router]);

  const loadContent = async () => {
    try {
      const res = await fetch('/content.json?v=' + Date.now());
      const data = await res.json();
      setContent(data);
      const vals = {};
      for (const [section, keys] of Object.entries(data)) {
        for (const [key, value] of Object.entries(keys)) {
          vals[`${section}.${key}`] = value;
        }
      }
      setEditValues(vals);
    } catch {
      const defaults = getDefaults();
      setContent(defaults);
      const vals = {};
      for (const [section, keys] of Object.entries(defaults)) {
        for (const [key, value] of Object.entries(keys)) {
          vals[`${section}.${key}`] = value;
        }
      }
      setEditValues(vals);
    }
  };

  const handleFieldSave = (section, key) => {
    const id = `${section}.${key}`;
    const newContent = JSON.parse(JSON.stringify(content));
    if (!newContent[section]) newContent[section] = {};
    newContent[section][key] = editValues[id];
    setContent(newContent);
    setHasChanges(true);
    setStatus({ type: 'success', text: `"${keyLabels[key] || key}" güncellendi. Yayınlamak için "Siteye Yayınla" butonuna basın.` });
    setTimeout(() => setStatus(null), 3000);
  };

  const handlePublish = async () => {
    if (!githubToken) {
      setShowTokenInput(true);
      return;
    }
    setPublishing(true);
    setStatus(null);
    try {
      // Get current file SHA
      const getRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}?ref=${GITHUB_BRANCH}`, {
        headers: { Authorization: `Bearer ${githubToken}`, Accept: 'application/vnd.github.v3+json' },
      });
      let sha = null;
      if (getRes.ok) {
        const fileData = await getRes.json();
        sha = fileData.sha;
      }

      // Update file
      const body = {
        message: 'Update site content from admin panel',
        content: btoa(unescape(encodeURIComponent(JSON.stringify(content, null, 2)))),
        branch: GITHUB_BRANCH,
      };
      if (sha) body.sha = sha;

      const putRes = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/contents/${GITHUB_FILE}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${githubToken}`,
          Accept: 'application/vnd.github.v3+json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });

      if (putRes.ok) {
        setHasChanges(false);
        setStatus({ type: 'success', text: 'İçerikler GitHub\'a yayınlandı. Vercel 1-2 dakika içinde güncelleyecek.' });
        localStorage.setItem('github_token', githubToken);
      } else {
        const err = await putRes.json();
        setStatus({ type: 'error', text: `GitHub hatası: ${err.message}` });
      }
    } catch (err) {
      setStatus({ type: 'error', text: 'Bağlantı hatası: ' + err.message });
    }
    setPublishing(false);
    setTimeout(() => setStatus(null), 5000);
  };

  const handleResetDefaults = () => {
    if (!confirm('Tüm içerikler varsayılana dönecek. Emin misiniz?')) return;
    const defaults = getDefaults();
    setContent(defaults);
    const vals = {};
    for (const [section, keys] of Object.entries(defaults)) {
      for (const [key, value] of Object.entries(keys)) {
        vals[`${section}.${key}`] = value;
      }
    }
    setEditValues(vals);
    setHasChanges(true);
    setStatus({ type: 'success', text: 'Varsayılanlar yüklendi. "Siteye Yayınla" ile kaydedin.' });
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
      <nav className="bg-white border-b border-gray-100 px-6 py-4 sticky top-0 z-50">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <MessageSquare className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
            <span className="font-bold text-gray-900">MsgLoom</span>
            <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full font-medium">Admin</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-600 transition">
              <ExternalLink className="w-3.5 h-3.5" strokeWidth={1.5} /> Site
            </a>
            <button onClick={handleLogout}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-red-600 transition">
              <LogOut className="w-3.5 h-3.5" strokeWidth={1.5} /> Çıkış
            </button>
          </div>
        </div>
      </nav>

      <main className="max-w-5xl mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">İçerik Yönetimi</h2>
            <p className="text-gray-500 text-sm mt-1">Metinleri düzenleyin, sonra "Siteye Yayınla" ile kaydedin</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handleResetDefaults}
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-gray-600 bg-gray-100 rounded-xl hover:bg-gray-200 transition">
              <RotateCcw className="w-3.5 h-3.5" strokeWidth={1.5} /> Varsayılanlar
            </button>
            <button onClick={handlePublish} disabled={publishing}
              className={`flex items-center gap-1.5 px-5 py-2.5 text-sm text-white rounded-xl transition disabled:opacity-50 ${hasChanges ? 'bg-green-600 hover:bg-green-700 animate-pulse' : 'bg-blue-600 hover:bg-blue-700'}`}>
              {publishing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" strokeWidth={1.5} />}
              {publishing ? 'Yayınlanıyor...' : 'Siteye Yayınla'}
            </button>
          </div>
        </div>

        {showTokenInput && !githubToken && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-xl p-5">
            <p className="text-sm text-yellow-800 mb-3">
              İçerikleri siteye yayınlamak için GitHub Personal Access Token gerekli.
              <a href="https://github.com/settings/tokens/new?scopes=repo&description=MsgLoom+Admin" target="_blank" rel="noopener noreferrer"
                className="text-blue-600 underline ml-1">Buradan oluşturun</a> (repo yetkisi seçin).
            </p>
            <div className="flex gap-2">
              <input type="password" value={githubToken} onChange={e => setGithubToken(e.target.value)}
                placeholder="ghp_xxxxxxxxxxxx"
                className="flex-1 border border-yellow-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              <button onClick={() => { localStorage.setItem('github_token', githubToken); setShowTokenInput(false); handlePublish(); }}
                disabled={!githubToken}
                className="px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm hover:bg-blue-700 disabled:opacity-50 transition">
                Kaydet & Yayınla
              </button>
            </div>
          </div>
        )}

        {status && (
          <div className={`mb-6 p-4 rounded-xl text-sm flex items-center gap-2 ${status.type === 'success' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
            {status.type === 'success' && <Check className="w-4 h-4 shrink-0" strokeWidth={2} />}
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
                        <label className="block text-xs font-medium text-gray-500 mb-1.5">{keyLabels[key] || key}</label>
                        <div className="flex gap-2">
                          {isLong ? (
                            <textarea value={val} onChange={e => setEditValues(p => ({ ...p, [id]: e.target.value }))}
                              rows={3} className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none resize-none" />
                          ) : (
                            <input type="text" value={val} onChange={e => setEditValues(p => ({ ...p, [id]: e.target.value }))}
                              className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none" />
                          )}
                          <button onClick={() => handleFieldSave(section, key)}
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
