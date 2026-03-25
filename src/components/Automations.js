'use client';

import { useState, useEffect } from 'react';
import { Zap, Plus, Trash2, MessageSquare, UserPlus, HelpCircle, ToggleLeft, ToggleRight, Pencil } from 'lucide-react';

const TYPE_CONFIG = {
  welcome: { label: 'Karşılama Mesajı', desc: 'İlk kez yazan müşteriye otomatik gider', icon: UserPlus, color: 'green' },
  keyword: { label: 'Anahtar Kelime', desc: 'Belirli kelimeler geçtiğinde yanıt verir', icon: MessageSquare, color: 'blue' },
  default: { label: 'Varsayılan Yanıt', desc: 'Hiçbir kural eşleşmezse bu yanıt gider', icon: HelpCircle, color: 'orange' },
};

export default function Automations() {
  const [automations, setAutomations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAdd, setShowAdd] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ type: 'keyword', trigger_text: '', response_text: '' });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch('/api/automations')
      .then(res => res.json())
      .then(data => { setAutomations(data.automations || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    try {
      const res = await fetch('/api/automations', {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editId ? { id: editId, ...form } : form),
      });
      const data = await res.json();
      if (data.success) {
        if (editId) {
          setAutomations(automations.map(a => a.id === editId ? data.automation : a));
        } else {
          setAutomations([data.automation, ...automations.filter(a => !(form.type === 'welcome' && a.type === 'welcome'))]);
        }
        resetForm();
        setStatus({ type: 'success', text: editId ? 'Kural güncellendi' : 'Kural eklendi' });
      } else {
        setStatus({ type: 'error', text: data.error });
      }
    } catch {
      setStatus({ type: 'error', text: 'Bağlantı hatası' });
    }
    setSaving(false);
  };

  const handleToggle = async (id, currentActive) => {
    try {
      const res = await fetch('/api/automations', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, is_active: !currentActive }),
      });
      const data = await res.json();
      if (data.success) {
        setAutomations(automations.map(a => a.id === id ? data.automation : a));
      }
    } catch {}
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu kuralı silmek istediğinize emin misiniz?')) return;
    try {
      const res = await fetch('/api/automations', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if ((await res.json()).success) {
        setAutomations(automations.filter(a => a.id !== id));
      }
    } catch {}
  };

  const startEdit = (a) => {
    setEditId(a.id);
    setForm({ type: a.type, trigger_text: a.trigger_text || '', response_text: a.response_text });
    setShowAdd(true);
  };

  const resetForm = () => {
    setForm({ type: 'keyword', trigger_text: '', response_text: '' });
    setEditId(null);
    setShowAdd(false);
  };

  const hasWelcome = automations.some(a => a.type === 'welcome');
  const hasDefault = automations.some(a => a.type === 'default');

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Otomasyonlar</h2>
          <p className="text-gray-500 text-sm mt-1">Gelen mesajlara otomatik yanıt kuralları</p>
        </div>
        <button onClick={() => { resetForm(); setShowAdd(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition flex items-center gap-1.5">
          <Plus className="w-4 h-4" /> Kural Ekle
        </button>
      </div>

      {status && (
        <div className={`mb-6 p-4 rounded-xl text-sm ${status.type === 'success' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
          {status.text}
        </div>
      )}

      {/* Nasıl çalışır */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 mb-6">
        <div className="flex items-start gap-3">
          <Zap className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-blue-900 text-sm mb-2">Nasıl Çalışır?</h4>
            <div className="text-xs text-blue-700 space-y-1">
              <p>1. Müşteri WhatsApp'tan mesaj yazar</p>
              <p>2. İlk kez yazıyorsa → <span className="font-semibold">Karşılama Mesajı</span> gider</p>
              <p>3. Mesajda anahtar kelime varsa → <span className="font-semibold">Eşleşen yanıt</span> gider</p>
              <p>4. Hiçbir kural eşleşmezse → <span className="font-semibold">Varsayılan Yanıt</span> gider</p>
            </div>
          </div>
        </div>
      </div>

      {/* Kural ekleme/düzenleme formu */}
      {showAdd && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">{editId ? 'Kuralı Düzenle' : 'Yeni Kural Ekle'}</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Kural Tipi</label>
              <div className="grid grid-cols-3 gap-3">
                {Object.entries(TYPE_CONFIG).map(([key, cfg]) => {
                  const disabled = !editId && ((key === 'welcome' && hasWelcome) || (key === 'default' && hasDefault));
                  return (
                    <button key={key} type="button" disabled={disabled}
                      onClick={() => setForm({ ...form, type: key, trigger_text: key !== 'keyword' ? '' : form.trigger_text })}
                      className={`p-3 rounded-xl border-2 text-left transition ${
                        form.type === key ? 'border-blue-500 bg-blue-50' : disabled ? 'border-gray-100 bg-gray-50 opacity-50' : 'border-gray-200 hover:border-gray-300'
                      }`}>
                      <cfg.icon className={`w-4 h-4 mb-1 ${form.type === key ? 'text-blue-600' : 'text-gray-400'}`} strokeWidth={1.5} />
                      <p className="text-sm font-medium text-gray-900">{cfg.label}</p>
                      <p className="text-xs text-gray-500">{cfg.desc}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {form.type === 'keyword' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Anahtar Kelimeler</label>
                <input type="text" value={form.trigger_text} onChange={e => setForm({ ...form, trigger_text: e.target.value })}
                  placeholder="fiyat, ücret, kaç tl (virgülle ayırın)" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none" />
                <p className="text-xs text-gray-400 mt-1">Müşterinin mesajında bu kelimelerden biri geçerse yanıt gönderilir</p>
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Otomatik Yanıt</label>
              <textarea value={form.response_text} onChange={e => setForm({ ...form, response_text: e.target.value })}
                rows={4} placeholder="Müşteriye gönderilecek mesaj..." required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none resize-none" />
            </div>

            <div className="flex gap-3">
              <button type="submit" disabled={saving}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50 transition">
                {saving ? 'Kaydediliyor...' : editId ? 'Güncelle' : 'Kaydet'}
              </button>
              <button type="button" onClick={resetForm} className="text-gray-500 px-6 py-2.5 rounded-xl text-sm hover:bg-gray-100 transition">İptal</button>
            </div>
          </form>
        </div>
      )}

      {/* Mevcut kurallar */}
      {automations.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Zap className="w-12 h-12 text-gray-300 mx-auto mb-4" strokeWidth={1.5} />
          <h3 className="font-bold text-gray-900 mb-2">Henüz otomasyon kuralı yok</h3>
          <p className="text-gray-500 text-sm mb-4">Karşılama mesajı ve anahtar kelime yanıtları ekleyerek başlayın.</p>
          <button onClick={() => { resetForm(); setForm({ type: 'welcome', trigger_text: '', response_text: '' }); setShowAdd(true); }}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition">
            Karşılama Mesajı Ekle
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {automations.map(a => {
            const cfg = TYPE_CONFIG[a.type] || TYPE_CONFIG.keyword;
            return (
              <div key={a.id} className={`bg-white rounded-xl border border-gray-100 p-5 ${!a.is_active ? 'opacity-60' : ''}`}>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                      cfg.color === 'green' ? 'bg-green-100' : cfg.color === 'orange' ? 'bg-orange-100' : 'bg-blue-100'
                    }`}>
                      <cfg.icon className={`w-5 h-5 ${
                        cfg.color === 'green' ? 'text-green-600' : cfg.color === 'orange' ? 'text-orange-600' : 'text-blue-600'
                      }`} strokeWidth={1.5} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                          cfg.color === 'green' ? 'bg-green-100 text-green-700' : cfg.color === 'orange' ? 'bg-orange-100 text-orange-700' : 'bg-blue-100 text-blue-700'
                        }`}>{cfg.label}</span>
                        {a.type === 'keyword' && a.trigger_text && (
                          <span className="text-xs text-gray-500">Kelimeler: <span className="font-medium text-gray-700">{a.trigger_text}</span></span>
                        )}
                      </div>
                      <p className="text-sm text-gray-700 whitespace-pre-line">{a.response_text}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 ml-4 flex-shrink-0">
                    <button onClick={() => handleToggle(a.id, a.is_active)} className="p-2 rounded-lg hover:bg-gray-100 transition" title={a.is_active ? 'Devre dışı bırak' : 'Aktifleştir'}>
                      {a.is_active ? <ToggleRight className="w-5 h-5 text-green-600" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                    </button>
                    <button onClick={() => startEdit(a)} className="p-2 rounded-lg hover:bg-gray-100 transition text-gray-400 hover:text-blue-600" title="Düzenle">
                      <Pencil className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                    <button onClick={() => handleDelete(a.id)} className="p-2 rounded-lg hover:bg-red-50 transition text-gray-400 hover:text-red-500" title="Sil">
                      <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
