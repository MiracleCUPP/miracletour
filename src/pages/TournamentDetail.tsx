import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, Users, Trophy, Send, ArrowLeft, Crown, Star, Gem, ExternalLink, Loader2, TableProperties } from 'lucide-react';
import { Tournament } from '../types';
import { getTournamentById, formatDate } from '../utils/storage';
import AnimatedSection from '../components/AnimatedSection';
import { motion } from 'framer-motion';

const TournamentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadTournament = async () => {
      if (!id) { setLoading(false); return; }
      setLoading(true);
      const t = await getTournamentById(id);
      if (t) {
        setTournament(t);
      } else {
        setError('Турнир не найден');
      }
      setLoading(false);
    };
    loadTournament();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-white/50 mb-4 mx-auto" />
          <p className="text-white/50">Загрузка турнира...</p>
        </div>
      </div>
    );
  }

  if (error || !tournament) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Турнир не найден</h1>
          <Link to="/tournaments" className="text-white/70 hover:text-white">
            ← Вернуться к турнирам
          </Link>
        </div>
      </div>
    );
  }

  const packageIcons = {
    common: <Star size={16} />,
    premium: <Crown size={16} />,
    diamond: <Gem size={16} />
  };

  const packageStyles = {
    common: 'bg-gray-700 text-gray-200',
    premium: 'bg-white text-black',
    diamond: 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
  };

  const statusStyles = {
    active: { bg: 'bg-green-500', text: 'Live' },
    upcoming: { bg: 'bg-blue-500', text: 'Скоро' },
    completed: { bg: 'bg-gray-500', text: 'Завершен' }
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Banner */}
      <section className="relative h-[40vh] lg:h-[50vh] overflow-hidden">
        <img
          src={tournament.banner}
          alt={tournament.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-6 lg:p-12">
          <div className="w-full max-w-7xl mx-auto">
            <Link
              to="/tournaments"
              className="inline-flex items-center text-white/70 hover:text-white mb-4 transition-colors"
            >
              <ArrowLeft size={18} className="mr-2" />
              Все турниры
            </Link>

            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase flex items-center space-x-1.5 ${packageStyles[tournament.package]}`}>
                {packageIcons[tournament.package]}
                <span>{tournament.package}</span>
              </span>
              <span className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase ${statusStyles[tournament.status].bg} text-white`}>
                {statusStyles[tournament.status].text}
              </span>
              {tournament.game && (
                <span className="px-3 py-1.5 rounded-full text-xs font-medium bg-white/10 text-white">
                  {tournament.game}
                </span>
              )}
            </div>

            <h1 className="text-3xl lg:text-5xl font-bold text-white mb-4">
              {tournament.title}
            </h1>

            <div className="flex flex-wrap items-center gap-6 text-white/70">
              <div className="flex items-center">
                <Calendar size={18} className="mr-2" />
                {formatDate(tournament.date)}
                {tournament.endDate && ` — ${formatDate(tournament.endDate)}`}
              </div>
              <div className="flex items-center">
                <Users size={18} className="mr-2" />
                {tournament.teams.length} команд
              </div>
              {tournament.prizePool && (
                <div className="flex items-center">
                  <Trophy size={18} className="mr-2" />
                  {tournament.prizePool}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-12 lg:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Description */}
              <AnimatedSection>
                <div className="bg-gray-900/50 rounded-2xl p-6 lg:p-8 border border-white/10">
                  <h2 className="text-xl font-bold text-white mb-4">О турнире</h2>
                  <div className="text-white/70 leading-relaxed whitespace-pre-line">
                    {tournament.fullDescription || tournament.description}
                  </div>
                </div>
              </AnimatedSection>

              {/* Bracket */}
              {/* Bracket — visual tree */}
              {tournament.bracket && tournament.bracket.length > 0 && (
              <AnimatedSection delay={0.1}>
                <div className="bg-gray-900/50 rounded-2xl p-6 lg:p-8 border border-white/10">
                  <h2 className="text-xl font-bold text-white mb-6">Турнирная сетка</h2>
                  <div className="overflow-x-auto pb-2">
                    {(() => {
                      const roundNamesMap: Record<number,string> = {1:'Раунд 1',2:'Раунд 2',3:'Полуфинал',4:'Финал',5:'Гранд-финал'};
                      const allRounds = [...new Set(tournament.bracket.map(m => m.round))].sort((a,b)=>a-b);

                      const getLogo = (name: string) => {
                        if (tournament.package === 'common') return null;
                        const logo = tournament.teams.find(t => t.name === name)?.logo;
                        if (!logo) return null;
                        if (logo.startsWith('http') || logo.startsWith('data:'))
                          return <img src={logo} alt={name} className="w-5 h-5 rounded object-cover flex-shrink-0" />;
                        return <span className="text-sm flex-shrink-0">{logo}</span>;
                      };

                      return (
                        <div className="flex gap-0 min-w-max">
                          {allRounds.map((round, roundIdx) => {
                            const matches = tournament.bracket.filter(m => m.round === round);
                            const isLast = roundIdx === allRounds.length - 1;
                            return (
                              <div key={round} className="flex gap-0">
                                {/* Round column */}
                                <div className="flex flex-col" style={{ minWidth: 200 }}>
                                  {/* Round label */}
                                  <div className="text-center text-white/40 text-xs uppercase tracking-wider mb-4 px-3">
                                    {roundNamesMap[round] || `Раунд ${round}`}
                                  </div>
                                  {/* Matches with vertical centering */}
                                  <div className="flex flex-col justify-around flex-1 gap-3 px-3">
                                    {matches.map((match) => {
                                      const w1 = match.winner === match.team1;
                                      const w2 = match.winner === match.team2;
                                      return (
                                        <div key={match.id}
                                          className="rounded-xl border border-white/10 overflow-hidden bg-black/40 shadow-lg"
                                          style={{ minWidth: 180 }}>
                                          {/* Team 1 */}
                                          <div className={`flex items-center justify-between px-3 py-2.5 gap-2 ${w1 ? 'bg-green-500/15' : w2 ? 'bg-white/3 opacity-60' : 'bg-white/3'}`}>
                                            <div className="flex items-center gap-2 min-w-0">
                                              {getLogo(match.team1)}
                                              <span className={`text-sm font-medium truncate ${w1 ? 'text-green-400' : 'text-white'}`}>
                                                {match.team1 || '—'}
                                              </span>
                                            </div>
                                            {match.winner && (
                                              <span className={`text-[10px] font-bold flex-shrink-0 px-1.5 py-0.5 rounded-full ${w1 ? 'bg-green-500/25 text-green-400' : 'bg-red-500/15 text-red-400/80'}`}>
                                                {w1 ? 'WIN' : 'L'}
                                              </span>
                                            )}
                                          </div>
                                          {/* Separator */}
                                          <div className="h-px bg-white/8" />
                                          {/* Team 2 */}
                                          <div className={`flex items-center justify-between px-3 py-2.5 gap-2 ${w2 ? 'bg-green-500/15' : w1 ? 'bg-white/3 opacity-60' : 'bg-white/3'}`}>
                                            <div className="flex items-center gap-2 min-w-0">
                                              {getLogo(match.team2)}
                                              <span className={`text-sm font-medium truncate ${w2 ? 'text-green-400' : 'text-white'}`}>
                                                {match.team2 || '—'}
                                              </span>
                                            </div>
                                            {match.winner && (
                                              <span className={`text-[10px] font-bold flex-shrink-0 px-1.5 py-0.5 rounded-full ${w2 ? 'bg-green-500/25 text-green-400' : 'bg-red-500/15 text-red-400/80'}`}>
                                                {w2 ? 'WIN' : 'L'}
                                              </span>
                                            )}
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>

                                {/* Connector lines between rounds */}
                                {!isLast && (
                                  <div className="flex flex-col justify-around pt-8" style={{ width: 28 }}>
                                    {matches.map((_, i) => (
                                      <div key={i} className="flex-1 flex items-center">
                                        <div className="w-full h-px bg-white/15" />
                                      </div>
                                    ))}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </AnimatedSection>
              )}

              {/* Group Table — Win / Loss only */}
              {tournament.groupTable && tournament.groupTable.length > 0 && (
              <AnimatedSection delay={0.15}>
                <div className="bg-gray-900/50 rounded-2xl p-6 lg:p-8 border border-white/10">
                  <div className="flex items-center space-x-3 mb-6">
                    <TableProperties size={20} className="text-white/60" />
                    <h2 className="text-xl font-bold text-white">Групповая таблица</h2>
                  </div>
                  <div className="space-y-2">
                    {[...tournament.groupTable]
                      .sort((a, b) => (b.wins ?? 0) - (a.wins ?? 0))
                      .map((entry, index) => {
                        const isTop = index === 0;
                        const logo = tournament.package !== 'common'
                          ? tournament.teams.find(t => t.name === entry.team)?.logo
                          : undefined;
                        return (
                          <motion.div key={entry.id}
                            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.04 }}
                            className={`flex items-center gap-4 px-4 py-3 rounded-xl border ${isTop ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-black/30 border-white/5'}`}>
                            {/* Position */}
                            <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold flex-shrink-0 ${
                              index === 0 ? 'bg-yellow-500 text-black' :
                              index === 1 ? 'bg-gray-400 text-black' :
                              index === 2 ? 'bg-orange-600 text-white' :
                              'bg-white/10 text-white/50'}`}>{index + 1}</span>
                            {/* Logo */}
                            {logo && (
                              logo.startsWith('http') || logo.startsWith('data:')
                                ? <img src={logo} alt={entry.team} className="w-7 h-7 rounded object-cover flex-shrink-0" />
                                : <span className="text-lg flex-shrink-0">{logo}</span>
                            )}
                            {/* Name */}
                            <span className={`font-medium flex-1 min-w-0 truncate ${isTop ? 'text-yellow-400' : 'text-white'}`}>{entry.team}</span>
                            {/* Win / Loss counts */}
                            <div className="flex items-center gap-3 flex-shrink-0">
                              <div className="flex items-center gap-1.5">
                                <span className="px-2.5 py-1 rounded-lg bg-green-500/20 text-green-400 text-sm font-bold">{entry.wins ?? 0}</span>
                                <span className="text-white/30 text-xs">победы</span>
                              </div>
                              <div className="w-px h-4 bg-white/10"/>
                              <div className="flex items-center gap-1.5">
                                <span className="px-2.5 py-1 rounded-lg bg-red-500/15 text-red-400 text-sm font-bold">{entry.losses ?? 0}</span>
                                <span className="text-white/30 text-xs">пораж.</span>
                              </div>
                            </div>
                          </motion.div>
                        );
                    })}
                  </div>
                </div>
              </AnimatedSection>
              )}

              {/* Player Ratings (Diamond only) */}
              {tournament.package === 'diamond' && tournament.playerRatings && tournament.playerRatings.length > 0 && (
                <AnimatedSection delay={0.2}>
                  <div className="bg-gray-900/50 rounded-2xl p-6 lg:p-8 border border-white/10">
                    <h2 className="text-xl font-bold text-white mb-6">Рейтинг игроков</h2>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr className="border-b border-white/10">
                            <th className="text-left py-3 px-4 text-white/50 text-sm font-medium">#</th>
                            <th className="text-left py-3 px-4 text-white/50 text-sm font-medium">Игрок</th>
                            <th className="text-left py-3 px-4 text-white/50 text-sm font-medium">Команда</th>
                            <th className="text-right py-3 px-4 text-white/50 text-sm font-medium">K/D</th>
                            <th className="text-right py-3 px-4 text-white/50 text-sm font-medium">Рейтинг</th>
                          </tr>
                        </thead>
                        <tbody>
                          {tournament.playerRatings.map((player, index) => (
                            <motion.tr
                              key={player.id}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: index * 0.05 }}
                              className="border-b border-white/5 hover:bg-white/5 transition-colors"
                            >
                              <td className="py-3 px-4">
                                <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                  index === 0 ? 'bg-yellow-500 text-black' :
                                  index === 1 ? 'bg-gray-400 text-black' :
                                  index === 2 ? 'bg-orange-600 text-white' :
                                  'bg-white/10 text-white/50'
                                }`}>
                                  {index + 1}
                                </span>
                              </td>
                              <td className="py-3 px-4 text-white font-medium">{player.name}</td>
                              <td className="py-3 px-4 text-white/70">{player.team}</td>
                              <td className="py-3 px-4 text-right text-white/70">
                                {player.kills && player.deaths
                                  ? `${player.kills}/${player.deaths}`
                                  : '-'}
                              </td>
                              <td className="py-3 px-4 text-right">
                                <span className="font-bold text-white">{player.score}</span>
                              </td>
                            </motion.tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </AnimatedSection>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Teams */}
              <AnimatedSection direction="right">
                <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/10">
                  <h2 className="text-lg font-bold text-white mb-4">Участники</h2>
                  <div className="space-y-2">
                    {tournament.teams.map((team, index) => (
                      <motion.div
                        key={team.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className="flex items-center p-3 rounded-xl bg-black/30 hover:bg-black/50 transition-colors"
                      >
                        {tournament.package !== 'common' && team.logo && (() => {
                          const logo = team.logo;
                          if (logo.startsWith('http') || logo.startsWith('data:'))
                            return <img src={logo} alt={team.name} className="w-8 h-8 rounded-lg object-cover mr-3 flex-shrink-0" />;
                          return <span className="text-xl mr-3">{logo}</span>;
                        })()}
                        <span className="text-white font-medium">{team.name}</span>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              {/* Telegram — показываем только если ссылка заполнена */}
              {tournament.telegramLink && (
                <AnimatedSection direction="right" delay={0.1}>
                  <a
                    href={tournament.telegramLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-6 hover:from-blue-600 hover:to-blue-700 transition-all duration-300 group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <Send size={24} className="text-white mr-3" />
                        <div>
                          <div className="text-white font-bold">Telegram-канал</div>
                          <div className="text-white/70 text-sm">Следите за обновлениями</div>
                        </div>
                      </div>
                      <ExternalLink size={20} className="text-white/70 group-hover:text-white transition-colors" />
                    </div>
                  </a>
                </AnimatedSection>
              )}

              {/* Package Info */}
              <AnimatedSection direction="right" delay={0.2}>
                <div className="bg-gray-900/50 rounded-2xl p-6 border border-white/10">
                  <h2 className="text-lg font-bold text-white mb-4">Информация</h2>
                  <div className="space-y-4 text-sm">
                    <div className="flex justify-between">
                      <span className="text-white/50">Пакет</span>
                      <span className="text-white font-medium capitalize">{tournament.package}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Формат</span>
                      <span className="text-white font-medium">{tournament.format}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-white/50">Статус</span>
                      <span className="text-white font-medium capitalize">
                        {tournament.status === 'active' ? 'Активен' :
                         tournament.status === 'completed' ? 'Завершен' : 'Скоро'}
                      </span>
                    </div>
                    {tournament.prizePool && (
                      <div className="flex justify-between">
                        <span className="text-white/50">Призовой фонд</span>
                        <span className="text-white font-medium">{tournament.prizePool}</span>
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default TournamentDetail;
