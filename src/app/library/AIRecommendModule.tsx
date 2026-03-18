'use client';

import { useState, useEffect } from 'react';
import { NeoDBItem } from '@/lib/neodb';

export default function AIRecommendModule({ selectedBooks }: { selectedBooks: NeoDBItem[] }) {
  const [loading, setLoading] = useState(false);
  const [recommendations, setRecommendations] = useState<any[] | null>(null);
  const [showPasskeyModal, setShowPasskeyModal] = useState(false);
  const [passkeyInput, setPasskeyInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Handle passkey flow
  const handleRecommendClick = () => {
    const savedKey = localStorage.getItem('ai_passkey');
    if (!savedKey) {
      setShowPasskeyModal(true);
    } else {
      fetchRecommendations(savedKey);
    }
  };

  const submitPasskey = () => {
    if (!passkeyInput.trim()) return;
    localStorage.setItem('ai_passkey', passkeyInput);
    setShowPasskeyModal(false);
    fetchRecommendations(passkeyInput);
  };

  const fetchRecommendations = async (passkey: string) => {
    setLoading(true);
    setErrorMsg('');
    try {
      const res = await fetch('/api/recommend', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          selectedBooks,
          passkey
        })
      });

      const data = await res.json();
      
      if (!res.ok) {
        if (res.status === 403) {
          localStorage.removeItem('ai_passkey');
          setErrorMsg('通行码错误，请重新输入');
          setShowPasskeyModal(true);
        } else {
          setErrorMsg(data.error || '推荐失败');
        }
        setLoading(false);
        return;
      }

      setRecommendations(data.recommendations);
    } catch (err: any) {
      setErrorMsg(err.message || '网络错误');
    } finally {
      setLoading(false);
    }
  };

  if (selectedBooks.length === 0 && !recommendations) {
    return null;
  }

  return (
    <>
      {/* Floating Action Button */}
      {selectedBooks.length > 0 && !recommendations && !loading && (
        <div className="fixed bottom-8 right-8 z-40 animate-in slide-in-from-bottom-5">
          <button
            onClick={handleRecommendClick}
            className="group flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-4 rounded-full shadow-lg shadow-blue-500/30 transition-all active:scale-95"
          >
            <span className="text-xl">✨</span>
            <span className="font-medium tracking-wide">AI 推荐拓展阅读 ({selectedBooks.length}/10)</span>
          </button>
        </div>
      )}

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-6 text-xl font-medium text-gray-800 animate-pulse">正在深度分析你的阅读口味...</p>
          <p className="mt-2 text-sm text-gray-500">GLM-5 正在检索绝佳书籍</p>
        </div>
      )}

      {/* Passkey Modal */}
      {showPasskeyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-sm shadow-xl slide-in-from-bottom-4 animate-in">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">需要通行码</h3>
            <p className="text-sm text-gray-500 mb-6">为了防止滥用 AI 额度，请输入通行码以继续体验推荐功能。</p>
            
            <input
              type="password"
              placeholder="请输入通行码"
              value={passkeyInput}
              onChange={(e) => setPasskeyInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && submitPasskey()}
              className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 bg-gray-50 mb-2"
              autoFocus
            />
            {errorMsg && <p className="text-red-500 text-sm mb-4 bg-red-50 p-2 rounded">{errorMsg}</p>}
            
            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setShowPasskeyModal(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              >
                取消
              </button>
              <button
                onClick={submitPasskey}
                className="flex-1 px-4 py-2.5 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors"
              >
                验证并推荐
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Results Modal */}
      {recommendations && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-100/95 backdrop-blur-md p-4 sm:p-6 lg:p-12 overflow-y-auto">
          <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl flex flex-col max-h-[90vh] min-h-[50vh] relative overflow-hidden animate-in zoom-in-95">
            {/* Header */}
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/90 backdrop-blur z-10">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span>✨</span> 基于你的阅读生成的推荐书单
                </h2>
                <p className="text-sm text-gray-500 mt-1">从千万图库中为你精心挑选的 {recommendations.length} 本好书</p>
              </div>
              <button 
                onClick={() => setRecommendations(null)}
                className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-50 hover:bg-gray-100 text-gray-500 transition-colors"
              >
                ✕
              </button>
            </div>

            {/* Content */}
            <div className="p-8 overflow-y-auto flex-1 bg-gray-50/50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {recommendations.map((rec: any, idx: number) => (
                  <div key={idx} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm flex gap-5 hover:shadow-md transition-shadow relative overflow-hidden">
                    <div className="w-24 shrink-0 shadow-sm rounded-lg overflow-hidden bg-gray-100 self-start">
                      {rec.coverUrl ? (
                         /* eslint-disable-next-line @next/next/no-img-element */
                        <img src={rec.coverUrl} alt={rec.title} className="w-full h-auto object-cover" />
                      ) : (
                        <div className="w-full h-36 flex flex-col items-center justify-center text-gray-400 text-xs gap-2 p-2 text-center bg-gray-100">
                          <span className="text-2xl">📖</span>暂无封面<br/>{rec.title}
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0 flex flex-col">
                      <h3 className="text-lg font-bold text-gray-900 mb-1 leading-tight"><a href={rec.link !== '#' ? rec.link : undefined} target="_blank" rel="noreferrer" className="hover:text-blue-600 transition-colors">{rec.title}</a></h3>
                      {rec.author && <p className="text-sm text-gray-500 mb-3">{rec.author}</p>}
                      <div className="bg-blue-50 rounded-xl p-3.5 mt-auto relative border border-blue-100/50">
                        <div className="absolute top-2.5 left-3 text-blue-200">
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/></svg>
                        </div>
                        <p className="text-sm text-blue-900 pl-7 leading-relaxed">{rec.reason}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            {/* Footer */}
            <div className="px-8 py-4 border-t border-gray-100 bg-white flex justify-between items-center text-sm text-gray-500">
              <p>Powered by SiliconFlow GLM-5</p>
              <button 
                onClick={() => setRecommendations(null)}
                className="px-6 py-2 bg-gray-900 text-white font-medium rounded-full hover:bg-gray-800 transition-colors"
              >
                完成
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
