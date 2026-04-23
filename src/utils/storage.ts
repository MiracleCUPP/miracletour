// ============================================================
// Storage — Miracle Platform
// Автоматически использует Supabase если настроен,
// иначе работает через localStorage (режим демо)
// ============================================================
import { Tournament, News, Application, SiteSettings } from '../types';
import { mockTournaments, mockNews, mockApplications, defaultAdmin } from '../data/mockData';
import { supabase, isSupabaseReady } from '../lib/supabase';

// ─── localStorage fallback helpers ───────────────────────────

const KEYS = {
  TOURNAMENTS: 'miracle_tournaments',
  NEWS:        'miracle_news',
  APPLICATIONS:'miracle_applications',
  AUTH:        'miracle_auth',
  INITIALIZED: 'miracle_initialized',
  SETTINGS:    'miracle_settings',
};

const DEFAULT_SETTINGS: SiteSettings = {
  logo: 'MIRACLE',
  logoType: 'text',
  organizationName: 'Miracle',
};

export const initializeStorage = () => {
  if (!localStorage.getItem(KEYS.INITIALIZED)) {
    localStorage.setItem(KEYS.TOURNAMENTS,  JSON.stringify(mockTournaments));
    localStorage.setItem(KEYS.NEWS,         JSON.stringify(mockNews));
    localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(mockApplications));
    localStorage.setItem(KEYS.INITIALIZED,  'true');
  }
};

export const clearAllData = () => {
  localStorage.setItem(KEYS.TOURNAMENTS,  JSON.stringify([]));
  localStorage.setItem(KEYS.NEWS,         JSON.stringify([]));
  localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify([]));
};

// ─── TOURNAMENTS ─────────────────────────────────────────────

export const getTournaments = async (): Promise<Tournament[]> => {
  if (isSupabaseReady && supabase) {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) return data.map(dbToTournament);
  }
  const raw = localStorage.getItem(KEYS.TOURNAMENTS);
  return raw ? JSON.parse(raw) : [];
};

export const getTournamentById = async (id: string): Promise<Tournament | undefined> => {
  if (isSupabaseReady && supabase) {
    const { data } = await supabase.from('tournaments').select('*').eq('id', id).single();
    return data ? dbToTournament(data) : undefined;
  }
  const all = JSON.parse(localStorage.getItem(KEYS.TOURNAMENTS) || '[]') as Tournament[];
  return all.find(t => t.id === id);
};

export const getActiveTournaments = async (): Promise<Tournament[]> => {
  if (isSupabaseReady && supabase) {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .in('status', ['active', 'upcoming'])
      .order('created_at', { ascending: false });
    if (!error && data) {
      return data.map(dbToTournament).sort((a, b) => {
        const order = { diamond: 0, premium: 1, common: 2 } as Record<string,number>;
        return (order[a.package] ?? 9) - (order[b.package] ?? 9);
      });
    }
  }
  const all = JSON.parse(localStorage.getItem(KEYS.TOURNAMENTS) || '[]') as Tournament[];
  return all
    .filter(t => t.status === 'active' || t.status === 'upcoming')
    .sort((a, b) => {
      const o = { diamond: 0, premium: 1, common: 2 } as Record<string,number>;
      return (o[a.package] ?? 9) - (o[b.package] ?? 9);
    });
};

export const getCompletedTournaments = async (): Promise<Tournament[]> => {
  if (isSupabaseReady && supabase) {
    const { data, error } = await supabase
      .from('tournaments')
      .select('*')
      .eq('status', 'completed')
      .in('package', ['premium', 'diamond'])
      .order('date', { ascending: false });
    if (!error && data) return data.map(dbToTournament);
  }
  const all = JSON.parse(localStorage.getItem(KEYS.TOURNAMENTS) || '[]') as Tournament[];
  return all
    .filter(t => t.status === 'completed' && (t.package === 'premium' || t.package === 'diamond'))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const saveTournament = async (tournament: Tournament): Promise<void> => {
  if (isSupabaseReady && supabase) {
    const row = tournamentToDb(tournament);
    const { error } = await supabase.from('tournaments').upsert(row);
    if (error) throw new Error(`Supabase saveTournament: ${error.message}`);
    return;
  }
  const all = JSON.parse(localStorage.getItem(KEYS.TOURNAMENTS) || '[]') as Tournament[];
  const idx = all.findIndex(t => t.id === tournament.id);
  if (idx >= 0) all[idx] = tournament; else all.push(tournament);
  localStorage.setItem(KEYS.TOURNAMENTS, JSON.stringify(all));
};

export const deleteTournament = async (id: string): Promise<void> => {
  if (isSupabaseReady && supabase) {
    const { error } = await supabase.from('tournaments').delete().eq('id', id);
    if (error) throw new Error(`Supabase deleteTournament: ${error.message}`);
    return;
  }
  const all = JSON.parse(localStorage.getItem(KEYS.TOURNAMENTS) || '[]') as Tournament[];
  localStorage.setItem(KEYS.TOURNAMENTS, JSON.stringify(all.filter(t => t.id !== id)));
};

// ─── NEWS ────────────────────────────────────────────────────

export const getNews = async (): Promise<News[]> => {
  if (isSupabaseReady && supabase) {
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('is_pinned', { ascending: false })
      .order('created_at', { ascending: false });
    if (!error && data) return data.map(dbToNews);
  }
  const raw = localStorage.getItem(KEYS.NEWS);
  const news: News[] = raw ? JSON.parse(raw) : [];
  return news.sort((a, b) => {
    if (a.isPinned && !b.isPinned) return -1;
    if (!a.isPinned && b.isPinned) return 1;
    return new Date(b.date).getTime() - new Date(a.date).getTime();
  });
};

export const getNewsById = async (id: string): Promise<News | undefined> => {
  if (isSupabaseReady && supabase) {
    const { data } = await supabase.from('news').select('*').eq('id', id).single();
    return data ? dbToNews(data) : undefined;
  }
  const all = JSON.parse(localStorage.getItem(KEYS.NEWS) || '[]') as News[];
  return all.find(n => n.id === id);
};

export const saveNews = async (newsItem: News): Promise<void> => {
  if (isSupabaseReady && supabase) {
    const { error } = await supabase.from('news').upsert(newsToDb(newsItem));
    if (error) throw new Error(`Supabase saveNews: ${error.message}`);
    return;
  }
  const all = JSON.parse(localStorage.getItem(KEYS.NEWS) || '[]') as News[];
  const idx = all.findIndex(n => n.id === newsItem.id);
  if (idx >= 0) all[idx] = newsItem; else all.push(newsItem);
  localStorage.setItem(KEYS.NEWS, JSON.stringify(all));
};

export const deleteNews = async (id: string): Promise<void> => {
  if (isSupabaseReady && supabase) {
    const { error } = await supabase.from('news').delete().eq('id', id);
    if (error) throw new Error(`Supabase deleteNews: ${error.message}`);
    return;
  }
  const all = JSON.parse(localStorage.getItem(KEYS.NEWS) || '[]') as News[];
  localStorage.setItem(KEYS.NEWS, JSON.stringify(all.filter(n => n.id !== id)));
};

// ─── APPLICATIONS ────────────────────────────────────────────

export const getApplications = async (): Promise<Application[]> => {
  if (isSupabaseReady && supabase) {
    const { data, error } = await supabase
      .from('applications')
      .select('*')
      .order('created_at', { ascending: false });
    if (!error && data) return data.map(dbToApplication);
  }
  const raw = localStorage.getItem(KEYS.APPLICATIONS);
  const apps: Application[] = raw ? JSON.parse(raw) : [];
  return apps.sort((a, b) => {
    if (a.status === 'pending' && b.status !== 'pending') return -1;
    if (a.status !== 'pending' && b.status === 'pending') return 1;
    return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
  });
};

export const getApplicationById = async (id: string): Promise<Application | undefined> => {
  if (isSupabaseReady && supabase) {
    const { data } = await supabase.from('applications').select('*').eq('id', id).single();
    return data ? dbToApplication(data) : undefined;
  }
  const all = JSON.parse(localStorage.getItem(KEYS.APPLICATIONS) || '[]') as Application[];
  return all.find(a => a.id === id);
};

export const saveApplication = async (application: Application): Promise<void> => {
  if (isSupabaseReady && supabase) {
    const row = applicationToDb(application);
    const existing = await supabase.from('applications').select('id').eq('id', application.id).single();
    if (existing.data) {
      await supabase.from('applications').update({ ...row, updated_at: new Date().toISOString() }).eq('id', application.id);
    } else {
      await supabase.from('applications').insert(row);
      incrementNotifications();
    }
    return;
  }
  const all = JSON.parse(localStorage.getItem(KEYS.APPLICATIONS) || '[]') as Application[];
  const idx = all.findIndex(a => a.id === application.id);
  if (idx >= 0) { all[idx] = application; } else { all.push(application); markNewApplication(); }
  localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(all));
};

export const deleteApplication = async (id: string): Promise<void> => {
  if (isSupabaseReady && supabase) {
    await supabase.from('applications').delete().eq('id', id);
    return;
  }
  const all = JSON.parse(localStorage.getItem(KEYS.APPLICATIONS) || '[]') as Application[];
  localStorage.setItem(KEYS.APPLICATIONS, JSON.stringify(all.filter(a => a.id !== id)));
};

// ─── SETTINGS ────────────────────────────────────────────────

export const getSettings = async (): Promise<SiteSettings> => {
  if (isSupabaseReady && supabase) {
    const { data } = await supabase.from('settings').select('*');
    if (data && data.length > 0) {
      const map: Record<string, string> = {};
      data.forEach((r: any) => { map[r.key] = r.value; });
      return {
        logo: map.logo ?? 'MIRACLE',
        logoType: (map.logoType as any) ?? 'text',
        organizationName: map.organizationName ?? 'Miracle',
      };
    }
  }
  const raw = localStorage.getItem(KEYS.SETTINGS);
  return raw ? JSON.parse(raw) : DEFAULT_SETTINGS;
};

export const saveSettings = async (settings: SiteSettings): Promise<void> => {
  if (isSupabaseReady && supabase) {
    const rows = Object.entries(settings).map(([key, value]) => ({ key, value: String(value) }));
    await supabase.from('settings').upsert(rows);
    return;
  }
  localStorage.setItem(KEYS.SETTINGS, JSON.stringify(settings));
};

// ─── NOTIFICATIONS ───────────────────────────────────────────

export const markNewApplication   = () => { const c = getNewApplicationsCount(); localStorage.setItem('newApplicationsCount', String(c + 1)); };
export const getNewApplicationsCount = (): number => parseInt(localStorage.getItem('newApplicationsCount') || '0', 10);
export const resetNewApplicationsCount = () => localStorage.setItem('newApplicationsCount', '0');
const incrementNotifications = () => markNewApplication();

// ─── AUTH ────────────────────────────────────────────────────

export const login = (username: string, password: string): boolean => {
  if (username === defaultAdmin.username && password === defaultAdmin.password) {
    localStorage.setItem(KEYS.AUTH, JSON.stringify({ loggedIn: true, timestamp: Date.now() }));
    return true;
  }
  return false;
};

export const logout = (): void => { localStorage.removeItem(KEYS.AUTH); };

export const isAuthenticated = (): boolean => {
  const raw = localStorage.getItem(KEYS.AUTH);
  if (!raw) return false;
  const { loggedIn, timestamp } = JSON.parse(raw);
  if (Date.now() - timestamp > 24 * 60 * 60 * 1000) { logout(); return false; }
  return loggedIn;
};

// ─── UTILS ───────────────────────────────────────────────────

export const generateId = (): string => Date.now().toString(36) + Math.random().toString(36).substr(2);

export const formatDate = (dateString: string): string =>
  new Date(dateString).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' });

// ─── DB MAPPERS ──────────────────────────────────────────────
// Преобразование между форматом Supabase (snake_case) и TypeScript (camelCase)

function dbToTournament(r: any): Tournament {
  return {
    id: r.id, title: r.title, date: r.date, endDate: r.end_date,
    format: r.format, description: r.description, fullDescription: r.full_description,
    banner: r.banner, package: r.package, teams: r.teams ?? [],
    bracket: r.bracket ?? [], groupTable: r.group_table ?? [], playerRatings: r.player_ratings ?? [],
    status: r.status, telegramLink: r.telegram_link,
    prizePool: r.prize_pool, game: r.game, createdAt: r.created_at,
  };
}

function tournamentToDb(t: Tournament): any {
  return {
    id: t.id, title: t.title, date: t.date, end_date: t.endDate,
    format: t.format, description: t.description, full_description: t.fullDescription,
    banner: t.banner, package: t.package, teams: t.teams,
    bracket: t.bracket, group_table: t.groupTable ?? [], player_ratings: t.playerRatings ?? [],
    status: t.status, telegram_link: t.telegramLink,
    prize_pool: t.prizePool, game: t.game, created_at: t.createdAt,
  };
}

function dbToNews(r: any): News {
  return {
    id: r.id, title: r.title, date: r.date, image: r.image,
    shortText: r.short_text, fullText: r.full_text,
    isPinned: r.is_pinned, createdAt: r.created_at,
  };
}

function newsToDb(n: News): any {
  return {
    id: n.id, title: n.title, date: n.date, image: n.image,
    short_text: n.shortText, full_text: n.fullText,
    is_pinned: n.isPinned, created_at: n.createdAt,
  };
}

function dbToApplication(r: any): Application {
  return {
    id: r.id, organizerName: r.organizer_name, tournamentName: r.tournament_name,
    package: r.package, telegram: r.telegram, email: r.email,
    description: r.description, status: r.status, notes: r.notes,
    createdAt: r.created_at,
  };
}

function applicationToDb(a: Application): any {
  return {
    id: a.id, organizer_name: a.organizerName, tournament_name: a.tournamentName,
    package: a.package, telegram: a.telegram, email: a.email,
    description: a.description, status: a.status, notes: a.notes,
    created_at: a.createdAt,
  };
}
