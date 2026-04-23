import { useState, useEffect } from 'react';
import { Search, Archive, Trophy, Crown, Gem, Loader2 } from 'lucide-react';
import { Tournament } from '../types';
import { getCompletedTournaments } from '../utils/storage';
import TournamentCard from '../components/TournamentCard';
import AnimatedSection from '../components/AnimatedSection';

const Completed: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [filteredTournaments, setFilteredTournaments] = useState<Tournament[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const data = await getCompletedTournaments();
      const permanentTournaments = data.filter(
        t => t.package === 'premium' || t.package === 'diamond'
      );
      setTournaments(permanentTournaments);
      setFilteredTournaments(permanentTournaments);
      setLoading(false);
    };
    loadData();
  }, []);

  useEffect(() => {
    if (searchQuery) {
      const filtered = tournaments.filter(t =>
        t.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        t.game?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTournaments(filtered);
    } else {
      setFilteredTournaments(tournaments);
    }
  }, [searchQuery, tournaments]);

  return (
    <div className="min-h-screen bg-black pt-20 lg:pt-24">
      {/* Hero */}
      <section className="py-12 lg:py-20 border-b border-white/5">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <AnimatedSection className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 text-white mb-6">
              <Archive size={32} />
            </div>
            <h1 className="text-4xl lg:text-6xl font-bold text-white mb-4">
              Завершенные турниры
            </h1>
            <p className="text-white/60 text-lg">
              Архив турниров Premium и Diamond. История наших соревнований.
            </p>
          </AnimatedSection>
        </div>
      </section>

      {/* Info Banner */}
      <section className="py-8 border-b border-white/5">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-r from-purple-900/20 to-blue-900/20 rounded-2xl p-6 border border-white/10">
            <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="flex -space-x-2">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center border-2 border-black">
                    <Gem size={18} className="text-white" />
                  </div>
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center border-2 border-black">
                    <Crown size={18} className="text-black" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">
                  Только Premium и Diamond
                </h3>
                <p className="text-white/60 text-sm">
                  Турниры с пакетами Premium и Diamond остаются в архиве навсегда. 
                  Здесь хранится история лучших соревнований Miracle.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Search */}
      <section className="py-8 border-b border-white/5 sticky top-16 lg:top-20 bg-black/95 backdrop-blur-md z-40">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="relative max-w-xl mx-auto">
            <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
            <input
              type="text"
              placeholder="Поиск в архиве..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
            />
          </div>
        </div>
      </section>

      {/* Tournaments Grid */}
      <section className="py-12 lg:py-16">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          {filteredTournaments.length > 0 ? (
            <>
              <div className="mb-6 text-white/50 text-sm">
                Турниров в архиве: {filteredTournaments.length}
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
                {searchQuery
                  ? 'Попробуйте изменить поисковый запрос'
                  : 'Пока нет завершенных турниров в архиве'}
              </p>
            </AnimatedSection>
          )}
        </div>
      </section>
    </div>
  );
};

export default Completed;
