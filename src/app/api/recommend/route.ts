import { NextResponse } from 'next/server';
import { getNeoDBBookByQuery } from '@/lib/neodb';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { selectedBooks, passkey } = body;

    // 1. Password Verification
    if (process.env.AI_PASSKEY && passkey !== process.env.AI_PASSKEY) {
      return NextResponse.json({ error: 'Auth failed' }, { status: 403 });
    }

    if (!selectedBooks || selectedBooks.length === 0) {
      return NextResponse.json({ error: 'No books provided' }, { status: 400 });
    }
    
    if (selectedBooks.length > 10) {
      return NextResponse.json({ error: 'Too many books selected' }, { status: 400 });
    }

    // 2. Prepare Prompt
    const booksList = selectedBooks.map((b: any, index: number) => 
      `${index + 1}. 《${b.title}》 - ${b.comment || b.brief || ''}`
    ).join('\n');

    const prompt = `
你是一位专业的阅读推荐官。用户刚刚选出了他读过并喜欢的 ${selectedBooks.length} 本书：

${booksList}

请根据这些书的主题、风格、思想深度，为你推荐 **刚好 5 本** 新书或拓展阅读书籍。
要求：
1. 必须是用户列表中没有的书。
2. 优先推荐中文出版物，如果实在没有合适的中文版，可以使用英文出版物。
3. 返回的结果必须是一个严格的 JSON 对象，包含 "recommendations" 数组。数组中的每个对象包含：
   - "title": 书名（必须准确无误）
   - "author": 作者的原始或官方译名（用于帮助检索区分不同版本）
   - "reason": 推荐理由（50-100字，说明为什么根据上述书单推荐这本书）

返回 JSON 格式如下：
{
  "recommendations": [
    { "title": "微暗的火", "author": "[美] 弗拉基米尔·纳博科夫", "reason": "..." },
    ...
  ]
}
`;

    // 3. Call SiliconFlow API
    const aiResponse = await fetch('https://api.siliconflow.cn/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SILICONFLOW_API_KEY}`
      },
      body: JSON.stringify({
        model: 'Pro/zai-org/GLM-5',
        messages: [
          { role: 'system', content: 'You are a professional book recommendation assistant.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' }
      })
    });

    if (!aiResponse.ok) {
      const errText = await aiResponse.text();
      console.error('SiliconFlow API Error:', errText);
      return NextResponse.json({ error: 'AI recommendation failed' }, { status: 500 });
    }

    const aiData = await aiResponse.json();
    const rawContent = aiData.choices?.[0]?.message?.content;
    
    if (!rawContent) {
      return NextResponse.json({ error: 'Invalid AI response' }, { status: 500 });
    }

    let recommendations = [];
    try {
      // Handle potential markdown backticks in JSON response
      const jsonStr = rawContent.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(jsonStr);
      recommendations = parsed.recommendations || [];
    } catch (e) {
      console.error('Failed to parse AI JSON:', rawContent);
      return NextResponse.json({ error: 'AI response parse failed' }, { status: 500 });
    }

    // 4. Enrich with NeoDB data
    const enrichedResults = await Promise.all(
      recommendations.map(async (rec: any) => {
        if (!rec.title) return rec;
        try {
          const queryStr = `${rec.title} ${rec.author || ''}`.trim();
          const neodbData = await getNeoDBBookByQuery(queryStr);
          if (neodbData && neodbData.uuid) {
            return {
              ...rec,
              coverUrl: neodbData.cover_image_url || '',
              link: neodbData.url ? `https://neodb.social${neodbData.url}` : '#',
              rating: neodbData.rating || 0,
              author: neodbData.author ? neodbData.author.join(', ') : rec.author,
            };
          }
        } catch (err) {
          console.warn(`Failed to fetch NeoDB data for book query ${rec.title}`);
        }
        return rec; // Fallback to raw AI data if NeoDB fetch fails
      })
    );

    return NextResponse.json({ recommendations: enrichedResults });
  } catch (error: any) {
    console.error('Recommend API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
