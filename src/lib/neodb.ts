export const NEODB_API_BASE = 'https://neodb.social/api';
export const USERNAME = 'ziyangxiami';

export interface NeoDBItem {
  id: string;
  title: string;
  coverUrl: string;
  rating: number | null;
  comment: string;
  markDate: string;
  link: string;
  category: string;
  brief: string;
}

export async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 3) {
  const token = process.env.NEODB_KEY;
  if (!token) {
    console.warn('⚠️ 警告：环境变量 NEODB_KEY 未设置。在本地开发时，你可能无法获取私密数据或遇到频率限制。');
  }

  for (let i = 0; i < retries; i++) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10秒超时

      const headers: Record<string, string> = {
        'Accept': 'application/json',
      };
      
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
        headers: {
          ...headers,
          ...options.headers,
        },
        // next: { revalidate: 3600 } // 先注释掉缓存，方便开发时调试
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`HTTP 错误！状态码: ${response.status} - ${response.statusText}`);
      }

      return await response.json();
    } catch (error: any) {
      console.warn(`[NeoDB Fetch] 第 ${i + 1} 次请求失败: ${url}. 错误: ${error.message}`);
      if (i === retries - 1) {
        throw new Error(`[NeoDB Fetch] 达到最大重试次数，彻底失败: ${url}`);
      }
      // 简单的退避策略
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
}

const requestCache = new Map<string, { data: any, time: number }>();

export interface NeoDBResponse {
  items: NeoDBItem[];
  count: number;
}

export async function getNeoDBShelf(type: 'book' | 'movie' | 'music' | 'game' | 'podcast', category: 'complete' | 'progress' | 'wishlist' = 'complete', page = 1): Promise<NeoDBResponse> {
  const endpoint = `${NEODB_API_BASE}/me/shelf/${category}?category=${type}&page=${page}`;
  
  try {
    let data;
    // 简单的内存级缓存，避免同一个页面渲染时多次请求同一个接口
    const now = Date.now();
    const cached = requestCache.get(endpoint);
    if (cached && (now - cached.time < 10000)) {
      data = cached.data;
    } else {
      data = await fetchWithRetry(endpoint);
      requestCache.set(endpoint, { data, time: now });
    }
    
    if (!data || !data.data) return { items: [], count: 0 };

    const count = data.count || 0;

    // NeoDB /me/shelf/{category} 返回的 item 对象结构
    const items = data.data.map((item: any) => ({
      id: item.item?.uuid || item.uuid || '',
      title: item.item?.title || item.title || '未知标题',
      coverUrl: item.item?.cover_image_url || item.cover_image_url || '',
      rating: item.rating || item.rating_grade || null,
      comment: item.comment_text || '',
      markDate: item.created_time || new Date().toISOString(),
      link: item.item?.url ? `https://neodb.social${item.item.url}` : '#',
      category: item.item?.category || item.category || '',
      brief: item.item?.brief || item.brief || '',
    }));
    
    return { items, count };
  } catch (error) {
    console.error(`获取 NeoDB ${type} 数据失败:`, error);
    return { items: [], count: 0 };
  }
}
