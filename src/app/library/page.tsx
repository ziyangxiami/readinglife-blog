import { getNeoDBShelf } from '@/lib/neodb';
import { Metadata } from 'next';
import { Navigation } from '@/components/navigation';
import LibraryClientWrapper from './LibraryClientWrapper';

export const metadata: Metadata = {
  title: '书影音 | 豆瓣/NeoDB记录',
  description: '我的阅读、观影等记录。数据同步自 NeoDB。',
};

// Removed music section per user request
const SECTIONS = [
  { type: 'book' as const, title: '近期阅读', category: 'complete' as const },
  { type: 'book' as const, title: '在读', category: 'progress' as const },
  { type: 'book' as const, title: '想读', category: 'wishlist' as const },
  { type: 'movie' as const, title: '近期观影', category: 'complete' as const },
  { type: 'movie' as const, title: '在看', category: 'progress' as const },
  { type: 'movie' as const, title: '想看', category: 'wishlist' as const },
];

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
      <LibraryClientWrapper results={results} stats={stats} />
    </div>
  );
}
