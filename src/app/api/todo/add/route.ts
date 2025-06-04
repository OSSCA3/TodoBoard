import { NextRequest, NextResponse } from 'next/server';
import { ErrorResponseBody } from '@/types/api';

interface PostTodoResponseBody {
  title: string;
  deadline?: string;
}

export async function POST(request: NextRequest) {
  const { title, deadline } = await request.json();

  if (!title) {
    return NextResponse.json<ErrorResponseBody>(
      { message: '제목을 입력해주세요' },
      { status: 400 },
    );
  }

  // TODO : 할 일을 db에 저장하는 로직 추가
  return NextResponse.json<PostTodoResponseBody>(
    { title, deadline },
    { status: 201 },
  );
}
