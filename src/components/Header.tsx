import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { getSettings } from '../utils/storage';
import { SiteSettings } from '../types';

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [settings, setSettings] = useState<SiteSettings>({
    logo: 'MIRACLE',
    logoType: 'text',
    organizationName: 'Miracle'
  });
  const location = useLocation();
  const { isAdmin } = useAuth();

  useEffect(() => {
    const loadSettings = async () => {
      const currentSettings = await getSettings();
      setSettings(currentSettings);
    };
    loadSettings();
    
    // Listen for storage changes (for live updates)
    const handleStorageChange = () => loadSettings();
    window.addEventListener('storage', handleStorageChange);
    
    // Custom event for same-tab updates
    window.addEventListener('settingsUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('settingsUpdated', handleStorageChange);
    };
  }, []);

  const renderLogo = () => {
    switch (settings.logoType) {
      case 'image':
        return (
          <img 
            src={settings.logo} 
            alt={settings.organizationName} 
            className="h-8 lg:h-10 w-auto object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        );
      case 'emoji':
        return (
          <div className="flex items-center space-x-2">
            <span className="text-3xl lg:text-4xl">{settings.logo}</span>
            <span className="text-white font-bold text-xl lg:text-2xl tracking-tight">
              {settings.organizationName}
            </span>
          </div>
        );
      case 'text':
      default:
        return (
          <>
            <div className="w-10 h-10 lg:w-12 lg:h-12 bg-white rounded-lg flex items-center justify-center transform group-hover:scale-105 transition-transform duration-300">
              <span className="text-black font-black text-xl lg:text-2xl">
                {settings.logo.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className="text-white font-bold text-xl lg:text-2xl tracking-tight">
              {settings.logo}
            </span>
          </>
        );
    }
  };

  const navLinks = [
    { path: '/', label: 'Главная' },
    { path: '/tournaments', label: 'Турниры' },
    { path: '/news', label: 'Новости' },
    { path: '/completed', label: 'Завершено' },
    { path: '/apply', label: 'Подать заявку' },
    { path: '/about', label: 'О нас' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-white/10">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            {renderLogo()}
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  isActive(link.path)
                    ? 'bg-white text-black'
                    : 'text-white/70 hover:text-white hover:bg-white/10'
                }`}
              >
                {link.label}
              </Link>
            ))}
            {isAdmin ? (
              <Link
                to="/admin"
                className="ml-4 px-4 py-2 rounded-lg text-sm font-medium bg-gradient-to-r from-gray-700 to-gray-900 text-white hover:from-gray-600 hover:to-gray-800 transition-all duration-300 flex items-center space-x-2"
              >
                <Shield size={16} />
                <span>Админ</span>
              </Link>
            ) : (
              <Link
                to="/admin/login"
                className="ml-4 px-4 py-2 rounded-lg text-sm font-medium border border-white/20 text-white/70 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all duration-300 flex items-center space-x-2"
              >
                <Shield size={16} />
                <span>Вход</span>
              </Link>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden p-2 text-white hover:bg-white/10 rounded-lg transition-colors"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-black/98 border-t border-white/10"
          >
            <nav className="px-4 py-3 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`flex items-center px-4 py-3.5 rounded-xl text-base font-medium transition-all duration-200 ${
                    isActive(link.path)
                      ? 'bg-white text-black'
                      : 'text-white/70 hover:text-white hover:bg-white/10 active:bg-white/15'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <div className="h-px bg-white/10 my-2" />
              {isAdmin ? (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-3.5 rounded-xl text-base font-medium bg-white/10 text-white hover:bg-white/15 transition-colors"
                >
                  <Shield size={18} />
                  <span>Админ-панель</span>
                </Link>
              ) : (
                <Link
                  to="/admin/login"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center space-x-2 px-4 py-3.5 rounded-xl text-base font-medium border border-white/20 text-white/70 hover:text-white hover:bg-white/5 transition-colors"
                >
                  <Shield size={18} />
                  <span>Вход для админа</span>
                </Link>
              )}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header;
