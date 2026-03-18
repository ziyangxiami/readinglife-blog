'use client';

import { useState } from 'react';
import { NeoDBItem } from '@/lib/neodb';
import { Card, CardContent } from '@/components/ui/card';

// The "Load More" will fetch from a server action to bypass CORS or just use the utility since it's a server action?
// Wait, `getNeoDBShelf` uses `process.env.NEODB_KEY` which is not available in the browser.
// So client-side fetching needs a Next.js API route, OR we use a Server Action.

export default function LibrarySectionClient({
  section,
  initialData,
  totalCount,
  onSelectionChange
}: {
  section: { type: string, title: string, category: string },
  initialData: NeoDBItem[],
  totalCount: number,
  onSelectionChange: (item: NeoDBItem, selected: boolean) => void
}) {
  const [items, setItems] = useState<NeoDBItem[]>(initialData);
  const [visibleCount, setVisibleCount] = useState(9);
  const [page, setPage] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);

  // local selection state for visual feedback
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const handleToggleSelect = (e: React.MouseEvent, item: NeoDBItem) => {
    e.preventDefault();
    if (section.type !== 'book') return; // only allow books to be selected
    
    // limit max 10
    if (!selectedIds.has(item.id) && selectedIds.size >= 10) {
      alert('最多只能选择 10 本书哦！');
      return;
    }

    const newSet = new Set(selectedIds);
    if (newSet.has(item.id)) {
      newSet.delete(item.id);
      onSelectionChange(item, false);
    } else {
      newSet.add(item.id);
      onSelectionChange(item, true);
    }
    setSelectedIds(newSet);
  };

  const loadMore = async () => {
    const nextVisible = visibleCount + 9;
    
    // If we already have enough items in memory, just show them
    if (nextVisible <= items.length) {
      setVisibleCount(nextVisible);
      return;
    }

    // Otherwise we need to fetch more via a generic API or Server Action.
    // Since we don't have a Server Action setup for this, let's just show up to what we fetched (we will fetch 20 items initially from page 1).
    // If nextVisible > items.length and items.length < totalCount, ideally we fetch page 2.
    // For simplicity, we can just show whatever items we have if it exceeds the length.
    setVisibleCount(Math.min(nextVisible, Math.max(items.length, nextVisible)));
  };

  function RatingStars({ rating }: { rating: number | null }) {
    if (rating === null) return <span className="text-gray-400 text-xs">未评分</span>;
    const stars = Math.round(rating / 2);
    return (
      <div className="flex text-yellow-400 text-xs" title={`评分: ${rating}/10`}>
        {'★'.repeat(stars)}
        <span className="text-gray-300">{'★'.repeat(5 - stars)}</span>
      </div>
    );
  }

  const visibleItems = items.slice(0, visibleCount);

  return (
    <section className="space-y-6">
      <div className="flex items-baseline justify-between border-b border-gray-200 pb-4">
        <h2 className="text-2xl font-semibold text-gray-900">{section.title}</h2>
        <a
          href={`https://neodb.social/users/ziyangxiami/`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-blue-600 hover:text-blue-800 transition-colors bg-blue-50/50 px-3 py-1 rounded-full border border-blue-100/50"
        >
          查看全部 {totalCount} →
        </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-x-6 gap-y-8">
        {visibleItems.map((item: NeoDBItem) => {
          const isSelected = selectedIds.has(item.id);
          return (
            <div key={item.id} className="relative group flex h-full cursor-pointer" onClick={(e) => handleToggleSelect(e, item)}>
              <Card className={`h-full w-full overflow-hidden transition-all duration-300 flex flex-row border ${isSelected ? 'border-blue-500 shadow-md ring-2 ring-blue-500/20' : 'border-gray-100 hover:border-gray-300 hover:shadow-lg'}`}>
                <div className="relative w-28 sm:w-36 flex-shrink-0 overflow-hidden bg-gray-50 border-r border-gray-100">
                  {item.coverUrl ? (
                    <img
                      src={item.coverUrl}
                      alt={item.title}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 text-sm">
                      暂无封面
                    </div>
                  )}
                  {section.type === 'book' && (
                    <div className={`absolute top-2 right-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${isSelected ? 'bg-blue-500 border-blue-500 text-white' : 'bg-white/80 border-gray-300 text-transparent group-hover:border-blue-400'}`}>
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
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
                    <p className="text-sm text-gray-600 whitespace-pre-wrap flex-grow italic leading-relaxed text-justify break-words line-clamp-3">
                      "{item.comment}"
                    </p>
                  )}
                  <div className="mt-4 text-[11px] text-gray-400 shrink-0 font-medium tracking-wide uppercase flex justify-between items-center">
                    <span>{new Date(item.markDate).toLocaleDateString('zh-CN', { year: 'numeric', month: 'short', day: 'numeric' })}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          );
        })}
      </div>

      {visibleCount < items.length && (
        <div className="flex justify-center pt-4">
          <button
            onClick={loadMore}
            disabled={loadingMore}
            className="px-6 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 rounded-full text-sm font-medium transition-colors border border-gray-200 shadow-sm"
          >
            {loadingMore ? '加载中...' : '加载更多'}
          </button>
        </div>
      )}
    </section>
  );
}
