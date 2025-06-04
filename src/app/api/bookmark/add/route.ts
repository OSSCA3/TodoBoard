import { NextRequest, NextResponse } from 'next/server';
import { ErrorResponseBody } from '@/types/api';

interface PostBookmarkResponseBody {
  url: string;
  title: string;
}

export async function POST(request: NextRequest) {
  const { url, title } = await request.json();

  if (!(url && title)) {
    return NextResponse.json<ErrorResponseBody>(
      { message: 'URL과 제목을 모두 입력해주세요' },
      { status: 400 },
    );
  }

  // TODO : 북마크를 db에 저장하는 로직 추가
  return NextResponse.json<PostBookmarkResponseBody>(
    { url, title },
    { status: 201 },
  );
}
