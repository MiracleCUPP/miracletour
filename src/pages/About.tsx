import React from 'react';
import { Send, Mail, Trophy, Users, Calendar, Award, ExternalLink, Sparkles, Shield, Zap, Target, Heart, Star } from 'lucide-react';
import AnimatedSection from '../components/AnimatedSection';
import { motion } from 'framer-motion';

const About: React.FC = () => {
  const stats = [
    { icon: <Trophy size={28} />, value: '0', label: 'Турниров проведено', color: 'from-yellow-500/20 to-orange-500/20' },
    { icon: <Users size={28} />, value: '0', label: 'Команд участвовало', color: 'from-blue-500/20 to-cyan-500/20' },
    { icon: <Calendar size={28} />, value: '0', label: 'Лет опыта', color: 'from-purple-500/20 to-pink-500/20' },
    { icon: <Award size={28} />, value: '0₽', label: 'Выплачено призовых', color: 'from-green-500/20 to-emerald-500/20' }
  ];

  const team = [
    {
      role: 'Основатель',
      description: 'Идейный вдохновитель и организатор Miracle',
      icon: Star,
      gradient: 'from-yellow-500 to-orange-500'
    },
    {
      role: 'Администратор',
      description: 'Управление турнирами и работа с организаторами',
      icon: Shield,
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      role: 'Разработчик',
      description: 'Техническая поддержка и развитие платформы',
      icon: Zap,
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  const values = [
    { icon: Target, title: 'Качество', description: 'Высокие стандарты во всём' },
    { icon: Shield, title: 'Надёжность', description: 'Честные турниры и выплаты' },
    { icon: Heart, title: 'Забота', description: 'Индивидуальный подход' },
    { icon: Zap, title: 'Скорость', description: 'Быстрая поддержка 24/7' },
  ];

  return (
    <div className="min-h-screen bg-black pt-20 lg:pt-24">
      {/* Hero */}
      <section className="relative py-24 lg:py-40 border-b border-white/5 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-white/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-white/3 rounded-full blur-[100px]"></div>
        </div>
        
        {/* Animated Grid */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at center, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '40px 40px'
          }}></div>
        </div>

        {/* Floating Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-white/20 rounded-full"
              style={{
                left: `${15 + i * 15}%`,
                top: `${20 + (i % 3) * 25}%`,
              }}
              animate={{
                y: [0, -30, 0],
                opacity: [0.2, 0.5, 0.2],
              }}
              transition={{
                duration: 4 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-5xl mx-auto">
            <AnimatedSection className="text-center">
              {/* Logo */}
              <motion.div 
                className="inline-flex items-center space-x-4 mb-10"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6 }}
              >
                <motion.div 
                  className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center relative overflow-hidden"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <span className="text-black font-black text-4xl relative z-10">M</span>
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-300"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
                <span className="text-white font-black text-5xl tracking-tight">
                  MIRACLE
                </span>
              </motion.div>
              
              <h1 className="text-5xl lg:text-7xl font-black text-white mb-8 tracking-tight">
                О нас
              </h1>
              
              <p className="text-white/60 text-xl lg:text-2xl leading-relaxed max-w-3xl mx-auto">
                Miracle — это турнирная платформа нового поколения. 
                Мы организуем киберспортивные соревнования и помогаем 
                другим организаторам проводить качественные турниры.
              </p>

              {/* Scroll indicator */}
              <motion.div 
                className="mt-16 flex flex-col items-center gap-2"
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <div className="w-px h-12 bg-gradient-to-b from-white/0 via-white/50 to-white/0"></div>
                <Sparkles size={16} className="text-white/30" />
              </motion.div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 border-b border-white/5">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
            {stats.map((stat, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <motion.div 
                  className={`relative text-center p-8 lg:p-10 rounded-3xl bg-gradient-to-br ${stat.color} border border-white/5 overflow-hidden group`}
                  whileHover={{ scale: 1.02, y: -5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  {/* Glow Effect */}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  
                  <motion.div 
                    className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 text-white mb-6 relative"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.6 }}
                  >
                    {stat.icon}
                  </motion.div>
                  <motion.div 
                    className="text-4xl lg:text-5xl font-black text-white mb-2"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", delay: index * 0.1 }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-white/60 text-sm lg:text-base font-medium">
                    {stat.label}
                  </div>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-32 border-b border-white/5">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <motion.span 
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 text-white/70 text-sm font-medium mb-6 border border-white/10"
              whileHover={{ scale: 1.05 }}
            >
              <Heart size={14} />
              Наши ценности
            </motion.span>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Что нас движет
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Принципы, которые лежат в основе нашей работы
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {values.map((value, index) => (
              <AnimatedSection key={index} delay={index * 0.1}>
                <motion.div 
                  className="relative p-8 rounded-3xl bg-white/5 border border-white/5 text-center group overflow-hidden"
                  whileHover={{ y: -10, borderColor: 'rgba(255,255,255,0.2)' }}
                >
                  <motion.div 
                    className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500"
                  />
                  <motion.div 
                    className="relative inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 text-white mb-6"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                  >
                    <value.icon size={28} />
                  </motion.div>
                  <h3 className="relative text-xl font-bold text-white mb-3">{value.title}</h3>
                  <p className="relative text-white/50">{value.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 lg:py-32 border-b border-white/5">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-7xl mx-auto">
            <AnimatedSection>
              <motion.span 
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 text-white/70 text-sm font-medium mb-6 border border-white/10"
                whileHover={{ scale: 1.05 }}
              >
                <Target size={14} />
                Наша миссия
              </motion.span>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-8 leading-tight">
                Развиваем киберспорт <span className="text-white/40">вместе</span>
              </h2>
              <div className="space-y-6 text-white/70 text-lg leading-relaxed">
                <p>
                  Мы верим, что каждый игрок заслуживает возможности 
                  участвовать в качественных турнирах. Поэтому мы создали 
                  платформу, которая делает организацию соревнований простой и доступной.
                </p>
                <p>
                  Наша команда имеет многолетний опыт в проведении турниров 
                  различного уровня — от локальных соревнований до крупных чемпионатов.
                </p>
                <p>
                  Мы предоставляем полный спектр услуг: от создания 
                  турнирной сетки до технической поддержки и продвижения.
                </p>
              </div>
            </AnimatedSection>

            <AnimatedSection delay={0.2} direction="right">
              <div className="relative">
                {/* Background Glow */}
                <div className="absolute -inset-4 bg-gradient-to-r from-white/5 to-transparent rounded-[40px] blur-xl"></div>
                
                <motion.div 
                  className="relative bg-gradient-to-br from-gray-900/80 to-black rounded-3xl p-8 lg:p-10 border border-white/10"
                  whileHover={{ scale: 1.02 }}
                >
                  <h3 className="text-2xl font-bold text-white mb-8 flex items-center gap-3">
                    <Sparkles className="text-yellow-400" size={24} />
                    Что мы предлагаем
                  </h3>
                  <ul className="space-y-5">
                    {[
                      'Профессиональная организация турниров',
                      'Размещение на платформе Miracle',
                      'Техническая поддержка 24/7',
                      'Продвижение в наших каналах',
                      'Честные матчи и своевременные выплаты',
                      'Индивидуальный подход к каждому проекту'
                    ].map((item, i) => (
                      <motion.li
                        key={i}
                        initial={{ opacity: 0, x: 20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 }}
                        className="flex items-center text-white/80 group"
                      >
                        <motion.div 
                          className="w-3 h-3 rounded-full bg-gradient-to-r from-white to-white/50 mr-4 group-hover:scale-150 transition-transform"
                        />
                        <span className="group-hover:text-white transition-colors">{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              </div>
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 lg:py-32 border-b border-white/5">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center mb-16">
            <motion.span 
              className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 text-white/70 text-sm font-medium mb-6 border border-white/10"
              whileHover={{ scale: 1.05 }}
            >
              <Users size={14} />
              Команда
            </motion.span>
            <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
              Люди за Miracle
            </h2>
            <p className="text-white/60 max-w-2xl mx-auto text-lg">
              Небольшая, но сплоченная команда профессионалов
            </p>
          </AnimatedSection>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {team.map((member, index) => (
              <AnimatedSection key={index} delay={index * 0.15}>
                <motion.div 
                  className="relative p-8 rounded-3xl bg-white/5 border border-white/5 text-center overflow-hidden group"
                  whileHover={{ y: -10, borderColor: 'rgba(255,255,255,0.2)' }}
                >
                  {/* Gradient Background on Hover */}
                  <motion.div 
                    className={`absolute inset-0 bg-gradient-to-br ${member.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  />
                  
                  <motion.div 
                    className={`relative w-20 h-20 rounded-full bg-gradient-to-br ${member.gradient} mx-auto mb-6 flex items-center justify-center`}
                    whileHover={{ scale: 1.1, rotate: 10 }}
                  >
                    <member.icon size={32} className="text-white" />
                  </motion.div>
                  
                  <h3 className="relative text-xl font-bold text-white mb-3">{member.role}</h3>
                  <p className="relative text-white/50">{member.description}</p>
                </motion.div>
              </AnimatedSection>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section className="py-20 lg:py-32">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-5xl mx-auto">
            <div className="relative overflow-hidden">
              {/* Background Glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-blue-500/10 via-transparent to-purple-500/10 rounded-[50px] blur-2xl"></div>
              
              <div className="relative bg-gradient-to-br from-gray-900/90 to-black rounded-[40px] p-10 lg:p-16 border border-white/10">
                <div className="text-center mb-14">
                  <motion.span 
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 text-white/70 text-sm font-medium mb-6 border border-white/10"
                    whileHover={{ scale: 1.05 }}
                  >
                    <Mail size={14} />
                    Контакты
                  </motion.span>
                  <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
                    Свяжитесь с нами
                  </h2>
                  <p className="text-white/60 max-w-lg mx-auto text-lg">
                    Есть вопросы или предложения? Мы всегда на связи!
                  </p>
                </div>

                <div className="grid sm:grid-cols-2 gap-6 mb-10">
                  <motion.a
                    href="https://t.me/myrrer"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group relative flex items-center p-6 lg:p-8 rounded-3xl bg-gradient-to-br from-blue-500/20 to-cyan-500/10 border border-blue-500/20 overflow-hidden"
                    whileHover={{ scale: 1.02, borderColor: 'rgba(59, 130, 246, 0.5)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {/* Animated Background */}
                    <motion.div 
                      className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-cyan-500/10"
                      animate={{ x: ['-100%', '100%'] }}
                      transition={{ duration: 3, repeat: Infinity, ease: 'linear' }}
                    />
                    
                    <motion.div 
                      className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center mr-5"
                      whileHover={{ rotate: 10, scale: 1.1 }}
                    >
                      <Send size={28} className="text-white" />
                    </motion.div>
                    <div className="relative flex-grow">
                      <div className="text-white font-bold text-xl mb-1">Telegram</div>
                      <div className="text-blue-300/70">@myrrer</div>
                    </div>
                    <ExternalLink size={20} className="relative text-white/30 group-hover:text-white/60 transition-colors" />
                  </motion.a>

                  <motion.a
                    href="mailto:dimatarabrin057@gmail.com"
                    className="group relative flex items-center p-6 lg:p-8 rounded-3xl bg-white/5 border border-white/10 overflow-hidden"
                    whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.3)' }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <motion.div 
                      className="relative w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mr-5 group-hover:bg-white transition-all duration-300"
                      whileHover={{ rotate: -10 }}
                    >
                      <Mail size={28} className="text-white group-hover:text-black transition-colors" />
                    </motion.div>
                    <div className="relative flex-grow">
                      <div className="text-white font-bold text-xl mb-1">Email</div>
                      <div className="text-white/50 text-sm">dimatarabrin057@gmail.com</div>
                    </div>
                    <ExternalLink size={20} className="relative text-white/30 group-hover:text-white/60 transition-colors" />
                  </motion.a>
                </div>

                <motion.div 
                  className="p-8 rounded-3xl bg-white/5 border border-white/10 text-center"
                  whileHover={{ borderColor: 'rgba(255,255,255,0.2)' }}
                >
                  <div className="flex items-center justify-center gap-3 mb-4">
                    <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                    <h3 className="text-white font-bold text-lg">Время работы</h3>
                  </div>
                  <p className="text-white/60">
                    Мы отвечаем на сообщения ежедневно с <span className="text-white font-semibold">10:00</span> до <span className="text-white font-semibold">22:00</span> (МСК).<br/>
                    В среднем время ответа — <span className="text-white font-semibold">до 2 часов</span>.
                  </p>
                </motion.div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default About;
