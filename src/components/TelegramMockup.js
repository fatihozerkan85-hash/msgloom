'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Search, Phone, MoreVertical, ArrowLeft, Smile, Paperclip, Mic } from 'lucide-react';
import { useState, useEffect } from 'react';

export function TelegramMockup() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const conversationFlow = [
    { text: 'Kampanya detaylarını öğrenebilir miyim?', sender: 'user', timestamp: '15:10' },
    { text: 'Merhaba! 🎉 Şu anda %30 indirim kampanyamız devam ediyor. Tüm ürünlerde geçerli! Kampanya 3 gün daha sürecek. İlgilendiğiniz kategori var mı?', sender: 'bot', timestamp: '15:10' },
    { text: 'Elektronik ürünlerde de geçerli mi?', sender: 'user', timestamp: '15:11' },
    { text: 'Kesinlikle! ✨ Elektronik kategorisinde de %30 indirim geçerli. Akıllı telefonlar, laptoplar ve aksesuarlarda harika fırsatlar var. Size özel bir ürün önerebilir miyim?', sender: 'bot', timestamp: '15:11' },
    { text: 'Evet lütfen, laptop arıyorum', sender: 'user', timestamp: '15:12' },
    { text: '💻 Harika! En çok tercih edilen modellerimiz:\n\n1. ProBook X1 - İndirimli: 6,999₺\n2. UltraSlim 14" - İndirimli: 8,499₺\n3. GamerPro RTX - İndirimli: 12,999₺\n\nÜcretsiz kargo + 2 yıl garanti dahil! Hangisini incelemek istersiniz?', sender: 'bot', timestamp: '15:12' },
  ];

  useEffect(() => {
    if (messageIndex < conversationFlow.length) {
      const timer = setTimeout(() => {
        if (conversationFlow[messageIndex].sender === 'bot') {
          setIsTyping(true);
          setTimeout(() => {
            setIsTyping(false);
            setMessages(prev => [...prev, { ...conversationFlow[messageIndex], id: messageIndex }]);
            setMessageIndex(prev => prev + 1);
          }, 1500);
        } else {
          setMessages(prev => [...prev, { ...conversationFlow[messageIndex], id: messageIndex }]);
          setMessageIndex(prev => prev + 1);
        }
      }, messageIndex === 0 ? 500 : 2000);
      return () => clearTimeout(timer);
    } else {
      const resetTimer = setTimeout(() => { setMessages([]); setMessageIndex(0); }, 3000);
      return () => clearTimeout(resetTimer);
    }
  }, [messageIndex]);

  return (
    <div className="w-full max-w-sm mx-auto bg-[#0a1014] rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-gray-900">
      <div className="h-8 bg-[#0a1014] flex items-center justify-center">
        <div className="w-32 h-6 bg-black rounded-b-2xl"></div>
      </div>
      <div className="bg-[#0f1419] h-[600px] flex flex-col">
        <div className="bg-[#212d3b] px-4 py-3 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3 flex-1">
            <ArrowLeft className="w-6 h-6 text-white" />
            <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-white font-semibold">MB</div>
            <div className="flex-1">
              <div className="text-white font-medium">MsgLoom Bot</div>
              <div className="text-[#8b98a5] text-xs">son görülme: çevrimiçi</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Search className="w-5 h-5 text-white" />
            <Phone className="w-5 h-5 text-white" />
            <MoreVertical className="w-5 h-5 text-white" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3" style={{ backgroundImage: 'linear-gradient(135deg, #0f1419 0%, #1a2332 100%)' }}>
          <div className="space-y-2">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div key={message.id} initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3, ease: 'easeOut' }} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex flex-col ${message.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    <div className={`max-w-[75%] rounded-2xl px-3 py-2 shadow-lg ${message.sender === 'user' ? 'bg-[#5288c1] text-white rounded-br-sm' : 'bg-[#2b5278] text-white rounded-bl-sm'}`}>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                      <div className="flex items-center justify-end gap-1 mt-1">
                        <span className="text-[10px] text-gray-300 opacity-80">{message.timestamp}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <AnimatePresence>
              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex justify-start">
                  <div className="bg-[#2b5278] rounded-2xl rounded-bl-sm px-4 py-3 shadow-lg">
                    <div className="flex items-center gap-1">
                      {[0, 0.2, 0.4].map((d, i) => <motion.div key={i} className="w-2 h-2 bg-gray-300 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d }} />)}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-[#212d3b] px-3 py-2 flex items-center gap-2 shadow-lg">
          <div className="flex-1 bg-[#182533] rounded-3xl px-4 py-2 flex items-center gap-2">
            <Smile className="w-5 h-5 text-[#8b98a5]" />
            <span className="flex-1 text-[#8b98a5] text-sm">Mesaj yaz...</span>
            <Paperclip className="w-5 h-5 text-[#8b98a5] rotate-45" />
          </div>
          <div className="w-10 h-10 bg-[#5288c1] rounded-full flex items-center justify-center">
            <Mic className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
