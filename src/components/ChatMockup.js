'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { MessageCircle, Send as SendIcon, CheckCircle, Clock, Users, TrendingUp, Zap } from 'lucide-react';

function TypingIndicator({ color = 'bg-gray-200' }) {
  return (
    <div className={`inline-flex items-center gap-1 px-4 py-2.5 rounded-2xl ${color}`}>
      {[0, 1, 2].map(i => (
        <motion.span key={i} className="w-1.5 h-1.5 bg-gray-400 rounded-full"
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

function ChatMessage({ msg, isUser, theme }) {
  const bubbleClass = theme === 'whatsapp'
    ? isUser ? 'bg-[#005c4b] text-white' : 'bg-[#1f2c34] text-white'
    : theme === 'telegram'
    ? isUser ? 'bg-[#2b5278] text-white' : 'bg-[#182533] text-white'
    : isUser ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'bg-gray-100 text-gray-900';

  return (
    <motion.div
      initial={{ opacity: 0, y: 15, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-2`}
    >
      <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-[11px] leading-relaxed ${bubbleClass} ${isUser ? 'rounded-tr-sm' : 'rounded-tl-sm'}`}>
        {msg.text}
        <span className={`block text-right text-[8px] mt-0.5 ${theme === 'instagram' && !isUser ? 'text-gray-400' : 'text-white/50'}`}>{msg.time}</span>
      </div>
    </motion.div>
  );
}

const conversations = {
  whatsapp: [
    { text: 'Merhaba, bu ürün stoklarda var mı?', isUser: true, time: '14:02' },
    { text: 'Merhaba! Tabi ki, size yardımcı olmaktan mutluluk duyarım 😊 Evet, ürünümüz stoklarımızda mevcut. Hangi renk ve beden tercih edersiniz?', isUser: false, time: '14:03' },
    { text: 'Siyah renk, M beden', isUser: true, time: '14:05' },
    { text: 'Harika seçim! 🎉 Siyah renk M beden stoklarımızda var. Fiyatı 299₺. Kargo ücretsiz! Hemen sipariş vermek ister misiniz?', isUser: false, time: '14:05' },
    { text: 'Evet, sipariş vermek istiyorum', isUser: true, time: '14:06' },
  ],
  telegram: [
    { text: 'Kampanya detaylarını öğrenebilir miyim?', isUser: true, time: '15:20' },
    { text: 'Merhaba! 🎯 Şu anda %30 indirim kampanyamız devam ediyor. Tüm ürünlerde geçerli! Kampanya 3 gün daha sürecek. İlgilendiğiniz kategori var mı?', isUser: false, time: '15:21' },
    { text: 'Elektronik ürünlerde de geçerli mi?', isUser: true, time: '15:22' },
    { text: 'Kesinlikle! Elektronik kampanyada da %30 geçerli. Akıllı telefonlar, tabletler ve aksesuarlarda harika fırsatlar var.', isUser: false, time: '15:23' },
  ],
  instagram: [
    { text: 'Selamlar! Yeni koleksiyonunuz çok güzel 😍', isUser: true, time: '16:10' },
    { text: 'Çok teşekkür ederiz! ❤️ Yeni koleksiyonumuzda birbirinden harika parçalar var. Size özel %20 indirim kodu: MSGLOOM', isUser: false, time: '16:11' },
    { text: 'Hay süper! Fiyat bilgisi alabilir miyim?', isUser: true, time: '16:12' },
    { text: "Tabii ki! ✨ Fiyatlarımız 149₺'den başlıyor. Beğendiğiniz ürünü söyleyin, detaylı bilgi verelim!", isUser: false, time: '16:13' },
  ],
};

const features = {
  whatsapp: { title: 'WhatsApp Özellikleri', items: ['Anında otomatik yanıt', 'Ürün stok sorgulama', 'Sipariş oluşturma', 'Ödeme linki gönderme'] },
  telegram: { title: 'Telegram Özellikleri', items: ['Kampanya duyuruları', 'Ürün kataloğu gösterimi', 'Fiyat bilgilendirme', 'Otomatik öneri sistemi'] },
  instagram: { title: 'Instagram Özellikleri', items: ["DM'den ürün satışı", 'Story yanıtlarını yönetme', 'İndirim kodu gönderme', 'Otomatik ürün önerisi'] },
};

function PhoneChat({ theme, delay = 0 }) {
  const messages = conversations[theme];
  const [visible, setVisible] = useState([]);
  const [typing, setTyping] = useState(false);
  const [idx, setIdx] = useState(0);
  const chatRef = useRef(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setStarted(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  useEffect(() => {
    if (!started) return;
    if (idx >= messages.length) {
      const t = setTimeout(() => { setVisible([]); setIdx(0); }, 5000);
      return () => clearTimeout(t);
    }
    const msg = messages[idx];
    if (!msg.isUser) {
      setTyping(true);
      const t = setTimeout(() => { setTyping(false); setVisible(p => [...p, msg]); setIdx(p => p + 1); }, 1500);
      return () => clearTimeout(t);
    }
    const t = setTimeout(() => { setVisible(p => [...p, msg]); setIdx(p => p + 1); }, 900);
    return () => clearTimeout(t);
  }, [idx, messages, started]);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [visible, typing]);

  const headerBg = theme === 'whatsapp' ? 'bg-[#1f2c34]' : theme === 'telegram' ? 'bg-[#17212b]' : 'bg-white';
  const bodyBg = theme === 'whatsapp' ? 'bg-[#0b141a]' : theme === 'telegram' ? 'bg-[#0e1621]' : 'bg-white';
  const title = theme === 'whatsapp' ? 'MsgLoom Bot' : theme === 'telegram' ? 'MsgLoom Bot' : 'msgloom_official';
  const subtitle = theme === 'whatsapp' ? 'çevrimiçi' : theme === 'telegram' ? 'son görülme: şimdi' : '';
  const avatarBg = theme === 'whatsapp' ? 'bg-[#00a884]' : theme === 'telegram' ? 'bg-[#3390ec]' : 'bg-gradient-to-r from-purple-500 to-pink-500';
  const typingBg = theme === 'instagram' ? 'bg-gray-100' : theme === 'whatsapp' ? 'bg-[#1f2c34]' : 'bg-[#182533]';

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: delay / 1000 }}
      className="w-[260px] md:w-[280px] rounded-[2rem] overflow-hidden shadow-2xl border border-white/10 flex-shrink-0"
    >
      {/* Header */}
      <div className={`${headerBg} px-4 pt-3 pb-2`}>
        <div className="flex items-center gap-2">
          <span className={`${theme === 'instagram' ? 'text-gray-900' : 'text-white/70'} text-xs`}>←</span>
          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-white text-[9px] font-bold ${avatarBg}`}>
            {theme === 'instagram' ? 'ML' : 'ML'}
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-[11px] font-semibold truncate ${theme === 'instagram' ? 'text-gray-900' : 'text-white'}`}>{title}</p>
            {subtitle && <p className={`text-[9px] ${theme === 'instagram' ? 'text-gray-500' : 'text-white/50'}`}>{subtitle}</p>}
          </div>
          <div className={`flex items-center gap-1.5 ${theme === 'instagram' ? 'text-gray-600' : 'text-white/50'}`}>
            {theme === 'whatsapp' && <><span className="text-[10px]">📹</span><span className="text-[10px]">📞</span><span className="text-[10px]">⋮</span></>}
            {theme === 'telegram' && <><span className="text-[10px]">🔍</span><span className="text-[10px]">⋮</span></>}
            {theme === 'instagram' && <><span className="text-[10px]">📞</span><span className="text-[10px]">📹</span></>}
          </div>
        </div>
      </div>

      {/* Chat */}
      <div ref={chatRef} className={`${bodyBg} h-[280px] px-3 py-3 overflow-y-auto`} style={{ scrollBehavior: 'smooth' }}>
        <AnimatePresence>
          {visible.map((msg, i) => (
            <ChatMessage key={`${theme}-${i}`} msg={msg} isUser={msg.isUser} theme={theme} />
          ))}
        </AnimatePresence>
        {typing && (
          <div className="flex justify-start mb-2">
            <TypingIndicator color={typingBg} />
          </div>
        )}
      </div>

      {/* Input */}
      <div className={`${theme === 'instagram' ? 'bg-white border-t border-gray-100' : headerBg} px-3 py-2 flex items-center gap-2`}>
        <span className="text-sm">😊</span>
        <div className={`flex-1 rounded-full px-3 py-1.5 text-[10px] ${theme === 'instagram' ? 'bg-gray-100 text-gray-400' : 'bg-white/10 text-white/40'}`}>
          Mesaj yaz...
        </div>
        {theme === 'whatsapp' && <span className="w-6 h-6 bg-[#00a884] rounded-full flex items-center justify-center text-white text-[10px]">🎤</span>}
        {theme === 'telegram' && <span className="text-[#3390ec] text-sm">➤</span>}
        {theme === 'instagram' && <span className="text-blue-500 text-[10px] font-semibold">Gönder</span>}
      </div>
    </motion.div>
  );
}

export default function LiveDemoSection() {
  return (
    <section className="py-20 px-6 bg-gradient-to-b from-[#0a1628] to-[#0f1f3d]">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <span className="inline-flex items-center gap-2 bg-blue-500/20 text-blue-300 text-xs font-medium px-4 py-1.5 rounded-full mb-4 border border-blue-500/30">
            <Zap className="w-3 h-3" strokeWidth={2} /> Canlı Demo
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-2">Botun Nasıl Çalıştığını</h2>
          <h2 className="text-3xl md:text-4xl font-bold text-cyan-400 mb-4">Canlı İzleyin</h2>
          <p className="text-blue-200/70 text-sm max-w-xl mx-auto">
            MsgLoom botunu WhatsApp, Telegram ve Instagram&apos;da müşteri hizmetleri ve satış otomasyonu olarak kullanın. Gerçek zamanlı demo ile farkı görün.
          </p>
        </motion.div>

        {/* Tab labels */}
        <div className="flex justify-center gap-3 mb-8 flex-wrap">
          {[
            { label: 'WhatsApp Otomasyonu', color: 'bg-green-500/20 text-green-300 border-green-500/30', dot: 'bg-green-400' },
            { label: 'Telegram Otomasyonu', color: 'bg-blue-500/20 text-blue-300 border-blue-500/30', dot: 'bg-blue-400' },
            { label: 'Instagram DM Otomasyonu', color: 'bg-pink-500/20 text-pink-300 border-pink-500/30', dot: 'bg-pink-400' },
          ].map((tab, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className={`inline-flex items-center gap-2 text-xs font-medium px-4 py-2 rounded-full border ${tab.color}`}
            >
              <span className={`w-2 h-2 rounded-full ${tab.dot}`} />
              {tab.label}
            </motion.span>
          ))}
        </div>

        {/* Phone mockups */}
        <div className="flex justify-center gap-6 mb-12 overflow-x-auto pb-4">
          <PhoneChat theme="whatsapp" delay={0} />
          <PhoneChat theme="telegram" delay={300} />
          <PhoneChat theme="instagram" delay={600} />
        </div>

        {/* Feature cards */}
        <div className="grid md:grid-cols-3 gap-4 mb-10 max-w-4xl mx-auto">
          {(['whatsapp', 'telegram', 'instagram']).map((key, i) => {
            const f = features[key];
            const borderColor = key === 'whatsapp' ? 'border-green-500/30' : key === 'telegram' ? 'border-blue-500/30' : 'border-pink-500/30';
            const iconColor = key === 'whatsapp' ? 'text-green-400' : key === 'telegram' ? 'text-blue-400' : 'text-pink-400';
            const dotColor = key === 'whatsapp' ? 'bg-green-400' : key === 'telegram' ? 'bg-blue-400' : 'bg-pink-400';
            return (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className={`bg-white/5 backdrop-blur-sm rounded-xl p-5 border ${borderColor}`}
              >
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle className={`w-4 h-4 ${iconColor}`} strokeWidth={1.5} />
                  <h4 className="text-white text-sm font-semibold">{f.title}</h4>
                </div>
                <ul className="space-y-1.5">
                  {f.items.map((item, j) => (
                    <li key={j} className="flex items-center gap-2 text-blue-200/70 text-xs">
                      <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />
                      {item}
                    </li>
                  ))}
                </ul>
              </motion.div>
            );
          })}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-3xl mx-auto">
          {[
            { value: '<2sn', label: 'Ortalama Yanıt Süresi', color: 'text-cyan-400' },
            { value: '%95', label: 'Müşteri Memnuniyeti', color: 'text-green-400' },
            { value: '7/24', label: 'Kesintisiz Hizmet', color: 'text-blue-400' },
            { value: '%60', label: 'Dönüşüm Artışı', color: 'text-purple-400' },
          ].map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white/5 backdrop-blur-sm rounded-xl p-4 text-center border border-white/10"
            >
              <p className={`text-2xl md:text-3xl font-bold ${s.color}`}>{s.value}</p>
              <p className="text-blue-200/50 text-xs mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link href="/register" className="inline-block bg-gradient-to-r from-green-500 to-cyan-500 text-white px-8 py-3.5 rounded-full font-medium text-sm hover:shadow-lg hover:shadow-green-500/30 transition">
              Hemen Botunuzu Kurun - Ücretsiz Deneyin
            </Link>
          </motion.div>
          <p className="text-blue-200/40 text-xs mt-3">Kredi kartı gerektirmez • 14 gün ücretsiz</p>
        </motion.div>
      </div>
    </section>
  );
}
