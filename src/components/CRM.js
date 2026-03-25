'use client';

import { useState, useEffect } from 'react';
import { Users, Plus, Search, X, ChevronRight, Tag, MessageSquare, StickyNote, DollarSign, Building2, Mail, Phone, Pencil, Trash2 } from 'lucide-react';

const STAGES = [
  { key: 'new', label: 'Yeni Lead', color: 'bg-gray-100 text-gray-700', dot: 'bg-gray-400' },
  { key: 'contacted', label: 'İletişimde', color: 'bg-blue-100 text-blue-700', dot: 'bg-blue-500' },
  { key: 'proposal', label: 'Teklif', color: 'bg-yellow-100 text-yellow-700', dot: 'bg-yellow-500' },
  { key: 'won', label: 'Kazanıldı', color: 'bg-green-100 text-green-700', dot: 'bg-green-500' },
  { key: 'lost', label: 'Kaybedildi', color: 'bg-red-100 text-red-700', dot: 'bg-red-500' },
];

const PLATFORM_ICONS = { whatsapp: '🟢', telegram: '🔵', instagram: '📸', manual: '👤' };
const TAG_COLORS = ['bg-blue-100 text-blue-700', 'bg-green-100 text-green-700', 'bg-purple-100 text-purple-700', 'bg-orange-100 text-orange-700', 'bg-pink-100 text-pink-700'];

export default function CRM() {
  const [contacts, setContacts] = useState([]);
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('pipeline');
  const [stageFilter, setStageFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState(null);
  const [notes, setNotes] = useState([]);
  const [newNote, setNewNote] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', email: '', company: '', phone: '', pipeline_stage: 'new', deal_value: '' });
  const [editField, setEditField] = useState(null);
  const [saving, setSaving] = useState(false);

  const loadData = (stage, q) => {
    const params = new URLSearchParams();
    if (stage && stage !== 'all') params.set('stage', stage);
    if (q) params.set('search', q);
    fetch(`/api/crm?${params}`).then(r => r.json()).then(d => {
      setContacts(d.contacts || []);
      setStats(d.stats || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  };

  useEffect(() => { loadData(); }, []);

  const loadNotes = (contactId) => {
    fetch(`/api/crm/notes?contact_id=${contactId}`).then(r => r.json()).then(d => setNotes(d.notes || []));
  };

  const openContact = (c) => { setSelected(c); loadNotes(c.id); };

  const updateContact = async (id, data) => {
    setSaving(true);
    const r = await fetch('/api/crm', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id, ...data }) });
    const d = await r.json();
    if (d.success) {
      setContacts(contacts.map(c => c.id === id ? d.contact : c));
      if (selected?.id === id) setSelected(d.contact);
    }
    setSaving(false); setEditField(null);
  };

  const addNote = async () => {
    if (!newNote.trim() || !selected) return;
    const r = await fetch('/api/crm/notes', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ contact_id: selected.id, note: newNote }) });
    const d = await r.json();
    if (d.success) { setNotes([d.note, ...notes]); setNewNote(''); }
  };

  const addContact = async (e) => {
    e.preventDefault(); setSaving(true);
    const r = await fetch('/api/crm', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(addForm) });
    const d = await r.json();
    if (d.success) { setContacts([d.contact, ...contacts]); setShowAdd(false); setAddForm({ name: '', email: '', company: '', phone: '', pipeline_stage: 'new', deal_value: '' }); }
    setSaving(false);
  };

  const getStageContacts = (key) => contacts.filter(c => (c.pipeline_stage || 'new') === key);
  const getStageStats = (key) => stats.find(s => s.pipeline_stage === key) || { count: 0, total_value: 0 };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="flex h-full">
      {/* Ana içerik */}
      <div className={`flex-1 ${selected ? 'pr-0' : ''}`}>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">CRM</h2>
            <p className="text-gray-500 text-sm mt-1">{contacts.length} kişi</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input type="text" placeholder="Ara..." value={search} onChange={e => { setSearch(e.target.value); loadData(stageFilter, e.target.value); }}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none w-48" />
            </div>
            <div className="flex bg-gray-100 rounded-lg p-0.5">
              <button onClick={() => setView('pipeline')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${view === 'pipeline' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Pipeline</button>
              <button onClick={() => setView('list')} className={`px-3 py-1.5 rounded-md text-xs font-medium transition ${view === 'list' ? 'bg-white shadow text-gray-900' : 'text-gray-500'}`}>Liste</button>
            </div>
            <button onClick={() => setShowAdd(true)} className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 flex items-center gap-1.5">
              <Plus className="w-4 h-4" /> Kişi Ekle
            </button>
          </div>
        </div>

        {/* Pipeline View */}
        {view === 'pipeline' ? (
          <div className="flex gap-4 overflow-x-auto pb-4">
            {STAGES.map(stage => {
              const stageContacts = getStageContacts(stage.key);
              const ss = getStageStats(stage.key);
              return (
                <div key={stage.key} className="min-w-[260px] flex-1">
                  <div className="flex items-center justify-between mb-3 px-1">
                    <div className="flex items-center gap-2">
                      <div className={`w-2.5 h-2.5 rounded-full ${stage.dot}`}></div>
                      <span className="text-sm font-semibold text-gray-900">{stage.label}</span>
                      <span className="text-xs text-gray-400">{stageContacts.length}</span>
                    </div>
                    {Number(ss.total_value) > 0 && <span className="text-xs text-gray-500">₺{Number(ss.total_value).toLocaleString('tr-TR')}</span>}
                  </div>
                  <div className="space-y-2">
                    {stageContacts.map(c => (
                      <div key={c.id} onClick={() => openContact(c)}
                        className={`bg-white rounded-xl border p-3 cursor-pointer hover:shadow-md transition ${selected?.id === c.id ? 'border-blue-500 shadow-md' : 'border-gray-100'}`}>
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-sm">{PLATFORM_ICONS[c.platform] || '👤'}</span>
                          <p className="text-sm font-medium text-gray-900 truncate">{c.name || c.platform_contact_id}</p>
                        </div>
                        {c.company && <p className="text-xs text-gray-500 mb-1">{c.company}</p>}
                        <div className="flex items-center justify-between">
                          <div className="flex gap-1">
                            {(c.tags || []).slice(0, 2).map((t, i) => (
                              <span key={t} className={`text-[10px] px-1.5 py-0.5 rounded-full ${TAG_COLORS[i % TAG_COLORS.length]}`}>{t}</span>
                            ))}
                          </div>
                          {Number(c.deal_value) > 0 && <span className="text-xs font-medium text-green-600">₺{Number(c.deal_value).toLocaleString('tr-TR')}</span>}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* List View */
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <div className="flex gap-2 p-4 border-b border-gray-100">
              {[{ k: 'all', l: 'Tümü' }, ...STAGES.map(s => ({ k: s.key, l: s.label }))].map(f => (
                <button key={f.k} onClick={() => { setStageFilter(f.k); loadData(f.k, search); }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${stageFilter === f.k ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}>{f.l}</button>
              ))}
            </div>
            <table className="w-full text-left">
              <thead><tr className="border-b border-gray-100">
                <th className="px-6 py-3 text-xs font-semibold text-gray-500">Kişi</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500">Şirket</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500">Durum</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500">Değer</th>
                <th className="px-6 py-3 text-xs font-semibold text-gray-500">Etiketler</th>
              </tr></thead>
              <tbody className="divide-y divide-gray-50">
                {contacts.map(c => {
                  const stage = STAGES.find(s => s.key === (c.pipeline_stage || 'new'));
                  return (
                    <tr key={c.id} onClick={() => openContact(c)} className="hover:bg-gray-50 cursor-pointer transition">
                      <td className="px-6 py-3">
                        <div className="flex items-center gap-2">
                          <span>{PLATFORM_ICONS[c.platform] || '👤'}</span>
                          <div><p className="text-sm font-medium text-gray-900">{c.name || c.platform_contact_id}</p>{c.email && <p className="text-xs text-gray-500">{c.email}</p>}</div>
                        </div>
                      </td>
                      <td className="px-6 py-3 text-sm text-gray-600">{c.company || '-'}</td>
                      <td className="px-6 py-3"><span className={`text-xs px-2 py-1 rounded-full font-medium ${stage?.color}`}>{stage?.label}</span></td>
                      <td className="px-6 py-3 text-sm text-gray-600">{Number(c.deal_value) > 0 ? `₺${Number(c.deal_value).toLocaleString('tr-TR')}` : '-'}</td>
                      <td className="px-6 py-3"><div className="flex gap-1">{(c.tags || []).slice(0, 3).map((t, i) => <span key={t} className={`text-[10px] px-1.5 py-0.5 rounded-full ${TAG_COLORS[i % TAG_COLORS.length]}`}>{t}</span>)}</div></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Kişi Detay Paneli */}
      {selected && (
        <div className="w-96 border-l border-gray-200 bg-white ml-4 rounded-2xl overflow-y-auto max-h-[calc(100vh-120px)]">
          <div className="p-5 border-b border-gray-100">
            <div className="flex items-center justify-between mb-3">
              <span className="text-lg">{PLATFORM_ICONS[selected.platform] || '👤'}</span>
              <button onClick={() => setSelected(null)} className="p-1 text-gray-400 hover:text-gray-600 rounded"><X className="w-4 h-4" /></button>
            </div>
            <h3 className="text-lg font-bold text-gray-900">{selected.name || selected.platform_contact_id}</h3>
            {selected.company && <p className="text-sm text-gray-500">{selected.company}</p>}

            {/* Pipeline stage selector */}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {STAGES.map(s => (
                <button key={s.key} onClick={() => updateContact(selected.id, { pipeline_stage: s.key })}
                  className={`text-xs px-2.5 py-1 rounded-full font-medium transition ${(selected.pipeline_stage || 'new') === s.key ? s.color + ' ring-2 ring-offset-1 ring-blue-300' : 'bg-gray-50 text-gray-500 hover:bg-gray-100'}`}>
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bilgiler */}
          <div className="p-5 border-b border-gray-100 space-y-3">
            {[
              { icon: Mail, label: 'Email', field: 'email', value: selected.email },
              { icon: Phone, label: 'Telefon', field: 'phone', value: selected.phone },
              { icon: Building2, label: 'Şirket', field: 'company', value: selected.company },
              { icon: DollarSign, label: 'Teklif Değeri', field: 'deal_value', value: selected.deal_value, prefix: '₺' },
            ].map(item => (
              <div key={item.field} className="flex items-center justify-between group">
                <div className="flex items-center gap-2 text-sm">
                  <item.icon className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
                  <span className="text-gray-500">{item.label}:</span>
                </div>
                {editField === item.field ? (
                  <input type={item.field === 'deal_value' ? 'number' : 'text'} defaultValue={item.value || ''} autoFocus
                    onBlur={e => updateContact(selected.id, { [item.field]: e.target.value })}
                    onKeyDown={e => e.key === 'Enter' && updateContact(selected.id, { [item.field]: e.target.value })}
                    className="text-sm border border-gray-200 rounded px-2 py-1 w-36 focus:ring-1 focus:ring-blue-500 focus:outline-none" />
                ) : (
                  <div className="flex items-center gap-1">
                    <span className="text-sm text-gray-900">{item.value ? `${item.prefix || ''}${item.value}` : '-'}</span>
                    <button onClick={() => setEditField(item.field)} className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-blue-600 transition"><Pencil className="w-3 h-3" /></button>
                  </div>
                )}
              </div>
            ))}

            {/* Etiketler */}
            <div className="flex items-center gap-2 flex-wrap">
              <Tag className="w-4 h-4 text-gray-400" strokeWidth={1.5} />
              {(selected.tags || []).map((t, i) => (
                <span key={t} className={`text-xs px-2 py-0.5 rounded-full ${TAG_COLORS[i % TAG_COLORS.length]} cursor-pointer`}
                  onClick={() => updateContact(selected.id, { tags: (selected.tags || []).filter(x => x !== t) })}>{t} ×</span>
              ))}
              <input type="text" placeholder="+ etiket" className="text-xs border-0 bg-transparent w-16 focus:outline-none text-gray-500"
                onKeyDown={e => { if (e.key === 'Enter' && e.target.value.trim()) { updateContact(selected.id, { tags: [...(selected.tags || []), e.target.value.trim()] }); e.target.value = ''; } }} />
            </div>
          </div>

          {/* Notlar */}
          <div className="p-5">
            <h4 className="text-sm font-semibold text-gray-900 mb-3 flex items-center gap-1.5"><StickyNote className="w-4 h-4" /> Notlar</h4>
            <div className="flex gap-2 mb-3">
              <input type="text" value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Not ekle..."
                onKeyDown={e => e.key === 'Enter' && addNote()}
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-blue-500 focus:outline-none" />
              <button onClick={addNote} className="bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700">Ekle</button>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {notes.map(n => (
                <div key={n.id} className="bg-gray-50 rounded-lg p-3">
                  <p className="text-sm text-gray-700">{n.note}</p>
                  <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString('tr-TR')}</p>
                </div>
              ))}
              {notes.length === 0 && <p className="text-xs text-gray-400 text-center py-4">Henüz not yok</p>}
            </div>
          </div>
        </div>
      )}

      {/* Kişi Ekleme Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md" onClick={e => e.stopPropagation()}>
            <h3 className="text-lg font-bold text-gray-900 mb-4">Yeni Kişi Ekle</h3>
            <form onSubmit={addContact} className="space-y-3">
              <input type="text" placeholder="Ad Soyad *" value={addForm.name} onChange={e => setAddForm({ ...addForm, name: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" required />
              <div className="grid grid-cols-2 gap-3">
                <input type="email" placeholder="Email" value={addForm.email} onChange={e => setAddForm({ ...addForm, email: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
                <input type="text" placeholder="Telefon" value={addForm.phone} onChange={e => setAddForm({ ...addForm, phone: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <input type="text" placeholder="Şirket" value={addForm.company} onChange={e => setAddForm({ ...addForm, company: e.target.value })}
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              <div className="grid grid-cols-2 gap-3">
                <select value={addForm.pipeline_stage} onChange={e => setAddForm({ ...addForm, pipeline_stage: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none">
                  {STAGES.map(s => <option key={s.key} value={s.key}>{s.label}</option>)}
                </select>
                <input type="number" placeholder="Teklif Değeri (₺)" value={addForm.deal_value} onChange={e => setAddForm({ ...addForm, deal_value: e.target.value })}
                  className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" disabled={saving} className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 disabled:opacity-50">{saving ? 'Kaydediliyor...' : 'Kaydet'}</button>
                <button type="button" onClick={() => setShowAdd(false)} className="text-gray-500 px-6 py-2.5 rounded-xl text-sm hover:bg-gray-100">İptal</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
