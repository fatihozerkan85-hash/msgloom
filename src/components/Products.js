'use client';

import { useState, useEffect } from 'react';
import { Package, Plus, Pencil, Trash2, ToggleLeft, ToggleRight, Settings2, Tag } from 'lucide-react';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', currency: 'TRY', category: '', keywords: '', stock: '' });
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    fetch('/api/products').then(r => r.json()).then(d => {
      setProducts(d.products || []);
      setSettings(d.settings || {});
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const handleSave = async (e) => {
    e.preventDefault(); setSaving(true); setStatus(null);
    const method = editId ? 'PUT' : 'POST';
    const body = editId ? { id: editId, ...form, price: Number(form.price), stock: form.stock ? Number(form.stock) : null } : { ...form, price: Number(form.price), stock: form.stock ? Number(form.stock) : null };
    const r = await fetch('/api/products', { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const d = await r.json();
    if (d.success) {
      if (editId) setProducts(products.map(p => p.id === editId ? d.product : p));
      else setProducts([d.product, ...products]);
      resetForm();
      setStatus({ type: 'success', text: editId ? 'Ürün güncellendi' : 'Ürün eklendi' });
    } else setStatus({ type: 'error', text: d.error });
    setSaving(false);
  };

  const handleDelete = async (id) => {
    if (!confirm('Bu ürünü silmek istediğinize emin misiniz?')) return;
    const r = await fetch('/api/products', { method: 'DELETE', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id }) });
    if ((await r.json()).success) setProducts(products.filter(p => p.id !== id));
  };

  const toggleActive = async (id, current) => {
    const r = await fetch('/api/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, is_active: !current }) });
    const d = await r.json();
    if (d.success) setProducts(products.map(p => p.id === id ? d.product : p));
  };

  const saveSettings = async () => {
    const r = await fetch('/api/products', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ auto_offer: settings.auto_offer, offer_template: settings.offer_template }) });
    const d = await r.json();
    if (d.success) { setSettings(d.settings); setStatus({ type: 'success', text: 'Ayarlar kaydedildi' }); }
  };

  const startEdit = (p) => {
    setEditId(p.id);
    setForm({ name: p.name, description: p.description || '', price: p.price, currency: p.currency || 'TRY', category: p.category || '', keywords: p.keywords || '', stock: p.stock ?? '' });
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({ name: '', description: '', price: '', currency: 'TRY', category: '', keywords: '', stock: '' });
    setEditId(null); setShowForm(false);
  };

  const currencySymbol = (c) => c === 'TRY' ? '₺' : c === 'USD' ? '$' : c === 'EUR' ? '€' : c;

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Ürünler</h2>
          <p className="text-gray-500 text-sm mt-1">{products.length} ürün · Müşteri ürün adını yazınca otomatik teklif gider</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowSettings(!showSettings)} className="border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 flex items-center gap-1.5">
            <Settings2 className="w-4 h-4" /> Teklif Ayarları
          </button>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 flex items-center gap-1.5">
            <Plus className="w-4 h-4" /> Ürün Ekle
          </button>
        </div>
      </div>

      {status && (
        <div className={`mb-6 p-4 rounded-xl text-sm ${status.type === 'success' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>{status.text}</div>
      )}

      {/* Nasıl çalışır */}
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-5 mb-6">
        <div className="flex items-start gap-3">
          <Package className="w-5 h-5 text-green-600 mt-0.5" />
          <div className="text-xs text-green-700 space-y-1">
            <p className="font-bold text-sm text-green-900 mb-1">Otomatik Teklif Sistemi</p>
            <p>• Müşteri ürün adını veya anahtar kelimesini yazarsa → ürün bilgisi + fiyat otomatik gönderilir</p>
            <p>• "fiyat", "fiyat listesi", "ne kadar" gibi genel sorgularda → tüm ürün listesi gönderilir</p>
            <p>• Teklif mesajı şablonunu aşağıdan özelleştirebilirsiniz</p>
          </div>
        </div>
      </div>

      {/* Teklif Ayarları */}
      {showSettings && settings && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">Teklif Mesajı Şablonu</h3>
          <div className="flex items-center gap-3 mb-4">
            <button onClick={() => setSettings({ ...settings, auto_offer: !settings.auto_offer })}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium border-2 transition ${settings.auto_offer ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500'}`}>
              {settings.auto_offer ? <ToggleRight className="w-5 h-5" /> : <ToggleLeft className="w-5 h-5" />}
              Otomatik Teklif {settings.auto_offer ? 'Açık' : 'Kapalı'}
            </button>
          </div>
          <textarea value={settings.offer_template || ''} onChange={e => setSettings({ ...settings, offer_template: e.target.value })}
            rows={6} className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none font-mono" />
          <div className="mt-2 text-xs text-gray-400 space-y-0.5">
            <p>Kullanılabilir değişkenler: {'{product_name}'} {'{product_desc}'} {'{price}'} {'{currency}'} {'{stock_info}'} {'{category}'}</p>
          </div>
          <button onClick={saveSettings} className="mt-3 bg-blue-600 text-white px-5 py-2 rounded-xl text-sm font-medium hover:bg-blue-700">Kaydet</button>
        </div>
      )}

      {/* Ürün Ekleme/Düzenleme */}
      {showForm && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6 mb-6">
          <h3 className="font-bold text-gray-900 mb-4">{editId ? 'Ürünü Düzenle' : 'Yeni Ürün'}</h3>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Ürün Adı *</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="iPhone 15 Pro" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Kategori</label>
                <input type="text" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Elektronik"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Açıklama</label>
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} placeholder="Ürün açıklaması..."
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" />
            </div>
            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Fiyat *</label>
                <input type="number" step="0.01" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} placeholder="1299.99" required
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Para Birimi</label>
                <select value={form.currency} onChange={e => setForm({ ...form, currency: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  <option value="TRY">₺ TRY</option><option value="USD">$ USD</option><option value="EUR">€ EUR</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-gray-600 mb-1">Stok</label>
                <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} placeholder="Opsiyonel"
                  className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-gray-600 mb-1">Anahtar Kelimeler <span className="text-gray-400">(virgülle ayırın)</span></label>
              <input type="text" value={form.keywords} onChange={e => setForm({ ...form, keywords: e.target.value })} placeholder="iphone, telefon, apple, 15 pro"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              <p className="text-xs text-gray-400 mt-1">Müşteri bu kelimelerden birini yazarsa bu ürünün teklifi gönderilir</p>
            </div>
            <div className="flex gap-3">
              <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50">{saving ? 'Kaydediliyor...' : editId ? 'Güncelle' : 'Ekle'}</button>
              <button type="button" onClick={resetForm} className="text-gray-500 px-6 py-2.5 rounded-xl text-sm hover:bg-gray-100">İptal</button>
            </div>
          </form>
        </div>
      )}

      {/* Ürün Listesi */}
      {products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Package className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-bold text-gray-900 mb-2">Henüz ürün eklenmemiş</h3>
          <p className="text-gray-500 text-sm">Ürün ekleyin, müşteri sorduğunda otomatik teklif gitsin.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map(p => (
            <div key={p.id} className={`bg-white rounded-xl border border-gray-100 p-5 ${!p.is_active ? 'opacity-60' : ''}`}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h4 className="font-semibold text-gray-900">{p.name}</h4>
                  {p.category && <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{p.category}</span>}
                </div>
                <div className="flex items-center gap-1">
                  <button onClick={() => toggleActive(p.id, p.is_active)} className="p-1.5 rounded-lg hover:bg-gray-100 transition">
                    {p.is_active ? <ToggleRight className="w-5 h-5 text-green-600" /> : <ToggleLeft className="w-5 h-5 text-gray-400" />}
                  </button>
                  <button onClick={() => startEdit(p)} className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-gray-100 transition"><Pencil className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(p.id)} className="p-1.5 text-gray-400 hover:text-red-500 rounded-lg hover:bg-red-50 transition"><Trash2 className="w-4 h-4" /></button>
                </div>
              </div>
              {p.description && <p className="text-sm text-gray-600 mb-3 line-clamp-2">{p.description}</p>}
              <div className="flex items-center justify-between">
                <span className="text-lg font-bold text-gray-900">{currencySymbol(p.currency)}{Number(p.price).toLocaleString('tr-TR')}</span>
                {p.stock !== null && p.stock !== undefined && (
                  <span className={`text-xs px-2 py-1 rounded-full font-medium ${Number(p.stock) > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {Number(p.stock) > 0 ? `${p.stock} stok` : 'Tükendi'}
                  </span>
                )}
              </div>
              {p.keywords && (
                <div className="flex flex-wrap gap-1 mt-3">
                  {p.keywords.split(',').slice(0, 4).map(k => (
                    <span key={k} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 text-blue-600">{k.trim()}</span>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
