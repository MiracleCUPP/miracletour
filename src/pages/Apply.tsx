import React, { useState, useRef } from 'react';
import { Send, Check, FileText, Sparkles, ArrowRight, Trophy, Star, Shield } from 'lucide-react';
import { PackageType, PACKAGES } from '../types';
import { saveApplication, generateId } from '../utils/storage';
import PricingSection from '../components/PricingSection';
import AnimatedSection from '../components/AnimatedSection';
import { motion } from 'framer-motion';

const COOLDOWN_MS = 60_000; // 1 минута между отправками

const Apply: React.FC = () => {
  const [formData, setFormData] = useState({
    organizerName: '',
    tournamentName: '',
    package: 'premium' as PackageType,
    telegram: '',
    email: '',
    description: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const lastSubmitRef = useRef<number>(0);

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.organizerName.trim()) {
      newErrors.organizerName = 'Введите ваше имя';
    } else if (formData.organizerName.length > 100) {
      newErrors.organizerName = 'Максимум 100 символов';
    }

    if (!formData.tournamentName.trim()) {
      newErrors.tournamentName = 'Введите название турнира';
    } else if (formData.tournamentName.length > 150) {
      newErrors.tournamentName = 'Максимум 150 символов';
    }

    if (!formData.telegram.trim()) {
      newErrors.telegram = 'Введите Telegram для связи';
    } else if (!/^@[\w]{3,32}$/.test(formData.telegram.trim())) {
      newErrors.telegram = 'Формат: @username (3–32 символа, только буквы/цифры/_)';
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Опишите ваш турнир';
    } else if (formData.description.length > 2000) {
      newErrors.description = 'Максимум 2000 символов';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Rate-limit: одна заявка в минуту
    const now = Date.now();
    if (now - lastSubmitRef.current < COOLDOWN_MS) {
      const wait = Math.ceil((COOLDOWN_MS - (now - lastSubmitRef.current)) / 1000);
      setErrors({ form: `Подождите ${wait} сек. перед повторной отправкой` });
      return;
    }

    if (!validateForm()) return;

    setIsSubmitting(true);
    lastSubmitRef.current = Date.now();

    await saveApplication({
      id: generateId(),
      ...formData,
      organizerName: formData.organizerName.trim(),
      tournamentName: formData.tournamentName.trim(),
      telegram: formData.telegram.trim(),
      description: formData.description.trim(),
      status: 'pending',
      createdAt: new Date().toISOString().split('T')[0]
    });

    // Отправляем уведомление в Telegram

    setIsSubmitting(false);
    setIsSubmitted(true);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-green-500/10 rounded-full blur-[150px]"></div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className="relative text-center max-w-lg mx-auto px-4"
        >
          <motion.div 
            className="w-24 h-24 rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/20"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", delay: 0.2 }}
          >
            <Check size={48} className="text-white" />
          </motion.div>
          <h1 className="text-4xl font-black text-white mb-6">
            Заявка отправлена!
          </h1>
          <p className="text-white/60 text-lg mb-4">
            Мы получили вашу заявку на размещение турнира
          </p>
          <p className="text-white font-semibold text-xl mb-8">
            «{formData.tournamentName}»
          </p>
          <div className="space-y-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <p className="text-white/70">
                Наш администратор свяжется с вами в <span className="text-blue-400">Telegram</span> в ближайшее время для обсуждения деталей.
              </p>
            </div>
            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl p-6">
              <div className="flex items-start gap-3">
                <div className="w-2 h-2 rounded-full bg-blue-500 mt-2 animate-pulse"></div>
                <div>
                  <p className="text-blue-400 font-semibold mb-1">Уведомление отправлено администратору</p>
                  <p className="text-white/50 text-sm">
                    Ваша заявка появилась в админ-панели и администратор получил уведомление о новой заявке.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <motion.button
            onClick={() => {
              setIsSubmitted(false);
              setFormData({
                organizerName: '',
                tournamentName: '',
                package: 'premium',
                telegram: '',
                email: '',
                description: ''
              });
            }}
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:bg-gray-100 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <ArrowRight size={20} />
            Подать еще одну заявку
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black pt-20 lg:pt-24">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 border-b border-white/5 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 right-1/4 w-[500px] h-[500px] bg-white/5 rounded-full blur-[120px]"></div>
          <div className="absolute bottom-0 left-1/4 w-[400px] h-[400px] bg-white/3 rounded-full blur-[100px]"></div>
        </div>
        
        {/* Floating Icons */}
        <div className="absolute inset-0 overflow-hidden">
          {[Trophy, Star, Shield].map((Icon, i) => (
            <motion.div
              key={i}
              className="absolute text-white/10"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + (i % 2) * 40}%`,
              }}
              animate={{
                y: [0, -20, 0],
                rotate: [0, 10, 0],
              }}
              transition={{
                duration: 5 + i,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Icon size={60} />
            </motion.div>
          ))}
        </div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-4xl mx-auto">
            <motion.div 
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-white/20 to-white/5 text-white mb-8 border border-white/10"
              animate={{ 
                boxShadow: ['0 0 20px rgba(255,255,255,0.1)', '0 0 40px rgba(255,255,255,0.2)', '0 0 20px rgba(255,255,255,0.1)']
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <FileText size={36} />
            </motion.div>
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight">
              Подать заявку
            </h1>
            <p className="text-white/60 text-xl max-w-2xl mx-auto">
              Хотите разместить свой турнир на платформе Miracle? 
              Заполните форму и выберите подходящий пакет.
            </p>
            
            {/* Quick Info */}
            <div className="flex flex-wrap justify-center gap-4 mt-10">
              {[
                { icon: Sparkles, text: 'Быстрое рассмотрение' },
                { icon: Shield, text: 'Гарантия качества' },
                { icon: Star, text: 'Поддержка 24/7' },
              ].map((item, i) => (
                <motion.div 
                  key={i}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
                  whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
                >
                  <item.icon size={16} className="text-white/60" />
                  <span className="text-white/80 text-sm">{item.text}</span>
                </motion.div>
              ))}
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Pricing */}
      <PricingSection />

      {/* Application Form */}
      <section className="py-20 lg:py-32 border-t border-white/5 relative">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-white/3 rounded-full blur-[150px]"></div>
        </div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="max-w-2xl mx-auto">
            <div className="text-center mb-14">
              <motion.span 
                className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-white/5 text-white/70 text-sm font-medium mb-6 border border-white/10"
                whileHover={{ scale: 1.05 }}
              >
                <FileText size={14} />
                Форма заявки
              </motion.span>
              <h2 className="text-4xl lg:text-5xl font-black text-white mb-6">
                Расскажите о турнире
              </h2>
              <p className="text-white/60 text-lg">
                Заполните форму ниже, и наш администратор свяжется с вами для обсуждения деталей
              </p>
            </div>

            <motion.form 
              onSubmit={handleSubmit} 
              className="space-y-8 bg-white/5 border border-white/10 rounded-3xl p-8 lg:p-10 backdrop-blur-sm"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              {/* Organizer Name */}
              <div className="group">
                <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                  Ваше имя / Название организации
                  <span className="text-red-400">*</span>
                </label>
                <motion.input
                  type="text"
                  name="organizerName"
                  value={formData.organizerName}
                  onChange={handleChange}
                  placeholder="Иван Петров"
                  maxLength={100}
                  className={`w-full px-5 py-4 bg-white/5 border-2 rounded-2xl text-white placeholder-white/30 focus:outline-none transition-all duration-300 ${
                    errors.organizerName 
                      ? 'border-red-500 focus:border-red-400' 
                      : 'border-white/10 focus:border-white/30 focus:bg-white/10'
                  }`}
                  whileFocus={{ scale: 1.01 }}
                />
                {errors.organizerName && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-red-400 text-sm flex items-center gap-1"
                  >
                    <span>⚠</span> {errors.organizerName}
                  </motion.p>
                )}
              </div>

              {/* Tournament Name */}
              <div className="group">
                <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                  Название турнира
                  <span className="text-red-400">*</span>
                </label>
                <motion.input
                  type="text"
                  name="tournamentName"
                  value={formData.tournamentName}
                  onChange={handleChange}
                  placeholder="Spring Cup 2024"
                  maxLength={150}
                  className={`w-full px-5 py-4 bg-white/5 border-2 rounded-2xl text-white placeholder-white/30 focus:outline-none transition-all duration-300 ${
                    errors.tournamentName 
                      ? 'border-red-500 focus:border-red-400' 
                      : 'border-white/10 focus:border-white/30 focus:bg-white/10'
                  }`}
                  whileFocus={{ scale: 1.01 }}
                />
                {errors.tournamentName && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-red-400 text-sm flex items-center gap-1"
                  >
                    <span>⚠</span> {errors.tournamentName}
                  </motion.p>
                )}
              </div>

              {/* Package */}
              <div>
                <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                  Выберите пакет
                  <span className="text-red-400">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {(Object.keys(PACKAGES) as Array<keyof typeof PACKAGES>).map((key) => {
                    const pkg = PACKAGES[key];
                    const isSelected = formData.package === key;
                    return (
                      <motion.button
                        key={key}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, package: key }))}
                        className={`relative p-4 rounded-2xl border-2 text-center transition-all duration-300 ${
                          isSelected
                            ? key === 'diamond'
                              ? 'border-cyan-500/50 bg-cyan-500/10'
                              : key === 'premium'
                              ? 'border-yellow-500/50 bg-yellow-500/10'
                              : 'border-white/30 bg-white/10'
                            : 'border-white/10 bg-white/5 hover:border-white/20'
                        }`}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <div className={`font-bold mb-1 ${
                          key === 'diamond' ? 'text-cyan-400' 
                          : key === 'premium' ? 'text-yellow-400' 
                          : 'text-white'
                        }`}>
                          {pkg.name}
                        </div>
                        <div className="text-white/60 text-sm">{pkg.price}₽</div>
                        {isSelected && (
                          <motion.div 
                            className="absolute top-2 right-2"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                          >
                            <Check size={16} className={
                              key === 'diamond' ? 'text-cyan-400' 
                              : key === 'premium' ? 'text-yellow-400' 
                              : 'text-white'
                            } />
                          </motion.div>
                        )}
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Telegram */}
              <div className="group">
                <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                  Telegram для связи
                  <span className="text-red-400">*</span>
                </label>
                <motion.input
                  type="text"
                  name="telegram"
                  value={formData.telegram}
                  onChange={handleChange}
                  placeholder="@username"
                  maxLength={33}
                  className={`w-full px-5 py-4 bg-white/5 border-2 rounded-2xl text-white placeholder-white/30 focus:outline-none transition-all duration-300 ${
                    errors.telegram 
                      ? 'border-red-500 focus:border-red-400' 
                      : 'border-white/10 focus:border-white/30 focus:bg-white/10'
                  }`}
                  whileFocus={{ scale: 1.01 }}
                />
                {errors.telegram && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-red-400 text-sm flex items-center gap-1"
                  >
                    <span>⚠</span> {errors.telegram}
                  </motion.p>
                )}
              </div>

              {/* Email (optional) */}
              <div className="group">
                <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                  Email
                  <span className="text-white/40 text-sm font-normal">(необязательно)</span>
                </label>
                <motion.input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="email@example.com"
                  className="w-full px-5 py-4 bg-white/5 border-2 border-white/10 rounded-2xl text-white placeholder-white/30 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300"
                  whileFocus={{ scale: 1.01 }}
                />
              </div>

              {/* Description */}
              <div className="group">
                <label className="block text-white font-semibold mb-3 flex items-center gap-2">
                  Описание турнира
                  <span className="text-red-400">*</span>
                </label>
                <motion.textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Расскажите о турнире: дисциплина, формат, количество команд, призовой фонд, даты проведения..."
                  rows={6}
                  maxLength={2000}
                  className={`w-full px-5 py-4 bg-white/5 border-2 rounded-2xl text-white placeholder-white/30 focus:outline-none transition-all duration-300 resize-none ${
                    errors.description 
                      ? 'border-red-500 focus:border-red-400' 
                      : 'border-white/10 focus:border-white/30 focus:bg-white/10'
                  }`}
                  whileFocus={{ scale: 1.01 }}
                />
                <p className="mt-1 text-white/30 text-xs text-right">{formData.description.length}/2000</p>
                {errors.description && (
                  <motion.p 
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-red-400 text-sm flex items-center gap-1"
                  >
                    <span>⚠</span> {errors.description}
                  </motion.p>
                )}
              </div>

              {/* Form-level error (e.g. cooldown) */}
              {errors.form && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-red-400 text-sm text-center flex items-center justify-center gap-1"
                >
                  <span>⚠</span> {errors.form}
                </motion.p>
              )}

              {/* Submit Button */}
              <motion.button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-5 bg-gradient-to-r from-white to-gray-100 text-black font-bold rounded-2xl hover:from-gray-100 hover:to-white transition-all duration-300 flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-white/10"
                whileHover={{ scale: 1.02, boxShadow: '0 20px 40px rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.98 }}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-6 h-6 border-3 border-black/20 border-t-black rounded-full animate-spin" />
                    <span className="text-lg">Отправка...</span>
                  </>
                ) : (
                  <>
                    <Send size={22} />
                    <span className="text-lg">Отправить заявку</span>
                  </>
                )}
              </motion.button>

              <p className="text-white/40 text-sm text-center">
                Нажимая кнопку, вы соглашаетесь на обработку персональных данных
              </p>
            </motion.form>
          </AnimatedSection>
        </div>
      </section>
    </div>
  );
};

export default Apply;
