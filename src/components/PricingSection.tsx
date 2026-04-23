import React from 'react';
import { Link } from 'react-router-dom';
import { Check, Star, Crown, Gem, ArrowRight } from 'lucide-react';
import { PACKAGES } from '../types';
import { motion } from 'framer-motion';
import AnimatedSection from './AnimatedSection';

const PricingSection: React.FC = () => {
  const packageIcons = {
    common: <Star className="w-8 h-8" />,
    premium: <Crown className="w-8 h-8" />,
    diamond: <Gem className="w-8 h-8" />
  };

  const packageStyles = {
    common: {
      card: 'bg-gray-900/50 border-gray-700/50 hover:border-gray-600',
      icon: 'bg-gray-700 text-gray-300',
      button: 'bg-gray-700 hover:bg-gray-600 text-white'
    },
    premium: {
      card: 'bg-gray-900/80 border-white/20 hover:border-white/40',
      icon: 'bg-white text-black',
      button: 'bg-white hover:bg-gray-100 text-black'
    },
    diamond: {
      card: 'bg-gradient-to-br from-purple-900/30 to-blue-900/30 border-purple-500/30 hover:border-purple-500/50',
      icon: 'bg-gradient-to-r from-purple-500 to-blue-500 text-white',
      button: 'bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white'
    }
  };

  return (
    <section className="py-20 lg:py-32">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <AnimatedSection className="text-center mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white/10 text-white/70 text-sm font-medium mb-4">
            Пакеты размещения
          </span>
          <h2 className="text-3xl lg:text-5xl font-bold text-white mb-4">
            Выберите подходящий пакет
          </h2>
          <p className="text-white/60 text-lg max-w-2xl mx-auto">
            Разместите свой турнир на платформе Miracle и получите максимальный охват аудитории
          </p>
        </AnimatedSection>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {(Object.keys(PACKAGES) as Array<keyof typeof PACKAGES>).map((key, index) => {
            const pkg = PACKAGES[key];
            const style = packageStyles[key];
            const isPopular = key === 'premium';

            return (
              <AnimatedSection key={key} delay={index * 0.1}>
                <motion.div
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.3 }}
                  className={`relative rounded-3xl border p-6 lg:p-8 h-full flex flex-col ${style.card} transition-colors duration-300`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 px-4 py-1 rounded-full bg-white text-black text-xs font-bold uppercase">
                      Популярный
                    </div>
                  )}

                  {/* Icon */}
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${style.icon}`}>
                    {packageIcons[key]}
                  </div>

                  {/* Title & Price */}
                  <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                  <div className="flex items-baseline mb-6">
                    <span className="text-4xl font-black text-white">{pkg.price}</span>
                    <span className="text-white/60 ml-1">₽</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-3 mb-8 flex-grow">
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start text-white/70">
                        <Check size={18} className="mr-3 mt-0.5 text-green-400 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA */}
                  <Link
                    to="/apply"
                    className={`w-full py-3 px-6 rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all duration-300 ${style.button}`}
                  >
                    <span>Выбрать</span>
                    <ArrowRight size={18} />
                  </Link>
                </motion.div>
              </AnimatedSection>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default PricingSection;
