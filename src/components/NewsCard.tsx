import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, ArrowRight, Pin } from 'lucide-react';
import { News } from '../types';
import { formatDate } from '../utils/storage';
import { motion } from 'framer-motion';

interface NewsCardProps {
  news: News;
  index?: number;
  variant?: 'default' | 'featured';
}

const NewsCard: React.FC<NewsCardProps> = ({ news, index = 0, variant = 'default' }) => {
  if (variant === 'featured') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link to={`/news/${news.id}`} className="block group">
          <div className="relative h-[400px] lg:h-[500px] rounded-3xl overflow-hidden">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
            
            {news.isPinned && (
              <div className="absolute top-6 left-6 px-3 py-1.5 rounded-full text-xs font-bold uppercase bg-white text-black flex items-center space-x-1.5">
                <Pin size={12} />
                <span>Закреплено</span>
              </div>
            )}

            <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-8">
              <div className="flex items-center text-white/70 text-sm mb-3">
                <Calendar size={14} className="mr-2" />
                {formatDate(news.date)}
              </div>
              <h2 className="text-2xl lg:text-3xl font-bold text-white mb-3 group-hover:text-white/90 transition-colors">
                {news.title}
              </h2>
              <p className="text-white/70 mb-4 line-clamp-2 max-w-2xl">
                {news.shortText}
              </p>
              <div className="flex items-center text-white font-medium group-hover:translate-x-2 transition-transform duration-300">
                Читать далее
                <ArrowRight size={18} className="ml-2" />
              </div>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/news/${news.id}`} className="block group">
        <div className="bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-white/10 hover:border-white/20 transition-all duration-500 hover:transform hover:scale-[1.02]">
          {/* Image */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={news.image}
              alt={news.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            
            {news.isPinned && (
              <div className="absolute top-4 left-4 px-2.5 py-1 rounded-full text-xs font-bold uppercase bg-white text-black flex items-center space-x-1">
                <Pin size={10} />
                <span>Закреплено</span>
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <div className="flex items-center text-white/50 text-xs mb-2">
              <Calendar size={12} className="mr-1.5" />
              {formatDate(news.date)}
            </div>
            
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white/90 transition-colors line-clamp-2">
              {news.title}
            </h3>
            
            <p className="text-white/60 text-sm mb-4 line-clamp-2">
              {news.shortText}
            </p>

            <div className="flex items-center text-white font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">
              Читать далее
              <ArrowRight size={16} className="ml-1" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default NewsCard;
