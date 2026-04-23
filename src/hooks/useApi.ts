import { useState, useEffect, useCallback } from 'react';
import {
  getTournaments,
  getActiveTournaments,
  getCompletedTournaments,
  getTournamentById,
  saveTournament,
  deleteTournament,
  getNews,
  getNewsById,
  saveNews,
  deleteNews,
  getApplications,
  saveApplication,
  deleteApplication,
  getSettings,
  saveSettings,
  getNewApplicationsCount,
} from '../utils/storage';
import { Tournament, News, Application, SiteSettings } from '../types';

export function useTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetch = useCallback(async () => {
    setLoading(true); setError(null);
    try { setTournaments(await getTournaments()); } catch { setError('Ошибка загрузки турниров'); }
    setLoading(false);
  }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { tournaments, loading, error, refetch: fetch };
}

export function useActiveTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetch = useCallback(async () => {
    setLoading(true); setError(null);
    try { setTournaments(await getActiveTournaments()); } catch { setError('Ошибка загрузки'); }
    setLoading(false);
  }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { tournaments, loading, error, refetch: fetch };
}

export function useCompletedTournaments() {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetch = useCallback(async () => {
    setLoading(true); setError(null);
    try { setTournaments(await getCompletedTournaments()); } catch { setError('Ошибка загрузки'); }
    setLoading(false);
  }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { tournaments, loading, error, refetch: fetch };
}

export function useTournament(id: string | undefined) {
  const [tournament, setTournament] = useState<Tournament | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!id) { setLoading(false); return; }
    (async () => {
      setLoading(true); setError(null);
      try {
        const t = await getTournamentById(id);
        setTournament(t ?? null);
        if (!t) setError('Турнир не найден');
      } catch { setError('Ошибка загрузки'); }
      setLoading(false);
    })();
  }, [id]);
  return { tournament, loading, error };
}

export function useTournamentMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createTournament = async (data: Omit<Tournament, 'id' | 'createdAt'>) => {
    setLoading(true); setError(null);
    try {
      const t: Tournament = { ...data, id: `${Date.now()}-${Math.random().toString(36).substr(2,9)}`, createdAt: new Date().toISOString() };
      await saveTournament(t); setLoading(false); return t;
    } catch { setError('Ошибка создания'); setLoading(false); return null; }
  };

  const updateTournament = async (id: string, data: Partial<Tournament>) => {
    setLoading(true); setError(null);
    try {
      const existing = await getTournamentById(id);
      if (!existing) { setError('Не найден'); setLoading(false); return null; }
      const updated = { ...existing, ...data };
      await saveTournament(updated); setLoading(false); return updated;
    } catch { setError('Ошибка обновления'); setLoading(false); return null; }
  };

  const removeTournament = async (id: string) => {
    setLoading(true); setError(null);
    try { await deleteTournament(id); setLoading(false); return true; }
    catch { setError('Ошибка удаления'); setLoading(false); return false; }
  };

  return { createTournament, updateTournament, deleteTournament: removeTournament, loading, error };
}

export function useNews() {
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchNews = useCallback(async () => {
    setLoading(true); setError(null);
    try { setNews(await getNews()); } catch { setError('Ошибка загрузки новостей'); }
    setLoading(false);
  }, []);
  useEffect(() => { fetchNews(); }, [fetchNews]);
  return { news, loading, error, refetch: fetchNews };
}

export function useNewsArticle(id: string | undefined) {
  const [article, setArticle] = useState<News | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    if (!id) { setLoading(false); return; }
    (async () => {
      setLoading(true); setError(null);
      try {
        const n = await getNewsById(id);
        setArticle(n ?? null);
        if (!n) setError('Новость не найдена');
      } catch { setError('Ошибка загрузки'); }
      setLoading(false);
    })();
  }, [id]);
  return { article, loading, error };
}

export function useNewsMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createNews = async (data: Omit<News, 'id' | 'createdAt'>) => {
    setLoading(true); setError(null);
    try {
      const n: News = { ...data, id: `${Date.now()}-${Math.random().toString(36).substr(2,9)}`, createdAt: new Date().toISOString() };
      await saveNews(n); setLoading(false); return n;
    } catch { setError('Ошибка создания'); setLoading(false); return null; }
  };

  const updateNews = async (id: string, data: Partial<News>) => {
    setLoading(true); setError(null);
    try {
      const existing = await getNewsById(id);
      if (!existing) { setError('Не найдена'); setLoading(false); return null; }
      const updated = { ...existing, ...data };
      await saveNews(updated); setLoading(false); return updated;
    } catch { setError('Ошибка обновления'); setLoading(false); return null; }
  };

  const removeNews = async (id: string) => {
    setLoading(true); setError(null);
    try { await deleteNews(id); setLoading(false); return true; }
    catch { setError('Ошибка удаления'); setLoading(false); return false; }
  };

  return { createNews, updateNews, deleteNews: removeNews, loading, error };
}

export function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetch = useCallback(async () => {
    setLoading(true); setError(null);
    try { setApplications(await getApplications()); } catch { setError('Ошибка загрузки заявок'); }
    setLoading(false);
  }, []);
  useEffect(() => { fetch(); }, [fetch]);
  return { applications, loading, error, refetch: fetch };
}

export function useApplicationMutations() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const createApplication = async (data: Omit<Application, 'id' | 'status' | 'createdAt'>) => {
    setLoading(true); setError(null);
    try {
      const a: Application = { ...data, id: `${Date.now()}-${Math.random().toString(36).substr(2,9)}`, status: 'pending', createdAt: new Date().toISOString() };
      await saveApplication(a); setLoading(false); return a;
    } catch { setError('Ошибка отправки'); setLoading(false); return null; }
  };

  const updateApplication = async (id: string, data: Partial<Application>) => {
    setLoading(true); setError(null);
    try {
      const all = await getApplications();
      const existing = all.find(a => a.id === id);
      if (!existing) { setError('Не найдена'); setLoading(false); return null; }
      const updated = { ...existing, ...data };
      await saveApplication(updated); setLoading(false); return updated;
    } catch { setError('Ошибка обновления'); setLoading(false); return null; }
  };

  const removeApplication = async (id: string) => {
    setLoading(true); setError(null);
    try { await deleteApplication(id); setLoading(false); return true; }
    catch { setError('Ошибка удаления'); setLoading(false); return false; }
  };

  return { createApplication, updateApplication, deleteApplication: removeApplication, loading, error };
}

export function useSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const fetchSettings = useCallback(async () => {
    setLoading(true); setError(null);
    try { setSettings(await getSettings()); } catch { setError('Ошибка загрузки настроек'); }
    setLoading(false);
  }, []);
  useEffect(() => { fetchSettings(); }, [fetchSettings]);
  const updateSettings = async (data: SiteSettings) => {
    setLoading(true); setError(null);
    try { await saveSettings(data); setSettings(data); setLoading(false); return true; }
    catch { setError('Ошибка сохранения'); setLoading(false); return false; }
  };
  return { settings, loading, error, updateSettings, refetch: fetchSettings };
}

export function useNotifications() {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const fetchCount = useCallback(async () => {
    setCount(getNewApplicationsCount());
    setLoading(false);
  }, []);
  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 30000);
    return () => clearInterval(interval);
  }, [fetchCount]);
  const resetCount = async () => setCount(0);
  return { count, loading, resetCount, refetch: fetchCount };
}
