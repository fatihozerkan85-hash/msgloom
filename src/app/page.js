'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MessageSquare, BarChart3, Zap, Shield, Users, Globe, TrendingUp, ArrowRight, Rocket, Clock, CheckCircle2, BadgeCheck } from 'lucide-react';
import { WhatsAppMockup } from '@/components/WhatsAppMockup';
import { TelegramMockup } from '@/components/TelegramMockup';
import { InstagramMockup } from '@/components/InstagramMockup';
import { HowItWorks } from '@/components/HowItWorks';
import { useContent, t } from '@/lib/useContent';

export default function Home() {
  const router = useRouter();
  const [checking, setChecking] = useState(true);
  const { content: c } = useContent();

  useEffect(() => {
    fetch('/api/auth/me')
      .then(res => res.json())
      .then(data => { if (data.user) router.push('/dashboard'); else setChecking(false); })
      .catch(() => setChecking(false));
  }, [router]);

  if (checking) return <div className="min-h-screen flex items-center justify-center bg-white"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div></div>;

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <MessageSquare className="w-8 h-8 text-blue-600" />
              <span className="ml-2 text-xl font-semibold text-gray-900">{t(c,'navbar','brand')}</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-700 hover:text-blue-600">{t(c,'navbar','link1')}</a>
              <a href="#how-it-works" className="text-gray-700 hover:text-blue-600">{t(c,'navbar','link4')}</a>
              <a href="#benefits" className="text-gray-700 hover:text-blue-600">{t(c,'navbar','link2')}</a>
              <a href="#contact" className="text-gray-700 hover:text-blue-600">{t(c,'navbar','link3')}</a>
              <Link href="/login" className="text-gray-700 hover:text-blue-600 font-medium">{t(c,'navbar','login')}</Link>
              <Link href="/register" className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                {t(c,'navbar','register')}
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-50 to-indigo-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-5xl font-bold text-gray-900 mb-6">
                {t(c,'hero','title').split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
              </h1>
              <p className="text-xl text-gray-700 mb-8">{t(c,'hero','subtitle')}</p>
              <div className="flex gap-4">
                <Link href="/register" className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 text-lg">
                  {t(c,'hero','cta_primary')}
                </Link>
                <a href="#features" className="border-2 border-blue-600 text-blue-600 px-8 py-3 rounded-lg hover:bg-blue-50 text-lg">
                  {t(c,'hero','cta_secondary')}
                </a>
              </div>
            </div>
            <div className="relative h-96 rounded-xl overflow-hidden shadow-2xl">
              <img src="https://images.unsplash.com/photo-1758691737543-09a1b2b715fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1080" alt="Team Collaboration" className="w-full h-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">{t(c,'features','title')}</h2>
            <p className="text-xl text-gray-600">{t(c,'features','subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { img: 'https://images.unsplash.com/photo-1760346546771-a81d986459ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', Icon: MessageSquare, title: t(c,'features','card1_title'), desc: t(c,'features','card1_desc') },
              { img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', Icon: BarChart3, title: t(c,'features','card2_title'), desc: t(c,'features','card2_desc') },
              { img: 'https://images.unsplash.com/photo-1759752393975-7ca7b302fcc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600', Icon: Zap, title: t(c,'features','card3_title'), desc: t(c,'features','card3_desc') },
            ].map((f, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow">
                <div className="h-48 mb-6 rounded-lg overflow-hidden">
                  <img src={f.img} alt={f.title} className="w-full h-full object-cover" />
                </div>
                <div className="flex items-center gap-3 mb-4">
                  <f.Icon className="w-6 h-6 text-blue-600" />
                  <h3 className="text-xl font-semibold text-gray-900">{f.title}</h3>
                </div>
                <p className="text-gray-600">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <HowItWorks />

      {/* Live Bot Demo Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <motion.div className="absolute top-20 left-20 w-96 h-96 bg-green-500/10 rounded-full blur-3xl" animate={{ scale: [1, 1.3, 1], opacity: [0.2, 0.4, 0.2] }} transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" animate={{ scale: [1.3, 1, 1.3], opacity: [0.3, 0.5, 0.3] }} transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }} />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div className="text-center mb-16" initial={{ opacity: 0, y: -30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
            <motion.div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
              <MessageSquare className="w-5 h-5 text-green-400" />
              <span className="text-white font-semibold">{t(c,'demo','badge')}</span>
            </motion.div>
            <h2 className="text-5xl font-bold text-white mb-6 leading-tight">
              {t(c,'demo','title')}
              <span className="block bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">{t(c,'demo','title_highlight')}</span>
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              {t(c,'demo','subtitle')}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
            {/* WhatsApp */}
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-green-500/20 backdrop-blur-sm border border-green-500/30 px-4 py-2 rounded-full mb-4">
                  <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                  <span className="text-green-300 font-semibold">{t(c,'demo','wa_badge')}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{t(c,'demo','wa_title')}</h3>
                <p className="text-gray-400">{t(c,'demo','wa_desc')}</p>
              </div>
              <WhatsAppMockup />
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-400" /> {t(c,'demo','wa_feat_title')}
                </h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  {[t(c,'demo','wa_feat1'), t(c,'demo','wa_feat2'), t(c,'demo','wa_feat3'), t(c,'demo','wa_feat4')].map((item, j) => (
                    <li key={j} className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-green-400 rounded-full"></div>{item}</li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Telegram */}
            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="space-y-6">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-blue-500/20 backdrop-blur-sm border border-blue-500/30 px-4 py-2 rounded-full mb-4">
                  <div className="w-3 h-3 bg-blue-400 rounded-full animate-pulse"></div>
                  <span className="text-blue-300 font-semibold">{t(c,'demo','tg_badge')}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{t(c,'demo','tg_title')}</h3>
                <p className="text-gray-400">{t(c,'demo','tg_desc')}</p>
              </div>
              <TelegramMockup />
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-blue-400" /> {t(c,'demo','tg_feat_title')}
                </h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  {[t(c,'demo','tg_feat1'), t(c,'demo','tg_feat2'), t(c,'demo','tg_feat3'), t(c,'demo','tg_feat4')].map((item, j) => (
                    <li key={j} className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>{item}</li>
                  ))}
                </ul>
              </div>
            </motion.div>

            {/* Instagram */}
            <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} className="space-y-6 lg:col-span-1 md:col-span-2 md:max-w-sm md:mx-auto">
              <div className="text-center">
                <div className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500/20 via-purple-500/20 to-orange-500/20 backdrop-blur-sm border border-pink-500/30 px-4 py-2 rounded-full mb-4">
                  <div className="w-3 h-3 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full animate-pulse"></div>
                  <span className="text-pink-300 font-semibold">{t(c,'demo','ig_badge')}</span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">{t(c,'demo','ig_title')}</h3>
                <p className="text-gray-400">{t(c,'demo','ig_desc')}</p>
              </div>
              <InstagramMockup />
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6">
                <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-pink-400" /> {t(c,'demo','ig_feat_title')}
                </h4>
                <ul className="space-y-2 text-sm text-gray-300">
                  {[t(c,'demo','ig_feat1'), t(c,'demo','ig_feat2'), t(c,'demo','ig_feat3'), t(c,'demo','ig_feat4')].map((item, j) => (
                    <li key={j} className="flex items-center gap-2"><div className="w-1.5 h-1.5 bg-pink-400 rounded-full"></div>{item}</li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </div>

          {/* Stats below demos */}
          <motion.div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }}>
            {[
              { value: t(c,'demo','stat1_value'), label: t(c,'demo','stat1_label') },
              { value: t(c,'demo','stat2_value'), label: t(c,'demo','stat2_label') },
              { value: t(c,'demo','stat3_value'), label: t(c,'demo','stat3_label') },
              { value: t(c,'demo','stat4_value'), label: t(c,'demo','stat4_label') },
            ].map((stat, index) => (
              <motion.div key={stat.label} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 text-center" whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }} transition={{ type: 'spring', stiffness: 300 }}>
                <div className="text-3xl font-bold bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent mb-2">{stat.value}</div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div className="mt-12 text-center" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ duration: 0.8, delay: 0.4 }} viewport={{ once: true }}>
            <motion.div whileHover={{ scale: 1.05, boxShadow: '0 20px 50px rgba(34, 197, 94, 0.4)' }} whileTap={{ scale: 0.95 }}>
              <Link href="/register" className="bg-gradient-to-r from-green-500 to-blue-600 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-2xl inline-block">
                {t(c,'demo','cta_button')}
              </Link>
            </motion.div>
            <p className="text-gray-400 text-sm mt-4">{t(c,'demo','cta_sub')}</p>
          </motion.div>
        </div>
      </section>

      {/* Benefits / Why MsgLoom */}
      <section id="benefits" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative h-96 rounded-xl overflow-hidden shadow-xl">
              <img src="https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" alt="Data Analytics" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-4xl font-bold text-gray-900 mb-6">{t(c,'why','title')}</h2>
              <div className="space-y-6">
                {[
                  { Icon: Shield, title: t(c,'why','card1_title'), desc: t(c,'why','card1_desc') },
                  { Icon: Users, title: t(c,'why','card2_title'), desc: t(c,'why','card2_desc') },
                  { Icon: Globe, title: t(c,'why','card3_title'), desc: t(c,'why','card3_desc') },
                ].map((f, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <f.Icon className="w-6 h-6 text-blue-600 flex-shrink-0 mt-1" />
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">{f.title}</h3>
                      <p className="text-gray-600">{f.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: t(c,'stats','stat1_value'), label: t(c,'stats','stat1_label') },
              { value: t(c,'stats','stat2_value'), label: t(c,'stats','stat2_label') },
              { value: t(c,'stats','stat3_value'), label: t(c,'stats','stat3_label') },
              { value: t(c,'stats','stat4_value'), label: t(c,'stats','stat4_label') },
            ].map((s, i) => (
              <div key={i}>
                <div className="text-5xl font-bold mb-2">{s.value}</div>
                <div className="text-xl opacity-90">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Setup Section */}
      <section className="py-20 bg-white relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="relative">
              <div className="relative h-96 rounded-2xl overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1653823815301-faf2f30db0bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" alt="Easy Setup" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/30 to-purple-600/30" />
              </div>
              <motion.div className="absolute -top-8 -right-8 bg-gradient-to-br from-orange-500 to-red-500 rounded-full p-6 shadow-2xl" animate={{ y: [0, -20, 0], rotate: [0, 5, 0, -5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                <Rocket className="w-12 h-12 text-white" />
              </motion.div>
            </motion.div>

            <motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
              <motion.div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-500 to-red-500 text-white px-4 py-2 rounded-full mb-6" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}>
                <Rocket className="w-5 h-5" />
                <span className="font-semibold">{t(c,'setup','badge')}</span>
              </motion.div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                {t(c,'setup','title')}
                <span className="block bg-gradient-to-r from-orange-500 to-red-500 bg-clip-text text-transparent">{t(c,'setup','title_highlight')}</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8">{t(c,'setup','subtitle')}</p>

              <div className="space-y-6">
                {[
                  { step: '1', Icon: Users, title: t(c,'setup','step1_title'), desc: t(c,'setup','step1_desc'), delay: 0 },
                  { step: '2', Icon: MessageSquare, title: t(c,'setup','step2_title'), desc: t(c,'setup','step2_desc'), delay: 0.2 },
                  { step: '3', Icon: TrendingUp, title: t(c,'setup','step3_title'), desc: t(c,'setup','step3_desc'), delay: 0.4 },
                ].map((item) => (
                  <motion.div key={item.step} className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors group" initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: item.delay, duration: 0.5 }} viewport={{ once: true }}>
                    <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg group-hover:scale-110 transition-transform">{item.step}</div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <item.Icon className="w-5 h-5 text-orange-600" />
                        <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
                      </div>
                      <p className="text-gray-600">{item.desc}</p>
                    </div>
                    <CheckCircle2 className="w-6 h-6 text-green-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </motion.div>
                ))}
              </div>

              <motion.div className="mt-8 flex items-center gap-3 bg-orange-50 border-2 border-orange-200 rounded-lg p-4" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.6 }} viewport={{ once: true }}>
                <Clock className="w-6 h-6 text-orange-600 flex-shrink-0" />
                <p className="text-orange-900 font-semibold">{t(c,'setup','timer')} <span className="text-2xl">{t(c,'setup','timer_bold')}</span></p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Money Back Guarantee */}
      <section className="py-20 bg-gradient-to-br from-green-50 to-emerald-100 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
              <motion.div className="inline-flex items-center gap-2 bg-white shadow-lg px-4 py-2 rounded-full mb-6" animate={{ y: [0, -10, 0] }} transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}>
                <BadgeCheck className="w-5 h-5 text-green-600" />
                <span className="font-semibold text-green-900">{t(c,'guarantee','badge')}</span>
              </motion.div>
              <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
                <span className="block">{t(c,'guarantee','title')}</span>
                <span className="block bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">{t(c,'guarantee','title_highlight')}</span>
              </h2>
              <p className="text-xl text-gray-700 mb-8">{t(c,'guarantee','description')}</p>
              <div className="space-y-4 mb-8">
                {[t(c,'guarantee','item1'), t(c,'guarantee','item2'), t(c,'guarantee','item3'), t(c,'guarantee','item4')].map((text, index) => (
                  <motion.div key={index} className="flex items-center gap-3" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.1, duration: 0.5 }} viewport={{ once: true }}>
                    <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
                    <span className="text-lg text-gray-800">{text}</span>
                  </motion.div>
                ))}
              </div>
              <motion.div className="bg-white rounded-2xl shadow-2xl p-6 border-2 border-green-600" whileHover={{ scale: 1.02 }} transition={{ type: 'spring', stiffness: 300 }}>
                <div className="flex items-center gap-4 mb-4">
                  <div className="bg-green-600 rounded-full p-3"><Shield className="w-8 h-8 text-white" /></div>
                  <div>
                    <div className="text-2xl font-bold text-gray-900">{t(c,'guarantee','trust_title')}</div>
                    <div className="text-sm text-gray-600">{t(c,'guarantee','trust_sub')}</div>
                  </div>
                </div>
                <p className="text-gray-700">{t(c,'guarantee','trust_desc')}</p>
              </motion.div>
            </motion.div>

            <motion.div className="relative" initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} viewport={{ once: true }}>
              <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl">
                <img src="https://images.unsplash.com/photo-1632961974688-fae53de3cabc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800" alt="Trust Guarantee" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent" />
              </div>
              <motion.div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full w-48 h-48 shadow-2xl flex flex-col items-center justify-center border-8 border-green-600" animate={{ rotate: [0, 360], scale: [1, 1.1, 1] }} transition={{ rotate: { duration: 20, repeat: Infinity, ease: 'linear' }, scale: { duration: 2, repeat: Infinity, ease: 'easeInOut' } }}>
                <div className="text-center">
                  <div className="text-5xl font-bold text-green-600 mb-1">5 GÜN</div>
                  <div className="text-sm font-semibold text-gray-900 uppercase">Garanti</div>
                  <div className="text-xs text-gray-600 mt-1">%100 İade</div>
                </div>
              </motion.div>
              <motion.div className="absolute -bottom-6 -left-6 bg-white rounded-xl shadow-2xl p-4 max-w-xs" animate={{ y: [0, -15, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
                <div className="flex gap-0.5 text-yellow-500 mb-2">★ ★ ★ ★ ★</div>
                <p className="text-sm text-gray-700 italic">&quot;{t(c,'guarantee','review_text')}&quot;</p>
                <p className="text-xs text-gray-500 mt-2">{t(c,'guarantee','review_author')}</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="contact" className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">{t(c,'cta','title')}</h2>
          <p className="text-xl text-gray-600 mb-8">{t(c,'cta','subtitle')}</p>
          <div className="flex gap-4 justify-center">
            <Link href="/register" className="bg-blue-600 text-white px-8 py-4 rounded-lg hover:bg-blue-700 text-lg font-semibold">
              {t(c,'cta','cta_primary')}
            </Link>
            <a href="#" className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg hover:bg-gray-50 text-lg font-semibold">
              {t(c,'cta','cta_secondary')}
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="border-t border-gray-700 pt-10 grid md:grid-cols-3 gap-10">
            <div>
              <h4 className="font-bold text-sm tracking-wider mb-4">{t(c,'footer','col1_title')}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><a href="#" className="hover:text-white">{t(c,'footer','col1_link1')}</a></li>
                <li><a href="#" className="hover:text-white">{t(c,'footer','col1_link2')}</a></li>
                <li><a href="#features" className="hover:text-white">{t(c,'footer','col1_link3')}</a></li>
                <li><a href="#" className="hover:text-white">{t(c,'footer','col1_link4')}</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm tracking-wider mb-4">{t(c,'footer','col2_title')}</h4>
              <ul className="space-y-3 text-gray-400">
                <li><Link href="/terms" className="hover:text-white">{t(c,'footer','col2_link1')}</Link></li>
                <li><Link href="/payment" className="hover:text-white">{t(c,'footer','col2_link2')}</Link></li>
                <li><Link href="/privacy" className="hover:text-white">{t(c,'footer','col2_link3')}</Link></li>
                <li><Link href="/privacy" className="hover:text-white">{t(c,'footer','col2_link4')}</Link></li>
                <li><Link href="/cookies" className="hover:text-white">{t(c,'footer','col2_link5')}</Link></li>
                <li><Link href="/security" className="hover:text-white">{t(c,'footer','col2_link6')}</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm tracking-wider mb-4">{t(c,'footer','col3_title')}</h4>
              <ul className="space-y-3 text-gray-400">
                <li>{t(c,'footer','col3_line1')}</li>
                <li>{t(c,'footer','col3_line2')}</li>
                <li>{t(c,'footer','col3_line3')}</li>
              </ul>
              <p className="mt-6 text-sm font-semibold text-gray-300">{t(c,'footer','col3_payments')}</p>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-10 pt-8 text-center text-gray-400 text-sm">
            <p>{t(c,'footer','copyright')}</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
