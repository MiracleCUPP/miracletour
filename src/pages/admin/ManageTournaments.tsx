import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import {
  Plus, Edit, Trash2, Eye, Search,
  ArrowLeft, Save, X, Trophy, ChevronDown, ChevronUp, Swords, TableProperties,
  Upload, ImageIcon, Users
} from 'lucide-react';
import { Tournament, PackageType, TournamentStatus, Team, BracketMatch, GroupTableEntry } from '../../types';
import {
  getTournaments, saveTournament, deleteTournament,
  getTournamentById, generateId, formatDate
} from '../../utils/storage';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

// ─── Auth Guard ───────────────────────────────────────────────

const useAuthGuard = () => {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && !isAdmin) navigate('/admin/login');
  }, [isAdmin, isLoading, navigate]);
  return { isAdmin, isLoading };
};

// ─── Tournament List ──────────────────────────────────────────

const TournamentList: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => { getTournaments().then(setTournaments); }, []);

  const handleDelete = async (id: string) => {
    await deleteTournament(id);
    getTournaments().then(setTournaments);
    setDeleteId(null);
  };

  const handleStatusChange = async (tournament: Tournament, newStatus: TournamentStatus) => {
    await saveTournament({ ...tournament, status: newStatus });
    getTournaments().then(setTournaments);
  };

  const filtered = tournaments.filter(t =>
    t.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Турниры</h1>
          <p className="text-white/50">Управление турнирами на платформе</p>
        </div>
        <Link to="/admin/tournaments/new"
          className="flex items-center space-x-2 px-4 py-2 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors">
          <Plus size={18} /><span>Создать турнир</span>
        </Link>
      </div>

      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
        <input type="text" placeholder="Поиск турниров..." value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30" />
      </div>

      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6 text-white/50 text-sm font-medium">Турнир</th>
                <th className="text-left py-4 px-4 text-white/50 text-sm font-medium">Пакет</th>
                <th className="text-left py-4 px-4 text-white/50 text-sm font-medium">Статус</th>
                <th className="text-left py-4 px-4 text-white/50 text-sm font-medium">Дата</th>
                <th className="text-right py-4 px-6 text-white/50 text-sm font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((tournament) => (
                <tr key={tournament.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img src={tournament.banner} alt="" className="w-12 h-12 rounded-lg object-cover" />
                      <div>
                        <div className="text-white font-medium">{tournament.title}</div>
                        <div className="text-white/50 text-sm">{tournament.game || 'Не указано'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium uppercase ${
                      tournament.package === 'diamond' ? 'bg-purple-500/20 text-purple-300'
                      : tournament.package === 'premium' ? 'bg-white/20 text-white'
                      : 'bg-gray-500/20 text-gray-300'}`}>{tournament.package}</span>
                  </td>
                  <td className="py-4 px-4">
                    <select value={tournament.status}
                      onChange={(e) => handleStatusChange(tournament, e.target.value as TournamentStatus)}
                      className="px-3 py-1 rounded-lg text-xs font-medium cursor-pointer bg-transparent border border-white/20 text-white">
                      <option value="active" className="bg-gray-900">Активен</option>
                      <option value="upcoming" className="bg-gray-900">Скоро</option>
                      <option value="completed" className="bg-gray-900">Завершен</option>
                    </select>
                  </td>
                  <td className="py-4 px-4 text-white/70 text-sm">{formatDate(tournament.date)}</td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <Link to={`/tournaments/${tournament.id}`} target="_blank"
                        className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Просмотр"><Eye size={18} /></Link>
                      <Link to={`/admin/tournaments/${tournament.id}`}
                        className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors" title="Редактировать"><Edit size={18} /></Link>
                      <button onClick={() => setDeleteId(tournament.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors" title="Удалить"><Trash2 size={18} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filtered.length === 0 && (
            <div className="text-center py-12">
              <Trophy size={40} className="mx-auto text-white/20 mb-3" />
              <p className="text-white/50">Турниры не найдены</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {deleteId && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteId(null)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-white/10">
              <h3 className="text-xl font-bold text-white mb-2">Удалить турнир?</h3>
              <p className="text-white/60 mb-6">Это действие нельзя отменить. Турнир будет удален навсегда.</p>
              <div className="flex space-x-3">
                <button onClick={() => setDeleteId(null)}
                  className="flex-1 py-2 px-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors">Отмена</button>
                <button onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-2 px-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors">Удалить</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─── Bracket Editor ───────────────────────────────────────────

interface BracketEditorProps {
  bracket: BracketMatch[];
  teams: Team[];
  onChange: (bracket: BracketMatch[]) => void;
}

const ROUND_NAMES: Record<number, string> = {
  1: 'Раунд 1',
  2: 'Раунд 2 / Четвертьфинал',
  3: 'Полуфинал',
  4: 'Финал',
  5: 'Гранд-финал',
};

const BracketEditor: React.FC<BracketEditorProps> = ({ bracket, teams, onChange }) => {
  const [open, setOpen] = useState(true);
  const [newRound, setNewRound] = useState(1);
  const [newTeam1, setNewTeam1] = useState('');
  const [newTeam2, setNewTeam2] = useState('');

  const teamOptions = teams.map(t => t.name);

  const addMatch = () => {
    if (!newTeam1.trim() || !newTeam2.trim()) return;
    onChange([...bracket, {
      id: generateId(),
      round: newRound,
      team1: newTeam1.trim(),
      team2: newTeam2.trim(),
    }]);
    setNewTeam1('');
    setNewTeam2('');
  };

  const setWinner = (id: string, winner: string | undefined) => {
    onChange(bracket.map(m => m.id === id ? { ...m, winner } : m));
  };

  const removeMatch = (id: string) => onChange(bracket.filter(m => m.id !== id));

  const rounds = [...new Set(bracket.map(m => m.round))].sort((a, b) => a - b);

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
      <button type="button" onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors">
        <div className="flex items-center space-x-3">
          <Swords size={20} className="text-white/70" />
          <h2 className="text-lg font-semibold text-white">Турнирная сетка</h2>
          <span className="text-white/40 text-sm">({bracket.length} матчей)</span>
        </div>
        {open ? <ChevronUp size={18} className="text-white/40" /> : <ChevronDown size={18} className="text-white/40" />}
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-white/10 pt-6 space-y-5">
          {/* Matches grouped by round */}
          {rounds.map(round => (
            <div key={round}>
              <h3 className="text-white/40 text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
                <span className="w-5 h-px bg-white/20" />
                {ROUND_NAMES[round] || `Раунд ${round}`}
                <span className="flex-1 h-px bg-white/10" />
              </h3>
              <div className="space-y-2">
                {bracket.filter(m => m.round === round).map(match => (
                  <div key={match.id}
                    className="grid grid-cols-[1fr_24px_1fr_28px] gap-2 items-center bg-black/30 rounded-xl px-4 py-3 border border-white/5">
                    {/* Team 1 */}
                    <button type="button"
                      onClick={() => setWinner(match.id, match.winner === match.team1 ? undefined : match.team1)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm font-medium transition-all text-left ${
                        match.winner === match.team1
                          ? 'bg-green-500/15 border-green-500/50 text-green-400'
                          : match.winner === match.team2
                          ? 'bg-red-500/10 border-red-500/20 text-red-400/70 line-through'
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}>
                      <span className="truncate">{match.team1 || '—'}</span>
                      {match.winner === match.team1 && <span className="text-xs ml-2 flex-shrink-0 font-bold">Победа</span>}
                      {match.winner === match.team2 && <span className="text-xs ml-2 flex-shrink-0">Пораж.</span>}
                    </button>

                    {/* VS */}
                    <span className="text-white/25 text-xs text-center font-bold">VS</span>

                    {/* Team 2 */}
                    <button type="button"
                      onClick={() => setWinner(match.id, match.winner === match.team2 ? undefined : match.team2)}
                      className={`flex items-center justify-between px-3 py-2 rounded-lg border text-sm font-medium transition-all text-left ${
                        match.winner === match.team2
                          ? 'bg-green-500/15 border-green-500/50 text-green-400'
                          : match.winner === match.team1
                          ? 'bg-red-500/10 border-red-500/20 text-red-400/70 line-through'
                          : 'bg-white/5 border-white/10 text-white hover:bg-white/10'
                      }`}>
                      <span className="truncate">{match.team2 || '—'}</span>
                      {match.winner === match.team2 && <span className="text-xs ml-2 flex-shrink-0 font-bold">Победа</span>}
                      {match.winner === match.team1 && <span className="text-xs ml-2 flex-shrink-0">Пораж.</span>}
                    </button>

                    {/* Delete */}
                    <button type="button" onClick={() => removeMatch(match.id)}
                      className="flex items-center justify-center w-7 h-7 text-red-400/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors">
                      <X size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {bracket.length === 0 && (
            <p className="text-white/25 text-sm text-center py-4">Матчи ещё не добавлены — заполни форму ниже</p>
          )}

          {/* Add match form */}
          <div className="bg-black/20 border border-dashed border-white/15 rounded-xl p-4 space-y-3">
            <p className="text-white/50 text-sm font-medium">Добавить матч</p>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px_1fr] gap-3 items-end">
              <div>
                <label className="text-white/40 text-xs mb-1.5 block">Команда 1</label>
                <div className="space-y-1.5">
                  <select value={newTeam1}
                    onChange={(e) => setNewTeam1(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30 cursor-pointer">
                    <option value="" className="bg-gray-900">— Выбрать —</option>
                    {teamOptions.map(t => <option key={t} value={t} className="bg-gray-900">{t}</option>)}
                  </select>
                  <input type="text" value={newTeam1}
                    onChange={(e) => setNewTeam1(e.target.value)}
                    placeholder="или введи вручную"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/30" />
                </div>
              </div>

              <div>
                <label className="text-white/40 text-xs mb-1.5 block">Раунд</label>
                <select value={newRound}
                  onChange={(e) => setNewRound(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none cursor-pointer">
                  {[1,2,3,4,5].map(r => (
                    <option key={r} value={r} className="bg-gray-900">{ROUND_NAMES[r]}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-white/40 text-xs mb-1.5 block">Команда 2</label>
                <div className="space-y-1.5">
                  <select value={newTeam2}
                    onChange={(e) => setNewTeam2(e.target.value)}
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none focus:border-white/30 cursor-pointer">
                    <option value="" className="bg-gray-900">— Выбрать —</option>
                    {teamOptions.map(t => <option key={t} value={t} className="bg-gray-900">{t}</option>)}
                  </select>
                  <input type="text" value={newTeam2}
                    onChange={(e) => setNewTeam2(e.target.value)}
                    placeholder="или введи вручную"
                    className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm placeholder-white/25 focus:outline-none focus:border-white/30" />
                </div>
              </div>
            </div>

            <button type="button" onClick={addMatch}
              disabled={!newTeam1.trim() || !newTeam2.trim()}
              className="flex items-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm">
              <Plus size={15} /><span>Добавить матч</span>
            </button>
          </div>
          <p className="text-white/25 text-xs">Нажми на команду чтобы отметить победителя</p>
        </div>
      )}
    </div>
  );
};

// ─── Group Table Editor ───────────────────────────────────────

interface GroupTableEditorProps {
  groupTable: GroupTableEntry[];
  teams: Team[];
  onChange: (table: GroupTableEntry[]) => void;
}

const GroupTableEditor: React.FC<GroupTableEditorProps> = ({ groupTable, teams, onChange }) => {
  const [open, setOpen] = useState(true);
  const [newTeam, setNewTeam] = useState('');
  const [newWins, setNewWins] = useState(0);
  const [newLosses, setNewLosses] = useState(0);

  const addRow = () => {
    if (!newTeam) return;
    onChange([...groupTable, { id: generateId(), team: newTeam, wins: newWins, losses: newLosses }]);
    setNewTeam('');
    setNewWins(0);
    setNewLosses(0);
  };

  const updateRow = (id: string, field: keyof GroupTableEntry, value: any) => {
    onChange(groupTable.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const removeRow = (id: string) => onChange(groupTable.filter(e => e.id !== id));

  const sorted = [...groupTable].sort((a, b) => b.wins - a.wins);
  const teamOptions = teams.map(t => t.name);

  return (
    <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
      <button type="button" onClick={() => setOpen(v => !v)}
        className="w-full flex items-center justify-between p-6 text-left hover:bg-white/5 transition-colors">
        <div className="flex items-center space-x-3">
          <TableProperties size={20} className="text-white/70" />
          <h2 className="text-lg font-semibold text-white">Групповая таблица</h2>
          <span className="text-white/40 text-sm">({groupTable.length} команд)</span>
        </div>
        {open ? <ChevronUp size={18} className="text-white/40" /> : <ChevronDown size={18} className="text-white/40" />}
      </button>

      {open && (
        <div className="px-6 pb-6 border-t border-white/10 pt-6 space-y-4">
          {sorted.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-2 px-3 text-white/40 font-medium w-8">#</th>
                    <th className="text-left py-2 px-3 text-white/40 font-medium">Команда</th>
                    <th className="text-center py-2 px-3 text-white/40 font-medium w-24">Победы</th>
                    <th className="text-center py-2 px-3 text-white/40 font-medium w-24">Поражения</th>
                    <th className="w-8"></th>
                  </tr>
                </thead>
                <tbody>
                  {sorted.map((entry, index) => (
                    <tr key={entry.id} className="border-b border-white/5">
                      <td className="py-2 px-3 text-white/50 text-center">{index + 1}</td>
                      <td className="py-2 px-3">
                        <select value={entry.team}
                          onChange={(e) => updateRow(entry.id, 'team', e.target.value)}
                          className="bg-transparent text-white border-none outline-none cursor-pointer max-w-[160px]">
                          {teamOptions.map(t => <option key={t} value={t} className="bg-gray-900">{t}</option>)}
                          {!teamOptions.includes(entry.team) && (
                            <option value={entry.team} className="bg-gray-900">{entry.team}</option>
                          )}
                        </select>
                      </td>
                      <td className="py-1 px-3">
                        <input type="number" min="0" value={entry.wins}
                          onChange={(e) => updateRow(entry.id, 'wins', Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm text-center focus:outline-none focus:border-white/30" />
                      </td>
                      <td className="py-1 px-3">
                        <input type="number" min="0" value={entry.losses}
                          onChange={(e) => updateRow(entry.id, 'losses', Number(e.target.value))}
                          className="w-full px-2 py-1.5 bg-black/40 border border-white/10 rounded-lg text-white text-sm text-center focus:outline-none focus:border-white/30" />
                      </td>
                      <td className="py-2 px-2">
                        <button type="button" onClick={() => removeRow(entry.id)}
                          className="text-red-400/50 hover:text-red-400 transition-colors"><X size={14} /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {groupTable.length === 0 && (
            <p className="text-white/30 text-sm text-center py-4">Таблица пустая — добавьте команды</p>
          )}

          <div className="bg-black/20 border border-dashed border-white/15 rounded-xl p-4 space-y-3">
            <p className="text-white/50 text-sm font-medium">Добавить команду</p>
            <div className="grid grid-cols-1 sm:grid-cols-[1fr_100px_100px_auto] gap-3 items-end">
              <div>
                <label className="text-white/40 text-xs mb-1.5 block">Команда</label>
                <select value={newTeam} onChange={(e) => setNewTeam(e.target.value)}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm focus:outline-none cursor-pointer">
                  <option value="" className="bg-gray-900">— Выбрать —</option>
                  {teamOptions.map(t => <option key={t} value={t} className="bg-gray-900">{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-white/40 text-xs mb-1.5 block">Победы</label>
                <input type="number" min="0" value={newWins}
                  onChange={(e) => setNewWins(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm text-center focus:outline-none" />
              </div>
              <div>
                <label className="text-white/40 text-xs mb-1.5 block">Поражения</label>
                <input type="number" min="0" value={newLosses}
                  onChange={(e) => setNewLosses(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-black/40 border border-white/10 rounded-lg text-white text-sm text-center focus:outline-none" />
              </div>
              <button type="button" onClick={addRow} disabled={!newTeam}
                className="flex items-center justify-center space-x-2 px-4 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20 transition-colors disabled:opacity-40 disabled:cursor-not-allowed text-sm">
                <Plus size={15} /><span>Добавить</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// ─── Tournament Form ──────────────────────────────────────────

const TournamentForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id && id !== 'new';

  const [formData, setFormData] = useState<Partial<Tournament>>({
    title: '', date: '', endDate: '', format: '', description: '', fullDescription: '',
    banner: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=1200',
    package: 'premium', teams: [], bracket: [], groupTable: [],
    status: 'upcoming', telegramLink: '', prizePool: '', game: ''
  });

  const [teams, setTeams] = useState<Team[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    (async () => {
      if (isEditing) {
        const tournament = await getTournamentById(id);
        if (tournament) {
          setFormData({ ...tournament, groupTable: tournament.groupTable ?? [] });
          setTeams(tournament.teams);
        }
      }
    })();
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Team management
  const addTeam = () => {
    setTeams(prev => [...prev, { id: generateId(), name: '', logo: undefined }]);
  };

  const updateTeam = (id: string, field: keyof Team, value: string | undefined) => {
    setTeams(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const removeTeam = (id: string) => {
    setTeams(prev => prev.filter(t => t.id !== id));
  };

  const MAX_LOGO_SIZE = 512 * 1024; // 512 KB

  const handleLogoFile = (teamId: string, file: File) => {
    if (file.size > MAX_LOGO_SIZE) {
      alert(`Файл слишком большой (${(file.size / 1024).toFixed(0)} KB). Максимум 512 KB.`);
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Разрешены только изображения.');
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      updateTeam(teamId, 'logo', e.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const currentTeams = teams;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    const tournamentData: Tournament = {
      id: isEditing ? id : generateId(),
      title: formData.title || '',
      date: formData.date || '',
      endDate: formData.endDate,
      format: formData.format || '',
      description: formData.description || '',
      fullDescription: formData.fullDescription,
      banner: formData.banner || '',
      package: formData.package as PackageType,
      teams,
      bracket: formData.bracket || [],
      groupTable: formData.groupTable || [],
      playerRatings: formData.playerRatings,
      status: formData.status as TournamentStatus,
      telegramLink: formData.telegramLink || '',
      prizePool: formData.prizePool,
      game: formData.game,
      createdAt: isEditing ? formData.createdAt || new Date().toISOString() : new Date().toISOString()
    };
    try {
      await saveTournament(tournamentData);
      navigate('/admin/tournaments');
    } catch (err) {
      console.error('Ошибка сохранения турнира:', err);
      alert('Ошибка сохранения. Проверь консоль.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link to="/admin/tournaments"
          className="inline-flex items-center text-white/50 hover:text-white mb-4 transition-colors">
          <ArrowLeft size={18} className="mr-2" />Назад к списку
        </Link>
        <h1 className="text-2xl font-bold text-white">
          {isEditing ? 'Редактировать турнир' : 'Создать турнир'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Основная информация</h2>
          <div>
            <label className="block text-white/70 text-sm mb-2">Название турнира *</label>
            <input type="text" name="title" value={formData.title} onChange={handleChange} required
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30" />
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Игра</label>
              <input type="text" name="game" value={formData.game} onChange={handleChange} placeholder="CS2, Valorant..."
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30" />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Формат</label>
              <input type="text" name="format" value={formData.format} onChange={handleChange} placeholder="5v5 Double Elimination"
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30" />
            </div>
          </div>
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Дата начала *</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} required
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30" />
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Дата окончания</label>
              <input type="date" name="endDate" value={formData.endDate} onChange={handleChange}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30" />
            </div>
          </div>
          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-white/70 text-sm mb-2">Пакет *</label>
              <select name="package" value={formData.package} onChange={handleChange}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none cursor-pointer">
                <option value="common">Common</option>
                <option value="premium">Premium</option>
                <option value="diamond">Diamond</option>
              </select>
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Статус *</label>
              <select name="status" value={formData.status} onChange={handleChange}
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none cursor-pointer">
                <option value="upcoming">Скоро</option>
                <option value="active">Активен</option>
                <option value="completed">Завершен</option>
              </select>
            </div>
            <div>
              <label className="block text-white/70 text-sm mb-2">Призовой фонд</label>
              <input type="text" name="prizePool" value={formData.prizePool} onChange={handleChange} placeholder="10,000₽"
                className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30" />
            </div>
          </div>
        </div>

        {/* Description */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Описание</h2>
          <div>
            <label className="block text-white/70 text-sm mb-2">Краткое описание *</label>
            <textarea name="description" value={formData.description} onChange={handleChange} required rows={2}
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none resize-none" />
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-2">Полное описание</label>
            <textarea name="fullDescription" value={formData.fullDescription} onChange={handleChange} rows={6}
              placeholder="Поддерживается Markdown..."
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none resize-none" />
          </div>
        </div>

        {/* Media & Links */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Медиа и ссылки</h2>
          <div>
            <label className="block text-white/70 text-sm mb-2">URL баннера</label>
            <input type="url" name="banner" value={formData.banner} onChange={handleChange}
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none" />
            {formData.banner && <img src={formData.banner} alt="Preview" className="mt-3 h-32 rounded-lg object-cover" />}
          </div>
          <div>
            <label className="block text-white/70 text-sm mb-2">Telegram-канал</label>
            <input type="url" name="telegramLink" value={formData.telegramLink} onChange={handleChange}
              placeholder="https://t.me/..."
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none" />
          </div>
        </div>

        {/* Teams */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white">Команды</h2>
            <button type="button" onClick={addTeam}
              className="flex items-center space-x-2 px-3 py-1.5 bg-white/10 text-white text-sm rounded-lg hover:bg-white/20 transition-colors">
              <Plus size={15} /><span>Добавить команду</span>
            </button>
          </div>

          {formData.package === 'common' && (
            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-3">
              <p className="text-yellow-500 text-sm">⚠️ Пакет <strong>Common</strong> — логотипы скрыты на публичной странице.</p>
            </div>
          )}
          {(formData.package === 'premium' || formData.package === 'diamond') && (
            <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-3">
              <p className="text-green-400 text-sm">✓ Пакет <strong className="capitalize">{formData.package}</strong> — логотипы отображаются!</p>
            </div>
          )}

          {teams.length === 0 && (
            <div className="text-center py-8 border border-dashed border-white/10 rounded-xl">
              <Users size={32} className="mx-auto text-white/20 mb-2" />
              <p className="text-white/30 text-sm">Нажмите «Добавить команду»</p>
            </div>
          )}

          <div className="space-y-3">
            {teams.map((team, index) => (
              <div key={team.id} className="bg-black/30 rounded-xl p-4 border border-white/5">
                <div className="flex items-start gap-3">
                  {/* Logo preview / upload area */}
                  <div className="flex-shrink-0">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10 group cursor-pointer"
                      onClick={() => document.getElementById(`logo-file-${team.id}`)?.click()}>
                      {team.logo ? (
                        team.logo.startsWith('data:') || team.logo.startsWith('http') ? (
                          <img src={team.logo} alt="" className="w-full h-full object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).src = ''; }} />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-2xl">{team.logo}</div>
                        )
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-white/20 group-hover:text-white/50 transition-colors">
                          <ImageIcon size={20} />
                          <span className="text-[10px] mt-1">Лого</span>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <Upload size={16} className="text-white" />
                      </div>
                    </div>
                    <input type="file" id={`logo-file-${team.id}`} accept="image/*" className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleLogoFile(team.id, file);
                      }} />
                  </div>

                  {/* Name + logo URL */}
                  <div className="flex-1 space-y-2 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-white/30 text-xs w-5 text-right flex-shrink-0">{index + 1}</span>
                      <input
                        type="text"
                        value={team.name}
                        onChange={(e) => updateTeam(team.id, 'name', e.target.value)}
                        placeholder="Название команды"
                        className="flex-1 px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-white/30 text-sm focus:outline-none focus:border-white/30"
                      />
                    </div>

                    <div className="flex items-center gap-2 ml-7">
                      <div className="flex-1 relative">
                        <input
                          type="text"
                          value={team.logo?.startsWith('data:') ? '' : (team.logo || '')}
                          onChange={(e) => updateTeam(team.id, 'logo', e.target.value || undefined)}
                          placeholder="Вставить URL логотипа (imgur, etc) или загрузить файл ↑"
                          className="w-full px-3 py-2 bg-white/5 border border-white/10 rounded-lg text-white/70 placeholder-white/20 text-xs focus:outline-none focus:border-white/30 pr-16"
                        />
                        {team.logo?.startsWith('data:') && (
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-green-400 text-xs font-medium">✓ файл</span>
                        )}
                      </div>
                      {team.logo && (
                        <button type="button" onClick={() => updateTeam(team.id, 'logo', undefined)}
                          className="text-white/30 hover:text-red-400 transition-colors flex-shrink-0" title="Удалить логотип">
                          <X size={14} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Delete team */}
                  <button type="button" onClick={() => removeTeam(team.id)}
                    className="flex-shrink-0 p-1.5 text-red-400/40 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors mt-0.5">
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {teams.length > 0 && (
            <button type="button" onClick={addTeam}
              className="w-full py-2.5 border border-dashed border-white/15 text-white/40 hover:text-white/70 hover:border-white/30 rounded-xl text-sm transition-colors flex items-center justify-center gap-2">
              <Plus size={15} />Добавить ещё команду
            </button>
          )}
        </div>

        {/* Bracket & Table — appear after 2+ teams */}
        {currentTeams.length >= 2 ? (
          <>
            <BracketEditor
              bracket={formData.bracket || []}
              teams={currentTeams}
              onChange={(bracket) => setFormData(prev => ({ ...prev, bracket }))}
            />
            <GroupTableEditor
              groupTable={formData.groupTable || []}
              teams={currentTeams}
              onChange={(groupTable) => setFormData(prev => ({ ...prev, groupTable }))}
            />
          </>
        ) : (
          <div className="bg-white/3 border border-dashed border-white/10 rounded-2xl p-6 text-center">
            <p className="text-white/30 text-sm">
              Добавьте минимум 2 команды выше, чтобы редактировать сетку и таблицу
            </p>
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button type="submit" disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50">
            {isSaving
              ? <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              : <Save size={18} />}
            <span>{isEditing ? 'Сохранить' : 'Создать'}</span>
          </button>
          <Link to="/admin/tournaments"
            className="flex items-center space-x-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors">
            <X size={18} /><span>Отмена</span>
          </Link>
        </div>
      </form>
    </div>
  );
};

// ─── Main Export ──────────────────────────────────────────────

const ManageTournaments: React.FC = () => {
  const { isAdmin, isLoading } = useAuthGuard();
  const { id } = useParams<{ id: string }>();
  if (isLoading || !isAdmin) return null;
  if (id) return <TournamentForm />;
  return <TournamentList />;
};

export default ManageTournaments;
