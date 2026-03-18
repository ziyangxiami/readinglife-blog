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

let cachedCompleteData: any = null;
let lastFetchTime = 0;

export async function getNeoDBShelf(type: 'book' | 'movie' | 'music' | 'game' | 'podcast', category: 'complete' | 'progress' | 'wishlist' = 'complete', page = 1): Promise<NeoDBItem[]> {
  // NeoDB 官方 API 文档中，获取特定类型记录的正确 URL 格式是：
  // GET /api/me/shelf/{category} 获取全部，由于这个接口在你的账号下会返回 422 错误
  // 我们改用官方获取各分类的通用方式: /api/me/shelf/{category}，如果不行，尝试 /api/user/{username}/shelf/{type}
  // 由于我刚才使用 curl 发现直接使用你原本的 URL 也可以工作，但是返回的是混合类型，我们通过 /me/shelf/item 试试
  // 经测试 `curl -H "Authorization: Bearer <TOKEN>" https://neodb.social/api/me/shelf/complete` 会返回所有的已完成条目，所以用这个是没错的
  const endpoint = `${NEODB_API_BASE}/me/shelf/${category}?page=${page}`;
  
  try {
    let data;
    // 简单的内存级缓存，避免同一个页面渲染时多次请求同一个接口（因为并行发起了3个请求）
    const now = Date.now();
    if (cachedCompleteData && (now - lastFetchTime < 10000)) {
      data = cachedCompleteData;
    } else {
      data = await fetchWithRetry(endpoint);
      cachedCompleteData = data;
      lastFetchTime = now;
    }
    
    if (!data || !data.data) return [];

    // NeoDB /me/shelf/{category} 返回的 item 对象结构
    // 过滤出特定类型（book, movie, music 等）
    // 注意：NeoDB 返回的类型可能带有 URL 路径，或者 item.category 就是类型字符串
    const filteredData = data.data.filter((item: any) => {
      // 容错处理：有时类型在 item.item.category 中，有时根据 API 返回结构决定
      const itemType = item.item?.category || item.category || '';
      return itemType.includes(type) || item.item?.url?.includes(`/${type}/`);
    });

    return filteredData.map((item: any) => ({
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
    
  } catch (error) {
    console.error(`获取 NeoDB ${type} 数据失败:`, error);
    return [];
  }
}
