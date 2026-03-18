import { getNeoDBShelf, NeoDBResponse, NeoDBItem } from '@/lib/neodb';
import { Card, CardContent } from '@/components/ui/card';
import { Metadata } from 'next';
import { Navigation } from '@/components/navigation';

export const metadata: Metadata = {
  title: '书影音 | 豆瓣/NeoDB记录',
  description: '我的阅读、观影、音乐等记录。数据同步自 NeoDB。',
};

// 预定义我们想要展示的模块
const SECTIONS = [
  { type: 'book' as const, title: '近期阅读', category: 'complete' as const },
  { type: 'book' as const, title: '在读', category: 'progress' as const },
  { type: 'book' as const, title: '想读', category: 'wishlist' as const },
  { type: 'movie' as const, title: '近期观影', category: 'complete' as const },
  { type: 'movie' as const, title: '在看', category: 'progress' as const },
  { type: 'movie' as const, title: '想看', category: 'wishlist' as const },
  { type: 'music' as const, title: '近期听歌', category: 'complete' as const },
];

function RatingStars({ rating }: { rating: number | null }) {
  if (rating === null) return <span className="text-gray-400 text-xs">未评分</span>;
  // 评分一般是 0-10，将其转换为 5 星
  const stars = Math.round(rating / 2);
  return (
    <div className="flex text-yellow-400 text-xs" title={`评分: ${rating}/10`}>
      {'★'.repeat(stars)}
      <span className="text-gray-300">{'★'.repeat(5 - stars)}</span>
    </div>
  );
}

export default async function LibraryPage() {
  const results = await Promise.all(
    SECTIONS.map((section) => getNeoDBShelf(section.type, section.category, 1))
  );

  const stats: Record<string, Record<string, number>> = {
    book: { complete: 0, progress: 0, wishlist: 0 },
    movie: { complete: 0, progress: 0, wishlist: 0 }
  };

  results.forEach((res, index) => {
    const sec = SECTIONS[index];
    if (stats[sec.type]) {
      stats[sec.type][sec.category] = res.count;
    }
  });

  return (
    <div className="min-h-screen bg-white">
      <Navigation />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            书影音记录
          </h1>
          <p className="mt-4 text-lg text-gray-500">
            我的阅读、观影与听歌记录，数据由开源平台 NeoDB 提供支持。
          </p>
        </div>

        {/* 顶部统计面板 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Card className="bg-gradient-to-br from-blue-50/40 to-indigo-50/40 border-blue-100/50 shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">📚</span>
                <h3 className="text-xl font-medium text-gray-900">读书</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif tracking-tight">{stats.book.complete}</span>
                  <span className="text-sm text-gray-500 mt-2 font-medium">已读</span>
                </div>
                <div className="flex flex-col border-l border-gray-200/60 pl-4 sm:pl-6">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif tracking-tight">{stats.book.progress}</span>
                  <span className="text-sm text-gray-500 mt-2 font-medium">在读</span>
                </div>
                <div className="flex flex-col border-l border-gray-200/60 pl-4 sm:pl-6">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif tracking-tight">{stats.book.wishlist}</span>
                  <span className="text-sm text-gray-500 mt-2 font-medium">想读</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50/40 to-teal-50/40 border-emerald-100/50 shadow-sm">
            <CardContent className="p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <span className="text-2xl">🎬</span>
                <h3 className="text-xl font-medium text-gray-900">观影</h3>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="flex flex-col">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif tracking-tight">{stats.movie.complete}</span>
                  <span className="text-sm text-gray-500 mt-2 font-medium">已看</span>
                </div>
                <div className="flex flex-col border-l border-gray-200/60 pl-4 sm:pl-6">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif tracking-tight">{stats.movie.progress}</span>
                  <span className="text-sm text-gray-500 mt-2 font-medium">在看</span>
                </div>
                <div className="flex flex-col border-l border-gray-200/60 pl-4 sm:pl-6">
                  <span className="text-3xl sm:text-4xl font-bold text-gray-900 font-serif tracking-tight">{stats.movie.wishlist}</span>
                  <span className="text-sm text-gray-500 mt-2 font-medium">想看</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-16">
          {SECTIONS.map((section, index) => {
            const result = results[index];
            if (!result || !result.items || result.items.length === 0) return null;

            return (
              <section key={`${section.type}-${section.category}`} className="space-y-6">
                <div className="flex items-baseline justify-between border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
                  <a
                    href={`https://neodb.social/users/ziyangxiami/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors bg-blue-50/50 px-3 py-1 rounded-full border border-blue-100/50"
                  >
                    查看全部 {result.count} →
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-8">
                  {result.items.slice(0, 10).map((item: NeoDBItem) => ( // 每类最多展示前10个
                    <a
                      key={item.id}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex h-full"
                    >
                      <Card className="h-full w-full overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-row border-gray-100 hover:border-gray-200">
                        <div className="relative w-28 sm:w-36 flex-shrink-0 overflow-hidden bg-gray-50 border-r border-gray-100">
                          {item.coverUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={item.coverUrl}
                              alt={item.title}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                              loading="lazy"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                              暂无封面
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4 sm:p-5 flex-1 flex flex-col min-w-0 bg-white">
                          <h3 className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors truncate" title={item.title}>
                            {item.title}
                          </h3>
                          <div className="mt-1.5 mb-2.5 shrink-0">
                            <RatingStars rating={item.rating} />
                          </div>
                          {item.comment && (
                            <p className="text-sm text-gray-600 whitespace-pre-wrap flex-grow italic leading-relaxed text-justify break-words">
                              "{item.comment}"
                            </p>
                          )}
                          <div className="mt-4 text-[11px] text-gray-400 shrink-0 font-medium tracking-wide uppercase">
                            {new Date(item.markDate).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })}
                          </div>
                        </CardContent>
                      </Card>
                    </a>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </div>
  );
}
