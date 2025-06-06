import { NextRequest, NextResponse } from 'next/server';
import { TABLE_NAME } from '@/constants/supabase';
import { ErrorResponseBody } from '@/types/api';
import { createAdminClient } from '@/libs/supabase/server';

interface PostMemoResponseBody {
  title: string;
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const { title, content } = await request.json();

    if (!(title && content)) {
      return NextResponse.json<ErrorResponseBody>(
        { message: '제목과 내용을 모두 입력해주세요' },
        { status: 400 },
      );
    }

    const supabase = await createAdminClient(); // TODO : 로그인 로직 이후에 인증된 사용자로 변경
    await supabase.from(TABLE_NAME.MEMO).insert({
      id: crypto.randomUUID(),
      title,
      content,
    });

    return NextResponse.json<PostMemoResponseBody>(
      { title, content },
      { status: 201 },
    );
  } catch (error) {
    console.error('메모 추가 실패', error);

    return NextResponse.json<ErrorResponseBody>(
      { message: '메모를 추가하는 중 오류가 발생했습니다.' },
      { status: 500 },
    );
  }
}
