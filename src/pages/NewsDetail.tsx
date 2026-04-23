import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Calendar, ArrowLeft, Pin, Share2, Loader2 } from 'lucide-react';
import { News } from '../types';
import { getNewsById, getNews } from '../utils/storage';
import { formatDate } from '../utils/storage';
import AnimatedSection from '../components/AnimatedSection';
import NewsCard from '../components/NewsCard';

const NewsDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [newsItem, setNewsItem] = useState<News | null>(null);
  const [relatedNews, setRelatedNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      if (!id) { setLoading(false); return; }
      setLoading(true);
      const [article, allNews] = await Promise.all([
        getNewsById(id),
        getNews(),
      ]);
      if (article) {
        setNewsItem(article);
      } else {
        setError('Новость не найдена');
      }
      setRelatedNews(allNews.filter(n => n.id !== id).slice(0, 3));
      setLoading(false);
    };
    loadNews();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-white/50 mb-4 mx-auto" />
          <p className="text-white/50">Загрузка новости...</p>
        </div>
      </div>
    );
  }

  if (error || !newsItem) {
    return (
      <div className="min-h-screen bg-black pt-20 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-white mb-4">Новость не найдена</h1>
          <Link to="/news" className="text-white/70 hover:text-white">
            ← Вернуться к новостям
          </Link>
        </div>
      </div>
    );
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: newsItem.title,
          text: newsItem.shortText,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    }
  };

  // Parse markdown-like content
  const parseContent = (content: string) => {
    return content
      .split('\n\n')
      .map((paragraph, index) => {
        // Headers
        if (paragraph.startsWith('# ')) {
          return (
            <h1 key={index} className="text-3xl font-bold text-white mt-8 mb-4">
              {paragraph.replace('# ', '')}
            </h1>
          );
        }
        if (paragraph.startsWith('## ')) {
          return (
            <h2 key={index} className="text-2xl font-bold text-white mt-6 mb-3">
              {paragraph.replace('## ', '')}
            </h2>
          );
        }
        if (paragraph.startsWith('### ')) {
          return (
            <h3 key={index} className="text-xl font-bold text-white mt-4 mb-2">
              {paragraph.replace('### ', '')}
            </h3>
          );
        }
        
        // Lists
        if (paragraph.startsWith('- ')) {
          const items = paragraph.split('\n').filter(l => l.startsWith('- '));
          return (
            <ul key={index} className="list-disc list-inside space-y-2 my-4 text-white/70">
              {items.map((item, i) => (
                <li key={i}>{item.replace('- ', '')}</li>
              ))}
            </ul>
          );
        }

        // Bold text
        // Санитизация: экранируем HTML, затем разрешаем только <strong>
        const escaped = paragraph
          .replace(/&/g, '&amp;')
          .replace(/</g, '&lt;')
          .replace(/>/g, '&gt;')
          .replace(/"/g, '&quot;');
        const parsedParagraph = escaped.replace(
          /\*\*(.*?)\*\*/g,
          '<strong class="text-white font-semibold">$1</strong>'
        );

        return (
          <p
            key={index}
            className="text-white/70 leading-relaxed my-4"
            dangerouslySetInnerHTML={{ __html: parsedParagraph }}
          />
        );
      });
  };

  return (
    <div className="min-h-screen bg-black pt-20">
      {/* Hero Image */}
      <section className="relative h-[40vh] lg:h-[50vh] overflow-hidden">
        <img
          src={newsItem.image}
          alt={newsItem.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />
      </section>

      {/* Content */}
      <section className="relative -mt-32 pb-16">
        <div className="w-full px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
          <AnimatedSection>
            <div className="bg-gray-900/80 backdrop-blur-xl rounded-3xl p-6 lg:p-10 border border-white/10">
              {/* Back Link */}
              <Link
                to="/news"
                className="inline-flex items-center text-white/70 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft size={18} className="mr-2" />
                Все новости
              </Link>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center text-white/50 text-sm">
                  <Calendar size={16} className="mr-2" />
                  {formatDate(newsItem.date)}
                </div>
                {newsItem.isPinned && (
                  <div className="flex items-center text-white bg-white/10 px-3 py-1 rounded-full text-sm">
                    <Pin size={14} className="mr-1.5" />
                    Закреплено
                  </div>
                )}
                <button
                  onClick={handleShare}
                  className="flex items-center text-white/50 hover:text-white transition-colors text-sm ml-auto"
                >
                  <Share2 size={16} className="mr-2" />
                  Поделиться
                </button>
              </div>

              {/* Title */}
              <h1 className="text-3xl lg:text-4xl font-bold text-white mb-8">
                {newsItem.title}
              </h1>

              {/* Content */}
              <div className="prose prose-invert max-w-none">
                {parseContent(newsItem.fullText)}
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      {/* Related News */}
      {relatedNews.length > 0 && (
        <section className="py-16 border-t border-white/5">
          <div className="w-full px-4 sm:px-6 lg:px-8">
            <AnimatedSection className="mb-8">
              <h2 className="text-2xl font-bold text-white">Другие новости</h2>
            </AnimatedSection>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedNews.map((item, index) => (
                <NewsCard key={item.id} news={item} index={index} />
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default NewsDetail;
