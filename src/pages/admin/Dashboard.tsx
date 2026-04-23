import React, { useEffect, useState } from 'react';
import { Link, useNavigate, Outlet, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Trophy, Newspaper, FileText, 
  LogOut, Menu, X, ChevronRight, Users, TrendingUp, Settings
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { getTournaments, getNews, getApplications, getNewApplicationsCount } from '../../utils/storage';
import { motion, AnimatePresence } from 'framer-motion';

const Dashboard: React.FC = () => {
  const { isAdmin, logout, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState({
    tournaments: 0,
    activeTournaments: 0,
    news: 0,
    pendingApplications: 0
  });
  const [newApplications, setNewApplications] = useState(0);

  useEffect(() => {
    if (!isLoading && !isAdmin) {
      navigate('/admin/login');
    }
  }, [isAdmin, isLoading, navigate]);

  useEffect(() => {
    (async () => {
    const tournaments = await getTournaments();
    const news = await getNews();
    const applications = await getApplications();

    setStats({
      tournaments: tournaments.length,
      activeTournaments: tournaments.filter(t => t.status === 'active').length,
      news: news.length,
      pendingApplications: applications.filter(a => a.status === 'pending').length
    });

    // Обновляем счетчик новых заявок
    setNewApplications(getNewApplicationsCount());
    })();
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navItems = [
    { path: '/admin', label: 'Обзор', icon: <LayoutDashboard size={20} />, exact: true },
    { path: '/admin/tournaments', label: 'Турниры', icon: <Trophy size={20} /> },
    { path: '/admin/news', label: 'Новости', icon: <Newspaper size={20} /> },
    { path: '/admin/applications', label: 'Заявки', icon: <FileText size={20} />, badge: stats.pendingApplications, newBadge: newApplications },
    { path: '/admin/settings', label: 'Настройки', icon: <Settings size={20} /> }
  ];

  const isActive = (path: string, exact?: boolean) => {
    if (exact) return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const DashboardOverview = () => (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl lg:text-3xl font-bold text-white mb-2">
          Панель управления
        </h1>
        <p className="text-white/50">
          Добро пожаловать в админ-панель Miracle
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Всего турниров', value: stats.tournaments, icon: <Trophy size={24} />, color: 'from-blue-500/20 to-blue-600/20' },
          { label: 'Активных', value: stats.activeTournaments, icon: <TrendingUp size={24} />, color: 'from-green-500/20 to-green-600/20' },
          { label: 'Новостей', value: stats.news, icon: <Newspaper size={24} />, color: 'from-purple-500/20 to-purple-600/20' },
          { label: 'Заявок на рассмотрении', value: stats.pendingApplications, icon: <Users size={24} />, color: 'from-orange-500/20 to-orange-600/20' }
        ].map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-2xl bg-gradient-to-br ${stat.color} border border-white/5`}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="p-2 rounded-lg bg-white/10 text-white">
                {stat.icon}
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
            <div className="text-white/50 text-sm">{stat.label}</div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link
          to="/admin/tournaments/new"
          className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-semibold mb-1">Создать турнир</div>
              <div className="text-white/50 text-sm">Добавить новый турнир</div>
            </div>
            <ChevronRight size={20} className="text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        <Link
          to="/admin/news/new"
          className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-semibold mb-1">Добавить новость</div>
              <div className="text-white/50 text-sm">Опубликовать новость</div>
            </div>
            <ChevronRight size={20} className="text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>

        <Link
          to="/admin/applications"
          className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-white font-semibold mb-1">Заявки</div>
              <div className="text-white/50 text-sm">{stats.pendingApplications} на рассмотрении</div>
            </div>
            <ChevronRight size={20} className="text-white/30 group-hover:text-white/60 group-hover:translate-x-1 transition-all" />
          </div>
        </Link>
      </div>
    </div>
  );

  if (isLoading) return null;
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-black">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-black/95 backdrop-blur-md border-b border-white/10 z-50 px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-black font-black text-lg">M</span>
          </div>
          <span className="text-white font-bold">Admin</span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-white"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <AnimatePresence>
        {(isSidebarOpen || window.innerWidth >= 1024) && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
            />

            {/* Sidebar Content */}
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'tween' }}
              className="fixed top-0 left-0 bottom-0 w-64 bg-gray-950 border-r border-white/10 z-50 lg:z-30 pt-16 lg:pt-0"
            >
              {/* Logo */}
              <div className="hidden lg:flex items-center space-x-3 p-6 border-b border-white/10">
                <Link to="/" className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center">
                    <span className="text-black font-black text-xl">M</span>
                  </div>
                  <div>
                    <span className="text-white font-bold">MIRACLE</span>
                    <div className="text-white/50 text-xs">Admin Panel</div>
                  </div>
                </Link>
              </div>

              {/* Navigation */}
              <nav className="p-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    onClick={() => setIsSidebarOpen(false)}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      isActive(item.path, item.exact)
                        ? 'bg-white text-black'
                        : 'text-white/70 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      {item.icon}
                      <span className="font-medium">{item.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && item.badge > 0 && (
                        <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${
                          isActive(item.path, item.exact)
                            ? 'bg-black text-white'
                            : 'bg-orange-500 text-white'
                        }`}>
                          {item.badge}
                        </span>
                      )}
                      {item.newBadge && item.newBadge > 0 && (
                        <span className="relative flex h-3 w-3">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                        </span>
                      )}
                    </div>
                  </Link>
                ))}
              </nav>

              {/* Logout */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-colors"
                >
                  <LogOut size={20} />
                  <span className="font-medium">Выйти</span>
                </button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-8">
          {location.pathname === '/admin' ? <DashboardOverview /> : <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
