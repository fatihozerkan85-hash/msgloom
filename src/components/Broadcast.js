'use client';

import { useState, useEffect } from 'react';
import { Megaphone, Send, CheckCircle, Clock, Users } from 'lucide-react';

export default function Broadcast() {
  const [broadcasts, setBroadcasts] = useState([]);
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [form, setForm] = useState({ platform: 'whatsapp', message: '', tags: [] });
  const [status, setStatus] = useState(null);

  useEffect(() => {
    Promise.all([
      fetch('/api/broadcast').then(r => r.json()),
      fetch('/api/contacts').then(r => r.json()),
    ]).then(([b, c]) => {
      setBroadcasts(b.broadcasts || []);
      setContacts(c.contacts || []);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  const allTags = [...new Set(contacts.flatMap(c => c.tags || []))];
  const targetCount = form.tags.length > 0
    ? contacts.filter(c => c.platform === form.platform && (c.tags || []).some(t => form.tags.includes(t))).length
    : contacts.filter(c => c.platform === form.platform).length;

  const handleSend = async (e) => {
    e.preventDefault();
    if (!confirm(`${targetCount} kişiye mesaj gönderilecek. Devam?`)) return;
    setSending(true); setStatus(null);
    try {
      const r = await fetch('/api/broadcast', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      const d = await r.json();
      if (d.success) {
        setBroadcasts([d.broadcast, ...broadcasts]);
        setForm({ ...form, message: '', tags: [] });
        setStatus({ type: 'success', text: `${d.broadcast.sent_count}/${d.broadcast.total_count} kişiye gönderildi` });
      } else setStatus({ type: 'error', text: d.error });
    } catch { setStatus({ type: 'error', text: 'Bağlantı hatası' }); }
    setSending(false);
  };

  const toggleTag = (tag) => {
    setForm(f => ({ ...f, tags: f.tags.includes(tag) ? f.tags.filter(t => t !== tag) : [...f.tags, tag] }));
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Toplu Mesaj</h2>
        <p className="text-gray-500 text-sm mt-1">Kişi listenize toplu mesaj gönderin</p>
      </div>

      {status && (
        <div className={`mb-6 p-4 rounded-xl text-sm ${status.type === 'success' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>{status.text}</div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={handleSend} className="bg-white rounded-2xl border border-gray-100 p-6 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
            <div className="flex gap-2">
              {[{ k: 'whatsapp', l: '🟢 WhatsApp' }, { k: 'telegram', l: '🔵 Telegram' }, { k: 'instagram', l: '📸 Instagram' }].map(p => (
                <button key={p.k} type="button" onClick={() => setForm({ ...form, platform: p.k })}
                  className={`px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition ${form.platform === p.k ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600'}`}>
                  {p.l}
                </button>
              ))}
            </div>
          </div>

          {allTags.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hedef Etiketler <span className="text-gray-400 font-normal">(boş = herkese)</span></label>
              <div className="flex flex-wrap gap-2">
                {allTags.map(tag => (
                  <button key={tag} type="button" onClick={() => toggleTag(tag)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium border transition ${form.tags.includes(tag) ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mesaj</label>
            <textarea value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
              rows={5} placeholder="Toplu gönderilecek mesaj..." required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-gray-500">
              <Users className="w-4 h-4" /> <span>{targetCount} kişiye gönderilecek</span>
            </div>
            <button type="submit" disabled={sending || targetCount === 0}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition flex items-center gap-2">
              {sending ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Gönderiliyor...</> : <><Send className="w-4 h-4" /> Gönder</>}
            </button>
          </div>
        </form>

        {/* Geçmiş */}
        <div>
          <h3 className="font-bold text-gray-900 mb-4">Gönderim Geçmişi</h3>
          {broadcasts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <Megaphone className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500 text-sm">Henüz toplu mesaj gönderilmemiş</p>
            </div>
          ) : (
            <div className="space-y-3">
              {broadcasts.map(b => (
                <div key={b.id} className="bg-white rounded-xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium text-gray-500">{b.platform === 'whatsapp' ? '🟢' : b.platform === 'telegram' ? '🔵' : '📸'} {b.platform}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${b.status === 'completed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                      {b.status === 'completed' ? <><CheckCircle className="w-3 h-3 inline mr-1" />Tamamlandı</> : <><Clock className="w-3 h-3 inline mr-1" />Gönderiliyor</>}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2 mb-2">{b.message}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{b.sent_count}/{b.total_count} gönderildi</span>
                    <span>{new Date(b.created_at).toLocaleString('tr-TR')}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
