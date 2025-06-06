import { NextRequest, NextResponse } from 'next/server';
import { ErrorResponseBody } from '@/types/api';
import { createAdminClient } from '@/libs/supabase/server';
import { TABLE_NAME } from '@/constants/supabase';

interface PostBookmarkResponseBody {
  url: string;
  title: string;
}

export async function POST(request: NextRequest) {
  try {
    const { url, title } = await request.json();

    if (!(url && title)) {
      return NextResponse.json<ErrorResponseBody>(
        { message: 'URL과 제목을 모두 입력해주세요' },
        { status: 400 },
      );
    }

    const supabase = await createAdminClient(); // TODO : 로그인 로직 이후에 인증된 사용자로 변경
    await supabase.from(TABLE_NAME.BOOKMARK).insert({
      id: crypto.randomUUID(),
      url,
      title,
    });

    return NextResponse.json<PostBookmarkResponseBody>(
      { url, title },
      { status: 201 },
    );
  } catch (error) {
    console.error('북마크 추가 실패', error);

    return NextResponse.json<ErrorResponseBody>(
      { message: '북마크를 추가하는 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
