// API Service - готов к подключению реального бекенда
// Замените BASE_URL на адрес вашего сервера

const BASE_URL = ''; // Для реального бекенда: 'https://your-api.com/api'
const USE_LOCAL_STORAGE = true; // Переключить на false когда будет реальный бекенд

// Типы ответов API
interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Утилита для запросов
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  if (USE_LOCAL_STORAGE) {
    // Локальная имитация API
    return localApiHandler<T>(endpoint, options);
  }

  try {
    const token = localStorage.getItem('miracle_auth_token');
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    };

    const response = await fetch(`${BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return { success: false, error: data.error || 'Ошибка сервера' };
    }

    return { success: true, data };
  } catch (error) {
    return { success: false, error: 'Ошибка подключения к серверу' };
  }
}

// Локальный обработчик API (имитация бекенда)
async function localApiHandler<T>(
  endpoint: string,
  options: RequestInit
): Promise<ApiResponse<T>> {
  // Имитация задержки сети
  await new Promise(resolve => setTimeout(resolve, 100));

  const method = options.method || 'GET';
  const body = options.body ? JSON.parse(options.body as string) : null;

  // Роутинг
  if (endpoint.startsWith('/auth')) {
    return handleAuth<T>(endpoint, method, body);
  }
  if (endpoint.startsWith('/tournaments')) {
    return handleTournaments<T>(endpoint, method, body);
  }
  if (endpoint.startsWith('/news')) {
    return handleNews<T>(endpoint, method, body);
  }
  if (endpoint.startsWith('/applications')) {
    return handleApplications<T>(endpoint, method, body);
  }
  if (endpoint.startsWith('/settings')) {
    return handleSettings<T>(endpoint, method, body);
  }
  if (endpoint.startsWith('/notifications')) {
    return handleNotifications<T>(endpoint, method, body);
  }

  return { success: false, error: 'Endpoint не найден' };
}

// === AUTH HANDLERS ===
function handleAuth<T>(endpoint: string, method: string, body: any): ApiResponse<T> {
  const ADMIN_USERNAME = 'Garfield';
  const ADMIN_PASSWORD = 'REPLACED_BY_SUPABASE_AUTH';

  if (endpoint === '/auth/login' && method === 'POST') {
    const { username, password } = body;
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      const token = generateToken();
      const session = {
        token,
        username,
        loginTime: Date.now(),
        expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 часа
      };
      
      localStorage.setItem('miracle_auth_token', token);
      localStorage.setItem('miracle_session', JSON.stringify(session));
      
      return {
        success: true,
        data: { token, username, message: 'Успешный вход' } as T,
      };
    }
    
    return { success: false, error: 'Неверный логин или пароль' };
  }

  if (endpoint === '/auth/logout' && method === 'POST') {
    localStorage.removeItem('miracle_auth_token');
    localStorage.removeItem('miracle_session');
    return { success: true, data: { message: 'Выход выполнен' } as T };
  }

  if (endpoint === '/auth/verify' && method === 'GET') {
    const session = localStorage.getItem('miracle_session');
    if (session) {
      const parsed = JSON.parse(session);
      if (parsed.expiresAt > Date.now()) {
        return { success: true, data: { valid: true, username: parsed.username } as T };
      }
    }
    return { success: false, error: 'Сессия истекла' };
  }

  return { success: false, error: 'Неизвестный auth endpoint' };
}

// === TOURNAMENTS HANDLERS ===
function handleTournaments<T>(endpoint: string, method: string, body: any): ApiResponse<T> {
  const key = 'miracle_tournaments';
  let tournaments = JSON.parse(localStorage.getItem(key) || '[]');

  // GET /tournaments
  if (endpoint === '/tournaments' && method === 'GET') {
    return { success: true, data: tournaments as T };
  }

  // GET /tournaments/active
  if (endpoint === '/tournaments/active' && method === 'GET') {
    const active = tournaments.filter((t: any) => t.status === 'active' || t.status === 'upcoming');
    return { success: true, data: active as T };
  }

  // GET /tournaments/completed
  if (endpoint === '/tournaments/completed' && method === 'GET') {
    const completed = tournaments.filter((t: any) => t.status === 'completed');
    return { success: true, data: completed as T };
  }

  // GET /tournaments/:id
  const getMatch = endpoint.match(/^\/tournaments\/([^/]+)$/);
  if (getMatch && method === 'GET') {
    const tournament = tournaments.find((t: any) => t.id === getMatch[1]);
    if (tournament) {
      return { success: true, data: tournament as T };
    }
    return { success: false, error: 'Турнир не найден' };
  }

  // POST /tournaments (создание)
  if (endpoint === '/tournaments' && method === 'POST') {
    if (!isAuthenticated()) {
      return { success: false, error: 'Требуется авторизация' };
    }
    
    const newTournament = {
      ...body,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    tournaments.push(newTournament);
    localStorage.setItem(key, JSON.stringify(tournaments));
    
    return { success: true, data: newTournament as T, message: 'Турнир создан' };
  }

  // PUT /tournaments/:id (обновление)
  const putMatch = endpoint.match(/^\/tournaments\/([^/]+)$/);
  if (putMatch && method === 'PUT') {
    if (!isAuthenticated()) {
      return { success: false, error: 'Требуется авторизация' };
    }
    
    const index = tournaments.findIndex((t: any) => t.id === putMatch[1]);
    if (index === -1) {
      return { success: false, error: 'Турнир не найден' };
    }
    
    tournaments[index] = {
      ...tournaments[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(key, JSON.stringify(tournaments));
    return { success: true, data: tournaments[index] as T, message: 'Турнир обновлён' };
  }

  // DELETE /tournaments/:id
  const deleteMatch = endpoint.match(/^\/tournaments\/([^/]+)$/);
  if (deleteMatch && method === 'DELETE') {
    if (!isAuthenticated()) {
      return { success: false, error: 'Требуется авторизация' };
    }
    
    tournaments = tournaments.filter((t: any) => t.id !== deleteMatch[1]);
    localStorage.setItem(key, JSON.stringify(tournaments));
    
    return { success: true, data: { deleted: true } as T, message: 'Турнир удалён' };
  }

  return { success: false, error: 'Неизвестный tournaments endpoint' };
}

// === NEWS HANDLERS ===
function handleNews<T>(endpoint: string, method: string, body: any): ApiResponse<T> {
  const key = 'miracle_news';
  let news = JSON.parse(localStorage.getItem(key) || '[]');

  // GET /news
  if (endpoint === '/news' && method === 'GET') {
    // Сортировка: закреплённые сначала, потом по дате
    const sorted = [...news].sort((a: any, b: any) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return { success: true, data: sorted as T };
  }

  // GET /news/:id
  const getMatch = endpoint.match(/^\/news\/([^/]+)$/);
  if (getMatch && method === 'GET') {
    const article = news.find((n: any) => n.id === getMatch[1]);
    if (article) {
      return { success: true, data: article as T };
    }
    return { success: false, error: 'Новость не найдена' };
  }

  // POST /news
  if (endpoint === '/news' && method === 'POST') {
    if (!isAuthenticated()) {
      return { success: false, error: 'Требуется авторизация' };
    }
    
    const newArticle = {
      ...body,
      id: generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    news.push(newArticle);
    localStorage.setItem(key, JSON.stringify(news));
    
    return { success: true, data: newArticle as T, message: 'Новость создана' };
  }

  // PUT /news/:id
  const putMatch = endpoint.match(/^\/news\/([^/]+)$/);
  if (putMatch && method === 'PUT') {
    if (!isAuthenticated()) {
      return { success: false, error: 'Требуется авторизация' };
    }
    
    const index = news.findIndex((n: any) => n.id === putMatch[1]);
    if (index === -1) {
      return { success: false, error: 'Новость не найдена' };
    }
    
    news[index] = {
      ...news[index],
      ...body,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(key, JSON.stringify(news));
    return { success: true, data: news[index] as T, message: 'Новость обновлена' };
  }

  // DELETE /news/:id
  const deleteMatch = endpoint.match(/^\/news\/([^/]+)$/);
  if (deleteMatch && method === 'DELETE') {
    if (!isAuthenticated()) {
      return { success: false, error: 'Требуется авторизация' };
    }
    
    news = news.filter((n: any) => n.id !== deleteMatch[1]);
    localStorage.setItem(key, JSON.stringify(news));
    
    return { success: true, data: { deleted: true } as T, message: 'Новость удалена' };
  }

  return { success: false, error: 'Неизвестный news endpoint' };
}

// === APPLICATIONS HANDLERS ===
function handleApplications<T>(endpoint: string, method: string, body: any): ApiResponse<T> {
  const key = 'miracle_applications';
  let applications = JSON.parse(localStorage.getItem(key) || '[]');

  // GET /applications
  if (endpoint === '/applications' && method === 'GET') {
    if (!isAuthenticated()) {
      return { success: false, error: 'Требуется авторизация' };
    }
    
    const sorted = [...applications].sort((a: any, b: any) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
    return { success: true, data: sorted as T };
  }

  // GET /applications/pending
  if (endpoint === '/applications/pending' && method === 'GET') {
    if (!isAuthenticated()) {
      return { success: false, error: 'Требуется авторизация' };
    }
    
    const pending = applications.filter((a: any) => a.status === 'pending');
    return { success: true, data: pending as T };
  }

  // GET /applications/:id
  const getMatch = endpoint.match(/^\/applications\/([^/]+)$/);
  if (getMatch && method === 'GET') {
    if (!isAuthenticated()) {
      return { success: false, error: 'Требуется авторизация' };
    }
    
    const application = applications.find((a: any) => a.id === getMatch[1]);
    if (application) {
      return { success: true, data: application as T };
    }
    return { success: false, error: 'Заявка не найдена' };
  }

  // POST /applications (публичный endpoint)
  if (endpoint === '/applications' && method === 'POST') {
    const newApplication = {
      ...body,
      id: generateId(),
      status: 'pending',
      isNew: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    
    applications.push(newApplication);
    localStorage.setItem(key, JSON.stringify(applications));
    
    // Увеличиваем счётчик уведомлений
    incrementNotifications();
    
    return { success: true, data: newApplication as T, message: 'Заявка отправлена' };
  }

  // PUT /applications/:id
  const putMatch = endpoint.match(/^\/applications\/([^/]+)$/);
  if (putMatch && method === 'PUT') {
    if (!isAuthenticated()) {
      return { success: false, error: 'Требуется авторизация' };
    }
    
    const index = applications.findIndex((a: any) => a.id === putMatch[1]);
    if (index === -1) {
      return { success: false, error: 'Заявка не найдена' };
    }
    
    applications[index] = {
      ...applications[index],
      ...body,
      isNew: false,
      updatedAt: new Date().toISOString(),
    };
    
    localStorage.setItem(key, JSON.stringify(applications));
    return { success: true, data: applications[index] as T, message: 'Заявка обновлена' };
  }

  // DELETE /applications/:id
  const deleteMatch = endpoint.match(/^\/applications\/([^/]+)$/);
  if (deleteMatch && method === 'DELETE') {
    if (!isAuthenticated()) {
      return { success: false, error: 'Требуется авторизация' };
    }
    
    applications = applications.filter((a: any) => a.id !== deleteMatch[1]);
    localStorage.setItem(key, JSON.stringify(applications));
    
    return { success: true, data: { deleted: true } as T, message: 'Заявка удалена' };
  }

  return { success: false, error: 'Неизвестный applications endpoint' };
}

// === SETTINGS HANDLERS ===
function handleSettings<T>(endpoint: string, method: string, body: any): ApiResponse<T> {
  const key = 'miracle_settings';

  // GET /settings
  if (endpoint === '/settings' && method === 'GET') {
    const settings = JSON.parse(localStorage.getItem(key) || JSON.stringify({
      logoType: 'text',
      logoValue: 'MIRACLE',
      organizationName: '',
    }));
    return { success: true, data: settings as T };
  }

  // PUT /settings
  if (endpoint === '/settings' && method === 'PUT') {
    if (!isAuthenticated()) {
      return { success: false, error: 'Требуется авторизация' };
    }
    
    localStorage.setItem(key, JSON.stringify(body));
    
    // Отправляем событие для обновления UI
    window.dispatchEvent(new CustomEvent('settingsUpdated', { detail: body }));
    
    return { success: true, data: body as T, message: 'Настройки сохранены' };
  }

  return { success: false, error: 'Неизвестный settings endpoint' };
}

// === NOTIFICATIONS HANDLERS ===
function handleNotifications<T>(endpoint: string, method: string, _body: any): ApiResponse<T> {
  const key = 'miracle_notifications';

  // GET /notifications/count
  if (endpoint === '/notifications/count' && method === 'GET') {
    const count = parseInt(localStorage.getItem(key) || '0');
    return { success: true, data: { count } as T };
  }

  // POST /notifications/reset
  if (endpoint === '/notifications/reset' && method === 'POST') {
    if (!isAuthenticated()) {
      return { success: false, error: 'Требуется авторизация' };
    }
    
    localStorage.setItem(key, '0');
    return { success: true, data: { count: 0 } as T };
  }

  return { success: false, error: 'Неизвестный notifications endpoint' };
}

// === UTILITY FUNCTIONS ===
function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function generateToken(): string {
  return `token_${Date.now()}_${Math.random().toString(36).substr(2, 16)}`;
}

function isAuthenticated(): boolean {
  const session = localStorage.getItem('miracle_session');
  if (!session) return false;
  
  try {
    const parsed = JSON.parse(session);
    return parsed.expiresAt > Date.now();
  } catch {
    return false;
  }
}

function incrementNotifications(): void {
  const key = 'miracle_notifications';
  const current = parseInt(localStorage.getItem(key) || '0');
  localStorage.setItem(key, String(current + 1));
}

// === EXPORTED API FUNCTIONS ===

// Auth
export const authApi = {
  login: (username: string, password: string) =>
    apiRequest<{ token: string; username: string }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    }),
  
  logout: () =>
    apiRequest<{ message: string }>('/auth/logout', { method: 'POST' }),
  
  verify: () =>
    apiRequest<{ valid: boolean; username: string }>('/auth/verify', { method: 'GET' }),
};

// Tournaments
export const tournamentsApi = {
  getAll: () =>
    apiRequest<any[]>('/tournaments', { method: 'GET' }),
  
  getActive: () =>
    apiRequest<any[]>('/tournaments/active', { method: 'GET' }),
  
  getCompleted: () =>
    apiRequest<any[]>('/tournaments/completed', { method: 'GET' }),
  
  getById: (id: string) =>
    apiRequest<any>(`/tournaments/${id}`, { method: 'GET' }),
  
  create: (data: any) =>
    apiRequest<any>('/tournaments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: any) =>
    apiRequest<any>(`/tournaments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    apiRequest<{ deleted: boolean }>(`/tournaments/${id}`, { method: 'DELETE' }),
};

// News
export const newsApi = {
  getAll: () =>
    apiRequest<any[]>('/news', { method: 'GET' }),
  
  getById: (id: string) =>
    apiRequest<any>(`/news/${id}`, { method: 'GET' }),
  
  create: (data: any) =>
    apiRequest<any>('/news', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: any) =>
    apiRequest<any>(`/news/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    apiRequest<{ deleted: boolean }>(`/news/${id}`, { method: 'DELETE' }),
};

// Applications
export const applicationsApi = {
  getAll: () =>
    apiRequest<any[]>('/applications', { method: 'GET' }),
  
  getPending: () =>
    apiRequest<any[]>('/applications/pending', { method: 'GET' }),
  
  getById: (id: string) =>
    apiRequest<any>(`/applications/${id}`, { method: 'GET' }),
  
  create: (data: any) =>
    apiRequest<any>('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  
  update: (id: string, data: any) =>
    apiRequest<any>(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  
  delete: (id: string) =>
    apiRequest<{ deleted: boolean }>(`/applications/${id}`, { method: 'DELETE' }),
};

// Settings
export const settingsApi = {
  get: () =>
    apiRequest<any>('/settings', { method: 'GET' }),
  
  update: (data: any) =>
    apiRequest<any>('/settings', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
};

// Notifications
export const notificationsApi = {
  getCount: () =>
    apiRequest<{ count: number }>('/notifications/count', { method: 'GET' }),
  
  reset: () =>
    apiRequest<{ count: number }>('/notifications/reset', { method: 'POST' }),
};
