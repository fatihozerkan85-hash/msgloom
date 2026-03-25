'use client';

import { useState, useEffect } from 'react';
import { Users, Tag, Plus, X, MessageSquare, Send as SendIcon, Smartphone } from 'lucide-react';

const PLATFORM_ICONS = { whatsapp: '🟢', telegram: '🔵', instagram: '📸' };
const TAG_COLORS = ['bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-purple-100 text-purple-700', 'bg-orange-100 text-orange-700', 'bg-pink-100 text-pink-700', 'bg-yellow-100 text-yellow-700'];

export default function Contacts() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTags, setEditingTags] = useState(null);
  const [newTag, setNewTag] = useState('');
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    fetch('/api/contacts').then(r => r.json()).then(d => { setContacts(d.contacts || []); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  const addTag = async (contact) => {
    if (!newTag.trim()) return;
    const tags = [...(contact.tags || []), newTag.trim()];
    const r = await fetch('/api/contacts', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: contact.id, tags }) });
    const d = await r.json();
    if (d.success) { setContacts(contacts.map(c => c.id === contact.id ? d.contact : c)); setNewTag(''); }
  };

  const removeTag = async (contact, tag) => {
    const tags = (contact.tags || []).filter(t => t !== tag);
    const r = await fetch('/api/contacts', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: contact.id, tags }) });
    const d = await r.json();
    if (d.success) setContacts(contacts.map(c => c.id === contact.id ? d.contact : c));
  };

  const filtered = filter === 'all' ? contacts : contacts.filter(c => c.platform === filter);
  const allTags = [...new Set(contacts.flatMap(c => c.tags || []))];

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Kişiler</h2>
          <p className="text-gray-500 text-sm mt-1">{contacts.length} kişi · {allTags.length} etiket</p>
        </div>
      </div>

      {/* Platform filtresi */}
      <div className="flex gap-2 mb-6">
        {[{ k: 'all', l: 'Tümü' }, { k: 'whatsapp', l: '🟢 WhatsApp' }, { k: 'telegram', l: '🔵 Telegram' }, { k: 'instagram', l: '📸 Instagram' }].map(p => (
          <button key={p.k} onClick={() => setFilter(p.k)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${filter === p.k ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>
            {p.l}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <h3 className="font-bold text-gray-900 mb-2">Henüz kişi yok</h3>
          <p className="text-gray-500 text-sm">Müşterileriniz mesaj gönderdiğinde otomatik kaydedilir.</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Platform</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Kişi</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Etiketler</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Mesaj</th>
                <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase">Son Mesaj</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map(c => (
                <tr key={c.id || c.platform_contact_id} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 text-lg">{PLATFORM_ICONS[c.platform] || '💬'}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-gray-900">{c.name || c.phone || c.platform_contact_id}</p>
                    {c.phone && c.phone !== c.platform_contact_id && <p className="text-xs text-gray-500">{c.phone}</p>}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 items-center">
                      {(c.tags || []).map((tag, i) => (
                        <span key={tag} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${TAG_COLORS[i % TAG_COLORS.length]}`}>
                          {tag}
                          {editingTags === c.id && <button onClick={() => removeTag(c, tag)} className="hover:opacity-70"><X className="w-3 h-3" /></button>}
                        </span>
                      ))}
                      {editingTags === c.id ? (
                        <form onSubmit={e => { e.preventDefault(); addTag(c); }} className="inline-flex items-center gap-1">
                          <input type="text" value={newTag} onChange={e => setNewTag(e.target.value)} placeholder="Etiket..." className="w-20 px-2 py-0.5 text-xs border border-gray-200 rounded-full focus:outline-none focus:ring-1 focus:ring-blue-500" autoFocus />
                          <button type="button" onClick={() => { setEditingTags(null); setNewTag(''); }} className="text-gray-400 hover:text-gray-600"><X className="w-3 h-3" /></button>
                        </form>
                      ) : (
                        <button onClick={() => setEditingTags(c.id)} className="p-1 text-gray-400 hover:text-blue-600 rounded transition" title="Etiket ekle">
                          <Tag className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">{c.message_count || 0}</td>
                  <td className="px-6 py-4 text-sm text-gray-400">{c.last_message_at ? new Date(c.last_message_at).toLocaleString('tr-TR') : '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
