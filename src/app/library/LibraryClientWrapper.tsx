'use client';

import { useState } from 'react';
import { NeoDBItem } from '@/lib/neodb';
import LibrarySectionClient from './LibrarySectionClient';
import AIRecommendModule from './AIRecommendModule';
import { Card, CardContent } from '@/components/ui/card';

const SECTIONS = [
  { type: 'book' as const, title: '近期阅读', category: 'complete' as const },
  { type: 'book' as const, title: '在读', category: 'progress' as const },
  { type: 'book' as const, title: '想读', category: 'wishlist' as const },
  { type: 'movie' as const, title: '近期观影', category: 'complete' as const },
  { type: 'movie' as const, title: '在看', category: 'progress' as const },
  { type: 'movie' as const, title: '想看', category: 'wishlist' as const },
];

export default function LibraryClientWrapper({ 
  results, 
  stats 
}: { 
  results: any[], 
  stats: Record<string, Record<string, number>> 
}) {
  const [selectedBooks, setSelectedBooks] = useState<NeoDBItem[]>([]);

  const handleSelectionChange = (item: NeoDBItem, isSelected: boolean) => {
    setSelectedBooks(prev => {
      if (isSelected) {
        if (prev.find(b => b.id === item.id)) return prev;
        return [...prev, item];
      } else {
        return prev.filter(b => b.id !== item.id);
      }
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          书影记录
        </h1>
        <p className="mt-4 text-lg text-gray-500">
          我的阅读与观影记录，数据由开源平台 NeoDB 提供支持。<br/>
          <span className="text-blue-600 font-medium tracking-wide">💡 提示：点击书籍封面即可选中，选完可召唤 AI 为你推荐拓展书单！</span>
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
            <LibrarySectionClient 
              key={`${section.type}-${section.category}`}
              section={section}
              initialData={result.items}
              totalCount={result.count}
              onSelectionChange={handleSelectionChange}
            />
          );
        })}
      </div>

      {/* Floating recommendation module */}
      <AIRecommendModule selectedBooks={selectedBooks} />
    </div>
  );
}
