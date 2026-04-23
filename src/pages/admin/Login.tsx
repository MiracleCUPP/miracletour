import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import Background from '../../components/Background';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const result = await login(email, password);
      
      if (result.success) {
        navigate('/admin');
      } else {
        setError(result.error || 'Неверный логин или пароль');
      }
    } catch {
      setError('Ошибка подключения к серверу');
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4 overflow-hidden relative">
      <Background variant="default" />
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/10 text-white mb-4 backdrop-blur-xl border border-white/10">
            <Shield size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">
            Админ-панель Miracle
          </h1>
          <p className="text-white/50">
            Войдите для доступа к управлению
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400"
            >
              <AlertCircle size={18} className="mr-2 flex-shrink-0" />
              {error}
            </motion.div>
          )}

          <div>
            <label className="block text-white font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
              required
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-white font-medium mb-2">
              Пароль
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 transition-colors"
                required
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-white/40 hover:text-white/60 transition-colors"
                disabled={isLoading}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 px-4 bg-white text-black font-medium rounded-xl hover:bg-white/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <Loader2 size={18} className="animate-spin mr-2" />
                Вход...
              </>
            ) : (
              'Войти'
            )}
          </button>
        </form>

        <p className="text-center text-white/30 text-sm mt-6">
          Доступ только для администраторов
        </p>
      </motion.div>
    </div>
  );
};

export default Login;
