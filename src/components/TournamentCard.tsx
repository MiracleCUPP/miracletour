import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Users, Trophy, ArrowRight, Crown, Star, Gem } from 'lucide-react';
import { Tournament } from '../types';
import { formatDate } from '../utils/storage';
import { motion } from 'framer-motion';

interface TournamentCardProps {
  tournament: Tournament;
  index?: number;
}

const TournamentCard: React.FC<TournamentCardProps> = ({ tournament, index = 0 }) => {
  const packageStyles = {
    common: {
      badge: 'bg-gray-700 text-gray-200',
      border: 'border-gray-700/50 hover:border-gray-600',
      icon: <Star size={14} />
    },
    premium: {
      badge: 'bg-white text-black',
      border: 'border-white/20 hover:border-white/40',
      icon: <Crown size={14} />
    },
    diamond: {
      badge: 'bg-gradient-to-r from-purple-500 to-blue-500 text-white',
      border: 'border-purple-500/30 hover:border-purple-500/60',
      icon: <Gem size={14} />
    }
  };

  const style = packageStyles[tournament.package];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
    >
      <Link to={`/tournaments/${tournament.id}`} className="block group">
        <div className={`bg-gray-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border ${style.border} transition-all duration-500 hover:transform hover:scale-[1.02] hover:shadow-2xl hover:shadow-white/5`}>
          {/* Banner */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={tournament.banner}
              alt={tournament.title}
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
            
            {/* Package Badge */}
            <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-full text-xs font-bold uppercase flex items-center space-x-1.5 ${style.badge}`}>
              {style.icon}
              <span>{tournament.package}</span>
            </div>

            {/* Status Badge */}
            {tournament.status === 'active' && (
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full text-xs font-bold uppercase bg-green-500 text-white flex items-center space-x-1.5">
                <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                <span>Live</span>
              </div>
            )}

            {/* Game Badge */}
            {tournament.game && (
              <div className="absolute bottom-4 left-4 px-3 py-1 rounded-lg text-xs font-medium bg-black/60 text-white backdrop-blur-sm">
                {tournament.game}
              </div>
            )}
          </div>

          {/* Content */}
          <div className="p-5">
            <h3 className="text-lg font-bold text-white mb-2 group-hover:text-white/90 transition-colors line-clamp-1">
              {tournament.title}
            </h3>
            
            <p className="text-white/60 text-sm mb-4 line-clamp-2">
              {tournament.description}
            </p>

            {/* Meta */}
            <div className="flex flex-wrap gap-3 mb-4">
              <div className="flex items-center text-white/50 text-xs">
                <Calendar size={14} className="mr-1.5" />
                {formatDate(tournament.date)}
              </div>
              <div className="flex items-center text-white/50 text-xs">
                <Users size={14} className="mr-1.5" />
                {tournament.teams.length} команд
              </div>
              {tournament.prizePool && (
                <div className="flex items-center text-white/50 text-xs">
                  <Trophy size={14} className="mr-1.5" />
                  {tournament.prizePool}
                </div>
              )}
            </div>

            {/* CTA */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-white/40 uppercase tracking-wider">
                {tournament.format}
              </span>
              <div className="flex items-center text-white font-medium text-sm group-hover:translate-x-1 transition-transform duration-300">
                Подробнее
                <ArrowRight size={16} className="ml-1" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default TournamentCard;
