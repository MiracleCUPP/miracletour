import { useState, useEffect } from 'react';
import { Search, Newspaper, Sparkles, TrendingUp, Bell, Loader2 } from 'lucide-react';
import { News as NewsType } from '../types';
import { getNews } from '../utils/storage';
import NewsCard from '../components/NewsCard';
import AnimatedSection from '../components/AnimatedSection';
import { motion } from 'framer-motion';

const News: React.FC = () => {
  const [news, setNews] = useState<NewsType[]>([]);
  const [filteredNews, setFilteredNews] = useState<NewsType[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadNews = async () => {
      setLoading(true);
      const data = await getNews();
      setNews(data);
      setFilteredNews(data);
      setLoading(false);
    };
    
    loadNews();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = news.filter(n =>
        n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        n.shortText.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredNews(filtered);
    } else {
      setFilteredNews(news);
    }
  }, [searchQuery, news]);

  const pinnedNews = filteredNews.filter(n => n.isPinned);
  const regularNews = filteredNews.filter(n => !n.isPinned);

  return (
    <div className="min-h-screen bg-black pt-20 lg:pt-24">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 border-b border-white/5 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-white/5 via-transparent to-white/5 rounded-full blur-3xl"></div>
          <div className="absolute top-0 right-0 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
        </div>
        
        {/* Animated Lines */}
        <div className="absolute inset-0 overflow-hidden opacity-20">
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute h-px bg-gradient-to-r from-transparent via-white to-transparent"
              style={{ top: `${20 + i * 15}%`, left: 0, right: 0 }}
              animate={{ x: ['-100%', '100%'] }}
              transition={{ duration: 8 + i * 2, repeat: Infinity, ease: 'linear' }}
            />
          ))}
        </div>
        
        <div className="relative w-full px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-4xl mx-auto">
            <motion.div 
              className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-br from-white/20 to-white/5 text-white mb-8 border border-white/10 relative"
              animate={{ 
                boxShadow: ['0 0 20px rgba(255,255,255,0.1)', '0 0 40px rgba(255,255,255,0.2)', '0 0 20px rgba(255,255,255,0.1)']
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              <Newspaper size={36} />
              <motion.div 
                className="absolute -top-1 -right-1 w-4 h-4 bg-white rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>
            
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight">
              Новости
            </h1>
            <p className="text-white/60 text-xl max-w-2xl mx-auto">
              Последние обновления, анонсы турниров и важная информация от Miracle
            </p>
            
            {/* Quick Stats */}
            <div className="flex justify-center gap-6 mt-10">
              <motion.div 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <Sparkles size={16} className="text-yellow-400" />
                <span className="text-white/80 text-sm">{pinnedNews.length} закреплено</span>
              </motion.div>
              <motion.div 
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10"
                whileHover={{ scale: 1.05, backgroundColor: 'rgba(255,255,255,0.1)' }}
              >
                <TrendingUp size={16} className="text-green-400" />
                <span className="text-white/80 text-sm">{news.length} всего</span>
              </motion.div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Search */}
      <section className="py-6 border-b border-white/5 sticky top-16 lg:top-20 bg-black/95 backdrop-blur-xl z-40">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-2xl mx-auto">
            <Search size={20} className="absolute left-5 top-1/2 transform -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Поиск новостей..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300 text-lg"
            />
            {searchQuery && (
              <motion.button
                onClick={() => setSearchQuery('')}
                className="absolute right-5 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white transition-colors"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                ✕
              </motion.button>
            )}
          </div>
        </div>
      </section>

      {/* News Content */}
      <section className="py-12 lg:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={40} className="animate-spin text-white/50 mb-4" />
              <p className="text-white/50">Загрузка новостей...</p>
            </div>
          ) : filteredNews.length > 0 ? (
            <div className="space-y-16">
              {/* Pinned News (Featured) */}
              {pinnedNews.length > 0 && (
                <div className="space-y-8">
                  <div className="flex items-center gap-3">
                    <Bell className="text-yellow-400" size={20} />
                    <h2 className="text-xl font-bold text-white">Закреплённые новости</h2>
                    <div className="flex-grow h-px bg-gradient-to-r from-white/20 to-transparent"></div>
                  </div>
                  <div className="space-y-6">
                    {pinnedNews.map((item) => (
                      <NewsCard key={item.id} news={item} variant="featured" />
                    ))}
                  </div>
                </div>
              )}

              {/* Regular News Grid */}
              {regularNews.length > 0 && (
                <div>
                  <div className="flex items-center gap-3 mb-8">
                    <Newspaper className="text-white/60" size={20} />
                    <h2 className="text-xl font-bold text-white">Все новости</h2>
                    <div className="flex-grow h-px bg-gradient-to-r from-white/20 to-transparent"></div>
                    <span className="text-white/40 text-sm">{regularNews.length} записей</span>
                  </div>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {regularNews.map((item, index) => (
                      <NewsCard key={item.id} news={item} index={index} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <AnimatedSection className="text-center py-20">
              <motion.div 
                className="inline-flex items-center justify-center w-24 h-24 rounded-3xl bg-gradient-to-br from-white/10 to-white/5 text-white/40 mb-6 border border-white/10"
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <Newspaper size={40} />
              </motion.div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Новости не найдены
              </h3>
              <p className="text-white/50 max-w-md mx-auto">
                {searchQuery
                  ? 'Попробуйте изменить поисковый запрос'
                  : 'Пока нет новостей. Следите за обновлениями!'}
              </p>
              {searchQuery && (
                <motion.button
                  onClick={() => setSearchQuery('')}
                  className="mt-6 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Сбросить поиск
                </motion.button>
              )}
            </AnimatedSection>
          )}
        </div>
      </section>
    </div>
  );
};

export default News;
