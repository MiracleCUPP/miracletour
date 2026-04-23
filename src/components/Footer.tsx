import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Send, Mail, MapPin, ExternalLink } from 'lucide-react';
import { getSettings } from '../utils/storage';
import { SiteSettings } from '../types';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const [settings, setSettings] = useState<SiteSettings>({
    logo: 'MIRACLE',
    logoType: 'text',
    organizationName: 'Miracle'
  });

  useEffect(() => {
    const loadSettings = async () => {
      const currentSettings = await getSettings();
      setSettings(currentSettings);
    };
    loadSettings();
    
    window.addEventListener('storage', loadSettings);
    window.addEventListener('settingsUpdated', loadSettings);
    
    return () => {
      window.removeEventListener('storage', loadSettings);
      window.removeEventListener('settingsUpdated', loadSettings);
    };
  }, []);

  const renderLogo = () => {
    switch (settings.logoType) {
      case 'image':
        return (
          <img 
            src={settings.logo} 
            alt={settings.organizationName} 
            className="h-8 w-auto object-contain"
          />
        );
      case 'emoji':
        return <span className="text-3xl">{settings.logo}</span>;
      case 'text':
      default:
        return (
          <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-xl">
              {settings.logo.charAt(0).toUpperCase()}
            </span>
          </div>
        );
    }
  };

  return (
    <footer className="bg-black border-t border-white/10">
      <div className="w-full px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="lg:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              {renderLogo()}
              <span className="text-white font-bold text-xl tracking-tight">
                {settings.logoType === 'text' ? settings.logo : settings.organizationName}
              </span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed">
              Организация киберспортивных турниров. 
              Создаем незабываемые соревнования для игроков всех уровней.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold mb-4">Навигация</h3>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Главная' },
                { to: '/tournaments', label: 'Турниры' },
                { to: '/news', label: 'Новости' },
                { to: '/completed', label: 'Завершенные' },
                { to: '/apply', label: 'Подать заявку' },
              ].map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-white/60 hover:text-white text-sm transition-colors duration-300"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Packages */}
          <div>
            <h3 className="text-white font-semibold mb-4">Пакеты</h3>
            <ul className="space-y-2">
              <li className="text-white/60 text-sm">Common — 250₽</li>
              <li className="text-white/60 text-sm">Premium — 500₽</li>
              <li className="text-white/60 text-sm">Diamond — 1000₽</li>
            </ul>
            <Link
              to="/apply"
              className="inline-flex items-center mt-4 text-white text-sm font-medium hover:underline"
            >
              Узнать подробнее
              <ExternalLink size={14} className="ml-1" />
            </Link>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold mb-4">Контакты</h3>
            <ul className="space-y-3">
              <li>
                <a
                  href="https://t.me/myrrer"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center text-white/60 hover:text-white text-sm transition-colors duration-300"
                >
                  <Send size={16} className="mr-2" />
                  @myrrer
                </a>
              </li>
              <li>
                <a
                  href="mailto:dimatarabrin057@gmail.com"
                  className="flex items-center text-white/60 hover:text-white text-sm transition-colors duration-300"
                >
                  <Mail size={16} className="mr-2" />
                  dimatarabrin057@gmail.com
                </a>
              </li>
              <li>
                <span className="flex items-center text-white/60 text-sm">
                  <MapPin size={16} className="mr-2" />
                  Россия
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <p className="text-white/40 text-sm">
            © {currentYear} Miracle. Все права защищены.
          </p>
          <div className="flex items-center space-x-6">
            <Link to="/about" className="text-white/40 hover:text-white text-sm transition-colors">
              О нас
            </Link>
            <a
              href="https://t.me/myrrer"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/40 hover:text-white text-sm transition-colors"
            >
              Telegram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
