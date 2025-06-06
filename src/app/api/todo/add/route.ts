import { NextRequest, NextResponse } from 'next/server';
import { ErrorResponseBody } from '@/types/api';
import { createAdminClient } from '@/libs/supabase/server';

interface PostTodoResponseBody {
  title: string;
  dueDate?: string;
}

export async function POST(request: NextRequest) {
  const { title, dueDate, priority } = await request.json();

  if (!(title && dueDate && priority)) {
    return NextResponse.json<ErrorResponseBody>(
      { message: '제목, 마감일, 우선순위를 모두 입력해주세요.' },
      { status: 400 },
    );
  }

  const supabase = await createAdminClient(); // TODO : 로그인 로직 이후에 인증된 사용자로 변경
  const { error } = await supabase.from('todo').insert({
    title,
    dueDate,
    priority,
  });
  if (error) {
    console.log('Error inserting todo:', error);
    return NextResponse.json<ErrorResponseBody>(
      { message: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json<PostTodoResponseBody>(
    { title, dueDate },
    { status: 201 },
  );
}
