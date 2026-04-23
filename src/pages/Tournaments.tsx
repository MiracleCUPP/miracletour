import { useState, useEffect } from 'react';
import { Search, Trophy, Sparkles, Zap, Crown, Loader2 } from 'lucide-react';
import { Tournament, PackageType } from '../types';
import { getActiveTournaments } from '../utils/storage';
import TournamentCard from '../components/TournamentCard';
import AnimatedSection from '../components/AnimatedSection';
import { motion } from 'framer-motion';

const Tournaments: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [packageFilter, setPackageFilter] = useState<PackageType | 'all'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await getActiveTournaments();
      setTournaments(data);
      setFilteredTournaments(data);
      setLoading(false);
    };
    
    loadData();
  }, []);

  useEffect(() => {
    let result = tournaments;

    // Search filter
    if (searchQuery) {
      result = result.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.game?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Package filter
    if (packageFilter !== 'all') {
      result = result.filter(t => t.package === packageFilter);
    }

    setFilteredTournaments(result);
  }, [searchQuery, packageFilter, tournaments]);

  const packageButtons = [
    { value: 'all', label: 'Все', icon: Sparkles, color: 'white' },
    { value: 'diamond', label: 'Diamond', icon: Crown, color: 'cyan' },
    { value: 'premium', label: 'Premium', icon: Zap, color: 'yellow' },
    { value: 'common', label: 'Common', icon: Trophy, color: 'gray' },
  ];

  return (
    <div className="min-h-screen bg-black pt-20 lg:pt-24">
      {/* Hero */}
      <section className="relative py-16 lg:py-24 border-b border-white/5 overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-white/3 rounded-full blur-3xl"></div>
        </div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }}></div>
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
              <Trophy size={36} />
            </motion.div>
            <h1 className="text-5xl lg:text-7xl font-black text-white mb-6 tracking-tight">
              Турниры
            </h1>
            <p className="text-white/60 text-xl max-w-2xl mx-auto">
              Найдите и примите участие в актуальных соревнованиях от Miracle
            </p>
            
            {/* Stats */}
            <div className="flex justify-center gap-8 mt-10">
              <div className="text-center">
                <div className="text-3xl font-bold text-white">{tournaments.length}</div>
                <div className="text-sm text-white/50">Активных</div>
              </div>
              <div className="w-px bg-white/10"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  {tournaments.filter(t => t.package === 'diamond').length}
                </div>
                <div className="text-sm text-white/50">Diamond</div>
              </div>
              <div className="w-px bg-white/10"></div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white">
                  {tournaments.filter(t => t.package === 'premium').length}
                </div>
                <div className="text-sm text-white/50">Premium</div>
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-white/5 sticky top-16 lg:top-20 bg-black/95 backdrop-blur-xl z-40">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4 items-center">
            {/* Search */}
            <div className="relative flex-grow w-full lg:max-w-md">
              <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
              <input
                type="text"
                placeholder="Поиск турниров..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 focus:bg-white/10 transition-all duration-300"
              />
            </div>

            {/* Package Filter Buttons */}
            <div className="flex gap-2 flex-wrap justify-center">
              {packageButtons.map((btn) => {
                const Icon = btn.icon;
                const isActive = packageFilter === btn.value;
                return (
                  <motion.button
                    key={btn.value}
                    onClick={() => setPackageFilter(btn.value as PackageType | 'all')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-300 ${
                      isActive 
                        ? btn.value === 'diamond' 
                          ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30'
                          : btn.value === 'premium'
                          ? 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20 text-yellow-400 border border-yellow-500/30'
                          : 'bg-white/10 text-white border border-white/20'
                        : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10 hover:text-white'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon size={16} />
                    <span>{btn.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Tournaments Grid */}
      <section className="py-12 lg:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 size={40} className="animate-spin text-white/50 mb-4" />
              <p className="text-white/50">Загрузка турниров...</p>
            </div>
          ) : filteredTournaments.length > 0 ? (
            <>
              <div className="mb-6 text-white/50 text-sm">
                Найдено турниров: {filteredTournaments.length}
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTournaments.map((tournament, index) => (
                  <TournamentCard key={tournament.id} tournament={tournament} index={index} />
                ))}
              </div>
            </>
          ) : (
            <AnimatedSection className="text-center py-20">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/5 text-white/40 mb-4">
                <Trophy size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Турниры не найдены
              </h3>
              <p className="text-white/50">
                {searchQuery || packageFilter !== 'all'
                  ? 'Попробуйте изменить параметры поиска'
                  : 'Пока нет активных турниров. Загляните позже!'}
              </p>
            </AnimatedSection>
          )}
        </div>
      </section>
    </div>
  );
};

export default Tournaments;
