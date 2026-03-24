'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Video, MoreVertical, ArrowLeft, Smile, Paperclip, Mic, CheckCheck } from 'lucide-react';
import { useState, useEffect } from 'react';

export function WhatsAppMockup() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const conversationFlow = [
    { text: 'Merhaba, bu ürün stoklarda var mı?', sender: 'user', timestamp: '14:23', status: 'read' },
    { text: 'Merhaba! Tabii ki, size yardımcı olmaktan mutluluk duyarım. 😊 Evet, ürünümüz stoklarımızda mevcut. Hangi renk ve beden tercih edersiniz?', sender: 'bot', timestamp: '14:23', status: 'read' },
    { text: 'Siyah renk, M beden', sender: 'user', timestamp: '14:24', status: 'read' },
    { text: 'Harika seçim! 🎉 Siyah renk M beden stoklarımızda var. Fiyatı 299₺. Kargo ücretsiz! Hemen sipariş vermek ister misiniz?', sender: 'bot', timestamp: '14:24', status: 'read' },
    { text: 'Evet, sipariş vermek istiyorum', sender: 'user', timestamp: '14:25', status: 'read' },
    { text: 'Mükemmel! 🚀 Sipariş linkinizi gönderiyorum. Güvenli ödeme sayfamızdan kolayca ödeme yapabilirsiniz. Teslimat 2-3 iş günü içinde kapınızda olacak.', sender: 'bot', timestamp: '14:25', status: 'read' },
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
      <div className="bg-[#0b141a] h-[600px] flex flex-col">
        <div className="bg-[#202c33] px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <ArrowLeft className="w-6 h-6 text-[#aebac1]" />
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold">ML</div>
            <div className="flex-1">
              <div className="text-white font-medium">MsgLoom Bot</div>
              <div className="text-[#aebac1] text-xs">Çevrimiçi</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Video className="w-5 h-5 text-[#aebac1]" />
            <Phone className="w-5 h-5 text-[#aebac1]" />
            <MoreVertical className="w-5 h-5 text-[#aebac1]" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 relative" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M30 0l30 30-30 30L0 30z' fill='%23ffffff' fill-opacity='0.02'/%3E%3C/svg%3E")`, backgroundColor: '#0b141a' }}>
          <div className="space-y-2">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div key={message.id} initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3, ease: 'easeOut' }} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[75%] rounded-lg px-3 py-2 ${message.sender === 'user' ? 'bg-[#005c4b] text-white' : 'bg-[#202c33] text-white'}`}>
                    <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                    <div className="flex items-center justify-end gap-1 mt-1">
                      <span className="text-[10px] text-gray-400">{message.timestamp}</span>
                      {message.sender === 'user' && <CheckCheck className="w-3 h-3 text-[#53bdeb]" />}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <AnimatePresence>
              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex justify-start">
                  <div className="bg-[#202c33] rounded-lg px-4 py-3 flex items-center gap-1">
                    {[0, 0.2, 0.4].map((d, i) => <motion.div key={i} className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d }} />)}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-[#202c33] px-3 py-2 flex items-center gap-2">
          <div className="flex-1 bg-[#2a3942] rounded-3xl px-4 py-2 flex items-center gap-2">
            <Smile className="w-5 h-5 text-[#aebac1]" />
            <span className="flex-1 text-[#aebac1] text-sm">Mesaj yazın...</span>
            <Paperclip className="w-5 h-5 text-[#aebac1] rotate-45" />
          </div>
          <div className="w-10 h-10 bg-[#00a884] rounded-full flex items-center justify-center">
            <Mic className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
