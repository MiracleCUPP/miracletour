import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Trophy, Users, Shield, Zap, ChevronRight, Sparkles, Target, Award, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tournament, News } from '../types';
import { getActiveTournaments, getNews } from '../utils/storage';
import TournamentCard from '../components/TournamentCard';
import NewsCard from '../components/NewsCard';
import PricingSection from '../components/PricingSection';
import AnimatedSection from '../components/AnimatedSection';

const Home: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [news, setNews] = useState<News[]>([]);

  useEffect(() => {
    Promise.all([getActiveTournaments(), getNews()])
      .then(([t, n]) => {
        setTournaments(t.slice(0, 3));
        setNews(n.slice(0, 3));
      })
      .catch(console.error);
  }, []);

  const advantages = [
    { icon: <Trophy className="w-6 h-6" />, title: 'Профессиональная организация', description: 'Многолетний опыт проведения турниров различного уровня', gradient: 'from-yellow-500 to-orange-500' },
    { icon: <Users className="w-6 h-6" />, title: 'Широкая аудитория', description: 'Тысячи активных игроков и зрителей на наших турнирах', gradient: 'from-blue-500 to-cyan-500' },
    { icon: <Shield className="w-6 h-6" />, title: 'Надежность', description: 'Гарантируем честные матчи и своевременные выплаты', gradient: 'from-green-500 to-emerald-500' },
    { icon: <Zap className="w-6 h-6" />, title: 'Быстрая поддержка', description: 'Оперативная помощь организаторам и участникам 24/7', gradient: 'from-purple-500 to-pink-500' }
  ];

  return (
    <div className="min-h-screen bg-black overflow-hidden">

      {/* ── Hero ─────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-gray-900 via-black to-black" />

          {/* Grid */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute inset-0" style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)`,
              backgroundSize: '100px 100px'
            }} />
          </div>

          {/* Orbs */}
          <motion.div animate={{ scale: [1,1.3,1], opacity: [0.15,0.3,0.15], x: [0,50,0], y: [0,-30,0] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 left-1/4 w-[300px] sm:w-[600px] h-[300px] sm:h-[600px] bg-gradient-to-r from-white/20 to-gray-500/20 rounded-full blur-[120px]" />
          <motion.div animate={{ scale: [1.2,1,1.2], opacity: [0.1,0.25,0.1], x: [0,-40,0], y: [0,40,0] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute bottom-1/4 right-1/4 w-[300px] sm:w-[700px] h-[300px] sm:h-[700px] bg-gradient-to-r from-gray-400/15 to-white/15 rounded-full blur-[150px]" />

          {/* Glowing SVG lines */}
          <svg className="absolute inset-0 w-full h-full opacity-20" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="white" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            <motion.line x1="0" y1="30%" x2="100%" y2="30%" stroke="url(#lineGradient)" strokeWidth="1"
              animate={{ opacity: [0, 0.5, 0] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }} />
            <motion.line x1="0" y1="70%" x2="100%" y2="70%" stroke="url(#lineGradient)" strokeWidth="1"
              animate={{ opacity: [0, 0.5, 0] }} transition={{ duration: 3, repeat: Infinity, repeatDelay: 3, delay: 1 }} />
          </svg>

          {/* Floating particles — fewer on mobile for perf */}
          <div className="absolute inset-0 hidden sm:block">
            {[...Array(20)].map((_, i) => (
              <motion.div key={i} className="absolute w-1 h-1 bg-white/30 rounded-full"
                style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                animate={{ y: [-20, 20, -20], opacity: [0.2, 0.6, 0.2], scale: [1, 1.5, 1] }}
                transition={{ duration: 3 + Math.random() * 4, repeat: Infinity, delay: Math.random() * 2, ease: 'easeInOut' }} />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="relative w-full px-4 sm:px-6 lg:px-8 py-24 sm:py-32">
          <div className="max-w-5xl mx-auto text-center">

            {/* Badge */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <span className="inline-flex items-center px-4 py-2 rounded-full bg-gradient-to-r from-white/10 to-white/5 text-white/90 text-xs sm:text-sm font-medium mb-6 sm:mb-8 backdrop-blur-xl border border-white/20">
                <Sparkles size={14} className="mr-2 text-yellow-400" />
                Турнирная платформа #1
                <span className="ml-2 w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              </span>
            </motion.div>

            {/* Title */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.1 }} className="relative">
              <h1 className="text-5xl sm:text-7xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white via-white to-white/40 mb-2 tracking-tight relative z-10">
                MIRACLE
              </h1>
              <div className="absolute inset-0 text-5xl sm:text-7xl lg:text-9xl font-black text-white/20 blur-2xl -z-10 flex items-center justify-center">
                MIRACLE
              </div>
            </motion.div>

            {/* Subtitle */}
            <motion.p initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }}
              className="text-base sm:text-xl lg:text-2xl text-white/60 mb-8 sm:mb-10 max-w-2xl mx-auto leading-relaxed px-2">
              Организация киберспортивных турниров нового поколения.{' '}
              <span className="text-white font-semibold">Создаем незабываемые соревнования</span> для игроков всех уровней.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4 sm:px-0">
              <Link to="/tournaments"
                className="w-full sm:w-auto group relative px-7 py-4 bg-white text-black font-bold rounded-2xl overflow-hidden transition-all duration-300 flex items-center justify-center space-x-2 shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_60px_rgba(255,255,255,0.5)] hover:scale-105 text-sm sm:text-base">
                <span className="relative z-10">Смотреть турниры</span>
                <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/apply"
                className="w-full sm:w-auto group px-7 py-4 bg-white/5 text-white font-bold rounded-2xl hover:bg-white/10 transition-all duration-300 backdrop-blur-xl border border-white/20 hover:border-white/40 flex items-center justify-center space-x-2 hover:scale-105 text-sm sm:text-base">
                <Rocket size={18} className="group-hover:rotate-12 transition-transform" />
                <span>Разместить турнир</span>
              </Link>
            </motion.div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-32 sm:h-40 bg-gradient-to-t from-black to-transparent" />
      </section>

      {/* ── Advantages ───────────────────────────── */}
      <section className="relative py-16 sm:py-24 lg:py-40">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black" />
          <motion.div animate={{ opacity: [0.1, 0.2, 0.1] }} transition={{ duration: 5, repeat: Infinity }}
            className="absolute top-1/2 left-0 w-1/2 h-1/2 bg-gradient-to-r from-white/10 to-transparent blur-[100px]" />
        </div>

        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-12 sm:mb-20">
            <motion.span className="inline-flex items-center px-4 py-2 rounded-full bg-white/10 text-white/80 text-xs sm:text-sm font-medium mb-4 sm:mb-6 backdrop-blur-sm border border-white/10"
              whileHover={{ scale: 1.05 }}>
              <Target size={14} className="mr-2" />Почему мы
            </motion.span>
            <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
              Преимущества <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/60">Miracle</span>
            </h2>
            <p className="text-white/60 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto px-2">
              Мы создаем лучшие условия для организаторов и участников турниров
            </p>
          </AnimatedSection>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {advantages.map((adv, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <motion.div className="group relative p-6 sm:p-8 rounded-3xl bg-gradient-to-b from-white/10 to-white/5 border border-white/10 hover:border-white/20 transition-all duration-500 h-full overflow-hidden"
                  whileHover={{ y: -6 }}>
                  <div className={`absolute inset-0 bg-gradient-to-b ${adv.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500 blur-xl`} />
                  <div className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br ${adv.gradient} flex items-center justify-center text-white mb-5 sm:mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {adv.icon}
                  </div>
                  <h3 className="relative text-lg sm:text-xl font-bold text-white mb-2 sm:mb-3">{adv.title}</h3>
                  <p className="relative text-white/60 text-sm sm:text-base">{adv.description}</p>
                  <div className={`absolute -bottom-10 -right-10 w-32 h-32 bg-gradient-to-br ${adv.gradient} opacity-10 rounded-full blur-2xl group-hover:opacity-20 transition-opacity`} />
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* ── Tournaments ──────────────────────────── */}
      {tournaments.length > 0 && (
        <section className="relative py-16 sm:py-24 lg:py-40">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-black to-gray-900/30" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          <div className="relative w-full px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 sm:mb-16 gap-4">
              <div>
                <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 text-xs sm:text-sm font-medium mb-3 sm:mb-4 border border-yellow-500/20">
                  <Trophy size={14} className="mr-2" />Активные турниры
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Ближайшие соревнования</h2>
              </div>
              <Link to="/tournaments"
                className="flex items-center px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all group text-sm sm:text-base flex-shrink-0">
                <span>Все турниры</span>
                <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
              {tournaments.map((tournament, index) => (
                <TournamentCard key={tournament.id} tournament={tournament} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── News ─────────────────────────────────── */}
      {news.length > 0 && (
        <section className="relative py-16 sm:py-24 lg:py-40">
          <div className="absolute inset-0">
            <div className="absolute inset-0 bg-gradient-to-b from-gray-900/30 to-black" />
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          </div>

          <div className="relative w-full px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-10 sm:mb-16 gap-4">
              <div>
                <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-gradient-to-r from-blue-500/20 to-cyan-500/20 text-blue-400 text-xs sm:text-sm font-medium mb-3 sm:mb-4 border border-blue-500/20">
                  <Sparkles size={14} className="mr-2" />Новости
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">Последние обновления</h2>
              </div>
              <Link to="/news"
                className="flex items-center px-5 py-2.5 sm:px-6 sm:py-3 rounded-xl bg-white/5 border border-white/10 text-white/80 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all group text-sm sm:text-base flex-shrink-0">
                <span>Все новости</span>
                <ChevronRight size={18} className="ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </AnimatedSection>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-8">
              {news.map((item, index) => (
                <NewsCard key={item.id} news={item} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Pricing ──────────────────────────────── */}
      <div className="relative">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        <PricingSection />
      </div>

      {/* ── CTA ──────────────────────────────────── */}
      <section className="relative py-16 sm:py-24 lg:py-40 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-gray-900/50 to-black" />
          <motion.div animate={{ scale: [1,1.2,1], opacity: [0.1,0.2,0.1] }} transition={{ duration: 10, repeat: Infinity }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] sm:w-[800px] h-[400px] sm:h-[800px] bg-white/10 rounded-full blur-[150px]" />
        </div>

        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <AnimatedSection>
            <div className="relative rounded-2xl sm:rounded-[2rem] overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-white/5 to-transparent" />
              <div className="absolute inset-0 backdrop-blur-xl" />
              <div className="absolute inset-[1px] rounded-2xl sm:rounded-[2rem] bg-gradient-to-br from-gray-900 to-black" />

              {/* Animated border */}
              <div className="absolute inset-0 rounded-2xl sm:rounded-[2rem] p-[1px] overflow-hidden">
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                  className="absolute inset-[-100%] bg-[conic-gradient(from_0deg,transparent_0deg,white_10deg,transparent_20deg)]" />
              </div>

              <motion.div animate={{ x: [0,100,0], y: [0,-50,0] }} transition={{ duration: 15, repeat: Infinity }}
                className="absolute top-0 left-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-white/20 rounded-full blur-[100px]" />
              <motion.div animate={{ x: [0,-100,0], y: [0,50,0] }} transition={{ duration: 12, repeat: Infinity }}
                className="absolute bottom-0 right-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-white/10 rounded-full blur-[100px]" />

              <div className="relative py-14 sm:py-20 lg:py-32 px-6 sm:px-8 lg:px-16 text-center">
                <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} viewport={{ once: true }}
                  className="w-14 h-14 sm:w-20 sm:h-20 mx-auto mb-6 sm:mb-8 rounded-2xl bg-gradient-to-br from-white to-gray-400 flex items-center justify-center shadow-[0_0_60px_rgba(255,255,255,0.3)]">
                  <Rocket size={28} className="text-black sm:hidden" />
                  <Rocket size={40} className="text-black hidden sm:block" />
                </motion.div>

                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold text-white mb-4 sm:mb-6">
                  Готовы провести свой турнир?
                </h2>
                <p className="text-white/60 text-base sm:text-lg lg:text-xl mb-8 sm:mb-10 max-w-2xl mx-auto">
                  Подайте заявку сегодня и получите профессиональную поддержку на каждом этапе
                </p>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
                  <Link to="/apply"
                    className="w-full sm:w-auto group relative px-8 py-4 bg-white text-black font-bold rounded-2xl overflow-hidden transition-all duration-300 flex items-center justify-center shadow-[0_0_40px_rgba(255,255,255,0.3)] hover:shadow-[0_0_80px_rgba(255,255,255,0.5)] hover:scale-105 text-sm sm:text-base">
                    <span className="relative z-10">Подать заявку</span>
                    <ArrowRight size={18} className="relative z-10 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link to="/about"
                    className="w-full sm:w-auto px-8 py-4 text-white/80 hover:text-white font-medium transition-colors text-center text-sm sm:text-base">
                    Узнать больше →
                  </Link>
                </div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Home;
