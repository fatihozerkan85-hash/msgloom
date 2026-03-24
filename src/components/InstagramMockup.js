'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Phone, Video, Info, ArrowLeft, Smile, Mic, Image, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';

export function InstagramMockup() {
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [messageIndex, setMessageIndex] = useState(0);

  const conversationFlow = [
    { text: 'Selamlar! Yeni koleksiyonunuz çok güzel 😍', sender: 'user', timestamp: '16:45' },
    { text: 'Çok teşekkür ederiz! 💕 Yeni koleksiyonumuzda harika parçalar var. Size özel %20 indirim kodu: MSGDM20', sender: 'bot', timestamp: '16:45', liked: true },
    { text: 'Vay süper! Beyaz elbise var mıydı?', sender: 'user', timestamp: '16:46' },
    { text: 'Tabii ki! ✨ Beyaz elbisemiz şu an stoklarda mevcut:\n\n🤍 Beyaz Dantel Elbise - 599₺\n🤍 Beyaz Midi Elbise - 749₺\n🤍 Beyaz Gece Elbisi - 999₺\n\nÜcretsiz kargo + Aynı gün teslimat seçeneği! Hangisini istersiniz?', sender: 'bot', timestamp: '16:46' },
    { text: 'Midi elbise tam bana göre! Nasıl sipariş verebilirim?', sender: 'user', timestamp: '16:47' },
    { text: '🎉 Harika seçim! Size özel sipariş linki:\n\n👉 shop.msgloom.com/midi-white\n\nLinke tıklayın, beden seçin ve 3 dakikada sipariş tamamlayın. Hediye paketi ücretsiz! 🎁', sender: 'bot', timestamp: '16:47', liked: true },
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
    <div className="w-full max-w-sm mx-auto bg-[#0a0a0a] rounded-[2.5rem] shadow-2xl overflow-hidden border-8 border-gray-900">
      <div className="h-8 bg-[#0a0a0a] flex items-center justify-center">
        <div className="w-32 h-6 bg-black rounded-b-2xl"></div>
      </div>
      <div className="bg-white h-[600px] flex flex-col">
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1">
            <ArrowLeft className="w-6 h-6 text-gray-900" />
            <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-transparent bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 p-[2px]">
              <div className="w-full h-full rounded-full bg-white flex items-center justify-center">
                <div className="w-full h-full rounded-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold">ML</div>
              </div>
            </div>
            <div className="flex-1">
              <div className="text-gray-900 font-semibold text-sm">msgloom_official</div>
              <div className="text-gray-500 text-xs">Aktif</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Phone className="w-5 h-5 text-gray-900" />
            <Video className="w-5 h-5 text-gray-900" />
            <Info className="w-5 h-5 text-gray-900" />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 py-3 bg-white">
          <div className="space-y-3">
            <AnimatePresence>
              {messages.map((message) => (
                <motion.div key={message.id} initial={{ opacity: 0, y: 20, scale: 0.8 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.3, ease: 'easeOut' }} className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'} items-end gap-2`}>
                  {message.sender === 'bot' && (
                    <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mb-1">
                      <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-[8px] font-bold">ML</div>
                    </div>
                  )}
                  <div className="flex flex-col">
                    <div className={`max-w-[70%] rounded-3xl px-4 py-2 shadow-sm relative ${message.sender === 'user' ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-br-md' : 'bg-gray-100 text-gray-900 rounded-bl-md border border-gray-200'}`}>
                      <p className="text-sm whitespace-pre-wrap leading-relaxed">{message.text}</p>
                      {message.liked && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.5, type: 'spring', stiffness: 500 }} className="absolute -bottom-2 -right-2 bg-white rounded-full shadow-lg p-1">
                          <Heart className="w-3 h-3 fill-red-500 text-red-500" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <AnimatePresence>
              {isTyping && (
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex justify-start items-end gap-2">
                  <div className="w-6 h-6 rounded-full overflow-hidden flex-shrink-0 mb-1">
                    <div className="w-full h-full bg-gradient-to-br from-pink-500 to-purple-600 flex items-center justify-center text-white text-[8px] font-bold">ML</div>
                  </div>
                  <div className="bg-gray-100 border border-gray-200 rounded-3xl rounded-bl-md px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1">
                      {[0, 0.2, 0.4].map((d, i) => <motion.div key={i} className="w-2 h-2 bg-gray-400 rounded-full" animate={{ y: [0, -5, 0] }} transition={{ duration: 0.6, repeat: Infinity, delay: d }} />)}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        <div className="bg-white border-t border-gray-200 px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-3">
              <span className="p-2"><Image className="w-5 h-5 text-gray-900" /></span>
              <span className="p-2"><Mic className="w-5 h-5 text-gray-900" /></span>
            </div>
            <div className="flex-1 bg-gray-100 rounded-full px-4 py-2 flex items-center gap-2 border border-gray-200">
              <span className="flex-1 text-gray-500 text-sm">Mesaj gönder...</span>
              <Smile className="w-5 h-5 text-gray-500" />
            </div>
            <span className="p-2">
              <svg className="w-5 h-5 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M16.6915026,12.4744748 L3.50612381,13.2599618 C3.19218622,13.2599618 3.03521743,13.4170592 3.03521743,13.5741566 L1.15159189,20.0151496 C0.8376543,20.8006365 0.99,21.89 1.77946707,22.52 C2.41,22.99 3.50612381,23.1 4.13399899,22.8429026 L21.714504,14.0454487 C22.6563168,13.5741566 23.1272231,12.6315722 22.9702544,11.6889879 C22.8132856,10.7464035 22.0274693,10.0122912 21.0871139,9.69589827 L4.13399899,1.28950976 C3.34915502,0.9 2.40734225,1.00636533 1.77946707,1.4776575 C0.994623095,2.10604706 0.8376543,3.0486314 1.15159189,3.99121575 L3.03521743,10.4322088 C3.03521743,10.5893061 3.34915502,10.7464035 3.50612381,10.7464035 L16.6915026,11.5318905 C16.6915026,11.5318905 17.1624089,11.5318905 17.1624089,12.0031827 C17.1624089,12.4744748 16.6915026,12.4744748 16.6915026,12.4744748 Z" />
              </svg>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
