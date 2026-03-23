'use client';

import { useState } from 'react';
import { Send, PenLine, FileText, AlertTriangle, Lightbulb } from 'lucide-react';

export default function SendMessage() {
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('text');
  const [template, setTemplate] = useState('hello_world');
  const [status, setStatus] = useState(null);
  const [sending, setSending] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setSending(true);
    setStatus(null);
    try {
      const body = type === 'template' ? { to: phone, type: 'template', template } : { to: phone, message };
      const res = await fetch('/api/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (data.success) {
        setStatus({ type: 'success', text: 'Mesaj başarıyla gönderildi!' });
        setMessage('');
      } else {
        setStatus({ type: 'error', text: typeof data.error === 'string' ? data.error : data.error?.message || 'Gönderilemedi' });
      }
    } catch {
      setStatus({ type: 'error', text: 'Bağlantı hatası' });
    } finally {
      setSending(false);
    }
  };

  return (
    <div>
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900">Mesaj Gönder</h2>
        <p className="text-gray-500 text-sm mt-1">WhatsApp üzerinden mesaj gönderin</p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <form onSubmit={handleSend} className="bg-white rounded-2xl border border-gray-100 p-8 space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Telefon Numarası</label>
            <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)}
              placeholder="905xxxxxxxxx" required
              className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition" />
            <p className="text-xs text-gray-400 mt-1">Ülke kodu ile birlikte girin (örn: 905551234567)</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Mesaj Tipi</label>
            <div className="flex gap-3">
              <button type="button" onClick={() => setType('text')}
                className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition flex items-center justify-center gap-2 ${type === 'text' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                <PenLine className="w-4 h-4" strokeWidth={1.5} /> Metin Mesajı
              </button>
              <button type="button" onClick={() => setType('template')}
                className={`flex-1 py-3 rounded-xl text-sm font-medium border-2 transition flex items-center justify-center gap-2 ${type === 'template' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}>
                <FileText className="w-4 h-4" strokeWidth={1.5} /> Template
              </button>
            </div>
          </div>

          {type === 'text' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Mesaj İçeriği</label>
              <textarea value={message} onChange={(e) => setMessage(e.target.value)} rows={5}
                placeholder="Mesajınızı yazın..." required
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition resize-none" />
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Template Adı</label>
              <input type="text" value={template} onChange={(e) => setTemplate(e.target.value)}
                className="w-full border border-gray-200 rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:outline-none transition" />
            </div>
          )}

          <button type="submit" disabled={sending}
            className="w-full bg-blue-600 text-white py-3.5 rounded-xl font-medium hover:bg-blue-700 disabled:opacity-50 transition shadow-sm flex items-center justify-center gap-2">
            {sending ? <><div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div> Gönderiliyor...</> : <><Send className="w-4 h-4" strokeWidth={1.5} /> Mesaj Gönder</>}
          </button>

          {status && (
            <div className={`p-4 rounded-xl text-sm ${status.type === 'success' ? 'bg-blue-50 text-blue-700 border border-blue-100' : 'bg-red-50 text-red-700 border border-red-100'}`}>
              {status.text}
            </div>
          )}
        </form>

        <div className="space-y-4">
          <div className="bg-amber-50 rounded-2xl border border-amber-100 p-6">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" strokeWidth={1.5} />
              <h3 className="font-bold text-amber-800 text-sm">Önemli Bilgi</h3>
            </div>
            <p className="text-amber-700 text-xs leading-relaxed">
              WhatsApp Business API kurallarına göre, daha önce mesajlaşmadığınız kişilere sadece onaylanmış template mesajlar gönderebilirsiniz. Serbest metin mesajı göndermek için müşterinin son 24 saat içinde size mesaj atmış olması gerekir.
            </p>
          </div>
          <div className="bg-blue-50 rounded-2xl border border-blue-100 p-6">
            <div className="flex items-center gap-2 mb-2">
              <Lightbulb className="w-4 h-4 text-blue-600" strokeWidth={1.5} />
              <h3 className="font-bold text-blue-800 text-sm">İpucu</h3>
            </div>
            <p className="text-blue-700 text-xs leading-relaxed">
              Template mesajlarınızı Meta Business Suite üzerinden oluşturabilir ve onaya gönderebilirsiniz. Onaylanan template&apos;ler burada kullanılabilir.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
