import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { goal, goalTitle, subject, schoolClass } = body;
    const targetGoal = goal || goalTitle;

    if (!targetGoal || typeof targetGoal !== 'string') {
      return NextResponse.json({ error: 'Mục tiêu không hợp lệ' }, { status: 400 });
    }

    const subjectContext = subject ? `Môn học: ${subject}.` : '';
    const classContext = schoolClass ? `Lớp: ${schoolClass} trường THPT Mỹ Đức B.` : '';

    const apiKey = process.env.OPENAI_API_KEY;

    if (apiKey && !apiKey.includes('mock')) {
      try {
        const { default: OpenAI } = await import('openai');
        const openai = new OpenAI({ apiKey });

        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: `Em là trợ lý học tập thân thiện của trường THPT Mỹ Đức B, nói chuyện như anh/chị khóa trên với học sinh cấp 3. ${subjectContext} ${classContext}

Nhiệm vụ: Nhận mục tiêu học tập và chia thành 3-5 micro-task siêu cụ thể, thực tế với học sinh THPT.
Quy tắc:
- Task đầu tiên: ÁP DỤNG QUY TẮC 2 PHÚT - chỉ 2 phút, cực dễ bắt đầu (mở sách, đọc đề, viết tên bài)
- Task thứ 2: 5 phút - xem lý thuyết hoặc ví dụ mẫu
- Task 3-5: 10-15 phút mỗi task - thực hành bài tập, giải đề
- Dùng từ gần gũi: "em", "thử làm", "cố lên", không dùng từ hàn lâm
- Tên task phải CỰC KỲ CỤ THỂ với môn học (số câu trắc nghiệm, tên chương cụ thể)
Trả về MẢNG JSON THUẦN TÚY:
[{ "id": 1, "title": "...", "duration": 2 }, ...]`,
            },
            {
              role: 'user',
              content: `Mục tiêu của em: "${targetGoal}". Anh/chị chia nhỏ giúp em với!`,
            },
          ],
          response_format: { type: 'json_object' },
        });

        const content = completion.choices[0]?.message?.content;
        if (content) {
          const parsed = JSON.parse(content);
          const tasks = Array.isArray(parsed) ? parsed : parsed.tasks || parsed.microTasks || parsed.data;
          if (tasks && tasks.length > 0) {
            return NextResponse.json({ tasks });
          }
        }
      } catch (e) {
        console.warn('OpenAI API error, using smart fallback:', e);
      }
    }

    // Smart Subject-Aware Fallback Engine for Mỹ Đức B
    const fallbackTasks = generateSmartFallback(targetGoal, subject);
    return NextResponse.json({ tasks: fallbackTasks });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Lỗi server' }, { status: 500 });
  }
}

function generateSmartFallback(goal: string, subject?: string): any[] {
  const subjectLower = (subject || goal).toLowerCase();

  if (subjectLower.includes('toan') || subjectLower.includes('toán')) {
    return [
      { id: 1, title: `Mở vở ra và đọc lại đề bài "${goal.slice(0, 40)}" trong 2 phút`, duration: 2 },
      { id: 2, title: 'Đọc lại lý thuyết/công thức liên quan trong SGK (gạch chân ý chính)', duration: 5 },
      { id: 3, title: 'Làm 3 câu trắc nghiệm mức độ nhận biết trong đề cương', duration: 10 },
      { id: 4, title: 'Giải 1 bài tập tự luận mẫu (nhìn đáp án sau 10 phút nếu chưa ra)', duration: 15 },
    ];
  }

  if (subjectLower.includes('anh') || subjectLower.includes('english')) {
    return [
      { id: 1, title: 'Mở tài liệu và viết 5 từ vựng mới ra giấy trong 2 phút', duration: 2 },
      { id: 2, title: 'Đọc to đoạn văn mẫu 1 lần, gạch chân cấu trúc ngữ pháp', duration: 5 },
      { id: 3, title: 'Làm 5 câu trắc nghiệm từ vựng/ngữ pháp từ đề cương', duration: 10 },
      { id: 4, title: 'Viết 1 đoạn văn ngắn 80-100 từ theo chủ đề đã học', duration: 15 },
    ];
  }

  if (subjectLower.includes('van') || subjectLower.includes('văn')) {
    return [
      { id: 1, title: 'Ghi tên tác phẩm/tác giả và đọc 1 đoạn đầu trong 2 phút', duration: 2 },
      { id: 2, title: 'Đọc phần tóm tắt tác phẩm và ghi 3 ý chính ra giấy', duration: 5 },
      { id: 3, title: 'Lập dàn ý sơ bộ cho câu hỏi phân tích (3 luận điểm chính)', duration: 10 },
      { id: 4, title: 'Viết đoạn mở bài + 1 luận điểm hoàn chỉnh', duration: 15 },
    ];
  }

  if (subjectLower.includes('ly') || subjectLower.includes('lý') || subjectLower.includes('vat')) {
    return [
      { id: 1, title: 'Mở SGK và đọc tên chương/bài cần ôn trong 2 phút', duration: 2 },
      { id: 2, title: 'Ghi lại 3-5 công thức quan trọng nhất của chương vào vở nháp', duration: 5 },
      { id: 3, title: 'Làm 4 câu trắc nghiệm lý thuyết từ đề cương ôn tập', duration: 10 },
      { id: 4, title: 'Giải 1 bài toán Vật Lý áp dụng công thức đã ghi', duration: 15 },
    ];
  }

  if (subjectLower.includes('hoa') || subjectLower.includes('hóa')) {
    return [
      { id: 1, title: 'Mở vở và ghi tên phản ứng/chương cần ôn trong 2 phút', duration: 2 },
      { id: 2, title: 'Ôn lại bảng PTHH và tính chất hóa học của chất cần học', duration: 5 },
      { id: 3, title: 'Cân bằng 3 phương trình hóa học trong đề cương', duration: 10 },
      { id: 4, title: 'Giải 1 bài toán tính khối lượng/mol theo PTHH', duration: 15 },
    ];
  }

  // Default fallback
  return [
    { id: 1, title: `Mở tài liệu "${goal.slice(0, 35)}" và đọc lướt qua trong 2 phút`, duration: 2 },
    { id: 2, title: 'Ghi 3 ý chính cần nắm vào giấy nháp', duration: 5 },
    { id: 3, title: 'Làm 3-5 câu bài tập từ đề cương hoặc SGK', duration: 10 },
    { id: 4, title: 'Tự kiểm tra lại bằng cách nhắm mắt nhớ lại kiến thức', duration: 10 },
  ];
}
