import { getNeoDBShelf } from '@/lib/neodb';
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
  { type: 'movie' as const, title: '近期观影', category: 'complete' as const },
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

        <div className="space-y-16">
          {SECTIONS.map((section, index) => {
            const items = results[index];
            if (!items || items.length === 0) return null;

            return (
              <section key={section.type} className="space-y-6">
                <div className="flex items-center justify-between border-b border-gray-200 pb-4">
                  <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
                  <a
                    href={`https://neodb.social/users/ziyangxiami/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    查看全部 →
                  </a>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                  {items.slice(0, 10).map((item) => ( // 每类最多展示前10个
                    <a
                      key={item.id}
                      href={item.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex flex-col h-full"
                    >
                      <Card className="h-full overflow-hidden hover:shadow-md transition-shadow duration-300 flex flex-col">
                        <div className="relative aspect-[2/3] w-full overflow-hidden bg-gray-100">
                          {item.coverUrl ? (
                            /* eslint-disable-next-line @next/next/no-img-element */
                            <img
                              src={item.coverUrl}
                              alt={item.title}
                              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                              loading="lazy"
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-gray-400">
                              暂无封面
                            </div>
                          )}
                        </div>
                        <CardContent className="p-4 flex-1 flex flex-col">
                          <h3 className="font-medium text-gray-900 line-clamp-1 group-hover:text-blue-600 transition-colors" title={item.title}>
                            {item.title}
                          </h3>
                          <div className="mt-1 mb-2">
                            <RatingStars rating={item.rating} />
                          </div>
                          {item.comment && (
                            <p className="text-xs text-gray-500 line-clamp-2 mt-auto italic">
                              "{item.comment}"
                            </p>
                          )}
                          <div className="mt-2 text-[10px] text-gray-400">
                            {new Date(item.markDate).toLocaleDateString('zh-CN')}
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
