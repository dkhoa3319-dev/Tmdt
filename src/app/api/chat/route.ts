// src/app/api/chat/route.ts (Next.js App Router)
import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { message, sessionId } = await req.json();
    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Thiếu nội dung tin nhắn' }, { status: 400 });
    }

    // Load live catalog, stock, and store policies directly from DB
    const [{ data: products }, { data: faqs }] = await Promise.all([
      supabase.from('products').select('name, category, price, stock, material, style, compatible_models').gt('stock', 0).limit(50),
      supabase.from('chatbot_faqs').select('category, question, answer')
    ]);

    const systemPrompt = `Bạn là trợ lý bán hàng trực tuyến của CASE STUDIO (chuyên ốp lưng điện thoại & iPad, và dịch vụ tự thiết kế Custom Case Studio 2D/3D).
QUY TẮC BẮT BUỘC:
- Chỉ tư vấn sản phẩm, giá bán và tồn kho dựa trên dữ liệu thực tế bên dưới. Không tự bịa sản phẩm hoặc giá không có.
- Trả lời tự nhiên bằng tiếng Việt, lịch sự, ngắn gọn.
- Nếu câu hỏi vượt ngoài dữ liệu cửa hàng, hướng dẫn khách liên hệ Hotline 1900 8868 hoặc CSKH@casestudio.vn.

DANH SÁCH SẢN PHẨM HIỆN CÓ:
${JSON.stringify(products || [])}

CHÍNH SÁCH & FAQ CỬA HÀNG:
${JSON.stringify(faqs || [])}`;

    const aiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          systemInstruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: message }] }]
        })
      }
    );

    const aiData = await aiRes.json();
    const reply = aiData?.candidates?.[0]?.content?.parts?.[0]?.text
      || 'Xin lỗi, hệ thống AI đang bận. Vui lòng liên hệ Hotline 1900 8868 để được hỗ trợ ngay.';

    await supabase.from('chat_logs').insert({
      session_id: sessionId || 'guest',
      user_message: message,
      bot_reply: reply,
      resolved: !reply.includes('1900 8868')
    });

    return NextResponse.json({ reply });
  } catch (err) {
    return NextResponse.json({ error: 'Lỗi xử lý chatbot' }, { status: 500 });
  }
}
