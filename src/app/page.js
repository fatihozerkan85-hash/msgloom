'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { FadeIn, StaggerContainer, StaggerItem, ScaleIn, FloatingCard, SlideInCard, PulseGlow } from '@/components/AnimatedSection';
import LiveDemoSection from '@/components/ChatMockup';
import { useContent, t } from '@/lib/useContent';
import { MessageSquare, BarChart3, Zap, Shield, Users, Globe, UserPlus, TrendingUp, Rocket, Clock, CheckCircle, ArrowRight, MessageCircle } from 'lucide-react';

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
    <div className="min-h-screen bg-white overflow-x-hidden">
      {/* Navbar */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="fixed top-0 w-full bg-white/95 backdrop-blur-md z-50 border-b border-gray-100"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
          <motion.div className="flex items-center gap-2" whileHover={{ scale: 1.05 }}>
            <MessageSquare className="w-6 h-6 text-blue-600" strokeWidth={1.5} />
            <span className="text-xl font-bold text-gray-900">{t(c,'navbar','brand')}</span>
          </motion.div>
          <div className="hidden md:flex items-center gap-8 text-sm text-gray-600">
            <a href="#features" className="hover:text-blue-600 transition">{t(c,'navbar','link1')}</a>
            <a href="#benefits" className="hover:text-blue-600 transition">{t(c,'navbar','link2')}</a>
            <a href="#contact" className="hover:text-blue-600 transition">{t(c,'navbar','link3')}</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm text-gray-700 hover:text-blue-600 font-medium px-4 py-2 hidden md:inline-block">{t(c,'navbar','login')}</Link>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/register" className="text-sm bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-blue-700 transition">
                {t(c,'navbar','register')}
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.nav>

      {/* Hero */}
      <section className="pt-28 pb-20 px-6 bg-gradient-to-b from-blue-50 to-white">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <FadeIn delay={0.1}>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 leading-tight mb-6">
                {t(c,'hero','title').split('\n').map((line, i) => <span key={i}>{line}<br /></span>)}
              </h1>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                {t(c,'hero','subtitle')}
              </p>
            </FadeIn>
            <FadeIn delay={0.3}>
              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link href="/register" className="bg-blue-600 text-white px-7 py-3.5 rounded-lg font-medium hover:bg-blue-700 transition inline-block">
                    {t(c,'hero','cta_primary')}
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <a href="#features" className="border border-gray-300 text-gray-700 px-7 py-3.5 rounded-lg font-medium hover:border-blue-400 hover:text-blue-600 transition inline-block">
                    {t(c,'hero','cta_secondary')}
                  </a>
                </motion.div>
              </div>
            </FadeIn>
          </div>
          <FadeIn direction="left" delay={0.2}>
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
              <img src="https://images.unsplash.com/photo-1758691737543-09a1b2b715fa?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                alt="Team Collaboration" className="rounded-2xl shadow-xl w-full" />
            </motion.div>
          </FadeIn>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{t(c,'features','title')}</h2>
            <p className="text-gray-600">{t(c,'features','subtitle')}</p>
          </FadeIn>
          <StaggerContainer className="grid md:grid-cols-3 gap-8" staggerDelay={0.15}>
            {[
              {
                img: 'https://images.unsplash.com/photo-1760346546771-a81d986459ff?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
                Icon: MessageSquare, title: t(c,'features','card1_title'),
                desc: t(c,'features','card1_desc')
              },
              {
                img: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
                Icon: BarChart3, title: t(c,'features','card2_title'),
                desc: t(c,'features','card2_desc')
              },
              {
                img: 'https://images.unsplash.com/photo-1759752393975-7ca7b302fcc6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600',
                Icon: Zap, title: t(c,'features','card3_title'),
                desc: t(c,'features','card3_desc')
              }
            ].map((f, i) => (
              <StaggerItem key={i}>
                <motion.div whileHover={{ y: -8, boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }} transition={{ duration: 0.3 }}
                  className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
                  <div className="h-52 overflow-hidden">
                    <motion.img whileHover={{ scale: 1.08 }} transition={{ duration: 0.5 }}
                      src={f.img} alt={f.title} className="w-full h-full object-cover" />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-2 mb-2">
                      <f.Icon className="w-5 h-5 text-blue-600" strokeWidth={1.5} />
                      <h3 className="font-bold text-gray-900">{f.title}</h3>
                    </div>
                    <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                  </div>
                </motion.div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </div>
      </section>

      {/* Live Demo - Chat Mockups */}
      <LiveDemoSection />

      {/* Sales Conversion */}
      <section id="benefits" className="py-20 px-6 bg-blue-600">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <FadeIn>
              <motion.span
                animate={{ boxShadow: ['0 0 0px rgba(250,204,21,0)', '0 0 20px rgba(250,204,21,0.4)', '0 0 0px rgba(250,204,21,0)'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex items-center gap-2 bg-yellow-400 text-gray-900 text-sm font-medium px-4 py-1.5 rounded-full mb-6"
              >
                <TrendingUp className="w-4 h-4" strokeWidth={2} /> {t(c,'sales','badge')}
              </motion.span>
            </FadeIn>
            <FadeIn delay={0.1}>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-tight">
                {t(c,'sales','title')}<br />
                <motion.span
                  animate={{ color: ['#fde047', '#fbbf24', '#fde047'] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="text-yellow-300"
                >{t(c,'sales','title_highlight')}</motion.span>
              </h2>
            </FadeIn>
            <FadeIn delay={0.2}>
              <p className="text-blue-100 mb-8 leading-relaxed">
                {t(c,'sales','description')}
              </p>
            </FadeIn>

            <StaggerContainer className="space-y-3 mb-8" staggerDelay={0.1}>
              {[
                { value: t(c,'sales','stat1_value'), label: t(c,'sales','stat1_label'), sub: t(c,'sales','stat1_sub') },
                { value: t(c,'sales','stat2_value'), label: t(c,'sales','stat2_label'), sub: t(c,'sales','stat2_sub') },
                { value: t(c,'sales','stat3_value'), label: t(c,'sales','stat3_label'), sub: t(c,'sales','stat3_sub') },
              ].map((s, i) => (
                <StaggerItem key={i}>
                  <motion.div
                    whileHover={{ x: 8, backgroundColor: 'rgba(255,255,255,0.2)' }}
                    transition={{ duration: 0.2 }}
                    className="flex items-center justify-between bg-white/10 backdrop-blur-sm rounded-xl px-5 py-4 cursor-pointer border border-white/10"
                  >
                    <div className="flex items-center gap-4">
                      <motion.span
                        whileHover={{ scale: 1.1 }}
                        className="bg-orange-500 text-white text-sm font-bold px-3 py-1.5 rounded-lg shadow-lg shadow-orange-500/30"
                      >{s.value}</motion.span>
                      <div>
                        <p className="text-white font-medium text-sm">{s.label}</p>
                        <p className="text-blue-200 text-xs">{s.sub}</p>
                      </div>
                    </div>
                    <motion.div animate={{ x: [0, 4, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}>
                      <ArrowRight className="w-4 h-4 text-blue-200" strokeWidth={1.5} />
                    </motion.div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <FadeIn delay={0.4}>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="/register" className="inline-block border-2 border-white text-white px-7 py-3 rounded-lg font-medium hover:bg-white hover:text-blue-600 transition">
                  {t(c,'sales','cta')}
                </Link>
              </motion.div>
            </FadeIn>
          </div>

          <FadeIn direction="left" delay={0.2}>
            <div className="relative">
              <motion.img
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                src="https://images.unsplash.com/photo-1758691736484-4914d363a3cc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                alt="Sales Growth" className="rounded-2xl w-full shadow-2xl"
              />

              {/* Yeni Mesaj - floating card */}
              <SlideInCard className="absolute -top-4 -right-4 md:top-4 md:right-4 z-10" delay={0.8} direction="right">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="bg-white rounded-xl shadow-xl p-4 max-w-[220px] border border-gray-100"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <motion.span
                      animate={{ scale: [1, 1.15, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                      className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-green-500/30"
                    >
                      <MessageCircle className="w-4 h-4" strokeWidth={1.5} />
                    </motion.span>
                    <div>
                      <p className="text-xs font-bold text-gray-900">Yeni Mesaj</p>
                      <p className="text-xs text-gray-500">WhatsApp</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600">&quot;Ürününüz hakkında bilgi alabilir miyim?&quot;</p>
                </motion.div>
              </SlideInCard>

              {/* Satış Tamamlandı - floating card with green border */}
              <SlideInCard className="absolute -bottom-4 -right-4 md:bottom-4 md:right-4 z-10" delay={1.2} direction="right">
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="bg-green-500 rounded-xl shadow-xl p-4 text-white border-2 border-green-300"
                >
                  <motion.div
                    animate={{ boxShadow: ['0 0 0px rgba(34,197,94,0)', '0 0 25px rgba(34,197,94,0.5)', '0 0 0px rgba(34,197,94,0)'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                    className="rounded-xl"
                  >
                    <p className="text-xs font-medium flex items-center gap-1">
                      <motion.span animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                        <TrendingUp className="w-3 h-3" strokeWidth={2} />
                      </motion.span>
                      Satış Tamamlandı!
                    </p>
                    <motion.p
                      initial={{ opacity: 0, scale: 0.5 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 1.5, type: 'spring', stiffness: 200 }}
                      className="text-2xl font-bold"
                    >₺2,450</motion.p>
                    <p className="text-xs text-green-100">+%35 bu hafta</p>
                  </motion.div>
                </motion.div>
              </SlideInCard>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Why MsgLoom */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn direction="right">
            <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
              <img src="https://images.unsplash.com/photo-1759661966728-4a02e3c6ed91?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                alt="Data Analytics" className="rounded-2xl shadow-xl w-full" />
            </motion.div>
          </FadeIn>
          <div>
            <FadeIn>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">{t(c,'why','title')}</h2>
            </FadeIn>
            <StaggerContainer className="space-y-6" staggerDelay={0.15}>
              {[
                { Icon: Shield, title: t(c,'why','card1_title'), desc: t(c,'why','card1_desc') },
                { Icon: Users, title: t(c,'why','card2_title'), desc: t(c,'why','card2_desc') },
                { Icon: Globe, title: t(c,'why','card3_title'), desc: t(c,'why','card3_desc') },
              ].map((f, i) => (
                <StaggerItem key={i}>
                  <motion.div whileHover={{ x: 8 }} transition={{ duration: 0.2 }} className="flex items-start gap-4 group cursor-pointer">
                    <motion.div whileHover={{ scale: 1.2, rotate: 5 }} className="mt-0.5 shrink-0">
                      <f.Icon className="w-6 h-6 text-blue-600 group-hover:text-blue-700 transition" strokeWidth={1.5} />
                    </motion.div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">{f.title}</h3>
                      <p className="text-gray-600 text-sm leading-relaxed">{f.desc}</p>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </section>

      {/* Stats Banner */}
      <section className="py-12 px-6 bg-blue-600">
        <StaggerContainer className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center" staggerDelay={0.1}>
          {[
            { value: t(c,'stats','stat1_value'), label: t(c,'stats','stat1_label') },
            { value: t(c,'stats','stat2_value'), label: t(c,'stats','stat2_label') },
            { value: t(c,'stats','stat3_value'), label: t(c,'stats','stat3_label') },
            { value: t(c,'stats','stat4_value'), label: t(c,'stats','stat4_label') },
          ].map((s, i) => (
            <StaggerItem key={i}>
              <ScaleIn delay={i * 0.1}>
                <motion.p
                  whileHover={{ scale: 1.1 }}
                  className="text-3xl md:text-4xl font-bold text-white"
                >{s.value}</motion.p>
                <p className="text-blue-200 text-sm mt-1">{s.label}</p>
              </ScaleIn>
            </StaggerItem>
          ))}
        </StaggerContainer>
      </section>

      {/* Setup Steps */}
      <section id="setup" className="py-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <FadeIn direction="right">
            <div className="relative">
              <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                <img src="https://images.unsplash.com/photo-1653823815301-faf2f30db0bd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                  alt="Easy Setup" className="rounded-2xl shadow-xl w-full" />
              </motion.div>
              {/* Floating Rocket Badge */}
              <SlideInCard className="absolute -top-4 -right-4 md:top-4 md:right-4 z-10" delay={0.5} direction="right">
                <motion.div
                  animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                  className="w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-xl shadow-orange-500/30"
                >
                  <Rocket className="w-6 h-6 text-white" strokeWidth={1.5} />
                </motion.div>
              </SlideInCard>
            </div>
          </FadeIn>
          <div>
            <FadeIn>
              <motion.span
                animate={{ boxShadow: ['0 0 0px rgba(249,115,22,0)', '0 0 15px rgba(249,115,22,0.3)', '0 0 0px rgba(249,115,22,0)'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                className="inline-flex items-center gap-2 bg-orange-500 text-white text-sm font-medium px-4 py-1.5 rounded-full mb-6"
              >
                <Rocket className="w-4 h-4" strokeWidth={2} /> {t(c,'setup','badge')}
              </motion.span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">{t(c,'setup','title')}</h2>
              <h2 className="text-3xl md:text-4xl font-bold text-orange-500 mb-6">{t(c,'setup','title_highlight')}</h2>
              <p className="text-gray-600 mb-8">{t(c,'setup','subtitle')}</p>
            </FadeIn>

            <StaggerContainer className="space-y-6 mb-8" staggerDelay={0.15}>
              {[
                { Icon: UserPlus, title: t(c,'setup','step1_title'), desc: t(c,'setup','step1_desc') },
                { Icon: MessageSquare, title: t(c,'setup','step2_title'), desc: t(c,'setup','step2_desc') },
                { Icon: TrendingUp, title: t(c,'setup','step3_title'), desc: t(c,'setup','step3_desc') },
              ].map((s, i) => (
                <StaggerItem key={i}>
                  <motion.div whileHover={{ x: 8 }} transition={{ duration: 0.2 }} className="flex items-start gap-4">
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 10 }}
                      className="w-10 h-10 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-lg shadow-orange-500/20"
                    >{i + 1}</motion.div>
                    <div>
                      <div className="flex items-center gap-2">
                        <s.Icon className="w-4 h-4 text-orange-500" strokeWidth={1.5} />
                        <h3 className="font-bold text-gray-900">{s.title}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mt-0.5">{s.desc}</p>
                    </div>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <FadeIn delay={0.5}>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white rounded-2xl px-6 py-4 inline-flex items-center gap-3 shadow-md border border-gray-100"
              >
                <Clock className="w-5 h-5 text-gray-500" strokeWidth={1.5} />
                <p className="text-base text-gray-700">{t(c,'setup','timer')} <span className="font-extrabold text-gray-900 text-lg">{t(c,'setup','timer_bold')}</span></p>
              </motion.div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Guarantee */}
      <section id="guarantee" className="py-20 px-6 bg-green-50">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <FadeIn>
              <span className="inline-flex items-center gap-2 border border-gray-300 text-gray-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                <CheckCircle className="w-4 h-4 text-green-600" strokeWidth={1.5} /> {t(c,'guarantee','badge')}
              </span>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 leading-tight">{t(c,'guarantee','title')}</h2>
              <h2 className="text-3xl md:text-4xl font-bold text-green-600 mb-6 leading-tight">{t(c,'guarantee','title_highlight')}</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                {t(c,'guarantee','description')}
              </p>
            </FadeIn>

            <StaggerContainer className="space-y-3 mb-8" staggerDelay={0.1}>
              {[
                t(c,'guarantee','item1'),
                t(c,'guarantee','item2'),
                t(c,'guarantee','item3'),
                t(c,'guarantee','item4'),
              ].map((item, i) => (
                <StaggerItem key={i}>
                  <motion.div whileHover={{ x: 6 }} className="flex items-center gap-3 cursor-pointer">
                    <motion.span initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                      transition={{ delay: i * 0.1, type: 'spring', stiffness: 200 }}>
                      <CheckCircle className="w-5 h-5 text-green-500" strokeWidth={1.5} />
                    </motion.span>
                    <span className="text-gray-700">{item}</span>
                  </motion.div>
                </StaggerItem>
              ))}
            </StaggerContainer>

            <ScaleIn delay={0.3}>
              <motion.div whileHover={{ scale: 1.03 }} className="bg-white rounded-2xl p-5 border border-gray-100 inline-block shadow-sm">
                <div className="flex items-center gap-3 mb-2">
                  <span className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <Shield className="w-5 h-5 text-green-600" strokeWidth={1.5} />
                  </span>
                  <div>
                    <p className="font-bold text-gray-900">{t(c,'guarantee','trust_title')}</p>
                    <p className="text-xs text-gray-500">{t(c,'guarantee','trust_sub')}</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600">{t(c,'guarantee','trust_desc')}</p>
              </motion.div>
            </ScaleIn>
          </div>

          <FadeIn direction="left" delay={0.2}>
            <div className="relative">
              <img src="https://images.unsplash.com/photo-1632961974688-fae53de3cabc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=800"
                alt="Trust Guarantee" className="rounded-2xl shadow-xl w-full" />

              {/* 5 GÜN GARANTİ floating badge */}
              <SlideInCard className="absolute top-4 right-4 z-10" delay={0.6} direction="right">
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
                  className="bg-blue-600 text-white rounded-xl shadow-xl px-5 py-3 text-center"
                >
                  <p className="text-xs font-bold tracking-wide">5 GÜN GARANTİ</p>
                  <p className="text-sm font-bold">%100 İade</p>
                </motion.div>
              </SlideInCard>

              {/* Review floating card */}
              <SlideInCard className="absolute -bottom-4 -left-4 md:bottom-6 md:left-6 z-10" delay={0.9} direction="left">
                <motion.div
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                  className="bg-white rounded-xl shadow-xl p-4 max-w-[250px] border border-gray-100"
                >
                  <div className="flex gap-0.5 text-yellow-400 mb-2">★ ★ ★ ★ ★</div>
                  <p className="text-xs text-gray-600 italic mb-2">&quot;İlk günden satışlarım arttı. Kesinlikle denemeye değer!&quot;</p>
                  <p className="text-xs text-gray-400">- Ahmet K., E-ticaret</p>
                </motion.div>
              </SlideInCard>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-gray-900">
        <FadeIn className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">{t(c,'cta','title')}</h2>
          <p className="text-gray-400 text-lg mb-8">{t(c,'cta','subtitle')}</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link href="/register" className="bg-blue-600 text-white px-8 py-3.5 rounded-lg font-medium hover:bg-blue-700 transition inline-block">
                {t(c,'cta','cta_primary')}
              </Link>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <a href="#" className="border border-gray-600 text-gray-300 px-8 py-3.5 rounded-lg font-medium hover:border-blue-400 hover:text-blue-400 transition inline-block">
                {t(c,'cta','cta_secondary')}
              </a>
            </motion.div>
          </div>
        </FadeIn>
      </section>

      {/* Footer */}
      <footer className="py-16 px-6 bg-gray-950 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-12 mb-12">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <MessageSquare className="w-5 h-5 text-blue-400" strokeWidth={1.5} />
                <span className="text-lg font-bold text-white">MsgLoom</span>
              </div>
              <p className="text-sm leading-relaxed">WhatsApp & Telegram mesajlaşma yönetiminde güvenilir çözüm ortağınız.</p>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-4">Ürün</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#features" className="hover:text-white transition">Özellikler</a></li>
                <li><a href="#" className="hover:text-white transition">Fiyatlandırma</a></li>
                <li><a href="#" className="hover:text-white transition">Demo</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-4">Şirket</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Hakkımızda</a></li>
                <li><a href="#" className="hover:text-white transition">Blog</a></li>
                <li><a href="#" className="hover:text-white transition">Kariyer</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-white text-sm mb-4">Destek</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white transition">Yardım Merkezi</a></li>
                <li><a href="#" className="hover:text-white transition">İletişim</a></li>
                <li><a href="#" className="hover:text-white transition">Gizlilik</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>© 2026 MsgLoom. Tüm hakları saklıdır.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
