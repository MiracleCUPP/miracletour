import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { 
  Plus, Edit, Trash2, Eye, Search, Pin, 
  ArrowLeft, Save, X, Newspaper 
} from 'lucide-react';
import { News } from '../../types';
import { 
  getNews, saveNews, deleteNews, 
  getNewsById, generateId, formatDate 
} from '../../utils/storage';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../../context/AuthContext';

// News List Component
const NewsList: React.FC = () => {
  const [news, setNewsList] = useState<News[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  useEffect(() => {
    loadNews();
  }, []);

  const loadNews = () => {
    getNews().then(setNewsList);
  };

  const handleDelete = async (id: string) => {
    await deleteNews(id);
    getNews().then(setNewsList);
    setDeleteId(null);
  };

  const handleTogglePin = async (newsItem: News) => {
    await saveNews({ ...newsItem, isPinned: !newsItem.isPinned });
    getNews().then(setNewsList);
  };

  const filteredNews = news.filter(n =>
    n.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white mb-1">Новости</h1>
          <p className="text-white/50">Управление новостями и анонсами</p>
        </div>
        <Link
          to="/admin/news/new"
          className="flex items-center space-x-2 px-4 py-2 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors"
        >
          <Plus size={18} />
          <span>Добавить новость</span>
        </Link>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={18} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/40" />
        <input
          type="text"
          placeholder="Поиск новостей..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
        />
      </div>

      {/* News Table */}
      <div className="bg-white/5 rounded-2xl border border-white/10 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-4 px-6 text-white/50 text-sm font-medium">Новость</th>
                <th className="text-left py-4 px-4 text-white/50 text-sm font-medium">Дата</th>
                <th className="text-left py-4 px-4 text-white/50 text-sm font-medium">Статус</th>
                <th className="text-right py-4 px-6 text-white/50 text-sm font-medium">Действия</th>
              </tr>
            </thead>
            <tbody>
              {filteredNews.map((newsItem) => (
                <tr key={newsItem.id} className="border-b border-white/5 hover:bg-white/5">
                  <td className="py-4 px-6">
                    <div className="flex items-center space-x-3">
                      <img
                        src={newsItem.image}
                        alt=""
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="max-w-md">
                        <div className="text-white font-medium truncate">{newsItem.title}</div>
                        <div className="text-white/50 text-sm truncate">{newsItem.shortText}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-4 text-white/70 text-sm">
                    {formatDate(newsItem.date)}
                  </td>
                  <td className="py-4 px-4">
                    <button
                      onClick={() => handleTogglePin(newsItem)}
                      className={`flex items-center space-x-1 px-3 py-1 rounded-lg text-xs font-medium transition-colors ${
                        newsItem.isPinned 
                          ? 'bg-white text-black' 
                          : 'bg-white/10 text-white/50 hover:text-white'
                      }`}
                    >
                      <Pin size={12} />
                      <span>{newsItem.isPinned ? 'Закреплено' : 'Закрепить'}</span>
                    </button>
                  </td>
                  <td className="py-4 px-6">
                    <div className="flex items-center justify-end space-x-2">
                      <Link
                        to={`/news/${newsItem.id}`}
                        target="_blank"
                        className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Просмотр"
                      >
                        <Eye size={18} />
                      </Link>
                      <Link
                        to={`/admin/news/${newsItem.id}`}
                        className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
                        title="Редактировать"
                      >
                        <Edit size={18} />
                      </Link>
                      <button
                        onClick={() => setDeleteId(newsItem.id)}
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

          {filteredNews.length === 0 && (
            <div className="text-center py-12">
              <Newspaper size={40} className="mx-auto text-white/20 mb-3" />
              <p className="text-white/50">Новости не найдены</p>
            </div>
          )}
        </div>
      </div>

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
              <h3 className="text-xl font-bold text-white mb-2">Удалить новость?</h3>
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

// News Form Component
const NewsForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditing = id && id !== 'new';

  const [formData, setFormData] = useState<Partial<News>>({
    title: '',
    date: new Date().toISOString().split('T')[0],
    image: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?w=800',
    shortText: '',
    fullText: '',
    isPinned: false
  });

  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    (async () => {
    if (isEditing) {
      const newsItem = await getNewsById(id);
      if (newsItem) {
        setFormData(newsItem);
      }
    }
    })();
  }, [id, isEditing]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value 
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    
    const newsData: News = {
      id: isEditing ? id : generateId(),
      title: formData.title || '',
      date: formData.date || new Date().toISOString().split('T')[0],
      image: formData.image || '',
      shortText: formData.shortText || '',
      fullText: formData.fullText || '',
      isPinned: formData.isPinned || false,
      createdAt: isEditing ? formData.createdAt || new Date().toISOString() : new Date().toISOString()
    };

    try {
      await saveNews(newsData);
      navigate('/admin/news');
    } catch (err) {
      console.error('Ошибка сохранения новости:', err);
      alert('Ошибка сохранения. Проверь консоль.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="mb-8">
        <Link
          to="/admin/news"
          className="inline-flex items-center text-white/50 hover:text-white mb-4 transition-colors"
        >
          <ArrowLeft size={18} className="mr-2" />
          Назад к списку
        </Link>
        <h1 className="text-2xl font-bold text-white">
          {isEditing ? 'Редактировать новость' : 'Добавить новость'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Основная информация</h2>
          
          <div>
            <label className="block text-white/70 text-sm mb-2">Заголовок *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">Дата публикации *</label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white focus:outline-none focus:border-white/30"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">URL изображения</label>
            <input
              type="url"
              name="image"
              value={formData.image}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30"
            />
            {formData.image && (
              <img src={formData.image} alt="Preview" className="mt-3 h-32 rounded-lg object-cover" />
            )}
          </div>

          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              name="isPinned"
              checked={formData.isPinned}
              onChange={handleChange}
              id="isPinned"
              className="w-5 h-5 rounded bg-black/30 border border-white/20 text-white focus:ring-0 focus:ring-offset-0"
            />
            <label htmlFor="isPinned" className="text-white cursor-pointer">
              Закрепить новость
            </label>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/5 rounded-2xl p-6 border border-white/10 space-y-4">
          <h2 className="text-lg font-semibold text-white mb-4">Содержание</h2>
          
          <div>
            <label className="block text-white/70 text-sm mb-2">Краткий текст *</label>
            <textarea
              name="shortText"
              value={formData.shortText}
              onChange={handleChange}
              required
              rows={2}
              placeholder="Краткое описание для карточки..."
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 resize-none"
            />
          </div>

          <div>
            <label className="block text-white/70 text-sm mb-2">Полный текст *</label>
            <textarea
              name="fullText"
              value={formData.fullText}
              onChange={handleChange}
              required
              rows={12}
              placeholder="Полный текст новости. Поддерживается Markdown (# заголовки, **жирный**, - списки)..."
              className="w-full px-4 py-3 bg-black/30 border border-white/10 rounded-xl text-white placeholder-white/40 focus:outline-none focus:border-white/30 resize-none font-mono text-sm"
            />
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center space-x-4">
          <button
            type="submit"
            disabled={isSaving}
            className="flex items-center space-x-2 px-6 py-3 bg-white text-black font-semibold rounded-xl hover:bg-gray-100 transition-colors disabled:opacity-50"
          >
            {isSaving ? (
              <div className="w-5 h-5 border-2 border-black/20 border-t-black rounded-full animate-spin" />
            ) : (
              <Save size={18} />
            )}
            <span>{isEditing ? 'Сохранить' : 'Опубликовать'}</span>
          </button>
          <Link
            to="/admin/news"
            className="flex items-center space-x-2 px-6 py-3 bg-white/10 text-white font-semibold rounded-xl hover:bg-white/20 transition-colors"
          >
            <X size={18} />
            <span>Отмена</span>
          </Link>
        </div>
      </form>
    </div>
  );
};

// Main Export
const ManageNews: React.FC = () => {
  const { isAdmin, isLoading } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  useEffect(() => {
    if (!isLoading && !isAdmin) navigate('/admin/login');
  }, [isAdmin, isLoading, navigate]);

  if (isLoading || !isAdmin) return null;
  if (id) return <NewsForm />;
  return <NewsList />;
};

export default ManageNews;
