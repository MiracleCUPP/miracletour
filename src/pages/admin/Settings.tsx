import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SiteSettings } from '../../types';
import { getSettings, saveSettings } from '../../utils/storage';
import { useAuth } from '../../context/AuthContext';

const Settings = () => {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [settings, setSettings] = useState<SiteSettings>({
    logo: 'MIRACLE',
    logoType: 'text',
    organizationName: 'Miracle'
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, isLoading, navigate]);

  useEffect(() => {
    (async () => {
      const currentSettings = await getSettings();
      setSettings(currentSettings);
    })();
  }, []);

  const handleSave = async () => {
    try {
      await saveSettings(settings);
      setSaved(true);
      window.dispatchEvent(new Event('settingsUpdated'));
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error('Ошибка сохранения настроек:', err);
      alert('Ошибка сохранения. Проверь консоль.');
    }
  };

  const previewLogo = () => {
    switch (settings.logoType) {
      case 'image': return settings.logo ? <img src={settings.logo} alt="Logo" className="h-8 object-contain" /> : <span className="text-white/50">Введи URL</span>;
      case 'emoji': return <span className="text-3xl">{settings.logo}</span>;
      default: return <span className="text-white font-bold text-xl tracking-tight">{settings.logo}</span>;
    }
  };

  if (isLoading) return null;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-2xl mx-auto">
        <div className="mb-8 flex items-center gap-4">
          <Link to="/admin" className="text-white/50 hover:text-white transition-colors">← Назад</Link>
          <h1 className="text-2xl font-bold">Настройки сайта</h1>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-6"
        >
          {/* Logo Type */}
          <div>
            <label className="block text-white font-medium mb-3">Тип логотипа</label>
            <div className="flex gap-3">
              {(['text', 'emoji', 'image'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setSettings(prev => ({ ...prev, logoType: type }))}
                  className={`px-4 py-2 rounded-lg border transition-all ${
                    settings.logoType === type
                      ? 'bg-white text-black border-white'
                      : 'bg-white/5 text-white/60 border-white/10 hover:border-white/30'
                  }`}
                >
                  {type === 'text' ? 'Текст' : type === 'emoji' ? 'Эмодзи' : 'Картинка'}
                </button>
              ))}
            </div>
          </div>

          {/* Logo Value */}
          <div>
            <label className="block text-white font-medium mb-2">
              {settings.logoType === 'text' ? 'Название' : settings.logoType === 'emoji' ? 'Эмодзи' : 'URL картинки'}
            </label>
            <input
              type="text"
              value={settings.logo}
              onChange={e => setSettings(prev => ({ ...prev, logo: e.target.value }))}
              placeholder={settings.logoType === 'image' ? 'https://...' : settings.logoType === 'emoji' ? '🏆' : 'MIRACLE'}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
            />
          </div>

          {/* Organization Name */}
          <div>
            <label className="block text-white font-medium mb-2">Название организации</label>
            <input
              type="text"
              value={settings.organizationName}
              onChange={e => setSettings(prev => ({ ...prev, organizationName: e.target.value }))}
              placeholder="Miracle"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
            />
          </div>

          {/* Preview */}
          <div>
            <label className="block text-white font-medium mb-2">Предпросмотр</label>
            <div className="flex items-center gap-3 p-4 bg-black/50 rounded-xl border border-white/10">
              {previewLogo()}
            </div>
          </div>

          {/* Save */}
          <button
            onClick={handleSave}
            className="w-full py-3 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-all"
          >
            {saved ? '✓ Сохранено' : 'Сохранить'}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
