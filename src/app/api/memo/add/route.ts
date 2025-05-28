import { NextRequest, NextResponse } from 'next/server';
import { ErrorResponseBody } from '@/types/api';

interface PostMemoResponseBody {
  title: string;
  content: string;
}

export async function POST(request: NextRequest) {
  const { title, content } = await request.json();

  if (!(title && content)) {
    return NextResponse.json<ErrorResponseBody>(
      { message: '제목과 내용을 모두 입력해주세요' },
      { status: 400 },
    );
  }

  // TODO : 메모를 db에 저장하는 로직 추가
  return NextResponse.json<PostMemoResponseBody>(
    { title, content },
    { status: 201 },
  );
}
