import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase, isSupabaseReady } from '../lib/supabase';
import type { User } from '@supabase/supabase-js';

interface AuthContextType {
  isAdmin: boolean;
  username: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser]           = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!isSupabaseReady || !supabase) {
      setIsLoading(false);
      return;
    }

    // Получаем текущую сессию при загрузке
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setIsLoading(false);
    });

    // Слушаем изменения — вход / выход / истечение токена
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!supabase) return { success: false, error: 'Supabase не настроен' };
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: 'Неверный email или пароль' };
    return { success: true };
  };

  const logout = async () => {
    await supabase?.auth.signOut();
  };

  return (
    <AuthContext.Provider value={{
      isAdmin: !!user,
      username: user?.email ?? null,
      isLoading,
      login,
      logout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
}
