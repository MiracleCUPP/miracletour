import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, Trash2, Check, X, Eye, FileText, 
  Send, Mail, Clock, CheckCircle, XCircle 
} from 'lucide-react';
import { Application, ApplicationStatus, PACKAGES } from '../../types';
import { 
  getApplications, saveApplication, deleteApplication, formatDate, resetNewApplicationsCount 
} from '../../utils/storage';
import { useAuth } from '../../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';

const Applications: React.FC = () => {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!isLoading && !isAdmin) navigate('/admin/login');
  }, [isAdmin, isLoading, navigate]);
  const [filterStatus, setFilterStatus] = useState<ApplicationStatus | 'all'>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadApplications();
    // Сбрасываем счетчик новых заявок при просмотре страницы
    resetNewApplicationsCount();
  }, []);

  const loadApplications = () => {
    getApplications().then(setApplications);
  };

  const handleStatusChange = async (app: Application, newStatus: ApplicationStatus) => {
    await saveApplication({ ...app, status: newStatus });
    getApplications().then(setApplications);
    if (selectedApp?.id === app.id) {
      setSelectedApp({ ...app, status: newStatus });
    }
  };

  const handleDelete = async (id: string) => {
    await deleteApplication(id);
    getApplications().then(setApplications);
    setDeleteId(null);
    if (selectedApp?.id === id) {
      setSelectedApp(null);
    }
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = 
      app.organizerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.tournamentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.telegram.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = filterStatus === 'all' || app.status === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const statusConfig = {
    pending: { label: 'На рассмотрении', color: 'bg-yellow-500/20 text-yellow-300', icon: <Clock size={14} /> },
    processed: { label: 'Обработано', color: 'bg-green-500/20 text-green-300', icon: <CheckCircle size={14} /> },
    rejected: { label: 'Отклонено', color: 'bg-red-500/20 text-red-300', icon: <XCircle size={14} /> }
  };

  if (isLoading || !isAdmin) return null;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white mb-1">Заявки</h1>
        <p className="text-white/50">Заявки на размещение турниров от организаторов</p>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-grow">
          <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
          <input
            type="text"
            placeholder="Поиск заявок..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
          />
        </div>
        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value as ApplicationStatus | 'all')}
          className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30 cursor-pointer"
        >
          <option value="all" className="bg-gray-900">Все заявки</option>
          <option value="pending" className="bg-gray-900">На рассмотрении</option>
          <option value="processed" className="bg-gray-900">Обработано</option>
          <option value="rejected" className="bg-gray-900">Отклонено</option>
        </select>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        {(['pending', 'processed', 'rejected'] as ApplicationStatus[]).map((status) => {
          const count = applications.filter(a => a.status === status).length;
          const config = statusConfig[status];
          return (
            <div
              key={status}
              className="p-4 rounded-xl bg-white/5 border border-white/10"
            >
              <div className="flex items-center space-x-2 mb-2">
                <span className={`p-1.5 rounded-lg ${config.color}`}>
                  {config.icon}
                </span>
                <span className="text-white/50 text-sm">{config.label}</span>
              </div>
              <div className="text-2xl font-bold text-white">{count}</div>
            </div>
          );
        })}
      </div>

      {/* Applications List */}
      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6 text-white/50 text-sm font-medium">Организатор</th>
                <th className="text-left py-4 px-4 text-white/50 text-sm font-medium">Турнир</th>
                <th className="text-left py-4 px-4 text-white/50 text-sm font-medium">Пакет</th>
                <th className="text-left py-4 px-4 text-white/50 text-sm font-medium">Статус</th>
                <th className="text-left py-4 px-4 text-white/50 text-sm font-medium">Дата</th>
                <th className="text-right py-4 px-6 text-white/50 text-sm font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.map((app) => (
                <tr key={app.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4 px-6">
                    <div className="text-white font-medium">{app.organizerName}</div>
                    <div className="text-white/50 text-sm">{app.telegram}</div>
                  </td>
                  <td className="py-4 px-4">
                    <div className="text-white">{app.tournamentName}</div>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`px-2 py-1 rounded-lg text-xs font-medium uppercase ${
                      app.package === 'diamond' 
                        ? 'bg-purple-500/20 text-purple-300'
                        : app.package === 'premium'
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {PACKAGES[app.package].name} - {PACKAGES[app.package].price}₽
                    </span>
                  </td>
                  <td className="py-4 px-4">
                    <span className={`inline-flex items-center space-x-1 px-2 py-1 rounded-lg text-xs font-medium ${statusConfig[app.status].color}`}>
                      {statusConfig[app.status].icon}
                      <span>{statusConfig[app.status].label}</span>
                    </span>
                  </td>
                  <td className="py-4 px-4 text-white/70 text-sm">
                    {formatDate(app.createdAt)}
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={() => setSelectedApp(app)}
                        className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Просмотр"
                      >
                        <Eye size={18} />
                      </button>
                      {app.status === 'pending' && (
                        <>
                          <button
                            onClick={() => handleStatusChange(app, 'processed')}
                            className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/10 rounded-lg transition-colors"
                            title="Обработано"
                          >
                            <Check size={18} />
                          </button>
                          <button
                            onClick={() => handleStatusChange(app, 'rejected')}
                            className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                            title="Отклонить"
                          >
                            <X size={18} />
                          </button>
                        </>
                      )}
                      <button
                        onClick={() => setDeleteId(app.id)}
                        className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Удалить"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredApps.length === 0 && (
            <div className="text-center py-12">
              <FileText size={40} className="mx-auto text-white/20 mb-3" />
              <p className="text-white/50">Заявки не найдены</p>
            </div>
          )}
        </div>
      </div>

      {/* Application Detail Modal */}
      <AnimatePresence>
        {selectedApp && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setSelectedApp(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-2xl p-6 max-w-lg w-full border border-white/10 max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-start justify-between mb-6">
                <h3 className="text-xl font-bold text-white">Детали заявки</h3>
                <button
                  onClick={() => setSelectedApp(null)}
                  className="p-1 text-white/50 hover:text-white"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-white/50 text-sm">Организатор</label>
                  <div className="text-white font-medium">{selectedApp.organizerName}</div>
                </div>

                <div>
                  <label className="text-white/50 text-sm">Турнир</label>
                  <div className="text-white font-medium">{selectedApp.tournamentName}</div>
                </div>

                <div>
                  <label className="text-white/50 text-sm">Пакет</label>
                  <div className="mt-1">
                    <span className={`px-3 py-1.5 rounded-lg text-sm font-medium ${
                      selectedApp.package === 'diamond' 
                        ? 'bg-purple-500/20 text-purple-300'
                        : selectedApp.package === 'premium'
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-500/20 text-gray-300'
                    }`}>
                      {PACKAGES[selectedApp.package].name} - {PACKAGES[selectedApp.package].price}₽
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-white/50 text-sm">Контакты</label>
                  <div className="flex flex-col space-y-2 mt-1">
                    <a 
                      href={`https://t.me/${selectedApp.telegram.replace('@', '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-blue-400 hover:text-blue-300"
                    >
                      <Send size={14} className="mr-2" />
                      {selectedApp.telegram}
                    </a>
                    {selectedApp.email && (
                      <a 
                        href={`mailto:${selectedApp.email}`}
                        className="flex items-center text-white/70 hover:text-white"
                      >
                        <Mail size={14} className="mr-2" />
                        {selectedApp.email}
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <label className="text-white/50 text-sm">Описание</label>
                  <div className="text-white/80 mt-1 p-3 bg-white/5 rounded-lg">
                    {selectedApp.description}
                  </div>
                </div>

                <div>
                  <label className="text-white/50 text-sm">Статус</label>
                  <div className="mt-2 flex space-x-2">
                    {(['pending', 'processed', 'rejected'] as ApplicationStatus[]).map((status) => (
                      <button
                        key={status}
                        onClick={() => handleStatusChange(selectedApp, status)}
                        className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                          selectedApp.status === status 
                            ? statusConfig[status].color
                            : 'bg-white/5 text-white/50 hover:bg-white/10'
                        }`}
                      >
                        {statusConfig[status].icon}
                        <span>{statusConfig[status].label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10">
                  <label className="text-white/50 text-sm">Дата подачи</label>
                  <div className="text-white/70">{formatDate(selectedApp.createdAt)}</div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => setDeleteId(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-gray-900 rounded-2xl p-6 max-w-md w-full border border-white/10"
            >
              <h3 className="text-xl font-bold text-white mb-2">Удалить заявку?</h3>
              <p className="text-white/60 mb-6">
                Это действие нельзя отменить.
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setDeleteId(null)}
                  className="flex-1 py-2 px-4 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-colors"
                >
                  Отмена
                </button>
                <button
                  onClick={() => handleDelete(deleteId)}
                  className="flex-1 py-2 px-4 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-colors"
                >
                  Удалить
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Applications;
